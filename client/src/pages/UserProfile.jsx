import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [favorites, setFavorites] = useState([]);
  const [favoritesProducts, setFavoritesProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch user favorites
        const favoritesResponse = await api.get('/users/favorites');
        const favoriteIds = favoritesResponse.data.favorites || [];
        setFavorites(favoriteIds);
        
        // Fetch full product details for favorites
        if (favoriteIds.length > 0) {
          const favoriteProductsPromises = favoriteIds.map(id => api.get(`/products/${id}`));
          try {
            const favoriteProductsResponses = await Promise.all(favoriteProductsPromises);
            const favoriteProducts = favoriteProductsResponses.map(response => response.data);
            setFavoritesProducts(favoriteProducts);
          } catch (err) {
            console.error('Error fetching favorite products', err);
            setFavoritesProducts([]);
          }
        } else {
          setFavoritesProducts([]);
        }
        
        // Fetch recommendations based on favorites
        const recommendationsResponse = await api.get('/users/recommendations');
        setRecommendations(recommendationsResponse.data.recommendations || []);
      } catch (error) {
        console.error('Error loading user data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500/30 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-t-emerald-400 border-r-transparent border-b-emerald-300 border-l-transparent rounded-full animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Loading Profile</h2>
          <p className="text-slate-400 text-sm">Preparing your personalized experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Smart Header Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-5 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl animate-pulse sm:w-56 sm:h-56 lg:w-72 lg:h-72"></div>
          <div className="absolute bottom-5 right-5 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl animate-pulse delay-1000 sm:w-64 sm:h-64 lg:w-80 lg:h-80"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500 sm:w-40 sm:h-40 lg:w-56 lg:h-56"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Smart Profile Header Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Smart Gradient Header */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 px-6 py-8 sm:px-8 sm:py-10">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-20">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="relative flex flex-col lg:flex-row items-center gap-6">
                {/* Smart Avatar Section */}
                <div className="relative">
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-2xl bg-gradient-to-br from-white/40 to-white/20 flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-bold text-white backdrop-blur-sm border-2 border-white/40 shadow-2xl">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    <div className="absolute -bottom-2 -right-2 h-6 w-6 sm:h-7 sm:w-7 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute -top-2 -left-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Online
                  </div>
                  
                  {/* Achievement Badge */}
                  <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    Level 5
                  </div>
                </div>
                
                {/* Smart User Info Section */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 mb-3">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 lg:mb-0">
                      {user?.name || 'User Profile'}
                    </h1>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      <span className="px-3 py-1 sm:px-4 sm:py-2 bg-white/25 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-white border border-white/40 shadow-lg">
                        {user?.role}
                      </span>
                      <span className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-yellow-100 border border-yellow-300/50 shadow-lg">
                        Premium Member
                      </span>
                      <span className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-emerald-400/30 to-teal-500/30 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-emerald-100 border border-emerald-300/50 shadow-lg">
                        Verified
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-base sm:text-lg lg:text-xl text-emerald-100 mb-4">
                    {user?.email}
                  </p>
                  
                  {/* Smart Stats Row */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-white/90 text-sm sm:text-base">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>Since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2023'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>Top Contributor</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Trusted Seller</span>
                    </div>
                  </div>
                </div>
                
                {/* Smart Stats Panel */}
                <div className="text-center lg:text-right">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30 hover:bg-white/25 transition-all">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{favorites.length}</div>
                      <div className="text-emerald-100 text-xs sm:text-sm">Favorites</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30 hover:bg-white/25 transition-all">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">24</div>
                      <div className="text-emerald-100 text-xs sm:text-sm">Orders</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30 hover:bg-white/25 transition-all">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">4.8</div>
                      <div className="text-emerald-100 text-xs sm:text-sm">Rating</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/30 hover:bg-white/25 transition-all">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">156</div>
                      <div className="text-emerald-100 text-xs sm:text-sm">Points</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b border-white/20">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-4 py-4 sm:px-6 sm:py-5 font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'text-white bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border-b-2 sm:border-b-0 sm:border-r border-emerald-400'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 px-4 py-4 sm:px-6 sm:py-5 font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'favorites'
                  ? 'text-white bg-gradient-to-r from-rose-500/30 to-pink-500/30 border-b-2 sm:border-b-0 sm:border-r border-rose-400'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>Favorites ({favorites.length})</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex-1 px-4 py-4 sm:px-6 sm:py-5 font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeTab === 'recommendations'
                  ? 'text-white bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 border-b-2 sm:border-b-0 sm:border-r-0 border-cyan-400'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Recommendations ({recommendations.length})</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Personal Information Section */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-base sm:text-2xl">Personal Information</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform">
                          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white/80 text-xs sm:text-sm font-medium">Full Name</h3>
                          <p className="text-base sm:text-xl font-bold text-white mt-1">{user?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-base sm:text-2xl">Your Favorite Products</span>
                </h2>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-rose-400/30">
                      <svg className="w-10 h-10 sm:w-12 sm:h-12 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No favorites yet</h3>
                    <p className="text-base sm:text-lg text-white/70 max-w-xs sm:max-w-md mx-auto leading-relaxed">
                      Start exploring our marketplace and save products you love by clicking the heart icon.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {favoritesProducts.map((product) => (
                      <div key={product._id} className="transform hover:scale-105 transition-all duration-300">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-base sm:text-2xl">Recommended For You</span>
                </h2>
                
                <p className="text-sm sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-full sm:max-w-2xl leading-relaxed">
                  Discover handpicked products tailored to your interests. Our smart recommendation engine analyzes your favorites to bring you the most relevant items.
                </p>
                
                {recommendations.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-emerald-400/30">
                      <svg className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No recommendations yet</h3>
                    <p className="text-base sm:text-lg text-white/70 max-w-xs sm:max-w-md mx-auto leading-relaxed">
                      Favorite some products to unlock personalized recommendations powered by our algorithm.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {recommendations.map((product) => (
                      <div key={product._id} className="transform hover:scale-105 transition-all duration-300">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;