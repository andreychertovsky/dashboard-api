const express       = require('express');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const path          = require('path');
const mongoose      = require('mongoose');
const pino          = require('pino')();

const config        = require('./config/config');
//
// ─── ROUTER ─────────────────────────────────────────────────────────────────────
//

const api           = require('./routes/api');

const app = express();

app.set('trust proxy', 1) // behind proxy

//
// ─── MIDDLEWARE SECTION ─────────────────────────────────────────────────────────
//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


//
// ─── EXTERNAL CONNECTION ALLOW ──────────────────────────────────────────────────
//

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, authorization");
    next();
});

//
// ─── ROUTER DEFENITION ──────────────────────────────────────────────────────────────
// 

app.use('/api', api);

//
// ─── CATCH ERROR ───────────────────────────────────────────────────────────────
//

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//
// ─── EROR HANDLER ───────────────────────────────────────────────────────────────
//

app.use( (err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;

    res.status(status).json({
        error: {
            msg: error.message
        }
    });
})

//
// ─── RUNING SERVER ──────────────────────────────────────────────────────────────
//
mongoose.Promise = global.Promise;
mongoose.connect(`${config.mongo.ip}/${config.mongo.dbname}`, {
    useMongoClient: true
})
    .then(()=>{
        pino.info(`connected to mongo`);
    })
    .then(()=>{
        app.listen(config.port, () => {
            pino.info(`api-server start`);
        });       
    })
    .catch((err)=>{
        pino.error(`error at connecting to mongo ${err}`);
    });

module.exports = app;
