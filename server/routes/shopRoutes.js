const express = require('express');
const { getShopBySlug, getAllShops } = require('../controllers/shopController');

const router = express.Router();

router.get('/', getAllShops);
router.get('/:slug', getShopBySlug);

module.exports = router;
