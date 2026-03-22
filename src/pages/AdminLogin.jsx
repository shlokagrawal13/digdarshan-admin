import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/add-news');
    }
  }, [navigate]);  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/admin/login`, { 
        email, 
        password
      });
      
      const { token, user } = res.data;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      
      setSuccess('Login successful! Redirecting...');
      
      // Short delay to show success message
      setTimeout(() => {
        const intendedPath = localStorage.getItem('intendedPath') || '/admin/add-news';
        navigate(intendedPath);
        localStorage.removeItem('intendedPath');
      }, 1000);    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/admin/register`, {
        name,
        email,
        password,
        adminReason
      });

      setSuccess(res.data.message);
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setAdminReason('');
      
      // Switch to login view after short delay
      setTimeout(() => {
        setIsSignup(false);
      }, 2000);    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 w-full max-w-md">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <img 
             src="/logo512.png" 
             alt="Digdarshan Logo" 
             className="w-20 h-20 object-contain mb-5" 
          />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-center">
            Digdarshan
          </h1>
          <h2 className="text-xs font-semibold text-slate-500 mt-1 text-center uppercase tracking-widest">
            Admin Portal
          </h2>
        </div>

        <h3 className="text-xl font-semibold text-slate-700 mb-6 text-center">
          {isSignup ? 'Request Access' : 'Sign In'}
        </h3>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg mb-6 text-sm text-center font-medium border border-emerald-100">
            {success}
          </div>
        )}

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400"
            required
          />

          {isSignup && (
            <textarea
              placeholder="Reason for requesting access?"
              value={adminReason}
              onChange={(e) => setAdminReason(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-slate-400"
              rows="3"
              required
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl font-semibold shadow-sm transition-all duration-200
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                {isSignup ? 'Submitting...' : 'Verifying...'}
              </div>
            ) : (
              isSignup ? 'Submit Request' : 'Login'
            )}
          </button>
        </form>

        {/* Footer Toggles */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setSuccess('');
            }}
            className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"
          >
            {isSignup ? 'Already have an account? Sign In' : 'Need access? Apply here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
