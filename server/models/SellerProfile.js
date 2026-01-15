const mongoose = require('mongoose');

const SellerProfileSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    logo: String,
    banner: String,
    bio: String,
    contactEmail: String,
    contactPhone: String,
    address: {
      address: String,
      city: String,
      country: String,
      postalCode: String,
    },
    policies: {
      shipping: String,
      returns: String,
    },
    payout: {
      bankName: String,
      accountName: String,
      accountNumber: String,
      currency: String,
    },
    shipping: {
      defaultFee: {
        type: String,
        set: function(value) {
          // Convert numeric strings to numbers, but allow 'free' or other descriptive values
          if (typeof value === 'string' && !isNaN(value) && !isNaN(parseFloat(value))) {
            return parseFloat(value);
          }
          return value;
        }
      },
      processingTime: String,
      regions: [String],
    },
    socials: {
      website: String,
      facebook: String,
      instagram: String,
      tiktok: String,
      telegram: String,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'pending',
    },
    statusNotes: [
      {
        status: String,
        note: String,
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SellerProfile', SellerProfileSchema);
