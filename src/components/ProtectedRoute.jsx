import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token with backend
        
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/admin/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setIsAuthenticated(response.data.success);
        if (!response.data.success) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }} catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the attempted URL to redirect back after login
    localStorage.setItem('intendedPath', location.pathname);
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
