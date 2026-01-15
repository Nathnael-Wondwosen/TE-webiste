import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';

const SellerApprovals = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [prospectiveSellers, setProspectiveSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProspectiveSellers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/prospective-sellers');
        setProspectiveSellers(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching prospective sellers:', err);
        setError('Failed to load prospective sellers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === 'Admin') {
      fetchProspectiveSellers();
    }
  }, [currentUser]);

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

  if (!currentUser || currentUser.role !== 'Admin') {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-700">Access Denied</h2>
        <p className="text-slate-500 mt-2">Only administrators can access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span className="ml-2 text-slate-600">Loading prospective sellers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Seller Approvals</h1>
        <p className="text-slate-600 mt-1">
          Manage pending seller applications and approve qualified sellers
        </p>
      </div>

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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Seller Approval Process</h3>
        <p className="text-sm text-blue-700">
          Sellers with ProspectiveSeller role must be approved by an admin to become full sellers. 
          You can approve qualified sellers or reject applications that don't meet marketplace standards.
        </p>
      </div>
    </div>
  );
};

export default SellerApprovals;