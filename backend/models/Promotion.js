const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Promotion", promotionSchema);
