const Promotion = require("../models/Promotion");

// Create a new promotion
exports.createPromotion = async (req, res) => {
  try {
    const { type, link } = req.body;
    if (!type || !link) {
      return res.status(400).json({ message: "Type and link are required" });
    }

    const promotion = new Promotion({ type, link });
    await promotion.save();
    
    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all promotions
exports.getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a promotion by ID
exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndDelete(id);
    
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
