const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../../user/model/User")
const keys = process.env.PRIVATE_JWT_KEY

const jwtOpts =  {}
jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOpts.secretOrKey = keys

const userJWTLoginStrategy = new JwtStrategy(jwtOpts, async(payload, done)=>{
    const username = payload.username
    try {
        if(username){
            const user = await User.findOne({username:username}).select("-password")
            if(!user){
                return done(null, false)
            } else{
                return done (null, user)
            }
        } else{
            return done(null, false)
        }
    } catch (e) {
        return done(e, false)
    }
})

module.exports = userJWTLoginStrategy