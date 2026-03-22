import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminManagement = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [revokedAdmins, setRevokedAdmins] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingRevoke, setLoadingRevoke] = useState(null);
  const [loadingReapprove, setLoadingReapprove] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/admin/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPendingAdmins(response.data.pending);
      setApprovedAdmins(response.data.approved);
      // Find revoked admins: isAdmin === false && adminApproved === false && role === 'admin'
      const revoked = response.data.revoked || (response.data.allUsers ? response.data.allUsers.filter(u => u.role === 'admin' && !u.isAdmin && !u.adminApproved) : []);
      setRevokedAdmins(revoked);
    } catch (err) {
      setError('Failed to fetch admin users');
    }
  };

  const handleRevoke = async (userId) => {
    if (loadingRevoke === userId) return; // Prevent double click
    setError('');
    setSuccess('');
    setLoadingRevoke(userId);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/admin/revoke/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Admin access revoked successfully');
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to revoke admin access');
    } finally {
      setLoadingRevoke(null);
    }
  };

  const handleReapprove = async (userId) => {
    if (loadingReapprove === userId) return; // Prevent double click
    setError('');
    setSuccess('');
    setLoadingReapprove(userId);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/admin/reapprove/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Admin access restored successfully');
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to restore admin access');
    } finally {
      setLoadingReapprove(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Pending Admins Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Pending Admin Requests</h2>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
          Admin approvals are now handled through email. The owner will receive an email when a new admin verifies their email address.
        </div>
        {pendingAdmins.length === 0 ? (
          <p className="text-gray-500">No pending admin requests</p>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingAdmins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                    <td className="px-6 py-4">{admin.adminReason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending Owner Approval
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approved Admins Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Approved Admins</h2>
        {approvedAdmins.length === 0 ? (
          <p className="text-gray-500">No approved admins</p>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Approved At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvedAdmins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.approvedBy?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(admin.approvedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleRevoke(admin._id)}
                        className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${loadingRevoke === admin._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loadingRevoke === admin._id}
                      >
                        {loadingRevoke === admin._id ? 'Revoking...' : 'Revoke Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Revoked Admins Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Revoked Admins</h2>
        {revokedAdmins.length === 0 ? (
          <p className="text-gray-500">No revoked admins</p>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revokedAdmins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleReapprove(admin._id)}
                        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${loadingReapprove === admin._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loadingReapprove === admin._id}
                      >
                        {loadingReapprove === admin._id ? 'Re-approving...' : 'Re-Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;