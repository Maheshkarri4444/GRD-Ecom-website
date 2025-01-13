const Banner = require('../models/Banner');

// Create a new banner
exports.createBanner = async (req, res) => {
    try {
        if (!(await Banner.canCreateBanner())) {
            return res.status(400).json({ message: 'Maximum of 3 banners allowed.' });
        }
        const banner = new Banner(req.body);
        const savedBanner = await banner.save();
        res.status(201).json(savedBanner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all banners
exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a banner by ID
exports.updateBanner = async (req, res) => {
    try {
        const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBanner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.status(200).json(updatedBanner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a banner by ID
exports.deleteBanner = async (req, res) => {
    try {
        const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
        if (!deletedBanner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
