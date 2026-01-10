const express = require('express');
const {
  getUsers,
  updateUserRole,
  createCategory,
  approveProduct,
  getAnalytics,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware, allowRoles('Admin'));
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.post('/categories', createCategory);
router.put('/products/:id/approve', approveProduct);
router.get('/analytics', getAnalytics);

module.exports = router;
