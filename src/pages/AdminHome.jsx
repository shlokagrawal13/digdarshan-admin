import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';

// 🎯 Ye HeaderNews component sirf ek baar sabse upar dikhega
const HeaderNews = ({ apiUrls }) => {
  const [recentNews, setRecentNews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        let allNews = [];
        for (const apiUrl of apiUrls) {
          const response = await axios.get(apiUrl);
          if (response.data && Array.isArray(response.data)) {
            allNews = [...allNews, ...response.data.slice(0, 3)]; // Har API se top 3 articles
          }
        }
        setRecentNews(allNews);
      } catch (error) {
        console.error("Failed to fetch news", error);
      }
    };
    fetchNews();
  }, [apiUrls]);

  useEffect(() => {
    if (recentNews.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % recentNews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [recentNews, isHovered]);

  return (
    <div className="container mx-auto p-4">
      {/* 🟥 Breaking News Header */}
      <div className="bg-red-600 text-white text-lg font-bold p-3 text-center overflow-hidden">
        <h2 className="text-xl mb-1"> 📰 Breaking News </h2>
        <motion.div
          className="whitespace-nowrap inline-block"
          animate={{ x: ["100vw", "-100vw"] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          {recentNews.map((news, index) => (
            <span key={index} className="mx-4">
              {news.title} 
            </span>
          ))}
        </motion.div>
      </div>

      {/* 🟦 Main Slider */}
      <div className="relative w-full h-80 overflow-hidden rounded-lg shadow-lg mt-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full flex">
          <AnimatePresence mode="sync">
            {recentNews.map((news, index) =>
              index === currentSlide ? (
                <motion.div
                  key={index}
                  className="absolute inset-0 w-full h-full"
                  initial={{ x: "100%" }}
                  animate={{ x: "0%" }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                    <h2 className="text-xl font-bold">{news.title}</h2>
                    <p className="text-sm mt-1">{news.body.slice(0, 100)}...</p>
                    <Link to="/news-detail" className="text-blue-400 mt-2 inline-block">Read More</Link>
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
        <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg" onClick={() => setCurrentSlide((prev) => (prev - 1 + recentNews.length) % recentNews.length)}>
          ◀
        </button>
        <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg" onClick={() => setCurrentSlide((prev) => (prev + 1) % recentNews.length)}>
          ▶
        </button>
      </div>
    </div>
  );
};

// 🎯 Category News Component - Sirf Category ka News Show Karega
const NewsCategory = ({ title, apiUrl }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (response.data && Array.isArray(response.data)) {
          setNews(response.data.slice(0, 6)); // Display only 6 articles
        } else {
          setError("Invalid news data format.");
        }
      } catch (error) {
        setError("Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [apiUrl]);

  if (loading) return <p className="text-center text-blue-500">Loading {title} news...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">{title}</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {news.map((article, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-lg bg-white">
            <img
              src={article.image || "https://via.placeholder.com/300"}
              alt="News"
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-bold">{article.title}</h3>
            <p className="text-sm text-gray-600">{article.body?.substring(0, 100) || "No content available"}...</p>
            <a
              href={article.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            >
              Read More →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🎯 Home Page Component
const AdminHome = () => {
  const apiUrls = [
    "https://jsonplaceholder.typicode.com/posts",
    "https://jsonplaceholder.typicode.com/posts",
    "https://jsonplaceholder.typicode.com/posts",
  ];

  return (
    <>
      <HeaderNews apiUrls={apiUrls} />
      <NewsCategory title="राष्ट्रीय" apiUrl="https://jsonplaceholder.typicode.com/posts" />
      <NewsCategory title="अंतरराष्ट्रीय" apiUrl="https://jsonplaceholder.typicode.com/posts" />
      <NewsCategory title="मध्यप्रदेश" apiUrl="https://jsonplaceholder.typicode.com/posts" />
      <NewsCategory title="उत्तरप्रदेश" apiUrl="https://jsonplaceholder.typicode.com/posts" />
      <NewsCategory title="छत्तीसगढ़" apiUrl="https://jsonplaceholder.typicode.com/posts" />
      <NewsCategory title="अन्य राज्य" apiUrl="https://jsonplaceholder.typicode.com/posts" />
      <NewsCategory title="बॉलीवुड/ मनोरंजन" apiUrl="https://jsonplaceholder.typicode.com/posts" />
    </>
  );
};

export default AdminHome;
