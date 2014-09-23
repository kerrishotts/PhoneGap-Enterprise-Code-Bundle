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

  getTaskListAction = {
    "title": "Tasks",
    "action": "get-tasks",
    "verb": "get",
    "securedBy": "tasker-auth",
    "description": "Returns the tasks that the authenticated user is authorized to see.",
    "href": "/tasks",
    "accepts": [ "application/hal+json", "application/json", "text/json" ],
    "sends": [ "application/hal+json", "application/json", "text/json" ],
    "queryParameters": {
      "owned-by": {
        "title": "Owner",
        "key": "ownedBy",
        "type": "integer",
        "required": false
      },
      "assigned-to": {
        "title": "Assigned to",
        "key": "assignedTo",
        "type": "integer",
        "required": false
      },
      "with-status": {
        "title": "Status",
        "key": "withStatus",
        "type": "string",
        "required": false,
        "enum": [ {
          title: "In Progress",
          value: "I"
        }, {
          title: "On Hold",
          value: "H"
        }, {
          title: "Complete",
          value: "C"
        }, {
          title: "Deleted",
          value: "X"
        } ]
      },
      "min-completion-pct": {
        "title": "Minimum Completion Percentage",
        "key": "minCompletion",
        "type": "number",
        "min": 0,
        "max": 100,
        "required": false
      },
      "max-completion-pct": {
        "title": "Maximum Completion Percentage",
        "key": "maxCompletion",
        "type": "number",
        "min": 0,
        "max": 100,
        "required": false
      }
    },
    "handler": function( req, res, next ) {

      var o = {
        _links: {},
        _embedded: {}
      };
      o._links.self = JSON.parse( JSON.stringify( getTaskListAction ) );
      [ require( "../task/getTask" ) ].forEach( function( apiAction ) {
        o._links[ apiAction.action ] = JSON.parse( JSON.stringify( apiAction ) );
      } );

      res.json( 200, o );
    }
  };

module.exports = getTaskListAction;
