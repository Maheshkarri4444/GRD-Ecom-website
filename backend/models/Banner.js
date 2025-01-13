const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    banner: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    }
});

// Ensure only up to 3 banners exist
bannerSchema.statics.canCreateBanner = async function () {
    const count = await this.countDocuments();
    return count < 3;
};

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
