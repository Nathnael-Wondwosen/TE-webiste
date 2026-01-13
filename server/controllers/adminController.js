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
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const existing = await Category.findOne({
      $or: [{ name }, { slug }],
    });
    if (existing) {
      return res.status(200).json(existing);
    }
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

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error', error);
    res.status(500).json({ message: 'Unable to fetch categories' });
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
    product.status = 'approved';
    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Approve product error', error);
    res.status(500).json({ message: 'Unable to approve product' });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'approved', 'disabled', 'hold'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.status = status;
    product.approved = status === 'approved';
    product.verified = status === 'approved';
    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product status error', error);
    res.status(500).json({ message: 'Unable to update product status' });
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
  getCategories,
  createCategory,
  approveProduct,
  updateProductStatus,
  getAnalytics,
};
