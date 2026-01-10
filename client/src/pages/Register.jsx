import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/authSlice';

function Register() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <section className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow">
        <h1 className="text-2xl font-semibold mb-6">Join TradeEthiopia</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Full Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-emerald-500 outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-emerald-500 outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-emerald-500 outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-emerald-600 text-white py-2 text-sm font-semibold hover:bg-emerald-500 transition"
          >
            {status === 'loading' ? 'Creating account...' : 'Register Account'}
          </button>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </section>
  );
}

export default Register;
