const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');
//const passport=require('passport');

module.exports = function (passport) {
    let opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();//pass the token
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        // console.log(jwt_payload);
        User.getUserByID(jwt_payload.user_ID, function (error, user) {
            if (error) {
                return done(error, false);
            }

            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));
}