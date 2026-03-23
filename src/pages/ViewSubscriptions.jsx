import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ViewSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'dateTime', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/subscriptions`);
      setSubscriptions(response.data.subscriptions || []);
      setError(null);
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data?.error || 'Failed to fetch subscriptions';
      setError(backendError);
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSubscriptions = React.useMemo(() => {
    let sortedItems = [...subscriptions];
    if (sortConfig.key) {
      sortedItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedItems;
  }, [subscriptions, sortConfig]);

  const filteredSubscriptions = sortedSubscriptions.filter(sub => 
    sub.newspaperName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.contactPerson?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key === columnKey) {
      return <span className="text-primary ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    }
    return null;
  };

  const SubscriptionDetailsModal = ({ subscription, onClose }) => {
    if (!subscription) return null;

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-textmain/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="neu-card w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="bg-background/80 backdrop-blur-md p-6 border-b border-white/40 flex justify-between items-center shadow-neu-sm z-10">
            <h3 className="text-2xl font-bold text-textmain tracking-tight">Subscription Details</h3>
            <button onClick={onClose} className="p-2 text-textmain/50 hover:text-danger hover:bg-white/40 rounded-full transition-colors">
              <FiX size={24} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/20 p-5 rounded-2xl shadow-neu-pressed-sm border border-white/40">
                <h4 className="font-semibold text-lg mb-4 text-primary tracking-wide">Basic Information</h4>
                <div className="space-y-3 text-sm">
                  <p><span className="font-semibold text-textmain/80 mr-2">Date & Time:</span> {format(new Date(subscription.dateTime), 'PPpp')}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">Newspaper Name:</span> {subscription.newspaperName}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">Name:</span> {subscription.firstName} {subscription.lastName}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">Email:</span> {subscription.email}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">Phone:</span> {subscription.phone}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">Designation:</span> {subscription.designation || '-'}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">Website:</span> {subscription.website || '-'}</p>
                </div>
              </div>

              <div className="bg-white/20 p-5 rounded-2xl shadow-neu-pressed-sm border border-white/40">
                <h4 className="font-semibold text-lg mb-4 text-primary tracking-wide">Publication Details</h4>
                <div className="space-y-3 text-sm">
                  <p><span className="font-semibold text-textmain/80 mr-2">Frequency:</span> {subscription.frequency}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">Circulation:</span> {subscription.circulation}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">RNI Number:</span> {subscription.rniNo || '-'}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">ABC Certificate:</span> {subscription.abcCertificate || '-'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white/20 p-5 rounded-2xl shadow-neu-pressed-sm border border-white/40">
              <h4 className="font-semibold text-lg mb-4 text-primary tracking-wide">Service Details</h4>
              <div className="space-y-4 text-sm">
                <div>
                    <span className="font-semibold text-textmain/80 block mb-1">Service Address:</span>
                    <p className="ml-2 whitespace-pre-wrap text-textmain/90 leading-relaxed bg-white/30 p-3 rounded-xl shadow-neu-pressed-sm">{subscription.serviceAddress}</p>
                </div>
                <div>
                    <span className="font-semibold text-textmain/80 block mb-1">Purpose:</span>
                    <p className="ml-2 whitespace-pre-wrap text-textmain/90 leading-relaxed bg-white/30 p-3 rounded-xl shadow-neu-pressed-sm">{subscription.purpose}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white/20 p-5 rounded-2xl shadow-neu-pressed-sm border border-white/40">
              <h4 className="font-semibold text-lg mb-4 text-primary tracking-wide">Contact Person</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <p><span className="font-semibold text-textmain/80 mr-2">Name:</span> {subscription.contactPerson?.firstName} {subscription.contactPerson?.lastName}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">Designation:</span> {subscription.contactPerson?.designation}</p>
                </div>
                <div className="space-y-3">
                  <p><span className="font-semibold text-textmain/80 mr-2">Email:</span> {subscription.contactPerson?.email}</p>
                  <p><span className="font-semibold text-textmain/80 mr-2">Phone:</span> {subscription.contactPerson?.phone}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/40 flex justify-between items-center text-xs text-textmain/50 font-medium tracking-wide px-2">
              <p>Created: {format(new Date(subscription.createdAt), 'PPpp')}</p>
              <p>Updated: {format(new Date(subscription.updatedAt), 'PPpp')}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-12 neu-card max-w-md mx-auto">
        <p className="text-danger font-medium mb-4">{error}</p>
        <button onClick={fetchSubscriptions} className="neu-button-primary">Retry fetching</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 md:p-8 max-w-7xl mx-auto w-full"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-textmain tracking-tight">Subscriptions</h1>
            <p className="text-sm font-medium text-textmain/60 mt-1 uppercase tracking-wider">Manage Enquiries & Requests</p>
        </div>
        
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search name, email, newspaper..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input pl-11"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textmain/40 w-5 h-5" />
        </div>
      </div>

      <div className="neu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/40 shadow-neu-sm bg-white/10">
                <th onClick={() => handleSort('dateTime')} className="cursor-pointer px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider hover:text-primary transition-colors">
                  Date & Time <SortIcon columnKey="dateTime" />
                </th>
                <th onClick={() => handleSort('newspaperName')} className="cursor-pointer px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider hover:text-primary transition-colors">
                  Newspaper <SortIcon columnKey="newspaperName" />
                </th>
                <th onClick={() => handleSort('firstName')} className="cursor-pointer px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider hover:text-primary transition-colors">
                  Subscriber <SortIcon columnKey="firstName" />
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {currentItems.map((subscription, index) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  key={subscription._id || index} 
                  className="hover:bg-white/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textmain/90">
                    {format(new Date(subscription.dateTime), 'PP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textmain/90">
                    {subscription.newspaperName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textmain/70">
                    {`${subscription.firstName} ${subscription.lastName}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textmain/70 space-y-1">
                    <div className="truncate max-w-[150px]" title={subscription.email}>{subscription.email}</div>
                    <div>{subscription.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textmain/70 space-y-1">
                    <div><span className="font-semibold text-textmain/60">Freq:</span> <span className="capitalize">{subscription.frequency}</span></div>
                    <div><span className="font-semibold text-textmain/60">Circ:</span> {subscription.circulation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setSelectedSubscription(subscription);
                        setShowDetailsModal(true);
                      }}
                      className="neu-button-mini text-primary hover:text-emerald-700 ml-auto border-transparent hover:border-white/40"
                    >
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                    <td className="px-6 py-12 whitespace-nowrap text-center text-textmain/50 font-medium" colSpan="6">
                        No subscriptions found matching the criteria.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 px-2">
        <span className="text-sm font-medium text-textmain/60 bg-white/40 px-4 py-2 rounded-xl shadow-neu-pressed-sm border border-white/50">
          Showing <span className="text-textmain/90">{indexOfFirstItem + 1}</span> to <span className="text-textmain/90">{Math.min(indexOfLastItem, filteredSubscriptions.length)}</span> of <span className="text-textmain/90">{filteredSubscriptions.length}</span> entries
        </span>
        <div className="flex space-x-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentPage === 1
                ? 'bg-transparent text-textmain/30 cursor-not-allowed border border-transparent'
                : 'neu-button text-textmain/80'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              currentPage === totalPages || totalPages === 0
                ? 'bg-transparent text-textmain/30 cursor-not-allowed border border-transparent'
                : 'neu-button text-textmain/80'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDetailsModal && (
          <SubscriptionDetailsModal
            subscription={selectedSubscription}
            onClose={() => {
              setShowDetailsModal(false);
              setTimeout(() => setSelectedSubscription(null), 300);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ViewSubscriptions;
