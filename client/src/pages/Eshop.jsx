import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Bell,
  ChevronDown,
  MapPin,
  Coffee,
  Briefcase,
  Shirt,
  Flame,
  Droplet,
  Gem,
  Hammer,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Eshop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('recommended');
  const [productView, setProductView] = useState('list');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCertifications, setSelectedCertifications] = useState([]);

  // Sample products data for the Eshop
  const products = [
    {
      _id: '1',
      name: 'Ethiopian Coffee (Washed)',
      price: 4.2,
      unit: 'kg',
      quantity: 60,
      country: 'Ethiopia',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1528911535227-3e3ce63d9c8b?auto=format&fit=crop&w=900&q=80',
        },
      ],
      category: 'Coffee',
      rating: 4.8,
      reviews: 124,
      certifications: ['Organic', 'Fair Trade'],
    },
    {
      _id: '2',
      name: 'Leather Bags Bulk',
      price: 22,
      unit: 'bag',
      quantity: 50,
      country: 'Ethiopia',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
        },
      ],
      category: 'Leather',
      rating: 4.6,
      reviews: 89,
      certifications: ['Quality Assured'],
    },
    {
      _id: '3',
      name: 'Handwoven Textiles',
      price: 15,
      unit: 'roll',
      quantity: 200,
      country: 'Ethiopia',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80',
        },
      ],
      category: 'Textiles',
      rating: 4.9,
      reviews: 156,
      certifications: ['Fair Trade', 'ISO Certified'],
    },
    {
      _id: '4',
      name: 'Organic Spice Basket',
      price: 6,
      unit: 'kg',
      quantity: 120,
      country: 'Ethiopia',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=900&q=80',
        },
      ],
      category: 'Spices',
      rating: 4.7,
      reviews: 78,
      certifications: ['Organic', 'Quality Assured'],
    },
    {
      _id: '5',
      name: 'Premium Ethiopian Honey',
      price: 8,
      unit: 'kg',
      quantity: 80,
      country: 'Ethiopia',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603569283847-aa6f0c79a462?auto=format&fit=crop&w=900&q=80',
        },
      ],
      category: 'Honey',
      rating: 4.9,
      reviews: 203,
      certifications: ['Organic', 'Quality Assured'],
    },
    {
      _id: '6',
      name: 'Ceramic Pottery Collection',
      price: 35,
      unit: 'set',
      quantity: 30,
      country: 'Ethiopia',
      images: [
        {
          url: 'https://images.unsplash.com/photo-159125033e3a3e337a524a0e4fb9e0d9?auto=format&fit=crop&w=900&q=80',
        },
      ],
      category: 'Ceramics',
      rating: 4.5,
      reviews: 67,
      certifications: ['ISO Certified'],
    },
    {
      _id: '7',
      name: 'Gemstone Beads Assortment',
      price: 12,
      unit: 'pack',
      quantity: 150,
      country: 'Ethiopia',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1623874106680-c9e3a34a1e47?auto=format&fit=crop&w=900&q=80',
        },
      ],
      category: 'Gemstones',
      rating: 4.8,
      reviews: 92,
      certifications: ['Quality Assured'],
    },
    {
      _id: '8',
      name: 'Organic Sesame Seeds',
      price: 3.5,
      unit: 'kg',
      quantity: 200,
      country: 'Ethiopia',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603569283847-aa6f0c79a462?auto=format&fit=crop&w=900&q=80',
        },
      ],
      category: 'Spices',
      rating: 4.6,
      reviews: 115,
      certifications: ['Organic'],
    },
  ];

  const categories = ['All', 'Coffee', 'Leather', 'Textiles', 'Spices', 'Honey', 'Ceramics', 'Gemstones'];
  const mobileCategoryTiles = [
    { label: 'Coffee', value: 'Coffee', icon: Coffee, accent: 'from-amber-300 to-amber-500' },
    { label: 'Leather', value: 'Leather', icon: Briefcase, accent: 'from-rose-300 to-rose-500' },
    { label: 'Textiles', value: 'Textiles', icon: Shirt, accent: 'from-sky-300 to-sky-500' },
    { label: 'Spices', value: 'Spices', icon: Flame, accent: 'from-orange-300 to-orange-500' },
    { label: 'Honey', value: 'Honey', icon: Droplet, accent: 'from-yellow-300 to-yellow-500' },
    { label: 'Ceramics', value: 'Ceramics', icon: Hammer, accent: 'from-stone-300 to-stone-500' },
    { label: 'Gemstones', value: 'Gemstones', icon: Gem, accent: 'from-emerald-300 to-emerald-500' },
    { label: 'All', value: 'All', icon: Layers, accent: 'from-slate-300 to-slate-500' },
  ];

  // Filter products based on search, category, and price range
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      const matchesStock = !inStockOnly || product.quantity > 0;
      const matchesCertifications = selectedCertifications.length === 0 || 
                                   selectedCertifications.every(cert => product.certifications?.includes(cert));

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock && matchesCertifications;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In a real app, this would sort by creation date
        break;
      default:
        // Recommended sorting (by rating, then by id)
        result.sort((a, b) => b.rating - a.rating || (b._id - a._id));
    }

    return result;
  }, [searchTerm, selectedCategory, priceRange, sortBy, minRating, inStockOnly, selectedCertifications]);

  const highlightStores = products.slice(0, 5);
  const mobileNewArrivals = filteredProducts.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f3f2ee] py-0 lg:py-8">
      <div className="lg:hidden bg-[#f2f4f1] text-slate-900 min-h-screen">
        <div className="px-4 pt-6 pb-8 bg-gradient-to-br from-[#0f3d2e] via-[#155e42] to-[#0b2f23] text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-200/80">
                TradeEthiopia
              </p>
              <h1 className="text-xl font-semibold">What are you looking for?</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </button>
              <button className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[130px,1fr] gap-3">
            <div className="relative">
              <select
                className="w-full appearance-none rounded-xl bg-[#0f3d2e] border border-white/10 pl-9 pr-9 py-2.5 text-sm text-white"
                defaultValue="Addis Ababa"
              >
                <option>Addis Ababa</option>
                <option>Adama</option>
                <option>Bahir Dar</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-200" />
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-200" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-200" />
              <input
                type="text"
                placeholder="I am looking for..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl bg-[#0f3d2e] border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f2f4f1] px-4 pb-6">
          <div className="-mt-4 rounded-3xl bg-white p-4 shadow-xl border border-emerald-100">
            <div className="grid grid-cols-4 gap-3">
              {mobileCategoryTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={tile.label}
                    onClick={() => setSelectedCategory(tile.value)}
                    className={`flex flex-col items-center gap-2 rounded-2xl px-2 py-3 text-[11px] border ${
                      selectedCategory === tile.value
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <span className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${tile.accent} text-[#0b2f23] flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-center text-slate-700 leading-tight">
                      {tile.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="-mt-4 rounded-t-[28px] bg-[#f3f2ee] text-slate-900 pt-6 pb-10">
          <div className="max-w-[96%] mx-auto space-y-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-[#0f3d2e]">Store Highlight</h2>
                <button className="text-xs font-semibold text-emerald-700">View All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                {highlightStores.map((item) => (
                  <article
                    key={item._id}
                    className="min-w-[140px] rounded-2xl bg-white border border-slate-100 shadow-md overflow-hidden"
                  >
                    <div
                      className="h-20 bg-cover bg-center"
                      style={{
                        backgroundImage: item?.images?.length
                          ? `url(${item.images[0].url})`
                          : "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80')",
                      }}
                    />
                    <div className="p-3">
                      <p className="text-[11px] text-slate-500">{item.category}</p>
                      <h3 className="text-sm font-semibold text-[#0f3d2e] leading-snug">
                        {item.name}
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-[#0f3d2e]">Sponsored</h2>
                <button className="text-xs font-semibold text-emerald-700">View All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[
                  {
                    title: 'Get verified trade tools',
                    desc: 'Boost your listings with premium exposure.',
                    accent: 'from-[#0f3d2e] via-[#114533] to-[#0b2f23]',
                  },
                  {
                    title: 'Logistics partners near you',
                    desc: 'Connect with trusted shippers today.',
                    accent: 'from-[#124b38] via-[#0f3d2e] to-[#0b2f23]',
                  },
                  {
                    title: 'Secure payments, faster',
                    desc: 'Trade with confidence and protection.',
                    accent: 'from-[#0b2f23] via-[#0f3d2e] to-[#114533]',
                  },
                ].map((ad) => (
                  <article
                    key={ad.title}
                    className={`min-w-full shrink-0 snap-center rounded-3xl overflow-hidden bg-gradient-to-r ${ad.accent} text-white shadow-lg`}
                  >
                    <div className="px-5 py-4 flex items-center justify-between">
                      <div className="max-w-[70%]">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-200/80">
                          Sponsored
                        </p>
                        <h3 className="text-base font-semibold">{ad.title}</h3>
                        <p className="text-xs text-emerald-100/80 mt-1">
                          {ad.desc}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[11px] font-semibold">
                        Ad
                      </div>
                    </div>
                    <div className="h-2 bg-emerald-400/40">
                      <div className="h-full w-1/3 bg-emerald-300"></div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-[#0f3d2e]">New Arrival</h2>
                <button className="text-xs font-semibold text-emerald-700">View All</button>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                <span className="text-emerald-700 font-semibold">For You</span>
                <span>Hot Sale</span>
                <span>Popular</span>
                <span>Free Delivery</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mobileNewArrivals.map((product) => (
                  <article
                    key={product._id}
                    className="rounded-2xl bg-white border border-slate-100 shadow-md overflow-hidden"
                  >
                    <div
                      className="h-24 bg-cover bg-center"
                      style={{
                        backgroundImage: product?.images?.length
                          ? `url(${product.images[0].url})`
                          : "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80')",
                      }}
                    />
                    <div className="p-3">
                      <p className="text-[11px] text-slate-500">{product.category}</p>
                      <h3 className="text-sm font-semibold text-[#0f3d2e] leading-snug">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-emerald-600">
                          ${product.price}/{product.unit}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-[#0f3d2e]">Product List</h2>
                <div className="flex items-center gap-2">
                  <button className="text-xs font-semibold text-emerald-700">View All</button>
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5">
                    <button
                      onClick={() => setProductView('list')}
                      className={`h-7 w-7 rounded-full flex items-center justify-center ${
                        productView === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                      }`}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setProductView('grid')}
                      className={`h-7 w-7 rounded-full flex items-center justify-center ${
                        productView === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                      }`}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              {productView === 'list' ? (
                <div className="space-y-3">
                  {filteredProducts.slice(0, 5).map((product) => (
                    <article
                      key={`list-${product._id}`}
                      className="flex items-center gap-3 rounded-2xl bg-white border border-slate-100 shadow-sm p-3"
                    >
                      <div
                        className="h-16 w-16 rounded-xl bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: product?.images?.length
                            ? `url(${product.images[0].url})`
                            : "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80')",
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-[11px] text-slate-500">{product.category}</p>
                        <h3 className="text-sm font-semibold text-[#0f3d2e] leading-snug">
                          {product.name}
                        </h3>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                          <span>{product.country}</span>
                          <span className="font-semibold text-emerald-600">
                            ${product.price}/{product.unit}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <article
                      key={`grid-${product._id}`}
                      className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
                    >
                      <div
                        className="h-24 bg-cover bg-center"
                        style={{
                          backgroundImage: product?.images?.length
                            ? `url(${product.images[0].url})`
                            : "url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80')",
                        }}
                      />
                      <div className="p-3">
                        <p className="text-[11px] text-slate-500">{product.category}</p>
                        <h3 className="text-sm font-semibold text-[#0f3d2e] leading-snug">
                          {product.name}
                        </h3>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                          <span>{product.country}</span>
                          <span className="font-semibold text-emerald-600">
                            ${product.price}/{product.unit}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="max-w-[96%] mx-auto">
          {/* Header with Banner */}
          <div className="mb-8 relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0f3d2e] to-[#134a36] text-white p-8">
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">TradeEthiopia E-Shop</h1>
              <p className="text-lg text-emerald-100 mb-6">Discover authentic Ethiopian products from verified suppliers</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                  <span className="text-sm">Verified Sellers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                  <span className="text-sm">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                  <span className="text-sm">Secure Payment</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 bg-gradient-to-l from-white/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
            {/* Advanced Sidebar Filters */}
            <div className="rounded-2xl border border-slate-200 shadow-lg bg-gradient-to-b from-emerald-50 to-emerald-100/50 sticky top-24 overflow-hidden">
              {/* Filter Header */}
              <div className="bg-gradient-to-r from-[#0f3d2e] to-[#134a36] p-5 text-white">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <span>Advanced Filters</span>
                </h3>
              </div>
                      
              <div className="p-5 space-y-6">
                {/* Search Bar */}
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d2e] focus:border-transparent text-sm bg-white shadow-sm"
                    />
                  </div>
                </div>
                        
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-[#0f3d2e] mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full py-3 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d2e] focus:border-transparent text-sm bg-white shadow-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                        
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-[#0f3d2e] mb-2">Price Range</label>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="font-medium">${priceRange[0]}</span>
                      <span className="font-medium">${priceRange[1]}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full accent-[#0f3d2e]"
                      />
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-[#0f3d2e]"
                      />
                    </div>
                  </div>
                </div>
                        
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-[#0f3d2e] mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full py-3 px-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f3d2e] focus:border-transparent text-sm bg-white shadow-sm"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
                        
                {/* Additional Filters */}
                <div className="pt-2">
                  <h4 className="font-semibold text-[#0f3d2e] mb-3 text-sm">Additional Filters</h4>
                          
                  {/* Rating Filter */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Minimum Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setMinRating(star)}
                          className={`text-lg ${star <= minRating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                          
                  {/* Availability */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-2">Availability</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="rounded text-[#0f3d2e] focus:ring-[#0f3d2e]"
                        />
                        <span className="text-sm text-gray-700">In Stock Only</span>
                      </label>
                    </div>
                  </div>
                          
                  {/* Certification */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Certification</label>
                    <div className="space-y-2">
                      {['Organic', 'Fair Trade', 'ISO Certified', 'Quality Assured'].map((cert) => (
                        <label key={cert} className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={selectedCertifications.includes(cert)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCertifications([...selectedCertifications, cert]);
                              } else {
                                setSelectedCertifications(selectedCertifications.filter(c => c !== cert));
                              }
                            }}
                            className="rounded text-[#0f3d2e] focus:ring-[#0f3d2e]"
                          />
                          <span className="text-sm text-gray-700">{cert}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                        
                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setPriceRange([0, 1000]);
                      setSortBy('recommended');
                      setMinRating(0);
                      setInStockOnly(false);
                      setSelectedCertifications([]);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#0f3d2e] py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={() => {
                      // Apply filters functionality
                    }}
                    className="flex-1 bg-[#0f3d2e] hover:bg-[#124b38] text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div>
              {/* Results Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <p className="text-gray-700">
                  Showing <span className="font-bold text-[#0f3d2e]">{filteredProducts.length}</span> products
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Filter className="h-4 w-4" />
                  <span>Active filters</span>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                  <div className="text-6xl mb-6">:-(</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">No products found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">We couldn't find any products matching your search. Try adjusting your filters or search terms.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setPriceRange([0, 1000]);
                      setSortBy('recommended');
                    }}
                    className="bg-[#0f3d2e] hover:bg-[#124b38] text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eshop;
