const User = require("../model/User")
const bcrypt = require("bcryptjs")
const dbErrorHelper = require("../lib/dbErrorHelper")
const jwt = require("jsonwebtoken")
const passport = require("../../utils/passport/userPassport")
const PublicPost = require("../../post/model/PublicPost")

async function signup(req,res, next){
    const {firstName, lastName, username, email, password} = req.body
    try{
        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(password, salt)
        let newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password:hashedPassword
        })
        let createdUser = await newUser.save()
        let foundUser = await User.findOne({email:email})
        let jwtToken = jwt.sign({username:foundUser.username, email:foundUser.email},
            process.env.PRIVATE_JWT_KEY)
            res.cookie('jwt-cookie', jwtToken, {
                expires: new Date (Date.now()+3600000),
                httpOnly:false,
                secure:false
            })

        res.json({user:{
            username:foundUser.username,
            email:foundUser.email
        }, message:"Success - user created"})

    } catch(e){
        res.status(500).json({
            message:dbErrorHelper(e)
        })
    }
}

async function login(req,res,next){
    const {emailUsername, passwordLogin} = req.body
    try {
        let foundUser = await User.findOne({email:emailUsername})
        if(!foundUser){
            let foundUser1 = await User.findOne({username:emailUsername})
            if(!foundUser1){
                throw Error("Check your email/username and password")
            } else {
                let comparedPassword = await bcrypt.compare(passwordLogin, foundUser1.password)
                if(!comparedPassword){
                    throw Error("Check your email/username and password")
                } else {
                    let jwtToken = jwt.sign({username:foundUser1.username, email:foundUser1.email},
                        process.env.PRIVATE_JWT_KEY)
                        res.cookie('jwt-cookie', jwtToken, {
                            expires: new Date (Date.now()+3600000),
                            httpOnly:false,
                            secure:false
                        })

                    res.json({user:{
                        username:foundUser1.username,
                        email:foundUser1.email
                    }, message:"Success login"})
                }
            }
        } else{
            let comparedPassword = await bcrypt.compare(passwordLogin, foundUser.password)
            if(!comparedPassword){
                res.status(400).json({message:"error", payload:"Check your email and password"})
            } else {
                let jwtToken = jwt.sign({username:foundUser.username, email:foundUser.email},
                    process.env.PRIVATE_JWT_KEY)
                res.cookie('jwt-cookie', jwtToken, {
                    expires: new Date (Date.now()+3600000),
                    httpOnly:false,
                    secure:false
                })

                res.json({user:{
                    username:foundUser.username, email:foundUser.email
                }, message:"Success login"})
        }
    }
    } catch (e) {
        res.status(500).json({
            message:dbErrorHelper(e)
        })
    }

}

async function updateUser(req, res, next) {
    try {
        if(req.body.password){
            let salt = await bcrypt.genSalt(10)
            let hashedPassword = await bcrypt.hash(req.body.password, salt)
            req.body.password = hashedPassword
        }

        let updatedUser = await User.findOneAndUpdate(
            { username:req.user.username },
            req.body,
            { new: true }
        );
        if (req.body.password || req.body.username!==req.user.username ) {
            res.status(202).json({ message: "success", payload: updatedUser });
        } else {
            res.json({ message: "success", payload: updatedUser });
        }
    } catch (e) {
        next(e);
    }
}

async function addInterests(req, res, next) {
    try {
        let updatedUser = await User.findOneAndUpdate(
            { username:req.user.username },
            {interests:req.body.interests},
            { new: true }
        )
            res.json({ message: "success", payload: updatedUser });
    } catch (e) {
        next(e);
    }
}
async function addBio(req, res, next) {
    try {
        let updatedUser = await User.findOneAndUpdate(
            { username:req.user.username },
            {bio:req.body.bio},
            { new: true }
        )
            res.json({ message: "success", payload: updatedUser });
    } catch (e) {
        next(e);
    }
}
async function addUserInfo(req, res, next) {
    try {
        let updatedUser = await User.findOneAndUpdate(
            { username:req.user.username },
            req.body,
            { new: true }
        )
            res.json({ message: "success", payload: updatedUser });
    } catch (e) {
        next(e);
    }
}

async function fetchUserInfo(req, res, next) {
    try {
        let userInfo = await User.findOne({username:req.user.username}).select(
            "-password -__v "
        );
        res.json({ message: "success", payload: userInfo });
        } catch (e) {
        next(e);
        }
    }
async function fetchAnotherUserInfo(req, res, next) {
    try {
        let userInfo = await User.findOne({username:req.params.user}).select(
            "-password -__v "
        );
        res.json({ message: "success", payload: userInfo });
        } catch (e) {
        next(e);
        }
    }

async function deleteUser(req,res,next){
    try {
        let deletedUser= await User.findOneAndDelete({username:req.user.username})
        res.json({message:"User deleted"})
    } catch (error) {
        next(error);
    }
}

const joinUser = async(req,res)=>{
    const {joinedUsers, userID} = req.body
    try {
        const foundPost = await PublicPost.findById(req.params._id)

            const update = [...foundPost.joinedUsers,{
                userID:userID,
                joinedUser:joinedUsers,
                }]
        let updatePublicPost = await PublicPost.findByIdAndUpdate(
            req.params._id,
            {joinedUsers: update},
            {new:true}
        )
        res.json(updatePublicPost)
    } catch (error) {
        res.status(500).json({error:error, message:error.message})

    }
}

const deleteJoinedUser = async (req,res)=>{
    try {
        const {username} = req.body
        let post = await PublicPost.findById(req.params._id)
        console.log(post)
        let filteredUsers = await post.joinedUsers.filter((item)=>{
            if(item.joinedUser!== username){
                return item
            }
        })
       let updateJoinedUsers = await PublicPost.findByIdAndUpdate(
        req.params._id,
        {joinedUsers:filteredUsers},
        {new:true}
       )
        res.json(updateJoinedUsers)
    } catch (error) {
        res.status(500).json({error:error, message:error.message})
        
    }
}

module.exports={
signup,
login,
updateUser,
fetchUserInfo,
deleteUser,
joinUser,
deleteJoinedUser,
addInterests,
addBio,
addUserInfo,
fetchAnotherUserInfo
}