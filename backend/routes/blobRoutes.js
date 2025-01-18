const express = require('express');
const router = express.Router();
const blobController = require('../controllers/blobController');
const { authAdminMiddleware , authMiddleware } = require("../middleware/authMiddleware")
// Routes
router.post('/blobs', authAdminMiddleware, blobController.createBlob);
router.get('/blobs', blobController.getBlobs);
router.get('/blobs/:id', blobController.getBlobById);
router.put('/blobs/:id', authAdminMiddleware, blobController.updateBlob);
router.delete('/blobs/:id', authAdminMiddleware, blobController.deleteBlob);

module.exports = router;
