const express = require('express');
const {
  createServiceProvider,
  getServiceProviders,
  getServiceProviderById,
  verifyServiceProvider,
} = require('../controllers/serviceProviderController');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getServiceProviders);
router.get('/:id', getServiceProviderById);
router.post(
  '/',
  authMiddleware,
  allowRoles('ServiceProvider', 'Seller', 'Admin'),
  createServiceProvider
);
router.put('/:id/verify', authMiddleware, allowRoles('Admin'), verifyServiceProvider);

module.exports = router;
