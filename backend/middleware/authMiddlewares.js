const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("=== AUTH MIDDLEWARE ===");
    console.log("Request URL:", req.url);
    console.log("Request method:", req.method);
    console.log("Auth header:", token);
    
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; // Extract token
      console.log("Extracted token:", token);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      
      req.user = await User.findById(decoded.id).select("-password");
      console.log("User found:", req.user);
      
      if (!req.user) {
        console.log("User not found in database");
        return res.status(401).json({ message: "User not found" });
      }
      
      console.log("Authentication successful");
      next();
    } else {
      console.log("No token or invalid format");
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token failed", error: error.message });
  }
};

module.exports = { protect };
