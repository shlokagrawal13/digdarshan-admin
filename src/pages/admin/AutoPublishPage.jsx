import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlay, FiSquare, FiSettings, FiShare2, FiImage, FiFileText, FiZap, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const AutoPublishPage = () => {
    const [settings, setSettings] = useState(null);
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('settings');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isManualRunning, setIsManualRunning] = useState(false);

    // Fetch initial data
    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/auto-publish/settings', { withCredentials: true });
            setSettings(res.data);
            setIsLoading(false);
        } catch (error) {
            toast.error('Failed to load settings');
            setIsLoading(false);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await axios.get('/api/auto-publish/logs', { withCredentials: true });
            setLogs(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchSettings();
        fetchLogs();
    }, []);

    // Polling when running or publishing
    useEffect(() => {
        if (!settings?.isRunning && !settings?.isPublishing) return;
        const interval = setInterval(() => {
            fetchSettings();
            fetchLogs();
            if (isManualRunning && !settings?.isPublishing) {
                setIsManualRunning(false); // Disable manual running state once publishing is done natively
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [settings?.isRunning, settings?.isPublishing, isManualRunning]);

    const toggleScheduler = async () => {
        setIsSaving(true);
        try {
            const endpoint = settings.isRunning ? '/stop' : '/start';
            const res = await axios.post(`/api/auto-publish${endpoint}`, {}, { withCredentials: true });
            setSettings(res.data.settings);
            toast.success(res.data.message);
        } catch (error) {
            toast.error('Failed to toggle scheduler');
        }
        setIsSaving(false);
    };

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            const res = await axios.put('/api/auto-publish/settings', settings, { withCredentials: true });
            setSettings(res.data);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
        setIsSaving(false);
    };

    const runManualBatch = async () => {
        setIsManualRunning(true);
        try {
            await axios.post('/api/auto-publish/run-now', {}, { withCredentials: true });
            toast.info('⚡ Job initiated in background. Publishing started.');
            setTimeout(() => {
                fetchSettings(); // Update isPublishing status
                fetchLogs();
            }, 1000);
        } catch (error) {
            toast.error('Failed to start manual batch');
            setIsManualRunning(false);
        }
    };

    if (isLoading || !settings) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const TABS = [
        { id: 'settings', label: 'Settings', icon: <FiSettings /> },
        { id: 'social', label: 'Social Media', icon: <FiShare2 /> },
        { id: 'images', label: 'Images', icon: <FiImage /> },
        { id: 'logs', label: 'Logs', icon: <FiFileText /> },
    ];

    const INTERVALS = [
        { value: '0 * * * *', label: '1 Hour' },
        { value: '0 */2 * * *', label: '2 Hours' },
        { value: '0 */4 * * *', label: '4 Hours' },
        { value: '0 */6 * * *', label: '6 Hours' },
        { value: '0 */12 * * *', label: '12 Hours' },
        { value: '0 0 * * *', label: '24 Hours' },
    ];

    const CATEGORIES = [
        { id: 'national', label: 'राष्ट्रीय' },
        { id: 'international', label: 'अंतरराष्ट्रीय' },
        { id: 'state', label: 'राज्य' },
        { id: 'uttarpradesh', label: 'उत्तर प्रदेश' },
        { id: 'madhyapradesh', label: 'मध्य प्रदेश' },
        { id: 'chhattisgarh', label: 'छत्तीसगढ़' },
        { id: 'otherstates', label: 'अन्य राज्य' },
        { id: 'sports', label: 'खेल' },
        { id: 'entertainment', label: 'मनोरंजन' },
        { id: 'business', label: 'व्यापार' },
        { id: 'technology', label: 'तकनीक' },
        { id: 'education', label: 'शिक्षा' },
        { id: 'health', label: 'स्वास्थ्य' },
        { id: 'lifestyle', label: 'लाइफस्टाइल' },
        { id: 'horoscope', label: 'राशिफल' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl mx-auto pb-12"
        >
            {/* Header Section */}
            <div className="glass-panel p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-textmain flex items-center gap-3">
                            <span className="text-4xl">🤖</span> AI Auto Publisher
                        </h1>
                        <p className="text-textmain/70 mt-2 font-medium">Fully automated news harvesting & publishing system</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleScheduler}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-neu transition-all duration-300 border border-white/50 ${
                                settings.isRunning 
                                ? 'bg-danger/20 text-red-800 hover:bg-danger/30 hover:shadow-neu-sm active:shadow-neu-pressed' 
                                : 'bg-primary/20 text-emerald-800 hover:bg-primary/30 hover:shadow-neu-sm active:shadow-neu-pressed'
                            }`}
                        >
                            {settings.isRunning ? <FiSquare /> : <FiPlay />}
                            {settings.isRunning ? 'Stop Automation' : 'Start Automation'}
                        </button>

                        <button 
                            onClick={runManualBatch}
                            disabled={settings?.isPublishing || isManualRunning}
                            className={`flex items-center gap-2 px-6 py-3 bg-yellow-400/20 text-yellow-800 border border-white/60 rounded-xl font-medium shadow-neu transition-all duration-300 ${settings?.isPublishing || isManualRunning ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-neu-sm active:shadow-neu-pressed'}`}
                        >
                            {settings?.isPublishing ? (
                                <><div className="w-4 h-4 rounded-full border-2 border-yellow-800 border-t-transparent animate-spin"></div> Publishing...</>
                            ) : (
                                <><FiZap /> Abhi Publish Karo</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/40">
                    <div className="neu-card px-4 py-2 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${settings.isRunning ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`}></div>
                        <span className="font-semibold">{settings.isRunning ? 'Running' : 'Stopped'}</span>
                    </div>
                    <div className="neu-card px-4 py-2">
                        <span className="text-sm opacity-70">Interval:</span> 
                        <span className="font-semibold ml-2">{INTERVALS.find(i => i.value === settings.interval)?.label || settings.interval}</span>
                    </div>
                    <div className="neu-card px-4 py-2">
                        <span className="text-sm opacity-70">Batch Size:</span> 
                        <span className="font-semibold ml-2">{settings.newsPerBatch} News</span>
                    </div>
                    {settings.lastRun && (
                        <div className="neu-card px-4 py-2">
                            <span className="text-sm opacity-70">Last Run:</span> 
                            <span className="font-semibold ml-2">{new Date(settings.lastRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex gap-8">
                {/* Sidebar Navigation */}
                <div className="w-64 flex-shrink-0">
                    <div className="glass-panel p-4 flex flex-col gap-3 sticky top-6">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                                    activeTab === tab.id 
                                    ? 'bg-primary/20 shadow-neu-pressed border-white/60 text-emerald-800' 
                                    : 'hover:bg-white/40'
                                }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-grow">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="glass-panel p-8"
                        >
                            {/* SETTINGS TAB */}
                            {activeTab === 'settings' && (
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-bold mb-6">Execution Settings</h2>
                                    
                                    <div>
                                        <label className="block font-semibold mb-3">Cron Interval</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {INTERVALS.map(int => (
                                                <button
                                                    key={int.value}
                                                    onClick={() => setSettings({...settings, interval: int.value})}
                                                    className={`py-3 rounded-xl border font-medium transition-all duration-300 ${
                                                        settings.interval === int.value
                                                        ? 'bg-primary/20 border-white/60 shadow-neu-pressed text-emerald-800'
                                                        : 'bg-background border-white/50 shadow-neu hover:shadow-neu-sm'
                                                    }`}
                                                >
                                                    {int.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-semibold mb-3 flex justify-between">
                                            <span>News Per Batch</span>
                                            <span>{settings.newsPerBatch}</span>
                                        </label>
                                        <input 
                                            type="range" 
                                            min="1" max="10" 
                                            value={settings.newsPerBatch}
                                            onChange={(e) => setSettings({...settings, newsPerBatch: parseInt(e.target.value)})}
                                            className="w-full accent-primary h-2 bg-white/40 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold mb-3">AI Model Selection</label>
                                        <select 
                                            value={settings.aiModel || 'gemini-2.5-flash'}
                                            onChange={(e) => setSettings({...settings, aiModel: e.target.value})}
                                            className="w-full py-3 px-4 rounded-xl border bg-background border-white/50 shadow-neu font-medium outline-none"
                                        >
                                            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest)</option>
                                            <option value="gemini-3.0-flash">Gemini 3.0 Flash (Next Gen)</option>
                                            <option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro (Advanced)</option>
                                        </select>
                                        <p className="text-xs opacity-70 mt-2">Choose the generative AI model to rewrite the news.</p>
                                    </div>

                                    <div>
                                        <label className="block font-semibold mb-3">Target Categories (Hindi)</label>
                                        <div className="flex flex-wrap gap-3">
                                            {CATEGORIES.map(cat => {
                                                const isSelected = settings.categories.includes(cat.id);
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => {
                                                            let newCats = [...settings.categories];
                                                            if (isSelected && newCats.length > 1) {
                                                                newCats = newCats.filter(c => c !== cat.id);
                                                            } else if (!isSelected) {
                                                                newCats.push(cat.id);
                                                            }
                                                            setSettings({...settings, categories: newCats});
                                                        }}
                                                        className={`px-5 py-2 rounded-xl border font-medium transition-all ${
                                                            isSelected 
                                                            ? 'bg-primary/20 shadow-neu-pressed border-white/60 text-emerald-800'
                                                            : 'bg-background shadow-neu border-white/50 hover:shadow-neu-sm'
                                                        }`}
                                                    >
                                                        {cat.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/30 text-right">
                                        <button onClick={saveSettings} disabled={isSaving} className="neu-button-primary">
                                            {isSaving ? 'Saving...' : 'Save Settings'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* SOCIAL MEDIA TAB */}
                            {activeTab === 'social' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Social Media Broadcasting</h2>
                                    <p className="opacity-70 mb-8">Generated posts will be automatically shared to these active platforms.</p>
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        {[
                                            { id: 'telegram', name: 'Telegram', color: 'border-blue-400' },
                                            { id: 'facebook', name: 'Facebook', color: 'border-blue-700' },
                                            { id: 'instagram', name: 'Instagram', color: 'border-pink-500' },
                                            { id: 'twitter', name: 'Twitter / X', color: 'border-slate-800' }
                                        ].map(platform => (
                                            <div key={platform.id} className={`neu-card p-6 border-l-4 ${platform.color} relative`}>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-xl font-bold capitalize">{platform.name}</h3>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={settings.platforms[platform.id]}
                                                            onChange={() => setSettings({
                                                                ...settings, 
                                                                platforms: { ...settings.platforms, [platform.id]: !settings.platforms[platform.id] }
                                                            })}
                                                        />
                                                        <div className="w-11 h-6 bg-white/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
                                                    </label>
                                                </div>
                                                <p className="text-sm opacity-70">Make sure API keys are present in backend <code>.env</code> file.</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 text-right">
                                        <button onClick={saveSettings} disabled={isSaving} className="neu-button-primary">
                                            {isSaving ? 'Saving...' : 'Save Settings'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* IMAGES TAB */}
                            {activeTab === 'images' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Image Processing</h2>
                                    <p className="opacity-70 mb-8">The AI will automatically fetch relevant images from Pexels/Unsplash and process them via Cloudinary.</p>
                                    
                                    <div className="neu-card p-6 mb-6">
                                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><FiImage/> Output Formats</h3>
                                        <ul className="space-y-2 list-disc list-inside opacity-80">
                                            <li><strong>News Card (1200x630)</strong>: Used for website thumbnails and OpenGraph metadata.</li>
                                            <li><strong>Social Square (1080x1080)</strong>: Used for Facebook and Instagram posts.</li>
                                        </ul>
                                    </div>

                                    <div className="neu-card p-6">
                                        <h3 className="font-bold text-lg mb-3">Watermark Settings</h3>
                                        <p className="opacity-80 mb-4 text-sm">To set a custom logo, upload an image exactly named <code>logo.png</code> into the <code>backend/assets/</code> directory.</p>
                                        <div className="w-full h-32 bg-gray-300 rounded-xl relative overflow-hidden flex items-center justify-center">
                                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <span className="text-gray-500 font-medium">Auto-generated Bottom Gradient</span>
                                            <div className="absolute bottom-2 right-4 bg-white/20 p-2 rounded backdrop-blur">
                                                <span className="text-white font-bold text-xs opacity-85">YOUR LOGO HERE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* LOGS TAB */}
                            {activeTab === 'logs' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Execution Logs</h2>
                                        <button onClick={fetchLogs} className="neu-button-mini">Refresh Logs</button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {logs.length === 0 ? (
                                            <div className="text-center p-8 opacity-50">No logs generated yet.</div>
                                        ) : (
                                            logs.map((log, i) => (
                                                <div key={i} className="neu-card p-5">
                                                    <div className="flex justify-between items-center border-b border-white/20 pb-3 mb-3">
                                                        <span className="font-semibold text-sm">{new Date(log.timestamp).toLocaleString()}</span>
                                                        <div className="flex gap-4">
                                                            <span className="text-emerald-600 flex items-center gap-1"><FiCheckCircle/> {log.publishedCount} Published</span>
                                                            <span className="text-red-500 flex items-center gap-1"><FiXCircle/> {log.failedCount} Failed</span>
                                                        </div>
                                                    </div>
                                                    {log.details && log.details.length > 0 && (
                                                        <ul className="space-y-2">
                                                            {log.details.map((det, j) => (
                                                                <li key={j} className="text-sm flex justify-between items-center bg-white/20 px-3 py-2 rounded-lg">
                                                                    <span className="truncate max-w-[70%]">{det.title}</span>
                                                                    <span className={det.status === 'Success' ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'} title={det.error}>
                                                                        {det.status}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default AutoPublishPage;
