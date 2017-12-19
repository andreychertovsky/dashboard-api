const User      = require('../models/user');
const JWT       = require('jsonwebtoken');
const config    = require('../config/config');

signToken = user => {
    return JWT.sign({
        iss: 'auth',
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, config.jwtToken);
}

module.exports = {

    userLogin: async (req, res, next) => {
        try {
            const token = signToken(req.user);
            res.status(200).json({ token });
        } catch (e) {
            next(e);
        }
    },

    userRegister: async (req, res, next) => {
        try {
            const {username, password} = req.body;
            const userFound = await User.findOne({username: username});
            if (userFound) {
                return res.status(409).json({
                    error: 'user alredy exist'
                });
            }
            const newUser = new User({username, password});
            await newUser.save();
            const token = signToken(newUser);
            res.status(200).json({
                token
            });
        } catch (e) {
            next(e);
        }
    }

}