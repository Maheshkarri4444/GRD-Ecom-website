const express = require("express");
const router = express.Router();
const { authAdminMiddleware, authMiddleware } = require("../middleware/authMiddleware");
const {
  addCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/categoryController");

// Route to add a category
router.post("/add", authAdminMiddleware, addCategory);

// Route to edit a category
router.put("/edit/:id", authAdminMiddleware, editCategory);

// Route to delete a category
router.delete("/delete/:id", authAdminMiddleware, deleteCategory);

router.get("/all", getAllCategories);

module.exports = router;
