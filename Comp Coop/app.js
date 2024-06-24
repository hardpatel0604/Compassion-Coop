var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql= require('mysql');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session = require('express-session');
var bcrypt = require('bcrypt');

var app = express();


app.use(function(req,res,next){
    req.pool= dbConnectionPool;
    next();
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public', {index: 'homepage.html'}))

var dbConnectionPool = mysql.createPool({
    host: 'localhost',
    database: 'comp_coopdb',
    connectTimeout: 30000
});


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
    // set secure to true for cybersec reasons
}));



function getUserDetails(req, res, next) {
    if (req.session.user) {
      req.user = req.session.user;
    }
    next();
}


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;


