import { useEffect, useState } from 'react';
import api from '../../services/api';

const SellerCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/seller/customers');
        setCustomers(response.data);
        setError('');
      } catch (err) {
        console.error('Seller customers error', err);
        setError('Unable to load customers right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Customers</h2>
          <p className="text-sm text-slate-500">Build relationships and keep track of buyer history.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
            Create Segment
          </button>
          <button className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition">
            Send Message
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.8fr)] gap-4 p-4 border-b border-slate-100 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>Customer</span>
          <span>Orders</span>
          <span>Total Spend</span>
          <span>Segment</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading && (
            <div className="p-4 text-sm text-slate-500">Loading customers...</div>
          )}
          {!loading && customers.map((customer) => (
            <div key={customer.id} className="grid grid-cols-1 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,0.8fr)] gap-4 p-4 items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">{customer.name}</p>
                <p className="text-xs text-slate-500">Last order {new Date(customer.lastOrder).toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-slate-700">{customer.totalOrders}</p>
              <p className="text-sm font-medium text-slate-900">ETB {Number(customer.totalSpend || 0).toLocaleString()}</p>
              <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                customer.totalSpend > 10000 ? 'bg-amber-100 text-amber-700' :
                customer.totalOrders > 3 ? 'bg-emerald-100 text-emerald-700' :
                'bg-sky-100 text-sky-700'
              }`}>
                {customer.totalSpend > 10000 ? 'VIP' : customer.totalOrders > 3 ? 'Loyal' : 'New'}
              </span>
            </div>
          ))}
          {!loading && !customers.length && !error && (
            <div className="p-4 text-sm text-slate-500">No customers yet.</div>
          )}
          {error && (
            <div className="p-4 text-sm text-rose-600">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerCustomers;
