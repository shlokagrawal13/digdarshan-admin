import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import AdminNavbar from './components/AdminNavbar';
import NewsList from './components/NewsList';
import AddNews from './components/AddNews';
import ViewSubscriptions from './pages/ViewSubscriptions';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import AdminManagement from './pages/AdminManagement';
import AutoPublishPage from './pages/admin/AutoPublishPage';

function App() {    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Protected Admin Routes */}
                <Route path="/admin/*" element={
                    <ProtectedRoute>
                        <div>
                            <AdminNavbar />
                            <div className="container mx-auto mt-8">
                                <Routes>
                                    <Route path="/add-news" element={<AddNews />} />
                                    <Route path="/list-news" element={<NewsList />} />
                                    <Route path="/subscriptions" element={<ViewSubscriptions />} />
                                    <Route path="/manage-admins" element={<AdminManagement />} />
                                    <Route path="/auto-publish" element={<AutoPublishPage />} />
                                    <Route path="/" element={<Navigate to="/admin/add-news" replace />} />
                                </Routes>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />
                
                {/* Redirect root to admin login */}
                <Route path="/" element={<Navigate to="/admin/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;