import { useEffect, useState } from 'react';
import api from '../services/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/cart');
      // Handle both response formats:
      // 1. When cart exists: data is the full order object { products: [...], total, ... }
      // 2. When no cart: data is { products: [], total: 0 }
      const cartProducts = Array.isArray(data.products) ? data.products : [];
      setCartItems(cartProducts);
    } catch (error) {
      console.error('Error loading cart', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (productId, nextQuantity) => {
    try {
      await api.put(`/orders/cart/${productId}`, { quantity: nextQuantity });
      await loadCart();
    } catch (error) {
      console.error('Error updating cart item', error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/orders/cart/${productId}`);
      await loadCart();
    } catch (error) {
      console.error('Error removing cart item', error);
    }
  };

  return (
    <div className="max-w-[96%] mx-auto py-8">
      <h1 className="text-2xl font-bold text-[#0f3d2e] mb-6">Shopping Cart</h1>
      
      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet</p>
          <a 
            href="/eshop" 
            className="inline-block bg-[#0f3d2e] hover:bg-[#124b38] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product?._id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                <img 
                  src={item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80'} 
                  alt={item.product?.name || 'Product'} 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product?.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemove(item.product?._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t flex justify-end">
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              <button 
                onClick={async () => {
                  if (cartItems.length > 0) {
                    try {
                      await api.post('/orders/checkout', {});
                      // Redirect to order confirmation or show success message
                      alert('Checkout successful!');
                      loadCart(); // Reload cart to see updated state
                    } catch (error) {
                      console.error('Checkout error', error);
                      alert('Error during checkout. Please try again.');
                    }
                  } else {
                    alert('Your cart is empty');
                  }
                }}
                className="w-full bg-[#0f3d2e] hover:bg-[#124b38] text-white py-3 rounded-xl font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
