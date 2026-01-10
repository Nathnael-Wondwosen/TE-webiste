import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

function ProductCard({ product }) {
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
          <span className="inline-flex items-center gap-1 md:gap-2 rounded-full bg-emerald-50 px-2 md:px-3 py-0.5 md:py-1 text-emerald-700 text-xs font-semibold">
            Verified
          </span>
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
