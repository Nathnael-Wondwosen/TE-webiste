import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import AdminLayout from './components/admin/AdminLayout';
import SellerLayout from './components/seller/SellerLayout';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import OldAdminDashboard from './pages/AdminDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import AdminProducts from './pages/admin/AdminProducts';
import ProductApproval from './pages/admin/ProductApproval';
import SellerManagement from './pages/admin/SellerManagement';

import Cart from './pages/Cart';
import About from './pages/About';
import Eshop from './pages/Eshop';
import BusinessDirectory from './pages/BusinessDirectory';
import SellerStorefront from './pages/SellerStorefront';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerCustomers from './pages/seller/SellerCustomers';
import SellerMarketing from './pages/seller/SellerMarketing';
import SellerAnalytics from './pages/seller/SellerAnalytics';
import SellerSettings from './pages/seller/SellerSettings';
import SellerOnboarding from './pages/seller/SellerOnboarding';
import SellerProductCreate from './pages/seller/SellerProductCreate';
import SellerProductEdit from './pages/seller/SellerProductEdit';
import UserProfile from './pages/UserProfile';

function App() {
  const { user, status } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Admin route protection
  const AdminRoute = ({ children }) => {
    // If auth status is loading, show loading indicator
    if (status === 'loading') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      );
    }
    
    // If user object doesn't exist, redirect to login
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    // If user exists but is not an admin, redirect to home
    if (user.role !== 'Admin') {
      return <Navigate to="/" replace />;
    }
    
    // If user is admin, render children
    return children;
  };

  const SellerRoute = ({ children }) => {
    if (status === 'loading') {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (user.role !== 'Seller' && user.role !== 'ProspectiveSeller') {
      return <Navigate to="/" replace />;
    }

    return children;
  };
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isSellerRoute = location.pathname.startsWith('/seller');
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-0 md:pb-0">
      {!isAdminRoute && !isSellerRoute && <Navbar />}
      <main className="flex-1 w-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/business-directory" element={<BusinessDirectory />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/eshop" element={<Eshop />} />
          <Route path="/shop/:slug" element={<SellerStorefront />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/services" element={<BusinessDirectory />} />
          <Route path="/media" element={<BusinessDirectory />} />
          <Route path="/events" element={<BusinessDirectory />} />
          
          {/* Admin routes - these will be handled by AdminLayout */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/approvals" element={<ProductApproval />} />
            <Route path="sellers" element={<SellerManagement />} />
            
            <Route path="categories" element={<div className="p-6">Categories Management</div>} />
            <Route path="orders" element={<div className="p-6">Orders Management</div>} />
            <Route path="analytics" element={<div className="p-6">Analytics Dashboard</div>} />
          </Route>
          
          {/* Redirect /admin to /admin/ to load the dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/" replace />} />

          {/* Seller routes - handled by SellerLayout */}
          <Route path="/seller/*" element={
            <SellerRoute>
              <SellerLayout />
            </SellerRoute>
          }>
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/new" element={<SellerProductCreate />} />
            <Route path="products/:id/edit" element={<SellerProductEdit />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="customers" element={<SellerCustomers />} />
            <Route path="marketing" element={<SellerMarketing />} />
            <Route path="analytics" element={<SellerAnalytics />} />
            <Route path="settings" element={<SellerSettings />} />
            <Route path="onboarding" element={<SellerOnboarding />} />
          </Route>
          <Route path="/seller" element={<Navigate to="/seller/" replace />} />
          

        </Routes>
      </main>
      {!isAdminRoute && !isSellerRoute && (
        <>
          <Footer />
          <ChatBot />
        </>
      )}
    </div>
  );
}

export default App;
