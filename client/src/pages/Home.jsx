import { useMemo, useState } from 'react';
import Hero from '../components/Hero';
import SidebarCategories from '../components/SidebarCategories';
import ServiceCards from '../components/ServiceCards';
import ProductCard from '../components/ProductCard';

const demoProducts = [
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
  },
  {
    _id: '9',
    name: 'Cotton Fabric Wholesale',
    price: 2.8,
    unit: 'meter',
    quantity: 500,
    country: 'Ethiopia',
    images: [
      {
        url: 'https://images.unsplash.com/photo-159125033e3a3e337a524a0e4fb9e0d9?auto=format&fit=crop&w=900&q=80',
      },
    ],
    category: 'Textiles',
  },
  {
    _id: '10',
    name: 'Natural Leather Jackets',
    price: 45,
    unit: 'piece',
    quantity: 25,
    country: 'Ethiopia',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
      },
    ],
    category: 'Leather',
  },
  {
    _id: '11',
    name: 'Specialty Coffee Beans',
    price: 5.8,
    unit: 'kg',
    quantity: 90,
    country: 'Ethiopia',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1528911535227-3e3ce63d9c8b?auto=format&fit=crop&w=900&q=80',
      },
    ],
    category: 'Coffee',
  },
  {
    _id: '12',
    name: 'Handcrafted Jewelry Set',
    price: 28,
    unit: 'set',
    quantity: 40,
    country: 'Ethiopia',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1623874106680-c9e3a34a1e47?auto=format&fit=crop&w=900&q=80',
      },
    ],
    category: 'Gemstones',
  },
];

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Coffee');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return demoProducts;
    }
    return demoProducts.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

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
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
