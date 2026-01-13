import { useEffect, useMemo, useState } from 'react';
import Hero from '../components/Hero';
import SidebarCategories from '../components/SidebarCategories';
import ServiceCards from '../components/ServiceCards';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Coffee');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products?approved=true&verified=true&limit=12');
        const products = data.data || [];
        const featured = products.filter((product) => product.featured);
        setFeaturedProducts(featured.length ? featured : products);
      } catch (error) {
        console.error('Error loading featured products', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        const map = (data || []).reduce((acc, category) => {
          acc[category._id] = category.name;
          return acc;
        }, {});
        setCategoryMap(map);
      } catch (error) {
        console.error('Error loading categories', error);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryName = (product) => {
    if (!product.category) return 'Other';
    if (typeof product.category === 'string') {
      return categoryMap[product.category] || product.category;
    }
    if (product.category?.name && categoryMap[product.category.name]) {
      return categoryMap[product.category.name];
    }
    return categoryMap[product.category?._id] || product.category?.name || 'Other';
  };

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return featuredProducts;
    }
    return featuredProducts.filter(
      (product) => getCategoryName(product) === selectedCategory
    );
  }, [selectedCategory, featuredProducts]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowMobileSidebar(false); // Close mobile sidebar after selection
  };

  return (
    <section className="w-full py-0 space-y-8">
      <Hero />
      <div className="max-w-[96%] mx-auto px-2 md:px-4 lg:px-6 xl:px-8">
        <div className="flex flex-col gap-6 lg:grid lg:gap-6 lg:grid-cols-[280px,1fr]">
          {/* Mobile sidebar toggle button */}
          <div className="mb-4 md:hidden">
            <button 
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="w-full py-3 px-4 bg-[#0f3d2e] text-white rounded-xl font-medium flex items-center justify-between"
            >
              <span>Filter by Category</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${showMobileSidebar ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Sidebar - visible on desktop, conditionally shown on mobile */}
          <div className={`${showMobileSidebar ? 'block' : 'hidden'} md:block`}>
            <SidebarCategories
              onSelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          </div>
          
          <div className="space-y-8">
            <ServiceCards />
            <div className="bg-white/80 rounded-2xl border border-slate-100 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-[0.4em]">
                    Latest Listings
                  </p>
                  <h2 className="text-2xl font-semibold text-[#0f3d2e]">
                    Products & Services for You
                  </h2>
                </div>
                <button className="self-start md:self-auto bg-white border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold text-[#0f3d2e] shadow-sm">
                  View All Listings
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <select className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white">
                  <option>Product Type</option>
                  <option>Coffee</option>
                  <option>Leather</option>
                  <option>Spices</option>
                  <option>Gemstones</option>
                  <option>Honey</option>
                </select>
                <select className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white">
                  <option>Country</option>
                  <option>Ethiopia</option>
                  <option>International</option>
                </select>
                <select className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white">
                  <option>Verified Only</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
                <select className="border border-slate-200 rounded-full px-3 py-2 text-sm bg-white">
                  <option>Sort by Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="col-span-full text-sm text-slate-500">
                    Loading featured products...
                  </div>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-sm text-slate-500">
                    No featured products available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
