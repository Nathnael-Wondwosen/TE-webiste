const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getFavorites, addFavorite, removeFavorite, getRecommendations } = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:productId', removeFavorite);
router.get('/recommendations', getRecommendations);

module.exports = router;
