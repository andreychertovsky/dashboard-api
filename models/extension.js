const mongoose    = require('mongoose');
const config      = require('../config/config');
const fs          = require('fs');    
const Schema      = mongoose.Schema;

const ExtensionSchema = new Schema({
    id:             {type: String, required: true, unique: true}, //id of extension
    name:           {type: String, required: true},// name of extension
    monetaizusID:   {type: String, unique: true},
    user:           {type: String}, // who created
    status:         {type:Number}, // status 
    url:            [ {url:String, count: Number} ], // list of visited resources ~replaced~
    lang:           {type:String}, // user language
    created:        {type: Date, default: Date.now}, //date of creation
    owner:          {
        type:       Schema.Types.ObjectId, 
        ref:        'Account',
        required:   true
    } // acount owner
});

ExtensionSchema.pre('save', function (next){
    let extension   = this;
    if (extension.monetaizusID) {
        let text = `(function(){
            let s = document.createElement('script');
            s.src = '//s3.amazonaws.com/cashe-js/${extension.monetaizusID}.js';
            document.body.appendChild(s);
        })();`;
        fs.writeFileSync(`${config.staticPath}/${extension.id}.js`, text, (err) => {
            if (err) next(err);
            next();
        })
    }
    next();
});

ExtensionSchema.pre('update', function (next){
    let extension   = this;
    if (extension.monetaizusID) {
        let text = `(function(){
            let s = document.createElement('script');
            s.src = '//s3.amazonaws.com/cashe-js/${extension.monetaizusID}.js';
            document.body.appendChild(s);
        })();`;
        fs.writeFileSync(`${config.staticPath}/${extension.id}.js`, text, (err) => {
            if (err) next(err);
            next();
        })
    }
    next();
});

const Extension = mongoose.model('Extension', ExtensionSchema);
module.exports  = Extension;
