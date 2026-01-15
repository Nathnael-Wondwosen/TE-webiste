import { useEffect, useState } from 'react';
import api from '../../services/api';

const SellerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/seller/analytics');
        setAnalytics(response.data);
        setError('');
      } catch (err) {
        console.error('Seller analytics error', err);
        setError('Unable to load analytics right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: `ETB ${(analytics?.revenue || 0).toLocaleString()}`, note: 'All time' },
    { label: 'Orders', value: analytics?.orders ?? 0, note: 'All time' },
    { label: 'Units Sold', value: analytics?.unitsSold ?? 0, note: 'All time' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Analytics</h2>
        <p className="text-sm text-slate-500">Monitor sales performance and buyer behavior.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            <p className="text-2xl font-semibold text-slate-900 mt-2">{stat.value}</p>
            <p className="text-xs text-emerald-600 mt-2">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Sales Trend</h3>
            <button className="text-xs font-medium text-amber-700 hover:text-amber-800">Last 30 days</button>
          </div>
          <div className="h-56 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 flex items-center justify-center text-sm text-slate-400">
            Chart placeholder
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Top Regions</h3>
            <button className="text-xs font-medium text-amber-700 hover:text-amber-800">View map</button>
          </div>
          {loading ? (
            <div className="py-6 text-sm text-slate-500">Loading analytics...</div>
          ) : (
            <div className="space-y-3 text-sm text-slate-600">
              {(analytics?.topProducts || []).slice(0, 4).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <span>{product.name}</span>
                  <span className="font-semibold text-slate-900">{product.unitsSold} units</span>
                </div>
              ))}
              {!analytics?.topProducts?.length && (
                <div className="text-sm text-slate-500">No product data yet.</div>
              )}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
