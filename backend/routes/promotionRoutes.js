const express = require("express");
const { createPromotion, getPromotions, deletePromotion } = require("../controllers/promotionController");
const { authAdminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",authAdminMiddleware, createPromotion);
router.get("/", getPromotions);
router.delete("/:id", authAdminMiddleware, deletePromotion);

module.exports = router;
