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

/**
 * Merges the supplied objects into one new object. This isn't a deep clone -- so
 * this is only usable in lists and the like
 */
function mergeAndClone() {
  var o = {},
    args = Array.prototype.slice.call( arguments, 0 );
  args.forEach( function ( arr ) {
    for ( var prop in arr ) {
      if ( arr.hasOwnProperty( prop ) ) {
        o[ prop ] = arr[ prop ];
      }
    }
  } );
  return o;
}

function mergeIntoUsingMap( source, defaults, map ) {
  var returningObject = {};
  if ( typeof defaults !== "undefined" ) {
    returningObject = mergeAndClone( returningObject, defaults );
  }
  if ( typeof source !== "undefined" ) {
    Object.keys( source ).forEach( function ( prop ) {
      var mapper;
      if ( typeof returningObject[prop] !== "undefined" ) {
        returningObject[ prop ] = source[ prop ];
      }
      if ( typeof map !== "undefined" ) {
        if ( typeof map[ prop ] !== "undefined" ) {
          mapper = map[ prop ];
          if ( typeof mapper.cvt === "function" ) {
            returningObject[ mapper.key ] = mapper.cvt( source [ prop ] );
          } else {
            returningObject[ mapper.key ] = source[ prop ];
          }
        }
      }
    } );
  }
  return returningObject;
}

module.exports = {
  mergeAndClone:     mergeAndClone,
  mergeIntoUsingMap: mergeIntoUsingMap
};
