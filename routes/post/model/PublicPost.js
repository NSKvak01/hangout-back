const mongoose = require("mongoose")

let publicPostSchema = new mongoose.Schema({
    text:{
        type:String
    },
    user:{
        type:String
    },
    timestamp:{
        type: Date,
        default: ()=>Date.now()
    }
})

module.exports = mongoose.model("publicPost", publicPostSchema)