import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
  }, [navigate]);

  const handleLogin = async (e) => {
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
      }, 1000);
    } catch (err) {
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
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="neu-card p-10 w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 neu-card rounded-full mb-6 flex items-center justify-center bg-white/20"
          >
            <img 
               src="/logo512.png" 
               alt="Digdarshan" 
               className="w-16 h-16 object-contain drop-shadow-md" 
            />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-textmain">
            Digdarshan
          </h1>
          <h2 className="text-xs font-semibold text-textmain/60 mt-2 uppercase tracking-[0.2em]">
            Admin Portal
          </h2>
        </div>

        <h3 className="text-xl font-medium text-textmain/80 mb-6 text-center">
          {isSignup ? 'Request Access' : 'Welcome Back'}
        </h3>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-danger/20 text-red-800 p-3 rounded-xl mb-6 text-sm text-center font-medium shadow-neu-pressed-sm border border-danger/30"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary/20 text-emerald-800 p-3 rounded-xl mb-6 text-sm text-center font-medium shadow-neu-pressed-sm border border-primary/30"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-5">
          <AnimatePresence>
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="neu-input"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neu-input"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neu-input"
              required
            />
          </div>

          <AnimatePresence>
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <textarea
                  placeholder="Reason for requesting access?"
                  value={adminReason}
                  onChange={(e) => setAdminReason(e.target.value)}
                  className="neu-input min-h-[100px] resize-y"
                  rows="3"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed neu-button' : 'neu-button-primary'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-emerald-800 rounded-full animate-spin mr-2"></div>
                {isSignup ? 'Submitting...' : 'Verifying...'}
              </div>
            ) : (
              isSignup ? 'Submit Request' : 'Sign In'
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
            className="text-textmain/60 hover:text-textmain text-sm font-medium transition-colors"
          >
            {isSignup ? 'Already have an account? Sign In' : 'Need access? Apply here'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
