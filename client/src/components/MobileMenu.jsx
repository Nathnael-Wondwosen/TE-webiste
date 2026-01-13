import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose, navItems }) => {
  if (!isOpen) return null;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
      <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#0f3d2e]">Menu</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <nav className="py-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="block px-6 py-3 text-base font-medium text-[#0f3d2e] hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex flex-col gap-3 px-6 py-3">
            <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
              <span className="text-xs font-semibold text-emerald-700">EN</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">አማ</span>
            </div>
            
            {user ? (
              // Show profile section when user is logged in
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{user.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (user.role === 'Admin') {
                        navigate('/admin');
                      } else {
                        // Add user dashboard route when available
                        // navigate('/dashboard');
                      }
                      onClose();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    {user.role === 'Admin' ? 'Admin Dashboard' : 'My Profile'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // Show join now button when user is not logged in
              <a
                href="/register"
                className="bg-[#f7b733] hover:bg-[#f5a623] text-black font-semibold px-4 py-2 rounded-full text-sm text-center inline-block w-full"
              >
                Join Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;