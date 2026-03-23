import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const NewsList = () => {
    const categories = [
        'national', 'international', 'business', 'sports', 'entertainment',
        'state', 'madhyapradesh', 'chhattisgarh', 'otherstates', 'uttarpradesh',
        'horoscope', 'technology', 'health', 'education', 'lifestyle'
    ];
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [newsList, setNewsList] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            setError('');
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL || ''}/api/news/${selectedCategory}`);
                const fetchedPosts = response.data?.posts || (Array.isArray(response.data) ? response.data : []);
                setNewsList(fetchedPosts);
            } catch (err) {
                const backendError = err.response?.data?.message || err.response?.data?.error || 'Error fetching news articles.';
                setError(backendError);
                console.error('Error fetching news:', err);
            }
        };
        fetchNews();
    }, [selectedCategory]);

    const handleDeleteNews = async (newsId) => {
        setMessage('');
        setError('');
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL || ''}/api/news/${selectedCategory}/${newsId}`);
            setMessage('News article deleted successfully!');
            
            const response = await axios.get(`${process.env.REACT_APP_API_URL || ''}/api/news/${selectedCategory}`);
            const fetchedPosts = response.data?.posts || (Array.isArray(response.data) ? response.data : []);
            setNewsList(fetchedPosts);
        } catch (err) {
            const backendError = err.response?.data?.message || err.response?.data?.error || 'Error deleting news article.';
            setError(backendError);
            console.error('Error deleting news:', err);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 md:p-8 max-w-7xl mx-auto w-full"
        >
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-textmain tracking-tight">Article Library</h2>
                    <p className="text-sm font-medium text-textmain/60 mt-1 uppercase tracking-wider">Manage Published News</p>
                </div>
                
                <div className="w-full md:w-64">
                    <label htmlFor="category" className="block text-textmain/80 text-xs font-semibold ml-1 mb-1.5 uppercase tracking-wider">Filter by Category</label>
                    <div className="relative">
                        <select
                            id="category"
                            className="neu-input appearance-none cursor-pointer py-2.5"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-textmain/60">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {message && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-primary/20 text-emerald-800 p-4 rounded-xl mb-6 text-sm font-medium shadow-neu-pressed flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {message}
                    </motion.div>
                )}
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-danger/20 text-red-800 p-4 rounded-xl mb-6 text-sm font-medium shadow-neu-pressed flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="neu-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/40 shadow-neu-sm bg-white/10">
                                <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                            {Array.isArray(newsList) && newsList.map((newsItem, index) => (
                                <motion.tr 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={newsItem?._id || index} 
                                    className="hover:bg-white/30 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-textmain/90 max-w-sm truncate">{newsItem?.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textmain/70">
                                        <span className="px-3 py-1 bg-white/40 shadow-neu-pressed-sm rounded-full text-xs font-semibold text-textmain/80 capitalize">
                                            {newsItem?.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textmain/70">{newsItem?.date ? new Date(newsItem.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => handleDeleteNews(newsItem?._id)}
                                            className="neu-button-mini text-danger hover:text-red-700 ml-auto"
                                            title="Delete Article"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                            {(!Array.isArray(newsList) || newsList.length === 0) && (
                                <tr>
                                    <td className="px-6 py-12 whitespace-nowrap text-center text-textmain/50 font-medium" colSpan="4">
                                        No news articles published in this category yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default NewsList;