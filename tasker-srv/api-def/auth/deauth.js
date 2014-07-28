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
var Errors = require ('../../errors');
var DBUtils = require ('../../db-utils');
var Session = require ('../../models/session');

// de-authorize action
var action =
			{
				"action": "deauthorize",
				"verb": "delete",
        "securedBy": "tasker-auth",
				"description": 
				{
					"title": "Deauthorization",
					"href": "/auth",
					"type": "application/json" 
				},
				"handler": function ( req, res, next ) {

          var session = new Session ( new DBUtils( req.app.get ( "client-pool" ) ) );

          if (!req.user) { return next(Errors.HTTP_Forbidden()); };

          session.endSession ( req.user.sessionId, function (err, results) {
            if (err) {
              return next(err);
            }
            res.json ( 200, { "message": "User logged out.", "code": "OK000",
              "links": req.app.get("x-api-discovery") } );
          } );
				}
			};

module.exports = action;