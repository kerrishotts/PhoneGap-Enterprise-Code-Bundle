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

//
// dependencies
//
var Errors = require( "../../errors" ),
  DBUtils = require( "../../db-utils" ),
  Session = require( "../../models/session" ),
  apiUtils = require( "../../api-utils" ),
  security = require( "../security" ),
  resUtils = require( "../../res-utils" ),

  logoutAction = {
    "title":       "Log Out",
    "action":      "logout",
    "description": ["Logs out a user and disables their associated token. Returns 401 is the user is " ,
                    "not authenticated, or 400 if the hmac doesn't match."],
    "example":     {
      "body": {
        "message": "User logged out"
      }
    },
    "returns":     {
      200: "OK; User logged out. Any token received at this point is invalid.",
      400: "Bad request -- check your HMAC.",
      401: "User not authenticated, can't log out.",
      500: "Internal Server Error."
    },
    "verb":        "delete",
    "href":        "/auth",
    "base-href":   "/auth",
    "accepts":     [ "application/hal+json", "application/json", "text/json" ],
    "sends":       [ "application/hal+json", "application/json", "text/json" ],
    "requires":    [ "get-token" ],
    "template":    null,
    "csrf":        "tasker-csrf",
    "secured-by":  "tasker-auth",
    "hmac":        "tasker-256",
    "handler":     function ( req, res, next ) {

      // create a new session instance
      var session = new Session( new DBUtils( req.app.get( "client-pool" ) ) );

      // if req.user isn't filled in, we don't have a session. Tell the client
      if ( !req.user ) { return next( Errors.HTTP_Unauthorized() ); }

      // if the hmac fails, tell the client that we received a bad request
      if ( !security["hmac-defs"]["tasker-256"].handler( req ) ) { return next( Errors.HTTP_Bad_Request( "Invalid or missing HMAC." ) ); }

      // end the user's session
      session.endSession( req.user.sessionId, function ( err, results ) {
        if ( err ) { return next( err ); }

        // inform the client that the user has been logged out
        var o = {
          message: "User logged out.", _links: {}, _embedded: {}
        };

        // generate hypermedia
        apiUtils.generateHypermediaForAction( logoutAction, o._links, security, "self" );
        o._links = apiUtils.mergeAndClone( o._links, req.app.get( "x-api-root" ) );

        resUtils.json( res, 200, o );
      } );
    }
  };

module.exports = logoutAction;
