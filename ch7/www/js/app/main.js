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
/*global define, device, setTimeout*/
define( [ "yasmf", "app/lib/xhr", "Q", "Boxcar", "app/APIKeys" ], function( _y, XHR, Q,
  Boxcar, APIKeys ) {
  // define our app object
  var APP = {};
  /**
   * stores our global event listeners
   */
  var globalEventListeners = {};
  /**
   * Adds a listener for our global events
   * @param event {String} The event name to add (case-insensitive)
   * @param listener {Function} the listener; receives the name of the event
   */
  APP.addGlobalEventListener = function addGlobalEventListener( event, listener ) {
    var EVENT = event.toUpperCase();
    if ( typeof globalEventListeners[ EVENT ] === "undefined" ) {
      globalEventListeners[ EVENT ] = [];
    }
    globalEventListeners[ EVENT ].push( listener );
  };
  /**
   * Removes a listener (if previously added) from a global event
   * @param event {String} the event name (case-insensitive)
   * @param listener {Function} the listener to remove
   */
  APP.removeGlobalEventListener = function removeGlobalEventListener( event, listener ) {
    var EVENT = event.toUpperCase();
    var i = -1;
    if ( typeof globalEventListeners[ EVENT ] !== "undefined" ) {
      i = globalEventListeners[ EVENT ].indexOf( listener );
      if ( i > -1 ) {
        globalEventListeners[ EVENT ].splice( i, 1 );
      }
    }
  };
  /**
   * Dispatches a global event asynchronously unless sync is true.
   * @param event {String} the event name (case-insensitive)
   * @param [sync] {Boolean} if true, dispatch synchronously, otherwise async.
   */
  APP.dispatchGlobalEvent = function dispatchGlobalEvent( event, sync ) {
    var EVENT = event.toUpperCase();
    var doSynchronously = false;
    if ( typeof sync !== "undefined" ) {
      doSynchronously = sync;
    }
    if ( typeof globalEventListeners[ EVENT ] !== "undefined" ) {
      globalEventListeners[ EVENT ].forEach( function dispatchToListener( listener ) {
        if ( doSynchronously ) {
          try {
            listener( EVENT );
          } catch ( err ) {
            console.log( "dispatchGlobalEvent caught error: " + JSON.stringify( err ) );
          }
        } else {
          setTimeout( function asyncDispatch() {
            listener( EVENT );
          }, 0 );
        }
      } );
    }
  };
  /**
   * Dispatches a applicationPausing or applicationResuming event synchronously, based on appState
   * @param appState {String} Pausing or Resuming
   * @private
   */
  function dispatchStateEvent( appState ) {
    APP.dispatchGlobalEvent( "application" + appState, true );
    console.log( "Application " + appState.toUpperCase() );
  }
  /**
   * Dispatches the applicationPausing event synchronously
   */
  var dispatchPauseEvent = dispatchStateEvent.bind( null, "Pausing" );
  /**
   * Dispatches the applicationResuming event synchronously
   */
  var dispatchResumeEvent = dispatchStateEvent.bind( null, "Resuming" );
  /**
   * Dispatches a networkOnline or networkOffline event, based on status
   * @param status {String} Online or Offline
   * @private
   */
  function dispatchNetworkEvent( status ) {
    APP.dispatchGlobalEvent( "network" + status );
    console.log( "Network is now " + status.toUpperCase() );
  }
  /**
   * Dispatches a networkOnlineEvent
   */
  var dispatchOnlineEvent = dispatchNetworkEvent.bind( null, "Online" );
  /**
   * Dispatches a networkOfflineEvent
   */
  var dispatchOfflineEvent = dispatchNetworkEvent.bind( null, "Offline" );

  function notificationError( err ) {
    console.log( JSON.stringify( err ) );
    alert( JSON.stringify( err ) );
  }

  function notificationSuccess( msgToLog ) {
    console.log( msgToLog );
    alert( msgToLog );
  }

  function notificationReceived( data ) {
    console.log( JSON.stringify( data ) );
    alert( JSON.stringify( data ) );
    // indicate that we've seen the alert
    Boxcar.markAsReceived( {
      onsuccess: notificationSuccess.bind( undefined, "Notification marked as seen." ),
      onerror: notificationError,
      id: data.id
    } );
    Boxcar.resetBadge( {
      onsuccess: notificationSuccess.bind( undefined, "Badge reset." ),
      onerror: notificationError
    } );
  }

  function notificationClicked( data ) {
    alert( "not foreground" );
    console.log( JSON.stringify( data ) );
    alert( JSON.stringify( data ) );
    // indicate that we've seen the alert
    Boxcar.markAsReceived( {
      onsuccess: notificationSuccess.bind( undefined, "Notification marked as seen." ),
      onerror: notificationError,
      id: data.id
    } );
    Boxcar.resetBadge( {
      onsuccess: notificationSuccess.bind( undefined, "Badge reset." ),
      onerror: notificationError
    } );
  }
  // APP.start will load the first view and kick us off
  APP.start = function() {
    // listen for online/offline network events
    document.addEventListener( "online", dispatchOnlineEvent, false );
    document.addEventListener( "offline", dispatchOfflineEvent, false );
    // start listening for resume/pause events
    if ( typeof device !== "undefined" && device.platform === "iOS" ) {
      // if we want to persist localStorage, we need to use PKLocalStorage plugin
      window.PKLocalStorage.addPauseHandler( dispatchPauseEvent );
      window.PKLocalStorage.addResumeHandler( dispatchResumeEvent );
    } else {
      // add the proper pause/resume handlers
      document.addEventListener( "pause", dispatchPauseEvent, false );
      document.addEventListener( "resume", dispatchResumeEvent, false );
    }
    // boxcar initialization
    Boxcar.init( {
      server: "https://boxcar-api.io",
      richUrlBase: "https://pge-as.acmecorp.com",
      ios: APIKeys.ios,
      android: APIKeys.android
    } );
    // register the device
    Boxcar.registerDevice( {
      mode: "development",
      onsuccess: notificationSuccess.bind( undefined, "Device Registered" ),
      onerror: notificationError,
      onalert: notificationReceived,
      onnotificationclick: notificationClicked,
      udid: device.uuid,
      alias: [ device.platform, device.model, device.version ].join( ' ' ),
      tags: [ "_general", "BSMITH" ]
    } );
    // call to unregister... but not for now
    /*
	  Boxcar.unregisterDevice ({
		  onsuccess: notificationSuccess.bind( undefined, "Device unregistered" ),
		  onerror: notificationError
	  });
    */
  };
  return APP;
} );
