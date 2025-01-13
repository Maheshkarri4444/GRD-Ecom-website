const express = require('express');
const router = express.Router();
const { getCart, updateCart } = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get the user's cart
router.get('/',authMiddleware, getCart);

// Update the cart
router.put('/',authMiddleware, updateCart);

module.exports = router;
