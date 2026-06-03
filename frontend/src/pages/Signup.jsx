import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    address: '',
    role: 'user' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      
      const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('userRole', loginRes.data.user.role);
      
      if (loginRes.data.user.role === 'owner') {
        navigate('/owner');
      } else {
        navigate('/user');
      }

    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Join Roxiler to start rating or managing stores
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-pulse">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Account Type</label>
            <select 
              name="role" 
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white"
            >
              <option value="user">Normal User (Rate Stores)</option>
              <option value="owner">Store Owner (Manage Stores)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" name="name" required placeholder="Dhruv Thakar"
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" name="email" required placeholder="dhruv@example.com"
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input 
              type="password" name="password" required placeholder="••••••••"
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">City / Address</label>
            <input 
              type="text" name="address" required placeholder="Surat, Gujarat"
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white"
            />
          </div>
          
          <button 
            type="submit" disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Signup;