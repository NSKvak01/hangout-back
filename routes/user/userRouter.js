var express = require('express');
var router = express.Router();
let passport = require('passport')
const {signup, login, updateUser, deleteUser, fetchUserInfo, joinUser, deleteJoinedUser, addInterests, addBio, addUserInfo, fetchAnotherUserInfo } = require("./controller/userController")
const checkIsEmpty = require("./helpers/checkIsEmpty")
const checkIsUndefined = require("./helpers/checkIsUndefined")
const checkIsStrongPassword = require("./helpers/checkIsStrongPassword")
const {checkIsAlpha, checkIsEmail, checkIsAlphanumeric} = require("./helpers/authMiddleware")

/* GET users listing. */

router.post(
  "/sign-up",
  checkIsUndefined,
  checkIsEmpty, 
  checkIsAlpha,
  checkIsAlphanumeric,
  checkIsEmail,
  checkIsStrongPassword,
  signup
)

router.post(
  "/login",
  checkIsUndefined,
  checkIsEmpty, 
  login
)

router.put("/update-user-profile", passport.authenticate('jwt-user', {session:false}),updateUser);
router.put("/add-interests", passport.authenticate('jwt-user', {session:false}),addInterests);
router.put("/add-bio", passport.authenticate('jwt-user', {session:false}),addBio);
router.put("/add-user-info", passport.authenticate('jwt-user', {session:false}),addUserInfo);
router.get("/get-user-info", passport.authenticate('jwt-user', {session:false}),fetchUserInfo)
router.get("/get-another-user-info/:user", passport.authenticate('jwt-user', {session:false}),fetchAnotherUserInfo)

router.delete("/delete-user", 
passport.authenticate('jwt-user', {session:false}),
deleteUser
)



router.put("/join-user/:_id", passport.authenticate('jwt-user', {session:false}), joinUser)
router.put("/delete-joined-user/:_id", passport.authenticate('jwt-user', {session:false}), deleteJoinedUser)

router.get('/logout', function(req,res){
  res.clearCookie('jwt-cookie')
  res.send("logged out")
})

module.exports = router;
