const Order = require('../models/Order');
const Product = require('../models/Product');

const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.quantity * item.price, 0);

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let order = await Order.findOne({
      buyer: req.user._id,
      status: 'Cart',
    });

    if (!order) {
      order = new Order({ buyer: req.user._id });
    }

    const existingItem = order.products.find((item) =>
      item.product.equals(product._id)
    );
    if (existingItem) {
      existingItem.quantity += Number(quantity);
      existingItem.price = product.price;
    } else {
      order.products.push({
        product: product._id,
        quantity: Number(quantity),
        price: product.price,
      });
    }

    order.total = calculateTotal(order.products);
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Add to cart error', error);
    res.status(500).json({ message: 'Unable to add to cart' });
  }
};

const checkout = async (req, res) => {
  try {
    const order = await Order.findOne({
      buyer: req.user._id,
      status: 'Cart',
    }).populate('products.product');

    if (!order || !order.products.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    order.status = 'Pending';
    order.paymentStatus = 'Pending';
    order.shippingAddress = req.body.shippingAddress || order.shippingAddress;
    order.notes = req.body.notes || order.notes;
    order.total = calculateTotal(order.products);
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Checkout error', error);
    res.status(500).json({ message: 'Unable to checkout' });
  }
};

const getOrders = async (req, res) => {
  try {
    const filters = {};
    if (req.user.role !== 'Admin') {
      filters.buyer = req.user._id;
    }
    const orders = await Order.find(filters)
      .populate('products.product', 'name price country')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error', error);
    res.status(500).json({ message: 'Unable to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Update order status error', error);
    res.status(500).json({ message: 'Unable to update order' });
  }
};

module.exports = {
  addToCart,
  checkout,
  getOrders,
  updateOrderStatus,
};
