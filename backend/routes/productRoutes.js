const express = require("express");
const router = express.Router();
const { authMiddleware,authAdminMiddleware } = require("../middleware/authMiddleware");
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Route to add a new product
router.post("/add", authAdminMiddleware, addProduct);

// Route to get all products
router.get("/all",  getAllProducts);

// Route to get a product by ID
router.get("/:id", authMiddleware, getProductById);

// Route to update a product
router.put("/update/:id", authAdminMiddleware, updateProduct);

// Route to delete a product
router.delete("/delete/:id", authAdminMiddleware, deleteProduct);

module.exports = router;
