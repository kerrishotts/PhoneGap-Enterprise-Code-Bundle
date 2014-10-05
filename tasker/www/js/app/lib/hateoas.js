/**
 *
 * hateaos utility lib
 *
 * @author Kerri Shotts
 * @version 1.0.0
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
define( [ "app/lib/objUtils" ], function ( ObjUtils ) {
  "use strict";

  function storeResponseToContext( r, context ) {
    var selfStore = ObjUtils.valueForKeyPath( r, "body._links.self.store" );
    if ( selfStore === undefined ) {
      return;
    }

    Object.keys( selfStore )
      .forEach( function ( prop ) {
        var o = selfStore[ prop ];
        o.forEach( function ( item ) {
          context[ item.name ] = ObjUtils.valueForKeyPath( r[ prop ], item.key );
        } );
      } );
  }

  function map( o, usingTemplate ) {
    var newO = {};
    Object.keys( usingTemplate )
      .forEach( function ( prop ) {
        var v = usingTemplate[ prop ];
        newO[ v.key ] = o[ prop ];
      } );
    return newO;
  }

  function buildHeadersAttachment( headers, context ) {
    var returnHeaders = [];
    if ( typeof headers === "undefined" ) {
      return returnHeaders;
    }
    headers.forEach( function ( header ) {
      if ( typeof header.templated === "undefined" || !header.templated ) {
        returnHeaders.push( {
          headerName: header.key,
          headerValue: header.value
        } );
      } else {
        returnHeaders.push( {
          headerName: header.key,
          headerValue: ObjUtils.interpolate( header.value, context )
        } );
      }
    } );
    return returnHeaders;
  }

  return {
    storeResponseToContext: storeResponseToContext,
    map: map,
    buildHeadersAttachment: buildHeadersAttachment
  };
} );
