import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../redux/productSlice';

function Marketplace() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Marketplace</p>
          <h1 className="text-3xl font-semibold">Local & International Listings</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Local', 'International'].map((label) => (
            <button
              key={label}
              className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:border-emerald-500"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {status === 'loading' && <p>Loading products...</p>}
        {status === 'succeeded' && items.length === 0 && <p>No products yet.</p>}
        {status === 'succeeded' &&
          items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </section>
  );
}

export default Marketplace;
