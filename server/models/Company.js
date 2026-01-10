const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    registrationNumber: String,
    country: String,
    sector: String,
    website: String,
    description: String,
    logo: String,
    contactEmail: String,
    contactPhone: String,
    documents: [
      {
        name: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', CompanySchema);
