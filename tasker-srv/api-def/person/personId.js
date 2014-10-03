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
var DBUtils = require( "../../db-utils" ),
  Errors = require( "../../errors" ),
  winston = require( "winston" ),
  Person = require( "../../models/person" ),

  param = {
    "name":        "personId",
    "type":        "number",
    "description": [
      "Obtains the person information for a given person ID."
    ],
    "returns":     {
      401: "Unauthorized; user not logged in.",
      404: "Person not found.",
      500: "Internal Server Error"
    },
    "secured-by":  "tasker-auth",
    "handler":     function ( req, res, next, personId ) {
      "use strict";

      // if we don't have a req.user, the user isn't authenticated. Bail!
      if ( !req.user ) { return next( Errors.HTTP_Unauthorized() ); }
      // get a database connection
      var dbUtil = new DBUtils( req.app.get( "client-pool" ) );

      // check the type of personId -- we know it's there, but the type might be funny... it must reduce to a number
      // we know the value will exist, just not the type
      personId = parseInt( personId, 10 );
      if ( isNaN( personId ) ) { return next( Errors.HTTP_Bad_Request( "Type mismatch" ) ); }

      dbUtil.query( "SELECT * FROM table(tasker.person_mgmt.get_person(:1))", [ personId ] )
        .then( function ( results ) {

                 // if no results, return 404 not found
                 if ( results.length === 0 ) { return next( Errors.HTTP_NotFound() ); }

                 // create a new task with the database results (will be in first row)
                 req.person = new Person( results[ 0 ] );
                 return next();
               } )
        .catch( function ( err ) {
                  return next( new Error( err ) );
                } )
        .done();
    }
  };
module.exports = param;
