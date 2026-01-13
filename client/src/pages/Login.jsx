import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, googleAuth } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const googleButtonRef = useRef(null);
  
  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/');
    }
    
    // Initialize Google button when component mounts
    handleGoogleLogin();
  }, [user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser(form));
  };
  
  const handleGoogleLogin = () => {
    try {
      // Load Google SDK if not already loaded
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          initGoogleLogin();
        };
        script.onerror = () => {
          console.error('Failed to load Google SDK');
          alert('Failed to load Google authentication. Please check your connection and try again.');
        };
        document.head.appendChild(script);
      } else {
        initGoogleLogin();
      }
    } catch (error) {
      console.error('Error in Google login:', error);
      alert('An error occurred during Google login. Please try again.');
    }
  };
  
  const initGoogleLogin = () => {
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
        const buttonDiv = document.getElementById('google-login-button');
        if (buttonDiv) {
          // Render the Google Identity Services button
          google.accounts.id.renderButton(
            buttonDiv,
            { theme: 'outline', size: 'large', width: '400', text: 'signin_with' }
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
        dispatch(googleAuth(response.credential));
      } else {
        console.error('No credential received from Google');
        alert('Failed to authenticate with Google. Please try again.');
      }
    } catch (error) {
      console.error('Error handling Google credential response:', error);
      alert('An error occurred during Google authentication. Please try again.');
    }
  };

  return (
    <section className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-3xl shadow">
        <h1 className="text-2xl font-semibold mb-6">Login to TradeEthiopia</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="w-full rounded-full bg-emerald-600 text-white py-2 text-sm font-semibold hover:bg-emerald-500 transition"
          >
            {status === 'loading' ? 'Authenticating...' : 'Login'}
          </button>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div id="google-login-button" className="w-full flex justify-center"></div>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-slate-600">
          Don't have an account? <a href="/register" className="font-semibold text-emerald-600 hover:text-emerald-500">Sign up</a>
        </div>
      </div>
    </section>
  );
}

export default Login;
