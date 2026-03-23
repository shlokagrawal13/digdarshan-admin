import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const navLinks = [
        { path: '/admin/add-news', label: 'Add News' },
        { path: '/admin/list-news', label: 'List News' },
        { path: '/admin/subscriptions', label: 'Subscriptions' },
        { path: '/admin/manage-admins', label: 'Manage Admins' },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close menu when route changes
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <nav className="sticky top-4 z-50 mx-4 md:mx-auto max-w-5xl mb-8 relative">
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-panel px-6 py-4 flex justify-between items-center z-50 relative"
            >
                {/* Logo Area */}
                <div className="flex items-center gap-3">
                    <img src="/logo512.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
                    <span className="font-bold text-lg text-textmain tracking-wide">
                        Digdarshan
                    </span>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button 
                    onClick={toggleMobileMenu}
                    className="md:hidden neu-button-mini p-2 text-textmain flex items-center justify-center focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex flex-wrap justify-center gap-2 space-x-2">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive ? 'shadow-neu-pressed bg-background border border-transparent text-primary drop-shadow-sm' : 'hover:shadow-neu-sm text-textmain/80 hover:text-textmain border border-transparent hover:border-white/40'}`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Action (Logout) */}
                <button
                    onClick={handleLogout}
                    className="hidden md:block neu-button-mini px-4 py-2 text-sm text-danger font-medium hover:text-red-700"
                >
                    Logout
                </button>
            </motion.div>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute md:hidden top-full left-0 right-0 mt-3 glass-panel p-4 flex flex-col gap-3 shadow-neu z-40"
                    >
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link 
                                    key={link.path} 
                                    to={link.path} 
                                    className={`px-4 py-3 rounded-xl text-sm font-medium text-center transition-all duration-300 ${isActive ? 'shadow-neu-pressed bg-background border border-transparent text-primary drop-shadow-sm' : 'shadow-neu-sm text-textmain/80 border border-transparent active:border-white/40'}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="h-px bg-white/20 my-1 w-full" />
                        <button
                            onClick={handleLogout}
                            className="neu-button-mini w-full px-4 py-3 text-sm text-danger font-medium"
                        >
                            Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default AdminNavbar;