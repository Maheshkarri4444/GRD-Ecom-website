const Blob = require('../models/blob');
const Product = require("../models/Products");

// Create a new blob
exports.createBlob = async (req, res) => {
    try {
        const newBlob = new Blob(req.body);
        const savedBlob = await newBlob.save();
        res.status(201).json(savedBlob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all blobs
exports.getBlobs = async (req, res) => {
    try {
        const blobs = await Blob.find();
        res.status(200).json(blobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get blob by ID
exports.getBlobById = async (req, res) => {
    try {
        const blob = await Blob.findById(req.params.id);
        if (!blob) return res.status(404).json({ message: 'Blob not found' });
        res.status(200).json(blob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a blob
exports.updateBlob = async (req, res) => {
    try {
        const updatedBlob = await Blob.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedBlob) return res.status(404).json({ message: 'Blob not found' });
        res.status(200).json(updatedBlob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a blob
exports.deleteBlob = async (req, res) => {
    try {
        // Find and delete the Blob by its ID
        const deletedBlob = await Blob.findByIdAndDelete(req.params.id);

        if (!deletedBlob) {
            return res.status(404).json({ message: 'Blob not found' });
        }

        // After deleting the blob, update the associated products
        await Product.updateMany(
            { blobId: req.params.id }, // Find products associated with the deleted blob
            { $set: { blobId: null } }  // Set their blobId to null
        );

        res.status(200).json({ message: 'Blob deleted successfully, associated products updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
