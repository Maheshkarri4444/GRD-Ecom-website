const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware')
// Signup Route
router.post('/signup', userController.signup);

// Login Route
router.post('/login', userController.login);

router.post('/logout', authMiddleware, userController.logout);

router.put("/edit-profile", authMiddleware, userController.editProfile);


module.exports = router;