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
  DBUtils = require( "../../db-utils" ),
  resUtils = require( "../../res-utils" ),
  objUtils = require( "../../obj-utils" ),
  Task = require( "../../models/task" ),
  getTaskAction = require( "./getTask" ),

  action = {
    "title":       "Edit Task",
    "action":      "patch-task",
    "description": ["Patches an exiting task. A patch can be in the form of any one or a combination of: ",
                    "Assignee, Status, or Percent Complete"],
    "returns":     {
      200: "Patched",
      400: "Bad request: make sure at least one of the three patchable fields are present: assignee, status, or percent complete.",
      401: "Unauthorized; user not logged in.",
      403: "Authenticated, but user has no access to this resource.",
      500: "Internal Server Error"
    },
    "example":     {
      "headers": [
        { "x-next-token": "next-auth-token" }
      ],
      "body":    {
        "message": "Task patched."
      }
    },
    "verb":        "patch",
    "href":        "/task/{taskId}",
    "templated":   true,
    "base-href":   "/task",
    "accepts":     [ "application/hal+json", "application/json", "text/json" ],
    "sends":       [ "application/hal+json", "application/json", "text/json" ],
    "secured-by":  "tasker-auth",
    "hmac":        "tasker-256",
    "csrf":        "tasker-csrf",
    "template":    {
      "assigned-to":  {
        "title": "Assigned To", "key": "assignedTo", "type": "number", "required": false
      },
      "status":       {
        "title":    "Status", "key": "status", "type": "string", "minLength": 1, "maxLength": 1,
        "required": false, "enum": Task.ENUM
      },
      "pct-complete": {
        "title": "Percent Complete", "key": "pctComplete", "type": "number", "required": false, min: 0, max: 100
      }
    },
    "handler":     function ( req, res, next ) {
      // if user isn't authenticated, bail
      if ( !req.user ) { return next( Errors.HTTP_Unauthorized() ); }

      // check hmac
      if ( !security["hmac-defs"]["tasker-256"].handler( req ) ) { return next( Errors.HTTP_Bad_Request( "Invalid or missing HMAC" ) ); }

      // store next token
      res.set( "x-next-token", req.user.nextToken );

      // get body fields
      var newAssignee = req.body.assignedTo,
        newStatus = req.body.status,
        newPctComplete = req.body.pctComplete;

      // does our input validate?
      var validationResults = objUtils.validate( req.body, action.template );
      if ( !validationResults.validates ) {
        return next ( Errors.HTTP_Bad_Request( validationResults.message ) );
      }

      // we do need at least one value...
      if ( typeof newAssignee === "undefined" && typeof newStatus === "undefined" &&
           typeof newPctComplete === "undefined" ) {
        return next( Errors.HTTP_Bad_Request( "Missing a field; either assignedTo, status, or pctComplete is required." ) )
      }

      // create the task
      var dbUtil = new DBUtils( req.app.get( "client-pool" ) );
      dbUtil.query( "CALL tasker.task_mgmt.create_task(:1,:2,null,:3) INTO :4",
                    [ newTaskTitle, newTaskDescription, req.user.userId, dbUtil.outInteger()] )
        .then( function ( results ) {

                 if ( results.returnParam !== null ) {

                   // returnParam the new task id

                   // make a simple object
                   var o = {
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
        .done();
    }
  };

module.exports = action;
