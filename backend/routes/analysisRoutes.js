const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authAdminMiddleware } = require("../middleware/authMiddleware");

// Get order analytics
router.get('/orderAnalytics',  analyticsController.getOrderAnalytics);

// Get revenue analytics
router.get('/revenueAnalytics',  analyticsController.getRevenueAnalytics);

// Get top products
router.get('/topProducts',  analyticsController.getTopProducts);

module.exports = router;
