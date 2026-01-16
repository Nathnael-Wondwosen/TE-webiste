const SellerProfile = require('../models/SellerProfile');
const Product = require('../models/Product');
const Order = require('../models/Order');

const createSlug = (value) =>
  value
    ? value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
    : undefined;

const getSellerProfile = async (req, res) => {
  try {
    const existing = await SellerProfile.findOne({ seller: req.user._id });
    if (existing) {
      return res.json(existing);
    }

    const baseName = req.user.name || 'Seller Shop';
    const profile = await SellerProfile.create({
      seller: req.user._id,
      shopName: baseName,
      slug: createSlug(baseName),
      contactEmail: req.user.email,
      contactPhone: req.user.phone,
      address: {
        address: req.user.address,
      },
      status: 'pending',
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Get seller profile error', error);
    res.status(500).json({ message: 'Unable to fetch seller profile' });
  }
};

const updateSellerProfile = async (req, res) => {
  try {
    const payload = req.body || {};
    const allowed = {
      shopName: payload.shopName,
      logo: payload.logo,
      banner: payload.banner,
      bio: payload.bio,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      address: payload.address,
      policies: payload.policies,
      payout: payload.payout,
      shipping: payload.shipping,
      socials: payload.socials,
      onboardingCompleted: payload.onboardingCompleted,
    };

    if (allowed.shopName) {
      allowed.slug = createSlug(allowed.shopName);
    }

    const profile = await SellerProfile.findOneAndUpdate(
      { seller: req.user._id },
      { $set: allowed, $setOnInsert: { seller: req.user._id, status: 'pending' } },
      { new: true, upsert: true }
    );

    // Handle onboarding completion for both ProspectiveSeller and existing Sellers
    if (payload.onboardingCompleted) {
      const User = require('../models/User');
      const user = await User.findById(req.user._id);
      
      // If user is ProspectiveSeller, promote them to Seller
      if (user && user.role === 'ProspectiveSeller') {
        user.role = 'Seller';
        await user.save();
      }
      
      // Always set the seller profile to active when onboarding is completed
      // This ensures shops are accessible regardless of user role
      profile.status = 'active';
      profile.onboardingCompleted = true;
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    console.error('Update seller profile error', error);
    res.status(500).json({ message: 'Unable to update seller profile' });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filters = { seller: req.user._id };

    if (status) {
      filters.status = status;
    }
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filters)
      .populate('category', 'name slug')
      .sort({ updatedAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Get seller products error', error);
    res.status(500).json({ message: 'Unable to fetch seller products' });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const productIds = await Product.find({ seller: req.user._id }).distinct('_id');
    if (!productIds.length) {
      return res.json([]);
    }

    const orders = await Order.find({
      status: { $ne: 'Cart' },
      'products.product': { $in: productIds },
    })
      .populate('buyer', 'name email')
      .populate('products.product', 'name price seller')
      .sort({ createdAt: -1 });

    const normalized = orders.map((order) => {
      const sellerItems = order.products.filter((item) =>
        item.product?.seller?.toString() === req.user._id.toString()
      );
      const sellerTotal = sellerItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );

      return {
        id: order._id,
        buyer: order.buyer,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        total: sellerTotal,
        items: sellerItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        })),
      };
    });

    res.json(normalized);
  } catch (error) {
    console.error('Get seller orders error', error);
    res.status(500).json({ message: 'Unable to fetch seller orders' });
  }
};

const getSellerCustomers = async (req, res) => {
  try {
    const productIds = await Product.find({ seller: req.user._id }).distinct('_id');
    if (!productIds.length) {
      return res.json([]);
    }

    const orders = await Order.find({
      status: { $ne: 'Cart' },
      'products.product': { $in: productIds },
    })
      .populate('buyer', 'name email')
      .populate('products.product', 'seller');

    const customers = new Map();

    orders.forEach((order) => {
      const sellerItems = order.products.filter((item) =>
        item.product?.seller?.toString() === req.user._id.toString()
      );
      if (!sellerItems.length || !order.buyer) return;

      const totalSpend = sellerItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      const buyerId = order.buyer._id.toString();
      const existing = customers.get(buyerId) || {
        id: buyerId,
        name: order.buyer.name,
        email: order.buyer.email,
        totalOrders: 0,
        totalSpend: 0,
        lastOrder: order.createdAt,
      };

      existing.totalOrders += 1;
      existing.totalSpend += totalSpend;
      if (order.createdAt > existing.lastOrder) {
        existing.lastOrder = order.createdAt;
      }
      customers.set(buyerId, existing);
    });

    const result = Array.from(customers.values()).sort(
      (a, b) => b.lastOrder - a.lastOrder
    );

    res.json(result);
  } catch (error) {
    console.error('Get seller customers error', error);
    res.status(500).json({ message: 'Unable to fetch seller customers' });
  }
};

const getSellerOverview = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const productIds = await Product.find({ seller: sellerId }).distinct('_id');

    const productCount = productIds.length;
    const lowStockCount = await Product.countDocuments({
      seller: sellerId,
      quantity: { $lte: 5 },
    });

    let revenue = 0;
    let orderCount = 0;
    let customerCount = 0;

    if (productIds.length) {
      const orders = await Order.aggregate([
        {
          $match: {
            status: { $ne: 'Cart' },
            'products.product': { $in: productIds },
          },
        },
        { $unwind: '$products' },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'productDoc',
          },
        },
        { $unwind: '$productDoc' },
        { $match: { 'productDoc.seller': sellerId } },
        {
          $group: {
            _id: '$buyer',
            revenue: {
              $sum: { $multiply: ['$products.quantity', '$products.price'] },
            },
            orders: { $addToSet: '$_id' },
          },
        },
      ]);

      revenue = orders.reduce((sum, entry) => sum + entry.revenue, 0);
      orderCount = orders.reduce((sum, entry) => sum + entry.orders.length, 0);
      customerCount = orders.length;
    }

    res.json({
      productCount,
      lowStockCount,
      orderCount,
      customerCount,
      revenue,
    });
  } catch (error) {
    console.error('Get seller overview error', error);
    res.status(500).json({ message: 'Unable to fetch seller overview' });
  }
};

const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const productIds = await Product.find({ seller: sellerId }).distinct('_id');
    if (!productIds.length) {
      return res.json({
        revenue: 0,
        orders: 0,
        unitsSold: 0,
        topProducts: [],
      });
    }

    const stats = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'Cart' },
          'products.product': { $in: productIds },
        },
      },
      { $unwind: '$products' },
      {
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'productDoc',
        },
      },
      { $unwind: '$productDoc' },
      { $match: { 'productDoc.seller': sellerId } },
      {
        $group: {
          _id: '$products.product',
          unitsSold: { $sum: '$products.quantity' },
          revenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
          name: { $first: '$productDoc.name' },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    const revenue = stats.reduce((sum, entry) => sum + entry.revenue, 0);
    const unitsSold = stats.reduce((sum, entry) => sum + entry.unitsSold, 0);
    const orders = await Order.countDocuments({
      status: { $ne: 'Cart' },
      'products.product': { $in: productIds },
    });

    res.json({
      revenue,
      orders,
      unitsSold,
      topProducts: stats.slice(0, 5).map((entry) => ({
        id: entry._id,
        name: entry.name,
        revenue: entry.revenue,
        unitsSold: entry.unitsSold,
      })),
    });
  } catch (error) {
    console.error('Get seller analytics error', error);
    res.status(500).json({ message: 'Unable to fetch seller analytics' });
  }
};

module.exports = {
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  getSellerOrders,
  getSellerCustomers,
  getSellerOverview,
  getSellerAnalytics,
};
