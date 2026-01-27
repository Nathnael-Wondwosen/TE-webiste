import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

const tabs = [
  { id: 'local', label: 'Local', tone: 'from-emerald-900 via-emerald-800 to-teal-700' },
  { id: 'international', label: 'International', tone: 'from-slate-900 via-slate-800 to-indigo-700' },
];

function B2BMarketplace() {
  const [activeTab, setActiveTab] = useState('local');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setMessage('');
        const response = await api.get('/b2b-products', {
          params: { productType: activeTab },
        });
        setItems(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching B2B products', err);
        setItems([]);
        setMessage('Unable to load B2B products right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [activeTab]);

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        if (!searchTerm) return true;
        const text = `${item.name || ''} ${item.description || ''}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [items, searchTerm]);

  const tone =
    activeTab === 'international'
      ? 'from-slate-900 via-slate-800 to-indigo-700'
      : 'from-emerald-900 via-emerald-800 to-teal-700';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className={`relative overflow-hidden bg-gradient-to-br ${tone} text-white`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,_white,_transparent_25%),radial-gradient(circle_at_80%_0,_white,_transparent_20%),radial-gradient(circle_at_50%_80%,_white,_transparent_30%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="uppercase text-xs tracking-[0.3em] text-emerald-100">B2B Marketplace</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                Admin-curated {activeTab} offers.
              </h1>
              <p className="text-base sm:text-lg text-emerald-50 max-w-2xl">
                Browse simple, verified listings posted directly by admins. No seller accounts needed—just clean local and international inventory.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-lime-300" /> Admin posted
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" /> Local & international lanes
                </span>
              </div>
            </div>
            <div className="hidden md:block bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm w-full lg:max-w-sm">
              <p className="text-sm text-emerald-50 mb-2">Marketplace pulse</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                  <p className="text-xs text-emerald-50">Listings</p>
                  <p className="text-2xl font-bold">{filtered.length}</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                  <p className="text-xs text-emerald-50">Type</p>
                  <p className="text-2xl font-bold capitalize">{activeTab}</p>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/15 p-3">
                  <p className="text-xs text-emerald-50">Updated</p>
                  <p className="text-2xl font-bold">Live</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3 md:gap-0 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center rounded-full bg-slate-100 p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-full px-3 py-2 ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-full px-3 py-2 ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              List
            </button>
          </div>

          <div className="w-full md:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search listings"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {message && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{message}</div>}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-slate-900 mb-2">No products found</p>
            <p className="text-sm text-slate-600">Try switching markets or clearing the search.</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                : 'space-y-4 sm:space-y-6'
            }
          >
            {filtered.map((item) => (
              <div
                key={item._id}
                className={
                  viewMode === 'list'
                    ? 'rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm'
                    : 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      {item.productType === 'international' ? 'International' : 'Local'} • Admin
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mt-1">{item.name}</h3>
                    {item.description && <p className="text-sm text-slate-600 mt-2 line-clamp-3">{item.description}</p>}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    {item.status || 'active'}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
                  <span>
                    {item.price ? `ETB ${Number(item.price).toLocaleString()}` : 'Price on request'}
                  </span>
                  {item.createdAt && (
                    <span className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default B2BMarketplace;
