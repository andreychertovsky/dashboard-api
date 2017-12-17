const passport          = require('passport');
const JwtStrategy       = require('passport-jwt').Strategy;
const LocalStrategy     = require('passport-local').Strategy;
const { ExtractJwt }    = require('passport-jwt'); 
const User              = require('../models/user');

const config            = require('./config');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtToken
}, async(payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user)   
    } catch (err) {
        done(err, false);
    }
}));

passport.use(new LocalStrategy({
    usernameField: 'username'
}, async(username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false);
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return done(null, false);
        }
        done(null, user);   
    } catch (err) {
        done(err, false);
    }
}));