import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [fetchError, setFetchError] = useState('');
  
  const [reviewModal, setReviewModal] = useState({ isOpen: false, storeId: null, storeName: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 0, reviewText: '', verifiedVisit: false });
  const [submitStatus, setSubmitStatus] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'user') {
      navigate('/login');
      return;
    }

    fetchStoresData(token);
  }, [navigate]);

  const fetchStoresData = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/users/stores', config);
      setStores(res.data);
      setIsLoading(false);
    } catch (err) {
      setFetchError('Failed to load stores.');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const openReviewModal = (store) => {
    setReviewModal({ isOpen: true, storeId: store.id, storeName: store.name });
    setReviewForm({ rating: 0, reviewText: '', verifiedVisit: false });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      setSubmitStatus({ type: 'error', text: 'Please select a star rating.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post('http://localhost:5000/api/users/ratings', {
        storeId: reviewModal.storeId,
        rating: reviewForm.rating,
        reviewText: reviewForm.reviewText,
        verifiedVisit: reviewForm.verifiedVisit
      }, config);
      
      setReviewModal({ isOpen: false, storeId: null, storeName: '' });
      fetchStoresData(token);
      
      setSubmitStatus({ type: 'success', text: 'Review published successfully!' });
      setTimeout(() => setSubmitStatus({ type: '', text: '' }), 4000);
    } catch (err) {
      setSubmitStatus({ type: 'error', text: 'Failed to submit review.' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            ROXILER<span className="text-emerald-500">EXPLORE</span>
          </h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogout}
              className="text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Local Businesses</h2>
            <p className="text-slate-500 mt-2 text-lg">Discover and review places in your area.</p>
          </div>
        </div>

        {fetchError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700 font-medium">{fetchError}</p>
          </div>
        )}

        {submitStatus.text && (
          <div className={`mb-6 p-4 rounded-md shadow-sm transition-all flex items-center ${submitStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            <p className="text-sm font-semibold">{submitStatus.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.length > 0 ? (
            stores.map((store) => (
              <div key={store.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="h-32 bg-slate-800 relative">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{store.name}</h3>
                    <div className="flex items-center bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      <svg className="w-4 h-4 text-emerald-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="font-bold text-emerald-700">{store.average_rating > 0 ? store.average_rating : 'New'}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center mb-6">
                    <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {store.address}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">{store.total_reviews} {store.total_reviews === '1' ? 'Review' : 'Reviews'}</span>
                    <button 
                      onClick={() => openReviewModal(store)}
                      className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Stores Found</h3>
              <p className="text-slate-500">Check back later when owners have registered their businesses.</p>
            </div>
          )}
        </div>
      </main>

      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Review {reviewModal.storeName}</h3>
              <button 
                onClick={() => setReviewModal({ isOpen: false, storeId: null, storeName: '' })}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitReview} className="p-6">
              <div className="mb-6 text-center">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Overall Rating</p>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${reviewForm.rating >= star ? 'bg-emerald-100 text-emerald-500 scale-110 shadow-sm' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}
                    >
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Share details of your own experience at this place</label>
                <textarea 
                  rows="4"
                  value={reviewForm.reviewText}
                  onChange={(e) => setReviewForm({...reviewForm, reviewText: e.target.value})}
                  placeholder="What did you like or dislike? How was the service?"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                ></textarea>
              </div>

              <div className="mb-8">
                <label className="flex items-center space-x-3 cursor-pointer bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <input 
                    type="checkbox"
                    checked={reviewForm.verifiedVisit}
                    onChange={(e) => setReviewForm({...reviewForm, verifiedVisit: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <span className="block text-sm font-bold text-slate-900">I verify that I visited this location</span>
                    <span className="block text-xs text-slate-500">Helps others trust your review.</span>
                  </div>
                </label>
              </div>

              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setReviewModal({ isOpen: false, storeId: null, storeName: '' })}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;