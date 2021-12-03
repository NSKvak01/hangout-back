const PublicPost = require("../model/PublicPost")
const axios =require("axios")
const User = require("../../user/model/User")
const Post = require ('../model/Post')
const ClosedPost = require('../model/ClosedPost')



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
            .populate({
                path:"post",
                model:Post,
                select:"-__v"
            })
            .select ("-email -password -firstName -lastName -__v -_id -username -publicPersonalPost")
        console.log(payload)
            res.json(payload)
    } catch (error) {
        res.status(500).json({error:error, message:error.message})
    }
}
const getClosedPosts = async(req,res)=>{
    try {
        let payload = await User.findOne({username:req.user.username})
            .populate({
                path:"closedPost",
                model:ClosedPost,
                select:"-__v"
            })
            .select ("-email -password -firstName -lastName -__v -_id -username -post")
        console.log(payload)
            res.json(payload)
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
    const repeated = false
    try {
        let payload = await User.findOne({username:req.user.username})
            .populate({
                path:"post",
                model:Post,
                select:"-__v"
            })
            .select ("-email -password -firstName -lastName -__v -_id -username")
        
        const {text, user, timestamp, _id} = req.body
        payload.post.map((item)=>{
            if(item.text===text && item.user === user){
                repeated=true
            }
        })
        if(!repeated){
            const newPost = new Post({
                text,
                user,
                timestamp,
                _id
            })
            const savedPost = await newPost.save()
            const foundUser = await User.findOne({username:req.user.username})
            foundUser.post.push(savedPost._id)
            await foundUser.save()
            res.json(savedPost)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error, message:error.message})

    }
}
const closePost = async(req,res)=>{
    try {
        const {_id} = req.body
            const closedPost = new ClosedPost({
                _id
            })
            const savedPost = await closedPost.save()
            const foundUser = await User.findOne({username:req.user.username})
            foundUser.closedPost.push(savedPost._id)
            await foundUser.save()
            res.json(savedPost)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error, message:error.message})

    }
}

const deletePost = async (req,res)=>{
    try {
        let deletedPost = await Post.findByIdAndDelete(req.params.id)
        let foundUser = await User.findOne({username:req.user.username})
        filteredPost = foundUser.post.filter((item)=>{
            if(item._id.toString()!== req.params.id){
                return item
            }
        })
        foundUser.post = filteredPost
        await foundUser.save()
        res.json(deletedPost)
    } catch (error) {
        res.status(500).json({error:error, message:error.message})
        
    }
}

module.exports = {
    getAllPosts,
    savePost,
    addPost,
    getSavedPosts,
    deletePost,
    closePost,
    getClosedPosts
    
}