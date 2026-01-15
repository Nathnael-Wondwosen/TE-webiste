const express = require('express');
const { getShopBySlug } = require('../controllers/shopController');

const router = express.Router();

router.get('/:slug', getShopBySlug);

module.exports = router;
