const streamifier = require('streamifier');
const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer, folder = 'trade-ethiopia/products') =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

const createSlug = (name) =>
  `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-5)}`;

const createProduct = async (req, res) => {
  try {
    const payload = req.body;
    let imageUrls = [];

    if (payload.images && typeof payload.images === 'string') {
      imageUrls = JSON.parse(payload.images);
    } else if (Array.isArray(payload.images)) {
      imageUrls = payload.images;
    }

    if (req.files && req.files.length) {
      const uploadResults = await Promise.all(
        req.files.map(async (file) => {
          const uploaded = await uploadToCloudinary(file.buffer);
          return {
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
          };
        })
      );
      imageUrls = [...imageUrls, ...uploadResults];
    }

    const slug = payload.name ? createSlug(payload.name) : undefined;

    const product = await Product.create({
      ...payload,
      slug,
      images: imageUrls,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error', error);
    res.status(500).json({ message: 'Unable to create product' });
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      productType,
      country,
      verified,
      sortBy,
      search,
      categorySlug,
    } = req.query;

    const filters = {};
    if (productType) filters.productType = productType;
    if (country) filters.country = country;
    if (verified !== undefined) filters.verified = verified === 'true';
    if (sortBy) {
      if (sortBy === 'newest') {
        filters.createdAt = { $exists: true };
      }
    }

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filters.category = category._id;
      }
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'price-asc') sortOptions = { price: 1 };
    if (sortBy === 'price-desc') sortOptions = { price: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .populate('category', 'name slug')
      .populate('seller', 'name email role')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      data: products,
      page: Number(page),
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Get products error', error);
    res.status(500).json({ message: 'Unable to fetch products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'name email role');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error', error);
    res.status(500).json({ message: 'Unable to fetch product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (
      req.user.role !== 'Admin' &&
      product.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const payload = req.body;
    let imageUrls = product.images || [];

    if (payload.images && typeof payload.images === 'string') {
      imageUrls = JSON.parse(payload.images);
    } else if (Array.isArray(payload.images)) {
      imageUrls = payload.images;
    }

    if (req.files && req.files.length) {
      const uploadResults = await Promise.all(
        req.files.map(async (file) => {
          const uploaded = await uploadToCloudinary(file.buffer);
          return {
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
          };
        })
      );
      imageUrls = [...imageUrls, ...uploadResults];
    }

    if (payload.name && payload.name !== product.name) {
      payload.slug = createSlug(payload.name);
    }
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...payload,
        images: imageUrls,
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error('Update product error', error);
    res.status(500).json({ message: 'Unable to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (
      req.user.role !== 'Admin' &&
      product.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error', error);
    res.status(500).json({ message: 'Unable to delete product' });
  }
};

const verifyProduct = async (req, res) => {
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
    console.error('Verify product error', error);
    res.status(500).json({ message: 'Unable to verify product' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  verifyProduct,
};
