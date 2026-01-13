import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics data
      const analyticsRes = await api.get('/admin/analytics');
      setAnalytics(analyticsRes.data);
      
      // Fetch users data
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
      
      // Fetch pending products
      const productsRes = await api.get('/products?approved=false');
      setProducts(productsRes.data.data || []);
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApproveProduct = async (productId) => {
    try {
      await api.put(`/admin/products/${productId}/approve`);
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error approving product:', error);
    }
  };
  
  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };
  
  const pendingProducts = products.filter(p => !p.approved);
  
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-lg text-slate-600">Loading dashboard...</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">ADMIN PANEL</p>
        <h1 className="text-3xl font-semibold text-[#0f3d2e]">Admin Dashboard</h1>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('products')}
        >
          Product Approval
        </button>
      </div>
      
      {activeTab === 'overview' && (
        <>
          {/* Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <article className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-emerald-700">Total Users</p>
              <p className="text-3xl font-bold text-[#0f3d2e]">{analytics.totalUsers || 0}</p>
            </article>
            <article className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-blue-700">Buyers</p>
              <p className="text-3xl font-bold text-[#0f3d2e]">{analytics.buyers || 0}</p>
            </article>
            <article className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-100 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-amber-700">Sellers</p>
              <p className="text-3xl font-bold text-[#0f3d2e]">{analytics.sellers || 0}</p>
            </article>
            <article className="bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-100 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-violet-700">Products</p>
              <p className="text-3xl font-bold text-[#0f3d2e]">{analytics.products || 0}</p>
            </article>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Users */}
            <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
              <h2 className="text-xl font-semibold mb-4 text-[#0f3d2e]">Recent Users</h2>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {users.slice(0, 5).map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-medium text-[#0f3d2e]">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : user.role === 'Seller' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
              <h2 className="text-xl font-semibold mb-4 text-[#0f3d2e]">Pending Approvals</h2>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {pendingProducts.slice(0, 5).map((product) => (
                  <div key={product._id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-[#0f3d2e]">{product.name}</p>
                        <p className="text-sm text-slate-500">by {product.seller?.name || 'Unknown'}</p>
                      </div>
                      <button 
                        onClick={() => handleApproveProduct(product._id)}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
                {pendingProducts.length === 0 && (
                  <p className="text-center text-slate-500 py-4">No pending approvals</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-[#0f3d2e]">User Management</h2>
            <p className="text-slate-600">Manage user roles and permissions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <select 
                        value={user.role}
                        onChange={(e) => handleUserRoleChange(user._id, e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-1 text-sm"
                      >
                        <option value="Buyer">Buyer</option>
                        <option value="Seller">Seller</option>
                        <option value="ServiceProvider">Service Provider</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleUserRoleChange(user._id, user.role)}
                        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-[#0f3d2e]">Product Approval</h2>
            <p className="text-slate-600">Review and approve pending products</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Seller</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingProducts.map((product) => (
                  <tr key={product._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#0f3d2e]">{product.name}</div>
                      <div className="text-sm text-slate-500">${product.price}/{product.unit}</div>
                    </td>
                    <td className="py-3 px-4">{product.seller?.name || 'Unknown'}</td>
                    <td className="py-3 px-4">{product.category?.name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                        Pending
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleApproveProduct(product._id)}
                        className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition mr-2"
                      >
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300 transition">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">No pending products for approval</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}


export default AdminDashboard;
