
const User = require('../models/usermodel')
const JobPosting = require('../models/jobmodel');
const userRouter = require('express').Router()
const {verifyuserloggedin} = require('../middleware/auth')
const jwt = require('jsonwebtoken')

userRouter.post('/signup',(req,res)=>{

    let {email, password, name, contactNo, organization, role} = req.body;
    
    let user=new User({
        email,password,name,contactNo,organization,role
    });

    user.save().then((user)=>{
        if(!user){
            res.status(400).json({"message":"user not created"})
        }
        else{
            res.status(200).json({"message":"user successfully created", user:user})
        }
    }).catch(err=>{
        res.status(400).json({err:err, "message":"user not created"})
    })

})



userRouter.post('/signin',(req,res)=>{
    
    let {email,password} = req.body;
    User.findOne({ email:email}).then(founduser=>{
        if(!founduser){
            res.status(404).send({"Message":"User not exists"})
        }else{
            if(password==founduser.password){
                let token = jwt.sign({
                    id:founduser._id,
                    role: founduser.role,
                },process.env.secret_key , {
                    expiresIn:'2h'
                })
                res.status(200).send({"user":founduser, "token":token})
            }else{
                res.status(404).send({"Message":"password does not match"})
            }        
        }
    }).catch((err)=>{
        res.status(500).send({"error: ":err})
    })

})



userRouter.patch('/:id', verifyuserloggedin, async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    try {
      const user = await User.findByIdAndUpdate(userId, updates, { new: true });
      res.status(200).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  });


module.exports = userRouter;