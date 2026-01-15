const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const SellerProfile = require('../models/SellerProfile');

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
    
    // Log the product status before update for debugging
    console.log('Before approval - Product ID:', req.params.id, ', Status:', product.status, ', Approved:', product.approved, ', Verified:', product.verified);
    
    product.verified = true;
    product.approved = true;
    product.status = 'approved';
    
    const updatedProduct = await product.save();
    
    // Log the product status after update for debugging
    console.log('After approval - Product ID:', req.params.id, ', Status:', updatedProduct.status, ', Approved:', updatedProduct.approved, ', Verified:', updatedProduct.verified);
    
    // Verify the product was actually updated by fetching it again
    const verifiedProduct = await Product.findById(req.params.id);
    console.log('Verification - Product ID:', req.params.id, ', Status:', verifiedProduct.status, ', Approved:', verifiedProduct.approved, ', Verified:', verifiedProduct.verified);
    
    res.json(verifiedProduct);
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
    
    // Log the product status before update for debugging
    console.log('Before status update - Product ID:', req.params.id, ', Old Status:', product.status, ', Old Approved:', product.approved, ', Old Verified:', product.verified);
    
    product.status = status;
    product.approved = status === 'approved';
    product.verified = status === 'approved';
    
    const updatedProduct = await product.save();
    
    // Log the product status after update for debugging
    console.log('After status update - Product ID:', req.params.id, ', New Status:', updatedProduct.status, ', New Approved:', updatedProduct.approved, ', New Verified:', updatedProduct.verified);
    
    // Verify the product was actually updated by fetching it again
    const verifiedProduct = await Product.findById(req.params.id);
    console.log('Verification after status update - Product ID:', req.params.id, ', Status:', verifiedProduct.status, ', Approved:', verifiedProduct.approved, ', Verified:', verifiedProduct.verified);
    
    res.json(verifiedProduct);
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

const getSellers = async (req, res) => {
  try {
    const profiles = await SellerProfile.find()
      .populate('seller', 'name email role')
      .sort({ updatedAt: -1 });
    res.json(profiles);
  } catch (error) {
    console.error('Get sellers error', error);
    res.status(500).json({ message: 'Unable to fetch sellers' });
  }
};

const updateSellerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const note = req.body.note?.trim();
    const allowed = ['pending', 'active', 'suspended'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const profile = await SellerProfile.findById(req.params.id).populate('seller', 'email');
    if (!profile) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }

    const previousStatus = profile.status;
    profile.status = status;
    if (note || status !== previousStatus) {
      profile.statusNotes = profile.statusNotes || [];
      profile.statusNotes.push({
        status,
        note: note || '',
        by: req.user._id,
      });
    }
    await profile.save();

    const sellerEmail = profile.contactEmail || profile.seller?.email;
    if (sellerEmail) {
      console.log(`Seller status updated: ${sellerEmail} -> ${status} (${note || 'no note'})`);
    }
    res.json(profile);
  } catch (error) {
    console.error('Update seller status error', error);
    res.status(500).json({ message: 'Unable to update seller status' });
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
  getSellers,
  updateSellerStatus,
};
