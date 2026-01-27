import { useEffect, useState } from 'react';
import api from '../../services/api';

const emptyForm = {
  name: '',
  description: '',
  productType: 'local',
  price: '',
  status: 'active',
};

const AdminB2BProducts = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/b2b-products');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load B2B products', err);
      setMessage('Unable to load B2B products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage('Name is required.');
      return;
    }
    try {
      setSaving(true);
      await api.post('/admin/b2b-products', {
        ...form,
        price: form.price ? Number(form.price) : undefined,
      });
      setForm(emptyForm);
      setMessage('B2B product created.');
      loadItems();
    } catch (err) {
      console.error('Failed to create B2B product', err);
      setMessage('Unable to create B2B product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this B2B product?')) return;
    try {
      await api.delete(`/admin/b2b-products/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete B2B product', err);
      setMessage('Unable to delete B2B product.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B2B Products</h1>
          <p className="text-slate-600 text-sm">Admin-only listings for the B2B marketplace.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Create B2B Product</h2>
        {message && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.15em]">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
              placeholder="Product name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.15em]">Product type</label>
            <select
              value={form.productType}
              onChange={(e) => setForm({ ...form, productType: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
            >
              <option value="local">Local</option>
              <option value="international">International</option>
            </select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.15em]">Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
              placeholder="What is included"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.15em]">Price (optional)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
              placeholder="ETB"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.15em]">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Create B2B product'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Existing B2B Products</h2>
        </div>
        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">Loading...</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.productType === 'international' ? 'International' : 'Local'} • {item.status}
                  </p>
                  {item.description && (
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800">
                    {item.price ? `ETB ${Number(item.price).toLocaleString()}` : 'Price on request'}
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-rose-600 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {!items.length && (
              <div className="py-8 text-center text-sm text-slate-500">No B2B products yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminB2BProducts;
