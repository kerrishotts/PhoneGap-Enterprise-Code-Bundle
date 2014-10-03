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
  Person = require( "../../models/person" ),
  getPersonAction = require( "./getPerson" ),

  action = {
    "title":            "People",
    "action":           "get-people",
    "verb":             "get",
    "secured-by":       "tasker-auth",
    "hmac":             "tasker-256",
    "description":      [
      "Get people."
    ],
    "returns":          {
      200: "OK",
      401: "Unauthorized; user not logged in.",
      403: "Authenticated, but user has no access to this resource.",
      500: "Internal Server Error"
    },
    "example":          {
      "headers": {
        "x-next-token": "next-auth-token"
      },
      "body":    {
        "people": [ 304, 112, 1093 ]
      }
    },
    "href":             "/people",
    "templated":        false,
    "base-href":        "/people",
    "accepts":          [ "application/hal+json", "application/json", "text/json" ],
    "sends":            [ "application/hal+json", "application/json", "text/json" ],
    "store":            {
      "body": [
        { "name": "people", key: "people" }
      ]
    },
    "query-parameters": {
      "administered-by": { "title": "Administered By", "key": "administeredBy", "type": "number", "required": false }
    },
    "handler":          function ( req, res, next ) {

      // If the user isn't authenticated, bail!
      if ( !req.user ) { return next( Errors.HTTP_Unauthorized() ); }

      // if the hmac doesn't check, let the client know.
      if ( !security["hmac-defs"]["tasker-256"].handler( req ) ) { return next( Errors.HTTP_Forbidden( "Invalid or missing HMAC." ) ); }

      // store next token
      res.set( "x-next-token", req.user.nextToken );

      // does our input validate?
      var validationResults = objUtils.validate( req.query, action["query-parameters"] );
      if ( !validationResults.validates ) {
        return next( Errors.HTTP_Bad_Request( validationResults.message ) );
      }
      var o = {
        people: [],
        _links: {}, _embedded: {}
      };

      // get the potential parameters
      var administeredBy = (typeof req.query.administeredBy !== "undefined") ? req.query.administeredBy : null;

      if ( administeredBy !== null ) { administeredBy = parseInt( administeredBy, 10 ); }

      var dbUtil = new DBUtils( req.app.get( "client-pool" ) );
      dbUtil.query( "SELECT * FROM table(tasker.person_mgmt.get_people_administered_by(:1))",
                    [ administeredBy ] )
        .then( function ( results ) {

                 // for each result, we want to add the person as an embedded element and generate
                 // the appropriate hypermedia. For the body of our response, we just generate
                 // an array and push the person IDs on that array
                 results.forEach( function ( row ) {
                   // new task, based on result
                   var person = new Person( row );
                   // add id to body
                   o.people.push( person.id );
                   // add the task to the embedded section, along with _links
                   o._embedded[person.id] = apiUtils.mergeAndClone( person, { "_links": {} } );
                   // And add the hypermedia to the embedded element
                   apiUtils.generateHypermediaForAction( getPersonAction, o._embedded[person.id]["_links"], security, "self" );
                   // update the href and templated parameters in _links
                   o._embedded[person.id]["_links"].self = apiUtils.mergeAndClone(
                     o._embedded[person.id]["_links"].self,
                     { "href": "/person/" + person.id,
                       "templated": false } );
                 } );

                 // add hypermedia
                 apiUtils.generateHypermediaForAction( action, o._links, security, "self" );
                 [ getPersonAction, require( "../auth/logout" ) ].forEach( function ( apiAction ) {
                   apiUtils.generateHypermediaForAction( apiAction, o._links, security );
                 } );
                 resUtils.json( res, 200, o );
               } )
        .catch( function ( err ) {
                  return next( new Error( err ) );
                } )
        .done();
    }
  };

module.exports = action;
