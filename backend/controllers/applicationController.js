const Application = require("../models/Application");
const Job = require("../models/Job");

// Apply to a job 
exports.applyToJob = async (req, res) =>{
    try {
        if(req.user.role !== "jobseeker"){
            return res.status(403).json({message:"Only job seeker can apply"});
        }

        const existing = await Application.findOne({
            job:req.params.jobId,
            applicant:req.user._id,

        });

        if(existing){
            return res.status(400).json({message:"Already applied to this Job"});
        }

        const application = await Application.create({
            job:req.params.jobId,
            applicant:req.user._id,
            resume:req.user.resume, // assuming resume is stored in user profile
        });

        res.status(201).json(application);
        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

// Get logged in user's applications 
exports.getMyApplications = async (req, res) =>{
    try {
        const apps = await Application.find({applicant:req.user._id})
            .populate("job", " title company location type")
            .sort({ createdAt: -1});

            res.json(apps);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

// get all applications for a job ( Employer )
exports.getApplicantsForJob = async (req, res) =>{
    try {
        
        const job = await Job.findById(req.params.jobId);

        if(!job || job.company.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Not authorized to view applicants"});
        }

        const applications = await Application.find({ job:req.params.jobId})
            .populate("job", "title location category type")
            .populate("applicant", "name email avatar resume")

            res.json(applications);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

// get application by ID (jobseeker or Employer) 
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("job", "title company") // <-- include company here
      .populate("applicant", "name email avatar resume");

    if (!app) {
      return res
        .status(404)
        .json({ message: "Application not found", id: req.params.id });
    }

    const isOwner =
      String(app.applicant._id) === String(req.user._id) ||
      String(app.job.company) === String(req.user._id);

    if (!isOwner) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this application" });
    }

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// update application status ( Employer) 
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body; // <-- make sure you destructure it from the request body

    const app = await Application.findById(req.params.id).populate("job");

    if (
      !app ||
      String(app.job.company) !== String(req.user._id) // <-- safe comparison
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    app.status = status;
    await app.save();

    res.json({ message: "Application status updated", status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
