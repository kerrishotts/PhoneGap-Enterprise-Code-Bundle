/**
 *
 * XHR module
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
/*global define, console */
define( [ "Q" ], function ( Q ) {
  "use strict";
  var DEBUG = true;

  /**
   * Construct a TimeoutError suitable for throwing; only thrown
   * when an XHR request exceeds the timeout setting
   * @constructor
   */
  function TimeoutError() {
    this.name = "TimeoutError";
    this.message = "Timeout";
    this.code = -20000;
  }

  TimeoutError.prototype = new Error();
  TimeoutError.prototype.constructor = TimeoutError;
  /**
   * Construct an HTTP Error suitable for throwing; only thrown
   * when an XHR request returns a result other than 200
   * @param status {number} the HTTP error status code
   * @param response {*} the XHR response (often has more details)
   * @constructor
   */
  function HTTPError( status, response ) {
    this.name = "HTTPError";
    this.message = "HTTP " + status;
    this.code = -1 * status;
    this.HTTPStatus = status;
    this.HTTPResponse = response;
  }

  HTTPError.prototype = new Error();
  HTTPError.prototype.constructor = HTTPError;
  /**
   * Construct an error suitable for throwing when an XHR
   * request has reached its maximum number of retry attempts
   * @constructor
   */
  function MaxRetryAttemptsReached( cause ) {
    this.name = "MaxRetryAttemptsReached";
    this.message = "The maximum number of retry attempts was reached.";
    this.code = -21000;
    this.cause = cause;
  }

  MaxRetryAttemptsReached.prototype = new Error();
  MaxRetryAttemptsReached.prototype.constructor = MaxRetryAttemptsReached;
  /**
   * Construct an error suitable for throwing when an XHR
   * JSON response cannot be parsed.
   * @param response {*} The malformed response
   * @constructor
   */
  function JSONParseError( response ) {
    this.name = "JSONParseError";
    this.message = "The JSON response could not be parsed";
    this.response = response;
    this.code = -30000;
  }

  JSONParseError.prototype = new Error();
  JSONParseError.prototype.constructor = JSONParseError;
  /**
   * Thrown when an XHR fires an onerror event
   * @constructor
   */
  function XHRError() {
    this.name = "XHRError";
    this.message = "Encountered a non-HTTP error during XHR";
    this.code = -10000;
  }

  XHRError.prototype = new Error();
  XHRError.prototype.constructor = XHRError;

  /**
   * From: https://gist.github.com/kerrishotts/67a077893f6223f42758#file-parseresponseheaders-js
   * Parse response header string of the form:
   *
   * "
   *     header: value
   *     another-header: value
   * "
   *
   * @param {string} headerStr    headers to parse
   * @param {boolean} modifyKeys  if true, header keys are modified to be
   *                              camelcase. default: true
   * @return {*}                  object containing header keys
   *
   */
  function parseResponseHeaders( headerStr, modifyKeys ) {
    // no header? return an empty object
    if ( !headerStr ) {
      return {};
    }
    // check if modifyKeys is passed; if not true is the default
    if ( typeof modifyKeys === "undefined" ) {
      modifyKeys = true;
    }
    // split the header string by carraige return, then reduce it to
    // an object containing the header keys and values
    return headerStr.split( "\r\n" )
      .reduce(
        function parseHeader( prevValue, headerPair ) {
          // header is of the form abc: def; split by ": " and then
          // shift out the key. Reconstruct the value in case some one has
          // a header of abc: def: ghi
          var headerParts = headerPair.split( ": " ),
            headerKey = headerParts.shift(),
            headerValue = headerParts.join( ": " ),
            propParts, prop;
          if ( modifyKeys ) {
            // convert some-property-key to somePropertyKey
            propParts = headerKey.split( "-" );
            prop = propParts.reduce( function ( prevValue, v ) {
              return prevValue + ( v.substr( 0, 1 )
                .toUpperCase() + v.substr( 1 ) );
            } );
            prop = prop.substr( 0, 1 )
              .toLowerCase() +
              prop.substr( 1 );
          }
          // if we have one or more part, copy the value to the key
          if ( headerParts.length > 0 ) {
            prevValue[ modifyKeys ? prop : headerKey ] = headerValue;
          } else {
            // otherwise just copy true
            prevValue[ modifyKeys ? prop : headerKey ] = true;
          }
          return prevValue;
        }, {} );
  }

  /**
   * Sends an XHR using the specified method to the URI using the supplied options.
   * Returns a promise.
   *
   * @param method {string} GET, POST, PUT, DELETE, etc...
   * @param uri {string}    URI of the resource
   * @param options {*}     Options
   * @returns {*}           Promise
   * @private
   */
  function _xhr( method, uri, options ) {
    method = method.toUpperCase();
    if ( DEBUG ) {
      console.log( method, uri, options );
    }
    // get a deferred promise
    var deferred = Q.defer();
    // define our default options and merge the user options back in
    var opt = {
      data: null, // data to send
      sending: "application/json", // mime type that we're sending
      receiving: "application/json", // mime type we expect back
      async: true, // send asynchronously
      withCredentials: true, // true to send cookies
      retryAutomatically: true, // if a timeout occurs, retry
      retryOnXHRError: true, // if an XHR error occurs, also retry
      timeout: 30000, // timeout after 30s, if no retry, TimeoutError
      initialRetryDelay: 1500, // attempt a retry after 0.5s
      retryThrottle: 1.125, // multiply each time round
      maximumRetryAttempts: 5, // fail after 5 attempts -- MaxRetryAttemptsError
      headers: [], // headers to send on the request
      username: undefined, // don't send a username (Basic Auth)
      password: undefined, // don't send a password (Basic Auth)
      modifyHeaderKeys: false // if true, header keys are converted to camelCase in response

    };
    if ( typeof options !== "undefined" ) {
      for ( var prop in options ) {
        if ( options.hasOwnProperty( prop ) ) {
          opt[ prop ] = options[ prop ];
        }
      }
    }
    // private variables to track retry attempts
    var retryAttempts = 0,
      retryDelay = opt.initialRetryDelay;
    // If the data we're sending is JSON and sending is application/json, then
    // parse the data accordingly -- otherwise copy the value
    var sendingData = null;
    if ( ( opt.sending === "application/json" || opt.sending === "text/json" ) &&
      ( opt.data !== undefined && opt.data !== null ) ) {
      sendingData = JSON.stringify( opt.data );
    } else {
      sendingData = opt.data;
    }
    /**
     * This is an private method that actually sends the request. It's a
     * function because we need to be able to resend the request should
     * an error or timeout occurs.
     */
    function sendRequest() {
      var xhr = new XMLHttpRequest();
      xhr.open( method, uri, opt.async, opt.username, opt.password );
      xhr.withCredentials = opt.withCredentials;
      xhr.timeout = opt.timeout;
      xhr.setRequestHeader( "Accept", opt.receiving );
      xhr.setRequestHeader( "Content-Type", opt.sending );
      // copy headers from options and emit
      opt.headers.forEach( function ( header ) {
        xhr.setRequestHeader( header.headerName, header.headerValue );
      } );
      /**
       * If the response times out, it will retry if retryAutomatically
       * is true. If not, a TimeoutError will be thrown immediately.
       */
      xhr.ontimeout = function () {
        if ( opt.retryAutomatically ) {
          if ( retryAttempts === opt.maximumRetryAttempts ) {
            if ( DEBUG ) {
              console.log( "Max attempts" );
            }
            deferred.reject( new MaxRetryAttemptsReached( new TimeoutError() ) );
          } else {
            if ( DEBUG ) {
              console.log( "Refire" );
            }
            setTimeout( function () {
              sendRequest();
            }, retryDelay );
            retryDelay = retryDelay * opt.retryThrottle;
            retryAttempts++;
          }
        } else {
          deferred.reject( new TimeoutError() );
        }
      };
      /**
       * Similar to ontimeout handler; throws an XHRError immediately
       * if retryOnXHRError isn't true, otherwise it retries several
       * times.
       */
      xhr.onerror = function () {
        if ( opt.retryOnXHRError ) {
          if ( retryAttempts === opt.maximumRetryAttempts ) {
            if ( DEBUG ) {
              console.log( "Max attempts" );
            }
            deferred.reject( new MaxRetryAttemptsReached( new XHRError() ) );
          } else {
            if ( DEBUG ) {
              console.log( "Refire" );
            }
            setTimeout( function () {
              if ( DEBUG ) {
                console.log( "Resend" );
              }
              sendRequest();
            }, retryDelay );
            retryDelay = retryDelay * opt.retryThrottle;
            retryAttempts++;
          }
        } else {
          deferred.reject( new XHRError() );
        }
      };
      /**
       * When the request has loaded, check the status value. If it's
       * 200, then pass the response to as a resolution to the promise.
       * If not, pass the response and HTTP error as an HTTPError.
       */
      xhr.onload = function () {
        if ( this.status >= 200 && this.status <= 299 ) {
          var headers = parseResponseHeaders( this.getAllResponseHeaders(), opt.modifyHeaderKeys ),
            response = {
              headers: headers,
              body: null,
              status: this.status
            };
          switch ( opt.receiving ) {
          case "application/hal+json":
          case "application/json":
          case "text/json":
            try {
              response.body = JSON.parse( this.responseText );
              deferred.resolve( response );
            } catch ( err ) {
              deferred.reject( new JSONParseError( this.responseText ) );
            }
            break;
          case "application/xml":
          case "text/xml":
            response.body = this.responseXML;
            deferred.resolve( response );
            break;
          default:
            response.body = this.response;
            deferred.resolve( response );
          }
        } else {
          deferred.reject( new HTTPError( this.status, this.response ) );
        }
      };
      xhr.send( sendingData );
    }

    sendRequest();
    return deferred.promise;
  }

  function _checkIfSecure( server, fingerprints ) {
    var deferred = Q.defer();
    try {
      var args = [];
      // success
      args.push( function success( message ) {
        deferred.resolve( message );
      } );
      // failure
      args.push( function failure( message ) {
        deferred.reject( message );
      } );
      // server
      args.push( server );
      // fingerprints
      for ( var i = 0; i < fingerprints.length; i++ ) {
        args.push( fingerprints[ i ] );
      }
      window.plugins.sslCertificateChecker.check.apply( this, args );
    } catch ( err ) {
      // if window.plugins isn't defined, we'll go ahead and resolve instead
      if ( typeof window.plugins === "undefined" ) {
        deferred.resolve( "" );
      } else {
        deferred.reject( err );
      }
    }
    return deferred.promise;
  }

  return {
    send: _xhr,
    checkIfSecure: _checkIfSecure,
    TimeoutError: TimeoutError,
    MaxRetryAttemptsReached: MaxRetryAttemptsReached,
    HTTPError: HTTPError,
    JSONParseError: JSONParseError,
    XHRError: XHRError
  };
} );
