const User = require('../models/User');
const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
      const { role, name, phoneNumber, emailAddress, password, address } = req.body;

      // Check if the email already exists
      if (emailAddress) {
          const existingUser = await User.findOne({ emailAddress });
          if (existingUser) {
              return res.status(400).json({
                  success: false,
                  message: "Email already exists",
              });
          }
      }

      // Create a new user
      const user = new User({
          name,
          role,
          phoneNumber,
          emailAddress,
          password,
          address,
      });

      // Save the user
      await user.save();

      // Create a cart for the user
      const cart = new Cart({
          userId: user._id,
          products: [],
      });
      await cart.save();

      // Link the cart to the user
      user.cart = cart._id;
      await user.save();

      // Generate a JWT token with user info
      const token = jwt.sign(
          { id: user._id, name: user.name, role: user.role, emailAddress: user.emailAddress  },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
      );

      // Exclude password from the user response
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      // Return the token and user info
      res.status(201).json({
          message: 'User registered successfully',
          token,
          user: userWithoutPassword,
      });
  } catch (error) {
      if (error.code === 11000) {
          return res.status(400).json({ message: 'Email already exists' });
      }
      res.status(500).json({ message: 'Internal Server Error', error });
  }
};



exports.login = async (req, res) => {
    try {
        const { emailAddress, password } = req.body;
        // console.log("req body is: ", req.body)

        // Check if user exists
        const user = await User.findOne({ emailAddress });
        // console.log("user is :", user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Exclude password from user response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({ message: 'Login successful', token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
};


exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT payload
    // console.log("User ID: ", userId);

    const { name, phoneNumber, emailAddress, address, password } = req.body; // Extract details to update

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (emailAddress) {
      const existingUser = await User.findOne({ emailAddress });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({
          success: false,
          message: "email already exists",
        });
      }
    }

    // Update user fields
    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.emailAddress = emailAddress || user.emailAddress;
    user.address = address || user.address;
    user.password = password || user.password;
    // Save updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        phoneNumber: user.phoneNumber,
        emailAddress: user.emailAddress,
        address: user.address,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
};


exports.assignAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (user.role === 'admin') {
          return res.status(400).json({ message: 'User is already an admin' });
      }

      user.role = 'admin';
      await user.save();

      res.status(200).json({ message: 'User has been assigned admin role', user });
  } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Remove Admin Controller
exports.removeAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (user.role !== 'admin') {
          return res.status(400).json({ message: 'User is not an admin' });
      }

      user.role = 'user';
      await user.save();

      res.status(200).json({ message: 'Admin role has been removed from the user', user });
  } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.find({}, '-password'); // Exclude passwords from the response
      res.status(200).json({ message: 'Users retrieved successfully', users });
  } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
