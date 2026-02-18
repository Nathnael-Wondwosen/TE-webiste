import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/authSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Buyer',
    company: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Email is invalid';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(registerUser(form));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white p-8 sm:p-10">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,_white,_transparent_25%),radial-gradient(circle_at_80%_0,_white,_transparent_20%),radial-gradient(circle_at_50%_80%,_white,_transparent_30%)]" />
          <div className="relative space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">Join TradeEthiopia</p>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Create your account</h1>
            <p className="text-emerald-50 text-sm sm:text-base max-w-xl">
              Sell and buy confidently with verified buyers and sellers. Admins keep the marketplace clean; you focus on great products.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-4">
              {['Secure payments', 'Modern storefront', 'Seller analytics'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 border border-white/20 p-4 text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Have an account?
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, role: 'Buyer' }))}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                  form.role === 'Buyer'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-700 hover:border-emerald-200'
                }`}
              >
                Register as Buyer
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, role: 'Seller' }))}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                  form.role === 'Seller'
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-slate-200 text-slate-700 hover:border-amber-200'
                }`}
              >
                Register as Seller
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.15em]">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 ${
                  errors.name ? 'border-rose-300' : 'border-slate-200'
                }`}
                placeholder="e.g., Buna Tale"
              />
              {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.15em]">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 ${
                  errors.email ? 'border-rose-300' : 'border-slate-200'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.15em]">Password</label>
              <div className={`flex items-center rounded-xl border px-3 ${errors.password ? 'border-rose-300' : 'border-slate-200'}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full py-2.5 text-sm outline-none"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-xs font-semibold text-emerald-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-600">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-[0.15em]">Company (optional)</label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                placeholder="Company name"
              />
            </div>

            {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{error}</p>}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-emerald-600 text-white py-2.5 text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {status === 'loading' ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-xs text-slate-500 text-center">
              By signing up you agree to our terms and confirm all B2B listings are posted by admins.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
