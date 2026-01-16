import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, getMe } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [lastChecked, setLastChecked] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: 'https://bunatalecoffee.com', label: 'Bunatale' },
    { href: '/eshop', label: 'E-Shop' },
    { href: 'https://tesbinn.com', label: 'Training & Consultancy' },
    { href: 'https://tradethiopiantv.com', label: 'TradeXTV' },
    { href: 'https://tradethiopiaexpo.com', label: 'Expo' },
    { href: '/business-directory', label: 'Business Directory' },
  ];
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setProfileDropdownOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="border-b border-slate-100">
        <div className="max-w-[96%] mx-auto flex flex-wrap items-center justify-between gap-4 py-3">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="h-10 w-10 rounded-full bg-[#0f3d2e] flex items-center justify-center text-white font-bold">
              TE
            </div>
            <div className="leading-tight">
              <p className="heading-font text-xl font-semibold text-[#0f3d2e]">
                TradeEthiopia
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Business Hub
              </p>
            </div>
          </a>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#0f3d2e]">
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 md:hidden text-[#0f3d2e] hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                <span className="text-xs font-semibold text-emerald-700">EN</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700">አማ</span>
              </div>
              <a href="/about" className="flex items-center gap-2 font-medium hover:text-emerald-600 transition-colors">
                About
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              </a>
              <a href="/cart" className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                  />
                </svg>
                <span className="hidden sm:inline">Cart</span>
              </a>
              
              {user ? (
                // Show profile dropdown when user is logged in
                <div className="relative">
                  <button
                    onClick={async () => {
                      const now = Date.now();
                      // Refresh user data if it's been more than 30 seconds since last check
                      if (now - lastChecked > 30000) {
                        try {
                          await dispatch(getMe());
                          setLastChecked(now);
                        } catch (error) {
                          console.error('Error refreshing user data:', error);
                        }
                      }
                      setProfileDropdownOpen(!profileDropdownOpen);
                    }}
                    className="flex items-center gap-2 bg-[#f7b733] hover:bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-full transition-colors"
                    aria-expanded={profileDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{user.name || user.email}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{user.name || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {(user.role === 'Seller' || user.role === 'ProspectiveSeller') && (
                          <>
                            <button
                              onClick={() => {
                                navigate('/seller');
                                setProfileDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              Seller Hub
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  // Fetch seller profile to get the shop slug
                                  const response = await api.get('/seller/profile');
                                  const sellerProfile = response.data;
                                  if (sellerProfile.slug) {
                                    navigate(`/shop/${sellerProfile.slug}`);
                                  } else {
                                    // Fallback if no slug exists
                                    const fallbackSlug = user.name?.toLowerCase().replace(/\s+/g, '-') || user._id;
                                    navigate(`/shop/${fallbackSlug}`);
                                  }
                                } catch (error) {
                                  // Fallback if profile fetch fails
                                  const fallbackSlug = user.name?.toLowerCase().replace(/\s+/g, '-') || user._id;
                                  navigate(`/shop/${fallbackSlug}`);
                                }
                                setProfileDropdownOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              Visit My Shop
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            if (user.role === 'Admin') {
                              navigate('/admin');
                            } else {
                              // Add user dashboard route when available
                              // navigate('/dashboard');
                            }
                            setProfileDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          {user.role === 'Admin' ? 'Admin Dashboard' : 'My Profile'}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Show join now button when user is not logged in
                <a href="/register" className="bg-[#f7b733] hover:bg-[#f5a623] text-black font-semibold px-5 py-2 rounded-full">
                  Join Now
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-gradient-to-r from-[#0f3d2e] via-[#155e42] to-[#0f3d2e] text-white hidden md:block">
        <div className="max-w-[96%] mx-auto flex flex-wrap items-center gap-6 py-3 text-sm">
          <a href="/" className="flex items-center gap-2 hover:text-emerald-200 transition-colors">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Home
          </a>
          <a href="/eshop" className="flex items-center gap-2 hover:text-emerald-200 transition-colors">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            E-Shop
          </a>
          <a href="https://bunatalecoffee.com" className="flex items-center gap-2 hover:text-emerald-200 transition-colors" target="_blank" rel="noreferrer">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Bunatale
          </a>

          <a href="https://tesbinn.com" className="flex items-center gap-2 hover:text-emerald-200 transition-colors" target="_blank" rel="noreferrer">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Training & Consultancy
          </a>
          <a href="https://tradethiopiantv.com" className="flex items-center gap-2 hover:text-emerald-200 transition-colors" target="_blank" rel="noreferrer">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            TradeXTV
          </a>
          <a href="https://tradethiopiaexpo.com" className="flex items-center gap-2 hover:text-emerald-200 transition-colors" target="_blank" rel="noreferrer">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Expo
          </a>
          <a href="/business-directory" className="flex items-center gap-2 hover:text-emerald-200 transition-colors">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Business Directory
          </a>
        </div>
      </nav>
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        navItems={navItems} 
      />
    </header>
  );
};

export default Navbar;
