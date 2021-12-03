require("dotenv").config()
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose")
let cors = require("cors")
let passport = require("passport")

let userPassportStrategy = require("./routes/utils/passport/userPassport")


mongoose  
  .connect("mongodb://localhost:27017/capstone1", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=>{
    console.log("MongoDB connected")
  })
  .catch(function(e){
    console.log(e)
  })

var usersRouter = require('./routes/user/userRouter');
var postRouter = require("./routes/post/postRouter")

var app = express();

app.use(passport.initialize())
passport.use("jwt-user", userPassportStrategy)

const originUrl = 
process.env.NODE_ENV==="development"
  ? "http://localhost:3001"
  : "DEPLOY URL"

app.use(cors({origin:originUrl, credentials:true}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/post', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
