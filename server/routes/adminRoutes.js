const express = require('express');
const { getUsers, updateUserRole, getCategories, createCategory, approveProduct, updateProductStatus, getAnalytics, getSellers, updateSellerStatus, fixAllProductsForSeller, activateAllSellerProfiles, deleteUser } = require('../controllers/adminController');
const { createAdminBySuper, getProspectiveSellers } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware, allowRoles('Admin'));
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/prospective-sellers', getProspectiveSellers);
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.get('/sellers', getSellers);
router.put('/sellers/:id/status', updateSellerStatus);
router.put('/products/:id/approve', approveProduct);
router.put('/products/:id/status', updateProductStatus);
router.put('/products/seller/:sellerId/fix-status', fixAllProductsForSeller);
router.post('/sellers/activate-all', activateAllSellerProfiles);
router.get('/analytics', getAnalytics);
router.post('/create-admin', createAdminBySuper);
router.delete('/users/:userId', deleteUser);
router.put('/products/fix-all-seller-products', fixAllSellerProducts);

module.exports = router;
