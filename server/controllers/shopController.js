const SellerProfile = require('../models/SellerProfile');
const Product = require('../models/Product');

const getShopBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const preview = req.query.preview === 'true';

    const profile = await SellerProfile.findOne({ slug }).populate('seller', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (!preview && profile.status !== 'active') {
      return res.status(404).json({ message: 'Shop not available' });
    }

    const productFilters = { seller: profile.seller._id };
    if (!preview) {
      productFilters.status = 'approved';
      productFilters.approved = true;
    }

    const products = await Product.find(productFilters)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

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
