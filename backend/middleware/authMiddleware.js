const jwt = require("jsonwebtoken");
const User = require('../models/User'); // Assuming the User model is located in the models folder

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({
      error: true,
      success: false,
      message: "Authorization header missing",
    });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Add the user information to the request
    next();
  } catch (error) {
    return res.status(401).json({
      error: true,
      success: false,
      message: "Invalid or expired token",
    });
  }
};
