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
var apiUtils = require( "../../../api-utils" ),
  security = require( "../../security" ),
  Errors = require( "../../../errors" ),
  DBUtils = require( "../../../db-utils" ),
  resUtils = require( "../../../res-utils" ),

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
        { "location":     "/task/3/comment/10",
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
      "task-comments":       {
        "title": "Task Comments", "key": "comments", "type": "string", "required": true, "maxLength": 4000, "minLength": 1
      }
    },
    "store":       {
      "headers": [
        { name: "location", key: "location" }
      ],
      "body":    [
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
/*
      // get body fields
      var newTaskTitle = req.body.title, newTaskDescription = req.body.description;

      // check types and lengths
      if ( typeof newTaskTitle !== "string" || typeof newTaskDescription !== "string" ) {
        return next( Errors.HTTP_Bad_Request( "Missing field or Type Mismatch" ) );
      }
      if ( newTaskTitle.length < createTaskAction.template["task-title"].minLength ||
           newTaskTitle.length > createTaskAction.template["task-title"].maxLength ||
           newTaskDescription.length < createTaskAction.template["task-description"].minLength ||
           newTaskDescription.length > createTaskAction.template["task-description"].maxLength
        ) {
        return next( Errors.HTTP_Bad_Request( "Field length out of bounds" ) );
      }

      // create the task
      var dbUtil = new DBUtils( req.app.get( "client-pool" ) );
      dbUtil.query( "CALL tasker.task_mgmt.create_task(:1,:2,null,:3) INTO :4",
                    [ newTaskTitle, newTaskDescription, req.user.userId, dbUtil.outInteger()] )
        .then( function ( results ) {

                 if ( results.returnParam !== null ) {

                   // returnParam the new task id

                   // make a simple object
                   o = {
                     "taskId": results.returnParam,
                     _links:   {}, _embedded: {}
                   };

                   // add our self hypermedia
                   apiUtils.generateHypermediaForAction( createTaskAction, o._links, security, "self" );

                   // and add a link to get the task
                   apiUtils.generateHypermediaForAction(
                     apiUtils.mergeAndClone( getTaskAction, { href: getTaskAction["base-href"] + "/" + o.taskId, templated: false } ),
                     o._links, security );

                   // also send the location
                   res.location( getTaskAction["base-href"] + "/" + o.taskId );

                   // send a 201 -- Created
                   resUtils.json( res, 201, o );

                 } else {
                   return next( Errors.HTTP_Forbidden() );
                 }
               } )
        .catch( function ( err ) {
                  return next( new Error( err ) );
                } )
        .done(); */
    }
  };

module.exports = action;
