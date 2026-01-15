import { useEffect, useState } from 'react';
import api from '../../services/api';

const SellerSettings = () => {
  const [form, setForm] = useState({
    shopName: '',
    bio: '',
    contactEmail: '',
    contactPhone: '',
    payout: {
      bankName: '',
      accountName: '',
      accountNumber: '',
    },
    shipping: {
      defaultFee: '',
      processingTime: '',
    },
  });
  const [profileMeta, setProfileMeta] = useState({ status: 'pending', statusNotes: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/seller/profile');
        const profile = response.data || {};
        setProfileMeta({
          status: profile.status || 'pending',
          statusNotes: profile.statusNotes || [],
        });
        setForm({
          shopName: profile.shopName || '',
          bio: profile.bio || '',
          contactEmail: profile.contactEmail || '',
          contactPhone: profile.contactPhone || '',
          payout: {
            bankName: profile.payout?.bankName || '',
            accountName: profile.payout?.accountName || '',
            accountNumber: profile.payout?.accountNumber || '',
          },
          shipping: {
            defaultFee: profile.shipping?.defaultFee || '',
            processingTime: profile.shipping?.processingTime || '',
          },
        });
        setMessage('');
      } catch (err) {
        console.error('Seller profile error', err);
        setMessage('Unable to load seller profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await api.put('/seller/profile', form);
      setMessage('Profile updated successfully.');
    } catch (err) {
      console.error('Update seller profile error', err);
      setMessage('Unable to update profile right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
          <p className="text-sm text-slate-500">Configure your storefront, payouts, and shipping preferences.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-70"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Shop Status</h3>
            <p className="text-sm text-slate-500">Review approval status and admin notes.</p>
          </div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            profileMeta.status === 'active'
              ? 'bg-emerald-100 text-emerald-700'
              : profileMeta.status === 'suspended'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-700'
          }`}>
            {profileMeta.status}
          </span>
        </div>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          {profileMeta.statusNotes?.length ? (
            profileMeta.statusNotes
              .slice()
              .reverse()
              .slice(0, 4)
              .map((note, index) => (
                <div key={`${note.createdAt || 'note'}-${index}`} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="uppercase tracking-[0.2em]">{note.status || profileMeta.status}</span>
                    <span>{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{note.note || 'No note provided.'}</p>
                </div>
              ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              No admin notes yet. You will see updates here after review.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Shop Profile</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Shop Name</label>
              <input
                type="text"
                value={form.shopName}
                onChange={(event) => updateField('shopName', event.target.value)}
                placeholder="Add your shop name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Shop Bio</label>
              <textarea
                rows="3"
                value={form.bio}
                onChange={(event) => updateField('bio', event.target.value)}
                placeholder="Tell customers about your shop"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(event) => updateField('contactEmail', event.target.value)}
                placeholder="Email for customers"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Contact Phone</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(event) => updateField('contactPhone', event.target.value)}
                placeholder="+251..."
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Payouts</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Bank Name</label>
              <input
                type="text"
                value={form.payout.bankName}
                onChange={(event) => updateNestedField('payout', 'bankName', event.target.value)}
                placeholder="Enter bank name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Account Name</label>
              <input
                type="text"
                value={form.payout.accountName}
                onChange={(event) => updateNestedField('payout', 'accountName', event.target.value)}
                placeholder="Account name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Account Number</label>
              <input
                type="text"
                value={form.payout.accountNumber}
                onChange={(event) => updateNestedField('payout', 'accountNumber', event.target.value)}
                placeholder="Account number"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Shipping Rules</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Default Shipping Fee</label>
              <input
                type="text"
                value={form.shipping.defaultFee}
                onChange={(event) => updateNestedField('shipping', 'defaultFee', event.target.value)}
                placeholder="ETB 120"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                disabled={loading}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Processing Time</label>
              <input
                type="text"
                value={form.shipping.processingTime}
                onChange={(event) => updateNestedField('shipping', 'processingTime', event.target.value)}
                placeholder="1-2 business days"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">Team Access</h3>
          <p className="text-sm text-slate-500">
            Invite staff members to help manage orders and inventory.
          </p>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Invite Staff
          </button>
        </div>
      </div>
    </form>
  );
};

export default SellerSettings;
