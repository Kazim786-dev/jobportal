
const JobPosting = require('../models/jobmodel')
const JobApplication = require('../models/applicationmodel')
const studentroute = require('express').Router()
const { verifyuserloggedin, checkRole } = require('../middleware/auth')
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/resumes');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const filter = (req, file, cb) => {
  if (file.mimetype == 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error("UnSupported file"), false)
  }
}


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
  fileFilter: filter,

}).single('resumeUrl');



studentroute.post('/job/apply', verifyuserloggedin, checkRole("student"), upload, async (req, res, next) => {
  const { jobPostingId, coverMessage } = req.body;

  try {
    const jobPosting = await JobPosting.findById(jobPostingId);

    if (!jobPosting) {
      return res.status(404).send('Job posting not found');
    }

    const resumeUrl = req.file.path

    const jobApplication = await JobApplication.create({
      jobPosting: jobPostingId,
      applicant: req.decoded.id,
      resumeUrl: resumeUrl,
      coverMessage: coverMessage
    });

    res.status(201).send(jobApplication);

    // // Create a new job application
    // const jobApplication = new JobApplication({
    //   jobPosting: jobPostingId,
    //   applicant: req.user._id,
    //   resumeUrl: resumeUrl,
    //   coverMessage: coverMessage
    // });

    // // Save the job application to the database
    // await jobApplication.save();


  } catch (err) {
    res.status(400).send(err);
  }
});


studentroute.get('/jobs', verifyuserloggedin, checkRole("student"), async (req, res) => {
  try {
    const jobPostings = await JobPosting.find();

    res.status(200).json(jobPostings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Define job search API endpoint
studentroute.get('/jobs/search', verifyuserloggedin, checkRole("student"), async (req, res) => {
  try {
    const filters = req.query; // Get query parameters from request

    const query = {};

    if (filters.jobTitle) {
      query.jobTitle = { $regex: new RegExp(filters.jobTitle, 'i') };
    }
    if (filters.location) {
      query.location = { $regex: new RegExp(filters.location, 'i') };
    }
    if (filters.salary) {
      query.salary = filters.salary;
    }
    if (filters.jobTags) {
      query.jobTags = { $in: filters.jobTags };
    }
    if (filters.keywords) {
      query.keywords = { $in: filters.keywords };
    }

    const jobPostings = await JobPosting.find(query); // Find job postings matching the filters

    res.status(200).json(jobPostings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = studentroute