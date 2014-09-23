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
/*eslint no-underscore-dangle:0*/
//
// dependencies
//
var winston = require( "winston" );

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
Session.prototype.findSession = function( clientAuthToken, cb ) {
  var self = this;
  if ( typeof clientAuthToken === "undefined" ) {
    return cb( null, false );
  }

  // an auth token is of the form 1234.ABCDEF10284128401ABC13...
  var clientAuthTokenParts = clientAuthToken.split( "." );
  if ( !clientAuthTokenParts ) {
    return cb( null, false );
  } // no auth token, no session.

  // get the parts
  var sessionId = clientAuthTokenParts[ 0 ],
    authToken = clientAuthTokenParts[ 1 ];

  // ask the database via dbutils if the token is recognized
  self._dbUtils.execute( "CALL tasker.security.verify_token (:1, :2, :3, :4 ) INTO :5", [ sessionId,
      authToken, // authorization token
      self._dbUtils.outVarchar2( {
        size: 32
      } ), // user name     (returnParam)
      self._dbUtils.outVarchar2( {
        size: 4000
      } ), // next token  (returnParam1)
      self._dbUtils.outVarchar2( {
        size: 1
      } ) // success Y/N (returnParam2)
    ],
    function( err, results ) {
      if ( err ) {
        return cb( err, false );
      }
      if ( results.returnParam2 === "Y" ) {
        cb( null, {
          userId: results.returnParam,
          sessionId: sessionId,
          nextToken: results.returnParam1
        } );
      } else {
        cb( null, false );
      }
    } );
};

Session.prototype.createSession = function( userName, candidatePassword, cb ) {
  var self = this;
  if ( typeof userName === "undefined" || typeof candidatePassword === "undefined" ) {
    return cb( null, false );
  }
  self._dbUtils.execute( "CALL tasker.security.authenticate_user( :1, :2, :3, :4, :5 ) INTO :6", [
      userName, candidatePassword,
      self._dbUtils.outVarchar2( {
        size: 4000
      } ), // session id (returnParam)
      self._dbUtils.outVarchar2( {
        size: 4000
      } ), // next token (returnParam1)
      self._dbUtils.outVarchar2( {
        size: 4000
      } ), // session salt (returnParam2)
      self._dbUtils.outVarchar2( {
        size: 1
      } ) // success Y/N (returnParam3
    ],
    function( err, results ) {
      if ( err ) {
        return cb( err, false );
      }
      if ( results.returnParam3 === "Y" ) {
        cb( null, {
          userId: userName,
          sessionId: results.returnParam,
          nextToken: results.returnParam1,
          sessionSalt: results.returnParam2
        } );
      } else {
        cb( null, false );
      }
    } );
};

Session.prototype.endSession = function( sessionId, cb ) {
  var self = this;
  if ( typeof sessionId === "undefined" ) {
    return cb( null, false );
  }
  self._dbUtils.execute( "CALL tasker.security.end_session ( :1 )", [ sessionId ],
    function( err, results ) {
      if ( err ) {
        return cb( err, false );
      }
      cb( null, true );
    } );
};

module.exports = Session;