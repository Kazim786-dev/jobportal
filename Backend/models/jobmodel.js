
const mongoose = require('mongoose');

const jobPostingSchema = mongoose.Schema({
  jobTitle: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  salary:{
    type: String,
    required: true
  },
  jobTags: {
    type: [String],
    required: true
  },
  keywords: {
    type: [String]
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

module.exports = JobPosting;
