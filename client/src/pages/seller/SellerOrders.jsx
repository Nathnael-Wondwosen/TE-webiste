import { useEffect, useState } from 'react';
import api from '../../services/api';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/seller/orders');
        setOrders(response.data);
        setError('');
      } catch (err) {
        console.error('Seller orders error', err);
        setError('Unable to load orders right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Orders</h2>
          <p className="text-sm text-slate-500">Track fulfillment and keep buyers informed.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
            Export CSV
          </button>
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition">
            Create Label
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,0.8fr)] gap-4 p-4 border-b border-slate-100 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>Order</span>
          <span>Buyer</span>
          <span>Total</span>
          <span>Items</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading && (
            <div className="p-4 text-sm text-slate-500">Loading orders...</div>
          )}
          {!loading && orders.map((order) => (
            <div key={order.id} className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,0.8fr)] gap-4 p-4 items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">#{order.id.slice(-6)}</p>
                <p className="text-xs text-slate-500">Updated {new Date(order.updatedAt).toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-slate-700">{order.buyer?.name || 'Buyer'}</p>
              <p className="text-sm font-medium text-slate-900">ETB {Number(order.total || 0).toLocaleString()}</p>
              <p className="text-sm text-slate-700">{order.items?.length || 0}</p>
              <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                order.status === 'Shipped' ? 'bg-sky-100 text-sky-700' :
                order.status === 'Confirmed' ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>
                {order.status}
              </span>
            </div>
          ))}
          {!loading && !orders.length && !error && (
            <div className="p-4 text-sm text-slate-500">No orders yet.</div>
          )}
          {error && (
            <div className="p-4 text-sm text-rose-600">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;
