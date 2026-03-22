import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { FiSearch, FiX } from 'react-icons/fi';

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
      setSubscriptions(response.data.subscriptions);
      setError(null);
    } catch (err) {
      setError('Failed to fetch subscriptions');
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
    sub.newspaperName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.contactPerson.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key === columnKey) {
      return <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>;
    }
    return null;
  };

  const SubscriptionDetailsModal = ({ subscription, onClose }) => {
    if (!subscription) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Subscription Details</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Main Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-4 text-blue-600">Basic Information</h4>
                <div className="space-y-3">
                  <p><span className="font-medium">Date & Time:</span> {format(new Date(subscription.dateTime), 'PPpp')}</p>
                  <p><span className="font-medium">Newspaper Name:</span> {subscription.newspaperName}</p>
                  <p><span className="font-medium">Name:</span> {subscription.firstName} {subscription.lastName}</p>
                  <p><span className="font-medium">Email:</span> {subscription.email}</p>
                  <p><span className="font-medium">Phone:</span> {subscription.phone}</p>
                  <p><span className="font-medium">Designation:</span> {subscription.designation || '-'}</p>
                  <p><span className="font-medium">Website:</span> {subscription.website || '-'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4 text-blue-600">Publication Details</h4>
                <div className="space-y-3">
                  <p><span className="font-medium">Frequency:</span> {subscription.frequency}</p>
                  <p><span className="font-medium">Circulation:</span> {subscription.circulation}</p>
                  <p><span className="font-medium">RNI Number:</span> {subscription.rniNo || '-'}</p>
                  <p><span className="font-medium">ABC Certificate:</span> {subscription.abcCertificate || '-'}</p>
                </div>
              </div>
            </div>

            {/* Address & Purpose Section */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-lg mb-4 text-blue-600">Service Details</h4>
              <div className="space-y-3">
                <p><span className="font-medium">Service Address:</span></p>
                <p className="ml-4 whitespace-pre-wrap">{subscription.serviceAddress}</p>
                <p><span className="font-medium">Purpose:</span></p>
                <p className="ml-4 whitespace-pre-wrap">{subscription.purpose}</p>
              </div>
            </div>

            {/* Contact Person Section */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-lg mb-4 text-blue-600">Contact Person Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p><span className="font-medium">Name:</span> {subscription.contactPerson.firstName} {subscription.contactPerson.lastName}</p>
                  <p><span className="font-medium">Designation:</span> {subscription.contactPerson.designation}</p>
                </div>
                <div className="space-y-3">
                  <p><span className="font-medium">Email:</span> {subscription.contactPerson.email}</p>
                  <p><span className="font-medium">Phone:</span> {subscription.contactPerson.phone}</p>
                </div>
              </div>
            </div>

            {/* Timestamps Section */}
            <div className="border-t flex justify-between items-center pt-6 text-sm text-gray-500">
              <p>Created: {format(new Date(subscription.createdAt), 'PPpp')}</p>
              <p>Last Updated: {format(new Date(subscription.updatedAt), 'PPpp')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button 
          onClick={fetchSubscriptions}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by newspaper, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th onClick={() => handleSort('dateTime')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time <SortIcon columnKey="dateTime" />
              </th>
              <th onClick={() => handleSort('newspaperName')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Newspaper <SortIcon columnKey="newspaperName" />
              </th>
              <th onClick={() => handleSort('firstName')} className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscriber <SortIcon columnKey="firstName" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((subscription, index) => (
              <tr key={subscription._id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(subscription.dateTime), 'PP')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {subscription.newspaperName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {`${subscription.firstName} ${subscription.lastName}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>Email: {subscription.email}</div>
                  <div>Phone: {subscription.phone}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>Frequency: {subscription.frequency}</div>
                  <div>Circulation: {subscription.circulation}</div>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <button
                    onClick={() => {
                      setSelectedSubscription(subscription);
                      setShowDetailsModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredSubscriptions.length)} of {filteredSubscriptions.length} entries
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <SubscriptionDetailsModal
          subscription={selectedSubscription}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSubscription(null);
          }}
        />
      )}
    </div>
  );
};

export default ViewSubscriptions;
