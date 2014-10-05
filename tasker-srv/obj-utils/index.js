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

/**
 * Merges the supplied objects into one new object. This isn't a deep clone -- so
 * this is only usable in lists and the like
 *
 * See: https://gist.github.com/kerrishotts/12c86d2a57f8b5bc1aca#file-merge-js
 */
function merge() {
  "use strict";
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
}

function mergeIntoUsingMap( source, defaults, map ) {
  "use strict";
  var returningObject = {};
  if ( defaults !== undefined ) {
    returningObject = merge( returningObject, defaults );
  }
  if ( source !== undefined ) {
    Object.keys( source )
      .forEach( function ( prop ) {
        var mapper;
        if ( returningObject[ prop ] !== undefined ) {
          returningObject[ prop ] = source[ prop ];
        }
        if ( map !== undefined ) {
          if ( map[ prop ] !== undefined ) {
            mapper = map[ prop ];
            if ( typeof mapper.cvt === "function" ) {
              returningObject[ mapper.key ] = mapper.cvt( source[ prop ] );
            } else {
              returningObject[ mapper.key ] = source[ prop ];
            }
          }
        }
      } );
  }
  return returningObject;
}

/**
 *
 * from: https://gist.github.com/kerrishotts/3ffe4c5c704b23e8d22f#file-validate-js
 *
 * Validates a source against the specified rules. `source` can look like this:
 *
 *     { aString: "hi", aNumber: { hi: 294.12 }, anInteger: 1944.32 }
 *
 * `rules` can look like this:
 *
 *     {
 *       "a-string": {
 *         title: "A String",     -- optional; if not supplied, key is used
 *         key: "aString",        -- optional: if not supplied the name of this rule is used as the key
 *         required: true,        -- optional: if not supplied, value is not required
 *         type: "string",        -- string, number, integer, array, date, boolean, object, *(any)
 *         minLength: 1,          -- optional: minimum length (string, array)
 *         maxLength: 255         -- optional: maximum length (string, array)
 *       },
 *       "a-number": {
 *         title: "A Number",
 *         key: "aNumber.hi",     -- keys can have . and [] to reference properties within objects
 *         required: false,
 *         type: "number",
 *         min: 0,                -- if specified, number/integer can't be smaller than this number
 *         max: 100               -- if specified, number/integer can't be larger than this number
 *       },
 *       "an-integer": {
 *         title: "An Integer",
 *         key: "anInteger",
 *         required: true,
 *         type: "integer",
 *         enum: [1, 2, 4, 8]     -- if specified, the value must be a part of the array
 *                                -- may also be specified as an array of objects with title/value properties
 *       }
 *     }
 *
 * @param {*} source       source to validate
 * @param {*} rules        validation rules
 * @returns {*}            an object with two fields: `validates: true|false` and `message: validation message`
 */
function validate( source, rules ) {
  "use strict";
  var r = {
    validates: true,
    message: ""
  };

  if ( !( rules instanceof Object ) ) {
    return r;
  }

  // go over each rule in `rules`
  Object.keys( rules )
    .forEach( function ( prop ) {
      if ( r.validates ) {
        // get the rule
        var rule = rules[ prop ],
          v = source,
          // and get the value in source
          k = ( rule.key !== undefined ) ? rule.key : prop,
          title = ( rule.title !== undefined ) ? rule.title : prop;
        k = k.replace( "[", "." )
          .replace( "]", "" )
          .replace( "\"", "" );
        k.split( "." )
          .forEach( function ( keyPart ) {
            try {
              v = v[ keyPart ];
            } catch ( err ) {
              v = undefined;
            }
          } );
        // is it required?
        if ( ( ( rule.required !== undefined ) ? rule.required : false ) && v === undefined ) {
          r.validates = false;
          r.message = "Missing required value " + title;
          return;
        }

        // can it be null?
        if ( !( ( rule.nullable !== undefined ) ? rule.nullable : false ) && v === null ) {
          r.validates = false;
          r.message = "Unexpected null in " + title;
          return;
        }

        // is it of the right type?
        r.message = "Type Mismatch; expected " + rule.type + " not " + ( typeof v ) + " in " + title;
        switch ( rule.type ) {
        case "number":
          if ( v !== undefined ) {
            if ( isNaN( parseFloat( v ) ) ) {
              r.validates = false;
              return;
            }
            if ( v != parseFloat( v ) ) {
              r.validates = false;
              return;
            }
          }
          break;
        case "integer":
          if ( v !== undefined ) {
            if ( isNaN( parseInt( v, 10 ) ) ) {
              r.validates = false;
              return;
            }
            if ( v != parseInt( v, 10 ) ) {
              r.validates = false;
              return;
            }
          }
          break;
        case "array":
          if ( v !== undefined && !( v instanceof Array ) ) {
            r.validates = false;
            return;
          }
          break;
        case "date":
          if ( v instanceof Object ) {
            if ( !( v instanceof Date ) ) {
              r.validates = false;
              return;
            } else if ( v instanceof Date && isNaN( v.getTime() ) ) {
              r.validates = false;
              r.message = "Invalid date in " + title;
              return;
            }
          } else if ( typeof v === "string" ) {
            if ( isNaN( ( new Date( v ) )
              .getTime() ) ) {
              r.validates = false;
              r.message = "Invalid date in " + title;
              return;
            }
          } else if ( !( v instanceof "object" ) && v !== undefined ) {
            r.validates = false;
            return;
          }
          break;
        case "object":
          if ( !( v instanceof Object ) && v !== undefined ) {
            r.validates = false;
            return;
          }
          break;
        case "*":
          break;
        default:
          if ( !( typeof v === rule.type || v === undefined ) ) {
            r.validates = false;
            return;
          }
        }
        r.message = "";

        // if we're still here, types are good. Now check length, range, and enum

        // check range
        r.message = "Value out of range " + v + " in " + title;
        if ( typeof rule.min === "number" && v < rule.min ) {
          r.validates = false;
          return;
        }
        if ( typeof rule.max === "number" && v > rule.max ) {
          r.validates = false;
          return;
        }
        r.message = "";

        // check length
        if ( ( typeof rule.minLength === "number" && v !== undefined && v.length !== undefined && v.length < rule.minLength ) ||
          ( typeof rule.maxLength === "number" && v !== undefined && v.length !== undefined && v.length > rule.maxLength ) ) {
          r.message = "" + title + " out of length range";
          r.validates = false;
          return;
        }

        // check enum
        if ( rule.enum instanceof Object && v !== undefined ) {
          if ( rule.enum.filter( function ( e ) {
              if ( e.value !== undefined ) {
                return e.value == v;
              } else {
                return e == v;
              }
            } )
            .length === 0 ) {
            r.message = "" + title + " contains unexpected value " + v + " in " + title;
            r.validates = false;
            return;
          }
        }

        // check pattern
        if ( rule.pattern instanceof Object && v !== undefined ) {
          if ( v.match( rule.pattern ) === null ) {
            r.message = "" + title + " doesn't match pattern in " + title;
            r.validates = false;
            return;
          }
        }
      }
    } );

  return r;
}

module.exports = {
  mergeAndClone: merge,
  mergeIntoUsingMap: mergeIntoUsingMap,
  validate: validate
};
