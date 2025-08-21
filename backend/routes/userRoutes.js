const express = require("express")
const { updateProfile, deleteResume, getPublicProfile } = require("../controllers/userController")
const { protect } = require("../middleware/authMiddlewares");

const router = express.Router();

// protected route 
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, deleteResume);

// public route 
router.get("/:id", getPublicProfile);

module.exports = router;