const express = require('express');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  checkout,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/cart', authMiddleware, addToCart);
router.get('/cart', authMiddleware, getCart);
router.put('/cart/:productId', authMiddleware, updateCartItem);
router.delete('/cart/:productId', authMiddleware, removeFromCart);
router.post('/checkout', authMiddleware, checkout);
router.get('/', authMiddleware, getOrders);
router.put('/:id/status', authMiddleware, allowRoles('Seller', 'Admin'), updateOrderStatus);

module.exports = router;
