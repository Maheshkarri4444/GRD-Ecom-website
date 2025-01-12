const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { role, name, phoneNumber, emailAddress, password, address } = req.body;

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
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
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
