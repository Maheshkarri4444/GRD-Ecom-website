const Category = require("../models/Category");
const Product = require("../models/Products");
const Cart = require("../models/Cart");
const Order = require("../models/Order.js");

// Add a new category
exports.addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "Category name is required",
    });
  }

  try {
    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({
      error: false,
      success: true,
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to add category",
    });
  }
};

// Edit a category
exports.editCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "Category name is required",
    });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      error: false,
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to update category",
    });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the category by ID
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Category not found",
      });
    }

    // Mark all products associated with the deleted category as deleted
    const updatedProducts = await Product.updateMany(
      { category: id },
      { deleted: true }
    );

    // Remove the deleted products from all carts
    if (updatedProducts.modifiedCount > 0) {
      await Cart.updateMany(
        { "products.productId": { $in: updatedProducts.ids } },
        { $pull: { products: { productId: { $in: updatedProducts.ids } } } }
      );
    }

    res.status(200).json({
      error: false,
      success: true,
      message: "Category deleted successfully, associated products marked as deleted, and carts updated",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to delete category and mark associated products as deleted",
    });
  }
};


exports.getAllCategories = async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(200).json({
        error: false,
        success: true,
        message: "Categories fetched successfully",
        categories,
      });
    } catch (error) {
      res.status(500).json({
        error: true,
        success: false,
        message: "Failed to fetch categories",
      });
    }
  };