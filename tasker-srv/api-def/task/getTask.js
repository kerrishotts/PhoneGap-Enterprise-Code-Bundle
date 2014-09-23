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
  Errors = require( "../../errors" ),

  // get a specific task
  getTaskAction = {
    "title": "Task",
    "action": "get-task",
    "description": "Return a task with a specific ID. Returns 403 if the user is not authorized.",
    "verb": "get",
    "href": "/task/{taskId}",
    "templated": true,
    "accepts": [ "application/hal+json", "application/json", "text/json" ],
    "sends": [ "application/hal+json", "application/json", "text/json" ],
    "securedBy": "tasker-auth",
    "attachments": {
      "headers": [ {
        "name": "auth-token",
        "key": "x-auth-token",
        "value": "{session-id}.{next-token}",
        "templated": true
      } ]
    },
    "store": {
      "body": [ {
        "name": "next-token",
        "key": "nextToken"
      } ]
    },
    "handler": function( req, res, next ) {

      if ( !req.user ) {
        return next( Errors.HTTP_Forbidden() );
      }

      var o = apiUtils.mergeAndClone( {
        _links: {},
        _embedded: {}
      }, req.task, {
        nextToken: req.user.nextToken
      } );

      o._links.self = apiUtils.mergeAndClone( JSON.parse( JSON.stringify( getTaskAction ) ), {
        "href": "/task/" + req.task.ID
      } );
      /*  [ require("../task/getTask") ].forEach ( function ( apiAction ) {
      o._links[ apiAction.action ] = JSON.parse ( JSON.stringify ( apiAction ) );
    } ); */

      res.json( 200, o );
    }
  };

module.exports = getTaskAction;
