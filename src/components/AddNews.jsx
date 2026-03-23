import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AddNews = () => {
    const categories = [
        'national', 'international', 'business', 'sports', 'entertainment',
        'state', 'madhyapradesh', 'chhattisgarh', 'otherstates', 'uttarpradesh',
        'horoscope', 'technology', 'health', 'education', 'lifestyle'
    ];
    
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [newsTitle, setNewsTitle] = useState('');
    const [newsBody, setNewsBody] = useState('');
    const [newsImage, setNewsImage] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('category', selectedCategory);
        formData.append('title', newsTitle);
        formData.append('body', newsBody);
        if (newsImage) {
            formData.append('image', newsImage);
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/news/${selectedCategory}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: [(data) => data],
            });

            if (response.data && response.data.success) {
                setMessage('News article created successfully!');
                setNewsTitle('');
                setNewsBody('');
                setNewsImage(null);
                const fileInput = document.getElementById('image');
                if (fileInput) fileInput.value = '';
            } else {
                throw new Error(response.data.message || 'Failed to create news');
            }
        } catch (err) {
            const backendError = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create news article.';
            setError(backendError);
            console.error('Error creating news article:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 max-w-2xl mx-auto w-full"
        >
            <div className="neu-card p-8 md:p-10">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-textmain tracking-tight">Post New Article</h2>
                    <p className="text-sm font-medium text-textmain/60 mt-2 uppercase tracking-wider">Content Management</p>
                </div>

                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-primary/20 text-emerald-800 p-4 rounded-xl mb-6 text-sm text-center font-medium shadow-neu-pressed flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            {message}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-danger/20 text-red-800 p-4 rounded-xl mb-6 text-sm text-center font-medium shadow-neu-pressed flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label htmlFor="category" className="block text-textmain/80 text-sm font-semibold ml-1">Category</label>
                        <div className="relative">
                            <select
                                id="category"
                                className="neu-input appearance-none cursor-pointer"
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

                    <div className="space-y-1.5">
                        <label htmlFor="title" className="block text-textmain/80 text-sm font-semibold ml-1">Title</label>
                        <input
                            type="text"
                            id="title"
                            className="neu-input"
                            placeholder="Enter the news headline"
                            value={newsTitle}
                            onChange={(e) => setNewsTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="body" className="block text-textmain/80 text-sm font-semibold ml-1">Article Body</label>
                        <textarea
                            id="body"
                            className="neu-input min-h-[160px] resize-y py-4 leading-relaxed"
                            placeholder="Write the full news content here..."
                            value={newsBody}
                            onChange={(e) => setNewsBody(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="image" className="block text-textmain/80 text-sm font-semibold ml-1">Featured Image</label>
                        <div className="relative neu-input bg-transparent overflow-hidden px-0 py-0 flex flex-col items-center shadow-none border-0 group">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={(e) => setNewsImage(e.target.files[0])}
                            />
                            <div className="w-full flex items-center justify-between px-4 py-3 bg-background shadow-neu-pressed rounded-xl border border-transparent group-hover:bg-white/10 transition-colors">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-3 text-textmain/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span className="text-textmain/70 text-sm truncate max-w-[200px] md:max-w-xs block">
                                        {newsImage ? newsImage.name : 'Choose an image (Optional)'}
                                    </span>
                                </div>
                                {newsImage && (
                                    <button 
                                        type="button" 
                                        className="relative z-20 text-xs text-danger font-medium bg-red-100/50 hover:bg-red-200/80 px-2 py-1 rounded-md transition-colors border border-red-200/50"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setNewsImage(null);
                                            const fileInput = document.getElementById('image');
                                            if (fileInput) fileInput.value = '';
                                        }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Image Preview Area */}
                        <AnimatePresence>
                            {newsImage && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="overflow-hidden flex justify-center"
                                >
                                    <div className="relative p-2 neu-card inline-block border border-white/40">
                                        <img 
                                            src={URL.createObjectURL(newsImage)} 
                                            alt="Preview" 
                                            className="w-full max-w-[240px] md:max-w-[300px] h-auto rounded-lg object-cover shadow-sm"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="pt-4">
                        <button 
                            className={`w-full ${isSubmitting ? 'neu-button opacity-70' : 'neu-button-primary'}`} 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Article'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default AddNews;