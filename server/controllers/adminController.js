const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const SellerProfile = require('../models/SellerProfile');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Advertisement = require('../models/Advertisement');
const ServiceProvider = require('../models/ServiceProvider');
const UserSession = require('../models/UserSession');

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

const fixAllProductsForSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    // Update all products for this seller to be approved and verified
    const result = await Product.updateMany(
      { seller: sellerId },
      { 
        status: 'approved', 
        approved: true, 
        verified: true 
      }
    );
    
    console.log(`Fixed ${result.modifiedCount} products for seller ${sellerId}`);
    
    res.json({ 
      message: `Successfully updated ${result.modifiedCount} products`,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Fix all products for seller error', error);
    res.status(500).json({ message: 'Unable to fix products for seller' });
  }
};

const activateAllSellerProfiles = async (req, res) => {
  try {
    console.log('Activating all seller profiles...');
    
    // Find all seller profiles that should be active
    const result = await SellerProfile.updateMany(
      { 
        $or: [
          { onboardingCompleted: true },
          { 'seller.role': 'Seller' }
        ],
        status: { $ne: 'active' }
      },
      { 
        status: 'active'
      }
    );
    
    console.log(`Activated ${result.modifiedCount} seller profiles`);
    
    res.json({ 
      message: `Successfully activated ${result.modifiedCount} seller profiles`,
      activatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Activate all seller profiles error', error);
    res.status(500).json({ message: 'Unable to activate seller profiles' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Attempting to delete user:', userId);
    
    // Find the user to check their role
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admins from deleting themselves
    if (user.role === 'Admin' && req.user._id.toString() === userId) {
      console.log('Admin attempting to delete own account:', userId);
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }
    
    console.log('Starting to delete user and related data');
    
    // Attempt to use transactions if supported, otherwise use sequential deletes
    try {
      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        // Invalidate user sessions before deleting
        console.log('Invalidating user sessions...');
        await UserSession.updateMany(
          { userId: userId, isActive: true },
          { isActive: false, invalidatedAt: new Date(), invalidatedReason: 'deleted' }
        );
        
        console.log('Deleting user products...');
        await Product.deleteMany({ seller: userId }, { session });
        
        console.log('Deleting seller profile...');
        await SellerProfile.deleteOne({ seller: userId }, { session });
        
        console.log('Deleting user orders...');
        await Order.deleteMany({ buyer: userId }, { session });
        
        console.log('Deleting user reviews...');
        await Review.deleteMany({ user: userId }, { session });
        
        console.log('Deleting user advertisements...');
        await Advertisement.deleteMany({ owner: userId }, { session });
        
        console.log('Deleting service provider records...');
        await ServiceProvider.deleteMany({ user: userId }, { session });
        
        console.log('Deleting user...');
        await User.deleteOne({ _id: userId }, { session });
      });
      await session.endSession();
    } catch (transactionError) {
      console.warn('Transaction failed, attempting sequential deletes:', transactionError);
      
      // Fallback to sequential deletes without transactions
      // Invalidate user sessions before deleting
      console.log('Invalidating user sessions...');
      await UserSession.updateMany(
        { userId: userId, isActive: true },
        { isActive: false, invalidatedAt: new Date(), invalidatedReason: 'deleted' }
      );
      
      console.log('Deleting user products...');
      await Product.deleteMany({ seller: userId });
      
      console.log('Deleting seller profile...');
      await SellerProfile.deleteOne({ seller: userId });
      
      console.log('Deleting user orders...');
      await Order.deleteMany({ buyer: userId });
      
      console.log('Deleting user reviews...');
      await Review.deleteMany({ user: userId });
      
      console.log('Deleting user advertisements...');
      await Advertisement.deleteMany({ owner: userId });
      
      console.log('Deleting service provider records...');
      await ServiceProvider.deleteMany({ user: userId });
      
      console.log('Deleting user...');
      await User.deleteOne({ _id: userId });
    }
    
    console.log('Successfully deleted user:', userId);
    res.json({ message: 'User and all related data deleted successfully' });
  } catch (error) {
    console.error('Delete user error', error);
    res.status(500).json({ message: 'Unable to delete user', error: error.message });
  }
};

// Function to fix product visibility for all seller products
const fixAllSellerProducts = async (req, res) => {
  try {
    console.log('🔍 Starting to fix all seller products...');
    
    // Find all seller and prospective seller users
    const sellerUsers = await User.find({ 
      role: { $in: ['Seller', 'ProspectiveSeller'] } 
    });
    
    console.log(`👥 Found ${sellerUsers.length} seller users`);
    
    let totalFixed = 0;
    
    for (const user of sellerUsers) {
      console.log(`🔄 Processing products for ${user.name} (${user.email}) - Role: ${user.role}`);
      
      // Find all products for this seller
      const products = await Product.find({ 
        seller: user._id 
      });
      
      console.log(`   📦 Found ${products.length} products`);
      
      for (const product of products) {
        let updated = false;
        
        // Check if product status is approved but approved/verified flags are false
        if (product.status === 'approved') {
          if (!product.approved) {
            product.approved = true;
            updated = true;
            console.log(`   ✅ Set approved=true for product: ${product.name}`);
          }
          
          if (!product.verified) {
            product.verified = true;
            updated = true;
            console.log(`   ✅ Set verified=true for product: ${product.name}`);
          }
        }
        
        if (updated) {
          await product.save();
          totalFixed++;
        }
      }
      
      console.log(`   🟢 Completed processing for ${user.name}\n`);
    }
    
    console.log(`\n🎉 Summary: Fixed ${totalFixed} product records`);
    
    res.json({ 
      message: `Successfully fixed approval status for ${totalFixed} products`,
      fixedCount: totalFixed
    });
    
  } catch (error) {
    console.error('❌ Error fixing seller products:', error);
    res.status(500).json({ message: 'Unable to fix seller products', error: error.message });
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
  fixAllProductsForSeller,
  activateAllSellerProfiles,
  deleteUser,
  fixAllSellerProducts,
};
