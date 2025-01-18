const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { authAdminMiddleware,authMiddleware } = require('../middleware/authMiddleware');
// Create a new banner
router.post('/banners',authAdminMiddleware, bannerController.createBanner);

// Get all banners
router.get('/banners', bannerController.getBanners);

// Update a banner by ID
router.put('/banners/:id',authAdminMiddleware, bannerController.updateBanner);

// Delete a banner by ID
router.delete('/banners/:id', authAdminMiddleware,bannerController.deleteBanner);

module.exports = router;
