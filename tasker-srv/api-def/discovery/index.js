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
      _meta: JSON.parse(JSON.stringify(discoverAction)),
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