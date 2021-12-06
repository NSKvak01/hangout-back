const PublicPost = require("../model/PublicPost")
const axios =require("axios")
const User = require("../../user/model/User")


const getAllPosts = async(req,res)=>{
    try {
        let payload = await PublicPost.find()
        console.log(payload)
        res.json(payload)

    } catch (error) {
        res.status(500).json({error:error, message:error.message})
    }
}

const getSavedPosts = async(req,res)=>{
    try {
        let payload = await User.findOne({username:req.user.username})
        let payload1 = payload.post
            res.json(payload1)
    } catch (error) {
        res.status(500).json({error:error, message:error.message})
    }
}

const getClosedPosts = async(req,res)=>{
    try {
        let payload = await User.findOne({username:req.user.username})
        let payload1 = payload.closedPost
        res.json(payload1)
    } catch (error) {
        res.status(500).json({error:error, message:error.message})
    }
}

const addPost = async (req,res)=>{
    try {
        console.log(req.user)
        const {text} = req.body
        const foundUser = await User.findOne({username:req.user.username})
        const newPublicPost = new PublicPost({
            text,
            user:foundUser.username
        })
        await newPublicPost.save()
        res.json({payload:newPublicPost})
    } catch (e) {
        console.log(e)
        res.status(500).json({error:e, message:e.message})
    }
}

const savePost = async(req,res)=>{
    const {text, user, timestamp, _id} = req.body
    try {
        const foundUser = await User.findOne({username:req.user.username})
            const update = [...foundUser.post,{
                text,
                user,
                timestamp,
                _id
                }]
        let updateSavedPosts = await User.findOneAndUpdate(
            {username:req.user.username },
            {post:update},
            {new:true}
        )
        res.json(updateSavedPosts)
    } catch (error) {
        res.status(500).json({error:error, message:error.message})

    }
}

const closePost = async(req,res)=>{
    try {
            const {_id} = req.body
        const foundUser = await User.findOne({username:req.user.username})
            const update = [...foundUser.closedPost,{_id:_id}]
        let updateClosedPosts = await User.findOneAndUpdate(
            {username:req.user.username },
            {closedPost:update},
            {new:true}
        )
        res.json(updateClosedPosts)
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error, message:error.message})

    }
}

const deleteSavedPost = async (req,res)=>{
    const {_id} = req.body
    try {
        let foundUser = await User.findOne({username:req.user.username})
        const filteredPost = foundUser.post.filter((item)=>{
            if(item._id!== _id){
            console.log(item._id)
                return item
            }
        })
        let updateSavedPosts = await User.findOneAndUpdate(
            {username:req.user.username },
            {post:filteredPost},
            {new:true}
        )

        console.log(filteredPost)
        res.json(updateSavedPosts)
    } catch (error) {
        res.status(500).json({error:error, message:error.message})
        
    }
}
const deleteSavedPostFromDecline = async (req,res)=>{
    const {_id} = req.body
    try {

        //When declining a user who joined your activity, I want to delete the joined activity for the joined user, so it doesn't show on his/her page. 

        let foundUser = await User.findOne({username:req.params.username})

        const filteredPost = foundUser.post.filter((item)=>{
           console.log(item._id)
            if(item._id !== _id){
                return item
            }
        })
        console.log("filteredPost",filteredPost)
        let updateSavedPosts = await User.findOneAndUpdate(
            {username:req.params.username},
            {post:filteredPost},
            {new:true}
        )

        console.log(updateSavedPosts)
        res.json(updateSavedPosts)
    } catch (error) {
        res.status(500).json({error:error, message:error.message})
        
    }
}

const deletePublicPost = async(req,res) =>{
    try {
        let deletedPost= await PublicPost.findOneAndDelete({_id:req.params._id})
        res.json({message:"Post deleted"})
    } catch (e) {
        res.status(500).json({error:error, message:error.message})
    }
}

module.exports = {
    getAllPosts,
    savePost,
    addPost,
    getSavedPosts,
    deleteSavedPost,
    closePost,
    getClosedPosts,
    deleteSavedPostFromDecline,
    deletePublicPost
    
}