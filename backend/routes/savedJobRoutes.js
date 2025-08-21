const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddlewares");
const {
  saveJob,
  unsaveJob,
  getMySavedJobs,
} = require("../controllers/savedJobController");

router.post("/:jobId", protect, saveJob);
router.delete("/:jobId", protect, unsaveJob);
router.get("/my", protect, getMySavedJobs);

module.exports = router;
