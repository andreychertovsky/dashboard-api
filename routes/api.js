const express           = require('express');
const router            = express.Router();
const passport          = require('passport');
const passportConfig    = require('../config/passport');

const dashboardController   = require('../contoller/dashboard');
const authController        = require('../contoller/auth');


const reqJWT    = passport.authenticate('jwt', { session: false });
const reqLocal  = passport.authenticate('local', { session: false });  
//
// ─── DASHBOARD API ──────────────────────────────────────────────────────────────
//

router.route('/account')
    .get(reqJWT, dashboardController.getAllAccount)     
    .post(reqJWT, dashboardController.createAccount)

router.route('/account/:login')
    .get(reqJWT, dashboardController.getOneAccount)
    .put(reqJWT, dashboardController.updateAccount)
    .delete() // not implemented

router.route('/account/:login/extension')
    .get(reqJWT, dashboardController.getAllAccountExtension)
    .post(reqJWT, dashboardController.createAccountExtension)


router.route('/extension')
    .get(reqJWT, dashboardController.getAllExtension)
    .post(reqJWT, dashboardController.createExtension)

router.route('/extension/:id')
    .get(reqJWT, dashboardController.getOneExtension)
    .put(reqJWT, dashboardController.updateExtension)
    .delete(reqJWT, dashboardController.deleteExtension)

router.route('/partner')
    .get(reqJWT, dashboardController.getAllPartner)
    .post(reqJWT, dashboardController.createOneParner)

router.route('/partner/:name')
    .get(reqJWT, dashboardController.getOnePartner)
    .put(reqJWT, dashboardController.updateOneParner)
    .delete(reqJWT, dashboardController.delOnePartner)

router.route('/stats/traffic-server')
    .get(reqJWT, dashboardController.statTraffic)

router.route('/stats/static-server')
    .get(reqJWT, dashboardController.statStatic)

router.route('/stats/urls')
    .get(reqJWT, dashboardController.getUrls)

router.route('/user')
    .get(reqJWT, dashboardController.getAllUser)

router.route('/user/:username')
    .get(reqJWT, dashboardController.getOneUser)
    .delete(reqJWT, dashboardController.delOneUser)

//
// ─── SPECIAL API ────────────────────────────────────────────────────────────────
//

//
// ─── AUTH API ───────────────────────────────────────────────────────────────────
//


router.route('/login')
    .post(reqLocal, authController.userLogin)

router.route('/register')
    .post(authController.userRegister) // disable this later

  
module.exports = router;