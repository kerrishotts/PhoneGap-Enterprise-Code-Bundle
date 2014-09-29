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
var express = require( "express" );

// return utility methods for dealing with api definitions
module.exports = {
  /**
   * Creates routes for a given API definition. An API is of the form:
   *
   * [ { route: "<route>",
   *     params: [
   *       { "name": "name of parameter in route",
   *         "handler": function ( req, res, next, value ) { ... }
   *       },
   *     actions: [
   *       { "action": "name of action",
   *         "verb": "get",
   *         "description": {
   *           "title": "title of action",
   *           "href": "URI", // optional
   *           "template": "/some/{variable}{?queryParameters}", // optional
   *           "accept": "types", // like application/json, optional
   *           "type": "types", // like applicaiton/json, optional
   *           "secured-by": ...,
   *           "hmac": "something in hmacs",...
   *         },
   *         "handler": function ( req, res, next ) {
   *           res.json ( 200, "ok" );  // handle request
   *         }
   *       }, ...
   *     ]
   *   }, ...
   * ]
   *
   * @param api {array}
   */
  createRouterForApi:          function ( api, checkAuthFn ) {
    var router = express.Router();
    // process each route in the api; a route consists of the uri (route)
    // and a series of verbs (get, post, etc.)
    api.forEach( function ( apiRoute ) {
      // add params

      if ( typeof apiRoute.params !== "undefined" ) {
        apiRoute.params.forEach( function ( param ) {
          if ( typeof param["secured-by"] !== "undefined" ) {
            router.param( param.name, function ( req, res, next, v ) {
              return checkAuthFn( req, res, param.handler.bind( this, req, res, next, v ) );
            } );
          } else {
            router.param( param.name, param.handler );
          }
        } );
      }
      var uri = apiRoute.route,
      // create a new route with the uri
        route = router.route( uri );
      // process through each action
      apiRoute.actions.forEach( function ( action ) {
        // just in case we have more than one verb, split them out
        var verbs = action.verb.split( "," );
        // and add the handler specified to the route (if it's a valid verb)
        verbs.forEach( function ( verb ) {
          if ( typeof route[ verb ] === "function" ) {
            if ( typeof action["secured-by"] !== "undefined" ) {
              route[ verb ]( checkAuthFn, action.handler );
            } else {
              route[ verb ]( action.handler );
            }
          }
        } );
      } );
    } );
    return router;
  },
  /**
   *
   * Create a hypermedia representation for a given API action. The end result looks like this:
   *
   * { "<action.action>":
   *   {
   *     "title": "<action.description.title>",
   *     "type": "<action.description.type>",
   *     "accept: "<action.description.accept>",
   *     "href": "<action.description.href>",
   *     "template": "<action.description.template>"
   *   }
   * }
   *
   * If parent is supplied, the data is appended to parent object, otherwise the above data is
   * returned
   */
  generateHypermediaForAction: function ( action, parent, security, override ) {
    var hm = JSON.parse( JSON.stringify( action ) );
    hm.allow = action.verb;
    if ( typeof hm["csrf"] !== "undefined" ) {
      hm = this.mergeAndClone( hm, security["csrf-defs"][hm["csrf"]] );
    }
    if ( typeof hm["secured-by"] !== "undefined" ) {
      hm = this.mergeAndClone( hm, security["secured-by-defs"][hm["secured-by"]] );
    }
    if ( typeof hm["hmac"] !== "undefined" ) {
      hm = this.mergeAndClone( hm, security["hmac-defs"][hm["hmac"]] );
    }
    if ( typeof parent !== "undefined" ) {
      parent[ (typeof override === "undefined") ? action.action : override ] = hm;
      return hm;
    } else {
      parent = {};
      parent[ (typeof override === "undefined") ? action.action : override ] = hm;
      return parent;
    }
  },
  /**
   *
   * Generates a hypermedia representation for an entire API.
   *
   */
  generateHypermediaForApi:    function ( api, security ) {
    var hm = {},
      self = this;
    api.forEach( function ( apiRoute ) {
      apiRoute.actions.forEach( function ( action ) {
        self.generateHypermediaForAction( action, hm, security );
      } );
    } );
    return hm;
  },
  /**
   * Merges the supplied objects into one new object. This isn't a deep clone -- so
   * this is only usable in lists and the like
   */
  mergeAndClone:               function mergeAndClone() {
    var t = {},
      args = Array.prototype.slice.call( arguments, 0 );

    args.forEach( function ( s ) {
      Object.keys( s ).forEach( function ( prop ) {
        var e = s[prop];
        if ( typeof e === "object" && e instanceof Array ) {
          if ( typeof t[prop] === "object" && t[prop] instanceof Array ) {
            t[prop] = t[prop].concat( e );
          } else if ( typeof t[prop] !== "object" || !(t[prop] instanceof Array) ) {
            t[prop] = e;
          }
        } else if ( typeof e === "object" && typeof t[prop] === "object" ) {
          t[prop] = mergeAndClone( t[prop], e );
        } else {
          t[prop] = e;
        }
      } )
    } );
    return t;
  }
};
