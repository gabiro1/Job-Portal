const SavedJob = require("../models/SavedJob");

exports.saveJob = async (req, res) =>{
    try {
        console.log("=== SAVE JOB REQUEST ===");
        console.log("Job ID:", req.params.jobId);
        console.log("User ID:", req.user._id);
        console.log("User:", req.user);

        const exists = await SavedJob.findOne({job:req.params.jobId, jobseeker:req.user._id});
        console.log("Existing saved job:", exists);

        if (exists) {
            console.log("Job already saved, returning 400");
            return res.status(400).json({message:"Job already saved"});
        }

        const saved = await SavedJob.create({job:req.params.jobId, jobseeker:req.user._id})
        console.log("Job saved successfully:", saved);
        res.status(201).json(saved)
        
    } catch (error) {
        console.error("Error saving job:", error);
        res.status(500).json({message:"Failed to save job", error:error.message})
    }
}

exports.unsaveJob = async (req, res) =>{
    try {
        console.log("=== UNSAVE JOB REQUEST ===");
        console.log("Job ID:", req.params.jobId);
        console.log("User ID:", req.user._id);
        
        const result = await SavedJob.findOneAndDelete({job:req.params.jobId, jobseeker:req.user._id});
        console.log("Unsave result:", result);
        res.json({message:"Job removed from saved list"});
    } catch (error) {
        console.error("Error unsaving job:", error);
        res.status(500).json({message:"Failed to remove saved job", error:error.message})
    }
}

exports.getMySavedJobs = async (req, res) =>{
    try {
        const savedJobs = await SavedJob.find({jobseeker:req.user._id})
            .populate({
                path: "job",
                populate: {
                    path:"company",
                    select:"name companyName companyLogo"
                }
            });

            res.json(savedJobs)
    } catch (error) {
        res.status(500).json({message:"Failed to fetch saved job", error:error.message})
    }
}