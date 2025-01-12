const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
        const { role, name, phoneNumber, emailAddress, password, address } = req.body;

        if (emailAddress) {
          const existingUser = await User.findOne({ emailAddress });
          if (existingUser) {
            return res.status(400).json({
              success: false,
              message: "email already exists",
            });
          }
        }

        // Create new user
        const user = new User({
            name,
            role,
            phoneNumber,
            emailAddress,
            password,
            address,
        });

        await user.save();

        // Exclude password from user response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
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
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
