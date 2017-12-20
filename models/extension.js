const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;

const ExtensionSchema = new Schema({
    id:             {type: String, required: true, unique: true}, //id of extension
    name:           {type: String, required: true},// name of extension
    monetaizusID:   {type: String, unique: true, required: true},
    monetaizusType: {type: String, required: true},
    user:           {type: String}, // who created
    status:         {type:Number}, // status 
    created:        {type: Date, default: Date.now}, //date of creation
    owner:          {
        type:       Schema.Types.ObjectId, 
        ref:        'Account',
        required:   true
    } // acount owner
    
});

const Extension = mongoose.model('Extension', ExtensionSchema);
module.exports  = Extension;
