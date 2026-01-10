import { useState, useEffect } from 'react';
import { Home, Search, ShoppingCart, User, X, Menu } from 'lucide-react';

const BottomNav = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    // Show bottom nav only on mobile screens
    const handleResize = () => {
      setIsVisible(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      {showNav ? (
        <div className="relative">
          <nav className="bg-gradient-to-b from-[#0f3d2e] to-[#134a36] border border-emerald-800 shadow-2xl rounded-2xl h-14 w-64 flex items-center justify-around px-2 mb-2">
            <a href="/" className="flex flex-col items-center justify-center flex-1 text-white hover:text-emerald-200 transition-colors h-full">
              <Home className="h-5 w-5" />
            </a>
            <a href="/marketplace" className="flex flex-col items-center justify-center flex-1 text-white hover:text-emerald-200 transition-colors h-full">
              <Search className="h-5 w-5" />
            </a>
            <a href="/cart" className="flex flex-col items-center justify-center flex-1 text-white hover:text-emerald-200 transition-colors h-full relative">
              <ShoppingCart className="h-5 w-5" />
            </a>
            <a href="/register" className="flex flex-col items-center justify-center flex-1 text-white hover:text-emerald-200 transition-colors h-full">
              <User className="h-5 w-5" />
            </a>
          </nav>
          <button 
            onClick={() => setShowNav(false)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
      <button 
        onClick={() => setShowNav(!showNav)}
        className="bg-gradient-to-b from-[#0f3d2e] to-[#134a36] text-white rounded-full p-3 shadow-2xl hover:shadow-3xl transition-shadow"
      >
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
};

export default BottomNav;