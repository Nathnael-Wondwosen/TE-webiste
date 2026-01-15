import { useEffect, useState } from 'react';
import api from '../../services/api';

const SellerDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const alerts = [
    { id: 1, title: 'Low stock reminder', note: 'Review low stock products to avoid backorders.' },
    { id: 2, title: 'Shipping queue', note: 'Print labels early to stay on schedule.' },
    { id: 3, title: 'Customer care', note: 'Respond to new messages within 24 hours.' }
  ];

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const [overviewRes, ordersRes, analyticsRes, profileRes] = await Promise.all([
          api.get('/seller/overview'),
          api.get('/seller/orders'),
          api.get('/seller/analytics'),
          api.get('/seller/profile'),
        ]);
        setOverview(overviewRes.data);
        setRecentOrders(ordersRes.data.slice(0, 3));
        setTopProducts(analyticsRes.data.topProducts || []);
        setProfile(profileRes.data);
        setError('');
      } catch (err) {
        console.error('Seller dashboard error', err);
        setError('Unable to load seller data right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const metrics = [
    {
      label: 'Revenue',
      value: `ETB ${(overview?.revenue || 0).toLocaleString()}`,
      change: 'Updated',
      tone: 'emerald',
    },
    {
      label: 'Orders',
      value: overview?.orderCount ?? 0,
      change: 'All time',
      tone: 'amber',
    },
    {
      label: 'Low Stock',
      value: overview?.lowStockCount ?? 0,
      change: 'Needs restock',
      tone: 'rose',
    },
    {
      label: 'Customers',
      value: overview?.customerCount ?? 0,
      change: 'Unique buyers',
      tone: 'sky',
    }
  ];

  const checklistItems = [
    { id: 'shopName', label: 'Add shop name', done: Boolean(profile?.shopName) },
    { id: 'contact', label: 'Add contact email', done: Boolean(profile?.contactEmail) },
    { id: 'shipping', label: 'Set shipping rules', done: Boolean(profile?.shipping?.processingTime) },
    { id: 'payout', label: 'Add payout details', done: Boolean(profile?.payout?.accountNumber) },
  ];
  const completedCount = checklistItems.filter((item) => item.done).length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 sm:p-6 text-white shadow-lg">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-100">Seller Hub</p>
            <h1 className="mt-2 text-xl sm:text-2xl font-semibold">Welcome back to your shop.</h1>
            <p className="text-amber-100 mt-2 max-w-2xl text-sm">
              Track sales, manage orders, and grow your customers from one workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/25 transition">
              View Storefront
            </button>
            <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition">
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-4 sm:p-5 hover:shadow-md transition-shadow"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
            <p className="text-2xl font-semibold text-slate-900 mt-2">{metric.value}</p>
            <div className={`mt-2 text-xs font-medium ${
              metric.tone === 'emerald' ? 'text-emerald-600' :
              metric.tone === 'amber' ? 'text-amber-600' :
              metric.tone === 'rose' ? 'text-rose-600' :
              'text-sky-600'
            }`}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Smart Alerts</h2>
              <button className="text-xs font-medium text-amber-700 hover:text-amber-800">View all</button>
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 hover:border-amber-100 hover:bg-amber-50/40 transition">
                  <div className="h-9 w-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 19a7 7 0 100-14 7 7 0 000 14z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-500">{alert.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
              <button className="text-xs font-medium text-amber-700 hover:text-amber-800">Go to orders</button>
            </div>
            {loading ? (
              <div className="py-6 text-sm text-slate-500">Loading orders...</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">#{order.id.slice(-6)}</p>
                      <p className="text-xs text-slate-500">{order.buyer?.name || 'Buyer'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">ETB {Number(order.total || 0).toLocaleString()}</p>
                      <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'Shipped' ? 'bg-sky-100 text-sky-700' :
                        order.status === 'Confirmed' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {!recentOrders.length && (
                  <div className="py-6 text-sm text-slate-500">No recent orders yet.</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Onboarding Checklist</h2>
              <span className="text-xs font-medium text-amber-700">
                {completedCount}/{checklistItems.length} done
              </span>
            </div>
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <span className={`text-xs font-semibold ${
                    item.done ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {item.done ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Top Products</h2>
              <button className="text-xs font-medium text-amber-700 hover:text-amber-800">Manage</button>
            </div>
            {loading ? (
              <div className="py-6 text-sm text-slate-500">Loading products...</div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.unitsSold} units sold</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">
                      ETB {Number(product.revenue || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
                {!topProducts.length && (
                  <div className="py-6 text-sm text-slate-500">No product data yet.</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Customer Notes</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">CRM</span>
            </div>
            {error && (
              <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                {error}
              </div>
            )}
            <div className="space-y-3 text-sm text-slate-600">
              <div className="rounded-xl border border-slate-100 p-3">
                4 VIP customers placed repeat orders this week. Send a thank-you coupon.
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                Two buyers requested faster shipping options for Addis Ababa.
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                Customer support response time: 3h 18m average.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
