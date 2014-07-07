var fs = require('fs');
var express = require('express');
var helmet = require('helmet');
var morgan = require('morgan');
var winston = require('winston');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var csrf = require('csurf');

var routes = require('./routes/index');
var users = require('./routes/users');
var heartbeat = require('./routes/heartbeat'); 

var app = express();
var config = require('./config/config');

var dev = config.env === 'development';

// log all access; if development to stdout, else to a logs/server.log
if (dev) {
    app.use(logger('dev'));
} else {
    app.use(logger({ stream: fs.createWriteStream (config.get('morgan:target'))}));
}

// set up Winston's transport for logging, if available (otherwise we are on the console only)
var winstonOptions = config.get('winston');
if (winstonOptions) {
    winston.add(winston.transports.File, winstonOptions);
}

// general security enhancements
app.disable ( "x-powered-by" ); // no one needs to know this anyway

// security enhancements via helmet
app.use(helmet.csp({
    defaultSrc: ["'self'", "pge-as.acmecorp.com"],
    safari5: false  // safari5 has buggy behavior
}));
app.use(helmet.xframe()); // no framing our content!
app.use(helmet.xssFilter()); // old IE won't get this, since some implementations are buggy
app.use(helmet.hsts({maxAge: 15552000, includeSubDomains: true})); // force SSL for six months
app.use(helmet.ienoopen()); // keep IE from executing downloads
app.use(helmet.nosniff()); // keep IE from sniffing mime types
app.use(helmet.nocache()); // no caching

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session( {
    secret: "a(3hvs23fhOHvi3hwouhS_vh24fuhefoh89Q#",
    key: "sessionId",
    cookie: { httpOnly: true, secure: true},
    resave: true,
    saveUninitialized: true 
}));

// csrf security
app.use(csrf());
app.use(function (req, res, next) {  
    res.locals.csrftoken = req.session._csrf;  
    next();  
  });
  
// static content
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', routes);
app.use('/users', users);
app.use('/heartbeat', heartbeat);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (dev) {
    app.use(function(err, req, res, next) {
        winston.error ("error %j", err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    winston.error ("error %j", err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
