const Product = require('../models/Product');
const Review = require('../models/Review');

const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error', error);
    res.status(500).json({ message: 'Unable to fetch reviews' });
  }
};

const upsertReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const existing = await Review.findOne({
      product: product._id,
      user: req.user._id,
    });

    if (existing) {
      existing.rating = Number(rating);
      existing.comment = comment || '';
      await existing.save();
    } else {
      await Review.create({
        product: product._id,
        user: req.user._id,
        rating: Number(rating),
        comment: comment || '',
      });
    }

    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
          ratingsCount: { $sum: 1 },
        },
      },
    ]);

    const nextStats = stats[0] || { averageRating: 0, ratingsCount: 0 };
    product.averageRating = Number(nextStats.averageRating.toFixed(2));
    product.ratingsCount = nextStats.ratingsCount;
    await product.save();

    res.json({ averageRating: product.averageRating, ratingsCount: product.ratingsCount });
  } catch (error) {
    console.error('Upsert review error', error);
    res.status(500).json({ message: 'Unable to submit review' });
  }
};

module.exports = {
  getReviewsByProduct,
  upsertReview,
};
