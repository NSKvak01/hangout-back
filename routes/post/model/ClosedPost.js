const mongoose = require("mongoose")

let postSchema = new mongoose.Schema({
    _id:{
        type:String
    }
    
})

module.exports = mongoose.model("closedPost", postSchema)