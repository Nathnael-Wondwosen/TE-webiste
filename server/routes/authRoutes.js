const express = require('express');
const { register, login, getMe, googleAuth, refreshToken, createInitialAdmin } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/refresh-token', refreshToken);
router.get('/me', authMiddleware, getMe);
router.post('/initial-admin', createInitialAdmin);

module.exports = router;
