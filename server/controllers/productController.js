const streamifier = require('streamifier');
const Product = require('../models/Product');
const Category = require('../models/Category');
const SellerProfile = require('../models/SellerProfile');
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

const normalizeVideos = (input) => {
  if (!input) return [];
  const list = Array.isArray(input) ? input : typeof input === 'string' ? JSON.parse(input) : [];
  return list
    .map((entry) => {
      const raw = typeof entry === 'string' ? entry : entry?.url;
      if (!raw || typeof raw !== 'string') return null;
      const trimmed = raw.trim();
      if (!trimmed) return null;
      const lower = trimmed.toLowerCase();

      if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
        let id = '';
        if (lower.includes('youtu.be/')) {
          id = trimmed.split('youtu.be/')[1]?.split(/[?&]/)[0] || '';
        } else if (lower.includes('v=')) {
          id = trimmed.split('v=')[1]?.split('&')[0] || '';
        } else if (lower.includes('/embed/')) {
          id = trimmed.split('/embed/')[1]?.split(/[?&]/)[0] || '';
        }
        if (!id) return null;
        return {
          url: trimmed,
          provider: 'youtube',
          embedUrl: `https://www.youtube.com/embed/${id}`,
          thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        };
      }

      if (lower.includes('vimeo.com')) {
        const parts = trimmed.split('/');
        const id = parts[parts.length - 1]?.split('?')[0];
        if (!id) return null;
        return {
          url: trimmed,
          provider: 'vimeo',
          embedUrl: `https://player.vimeo.com/video/${id}`,
          thumbnail: '',
        };
      }

      if (lower.endsWith('.mp4') || lower.includes('.mp4?')) {
        return {
          url: trimmed,
          provider: 'mp4',
          embedUrl: trimmed,
          thumbnail: '',
        };
      }

      return null;
    })
    .filter(Boolean);
};

const createProduct = async (req, res) => {
  try {
    const payload = req.body;
    let imageUrls = [];
    let categoryId = payload.category;
    let status = payload.status;

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
    const videos = normalizeVideos(payload.videos);
    if (categoryId && !categoryId.match(/^[a-f\d]{24}$/i)) {
      const categorySlug = categoryId.toLowerCase().replace(/\s+/g, '-');
      let category = await Category.findOne({ $or: [{ name: categoryId }, { slug: categorySlug }] });
      if (!category) {
        category = await Category.create({ name: categoryId, slug: categorySlug });
      }
      categoryId = category._id;
    }

    if (!status) {
      if (req.user.role === 'Seller') {
        status = 'approved';
      } else {
        status = payload.approved === 'true' || payload.verified === 'true' ? 'approved' : 'pending';
      }
    }
    const approved = status === 'approved';
    const verified = status === 'approved';

    const product = await Product.create({
      ...payload,
      slug,
      images: imageUrls,
      videos,
      category: categoryId,
      status,
      approved,
      verified,
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
      approved,
      sortBy,
      search,
      categorySlug,
    } = req.query;

    console.log('GetProducts Query Params:', { verified, approved });

    const filters = {};
    if (productType) filters.productType = productType;
    if (country) filters.country = country;
    if (verified !== undefined) filters.verified = verified === 'true';
    // Check if we should filter by seller status instead of product approval
    if (req.query.checkSellerStatus === 'true') {
      // This will be handled with a join query to SellerProfile
      console.log('Using seller status check instead of product approval');
    } else {
      // Original logic for approved filter
      if (approved !== undefined) filters.approved = approved === 'true';
    }
    if (verified !== undefined) filters.verified = verified === 'true';
    if (sortBy) {
      if (sortBy === 'newest') {
        filters.createdAt = { $exists: true };
      }
    }

    console.log('Applied filters:', filters);

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
    
    let products, total;
    
// Original logic
      total = await Product.countDocuments(filters);
      console.log('Total products matching filters:', total);
      
      products = await Product.find(filters)
        .populate('category', 'name slug')
        .populate('seller', 'name email role')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));
    
    console.log('Products retrieved:', products.length);
    products.forEach(product => {
      console.log(`Product ID: ${product._id}, Name: ${product.name}, Status: ${product.status}, Approved: ${product.approved}, Verified: ${product.verified}, Seller Role: ${product.seller?.role}, Seller ID: ${product.seller?._id}`);
    });

    const categoryIdCandidates = new Set();
    products.forEach((product) => {
      if (typeof product.category === 'string') {
        categoryIdCandidates.add(product.category);
      } else if (product.category?.name && /^[a-f\d]{24}$/i.test(product.category.name)) {
        categoryIdCandidates.add(product.category.name);
      }
    });

    if (categoryIdCandidates.size) {
      const categories = await Category.find({ _id: { $in: Array.from(categoryIdCandidates) } });
      const categoryMap = categories.reduce((acc, category) => {
        acc[category._id.toString()] = category;
        return acc;
      }, {});

      await Promise.all(
        products.map(async (product) => {
          let match = null;
          if (typeof product.category === 'string') {
            match = categoryMap[product.category];
          } else if (product.category?.name && categoryMap[product.category.name]) {
            match = categoryMap[product.category.name];
          }
          if (match) {
            product.category = match;
            try {
              await Product.updateOne(
                { _id: product._id },
                { category: match._id }
              );
            } catch (error) {
              console.warn('Category repair failed', error);
            }
          }
        })
      );
    }

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
  const isAdmin = req.user.role === 'Admin';
    let imageUrls = product.images || [];
    let categoryId = payload.category;
    const videos = normalizeVideos(payload.videos);

  let providedImages = false;
  if (payload.images && typeof payload.images === 'string') {
    imageUrls = JSON.parse(payload.images);
    providedImages = true;
  } else if (Array.isArray(payload.images)) {
    imageUrls = payload.images;
    providedImages = true;
  }

  if (providedImages) {
    const existingPublicIds = new Set(
      imageUrls
        .filter((image) => image.publicId)
        .map((image) => image.publicId)
    );
    const removedImages = (product.images || []).filter(
      (image) => image.publicId && !existingPublicIds.has(image.publicId)
    );
    if (removedImages.length) {
      const deletions = await Promise.allSettled(
        removedImages.map((image) => cloudinary.uploader.destroy(image.publicId))
      );
      const failed = deletions.filter((result) => result.status === 'rejected');
      if (failed.length) {
        console.warn('Some Cloudinary deletions failed', failed.length);
      }
    }
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
    if (categoryId && !categoryId.match(/^[a-f\d]{24}$/i)) {
      const categorySlug = categoryId.toLowerCase().replace(/\s+/g, '-');
      let category = await Category.findOne({ $or: [{ name: categoryId }, { slug: categorySlug }] });
      if (!category) {
        category = await Category.create({ name: categoryId, slug: categorySlug });
      }
      categoryId = category._id;
    }
    if (payload.status && !isAdmin) {
      delete payload.status;
    }
    if (payload.status && isAdmin) {
      payload.approved = payload.status === 'approved';
      payload.verified = payload.status === 'approved';
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...payload,
        images: imageUrls,
        ...(payload.videos !== undefined ? { videos } : {}),
        ...(categoryId ? { category: categoryId } : {}),
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

    // Authorization: Allow Admins to delete any product, or allow product owner to delete their own product
    // Also ensure the user is a Seller, ProspectiveSeller, or Admin
    const isOwner = product.seller.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';
    const isAuthorizedSeller = ['Seller', 'ProspectiveSeller'].includes(req.user.role);
    
    if (!(isAdmin || (isOwner && isAuthorizedSeller))) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own products' });
    }

    if (product.images && product.images.length) {
      const deletions = await Promise.allSettled(
        product.images
          .filter((image) => image.publicId)
          .map((image) => cloudinary.uploader.destroy(image.publicId))
      );
      const failed = deletions.filter((result) => result.status === 'rejected');
      if (failed.length) {
        console.warn('Some Cloudinary deletions failed', failed.length);
      }
    }

    await product.deleteOne();
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
