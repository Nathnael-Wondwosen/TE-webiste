import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import About from './pages/About';
import Eshop from './pages/Eshop';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-0 md:pb-0">
      <Navbar />
      <main className="flex-1 w-full overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/eshop" element={<Eshop />} />
          <Route path="/services" element={<Marketplace />} />
          <Route path="/media" element={<Marketplace />} />
          <Route path="/events" element={<Marketplace />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;
