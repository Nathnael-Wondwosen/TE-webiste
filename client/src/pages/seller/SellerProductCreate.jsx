import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SellerProductCreate = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [videoLinks, setVideoLinks] = useState(['']);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    unit: 'kg',
    country: 'Ethiopia',
    productType: 'Local',
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [images]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get('/categories');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remainingSlots = Math.max(0, 6 - images.length);
    const nextFiles = files.slice(0, remainingSlots);
    const nextImages = nextFiles
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

    setImages((prev) => [...prev, ...nextImages]);
    event.target.value = '';
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return next;
    });
  };

  const moveImage = (fromIndex, toIndex) => {
    setImages((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const setPrimaryImage = (index) => {
    moveImage(index, 0);
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    const fromIndex = Number(event.dataTransfer.getData('text/plain'));
    if (Number.isNaN(fromIndex) || fromIndex === index) return;
    moveImage(fromIndex, index);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.price) {
      setMessage('Please fill in the product name and price.');
      return;
    }
    try {
      setSaving(true);
      setMessage('');
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('description', form.description);
      payload.append('category', form.category);
      payload.append('price', Number(form.price));
      payload.append('quantity', Number(form.quantity || 0));
      payload.append('unit', form.unit);
      payload.append('country', form.country);
      payload.append('productType', form.productType);
      const cleanedVideos = videoLinks.map((link) => link.trim()).filter(Boolean);
      payload.append('videos', JSON.stringify(cleanedVideos));
      images.forEach((image) => payload.append('images', image.file));

      await api.post('/products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Product submitted for approval.');
      setTimeout(() => navigate('/seller/products'), 600);
    } catch (error) {
      console.error('Create product error', error);
      setMessage('Unable to create product right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Seller Hub</p>
        <h1 className="text-2xl font-semibold text-slate-900 mt-2">Add a new product</h1>
        <p className="text-sm text-slate-500 mt-2">
          Provide the key details and submit for approval. You can edit later.
        </p>
      </div>

      {message && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Product Images</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
            />
            <span className="text-xs text-slate-400">{images.length}/6</span>
          </div>
          {images.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {images.map((image, index) => (
                <div
                  key={`${image.previewUrl}-${index}`}
                  className="relative overflow-hidden rounded-2xl border border-slate-200"
                  draggable
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(event, index)}
                >
                  <img
                    src={image.previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="h-32 w-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-emerald-600/90 px-2 py-1 text-[10px] font-semibold text-white">
                      Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 shadow hover:bg-white"
                  >
                    Remove
                  </button>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow hover:bg-white"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(index)}
                      className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-emerald-700 shadow hover:bg-white"
                    >
                      Primary
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow hover:bg-white"
                    >
                      Down
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Product Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="e.g., Bale Honey Jar 500g"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Product Videos</label>
          <div className="mt-2 space-y-2">
            {videoLinks.map((link, index) => (
              <div key={`video-${index}`} className="flex items-center gap-2">
                <input
                  type="url"
                  value={link}
                  onChange={(event) => {
                    const next = [...videoLinks];
                    next[index] = event.target.value;
                    setVideoLinks(next);
                  }}
                  placeholder="YouTube, Vimeo, or MP4 link"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                {videoLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setVideoLinks((prev) => prev.filter((_, idx) => idx !== index))}
                    className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setVideoLinks((prev) => [...prev, ''])}
            className="mt-3 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Add another video
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Supported: YouTube, Vimeo, or direct MP4 links.
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Description</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Describe your product..."
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Category</label>
            {loadingCategories ? (
              <div className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                Loading categories...
              </div>
            ) : (
              <select
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Country</label>
            <input
              type="text"
              value={form.country}
              onChange={(event) => updateField('country', event.target.value)}
              placeholder="Country of origin"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(event) => updateField('price', event.target.value)}
              placeholder="ETB 0"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(event) => updateField('quantity', event.target.value)}
              placeholder="0"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Unit</label>
            <input
              type="text"
              value={form.unit}
              onChange={(event) => updateField('unit', event.target.value)}
              placeholder="kg"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Product Type</label>
          <select
            value={form.productType}
            onChange={(event) => updateField('productType', event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="Local">Local</option>
            <option value="International">International</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Submit product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerProductCreate;
