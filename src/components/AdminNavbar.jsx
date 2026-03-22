import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/admin/add-news" className="text-white hover:text-gray-300">
                        Add News
                    </Link>
                    <Link to="/admin/list-news" className="text-white hover:text-gray-300">
                        List News
                    </Link>
                    <Link to="/admin/subscriptions" className="text-white hover:text-gray-300">
                        Subscriptions
                    </Link>
                    <Link to="/admin/manage-admins" className="text-white hover:text-gray-300">
                        Manage Admins
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-300"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;