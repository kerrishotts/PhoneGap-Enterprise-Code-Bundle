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
"use strict";
var Session = require( "../../models/session" ),
  Errors = require( "../../errors" ),
  DBUtils = require( "../../db-utils" ),
  apiUtils = require( "../../api-utils" ),
  security = require( "../security" ),
  resUtils = require( "../../res-utils" ),
  objUtils = require( "../../obj-utils" ),

  action = {
    "title":       "Authenticate User",
    "action":      "login",
    "description": ["Authenticates a user and returns session information if user was authenticated." ,
                    "Session ID, Hmac Secret, User ID, and Token is returned within the response." ,
                    "Should authentication fail, 401 Unauthorized is returned."],
    "example":     {
      "body": {
        "sessionId": "92013",
        "hmacToken": "AABBCCDDEEFF11223344556677889900",
        "userId":    "BMSITH",
        "nextToken": "0099887766554433221100AABBCCDDEE"
      }
    },
    "returns":     {
      200: "User authenticated; see information in body.",
      400: "Missing either username or password.",
      401: "Incorrect username or password.",
      500: "Internal Server Error; try again later."
    },
    "verb":        "post",
    "href":        "/auth",
    "base-href":   "/auth",
    "accepts":     [ "application/hal+json", "application/json", "text/json" ],
    "sends":       [ "application/hal+json", "application/json", "text/json" ],
    "requires":    [ "get-token" ],
    "csrf":        "tasker-csrf",
    "store":       {
      "body": [
        { name: "session-id", key: "sessionId" },
        { name: "hmac-token", key: "hmacToken" },
        { name: "user-id", key: "userId" },
        { name: "next-token", key: "nextToken" }
      ]
    },
    "template":    {
      "user-id":            {
        "title": "User Name", "key": "userId", "type": "string", "required": true, "maxLength": 32, "minLength": 1
      },
      "candidate-password": {
        "title": "Password", "key": "candidatePassword", "type": "string", "required": true, "maxLength": 255, "minLength": 1
      }
    },
    "handler":     function ( req, res, next ) {
      var session = new Session( new DBUtils( req.app.get( "client-pool" ) ) ),
        username,
        password;

      // does our input validate?
      var validationResults = objUtils.validate( req.body, action.template );
      if ( !validationResults.validates ) {
        return next( Errors.HTTP_Bad_Request( validationResults.message ) );
      }

      // got here -- good; copy the values out
      username = req.body.userId;
      password = req.body.candidatePassword;

      //  create a session with the username and password
      session.createSession( username, password )
        .then( function ( results ) {

                 // no session? bad username or password
                 if ( !results ) { return next( Errors.HTTP_Unauthorized() ); }

                 // return the session information to the client
                 var o = {
                   sessionId: results.sessionId, hmacToken: results.hmacToken,
                   userId:    results.userId, nextToken: results.nextToken,
                   _links:    {}, _embedded: {}
                 };

                 // generate hypermedia
                 apiUtils.generateHypermediaForAction( action, o._links, security, "self" );
                 [ require( "../task/getTaskList" ), require( "../task/getTask" ), require( "../auth/logout" )
                 ].forEach( function ( apiAction ) {
                              apiUtils.generateHypermediaForAction( apiAction, o._links, security );
                            } );

                 resUtils.json( res, 200, o );
               } )
        .catch( function ( err ) {
                  return next( err );
                } )
        .done();
    }
  };

module.exports = action;
