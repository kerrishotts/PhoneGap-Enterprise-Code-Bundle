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
var apiUtils = require( "../../api-utils" ),
  security = require( "../security" ),
  resUtils = require( "../../res-utils" ),
  discoverAction = {
    "title":       "API Discovery",
    "action":      "discover_api",
    "description": "Returns all the valid API actions",
    "returns":     {
      200: "OK"
    },
    "verb":        "get",
    "href":        "/",
    "base-href":   "/",
    "accepts":     [ "application/hal+json", "application/json", "text/json" ],
    "sends":       [ "application/hal+json", "application/json", "text/json" ],
    "handler":     function ( req, res, next ) {

      // generate some basic info for the client
      var o = {
        "version": "Tasker API v0.1",
        "toPOST":  [ "In order to POST, you'll need to get a token via get-token. You'll also",
                     "need to support cookies in order to support CSRF tokens." ],
        "toAUTH":  [ "In order to authenticate, first get a token from get-token, then",
                     "call login with the user id and candidate password. If invalid 401 Unauthorized",
                     "is returned, otherwise a session is returned. Use nextToken and send",
                     "that token on the next request. If nextToken is null, preserve the prior",
                     "token."],
        "info":    [ "This API is a sample API for the PhoneGap Enterprise book published",
                     "by Packt Publishing and written by Kerri Shotts. For more information",
                     "please visit the website for the book at ",
                     "http://www.photokandy.com/books/phonegap-enterprise"],
        _links:    {},
        _embedded: {}
      };

      // merge our security info in
      o = apiUtils.mergeAndClone( o, security );

      // and send along the entire API
      o._links = apiUtils.mergeAndClone( { "self": JSON.parse( JSON.stringify( discoverAction ) ) },
                                         req.app.get( "x-api-root" ) );

      resUtils.json( res, 200, o );
    }
  },

// define the route and action for discovery
  routes = [
    {
      "route":   "/",
      "actions": [
        discoverAction
      ]
    }
  ];

module.exports = routes;
