import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [fetchError, setFetchError] = useState('');

  const [activeTab, setActiveTab] = useState('overview');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'admin') {
      navigate('/login');
      return; 
    }

    const fetchAdminData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const [usersRes, storesRes, ratingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', config),
          axios.get('http://localhost:5000/api/admin/stores', config),
          axios.get('http://localhost:5000/api/admin/ratings/count', config)
        ]);

        setUsers(usersRes.data);
        setStores(storesRes.data);
        setTotalRatings(ratingsRes.data.total || 0);
        setIsLoading(false);
      } catch (err) {
        setFetchError('Failed to load dashboard data.');
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (type === 'user') {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, config);
        setUsers(users.filter(user => user.id !== id));
      } else if (type === 'store') {
        await axios.delete(`http://localhost:5000/api/admin/stores/${id}`, config);
        setStores(stores.filter(store => store.id !== id));
      }
    } catch (err) {
      setFetchError(`Failed to delete ${type}.`);
    }
    
    setDeleteModal({ isOpen: false, type: null, id: null });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative">
      
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex shadow-xl">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-wider">ROXILER<span className="text-indigo-400">ADMIN</span></h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Manage Users
          </button>
          <button 
            onClick={() => setActiveTab('stores')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'stores' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Manage Stores
          </button>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 text-center">Roxiler Systems © 2026</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        
        <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-slate-800">Admin Control Panel</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">System Admin</span>
            <button 
              onClick={handleLogout}
              className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors px-3 py-2 rounded-md hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="p-8 overflow-auto">
          
          {fetchError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-pulse">
              <p className="text-sm text-red-700 font-medium">{fetchError}</p>
            </div>
          )}
          
          {(activeTab === 'overview') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('users')}>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('stores')}>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Stores</p>
                  <p className="text-2xl font-bold text-slate-900">{stores.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Ratings</p>
                  <p className="text-2xl font-bold text-slate-900">{totalRatings}</p>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'overview' || activeTab === 'users') && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Registered Users</h3>
                {activeTab === 'overview' && (
                  <button onClick={() => setActiveTab('users')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                      <th className="px-6 py-3 font-medium">ID</th>
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Email</th>
                      <th className="px-6 py-3 font-medium">Role</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600">{user.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : user.role === 'owner' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, type: 'user', id: user.id })}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === 'overview' || activeTab === 'stores') && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Registered Stores</h3>
                {activeTab === 'overview' && (
                  <button onClick={() => setActiveTab('stores')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                      <th className="px-6 py-3 font-medium">ID</th>
                      <th className="px-6 py-3 font-medium">Store Name</th>
                      <th className="px-6 py-3 font-medium">Address</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stores.length > 0 ? (
                      stores.map((store) => (
                        <tr key={store.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-600">{store.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{store.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{store.address}</td>
                          <td className="px-6 py-4 text-sm text-right">
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, type: 'store', id: store.id })}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-500">
                          No stores registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all scale-100 border border-slate-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-6 mx-auto">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-center text-slate-500 mb-8">
              Are you sure you want to delete this {deleteModal.type}? This action cannot be undone and will permanently remove the data from our servers.
            </p>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, type: null, id: null })}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;