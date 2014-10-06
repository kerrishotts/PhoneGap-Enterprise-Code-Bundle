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
var CryptoJS = require( "crypto-js" ),
  winston = require( "winston" ),
  security = {
    "csrf-defs": {
      "tasker-csrf": {
        "csrf-action": [ "get-csrf-token" ],
        "attachments": {
          "headers": [ {
            name: "csrf-token",
            key: "x-csrf-token",
            value: "{csrf-token}",
            templated: true
          } ]
        }
      }
    },
    "secured-by-defs": {
      "tasker-auth": {
        "auth-action": [ "login" ],
        "attachments": {
          "headers": [ {
            "name": "auth-token",
            "key": "x-auth-token",
            "value": "{session-id}.{next-token}",
            "templated": true
          } ]
        },
        "store": {
          "headers": [ {
            "name": "next-token",
            "key": "x-next-token",
            "only-when": "not null"
          } ]
        }
      }
    },
    "hmac-defs": {
      "tasker-256": {
        "hmac": "SHA256",
        "hmac-template": "{date:%Y%m%d.%H%M}{route}{query-string}{body}",
        "hmac-secret": "{hmac-secret}",
        "attachments": {
          "headers": [ {
            "name": "hmac-token",
            "key": "x-hmac-token",
            "value": "{hmac-token}",
            templated: true
          } ]
        },
        "handler": function checkHmac( req ) {
          if ( !req.isAuthenticated() ) {
            return false; // can't check -- we won't have an hmac token
          }

          function checkHmac( candidate, delta ) {
            function pad2( v ) {
              return ( v < 10 ) ? "0" + v : "" + v;
            }

            var now = new Date(),
              nowYYYY,
              nowMM,
              nowDD,
              nowHH,
              nowMI,
              dateString = "",
              stringToHmac = "",
              hmacString = "";
            now.setMinutes( now.getMinutes() + delta );
            nowYYYY = now.getUTCFullYear();
            nowMM = now.getUTCMonth() + 1;
            nowDD = now.getUTCDate();
            nowHH = now.getUTCHours();
            nowMI = now.getUTCMinutes();
            dateString = "" + nowYYYY + pad2( nowMM ) + pad2( nowDD ) + "." + pad2( nowHH ) + pad2( nowMI );
            stringToHmac = "" + dateString + "." + req.url + ( Object.keys( req.body )
              .length > 0 ? "." + JSON.stringify( req.body ) : "" );
            hmacString = CryptoJS.HmacSHA256( stringToHmac, req.user.hmacSecret )
              .toString( CryptoJS.enc.Base64 );
            if ( hmacString !== candidate ) {
              // try a hex encoding
              hmacString = CryptoJS.HmacSHA256( stringToHmac, req.user.hmacSecret )
                .toString( CryptoJS.enc.Hex );
              return hmacString === candidate;
            }
            return hmacString === candidate;
          }

          var clientHmac = req.headers[ "x-hmac-token" ],
            validHmac = false;
          if ( !checkHmac( clientHmac, 0 ) ) {
            // client's time doesn't match ours -- give them some leeway (+/-5min)
            for ( var i = -5; i < 6; i++ ) {
              if ( checkHmac( clientHmac, i ) ) {
                validHmac = true;
                break;
              }
            }
          } else {
            validHmac = true; // client's time is on the same minute
          }
          return validHmac;
        }
      }
    }
  };

module.exports = security;
