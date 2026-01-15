const SellerProfile = require('../models/SellerProfile');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

const getShopBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const preview = req.query.preview === 'true';
    
    // Manually decode the JWT token from the Authorization header to get the user
    let user = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = decoded;
      } catch (err) {
        // Token is invalid, continue without user
      }
    }

    const profile = await SellerProfile.findOne({ slug }).populate('seller', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // If preview mode is enabled, check if the current user is the shop owner
    if (preview) {
      // Only allow preview if the authenticated user is the owner of the shop
      if (user && user.id === profile.seller._id.toString()) {
        // Allow access for preview regardless of shop status
      } else {
        // If not the owner, only allow if shop is active
        if (profile.status !== 'active') {
          return res.status(404).json({ message: 'Shop not available' });
        }
      }
    } else {
      // Regular access - only allow if shop is active
      if (profile.status !== 'active') {
        return res.status(404).json({ message: 'Shop not available' });
      }
    }

    // Build product filters based on preview mode
    const productFilters = { seller: profile.seller._id };
    
    if (!preview) {
      // For public view, only show approved products
      productFilters.status = 'approved';
      productFilters.approved = true;
      productFilters.verified = true; // Also ensure verified
    }
    // In preview mode, show all products belonging to the seller regardless of approval status
    
    console.log('Fetching products with filters:', productFilters);
    
    const products = await Product.find(productFilters)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    
    console.log('Found', products.length, 'products for shop:', profile.shopName, 'with preview:', preview);

    res.json({
      profile,
      products,
    });
  } catch (error) {
    console.error('Get shop error', error);
    res.status(500).json({ message: 'Unable to fetch shop' });
  }
};

module.exports = {
  getShopBySlug,
};
