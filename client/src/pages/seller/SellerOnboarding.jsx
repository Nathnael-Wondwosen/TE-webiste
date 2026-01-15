import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const steps = [
  { id: 'profile', label: 'Shop Profile' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payouts', label: 'Payouts' },
];

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    shopName: '',
    bio: '',
    contactEmail: '',
    contactPhone: '',
    shipping: {
      defaultFee: '',
      processingTime: '',
    },
    payout: {
      bankName: '',
      accountName: '',
      accountNumber: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/seller/profile');
        const profile = response.data || {};
        setForm({
          shopName: profile.shopName || '',
          bio: profile.bio || '',
          contactEmail: profile.contactEmail || '',
          contactPhone: profile.contactPhone || '',
          shipping: {
            defaultFee: profile.shipping?.defaultFee || '',
            processingTime: profile.shipping?.processingTime || '',
          },
          payout: {
            bankName: profile.payout?.bankName || '',
            accountName: profile.payout?.accountName || '',
            accountNumber: profile.payout?.accountNumber || '',
          },
        });
        if (profile.onboardingCompleted) {
          navigate('/seller');
        }
      } catch (error) {
        console.error('Load onboarding profile error', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

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

  const handleNext = () => {
    const validation = validateStep(activeStep);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFinish = async () => {
    const validation = validateStep(activeStep, true);
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }
    try {
      setSaving(true);
      await api.put('/seller/profile', { ...form, onboardingCompleted: true });
      setMessage('Onboarding completed. Redirecting to dashboard...');
      setTimeout(() => navigate('/seller'), 800);
    } catch (error) {
      console.error('Finish onboarding error', error);
      setMessage('Unable to complete onboarding right now.');
    } finally {
      setSaving(false);
    }
  };

  const validateStep = (stepIndex, includeAll = false) => {
    const nextErrors = {};
    const addError = (key, value) => {
      nextErrors[key] = value;
    };

    const requiredProfile = ['shopName', 'contactEmail'];
    const requiredShipping = ['defaultFee', 'processingTime'];
    const requiredPayout = ['bankName', 'accountName', 'accountNumber'];

    if (stepIndex === 0 || includeAll) {
      requiredProfile.forEach((field) => {
        if (!form[field]?.trim()) {
          addError(field, 'Required');
        }
      });
    }

    if (stepIndex === 1 || includeAll) {
      requiredShipping.forEach((field) => {
        if (!form.shipping[field]?.toString().trim()) {
          addError(`shipping.${field}`, 'Required');
        }
      });
    }

    if (stepIndex === 2 || includeAll) {
      requiredPayout.forEach((field) => {
        if (!form.payout[field]?.trim()) {
          addError(`payout.${field}`, 'Required');
        }
      });
    }

    return { ok: Object.keys(nextErrors).length === 0, errors: nextErrors };
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Seller Onboarding</p>
            <h1 className="text-2xl font-semibold text-slate-900 mt-2">Launch your shop</h1>
            <p className="text-sm text-slate-500 mt-2">
              Complete these steps to activate your storefront and start selling.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            Step {activeStep + 1} of {steps.length}
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                index === activeStep
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : index < activeStep
                    ? 'border-slate-200 bg-slate-50 text-slate-600'
                    : 'border-slate-200 text-slate-400'
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {message}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-sm">
        {loading ? (
          <div className="text-sm text-slate-500">Loading profile...</div>
        ) : (
          <>
            {activeStep === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Shop Name</label>
                  <input
                    type="text"
                    value={form.shopName}
                    onChange={(event) => updateField('shopName', event.target.value)}
                    placeholder="Your shop name"
                    className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                      errors.shopName ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {errors.shopName && (
                    <p className="mt-1 text-xs text-rose-500">{errors.shopName}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Shop Bio</label>
                  <textarea
                    rows="3"
                    value={form.bio}
                    onChange={(event) => updateField('bio', event.target.value)}
                    placeholder="Share your story"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Contact Email</label>
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={(event) => updateField('contactEmail', event.target.value)}
                      placeholder="seller@email.com"
                      className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                        errors.contactEmail ? 'border-rose-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.contactEmail && (
                      <p className="mt-1 text-xs text-rose-500">{errors.contactEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Contact Phone</label>
                    <input
                      type="text"
                      value={form.contactPhone}
                      onChange={(event) => updateField('contactPhone', event.target.value)}
                      placeholder="+251..."
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Default Shipping Fee</label>
                  <input
                    type="text"
                    value={form.shipping.defaultFee}
                    onChange={(event) => updateNestedField('shipping', 'defaultFee', event.target.value)}
                    placeholder="ETB 120"
                    className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                      errors['shipping.defaultFee'] ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {errors['shipping.defaultFee'] && (
                    <p className="mt-1 text-xs text-rose-500">{errors['shipping.defaultFee']}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Processing Time</label>
                  <input
                    type="text"
                    value={form.shipping.processingTime}
                    onChange={(event) => updateNestedField('shipping', 'processingTime', event.target.value)}
                    placeholder="1-2 business days"
                    className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                      errors['shipping.processingTime'] ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {errors['shipping.processingTime'] && (
                    <p className="mt-1 text-xs text-rose-500">{errors['shipping.processingTime']}</p>
                  )}
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Bank Name</label>
                  <input
                    type="text"
                    value={form.payout.bankName}
                    onChange={(event) => updateNestedField('payout', 'bankName', event.target.value)}
                    placeholder="Enter bank name"
                    className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                      errors['payout.bankName'] ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {errors['payout.bankName'] && (
                    <p className="mt-1 text-xs text-rose-500">{errors['payout.bankName']}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Account Name</label>
                  <input
                    type="text"
                    value={form.payout.accountName}
                    onChange={(event) => updateNestedField('payout', 'accountName', event.target.value)}
                    placeholder="Account name"
                    className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                      errors['payout.accountName'] ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {errors['payout.accountName'] && (
                    <p className="mt-1 text-xs text-rose-500">{errors['payout.accountName']}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Account Number</label>
                  <input
                    type="text"
                    value={form.payout.accountNumber}
                    onChange={(event) => updateNestedField('payout', 'accountNumber', event.target.value)}
                    placeholder="Account number"
                    className={`mt-2 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                      errors['payout.accountNumber'] ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                  {errors['payout.accountNumber'] && (
                    <p className="mt-1 text-xs text-rose-500">{errors['payout.accountNumber']}</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
        >
          Back
        </button>
        {activeStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={saving}
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Finish setup'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SellerOnboarding;
