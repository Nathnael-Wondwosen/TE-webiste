import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import MediaLightbox from '../components/MediaLightbox';

const SellerStorefront = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMediaItems, setActiveMediaItems] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeIndices, setActiveIndices] = useState({});
  
  const loadCartStatus = async () => {
    try {
      const response = await api.get('/orders/cart');
      const cartProducts = response.data.products || [];
      const cartIds = new Set(cartProducts.map(item => item.product?._id));
      setCartItems(cartIds);
    } catch (error) {
      console.error('Error loading cart status', error);
      setCartItems(new Set());
    }
  };
  const [touchStart, setTouchStart] = useState({});

  const requireAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return false;
    }
    return true;
  };

  const handleAddToCart = async (event, productId) => {
    event.preventDefault();
    if (!requireAuth()) return;
    try {
      await api.post('/orders/cart', { productId, quantity: 1 });
      // Update local cart status
      setCartItems(prev => new Set([...prev, productId]));
    } catch (err) {
      console.error('Add to cart failed', err);
    }
  };

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/shops/${slug}`);
        setProfile(response.data.profile);
        setProducts(response.data.products || []);
        setError('');
        
        // Load cart status after products are loaded
        await loadCartStatus();
      } catch (err) {
        console.error('Shop load error', err);
        setError('Shop not available right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [slug]);

  const buildMediaItems = (product) => {
    const imageItems = (product.images || []).map((image) => ({
      type: 'image',
      url: image.url,
      title: product.name,
    }));
    const videoItems = (product.videos || []).map((video) => ({
      type: 'video',
      provider: video.provider,
      embedUrl: video.embedUrl || video.url,
      url: video.url,
      thumbnail: video.thumbnail || imageItems[0]?.url || '',
      title: product.name,
    }));
    return [...imageItems, ...videoItems];
  };

  const getActiveIndex = (productId, mediaItems) => {
    const index = activeIndices[productId] ?? 0;
    if (!mediaItems.length) return 0;
    return Math.max(0, Math.min(index, mediaItems.length - 1));
  };

  const setActiveIndex = (productId, index) => {
    setActiveIndices((prev) => ({ ...prev, [productId]: index }));
  };

  const handleTouchStart = (event, productId) => {
    const touch = event.touches[0];
    if (!touch) return;
    setTouchStart((prev) => ({ ...prev, [productId]: { x: touch.clientX, y: touch.clientY } }));
  };

  const handleTouchEnd = (event, productId, mediaItems) => {
    const touch = event.changedTouches[0];
    const start = touchStart[productId];
    if (!touch || !start) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 35 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    const current = getActiveIndex(productId, mediaItems);
    const next = deltaX < 0
      ? (current + 1) % mediaItems.length
      : (current - 1 + mediaItems.length) % mediaItems.length;
    setActiveIndex(productId, next);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Shop not found</h1>
        <p className="text-slate-500 mt-2">{error || 'This shop is unavailable.'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
      <div className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/15 flex items-center justify-center text-2xl font-semibold">
                {profile.shopName?.charAt(0).toUpperCase() || 'S'}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-emerald-100">Seller Shop</p>
                <h1 className="text-2xl sm:text-3xl font-semibold mt-2">{profile.shopName || 'Shop'}</h1>
                <p className="text-emerald-100 mt-2 max-w-2xl text-sm">
                  {profile.bio || 'Curated products from this seller.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-white/10 px-4 py-2">
                {profile.contactEmail || profile.seller?.email}
              </span>
              {profile.contactPhone && (
                <span className="rounded-full bg-white/10 px-4 py-2">
                  {profile.contactPhone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Products</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {products.length} items
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 hover:shadow-md transition">
                  <div
                    className="relative h-44 sm:h-40 rounded-xl bg-slate-100 mb-4 flex items-center justify-center text-xs text-slate-400 overflow-hidden"
                    onTouchStart={(event) => handleTouchStart(event, product._id)}
                    onTouchEnd={(event) => {
                      const mediaItems = buildMediaItems(product);
                      if (mediaItems.length > 1) {
                        handleTouchEnd(event, product._id, mediaItems);
                      }
                    }}
                  >
                    {(() => {
                      const mediaItems = buildMediaItems(product);
                      if (!mediaItems.length) {
                        return 'Product Media';
                      }
                      const activeIndex = getActiveIndex(product._id, mediaItems);
                      const primary = mediaItems[activeIndex];
                      const thumb = primary.type === 'image' ? primary.url : (primary.thumbnail || '');
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMediaIndex(activeIndex);
                            setActiveMediaItems(mediaItems);
                            setLightboxOpen(true);
                          }}
                          className="group relative h-full w-full"
                        >
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={product.name}
                              className="h-full w-full object-cover rounded-xl"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                              Product Media
                            </div>
                          )}
                          {(product.videos || []).length > 0 && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs font-semibold">
                              Play video
                            </span>
                          )}
                          {mediaItems.length > 1 && (
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] text-white">
                              {activeIndex + 1}/{mediaItems.length}
                            </div>
                          )}
                        </button>
                      );
                    })()}
                  </div>
                  {(() => {
                    const mediaItems = buildMediaItems(product);
                    if (mediaItems.length <= 1) return null;
                    return (
                      <>
                        <div className="mb-4 hidden sm:flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const current = getActiveIndex(product._id, mediaItems);
                              const next = (current - 1 + mediaItems.length) % mediaItems.length;
                              setActiveIndex(product._id, next);
                            }}
                            className="h-7 w-7 rounded-full border border-slate-200 text-xs text-slate-500 hover:bg-slate-50"
                            aria-label="Previous media"
                          >
                            ‹
                          </button>
                          <div className="flex-1 overflow-x-auto">
                            <div className="flex items-center gap-2">
                              {mediaItems.map((media, index) => (
                                <button
                                  key={`${media.type}-${index}`}
                                  type="button"
                                  onClick={() => setActiveIndex(product._id, index)}
                                  className={`relative h-10 w-14 overflow-hidden rounded-lg border ${
                                    getActiveIndex(product._id, mediaItems) === index
                                      ? 'border-emerald-300'
                                      : 'border-slate-200'
                                  }`}
                                >
                                  <img
                                    src={media.type === 'image' ? media.url : (media.thumbnail || media.url)}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                  {media.type === 'video' && (
                                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-semibold text-white">
                                      Video
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const current = getActiveIndex(product._id, mediaItems);
                              const next = (current + 1) % mediaItems.length;
                              setActiveIndex(product._id, next);
                            }}
                            className="h-7 w-7 rounded-full border border-slate-200 text-xs text-slate-500 hover:bg-slate-50"
                            aria-label="Next media"
                          >
                            ›
                          </button>
                        </div>
                        <div className="mb-4 flex items-center justify-center gap-2 sm:hidden">
                          {mediaItems.map((_, index) => (
                            <button
                              key={`dot-${index}`}
                              type="button"
                              onClick={() => setActiveIndex(product._id, index)}
                              className={`h-2.5 w-2.5 rounded-full ${
                                getActiveIndex(product._id, mediaItems) === index
                                  ? 'bg-emerald-500'
                                  : 'bg-slate-200'
                              }`}
                              aria-label={`Show media ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    );
                  })()}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{product.category?.name || 'General'}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-700">
                      ETB {Number(product.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                    {product.description || 'High quality product from this seller.'}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      to={`/product/${product._id}`}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      View details
                    </Link>
                    <button
                      onClick={(event) => handleAddToCart(event, product._id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        cartItems.has(product._id)
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {cartItems.has(product._id) ? 'In Cart' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              ))}
              {!products.length && (
                <div className="col-span-full text-sm text-slate-500">
                  No products available yet.
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-900">Shop Details</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Seller</p>
                  <p className="text-slate-900 font-medium mt-1">{profile.seller?.name || 'Seller'}</p>
                </div>
                {profile.address?.city && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Location</p>
                    <p className="text-slate-900 font-medium mt-1">{profile.address.city}</p>
                  </div>
                )}
                {profile.policies?.shipping && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Shipping</p>
                    <p className="text-slate-700 mt-1">{profile.policies.shipping}</p>
                  </div>
                )}
                {profile.policies?.returns && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Returns</p>
                    <p className="text-slate-700 mt-1">{profile.policies.returns}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-900">Contact</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>{profile.contactEmail || profile.seller?.email}</p>
                {profile.contactPhone && <p>{profile.contactPhone}</p>}
                {profile.socials?.website && (
                  <a
                    href={profile.socials.website}
                    className="text-emerald-700 hover:text-emerald-800"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
    <MediaLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        mediaItems={activeMediaItems}
        initialIndex={activeMediaIndex}
      />
    </>
  );
};

export default SellerStorefront;
