const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  verifyProduct,
} = require('../controllers/productController');
const { getReviewsByProduct, upsertReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  allowRoles('Seller', 'Admin'),
  upload.array('images', 6),
  createProduct
);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getReviewsByProduct);
router.post('/:id/reviews', authMiddleware, upsertReview);
router.put('/:id', authMiddleware, upload.array('images', 6), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.put('/:id/verify', authMiddleware, allowRoles('Admin'), verifyProduct);

module.exports = router;
