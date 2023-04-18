

const multer = require('multer');
const JobPosting = require('../models/jobmodel')
const JobApplication = require('../models/applicationmodel')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/resumes/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() +'-'+ file.originalname);
  }
});

const filter = (req , file , cb)=>{
  if(file.mimetype == 'application/pdf'){
      cb(null , true)
  }else{
      cb(new Error("UnSupported file") , false)
  }
}


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
  fileFilter: filter,

}).single('resumeUrl');

