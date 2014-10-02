/**
 *
 * object utilities
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
define( function () {
  "use strict";
  var ObjUtils = {
    merge:       function merge() {
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
      /*var o = {};
       var prop;
       var args = Array.prototype.slice.call( arguments, 0 );
       args.forEach( function ( arr ) {
       for ( prop in arr ) {
       if ( arr.hasOwnProperty( prop ) ) {
       o[prop] = arr[prop];
       }
       }
       } );
       return o;*/
    },
    forEach:     function forEach( o, fn ) {
      if ( typeof o === "object" ) {
        if ( typeof o.forEach !== "undefined" ) {
          o.forEach( fn );
          return;
        }
      }
      if ( typeof o !== "object" ) {
        return;
      }
      if ( typeof fn !== "function" ) {
        return;
      }
      Object.keys( o ).forEach( function ( prop ) {
        fn( o[prop], prop, o ); // mimic value, idx, array on Array forEach
      } );
    },
    interpolate: function interpolate( str, context ) {
      var newStr = str;
      if ( typeof context === "undefined" ) {
        return newStr;
      }
      ObjUtils.forEach( context, function ( v, prop ) {
        newStr = newStr.replace( "{" + prop + "}", v );
      } );
      return newStr;
    }
  };

  return ObjUtils;
} );