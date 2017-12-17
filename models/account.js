const mongoose    = require('mongoose');      
const Schema      = mongoose.Schema;

const AccountSchema =  new Schema({
    id:             String, // account id ???
    login:          {type: String, required: true, unique: true}, // account login
    password:       {type: String, required: true}, // account password
    domen:          {type: String},
    extList:        [{
        type:       Schema.Types.ObjectId, 
        ref:        'Extension'
    }] // list of extension bound to account
});

AccountSchema.pre('save', function (next){
    let account = this;
    account.id = '_' + Math.random().toString(36).substr(2, 9);
    next();
});

const Account   = mongoose.model('Account', AccountSchema);
module.exports  = Account;