import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsList = () => {
    const categories = [
        'national',
        'international',
        'business',
        'sports',
        'entertainment',
        'state',
        'madhyapradesh',
        'chhattisgarh',
        'otherstates',
        'uttarpradesh',
        'horoscope',
        'technology',
        'health',
        'education',
        'lifestyle'
    ];
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [newsList, setNewsList] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            setError('');
            try {
                const response = await axios.get(`/api/news/${selectedCategory}`);
                setNewsList(response.data.posts);
            } catch (err) {
                setError('Error fetching news articles.');
                console.error('Error fetching news:', err);
            }
        };
        fetchNews();
    }, [selectedCategory]);

    const handleDeleteNews = async (newsId) => {
        setMessage('');
        setError('');
        try {
            await axios.delete(`/api/news/${selectedCategory}/${newsId}`);
            setMessage('News article deleted successfully!');
            // Refresh news list after deletion
            
            const response = await axios.get(`/api/news/${selectedCategory}`);
            setNewsList(response.data.posts);
        } catch (err) {
            setError('Error deleting news article.');
            console.error('Error deleting news:', err);
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <div className="p-4 max-w-full mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel - List News</h2>
            {message && <p className="text-green-500 mb-2 text-center">{message}</p>}
            {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

            <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Select Category:</label>
                <select
                    id="category"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsList.map((newsItem, index) => (
                            <tr key={newsItem._id} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
                                <td className="px-4 py-4 whitespace-nowrap">{newsItem.title}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{newsItem.category}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{new Date(newsItem.date).toLocaleDateString()}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDeleteNews(newsItem._id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {newsList.length === 0 && (
                            <tr>
                                <td className="px-4 py-4 whitespace-nowrap text-center" colSpan="4">No news articles found in this category.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewsList;