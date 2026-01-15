import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const initialFormState = {
  name: '',
  price: '',
  unit: 'kg',
  quantity: '',
  category: '',
  country: 'Ethiopia',
  description: '',
  productType: 'Local',
  featured: false,
  publishNow: true,
};

const fallbackCategoryNames = [
  'Coffee',
  'Leather',
  'Spices',
  'Gemstones',
  'Honey',
  'Ceramics',
  'Textiles',
  'Livestock & Dairy',
  'Agro-processing',
  'Handicrafts',
  'Green Energy Products',
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hasRepairedCategories, setHasRepairedCategories] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products?limit=200'),
        api.get('/admin/categories'),
      ]);
      setProducts(productsRes.data.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error loading admin products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      setShowCreateForm(products.length === 0);
    }
  }, [loading, products.length]);

  const summary = useMemo(() => {
    const approved = products.filter((product) => product.approved).length;
    const pending = products.length - approved;
    return { approved, pending, total: products.length };
  }, [products]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    const maxBytes = 10 * 1024 * 1024;
    const validFiles = files.filter((file) => file.size <= maxBytes);
    const rejected = files.filter((file) => file.size > maxBytes);
    if (rejected.length) {
      const maxMb = (maxBytes / (1024 * 1024)).toFixed(0);
      setImageError(`Some images exceed ${maxMb} MB and were not added.`);
    } else {
      setImageError('');
    }
    setImages(validFiles);
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setImages([]);
    setEditingProduct(null);
    setImageError('');
    setSubmitError('');
  };

  const isObjectId = (value) => /^[a-f\d]{24}$/i.test(value);

  const categoryById = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category._id] = category;
      return acc;
    }, {});
  }, [categories]);

  const resolvedCategories = useMemo(() => {
    const existing = categories
      .filter((category) => !(isObjectId(category.name) && categoryById[category.name]))
      .map((category) => category.name);
    const existingOptions = categories
      .filter((category) => !(isObjectId(category.name) && categoryById[category.name]))
      .map((category) => ({
      label: category.name,
      value: category._id,
      isExisting: true,
      }));
    const fallbackOptions = fallbackCategoryNames
      .filter((name) => !existing.includes(name))
      .map((name) => ({
        label: name,
        value: name,
        isExisting: false,
      }));
    return [...existingOptions, ...fallbackOptions];
  }, [categories]);

  const getCategoryLabel = (product) => {
    if (!product.category) return 'Uncategorized';
    if (typeof product.category === 'string') {
      const match = categories.find((category) => category._id === product.category);
      return match?.name || product.category;
    }
    if (isObjectId(product.category?.name) && categoryById[product.category.name]) {
      return categoryById[product.category.name].name;
    }
    return product.category?.name || 'Uncategorized';
  };

  useEffect(() => {
    if (hasRepairedCategories || loading || !products.length || !categories.length) {
      return;
    }
    const repairs = products
      .filter((product) => {
        const categoryName = product.category?.name;
        return isObjectId(categoryName) && categoryById[categoryName];
      })
      .map(async (product) => {
        const categoryName = product.category?.name;
        const payload = new FormData();
        payload.append('category', categoryName);
        try {
          await api.put(`/products/${product._id}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } catch (error) {
          console.error('Error repairing product category', error);
        }
      });

    if (repairs.length) {
      Promise.all(repairs).then(() => loadData());
    }
    setHasRepairedCategories(true);
  }, [categories.length, categoryById, hasRepairedCategories, loading, products]);

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setSubmitError('');
      let categoryId = formState.category;
      if (categoryId && !/^[a-f\d]{24}$/i.test(categoryId)) {
        const match = categories.find(
          (category) => category.name.toLowerCase() === categoryId.toLowerCase()
        );
        if (match?._id) {
          categoryId = match._id;
        } else {
          const created = await api.post('/admin/categories', { name: categoryId });
          categoryId = created.data?._id || '';
        }
      }
      const payload = new FormData();
      payload.append('name', formState.name);
      payload.append('price', formState.price);
      payload.append('unit', formState.unit);
      if (formState.quantity) payload.append('quantity', formState.quantity);
      if (categoryId) payload.append('category', categoryId);
      if (formState.country) payload.append('country', formState.country);
      if (formState.description) payload.append('description', formState.description);
      payload.append('productType', formState.productType);
      payload.append('featured', String(formState.featured));
      payload.append('status', formState.publishNow ? 'approved' : 'pending');
      payload.append('approved', String(formState.publishNow));
      payload.append('verified', String(formState.publishNow));
      images.forEach((file) => payload.append('images', file));

      if (editingProduct?._id) {
        await api.put(`/products/${editingProduct._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error creating product', error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Unable to create product. Please try again.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      await api.put(`/admin/products/${productId}/approve`);
      await loadData();
    } catch (error) {
      console.error('Error approving product', error);
    }
  };

  const handleStatusChange = async (productId, status) => {
    try {
      await api.put(`/admin/products/${productId}/status`, { status });
      await loadData();
    } catch (error) {
      console.error('Error updating product status', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowCreateForm(true);
    setFormState({
      name: product.name || '',
      price: product.price || '',
      unit: product.unit || 'kg',
      quantity: product.quantity || '',
      category: product.category?._id || product.category || '',
      country: product.country || 'Ethiopia',
      description: product.description || '',
      productType: product.productType || 'Local',
      featured: Boolean(product.featured),
      publishNow: product.status === 'approved' || product.approved,
    });
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm('Delete this product? This will also remove its images.');
    if (!confirmed) return;
    try {
      await api.delete(`/products/${productId}`);
      await loadData();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, publish, and manage marketplace listings.
          </p>
        </div>
        <Link
          to="/admin/products/approvals"
          className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800 hover:bg-emerald-100 transition"
        >
          Manage Approvals
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: summary.total },
          { label: 'Approved', value: summary.approved },
          { label: 'Pending', value: summary.pending },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">New Product</h2>
            <p className="text-xs text-slate-400">Admin publishing</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50 transition"
          >
            {showCreateForm ? 'Collapse' : 'Create'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition ${showCreateForm ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {showCreateForm && (
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4" onSubmit={handleCreateProduct}>
            {submitError && (
              <div className="lg:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Product name</label>
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="Ethiopian Coffee Beans"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Price</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.price}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Unit</label>
                  <input
                    name="unit"
                    value={formState.unit}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="kg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Quantity</label>
                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    value={formState.quantity}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Country</label>
                  <input
                    name="country"
                    value={formState.country}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Ethiopia"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Category</label>
                <select
                  name="category"
                  value={formState.category}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Select category</option>
                  {resolvedCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Description</label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  className="mt-2 w-full min-h-[120px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="Short product description"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Product type</label>
                  <select
                    name="productType"
                    value={formState.productType}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="Local">Local</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div className="flex flex-col justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">Media</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2 w-full text-xs text-slate-500"
                  />
                  {imageError && (
                    <p className="mt-2 text-xs text-rose-600">{imageError}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Publish immediately</p>
                  <p className="text-xs text-slate-400">Approved listings show on E-shop.</p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="publishNow"
                    checked={formState.publishNow}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <span className={`h-6 w-11 rounded-full transition ${formState.publishNow ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <span className={`block h-5 w-5 bg-white rounded-full shadow transform transition ${
                      formState.publishNow ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </span>
                </label>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formState.featured}
                    onChange={handleInputChange}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Feature on homepage
                </label>
                <div className="flex items-center gap-2">
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-emerald-700 transition disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update product' : 'Create product'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">All Products</h2>
          <span className="text-xs text-slate-400">Latest updates first</span>
        </div>
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-slate-100">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-400">{product.country || 'Ethiopia'}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {getCategoryLabel(product)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      ${product.price}/{product.unit || 'unit'}
                    </td>
                    <td className="px-5 py-4">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <input
                          type="checkbox"
                          checked={(product.status || (product.approved ? 'approved' : 'pending')) === 'approved'}
                          onChange={(event) =>
                            handleStatusChange(product._id, event.target.checked ? 'approved' : 'pending')
                          }
                          className="sr-only"
                        />
                        <span className={`h-5 w-9 rounded-full transition ${
                          (product.status || (product.approved ? 'approved' : 'pending')) === 'approved'
                            ? 'bg-emerald-500'
                            : 'bg-slate-300'
                        }`}>
                          <span className={`block h-4 w-4 bg-white rounded-full shadow transform transition ${
                            (product.status || (product.approved ? 'approved' : 'pending')) === 'approved'
                              ? 'translate-x-4'
                              : 'translate-x-1'
                          }`} />
                        </span>
                        <span>
                          {(product.status || (product.approved ? 'approved' : 'pending')) === 'approved'
                            ? 'Approved'
                            : 'Pending'}
                        </span>
                      </label>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-slate-600 hover:text-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-rose-600 hover:text-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-6 text-center text-sm text-slate-500">
                      No products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
