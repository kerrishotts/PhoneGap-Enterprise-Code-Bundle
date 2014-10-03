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
  Task = require( "../../../models/task" ),
  DBUtils = require( "../../../db-utils" ),
  resUtils = require( "../../../res-utils" ),
  Comment = require( "../../../models/task/comments" ),

  action = {
    "title":       "Task Comments",
    "action":      "get-task-comments",
    "verb":        "get",
    "secured-by":  "tasker-auth",
    "hmac":        "tasker-256",
    "description": [
      "Get comments for a specific task."
    ],
    "returns":     {
      200: "OK",
      401: "Unauthorized; user not logged in.",
      403: "Authenticated, but user has no access to this resource.",
      404: "Task not found.",
      500: "Internal Server Error"
    },
    "example":     {
      "headers": {
        "x-next-token": "next-auth-token"
      },
      "body":    {
        "comments": [ 102, 3942, 1994 ]
      }
    },
    "href":        "/task/{taskId}/comments",
    "templated":   true,
    "base-href":   "/task/{taskId}",
    "accepts":     [ "application/hal+json", "application/json", "text/json" ],
    "sends":       [ "application/hal+json", "application/json", "text/json" ],
    "store":       {
      "body": [
        { "name": "comments", key: "comments" }
      ]
    },
    "handler":     function ( req, res, next ) {

      // If the user isn't authenticated, bail!
      if ( !req.user ) { return next( Errors.HTTP_Unauthorized() ); }

      // if the hmac doesn't check, let the client know.
      if ( !security["hmac-defs"]["tasker-256"].handler( req ) ) { return next( Errors.HTTP_Forbidden( "Invalid or missing HMAC." ) ); }

      // store next token
      res.set( "x-next-token", req.user.nextToken );

      var o = {
        comments: [],
        _links:   {}, _embedded: {}
      };

      var dbUtil = new DBUtils( req.app.get( "client-pool" ) );
      dbUtil.query( "SELECT * FROM table(tasker.task_mgmt.get_comments_for_task(:1,:2))",
                    [ req.task.id, req.user.userId ] )
        .then( function ( results ) {

                 results.forEach( function ( row ) {
                   var comment = new Comment( row );
                   o.comments.push( comment.id );
                   o._embedded[comment.id] = apiUtils.mergeAndClone( comment, { "_links": {} } );
                 } );

                 // add hypermedia
                 apiUtils.generateHypermediaForAction( action, o._links, security, "self" );
                 resUtils.json( res, 200, o );
               } )
        .catch( function ( err ) {
                  return next( new Error( err ) );
                } )
        .done();
    }
  };

module.exports = action;
