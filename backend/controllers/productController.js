const Product = require("../models/Products");

// Add a new product
exports.addProduct = async (req, res) => {
  const { name, mrp, salePrice, description, category, blobId, images } = req.body;

  if (!name || !mrp || !salePrice || !description || !category) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const newProduct = new Product({ name, mrp, salePrice, description, category, blobId, images });
    await newProduct.save();

    res.status(201).json({
      error: false,
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to add product",
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name") // Populate category name
      .populate("blobId"); // Populate blob if needed
    res.status(200).json({
      error: false,
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("blobId");

    if (!product) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      error: false,
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true })
      .populate("category", "name")
      .populate("blobId");

    if (!updatedProduct) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      error: false,
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to update product",
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      error: false,
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: "Failed to delete product",
    });
  }
};
