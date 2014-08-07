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
var apiUtils = require("../../api-utils");


var discoverAction =
{
  "title": "API Discovery",
  "action": "discover_api",
  "description": "Returns all the valid API actions",
  "verb": "get",
  "href": "/",
  "accepts": [ "application/hal+json", "application/json", "text/json" ],
  "sends": [ "application/hal+json", "application/json", "text/json" ],
  "handler": function ( req, res, next ) {

    var o = {
      "version": "Tasker API v0.1",
      "toPOST1": "In order to POST, you'll need to get a token via get-token. You'll also",
      "toPOST2": "need to support cookies in order to support CSRF tokens.",
      "toAUTH1": "In order to authenticate, first get a token from get-token, then",
      "toAUTH2": "call login with the user id and candidate password. If invalid 403",
      "toAUTH3": "is returned, otherwise a session is returned. Use nextToken and compute",
      "toAUTH4": "based on the session salt in order to send requests that are secured.",
      "info1": "This API is a sample API for the PhoneGap Enterprise book published",
      "info2": "by Packt Publishing and written by Kerri Shotts. For more information",
      "info3": "please visit the website for the book at http://www.photokandy.com/books/phonegap-enterprise",
      _links: {},
      _embedded: {}
    };

    o._links = apiUtils.mergeAndClone ( { "self": JSON.parse ( JSON.stringify ( discoverAction ) ) },
                                        req.app.get ( "x-api-root") );

    res.json ( 200, o );
  }
};

// define the route and action for discovery
var routes =
[
	{
		"route": "/",
		"actions":
		[
      discoverAction
		]
	}
];

module.exports = routes;