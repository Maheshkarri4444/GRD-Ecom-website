const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Reference to the Category model
    required: true,
  },
  blobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blob", // Reference to a Blob model (assuming it's used for file storage or metadata)
    required: false,
  },
  images: [
    {
      type: String, // Array of image links
    },
  ],
  deleted: {
    type: Boolean,
    default: false, // Default value set to false
  },
});

module.exports = mongoose.model("Product", ProductSchema);
