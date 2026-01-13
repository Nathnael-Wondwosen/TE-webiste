const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error', error);
    res.status(500).json({ message: 'Unable to fetch categories' });
  }
};

module.exports = {
  getCategories,
};
