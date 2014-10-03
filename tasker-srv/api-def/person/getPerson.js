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

//
// dependencies
//
var apiUtils = require( "../../api-utils" ),
  security = require( "../security" ),
  Errors = require( "../../errors" ),
  resUtils = require( "../../res-utils" ),
  action = {
    "title":       "Person",
    "action":      "get-person",
    "description": [
      "Retrieve a person by ID."
    ],
    "returns":     {
      200: "OK",
      401: "Unauthorized; user not logged in.",
      403: "Authenticated, but user has no access to this resource.",
      404: "Person not found.",
      500: "Internal Server Error"
    },
    "example":     {
      "headers": {
        "x-next-token": "next-auth-token"
      },
      "body":    {
        "id":             21,
        "userId":         "BSMITH",
        "fullName":       "Bob Smith",
        "prefName":       "Robert",
        "administeredBy": 2,
        "changeDate":     (new Date()),
        "changeUser":     "BSMITH"
      }
    },
    "verb":        "get",
    "href":        "/person/{personId}",
    "templated":   true,
    "base-href":   "/person",
    "accepts":     [ "application/hal+json", "application/json", "text/json" ],
    "sends":       [ "application/hal+json", "application/json", "text/json" ],
    "secured-by":  "tasker-auth",
    "hmac":        "tasker-256",
    "store":       {
      "body": [
        { name: "person-id", key: "id" },
        { name: "user-id", key: "userId" },
        { name: "full-name", key: "fullName" },
        { name: "pref-name", key: "prefName" },
        { name: "administrator", key: "administeredBy" },
        { name: "change-date", key: "changeDate" },
        { name: "change-user", key: "changeUser" }
      ]
    },
    "handler":     function ( req, res, next ) {

      // if we don't have a user, fail
      if ( !req.user ) { return next( Errors.HTTP_Unauthorized() ); }

      // make sure hmac lines up
      if ( !security["hmac-defs"]["tasker-256"].handler( req ) ) { return next( Errors.HTTP_Forbidden( "Missing or invalid HMAC" ) ); }

      // store next token
      res.set( "x-next-token", req.user.nextToken );
      // Create response based on the task (this is found via getTaskId) and pass the next token
      var o = apiUtils.mergeAndClone( { _links: {}, _embedded: {} }, req.person );

      // generate hypermedia, also updating the href and templated properties
      o._links.self = apiUtils.mergeAndClone(
        apiUtils.generateHypermediaForAction( action, o._links, security, "self" ), {
          "href": "/person/" + req.person.ID,
          "templated": false
        } );

      resUtils.json( res, 200, o );
    }
  };

module.exports = action;
