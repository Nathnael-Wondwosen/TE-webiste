import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import MediaLightbox from '../components/MediaLightbox';

function ProductDetails() {
  const { id } = useParams();
  const { items } = useSelector((state) => state.products);
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [savingReview, setSavingReview] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [thumbTouchStart, setThumbTouchStart] = useState(null);

  const cachedProduct = useMemo(() => items.find((item) => item._id === id), [items, id]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (cachedProduct) {
      setProduct(cachedProduct);
      setLoading(false);
    } else if (id) {
      loadProduct();
    }
  }, [cachedProduct, id]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const { data } = await api.get(`/products/${id}/reviews`);
        setReviews(data || []);
      } catch (error) {
        console.error('Error loading reviews', error);
      }
    };
    if (id) {
      loadReviews();
    }
  }, [id]);

  useEffect(() => {
    const loadSimilar = async () => {
      if (!product) return;
      try {
        const categorySlug = product.category?.slug;
        const query = categorySlug ? `?categorySlug=${categorySlug}&limit=6` : '?limit=6';
        const { data } = await api.get(`/products${query}`);
        const results = (data.data || []).filter((item) => item._id !== product._id);
        setSimilarProducts(results.slice(0, 3));
      } catch (error) {
        console.error('Error loading similar products', error);
        setSimilarProducts([]);
      }
    };
    loadSimilar();
  }, [product]);

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      setSavingReview(true);
      await api.post(`/products/${id}/reviews`, { rating, comment });
      const { data } = await api.get(`/products/${id}/reviews`);
      setReviews(data || []);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review', error);
    } finally {
      setSavingReview(false);
    }
  };

  const averageRating = product?.averageRating || product?.rating || 0;
  const ratingsCount = product?.ratingsCount || reviews.length;
  const mediaItems = [
    ...(product?.images || []).map((image) => ({
      type: 'image',
      url: image.url,
      title: product?.name,
    })),
    ...(product?.videos || []).map((video) => ({
      type: 'video',
      provider: video.provider,
      embedUrl: video.embedUrl || video.url,
      url: video.url,
      thumbnail: video.thumbnail,
      title: product?.name,
    })),
  ];

  const handleThumbTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    setThumbTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleThumbTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    if (!touch || !thumbTouchStart || mediaItems.length <= 1) return;
    const deltaX = touch.clientX - thumbTouchStart.x;
    const deltaY = touch.clientY - thumbTouchStart.y;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    const next = deltaX < 0
      ? (activeMediaIndex + 1) % mediaItems.length
      : (activeMediaIndex - 1 + mediaItems.length) % mediaItems.length;
    setActiveMediaIndex(next);
  };

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-slate-500">Loading product...</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-slate-500">Product not found.</p>
      </section>
    );
  }

  return (
    <>
      <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-[1fr,380px]">
        <div className="bg-white rounded-3xl shadow p-6">
          <div className="mb-5 overflow-hidden rounded-2xl bg-slate-100">
            {mediaItems.length ? (
              <button
                type="button"
                onClick={() => {
                  setActiveMediaIndex(0);
                  setLightboxOpen(true);
                }}
                className="block w-full"
              >
                <img
                  src={mediaItems[0].type === 'image' ? mediaItems[0].url : (mediaItems[0].thumbnail || product.images?.[0]?.url)}
                  alt={product.name}
                  className="h-72 w-full object-cover"
                />
              </button>
            ) : (
              <div className="flex h-72 w-full items-center justify-center text-sm text-slate-400">
                No media available
              </div>
            )}
          </div>
          {mediaItems.length > 1 && (
            <div className="mb-6">
              <div className="hidden sm:flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Media</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)}
                    className="h-8 w-8 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                    aria-label="Previous media"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length)}
                    className="h-8 w-8 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                    aria-label="Next media"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div
                className="grid grid-cols-3 gap-3"
                onTouchStart={handleThumbTouchStart}
                onTouchEnd={handleThumbTouchEnd}
              >
              {mediaItems.map((media, index) => (
                <button
                  key={`${media.type}-${index}`}
                  type="button"
                  onClick={() => {
                    setActiveMediaIndex(index);
                    setLightboxOpen(true);
                  }}
                  className={`group relative overflow-hidden rounded-xl border ${
                    index === activeMediaIndex ? 'border-emerald-300' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={media.type === 'image' ? media.url : (media.thumbnail || product.images?.[0]?.url)}
                    alt={product.name}
                    className="h-24 w-full object-cover"
                  />
                  {media.type === 'video' && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs font-semibold">
                      Play video
                    </span>
                  )}
                </button>
              ))}
              </div>
            </div>
          )}
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
          <p className="text-slate-500 mb-4">
            {product.description || 'Detailed product description coming soon.'}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Price</p>
              <p className="text-lg font-semibold text-emerald-600">
                ${product.price} / {product.unit || 'unit'}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Available Quantity</p>
              <p className="text-lg font-semibold">{product.quantity || 'N/A'}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-700 font-semibold">
              {averageRating.toFixed(1)}
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </span>
            <span>{ratingsCount} ratings</span>
          </div>
          <div className="mt-6 border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-500">Country</p>
            <p className="font-semibold">{product.country || 'Ethiopia'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400 mb-3">Seller Snapshot</p>
            <p className="font-semibold">TradeEthiopia Verified Partner</p>
            <p className="text-sm text-slate-500 mt-2">
              Access export documentation, compliance, and logistics support for this listing.
            </p>
          </div>
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-300 mb-2">
              Local & international delivery
            </p>
            <p className="font-semibold text-lg">Order with confidence</p>
            <p className="text-sm mt-2">Support available via TradeTV, live agents, and logistic partners.</p>
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Ratings & Reviews</h2>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500">No reviews yet. Be the first to rate this product.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">{review.user?.name || 'User'}</span>
                    <span className="inline-flex items-center gap-1 text-amber-600">
                      {review.rating}
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </span>
                  </div>
                  {review.comment && <p className="text-sm text-slate-600 mt-2">{review.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Leave a rating</h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`h-9 w-9 rounded-full border ${
                    rating >= value ? 'border-amber-400 bg-amber-100 text-amber-700' : 'border-slate-200 text-slate-500'
                  }`}
                >
                  <Star className={`h-4 w-4 ${rating >= value ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Share your experience (optional)"
              className="w-full min-h-[120px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
            <button
              type="submit"
              disabled={savingReview || rating === 0}
              className="rounded-full bg-emerald-600 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {savingReview ? 'Saving...' : 'Submit rating'}
            </button>
          </form>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Similar Listings</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {similarProducts.length ? (
            similarProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))
          ) : (
            <p className="text-sm text-slate-500">No related products yet.</p>
          )}
        </div>
      </div>
    </section>
    <MediaLightbox
      isOpen={lightboxOpen}
      onClose={() => setLightboxOpen(false)}
      mediaItems={mediaItems}
      initialIndex={activeMediaIndex}
    />
    </>
  )
}

export default ProductDetails;
