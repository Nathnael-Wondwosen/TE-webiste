const express = require('express');
const { getPublicB2BProducts } = require('../controllers/b2bProductController');

const router = express.Router();

router.get('/', getPublicB2BProducts);

module.exports = router;
