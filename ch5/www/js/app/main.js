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
define( [ "yasmf", "app/lib/xhr",
                   "app/lib/objUtils",
                   "app/lib/hateoas",
                   "app/models/session",
                   "socket.io"], function( _y, XHR, ObjUtils, Hateoas, Session, io ) {
  "use strict";
  // private methods
  // syntax highlight & pretty print from http://stackoverflow.com/a/7220510/741043
  function syntaxHighlight(json) {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 4);
    }
    try
    {
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match)
      {
        var cls = 'number';
        if (/^"/.test(match))
        {
          if (/:$/.test(match))
          {
            cls = 'key';
          } else
          {
            cls = 'string';
          }
        } else if (/true|false/.test(match))
        {
          cls = 'boolean';
        } else if (/null/.test(match))
        {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    } catch (err) {
      return json;
    }
  }

  function log ( msg ) {
    var logMsg = msg,
      console;
    if (typeof msg !== "string") {
      logMsg = syntaxHighlight (msg);
    }
    var e = document.createElement("div");
    e.innerHTML = "Logged on: " + (new Date()).toString();
    var pre = document.createElement("pre");
    pre.innerHTML = logMsg;
    e.appendChild(pre);

    console = document.getElementById ("console");
    console.insertBefore (e, console.firstChild);
    //.appendChild (e);
  }

  function logMore () {
    for (var i = 0; i<arguments.length; i++) {
      log ( arguments[i] );
    }
  }

  // define our app object
  var APP = {};
  APP.start = function() {
    var baseURI = "https://pge-as.acmecorp.com:4443";
    var session;
    var context = {};

    console.log = logMore;

    // to be really secure, this should be checked before EVERY XHR. For the demo, once is sufficient.
    XHR.checkIfSecure ( baseURI, ["27 02 A5 EB 95 91 41 66 C3 9F 82 D3 59 14 13 0E 13 B5 13 9E"])
      .then ( function ( msg ) {
      // example straight from http://socket.io/docs/
      var socket = io('https://pge-as.acmecorp.com:4443');
      socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
      });

      return XHR.send ( "GET", baseURI + "/");
    })
      .then ( function ( r ) {
      console.log ("Response from API Discovery", r);
      return XHR.send (r._links["get-token"].verb, baseURI + r._links["get-token"].href );
    })
      .then ( function ( r) {
      console.log ("Response from CSRF token request", r);

      Hateoas.storeResponseToContext( r, context );

      // create post response based upon the template
      var loginAction = r._links["login"];
      var postData = Hateoas.crossWalk ({
                                        "user-id":            "JDOE",
                                        "candidate-password": "password"
                                      }, loginAction.template );

      // build response headers
      var headers = Hateoas.buildHeadersAttachment( loginAction.attachments.headers, context );

      // send request
      return XHR.send ( r._links["login"].verb, baseURI + r._links["login"].href, { data: postData, headers: headers } );
    }).then ( function ( r ) {
      console.log (r, "Response from AUTH POST");
      Hateoas.storeResponseToContext ( r, context );
      console.log ( context, "Context after storing" );
      session = new Session ( { sessionId: context["session-id"],
                                sessionSalt: context["session-salt"],
                                userId: context["user-id"],
                                nextIntermediateToken: context["next-token"]
                              } );
      console.log ( session, "Session after pulling from context" );
      context["next-token"] = session.computeNextToken();

      var headers = Hateoas.buildHeadersAttachment ( r._links["get-task"].attachments.headers, context );

      var URI = baseURI + ObjUtils.interpolate (r._links["get-task"].href, { "taskId": 2 } );

      return XHR.send ( r._links["get-task"].verb, URI, { headers: headers });
    }).then ( function ( r ) {
      console.log ( r, "Response from GET task");
      Hateoas.storeResponseToContext( r, context );
      session.nextIntermediateToken = context["next-token"];
      context["next-token"] = session.computeNextToken();

      var headers = Hateoas.buildHeadersAttachment ( r._links["self"].attachments.headers, context );

      var URI = baseURI + ObjUtils.interpolate (r._links["self"].href, { "taskId": 2 } );

      return XHR.send ( r._links["self"].verb, URI, { headers: headers });
    }).then ( function ( r ) {
      console.log ( r, "response from GET self" );
      Hateoas.storeResponseToContext( r, context );
      session.nextIntermediateToken = context["next-token"];
      context["next-token"] = session.computeNextToken();
    }).catch ( function ( err ) {
      console.log ( err, "failure in chain");
    }).done();


  };
  return APP;
} );
