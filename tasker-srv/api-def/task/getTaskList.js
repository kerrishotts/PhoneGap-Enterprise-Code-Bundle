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
var apiUtils = require( "../../api-utils" ),
  security = require( "../security" ),
  Errors = require( "../../errors" ),
  Task = require( "../../models/task" ),
  getTaskAction = require( "./getTask" ),
  DBUtils = require( "../../db-utils" ),

  getTaskListAction = {
    "title":            "Tasks",
    "action":           "get-tasks",
    "verb":             "get",
    "secured-by":       "tasker-auth",
    "hmac":             "tasker-256",
    "description":      "Returns the tasks that the authenticated user is authorized to see.",
    "href":             "/tasks",
    "base-href":        "/tasks",
    "accepts":          [ "application/hal+json", "application/json", "text/json" ],
    "sends":            [ "application/hal+json", "application/json", "text/json" ],
    "query-parameters": {
      "owned-by":           { "title": "Owner", "key": "ownedBy", "type": "integer", "required": false },
      "assigned-to":        { "title": "Assigned to", "key": "assignedTo", "type": "integer", "required": false },
      "with-status":        { "title": "Status", "key": "withStatus", "type": "string", "required": false,
        "enum":                        [
          { title: "In Progress", value: "I" },
          { title: "On Hold", value: "H" },
          { title: "Complete", value: "C" },
          { title: "Deleted", value: "X" }
        ]
      },
      "min-completion-pct": {
        "title": "Minimum Completion Percentage", "key": "minCompletion",
        "type":  "number", "min": 0, "max": 100, "required": false
      },
      "max-completion-pct": {
        "title": "Maximum Completion Percentage", "key": "maxCompletion",
        "type":  "number", "min": 0, "max": 100, "required": false
      }
    },
    "handler":          function ( req, res, next ) {

      if ( !req.user ) {
        return next( Errors.HTTP_Forbidden() );
      }
      if ( !security["hmac-defs"]["tasker-256"].handler( req ) ) {
        return next( Errors.HTTP_Unauthorized() );
      }

      var o = {
        tasks:     [],
        _links:    {},
        _embedded: {}
      };

      var assignedTo = (typeof req.query.assignedTo !== "undefined") ? req.query.assignedTo : null,
        ownedBy = (typeof req.query.ownedBy !== "undefined") ? req.query.ownedBy : null,
        withStatus = (typeof req.query.withStatus !== "undefined") ? req.query.withStatus : null,
        minCompletion = (typeof req.query.minCompletion !== "undefined") ? req.query.minCompletion : 0,
        maxCompletion = (typeof req.query.maxCompletion !== "undefined") ? req.query.maxCompletion : 100;

      var dbUtil = new DBUtils( req.app.get( "client-pool" ) );
      dbUtil.query( "SELECT * FROM table(tasker.task_mgmt.get_tasks(:1,:2,:3,:4,:5,:6))", [ assignedTo, ownedBy,
                                                                                            withStatus, minCompletion, maxCompletion, req.user.userId ],
                    function ( err, results ) {
                      if ( err ) {
                        return next( new Error( err ) );
                      }
                      /*if ( results.length === 0 ) {
                        return next( Errors.HTTP_NotFound() );
                      }*/

                      results.forEach( function ( row ) {
                        var task = new Task( row );
                        o.tasks.push( task.id );
                        o._embedded[task.id] = apiUtils.mergeAndClone( task, { "_links": {} } );
                        apiUtils.generateHypermediaForAction( getTaskAction, o._embedded[task.id]["_links"], security, "self" );
                        o._embedded[task.id]["_links"].self = apiUtils.mergeAndClone( o._embedded[task.id]["_links"].self,
                                                                                 { "href": "/task/" + task.id,
                                                                                   "templated": false } );
                      } );

                      apiUtils.generateHypermediaForAction( getTaskListAction, o._links, security, "self" );
                      [ getTaskAction, require( "../auth/logout" ) ].forEach( function ( apiAction ) {
                        apiUtils.generateHypermediaForAction( apiAction, o._links, security );
                      } );
                      res.json( 200, o );
                    } );

    }
  };

module.exports = getTaskListAction;
