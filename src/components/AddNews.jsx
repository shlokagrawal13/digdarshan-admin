import React, { useState } from 'react';
import axios from 'axios';

const AddNews = () => {
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
    const [newsTitle, setNewsTitle] = useState('');
    const [newsBody, setNewsBody] = useState('');
    const [newsImage, setNewsImage] = useState(null); // Store File object
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleTitleChange = (e) => {
        setNewsTitle(e.target.value);
    };

    const handleBodyChange = (e) => {
        setNewsBody(e.target.value);
    };

    const handleImageChange = (e) => {
        setNewsImage(e.target.files[0]); // Get the File object
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const formData = new FormData(); // Use FormData to send files
        formData.append('category', selectedCategory);
        formData.append('title', newsTitle);
        formData.append('body', newsBody);
        if (newsImage) {
            formData.append('image', newsImage); // Append the File object
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/news/${selectedCategory}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // Add this to ensure proper data handling
                transformRequest: [function (data) {
                    return data;
                }],
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
            setError(err.message || 'Failed to create news article.');
            console.error('Error creating news article:', err);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel - Add News</h2>
            {message && <p className="text-green-500 mb-2 text-center">{message}</p>}
            {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
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
                <div>
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                    <input
                        type="text"
                        id="title"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="News Title"
                        value={newsTitle}
                        onChange={handleTitleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2">Body:</label>
                    <textarea
                        id="body"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="News Body"
                        value={newsBody}
                        onChange={handleBodyChange}
                        required
                        rows="5"
                    />
                </div>
                <div>
                    <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                    <input
                        type="file" // Change input type to file
                        id="image"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={handleImageChange}
                    />
                </div>
                <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Add News
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNews;