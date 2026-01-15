const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: String,
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    videos: [
      {
        url: String,
        provider: String,
        embedUrl: String,
        thumbnail: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    subCategory: String,
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    unit: {
      type: String,
      default: 'kg',
    },
    quantity: {
      type: Number,
      default: 0,
    },
    minOrder: Number,
    maxOrder: Number,
    verified: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    country: String,
    origin: String,
    productType: {
      type: String,
      enum: ['Local', 'International'],
      default: 'Local',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    shippingOptions: [String],
    approved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'disabled', 'hold'],
      default: 'pending',
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
