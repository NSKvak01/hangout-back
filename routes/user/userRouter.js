var express = require('express');
var router = express.Router();
let passport = require('passport')
const {signup, login, updateUser, deleteUser, fetchUserInfo } = require("./controller/userController")
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
router.get("/get-user-info", passport.authenticate('jwt-user', {session:false}),fetchUserInfo)

router.delete("/delete-user", 
passport.authenticate('jwt-user', {session:false}),
deleteUser
)

router.get('/logout', function(req,res){
  res.clearCookie('jwt-cookie')
  res.send("logged out")
})

module.exports = router;
