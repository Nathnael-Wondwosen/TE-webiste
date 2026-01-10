const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('company', 'name country');
    res.json(users);
  } catch (error) {
    console.error('Get users error', error);
    res.status(500).json({ message: 'Unable to fetch users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.role = role;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update user role error', error);
    res.status(500).json({ message: 'Unable to update role' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = await Category.create({
      name,
      description,
      parent,
      slug,
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error', error);
    res.status(500).json({ message: 'Unable to create category' });
  }
};

const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.verified = true;
    product.approved = true;
    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Approve product error', error);
    res.status(500).json({ message: 'Unable to approve product' });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const buyers = await User.countDocuments({ role: 'Buyer' });
    const sellers = await User.countDocuments({ role: 'Seller' });
    const products = await Product.countDocuments();
    const verifiedProducts = await Product.countDocuments({ verified: true });
    res.json({
      totalUsers,
      buyers,
      sellers,
      products,
      verifiedProducts,
    });
  } catch (error) {
    console.error('Analytics error', error);
    res.status(500).json({ message: 'Unable to generate analytics' });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  createCategory,
  approveProduct,
  getAnalytics,
};
