const express = require('express');
const { register, login, getMe, googleAuth, refreshToken, createInitialAdmin, updateUserRole } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/refresh-token', refreshToken);
router.get('/me', authMiddleware, getMe);
router.post('/initial-admin', createInitialAdmin);

// Route to update user role (accessible by admin or user themselves)
router.put('/users/:userId/role', authMiddleware, updateUserRole);

module.exports = router;
