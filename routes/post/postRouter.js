const express = require("express")
const router = express.Router()
let passport = require('passport')
const {getAllPosts, savePost, addPost, getSavedPosts, deletePost, closePost, getClosedPosts} = require("./controller/postController")


router.get("/get-all-posts", passport.authenticate('jwt-user', {session:false}), getAllPosts)
router.get("/get-saved-posts", passport.authenticate('jwt-user', {session:false}), getSavedPosts)
router.get("/get-closed-posts", passport.authenticate('jwt-user', {session:false}), getClosedPosts)
router.post("/save-post", passport.authenticate('jwt-user', {session:false}), savePost)
router.post("/close-post", passport.authenticate('jwt-user', {session:false}), closePost)
router.post("/create-post", passport.authenticate('jwt-user', {session:false}), addPost)
router.delete("/delete-post/:id", passport.authenticate('jwt-user', {session:false}), deletePost)

module.exports = router