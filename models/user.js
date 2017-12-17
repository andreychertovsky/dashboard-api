const mongoose    = require('mongoose');
const bcrypt      = require('bcrypt');         
const Schema      = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type:       String,
        unique:     true,
        required:   true,
        trim:       true
    },
    password: {
        type:       String,
        required:   true
    },
    role: Boolean
});

UserSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(this.password, salt);
        this.password = hasedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch (err) {
        throw new Error(err);
    }
}

const User = mongoose.model('User', UserSchema);
module.exports = User;