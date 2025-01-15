const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    paragraph: { type: String, required: true }
});

const blobSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true },
    images: [{ type: String }],
    content: [contentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Blob', blobSchema);