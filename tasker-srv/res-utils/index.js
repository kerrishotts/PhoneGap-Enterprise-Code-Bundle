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

// adapted from: http://stackoverflow.com/a/7220510/741043
function syntaxHighlight( json ) {
  json = json.replace( /&/g, '&' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
  json = json.replace( /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function ( match ) {
    var cls = 'value number';
    if ( /^"/.test( match ) ) {
      if ( /:$/.test( match ) ) {
        cls = 'key';
      } else {
        cls = 'value string';
      }
    } else if ( /true|false/.test( match ) ) {
      cls = 'value boolean';
    } else if ( /null/.test( match ) ) {
      cls = 'value null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  } );
  json = json.replace( /\{/g, '{<span class="object">' ).replace ( /\}/g, '</span>}');
  json = json.replace( /\[/g, '[<span class="array">' ).replace ( /\]/g, '</span>]');
  json = json.replace( /\n/g, '</br>');
  return json;
}

function json( res, status, data ) {

  function sendAsJSON() {
    res.json( status, data );
  }

  function sendAsText() {
    res.status( status ).send( JSON.stringify( data, undefined, 2 ) );
  }

  function sendAsHTML() {
    res.status( status ).render( "json", {
      data:   data,
      pretty: syntaxHighlight( JSON.stringify( data, undefined, 2 ) )
    } );
  }

  res.format( {
                text:                   sendAsText,
                html:                   sendAsHTML,
                json:                   sendAsJSON,
                "application/hal+json": sendAsJSON,
                "text/json":            sendAsJSON
              } );
}

function error( res, status, err ) {
  function sendAsJSON() {
    res.json( status, {
      message: err.message,
      status:  status,
      stack:   err.stack.split( "\n" )
    } );
  }

  function sendAsHTML() {
    res.status( status );
    res.render( "error", {
      message: err.message,
      error:   err
    } );
  }

  function sendAsText() {
    res.status( status ).send( JSON.stringify( {
                                                 message: err.message,
                                                 status:  status,
                                                 error:   err
                                               }, undefined, 2 ) );
  }

  res.format( {
                text:                   sendAsText,
                html:                   sendAsHTML,
                json:                   sendAsJSON,
                "application/hal+json": sendAsJSON,
                "text/json":            sendAsJSON
              } );
}
module.exports = {
  json:  json,
  error: error
};
