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
"use strict";
/*eslint no-underscore-dangle:0*/
//
// dependencies
//
var winston = require( "winston" ),
  Q = require( "q" );

function Session( dbUtils ) {
  "use strict";
  var self = this;
  self._dbUtils = dbUtils;
  return self;
}

/**
 *
 * returns the session that accepts the client authorization token. Doing so
 * returns a session object of the following form:
 *
 * { userId: authorized user,  sessonId: session ID,  nextToken: token }
 *
 * NOTE: This function does have side effects -- in asking for a session with
 * a token, the token is invalidated, and another request will require another
 * token. SAVE THE SESSION INFORMATION (req makes a good place)
 *
 * @param {string} clientAuthToken    Token of the form sessionAId.token
 * @param {function} cb               Callback ( err, results ); if no results, then false
 *
 * @return {object} Session Object
 */
Session.prototype.findSession = function ( clientAuthToken, cb ) {
  var self = this,
    deferred = Q.defer();

  // if no token, no sense in continuing
  if ( typeof clientAuthToken === "undefined" ) {
    if ( cb ) { return cb( null, false ); } else { deferred.reject(); }
  }

  // an auth token is of the form 1234.ABCDEF10284128401ABC13...
  var clientAuthTokenParts = clientAuthToken.split( "." );
  if ( !clientAuthTokenParts ) {
    if ( cb ) { return cb( null, false ); } else { deferred.reject(); }
  } // no auth token, no session.

  // get the parts
  var sessionId = clientAuthTokenParts[ 0 ],
    authToken = clientAuthTokenParts[ 1 ];

  // ask the database via dbutils if the token is recognized
  self._dbUtils.execute( "CALL tasker.security.verify_token (:1, :2, :3, :4, :5 ) INTO :6",
                         [ sessionId,
                           authToken, // authorization token
                           self._dbUtils.outVarchar2( { size: 32 } ), // user name     (returnParam)
                           self._dbUtils.outVarchar2( { size: 4000 } ), // next token  (returnParam1)
                           self._dbUtils.outVarchar2( { size: 4000 } ), // hmac token  (returnParam2)
                           self._dbUtils.outVarchar2( { size: 1 } ) // success Y/N (returnParam3)
                         ] )
    .then( function ( results ) {
             // returnParam3 has a Y or N; Y is good auth
             if ( results.returnParam3 === "Y" ) {
               // notify callback of successful auth
               var user = {
                 userId:    results.returnParam, sessionId: sessionId,
                 nextToken: results.returnParam1, hmacSecret: results.returnParam2
               };
               if ( cb ) { cb( null, user ) } else { deferred.resolve( user ); }
             } else {
               // auth failed
               if ( cb ) { cb( null, false ); } else { deferred.reject(); }
             }
           } )
    .catch( function ( err ) {
              if ( cb ) { return cb( err, false ); } else { deferred.reject(); }
            } )
    .done();

  if ( !cb ) { return deferred.promise; }
};

Session.prototype.createSession = function ( userName, candidatePassword, cb ) {
  var self = this,
    deferred = Q.defer();

  // if the username or password is missing, notify the callback appropriately
  if ( typeof userName === "undefined" || typeof candidatePassword === "undefined" ) {
    if ( cb ) { return cb( null, false ); } else { deferred.reject(); }
  }

  // attempt to authenticate
  self._dbUtils.execute( "CALL tasker.security.authenticate_user( :1, :2, :3, :4, :5 ) INTO :6", [
    userName, candidatePassword,
    self._dbUtils.outVarchar2( { size: 4000 } ), // session id (returnParam)
    self._dbUtils.outVarchar2( { size: 4000 } ), // next token (returnParam1)
    self._dbUtils.outVarchar2( { size: 4000 } ), // hmac token (returnParam2)
    self._dbUtils.outVarchar2( { size: 1 } ) // success Y/N (returnParam3
  ] )
    .then( function ( results ) {
             // ReturnParam3 has Y or N; Y is good auth
             if ( results.returnParam3 === "Y" ) {
               // notify callback of auth info
               var user = {
                 userId:    userName, sessionId: results.returnParam,
                 nextToken: results.returnParam1, hmacSecret: results.returnParam2
               };
               if ( cb ) { cb( null, user ); } else { deferred.resolve( user ); }
             } else {
               // auth failed
               if ( cb ) { cb( null, false ); } else { deferred.reject(); }
             }
           } )
    .catch( function ( err ) {
              if ( cb ) { return cb( err, false ) } else { deferred.reject(); }
            } )
    .done();
  if ( !cb ) { return deferred.promise; }
};

Session.prototype.endSession = function ( sessionId, cb ) {
  var self = this,
    deferred = Q.defer();
  // no sense in ending a session if the session id isn't specified
  if ( typeof sessionId === "undefined" ) {
    if ( cb ) { return cb( null, false ); } else { return deferred.reject(); }
  }
  self._dbUtils.execute( "CALL tasker.security.end_session ( :1 )", [ sessionId ] )
    .then( function ( results ) {
             // notify the callback of success (if there is no error, success is guaranteed)
             if ( cb ) { cb( null, true ); } else { deferred.resolve(); }
           } )
    .catch( function ( err ) {
              if ( cb ) { return cb( err, false ); } else { deferred.reject(); }
            } )
    .done();
  if ( !cb ) { return deferred.promise; }
};

module.exports = Session;
