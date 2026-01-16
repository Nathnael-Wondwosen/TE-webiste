import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart, ShoppingCart, Share2 } from 'lucide-react';
import api from '../services/api';

let favoritesCache = null;
let favoritesPromise = null;

// Cart cache
let cartCache = null;
let cartPromise = null;

const getFavoritesCache = async () => {
  if (favoritesCache) return favoritesCache;
  if (!favoritesPromise) {
    favoritesPromise = api.get('/users/favorites').then((response) => {
      const favorites = response.data?.favorites || [];
      favoritesCache = new Set(favorites.map((id) => id.toString()));
      return favoritesCache;
    });
  }
  return favoritesPromise;
};

const updateFavoritesCache = (productId, shouldAdd) => {
  if (!favoritesCache) return;
  if (shouldAdd) {
    favoritesCache.add(productId);
  } else {
    favoritesCache.delete(productId);
  }
};

const getCartCache = async () => {
  if (cartCache) return cartCache;
  if (!cartPromise) {
    cartPromise = api.get('/orders/cart').then((response) => {
      const cartItems = response.data.products || [];
      cartCache = new Set(cartItems.map((item) => item.product?._id.toString()));
      return cartCache;
    }).catch(() => {
      // If there's an error, return empty set
      cartCache = new Set();
      return cartCache;
    });
  }
  return cartPromise;
};

const updateCartCache = (productId, shouldAdd) => {
  if (!cartCache) return;
  if (shouldAdd) {
    cartCache.add(productId);
  } else {
    cartCache.delete(productId);
  }
};

// Function to reset cart cache (call after cart operations)
const resetCartCache = () => {
  cartCache = null;
  cartPromise = null;
};

function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !product?._id) return;
    
    // Load both favorites and cart status
    Promise.all([
      getFavoritesCache().then((favorites) => setIsFavorite(favorites.has(product._id))),
      getCartCache().then((cartItems) => setInCart(cartItems.has(product._id)))
    ]).catch(() => {
      // Fallback if there's an error
      getFavoritesCache().then((favorites) => setIsFavorite(favorites.has(product._id))).catch(() => {});
      getCartCache().then((cartItems) => setInCart(cartItems.has(product._id))).catch(() => {});
    });
  }, [product?._id]);

  const requireAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return false;
    }
    return true;
  };

  const handleToggleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!requireAuth()) return;
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      if (next) {
        await api.post('/users/favorites', { productId: product._id });
      } else {
        await api.delete(`/users/favorites/${product._id}`);
      }
      updateFavoritesCache(product._id, next);
      // Reset cart cache to refresh it after any user interaction
      resetCartCache();
    } catch (error) {
      setIsFavorite(!next);
      console.error('Favorite update failed', error);
    }
  };

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!requireAuth()) return;
    
    try {
      await api.post('/orders/cart', { productId: product._id, quantity: 1 });
      // Update cart cache and state
      updateCartCache(product._id, true);
      setInCart(true);
    } catch (error) {
      console.error('Add to cart failed', error);
    }
  };

  const handleShare = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const url = `${window.location.origin}/product/${product?._id ?? ''}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Product link copied.');
      }
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col border border-slate-100 relative">
      <div
        className="h-40 bg-cover bg-center"
        style={{
          backgroundImage: product?.images?.length
            ? `url(${product.images[0].url})`
            : "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80')",
        }}
      />
      <div className="absolute top-3 right-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-white text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-white"></span>
          Pro
        </span>
      </div>
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <button
          onClick={handleToggleFavorite}
          className={`h-9 w-9 rounded-full border flex items-center justify-center shadow-sm transition ${
            isFavorite
              ? 'bg-rose-500 border-rose-500 text-white'
              : 'bg-white/90 border-white text-slate-700 hover:text-rose-500'
          }`}
          aria-label="Toggle favorite"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>
        <button
          onClick={handleAddToCart}
          className={`h-9 w-9 rounded-full border flex items-center justify-center shadow-sm transition ${
            inCart
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'bg-white/90 border-white text-slate-700 hover:text-emerald-600'
          }`}
          aria-label={inCart ? "In cart" : "Add to cart"}
        >
          <ShoppingCart className={`h-4 w-4 ${inCart ? 'fill-white' : ''}`} />
        </button>
        <button
          onClick={handleShare}
          className="h-9 w-9 rounded-full border border-white bg-white/90 text-slate-700 flex items-center justify-center shadow-sm hover:text-slate-900 transition"
          aria-label="Share product"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
      <div className="px-4 py-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-sm md:text-lg font-semibold text-[#0f3d2e]">
              {product?.name}
            </h3>
            <p className="text-xs md:text-sm text-slate-500">
              {product?.country || 'Ethiopia'}
            </p>
          </div>
          <div className="text-right text-xs md:text-sm">
            <p className="font-semibold text-emerald-600">
              {product?.price ? `$${product.price}/${product.unit || 'unit'}` : 'Quote'}
            </p>
            <p className="text-slate-400">
              {product?.quantity ? `${product.quantity} pcs` : 'Available'}
            </p>
          </div>
        </div>
        <div className="mt-3 text-xs md:text-sm text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 md:gap-2 rounded-full bg-emerald-50 px-2 md:px-3 py-0.5 md:py-1 text-emerald-700 text-xs font-semibold">
              Verified
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 md:px-3 py-0.5 md:py-1 text-amber-700 text-xs font-semibold">
              {(product?.averageRating || product?.rating || 0).toFixed?.(1) || (product?.averageRating || product?.rating || 0)} ★
              <span className="text-[10px] text-amber-600/80">
                ({product?.ratingsCount || 0})
              </span>
            </span>
          </div>
          <Link
            to={`/product/${product?._id ?? ''}`}
            className="inline-flex items-center gap-0.5 md:gap-1 text-emerald-700 font-semibold text-xs md:text-sm"
          >
            View More <ArrowUpRight className="h-3 md:h-4 w-3 md:w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
