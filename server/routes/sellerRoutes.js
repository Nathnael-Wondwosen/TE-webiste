const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const {
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  getSellerOrders,
  getSellerCustomers,
  getSellerOverview,
  getSellerAnalytics,
} = require('../controllers/sellerController');

const router = express.Router();

router.use(authMiddleware, allowRoles('Seller', 'Admin', 'ProspectiveSeller'));

router.get('/profile', getSellerProfile);
router.put('/profile', updateSellerProfile);
router.get('/overview', getSellerOverview);
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);
router.get('/customers', getSellerCustomers);
router.get('/analytics', getSellerAnalytics);

module.exports = router;
