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
var Session = require("../../models/session");
var Errors = require("../../errors");
var DBUtils = require("../../db-utils");

var loginAction =
{
  "title": "Authenticate User",
  "action": "login",
  "description": "Authenticates a user and returns session information if user was authenticated. " +
                 "Session ID, Salt, User ID, and Partial Token is returned within the `content` " +
                 "object. Should authentication fail, 403 Forbidden is returned.",
	"verb": "post",
  "href": "/auth",
  "accepts": [ "application/hal+json", "application/json", "text/json" ],
  "sends": [ "application/hal+json", "application/json", "text/json" ],
  "requires": [ "get-token" ] ,
  "template": {
    "user-id":            {
      "title":     "User Name",
      "key":       "userId",
      "type":      "string",
      "required":  true,
      "maxLength": 32
    },
    "candidate-password": {
      "title":     "Password",
      "key":       "candidatePassword",
      "type":      "string",
      "required":  true,
      "maxLength": 255
    }
  },
	"handler": function ( req, res, next ) {
    var session = new Session ( new DBUtils( req.app.get ( "client-pool" ) ) );
    // username and password are contained in res
    var username = req.body["userId"];
    var password = req.body["candidatePassword"];
    session.createSession ( username, password, function (err, results) {
      console.log ( results );
      if (err) {
        return next(err);
      }
      if (!results) {
        return next(Errors.HTTP_Forbidden());
      }

      var o = {
        sessionId:   results.sessionId,
        sessionSalt: results.sessionSalt,
        userId:      results.userId,
        nextToken:   results.nextToken,
        _meta:       JSON.parse(JSON.stringify(loginAction)),
        _links:      {},
        _embedded:   {}
      };
      o._links["self"] = JSON.parse ( JSON.stringify ( loginAction ) );
      [ require("../task/getTask") ].forEach ( function ( apiAction ) {
        o._links[ apiAction.action ] = JSON.parse ( JSON.stringify ( apiAction ) );
      } );

      res.json ( 200, o );
    } );
	}
};

module.exports = loginAction;
