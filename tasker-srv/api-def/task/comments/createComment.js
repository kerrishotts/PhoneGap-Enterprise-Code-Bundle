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
var apiUtils = require( "../../../api-utils" ),
  security = require( "../../security" ),
  Errors = require( "../../../errors" ),
  DBUtils = require( "../../../db-utils" ),
  resUtils = require( "../../../res-utils" ),
  objUtils = require( "../../../obj-utils" ),

  action = {
    "title":       "Add Comment",
    "action":      "create-comment",
    "description": [
      "Adds a comment to an existing task."
    ],
    "returns":     {
      201: "Created.",
      400: "Bad request: make sure `title` and `description` are supplied.",
      401: "Unauthorized; user not logged in.",
      403: "Authenticated, but user has no access to this resource.",
      500: "Internal Server Error"
    },
    "example":     {
      "headers": [
        {
          "x-next-token": "next-auth-token"
        }
      ],
      "body":    {
        "commentId": 3932
      }
    },
    "verb":        "post",
    "href":        "/task/{taskId}/comment",
    "templated":   true,
    "base-href":   "/task/{taskId}",
    "accepts":     [ "application/hal+json", "application/json", "text/json" ],
    "sends":       [ "application/hal+json", "application/json", "text/json" ],
    "secured-by":  "tasker-auth",
    "hmac":        "tasker-256",
    "csrf":        "tasker-csrf",
    "template":    {
      "task-comments": {
        "title": "Task Comments", "key": "comments", "type": "string", "required": true, "maxLength": 4000, "minLength": 1
      }
    },
    "store":       {
      "body": [
        { name: "comment-id", key: "commentId" }
      ]
    },
    "handler":     function ( req, res, next ) {
      // if user isn't authenticated, bail
      if ( !req.user ) { return next( Errors.HTTP_Unauthorized() ); }

      // check hmac
      if ( !security["hmac-defs"]["tasker-256"].handler( req ) ) { return next( Errors.HTTP_Bad_Request( "Invalid or missing HMAC" ) ); }

      // store next token
      res.set( "x-next-token", req.user.nextToken );

      // does our input validate?
      var validationResults = objUtils.validate( req.body, action.template );
      if ( !validationResults.validates ) {
        return next( Errors.HTTP_Bad_Request( validationResults.message ) );
      }
      // get body fields
      var newComments = req.body.comments;

      // create the comment
      var dbUtil = new DBUtils( req.app.get( "client-pool" ) );
      dbUtil.query( "CALL tasker.task_mgmt.create_task_comment(:1,:2,:3) INTO :4",
                    [ req.task.id, newComments, req.user.userId, dbUtil.outInteger()] )
        .then( function ( results ) {

                 if ( results.returnParam !== null ) {

                   // returnParam the new comment id

                   // make a simple object
                   var o = {
                     "commentId": results.returnParam,
                     _links:      {}, _embedded: {}
                   };

                   // add our self hypermedia
                   apiUtils.generateHypermediaForAction( action, o._links, security, "self" );

                   // send a 201 -- Created
                   resUtils.json( res, 201, o );

                 } else {
                   return next( Errors.HTTP_Forbidden() );
                 }
               } )
        .catch( function ( err ) {
                  return next( new Error( err ) );
                } )
        .done();
    }
  };

module.exports = action;
