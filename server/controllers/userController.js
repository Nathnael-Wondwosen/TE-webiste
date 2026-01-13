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

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
