import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function BusinessDirectory() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const response = await api.get('/shops');
        setShops(response.data.shops || []);
      } catch (error) {
        console.error('Error fetching shops:', error);
        setShops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  // Filter and sort shops
  const filteredAndSortedShops = shops
    .filter(shop => {
      const matchesSearch = shop.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shop.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           shop.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = selectedLocation === 'all' || 
                             (shop.address?.city && shop.address.city.toLowerCase().replace(/\s+/g, '-') === selectedLocation) ||
                             (shop.address?.country && shop.address.country.toLowerCase().replace(/\s+/g, '-') === selectedLocation);
      
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name-asc':
          return a.shopName.localeCompare(b.shopName);
        case 'name-desc':
          return b.shopName.localeCompare(a.shopName);
        case 'products':
          return b.productCount - a.productCount;
        default:
          return 0;
      }
    });

  // Extract unique locations from shops
  const allLocations = shops.flatMap(shop => {
    const locations = [];
    if (shop.address?.city) locations.push(shop.address.city);
    if (shop.address?.country) locations.push(shop.address.country);
    return locations;
  });
  
  const uniqueLocations = [...new Set(allLocations.map(loc => loc.toLowerCase().replace(/\s+/g, '-')))];

  const locations = [
    { id: 'all', name: 'All Locations' },
    ...uniqueLocations.map(loc => ({ id: loc, name: loc.replace('-', ' ') }))
  ];

  const stats = {
    totalBusinesses: shops.length,
    activeListings: filteredAndSortedShops.length,
    locations: locations.length - 1, // excluding 'all'
    totalProducts: shops.reduce((sum, shop) => sum + (shop.productCount || 0), 0),
  };

  const ShopCard = ({ shop }) => (
    <Link 
      to={`/seller/${shop.slug}`} 
      className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
    >
      <div className="relative h-48 overflow-hidden">
        {shop.banner ? (
          <img 
            src={shop.banner} 
            alt={shop.shopName} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div className="hidden w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-2xl font-bold">
                  {shop.shopName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 font-medium">{shop.shopName}</p>
            </div>
          </div>
        )}
        <div className="absolute top-4 left-4">
          {shop.logo ? (
            <img 
              src={shop.logo} 
              alt={shop.shopName} 
              className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.querySelector('.logo-placeholder').style.display = 'flex';
              }}
            />
          ) : (
            <div className="logo-placeholder w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {shop.shopName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.shopName}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{shop.bio}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{shop.seller?.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{shop.productCount || 0} products</span>
          </div>
        </div>
        
        {(shop.address?.city || shop.address?.country) && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{shop.address?.city || shop.address?.country}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
          </span>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center">
            Visit Shop
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );

  const ShopListItem = ({ shop }) => (
    <Link 
      to={`/seller/${shop.slug}`} 
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
    >
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          {shop.logo ? (
            <img 
              src={shop.logo} 
              alt={shop.shopName} 
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {shop.shopName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">{shop.shopName}</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
            </span>
          </div>
          
          <p className="text-gray-600 mb-3 line-clamp-2">{shop.bio}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{shop.seller?.name}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>{shop.productCount || 0} products</span>
            </div>
            
            {(shop.address?.city || shop.address?.country) && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{shop.address?.city || shop.address?.country}</span>
              </div>
            )}
          </div>
        </div>
        
        <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center">
          Visit Shop
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Ethiopian Business Directory
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Discover trusted businesses and services across Ethiopia. Connect with local suppliers, manufacturers, and service providers.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{stats.totalBusinesses}</div>
              <div className="text-sm text-gray-600">Total Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{stats.activeListings}</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{stats.totalProducts}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{stats.locations}</div>
              <div className="text-sm text-gray-600">Locations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search businesses, shops, or owners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full lg:w-auto">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="products">Most Products First</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedShops.length} of {shops.length} businesses
          </p>
          {filteredAndSortedShops.length === 0 && searchTerm && (
            <p className="text-emerald-600 font-medium">
              No businesses found for "{searchTerm}". Try different keywords.
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredAndSortedShops.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No businesses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "space-y-6"
          }>
            {filteredAndSortedShops.map((shop) => (
              <div key={shop._id}>
                {viewMode === 'list' ? <ShopListItem shop={shop} /> : <ShopCard shop={shop} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-emerald-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Are you a business owner?
            </h2>
            <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
              Join Ethiopia's premier business directory and connect with customers across the country.
            </p>
            <div className="mt-8">
              <Link
                to="/seller/onboarding"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50"
              >
                Register Your Business
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDirectory;