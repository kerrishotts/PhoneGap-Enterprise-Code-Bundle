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
/*global define, device*/
define( [ "yasmf", "app/views/loginView", "app/views/dashboardView" ], function ( _y, LoginView, DashboardView ) {
  "use strict";
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
          }
          catch ( err ) {
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
  // APP.start will load the first view and kick us off
  APP.start = function () {
    // listen for online/offline network events
    document.addEventListener( "online", dispatchOnlineEvent, false );
    document.addEventListener( "offline", dispatchOfflineEvent, false );
    // start listening for resume/pause events
    if ( typeof device !== "undefined" && device.platform === "ios" ) {
      // if we want to persist localStorage, we need to use PKLocalStorage plugin
      window.PKLocalStorage.addPauseHandler( dispatchPauseEvent );
      window.PKLocalStorage.addResumeHandler( dispatchResumeEvent );
    } else {
      // add the proper pause/resume handlers
      document.addEventListener( "pause", dispatchPauseEvent, false );
      document.addEventListener( "resume", dispatchResumeEvent, false );
    }
    // sample pause/resume handlers
    function saveDataBeforePause() {
      localStorage.pauseInProgress = "true";
      localStorage.dataToSave = JSON.stringify( {
                                                  "name":    "Bob Smith",
                                                  "manager": "John Doe"
                                                } );
    }

    APP.addGlobalEventListener( "applicationPausing", saveDataBeforePause );

    function cleanUpAfterResume() {
      localStorage.removeItem( "pauseInProgress" );
      localStorage.removeItem( "dataToSave" );
    }

    APP.addGlobalEventListener( "applicationResuming", cleanUpAfterResume );
    // check if we have data to restore
    if ( typeof localStorage.pauseInProgress !== "undefined" ) {
      var savedData = JSON.parse( localStorage.dataToSave );
      alert( JSON.stringify( savedData ) );
      cleanUpAfterResume();
    }
    // find the rootContainer DOM element, make a new login view and show it
    var rootContainer = _y.ge( "rootContainer" ),
        dashboardView = new DashboardView( {} ),
        navigationController = new _y.UI.NavigationController( {
                                                                 rootView: dashboardView,
                                                                 parent:   rootContainer
                                                               } );
    APP.navigationController = navigationController;

    var loginView = new LoginView( {} );
    APP.loginView = loginView;
    _y.UI.globalNotifications.registerNotification( "APP:needsLogin" );
    _y.UI.globalNotifications.on( "APP:needsLogin", function () {
      var navigationController = new _y.UI.NavigationController( { rootView: loginView } );
      navigationController.presentModalController( _y.$id( "rootContainer" ) );
    } );
    // register routes
    var router = _y.Router;
    router.addURL( "/", "Home" ).addURL( "/login", "Login" )
      .addURL( "/task", "List of Tasks" ).addURL( "/task/:taskId", "View/Edit Task" )
      .addURL( "/task/:taskId/comment", "View comments" ).addURL( "/task/:taskId/comment/add", "Add comment" );
    router.listen();
    router.replace( "/", 1 );
  };
  return APP;
} );
