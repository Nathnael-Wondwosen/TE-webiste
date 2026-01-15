import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import api from '../../services/api';

const SellerLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [shopSlug, setShopSlug] = useState('');
  const [onboardingCompleted, setOnboardingCompleted] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      path: '/seller',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'products',
      label: 'Products',
      path: '/seller/products',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      id: 'orders',
      label: 'Orders',
      path: '/seller/orders',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: 'customers',
      label: 'Customers',
      path: '/seller/customers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-1a4 4 0 00-5-3.87M9 20H4v-1a4 4 0 015-3.87M16 4a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'marketing',
      label: 'Marketing',
      path: '/seller/marketing',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-2v13M9 6L3 8v11l6-2m0-11v13" />
        </svg>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/seller/analytics',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3v18M6 8v13M16 13v8M21 6v15" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/seller/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 4a7.94 7.94 0 00-.18-1.7l2.12-1.64-2-3.46-2.48 1a7.98 7.98 0 00-2.94-1.7l-.38-2.64h-4l-.38 2.64a7.98 7.98 0 00-2.94 1.7l-2.48-1-2 3.46 2.12 1.64A7.94 7.94 0 003.06 12c0 .58.06 1.15.18 1.7l-2.12 1.64 2 3.46 2.48-1c.86.74 1.85 1.33 2.94 1.7l.38 2.64h4l.38-2.64a7.98 7.98 0 002.94-1.7l2.48 1 2-3.46-2.12-1.64c.12-.55.18-1.12.18-1.7z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/seller/profile');
        setShopSlug(response.data.slug || '');
        setOnboardingCompleted(Boolean(response.data.onboardingCompleted));
      } catch (error) {
        console.error('Seller profile load error', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!onboardingCompleted && !location.pathname.startsWith('/seller/onboarding')) {
      navigate('/seller/onboarding');
    }
  }, [onboardingCompleted, location.pathname, navigate]);

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white/95 backdrop-blur border-r border-slate-200 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col h-full ${sidebarCollapsed ? 'w-20' : 'w-64'} transition-[width] duration-300 ease-in-out`}
      >
        <div className={`flex items-center p-3 border-b border-slate-200 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="h-9 w-9 rounded-xl bg-[#0f3d2e] flex items-center justify-center text-white font-bold text-sm">
              TE
            </div>
            <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              <p className="text-base font-semibold text-slate-900">TradeEthiopia</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.24em]">Seller Hub</p>
            </div>
          </div>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-2">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3`}>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              Seller Workspace
            </p>
            <button
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <nav className={`flex-1 overflow-y-auto ${sidebarCollapsed ? 'p-2' : 'p-2 md:p-4'}`}>
          <ul className={`space-y-1 ${sidebarCollapsed ? 'pt-1' : ''}`}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    location.pathname === item.path
                      ? 'bg-amber-100/70 text-amber-900 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  } ${sidebarCollapsed ? 'justify-center px-2 w-12 mx-auto' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    location.pathname === item.path ? 'bg-amber-200/60 text-amber-900' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.icon}
                  </span>
                  <span className={`text-sm font-medium transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div className={`flex items-center gap-3 mb-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="h-9 w-9 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name || 'Seller'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              Logout
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/90 backdrop-blur border-b border-slate-200/70 z-40 sticky top-0">
          <div className="flex items-center justify-between px-4 py-2.5 md:px-6">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-slate-900">
                {navItems.find((item) => location.pathname === item.path)?.label || 'Seller Hub'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/seller/products/new"
                className="hidden sm:inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-200 transition"
              >
                Add Product
              </a>
              {shopSlug && (
                <a
                  href={`/shop/${shopSlug}?preview=true`}
                  className="hidden sm:inline-flex rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Preview Storefront
                </a>
              )}
              <div className="hidden md:block h-6 w-px bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div className="hidden md:flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-slate-700 truncate max-w-xs">{user?.name || 'Seller'}</span>
                  <span className="text-[11px] text-slate-500">Seller</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-0 bg-slate-100 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-sm md:text-[14px] text-slate-900">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
