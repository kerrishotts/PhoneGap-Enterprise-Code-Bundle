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


define( [ "../models/session", "../lib/objUtils", "../lib/xhr", "../lib/cryptojs", "../lib/hateoas", "yasmf", "Q" ],
  function ( Session, ObjUtils, XHR, CryptoJS, Hateoas, _y, Q ) {
    "use strict";

    var _className = "API";

    function API() {
      var self = new _y.BaseObject();
      self.subclass( _className );

      self.defineObservableProperty( "baseURL", {
        default: "https://localhost:4443"
      } );

      self._session = null; // we'll store a session object here
      self._api = null; // we'll use this to store information about the API

      self._xhrOptions = {
        sending: "application/json",
        receiving: "application/json"
      };

      self._discoverAPI = function _discoverAPI() {
        var deferred = Q.defer();
        if ( self._api !== null ) {
          deferred.resolve();
        }
        XHR.send( "GET", self.baseURL + "/", self._xhrOptions )
          .then( function ( r ) {
            // response contains everything we need to know about the API
            // STORE IT.
            self._api = r.body;
            deferred.resolve();
          } )
          .catch( function ( err ) {
            deferred.reject( err );
          } )
          .done();
        return deferred.promise;
      };

      self._sendAPIRequest = function _sendAPIRequest( action, data ) {
        var deferred = Q.defer();
        self._discoverAPI()
          .then( function () {
            var apiAction = self._api._links[ action ],
              options = ObjUtils.merge( self._xhrOptions ),
              promise = Q();
            options.data = data;
            // if the resource is secured, we also need to ask for a login
            if ( apiAction[ "secured-by" ] !== undefined ) {
              promise = promise.then( self.login.bind( self ) );
            }

            // we need to check if we need a CSRF token -- this is defined by a csrf property
            if ( apiAction.csrf !== undefined ) {
              promise = promise.then( self.getCSRF.bind( self, apiAction.csrf ) );
            }

            promise = promise.then( function ( r ) {
              var context = {},
                apiHeaders;
              // if we have a response, it's a CSRF token
              if ( r !== undefined ) {
                Hateoas.storeResponseToContext( r, context );
              }
              if ( ( apiHeaders = ObjUtils.valueForKeyPath( apiAction, "attachments.headers" ) ) !== undefined ) {
                options.headers = Hateoas.buildHeadersAttachment( apiHeaders, context );
              }
              return XHR.send( apiAction.verb, self.baseURL + apiAction.href, options );
            } );

            return promise;
          } )
          .then( function ( r ) {
            deferred.resolve( r );
          } )
          .catch( function ( err ) {
            deferred.reject( err );
          } )
          .done();
        return deferred.promise;
      };

      self.getCSRF = function getCSRF( csrfType ) {
        return self._discoverAPI()
          .then( function () {
            return self._sendAPIRequest( self._api[ "csrf-defs" ][ csrfType ][ "csrf-action" ][ 0 ] );
          } )
          .then( function ( r ) {
            console.log( "csrf", r );
            return r;
          } );
      };

      self.override( function init( baseURL ) {
        self.super( _className, "init" );
        self.baseURL = baseURL;
      } );

      self.override( function initWithOptions( options ) {
        self.init( _y.valueForKeyPath( options, "baseURL", self.baseURL ) );
      } );

      self._autoInit.apply( self, arguments );
      return self;
    }

    return API;

  } );
