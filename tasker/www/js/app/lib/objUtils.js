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
define( [ "yasmf" ], function ( _y ) {
  "use strict";

  var ObjUtils = {
    /**
     * Returns a value in an object for a given keypath. A keypath can drill into the
     * object to an arbitrary number of levels, which makes this incredibly useful.
     * If any portion of the keypath evaluates to undefined or null, that is the final
     * result. Essentially this is a quick way to obtain values deep in an object
     * hierarchy without knowing (or caring) if there are intervening undefined/null
     * values.
     *
     * A keypath looks like this: "field1.field2.field3[index1].field4"
     *
     * @param {*} o        object
     * @param {string} k   keypath
     * @param {*} d        default
     * @return {*}         value at keypath or default if keypath undefined or null
     */
    valueForKeyPath: _y.valueForKeyPath,
    /**
     * Merge multiple objects into one. For more information, see
     * https://gist.github.com/kerrishotts/12c86d2a57f8b5bc1aca
     *
     * @return {*} merged objects
     */
    merge: function merge() {
      var t = {},
        args = Array.prototype.slice.call( arguments, 0 );

      args.forEach( function ( s ) {
        Object.keys( s )
          .forEach( function ( prop ) {
            var e = s[ prop ];
            if ( e instanceof Array ) {
              if ( t[ prop ] instanceof Array ) {
                t[ prop ] = t[ prop ].concat( e );
              } else if ( !( t[ prop ] instanceof Object ) || !( t[ prop ] instanceof Array ) ) {
                t[ prop ] = e;
              }
            } else if ( e instanceof Object && t[ prop ] instanceof Object ) {
              t[ prop ] = merge( t[ prop ], e );
            } else {
              t[ prop ] = e;
            }
          } );
      } );
      return t;
    },

    /**
     * Iterates over the keys in an object
     * @param  {Object|Array}   o  Object or array to iterate over
     * @param  {Function} fn Function to call with each item (value, key, object)
     */
    forEach: function forEach( o, fn ) {
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
      Object.keys( o )
        .forEach( function ( prop ) {
          fn( o[ prop ], prop, o ); // mimic value, idx, array on Array forEach
        } );
    },
    /**
     * Interpolates a string
     */
    interpolate: _y.interpolate
  };

  return ObjUtils;
} );
