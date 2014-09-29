/******************************************************************************
 *
 * Tasker Server (PhoneGap Enterprise Book)
 * ----------------------------------------
 *
 * @author Kerri Shotts
 * @version 0.1.0
 * @license MIT
 *
 * Copyright (c) 2014 Packt Publishing
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 ******************************************************************************/
/* globals require, module, __dirname, process */
"use strict";
//
// Dependencies
//
var fs = require( "fs" ),
  express = require( "express" ),
  helmet = require( "helmet" ),
  morgan = require( "morgan" ),
  winston = require( "winston" ),
  path = require( "path" ),
  favicon = require( "static-favicon" ),
  logger = require( "morgan" ),
  cookieParser = require( "cookie-parser" ),
  session = require( "express-session" ),
  bodyParser = require( "body-parser" ),
  csrf = require( "csurf" ),
  oracle = require( "oracle" ),
  pool = require( "generic-pool" ),
  cors = require( "cors" ),
  passport = require( "passport" ),
  ReqStrategy = require( "passport-req" ).Strategy,
  DBUtils = require( "./db-utils" ),
  Session = require( "./models/session" ),
  Errors = require( "./errors" ),
  resUtils = require( "./res-utils" ),
//
// routes are defined by our API definition
//
  apiDef = require( "./api-def" ),
  securityDef = require( "./api-def/security" ),
  apiUtils = require( "./api-utils" ),
// create new Express app and link the configuration
  app = express(),
  config = require( "./config/config" ),
// are in a dev mode or production?
// export NODE_ENV=development (or production)
  dev = config.env === "development";
// log all access; if development to stdout, else to a `logs/server.log`
if ( dev ) {
  app.use( logger( "dev" ) );
} else {
  app.use( logger( {
                     stream: fs.createWriteStream( config.get( "morgan:target" ) )
                   } ) );
}
// set up Winston's transport for logging, if available (otherwise we are on the console only)
var winstonOptions = config.get( "winston" );
if ( winstonOptions ) {
  winston.add( winston.transports.File, winstonOptions );
}
// general security enhancements
app.disable( "x-powered-by" ); // Showing what powers our service just makes the attacker's
// job easier.
// security enhancements via helmet
// Only trust content from self and our application server
/*
 app.use( helmet.csp( {
 defaultSrc: [ "'self'", "pge-as.acmecorp.com" ],
 safari5: false // safari5 has buggy behavior
 } ) );*/
app.use( helmet.xframe() ); // no framing our content!
app.use( helmet.xssFilter() ); // old IE won't get this, since some implementations are buggy
app.use( helmet.hsts( {
                        maxAge:            15552000,
                        includeSubDomains: true
                      } ) ); // force SSL for six months
app.use( helmet.ienoopen() ); // keep IE from executing downloads
app.use( helmet.nosniff() ); // keep IE from sniffing mime types
app.use( helmet.nocache() ); // no caching
// view engine setup
app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "jade" );
// middleware setup
app.use( favicon() ); // handle favicons
app.use( bodyParser.json() ); // we need to be able to parse JSON
app.use( bodyParser.urlencoded() ); // and url-encoded content
app.use( cookieParser() ); // we need cookies for CSRF on the browser
// Set up a session (needed for csrf support)
//
// Secret can be anything you want
// The key is probably a bit obvious here (but this is a demo). If you want
// to be a little more cryptic, use something random or non-sensical.
// Make sure the cookie has httpOnly: true and secure: true -- otherwise
// any security provided by CSRF and sessions is lost
// resave should be true to ensure the session information is resaved
// even when no change. saveUninitialized ensures that a session is saved
// when it is new (even if it hasn't been modified).
app.use( session( {
                    secret:            "a(3hvs23fhOHvi3hwouhS_vh24fuhefoh89Q#",
                    key:               "sessionId",
                    cookie:            {
                      httpOnly: true,
                      secure:   true
                    },
                    resave:            true,
                    saveUninitialized: true
                  } ) );
// cors setup
//
// We have a corsDelegate in case we ever need to be more choosy about
// the options we return based on the request and such. For now we just
// indicate that the origin returned should be the requesting origin
// (can't use * if we require credentials) and that the browser should
// send credentials (cookies).
var corsDelegate = function ( req, cb ) {
  var corsOptions = {
    origin:      true,
    credentials: true
  };
  cb( null, corsOptions );
};
// cors will be used for every route -- if this doesn't make sense
// for your server, you can attach it to specific routes instead
//     app.get ( "/", cors( corsDelegate ), handler )
app.use( cors( corsDelegate ) );
// Make sure CORS is there for preflight OPTIONS requests
app.options( "*", cors( corsDelegate ) );
// csrf security
//
// depends on having a session initialized above
app.use( csrf() );
app.use( function ( req, res, next ) {
  res.locals.csrftoken = req.csrfToken();
  next();
} );
// static content -- if you have it
app.use( express.static( path.join( __dirname, "public" ) ) );
app.use( helmet.csp( {
                       defaultSrc: [ "'self'", "pge-as.acmecorp.com" ],
                       safari5:    false // safari5 has buggy behavior
                     } ) );
//
// set up our database pool and connections
//
var clientPool = pool.Pool( {
                              name:              "oracle",
                              create:            function createOracleConnection( cb ) {
                                return new oracle.connect( config.get( "oracle" ),
                                                           function doOracleCallback( err, client ) {
                                                             cb( err, client );
                                                           } );
                              },
                              destroy:           function destroyOracleConnection( client ) {
                                // try...catch in case the client can't be properly closed (as in an
                                // unexpected termination of the connection) Without it, the server dies.
                                try {
                                  client.close();
                                }
                                catch ( err ) {
                                  // if we can't close... oh well
                                }
                              },
                              max:               5,
                              min:               1,
                              idleTimeoutMillis: 30000 // 30 seconds
                            } );
// need to ensure that the pool can drain or shutdowns are slow or may
// never occur
process.on( "exit", function drainAllConnections() {
  clientPool.drain( function destroyPool() {
    clientPool.destroyAllNow();
  } );
} );
// make the client pool available to the entire app
app.set( "client-pool", clientPool );
//
// passport security
//
// we're using the ReqStrategy("req"), which is similar to the hash or other
// local strategies. In this case, we expect a token to be provided
// in the header (x-auth-token). The token is compared against the
// database, and if it matches, the session is serialized and req.user
// contains the session information (including nextToken)
//
// The token is of the form SESSION_ID.NEXT_TOKEN
//
passport.use( new ReqStrategy( function ( req, done ) {
  var clientAuthToken = req.headers[ "x-auth-token" ],
    session = new Session( new DBUtils( clientPool ) );
  session.findSession( clientAuthToken, function ( err, results ) {
    if ( err ) { return done( err ); }
    if ( !results ) { return done( null, false ); }
    done( null, results );
  } );
} ) );
//
// if passport finds the session, serialize it
passport.serializeUser( function serializeUser( user, done ) {
  done( null, user );
} );
// set up passport and our authentication strategy
app.use( passport.initialize() );
// app.use ( passport.session() ); // we don't use persistent passport sessions simply because
// tokens are continually regenerated, and must be verified on
// each request. If you don't use this strategy, leave session
// support on.
/**
 * Checks if we are authenticated (if a resource is secured), and if not
 * it calls passport to authenticate us.
 */
function checkAuth( req, res, next ) {
  if ( req.isAuthenticated() ) {
    return next();
  }
  passport.authenticate( "req" )( req, res, next );
}
// tie our API to / and enable secured resources to use the above method
app.use( "/", apiUtils.createRouterForApi( apiDef, checkAuth ) );
// and set the pretty API as a global variable so our discover method can find it.
app.set( "x-api-root", apiUtils.generateHypermediaForApi( apiDef, securityDef ) );
/// catch 404 and forward to error handler
app.use( function handle404( req, res, next ) {
  var err = new Error( "Not Found" );
  err.status = 404;
  next( err );
} );

// error handler
// for development, we want to be verbose, but for production, we want to be as
// minimal in the response as possible
app.use( function handleError( err, req, res, next ) {
  // Log the error using winston
  winston.error( JSON.stringify( {"message": err.message, "error": err, "stack": err.stack} ) );

  // if the incoming error specifies a status, use that. If not, use 500
  var status = err.status || 500;

  // if we're not in dev mode, kill the stack
  if ( !dev ) { err.stack = ""; }

  // send the error
  resUtils.error (res, status, err );

} );

module.exports = app;
