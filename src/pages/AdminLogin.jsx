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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {isSignup ? 'Admin Registration' : 'Admin Login'}
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 text-white p-3 rounded mb-4">
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
              className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {isSignup && (
            <textarea
              placeholder="Why do you need admin access?"
              value={adminReason}
              onChange={(e) => setAdminReason(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
          )}          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white p-3 rounded font-semibold transition duration-200
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                {isSignup ? 'Submitting...' : 'Logging in...'}
              </div>
            ) : (
              isSignup ? 'Request Admin Access' : 'Login'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
              setSuccess('');
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            {isSignup ? 'Already have admin access? Login' : 'Need admin access? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
