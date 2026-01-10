const express = require('express');
const {
  createAdvertisement,
  getAdvertisements,
  approveAdvertisement,
} = require('../controllers/advertisementController');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getAdvertisements);
router.post(
  '/',
  authMiddleware,
  allowRoles('Seller', 'ServiceProvider', 'Admin'),
  createAdvertisement
);
router.put('/:id/approve', authMiddleware, allowRoles('Admin'), approveAdvertisement);

module.exports = router;
