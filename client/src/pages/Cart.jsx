import { useState } from 'react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // In a real application, you would fetch cart items from a store or API
  // For now, we'll use an empty cart as placeholder

  return (
    <div className="max-w-[96%] mx-auto py-8">
      <h1 className="text-2xl font-bold text-[#0f3d2e] mb-6">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet</p>
          <a 
            href="/marketplace" 
            className="inline-block bg-[#0f3d2e] hover:bg-[#124b38] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                    +
                  </button>
                </div>
                <div className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button className="text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t flex justify-end">
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>$0.00</span>
              </div>
              <button className="w-full bg-[#0f3d2e] hover:bg-[#124b38] text-white py-3 rounded-xl font-semibold">
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