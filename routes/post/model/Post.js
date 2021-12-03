const mongoose = require("mongoose")

let postSchema = new mongoose.Schema({
    text:{
        type:String
    },
    user:{
        type:String
    },
    timestamp:{
        type:Date
    },
    _id:{
        type:String
    }
    
})

module.exports = mongoose.model("post", postSchema)