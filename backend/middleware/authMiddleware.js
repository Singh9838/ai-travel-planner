const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    // Check token exists
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // Extract token
    const token =
      authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user without password
    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = { protect };