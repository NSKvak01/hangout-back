const express = require("express")
const router = express.Router()
let passport = require('passport')
const {getAllPosts, savePost, addPost, getSavedPosts, deleteSavedPost, closePost, getClosedPosts,deleteSavedPostFromDecline,deletePublicPost} = require("./controller/postController")


router.get("/get-all-posts", passport.authenticate('jwt-user', {session:false}), getAllPosts)
router.get("/get-saved-posts", passport.authenticate('jwt-user', {session:false}), getSavedPosts)
router.get("/get-closed-posts", passport.authenticate('jwt-user', {session:false}), getClosedPosts)
router.put("/save-post", passport.authenticate('jwt-user', {session:false}), savePost)
router.put("/close-post", passport.authenticate('jwt-user', {session:false}), closePost)
router.put("/delete-post", passport.authenticate('jwt-user', {session:false}), deleteSavedPost)
router.put("/delete-post-from-declined/:username", passport.authenticate('jwt-user', {session:false}), deleteSavedPostFromDecline)
router.post("/create-post", passport.authenticate('jwt-user', {session:false}), addPost)
router.delete("/delete-public-post/:_id", passport.authenticate('jwt-user', {session:false}), deletePublicPost)

module.exports = router