const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    contactNo:{
        type:Number,
        required:true,
        min:10,
    },
    organization:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"student",
    },
    pics:{
        type:[String]
    }
},

{timestamps:true}

)

module.exports= mongoose.model("User", userSchema);