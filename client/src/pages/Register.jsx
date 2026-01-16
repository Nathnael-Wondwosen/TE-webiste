import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, googleAuth } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Buyer', // Default role
  });
  const googleButtonRef = useRef(null);
  
  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/');
    }
    
    // Initialize Google button when component mounts
    handleGoogleRegister();
  }, [user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(registerUser(form));
  };
  
  const handleGoogleRegister = () => {
    try {
      // Load Google SDK if not already loaded
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initGoogleRegister;
        script.onerror = () => {
          console.error('Failed to load Google SDK');
          alert('Failed to load Google authentication. Please check your connection and try again.');
        };
        document.head.appendChild(script);
      } else {
        initGoogleRegister();
      }
    } catch (error) {
      console.error('Error in Google registration:', error);
      alert('An error occurred during Google registration. Please try again.');
    }
  };
  
  const initGoogleRegister = () => {
    try {
      /* global google */
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error('Google Client ID is not configured in environment variables');
        alert('Google authentication is not properly configured. Please contact support.');
        return;
      }
      
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      
      // Wait for the DOM to be ready before rendering the button
      setTimeout(() => {
        const buttonDiv = document.getElementById('google-signup-button');
        if (buttonDiv) {
          // Render the Google Identity Services button
          google.accounts.id.renderButton(
            buttonDiv,
            { theme: 'outline', size: 'large', width: '400', text: 'signup_with' }
          );
        } else {
          console.error('Google button container element not found');
        }
      }, 100);
      
      // Disable the automatic One Tap prompt
      google.accounts.id.disableAutoSelect();
    } catch (error) {
      console.error('Error initializing Google login:', error);
      alert('Error initializing Google authentication. Please try again.');
    }
  };
  
  const handleCredentialResponse = (response) => {
    try {
      if (response && response.credential) {
        // Capture the current role selection at the time of authentication
        const currentRole = document.querySelector('input[name="role"]:checked')?.value || 'Buyer';
        console.log('Google auth - Selected role:', currentRole);
        
        // Include the selected role in the Google auth request
        dispatch(googleAuth({ tokenId: response.credential, role: currentRole }));
      } else {
        console.error('No credential received from Google');
        alert('Failed to authenticate with Google. Please try again.');
      }
    } catch (error) {
      console.error('Error handling Google credential response:', error);
      alert('An error occurred during Google authentication. Please try again.');
    }
  };

  const googleLoginHandler = (event) => {
    event.preventDefault();
    // Initialize Google login when the button is clicked
    handleGoogleRegister();
  };
  
  return (
    <section className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow">
        <h1 className="text-2xl font-semibold mb-6">Join Tradethiopia</h1>
        <p className="text-sm text-slate-600 mb-6">Create an account to buy products or sell on Ethiopia's leading B2B marketplace.</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Full Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-emerald-500 outline-none"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-emerald-500 outline-none"
              required
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 focus:border-emerald-500 outline-none"
              required
            />
          </label>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 mb-3">Account Type</p>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="Buyer"
                  checked={form.role === 'Buyer'}
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-700">Buyer</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="Seller"
                  checked={form.role === 'Seller'}
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-slate-700">Seller</span>
              </label>
            </div>
          </div>
          {form.role === 'Seller' && (
            <div className="mt-4 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p>As a seller, you'll need to complete onboarding to verify your business before listing products.</p>
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-emerald-600 text-white py-2 text-sm font-semibold hover:bg-emerald-500 transition"
          >
            {status === 'loading' ? 'Creating account...' : 'Register Account'}
          </button>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </form>
        <div className="mt-6">          
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or sign up with</span>
              </div>
            </div>
            <div id="google-signup-button" className="w-full flex justify-center mt-4"></div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <a href="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">Sign in</a>
        </div>
      </div>
    </section>
  );
}

export default Register;
