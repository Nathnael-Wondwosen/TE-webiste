import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { logout } from '../../redux/authSlice';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Navigation items for admin
  const navItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      path: '/admin', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: 'users', 
      label: 'User Management', 
      path: '/admin/users', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      id: 'products', 
      label: 'Products', 
      path: '/admin/products', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      id: 'approvals', 
      label: 'Approvals', 
      path: '/admin/products/approvals', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" />
        </svg>
      )
    },
    { 
      id: 'categories', 
      label: 'Categories', 
      path: '/admin/categories', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      path: '/admin/orders', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      path: '/admin/analytics', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
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
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.24em]">Admin Panel</p>
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
              Workspace
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
                      ? 'bg-emerald-100/70 text-emerald-900 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  } ${sidebarCollapsed ? 'justify-center px-2 w-12 mx-auto' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    location.pathname === item.path ? 'bg-emerald-200/60 text-emerald-900' : 'bg-slate-100 text-slate-700'
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
            <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name || 'Admin'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors ${
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

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navigation bar */}
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
                {navItems.find(item => location.pathname === item.path)?.label || 'Admin Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200 text-gray-500 hover:text-gray-700 hover:bg-slate-50 transition relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>

              <div className="hidden md:block h-6 w-px bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden md:flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-slate-700 truncate max-w-xs">{user?.name || 'Admin'}</span>
                  <span className="text-[11px] text-slate-500">Administrator</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-0 bg-slate-100 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-sm md:text-[14px] text-slate-900">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
