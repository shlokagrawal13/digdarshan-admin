import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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
      
      setPendingAdmins(response.data.pending || []);
      setApprovedAdmins(response.data.approved || []);
      const revoked = response.data.revoked || (response.data.allUsers ? response.data.allUsers.filter(u => u.role === 'admin' && !u.isAdmin && !u.adminApproved) : []);
      setRevokedAdmins(revoked);
    } catch (err) {
      const backendError = err.response?.data?.message || err.response?.data?.error || 'Failed to fetch admin users';
      setError(backendError);
    }
  };

  const handleRevoke = async (userId) => {
    if (loadingRevoke === userId) return;
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
    if (loadingReapprove === userId) return;
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

  const TableHeader = ({ title }) => (
    <div className="mb-4">
      <h2 className="text-xl font-bold text-textmain">{title}</h2>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 md:p-8 max-w-7xl mx-auto w-full"
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-textmain tracking-tight">Admin Management</h1>
        <p className="text-sm font-medium text-textmain/60 mt-1 uppercase tracking-wider">Manage access & permissions</p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-danger/20 text-red-800 p-4 rounded-xl mb-6 text-sm font-medium shadow-neu-pressed flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-primary/20 text-emerald-800 p-4 rounded-xl mb-6 text-sm font-medium shadow-neu-pressed flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-10">
        {/* Pending Admins Section */}
        <section>
          <TableHeader title="Pending Admin Requests" />
          <div className="bg-blue-100/50 border border-blue-200/50 text-blue-800 px-5 py-4 rounded-xl shadow-neu-sm mb-6 text-sm font-medium">
            Admin approvals are now handled through email. The owner will receive an email when a new admin verifies their email address.
          </div>
          
          {pendingAdmins.length === 0 ? (
            <div className="neu-card p-8 text-center text-textmain/50 font-medium">No pending admin requests</div>
          ) : (
            <div className="neu-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/40 shadow-neu-sm bg-white/10">
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {pendingAdmins.map((admin, index) => (
                      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} key={admin._id} className="hover:bg-white/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textmain/90">{admin.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-textmain/70">{admin.email}</td>
                        <td className="px-6 py-4 text-sm text-textmain/70 max-w-xs truncate">{admin.adminReason}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100/80 text-yellow-800 shadow-neu-pressed-sm border border-yellow-200">
                            Pending Owner Approval
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Approved Admins Section */}
        <section>
          <TableHeader title="Approved Admins" />
          {approvedAdmins.length === 0 ? (
            <div className="neu-card p-8 text-center text-textmain/50 font-medium">No approved admins</div>
          ) : (
            <div className="neu-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/40 shadow-neu-sm bg-white/10">
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Approved By</th>
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Approved At</th>
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {approvedAdmins.map((admin, index) => (
                      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} key={admin._id} className="hover:bg-white/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textmain/90">{admin.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-textmain/70">{admin.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-textmain/70">
                          <span className="px-3 py-1 bg-white/40 shadow-neu-pressed-sm rounded-full text-xs font-semibold text-textmain/80">
                            {admin.approvedBy?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-textmain/70">
                          {new Date(admin.approvedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleRevoke(admin._id)}
                            className={`neu-button-mini text-danger hover:text-red-700 ml-auto px-4 ${loadingRevoke === admin._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loadingRevoke === admin._id}
                          >
                            {loadingRevoke === admin._id ? 'Revoking...' : 'Revoke Access'}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Revoked Admins Section */}
        <section>
          <TableHeader title="Revoked Admins" />
          {revokedAdmins.length === 0 ? (
            <div className="neu-card p-8 text-center text-textmain/50 font-medium">No revoked admins</div>
          ) : (
            <div className="neu-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/40 shadow-neu-sm bg-white/10">
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-textmain/70 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {revokedAdmins.map((admin, index) => (
                      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} key={admin._id} className="hover:bg-white/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-textmain/90">{admin.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-textmain/70">{admin.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleReapprove(admin._id)}
                            className={`neu-button-mini text-primary border-primary/30 hover:border-primary/60 ml-auto px-4 ${loadingReapprove === admin._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loadingReapprove === admin._id}
                          >
                            {loadingReapprove === admin._id ? 'Revalidating...' : 'Restore Access'}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

export default AdminManagement;