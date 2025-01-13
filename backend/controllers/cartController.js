const Cart = require('../models/Cart');

// Get the cart for the user
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from JWT payload
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Update cart with product details
exports.updateCart = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from JWT payload
        const { productId, quantity } = req.body;

        // Validate input
        if (!productId || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid product ID or quantity' });
        }

        // Find the cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new Cart({
                userId,
                products: [{ productId, quantity }],
            });
            await cart.save();
            return res.status(201).json({ message: 'Cart created and product added', cart });
        }

        // Check if the product already exists in the cart
        const existingProduct = cart.products.find(
            (item) => item.productId.toString() === productId.toString()
        );

        if (existingProduct) {
            // Update quantity if the product exists in the cart
            existingProduct.quantity = quantity;
        } else {
            // Add new product to the cart
            cart.products.push({ productId, quantity });
        }

        // Save the cart
        await cart.save();

        res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

