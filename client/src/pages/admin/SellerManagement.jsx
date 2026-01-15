import { useEffect, useState } from 'react';
import api from '../../services/api';

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState({});

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/sellers');
      setSellers(response.data);
      setError('');
    } catch (err) {
      console.error('Fetch sellers error', err);
      setError('Unable to load sellers right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const updateStatus = async (profileId, status) => {
    try {
      const note = notes[profileId]?.trim();
      const response = await api.put(`/admin/sellers/${profileId}/status`, { status, note });
      setSellers((prev) =>
        prev.map((profile) =>
          profile._id === profileId ? response.data : profile
        )
      );
      setNotes((prev) => ({ ...prev, [profileId]: '' }));
    } catch (err) {
      console.error('Update seller status error', err);
      setError('Unable to update seller status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Seller Management</h2>
          <p className="text-sm text-slate-500">Approve shops and monitor seller status.</p>
        </div>
        <button
          onClick={fetchSellers}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,0.8fr)] gap-4 p-4 border-b border-slate-100 text-xs uppercase tracking-[0.2em] text-slate-400">
          <span>Seller</span>
          <span>Shop</span>
          <span>Status</span>
          <span>Admin Note</span>
          <span>Updated</span>
        </div>
        <div className="divide-y divide-slate-100">
          {loading && (
            <div className="p-4 text-sm text-slate-500">Loading sellers...</div>
          )}
          {!loading && sellers.map((profile) => (
            <div key={profile._id} className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,0.8fr)] gap-4 p-4 items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">{profile.seller?.name || 'Seller'}</p>
                <p className="text-xs text-slate-500">{profile.seller?.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{profile.shopName || 'Shop'}</p>
                <p className="text-xs text-slate-500">Slug: {profile.slug || 'n/a'}</p>
              </div>
              <div>
                <select
                  value={profile.status}
                  onChange={(event) => updateStatus(profile._id, event.target.value)}
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={notes[profile._id] || ''}
                  onChange={(event) => setNotes((prev) => ({ ...prev, [profile._id]: event.target.value }))}
                  placeholder="Add note (optional)"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                <button
                  onClick={() => updateStatus(profile._id, profile.status)}
                  className="self-start rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Save note
                </button>
                {profile.statusNotes?.length ? (
                  <p className="text-[11px] text-slate-400">
                    Last: {profile.statusNotes[profile.statusNotes.length - 1]?.note || 'No note'}
                  </p>
                ) : null}
              </div>
              <p className="text-xs text-slate-500">
                {new Date(profile.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {!loading && !sellers.length && (
            <div className="p-4 text-sm text-slate-500">No seller profiles yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerManagement;
