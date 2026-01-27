const mongoose = require('mongoose');

const B2BProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    productType: {
      type: String,
      enum: ['local', 'international'],
      default: 'local',
    },
    price: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('B2BProduct', B2BProductSchema);
