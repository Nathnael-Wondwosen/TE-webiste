const Product = require('../models/Product');
const User = require('../models/User');

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favorites');
    res.json({ favorites: user?.favorites || [] });
  } catch (error) {
    console.error('Get favorites error', error);
    res.status(500).json({ message: 'Unable to fetch favorites' });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product id is required' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await User.updateOne(
      { _id: req.user._id },
      { $addToSet: { favorites: product._id } }
    );
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Add favorite error', error);
    res.status(500).json({ message: 'Unable to add favorite' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: 'Product id is required' });
    }
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { favorites: productId } }
    );
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error', error);
    res.status(500).json({ message: 'Unable to remove favorite' });
  }
};

const getRecommendations = async (req, res) => {
  try {
    // Get user's favorite products
    const user = await User.findById(req.user._id).select('favorites').populate('favorites', 'category price country');
    
    if (!user.favorites || user.favorites.length === 0) {
      // If no favorites, return popular products
      const popularProducts = await Product.find({ 
        approved: true, 
        verified: true 
      })
      .sort({ averageRating: -1, ratingsCount: -1 })
      .limit(10);
      
      return res.json({
        recommendations: popularProducts,
        source: 'popular'
      });
    }
    
    // Extract category IDs and price range from favorites
    const favoriteCategories = user.favorites
      .filter(fav => fav.category)
      .map(fav => fav.category._id);
      
    const avgPrice = user.favorites.reduce((sum, fav) => sum + (fav.price || 0), 0) / user.favorites.length;
    const priceRange = {
      min: avgPrice * 0.5,  // 50% below average
      max: avgPrice * 1.5   // 50% above average
    };
    
    // Find similar products based on categories and price range
    let recommendations = [];
    
    if (favoriteCategories.length > 0) {
      recommendations = await Product.find({
        _id: { $nin: user.favorites }, // Exclude already favorited items
        category: { $in: favoriteCategories },
        price: { $gte: priceRange.min, $lte: priceRange.max },
        approved: true,
        verified: true
      })
      .populate('seller', 'name')
      .populate('category', 'name slug')
      .limit(10);
    }
    
    // If not enough recommendations from categories, add popular products
    if (recommendations.length < 6) {
      const additionalProducts = await Product.find({
        _id: { $nin: [...user.favorites, ...recommendations.map(r => r._id)] },
        approved: true,
        verified: true
      })
      .sort({ averageRating: -1, ratingsCount: -1 })
      .limit(10 - recommendations.length);
      
      recommendations = [...recommendations, ...additionalProducts];
    }
    
    res.json({
      recommendations,
      source: 'personalized',
      basedOn: {
        categories: favoriteCategories.length,
        favoriteCount: user.favorites.length
      }
    });
    
  } catch (error) {
    console.error('Get recommendations error', error);
    res.status(500).json({ message: 'Unable to fetch recommendations' });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  getRecommendations,
};
