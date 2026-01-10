const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: Number,
        price: Number,
      },
    ],
    total: Number,
    shippingAddress: {
      address: String,
      city: String,
      country: String,
      postalCode: String,
    },
    status: {
      type: String,
      enum: ['Cart', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Cart',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
