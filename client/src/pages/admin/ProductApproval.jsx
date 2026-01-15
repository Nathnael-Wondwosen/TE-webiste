import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';

const ProductApproval = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Extract unique categories from products
  const allCategories = Array.from(
    new Set(products.map(product => product.category?.name).filter(Boolean))
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all products (both approved and pending)
      const response = await api.get('/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      await api.put(`/admin/products/${productId}/approve`);
      // Update local state
      setProducts(products.map(product => 
        product._id === productId ? { ...product, approved: true, verified: true, status: 'approved' } : product
      ));
    } catch (error) {
      console.error('Error approving product:', error);
    }
  };
  
  const handleVerifyProduct = async (productId) => {
    try {
      // Call the approve endpoint which sets both approved and verified
      await api.put(`/admin/products/${productId}/approve`);
      // Update local state
      setProducts(products.map(product => 
        product._id === productId ? { ...product, verified: true, approved: true, status: 'approved' } : product
      ));
    } catch (error) {
      console.error('Error verifying product:', error);
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      // If product is approved, unapprove it
      // If product is not approved, remove it
      const productToProcess = products.find(p => p._id === productId);
      if (productToProcess && productToProcess.approved) {
        // Call API to unapprove the product
        await api.put(`/admin/products/${productId}/status`, { status: 'pending' });
        // Update local state
        setProducts(products.map(product => 
          product._id === productId ? { ...product, approved: false, verified: false, status: 'pending' } : product
        ));
      } else {
        // Remove the product
        setProducts(products.filter(product => product._id !== productId));
      }
    } catch (error) {
      console.error('Error processing product:', error);
    }
  };

  const handleFixAllProductsForSeller = async (sellerId) => {
    try {
      // Call API to fix all products for this seller
      await api.put(`/admin/products/seller/${sellerId}/fix-status`);
      // Refresh the product list
      await fetchData();
    } catch (error) {
      console.error('Error fixing all products for seller:', error);
    }
  };

  // Show all products regardless of approval status, not just pending ones
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'pending' && !product.approved) ||
                         (selectedStatus === 'approved' && product.approved);
    const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });
  
  // Count pending products for the stats
  const pendingProducts = products.filter(p => !p.approved);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Review and manage all products</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Bulk Actions
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{pendingProducts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected Today</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Categories</option>
            {allCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">by {product.seller?.name || 'Unknown Seller'}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {product.approved ? 'Approved' : 'Pending'}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ml-1 ${product.verified ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                  {product.verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm line-clamp-2">{product.description || 'No description provided'}</p>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="text-lg font-bold text-gray-900">${product.price}</div>
                <div className="text-sm text-gray-500">{product.unit}</div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span>{product.category?.name || 'Uncategorized'}</span>
              </div>
              
              <div className="flex gap-2">
                {!product.approved && (
                  <button
                    onClick={() => handleApproveProduct(product._id)}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    Approve
                  </button>
                )}
                {product.approved && !product.verified && (
                  <button
                    onClick={() => handleVerifyProduct(product._id)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Verify
                  </button>
                )}
                <button
                  onClick={() => handleRejectProduct(product._id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  {product.approved ? 'Unapprove' : 'Reject'}
                </button>
                <button
                  onClick={() => handleFixAllProductsForSeller(product.seller._id)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  title="Fix all products for this seller"
                >
                  Fix All
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">No products match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default ProductApproval;