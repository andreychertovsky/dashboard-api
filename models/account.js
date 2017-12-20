const mongoose    = require('mongoose');      
const Schema      = mongoose.Schema;

const AccountSchema =  new Schema({
    login:          {type: String, required: true, unique: true}, // account login
    password:       {type: String, required: true}, // account password
    domen:          {type: String},
    gWeb:           {type: String},
    extList:        [{
        type:       Schema.Types.ObjectId, 
        ref:        'Extension'
    }] // list of extension bound to account
});

const Account   = mongoose.model('Account', AccountSchema);
module.exports  = Account;