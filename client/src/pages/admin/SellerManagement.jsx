import { useEffect, useState } from 'react';
import api from '../../services/api';

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [prospectiveSellers, setProspectiveSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProspective, setLoadingProspective] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState({});
  const [activeTab, setActiveTab] = useState('management'); // 'management' or 'approvals'

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/sellers');
      setSellers(response.data);
      setError('');
    } catch (err) {
      console.error('Fetch sellers error', err);
      setError('Unable to load sellers right now.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProspectiveSellers = async () => {
    try {
      setLoadingProspective(true);
      const response = await api.get('/admin/prospective-sellers');
      setProspectiveSellers(response.data);
      setError('');
    } catch (err) {
      console.error('Fetch prospective sellers error', err);
      setError('Unable to load prospective sellers right now.');
    } finally {
      setLoadingProspective(false);
    }
  };

  useEffect(() => {
    fetchSellers();
    fetchProspectiveSellers();
  }, []);

  const updateStatus = async (profileId, status) => {
    try {
      const note = notes[profileId]?.trim();
      const response = await api.put(`/admin/sellers/${profileId}/status`, { status, note });
      setSellers((prev) =>
        prev.map((profile) =>
          profile._id === profileId ? response.data : profile
        )
      );
      setNotes((prev) => ({ ...prev, [profileId]: '' }));
    } catch (err) {
      console.error('Update seller status error', err);
      setError('Unable to update seller status.');
    }
  };

  const handleApproveSeller = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: 'Seller' });
      
      // Update local state to reflect the change
      setProspectiveSellers(prev => 
        prev.filter(seller => seller._id !== userId)
      );
      
      // Optionally show a success message
      alert('Seller approved successfully!');
    } catch (err) {
      console.error('Error approving seller:', err);
      alert('Failed to approve seller. Please try again.');
    }
  };

  const handleRejectSeller = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: 'Buyer' }); // Revert to buyer
      
      // Update local state to reflect the change
      setProspectiveSellers(prev => 
        prev.filter(seller => seller._id !== userId)
      );
      
      alert('Seller application rejected and user reverted to buyer role.');
    } catch (err) {
      console.error('Error rejecting seller:', err);
      alert('Failed to reject seller. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Seller Management</h2>
          <p className="text-sm text-slate-500">Manage seller accounts and applications.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('management')}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'management'
                ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Seller Management
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              activeTab === 'approvals'
                ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Seller Approvals
          </button>
          <button
            onClick={() => {
              fetchSellers();
              fetchProspectiveSellers();
            }}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'management' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,0.8fr)] gap-4 p-4 border-b border-slate-100 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span>Seller</span>
            <span>Shop</span>
            <span>Status</span>
            <span>Admin Note</span>
            <span>Updated</span>
          </div>
          <div className="divide-y divide-slate-100">
            {loading && (
              <div className="p-4 text-sm text-slate-500">Loading sellers...</div>
            )}
            {!loading && sellers.map((profile) => (
              <div key={profile._id} className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,0.8fr)] gap-4 p-4 items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{profile.seller?.name || 'Seller'}</p>
                  <p className="text-xs text-slate-500">{profile.seller?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{profile.shopName || 'Shop'}</p>
                  <p className="text-xs text-slate-500">Slug: {profile.slug || 'n/a'}</p>
                </div>
                <div>
                  <select
                    value={profile.status}
                    onChange={(event) => updateStatus(profile._id, event.target.value)}
                    className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={notes[profile._id] || ''}
                    onChange={(event) => setNotes((prev) => ({ ...prev, [profile._id]: event.target.value }))}
                    placeholder="Add note (optional)"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <button
                    onClick={() => updateStatus(profile._id, profile.status)}
                    className="self-start rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Save note
                  </button>
                  {profile.statusNotes?.length ? (
                    <p className="text-[11px] text-slate-400">
                      Last: {profile.statusNotes[profile.statusNotes.length - 1]?.note || 'No note'}
                    </p>
                  ) : null}
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(profile.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {!loading && !sellers.length && (
              <div className="p-4 text-sm text-slate-500">No seller profiles yet.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {prospectiveSellers.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="text-slate-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No pending seller applications</h3>
              <p className="text-slate-500">There are no seller applications awaiting approval.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Seller Info
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Application Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {prospectiveSellers.map((seller) => (
                    <tr key={seller._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <span className="text-emerald-800 font-medium">
                                {seller.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{seller.name}</div>
                            <div className="text-sm text-slate-500">ID: {seller._id?.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{seller.email}</div>
                        <div className="text-sm text-slate-500">
                          {seller.sellerProfile?.contactPhone || 'No phone provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleApproveSeller(seller._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectSeller(seller._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Seller Approval Process</h3>
          <p className="text-sm text-blue-700">
            Sellers with ProspectiveSeller role must be approved by an admin to become full sellers. 
            You can approve qualified sellers or reject applications that don't meet marketplace standards.
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerManagement;