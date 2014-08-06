/**
 *
 * main.js
 * @author Kerri Shotts
 * @version 3.0.0
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
 */
/*jshint
         asi:true,
         bitwise:true,
         browser:true,
         curly:true,
         eqeqeq:false,
         forin:true,
         noarg:true,
         noempty:true,
         plusplus:false,
         smarttabs:true,
         sub:true,
         trailing:false,
         undef:true,
         white:false,
         onevar:false 
 */
/*global define*/
define( [ "yasmf", "app/lib/xhr", "app/models/session" ], function( _y, XHR, Session ) {
  "use strict";
  // define our app object
  var APP = {};
  APP.start = function() {
    var baseURI = "https://pge-as.acmecorp.com:4443";
    var session;

    XHR.send ( "GET", baseURI + "/")
      .then ( function ( r ) {
      console.log (r);
      return XHR.send ( "GET", baseURI + r._links["get-token"].href );
    })
      .then ( function ( r) {
      console.log (r);
      var postData = {};
      postData[r._links["login"].template["user-id"].key] = "JDOE";
      postData[r._links["login"].template["candidate-password"].key] = "password";
      return XHR.send ( "POST", baseURI + r._links["login"].href, {
        data: postData,
        headers: [{ headerName: "x-csrf-token",
                    headerValue: r.token }]
      } );
    }).then ( function ( r ) {
      console.log (r);
      session = new Session ( r );
      return XHR.send ( "GET", baseURI + r._links["get-task"].href.replace("{taskId}","2"),
       {headers: [{ headerName: "x-auth-token",
                    headerValue: "" + session.sessionId + "." + session.computeNextToken()
         }]
       });
    }).then ( function ( r ) {
      console.log ( r);
      session.nextIncompleteToken = r.nextToken;
      return XHR.send ( "GET", baseURI + r._links["self"].href,
                        {headers: [{ headerName: "x-auth-token",
                                     headerValue: "" + session.sessionId + "." + session.computeNextToken()
                                   }]
                        });
    }).then ( function ( r ) {
      console.log ( r );
      session.nextIncompleteToken = r.nextToken;
    }).done();;




    /*
    REST.post( "/auth", {

      "userId": "JDOE",
      "candidatePassword": "password"
    }).then ( function (r) {
      console.log (r);
    });
  */
  };
  return APP;
} );
