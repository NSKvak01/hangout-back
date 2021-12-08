const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        trim:true,
        required:true
    },
    lastName:{
        type:String,
        trim:true,
        required:true
    },
    username:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    post:[],
    interests:[],
    age:{
        type:String
    },
    location:{
        type:String
    },
    bio:{
        type:String
    },
    hometown:{
        type:String
    }
})

module.exports = mongoose.model("user", userSchema)