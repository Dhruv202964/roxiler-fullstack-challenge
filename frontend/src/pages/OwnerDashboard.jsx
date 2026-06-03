import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [fetchError, setFetchError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [detailsPanel, setDetailsPanel] = useState({ isOpen: false, store: null, reviews: [], isLoading: false });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'owner') {
      navigate('/login');
      return; 
    }

    const fetchStores = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/owner/stores', config);
        setStores(res.data);
        setIsLoading(false);
      } catch (err) {
        setFetchError('Failed to load your portfolio.');
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post('http://localhost:5000/api/owner/stores', formData, config);
      
      setStores([res.data, ...stores]);
      setFormData({ name: '', address: '', email: '' });
      setIsSubmitting(false);
      setIsModalOpen(false);
      showNotification('Business added to your portfolio!', 'success');
    } catch (err) {
      showNotification('Failed to create store.', 'error');
      setIsSubmitting(false);
    }
  };

  const openStoreDetails = async (store) => {
    setDetailsPanel({ isOpen: true, store, reviews: [], isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`http://localhost:5000/api/owner/stores/${store.id}/reviews`, config);
      setDetailsPanel({ isOpen: true, store, reviews: res.data, isLoading: false });
    } catch (err) {
      showNotification('Failed to load reviews.', 'error');
      setDetailsPanel(prev => ({ ...prev, isLoading: false }));
    }
  };

  const totalReviews = stores.reduce((acc, store) => acc + parseInt(store.total_reviews || 0), 0);
  const avgPortfolioRating = stores.length > 0 
    ? (stores.reduce((acc, store) => acc + parseFloat(store.average_rating || 0), 0) / stores.filter(s => s.average_rating > 0).length || 0).toFixed(1)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            ROXILER<span className="text-blue-600">BUSINESS</span>
          </h1>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center text-sm font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Partner Portal
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm font-bold text-slate-600 hover:text-red-600 transition-colors bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {notification.show && (
        <div className="fixed top-20 right-8 z-50 animate-fade-in-down">
          <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portfolio Overview</h2>
            <p className="text-slate-500 mt-2 text-lg">Manage your locations and track customer satisfaction.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Business
          </button>
        </div>

        {fetchError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700 font-medium">{fetchError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Locations</p>
            <h3 className="text-4xl font-black text-slate-900">{stores.length}</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Reviews</p>
            <h3 className="text-4xl font-black text-slate-900">{totalReviews}</h3>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Avg Rating</p>
            <div className="flex items-center">
              <h3 className="text-4xl font-black text-slate-900 mr-3">{avgPortfolioRating}</h3>
              <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Your Properties</h3>
          <span className="text-sm text-slate-500">Click a card to view customer reviews</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stores.length > 0 ? (
            stores.map((store) => (
              <div 
                key={store.id} 
                onClick={() => openStoreDetails(store)}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{store.name}</h3>
                  <p className="text-sm text-slate-500 flex items-center mb-1">
                    <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {store.address}
                  </p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 min-w-[140px] text-center group-hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-2xl font-bold text-slate-900 mr-1">{store.average_rating > 0 ? store.average_rating : '-'}</span>
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{store.total_reviews} Reviews</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Businesses Yet</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">Get started by adding your first location to start collecting reviews.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-blue-600 font-bold hover:text-blue-700 hover:underline"
              >
                + Add your first business
              </button>
            </div>
          )}
        </div>
      </main>

      {detailsPanel.isOpen && detailsPanel.store && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slide-in-right">
            
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{detailsPanel.store.name}</h2>
                <p className="text-slate-500 text-sm mt-1">{detailsPanel.store.address}</p>
              </div>
              <button 
                onClick={() => setDetailsPanel({ isOpen: false, store: null, reviews: [], isLoading: false })}
                className="bg-white border border-slate-200 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:shadow-sm transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Customer Reviews</h3>
              
              {detailsPanel.isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : detailsPanel.reviews.length > 0 ? (
                <div className="space-y-4">
                  {detailsPanel.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-slate-900 flex items-center">
                            {review.reviewer_name}
                            {review.verified_visit && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                Verified Visit
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex bg-yellow-50 px-2 py-1 rounded-lg">
                          {[...Array(review.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                        </div>
                      </div>
                      {review.review_text && (
                        <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                          "{review.review_text}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No Reviews Yet</h3>
                  <p className="text-slate-500 text-sm">Customers haven't left any reviews for this location.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Register New Location</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateStore} className="p-6">
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Business Name</label>
                  <input 
                    type="text" name="name" required placeholder="e.g., Madras Cafe"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input 
                    type="email" name="email" required placeholder="contact@business.com"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Physical Address</label>
                  <input 
                    type="text" name="address" required placeholder="e.g., Surat, Gujarat"
                    value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
                >
                  {isSubmitting ? 'Registering...' : 'Add Business'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;