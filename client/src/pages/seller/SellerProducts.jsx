import { useEffect, useState } from 'react';
import api from '../../services/api';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingProductId, setDeletingProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/seller/products');
        setProducts(response.data);
        setError('');
      } catch (err) {
        console.error('Seller products error', err);
        setError('Unable to load products right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete the product "${productName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setDeletingProductId(productId);
      await api.delete(`/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
      setError('');
    } catch (err) {
      console.error('Delete product error', err);
      setError('Unable to delete product. Please try again.');
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Products</h2>
          <p className="text-sm text-slate-500">Manage listings, pricing, and inventory in your shop.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
            Bulk Actions
          </button>
          <a
            href="/seller/products/new"
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
          >
            Add Product
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)] gap-4 p-4 border-b border-slate-100 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>Product</span>
          <span>SKU</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading && (
            <div className="p-4 text-sm text-slate-500">Loading products...</div>
          )}
          {!loading && products.map((product) => (
            <div key={product._id} className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)] gap-4 p-4 items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                <p className="text-xs text-slate-500">Updated {new Date(product.updatedAt).toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-slate-700">{product.slug || 'SKU-N/A'}</p>
              <p className="text-sm font-medium text-slate-900">ETB {Number(product.price || 0).toLocaleString()}</p>
              <p className="text-sm text-slate-700">{product.quantity ?? 0}</p>
              <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                product.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                product.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>
                {product.status}
              </span>
              <div className="flex gap-2">
                <a
                  href={`/seller/products/${product._id}/edit`}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDeleteProduct(product._id, product.name)}
                  disabled={deletingProductId === product._id}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingProductId === product._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
          {!loading && !products.length && !error && (
            <div className="p-4 text-sm text-slate-500">No products found.</div>
          )}
          {error && (
            <div className="p-4 text-sm text-rose-600">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
