const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    approved: {
      type: Boolean,
      default: false,
    },
    featureExpiresAt: Date,
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
