const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authAdminMiddleware, authMiddleware } = require("../middleware/authMiddleware");

// Get all orders
router.get('/', authMiddleware ,orderController.getAllOrders);

// Get orders by userId
router.get('/user/:userId', authMiddleware,orderController.getOrdersByUserId);

// Place a new order
router.post('/', authMiddleware,orderController.placeOrder);

// Update an existing order
router.put('/:orderId',authMiddleware, orderController.updateOrder);

module.exports = router;
