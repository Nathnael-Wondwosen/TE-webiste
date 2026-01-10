import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';

function ProductDetails() {
  const { id } = useParams();
  const { items } = useSelector((state) => state.products);

  const product = useMemo(() => items.find((item) => item._id === id), [items, id]);

  if (!product) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-slate-500">Product not found.</p>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-[1fr,380px]">
        <div className="bg-white rounded-3xl shadow p-6">
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
              <p className="text-lg font-semibold">{product.quantity || '—'}</p>
            </div>
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
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Similar Listings</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((variant) => (
            <ProductCard
              key={variant}
              product={{
                ...product,
                _id: `${product._id}-${variant}`,
                name: `${product.name} ${variant}`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
