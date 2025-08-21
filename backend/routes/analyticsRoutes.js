const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddlewares");
const { getEmployerAnalytics } = require("../controllers/analyticsController");
const Job = require("../models/Job");

router.get("/overview", protect, getEmployerAnalytics);

// Test endpoint to check jobs in database
router.get("/test-jobs", protect, async (req, res) => {
    try {
        const allJobs = await Job.find({}).populate("company", "name email");
        const userJobs = await Job.find({ company: req.user._id });
        
        res.json({
            message: "Job test data",
            totalJobsInDatabase: allJobs.length,
            userJobs: userJobs.length,
            allJobs: allJobs,
            userJobsData: userJobs,
            currentUser: {
                id: req.user._id,
                name: req.user.name,
                role: req.user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;