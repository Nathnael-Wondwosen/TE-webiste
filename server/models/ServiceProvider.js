const mongoose = require('mongoose');

const ServiceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    providerType: {
      type: String,
      enum: ['Logistics', 'Broker', 'Bank', 'Insurance', 'Customs', 'Other'],
      default: 'Other',
    },
    description: String,
    verified: {
      type: Boolean,
      default: false,
    },
    contactEmail: String,
    contactPhone: String,
    country: String,
    website: String,
    services: [String],
    documents: [
      {
        name: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);
