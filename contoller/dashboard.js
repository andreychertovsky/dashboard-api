const Extension = require('../models/extension');
const Account   = require('../models/account');
const User      = require('../models/user');

const Promise   = require('bluebird');
const config    = require('../config/config');
const client    = Promise.promisifyAll(require('redis').createClient({host:config.redis.host , port:config.redis.port}));

module.exports = {
//
// ─── ACCOUNT METHOD ─────────────────────────────────────────────────────────────
//
    getAllAccount: async (req, res, next) => {
        try {
            const account = await Account.find({});
            res.status(200).json({
                account
            });
        } catch(err){
            next(err);
        }
    },

    createAccount: async (req, res, next) => {
        try {
            const newAccount = new Account(req.body);
            const account = await newAccount.save();
            res.status(201).json({
                success: true
            });
        } catch (err){
            next(err);
        }
    },

    getOneAccount: async (req, res, next) => {
        try {
            const {login} = req.params;
            const account = await Account.findOne({login:login})
            res.status(200).json({
                account
            });
        } catch(err) {
            next(err);
        }
    },

    updateAccount: async (req, res, next) => { // recive arbitrary new field
        try {
            const {login} = req.params;
            const newAccount = req.body;
            const account = await Account.findOneAndUpdate({login:login}, newAccount);
            res.status(200).json({
                success: true
            });
        } catch(err){
            next(err);
        }
    },

    getAllAccountExtension: async (req, res, next) => {
        try {
            const {login} = req.params;
            const account = await Account.findOne({login:login}).populate('extList'); //show extList insted of extListId
            res.status(200).json({
                account
            });
        } catch (err) {
            next(err);
        }
    }, 

    createAccountExtension: async (req, res, next) => {// ???????
        try {
            const {login} = req.params;
            const newExtension = new Extension(req.body); // create object to populate new extension fields
            const account = await Account.findOne({login:login}); // get account by id
            newExtension.owner = account; // assign account as a owner extension
            await newExtension.save(); // save extension
            account.extList.push(newExtension); // push saved extension to account array
            await account.save(); // save account
            res.status(200).json({
                success: true
            });
        } catch(err) {
            next(err);
        }
    },


//
// ─── EXTENSION METHOD ─────────────────────────────────────────────────────────────
//

    
    getAllExtension: async (req, res, next) => {
        try {
            const extension = await Extension.find({});
            res.status(200).json({
                extension
            });
        } catch(err){
            next(err);
        }
    },
    
    createExtension: async (req, res, next) => {
        try {
            const account = await Account.findOne( {login:req.body.owner} ); // lookup account owner
            const newExtension = req.body; //create new Ext
            delete newExtension.login; // removed because if already used above
            const extension = new Extension(newExtension); //create object
            extension.owner = account; //link to owner
            await extension.save(); //saved to db
            account.extList.push(extension); //push extension to account extension list
            await account.save();// save
            res.status(200).json({
                success: true
            });
        } catch(err){
            next(err);
        }
    }, 

    getOneExtension: async (req, res, next) => {
        try {
            const {id} = req.params;
            const extension = await Extension.findOne({id: id});
            res.status(200).json({
                extension
            });
        } catch (err) {
            next(err)
        }
    },

    updateExtension: async (req, res, next) => { // recive arbitrary new field
        try {
            const {id} = req.params;
            const newExtension = req.body;
            const extension = await Extension.findOneAndUpdate({id:id}, newExtension);
            res.status(200).json({
                success: true
            });
        } catch(err){
            next(err);
        }
    },

    deleteExtension: async (req, res, next) => {
        try {
            const {id} = req.params;
            const extension = await Extension.findOne({id:id});
            if (!extension) {
                 return res.status(404).json({
                    error: `Extension doesn't exist`
                });
            }
            const owner = extension.owner;
            const account = await Account.findById(owner);
            await extension.remove();
            account.extList.pull(extension);
            await account.save();
            res.status(200).json({
                success: true
            });
        } catch(err) {
            next(err);
        }
    },

    //
    // ─── PARTNER METHOD ─────────────────────────────────────────────────────────────
    //

    getAllPartner:  (req, res, next) => {
        client.hgetall('partners', function(err, result){
            if (!err) {
                return res.status(200).json({
                    result
                });
            }
            next(err);
        });
    },

    createOneParner: async (req, res, next) => {
        try {
            const {name, postback} = req.body;
            const partner = await client.hset('partners', name, postback);
            res.status(200).json({
                success: true
            }) ;
        } catch (err) {
            next(err)
        }
    },

    getOnePartner:  (req, res, next) => {
        const {name} = req.params;
        client.hget('partners', name ,function(err, result){
            if (!err) {
                return  res.status(200).json({
                    result
                });
            }
            next(err)
        });
    },

    updateOneParner: async (req, res, next) => {
        try {
            const {name} = req.params;
            const {postback} = req.body;
            const partner = await client.hset('partners', name, postback);
            res.status(200).json({
                success: true
            }) ;
        } catch (err) {
            next(err);
        }
    },

    delOnePartner:  (req, res, next) => {
        const {name} = req.params;
        client.hdel('partners', name, (err, result) => {
            if (!err) {
                return  res.status(200).json({
                    result
                });
            }
            next(err);
        });
    },

    //
    // ─── STATS METHOD ───────────────────────────────────────────────────────────────
    //

    statPartner: (req, res, next) => {
        client.hlen('partners', function(err, count) {
            if (!err) {
                return res.status(200).json({
                    count
                }) ;
            }
            next(err);
        });
    },

    statTraffic:  (req, res, next) => {
        client.get('traffic', function(err, count) {
            if (!err) {
                return res.status(200).json({
                    count
                }) ;
            }
            next(err);
        });
    },

    statStatic: (req, res, next) => {
        client.get('static', function(err, count) {
            if (!err) {
                return res.status(200).json({
                    count
                }) ;
            }
            next(err);
        });
    },

    //
    // ─── USER METHOD ────────────────────────────────────────────────────────────────
    //

    getAllUser: async (req, res, next) => {
        try {
            const user = await User.find({});
            res.status(200).json({
                user
            });
        } catch (err) {
            next(err);
        }
    },

    getOneUser: async (req, res, next) => {
        try {
            const {username} = req.params;
            const user = await User.findOne({username});
            if (!user) {
                return res.status(404).json({
                    error: `User doesn't exist`
                });
            }
            res.status(200).json({
                user
            });
        } catch (err) {
            next(err);
        }
    },

    delOneUser: async (req, res, next) => {
        try {
            const {username} = req.params;
            const user = await User.findOne({username});
            if (!user) {
                return res.status(404).json({
                    error: 'User not exist'
                });
            }
            await user.remove();
            res.status(200).json({
                success: true
            });
        } catch (err) {
            next(err);
        }
    },

    //
    // ─── SPECIAL METHOD ─────────────────────────────────────────────────────────────
    //

    monetaizusIdReturn: async (req, res, next) => {
        try {
            const {id} = req.params;
            const extension = await Extension.findOne({id:id});
            if (!extension) {
                return res.status(404).json({
                    error: `Extension doesn't exist`
                });
            }
            const monetaizus = extension.monetaizusID;
            if (!monetaizus) {
                return res.status(404).json({
                    error: `Monetaizus id doesn't set`
                });
            }
            res.status(200).json({
                monetaizus
            });
        } catch (err) {
            next(err);
        }
    },

    returnPostback: (req, res, next) => {
        client.hgetall('postback', function(err, result){
            if (!err) {
                return res.status(200).json({
                    result
                });
            }
            next(err);
        });
    }

}