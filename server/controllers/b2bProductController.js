const B2BProduct = require('../models/B2BProduct');

const normalizeType = (value) => {
  if (typeof value !== 'string') return 'local';
  const lane = value.toLowerCase();
  return lane === 'international' ? 'international' : 'local';
};

const createB2BProduct = async (req, res) => {
  try {
    const { name, description, productType, price, status } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const doc = await B2BProduct.create({
      name,
      description,
      productType: normalizeType(productType),
      price,
      status: status === 'archived' ? 'archived' : 'active',
      createdBy: req.user?._id,
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error('Create B2B product error', error);
    res.status(500).json({ message: 'Unable to create B2B product' });
  }
};

const getB2BProductsAdmin = async (req, res) => {
  try {
    const items = await B2BProduct.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get B2B products (admin) error', error);
    res.status(500).json({ message: 'Unable to fetch B2B products' });
  }
};

const getPublicB2BProducts = async (req, res) => {
  try {
    const filter = { status: 'active' };
    if (req.query.productType) {
      filter.productType = normalizeType(req.query.productType);
    }
    const items = await B2BProduct.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get public B2B products error', error);
    res.status(500).json({ message: 'Unable to fetch B2B products' });
  }
};

const deleteB2BProduct = async (req, res) => {
  try {
    const item = await B2BProduct.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'B2B product not found' });
    }
    await item.deleteOne();
    res.json({ message: 'B2B product deleted' });
  } catch (error) {
    console.error('Delete B2B product error', error);
    res.status(500).json({ message: 'Unable to delete B2B product' });
  }
};

module.exports = {
  createB2BProduct,
  getB2BProductsAdmin,
  getPublicB2BProducts,
  deleteB2BProduct,
};
