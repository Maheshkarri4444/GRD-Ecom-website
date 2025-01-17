const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware ,authAdminMiddleware} = require('../middleware/authMiddleware')
// Signup Route
router.post('/signup', userController.signup);

// Login Route
router.post('/login', userController.login);

router.post('/logout', authMiddleware, userController.logout);

router.put("/edit-profile", authMiddleware, userController.editProfile);

router.put('/assign-admin/:userId', authAdminMiddleware, userController.assignAdmin);

// Remove Admin Route
router.put('/remove-admin/:userId', authAdminMiddleware, userController.removeAdmin);

router.get('/all-users', authAdminMiddleware, userController.getAllUsers);


module.exports = router;