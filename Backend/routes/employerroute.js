

const JobPosting = require('../models/jobmodel')
const JobApplication = require('../models/applicationmodel')
const Employerroute = require('express').Router()
const {verifyuserloggedin,checkRole} = require('../middleware/auth')


Employerroute.post('/jobPostings', verifyuserloggedin, checkRole("employer"), async (req, res) => {
    const { jobTitle, jobDescription, jobTags } = req.body;
    try {
      const jobPosting = await JobPosting.create({
        jobTitle,
        jobDescription,
        jobTags,
        postedBy: req.decoded.id
      });
  
      res.status(201).send(jobPosting);
    } catch (err) {
      res.status(400).send(err);
    }
  });
  

  Employerroute.get('/jobPostings/:jobPostingId/applications', verifyuserloggedin, checkRole("employer"), async (req, res) => {
    const { jobPostingId } = req.params;
  
    try {
      const jobPosting = await JobPosting.findById(jobPostingId);
  
      if (!jobPosting) {
        return res.status(404).send('Job not found');
      }
      
      if(jobPosting.postedBy!=req.decoded.id){
        res.send("You are not allowed")
      }

      // only specified field of applicant (-_id will exclude the _id which is returned by default 
      //either we mention or not)
      const jobApplications = await JobApplication.find({
        jobPosting: jobPosting._id,
        
      }).populate('applicant', 'name email contactNo organization -_id');  
  
      res.status(200).send(jobApplications);
    } catch (err) {
      res.status(400).send(err);
    }
  });
  
  Employerroute.patch('/jobApplications/:jobApplicationId/status', verifyuserloggedin, checkRole("employer"), async (req, res) => {
    const { jobApplicationId } = req.params;
    const { status } = req.body;
  

    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      res.status(400).send('Invalid status value');
    }

    try {
      const jobApplication = await JobApplication.findByIdAndUpdate(
        jobApplicationId,
        { status },
        { new: true }
      ).populate('applicant' , 'name email contactNo organization -_id');
  
      if (!jobApplication) {
        return res.status(404).send('Job application not found');
      }
  
      res.status(200).send(jobApplication);

    } catch (err) {
      res.status(400).send(err);
    }
  });
  


  module.exports = Employerroute