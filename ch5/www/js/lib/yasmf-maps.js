(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = window.Q;

},{}],2:[function(require,module,exports){
/**
 *
 * # YASMF-Next (Yet Another Simple Mobile Framework Next Gen)
 *
 * YASMF-Next is the successor to the YASMF framework. While that framework was useful
 * and usable even in a production environment, as my experience has grown, it became
 * necessary to re-architect the entire framework in order to provide a modern
 * mobile framework.
 *
 * YASMF-Next is the result. It's young, under active development, and not at all
 * compatible with YASMF v0.2. It uses all sorts of more modern technologies such as
 * SASS for CSS styling, AMD, etc.
 *
 * YASMF-Next is intended to be a simple and fast framework for mobile and desktop
 * devices. It provides several utility functions and also provides a UI framework.
 *
 * @module _y
 * @author Kerri Shotts
 * @version 0.4
 *
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
/*global module, require*/
"use strict";

/* UTIL */
var _y = require( "./yasmf/util/core" );
_y.datetime = require( "./yasmf/util/datetime" );
_y.filename = require( "./yasmf/util/filename" );
_y.misc = require( "./yasmf/util/misc" );
_y.device = require( "./yasmf/util/device" );
_y.BaseObject = require( "./yasmf/util/object" );
_y.FileManager = require( "./yasmf/util/fileManager" );
_y.h = require( "./yasmf/util/h" );
_y.Router = require( "./yasmf/util/router" );

/* UI */
_y.UI = require( "./yasmf/ui/core" );
_y.UI.event = require( "./yasmf/ui/event" );
_y.UI.ViewContainer = require( "./yasmf/ui/viewContainer" );
_y.UI.NavigationController = require( "./yasmf/ui/navigationController" );
_y.UI.SplitViewController = require( "./yasmf/ui/splitViewController" );
_y.UI.TabViewController = require( "./yasmf/ui/tabViewController" );
_y.UI.Alert = require( "./yasmf/ui/alert" );
_y.UI.Spinner = require( "./yasmf/ui/spinner" );
module.exports = _y;

},{"./yasmf/ui/alert":3,"./yasmf/ui/core":4,"./yasmf/ui/event":5,"./yasmf/ui/navigationController":6,"./yasmf/ui/spinner":7,"./yasmf/ui/splitViewController":8,"./yasmf/ui/tabViewController":9,"./yasmf/ui/viewContainer":10,"./yasmf/util/core":11,"./yasmf/util/datetime":12,"./yasmf/util/device":13,"./yasmf/util/fileManager":14,"./yasmf/util/filename":15,"./yasmf/util/h":16,"./yasmf/util/misc":17,"./yasmf/util/object":18,"./yasmf/util/router":19}],3:[function(require,module,exports){
/**
 *
 * Provides native-like alert methods, including prompts and messages.
 *
 * @module alert.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
var _y = require( "../util/core" ),
  theDevice = require( "../util/device" ),
  BaseObject = require( "../util/object" ),
  UI = require( "./core" ),
  Q = require( "../../q" ),
  event = require( "./event" ),
  h = require( "../util/h" );
"use strict";
var _className = "Alert";
var Alert = function () {
  var self = new BaseObject();
  self.subclass( _className );
  /*
   * # Notifications
   *
   * * `buttonTapped` indicates which button was tapped when the view is dismissing
   * * `dismissed` indicates that the alert was dismissed (by user or code)
   */
  self.registerNotification( "buttonTapped" );
  self.registerNotification( "dismissed" );
  /**
   * The title to show in the alert.
   * @property title
   * @type {String}
   */
  self._titleElement = null; // the corresponding DOM element
  self.setTitle = function ( theTitle ) {
    self._title = theTitle;
    if ( self._titleElement !== null ) {
      if ( typeof self._titleElement.textContent !== "undefined" ) {
        self._titleElement.textContent = theTitle;
      } else {
        self._titleElement.innerHTML = theTitle;
      }
    }
  };
  self.defineProperty( "title", {
    read:    true,
    write:   true,
    default: _y.T( "ALERT" )
  } );
  /**
   * The body of the alert. Leave blank if you don't need to show
   * anything more than the title.
   * @property text
   * @type {String}
   */
  self._textElement = null;
  self.setText = function ( theText ) {
    self._text = theText;
    if ( self._textElement !== null ) {
      if ( typeof theText !== "object" ) {
        if ( typeof self._textElement.textContent !== "undefined" ) {
          self._textElement.textContent = ( "" + theText ).replace( /\<br\w*\/\>/g, "\r\n" );
        } else {
          self._textElement.innerHTML = theText;
        }
      } else {
        h.renderTo( theText, self._textElement, 0 );
      }
    }
  };
  self.defineProperty( "text", {
    read:  true,
    write: true
  } );
  /**
   * The alert's buttons are specified in this property. The layout
   * is expected to be: `[ { title: title [, type: type] [, tag: tag] } [, {} ...] ]`
   *
   * Each button's type can be "normal", "bold", "destructive". The tag may be
   * null; if it is, it is assigned the button index. If a tag is specifed (common
   * for cancel buttons), that is the return value.
   * @property buttons
   * @type {Array}
   */
  self._buttons = [];
  self._buttonContainer = null;
  self.defineProperty( "wideButtons", {
    default: "auto"
  } );
  self.setButtons = function ( theButtons ) {
    function touchStart( e ) {
      if ( e.touches !== undefined ) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      } else {
        this.startX = e.clientX;
        this.startY = e.clientY;
      }
      this.moved = false;
    }

    function handleScrolling( e ) {
      var newX = ( e.touches !== undefined ) ? e.touches[0].clientX : e.clientX,
        newY = ( e.touches !== undefined ) ? e.touches[0].clientY : e.clientY,
        dX = Math.abs( this.startX - newX ),
        dY = Math.abs( this.startY - newY );
      console.log( dX, dY );
      if ( dX > 20 || dY > 20 ) {
        this.moved = true;
      }
    }

    function dismissWithIndex( idx ) {
      return function ( e ) {
        e.preventDefault();
        if ( this.moved ) {
          return;
        }
        self.dismiss( idx );
      };
    }

    var i;
    // clear out any previous buttons in the DOM
    if ( self._buttonContainer !== null ) {
      for ( i = 0; i < self._buttons.length; i++ ) {
        self._buttonContainer.removeChild( self._buttons[i].element );
      }
    }
    self._buttons = theButtons;
    // determine if we need wide buttons or not
    var wideButtons = false;
    if ( self.wideButtons === "auto" ) {
      wideButtons = !( ( self._buttons.length >= 2 ) && ( self._buttons.length <= 3 ) );
    } else {
      wideButtons = self.wideButtons;
    }
    if ( wideButtons ) {
      self._buttonContainer.classList.add( "wide" );
    }
    // add the buttons back to the DOM if we can
    if ( self._buttonContainer !== null ) {
      for ( i = 0; i < self._buttons.length; i++ ) {
        var e = document.createElement( "div" );
        var b = self._buttons[i];
        // if the tag is null, give it (i)
        if ( b.tag === null ) {
          b.tag = i;
        }
        // class is ui-alert-button normal|bold|destructive [wide]
        // wide buttons are for 1 button or 4+ buttons.
        e.className = "ui-alert-button " + b.type + " " + ( wideButtons ? "wide" : "" );
        // title
        e.innerHTML = b.title;
        if ( !wideButtons ) {
          // set the width of each button to fill out the alert equally
          // 3 buttons gets 33.333%; 2 gets 50%.
          e.style.width = "" + ( 100 / self._buttons.length ) + "%";
        }
        // listen for a touch
        if ( Hammer ) {
          Hammer( e ).on( "tap", dismissWithIndex( i ) );
        } else {
          event.addListener( e, "touchstart", touchStart );
          event.addListener( e, "touchmove", handleScrolling );
          event.addListener( e, "touchend", dismissWithIndex( i ) );
        }
        b.element = e;
        // add the button to the DOM
        self._buttonContainer.appendChild( b.element );
      }
    }
  };
  self.defineProperty( "buttons", {
    read:    true,
    write:   true,
    default: []
  } );
  // other DOM elements we need to construct the alert
  self._rootElement = null; // root element contains the container
  self._alertElement = null; // points to the alert itself
  self._vaElement = null; // points to the DIV used to vertically align us
  self._deferred = null; // stores a promise
  /**
   * If true, show() returns a promise.
   * @property usePromise
   * @type {boolean}
   */
  self.defineProperty( "usePromise", {
    read:    true,
    write:   false,
    default: false
  } );
  /**
   * Indicates if the alert is veisible.
   * @property visible
   * @type {Boolean}
   */
  self.defineProperty( "visible", {
    read:    true,
    write:   false,
    default: false
  } );
  /**
   * Creates the DOM elements for an Alert. Assumes the styles are
   * already in the style sheet.
   * @method _createElements
   * @private
   */
  self._createElements = function () {
    self._rootElement = document.createElement( "div" );
    self._rootElement.className = "ui-alert-container";
    self._vaElement = document.createElement( "div" );
    self._vaElement.className = "ui-alert-vertical-align";
    self._alertElement = document.createElement( "div" );
    self._alertElement.className = "ui-alert";
    self._titleElement = document.createElement( "div" );
    self._titleElement.className = "ui-alert-title";
    self._textElement = document.createElement( "div" );
    self._textElement.className = "ui-alert-text";
    self._buttonContainer = document.createElement( "div" );
    self._buttonContainer.className = "ui-alert-button-container";
    self._alertElement.appendChild( self._titleElement );
    self._alertElement.appendChild( self._textElement );
    self._alertElement.appendChild( self._buttonContainer );
    self._vaElement.appendChild( self._alertElement );
    self._rootElement.appendChild( self._vaElement );
  };
  /**
   * Called when the back button is pressed. Dismisses with a -1 index. Effectively a Cancel.
   * @method backButtonPressed
   */
  self.backButtonPressed = function () {
    self.dismiss( -1 );
  };
  /**
   * Hide dismisses the alert and dismisses it with -1. Effectively a Cancel.
   * @method hide
   * @return {[type]} [description]
   */
  self.hide = function () {
    self.dismiss( -1 );
  };
  /**
   * Shows an alert.
   * @method show
   * @return {Promise} a promise if usePromise = true
   */
  self.show = function () {
    if ( self.visible ) {
      if ( self.usePromise && self._deferred !== null ) {
        return self._deferred;
      }
      return void 0; // can't do anything more.
    }
    // listen for the back button
    UI.backButton.addListenerForNotification( "backButtonPressed", self.backButtonPressed );
    // add to the body
    document.body.appendChild( self._rootElement );
    // animate in
    UI.styleElement( self._alertElement, "transform", "scale3d(2.00, 2.00,1)" );
    setTimeout( function () {
      self._rootElement.style.opacity = "1";
      self._alertElement.style.opacity = "1";
      UI.styleElement( self._alertElement, "transform", "scale3d(1.00, 1.00,1)" )
    }, 10 );
    self._visible = true;
    if ( self.usePromise ) {
      self._deferred = Q.defer();
      return self._deferred.promise;
    }
  };
  /**
   * Dismisses the alert with the sepcified button index
   *
   * @method dismiss
   * @param {Number} idx
   */
  self.dismiss = function ( idx ) {
    if ( !self.visible ) {
      return;
    }
    // drop the listener for the back button
    UI.backButton.removeListenerForNotification( "backButtonPressed", self.backButtonPressed );
    // remove from the body
    setTimeout( function () {
      self._rootElement.style.opacity = "0";
      UI.styleElement( self._alertElement, "transform", "scale3d(0.75, 0.75,1)" )
    }, 10 );
    setTimeout( function () {
      document.body.removeChild( self._rootElement );
    }, 610 );
    // get notification tag
    var tag = -1;
    if ( ( idx > -1 ) && ( idx < self._buttons.length ) ) {
      tag = self._buttons[idx].tag;
    }
    // send our notifications as appropriate
    self.notify( "dismissed" );
    self.notify( "buttonTapped", [tag] );
    self._visible = false;
    // and resolve/reject the promise
    if ( self.usePromise ) {
      if ( tag > -1 ) {
        self._deferred.resolve( tag );
      } else {
        self._deferred.reject( new Error( tag ) );
      }
    }
  };
  /**
   * Initializes the Alert and calls _createElements.
   * @method init
   * @return {Object}
   */
  self.override( function init() {
    self.super( _className, "init" );
    self._createElements();
    return self;
  } );
  /**
   * Initializes the Alert. Options includes title, text, buttons, and promise.
   * @method overrideSuper
   * @return {Object}
   */
  self.override( function initWithOptions( options ) {
    self.init();
    if ( typeof options !== "undefined" ) {
      if ( typeof options.title !== "undefined" ) {
        self.title = options.title;
      }
      if ( typeof options.text !== "undefined" ) {
        self.text = options.text;
      }
      if ( typeof options.wideButtons !== "undefined" ) {
        self.wideButtons = options.wideButtons
      }
      if ( typeof options.buttons !== "undefined" ) {
        self.buttons = options.buttons;
      }
      if ( typeof options.promise !== "undefined" ) {
        self._usePromise = options.promise;
      }
    }
    return self;
  } );
  /**
   * Clean up after ourselves.
   * @method destroy
   */
  self.overrideSuper( self.class, "destroy", self.destroy );
  self.destroy = function destroy() {
    if ( self.visible ) {
      self.hide();
      setTimeout( destroy, 600 ); // we won't destroy immediately.
      return;
    }
    self._rootElement = null;
    self._vaElement = null;
    self._alertElement = null;
    self._titleElement = null;
    self._textElement = null;
    self._buttonContainer = null;
    self.super( _className, "destroy" );
  };
  // handle auto-init
  self._autoInit.apply( self, arguments );
  return self;
};
/**
 * Creates a button suitable for an Alert
 * @method button
 * @param  {String} title   The title of the button
 * @param  {Object} options The additional options: type and tag
 * @return {Object}         A button
 */
Alert.button = function ( title, options ) {
  var button = {};
  button.title = title;
  button.type = "normal"; // normal, bold, destructive
  button.tag = null; // assign for a specific tag
  button.enabled = true; // false = disabled.
  button.element = null; // attached DOM element
  if ( typeof options !== "undefined" ) {
    if ( typeof options.type !== "undefined" ) {
      button.type = options.type;
    }
    if ( typeof options.tag !== "undefined" ) {
      button.tag = options.tag;
    }
    if ( typeof options.enabled !== "undefined" ) {
      button.enabled = options.enabled;
    }
  }
  return button;
};
/**
 * Creates an OK-style Alert. It only has an OK button.
 * @method OK
 * @param {Object} options Specify the title, text, and promise options if desired.
 */
Alert.OK = function ( options ) {
  var anOK = new Alert();
  var anOKOptions = {
    title:   _y.T( "OK" ),
    text:    "",
    buttons: [Alert.button( _y.T( "OK" ), {
      type: "bold"
    } )]
  };
  if ( typeof options !== "undefined" ) {
    if ( typeof options.title !== "undefined" ) {
      anOKOptions.title = options.title;
    }
    if ( typeof options.text !== "undefined" ) {
      anOKOptions.text = options.text;
    }
    if ( typeof options.promise !== "undefined" ) {
      anOKOptions.promise = options.promise;
    }
  }
  anOK.initWithOptions( anOKOptions );
  return anOK;
};
/**
 * Creates an OK/Cancel-style Alert. It only has an OK and CANCEL button.
 * @method Confirm
 * @param {Object} options Specify the title, text, and promise options if desired.
 */
Alert.Confirm = function ( options ) {
  var aConfirmation = new Alert();
  var confirmationOptions = {
    title:   _y.T( "Confirm" ),
    text:    "",
    buttons: [Alert.button( _y.T( "OK" ) ),
              Alert.button( _y.T( "Cancel" ), {
                type: "bold",
                tag:  -1
              } )
    ]
  };
  if ( typeof options !== "undefined" ) {
    if ( typeof options.title !== "undefined" ) {
      confirmationOptions.title = options.title;
    }
    if ( typeof options.text !== "undefined" ) {
      confirmationOptions.text = options.text;
    }
    if ( typeof options.promise !== "undefined" ) {
      confirmationOptions.promise = options.promise;
    }
  }
  aConfirmation.initWithOptions( confirmationOptions );
  return aConfirmation;
};
module.exports = Alert;

},{"../../q":1,"../util/core":11,"../util/device":13,"../util/h":16,"../util/object":18,"./core":4,"./event":5}],4:[function(require,module,exports){
/**
 *
 * Core of YASMF-UI; defines the version and basic UI  convenience methods.
 *
 * @module core.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var theDevice = require( "../util/device" );
var BaseObject = require( "../util/object" );
var prefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ""],
  jsPrefixes = ["webkit", "moz", "ms", "o", ""],
  /**
   * @method Animation
   * @constructor
   * @param {Array} els             elements to animate
   * @param {number} timing         seconds to animate over (0.3 default)
   * @param {string} timingFunction timing function (ease-in-out default)
   * @return {Animation}
   */
  Animation = function ( els, timing, timingFunction ) {
    this._el = document.createElement( "div" );
    this._els = els;
    this._animations = [];
    this._transitions = [];
    this.timingFunction = "ease-in-out";
    this.timing = 0.3;
    this._maxTiming = 0;
    if ( typeof timing !== "undefined" ) {
      this.timing = timing;
    }
    if ( typeof timingFunction !== "undefined" ) {
      this.timingFunction = timingFunction;
    }
  };
/**
 * @method _pushAnimation
 * @private
 * @param {string} property         style property
 * @param {string} value            value to assign to property
 * @param {number} timing           seconds for animation (optional)
 * @param {string} timingFunction   timing function (optional)
 * @return {Animation}              self, for chaining
 */
function _pushAnimation( property, value, timing, timingFunction ) {
  var newProp, newValue, prefix, jsPrefix, newJsProp;
  for ( var i = 0, l = prefixes.length; i < l; i++ ) {
    prefix = prefixes[i];
    jsPrefix = jsPrefixes[i];
    newProp = prefix + property;
    if ( jsPrefix !== "" ) {
      newJsProp = jsPrefix + property.substr( 0, 1 ).toUpperCase() + property.substr( 1 );
    } else {
      newJsProp = property;
    }
    newValue = value.replace( "{-}", prefix );
    if ( typeof this._el.style[newJsProp] !== "undefined" ) {
      this._animations.push( [newProp, newValue] );
      this._transitions.push( [newProp, ( typeof timing !== "undefined" ? timing : this.timing ) + "s", ( typeof timingFunction !==
                                                                                                          "undefined" ? timingFunction : this.timingFunction )] );
    }
    this._maxTiming = Math.max( this._maxTiming, ( typeof timing !== "undefined" ? timing : this.timing ) );
  }
  return this;
}
/**
 * Set the default timing function for following animations
 * @method setTimingFunction
 * @param {string} timingFunction      the timing function to assign, like "ease-in-out"
 * @return {Animation}                 self
 */
Animation.prototype.setTimingFunction = function setTimingFunction( timingFunction ) {
  this.timingFunction = timingFunction;
  return this;
};
/**
 * Set the timing for the following animations, in seconds
 * @method setTiming
 * @param {number} timing              the length of the animation, in seconds
 * @return {Animation}                 self
 */
Animation.prototype.setTiming = function setTiming( timing ) {
  this.timing = timing;
  return this;
};
/**
 * Move the element to the specific position (using left, top)
 *
 * @method move
 * @param {string} x           the x position (px or %)
 * @param {string} y           the y position (px or %)
 * @return {Animation} self
 */
Animation.prototype.move = function ( x, y ) {
  _pushAnimation.call( this, "left", x );
  return _pushAnimation.call( this, "top", y );
};
/**
 * Resize the element (using width, height)
 *
 * @method resize
 * @param {string} w           the width (px or %)
 * @param {string} h           the height (px or %)
 * @return {Animation} self
 */
Animation.prototype.resize = function ( w, h ) {
  _pushAnimation.call( this, "width", w );
  return _pushAnimation.call( this, "height", h );
};
/**
 * Change opacity
 * @method opacity
 * @param {string} o           opacity
 * @return {Animation} self
 */
Animation.prototype.opacity = function ( o ) {
  return _pushAnimation.call( this, "opacity", o );
};
/**
 * Transform the element using translate x, y
 * @method translate
 * @param {string} x       x position (px or %)
 * @param {string} y       y position (px or %)
 * @return {Animation} self
 */
Animation.prototype.translate = function ( x, y ) {
  return _pushAnimation.call( this, "transform", ["translate(", [x, y].join( ", " ), ")"].join( "" ) );
};
/**
 * Transform the element using translate3d x, y, z
 * @method translate3d
 * @param {string} x       x position (px or %)
 * @param {string} y       y position (px or %)
 * @param {string} z       z position (px or %)
 * @return {Animation} self
 */
Animation.prototype.translate3d = function ( x, y, z ) {
  return _pushAnimation.call( this, "transform", ["translate3d(", [x, y, z].join( ", " ), ")"].join( "" ) );
};
/**
 * Transform the element using scale
 * @method scale
 * @param {string} p       percent (0.00-1.00)
 * @return {Animation} self
 */
Animation.prototype.scale = function ( p ) {
  return _pushAnimation.call( this, "transform", ["scale(", p, ")"].join( "" ) );
};
/**
 * Transform the element using scale
 * @method rotate
 * @param {string} d       degrees
 * @return {Animation} self
 */
Animation.prototype.rotate = function ( d ) {
  return _pushAnimation.call( this, "transform", ["rotate(", d, "deg)"].join( "" ) );
};
/**
 * end the animation definition and trigger the sequence. If a callback method
 * is supplied, it is called when the animation is over
 * @method endAnimation
 * @alias then
 * @param {function} fn       function to call when animation is completed;
 *                            it is bound to the Animation method so that
 *                            further animations can be triggered.
 * @return {Animation} self
 */
Animation.prototype.endAnimation = function endAnimation( fn ) {
  // create the list of transitions we need to put on the elements
  var transition = this._transitions.map( function ( t ) {
      return t.join( " " );
    } ).join( ", " ),
    that = this;
  // for each element, assign this list of transitions
  that._els.forEach( function initializeEl( el ) {
    var i, l, prefixedTransition;
    for ( i = 0, l = prefixes.length; i < l; i++ ) {
      prefixedTransition = prefixes[i] + "transition";
      el.style.setProperty( prefixedTransition, transition );
    }
  } );
  // wait a few ms to let the DOM settle, and then start the animations
  setTimeout( function startAnimations() {
    var i, l, prop, value;
    // for each element, assign the desired property and value to the element
    that._els.forEach( function animateEl( el ) {
      for ( i = 0, l = that._animations.length; i < l; i++ ) {
        prop = that._animations[i][0];
        value = that._animations[i][1];
        el.style.setProperty( prop, value );
      }
    } );
    // when the animation is complete, remove the transition property from
    // the elements and call the callback function (if specified)
    setTimeout( function afterAnimationCallback() {
      var prefixedTransition;
      that._animations = [];
      that._transitions = [];
      that._els.forEach( function animateEl( el ) {
        for ( var i = 0, l = prefixes.length; i < l; i++ ) {
          prefixedTransition = prefixes[i] + "transition";
          el.style.setProperty( prefixedTransition, "" );
        }
      } );
      if ( typeof fn === "function" ) {
        fn.call( that );
      }
    }, that._maxTiming * 1000 );
  }, 50 );
  return this;
};
Animation.prototype.then = Animation.prototype.endAnimation;
var UI = {};
/**
 * Version of the UI Namespace
 * @property version
 * @type Object
 **/
UI.version = "0.5.100";
/**
 * Styles the element with the given style and value. Adds in the browser
 * prefixes to make it easier. Also available as `$s` on nodes.
 *
 * @method styleElement
 * @alias $s
 * @param  {Node} theElement
 * @param  {CssStyle} theStyle   Don't camelCase these, use dashes as in regular styles
 * @param  {value} theValue
 * @returns {void}
 */
UI.styleElement = function ( theElement, theStyle, theValue ) {
  if ( typeof theElement !== "object" ) {
    if ( !( theElement instanceof Node ) ) {
      theValue = theStyle;
      theStyle = theElement;
      theElement = this;
    }
  }
  for ( var i = 0; i < prefixes.length; i++ ) {
    var thePrefix = prefixes[i],
      theNewStyle = thePrefix + theStyle,
      theNewValue = theValue.replace( "%PREFIX%", thePrefix ).replace( "{-}", thePrefix );
    theElement.style.setProperty( theNewStyle, theNewValue );
  }
};
/**
 * Style the list of elements with the style and value using `styleElement`
 * @method styleElements
 * @param  {Array}  theElements
 * @param  {CssStyle} theStyle
 * @param {value} theValue
 * @returns {void}
 */
UI.styleElements = function ( theElements, theStyle, theValue ) {
  var i;
  for ( i = 0; i < theElements.length; i++ ) {
    UI.styleElement( theElements[i], theStyle, theValue );
  }
};
/**
 * Begin an animation definition and apply it to the specific
 * elements defined by selector. If parent is supplied, the selector
 * is relative to the parent, otherwise it is relative to document
 * @method beginAnimation
 * @param {string|Array|Node} selector      If a string, animation applies to all
 *                                          items that match the selector. If an
 *                                          Array, animation applies to all nodes
 *                                          in the array. If a node, the animation
 *                                          applies only to the node.
 * @param {Node} parent                     Optional; if provided, selector is
 *                                          relative to this node
 * @return {Animation}                      Animation object
 */
UI.beginAnimation = function ( selector, parent ) {
  var els = [];
  if ( typeof selector === "string" ) {
    if ( typeof parent === "undefined" ) {
      parent = document;
    }
    els = els.concat( Array.prototype.splice.call( parent.querySelectorAll( selector ), 0 ) );
  }
  if ( typeof selector === "object" && selector instanceof Array ) {
    els = els.concat( selector );
  }
  if ( typeof selector === "object" && selector instanceof Node ) {
    els = els.concat( [selector] );
  }
  return new Animation( els );
};
/**
 *
 * Converts a color object to an rgba(r,g,b,a) string, suitable for applying to
 * any number of CSS styles. If the color's alpha is zero, the return value is
 * "transparent". If the color is null, the return value is "inherit".
 *
 * @method colorToRGBA
 * @static
 * @param {color} theColor - theColor to convert.
 * @returns {string} a CSS value suitable for color properties
 */
UI.colorToRGBA = function ( theColor ) {
  if ( !theColor ) {
    return "inherit";
  }
  //noinspection JSUnresolvedVariable
  if ( theColor.alpha !== 0 ) {
    //noinspection JSUnresolvedVariable
    return "rgba(" + theColor.red + "," + theColor.green + "," + theColor.blue + "," + theColor.alpha + ")";
  } else {
    return "transparent";
  }
};
/**
 * @typedef {{red: Number, green: Number, blue: Number, alpha: Number}} color
 */
/**
 *
 * Creates a color object of the form `{red:r, green:g, blue:b, alpha:a}`.
 *
 * @method makeColor
 * @static
 * @param {Number} r - red component (0-255)
 * @param {Number} g - green component (0-255)
 * @param {Number} b - blue component (0-255)
 * @param {Number} a - alpha component (0.0-1.0)
 * @returns {color}
 *
 */
UI.makeColor = function ( r, g, b, a ) {
  return {
    red:   r,
    green: g,
    blue:  b,
    alpha: a
  };
};
/**
 *
 * Copies a color and returns it suitable for modification. You should copy
 * colors prior to modification, otherwise you risk modifying the original.
 *
 * @method copyColor
 * @static
 * @param {color} theColor - the color to be duplicated
 * @returns {color} a color ready for changes
 *
 */
UI.copyColor = function ( theColor ) {
  //noinspection JSUnresolvedVariable
  return UI.makeColor( theColor.red, theColor.green, theColor.blue, theColor.alpha );
};
/**
 * UI.COLOR
 * @namespace UI
 * @class COLOR
 */
UI.COLOR = UI.COLOR || {};
/** @static
 * @method blackColor
 * @returns {color} a black color.
 */
UI.COLOR.blackColor = function () {
  return UI.makeColor( 0, 0, 0, 1.0 );
};
/** @static
 * @method darkGrayColor
 * @returns {color} a dark gray color.
 */
UI.COLOR.darkGrayColor = function () {
  return UI.makeColor( 85, 85, 85, 1.0 );
};
/** @static
 * @method GrayColor
 * @returns {color} a gray color.
 */
UI.COLOR.GrayColor = function () {
  return UI.makeColor( 127, 127, 127, 1.0 );
};
/** @static
 * @method lightGrayColor
 * @returns {color} a light gray color.
 */
UI.COLOR.lightGrayColor = function () {
  return UI.makeColor( 170, 170, 170, 1.0 );
};
/** @static
 * @method whiteColor
 * @returns {color} a white color.
 */
UI.COLOR.whiteColor = function () {
  return UI.makeColor( 255, 255, 255, 1.0 );
};
/** @static
 * @method blueColor
 * @returns {color} a blue color.
 */
UI.COLOR.blueColor = function () {
  return UI.makeColor( 0, 0, 255, 1.0 );
};
/** @static
 * @method greenColor
 * @returns {color} a green color.
 */
UI.COLOR.greenColor = function () {
  return UI.makeColor( 0, 255, 0, 1.0 );
};
/** @static
 * @method redColor
 * @returns {color} a red color.
 */
UI.COLOR.redColor = function () {
  return UI.makeColor( 255, 0, 0, 1.0 );
};
/** @static
 * @method cyanColor
 * @returns {color} a cyan color.
 */
UI.COLOR.cyanColor = function () {
  return UI.makeColor( 0, 255, 255, 1.0 );
};
/** @static
 * @method yellowColor
 * @returns {color} a yellow color.
 */
UI.COLOR.yellowColor = function () {
  return UI.makeColor( 255, 255, 0, 1.0 );
};
/** @static
 * @method magentaColor
 * @returns {color} a magenta color.
 */
UI.COLOR.magentaColor = function () {
  return UI.makeColor( 255, 0, 255, 1.0 );
};
/** @static
 * @method orangeColor
 * @returns {color} a orange color.
 */
UI.COLOR.orangeColor = function () {
  return UI.makeColor( 255, 127, 0, 1.0 );
};
/** @static
 * @method purpleColor
 * @returns {color} a purple color.
 */
UI.COLOR.purpleColor = function () {
  return UI.makeColor( 127, 0, 127, 1.0 );
};
/** @static
 * @method brownColor
 * @returns {color} a brown color.
 */
UI.COLOR.brownColor = function () {
  return UI.makeColor( 153, 102, 51, 1.0 );
};
/** @static
 * @method lightTextColor
 * @returns {color} a light text color suitable for display on dark backgrounds.
 */
UI.COLOR.lightTextColor = function () {
  return UI.makeColor( 240, 240, 240, 1.0 );
};
/** @static
 * @method darkTextColor
 * @returns {color} a dark text color suitable for display on light backgrounds.
 */
UI.COLOR.darkTextColor = function () {
  return UI.makeColor( 15, 15, 15, 1.0 );
};
/** @static
 * @method clearColor
 * @returns {color} a transparent color.
 */
UI.COLOR.clearColor = function () {
  return UI.makeColor( 0, 0, 0, 0.0 );
};
/**
 * Manages the root element
 *
 * @property _rootContainer
 * @private
 * @static
 * @type Node
 */
UI._rootContainer = null;
/**
 * Creates the root element that contains the view hierarchy
 *
 * @method _createRootContainer
 * @static
 * @protected
 */
UI._createRootContainer = function () {
  UI._rootContainer = document.createElement( "div" );
  UI._rootContainer.className = "ui-container";
  UI._rootContainer.id = "rootContainer";
  document.body.appendChild( UI._rootContainer );
};
/**
 * Manages the root view (topmost)
 *
 * @property _rootView
 * @private
 * @static
 * @type ViewContainer
 * @default null
 */
UI._rootView = null;
/**
 * Assigns a view to be the top view in the hierarchy
 *
 * @method setRootView
 * @static
 * @param {ViewContainer} theView
 */
UI.setRootView = function ( theView ) {
  if ( UI._rootContainer === null ) {
    UI._createRootContainer();
  }
  if ( UI._rootView !== null ) {
    UI.removeRootView();
  }
  UI._rootView = theView;
  UI._rootView.parentElement = UI._rootContainer;
};
/**
 * Removes a view from the root view
 *
 * @method removeRootView
 * @static
 */
UI.removeRootView = function () {
  if ( UI._rootView !== null ) {
    UI._rootView.parentElement = null;
  }
  UI._rootView = null;
};
/**
 *
 * Returns the root view
 *
 * @method getRootView
 * @static
 * @returns {ViewContainer}
 */
UI.getRootView = function () {
  return UI._rootView;
};
/**
 * The root view
 * @property rootView
 * @static
 * @type Node
 */
Object.defineProperty( UI, "rootView", {
  get: UI.getRootView,
  set: UI.setRootView
} );
/**
 * Private back button handler class
 * @private
 * @class _BackButtonHandler
 * @returns {BaseObject}
 * @private
 */
UI._BackButtonHandler = function () {
  var self = new BaseObject();
  self.subclass( "BackButtonHandler" );
  self.registerNotification( "backButtonPressed" );
  self._lastBackButtonTime = -1;
  self.handleBackButton = function () {
    var currentTime = ( new Date() ).getTime();
    if ( self._lastBackButtonTime < currentTime - 1000 ) {
      self._lastBackButtonTime = ( new Date() ).getTime();
      self.notifyMostRecent( "backButtonPressed" );
    }
  };
  document.addEventListener( "backbutton", self.handleBackButton, false );
  return self;
};
/**
 *
 * Global Back Button Handler Object
 *
 * Register a listener for the backButtonPressed notification in order
 * to be notified when the back button is pressed.
 *
 * Applies only to a physical back button, not one on the screen.
 *
 * @property backButton
 * @static
 * @final
 * @type _BackButtonHandler
 */
UI.backButton = new UI._BackButtonHandler();
/**
 * Private orientation handler class
 * @class _OrientationHandler
 * @returns {BaseObject}
 * @private
 */
UI._OrientationHandler = function () {
  var self = new BaseObject();
  self.subclass( "OrientationHandler" );
  self.registerNotification( "orientationChanged" );
  self.handleOrientationChange = function () {
    var curOrientation,
      curFormFactor,
      curScale,
      curConvenience,
      curDevice = theDevice.platform(),
      OSLevel;
    switch ( curDevice ) {
      case "mac":
        try {
          OSLevel = "" + parseFloat( ( navigator.userAgent.match( /OS X ([0-9_]+)/ )[1] ).replace( /_/g, "." ) );
        }
        catch ( e ) {}
        if ( OSLevel !== undefined ) {
          curDevice += " mac" + ( OSLevel.length < 5 ? "C" : "M" );
        }
        break;
      case "ios":
        try {
          OSLevel = navigator.userAgent.match( /OS ([0-9]+)/ )[1];
        }
        catch ( e ) {}
        if ( OSLevel !== undefined ) {
          curDevice += " ios" + OSLevel + " ios" + ( OSLevel < 7 ? "C" : "M" );
        }
        break;
      case "android":
        try {
          OSLevel = parseFloat( navigator.userAgent.match( /Android ([0-9.]+)/ )[1] );
        }
        catch ( e ) {}
        if ( OSLevel !== undefined ) {
          curDevice += " android" + ( "" + OSLevel ).replace( /\./g, "-" ) + " android" + ( ( OSLevel < 4.4 ) ? "C" : ( (
                                                                                                                        OSLevel >= 5 ) ? "M" : "K" ) )
        }
        break;
      default:
    }
    /*
     if ( curDevice === "ios" ) {
     if ( navigator.userAgent.indexOf( "OS 9" ) > -1 ) {
     curDevice += " ios9 iosM";
     }
     if ( navigator.userAgent.indexOf( "OS 8" ) > -1 ) {
     curDevice += " ios8 iosM";
     }
     if ( navigator.userAgent.indexOf( "OS 7" ) > -1 ) {
     curDevice += " ios7 iosM";
     }
     if ( navigator.userAgent.indexOf( "OS 6" ) > -1 ) {
     curDevice += " ios6 iosC";
     }
     if ( navigator.userAgent.indexOf( "OS 5" ) > -1 ) {
     curDevice += " ios5 iosC";
     }
     } */
    curFormFactor = theDevice.formFactor();
    curOrientation = theDevice.isPortrait() ? "portrait" : "landscape";
    curScale = theDevice.isRetina() ? "hiDPI" : "loDPI";
    curScale += " scale" + window.devicePixelRatio + "x";
    curConvenience = "";
    if ( theDevice.iPad() ) {
      curConvenience = "ipad";
    }
    if ( theDevice.iPhone() ) {
      curConvenience = "iphone";
    }
    if ( theDevice.droidTablet() ) {
      curConvenience = "droid-tablet";
    }
    if ( theDevice.droidPhone() ) {
      curConvenience = "droid-phone";
    }
    if ( typeof document.body !== "undefined" && document.body !== null ) {
      document.body.setAttribute( "class", [curDevice, curFormFactor, curOrientation, curScale, curConvenience].join(
        " " ) );
    }
    self.notify( "orientationChanged" );
  };
  window.addEventListener( "orientationchange", self.handleOrientationChange, false );
  if ( typeof document.body !== "undefined" && document.body !== null ) {
    self.handleOrientationChange();
  } else {
    setTimeout( self.handleOrientationChange, 0 );
  }
  return self;
};
/**
 *
 * Global Orientation Handler Object
 *
 * Register a listener for the orientationChanged notification in order
 * to be notified when the orientation changes.
 *
 * @property orientationHandler
 * @static
 * @final
 * @type _OrientationHandler
 */
UI.orientationHandler = new UI._OrientationHandler();
/**
 *
 * Global Notification Object -- used for sending and receiving global notifications
 *
 * @property globalNotifications
 * @static
 * @final
 * @type BaseObject
 */
UI.globalNotifications = new BaseObject();
/**
 * Create the root container
 */
if ( typeof document.body !== "undefined" && document.body !== null ) {
  UI._createRootContainer();
} else {
  setTimeout( UI._createRootContainer, 0 );
}
// helper methods on Nodes
Node.prototype.$s = UI.styleElement;
module.exports = UI;

},{"../util/device":13,"../util/object":18}],5:[function(require,module,exports){
/**
 *
 * Basic cross-platform mobile Event Handling for YASMF
 *
 * @module events.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global define*/
"use strict";
var theDevice = require( "../util/device" );
/**
 * Translates touch events to mouse events if the platform doesn't support
 * touch events. Leaves other events unaffected.
 *
 * @method _translateEvent
 * @static
 * @private
 * @param {String} theEvent - the event name to translate
 */
var _translateEvent = function ( theEvent ) {
  var theTranslatedEvent = theEvent;
  if ( !theTranslatedEvent ) {
    return theTranslatedEvent;
  }
  var platform = theDevice.platform();
  var nonTouchPlatform = ( platform === "wince" || platform === "unknown" || platform === "mac" || platform === "windows" ||
                           platform === "linux" );
  if ( nonTouchPlatform && theTranslatedEvent.toLowerCase().indexOf( "touch" ) > -1 ) {
    theTranslatedEvent = theTranslatedEvent.replace( "touch", "mouse" );
    theTranslatedEvent = theTranslatedEvent.replace( "start", "down" );
    theTranslatedEvent = theTranslatedEvent.replace( "end", "up" );
  }
  return theTranslatedEvent;
};
var event = {};
/**
 * @typedef {{_originalEvent: Event, touches: Array, x: number, y: number, avgX: number, avgY: number, element: (EventTarget|Object), target: Node}} NormalizedEvent
 */
/**
 *
 * Creates an event object from a DOM event.
 *
 * The event returned contains all the touches from the DOM event in an array of {x,y} objects.
 * The event also contains the first touch as x,y properties and the average of all touches
 * as avgX,avgY. If no touches are in the event, these values will be -1.
 *
 * @method makeEvent
 * @static
 * @param {Node} that - `this`; what fires the event
 * @param {Event} e - the DOM event
 * @returns {NormalizedEvent}
 *
 */
event.convert = function ( that, e ) {
  if ( typeof e === "undefined" ) {
    e = window.event;
  }
  var newEvent = {
    _originalEvent: e,
    touches:        [],
    x:              -1,
    y:              -1,
    avgX:           -1,
    avgY:           -1,
    element:        e.target || e.srcElement,
    target:         that
  };
  if ( e.touches ) {
    var avgXTotal = 0;
    var avgYTotal = 0;
    for ( var i = 0; i < e.touches.length; i++ ) {
      newEvent.touches.push( {
                               x: e.touches[i].clientX,
                               y: e.touches[i].clientY
                             } );
      avgXTotal += e.touches[i].clientX;
      avgYTotal += e.touches[i].clientY;
      if ( i === 0 ) {
        newEvent.x = e.touches[i].clientX;
        newEvent.y = e.touches[i].clientY;
      }
    }
    if ( e.touches.length > 0 ) {
      newEvent.avgX = avgXTotal / e.touches.length;
      newEvent.avgY = avgYTotal / e.touches.length;
    }
  } else {
    if ( event.pageX ) {
      newEvent.touches.push( {
                               x: e.pageX,
                               y: e.pageY
                             } );
      newEvent.x = e.pageX;
      newEvent.y = e.pageY;
      newEvent.avgX = e.pageX;
      newEvent.avgY = e.pageY;
    }
  }
  return newEvent;
};
/**
 *
 * Cancels an event that's been created using {@link event.convert}.
 *
 * @method cancelEvent
 * @static
 * @param {NormalizedEvent} e - the event to cancel
 *
 */
event.cancel = function ( e ) {
  if ( e._originalEvent.cancelBubble ) {
    e._originalEvent.cancelBubble();
  }
  if ( e._originalEvent.stopPropagation ) {
    e._originalEvent.stopPropagation();
  }
  if ( e._originalEvent.preventDefault ) {
    e._originalEvent.preventDefault();
  } else {
    e._originalEvent.returnValue = false;
  }
};
/**
 * Adds a touch listener to theElement, converting touch events for WP7.
 *
 * @method addEventListener
 * @param {Node} theElement  the element to attach the event to
 * @param {String} theEvent  the event to handle
 * @param {Function} theFunction  the function to call when the event is fired
 *
 */
event.addListener = function ( theElement, theEvent, theFunction ) {
  var theTranslatedEvent = _translateEvent( theEvent.toLowerCase() );
  theElement.addEventListener( theTranslatedEvent, theFunction, false );
};
/**
 * Removes a touch listener added by addTouchListener
 *
 * @method removeEventListener
 * @param {Node} theElement  the element to remove an event from
 * @param {String} theEvent  the event to remove
 * @param {Function} theFunction  the function to remove
 *
 */
event.removeListener = function ( theElement, theEvent, theFunction ) {
  var theTranslatedEvent = _translateEvent( theEvent.toLowerCase() );
  theElement.removeEventListener( theTranslatedEvent, theFunction );
};
module.exports = event;

},{"../util/device":13}],6:[function(require,module,exports){
/**
 *
 * Navigation Controllers provide basic support for view stack management (as in push, pop)
 *
 * @module navigationController.js
 * @author Kerri Shotts
 * @version 0.5
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var UI = require( "./core" ),
  ViewContainer = require( "./viewContainer" ),
  UTIL = require( "../util/core" );
var _className = "NavigationController",
  NavigationController = function () {
    var self = new ViewContainer();
    self.subclass( _className );
    // # Notifications
    //
    // * `viewPushed` is fired when a view is pushed onto the view stack. The view pushed is passed as a parameter.
    // * `viewPopped` is fired when a view is popped off the view stack. The view popped is passed as a parameter.
    //
    self.registerNotification( "viewPushed" );
    self.registerNotification( "viewPopped" );
    /**
     * The array of views that this navigation controller manages.
     * @property subviews
     * @type {Array}
     */
    self.defineProperty( "subviews", {
      read:    true,
      write:   false,
      default: []
    } );
    /**
     * Indicates the current top view
     * @property topView
     * @type {Object}
     */
    self.getTopView = function () {
      if ( self._subviews.length > 0 ) {
        return self._subviews[self._subviews.length - 1];
      } else {
        return null;
      }
    };
    self.defineProperty( "topView", {
      read:            true,
      write:           false,
      backingVariable: false
    } );
    /**
     * Returns the initial view in the view stack
     * @property rootView
     * @type {Object}
     */
    self.getRootView = function () {
      if ( self._subviews.length > 0 ) {
        return self._subviews[0];
      } else {
        return null;
      }
    };
    self.setRootView = function ( theNewRoot ) {
      if ( self._subviews.length > 0 ) {
        // must remove all the subviews from the DOM
        for ( var i = 0; i < self._subviews.length; i++ ) {
          var thePoppingView = self._subviews[i];
          thePoppingView.notify( "viewWillDisappear" );
          if ( i === 0 ) {
            thePoppingView.element.classList.remove( "ui-root-view" );
          }
          thePoppingView.parentElement = null;
          thePoppingView.notify( "viewDidDisappear" );
          thePoppingView.notify( "viewWasPopped" );
          delete thePoppingView.navigationController;
        }
        self._subviews = [];
      }
      self._subviews.push( theNewRoot ); // add it to our views
      theNewRoot.navigationController = self;
      theNewRoot.notify( "viewWasPushed" );
      theNewRoot.notify( "viewWillAppear" ); // notify the view
      theNewRoot.parentElement = self.element; // and make us the parent
      theNewRoot.element.classList.add( "ui-root-view" );
      theNewRoot.notify( "viewDidAppear" ); // and notify it that it's actually there.
    };
    self.defineProperty( "rootView", {
      read:            true,
      write:           true,
      backingVariable: false
    } );
    self.defineProperty( "modal", {
      read:    true,
      write:   false,
      default: false
    } );
    self.defineProperty( "modalView", {
      read:    true,
      write:   false,
      default: null
    } );
    self.defineProperty( "modalViewType", {
      read:    true,
      write:   false,
      default: ""
    } );
    self._modalClickPreventer = null;
    self._preventClicks = null;
    /**
     * Creates a click-prevention element -- essentially a transparent DIV that
     * fills the screen.
     * @method _createClickPreventionElement
     * @private
     */
    self._createClickPreventionElement = function () {
      self.createElementIfNotCreated();
      self._preventClicks = document.createElement( "div" );
      self._preventClicks.className = "ui-prevent-clicks";
      self.element.appendChild( self._preventClicks );
    };
    /**
     * Create a click-prevention element if necessary
     * @method _createClickPreventionElementIfNotCreated
     * @private
     */
    self._createClickPreventionElementIfNotCreated = function () {
      if ( self._preventClicks === null ) {
        self._createClickPreventionElement();
      }
    };
    /**
     * push a view onto the view stack.
     *
     * @method pushView
     * @param {ViewContainer} aView
     * @param {Boolean} [withAnimation] Determine if the view should be pushed with an animation, default is `true`
     * @param {Number} [withDelay] Number of seconds for the animation, default is `0.3`
     * @param {String} [withType] CSS Animation, default is `ease-in-out`
     */
    self.pushView = function ( aView, withAnimation, withDelay, withType ) {
      var theHidingView = self.topView,
        theShowingView = aView,
        usingAnimation = true,
        animationDelay = 0.3,
        animationType = "ease-in-out";
      if ( typeof withAnimation !== "undefined" ) {
        usingAnimation = withAnimation;
      }
      if ( typeof withDelay !== "undefined" ) {
        animationDelay = withDelay;
      }
      if ( typeof withType !== "undefined" ) {
        animationType = withType;
      }
      if ( !usingAnimation ) {
        animationDelay = 0;
      }
      // add the view to our array, at the end
      self._subviews.push( theShowingView );
      theShowingView.navigationController = self;
      theShowingView.notify( "viewWasPushed" );
      // get each element's z-index, if specified
      var theHidingViewZ = parseInt( getComputedStyle( theHidingView.element ).getPropertyValue( "z-index" ) || "0", 10 ),
        theShowingViewZ = parseInt( getComputedStyle( theShowingView.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theHidingViewZ >= theShowingViewZ ) {
        theShowingViewZ = theHidingViewZ + 10;
      }
      // then position the view so as to be off-screen, with the current view on screen
      UI.styleElement( theHidingView.element, "transform", "translate3d(0,0," + theHidingViewZ + "px)" );
      UI.styleElement( theShowingView.element, "transform", "translate3d(100%,0," + theShowingViewZ + "px)" );
      // set up an animation
      if ( usingAnimation ) {
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "-webkit-transform " +
                                                                                         animationDelay + "s " + animationType );
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "-moz-transform " +
                                                                                         animationDelay + "s " + animationType );
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "-ms-transform " +
                                                                                         animationDelay + "s " + animationType );
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "transform " + animationDelay +
                                                                                         "s " + animationType );
        UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                           animationDelay + "s " + animationType );
        UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
      } else {
        UI.styleElements( [theShowingView.element, theHidingView.element], "transition", "inherit" );
        UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
      }
      // and add the element with us as the parent
      theShowingView.parentElement = self.element;
      // display the click prevention element
      self._preventClicks.style.display = "block";
      setTimeout( function () {
        // tell the topView to move over to the left
        UI.styleElement( theHidingView.element, "transform", "translate3d(-50%,0," + theHidingViewZ + "px)" );
        // and tell our new view to move as well
        UI.styleElement( theShowingView.element, "transform", "translate3d(0,0," + theShowingViewZ + "px)" );
        if ( usingAnimation ) {
          UI.styleElements( theHidingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
          UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        }
        // the the view it's about to show...
        theHidingView.notify( "viewWillDisappear" );
        theShowingView.notify( "viewWillAppear" );
        // tell anyone who is listening who got pushed
        self.notify( "viewPushed", [theShowingView] );
        // tell the view it's visible after the delay has passed
        setTimeout( function () {
          theHidingView.element.style.display = "none";
          theHidingView.notify( "viewDidDisappear" );
          theShowingView.notify( "viewDidAppear" );
          // hide click preventer
          self._preventClicks.style.display = "none";
        }, animationDelay * 1000 );
      }, 50 );
    };
    /**
     * pops the top view from the view stack
     *
     * @method popView
     * @param {Boolean} withAnimation Use animation when popping, default `true`
     * @param {String} withDelay Duration of animation in seconds, Default `0.3`
     * @param {String} withType CSS Animation, default is `ease-in-out`
     */
    self.popView = function ( withAnimation, withDelay, withType ) {
      var usingAnimation = true,
        animationDelay = 0.3,
        animationType = "ease-in-out";
      if ( typeof withAnimation !== "undefined" ) {
        usingAnimation = withAnimation;
      }
      if ( typeof withDelay !== "undefined" ) {
        animationDelay = withDelay;
      }
      if ( typeof withType !== "undefined" ) {
        animationType = withType;
      }
      if ( !usingAnimation ) {
        animationDelay = 0;
      }
      // only pop if we have views to pop (Can't pop the first!)
      if ( self._subviews.length <= 1 ) {
        return;
      }
      // pop the top view off the stack
      var thePoppingView = self._subviews.pop(),
        theShowingView = self.topView,
        thePoppingViewZ = parseInt( getComputedStyle( thePoppingView.element ).getPropertyValue( "z-index" ) || "0", 10 ),
        theShowingViewZ = parseInt( getComputedStyle( theShowingView.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theShowingViewZ >= thePoppingViewZ ) {
        thePoppingViewZ = theShowingViewZ + 10;
      }
      theShowingView.element.style.display = "inherit";
      // make sure that theShowingView is off screen to the left, and the popping
      // view is at 0
      UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "inherit" );
      UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
      UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "inherit" );
      UI.styleElement( theShowingView.element, "transform", "translate3d(-50%,0," + theShowingViewZ + "px)" );
      UI.styleElement( thePoppingView.element, "transform", "translate3d(0,0," + thePoppingViewZ + "px" );
      if ( usingAnimation ) {
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
        UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
      } else {
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
      }
      // set up an animation
      if ( usingAnimation ) {
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "-webkit-transform " +
                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "-moz-transform " +
                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "-ms-transform " +
                                                                                          animationDelay + "s " + animationType );
        UI.styleElements( [thePoppingView.element, theShowingView.element], "transition", "transform " + animationDelay +
                                                                                          "s " + animationType );
        UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                           animationDelay + "s " + animationType );
        UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "transition", "opacity " +
                                                                                                           animationDelay + "s " + animationType );
      }
      // display the click prevention element
      self._preventClicks.style.display = "block";
      setTimeout( function () {
        // and move everyone
        UI.styleElement( theShowingView.element, "transform", "translate3d(0,0," + theShowingViewZ + "px)" );
        UI.styleElement( thePoppingView.element, "transform", "translate3d(100%,0," + thePoppingViewZ + "px)" );
        if ( usingAnimation ) {
          UI.styleElements( thePoppingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "0" );
          UI.styleElements( theShowingView.element.querySelectorAll( ".ui-navigation-bar *" ), "opacity", "1" );
        }
        // the the view it's about to show...
        thePoppingView.notify( "viewWillDisappear" );
        theShowingView.notify( "viewWillAppear" );
        // tell the view it's visible after the delay has passed
        setTimeout( function () {
          thePoppingView.notify( "viewDidDisappear" );
          thePoppingView.notify( "viewWasPopped" );
          theShowingView.notify( "viewDidAppear" );
          // tell anyone who is listening who got popped
          self.notify( "viewPopped", [thePoppingView] );
          // hide click preventer
          self._preventClicks.style.display = "none";
          // and remove the popping view from the hierarchy
          thePoppingView.parentElement = null;
          delete thePoppingView.navigationController;
        }, ( animationDelay * 1000 ) );
      }, 50 );
    };
    /**
     * Presents the navigation controller as a modal navigation controller. It sits
     * adjacent to `fromView` in the DOM, not within, and as such can prevent it
     * from receiving any events. The rendering is rougly the same as any other
     * navigation controller, save that an extra class added to the element's
     * `ui-container` that ensures that on larger displays the modal doesn't
     * fill the entire screen. If desired, this class can be controlled by the second
     * parameter (`options`).
     *
     * if `options` are specified, it must be of the form:
     * ```
     * { displayType: "modalWindow|modalPage|modalFill",   // modal display type
       *   withAnimation: true|false,                        // should animation be used?
       *   withDelay: 0.3,                                   // if animation is used, time in seconds
       *   withTimingFunction: "ease-in-out|..."             // timing function to use for animation
       * }
     * ```
     *
     * @method presentModalController
     * @param {Node} fromView                      the top-level view to cover (typically rootContainer)
     * @param {*} options                          options to apply
     */
    self.presentModalController = function presentModelController( fromView, options ) {
      var defaultOpts = {
        displayType:        "modalWindow",
        withAnimation:      true,
        withDelay:          0.3,
        withTimingFunction: "ease-in-out"
      };
      if ( typeof options !== "undefined" ) {
        if ( typeof options.displayType !== "undefined" ) {
          defaultOpts.displayType = options.displayType;
        }
        if ( typeof options.withAnimation !== "undefined" ) {
          defaultOpts.withAnimation = options.withAnimation;
        }
        if ( typeof options.withDelay !== "undefined" ) {
          defaultOpts.withDelay = options.withDelay;
        }
        if ( typeof options.withTimingFunction !== "undefined" ) {
          defaultOpts.withTimingFunction = options.withTimingFunction;
        }
      }
      if ( !defaultOpts.withAnimation ) {
        defaultOpts.withDelay = 0;
      }
      // check our form factor class; if we're a phone, only permit modalFill
      if ( document.body.classList.contains( "phone" ) ) {
        defaultOpts.displayType = "modalFill";
      }
      self._modalView = fromView;
      self._modal = true;
      self._modalViewType = defaultOpts.displayType;
      self._modalClickPreventer = document.createElement( "div" );
      self._modalClickPreventer.className = "ui-container ui-transparent";
      // we need to calculate the z indices of the adjacent view and us
      var theAdjacentViewZ = parseInt( getComputedStyle( fromView ).getPropertyValue( "z-index" ) || "0", 10 ),
        theModalViewZ = parseInt( getComputedStyle( self.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theModalViewZ <= theAdjacentViewZ ) {
        theModalViewZ = theAdjacentViewZ + 10; // the modal should always be above the adjacent view
      }
      // make sure our current view is off-screen so that when it is added, it won't flicker
      self.element.$s( "transform", UTIL.template( "translate3d(%X%,%Y%,%Z%)", {
        x: "0",
        y: "150%",
        z: "" + theModalViewZ + "px"
      } ) );
      self.element.classList.add( defaultOpts.displayType );
      // and attach the element
      self._modalClickPreventer.appendChild( self.element );
      fromView.parentNode.appendChild( self._modalClickPreventer );
      // send any notifications we need
      self.emit( "viewWasPushed" );
      self.emit( "viewWillAppear" );
      setTimeout( function () {
        fromView.classList.add( "ui-disabled" );
        UI.beginAnimation( fromView ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .scale( "0.9" ).opacity( "0.9" ).endAnimation();
        UI.beginAnimation( self.element ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .translate3d( "0", "0", "" + theModalViewZ + "px" ).endAnimation( function sendNotifications() {
                                                                              self.emit( "viewDidAppear" );
                                                                            } );
      }, 50 );
    };
    /**
     * Dismiss a controller presented with `presentModelController`. Options can be
     *
     * ```
     * { withAnimation: true|false,         // if false, no animation occurs
       *   withDelay: 0.3,                    // time in seconds
       *   withTimingFunction: "ease-in-out"  // easing function to use
       * }
     * ```
     *
     * @method dismissModalController
     * @param {*} options
     */
    self.dismissModalController = function dismissModelController( options ) {
      var defaultOpts = {
        withAnimation:      true,
        withDelay:          0.3,
        withTimingFunction: "ease-in-out"
      };
      if ( typeof options !== "undefined" ) {
        if ( typeof options.withAnimation !== "undefined" ) {
          defaultOpts.withAnimation = options.withAnimation;
        }
        if ( typeof options.withDelay !== "undefined" ) {
          defaultOpts.withDelay = options.withDelay;
        }
        if ( typeof options.withTimingFunction !== "undefined" ) {
          defaultOpts.withTimingFunction = options.withTimingFunction;
        }
      }
      if ( !defaultOpts.withAnimation ) {
        defaultOpts.withDelay = 0;
      }
      // we need to calculate the z indices of the adjacent view and us
      var theAdjacentViewZ = parseInt( getComputedStyle( self.modalView ).getPropertyValue( "z-index" ) || "0", 10 ),
        theModalViewZ = parseInt( getComputedStyle( self.element ).getPropertyValue( "z-index" ) || "0", 10 );
      if ( theModalViewZ <= theAdjacentViewZ ) {
        theModalViewZ = theAdjacentViewZ + 10; // the modal should always be above the adjacent view
      }
      // send any notifications we need
      self.emit( "viewWillDisappear" );
      setTimeout( function () {
        self.modalView.classList.remove( "ui-disabled" );
        UI.beginAnimation( self.modalView ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .scale( "1" ).opacity( "1" ).endAnimation();
        UI.beginAnimation( self.element ).setTiming( defaultOpts.withDelay ).setTimingFunction( defaultOpts.withTimingFunction )
          .translate3d( "0", "150%", "" + theModalViewZ + "px" ).endAnimation(
          function sendNotifications() {
            self.emit( "viewDidDisappear" );
            self.emit( "viewWasPopped" );
            self.element.classList.remove( self.modalViewType );
            self._modalClickPreventer.parentNode.removeChild( self._modalClickPreventer );
            self._modalClickPreventer.removeChild( self.element );
            self._modal = false;
            self._modalView = null;
            self._modalViewType = "";
            self._modalClickPreventer = null;
          } );
      }, 50 );
    };
    /**
     * @method render
     * @abstract
     */
    self.override( function render() {
      return ""; // nothing to render!
    } );
    /**
     * Create elements and click prevention elements if necessary; otherwise there's nothing to do
     * @method renderToElement
     */
    self.override( function renderToElement() {
      self.createElementIfNotCreated();
      self._createClickPreventionElementIfNotCreated();
      return; // nothing to do.
    } );
    /**
     * Initialize the navigation controller
     * @method init
     * @return {Object}
     */
    self.override( function init( theRootView, theElementId, theElementTag, theElementClass, theParentElement ) {
      if ( typeof theRootView === "undefined" ) {
        throw new Error( "Can't initialize a navigation controller without a root view." );
      }
      // do what a normal view container does
      self.$super( theElementId, theElementTag, theElementClass, theParentElement );
      //self.super( _className, "init", [theElementId, theElementTag, theElementClass, theParentElement ] );
      // now add the root view
      self.rootView = theRootView;
      return self;
    } );
    /**
     * Initialize the navigation controller
     * @method initWithOptions
     * @return {Object}
     */
    self.override( function initWithOptions( options ) {
      var theRootView, theElementId, theElementTag, theElementClass,
        theParentElement;
      if ( typeof options !== "undefined" ) {
        if ( typeof options.id !== "undefined" ) {
          theElementId = options.id;
        }
        if ( typeof options.tag !== "undefined" ) {
          theElementTag = options.tag;
        }
        if ( typeof options.class !== "undefined" ) {
          theElementClass = options.class;
        }
        if ( typeof options.parent !== "undefined" ) {
          theParentElement = options.parent;
        }
        if ( typeof options.rootView !== "undefined" ) {
          theRootView = options.rootView;
        }
      }
      return self.init( theRootView, theElementId, theElementTag, theElementClass, theParentElement );
    } );
    // handle auto initialization
    self._autoInit.apply( self, arguments );
    return self;
  };
module.exports = NavigationController;

},{"../util/core":11,"./core":4,"./viewContainer":10}],7:[function(require,module,exports){
/**
 *
 * Provides native-like alert methods, including prompts and messages.
 *
 * @module alert.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var _y = require( "../util/core" ),
  BaseObject = require( "../util/object" ),
  UI = require( "./core" ),
  h = require( "../util/h" );
var _className = "Spinner";

function Spinner() {
  var self = new BaseObject();
  self.subclass( _className );
  self._element = null;
  self.defineObservableProperty( "text" );
  self.defineProperty( "visible", {
    default: false
  } );
  self.setObservableTintedBackground = function setObservableTintedBackground( v ) {
    if ( v ) {
      self._element.classList.add( "obscure-background" );
    } else {
      self._element.classList.remove( "obscure-background" );
    }
    return v;
  }
  self.defineObservableProperty( "tintedBackground", {
    default: false
  } );
  self.show = function show() {
    if ( !self.visible ) {
      UI._rootContainer.parentNode.appendChild( self._element );
      self.visible = true;
      setTimeout( function () {
        self._element.style.opacity = "1";
      }, 0 );
    }
  };
  self.hide = function hide( cb ) {
    if ( self.visible ) {
      self._element.style.opacity = "0";
      self.visible = false;
      setTimeout( function () {
        UI._rootContainer.parentNode.removeChild( self._element );
        if ( typeof cb === "function" ) {
          setTimeout( cb, 0 );
        }
      }, 250 );
    }
  };
  self.override( function init() {
    self.super( _className, "init" );
    self._element = h.el( "div.ui-spinner-outer-container",
                          h.el( "div.ui-spinner-inner-container",
                                [h.el( "div.ui-spinner-inner-spinner" ),
                                 h.el( "div.ui-spinner-inner-text", {
                                   bind: {
                                     object:  self,
                                     keyPath: "text"
                                   }
                                 } )
                                ] ) );
    return self;
  } );
  self.initWithOptions = function initWithOptions( options ) {
    self.init();
    self.text = options.text;
    self.tintedBackground = ( options.tintedBackground !== undefined ) ? options.tintedBackground : false;
    return self;
  };
  self.override( function destroy() {
    if ( self.visible ) {
      UI._rootContainer.parentNode.removeChild( self._element );
      self.visible = false;
    }
    self._element = null;
    self.super( _className, "destroy" );
  } )
  self._autoInit.apply( self, arguments );
  return self;
}
module.exports = Spinner;

},{"../util/core":11,"../util/h":16,"../util/object":18,"./core":4}],8:[function(require,module,exports){
/**
 *
 * Split View Controllers provide basic support for side-by-side views
 *
 * @module splitViewController.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var UI = require( "./core" ),
  ViewContainer = require( "./viewContainer" );
var _className = "SplitViewController";
var SplitViewController = function () {
  var self = new ViewContainer();
  self.subclass( _className );
  // # Notifications
  //
  // * `viewsChanged` - fired when the left or right side view changes
  //
  self.registerNotification( "viewsChanged" );
  self._preventClicks = null;
  /**
   * Creates a click-prevention element -- essentially a transparent DIV that
   * fills the screen.
   * @method _createClickPreventionElement
   * @private
   */
  self._createClickPreventionElement = function () {
    self.createElementIfNotCreated();
    self._preventClicks = document.createElement( "div" );
    self._preventClicks.className = "ui-prevent-clicks";
    self.element.appendChild( self._preventClicks );
  };
  /**
   * Create a click-prevention element if necessary
   * @method _createClickPreventionElementIfNotCreated
   * @private
   */
  self._createClickPreventionElementIfNotCreated = function () {
    if ( self._preventClicks === null ) {
      self._createClickPreventionElement();
    }
  };
  /**
   * Indicates the type of split canvas:
   *
   * * `split`: typical split-view - left and right side shares space on screen
   * * `off-canvas`: off-canvas view AKA Facebook split view. Left side is off screen and can slide in
   * * `split-overlay`: left side slides over the right side when visible
   *
   * @property viewType
   * @type {String}
   */
  self.setViewType = function ( theViewType ) {
    self.element.classList.remove( "ui-" + self._viewType + "-view" );
    self._viewType = theViewType;
    self.element.classList.add( "ui-" + theViewType + "-view" );
    self.leftViewStatus = "invisible";
  };
  self.defineProperty( "viewType", {
    read:    true,
    write:   true,
    default: "split"
  } );
  /**
   * Indicates whether or not the left view is `visible` or `invisible`.
   *
   * @property leftViewStatus
   * @type {String}
   */
  self.setLeftViewStatus = function ( viewStatus ) {
    self._preventClicks.style.display = "block";
    self.element.classList.remove( "ui-left-side-" + self._leftViewStatus );
    self._leftViewStatus = viewStatus;
    self.element.classList.add( "ui-left-side-" + viewStatus );
    setTimeout( function () {
      self._preventClicks.style.display = "none";
    }, 600 );
  };
  self.defineProperty( "leftViewStatus", {
    read:    true,
    write:   true,
    default: "invisible"
  } );
  /**
   * Toggle the visibility of the left side view
   * @method toggleLeftView
   */
  self.toggleLeftView = function () {
    if ( self.leftViewStatus === "visible" ) {
      self.leftViewStatus = "invisible";
    } else {
      self.leftViewStatus = "visible";
    }
  };
  /**
   * The array of views that this split view controller manages.
   * @property subviews
   * @type {Array}
   */
  self.defineProperty( "subviews", {
    read:    true,
    write:   false,
    default: [null, null]
  } );
  // internal elements
  self._leftElement = null;
  self._rightElement = null;
  /**
   * Create the left and right elements
   * @method _createElements
   * @private
   */
  self._createElements = function () {
    if ( self._leftElement !== null ) {
      self.element.removeChild( self._leftElement );
    }
    if ( self._rightElement !== null ) {
      self.element.removeChild( self._rightElement );
    }
    self._leftElement = document.createElement( "div" );
    self._rightElement = document.createElement( "div" );
    self._leftElement.className = "ui-container left-side";
    self._rightElement.className = "ui-container right-side";
    self.element.appendChild( self._leftElement );
    self.element.appendChild( self._rightElement );
  };
  /**
   * Create the left and right elements if necessary
   * @method _createElementsIfNecessary
   * @private
   */
  self._createElementsIfNecessary = function () {
    if ( self._leftElement !== null && self._rightElement !== null ) {
      return;
    }
    self._createElements();
  };
  /**
   * Assigns a view to a given side
   * @method _assignViewToSide
   * @param {DOMElement} whichElement
   * @param {ViewContainer} aView
   * @private
   */
  self._assignViewToSide = function ( whichElement, aView ) {
    self._createElementsIfNecessary();
    aView.splitViewController = self;
    aView.notify( "viewWasPushed" ); // notify the view it was "pushed"
    aView.notify( "viewWillAppear" ); // notify the view it will appear
    aView.parentElement = whichElement; // and make us the parent
    aView.notify( "viewDidAppear" ); // and notify it that it's actually there.
  };
  /**
   * Unparents a view on a given side, sending all the requisite notifications
   *
   * @method _unparentSide
   * @param {Number} sideIndex
   * @private
   */
  self._unparentSide = function ( sideIndex ) {
    if ( self._subviews.length >= sideIndex ) {
      var aView = self._subviews[sideIndex];
      if ( aView !== null ) {
        aView.notify( "viewWillDisappear" ); // notify the view that it is going to disappear
        aView.parentElement = null; // remove the view
        aView.notify( "viewDidDisappear" ); // notify the view that it did disappear
        aView.notify( "viewWasPopped" ); // notify the view that it was "popped"
        delete aView.splitViewController;
      }
    }
  };
  /**
   * Allows access to the left view
   * @property leftView
   * @type {ViewContainer}
   */
  self.getLeftView = function () {
    if ( self._subviews.length > 0 ) {
      return self._subviews[0];
    } else {
      return null;
    }
  };
  self.setLeftView = function ( aView ) {
    self._unparentSide( 0 ); // send disappear notices
    if ( self._subviews.length > 0 ) {
      self._subviews[0] = aView;
    } else {
      self._subviews.push( aView );
    }
    self._assignViewToSide( self._leftElement, aView );
    self.notify( "viewsChanged" );
  };
  self.defineProperty( "leftView", {
    read:            true,
    write:           true,
    backingVariable: false
  } );
  /**
   * Allows access to the right view
   * @property rightView
   * @type {ViewContainer}
   */
  self.getRightView = function () {
    if ( self._subviews.length > 1 ) {
      return self._subviews[1];
    } else {
      return null;
    }
  };
  self.setRightView = function ( aView ) {
    self._unparentSide( 1 ); // send disappear notices for right side
    if ( self._subviews.length > 1 ) {
      self._subviews[1] = aView;
    } else {
      self._subviews.push( aView );
    }
    self._assignViewToSide( self._rightElement, aView );
    self.notify( "viewsChanged" );
  };
  self.defineProperty( "rightView", {
    read:            true,
    write:           true,
    backingVariable: false
  } );
  /**
   * @method render
   * @abstract
   */
  self.override( function render() {
    return ""; // nothing to render!
  } );
  /**
   * Creates the left and right elements if necessary
   * @method renderToElement
   */
  self.override( function renderToElement() {
    self._createElementsIfNecessary();
    self._createClickPreventionElementIfNotCreated();
    return; // nothing to do.
  } );
  /**
   * Initialize the split view controller
   * @method init
   * @param {ViewContainer} theLeftView
   * @param {ViewContainer} theRightView
   * @param {String} [theElementId]
   * @param {String} [theElementClass]
   * @param {String} [theElementTag]
   * @param {DOMElement} [theParentElement]
   */
  self.override( function init( theLeftView, theRightView, theElementId, theElementTag, theElementClass, theParentElement ) {
    if ( typeof theLeftView === "undefined" ) {
      throw new Error( "Can't initialize a navigation controller without a left view." );
    }
    if ( typeof theRightView === "undefined" ) {
      throw new Error( "Can't initialize a navigation controller without a right view." );
    }
    // do what a normal view container does
    self.$super( theElementId, theElementTag, theElementClass, theParentElement );
//    self.super( _className, "init", [theElementId, theElementTag, theElementClass, theParentElement ] );
    // now add the left and right views
    self.leftView = theLeftView;
    self.rightView = theRightView;
    return self;
  } );
  /**
   * Initialize the split view controller
   * @method initWithOptions
   */
  self.override( function initWithOptions( options ) {
    var theLeftView, theRightView, theElementId, theElementTag, theElementClass,
      theParentElement;
    if ( typeof options !== "undefined" ) {
      if ( typeof options.id !== "undefined" ) {
        theElementId = options.id;
      }
      if ( typeof options.tag !== "undefined" ) {
        theElementTag = options.tag;
      }
      if ( typeof options.class !== "undefined" ) {
        theElementClass = options.class;
      }
      if ( typeof options.parent !== "undefined" ) {
        theParentElement = options.parent;
      }
      if ( typeof options.leftView !== "undefined" ) {
        theLeftView = options.leftView;
      }
      if ( typeof options.rightView !== "undefined" ) {
        theRightView = options.rightView;
      }
    }
    self.init( theLeftView, theRightView, theElementId, theElementTag, theElementClass, theParentElement );
    if ( typeof options !== "undefined" ) {
      if ( typeof options.viewType !== "undefined" ) {
        self.viewType = options.viewType;
      }
      if ( typeof options.leftViewStatus !== "undefined" ) {
        self.leftViewStatus = options.leftViewStatus;
      }
    }
    return self;
  } );
  /**
   * Destroy our elements and clean up
   *
   * @method destroy
   */
  self.override( function destroy() {
    self._unparentSide( 0 );
    self._unparentSide( 1 );
    if ( self._leftElement !== null ) {
      self.element.removeChild( self._leftElement );
    }
    if ( self._rightElement !== null ) {
      self.element.removeChild( self._rightElement );
    }
    self._leftElement = null;
    self._rightElement = null;
    self.$super();
    //self.super( _className, "destroy" );
  } );
  // auto initialize
  self._autoInit.apply( self, arguments );
  return self;
};
module.exports = SplitViewController;

},{"./core":4,"./viewContainer":10}],9:[function(require,module,exports){
/**
 *
 * Tab View Controllers provide basic support for tabbed views
 *
 * @module tabViewController.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var UI = require( "./core" ),
  ViewContainer = require( "./viewContainer" ),
  event = require( "./event" );
var _className = "TabViewController";
var TabViewController = function () {
  var self = new ViewContainer();
  self.subclass( _className );
  // # Notifications
  //
  // * `viewsChanged` - Fired when the views change
  self.registerNotification( "viewsChanged" );
  // internal elements
  self._tabElements = []; // each tab on the tab bar
  self._tabBarElement = null; // contains our bar button group
  self._barButtonGroup = null; // contains all our tabs
  self._viewContainer = null; // contains all our subviews
  /**
   * Create the tab bar element
   * @method _createTabBarElement
   * @private
   */
  self._createTabBarElement = function () {
    self._tabBarElement = document.createElement( "div" );
    self._tabBarElement.className = "ui-tab-bar ui-tab-default-position";
    self._barButtonGroup = document.createElement( "div" );
    self._barButtonGroup.className = "ui-bar-button-group ui-align-center";
    self._tabBarElement.appendChild( self._barButtonGroup );
  };
  /**
   * Create the tab bar element if necessary
   * @method _createTabBarElementIfNecessary
   * @private
   */
  self._createTabBarElementIfNecessary = function () {
    if ( self._tabBarElement === null ) {
      self._createTabBarElement();
    }
  };
  /**
   * create the view container that will hold all the views this tab bar owns
   * @method _createViewContainer
   * @private
   */
  self._createViewContainer = function () {
    self._viewContainer = document.createElement( "div" );
    self._viewContainer.className = "ui-container ui-avoid-tab-bar ui-tab-default-position";
  };
  /**
   * @method _createViewContainerIfNecessary
   * @private
   */
  self._createViewContainerIfNecessary = function () {
    if ( self._viewContainer === null ) {
      self._createViewContainer();
    }
  };
  /**
   * Create all the elements and the DOM structure
   * @method _createElements
   * @private
   */
  self._createElements = function () {
    self._createTabBarElementIfNecessary();
    self._createViewContainerIfNecessary();
    self.element.appendChild( self._tabBarElement );
    self.element.appendChild( self._viewContainer );
  };
  /**
   * @method _createElementsIfNecessary
   * @private
   */
  self._createElementsIfNecessary = function () {
    if ( self._tabBarElement !== null || self._viewContainer !== null ) {
      return;
    }
    self._createElements();
  };
  /**
   * Create a tab element and attach the appropriate event listener
   * @method _createTabElement
   * @private
   */
  self._createTabElement = function ( aView, idx ) {
    var e = document.createElement( "div" );
    e.className = "ui-bar-button ui-tint-color";
    e.innerHTML = aView.title;
    e.setAttribute( "data-tag", idx )
    event.addListener( e, "touchstart", function () {
      self.selectedTab = parseInt( this.getAttribute( "data-tag" ), 10 );
    } );
    return e;
  };
  /**
   * The position of the the tab bar
   * Valid options include: `default`, `top`, and `bottom`
   * @property barPosition
   * @type {TabViewController.BAR\_POSITION}
   */
  self.setObservableBarPosition = function ( newPosition, oldPosition ) {
    self._createElementsIfNecessary();
    self._tabBarElement.classList.remove( "ui-tab-" + oldPosition + "-position" );
    self._tabBarElement.classList.add( "ui-tab-" + newPosition + "-position" );
    self._viewContainer.classList.remove( "ui-tab-" + oldPosition + "-position" );
    self._viewContainer.classList.add( "ui-tab-" + newPosition + "-position" );
    return newPosition;
  };
  self.defineObservableProperty( "barPosition", {
    default: "default"
  } );
  /**
   * The alignment of the bar items
   * Valid options are: `left`, `center`, `right`
   * @property barAlignment
   * @type {TabViewController.BAR\_ALIGNMENT}
   */
  self.setObservableBarAlignment = function ( newAlignment, oldAlignment ) {
    self._createElementsIfNecessary();
    self._barButtonGroup.classList.remove( "ui-align-" + oldAlignment );
    self._barButtonGroup.classList.add( "ui-align-" + newAlignment );
    return newAlignment;
  };
  self.defineObservableProperty( "barAlignment", {
    default: "center"
  } );
  /**
   * The array of views that this tab view controller manages.
   * @property subviews
   * @type {Array}
   */
  self.defineProperty( "subviews", {
    read:    true,
    write:   false,
    default: []
  } );
  /**
   * Add a subview to the tab bar.
   * @method addSubview
   * @property {ViewContainer} view
   */
  self.addSubview = function ( view ) {
    self._createElementsIfNecessary();
    var e = self._createTabElement( view, self._tabElements.length );
    self._barButtonGroup.appendChild( e );
    self._tabElements.push( e );
    self._subviews.push( view );
    view.tabViewController = self;
    view.notify( "viewWasPushed" );
  };
  /**
   * Remove a specific view from the tab bar.
   * @method removeSubview
   * @property {ViewContainer} view
   */
  self.removeSubview = function ( view ) {
    self._createElementsIfNecessary();
    var i = self._subviews.indexOf( view );
    if ( i > -1 ) {
      var hidingView = self._subviews[i];
      var hidingViewParent = hidingView.parentElement;
      if ( hidingViewParent !== null ) {
        hidingView.notify( "viewWillDisappear" );
      }
      hidingView.parentElement = null;
      if ( hidingViewParent !== null ) {
        hidingView.notify( "viewDidDisappear" );
      }
      self._subviews.splice( i, 1 );
      self._barButtonGroup.removeChild( self._tabElements[i] );
      self._tabElements.splice( i, 1 );
      var curSelectedTab = self.selectedTab;
      if ( curSelectedTab > i ) {
        curSelectedTab--;
      }
      if ( curSelectedTab > self._tabElements.length ) {
        curSelectedTab = self._tabElements.length;
      }
      self.selectedTab = curSelectedTab;
    }
    view.notify( "viewWasPopped" );
    delete view.tabViewController;
  };
  /**
   * Determines which tab is selected; changing will display the appropriate
   * tab.
   *
   * @property selectedTab
   * @type {Number}
   */
  self.setObservableSelectedTab = function ( newIndex, oldIndex ) {
    var oldView, newView;
    self._createElementsIfNecessary();
    if ( oldIndex > -1 ) {
      oldView = self._subviews[oldIndex];
      if ( newIndex > -1 ) {
        newView = self._subviews[newIndex];
      }
      oldView.notify( "viewWillDisappear" );
      if ( newIndex > -1 ) {
        newView.notify( "viewWillAppear" );
      }
      oldView.parentElement = null;
      if ( newIndex > -1 ) {
        self._subviews[newIndex].parentElement = self._viewContainer;
      }
      oldView.notify( "viewDidDisappear" );
      if ( newIndex > -1 ) {
        newView.notify( "viewDidAppear" );
      }
    } else {
      newView = self._subviews[newIndex];
      newView.notify( "viewWillAppear" );
      self._subviews[newIndex].parentElement = self._viewContainer;
      newView.notify( "viewDidAppear" );
    }
    return newIndex;
  };
  self.defineObservableProperty( "selectedTab", {
    default:      -1,
    notifyAlways: true
  } );
  /**
   * @method render
   */
  self.override( function render() {
    return ""; // nothing to render!
  } );
  /**
   * @method renderToElement
   */
  self.override( function renderToElement() {
    self._createElementsIfNecessary();
    return; // nothing to do.
  } );
  /**
   * Initialize the tab controller
   * @method init
   * @param {String} [theElementId]
   * @param {String} [theElementTag]
   * @param {String} [theElementClass]
   * @param {DOMElement} [theParentElement]
   * @return {Object}
   */
  self.override( function init( theElementId, theElementTag, theElementClass, theParentElement ) {
    // do what a normal view container does
    self.$super( theElementId, theElementTag, theElementClass, theParentElement );
    //self.super( _className, "init", [theElementId, theElementTag, theElementClass, theParentElement ] );
    return self;
  } );
  /**
   * Initialize the tab controller
   * @method initWithOptions
   * @param {Object} options
   * @return {Object}
   */
  self.override( function initWithOptions( options ) {
    var theElementId, theElementTag, theElementClass, theParentElement;
    if ( typeof options !== "undefined" ) {
      if ( typeof options.id !== "undefined" ) {
        theElementId = options.id;
      }
      if ( typeof options.tag !== "undefined" ) {
        theElementTag = options.tag;
      }
      if ( typeof options.class !== "undefined" ) {
        theElementClass = options.class;
      }
      if ( typeof options.parent !== "undefined" ) {
        theParentElement = options.parent;
      }
    }
    self.init( theElementId, theElementTag, theElementClass, theParentElement );
    if ( typeof options !== "undefined" ) {
      if ( typeof options.barPosition !== "undefined" ) {
        self.barPosition = options.barPosition;
      }
      if ( typeof options.barAlignment !== "undefined" ) {
        self.barAlignment = options.barAlignment;
      }
    }
    return self;
  } );
  // auto init
  self._autoInit.apply( self, arguments );
  return self;
};
TabViewController.BAR_POSITION = {
  default: "default",
  top:     "top",
  bottom:  "bottom"
};
TabViewController.BAR_ALIGNMENT = {
  center: "center",
  left:   "left",
  right:  "right"
};
module.exports = TabViewController;

},{"./core":4,"./event":5,"./viewContainer":10}],10:[function(require,module,exports){
/**
 *
 * View Containers are simple objects that provide very basic view management with
 * a thin layer over the corresponding DOM element.
 *
 * @module viewContainer.js
 * @author Kerri Shotts
 * @version 0.5
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var BaseObject = require( "../util/object" ),
  h = require( "../util/h" );
var _className = "ViewContainer";
var ViewContainer = function () {
  var self = new BaseObject();
  self.subclass( _className );
  // # Notifications
  // * `viewWasPushed` is fired by a containing `ViewController` when the view is added
  //   to the view stack
  // * `viewWasPopped` is fired by a container when the view is removed from the view stack
  // * `viewWillAppear` is fired by a container when the view is about to appear (one should avoid
  //   any significant DOM changes or calculations during this time, or animations may stutter)
  // * `viewWillDisappear` is fired by a container when the view is about to disappear
  // * `viewDidAppear` is fired by a container when the view is on screen.
  // * `viewDidDisappear` is fired by a container when the view is off screen.
  self.registerNotification( "viewWasPushed" );
  self.registerNotification( "viewWasPopped" );
  self.registerNotification( "viewWillAppear" );
  self.registerNotification( "viewWillDisappear" );
  self.registerNotification( "viewDidAppear" );
  self.registerNotification( "viewDidDisappear" );
  self.registerNotification( "willRender" );
  self.registerNotification( "didRender" );
  // private properties used to manage the corresponding DOM element
  self._element = null;
  self._elementClass = "ui-container"; // default; can be changed to any class for styling purposes
  self._elementId = null; // bad design decision -- probably going to mark this as deprecated soon
  self._elementTag = "div"; // some elements might need to be something other than a DIV
  self._parentElement = null; // owning element
  /**
   * The title isn't displayed anywhere (unless you use it yourself in `renderToElement`, but
   * is useful for containers that want to know the title of their views.
   * @property title
   * @type {String}
   * @observable
   */
  self.defineObservableProperty( "title" );
  /**
   * Creates the internal elements.
   * @method createElement
   */
  self.createElement = function () {
    self._element = document.createElement( self._elementTag );
    if ( self.elementClass !== null ) {
      self._element.className = self.elementClass;
    }
    if ( self.elementId !== null ) {
      self._element.id = self.elementId;
    }
  };
  /**
   * Creates the internal elements if necessary (that is, if they aren't already in existence)
   * @method createElementIfNotCreated
   */
  self.createElementIfNotCreated = function () {
    if ( self._element === null ) {
      self.createElement();
    }
  };
  /**
   * The `element` property allow direct access to the DOM element backing the view
   * @property element
   * @type {DOMElement}
   */
  self.getElement = function () {
    self.createElementIfNotCreated();
    return self._element;
  };
  self.defineProperty( "element", {
    read:    true,
    write:   true,
    default: null
  } );
  /**
   * The `elementClass` property indicates the class of the DOM element. Changing
   * the class will alter the backing DOM element if created.
   * @property elementClass
   * @type {String}
   * @default "ui-container"
   */
  self.setElementClass = function ( theClassName ) {
    self._elementClass = theClassName;
    if ( self._element !== null ) {
      self._element.className = theClassName;
    }
  };
  self.defineProperty( "elementClass", {
    read:    true,
    write:   true,
    default: "ui-container"
  } );
  /**
   * Determines the `id` for the backing DOM element. Not the best choice to
   * use, since this must be unique within the DOM. Probably going to become
   * deprecated eventually
   */
  self.setElementId = function ( theElementId ) {
    self._elementId = theElementId;
    if ( self._element !== null ) {
      self._element.id = theElementId;
    }
  };
  self.defineProperty( "elementId", {
    read:    true,
    write:   true,
    default: null
  } );
  /**
   * Determines the type of DOM Element; by default this is a DIV.
   * @property elementTag
   * @type {String}
   * @default "div"
   */
  self.defineProperty( "elementTag", {
    read:    true,
    write:   true,
    default: "div"
  } );
  /**
   * Indicates the parent element, if it exists. This is a DOM element
   * that owns this view (parent -> child). Changing the parent removes
   * this element from the parent and reparents to another element.
   * @property parentElement
   * @type {DOMElement}
   */
  self.setParentElement = function ( theParentElement ) {
    if ( self._parentElement !== null && self._element !== null ) {
      // remove ourselves from the existing parent element first
      self._parentElement.removeChild( self._element );
      self._parentElement = null;
    }
    self._parentElement = theParentElement;
    if ( self._parentElement !== null && self._element !== null ) {
      self._parentElement.appendChild( self._element );
    }
  };
  self.defineProperty( "parentElement", {
    read:    true,
    write:   true,
    default: null
  } );
  /**
   * @method render
   * @return {String|DOMElement|DocumentFragment}
   * `render` is called by `renderToElement`. The idea behind this is to generate
   * a return value consisting of the DOM tree necessary to create the view's
   * contents.
   **/
  self.render = function () {
    // right now, this doesn't do anything, but it's here for inheritance purposes
    return "Error: Abstract Method";
  };
  /**
   * Renders the content of the view. Can be called more than once, but more
   * often is called once during `init`. Calls `render` immediately and
   * assigns it to `element`'s `innerHTML` -- this implicitly creates the
   * DOM elements backing the view if they weren't already created.
   * @method renderToElement
   */
  self.renderToElement = function () {
    self.emit( "willRender" );
    var renderOutput = self.render();
    if ( typeof renderOutput === "string" ) {
      self.element.innerHTML = self.render();
    } else if ( typeof renderOutput === "object" ) {
      h.renderTo( renderOutput, self.element );
    }
    self.emit( "didRender" );
  };
  /**
   * Initializes the view container; returns `self`
   * @method init
   * @param {String} [theElementId]
   * @param {String} [theElementTag]
   * @param {String} [theElementClass]
   * @param {DOMElement} [theParentElement]
   * @returns {Object}
   */
  self.override( function init( theElementId, theElementTag, theElementClass, theParentElement ) {
    self.$super();
    //self.super( _className, "init" ); // super has no parameters
    // set our Id, Tag, and Class
    if ( typeof theElementId !== "undefined" ) {
      self.elementId = theElementId;
    }
    if ( typeof theElementTag !== "undefined" ) {
      self.elementTag = theElementTag;
    }
    if ( typeof theElementClass !== "undefined" ) {
      self.elementClass = theElementClass;
    }
    // render ourselves to the element (via render); this implicitly creates the element
    // with the above properties.
    self.renderToElement();
    // add ourselves to our parent.
    if ( typeof theParentElement !== "undefined" ) {
      self.parentElement = theParentElement;
    }
    return self;
  } );
  /**
   * Initializes the view container. `options` can specify any of the following properties:
   *
   *  * `id` - the `id` of the element
   *  * `tag` - the element tag to use (`div` is the default)
   *  * `class` - the class name to use (`ui-container` is the default)
   *  * `parent` - the parent DOMElement
   *
   * @method initWithOptions
   * @param {Object} options
   * @return {Object}
   */
  self.initWithOptions = function ( options ) {
    var theElementId, theElementTag, theElementClass, theParentElement;
    if ( typeof options !== "undefined" ) {
      if ( typeof options.id !== "undefined" ) {
        theElementId = options.id;
      }
      if ( typeof options.tag !== "undefined" ) {
        theElementTag = options.tag;
      }
      if ( typeof options.class !== "undefined" ) {
        theElementClass = options.class;
      }
      if ( typeof options.parent !== "undefined" ) {
        theParentElement = options.parent;
      }
    }
    self.init( theElementId, theElementTag, theElementClass, theParentElement );
    if ( typeof options !== "undefined" ) {
      if ( typeof options.title !== "undefined" ) {
        self.title = options.title;
      }
    }
    return self;
  };
  /**
   * Clean up
   * @method destroy
   */
  self.override( function destroy() {
    // remove ourselves from the parent view, if attached
    if ( self._parentElement !== null && self._element !== null ) {
      // remove ourselves from the existing parent element first
      self._parentElement.removeChild( self._element );
      self._parentElement = null;
    }
    // and let our super know that it can clean up
    self.$super();
    //self.super( _className, "destroy" );
  } );
  // handle auto-initialization
  self._autoInit.apply( self, arguments );
  // return the new object
  return self;
};
// return the new factory
module.exports = ViewContainer;

},{"../util/h":16,"../util/object":18}],11:[function(require,module,exports){
/**
 *
 * Core of YASMF-UTIL; defines the version, DOM, and localization convenience methods.
 *
 * @module core.js
 * @author Kerri Shotts
 * @version 0.5
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global define, Globalize, device, document, window, setTimeout, navigator, console, Node*/
"use strict";
/**
 * @method getComputedStyle
 * @private
 * @param {Node} element      the element to request the computed style from
 * @param {string} property   the property to request (like `width`); optional
 * @returns {*}               Either the property requested or the entire CSS style declaration
 */
function getComputedStyle( element, property ) {
  if ( !( element instanceof Node ) && typeof element === "string" ) {
    property = element;
    element = this;
  }
  var computedStyle = window.getComputedStyle( element );
  if ( typeof property !== "undefined" ) {
    return computedStyle.getPropertyValue( property );
  }
  return computedStyle;
}
/**
 * @method _arrayize
 * @private
 * @param {NodeList} list     the list to convert
 * @returns {Array}           the converted array
 */
function _arrayize( list ) {
  return Array.prototype.splice.call( list, 0 );
}
/**
 * @method getElementById
 * @private
 * @param {Node} parent      the parent to execute getElementById on
 * @param {string} elementId the element ID to search for
 * @returns {Node}           the element or null if not found
 */
function getElementById( parent, elementId ) {
  if ( typeof parent === "string" ) {
    elementId = parent;
    parent = document;
  }
  return ( parent.getElementById( elementId ) );
}
/**
 * @method querySelector
 * @private
 * @param {Node} parent       the parent to execute querySelector on
 * @param {string} selector   the CSS selector to use
 * @returns {Node}            the located element or null if not found
 */
function querySelector( parent, selector ) {
  if ( typeof parent === "string" ) {
    selector = parent;
    parent = document;
  }
  return ( parent.querySelector( selector ) );
}
/**
 * @method querySelectorAll
 * @private
 * @param {Node} parent     the parent to execute querySelectorAll on
 * @param {string} selector the selector to use
 * @returns {Array}         the found elements; if none: []
 */
function querySelectorAll( parent, selector ) {
  if ( typeof parent === "string" ) {
    selector = parent;
    parent = document;
  }
  return _arrayize( parent.querySelectorAll( selector ) );
}
/**
 * @method $
 * @private
 * @param {string} selector   the CSS selector to use
 * @returns {Node}            The located element, relative to `this`
 */
function $( selector ) {
  return querySelector( this, selector );
}
/**
 * @method $$
 * @private
 * @param {string} selector   the CSS selector to use
 * @returns {Array}           the located elements, relative to `this`
 */
function $$( selector ) {
  return querySelectorAll( this, selector );
}
/**
 * @method $id
 * @private
 * @param {string} id         the id of the element
 * @returns {Node}            the located element or null if not found
 */
function $id( id ) {
  return getElementById( this, id );
}
// modify Node's prototype to provide useful additional shortcuts
var proto = Node.prototype;
[
  ["$", $],
  ["$$", $$],
  ["$1", $],
  ["$id", $id],
  ["gsc", getComputedStyle],
  ["gcs", getComputedStyle],
  ["getComputedStyle", getComputedStyle]
].forEach( function ( i ) {
             if ( typeof proto[i[0]] === "undefined" ) {
               proto[i[0]] = i[1];
             }
           } );
/**
 * Returns a value for the specified keypath. If any intervening
 * values evaluate to undefined or null, the entire result is
 * undefined or null, respectively.
 *
 * If you need a default value to be returned in such an instance,
 * specify it after the keypath.
 *
 * Note: if `o` is not an object, it is assumed that the function
 * has been bound to `this`. As such, all arguments are shifted by
 * one position to the right.
 *
 * Key paths are of the form:
 *
 *    object.field.field.field[index]
 *
 * @param {object} o        the object to search
 * @param {string} k        the keypath
 * @param {*} d             (optional) the default value to return
 *                          should the keypath evaluate to null or
 *                          undefined.
 * @return {*}              the value at the keypath
 *
 * License MIT: Copyright 2014 Kerri Shotts
 */
function valueForKeyPath( o, k, d ) {
  if ( o === undefined || o === null ) {
    return ( d !== undefined ) ? d : o;
  }
  if ( !( o instanceof Object ) ) {
    d = k;
    k = o;
    o = this;
  }
  var v = o;
  // There's a million ways that this regex can go wrong
  // with respect to JavaScript identifiers. Splits will
  // technically work with just about every non-A-Za-z\$-
  // value, so your keypath could be "field/field/field"
  // and it would work like "field.field.field".
  v = k.match( /([\w\$\\\-]+)/g ).reduce( function ( v, keyPart ) {
    if ( v === undefined || v === null ) {
      return v;
    }
    try {
      return v[keyPart];
    }
    catch ( err ) {
      return undefined;
    }
  }, v );
  return ( ( v === undefined || v === null ) && ( d !== undefined ) ) ? d : v;
}
/**
 * Interpolates values from the context into the string. Placeholders are of the
 * form {...}. If values within {...} do not exist within context, they are
 * replaced with undefined.
 * @param  {string} str     string to interpolate
 * @param  {*} context      context to use for interpolation
 * @return {string}}        interpolated string
 */
function interpolate( str, context ) {
  var newStr = str;
  if ( typeof context === "undefined" ) {
    return newStr;
  }
  str.match( /\{([^\}]+)\}/g ).forEach( function ( match ) {
    var prop = match.substr( 1, match.length - 2 ).trim();
    newStr = newStr.replace( match, valueForKeyPath( context, prop ) );
  } );
  return newStr;
}
/**
 * Merges the supplied objects together and returns a copy containin the merged objects. The original
 * objects are untouched, and a new object is returned containing a relatively deep copy of each object.
 *
 * Important Notes:
 *   - Items that exist in any object but not in any other will be added to the target
 *   - Should more than one item exist in the set of objects with the same key, the following rules occur:
 *     - If both types are arrays, the result is a.concat(b)
 *     - If both types are objects, the result is merge(a,b)
 *     - Otherwise the result is b (b overwrites a)
 *   - Should more than one item exist in the set of objects with the same key, but differ in type, the
 *     second value overwrites the first.
 *   - This is not a true deep copy! Should any property be a reference to another object or array, the
 *     copied result may also be a reference (unless both the target and the source share the same item
 *     with the same type). In other words: DON'T USE THIS AS A DEEP COPY METHOD
 *
 * It's really meant to make this kind of work easy:
 *
 * var x = { a: 1, b: "hi", c: [1,2] },
 *     y = { a: 3, c: [3, 4], d: 0 },
 *     z = merge (x,y);
 *
 * z is now { a: 3, b: "hi", c: [1,2,3,4], d:0 }.
 *
 * License MIT. Copyright Kerri Shotts 2014
 */
function merge() {
  var t = {},
    args = Array.prototype.slice.call( arguments, 0 );
  args.forEach( function ( s ) {
    if (s === undefined || s === null) {
      return; // no keys, why bother!
    }
    Object.keys( s ).forEach( function ( prop ) {
      var e = s[prop];
      if ( e instanceof Array ) {
        if ( t[prop] instanceof Array ) {
          t[prop] = t[prop].concat( e );
        } else if ( !( t[prop] instanceof Object ) || !( t[prop] instanceof Array ) ) {
          t[prop] = e;
        }
      } else if ( e instanceof Object && t[prop] instanceof Object ) {
        t[prop] = merge( t[prop], e );
      } else {
        t[prop] = e;
      }
    } );
  } );
  return t;
}
/**
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
 *
 * LICENSE: MIT
 * Copyright Kerri Shotts, 2014
 */
function validate( source, rules ) {
  var r = {
    validates: true,
    message:   ""
  };
  if ( !( rules instanceof Object ) ) {
    return r;
  }
  // go over each rule in `rules`
  Object.keys( rules ).forEach( function ( prop ) {
    if ( r.validates ) {
      // get the rule
      var rule = rules[prop],
        v = source,
      // and get the value in source
        k = ( rule.key !== undefined ) ? rule.key : prop,
        title = ( rule.title !== undefined ) ? rule.title : prop;
      k = k.replace( "[", "." ).replace( "]", "" ).replace( "\"", "" );
      k.split( "." ).forEach( function ( keyPart ) {
        try {
          v = v[keyPart];
        }
        catch ( err ) {
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
      if ( v !== null && v !== undefined && v != "" ) {
        r.message = "Type Mismatch; expected " + rule.type + " not " + ( typeof v ) + " in " + title;
        switch ( rule.type ) {
          case "float":
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
              if ( isNaN( ( new Date( v ) ).getTime() ) ) {
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
            if ( !( typeof v === rule.type || v === undefined || v === null ) ) {
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
             ( typeof rule.maxLength === "number" && v !== undefined && v.length !== undefined && v.length > rule.maxLength )
        ) {
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
            } ).length === 0 ) {
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
    }
  } );
  return r;
}
var _y = {
  VERSION:                "0.5.142",
  valueForKeyPath:        valueForKeyPath,
  interpolate:            interpolate,
  merge:                  merge,
  validate:               validate,
  /**
   * Returns an element from the DOM with the specified
   * ID. Similar to (but not like) jQuery's $(), except
   * that this is a pure DOM element.
   * @method ge
   * @alias $id
   * @param  {String} elementId     id to search for, relative to document
   * @return {Node}                 null if no node found
   */
  ge:                     $id.bind( document ),
  $id:                    $id.bind( document ),
  /**
   * Returns an element from the DOM using `querySelector`.
   * @method qs
   * @alias $
   * @alias $1
   * @param {String} selector       CSS selector to search, relative to document
   * @returns {Node}                null if no node found that matches search
   */
  $:                      $.bind( document ),
  $1:                     $.bind( document ),
  qs:                     $.bind( document ),
  /**
   * Returns an array of all elements matching a given
   * selector. The array is processed to be a real array,
   * not a nodeList.
   * @method gac
   * @alias $$
   * @alias qsa
   * @param  {String} selector      CSS selector to search, relative to document
   * @return {Array} of Nodes       Array of nodes; [] if none found
   */
  $$:                     $$.bind( document ),
  gac:                    $$.bind( document ),
  qsa:                    $$.bind( document ),
  /**
   * Returns a Computed CSS Style ready for interrogation if
   * `property` is not defined, or the actual property value
   * if `property` is defined.
   * @method gcs
   * @alias gsc
   * @alias getComputedStyle
   * @param {Node} element  A specific DOM element
   * @param {String} [property]  A CSS property to query
   * @returns {*}
   */
  getComputedStyle:       getComputedStyle,
  gcs:                    getComputedStyle,
  gsc:                    getComputedStyle,
  /**
   * Returns a parsed template. The template can be a simple
   * string, in which case the replacement variable are replaced
   * and returned simply, or the template can be a DOM element,
   * in which case the template is assumed to be the DOM Element's
   * `innerHTML`, and then the replacement variables are parsed.
   *
   * Replacement variables are of the form `%VARIABLE%`, and
   * can occur anywhere, not just within strings in HTML.
   *
   * The replacements array is of the form
   * ```
   *     { "VARIABLE": replacement, "VARIABLE2": replacement, ... }
   * ```
   *
   * If `addtlOptions` is specified, it may override the default
   * options where `%` is used as a substitution marker and `toUpperCase`
   * is used as a transform. For example:
   *
   * ```
   * template ( "Hello, {{name}}", {"name": "Mary"},
   *            { brackets: [ "{{", "}}" ],
     *              transform: "toLowerCase" } );
   * ```
   *
   * @method template
   * @param  {Node|String} templateElement
   * @param  {Object} replacements
   * @return {String}
   */
  template:               function ( templateElement, replacements, addtlOptions ) {
    var brackets = ["%", "%"],
      transform = "toUpperCase",
      templateHTML, theVar, thisVar;
    if ( typeof addtlOptions !== "undefined" ) {
      if ( typeof addtlOptions.brackets !== "undefined" ) {
        brackets = addtlOptions.brackets;
      }
      if ( typeof addtlOptions.transform === "string" ) {
        transform = addtlOptions.transform;
      }
    }
    if ( templateElement instanceof Node ) {
      templateHTML = templateElement.innerHTML;
    } else {
      templateHTML = templateElement;
    }
    for ( theVar in replacements ) {
      if ( replacements.hasOwnProperty( theVar ) ) {
        thisVar = brackets[0];
        if ( transform !== "" ) {
          thisVar += theVar[transform]();
        } else {
          thisVar += theVar;
        }
        thisVar += brackets[1];
        while ( templateHTML.indexOf( thisVar ) > -1 ) {
          templateHTML = templateHTML.replace( thisVar, replacements[theVar] );
        }
      }
    }
    return templateHTML;
  },
  /**
   * Indicates if the app is running in a Cordova container.
   * Only valid if `executeWhenReady` is used to start an app.
   * @property underCordova
   * @default false
   */
  underCordova:           false,
  /**
   * Handles the conundrum of executing a block of code when
   * the mobile device or desktop browser is ready. If running
   * under Cordova, the `deviceready` event will fire, and
   * the `callback` will execute. Otherwise, after 1s, the
   * `callback` will execute *if it hasn't already*.
   *
   * @method executeWhenReady
   * @param {Function} callback
   */
  executeWhenReady:       function ( callback ) {
    var executed = false;
    document.addEventListener( "deviceready", function () {
      if ( !executed ) {
        executed = true;
        _y.underCordova = true;
        if ( typeof callback === "function" ) {
          callback();
        }
      }
    }, false );
    setTimeout( function () {
      if ( !executed ) {
        executed = true;
        _y.underCordova = false;
        if ( typeof callback === "function" ) {
          callback();
        }
      }
    }, 1000 );
  },
  /**
   * > The following functions are related to globalization and localization, which
   * > are now considered to be core functions (previously it was broken out in
   * > PKLOC)
   */
  /**
   * @typedef {String} Locale
   */
  /**
   * Indicates the user's locale. It's only valid after
   * a call to `getUserLocale`, but it can be written to
   * at any time in order to override `getUserLocale`'s
   * calculation of the user's locale.
   *
   * @property currentUserLocale
   * @default (empty string)
   * @type {Locale}
   */
  currentUserLocale:      "",
  /**
   * A translation matrix. Used by `addTranslation(s)` and `T`.
   *
   * @property localizedText
   * @type {Object}
   */
  localizedText:          {},
  /**
   * Given a locale string, normalize it to the form of `la-RE` or `la`, depending on the length.
   * ```
   *     "enus", "en_us", "en_---__--US", "EN-US" --> "en-US"
   *     "en", "en-", "EN!" --> "en"
   * ```
   * @method normalizeLocale
   * @param {Locale} theLocale
   */
  normalizeLocale:        function ( theLocale ) {
    var theNewLocale = theLocale;
    if ( theNewLocale.length < 2 ) {
      throw new Error( "Fatal: invalid locale; not of the format la-RE." );
    }
    var theLanguage = theNewLocale.substr( 0, 2 ).toLowerCase(),
      theRegion = theNewLocale.substr( -2 ).toUpperCase();
    if ( theNewLocale.length < 4 ) {
      theRegion = ""; // there can't possibly be a valid region on a 3-char string
    }
    if ( theRegion !== "" ) {
      theNewLocale = theLanguage + "-" + theRegion;
    } else {
      theNewLocale = theLanguage;
    }
    return theNewLocale;
  },
  /**
   * Sets the current locale for jQuery/Globalize
   * @method setGlobalizationLocale
   * @param {Locale} theLocale
   */
  setGlobalizationLocale: function ( theLocale ) {
    var theNewLocale = _y.normalizeLocale( theLocale );
    Globalize.culture( theNewLocale );
  },
  /**
   * Add a translation to the existing translation matrix
   * @method addTranslation
   * @param {Locale} locale
   * @param {String} key
   * @param {String} value
   */
  addTranslation:         function ( locale, key, value ) {
    var self = _y,
    // we'll store translations with upper-case locales, so case never matters
      theNewLocale = self.normalizeLocale( locale ).toUpperCase();
    // store the value
    if ( typeof self.localizedText[theNewLocale] === "undefined" ) {
      self.localizedText[theNewLocale] = {};
    }
    self.localizedText[theNewLocale][key.toUpperCase()] = value;
  },
  /**
   * Add translations in batch, as follows:
   * ```
   *   {
     *     "HELLO":
     *     {
     *       "en-US": "Hello",
     *       "es-US": "Hola"
     *     },
     *     "GOODBYE":
     *     {
     *       "en-US": "Bye",
     *       "es-US": "Adios"
     *     }
     *   }
   * ```
   * @method addTranslations
   * @param {Object} o
   */
  addTranslations:        function ( o ) {
    var self = _y;
    for ( var key in o ) {
      if ( o.hasOwnProperty( key ) ) {
        for ( var locale in o[key] ) {
          if ( o[key].hasOwnProperty( locale ) ) {
            self.addTranslation( locale, key, o[key][locale] );
          }
        }
      }
    }
  },
  /**
   * Returns the user's locale (e.g., `en-US` or `fr-FR`). If one
   * can't be found, `en-US` is returned. If `currentUserLocale`
   * is already defined, it won't attempt to recalculate it.
   * @method getUserLocale
   * @return {Locale}
   */
  getUserLocale:          function () {
    var self = _y;
    if ( self.currentUserLocale ) {
      return self.currentUserLocale;
    }
    var currentPlatform = "unknown";
    if ( typeof device !== "undefined" ) {
      currentPlatform = device.platform;
    }
    var userLocale = "en-US";
    // a suitable default
    if ( currentPlatform === "Android" ) {
      // parse the navigator.userAgent
      var userAgent = navigator.userAgent,
      // inspired by http://stackoverflow.com/a/7728507/741043
        tempLocale = userAgent.match( /Android.*([a-zA-Z]{2}-[a-zA-Z]{2})/ );
      if ( tempLocale ) {
        userLocale = tempLocale[1];
      }
    } else {
      userLocale = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage;
    }
    self.currentUserLocale = self.normalizeLocale( userLocale );
    return self.currentUserLocale;
  },
  /**
   * Gets the device locale, if available. It depends on the
   * Globalization plugin provided by Cordova, but if the
   * plugin is not available, it assumes the device locale
   * can't be determined rather than throw an error.
   *
   * Once the locale is determined one way or the other, `callback`
   * is called.
   *
   * @method getDeviceLocale
   * @param {Function} callback
   */
  getDeviceLocale:        function ( callback ) {
    var self = _y;
    if ( typeof navigator.globalization !== "undefined" ) {
      if ( typeof navigator.globalization.getLocaleName !== "undefined" ) {
        navigator.globalization.getLocaleName( function ( locale ) {
          self.currentUserLocale = self.normalizeLocale( locale.value );
          if ( typeof callback === "function" ) {
            callback();
          }
        }, function () {
          // error; go ahead and call the callback, but don't set the locale
          console.log( "WARN: Couldn't get user locale from device." );
          if ( typeof callback === "function" ) {
            callback();
          }
        } );
        return;
      }
    }
    if ( typeof callback === "function" ) {
      callback();
    }
  },
  /**
   * Looks up a translation for a given `key` and locale. If
   * the translation does not exist, `undefined` is returned.
   *
   * The `key` is converted to uppercase, and the locale is
   * properly normalized and then converted to uppercase before
   * any lookup is attempted.
   *
   * @method lookupTranslation
   * @param {String} key
   * @param {Locale} [theLocale]
   * @returns {*}
   */
  lookupTranslation:      function ( key, theLocale ) {
    var self = _y,
      upperKey = key.toUpperCase(),
      userLocale = theLocale || self.getUserLocale();
    userLocale = self.normalizeLocale( userLocale ).toUpperCase();
    // look it up by checking if userLocale exists, and then if the key (uppercased) exists
    if ( typeof self.localizedText[userLocale] !== "undefined" ) {
      if ( typeof self.localizedText[userLocale][upperKey] !== "undefined" ) {
        return self.localizedText[userLocale][upperKey];
      }
    }
    // if not found, we don't return anything
    return void( 0 );
  },
  /**
   * @property localeOfLastResort
   * @default "en-US"
   * @type {Locale}
   */
  localeOfLastResort:     "en-US",
  /**
   * @property languageOfLastResort
   * @default "en"
   * @type {Locale}
   */
  languageOfLastResort:   "en",
  /**
   * Convenience function for translating text. Key is the only
   * required value and case doesn't matter (it's uppercased). Replacement
   * variables can be specified using replacement variables of the form `{ "VAR":"VALUE" }`,
   * using `%VAR%` in the key/value returned. If `locale` is specified, it
   * takes precedence over the user's current locale.
   *
   * @method T
   * @param {String} key
   * @param {Object} [parms] replacement variables
   * @param {Locale} [locale]
   */
  T:                      function ( key, parms, locale ) {
    var self = _y,
      userLocale = locale || self.getUserLocale(),
      currentValue;
    if ( typeof ( currentValue = self.lookupTranslation( key, userLocale ) ) === "undefined" ) {
      // we haven't found it under the given locale (of form: xx-XX), try the fallback locale (xx)
      userLocale = userLocale.substr( 0, 2 );
      if ( typeof ( currentValue = self.lookupTranslation( key, userLocale ) ) === "undefined" ) {
        // we haven't found it under any of the given locales; try the language of last resort
        if ( typeof ( currentValue = self.lookupTranslation( key, self.languageOfLastResort ) ) === "undefined" ) {
          // we haven't found it under any of the given locales; try locale of last resort
          if ( typeof ( currentValue = self.lookupTranslation( key, self.localeOfLastResort ) ) === "undefined" ) {
            // we didn't find it at all... we'll use the key
            currentValue = key;
          }
        }
      }
    }
    return self.template( currentValue, parms );
  },
  /**
   * Convenience function for localizing numbers according the format (optional) and
   * the locale (optional). theFormat is typically the number of places to use; "n" if
   * not specified.
   *
   * @method N
   * @param {Number} theNumber
   * @param {Number|String} theFormat
   * @param {Locale} [theLocale]
   */
  N:                      function ( theNumber, theFormat, theLocale ) {
    var self = _y,
      iFormat = "n" + ( ( typeof theFormat === "undefined" ) ? "0" : theFormat ),
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theNumber, iFormat );
  },
  /**
   * Convenience function for localizing currency. theFormat is the number of decimal places
   * or "2" if not specified. If there are more places than digits, padding is added; if there
   * are fewer places, rounding is performed.
   *
   * @method C
   * @param {Number} theNumber
   * @param {String} theFormat
   * @param {Locale} [theLocale]
   */
  C:                      function ( theNumber, theFormat, theLocale ) {
    var self = _y,
      iFormat = "c" + ( ( typeof theFormat === "undefined" ) ? "2" : theFormat ),
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theNumber, iFormat );
  },
  /**
   * Convenience function for localizing percentages. theFormat specifies the number of
   * decimal places; two if not specified.
   * @method PCT
   * @param {Number} theNumber
   * @param {Number} theFormat
   * @param {Locale} [theLocale]
   */
  PCT:                    function ( theNumber, theFormat, theLocale ) {
    var self = _y,
      iFormat = "p" + ( ( typeof theFormat === "undefined" ) ? "2" : theFormat ),
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theNumber, iFormat );
  },
  /**
   * Convenience function for localizing dates.
   *
   * theFormat specifies the format; "d" is assumed if not provided.
   *
   * @method D
   * @param {Date} theDate
   * @param {String} theFormat
   * @param {Locale} [theLocale]
   */
  D:                      function ( theDate, theFormat, theLocale ) {
    var self = _y,
      iFormat = theFormat || "d",
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theDate, iFormat );
  },
  /**
   * Convenience function for jQuery/Globalize's `format` method
   * @method format
   * @param {*} theValue
   * @param {String} theFormat
   * @param {Locale} [theLocale]
   * @returns {*}
   */
  format:                 function ( theValue, theFormat, theLocale ) {
    var self = _y,
      iFormat = theFormat,
      iLocale = theLocale || self.getUserLocale();
    self.setGlobalizationLocale( iLocale );
    return Globalize.format( theValue, iFormat );
  }
};
module.exports = _y;

},{}],12:[function(require,module,exports){
/**
 *
 * Provides date/time convenience methods
 *
 * @module datetime.js
 * @author Kerri Shotts
 * @version 0.4
 *
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
module.exports = {
  /**
   * Returns the current time in the Unix time format
   * @method getUnixTime
   * @return {UnixTime}
   */
  getUnixTime:         function () {
    return ( new Date() ).getTime();
  },
  /**
   * # PRECISION_x Constants
   * These specify the amount of precision required for `getPartsFromSeconds`.
   * For example, if `PRECISION_DAYS` is specified, the number of parts obtained
   * consist of days, hours, minutes, and seconds.
   */
  PRECISION_SECONDS:   1,
  PRECISION_MINUTES:   2,
  PRECISION_HOURS:     3,
  PRECISION_DAYS:      4,
  PRECISION_WEEKS:     5,
  PRECISION_YEARS:     6,
  /**
   * @typedef {{fractions: number, seconds: number, minutes: number, hours: number, days: number, weeks: number, years: number}} TimeParts
   */
  /**
   * Takes a given number of seconds and returns an object consisting of the number of seconds, minutes, hours, etc.
   * The value is limited by the precision parameter -- which must be specified. Which ever value is specified will
   * be the maximum limit for the routine; that is `PRECISION_DAYS` will never return a result for weeks or years.
   * @method getPartsFromSeconds
   * @param {number} seconds
   * @param {number} precision
   * @returns {TimeParts}
   */
  getPartsFromSeconds: function ( seconds, precision ) {
    var partValues = [0, 0, 0, 0, 0, 0, 0],
      modValues = [1, 60, 3600, 86400, 604800, 31557600];
    for ( var i = precision; i > 0; i-- ) {
      if ( i === 1 ) {
        partValues[i - 1] = seconds % modValues[i - 1];
      } else {
        partValues[i - 1] = Math.floor( seconds % modValues[i - 1] );
      }
      partValues[i] = Math.floor( seconds / modValues[i - 1] );
      seconds = seconds - partValues[i] * modValues[i - 1];
    }
    return {
      fractions: partValues[0],
      seconds:   partValues[1],
      minutes:   partValues[2],
      hours:     partValues[3],
      days:      partValues[4],
      weeks:     partValues[5],
      years:     partValues[6]
    };
  }
};

},{}],13:[function(require,module,exports){
/**
 *
 * Provides basic device-handling convenience functions for determining if the device
 * is an iDevice or a Droid Device, and what the orientation is.
 *
 * @module device.js
 * @author Kerri Shotts
 * @version 0.5
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module, define, device, navigator, window */
"use strict";
/**
 *
 * PKDEVICE provides simple methods for getting device information, such as platform,
 * form factor, and orientation.
 *
 * @class PKDEVICE
 */
var PKDEVICE = {
  /**
   * The version of the class with major, minor, and rev properties.
   *
   * @property version
   * @type Object
   *
   */
  version:            "0.5.100",
  /**
   * Permits overriding the platform for testing. Leave set to `false` for
   * production applications.
   *
   * @property platformOverride
   * @type boolean
   * @default false
   */
  platformOverride:   false,
  /**
   * Permits overriding the form factor. Usually used for testing.
   *
   * @property formFactorOverride
   * @type boolean
   * @default false
   */
  formFactorOverride: false,
  /**
   *
   * Returns the device platform, lowercased. If PKDEVICE.platformOverride is
   * other than "false", it is returned instead.
   *
   * See PhoneGap's documentation on the full range of platforms that can be
   * returned; without PG available, the method will attemt to determine the
   * platform from `navigator.platform` and the `userAgent`, but only supports
   * iOS and Android in that capacity.
   *
   * @method platform
   * @static
   * @returns {String} the device platform, lowercase.
   */
  platform:           function () {
    if ( PKDEVICE.platformOverride ) {
      return PKDEVICE.platformOverride.toLowerCase();
    }
    if ( typeof device === "undefined" || !device.platform ) {
      // detect mobile devices first
      if ( navigator.platform === "iPad" || navigator.platform === "iPad Simulator" || navigator.platform === "iPhone" ||
           navigator.platform === "iPhone Simulator" || navigator.platform === "iPod" ) {
        return "ios";
      }
      if ( navigator.userAgent.toLowerCase().indexOf( "android" ) > -1 ) {
        return "android";
      }
      // no reason why we can't return other information
      if ( navigator.platform.indexOf( "Mac" ) > -1 ) {
        return "mac";
      }
      if ( navigator.platform.indexOf( "Win" ) > -1 ) {
        return "windows";
      }
      if ( navigator.platform.indexOf( "Linux" ) > -1 ) {
        return "linux";
      }
      return "unknown";
    }
    var thePlatform = device.platform.toLowerCase();
    //
    // turns out that for Cordova > 2.3, deivceplatform now returns iOS, so the
    // following is really not necessary on those versions. We leave it here
    // for those using Cordova <= 2.2.
    if ( thePlatform.indexOf( "ipad" ) > -1 || thePlatform.indexOf( "iphone" ) > -1 ) {
      thePlatform = "ios";
    }
    return thePlatform;
  },
  /**
   *
   * Returns the device's form factor. Possible values are "tablet" and
   * "phone". If PKDEVICE.formFactorOverride is not false, it is returned
   * instead.
   *
   * @method formFactor
   * @static
   * @returns {String} `tablet` or `phone`, as appropriate
   */
  formFactor:         function () {
    if ( PKDEVICE.formFactorOverride ) {
      return PKDEVICE.formFactorOverride.toLowerCase();
    }
    if ( navigator.platform === "iPad" ) {
      return "tablet";
    }
    if ( ( navigator.platform === "iPhone" ) || ( navigator.platform === "iPhone Simulator" ) ) {
      return "phone";
    }
    var ua = navigator.userAgent.toLowerCase();
    if ( ua.indexOf( "android" ) > -1 ) {
      // android reports if it is a phone or tablet based on user agent
      if ( ua.indexOf( "mobile safari" ) > -1 ) {
        return "phone";
      }
      if ( ua.indexOf( "mobile safari" ) < 0 && ua.indexOf( "safari" ) > -1 ) {
        return "tablet";
      }
      if ( ( Math.max( window.screen.width, window.screen.height ) / window.devicePixelRatio ) >= 900 ) {
        return "tablet";
      } else {
        return "phone";
      }
    }
    // the following is hacky, and not guaranteed to work all the time,
    // especially as phones get bigger screens with higher DPI.
    if ( ( Math.max( window.screen.width, window.screen.height ) ) >= 900 ) {
      return "tablet";
    }
    return "phone";
  },
  /**
   * Determines if the device is a tablet (or tablet-sized, more accurately)
   * @return {Boolean}
   */
  isTablet:           function () {
    return PKDEVICE.formFactor() === "tablet";
  },
  /**
   * Determines if the device is a tablet (or tablet-sized, more accurately)
   * @return {Boolean}
   */
  isPhone:            function () {
    return PKDEVICE.formFactor() === "phone";
  },
  /**
   *
   * Determines if the device is in Portrait orientation.
   *
   * @method isPortrait
   * @static
   * @returns {boolean} `true` if the device is in a Portrait orientation; `false` otherwise
   */
  isPortrait:         function () {
    return window.orientation === 0 || window.orientation === 180 || window.location.href.indexOf( "?portrait" ) > -1;
  },
  /**
   *
   * Determines if the device is in Landscape orientation.
   *
   * @method isLandscape
   * @static
   * @returns {boolean} `true` if the device is in a landscape orientation; `false` otherwise
   */
  isLandscape:        function () {
    if ( window.location.href.indexOf( "?landscape" ) > -1 ) {
      return true;
    }
    return !PKDEVICE.isPortrait();
  },
  /**
   *
   * Determines if the device is a hiDPI device (aka retina)
   *
   * @method isRetina
   * @static
   * @returns {boolean} `true` if the device has a `window.devicePixelRatio` greater than `1.0`; `false` otherwise
   */
  isRetina:           function () {
    return window.devicePixelRatio > 1;
  },
  /**
   * Returns `true` if the device is an iPad.
   *
   * @method iPad
   * @static
   * @returns {boolean}
   */
  iPad:               function () {
    return PKDEVICE.platform() === "ios" && PKDEVICE.formFactor() === "tablet";
  },
  /**
   * Returns `true` if the device is an iPhone (or iPod).
   *
   * @method iPhone
   * @static
   * @returns {boolean}
   */
  iPhone:             function () {
    return PKDEVICE.platform() === "ios" && PKDEVICE.formFactor() === "phone";
  },
  /**
   * Returns `true` if the device is an Android Phone.
   *
   * @method droidPhone
   * @static
   * @returns {boolean}
   */
  droidPhone:         function () {
    return PKDEVICE.platform() === "android" && PKDEVICE.formFactor() === "phone";
  },
  /**
   * Returns `true` if the device is an Android Tablet.
   *
   * @method droidTablet
   * @static
   * @returns {boolean}
   */
  droidTablet:        function () {
    return PKDEVICE.platform() === "android" && PKDEVICE.formFactor() === "tablet";
  }
};
module.exports = PKDEVICE;

},{}],14:[function(require,module,exports){
/**
 *
 * FileManager implements methods that interact with the HTML5 API
 *
 * @module fileManager.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*globals module, define, Q, LocalFileSystem, console, window, navigator, FileReader*/
var Q = require( "../../q" );
var BaseObject = require( "./object.js" );
"use strict";
var IN_YASMF = true;
return (function ( Q, BaseObject, globalContext, module ) {
  /**
   * Defined by Q, actually, but defined here to make type handling nicer
   * @typedef {{}} Promise
   */
  var DEBUG = false;

  /**
   * Requests a quota from the file system
   * @method _requestQuota
   * @private
   * @param  {*} fileSystemType    PERSISTENT or TEMPORARY
   * @param  {Number} requestedDataSize The quota we're asking for
   * @return {Promise}                   The promise
   */
  function _requestQuota( fileSystemType, requestedDataSize ) {
    var deferred = Q.defer();
    if ( DEBUG ) {
      console.log( ["_requestQuota: ", fileSystemType, requestedDataSize].join( " " ) );
    }
    try {
      // attempt to ask for a quota
      var PERSISTENT = ( typeof LocalFileSystem !== "undefined" ) ? LocalFileSystem.PERSISTENT : window.PERSISTENT,
      // Chrome has `webkitPersistentStorage` and `navigator.webkitTemporaryStorage`
        storageInfo = fileSystemType === PERSISTENT ? navigator.webkitPersistentStorage : navigator.webkitTemporaryStorage;
      if ( storageInfo ) {
        // now make sure we can request a quota
        if ( storageInfo.requestQuota ) {
          // request the quota
          storageInfo.requestQuota( requestedDataSize, function success( grantedBytes ) {
            if ( DEBUG ) {
              console.log( ["_requestQuota: quota granted: ", fileSystemType,
                            grantedBytes
                           ].join( " " ) );
            }
            deferred.resolve( grantedBytes );
          }, function failure( anError ) {
            if ( DEBUG ) {
              console.log( ["_requestQuota: quota rejected: ", fileSystemType,
                            requestedDataSize, anError
                           ].join( " " ) );
            }
            deferred.reject( anError );
          } );
        } else {
          // not everything supports asking for a quota -- like Cordova.
          // Instead, let's assume we get permission
          if ( DEBUG ) {
            console.log( ["_requestQuota: couldn't request quota -- no requestQuota: ",
                          fileSystemType, requestedDataSize
                         ].join( " " ) );
          }
          deferred.resolve( requestedDataSize );
        }
      } else {
        if ( DEBUG ) {
          console.log( ["_requestQuota: couldn't request quota -- no storageInfo: ",
                        fileSystemType, requestedDataSize
                       ].join( " " ) );
        }
        deferred.resolve( requestedDataSize );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Request a file system with the requested size (obtained first by getting a quota)
   * @method _requestFileSystem
   * @private
   * @param  {*} fileSystemType    TEMPORARY or PERSISTENT
   * @param  {Number} requestedDataSize The quota
   * @return {Promise}                   The promise
   */
  function _requestFileSystem( fileSystemType, requestedDataSize ) {
    var deferred = Q.defer();
    if ( DEBUG ) {
      console.log( ["_requestFileSystem: ", fileSystemType, requestedDataSize].join( " " ) );
    }
    try {
      // fix issue #2 by chasen where using `webkitRequestFileSystem` was having problems
      // on Android 4.2.2
      var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
      requestFileSystem( fileSystemType, requestedDataSize, function success( theFileSystem ) {
        if ( DEBUG ) {
          console.log( ["_requestFileSystem: got a file system", theFileSystem].join( " " ) );
        }
        deferred.resolve( theFileSystem );
      }, function failure( anError ) {
        if ( DEBUG ) {
          console.log( ["_requestFileSystem: couldn't get a file system",
                        fileSystemType
                       ].join( " " ) );
        }
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Resolves theURI to a fileEntry or directoryEntry, if possible.
   * If `theURL` contains `private` or `localhost` as its first element, it will be removed. If
   * `theURL` does not have a URL scheme, `file://` will be assumed.
   * @method _resolveLocalFileSystemURL
   * @private
   * @param  {String} theURL the path, should start with file://, but if it doesn't we'll add it.
   */
  function _resolveLocalFileSystemURL( theURL ) {
    var deferred = Q.defer();
    if ( DEBUG ) {
      console.log( ["_resolveLocalFileSystemURL: ", theURL].join( " " ) );
    }
    try {
      // split the parts of the URL
      var parts = theURL.split( ":" ),
        protocol, path;
      // can only have two parts
      if ( parts.length > 2 ) {
        throw new Error( "The URI is not well-formed; missing protocol: " + theURL );
      }
      // if only one part, we assume `file` as the protocol
      if ( parts.length < 2 ) {
        protocol = "file";
        path = parts[0];
      } else {
        protocol = parts[0];
        path = parts[1];
      }
      // split the path components
      var pathComponents = path.split( "/" ),
        newPathComponents = [];
      // iterate over each component and trim as we go
      pathComponents.forEach( function ( part ) {
        part = part.trim();
        if ( part !== "" ) { // remove /private if it is the first item in the new array, for iOS sake
          if ( !( ( part === "private" || part === "localhost" ) && newPathComponents.length === 0 ) ) {
            newPathComponents.push( part );
          }
        }
      } );
      // rejoin the path components
      var theNewURI = newPathComponents.join( "/" );
      // add the protocol
      theNewURI = protocol + ":///" + theNewURI;
      // and resolve the URL.
      window.resolveLocalFileSystemURL( theNewURI, function ( theEntry ) {
        deferred.resolve( theEntry );
      }, function ( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @typedef {{}} DirectoryEntry
   * HTML5 File API Directory Type
   */
  /**
   * Returns a directory entry based on the path from the parent using
   * the specified options, if specified. `options` takes the form:
   * ` {create: true/false, exclusive true/false }`
   * @method _getDirectoryEntry
   * @private
   * @param  {DirectoryEntry} parent  The parent that path is relative from (or absolute)
   * @param  {String} path    The relative or absolute path or a {DirectoryEntry}
   * @param  {Object} options The options (that is, create the directory if it doesn't exist, etc.)
   * @return {Promise}         The promise
   */
  function _getDirectoryEntry( parent, path, options ) {
    if ( DEBUG ) {
      console.log( ["_getDirectoryEntry:", parent, path, options].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      if ( typeof path === "object" ) {
        deferred.resolve( path );
      } else {
        parent.getDirectory( path, options || {}, function success( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry );
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Returns a file entry based on the path from the parent using
   * the specified options. `options` takes the form of `{ create: true/false, exclusive: true/false}`
   * @method getFileEntry
   * @private
   * @param  {DirectoryEntry} parent  The parent that path is relative from (or absolute)
   * @param  {String} path    The relative or absolute path
   * @param  {Object} options The options (that is, create the file if it doesn't exist, etc.)
   * @return {Promise}         The promise
   */
  function _getFileEntry( parent, path, options ) {
    if ( DEBUG ) {
      console.log( ["_getFileEntry:", parent, path, options].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      if ( typeof path === "object" ) {
        deferred.resolve( path );
      } else {
        parent.getFile( path, options || {}, function success( theFileEntry ) {
          deferred.resolve( theFileEntry );
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @typedef {{}} FileEntry
   * HTML5 File API File Entry
   */
  /**
   * Returns a file object based on the file entry.
   * @method _getFileObject
   * @private
   * @param  {FileEntry} fileEntry The file Entry
   * @return {Promise}           The Promise
   */
  function _getFileObject( fileEntry ) {
    if ( DEBUG ) {
      console.log( ["_getFileObject:", fileEntry].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      fileEntry.file( function success( theFile ) {
        deferred.resolve( theFile );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Reads the file contents from a file object. readAsKind indicates how
   * to read the file ("Text", "DataURL", "BinaryString", "ArrayBuffer").
   * @method _readFileContents
   * @private
   * @param  {File} fileObject File to read
   * @param  {String} readAsKind "Text", "DataURL", "BinaryString", "ArrayBuffer"
   * @return {Promise}            The Promise
   */
  function _readFileContents( fileObject, readAsKind ) {
    if ( DEBUG ) {
      console.log( ["_readFileContents:", fileObject, readAsKind].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      var fileReader = new FileReader();
      fileReader.onloadend = function ( e ) {
        deferred.resolve( e.target.result );
      };
      fileReader.onerror = function ( anError ) {
        deferred.reject( anError );
      };
      fileReader["readAs" + readAsKind]( fileObject );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Creates a file writer for the file entry; `fileEntry` must exist
   * @method _createFileWriter
   * @private
   * @param  {FileEntry} fileEntry The file entry to write to
   * @return {Promise}           the Promise
   */
  function _createFileWriter( fileEntry ) {
    if ( DEBUG ) {
      console.log( ["_createFileWriter:", fileEntry].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      var fileWriter = fileEntry.createWriter( function success( theFileWriter ) {
        deferred.resolve( theFileWriter );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @typedef {{}} FileWriter
   * HTML5 File API File Writer Type
   */
  /**
   * Write the contents to the fileWriter; `contents` should be a Blob.
   * @method _writeFileContents
   * @private
   * @param  {FileWriter} fileWriter Obtained from _createFileWriter
   * @param  {*} contents   The contents to write
   * @return {Promise}            the Promise
   */
  function _writeFileContents( fileWriter, contents ) {
    if ( DEBUG ) {
      console.log( ["_writeFileContents:", fileWriter, contents].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      fileWriter.onwrite = function ( e ) {
        fileWriter.onwrite = function ( e ) {
          deferred.resolve( e );
        };
        fileWriter.write( contents );
      };
      fileWriter.onError = function ( anError ) {
        deferred.reject( anError );
      };
      fileWriter.truncate( 0 ); // clear out the contents, first
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Copy the file to the specified parent directory, with an optional new name
   * @method _copyFile
   * @private
   * @param  {FileEntry} theFileEntry            The file to copy
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to copy the file to
   * @param  {String} theNewName              The new name of the file ( or undefined simply to copy )
   * @return {Promise}                         The Promise
   */
  function _copyFile( theFileEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_copyFile:", theFileEntry, theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theFileEntry.copyTo( theParentDirectoryEntry, theNewName, function success( theNewFileEntry ) {
        deferred.resolve( theNewFileEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Move the file to the specified parent directory, with an optional new name
   * @method _moveFile
   * @private
   * @param  {FileEntry} theFileEntry            The file to move or rename
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to move the file to (or the same as the file in order to rename)
   * @param  {String} theNewName              The new name of the file ( or undefined simply to move )
   * @return {Promise}                         The Promise
   */
  function _moveFile( theFileEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_moveFile:", theFileEntry, theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theFileEntry.moveTo( theParentDirectoryEntry, theNewName, function success( theNewFileEntry ) {
        deferred.resolve( theNewFileEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Remove the file from the file system
   * @method _removeFile
   * @private
   * @param  {FileEntry} theFileEntry The file to remove
   * @return {Promise}              The Promise
   */
  function _removeFile( theFileEntry ) {
    if ( DEBUG ) {
      console.log( ["_removeFile:", theFileEntry].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theFileEntry.remove( function success() {
        deferred.resolve();
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Copies a directory to the specified directory, with an optional new name. The directory
   * is copied recursively.
   * @method _copyDirectory
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry       The directory to copy
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to copy the first directory to
   * @param  {String} theNewName              The optional new name for the directory
   * @return {Promise}                         A promise
   */
  function _copyDirectory( theDirectoryEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_copyDirectory:", theDirectoryEntry,
                    theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theDirectoryEntry.copyTo( theParentDirectoryEntry, theNewName, function success( theNewDirectoryEntry ) {
        deferred.resolve( theNewDirectoryEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Moves a directory to the specified directory, with an optional new name. The directory
   * is moved recursively.
   * @method _moveDirectory
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry       The directory to move
   * @param  {DirectoryEntry} theParentDirectoryEntry The parent directory to move the first directory to
   * @param  {String} theNewName              The optional new name for the directory
   * @return {Promise}                         A promise
   */
  function _moveDirectory( theDirectoryEntry, theParentDirectoryEntry, theNewName ) {
    if ( DEBUG ) {
      console.log( ["_moveDirectory:", theDirectoryEntry,
                    theParentDirectoryEntry,
                    theNewName
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      theDirectoryEntry.moveTo( theParentDirectoryEntry, theNewName, function success( theNewDirectoryEntry ) {
        deferred.resolve( theNewDirectoryEntry );
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Removes a directory from the file system. If recursively is true, the directory is removed
   * recursively.
   * @method _removeDirectory
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry The directory to remove
   * @param  {Boolean} recursively       If true, remove recursively
   * @return {Promise}                   The Promise
   */
  function _removeDirectory( theDirectoryEntry, recursively ) {
    if ( DEBUG ) {
      console.log( ["_removeDirectory:", theDirectoryEntry, "recursively",
                    recursively
                   ].join( " " ) );
    }
    var deferred = Q.defer();
    try {
      if ( !recursively ) {
        theDirectoryEntry.remove( function success() {
          deferred.resolve();
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      } else {
        theDirectoryEntry.removeRecursively( function success() {
          deferred.resolve();
        }, function failure( anError ) {
          deferred.reject( anError );
        } );
      }
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * Reads the contents of a directory
   * @method _readDirectoryContents
   * @private
   * @param  {DirectoryEntry} theDirectoryEntry The directory to list
   * @return {Promise}                   The promise
   */
  function _readDirectoryContents( theDirectoryEntry ) {
    if ( DEBUG ) {
      console.log( ["_readDirectoryContents:", theDirectoryEntry].join( " " ) );
    }
    var directoryReader = theDirectoryEntry.createReader(),
      entries = [],
      deferred = Q.defer();

    function readEntries() {
      directoryReader.readEntries( function success( theEntries ) {
        if ( !theEntries.length ) {
          deferred.resolve( entries );
        } else {
          entries = entries.concat( Array.prototype.slice.call( theEntries || [], 0 ) );
          readEntries();
        }
      }, function failure( anError ) {
        deferred.reject( anError );
      } );
    }

    try {
      readEntries();
    }
    catch ( anError ) {
      deferred.reject( anError );
    }
    return deferred.promise;
  }

  /**
   * @class FileManager
   */
  var _className = "UTIL.FileManager",
    FileManager = function () {
      var self,
      // determine if we have a `BaseObject` available or not
        hasBaseObject = ( typeof BaseObject !== "undefined" );
      if ( hasBaseObject ) {
        // if we do, subclass it
        self = new BaseObject();
        self.subclass( _className );
        self.registerNotification( "changedCurrentWorkingDirectory" );
      } else {
        // otherwise, base off {}
        self = {};
      }
      // get the persistent and temporary filesystem constants
      self.PERSISTENT = ( typeof LocalFileSystem !== "undefined" ) ? LocalFileSystem.PERSISTENT : window.PERSISTENT;
      self.TEMPORARY = ( typeof LocalFileSystem !== "undefined" ) ? LocalFileSystem.TEMPORARY : window.TEMPORARY;
      // determine the various file types we support
      self.FILETYPE = {
        TEXT:         "Text",
        DATA_URL:     "DataURL",
        BINARY:       "BinaryString",
        ARRAY_BUFFER: "ArrayBuffer"
      };
      /**
       * Returns the value of the global `DEBUG` variable.
       * @method getGlobalDebug
       * @returns {Boolean}
       */
      self.getGlobalDebug = function () {
        return DEBUG;
      };
      /**
       * Sets the global DEBUG variable. If `true`, debug messages are logged to the console.
       * @method setGlobalDebug
       * @param {Boolean} debug
       */
      self.setGlobalDebug = function ( debug ) {
        DEBUG = debug;
      };
      /**
       * @property globalDebug
       * @type {Boolean} If `true`, logs messages to console as operations occur.
       */
      Object.defineProperty( self, "globalDebug", {
        get:          self.getGlobalDebug,
        set:          self.setGlobalDebug,
        configurable: true
      } );
      /**
       * the fileSystemType can either be `self.PERSISTENT` or `self.TEMPORARY`, and is only
       * set during an `init` operation. It cannot be set at any other time.
       * @property fileSystemType
       * @type {FileSystem}
       */
      self._fileSystemType = null; // can only be changed during INIT
      self.getFileSystemType = function () {
        return self._fileSystemType;
      };
      Object.defineProperty( self, "fileSystemType", {
        get:          self.getFileSystemType,
        configurable: true
      } );
      /**
       * The requested quota -- stored for future reference, since we ask for it
       * specifically during an `init` operation. It cannot be changed.
       * @property requestedQuota
       * @type {Number}
       */
      self._requestedQuota = 0; // can only be changed during INIT
      self.getRequestedQuota = function () {
        return self._requestedQuota;
      };
      Object.defineProperty( self, "requestedQuota", {
        get:          self.getRequestedQuota,
        configurable: true
      } );
      /**
       * The actual quota obtained from the system. It cannot be changed, and is
       * only obtained during `init`. The result does not have to match the
       * `requestedQuota`. If it doesn't match, it may be representative of the
       * actual space available, depending on the platform
       * @property actualQuota
       * @type {Number}
       */
      self._actualQuota = 0;
      self.getActualQuota = function () {
        return self._actualQuota;
      };
      Object.defineProperty( self, "actualQuota", {
        get:          self.getActualQuota,
        configurable: true
      } );
      /**
       * @typedef {{}} FileSystem
       * HTML5 File API File System
       */
      /**
       * The current filesystem -- either the temporary or persistent one; it can't be changed
       * @property fileSystem
       * @type {FileSystem}
       */
      self._fileSystem = null;
      self.getFileSystem = function () {
        return self._fileSystem;
      };
      Object.defineProperty( self, "fileSystem", {
        get:          self.getFileSystem,
        configurable: true
      } );
      /**
       * Current Working Directory Entry
       * @property cwd
       * @type {DirectoryEntry}
       */
      self._root = null;
      self._cwd = null;
      self.getCurrentWorkingDirectory = function () {
        return self._cwd;
      };
      self.setCurrentWorkingDirectory = function ( theCWD ) {
        self._cwd = theCWD;
        if ( hasBaseObject ) {
          self.notify( "changedCurrentWorkingDirectory" );
        }
      };
      Object.defineProperty( self, "cwd", {
        get:          self.getCurrentWorkingDirectory,
        set:          self.setCurrentWorkingDirectory,
        configurable: true
      } );
      Object.defineProperty( self, "currentWorkingDirectory", {
        get:          self.getCurrentWorkingDirectory,
        set:          self.setCurrentWorkingDirectory,
        configurable: true
      } );
      /**
       * Current Working Directory stack
       * @property _cwds
       * @private
       * @type {Array}
       */
      self._cwds = [];
      /**
       * Push the current working directory on to the stack
       * @method pushCurrentWorkingDirectory
       */
      self.pushCurrentWorkingDirectory = function () {
        self._cwds.push( self._cwd );
      };
      /**
       * Pop the topmost directory on the stack and change to it
       * @method popCurrentWorkingDirectory
       */
      self.popCurrentWorkingDirectory = function () {
        self.setCurrentWorkingDirectory( self._cwds.pop() );
      };
      /**
       * Resolves a URL to a local file system. If the URL scheme is not present, `file`
       * is assumed.
       * @param {String} theURI The URI to resolve
       */
      self.resolveLocalFileSystemURL = function ( theURI ) {
        var deferred = Q.defer();
        _resolveLocalFileSystemURL( theURI ).then( function gotEntry( theEntry ) {
          deferred.resolve( theEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns the file entry for the given path (useful for
       * getting the full path of a file). `options` is of the
       * form `{create: true/false, exclusive: true/false}`
       * @method getFileEntry
       * @param {String} theFilePath The file path or FileEntry object
       * @param {*} options creation options
       */
      self.getFileEntry = function ( theFilePath, options ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options ).then( function gotFileEntry( theFileEntry ) {
          deferred.resolve( theFileEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns the file object for a given file (useful for getting
       * the size of a file); `option` is of the form `{create: true/false, exclusive: true/false}`
       * @method getFile
       * @param {String} theFilePath
       * @param {*} option
       */
      self.getFile = function ( theFilePath, options ) {
        return self.getFileEntry( theFilePath, options ).then( _getFileObject );
      };
      /**
       * Returns the directory entry for a given path
       * @method getDirectoryEntry
       * @param {String} theDirectoryPath
       * @param {*} options
       */
      self.getDirectoryEntry = function ( theDirectoryPath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath, options ).then( function gotDirectoryEntry( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * returns the URL for a given file
       * @method getFileURL
       * @param {String} theFilePath
       * @param {*} options
       */
      self.getFileURL = function ( theFilePath, options ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options ).then( function gotFileEntry( theFileEntry ) {
          deferred.resolve( theFileEntry.toURL() );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns a URL for the given directory
       * @method getDirectoryURL
       * @param {String} thePath
       * @param {*} options
       */
      self.getDirectoryURL = function ( thePath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, thePath || ".", options ).then( function gotDirectoryEntry( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry.toURL() );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns the native URL for an entry by combining the `fullPath` of the entry
       * with the `nativeURL` of the `root` directory if absolute or of the `current`
       * directory if not absolute.
       * @method getNativeURL
       * @param {String} theEntry Path of the file or directory; can also be a File/DirectoryEntry
       */
      self.getNativeURL = function ( theEntry ) {
        var thePath = theEntry;
        if ( typeof theEntry !== "string" ) {
          thePath = theEntry.fullPath();
        }
        var isAbsolute = ( thePath.substr( 0, 1 ) === "/" ),
          theRootPath = isAbsolute ? self._root.nativeURL : self.cwd.nativeURL;
        return theRootPath + ( isAbsolute ? "" : "/" ) + thePath;
      };
      /**
       * returns the native file path for a given file
       * @method getNativeFileURL
       * @param {String} theFilePath
       * @param {*} options
       */
      self.getNativeFileURL = function ( theFilePath, options ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options ).then( function gotFileEntry( theFileEntry ) {
          deferred.resolve( theFileEntry.nativeURL );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Returns a URL for the given directory
       * @method getNativeDirectoryURL
       * @param {String} thePath
       * @param {*} options
       */
      self.getNativeDirectoryURL = function ( thePath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, thePath || ".", options ).then( function gotDirectoryEntry( theDirectoryEntry ) {
          deferred.resolve( theDirectoryEntry.nativeURL );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Change to an arbitrary directory
       * @method changeDirectory
       * @param  {String} theNewPath The path to the directory, relative to cwd
       * @return {Promise}            The Promise
       */
      self.changeDirectory = function ( theNewPath ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theNewPath, {} ).then( function gotDirectory( theNewDirectory ) {
          self.cwd = theNewDirectory;
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Read an arbitrary file's contents.
       * @method readFileContents
       * @param  {String} theFilePath The path to the file, relative to cwd
       * @param  {Object} options     The options to use when opening the file (such as creating it)
       * @param  {String} readAsKind  How to read the file -- best to use self.FILETYPE.TEXT, etc.
       * @return {Promise}             The Promise
       */
      self.readFileContents = function ( theFilePath, options, readAsKind ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options || {} ).then( function gotTheFileEntry( theFileEntry ) {
          return _getFileObject( theFileEntry );
        } ).then( function gotTheFileObject( theFileObject ) {
          return _readFileContents( theFileObject, readAsKind || "Text" );
        } ).then( function getTheFileContents( theFileContents ) {
          deferred.resolve( theFileContents );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Read an arbitrary directory's entries.
       * @method readDirectoryContents
       * @param  {String} theDirectoryPath The path to the directory, relative to cwd; "." if not specified
       * @param  {Object} options          The options to use when opening the directory (such as creating it)
       * @return {Promise}             The Promise
       */
      self.readDirectoryContents = function ( theDirectoryPath, options ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath || ".", options || {} ).then( function gotTheDirectoryEntry( theDirectoryEntry ) {
          return _readDirectoryContents( theDirectoryEntry );
        } ).then( function gotTheDirectoryEntries( theEntries ) {
          deferred.resolve( theEntries );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Write data to an arbitrary file
       * @method writeFileContents
       * @param  {String} theFilePath The file name to write to, relative to cwd
       * @param  {Object} options     The options to use when opening the file
       * @param  {*} theData     The data to write
       * @return {Promise}             The Promise
       */
      self.writeFileContents = function ( theFilePath, options, theData ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, options || {
          create:    true,
          exclusive: false
        } ).then( function gotTheFileEntry( theFileEntry ) {
          return _createFileWriter( theFileEntry );
        } ).then( function gotTheFileWriter( theFileWriter ) {
          return _writeFileContents( theFileWriter, theData );
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Creates an arbitrary directory
       * @method createDirectory
       * @param  {String} theDirectoryPath The path, relative to cwd
       * @return {Promise}                  The Promise
       */
      self.createDirectory = function ( theDirectoryPath ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath, {
          create:    true,
          exclusive: false
        } ).then( function gotDirectory( theNewDirectory ) {
          deferred.resolve( theNewDirectory );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Copies a file to a new directory, with an optional new name
       * @method copyFile
       * @param  {String} sourceFilePath      Path to file, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.copyFile = function ( sourceFilePath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theFileToCopy;
        _getFileEntry( self._cwd, sourceFilePath, {} ).then( function gotFileEntry( aFileToCopy ) {
          theFileToCopy = aFileToCopy;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotDirectoryEntry( theTargetDirectory ) {
          return _copyFile( theFileToCopy, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewFileEntry ) {
          deferred.resolve( theNewFileEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Copies a directory to a new directory, with an optional new name
       * @method copyDirectory
       * @param  {String} sourceDirectoryPath Path to directory, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.copyDirectory = function ( sourceDirectoryPath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theDirectoryToCopy;
        _getDirectoryEntry( self._cwd, sourceDirectoryPath, {} ).then( function gotSourceDirectoryEntry( sourceDirectoryEntry ) {
          theDirectoryToCopy = sourceDirectoryEntry;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotTargetDirectoryEntry( theTargetDirectory ) {
          return _copyDirectory( theDirectoryToCopy, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewDirectoryEntry ) {
          deferred.resolve( theNewDirectoryEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * @method moveFile
       * Moves a file to a new directory, with an optional new name
       * @param  {String} sourceFilePath      Path to file, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.moveFile = function ( sourceFilePath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theFileToMove;
        _getFileEntry( self._cwd, sourceFilePath, {} ).then( function gotFileEntry( aFileToMove ) {
          theFileToMove = aFileToMove;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotDirectoryEntry( theTargetDirectory ) {
          return _moveFile( theFileToMove, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewFileEntry ) {
          deferred.resolve( theNewFileEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Moves a directory to a new directory, with an optional new name
       * @method moveDirectory
       * @param  {String} sourceDirectoryPath Path to directory, relative to cwd
       * @param  {String} targetDirectoryPath Path to new directory, relative to cwd
       * @param  {String} withNewName         New name, if desired
       * @return {Promise}                     The Promise
       */
      self.moveDirectory = function ( sourceDirectoryPath, targetDirectoryPath, withNewName ) {
        var deferred = Q.defer(),
          theDirectoryToMove;
        _getDirectoryEntry( self._cwd, sourceDirectoryPath, {} ).then( function gotSourceDirectoryEntry( sourceDirectoryEntry ) {
          theDirectoryToMove = sourceDirectoryEntry;
          return _getDirectoryEntry( self._cwd, targetDirectoryPath, {} );
        } ).then( function gotTargetDirectoryEntry( theTargetDirectory ) {
          return _moveDirectory( theDirectoryToMove, theTargetDirectory, withNewName );
        } ).then( function allDone( theNewDirectoryEntry ) {
          deferred.resolve( theNewDirectoryEntry );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Renames a file to a new name, in the cwd
       * @method renameFile
       * @param  {String} sourceFilePath      Path to file, relative to cwd
       * @param  {String} withNewName         New name
       * @return {Promise}                     The Promise
       */
      self.renameFile = function ( sourceFilePath, withNewName ) {
        return self.moveFile( sourceFilePath, ".", withNewName );
      };
      /**
       * Renames a directory to a new name, in the cwd
       * @method renameDirectory
       * @param  {String} sourceDirectoryPath Path to directory, relative to cwd
       * @param  {String} withNewName         New name
       * @return {Promise}                     The Promise
       */
      self.renameDirectory = function ( sourceDirectoryPath, withNewName ) {
        return self.moveDirectory( sourceDirectoryPath, ".", withNewName );
      };
      /**
       * Deletes a file
       * @method deleteFile
       * @param  {String} theFilePath Path to file, relative to cwd
       * @return {Promise}             The Promise
       */
      self.deleteFile = function ( theFilePath ) {
        var deferred = Q.defer();
        _getFileEntry( self._cwd, theFilePath, {} ).then( function gotTheFileToDelete( theFileEntry ) {
          return _removeFile( theFileEntry );
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Removes a directory, possibly recursively
       * @method removeDirectory
       * @param  {String} theDirectoryPath path to directory, relative to cwd
       * @param  {Boolean} recursively      If true, recursive remove
       * @return {Promise}                  The promise
       */
      self.removeDirectory = function ( theDirectoryPath, recursively ) {
        var deferred = Q.defer();
        _getDirectoryEntry( self._cwd, theDirectoryPath, {} ).then( function gotTheDirectoryToDelete( theDirectoryEntry ) {
          return _removeDirectory( theDirectoryEntry, recursively );
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      /**
       * Asks the browser for the requested quota, and then requests the file system
       * and sets the cwd to the root directory.
       * @method _initializeFileSystem
       * @private
       * @return {Promise} The promise
       */
      self._initializeFileSystem = function () {
        var deferred = Q.defer();
        _requestQuota( self.fileSystemType, self.requestedQuota ).then( function gotQuota( theQuota ) {
          self._actualQuota = theQuota;
          return _requestFileSystem( self.fileSystemType, self.actualQuota );
        } ).then( function gotFS( theFS ) {
          self._fileSystem = theFS;
          //self._cwd = theFS.root;
          return _getDirectoryEntry( theFS.root, "", {} );
        } ).then( function gotRootDirectory( theRootDirectory ) {
          self._root = theRootDirectory;
          self._cwd = theRootDirectory;
        } ).then( function allDone() {
          deferred.resolve( self );
        } ).
          catch( function ( anError ) {
                   deferred.reject( anError );
                 } ).done();
        return deferred.promise;
      };
      if ( self.overrideSuper ) {
        self.overrideSuper( self.class, "init", self.init );
      }
      /**
       * Initializes the file manager with the requested file system type (self.PERSISTENT or self.TEMPORARY)
       * and requested quota size. Both must be specified.
       * @method init
       * @param {FileSystem} fileSystemType
       * @param {Number} requestedQuota
       */
      self.init = function ( fileSystemType, requestedQuota ) {
        if ( self.super ) {
          self.super( _className, "init" );
        }
        if ( typeof fileSystemType === "undefined" ) {
          throw new Error( "No file system type specified; specify PERSISTENT or TEMPORARY." );
        }
        if ( typeof requestedQuota === "undefined" ) {
          throw new Error( "No quota requested. If you don't know, specify ZERO." );
        }
        self._requestedQuota = requestedQuota;
        self._fileSystemType = fileSystemType;
        return self._initializeFileSystem(); // this returns a promise, so we can .then after.
      };
      /**
       * Initializes the file manager with the requested file system type (self.PERSISTENT or self.TEMPORARY)
       * and requested quota size. Both must be specified.
       * @method initWithOptions
       * @param {*} options
       */
      self.initWithOptions = function ( options ) {
        if ( typeof options === "undefined" ) {
          throw new Error( "No options specified. Need type and quota." );
        }
        if ( typeof options.fileSystemType === "undefined" ) {
          throw new Error( "No file system type specified; specify PERSISTENT or TEMPORARY." );
        }
        if ( typeof options.requestedQuota === "undefined" ) {
          throw new Error( "No quota requested. If you don't know, specify ZERO." );
        }
        return self.init( options.fileSystemType, options.requestedQuota );
      };
      return self;
    };
  // meta information
  FileManager.meta = {
    version:           "00.04.450",
    class:             _className,
    autoInitializable: false,
    categorizable:     false
  };
  // assign to `window` if stand-alone
  if ( globalContext ) {
    globalContext.FileManager = FileManager;
  }
  if ( module ) {
    module.exports = FileManager;
  }
})( Q, BaseObject, ( typeof IN_YASMF !== "undefined" ) ? undefined : window, module );

},{"../../q":1,"./object.js":18}],15:[function(require,module,exports){
/**
 *
 * Provides convenience methods for parsing unix-style path names. If the
 * path separator is changed from "/" to "\", it should parse Windows paths as well.
 *
 * @module filename.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
var PKFILE = {
  /**
   * @property Version
   * @type {String}
   */
  version:              "00.04.100",
  /**
   * Specifies the characters that are not allowed in file names.
   * @property invalidCharacters
   * @default ["/","\",":","|","<",">","*","?",";","%"]
   * @type {Array}
   */
  invalidCharacters:    "/,\\,:,|,<,>,*,?,;,%".split( "," ),
  /**
   * Indicates the character that separates a name from its extension,
   * as in "filename.ext".
   * @property extensionSeparator
   * @default "."
   * @type {String}
   */
  extensionSeparator:   ".",
  /**
   * Indicates the character that separates path components.
   * @property pathSeparator
   * @default "/"
   * @type {String}
   */
  pathSeparator:        "/",
  /**
   * Indicates the character used when replacing invalid characters
   * @property replacementCharacter
   * @default "-"
   * @type {String}
   */
  replacementCharacter: "-",
  /**
   * Converts a potential invalid filename to a valid filename by replacing
   * invalid characters (as specified in "invalidCharacters") with "replacementCharacter".
   *
   * @method makeValid
   * @param  {String} theFileName
   * @return {String}
   */
  makeValid:            function ( theFileName ) {
    var self = PKFILE;
    var theNewFileName = theFileName;
    for ( var i = 0; i < self.invalidCharacters.length; i++ ) {
      var d = 0;
      while ( theNewFileName.indexOf( self.invalidCharacters[i] ) > -1 && ( d++ ) < 50 ) {
        theNewFileName = theNewFileName.replace( self.invalidCharacters[i], self.replacementCharacter );
      }
    }
    return theNewFileName;
  },
  /**
   * Returns the name+extension portion of a full path.
   *
   * @method getFilePart
   * @param  {String} theFileName
   * @return {String}
   */
  getFilePart:          function ( theFileName ) {
    var self = PKFILE;
    var theSlashPosition = theFileName.lastIndexOf( self.pathSeparator );
    if ( theSlashPosition < 0 ) {
      return theFileName;
    }
    return theFileName.substr( theSlashPosition + 1, theFileName.length - theSlashPosition );
  },
  /**
   * Returns the path portion of a full path.
   * @method getPathPart
   * @param  {String} theFileName
   * @return {String}
   */
  getPathPart:          function ( theFileName ) {
    var self = PKFILE;
    var theSlashPosition = theFileName.lastIndexOf( self.pathSeparator );
    if ( theSlashPosition < 0 ) {
      return "";
    }
    return theFileName.substr( 0, theSlashPosition + 1 );
  },
  /**
   * Returns the filename, minus the extension.
   * @method getFileNamePart
   * @param  {String} theFileName
   * @return {String}
   */
  getFileNamePart:      function ( theFileName ) {
    var self = PKFILE;
    var theFileNameNoPath = self.getFilePart( theFileName );
    var theDotPosition = theFileNameNoPath.lastIndexOf( self.extensionSeparator );
    if ( theDotPosition < 0 ) {
      return theFileNameNoPath;
    }
    return theFileNameNoPath.substr( 0, theDotPosition );
  },
  /**
   * Returns the extension of a filename
   * @method getFileExtensionPart
   * @param  {String} theFileName
   * @return {String}
   */
  getFileExtensionPart: function ( theFileName ) {
    var self = PKFILE;
    var theFileNameNoPath = self.getFilePart( theFileName );
    var theDotPosition = theFileNameNoPath.lastIndexOf( self.extensionSeparator );
    if ( theDotPosition < 0 ) {
      return "";
    }
    return theFileNameNoPath.substr( theDotPosition + 1, theFileNameNoPath.length - theDotPosition - 1 );
  }
};
module.exports = PKFILE;

},{}],16:[function(require,module,exports){
/**
 *
 * # h - simple DOM templating
 *
 * @module h.js
 * @author Kerri Shotts
 * @version 0.1
 *
 * ```
 * Copyright (c) 2014 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 *
 * Generates a DOM tree (or just a single node) based on a series of method calls
 * into **h**. **h** has one root method (`el`) that creates all DOM elements, but also has
 * helper methods for each HTML tag. This means that a UL can be created simply by
 * calling `h.ul`.
 *
 * Technically there's no such thing as a template using this library, but functions
 * encapsulating a series of h calls function as an equivalent if properly decoupled
 * from their surrounds.
 *
 * Templates are essentially methods attached to the DOM using `h.renderTo(templateFn(context,...))`
 * and return DOM node elements or arrays. For example:
 *
 * ```
 * function aTemplate ( context ) {
 *   return h.div (
 *     [ h.span ( context.title ), h.span ( context.description ) ]
 *   );
 * };
 * ```
 *
 * The resulting DOM tree looks like this (assuming `context` is defined as
 * `{title: "Title", description: "Description"}`:
 *
 * ```
 * <div>
 *   <span>Title</span>
 *   <span>Description</span>
 * </div>
 * ```
 *
 * Template results are added to the DOM using `h.renderTo`:
 *
 * ```
 * h.renderTo ( aDOMElement, aTemplate ( context ) );
 * ```
 *
 * Technically `appendChild` could be used, but it's possible that an attribute
 * might just return an array of DOM nodes, in which case `appendChild` fails.
 *
 * There are also a variety of utility methods defined in **h**, such as:
 * - `forEach ( arr, fn )` -- this executes `arr.map(fn)`.
 * - `forIn ( object, fn )` -- iterates over each property owned by `object` and calls `fn`
 * - `ifdef ( expr, a, b )` -- determines if `expr` is defined, and if so, returns `a`, otherwise `b`
 * - `iif ( expr, a, b )` -- returns `a` if `expr` evaluates to true, otherwise `b`
 *
 * When constructing Node elements using `h`, it's important to recognize that an underlying
 * function called `el` is being called (and can be called directly). The order parameters here is
 * somewhat malleable - only the first parameter must be the tag name (when using `el`). Otherwise,
 * the options for the tag must be within the first three parameters. The text content or value content
 * for the tag must be in the same first three parameters. For example:
 *
 * ```
 * return h.el("div", { attrs: { id: "anElement" } }, "Text content");
 * ```
 *
 * is equivalent to:
 *
 * ```
 * return h.el("div", "Text Content", { attrs: { id: "anElement" } } );
 * ```
 *
 * which is also in turn equivalent to:
 *
 * ```
 * return h.div("Text Content", { attrs: { id: "anElement" } } );
 * ```
 *
 * If an object has both text and value content (like buttons), the first string or number is used
 * as the `value` and the second is used as `textContent`:
 *
 * ```
 * return h.button("This goes into value attribute", "This is in textContent");
 * ```
 *
 * So why `el` and `h.div` equivalents? If you need to specify a custom tag OR want to use shorthand
 * you'll want to use `el`. If you don't need to specify shorthand properties, use the easier-to-read
 * `h.tagName`. For example:
 *
 * ```
 * return h.p ( "paragraph content" );
 * return h.el ( "p", "paragraph content" );
 *
 * return h.el ( "input#txtUsername.bigField?type=text&size=20", "starting value" );
 * return h.input ( { attrs: { type: "text", size: "20", class: "bigField", id: "txtUserName" } },
 *                  "starting value" );
 * ```
 *
 * When specifying tag options, you have several options that can be specified:
 * * attributes using `attrs` object
 * * styles using `styles` object
 * * event handlers using `on` object
 * * hammer handlers using `hammer` object
 * * data binding using `bind` object
 * * store element references to a container object using `storeTo` object
 *
 *
 */
/*global module, Node, document*/
"use strict";
var BaseObject = require( "./object" );
/**
 *
 * internal private method to handle parsing children
 * and attaching them to their parents
 *
 * If the child is a `Node`, it is attached directly to the parent as a child
 * If the child is a `function`, the *resuts* are re-parsed, ultimately to be attached to the parent
 *   as children
 * If the child is an `Array`, each element within the array is re-parsed, ultimately to be attached
 *   to the parent as children
 *
 * @method handleChild
 * @private
 * @param {Array|Function|Node} child       child to handle and attach
 * @param {Node} parent                     parent
 *
 */
function handleChild( child, parent ) {
  if ( typeof child === "object" ) {
    if ( child instanceof Array ) {
      for ( var i = 0, l = child.length; i < l; i++ ) {
        handleChild( child[i], parent );
      }
    }
    if ( child instanceof Node ) {
      parent.appendChild( child );
    }
  }
  if ( typeof child === "function" ) {
    handleChild( child(), parent );
  }
}
/**
 * parses an incoming tag into its tag `name`, `id`, and `class` constituents
 * A tag is of the form `tagName.class#id` or `tagName#id.class`. The `id` and `class`
 * are optional.
 *
 * If attributes need to be supplied, it's possible via the `?` query string. Attributes
 * are of the form `?attr=value&attr=value...`.
 *
 * @method parseTag
 * @private
 * @param {string} tag      tag to parse
 * @return {*} Object of the form `{ tag: tagName, id: id, class: class, query: query, queryPars: Array }`
 */
function parseTag( tag ) {
  var tagParts = {
      tag:        "",
      id:         undefined,
      class:      undefined,
      query:      undefined,
      queryParts: []
    },
    hashPos = tag.indexOf( "#" ),
    dotPos = tag.indexOf( "." ),
    qmPos = tag.indexOf( "?" );
  if ( qmPos >= 0 ) {
    tagParts.query = tag.substr( qmPos + 1 );
    tagParts.queryParts = tagParts.query.split( "&" );
    tag = tag.substr( 0, qmPos );
  }
  if ( hashPos < 0 && dotPos < 0 ) {
    tagParts.tag = tag;
    return tagParts;
  }
  if ( hashPos >= 0 && dotPos < 0 ) {
    tagParts.tag = tag.substr( 0, hashPos );
    tagParts.id = tag.substr( hashPos + 1 );
    return tagParts;
  }
  if ( dotPos >= 0 && hashPos < 0 ) {
    tagParts.tag = tag.substr( 0, dotPos );
    tagParts.class = tag.substr( dotPos + 1 );
    return tagParts;
  }
  if ( dotPos >= 0 && hashPos >= 0 && hashPos < dotPos ) {
    tagParts.tag = tag.substr( 0, hashPos );
    tagParts.id = tag.substr( hashPos + 1, ( dotPos - hashPos ) - 1 );
    tagParts.class = tag.substr( dotPos + 1 );
    return tagParts;
  }
  if ( dotPos >= 0 && hashPos >= 0 && dotPos < hashPos ) {
    tagParts.tag = tag.substr( 0, dotPos );
    tagParts.class = tag.substr( dotPos + 1, ( hashPos - dotPos ) - 1 );
    tagParts.id = tag.substr( hashPos + 1 );
    return tagParts;
  }
  return tagParts;
}
var globalEvents = {},
  renderEvents = {};
var globalSequence = 0;

function getAndSetElementId( e ) {
  var id = e.getAttribute( "id" );
  if ( id === undefined || id === null ) {
    globalSequence++;
    id = "h-y-" + globalSequence;
    e.setAttribute( "id", id );
  }
  return id;
}
/**
 * h templating engine
 */
var h = {
    VERSION:       "0.1.100",
    useDomMerging: false,
    debug:         false,
    _globalEvents: globalEvents,
    _renderEvents: renderEvents,
    /* experimental! */
    /**
     * Returns a DOM tree containing the requested element and any further child
     * elements (as extra parameters)
     *
     * `tagOptions` should be an object consisting of the following optional segments:
     *
     * ```
     * {
       *    attrs: {...}                     attributes to add to the element
       *    styles: {...}                    style attributes to add to the element
       *    on: {...}                        event handlers to attach to the element
       *    hammer: {...}                    hammer handlers
       *    bind: { object:, keyPath:, keyType: }      data binding
       *    store: { object:, keyPath:, idOnly: }     store element to object.keyPath
       * }
     * ```
     *
     * @method el
     * @param {string} tag                 tag of the form `tagName.class#id` or `tagName#id.class`
     *                                     tag can also specify attributes:
     *                                        `input?type=text&size=20`
     * @param {*} tagOptions               options for the tag (see above)
     * @param {Array|Function|String} ...  children that should be attached
     * @returns {Node}                     DOM tree
     *
     */
    el:            function ( tag ) {
      var e, i, l, f, evt,
        options,
        content = [],
        contentTarget = [],
        bindValue,
        tagParts = parseTag( tag ),
        elid,
        events = [];

      // parse tag; it should be of the form `tag[#id][.class][?attr=value[&attr=value...]`
      // create the element; if `@DF` is used, a document fragment is used instead
      if ( tagParts.tag !== "@DF" ) {
        e = document.createElement( tagParts.tag );
      } else {
        e = document.createDocumentFragment();
      }
      // attach the `class` and `id` from the tag name, if available
      if ( tagParts.class !== undefined ) {
        e.className = tagParts.class;
      }
      if ( tagParts.id !== undefined ) {
        elid = tagParts.id;
        e.setAttribute( "id", tagParts.id );
      }
      // get the arguments as an array, ignoring the first parameter
      var args = Array.prototype.slice.call( arguments, 1 );
      // determine what we've passed in the second/third parameter
      // if it is an object (but not a node or array), it's a list of
      // options to attach to the element. If it is a string, it's text
      // content that should be added using `textContent` or `value`
      // > note: we could parse the entire argument list, but that would
      // > a bit absurd.
      for ( i = 0; i < 3; i++ ) {
        if ( typeof args[0] !== "undefined" ) {
          if ( typeof args[0] === "object" ) {
            // could be a DOM node, an array, or tag options
            if ( !( args[0] instanceof Node ) && !( args[0] instanceof Array ) ) {
              options = args.shift();
            }
          }
          if ( typeof args[0] === "string" || typeof args[0] === "number" ) {
            // this is text content
            content.push( args.shift() );
          }
        }
      }
      // copy over any `queryParts` attributes
      if ( tagParts.queryParts.length > 0 ) {
        var arr;
        for ( i = 0, l = tagParts.queryParts.length; i < l; i++ ) {
          arr = tagParts.queryParts[i].split( "=" );
          if ( arr.length === 2 ) {
            e.setAttribute( arr[0].trim(), arr[1].trim() );
          }
        }
      }
      // copy over any attributes and styles in `options.attrs` and `options.style`
      if ( typeof options === "object" && options !== null ) {
        // add attributes
        if ( options.attrs ) {
          for ( var attr in options.attrs ) {
            if ( options.attrs.hasOwnProperty( attr ) ) {
              if ( options.attrs[attr] !== undefined && options.attrs[attr] !== null ) {
                e.setAttribute( attr, options.attrs[attr] );
              }
            }
          }
        }
        // add styles
        if ( options.styles ) {
          for ( var style in options.styles ) {
            if ( options.styles.hasOwnProperty( style ) ) {
              if ( options.styles[style] !== undefined && options.styles[style] !== null ) {
                e.style[style] = options.styles[style];
              }
            }
          }
        }
        // add event handlers; handler property is expected to be a valid DOM
        // event, i.e. `{ "change": function... }` or `{ change: function... }`
        // if the handler is an object, it must be of the form
        // ```
        //   { handler: function ...,
        //     capture: true/false }
        // ```
        if ( options.on ) {
          for ( evt in options.on ) {
            if ( options.on.hasOwnProperty( evt ) ) {
              if ( typeof options.on[evt] === "function" ) {
                f = options.on[evt].bind( e );
                /*events.push( {
                 type: "on",
                 evt: evt,
                 handler: f,
                 capture: false
                 } ); */
                e.addEventListener( evt, f, false );
              } else {
                f = options.on[evt].handler.bind( e );
                /*events.push( {
                 type: "on",
                 evt: evt,
                 handler: f,
                 capture: typeof options.on[ evt ].capture !== "undefined" ? options.on[ evt ].capture : false
                 } ); */
                e.addEventListener( evt, f, typeof options.on[evt].capture !== "undefined" ? options.on[evt].capture :
                                            false );
              }
            }
          }
        }
        // we support hammer too, assuming we're given a reference
        // it must be of the form `{ hammer: { gesture: { handler: fn, options: }, hammer: hammer } }`
        if ( options.hammer ) {
          var hammer = options.hammer.hammer;
          for ( evt in options.hammer ) {
            if ( options.hammer.hasOwnProperty( evt ) && evt !== "hammer" ) {
              /*events.push( {
               type: "hammer",
               evt: evt,
               hammer: hammer,
               options: options.hammer[ evt ]
               } );*/
              hammer( e, options.hammer[evt].options ).on( evt, options.hammer[evt].handler );
            }
          }
        }
        // allow elements to be stored into a context
        // store must be an object of the form `{object:objectRef, keyPath: "keyPath", [idOnly:true|false] }`
        // if idOnly is true, only the element's id is stored
        if ( options.store ) {
          if ( options.store.idOnly ) {
            elid = getAndSetElementId( e );
            options.store.object[options.store.keyPath] = elid;
          } else {
            options.store.object[options.store.keyPath] = e;
          }
        }
      }
      // if we have content, go ahead and add it;
      // if we're an element that has a `value`, we attach it to the value
      // property instead of `textContent`. If `textContent` is not available
      // we use `innerText`; if that's not available, we complain and do
      // nothing. Falling back to `innerHTML` isn't an option, as that's what
      // we are explicitly trying to avoid.
      //
      // First, determine if we have `value` and `textContent` options or only
      // `textContent` (buttons have both) If both are present, the first
      // content item is applied to `value`, and the second is applied to
      // `textContent`|`innerText`
      if ( typeof e.value !== "undefined" ) {
        contentTarget.push( "value" );
      }
      if ( ( typeof e.textContent !== "undefined" ) || ( typeof e.innerText !== "undefined" ) ) {
        contentTarget.push( typeof e.textContent !== "undefined" ? "textContent" : "innerText" );
      }
      for ( i = 0, l = contentTarget.length; i < l; i++ ) {
        var x = content.shift();
        if ( typeof x !== "undefined" ) {
          e[contentTarget[i]] = x;
        }
      }
      // Handle children; `handleChild` appends each one to the parent
      var child;
      for ( i = 0, l = args.length; i < l; i++ ) {
        child = args[i];
        handleChild( child, e );
      }
      if ( typeof options === "object" && options !== null ) {
        // Data binding only occurs if using YASMF's BaseObject for now (built-in pubsub/observables)
        // along with observable properties
        // the binding object is of the form `{ object: objectRef, keyPath: "keyPath", [keyType:"string"] }`
        if ( options.bind ) {
          if ( typeof BaseObject !== "undefined" ) {
            if ( options.bind.object instanceof BaseObject ) {
              elid = getAndSetElementId( e );
              // we have an object that has observable properties
              options.bind.object.dataBindOn( e, options.bind.keyPath, options.bind.keyType );
              options.bind.object.notifyDataBindingElementsForKeyPath( options.bind.keyPath );
            }
          }
        }
      }
      //renderEvents[elid] = events;
      // return the element (and associated tree)
      return e;
    },
    /**
     * mapTo - Maps a keypath to another keypath based on `map`. `map` should look like this:
     *
     * ```
     * {
       *   "mapping_key": "target_key", ...
       * }
     * ```
     *
     * For example, let's assume that some object `o` has the properties `id` and `name`. We
     * want to map these to consistent values like `value` and `description` for a component.
     * `map` should look like this: `{ "value": "id", "description": "name" }`. In this case
     * calling `mapTo("value", map)` would return `id`, which could then be indexed on `o`
     * like so: `o[mapTo("value",map)]`.
     *
     * @method mapTo
     * @param  {String}    keyPath to map
     * @param  {*} map     map description
     * @return {String}    mapped keyPath
     */
    mapTo:         function mapTo( keyPath, map ) {
      if ( typeof map === "undefined" ) {
        return keyPath;
      }
      if ( typeof map[keyPath] !== "undefined" ) {
        return map[keyPath];
      } else {
        return keyPath;
      }
    },
    /**
     * iif - evaluate `expr` and if it is `true`, return `a`. If it is false,
     * return `b`. If `a` is not supplied, `true` is the return result if `a`
     * would have been returned. If `b` is not supplied, `false` is the return
     * result if `b` would have been returned. Not much difference than the
     * ternary (`?:`) operator, but might be easier to read for some.
     *
     * @method iif
     * @param  {boolean} expr expression to evaluate
     * @param  {*} a     value to return if `expr` is true; `true` is the default if not supplied
     * @param  {*} b     value to return if `expr` is false; `false` is the default if not supplied
     * @return {*}       `expr ? a : b`
     */
    iif:           function iif( expr, a, b ) {
      return expr ? ( ( typeof a !== "undefined" ) ? a : true ) : ( ( typeof b !== "undefined" ) ? b : false );
    },
    /**
     * ifdef - Check if an expression is defined and return `a` if it is and `b`
     * if it isn't. If `a` is not supplied, `a` evaluates to `true` and if `b`
     * is not supplied, `b` evaluates to `false`.
     *
     * @method ifdef
     * @param  {boolean} expr expression to check
     * @param  {*}       a    value to return if expression is defined
     * @param  {*}       b    value to return if expression is not defined
     * @return {*}       a or b
     */
    ifdef:         function ifdef( expr, a, b ) {
      return ( typeof expr !== "undefined" ) ? ( ( typeof a !== "undefined" ) ? a : true ) : ( ( typeof b !== "undefined" ) ?
                                                                                               b : false );
    },
    /**
     * forIn - return an array containing the results of calling `fn` for
     * each property within `object`. Equivalent to `map` on an array.
     *
     * The function should have the signature `( value, object, property )`
     * and return the result. The results will automatically be collated in
     * an array.
     *
     * @method forIn
     * @param  {*}        object object to iterate over
     * @param  {function} fn     function to call
     * @return {Array}           resuts
     */
    forIn:         function forIn( object, fn ) {
      var arr = [];
      for ( var prop in object ) {
        if ( object.hasOwnProperty( prop ) ) {
          arr.push( fn( object[prop], object, prop ) );
        }
      }
      return arr;
    },
    /**
     * forEach - Executes `map` on an array, calling `fn`. Named such because
     * it makes more sense than using `map` in a template, but it means the
     * same thing.
     *
     * @method forEach
     * @param  {Array}    arr Array to iterate
     * @param  {function} fn  Function to call
     * @return {Array}        Array after iteration
     */
    forEach:       function forEach( arr, fn ) {
      return arr.map( fn );
    },
    /**
     * renderTo - Renders a node or array of nodes to a given element. If an
     * array is provided, each is appended in turn.
     *
     * Note: technically you can just use `appendChild` or equivalent DOM
     * methods, but this works only as far as the return result is a single
     * node. Occasionally your template may return an array of nodes, and
     * at that point `appendChild` fails.
     *
     * @method renderTo
     * @param  {Array|Node} n  Array or single node to append to the element
     * @param  {Node} el Element to attach to
     * @param  {Number} idx  index (optional)
     */
    renderTo:      function renderTo( n, el, idx ) {
      function transform( parent, nodeA, nodeB ) {
        var hasChildren = [false, false],
          childNodes = [
            [],
            []
          ],
          _A = 0,
          _B = 1,
          i, l,
          len = [0, 0],
          nodes = [nodeA, nodeB],
          attrs = [
            [],
            []
          ],
          styles = [{}, {}],
          styleKeys = [
            [],
            []
          ],
          events = [
            [],
            []
          ],
          elid = [null, null];
        if ( !nodeA && !nodeB ) {
          // nothing to do.
          return;
        }
        if ( !nodeA && nodeB ) {
          // there's no corresponding element in A; just add B.
          parent.appendChild( nodeB );
          return;
        }
        if ( nodeA && !nodeB ) {
          // there's no corresponding element in B; remove A's element
          nodeA.remove();
          return;
        }
        if ( ( nodeA.nodeType !== nodeB.nodeType ) || ( nodeB.nodeType !== 1 ) ) {
          // if the node types are different, there's no reason to transform tree A -- just replace the whole thing
          parent.replaceChild( nodeB, nodeA );
          return;
        }
        if ( nodeB.classList ) {
          if ( !nodeB.classList.contains( "ui-container" ) && !nodeB.classList.contains( "ui-list" ) && !nodeB.classList.contains(
              "ui-scroll-container" ) ) {
            // if the node types are different, there's no reason to transform tree A -- just replace the whole thing
            parent.replaceChild( nodeB, nodeA );
            return;
          }
        }
        // set up for transforming this node
        nodes.forEach( function init( node, idx ) {
          hasChildren[idx] = node.hasChildNodes();
          len[idx] = node.childNodes.length;
          if ( node.getAttribute ) {
            elid[idx] = node.getAttribute( "id" );
          }
          if ( node.childNodes ) {
            childNodes[idx] = [].slice.call( node.childNodes, 0 );
          }
          if ( node.attributes ) {
            attrs[idx] = [].slice.call( node.attributes, 0 );
          }
          if ( node.styles ) {
            styles[idx] = node.style;
            styleKeys[idx] = Object.keys( styles[idx] );
          }
        } );
        //events[_A] = globalEvents[elid[_A]] || [];
        //events[_B] = renderEvents[elid[_B]] || [];
        // transform all our children
        for ( i = 0, l = Math.max( len[_A], len[_B] ); i < l; i++ ) {
          transform( nodeA, childNodes[_A][i], childNodes[_B][i] );
        }
        // copy attributes
        for ( i = 0, l = Math.max( attrs[_A].length, attrs[_B].length ); i < l; i++ ) {
          if ( attrs[_A][i] ) {
            if ( !nodeB.hasAttribute( attrs[_A][i].name ) ) {
              // remove any attributes that aren't present in B
              nodeA.removeAttribute( attrs[_A][i].name );
            }
          }
          if ( attrs[_B][i] ) {
            nodeA.setAttribute( attrs[_B][i].name, attrs[_B][i].value );
          }
        }
        // copy styles
        for ( i = 0, l = Math.max( styles[_A].length, styles[_B].length ); i < l; i++ ) {
          if ( styles[_A][i] ) {
            if ( !( styleKeys[_B][i] in styleKeys[_A] ) ) {
              // remove any styles that aren't present in B
              nodeA.style[styleKeys[_B][i]] = null;
            }
          }
          if ( styles[_B][i] ) {
            nodeA.style[styleKeys[_B][i]] = styles[_B][styleKeys[_B][i]];
          }
        }
        // copy events
        /*for ( i = 0, l = Math.max( events[ _A ].length, events[ _B ].length ); i < l; i++ ) {
         [ 0, 1 ].forEach( function doANode( whichNode ) {
         var evt = events[ whichNode ][ i ],
         node = nodes[ whichNode ],
         handler;
         if ( evt ) {
         switch ( evt.type ) {
         case "on":
         handler = whichNode === _A ? "removeEventListener" : "addEventListener";
         nodeA[ handler ]( evt.evt, evt.handler, evt.capture );
         break;
         case "hammer":
         handler = whichNode === _A ? "off" : "on";
         console.log( handler, nodeA, evt.evt, evt.options.handler );
         evt.hammer( nodeA, evt.options.options )[ handler ]( evt.evt, evt.options.handler );
         break;
         default:
         }
         }
         } );
         }
         if ( elid[ _A ] ) {
         globalEvents[ elid[ _A ] ] = null;
         delete globalEvents[ elid[ _A ] ];
         }
         if ( elid[ _B ] ) {
         globalEvents[ elid[ _B ] ] = renderEvents[ elid[ _B ] ];
         renderEvents[ elid[ _B ] ] = null;
         delete renderEvents[ elid[ _B ] ];
         }*/
      }

      if ( !idx ) {
        idx = 0;
      }
      if ( n instanceof Array ) {
        for ( var i = 0, l = n.length; i < l; i++ ) {
          if ( n[i] !== undefined && n[i] !== null ) {
            renderTo( n[i], el, i );
          }
        }
      } else {
        if ( n === undefined || n === null || el === undefined || el === null ) {
          return;
        }
        var elid = [null, null];
        /*if ( n ) {
         elid[1] = n.getAttribute( "id" );
         }*/
        if ( el.hasChildNodes() && idx < el.childNodes.length ) {
          elid[0] = el.childNodes[idx].getAttribute( "id" );
          if ( h.useDomMerging ) {
            transform( el, el.childNodes[idx], n );
          } else {
            el.replaceChild( n, el.childNodes[idx] );
          }
        } else {
          el.appendChild( n );
        }
        /*
         if ( elid[ 0 ] ) {
         globalEvents[ elid[ 0 ] ] = null;
         delete globalEvents[ elid[ 0 ] ];
         }
         if ( elid[ 1 ] ) {
         globalEvents[ elid[ 1 ] ] = renderEvents[ elid[ 1 ] ];
         renderEvents[ elid[ 1 ] ] = null;
         delete renderEvents[ elid[ 1 ] ];
         }*/
      }
    }
  },
// create bindings for each HTML element (from: https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
  els = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi",
         "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code",
         "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div",
         "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frameset", "h1",
         "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "isindex",
         "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta",
         "meter", "nav", "nobr", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture",
         "plaintext", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "shadow", "small",
         "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template",
         "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"
  ];
els.forEach( function ( el ) {
  h[el] = h.el.bind( h, el );
} );
// bind document fragment too
h.DF = h.el.bind( h, "@DF" );
h.dF = h.DF;
module.exports = h;

},{"./object":18}],17:[function(require,module,exports){
/**
 *
 * Provides miscellaneous functions that had no other category.
 *
 * @module misc.js
 * @author Kerri Shotts
 * @version 0.4
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module*/
"use strict";
module.exports = {
  /**
   * Returns a pseudo-UUID. Not guaranteed to be unique (far from it, probably), but
   * close enough for most purposes. You should handle collisions gracefully on your
   * own, of course. see http://stackoverflow.com/a/8809472
   * @method makeFauxUUID
   * @return {String}
   */
  makeFauxUUID: function () {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace( /[xy]/g, function ( c ) {
      var r = ( d + Math.random() * 16 ) % 16 | 0;
      d = Math.floor( d / 16 );
      return ( c === "x" ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
    } );
    return uuid;
  }
};

},{}],18:[function(require,module,exports){
/**
 *
 * # Base Object
 *
 * @module object.js
 * @author Kerri Shotts
 * @version 0.5
 * ```
 * Copyright (c) 2013 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module, console, setTimeout*/
"use strict";
var _className = "BaseObject",
  /**
   * BaseObject is the base object for all complex objects used by YASMF;
   * simpler objects that are properties-only do not inherit from this
   * class.
   *
   * BaseObject provides simple inheritance, but not by using the typical
   * prototypal method. Rather inheritance is formed by object composition
   * where all objects are instances of BaseObject with methods overridden
   * instead. As such, you can *not* use any Javascript type checking to
   * differentiate PKObjects; you should instead use the `class`
   * property.
   *
   * BaseObject provides inheritance to more than just a constructor: any
   * method can be overridden, but it is critical that the super-chain
   * be properly initialized. See the `super` and `overrideSuper`
   * methods for more information.
   *
   * @class BaseObject
   */
  BaseObject = function () {
    var self = this;
    /**
     *
     * We need a way to provide inheritance. Most methods only provide
     * inheritance across the constructor chain, not across any possible
     * method. But for our purposes, we need to be able to provide for
     * overriding any method (such as drawing, touch responses, etc.),
     * and so we implement inheritance in a different way.
     *
     * First, the _classHierarchy, a private property, provides the
     * inheritance tree. All objects inherit from "BaseObject".
     *
     * @private
     * @property _classHierarchy
     * @type Array
     * @default ["BaseObject"]
     */
    self._classHierarchy = [_className];
    /**
     *
     * Objects are subclassed using this method. The newClass is the
     * unique class name of the object (and should match the class'
     * actual name.
     *
     * @method subclass
     * @param {String} newClass - the new unique class of the object
     */
    self.subclass = function ( newClass ) {
      self._classHierarchy.push( newClass );
    };
    /**
     *
     * getClass returns the current class of the object. The
     * `class` property can be used as well. Note that there
     * is no `setter` for this property; an object's class
     * can *not* be changed.
     *
     * @method getClass
     * @returns {String} the class of the instance
     *
     */
    self.getClass = function () {
      return self._classHierarchy[self._classHierarchy.length - 1];
    };
    /**
     *
     * The class of the instance. **Read-only**
     * @property class
     * @type String
     * @readOnly
     */
    Object.defineProperty( self, "class", {
      get:          self.getClass,
      configurable: false
    } );
    /**
     *
     * Returns the super class for the given class. If the
     * class is not supplied, the class is assumed to be the
     * object's own class.
     *
     * The property "superClass" uses this to return the
     * object's direct superclass, but getSuperClassOfClass
     * can be used to determine superclasses higher up
     * the hierarchy.
     *
     * @method getSuperClassOfClass
     * @param {String} [aClass=currentClass] the class for which you want the super class. If not specified,
     *                                        the instance's class is used.
     * @returns {String} the super-class of the specified class.
     */
    self.getSuperClassOfClass = function ( aClass ) {
      var theClass = aClass || self.class;
      var i = self._classHierarchy.indexOf( theClass );
      if ( i > -1 ) {
        return self._classHierarchy[i - 1];
      } else {
        return null;
      }
    };
    /**
     *
     * The superclass of the instance.
     * @property superClass
     * @type String
     */
    Object.defineProperty( self, "superClass", {
      get:          self.getSuperClassOfClass,
      configurable: false
    } );
    /**
     *
     * _super is an object that stores overridden functions by class and method
     * name. This is how we get the ability to arbitrarily override any method
     * already present in the superclass.
     *
     * @private
     * @property _super
     * @type Object
     */
    self._super = {};
    /**
     *
     * Must be called prior to defining the overridden function as this moves
     * the original function into the _super object. The functionName must
     * match the name of the method exactly, since there may be a long tree
     * of code that depends on it.
     *
     * @method overrideSuper
     * @param {String} theClass  the class for which the function override is desired
     * @param {String} theFunctionName  the name of the function to override
     * @param {Function} theActualFunction  the actual function (or pointer to function)
     *
     */
    self.overrideSuper = function ( theClass, theFunctionName, theActualFunction ) {
      var superClass = self.getSuperClassOfClass( theClass );
      if ( !self._super[superClass] ) {
        self._super[superClass] = {};
      }
      self._super[superClass][theFunctionName] = theActualFunction;
    };
    /**
     * @method override
     *
     * Overrides an existing function with the same name as `theNewFunction`. Essentially
     * a call to `overrideSuper (self.class, theNewFunction.name, self[theNewFunction.name])`
     * followed by the redefinition of the function.
     *
     * @example
     * ```
     * obj.override ( function initWithOptions ( options )
     *                { ... } );
     * ```
     *
     * @param {Function} theNewFunction - The function to override. Must have the name of the overriding function.
     */
    self.override = function ( theNewFunction ) {
      var theFunctionName = theNewFunction.name,
        theOldFunction = self[theFunctionName];
      if ( theFunctionName !== "" ) {
        self.overrideSuper( self.class, theFunctionName, theOldFunction );
        self[theFunctionName] = function __super__() {
          var ret,
            old$class = self.$class,
            old$superclass = self.$superclass,
            old$super = self.$super;
          self.$class = self.class;
          self.$superclass = self.superClass;
          self.$super = function $super() {
            return theOldFunction.apply( this, arguments );
          };
          try {
            ret = theNewFunction.apply( this, arguments );
          }
          catch ( err ) {
            throw err;
          }
          finally {
            self.$class = old$class;
            self.$superclass = old$superclass;
            self.$super = old$super;
          }
          return ret;
        };
      }
    };
    /**
     *
     * Calls a super function with any number of arguments.
     *
     * @method super
     * @param {String} theClass  the current class instance
     * @param {String} theFunctionName the name of the function to execute
     * @param {Array} [args]  Any number of parameters to pass to the super method
     *
     */
    self.super = function ( theClass, theFunctionName, args ) {
      var superClass = self.getSuperClassOfClass( theClass );
      if ( self._super[superClass] ) {
        if ( self._super[superClass][theFunctionName] ) {
          return self._super[superClass][theFunctionName].apply( self, args );
        }
        return null;
      }
      return null;
    };
    /**
     * Category support; for an object to get category support for their class,
     * they must call this method prior to any auto initialization
     *
     * @method _constructObjectCategories
     *
     */
    self._constructObjectCategories = function _constructObjectCategories( pri ) {
      var priority = BaseObject.ON_CREATE_CATEGORY;
      if ( typeof pri !== "undefined" ) {
        priority = pri;
      }
      if ( typeof BaseObject._objectCategories[priority][self.class] !== "undefined" ) {
        BaseObject._objectCategories[priority][self.class].forEach( function ( categoryConstructor ) {
          try {
            categoryConstructor( self );
          }
          catch ( e ) {
            console.log( "Error during category construction: " + e.message );
          }
        } );
      }
    };
    /**
     *
     * initializes the object
     *
     * @method init
     *
     */
    self.init = function () {
      self._constructObjectCategories( BaseObject.ON_INIT_CATEGORY );
      return self;
    };
    /*
     *
     * Objects have some properties that we want all objects to have...
     *
     */
    /**
     * Stores the values of all the tags associated with the instance.
     *
     * @private
     * @property _tag
     * @type Object
     */
    self._tags = {};
    /**
     *
     * Stores the *listeners* for all the tags associated with the instance.
     *
     * @private
     * @property _tagListeners
     * @type Object
     */
    self._tagListeners = {};
    /**
     *
     * Sets the value for a specific tag associated with the instance. If the
     * tag does not exist, it is created.
     *
     * Any listeners attached to the tag via `addTagListenerForKey` will be
     * notified of the change. Listeners are passed three parameters:
     * `self` (the originating instance),
     * `theKey` (the tag being changed),
     * and `theValue` (the value of the tag); the tag is *already* changed
     *
     * @method setTagForKey
     * @param {*} theKey  the name of the tag; "__default" is special and
     *                     refers to the default tag visible via the `tag`
     *                     property.
     * @param {*} theValue  the value to assign to the tag.
     *
     */
    self.setTagForKey = function ( theKey, theValue ) {
      self._tags[theKey] = theValue;
      var notifyListener = function ( theListener, theKey, theValue ) {
        return function () {
          theListener( self, theKey, theValue );
        };
      };
      if ( self._tagListeners[theKey] ) {
        for ( var i = 0; i < self._tagListeners[theKey].length; i++ ) {
          setTimeout( notifyListener( self._tagListeners[theKey][i], theKey, theValue ), 0 );
        }
      }
    };
    /**
     *
     * Returns the value for a given key. If the key does not exist, the
     * result is undefined.
     *
     * @method getTagForKey
     * @param {*} theKey  the tag; "__default" is special and refers to
     *                     the default tag visible via the `tag` property.
     * @returns {*} the value of the key
     *
     */
    self.getTagForKey = function ( theKey ) {
      return self._tags[theKey];
    };
    /**
     *
     * Add a listener to a specific tag. The listener will receive three
     * parameters whenever the tag changes (though they are optional). The tag
     * itself doesn't need to exist in order to assign a listener to it.
     *
     * The first parameter is the object for which the tag has been changed.
     * The second parameter is the tag being changed, and the third parameter
     * is the value of the tag. **Note:** the value has already changed by
     * the time the listener is called.
     *
     * @method addListenerForKey
     * @param {*} theKey The tag for which to add a listener; `__default`
     *                     is special and refers the default tag visible via
     *                     the `tag` property.
     * @param {Function} theListener  the function (or reference) to call
     *                    when the value changes.
     */
    self.addTagListenerForKey = function ( theKey, theListener ) {
      if ( !self._tagListeners[theKey] ) {
        self._tagListeners[theKey] = [];
      }
      self._tagListeners[theKey].push( theListener );
    };
    /**
     *
     * Removes a listener from being notified when a tag changes.
     *
     * @method removeTagListenerForKey
     * @param {*} theKey  the tag from which to remove the listener; `__default`
     *                     is special and refers to the default tag visible via
     *                     the `tag` property.
     * @param {Function} theListener  the function (or reference) to remove.
     *
     */
    self.removeTagListenerForKey = function ( theKey, theListener ) {
      if ( !self._tagListeners[theKey] ) {
        self._tagListeners[theKey] = [];
      }
      var i = self._tagListeners[theKey].indexOf( theListener );
      if ( i > -1 ) {
        self._tagListeners[theKey].splice( i, 1 );
      }
    };
    /**
     *
     * Sets the value for the simple tag (`__default`). Any listeners attached
     * to `__default` will be notified.
     *
     * @method setTag
     * @param {*} theValue  the value for the tag
     *
     */
    self.setTag = function ( theValue ) {
      self.setTagForKey( "__default", theValue );
    };
    /**
     *
     * Returns the value for the given tag (`__default`). If the tag has never been
     * set, the result is undefined.
     *
     * @method getTag
     * @returns {*} the value of the tag.
     */
    self.getTag = function () {
      return self.getTagForKey( "__default" );
    };
    /**
     *
     * The default tag for the instance. Changing the tag itself (not any sub-properties of an object)
     * will notify any listeners attached to `__default`.
     *
     * @property tag
     * @type *
     *
     */
    Object.defineProperty( self, "tag", {
      get:          self.getTag,
      set:          self.setTag,
      configurable: true
    } );
    /**
     *
     * All objects subject notifications for events
     *
     */
    /**
     * Supports notification listeners.
     * @private
     * @property _notificationListeners
     * @type Object
     */
    self._notificationListeners = {};
    /**
     * Adds a listener for a notification. If a notification has not been
     * registered (via `registerNotification`), an error is logged on the console
     * and the function returns without attaching the listener. This means if
     * you aren't watching the console, the function fails nearly silently.
     *
     * > By default, no notifications are registered.
     *
     * If the first parameter is an object, multiple listeners can be registered:
     * { "viewWillAppear": handler, "viewDidAppear": handler2}.
     *
     * @method addListenerForNotification
     * @alias on
     * @param {String|*} theNotification  the name of the notification
     * @param {Function} theListener  the function (or reference) to be called when the
     *                                notification is triggered.
     * @returns {*} returns self for chaining
     */
    self.addListenerForNotification = function addListenerForNotification( theNotification, theListener, async ) {
      if ( theNotification instanceof Array ) {
        theNotification.forEach( function ( n ) {
          addListenerForNotification( n, theListener, async );
        } );
        return self;
      }
      if ( typeof theNotification === "object" ) {
        for ( var n in theNotification ) {
          if ( theNotification.hasOwnProperty( n ) ) {
            addListenerForNotification( n, theNotification[n], theListener ); // async would shift up
          }
        }
        return self;
      }
      if ( !self._notificationListeners[theNotification] ) {
        self.registerNotification( theNotification, ( typeof async !== "undefined" ) ? async : false );
      }
      self._notificationListeners[theNotification].push( theListener );
      if ( self._traceNotifications ) {
        console.log( "Adding listener " + theListener + " for notification " + theNotification );
      }
      return self;
    };
    self.on = self.addListenerForNotification;
    /**
     * Registers a listener valid for one notification only. Immediately after
     * @method once
     * @param  {[type]} theNotification [description]
     * @param  {[type]} theListener     [description]
     * @param  {[type]} async           [description]
     * @return {[type]}                 [description]
     */
    self.once = function once( theNotification, theListener, async ) {
      self.addListenerForNotification( theNotification, function onceHandler( sender, notice, args ) {
        try {
          theListener.apply( self, [self, theNotification, args].concat( arguments ) );
        }
        catch ( err ) {
          console.log( "ONCE Handler had an error", err );
        }
        self.removeListenerForNotification( theNotification, onceHandler );
      }, async );
    };
    /**
     * Removes a listener from a notification. If a notification has not been
     * registered (via `registerNotification`), an error is logged on the console
     * and the function returns without attaching the listener. This means if
     * you aren't watching the console, the function fails nearly silently.
     *
     * > By default, no notifications are registered.
     *
     * @method removeListenerForNotification
     * @alias off
     * @param {String} theNotification  the notification
     * @param {Function} theListener  The function or reference to remove
     */
    self.removeListenerForNotification = function removeListenerForNotification( theNotification, theListener ) {
      if ( theNotification instanceof Array ) {
        theNotification.forEach( function ( n ) {
          removeListenerForNotification( n, theListener );
        } );
        return self;
      }
      if ( typeof theNotification === "object" ) {
        for ( var n in theNotification ) {
          if ( theNotification.hasOwnProperty( n ) ) {
            self.removeListenerForNotification( n, theNotification[n] );
          }
        }
        return self;
      }
      if ( !self._notificationListeners[theNotification] ) {
        console.log( theNotification + " has not been registered." );
        return self;
      }
      var i = self._notificationListeners[theNotification].indexOf( theListener );
      if ( self._traceNotifications ) {
        console.log( "Removing listener " + theListener + " (index: " + i + ") from  notification " + theNotification );
      }
      if ( i > -1 ) {
        self._notificationListeners[theNotification].splice( i, 1 );
      }
      return self;
    };
    self.off = self.removeListenerForNotification;
    /**
     * Registers a notification so that listeners can then be attached. Notifications
     * should be registered as soon as possible, otherwise listeners may attempt to
     * attach to a notification that isn't registered.
     *
     * @method registerNotification
     * @param {String} theNotification  the name of the notification.
     * @param {Boolean} async  if true, notifications are sent wrapped in setTimeout
     */
    self.registerNotification = function ( theNotification, async ) {
      if ( typeof self._notificationListeners[theNotification] === "undefined" ) {
        self._notificationListeners[theNotification] = [];
        self._notificationListeners[theNotification]._useAsyncNotifications = ( typeof async !== "undefined" ? async :
                                                                                true );
      }
      if ( self._traceNotifications ) {
        console.log( "Registering notification " + theNotification );
      }
    };
    self._traceNotifications = false;

    function _doNotification( theNotification, options ) {
      var args,
        lastOnly = false;
      if ( typeof options !== "undefined" ) {
        args = ( typeof options.args !== "undefined" ) ? options.args : undefined;
        lastOnly = ( typeof options.lastOnly !== "undefined" ) ? options.lastOnly : false;
      }
      if ( !self._notificationListeners[theNotification] ) {
        console.log( theNotification + " has not been registered." );
        //return;
      }
      if ( self._traceNotifications ) {
        if ( self._notificationListeners[theNotification] ) {
          console.log( "Notifying " + self._notificationListeners[theNotification].length + " listeners for " +
                       theNotification + " ( " + args + " ) " );
        } else {
          console.log( "Can't notify any explicit listeners for ", theNotification, "but wildcards will fire." );
        }
      }
      var async = self._notificationListeners[theNotification] !== undefined ? self._notificationListeners[
          theNotification]._useAsyncNotifications : true,
        notifyListener = function ( theListener, theNotification, args ) {
          return function () {
            try {
              theListener.apply( self, [self, theNotification, args].concat( arguments ) );
            }
            catch ( err ) {
              console.log( "WARNING", theNotification, "experienced an uncaught error:", err );
            }
          };
        },
        handlers = self._notificationListeners[theNotification] !== undefined ? self._notificationListeners[
          theNotification].slice() : []; // copy!
      if ( lastOnly && handlers.length > 1 ) {
        handlers = [handlers.pop()];
      }
      // attach * handlers
      var handler, push = false;
      for ( var listener in self._notificationListeners ) {
        if ( self._notificationListeners.hasOwnProperty( listener ) ) {
          handler = self._notificationListeners[listener];
          push = false;
          if ( listener.indexOf( "*" ) > -1 ) {
            // candidate listener; see if it matches
            if ( listener === "*" ) {
              push = true;
            } else if ( listener.substr( 0, 1 ) === "*" && listener.substr( 1 ) === theNotification.substr( -1 * ( listener
                                                                                                                     .length - 1 ) ) ) {
              push = true;
            } else if ( listener.substr( -1, 1 ) === "*" && listener.substr( 0, listener.length - 1 ) === theNotification.substr(
                0, listener.length - 1 ) ) {
              push = true;
            } else {
              var starPos = listener.indexOf( "*" );
              if ( listener.substr( 0, starPos ) === theNotification.substr( 0, starPos ) && listener.substr( starPos + 1 ) ===
                                                                                             theNotification.substr( -1 * ( listener.length - starPos - 1 ) ) ) {
                push = true;
              }
            }
            if ( push ) {
              handler.forEach( function ( handler ) {
                handlers.push( handler );
              } );
            }
          }
        }
      }
      for ( var i = 0, l = handlers.length; i < l; i++ ) {
        if ( async ) {
          setTimeout( notifyListener( handlers[i], theNotification, args ), 0 );
        } else {
          ( notifyListener( handlers[i], theNotification, args ) )();
        }
      }
    }

    /**
     * Notifies all listeners of a particular notification that the notification
     * has been triggered. If the notification hasn't been registered via
     * `registerNotification`, an error is logged to the console, but the function
     * itself returns silently, so be sure to watch the console for errors.
     *
     * @method notify
     * @alias emit
     * @param {String} theNotification  the notification to trigger
     * @param {*} [args]  Arguments to pass to the listener; usually an array
     */
    self.notify = function ( theNotification, args ) {
      _doNotification( theNotification, {
        args:     args,
        lastOnly: false
      } );
    };
    self.emit = self.notify;
    /**
     *
     * Notifies only the most recent listener of a particular notification that
     * the notification has been triggered. If the notification hasn't been registered
     * via `registerNotification`, an error is logged to the console, but the function
     * itself returns silently.
     *
     * @method notifyMostRecent
     * @alias emitToLast
     * @param {String} theNotification  the specific notification to trigger
     * @param {*} [args]  Arguments to pass to the listener; usually an array
     */
    self.notifyMostRecent = function ( theNotification, args ) {
      _doNotification( theNotification, {
        args:     args,
        lastOnly: true
      } );
    };
    self.emitToLast = self.notifyMostRecent;
    /**
     *
     * Defines a property on the object. Essentially shorthand for `Object.defineProperty`. An
     * internal `_propertyName` variable is declared which getters and setters can access.
     *
     * The property can be read-write, read-only, or write-only depending on the values in
     * `propertyOptions.read` and `propertyOptions.write`. The default is read-write.
     *
     * Getters and setters can be provided in one of two ways: they can be automatically
     * discovered by following a specific naming pattern (`getPropertyName`) if
     * `propertyOptions.selfDiscover` is `true` (the default). They can also be explicitly
     * defined by setting `propertyOptions.get` and `propertyOptions.set`.
     *
     * A property does not necessarily need a getter or setter in order to be readable or
     * writable. A basic pattern of setting or returning the private variable is implemented
     * for any property without specific getters and setters but who have indicate that the
     * property is readable or writable.
     *
     * @example
     * ```
     * self.defineProperty ( "someProperty" );        // someProperty, read-write
     * self.defineProperty ( "anotherProperty", { default: 2 } );
     * self.setWidth = function ( newWidth, oldWidth )
     * {
       *    self._width = newWidth;
       *    self.element.style.width = newWidth + "px";
       * }
     * self.defineProperty ( "width" );   // automatically discovers setWidth as the setter.
     * ```
     *
     * @method defineProperty
     * @param {String} propertyName  the name of the property; use camelCase
     * @param {Object} propertyOptions  the various options as described above.
     */
    self.defineProperty = function ( propertyName, propertyOptions ) {
      var options = {
        default:         undefined,
        read:            true,
        write:           true,
        get:             null,
        set:             null,
        selfDiscover:    true,
        prefix:          "",
        configurable:    true,
        backingVariable: true
      };
      // private properties are handled differently -- we want to be able to search for
      // _getPrivateProperty, not get_privateProperty
      if ( propertyName.substr( 0, 1 ) === "_" ) {
        options.prefix = "_";
      }
      // allow other potential prefixes
      if ( options.prefix !== "" ) {
        if ( propertyName.substr( 0, 1 ) === options.prefix ) {
          propertyName = propertyName.substr( 1 );
        }
      }
      // merge our default options with the user options
      for ( var property in propertyOptions ) {
        if ( propertyOptions.hasOwnProperty( property ) ) {
          options[property] = propertyOptions[property];
        }
      }
      // Capital Camel Case our function names
      var fnName = propertyName.substr( 0, 1 ).toUpperCase() + propertyName.substr( 1 );
      var getFnName = options.prefix + "get" + fnName,
        setFnName = options.prefix + "set" + fnName,
        _propertyName = options.prefix + "_" + propertyName,
        _y_getFnName = options.prefix + "_y_get" + fnName,
        _y_setFnName = options.prefix + "_y_set" + fnName,
        _y__getFnName = options.prefix + "_y__get" + fnName,
        _y__setFnName = options.prefix + "_y__set" + fnName;
      // if get/set are not specified, we'll attempt to self-discover them
      if ( options.get === null && options.selfDiscover ) {
        if ( typeof self[getFnName] === "function" ) {
          options.get = self[getFnName];
        }
      }
      if ( options.set === null && options.selfDiscover ) {
        if ( typeof self[setFnName] === "function" ) {
          options.set = self[setFnName];
        }
      }
      // create the private variable
      if ( options.backingVariable ) {
        self[_propertyName] = options.default;
      }
      if ( !options.read && !options.write ) {
        return; // not read/write, so nothing more.
      }
      var defPropOptions = {
        configurable: options.configurable
      };
      if ( options.read ) {
        self[_y__getFnName] = options.get;
        self[_y_getFnName] = function () {
          // if there is a getter, use it
          if ( typeof self[_y__getFnName] === "function" ) {
            return self[_y__getFnName]( self[_propertyName] );
          }
          // otherwise return the private variable
          else {
            return self[_propertyName];
          }
        };
        if ( typeof self[getFnName] === "undefined" ) {
          self[getFnName] = self[_y_getFnName];
        }
        defPropOptions.get = self[_y_getFnName];
      }
      if ( options.write ) {
        self[_y__setFnName] = options.set;
        self[_y_setFnName] = function ( v ) {
          var oldV = self[_propertyName];
          if ( typeof self[_y__setFnName] === "function" ) {
            self[_y__setFnName]( v, oldV );
          } else {
            self[_propertyName] = v;
          }
          if ( oldV !== v ) {
            self.notifyDataBindingElementsForKeyPath( propertyName );
          }
        };
        if ( typeof self[setFnName] === "undefined" ) {
          self[setFnName] = self[_y_setFnName];
        }
        defPropOptions.set = self[_y_setFnName];
      }
      Object.defineProperty( self, propertyName, defPropOptions );
    };
    /**
     * Defines a custom property, which also implements a form of KVO.
     *
     * Any options not specified are defaulted in. The default is for a property
     * to be observable (which fires the default propertyNameChanged notice),
     * read/write with no custom get/set/validate routines, and no default.
     *
     * Observable Properties can have getters, setters, and validators. They can be
     * automatically discovered, assuming they follow the pattern `getObservablePropertyName`,
     * `setObservablePropertyName`, and `validateObservablePropertyName`. They can also be
     * specified explicitly by setting `propertyOptions.get`, `set`, and `validate`.
     *
     * Properties can be read-write, read-only, or write-only. This is controlled by
     * `propertyOptions.read` and `write`. The default is read-write.
     *
     * Properties can have a default value provided as well, specified by setting
     * `propertyOptions.default`.
     *
     * Finally, a notification of the form `propertyNameChanged` is fired if
     * the value changes. If the value does *not* change, the notification is not fired.
     * The name of the notification is controlled by setting `propertyOptions.notification`.
     * If you need a notification to fire when a property is simply set (regardless of the
     * change in value), set `propertyOptions.notifyAlways` to `true`.
     *
     * KVO getters, setters, and validators follow very different patterns than normal
     * property getters and setters.
     *
     * ```
     * self.getObservableWidth = function ( returnValue ) { return returnValue; };
     * self.setObservableWidth = function ( newValue, oldValue ) { return newValue; };
     * self.validateObservableWidth = function ( testValue ) { return testValue!==10; };
     * self.defineObservableProperty ( "width" );
     * ```
     *
     * @method defineObservableProperty
     * @param {String} propertyName The specific property to define
     * @param {Object} propertyOptions the options for this property.
     *
     */
    self.defineObservableProperty = function ( propertyName, propertyOptions ) {
      // set the default options and copy the specified options
      var origPropertyName = propertyName,
        options = {
          observable:   true,
          notification: propertyName + "Changed",
          default:      undefined,
          read:         true,
          write:        true,
          get:          null,
          validate:     null,
          set:          null,
          selfDiscover: true,
          notifyAlways: false,
          prefix:       "",
          configurable: true
        };
      // private properties are handled differently -- we want to be able to search for
      // _getPrivateProperty, not get_privateProperty
      if ( propertyName.substr( 0, 1 ) === "_" ) {
        options.prefix = "_";
      }
      // allow other potential prefixes
      if ( options.prefix !== "" ) {
        if ( propertyName.substr( 0, 1 ) === options.prefix ) {
          propertyName = propertyName.substr( 1 );
        }
      }
      var fnName = propertyName.substr( 0, 1 ).toUpperCase() + propertyName.substr( 1 );
      var getObservableFnName = options.prefix + "getObservable" + fnName,
        setObservableFnName = options.prefix + "setObservable" + fnName,
        validateObservableFnName = options.prefix + "validateObservable" + fnName,
        _y_propertyName = options.prefix + "_y_" + propertyName,
        _y_getFnName = options.prefix + "_y_get" + fnName,
        _y_setFnName = options.prefix + "_y_set" + fnName,
        _y_validateFnName = options.prefix + "_y_validate" + fnName,
        _y__getFnName = options.prefix + "_y__get" + fnName,
        _y__setFnName = options.prefix + "_y__set" + fnName,
        _y__validateFnName = options.prefix + "_y__validate" + fnName;
      for ( var property in propertyOptions ) {
        if ( propertyOptions.hasOwnProperty( property ) ) {
          options[property] = propertyOptions[property];
        }
      }
      // if get/set are not specified, we'll attempt to self-discover them
      if ( options.get === null && options.selfDiscover ) {
        if ( typeof self[getObservableFnName] === "function" ) {
          options.get = self[getObservableFnName];
        }
      }
      if ( options.set === null && options.selfDiscover ) {
        if ( typeof self[setObservableFnName] === "function" ) {
          options.set = self[setObservableFnName];
        }
      }
      if ( options.validate === null && options.selfDiscover ) {
        if ( typeof self[validateObservableFnName] === "function" ) {
          options.validate = self[validateObservableFnName];
        }
      }
      // if the property is observable, register its notification
      if ( options.observable ) {
        self.registerNotification( options.notification );
      }
      // create the private variable; __ here to avoid self-defined _
      self[_y_propertyName] = options.default;
      if ( !options.read && !options.write ) {
        return; // not read/write, so nothing more.
      }
      var defPropOptions = {
        configurable: true
      };
      if ( options.read ) {
        self[_y__getFnName] = options.get;
        self[_y_getFnName] = function () {
          // if there is a getter, use it
          if ( typeof self[_y__getFnName] === "function" ) {
            return self[_y__getFnName]( self[_y_propertyName] );
          }
          // otherwise return the private variable
          else {
            return self[_y_propertyName];
          }
        };
        defPropOptions.get = self[_y_getFnName];
      }
      if ( options.write ) {
        self[_y__validateFnName] = options.validate;
        self[_y__setFnName] = options.set;
        self[_y_setFnName] = function ( v ) {
          var oldV = self[_y_propertyName],
            valid = true;
          if ( typeof self[_y__validateFnName] === "function" ) {
            valid = self[_y__validateFnName]( v );
          }
          if ( valid ) {
            if ( typeof self[_y__setFnName] === "function" ) {
              self[_y_propertyName] = self[_y__setFnName]( v, oldV );
            } else {
              self[_y_propertyName] = v;
            }
            if ( oldV !== v ) {
              self.notifyDataBindingElementsForKeyPath( propertyName );
            }
            if ( v !== oldV || options.notifyAlways ) {
              if ( options.observable ) {
                self.notify( options.notification, {
                  "new": v,
                  "old": oldV
                } );
              }
            }
          }
        };
        defPropOptions.set = self[_y_setFnName];
      }
      Object.defineProperty( self, origPropertyName, defPropOptions );
    };
    /*
     * data binding support
     */
    self._dataBindings = {};
    self._dataBindingTypes = {};
    //self._dataBindingEvents = [ "input", "change", "keyup", "blur" ];
    self._dataBindingEvents = ["input", "change", "blur"];
    /**
     * Configure a data binding to an HTML element (el) for
     * a particular property (keyPath). Returns self for chaining.
     *
     * @method dataBindOn
     * @param  {Node}   el      the DOM element to bind to; must support the change event, and must have an ID
     * @param  {string} keyPath the property to observe (shallow only; doesn't follow dots.)
     * @return {*}              self; chain away!
     */
    self.dataBindOn = function dataBindOn( el, keyPath, keyType ) {
      if ( self._dataBindings[keyPath] === undefined ) {
        self._dataBindings[keyPath] = [];
      }
      self._dataBindings[keyPath].push( el );
      self._dataBindingTypes[keyPath] = keyType;
      el.setAttribute( "data-y-keyPath", keyPath );
      el.setAttribute( "data-y-keyType", ( keyType !== undefined ? keyType : "string" ) );
      self._dataBindingEvents.forEach( function ( evt ) {
        el.addEventListener( evt, self.updatePropertyForKeyPath, false );
      } );
      return self;
    };
    /**
     * Turn off data binding for a particular element and
     * keypath.
     *
     * @method dataBindOff
     * @param  {Node}   el      element to remove data binding from
     * @param  {string} keyPath keypath to stop observing
     * @return {*}              self; chain away!
     */
    self.dataBindOff = function dataBindOff( el, keyPath ) {
      var keyPathEls = self._dataBindings[keyPath],
        elPos;
      if ( keyPathEls !== undefined ) {
        elPos = keyPathEls.indexOf( el );
        if ( elPos > -1 ) {
          keyPathEls.splice( elPos, 1 );
          el.removeAttribute( "data-y-keyPath" );
          el.removeAttribute( "data-y-keyType" );
          self._dataBindingEvents.forEach( function ( evt ) {
            el.removeEventListener( evt, self.updatePropertyForKeyPath );
          } );
        }
      }
      return self;
    };
    /**
     * Remove all data bindings for a given property
     *
     * @method dataBindAllOffForKeyPath
     * @param  {String} keyPath keypath to stop observing
     * @return {*}              self; chain away
     */
    self.dataBindAllOffForKeyPath = function dataBindAllOffForKeyPath( keyPath ) {
      var keyPathEls = self._dataBindings[keyPath];
      if ( keyPathEls !== undefined ) {
        keyPathEls.forEach( function ( el ) {
          el.removeAttribute( "data-y-keyPath" );
          el.removeAttribute( "data-y-keyType" );
          self._dataBindingEvents.forEach( function ( evt ) {
            el.removeEventListener( evt, self.updatePropertyForKeyPath );
          } );
        } );
        keyPathEls = [];
      }
      return self;
    };
    /**
     * Remove all data bindings for this object
     *
     * @method dataBindAllOff
     * @return {*}  self
     */
    self.dataBindAllOff = function dataBindAllOff() {
      for ( var keyPath in self._dataBindings ) {
        if ( self._dataBindings.hasOwnProperty( keyPath ) ) {
          self.dataBindAllOffForKeyPath( keyPath );
        }
      }
    };
    /**
     * Update a property on this object based on the
     * keyPath and value. If called as an event handler, `this` refers to the
     * triggering element, and keyPath is on `data-y-keyPath` attribute.
     *
     * @method updatePropertyForKeyPath
     * @param  {String} keyPath property to set
     * @param  {*} value        value to set
     */
    self.updatePropertyForKeyPath = function updatePropertyForKeyPath( inKeyPath, inValue, inKeyType ) {
      var keyType = inKeyType,
        keyPath = inKeyPath,
        dataValue = inValue,
        elType;
      try {
        if ( this !== self && this instanceof Node ) {
          // we've been called from an event handler
          if ( this.getAttribute( "data-y-keyType" ) !== undefined ) {
            keyType = this.getAttribute( "data-y-keyType" );
          }
          keyPath = this.getAttribute( "data-y-keyPath" );
          elType = this.getAttribute( "type" );
          dataValue = this.value;
          switch ( keyType ) {
            case "integer":
              self[keyPath] = ( dataValue === "" ) ? null : parseInt( dataValue, 10 );
              break;
            case "float":
              self[keyPath] = ( dataValue === "" ) ? null : parseFloat( dataValue );
              break;
            case "boolean":
              if ( this.checked !== undefined ) {
                self[keyPath] = this.checked;
              } else {
                self[keyPath] = ( "" + dataValue ) === "1" || dataValue.toLowerCase() === "true"
              }
              break;
            case "date":
              if ( this.type === "text" ) {
                try {
                  console.log( "trying to pull date from ", this.value );
                  self[keyPath] = new Date( this.value )
                }
                catch ( err ) {
                  console.log( "nope; set to null" );
                  self[keyPath] = null;
                }
              } else {
                self[keyPath] = this.valueAsDate;
              }
              break;
            default:
              self[keyPath] = dataValue;
          }
          return;
        }
        if ( keyType === undefined ) {
          keyType = self._dataBindingTypes[keyPath];
        }
        switch ( keyType ) {
          case "integer":
            self[keyPath] = parseInt( dataValue, 10 );
            break;
          case "float":
            self[keyPath] = parseFloat( dataValue );
            break;
          case "boolean":
            if ( dataValue === "1" || dataValue === 1 || dataValue.toLowerCase() === "true" || dataValue === true ) {
              self[keyPath] = true;
            } else {
              self[keyPath] = false;
            }
            break;
          case "date":
            self[keyPath] = new Date( dataValue );
            break;
          default:
            self[keyPath] = dataValue;
        }
      }
      catch ( err ) {
        console.log( "Failed to update", keyPath, "with", dataValue, "and", keyType, err, this, arguments );
      }
    };
    /**
     * notify all elements attached to a
     * key path that the source value has changed. Called by all properties created
     * with defineProperty and defineObservableProperty.
     *
     * @method @notifyDataBindingElementsForKeyPath
     * @param  {String} keyPath keypath of elements to notify
     */
    self.notifyDataBindingElementsForKeyPath = function notifyDataBindingElementsForKeyPath( keyPath ) {
      try {
        var keyPathEls = self._dataBindings[keyPath],
          keyType = self._dataBindingTypes[keyPath],
          el, v, elType, t, cursorPos, selectionPos;
        if ( keyType === undefined ) {
          keyType = "string";
        }
        v = self[keyPath];
        if ( v === undefined || v === null ) {
          v = "";
        }
        if ( keyPathEls !== undefined ) {
          for ( var i = 0, l = keyPathEls.length; i < l; i++ ) {
            el = keyPathEls[i];
            try {
              if ( typeof el.selectionStart === "number" ) {
                cursorPos = el.selectionStart;
                selectionPos = el.selectionEnd;
              } else {
                cursorPos = -1;
                selectionPos = -1;
              }
            }
            catch ( err ) {
              cursorPos = -1;
              selectionPos = -1;
            }
            elType = el.getAttribute( "type" );
            if ( elType === "date" ) {
              if ( el.type !== elType ) {
                // problem; we almost certainly have a field that doesn't understand valueAsDate
                if ( v.toISOString ) {
                  t = v.toISOString().split( "T" )[0];
                  console.log( "trying to set value to  ", t );
                  if ( el.value !== t ) {
                    console.log( "doing it  ", t );
                    el.value = t;
                  }
                } else {
                  throw new Error( "v is an unexpected type: " + typeof v + "; " + v );
                }
              } else {
                if ( el.valueAsDate !== v ) {
                  el.valueAsDate = v;
                }
              }
            } else if ( el.type === "checkbox" ) {
              el.indeterminate = ( v === undefined || v === null );
              if ( el.checked !== v ) {
                el.checked = v;
              }
            } else if ( typeof el.value !== "undefined" ) {
              if ( el.value != v ) {
                el.value = v;
              }
            } else if ( typeof el.textContent !== "undefined" ) {
              if ( el.textContent != v ) {
                el.textContent = v;
              }
            } else if ( typeof el.innerText !== "undefined" ) {
              if ( el.innerText != v ) {
                el.innerText = v;
              }
            } else {
              console.log( "Data bind failure; browser doesn't understand value, textContent, or innerText." );
            }
            if ( cursorPos > -1 && document.activeElement === el ) {
              el.selectionStart = cursorPos;
              el.selectionEnd = selectionPos;
            }
          }
        }
      }
      catch ( err ) {
        console.log( "Failed to update elements for ", keyPath, err, arguments );
      }
    };
    /**
     * Auto initializes the object based on the arguments passed to the object constructor. Any object
     * that desires to be auto-initializable must perform the following prior to returning themselves:
     *
     * ```
     * self._autoInit.apply (self, arguments);
     * ```
     *
     * Each init must call the super of init, and each init must return self.
     *
     * If the first parameter to _autoInit (and thus to the object constructor) is an object,
     * initWithOptions is called if it exists. Otherwise init is called with all the arguments.
     *
     * If NO arguments are passed to the constructor (and thus to this method), then no
     * auto initialization is performed. If one desires an auto-init on an object that requires
     * no parameters, pass a dummy parameter to ensure init will be called
     *
     * @method _autoInit
     * @returns {*}
     */
    self._autoInit = function () {
      if ( arguments.length > 0 ) {
        if ( arguments.length === 1 ) {
          // chances are this is an initWithOptions, but make sure the incoming parameter is an object
          if ( typeof arguments[0] === "object" ) {
            if ( typeof self.initWithOptions !== "undefined" ) {
              return self.initWithOptions.apply( self, arguments );
            } else {
              return self.init.apply( self, arguments );
            }
          } else {
            return self.init.apply( self, arguments );
          }
        } else {
          return self.init.apply( self, arguments );
        }
      }
    };
    /**
     *
     * Readies an object to be destroyed. The base object only clears the notifications and
     * the attached listeners.
     * @method destroy
     */
    self.destroy = function () {
      // clear data bindings
      self.dataBindAllOff();
      // clear any listeners.
      self._notificationListeners = {};
      self._tagListeners = {};
      self._constructObjectCategories( BaseObject.ON_DESTROY_CATEGORY );
      // ready to be destroyed
    };
    // self-categorize
    self._constructObjectCategories();
    // call auto init
    self._autoInit.apply( self, arguments );
    // done
    return self;
  };
/**
 * Promotes a non-BaseObject into a BaseObject by copying all its methods to
 * the new object and copying all its properties as observable properties.
 *
 * @method promote
 * @param  {*} nonBaseObject The non-BaseObject to promote
 * @return {BaseObject}               BaseObject
 */
BaseObject.promote = function promote( nonBaseObject ) {
  var newBaseObject, theProp;
  if ( nonBaseObject !== undefined ) {
    newBaseObject = new BaseObject();
    for ( var prop in nonBaseObject ) {
      if ( nonBaseObject.hasOwnProperty( prop ) ) {
        theProp = nonBaseObject[prop];
        if ( typeof theProp === "function" ) {
          newBaseObject[prop] = theProp;
        } else {
          newBaseObject.defineObservableProperty( prop, {
            default: theProp
          } );
        }
      }
    }
  }
  return newBaseObject;
};
/**
 * Object categories. Of the form:
 *
 * ```
 * { className: [ constructor1, constructor2, ... ], ... }
 * ```
 *
 * Global to the app and library. BaseObject's init() method will call each category in the class hierarchy.
 *
 * @property _objectCategories
 * @type {{}}
 * @private
 */
BaseObject._objectCategories = [{}, {}, {}];
BaseObject.ON_CREATE_CATEGORY = 0;
BaseObject.ON_INIT_CATEGORY = 1;
BaseObject.ON_DESTROY_CATEGORY = 2;
/**
 * Register a category constructor for a specific class. The function must take `self` as a parameter, and must
 * not assume the presence of any other category
 *
 * The options parameter takes the form:
 *
 * ```
 * { class: class name to register for
   *   method: constructor method
   *   priority: ON_CREATE_CATEGORY or ON_INIT_CATEGORY
   * }
 * ```
 *
 * @method registerCategoryConstructor
 * @param {Object} options
 */
BaseObject.registerCategoryConstructor = function registerCategoryConstructor( options ) {
  if ( typeof options === "undefined" ) {
    throw new Error( "registerCategoryConstructor requires a class name and a constructor method." );
  }
  if ( typeof options.class !== "undefined" ) {
    throw new Error( "registerCategoryConstructor requires options.class" );
  }
  if ( typeof options.method !== "undefined" ) {
    throw new Error( "registerCategoryConstructor requires options.method" );
  }
  var className = options.class;
  var method = options.method;
  var priority = BaseObject.ON_CREATE_CATEGORY;
  if ( typeof options.priority !== "undefined" ) {
    priority = options.priority;
  }
  if ( typeof BaseObject._objectCategories[priority][className] === "undefined" ) {
    BaseObject._objectCategories[priority][className] = [];
  }
  BaseObject._objectCategories[priority][className].push( method );
};
/**
 * Extend (subclass) an object. `o` should be of the form:
 *
 * {
   *   className: "NewClass",
   *   properties: [],
   *   observableProperties: [],
   *   methods: [],
   *   overrides: []
   * }
 *
 * @method   extend
 *
 * @param    {[type]}   classObject   [description]
 * @param    {[type]}   o             [description]
 *
 * @return   {[type]}                 [description]
 */
BaseObject.extend = function extend( classObject, o ) {
  return function () {};
};
BaseObject.meta = {
  version:           "00.05.101",
  class:             _className,
  autoInitializable: true,
  categorizable:     true
};
module.exports = BaseObject;

},{}],19:[function(require,module,exports){
/**
 *
 * # simple routing
 *
 * @module router.js
 * @author Kerri Shotts
 * @version 0.1
 *
 * Simple example:
 * ```
 * var y = function (v,s,r,t,u) { console.log(v,s,r,t,u); }, router = _y.Router;
 * router.addURL ( "/", "Home" )
 * .addURL ( "/task", "Task List" )
 * .addURL ( "/task/:taskId", "Task View" )
 * .addHandler ( "/", y )
 * .addHandler ( "/task", y )
 * .addHandler ( "/task/:taskId", y )
 * .replace( "/", 1)
 * .listen();
 * ```
 *
 * ```
 * Copyright (c) 2014 Kerri Shotts, photoKandy Studios LLC
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
 * ```
 */
/*global module, Node, document, history, window, console*/
"use strict";
var routes = [];
/**
 * Parses a URL into its constituent parts. The return value
 * is an object containing the path, the query, and the hash components.
 * Each of those is also split up into parts -- path and hash separated
 * by slashes, while query is separated by ampersands. If hash is empty
 * this routine treates it as a "#/" unlese `parseHash` is `false`.
 * The `baseURL` is also removed from the path; if not specified it
 * defaults to `/`.
 *
 * @method parseURL
 * @param  {String}  url        url to parse
 * @param  {String}  baseURL    optional base url, defaults to "/"
 * @param  {Boolean} parseHash  optional, indicates if hash should be parsed with slashes
 * @return {*}                  component pieces
 */
function parseURL( url, baseURL, parseHash ) {
  if ( baseURL === undefined ) {
    baseURL = "/";
  }
  if ( parseHash === undefined ) {
    parseHash = true;
  }
  var a = document.createElement( "a" ),
    pathString,
    queryString,
    hashString,
    queryParts, pathParts, hashParts;
  // parse the url
  a.href = url;
  pathString = decodeURIComponent( a.pathname );
  queryString = decodeURIComponent( a.search );
  hashString = decodeURIComponent( a.hash );
  if ( hashString === "" && parseHash ) {
    hashString = "#/";
  }
  // remove the base url
  if ( pathString.substr( 0, baseURL.length ) === baseURL ) {
    pathString = pathString.substr( baseURL.length );
  }
  // don't need the ? or # on the query/hash string
  queryString = queryString.substr( 1 );
  hashString = hashString.substr( 1 );
  // split the query string
  queryParts = queryString.split( "&" );
  // and split the href
  pathParts = pathString.split( "/" );
  // split the hash, too
  if ( parseHash ) {
    hashParts = hashString.split( "/" );
  }
  return {
    path:       pathString,
    query:      queryString,
    hash:       hashString,
    queryParts: queryParts,
    pathParts:  pathParts,
    hashParts:  hashParts
  };
}
/**
 * Determines if a route matches, and if it does, copies
 * any variables out into `vars`. The routes must have been previously
 * parsed with parseURL.
 *
 * @method routeMatches
 * @param  {type} candidate candidate URL
 * @param  {type} template  template to check (variables of the form :someId)
 * @param  {type} vars      byref: this object will receive any variables
 * @return {*}              if matches, true.
 */
function routeMatches( candidate, template, vars ) {
  // routes must have the same number of parts
  if ( candidate.hashParts.length !== template.hashParts.length ) {
    return false;
  }
  var cp, tp;
  for ( var i = 0, l = candidate.hashParts.length; i < l; i++ ) {
    // each part needs to match exactly, OR it needs to start with a ":" to denote a variable
    cp = candidate.hashParts[i];
    tp = template.hashParts[i];
    if ( tp.substr( 0, 1 ) === ":" && tp.length > 1 ) {
      // variable
      vars[tp.substr( 1 )] = cp; // return the variable to the caller
    } else if ( cp !== tp ) {
      return false;
    }
  }
  return true;
}
var Router = {
  VERSION:        "0.1.100",
  baseURL:        "/", // not currently used
  /**
   * registers a URL and an associated title
   *
   * @method addURL
   * @param  {string} url   url to register
   * @param  {string} title associated title (not visible anywhere)
   * @return {*}            self
   */
  addURL:         function addURL( url, title ) {
    if ( routes[url] === undefined ) {
      routes[url] = [];
    }
    routes[url].title = title;
    return this;
  },
  /**
   * Adds a handler to the associated URL. Handlers
   * should be of the form `function( vars, state, url, title, parsedURL )`
   * where `vars` contains the variables in the URL, `state` contains any
   * state passed to history, `url` is the matched URL, `title` is the
   * title of the URL, and `parsedURL` contains the actual URL components.
   *
   * @method addHandler
   * @param  {string} url       url to register the handler for
   * @param  {function} handler handler to call
   * @return {*}                self
   */
  addHandler:     function addHandler( url, handler ) {
    routes[url].push( handler );
    return this;
  },
  /**
   * Removes a handler from the specified url
   *
   * @method removeHandler
   * @param  {string}   url     url
   * @param  {function} handler handler to remove
   * @return {*}        self
   */
  removeHandler:  function removeHandler( url, handler ) {
    var handlers = routes[url],
      handlerIndex;
    if ( handlers !== undefined ) {
      handlerIndex = handlers.indexOf( handler );
      if ( handlerIndex > -1 ) {
        handlers.splice( handlerIndex, 1 );
      }
    }
    return this;
  },
  /**
   * Parses a URL into its constituent parts. The return value
   * is an object containing the path, the query, and the hash components.
   * Each of those is also split up into parts -- path and hash separated
   * by slashes, while query is separated by ampersands. If hash is empty
   * this routine treates it as a "#/" unlese `parseHash` is `false`.
   * The `baseURL` is also removed from the path; if not specified it
   * defaults to `/`.
   *
   * @method parseURL
   * @param  {String}  url        url to parse
   * @param  {String}  baseURL    optional base url, defaults to "/"
   * @param  {Boolean} parseHash  optional, indicates if hash should be parsed with slashes
   * @return {*}                  component pieces
   */
  parseURL:       parseURL,
  /**
   * Given a url and state, process the url handlers that
   * are associated with the given url. Does not affect history in any way,
   * so can be used to call handler without actually navigating (most useful
   * during testing).
   *
   * @method processRoute
   * @param  {string} url   url to process
   * @param  {*} state      state to pass (can be anything or nothing)
   */
  processRoute:   function processRoute( url, state ) {
    if ( url === undefined ) {
      url = window.location.href;
    }
    var parsedURL = parseURL( url ),
      templateURL, handlers, vars, title;
    for ( url in routes ) {
      if ( routes.hasOwnProperty( url ) ) {
        templateURL = parseURL( "#" + url );
        handlers = routes[url];
        title = handlers.title;
        vars = {};
        if ( routeMatches( parsedURL, templateURL, vars ) ) {
          handlers.forEach( function ( handler ) {
            try {
              handler( vars, state, url, title, parsedURL );
            }
            catch ( err ) {
              console.log( "WARNING! Failed to process a route for", url );
            }
          } );
        }
      }
    }
  },
  /**
   * private route listener; calls `processRoute` with
   * the event state retrieved when the history is popped.
   * @method _routeListener
   * @private
   */
  _routeListener: function _routeListener( e ) {
    Router.processRoute( window.location.href, e.state );
  },
  /**
   * Check the current URL and call any associated handlers
   *
   * @method check
   * @return {*} self
   */
  check:          function check() {
    this.processRoute( window.location.href );
    return this;
  },
  /**
   * Indicates if the router is listening to history changes.
   * @property listening
   * @type boolean
   * @default false
   */
  listening:      false,
  /**
   * Start listening for history changes
   * @method listen
   */
  listen:         function listen() {
    if ( this.listening ) {
      return;
    }
    this.listening = true;
    window.addEventListener( "popstate", this._routeListener, false );
  },
  /**
   * Stop listening for history changes
   *
   * @method stopListening
   * @return {type}  description
   */
  stopListening:  function stopListening() {
    if ( !this.listening ) {
      return;
    }
    window.removeEventListener( "popstate", this._routeListener );
  },
  /**
   * Navigate to a url with a given state, calling handlers
   *
   * @method go
   * @param  {string} url   url
   * @param  {*} state      state to store for this URL, can be anything
   * @return {*}            self
   */
  go:             function go( url, state ) {
    history.pushState( state, null, "#" + encodeURIComponent( url ) );
    return this.check();
  },
  /**
   * Navigate to url with a given state, replacing history
   * and calling handlers. Should be called initially with "/" and
   * any initial state should you want to receive a state value when
   * navigating back from a future page
   *
   * @method replace
   * @param  {string} url   url
   * @param  {*} state      state to store for this URL, can be anything
   * @return {*}            self
   */
  replace:        function replace( url, state ) {
    history.replaceState( state, null, "#" + encodeURIComponent( url ) );
    return this.check();
  },
  /**
   * Navigates back in history
   *
   * @method back
   * @param  {number} n number of pages to navigate back, optional (1 is default)
   */
  back:           function back( n ) {
    history.back( n );
    if ( !this.listening ) {
      this.processRoute( window.location.href, history.state );
    }
  }
};
module.exports = Router;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvcS5qcyIsImxpYi95YXNtZi5qcyIsImxpYi95YXNtZi91aS9hbGVydC5qcyIsImxpYi95YXNtZi91aS9jb3JlLmpzIiwibGliL3lhc21mL3VpL2V2ZW50LmpzIiwibGliL3lhc21mL3VpL25hdmlnYXRpb25Db250cm9sbGVyLmpzIiwibGliL3lhc21mL3VpL3NwaW5uZXIuanMiLCJsaWIveWFzbWYvdWkvc3BsaXRWaWV3Q29udHJvbGxlci5qcyIsImxpYi95YXNtZi91aS90YWJWaWV3Q29udHJvbGxlci5qcyIsImxpYi95YXNtZi91aS92aWV3Q29udGFpbmVyLmpzIiwibGliL3lhc21mL3V0aWwvY29yZS5qcyIsImxpYi95YXNtZi91dGlsL2RhdGV0aW1lLmpzIiwibGliL3lhc21mL3V0aWwvZGV2aWNlLmpzIiwibGliL3lhc21mL3V0aWwvZmlsZU1hbmFnZXIuanMiLCJsaWIveWFzbWYvdXRpbC9maWxlbmFtZS5qcyIsImxpYi95YXNtZi91dGlsL2guanMiLCJsaWIveWFzbWYvdXRpbC9taXNjLmpzIiwibGliL3lhc21mL3V0aWwvb2JqZWN0LmpzIiwibGliL3lhc21mL3V0aWwvcm91dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6dUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2g3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzF0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbnZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcDJDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gd2luZG93LlE7XG4iLCIvKipcbiAqXG4gKiAjIFlBU01GLU5leHQgKFlldCBBbm90aGVyIFNpbXBsZSBNb2JpbGUgRnJhbWV3b3JrIE5leHQgR2VuKVxuICpcbiAqIFlBU01GLU5leHQgaXMgdGhlIHN1Y2Nlc3NvciB0byB0aGUgWUFTTUYgZnJhbWV3b3JrLiBXaGlsZSB0aGF0IGZyYW1ld29yayB3YXMgdXNlZnVsXG4gKiBhbmQgdXNhYmxlIGV2ZW4gaW4gYSBwcm9kdWN0aW9uIGVudmlyb25tZW50LCBhcyBteSBleHBlcmllbmNlIGhhcyBncm93biwgaXQgYmVjYW1lXG4gKiBuZWNlc3NhcnkgdG8gcmUtYXJjaGl0ZWN0IHRoZSBlbnRpcmUgZnJhbWV3b3JrIGluIG9yZGVyIHRvIHByb3ZpZGUgYSBtb2Rlcm5cbiAqIG1vYmlsZSBmcmFtZXdvcmsuXG4gKlxuICogWUFTTUYtTmV4dCBpcyB0aGUgcmVzdWx0LiBJdCdzIHlvdW5nLCB1bmRlciBhY3RpdmUgZGV2ZWxvcG1lbnQsIGFuZCBub3QgYXQgYWxsXG4gKiBjb21wYXRpYmxlIHdpdGggWUFTTUYgdjAuMi4gSXQgdXNlcyBhbGwgc29ydHMgb2YgbW9yZSBtb2Rlcm4gdGVjaG5vbG9naWVzIHN1Y2ggYXNcbiAqIFNBU1MgZm9yIENTUyBzdHlsaW5nLCBBTUQsIGV0Yy5cbiAqXG4gKiBZQVNNRi1OZXh0IGlzIGludGVuZGVkIHRvIGJlIGEgc2ltcGxlIGFuZCBmYXN0IGZyYW1ld29yayBmb3IgbW9iaWxlIGFuZCBkZXNrdG9wXG4gKiBkZXZpY2VzLiBJdCBwcm92aWRlcyBzZXZlcmFsIHV0aWxpdHkgZnVuY3Rpb25zIGFuZCBhbHNvIHByb3ZpZGVzIGEgVUkgZnJhbWV3b3JrLlxuICpcbiAqIEBtb2R1bGUgX3lcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjRcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG4vKmdsb2JhbCBtb2R1bGUsIHJlcXVpcmUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIFVUSUwgKi9cbnZhciBfeSA9IHJlcXVpcmUoIFwiLi95YXNtZi91dGlsL2NvcmVcIiApO1xuX3kuZGF0ZXRpbWUgPSByZXF1aXJlKCBcIi4veWFzbWYvdXRpbC9kYXRldGltZVwiICk7XG5feS5maWxlbmFtZSA9IHJlcXVpcmUoIFwiLi95YXNtZi91dGlsL2ZpbGVuYW1lXCIgKTtcbl95Lm1pc2MgPSByZXF1aXJlKCBcIi4veWFzbWYvdXRpbC9taXNjXCIgKTtcbl95LmRldmljZSA9IHJlcXVpcmUoIFwiLi95YXNtZi91dGlsL2RldmljZVwiICk7XG5feS5CYXNlT2JqZWN0ID0gcmVxdWlyZSggXCIuL3lhc21mL3V0aWwvb2JqZWN0XCIgKTtcbl95LkZpbGVNYW5hZ2VyID0gcmVxdWlyZSggXCIuL3lhc21mL3V0aWwvZmlsZU1hbmFnZXJcIiApO1xuX3kuaCA9IHJlcXVpcmUoIFwiLi95YXNtZi91dGlsL2hcIiApO1xuX3kuUm91dGVyID0gcmVxdWlyZSggXCIuL3lhc21mL3V0aWwvcm91dGVyXCIgKTtcblxuLyogVUkgKi9cbl95LlVJID0gcmVxdWlyZSggXCIuL3lhc21mL3VpL2NvcmVcIiApO1xuX3kuVUkuZXZlbnQgPSByZXF1aXJlKCBcIi4veWFzbWYvdWkvZXZlbnRcIiApO1xuX3kuVUkuVmlld0NvbnRhaW5lciA9IHJlcXVpcmUoIFwiLi95YXNtZi91aS92aWV3Q29udGFpbmVyXCIgKTtcbl95LlVJLk5hdmlnYXRpb25Db250cm9sbGVyID0gcmVxdWlyZSggXCIuL3lhc21mL3VpL25hdmlnYXRpb25Db250cm9sbGVyXCIgKTtcbl95LlVJLlNwbGl0Vmlld0NvbnRyb2xsZXIgPSByZXF1aXJlKCBcIi4veWFzbWYvdWkvc3BsaXRWaWV3Q29udHJvbGxlclwiICk7XG5feS5VSS5UYWJWaWV3Q29udHJvbGxlciA9IHJlcXVpcmUoIFwiLi95YXNtZi91aS90YWJWaWV3Q29udHJvbGxlclwiICk7XG5feS5VSS5BbGVydCA9IHJlcXVpcmUoIFwiLi95YXNtZi91aS9hbGVydFwiICk7XG5feS5VSS5TcGlubmVyID0gcmVxdWlyZSggXCIuL3lhc21mL3VpL3NwaW5uZXJcIiApO1xubW9kdWxlLmV4cG9ydHMgPSBfeTtcbiIsIi8qKlxuICpcbiAqIFByb3ZpZGVzIG5hdGl2ZS1saWtlIGFsZXJ0IG1ldGhvZHMsIGluY2x1ZGluZyBwcm9tcHRzIGFuZCBtZXNzYWdlcy5cbiAqXG4gKiBAbW9kdWxlIGFsZXJ0LmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC40XG4gKlxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSovXG52YXIgX3kgPSByZXF1aXJlKCBcIi4uL3V0aWwvY29yZVwiICksXG4gIHRoZURldmljZSA9IHJlcXVpcmUoIFwiLi4vdXRpbC9kZXZpY2VcIiApLFxuICBCYXNlT2JqZWN0ID0gcmVxdWlyZSggXCIuLi91dGlsL29iamVjdFwiICksXG4gIFVJID0gcmVxdWlyZSggXCIuL2NvcmVcIiApLFxuICBRID0gcmVxdWlyZSggXCIuLi8uLi9xXCIgKSxcbiAgZXZlbnQgPSByZXF1aXJlKCBcIi4vZXZlbnRcIiApLFxuICBoID0gcmVxdWlyZSggXCIuLi91dGlsL2hcIiApO1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX2NsYXNzTmFtZSA9IFwiQWxlcnRcIjtcbnZhciBBbGVydCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSBuZXcgQmFzZU9iamVjdCgpO1xuICBzZWxmLnN1YmNsYXNzKCBfY2xhc3NOYW1lICk7XG4gIC8qXG4gICAqICMgTm90aWZpY2F0aW9uc1xuICAgKlxuICAgKiAqIGBidXR0b25UYXBwZWRgIGluZGljYXRlcyB3aGljaCBidXR0b24gd2FzIHRhcHBlZCB3aGVuIHRoZSB2aWV3IGlzIGRpc21pc3NpbmdcbiAgICogKiBgZGlzbWlzc2VkYCBpbmRpY2F0ZXMgdGhhdCB0aGUgYWxlcnQgd2FzIGRpc21pc3NlZCAoYnkgdXNlciBvciBjb2RlKVxuICAgKi9cbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJidXR0b25UYXBwZWRcIiApO1xuICBzZWxmLnJlZ2lzdGVyTm90aWZpY2F0aW9uKCBcImRpc21pc3NlZFwiICk7XG4gIC8qKlxuICAgKiBUaGUgdGl0bGUgdG8gc2hvdyBpbiB0aGUgYWxlcnQuXG4gICAqIEBwcm9wZXJ0eSB0aXRsZVxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc2VsZi5fdGl0bGVFbGVtZW50ID0gbnVsbDsgLy8gdGhlIGNvcnJlc3BvbmRpbmcgRE9NIGVsZW1lbnRcbiAgc2VsZi5zZXRUaXRsZSA9IGZ1bmN0aW9uICggdGhlVGl0bGUgKSB7XG4gICAgc2VsZi5fdGl0bGUgPSB0aGVUaXRsZTtcbiAgICBpZiAoIHNlbGYuX3RpdGxlRWxlbWVudCAhPT0gbnVsbCApIHtcbiAgICAgIGlmICggdHlwZW9mIHNlbGYuX3RpdGxlRWxlbWVudC50ZXh0Q29udGVudCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgc2VsZi5fdGl0bGVFbGVtZW50LnRleHRDb250ZW50ID0gdGhlVGl0bGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLl90aXRsZUVsZW1lbnQuaW5uZXJIVE1MID0gdGhlVGl0bGU7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInRpdGxlXCIsIHtcbiAgICByZWFkOiAgICB0cnVlLFxuICAgIHdyaXRlOiAgIHRydWUsXG4gICAgZGVmYXVsdDogX3kuVCggXCJBTEVSVFwiIClcbiAgfSApO1xuICAvKipcbiAgICogVGhlIGJvZHkgb2YgdGhlIGFsZXJ0LiBMZWF2ZSBibGFuayBpZiB5b3UgZG9uJ3QgbmVlZCB0byBzaG93XG4gICAqIGFueXRoaW5nIG1vcmUgdGhhbiB0aGUgdGl0bGUuXG4gICAqIEBwcm9wZXJ0eSB0ZXh0XG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBzZWxmLl90ZXh0RWxlbWVudCA9IG51bGw7XG4gIHNlbGYuc2V0VGV4dCA9IGZ1bmN0aW9uICggdGhlVGV4dCApIHtcbiAgICBzZWxmLl90ZXh0ID0gdGhlVGV4dDtcbiAgICBpZiAoIHNlbGYuX3RleHRFbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgaWYgKCB0eXBlb2YgdGhlVGV4dCAhPT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZi5fdGV4dEVsZW1lbnQudGV4dENvbnRlbnQgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgc2VsZi5fdGV4dEVsZW1lbnQudGV4dENvbnRlbnQgPSAoIFwiXCIgKyB0aGVUZXh0ICkucmVwbGFjZSggL1xcPGJyXFx3KlxcL1xcPi9nLCBcIlxcclxcblwiICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5fdGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gdGhlVGV4dDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaC5yZW5kZXJUbyggdGhlVGV4dCwgc2VsZi5fdGV4dEVsZW1lbnQsIDAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwidGV4dFwiLCB7XG4gICAgcmVhZDogIHRydWUsXG4gICAgd3JpdGU6IHRydWVcbiAgfSApO1xuICAvKipcbiAgICogVGhlIGFsZXJ0J3MgYnV0dG9ucyBhcmUgc3BlY2lmaWVkIGluIHRoaXMgcHJvcGVydHkuIFRoZSBsYXlvdXRcbiAgICogaXMgZXhwZWN0ZWQgdG8gYmU6IGBbIHsgdGl0bGU6IHRpdGxlIFssIHR5cGU6IHR5cGVdIFssIHRhZzogdGFnXSB9IFssIHt9IC4uLl0gXWBcbiAgICpcbiAgICogRWFjaCBidXR0b24ncyB0eXBlIGNhbiBiZSBcIm5vcm1hbFwiLCBcImJvbGRcIiwgXCJkZXN0cnVjdGl2ZVwiLiBUaGUgdGFnIG1heSBiZVxuICAgKiBudWxsOyBpZiBpdCBpcywgaXQgaXMgYXNzaWduZWQgdGhlIGJ1dHRvbiBpbmRleC4gSWYgYSB0YWcgaXMgc3BlY2lmZWQgKGNvbW1vblxuICAgKiBmb3IgY2FuY2VsIGJ1dHRvbnMpLCB0aGF0IGlzIHRoZSByZXR1cm4gdmFsdWUuXG4gICAqIEBwcm9wZXJ0eSBidXR0b25zXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIHNlbGYuX2J1dHRvbnMgPSBbXTtcbiAgc2VsZi5fYnV0dG9uQ29udGFpbmVyID0gbnVsbDtcbiAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJ3aWRlQnV0dG9uc1wiLCB7XG4gICAgZGVmYXVsdDogXCJhdXRvXCJcbiAgfSApO1xuICBzZWxmLnNldEJ1dHRvbnMgPSBmdW5jdGlvbiAoIHRoZUJ1dHRvbnMgKSB7XG4gICAgZnVuY3Rpb24gdG91Y2hTdGFydCggZSApIHtcbiAgICAgIGlmICggZS50b3VjaGVzICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHRoaXMuc3RhcnRYID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIHRoaXMuc3RhcnRZID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXJ0WCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy5zdGFydFkgPSBlLmNsaWVudFk7XG4gICAgICB9XG4gICAgICB0aGlzLm1vdmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlU2Nyb2xsaW5nKCBlICkge1xuICAgICAgdmFyIG5ld1ggPSAoIGUudG91Y2hlcyAhPT0gdW5kZWZpbmVkICkgPyBlLnRvdWNoZXNbMF0uY2xpZW50WCA6IGUuY2xpZW50WCxcbiAgICAgICAgbmV3WSA9ICggZS50b3VjaGVzICE9PSB1bmRlZmluZWQgKSA/IGUudG91Y2hlc1swXS5jbGllbnRZIDogZS5jbGllbnRZLFxuICAgICAgICBkWCA9IE1hdGguYWJzKCB0aGlzLnN0YXJ0WCAtIG5ld1ggKSxcbiAgICAgICAgZFkgPSBNYXRoLmFicyggdGhpcy5zdGFydFkgLSBuZXdZICk7XG4gICAgICBjb25zb2xlLmxvZyggZFgsIGRZICk7XG4gICAgICBpZiAoIGRYID4gMjAgfHwgZFkgPiAyMCApIHtcbiAgICAgICAgdGhpcy5tb3ZlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlzbWlzc1dpdGhJbmRleCggaWR4ICkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoIHRoaXMubW92ZWQgKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuZGlzbWlzcyggaWR4ICk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBpO1xuICAgIC8vIGNsZWFyIG91dCBhbnkgcHJldmlvdXMgYnV0dG9ucyBpbiB0aGUgRE9NXG4gICAgaWYgKCBzZWxmLl9idXR0b25Db250YWluZXIgIT09IG51bGwgKSB7XG4gICAgICBmb3IgKCBpID0gMDsgaSA8IHNlbGYuX2J1dHRvbnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgIHNlbGYuX2J1dHRvbkNvbnRhaW5lci5yZW1vdmVDaGlsZCggc2VsZi5fYnV0dG9uc1tpXS5lbGVtZW50ICk7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYuX2J1dHRvbnMgPSB0aGVCdXR0b25zO1xuICAgIC8vIGRldGVybWluZSBpZiB3ZSBuZWVkIHdpZGUgYnV0dG9ucyBvciBub3RcbiAgICB2YXIgd2lkZUJ1dHRvbnMgPSBmYWxzZTtcbiAgICBpZiAoIHNlbGYud2lkZUJ1dHRvbnMgPT09IFwiYXV0b1wiICkge1xuICAgICAgd2lkZUJ1dHRvbnMgPSAhKCAoIHNlbGYuX2J1dHRvbnMubGVuZ3RoID49IDIgKSAmJiAoIHNlbGYuX2J1dHRvbnMubGVuZ3RoIDw9IDMgKSApO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aWRlQnV0dG9ucyA9IHNlbGYud2lkZUJ1dHRvbnM7XG4gICAgfVxuICAgIGlmICggd2lkZUJ1dHRvbnMgKSB7XG4gICAgICBzZWxmLl9idXR0b25Db250YWluZXIuY2xhc3NMaXN0LmFkZCggXCJ3aWRlXCIgKTtcbiAgICB9XG4gICAgLy8gYWRkIHRoZSBidXR0b25zIGJhY2sgdG8gdGhlIERPTSBpZiB3ZSBjYW5cbiAgICBpZiAoIHNlbGYuX2J1dHRvbkNvbnRhaW5lciAhPT0gbnVsbCApIHtcbiAgICAgIGZvciAoIGkgPSAwOyBpIDwgc2VsZi5fYnV0dG9ucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG4gICAgICAgIHZhciBiID0gc2VsZi5fYnV0dG9uc1tpXTtcbiAgICAgICAgLy8gaWYgdGhlIHRhZyBpcyBudWxsLCBnaXZlIGl0IChpKVxuICAgICAgICBpZiAoIGIudGFnID09PSBudWxsICkge1xuICAgICAgICAgIGIudGFnID0gaTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjbGFzcyBpcyB1aS1hbGVydC1idXR0b24gbm9ybWFsfGJvbGR8ZGVzdHJ1Y3RpdmUgW3dpZGVdXG4gICAgICAgIC8vIHdpZGUgYnV0dG9ucyBhcmUgZm9yIDEgYnV0dG9uIG9yIDQrIGJ1dHRvbnMuXG4gICAgICAgIGUuY2xhc3NOYW1lID0gXCJ1aS1hbGVydC1idXR0b24gXCIgKyBiLnR5cGUgKyBcIiBcIiArICggd2lkZUJ1dHRvbnMgPyBcIndpZGVcIiA6IFwiXCIgKTtcbiAgICAgICAgLy8gdGl0bGVcbiAgICAgICAgZS5pbm5lckhUTUwgPSBiLnRpdGxlO1xuICAgICAgICBpZiAoICF3aWRlQnV0dG9ucyApIHtcbiAgICAgICAgICAvLyBzZXQgdGhlIHdpZHRoIG9mIGVhY2ggYnV0dG9uIHRvIGZpbGwgb3V0IHRoZSBhbGVydCBlcXVhbGx5XG4gICAgICAgICAgLy8gMyBidXR0b25zIGdldHMgMzMuMzMzJTsgMiBnZXRzIDUwJS5cbiAgICAgICAgICBlLnN0eWxlLndpZHRoID0gXCJcIiArICggMTAwIC8gc2VsZi5fYnV0dG9ucy5sZW5ndGggKSArIFwiJVwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIGxpc3RlbiBmb3IgYSB0b3VjaFxuICAgICAgICBpZiAoIEhhbW1lciApIHtcbiAgICAgICAgICBIYW1tZXIoIGUgKS5vbiggXCJ0YXBcIiwgZGlzbWlzc1dpdGhJbmRleCggaSApICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXZlbnQuYWRkTGlzdGVuZXIoIGUsIFwidG91Y2hzdGFydFwiLCB0b3VjaFN0YXJ0ICk7XG4gICAgICAgICAgZXZlbnQuYWRkTGlzdGVuZXIoIGUsIFwidG91Y2htb3ZlXCIsIGhhbmRsZVNjcm9sbGluZyApO1xuICAgICAgICAgIGV2ZW50LmFkZExpc3RlbmVyKCBlLCBcInRvdWNoZW5kXCIsIGRpc21pc3NXaXRoSW5kZXgoIGkgKSApO1xuICAgICAgICB9XG4gICAgICAgIGIuZWxlbWVudCA9IGU7XG4gICAgICAgIC8vIGFkZCB0aGUgYnV0dG9uIHRvIHRoZSBET01cbiAgICAgICAgc2VsZi5fYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKCBiLmVsZW1lbnQgKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwiYnV0dG9uc1wiLCB7XG4gICAgcmVhZDogICAgdHJ1ZSxcbiAgICB3cml0ZTogICB0cnVlLFxuICAgIGRlZmF1bHQ6IFtdXG4gIH0gKTtcbiAgLy8gb3RoZXIgRE9NIGVsZW1lbnRzIHdlIG5lZWQgdG8gY29uc3RydWN0IHRoZSBhbGVydFxuICBzZWxmLl9yb290RWxlbWVudCA9IG51bGw7IC8vIHJvb3QgZWxlbWVudCBjb250YWlucyB0aGUgY29udGFpbmVyXG4gIHNlbGYuX2FsZXJ0RWxlbWVudCA9IG51bGw7IC8vIHBvaW50cyB0byB0aGUgYWxlcnQgaXRzZWxmXG4gIHNlbGYuX3ZhRWxlbWVudCA9IG51bGw7IC8vIHBvaW50cyB0byB0aGUgRElWIHVzZWQgdG8gdmVydGljYWxseSBhbGlnbiB1c1xuICBzZWxmLl9kZWZlcnJlZCA9IG51bGw7IC8vIHN0b3JlcyBhIHByb21pc2VcbiAgLyoqXG4gICAqIElmIHRydWUsIHNob3coKSByZXR1cm5zIGEgcHJvbWlzZS5cbiAgICogQHByb3BlcnR5IHVzZVByb21pc2VcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInVzZVByb21pc2VcIiwge1xuICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgd3JpdGU6ICAgZmFsc2UsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSApO1xuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBhbGVydCBpcyB2ZWlzaWJsZS5cbiAgICogQHByb3BlcnR5IHZpc2libGVcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInZpc2libGVcIiwge1xuICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgd3JpdGU6ICAgZmFsc2UsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSApO1xuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgRE9NIGVsZW1lbnRzIGZvciBhbiBBbGVydC4gQXNzdW1lcyB0aGUgc3R5bGVzIGFyZVxuICAgKiBhbHJlYWR5IGluIHRoZSBzdHlsZSBzaGVldC5cbiAgICogQG1ldGhvZCBfY3JlYXRlRWxlbWVudHNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2NyZWF0ZUVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3Jvb3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX3Jvb3RFbGVtZW50LmNsYXNzTmFtZSA9IFwidWktYWxlcnQtY29udGFpbmVyXCI7XG4gICAgc2VsZi5fdmFFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX3ZhRWxlbWVudC5jbGFzc05hbWUgPSBcInVpLWFsZXJ0LXZlcnRpY2FsLWFsaWduXCI7XG4gICAgc2VsZi5fYWxlcnRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX2FsZXJ0RWxlbWVudC5jbGFzc05hbWUgPSBcInVpLWFsZXJ0XCI7XG4gICAgc2VsZi5fdGl0bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX3RpdGxlRWxlbWVudC5jbGFzc05hbWUgPSBcInVpLWFsZXJ0LXRpdGxlXCI7XG4gICAgc2VsZi5fdGV4dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG4gICAgc2VsZi5fdGV4dEVsZW1lbnQuY2xhc3NOYW1lID0gXCJ1aS1hbGVydC10ZXh0XCI7XG4gICAgc2VsZi5fYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX2J1dHRvbkNvbnRhaW5lci5jbGFzc05hbWUgPSBcInVpLWFsZXJ0LWJ1dHRvbi1jb250YWluZXJcIjtcbiAgICBzZWxmLl9hbGVydEVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX3RpdGxlRWxlbWVudCApO1xuICAgIHNlbGYuX2FsZXJ0RWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fdGV4dEVsZW1lbnQgKTtcbiAgICBzZWxmLl9hbGVydEVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX2J1dHRvbkNvbnRhaW5lciApO1xuICAgIHNlbGYuX3ZhRWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fYWxlcnRFbGVtZW50ICk7XG4gICAgc2VsZi5fcm9vdEVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX3ZhRWxlbWVudCApO1xuICB9O1xuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGJhY2sgYnV0dG9uIGlzIHByZXNzZWQuIERpc21pc3NlcyB3aXRoIGEgLTEgaW5kZXguIEVmZmVjdGl2ZWx5IGEgQ2FuY2VsLlxuICAgKiBAbWV0aG9kIGJhY2tCdXR0b25QcmVzc2VkXG4gICAqL1xuICBzZWxmLmJhY2tCdXR0b25QcmVzc2VkID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuZGlzbWlzcyggLTEgKTtcbiAgfTtcbiAgLyoqXG4gICAqIEhpZGUgZGlzbWlzc2VzIHRoZSBhbGVydCBhbmQgZGlzbWlzc2VzIGl0IHdpdGggLTEuIEVmZmVjdGl2ZWx5IGEgQ2FuY2VsLlxuICAgKiBAbWV0aG9kIGhpZGVcbiAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBzZWxmLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5kaXNtaXNzKCAtMSApO1xuICB9O1xuICAvKipcbiAgICogU2hvd3MgYW4gYWxlcnQuXG4gICAqIEBtZXRob2Qgc2hvd1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBhIHByb21pc2UgaWYgdXNlUHJvbWlzZSA9IHRydWVcbiAgICovXG4gIHNlbGYuc2hvdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHNlbGYudmlzaWJsZSApIHtcbiAgICAgIGlmICggc2VsZi51c2VQcm9taXNlICYmIHNlbGYuX2RlZmVycmVkICE9PSBudWxsICkge1xuICAgICAgICByZXR1cm4gc2VsZi5fZGVmZXJyZWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdm9pZCAwOyAvLyBjYW4ndCBkbyBhbnl0aGluZyBtb3JlLlxuICAgIH1cbiAgICAvLyBsaXN0ZW4gZm9yIHRoZSBiYWNrIGJ1dHRvblxuICAgIFVJLmJhY2tCdXR0b24uYWRkTGlzdGVuZXJGb3JOb3RpZmljYXRpb24oIFwiYmFja0J1dHRvblByZXNzZWRcIiwgc2VsZi5iYWNrQnV0dG9uUHJlc3NlZCApO1xuICAgIC8vIGFkZCB0byB0aGUgYm9keVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoIHNlbGYuX3Jvb3RFbGVtZW50ICk7XG4gICAgLy8gYW5pbWF0ZSBpblxuICAgIFVJLnN0eWxlRWxlbWVudCggc2VsZi5fYWxlcnRFbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInNjYWxlM2QoMi4wMCwgMi4wMCwxKVwiICk7XG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fcm9vdEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuICAgICAgc2VsZi5fYWxlcnRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICAgIFVJLnN0eWxlRWxlbWVudCggc2VsZi5fYWxlcnRFbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInNjYWxlM2QoMS4wMCwgMS4wMCwxKVwiIClcbiAgICB9LCAxMCApO1xuICAgIHNlbGYuX3Zpc2libGUgPSB0cnVlO1xuICAgIGlmICggc2VsZi51c2VQcm9taXNlICkge1xuICAgICAgc2VsZi5fZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICByZXR1cm4gc2VsZi5fZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGFsZXJ0IHdpdGggdGhlIHNlcGNpZmllZCBidXR0b24gaW5kZXhcbiAgICpcbiAgICogQG1ldGhvZCBkaXNtaXNzXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpZHhcbiAgICovXG4gIHNlbGYuZGlzbWlzcyA9IGZ1bmN0aW9uICggaWR4ICkge1xuICAgIGlmICggIXNlbGYudmlzaWJsZSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZHJvcCB0aGUgbGlzdGVuZXIgZm9yIHRoZSBiYWNrIGJ1dHRvblxuICAgIFVJLmJhY2tCdXR0b24ucmVtb3ZlTGlzdGVuZXJGb3JOb3RpZmljYXRpb24oIFwiYmFja0J1dHRvblByZXNzZWRcIiwgc2VsZi5iYWNrQnV0dG9uUHJlc3NlZCApO1xuICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBib2R5XG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fcm9vdEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgICAgVUkuc3R5bGVFbGVtZW50KCBzZWxmLl9hbGVydEVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIFwic2NhbGUzZCgwLjc1LCAwLjc1LDEpXCIgKVxuICAgIH0sIDEwICk7XG4gICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCggc2VsZi5fcm9vdEVsZW1lbnQgKTtcbiAgICB9LCA2MTAgKTtcbiAgICAvLyBnZXQgbm90aWZpY2F0aW9uIHRhZ1xuICAgIHZhciB0YWcgPSAtMTtcbiAgICBpZiAoICggaWR4ID4gLTEgKSAmJiAoIGlkeCA8IHNlbGYuX2J1dHRvbnMubGVuZ3RoICkgKSB7XG4gICAgICB0YWcgPSBzZWxmLl9idXR0b25zW2lkeF0udGFnO1xuICAgIH1cbiAgICAvLyBzZW5kIG91ciBub3RpZmljYXRpb25zIGFzIGFwcHJvcHJpYXRlXG4gICAgc2VsZi5ub3RpZnkoIFwiZGlzbWlzc2VkXCIgKTtcbiAgICBzZWxmLm5vdGlmeSggXCJidXR0b25UYXBwZWRcIiwgW3RhZ10gKTtcbiAgICBzZWxmLl92aXNpYmxlID0gZmFsc2U7XG4gICAgLy8gYW5kIHJlc29sdmUvcmVqZWN0IHRoZSBwcm9taXNlXG4gICAgaWYgKCBzZWxmLnVzZVByb21pc2UgKSB7XG4gICAgICBpZiAoIHRhZyA+IC0xICkge1xuICAgICAgICBzZWxmLl9kZWZlcnJlZC5yZXNvbHZlKCB0YWcgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuX2RlZmVycmVkLnJlamVjdCggbmV3IEVycm9yKCB0YWcgKSApO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBBbGVydCBhbmQgY2FsbHMgX2NyZWF0ZUVsZW1lbnRzLlxuICAgKiBAbWV0aG9kIGluaXRcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzZWxmLnN1cGVyKCBfY2xhc3NOYW1lLCBcImluaXRcIiApO1xuICAgIHNlbGYuX2NyZWF0ZUVsZW1lbnRzKCk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0gKTtcbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBBbGVydC4gT3B0aW9ucyBpbmNsdWRlcyB0aXRsZSwgdGV4dCwgYnV0dG9ucywgYW5kIHByb21pc2UuXG4gICAqIEBtZXRob2Qgb3ZlcnJpZGVTdXBlclxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqL1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiBpbml0V2l0aE9wdGlvbnMoIG9wdGlvbnMgKSB7XG4gICAgc2VsZi5pbml0KCk7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMudGl0bGUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHNlbGYudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50ZXh0ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBzZWxmLnRleHQgPSBvcHRpb25zLnRleHQ7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLndpZGVCdXR0b25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBzZWxmLndpZGVCdXR0b25zID0gb3B0aW9ucy53aWRlQnV0dG9uc1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5idXR0b25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBzZWxmLmJ1dHRvbnMgPSBvcHRpb25zLmJ1dHRvbnM7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnByb21pc2UgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHNlbGYuX3VzZVByb21pc2UgPSBvcHRpb25zLnByb21pc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWxmO1xuICB9ICk7XG4gIC8qKlxuICAgKiBDbGVhbiB1cCBhZnRlciBvdXJzZWx2ZXMuXG4gICAqIEBtZXRob2QgZGVzdHJveVxuICAgKi9cbiAgc2VsZi5vdmVycmlkZVN1cGVyKCBzZWxmLmNsYXNzLCBcImRlc3Ryb3lcIiwgc2VsZi5kZXN0cm95ICk7XG4gIHNlbGYuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaWYgKCBzZWxmLnZpc2libGUgKSB7XG4gICAgICBzZWxmLmhpZGUoKTtcbiAgICAgIHNldFRpbWVvdXQoIGRlc3Ryb3ksIDYwMCApOyAvLyB3ZSB3b24ndCBkZXN0cm95IGltbWVkaWF0ZWx5LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLl9yb290RWxlbWVudCA9IG51bGw7XG4gICAgc2VsZi5fdmFFbGVtZW50ID0gbnVsbDtcbiAgICBzZWxmLl9hbGVydEVsZW1lbnQgPSBudWxsO1xuICAgIHNlbGYuX3RpdGxlRWxlbWVudCA9IG51bGw7XG4gICAgc2VsZi5fdGV4dEVsZW1lbnQgPSBudWxsO1xuICAgIHNlbGYuX2J1dHRvbkNvbnRhaW5lciA9IG51bGw7XG4gICAgc2VsZi5zdXBlciggX2NsYXNzTmFtZSwgXCJkZXN0cm95XCIgKTtcbiAgfTtcbiAgLy8gaGFuZGxlIGF1dG8taW5pdFxuICBzZWxmLl9hdXRvSW5pdC5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gIHJldHVybiBzZWxmO1xufTtcbi8qKlxuICogQ3JlYXRlcyBhIGJ1dHRvbiBzdWl0YWJsZSBmb3IgYW4gQWxlcnRcbiAqIEBtZXRob2QgYnV0dG9uXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHRpdGxlICAgVGhlIHRpdGxlIG9mIHRoZSBidXR0b25cbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyBUaGUgYWRkaXRpb25hbCBvcHRpb25zOiB0eXBlIGFuZCB0YWdcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICBBIGJ1dHRvblxuICovXG5BbGVydC5idXR0b24gPSBmdW5jdGlvbiAoIHRpdGxlLCBvcHRpb25zICkge1xuICB2YXIgYnV0dG9uID0ge307XG4gIGJ1dHRvbi50aXRsZSA9IHRpdGxlO1xuICBidXR0b24udHlwZSA9IFwibm9ybWFsXCI7IC8vIG5vcm1hbCwgYm9sZCwgZGVzdHJ1Y3RpdmVcbiAgYnV0dG9uLnRhZyA9IG51bGw7IC8vIGFzc2lnbiBmb3IgYSBzcGVjaWZpYyB0YWdcbiAgYnV0dG9uLmVuYWJsZWQgPSB0cnVlOyAvLyBmYWxzZSA9IGRpc2FibGVkLlxuICBidXR0b24uZWxlbWVudCA9IG51bGw7IC8vIGF0dGFjaGVkIERPTSBlbGVtZW50XG4gIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50eXBlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgYnV0dG9uLnR5cGUgPSBvcHRpb25zLnR5cGU7XG4gICAgfVxuICAgIGlmICggdHlwZW9mIG9wdGlvbnMudGFnICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgYnV0dG9uLnRhZyA9IG9wdGlvbnMudGFnO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmVuYWJsZWQgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBidXR0b24uZW5hYmxlZCA9IG9wdGlvbnMuZW5hYmxlZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ1dHRvbjtcbn07XG4vKipcbiAqIENyZWF0ZXMgYW4gT0stc3R5bGUgQWxlcnQuIEl0IG9ubHkgaGFzIGFuIE9LIGJ1dHRvbi5cbiAqIEBtZXRob2QgT0tcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFNwZWNpZnkgdGhlIHRpdGxlLCB0ZXh0LCBhbmQgcHJvbWlzZSBvcHRpb25zIGlmIGRlc2lyZWQuXG4gKi9cbkFsZXJ0Lk9LID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICB2YXIgYW5PSyA9IG5ldyBBbGVydCgpO1xuICB2YXIgYW5PS09wdGlvbnMgPSB7XG4gICAgdGl0bGU6ICAgX3kuVCggXCJPS1wiICksXG4gICAgdGV4dDogICAgXCJcIixcbiAgICBidXR0b25zOiBbQWxlcnQuYnV0dG9uKCBfeS5UKCBcIk9LXCIgKSwge1xuICAgICAgdHlwZTogXCJib2xkXCJcbiAgICB9ICldXG4gIH07XG4gIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50aXRsZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGFuT0tPcHRpb25zLnRpdGxlID0gb3B0aW9ucy50aXRsZTtcbiAgICB9XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50ZXh0ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgYW5PS09wdGlvbnMudGV4dCA9IG9wdGlvbnMudGV4dDtcbiAgICB9XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5wcm9taXNlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgYW5PS09wdGlvbnMucHJvbWlzZSA9IG9wdGlvbnMucHJvbWlzZTtcbiAgICB9XG4gIH1cbiAgYW5PSy5pbml0V2l0aE9wdGlvbnMoIGFuT0tPcHRpb25zICk7XG4gIHJldHVybiBhbk9LO1xufTtcbi8qKlxuICogQ3JlYXRlcyBhbiBPSy9DYW5jZWwtc3R5bGUgQWxlcnQuIEl0IG9ubHkgaGFzIGFuIE9LIGFuZCBDQU5DRUwgYnV0dG9uLlxuICogQG1ldGhvZCBDb25maXJtXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBTcGVjaWZ5IHRoZSB0aXRsZSwgdGV4dCwgYW5kIHByb21pc2Ugb3B0aW9ucyBpZiBkZXNpcmVkLlxuICovXG5BbGVydC5Db25maXJtID0gZnVuY3Rpb24gKCBvcHRpb25zICkge1xuICB2YXIgYUNvbmZpcm1hdGlvbiA9IG5ldyBBbGVydCgpO1xuICB2YXIgY29uZmlybWF0aW9uT3B0aW9ucyA9IHtcbiAgICB0aXRsZTogICBfeS5UKCBcIkNvbmZpcm1cIiApLFxuICAgIHRleHQ6ICAgIFwiXCIsXG4gICAgYnV0dG9uczogW0FsZXJ0LmJ1dHRvbiggX3kuVCggXCJPS1wiICkgKSxcbiAgICAgICAgICAgICAgQWxlcnQuYnV0dG9uKCBfeS5UKCBcIkNhbmNlbFwiICksIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImJvbGRcIixcbiAgICAgICAgICAgICAgICB0YWc6ICAtMVxuICAgICAgICAgICAgICB9IClcbiAgICBdXG4gIH07XG4gIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50aXRsZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGNvbmZpcm1hdGlvbk9wdGlvbnMudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnRleHQgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBjb25maXJtYXRpb25PcHRpb25zLnRleHQgPSBvcHRpb25zLnRleHQ7XG4gICAgfVxuICAgIGlmICggdHlwZW9mIG9wdGlvbnMucHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGNvbmZpcm1hdGlvbk9wdGlvbnMucHJvbWlzZSA9IG9wdGlvbnMucHJvbWlzZTtcbiAgICB9XG4gIH1cbiAgYUNvbmZpcm1hdGlvbi5pbml0V2l0aE9wdGlvbnMoIGNvbmZpcm1hdGlvbk9wdGlvbnMgKTtcbiAgcmV0dXJuIGFDb25maXJtYXRpb247XG59O1xubW9kdWxlLmV4cG9ydHMgPSBBbGVydDtcbiIsIi8qKlxuICpcbiAqIENvcmUgb2YgWUFTTUYtVUk7IGRlZmluZXMgdGhlIHZlcnNpb24gYW5kIGJhc2ljIFVJICBjb252ZW5pZW5jZSBtZXRob2RzLlxuICpcbiAqIEBtb2R1bGUgY29yZS5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNFxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSovXG5cInVzZSBzdHJpY3RcIjtcbnZhciB0aGVEZXZpY2UgPSByZXF1aXJlKCBcIi4uL3V0aWwvZGV2aWNlXCIgKTtcbnZhciBCYXNlT2JqZWN0ID0gcmVxdWlyZSggXCIuLi91dGlsL29iamVjdFwiICk7XG52YXIgcHJlZml4ZXMgPSBbXCItd2Via2l0LVwiLCBcIi1tb3otXCIsIFwiLW1zLVwiLCBcIi1vLVwiLCBcIlwiXSxcbiAganNQcmVmaXhlcyA9IFtcIndlYmtpdFwiLCBcIm1velwiLCBcIm1zXCIsIFwib1wiLCBcIlwiXSxcbiAgLyoqXG4gICAqIEBtZXRob2QgQW5pbWF0aW9uXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0FycmF5fSBlbHMgICAgICAgICAgICAgZWxlbWVudHMgdG8gYW5pbWF0ZVxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltaW5nICAgICAgICAgc2Vjb25kcyB0byBhbmltYXRlIG92ZXIgKDAuMyBkZWZhdWx0KVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltaW5nRnVuY3Rpb24gdGltaW5nIGZ1bmN0aW9uIChlYXNlLWluLW91dCBkZWZhdWx0KVxuICAgKiBAcmV0dXJuIHtBbmltYXRpb259XG4gICAqL1xuICBBbmltYXRpb24gPSBmdW5jdGlvbiAoIGVscywgdGltaW5nLCB0aW1pbmdGdW5jdGlvbiApIHtcbiAgICB0aGlzLl9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcbiAgICB0aGlzLl9lbHMgPSBlbHM7XG4gICAgdGhpcy5fYW5pbWF0aW9ucyA9IFtdO1xuICAgIHRoaXMuX3RyYW5zaXRpb25zID0gW107XG4gICAgdGhpcy50aW1pbmdGdW5jdGlvbiA9IFwiZWFzZS1pbi1vdXRcIjtcbiAgICB0aGlzLnRpbWluZyA9IDAuMztcbiAgICB0aGlzLl9tYXhUaW1pbmcgPSAwO1xuICAgIGlmICggdHlwZW9mIHRpbWluZyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIHRoaXMudGltaW5nID0gdGltaW5nO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiB0aW1pbmdGdW5jdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIHRoaXMudGltaW5nRnVuY3Rpb24gPSB0aW1pbmdGdW5jdGlvbjtcbiAgICB9XG4gIH07XG4vKipcbiAqIEBtZXRob2QgX3B1c2hBbmltYXRpb25cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgICAgICAgICBzdHlsZSBwcm9wZXJ0eVxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAgICAgICAgICAgdmFsdWUgdG8gYXNzaWduIHRvIHByb3BlcnR5XG4gKiBAcGFyYW0ge251bWJlcn0gdGltaW5nICAgICAgICAgICBzZWNvbmRzIGZvciBhbmltYXRpb24gKG9wdGlvbmFsKVxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWluZ0Z1bmN0aW9uICAgdGltaW5nIGZ1bmN0aW9uIChvcHRpb25hbClcbiAqIEByZXR1cm4ge0FuaW1hdGlvbn0gICAgICAgICAgICAgIHNlbGYsIGZvciBjaGFpbmluZ1xuICovXG5mdW5jdGlvbiBfcHVzaEFuaW1hdGlvbiggcHJvcGVydHksIHZhbHVlLCB0aW1pbmcsIHRpbWluZ0Z1bmN0aW9uICkge1xuICB2YXIgbmV3UHJvcCwgbmV3VmFsdWUsIHByZWZpeCwganNQcmVmaXgsIG5ld0pzUHJvcDtcbiAgZm9yICggdmFyIGkgPSAwLCBsID0gcHJlZml4ZXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgIHByZWZpeCA9IHByZWZpeGVzW2ldO1xuICAgIGpzUHJlZml4ID0ganNQcmVmaXhlc1tpXTtcbiAgICBuZXdQcm9wID0gcHJlZml4ICsgcHJvcGVydHk7XG4gICAgaWYgKCBqc1ByZWZpeCAhPT0gXCJcIiApIHtcbiAgICAgIG5ld0pzUHJvcCA9IGpzUHJlZml4ICsgcHJvcGVydHkuc3Vic3RyKCAwLCAxICkudG9VcHBlckNhc2UoKSArIHByb3BlcnR5LnN1YnN0ciggMSApO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdKc1Byb3AgPSBwcm9wZXJ0eTtcbiAgICB9XG4gICAgbmV3VmFsdWUgPSB2YWx1ZS5yZXBsYWNlKCBcInstfVwiLCBwcmVmaXggKTtcbiAgICBpZiAoIHR5cGVvZiB0aGlzLl9lbC5zdHlsZVtuZXdKc1Byb3BdICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgdGhpcy5fYW5pbWF0aW9ucy5wdXNoKCBbbmV3UHJvcCwgbmV3VmFsdWVdICk7XG4gICAgICB0aGlzLl90cmFuc2l0aW9ucy5wdXNoKCBbbmV3UHJvcCwgKCB0eXBlb2YgdGltaW5nICE9PSBcInVuZGVmaW5lZFwiID8gdGltaW5nIDogdGhpcy50aW1pbmcgKSArIFwic1wiLCAoIHR5cGVvZiB0aW1pbmdGdW5jdGlvbiAhPT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVuZGVmaW5lZFwiID8gdGltaW5nRnVuY3Rpb24gOiB0aGlzLnRpbWluZ0Z1bmN0aW9uICldICk7XG4gICAgfVxuICAgIHRoaXMuX21heFRpbWluZyA9IE1hdGgubWF4KCB0aGlzLl9tYXhUaW1pbmcsICggdHlwZW9mIHRpbWluZyAhPT0gXCJ1bmRlZmluZWRcIiA/IHRpbWluZyA6IHRoaXMudGltaW5nICkgKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cbi8qKlxuICogU2V0IHRoZSBkZWZhdWx0IHRpbWluZyBmdW5jdGlvbiBmb3IgZm9sbG93aW5nIGFuaW1hdGlvbnNcbiAqIEBtZXRob2Qgc2V0VGltaW5nRnVuY3Rpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1pbmdGdW5jdGlvbiAgICAgIHRoZSB0aW1pbmcgZnVuY3Rpb24gdG8gYXNzaWduLCBsaWtlIFwiZWFzZS1pbi1vdXRcIlxuICogQHJldHVybiB7QW5pbWF0aW9ufSAgICAgICAgICAgICAgICAgc2VsZlxuICovXG5BbmltYXRpb24ucHJvdG90eXBlLnNldFRpbWluZ0Z1bmN0aW9uID0gZnVuY3Rpb24gc2V0VGltaW5nRnVuY3Rpb24oIHRpbWluZ0Z1bmN0aW9uICkge1xuICB0aGlzLnRpbWluZ0Z1bmN0aW9uID0gdGltaW5nRnVuY3Rpb247XG4gIHJldHVybiB0aGlzO1xufTtcbi8qKlxuICogU2V0IHRoZSB0aW1pbmcgZm9yIHRoZSBmb2xsb3dpbmcgYW5pbWF0aW9ucywgaW4gc2Vjb25kc1xuICogQG1ldGhvZCBzZXRUaW1pbmdcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1pbmcgICAgICAgICAgICAgIHRoZSBsZW5ndGggb2YgdGhlIGFuaW1hdGlvbiwgaW4gc2Vjb25kc1xuICogQHJldHVybiB7QW5pbWF0aW9ufSAgICAgICAgICAgICAgICAgc2VsZlxuICovXG5BbmltYXRpb24ucHJvdG90eXBlLnNldFRpbWluZyA9IGZ1bmN0aW9uIHNldFRpbWluZyggdGltaW5nICkge1xuICB0aGlzLnRpbWluZyA9IHRpbWluZztcbiAgcmV0dXJuIHRoaXM7XG59O1xuLyoqXG4gKiBNb3ZlIHRoZSBlbGVtZW50IHRvIHRoZSBzcGVjaWZpYyBwb3NpdGlvbiAodXNpbmcgbGVmdCwgdG9wKVxuICpcbiAqIEBtZXRob2QgbW92ZVxuICogQHBhcmFtIHtzdHJpbmd9IHggICAgICAgICAgIHRoZSB4IHBvc2l0aW9uIChweCBvciAlKVxuICogQHBhcmFtIHtzdHJpbmd9IHkgICAgICAgICAgIHRoZSB5IHBvc2l0aW9uIChweCBvciAlKVxuICogQHJldHVybiB7QW5pbWF0aW9ufSBzZWxmXG4gKi9cbkFuaW1hdGlvbi5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uICggeCwgeSApIHtcbiAgX3B1c2hBbmltYXRpb24uY2FsbCggdGhpcywgXCJsZWZ0XCIsIHggKTtcbiAgcmV0dXJuIF9wdXNoQW5pbWF0aW9uLmNhbGwoIHRoaXMsIFwidG9wXCIsIHkgKTtcbn07XG4vKipcbiAqIFJlc2l6ZSB0aGUgZWxlbWVudCAodXNpbmcgd2lkdGgsIGhlaWdodClcbiAqXG4gKiBAbWV0aG9kIHJlc2l6ZVxuICogQHBhcmFtIHtzdHJpbmd9IHcgICAgICAgICAgIHRoZSB3aWR0aCAocHggb3IgJSlcbiAqIEBwYXJhbSB7c3RyaW5nfSBoICAgICAgICAgICB0aGUgaGVpZ2h0IChweCBvciAlKVxuICogQHJldHVybiB7QW5pbWF0aW9ufSBzZWxmXG4gKi9cbkFuaW1hdGlvbi5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gKCB3LCBoICkge1xuICBfcHVzaEFuaW1hdGlvbi5jYWxsKCB0aGlzLCBcIndpZHRoXCIsIHcgKTtcbiAgcmV0dXJuIF9wdXNoQW5pbWF0aW9uLmNhbGwoIHRoaXMsIFwiaGVpZ2h0XCIsIGggKTtcbn07XG4vKipcbiAqIENoYW5nZSBvcGFjaXR5XG4gKiBAbWV0aG9kIG9wYWNpdHlcbiAqIEBwYXJhbSB7c3RyaW5nfSBvICAgICAgICAgICBvcGFjaXR5XG4gKiBAcmV0dXJuIHtBbmltYXRpb259IHNlbGZcbiAqL1xuQW5pbWF0aW9uLnByb3RvdHlwZS5vcGFjaXR5ID0gZnVuY3Rpb24gKCBvICkge1xuICByZXR1cm4gX3B1c2hBbmltYXRpb24uY2FsbCggdGhpcywgXCJvcGFjaXR5XCIsIG8gKTtcbn07XG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZWxlbWVudCB1c2luZyB0cmFuc2xhdGUgeCwgeVxuICogQG1ldGhvZCB0cmFuc2xhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSB4ICAgICAgIHggcG9zaXRpb24gKHB4IG9yICUpXG4gKiBAcGFyYW0ge3N0cmluZ30geSAgICAgICB5IHBvc2l0aW9uIChweCBvciAlKVxuICogQHJldHVybiB7QW5pbWF0aW9ufSBzZWxmXG4gKi9cbkFuaW1hdGlvbi5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKCB4LCB5ICkge1xuICByZXR1cm4gX3B1c2hBbmltYXRpb24uY2FsbCggdGhpcywgXCJ0cmFuc2Zvcm1cIiwgW1widHJhbnNsYXRlKFwiLCBbeCwgeV0uam9pbiggXCIsIFwiICksIFwiKVwiXS5qb2luKCBcIlwiICkgKTtcbn07XG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZWxlbWVudCB1c2luZyB0cmFuc2xhdGUzZCB4LCB5LCB6XG4gKiBAbWV0aG9kIHRyYW5zbGF0ZTNkXG4gKiBAcGFyYW0ge3N0cmluZ30geCAgICAgICB4IHBvc2l0aW9uIChweCBvciAlKVxuICogQHBhcmFtIHtzdHJpbmd9IHkgICAgICAgeSBwb3NpdGlvbiAocHggb3IgJSlcbiAqIEBwYXJhbSB7c3RyaW5nfSB6ICAgICAgIHogcG9zaXRpb24gKHB4IG9yICUpXG4gKiBAcmV0dXJuIHtBbmltYXRpb259IHNlbGZcbiAqL1xuQW5pbWF0aW9uLnByb3RvdHlwZS50cmFuc2xhdGUzZCA9IGZ1bmN0aW9uICggeCwgeSwgeiApIHtcbiAgcmV0dXJuIF9wdXNoQW5pbWF0aW9uLmNhbGwoIHRoaXMsIFwidHJhbnNmb3JtXCIsIFtcInRyYW5zbGF0ZTNkKFwiLCBbeCwgeSwgel0uam9pbiggXCIsIFwiICksIFwiKVwiXS5qb2luKCBcIlwiICkgKTtcbn07XG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZWxlbWVudCB1c2luZyBzY2FsZVxuICogQG1ldGhvZCBzY2FsZVxuICogQHBhcmFtIHtzdHJpbmd9IHAgICAgICAgcGVyY2VudCAoMC4wMC0xLjAwKVxuICogQHJldHVybiB7QW5pbWF0aW9ufSBzZWxmXG4gKi9cbkFuaW1hdGlvbi5wcm90b3R5cGUuc2NhbGUgPSBmdW5jdGlvbiAoIHAgKSB7XG4gIHJldHVybiBfcHVzaEFuaW1hdGlvbi5jYWxsKCB0aGlzLCBcInRyYW5zZm9ybVwiLCBbXCJzY2FsZShcIiwgcCwgXCIpXCJdLmpvaW4oIFwiXCIgKSApO1xufTtcbi8qKlxuICogVHJhbnNmb3JtIHRoZSBlbGVtZW50IHVzaW5nIHNjYWxlXG4gKiBAbWV0aG9kIHJvdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGQgICAgICAgZGVncmVlc1xuICogQHJldHVybiB7QW5pbWF0aW9ufSBzZWxmXG4gKi9cbkFuaW1hdGlvbi5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24gKCBkICkge1xuICByZXR1cm4gX3B1c2hBbmltYXRpb24uY2FsbCggdGhpcywgXCJ0cmFuc2Zvcm1cIiwgW1wicm90YXRlKFwiLCBkLCBcImRlZylcIl0uam9pbiggXCJcIiApICk7XG59O1xuLyoqXG4gKiBlbmQgdGhlIGFuaW1hdGlvbiBkZWZpbml0aW9uIGFuZCB0cmlnZ2VyIHRoZSBzZXF1ZW5jZS4gSWYgYSBjYWxsYmFjayBtZXRob2RcbiAqIGlzIHN1cHBsaWVkLCBpdCBpcyBjYWxsZWQgd2hlbiB0aGUgYW5pbWF0aW9uIGlzIG92ZXJcbiAqIEBtZXRob2QgZW5kQW5pbWF0aW9uXG4gKiBAYWxpYXMgdGhlblxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gICAgICAgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIGFuaW1hdGlvbiBpcyBjb21wbGV0ZWQ7XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdCBpcyBib3VuZCB0byB0aGUgQW5pbWF0aW9uIG1ldGhvZCBzbyB0aGF0XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdXJ0aGVyIGFuaW1hdGlvbnMgY2FuIGJlIHRyaWdnZXJlZC5cbiAqIEByZXR1cm4ge0FuaW1hdGlvbn0gc2VsZlxuICovXG5BbmltYXRpb24ucHJvdG90eXBlLmVuZEFuaW1hdGlvbiA9IGZ1bmN0aW9uIGVuZEFuaW1hdGlvbiggZm4gKSB7XG4gIC8vIGNyZWF0ZSB0aGUgbGlzdCBvZiB0cmFuc2l0aW9ucyB3ZSBuZWVkIHRvIHB1dCBvbiB0aGUgZWxlbWVudHNcbiAgdmFyIHRyYW5zaXRpb24gPSB0aGlzLl90cmFuc2l0aW9ucy5tYXAoIGZ1bmN0aW9uICggdCApIHtcbiAgICAgIHJldHVybiB0LmpvaW4oIFwiIFwiICk7XG4gICAgfSApLmpvaW4oIFwiLCBcIiApLFxuICAgIHRoYXQgPSB0aGlzO1xuICAvLyBmb3IgZWFjaCBlbGVtZW50LCBhc3NpZ24gdGhpcyBsaXN0IG9mIHRyYW5zaXRpb25zXG4gIHRoYXQuX2Vscy5mb3JFYWNoKCBmdW5jdGlvbiBpbml0aWFsaXplRWwoIGVsICkge1xuICAgIHZhciBpLCBsLCBwcmVmaXhlZFRyYW5zaXRpb247XG4gICAgZm9yICggaSA9IDAsIGwgPSBwcmVmaXhlcy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICBwcmVmaXhlZFRyYW5zaXRpb24gPSBwcmVmaXhlc1tpXSArIFwidHJhbnNpdGlvblwiO1xuICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoIHByZWZpeGVkVHJhbnNpdGlvbiwgdHJhbnNpdGlvbiApO1xuICAgIH1cbiAgfSApO1xuICAvLyB3YWl0IGEgZmV3IG1zIHRvIGxldCB0aGUgRE9NIHNldHRsZSwgYW5kIHRoZW4gc3RhcnQgdGhlIGFuaW1hdGlvbnNcbiAgc2V0VGltZW91dCggZnVuY3Rpb24gc3RhcnRBbmltYXRpb25zKCkge1xuICAgIHZhciBpLCBsLCBwcm9wLCB2YWx1ZTtcbiAgICAvLyBmb3IgZWFjaCBlbGVtZW50LCBhc3NpZ24gdGhlIGRlc2lyZWQgcHJvcGVydHkgYW5kIHZhbHVlIHRvIHRoZSBlbGVtZW50XG4gICAgdGhhdC5fZWxzLmZvckVhY2goIGZ1bmN0aW9uIGFuaW1hdGVFbCggZWwgKSB7XG4gICAgICBmb3IgKCBpID0gMCwgbCA9IHRoYXQuX2FuaW1hdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICBwcm9wID0gdGhhdC5fYW5pbWF0aW9uc1tpXVswXTtcbiAgICAgICAgdmFsdWUgPSB0aGF0Ll9hbmltYXRpb25zW2ldWzFdO1xuICAgICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eSggcHJvcCwgdmFsdWUgKTtcbiAgICAgIH1cbiAgICB9ICk7XG4gICAgLy8gd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLCByZW1vdmUgdGhlIHRyYW5zaXRpb24gcHJvcGVydHkgZnJvbVxuICAgIC8vIHRoZSBlbGVtZW50cyBhbmQgY2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gKGlmIHNwZWNpZmllZClcbiAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbiBhZnRlckFuaW1hdGlvbkNhbGxiYWNrKCkge1xuICAgICAgdmFyIHByZWZpeGVkVHJhbnNpdGlvbjtcbiAgICAgIHRoYXQuX2FuaW1hdGlvbnMgPSBbXTtcbiAgICAgIHRoYXQuX3RyYW5zaXRpb25zID0gW107XG4gICAgICB0aGF0Ll9lbHMuZm9yRWFjaCggZnVuY3Rpb24gYW5pbWF0ZUVsKCBlbCApIHtcbiAgICAgICAgZm9yICggdmFyIGkgPSAwLCBsID0gcHJlZml4ZXMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgIHByZWZpeGVkVHJhbnNpdGlvbiA9IHByZWZpeGVzW2ldICsgXCJ0cmFuc2l0aW9uXCI7XG4gICAgICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoIHByZWZpeGVkVHJhbnNpdGlvbiwgXCJcIiApO1xuICAgICAgICB9XG4gICAgICB9ICk7XG4gICAgICBpZiAoIHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICBmbi5jYWxsKCB0aGF0ICk7XG4gICAgICB9XG4gICAgfSwgdGhhdC5fbWF4VGltaW5nICogMTAwMCApO1xuICB9LCA1MCApO1xuICByZXR1cm4gdGhpcztcbn07XG5BbmltYXRpb24ucHJvdG90eXBlLnRoZW4gPSBBbmltYXRpb24ucHJvdG90eXBlLmVuZEFuaW1hdGlvbjtcbnZhciBVSSA9IHt9O1xuLyoqXG4gKiBWZXJzaW9uIG9mIHRoZSBVSSBOYW1lc3BhY2VcbiAqIEBwcm9wZXJ0eSB2ZXJzaW9uXG4gKiBAdHlwZSBPYmplY3RcbiAqKi9cblVJLnZlcnNpb24gPSBcIjAuNS4xMDBcIjtcbi8qKlxuICogU3R5bGVzIHRoZSBlbGVtZW50IHdpdGggdGhlIGdpdmVuIHN0eWxlIGFuZCB2YWx1ZS4gQWRkcyBpbiB0aGUgYnJvd3NlclxuICogcHJlZml4ZXMgdG8gbWFrZSBpdCBlYXNpZXIuIEFsc28gYXZhaWxhYmxlIGFzIGAkc2Agb24gbm9kZXMuXG4gKlxuICogQG1ldGhvZCBzdHlsZUVsZW1lbnRcbiAqIEBhbGlhcyAkc1xuICogQHBhcmFtICB7Tm9kZX0gdGhlRWxlbWVudFxuICogQHBhcmFtICB7Q3NzU3R5bGV9IHRoZVN0eWxlICAgRG9uJ3QgY2FtZWxDYXNlIHRoZXNlLCB1c2UgZGFzaGVzIGFzIGluIHJlZ3VsYXIgc3R5bGVzXG4gKiBAcGFyYW0gIHt2YWx1ZX0gdGhlVmFsdWVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5VSS5zdHlsZUVsZW1lbnQgPSBmdW5jdGlvbiAoIHRoZUVsZW1lbnQsIHRoZVN0eWxlLCB0aGVWYWx1ZSApIHtcbiAgaWYgKCB0eXBlb2YgdGhlRWxlbWVudCAhPT0gXCJvYmplY3RcIiApIHtcbiAgICBpZiAoICEoIHRoZUVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlICkgKSB7XG4gICAgICB0aGVWYWx1ZSA9IHRoZVN0eWxlO1xuICAgICAgdGhlU3R5bGUgPSB0aGVFbGVtZW50O1xuICAgICAgdGhlRWxlbWVudCA9IHRoaXM7XG4gICAgfVxuICB9XG4gIGZvciAoIHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciB0aGVQcmVmaXggPSBwcmVmaXhlc1tpXSxcbiAgICAgIHRoZU5ld1N0eWxlID0gdGhlUHJlZml4ICsgdGhlU3R5bGUsXG4gICAgICB0aGVOZXdWYWx1ZSA9IHRoZVZhbHVlLnJlcGxhY2UoIFwiJVBSRUZJWCVcIiwgdGhlUHJlZml4ICkucmVwbGFjZSggXCJ7LX1cIiwgdGhlUHJlZml4ICk7XG4gICAgdGhlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSggdGhlTmV3U3R5bGUsIHRoZU5ld1ZhbHVlICk7XG4gIH1cbn07XG4vKipcbiAqIFN0eWxlIHRoZSBsaXN0IG9mIGVsZW1lbnRzIHdpdGggdGhlIHN0eWxlIGFuZCB2YWx1ZSB1c2luZyBgc3R5bGVFbGVtZW50YFxuICogQG1ldGhvZCBzdHlsZUVsZW1lbnRzXG4gKiBAcGFyYW0gIHtBcnJheX0gIHRoZUVsZW1lbnRzXG4gKiBAcGFyYW0gIHtDc3NTdHlsZX0gdGhlU3R5bGVcbiAqIEBwYXJhbSB7dmFsdWV9IHRoZVZhbHVlXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVUkuc3R5bGVFbGVtZW50cyA9IGZ1bmN0aW9uICggdGhlRWxlbWVudHMsIHRoZVN0eWxlLCB0aGVWYWx1ZSApIHtcbiAgdmFyIGk7XG4gIGZvciAoIGkgPSAwOyBpIDwgdGhlRWxlbWVudHMubGVuZ3RoOyBpKysgKSB7XG4gICAgVUkuc3R5bGVFbGVtZW50KCB0aGVFbGVtZW50c1tpXSwgdGhlU3R5bGUsIHRoZVZhbHVlICk7XG4gIH1cbn07XG4vKipcbiAqIEJlZ2luIGFuIGFuaW1hdGlvbiBkZWZpbml0aW9uIGFuZCBhcHBseSBpdCB0byB0aGUgc3BlY2lmaWNcbiAqIGVsZW1lbnRzIGRlZmluZWQgYnkgc2VsZWN0b3IuIElmIHBhcmVudCBpcyBzdXBwbGllZCwgdGhlIHNlbGVjdG9yXG4gKiBpcyByZWxhdGl2ZSB0byB0aGUgcGFyZW50LCBvdGhlcndpc2UgaXQgaXMgcmVsYXRpdmUgdG8gZG9jdW1lbnRcbiAqIEBtZXRob2QgYmVnaW5BbmltYXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfEFycmF5fE5vZGV9IHNlbGVjdG9yICAgICAgSWYgYSBzdHJpbmcsIGFuaW1hdGlvbiBhcHBsaWVzIHRvIGFsbFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcyB0aGF0IG1hdGNoIHRoZSBzZWxlY3Rvci4gSWYgYW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXksIGFuaW1hdGlvbiBhcHBsaWVzIHRvIGFsbCBub2Rlc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB0aGUgYXJyYXkuIElmIGEgbm9kZSwgdGhlIGFuaW1hdGlvblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBsaWVzIG9ubHkgdG8gdGhlIG5vZGUuXG4gKiBAcGFyYW0ge05vZGV9IHBhcmVudCAgICAgICAgICAgICAgICAgICAgIE9wdGlvbmFsOyBpZiBwcm92aWRlZCwgc2VsZWN0b3IgaXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVsYXRpdmUgdG8gdGhpcyBub2RlXG4gKiBAcmV0dXJuIHtBbmltYXRpb259ICAgICAgICAgICAgICAgICAgICAgIEFuaW1hdGlvbiBvYmplY3RcbiAqL1xuVUkuYmVnaW5BbmltYXRpb24gPSBmdW5jdGlvbiAoIHNlbGVjdG9yLCBwYXJlbnQgKSB7XG4gIHZhciBlbHMgPSBbXTtcbiAgaWYgKCB0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgaWYgKCB0eXBlb2YgcGFyZW50ID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgcGFyZW50ID0gZG9jdW1lbnQ7XG4gICAgfVxuICAgIGVscyA9IGVscy5jb25jYXQoIEFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbCggcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yICksIDAgKSApO1xuICB9XG4gIGlmICggdHlwZW9mIHNlbGVjdG9yID09PSBcIm9iamVjdFwiICYmIHNlbGVjdG9yIGluc3RhbmNlb2YgQXJyYXkgKSB7XG4gICAgZWxzID0gZWxzLmNvbmNhdCggc2VsZWN0b3IgKTtcbiAgfVxuICBpZiAoIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJvYmplY3RcIiAmJiBzZWxlY3RvciBpbnN0YW5jZW9mIE5vZGUgKSB7XG4gICAgZWxzID0gZWxzLmNvbmNhdCggW3NlbGVjdG9yXSApO1xuICB9XG4gIHJldHVybiBuZXcgQW5pbWF0aW9uKCBlbHMgKTtcbn07XG4vKipcbiAqXG4gKiBDb252ZXJ0cyBhIGNvbG9yIG9iamVjdCB0byBhbiByZ2JhKHIsZyxiLGEpIHN0cmluZywgc3VpdGFibGUgZm9yIGFwcGx5aW5nIHRvXG4gKiBhbnkgbnVtYmVyIG9mIENTUyBzdHlsZXMuIElmIHRoZSBjb2xvcidzIGFscGhhIGlzIHplcm8sIHRoZSByZXR1cm4gdmFsdWUgaXNcbiAqIFwidHJhbnNwYXJlbnRcIi4gSWYgdGhlIGNvbG9yIGlzIG51bGwsIHRoZSByZXR1cm4gdmFsdWUgaXMgXCJpbmhlcml0XCIuXG4gKlxuICogQG1ldGhvZCBjb2xvclRvUkdCQVxuICogQHN0YXRpY1xuICogQHBhcmFtIHtjb2xvcn0gdGhlQ29sb3IgLSB0aGVDb2xvciB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gYSBDU1MgdmFsdWUgc3VpdGFibGUgZm9yIGNvbG9yIHByb3BlcnRpZXNcbiAqL1xuVUkuY29sb3JUb1JHQkEgPSBmdW5jdGlvbiAoIHRoZUNvbG9yICkge1xuICBpZiAoICF0aGVDb2xvciApIHtcbiAgICByZXR1cm4gXCJpbmhlcml0XCI7XG4gIH1cbiAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkVmFyaWFibGVcbiAgaWYgKCB0aGVDb2xvci5hbHBoYSAhPT0gMCApIHtcbiAgICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICAgIHJldHVybiBcInJnYmEoXCIgKyB0aGVDb2xvci5yZWQgKyBcIixcIiArIHRoZUNvbG9yLmdyZWVuICsgXCIsXCIgKyB0aGVDb2xvci5ibHVlICsgXCIsXCIgKyB0aGVDb2xvci5hbHBoYSArIFwiKVwiO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBcInRyYW5zcGFyZW50XCI7XG4gIH1cbn07XG4vKipcbiAqIEB0eXBlZGVmIHt7cmVkOiBOdW1iZXIsIGdyZWVuOiBOdW1iZXIsIGJsdWU6IE51bWJlciwgYWxwaGE6IE51bWJlcn19IGNvbG9yXG4gKi9cbi8qKlxuICpcbiAqIENyZWF0ZXMgYSBjb2xvciBvYmplY3Qgb2YgdGhlIGZvcm0gYHtyZWQ6ciwgZ3JlZW46ZywgYmx1ZTpiLCBhbHBoYTphfWAuXG4gKlxuICogQG1ldGhvZCBtYWtlQ29sb3JcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7TnVtYmVyfSByIC0gcmVkIGNvbXBvbmVudCAoMC0yNTUpXG4gKiBAcGFyYW0ge051bWJlcn0gZyAtIGdyZWVuIGNvbXBvbmVudCAoMC0yNTUpXG4gKiBAcGFyYW0ge051bWJlcn0gYiAtIGJsdWUgY29tcG9uZW50ICgwLTI1NSlcbiAqIEBwYXJhbSB7TnVtYmVyfSBhIC0gYWxwaGEgY29tcG9uZW50ICgwLjAtMS4wKVxuICogQHJldHVybnMge2NvbG9yfVxuICpcbiAqL1xuVUkubWFrZUNvbG9yID0gZnVuY3Rpb24gKCByLCBnLCBiLCBhICkge1xuICByZXR1cm4ge1xuICAgIHJlZDogICByLFxuICAgIGdyZWVuOiBnLFxuICAgIGJsdWU6ICBiLFxuICAgIGFscGhhOiBhXG4gIH07XG59O1xuLyoqXG4gKlxuICogQ29waWVzIGEgY29sb3IgYW5kIHJldHVybnMgaXQgc3VpdGFibGUgZm9yIG1vZGlmaWNhdGlvbi4gWW91IHNob3VsZCBjb3B5XG4gKiBjb2xvcnMgcHJpb3IgdG8gbW9kaWZpY2F0aW9uLCBvdGhlcndpc2UgeW91IHJpc2sgbW9kaWZ5aW5nIHRoZSBvcmlnaW5hbC5cbiAqXG4gKiBAbWV0aG9kIGNvcHlDb2xvclxuICogQHN0YXRpY1xuICogQHBhcmFtIHtjb2xvcn0gdGhlQ29sb3IgLSB0aGUgY29sb3IgdG8gYmUgZHVwbGljYXRlZFxuICogQHJldHVybnMge2NvbG9yfSBhIGNvbG9yIHJlYWR5IGZvciBjaGFuZ2VzXG4gKlxuICovXG5VSS5jb3B5Q29sb3IgPSBmdW5jdGlvbiAoIHRoZUNvbG9yICkge1xuICAvL25vaW5zcGVjdGlvbiBKU1VucmVzb2x2ZWRWYXJpYWJsZVxuICByZXR1cm4gVUkubWFrZUNvbG9yKCB0aGVDb2xvci5yZWQsIHRoZUNvbG9yLmdyZWVuLCB0aGVDb2xvci5ibHVlLCB0aGVDb2xvci5hbHBoYSApO1xufTtcbi8qKlxuICogVUkuQ09MT1JcbiAqIEBuYW1lc3BhY2UgVUlcbiAqIEBjbGFzcyBDT0xPUlxuICovXG5VSS5DT0xPUiA9IFVJLkNPTE9SIHx8IHt9O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgYmxhY2tDb2xvclxuICogQHJldHVybnMge2NvbG9yfSBhIGJsYWNrIGNvbG9yLlxuICovXG5VSS5DT0xPUi5ibGFja0NvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAwLCAwLCAwLCAxLjAgKTtcbn07XG4vKiogQHN0YXRpY1xuICogQG1ldGhvZCBkYXJrR3JheUNvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgZGFyayBncmF5IGNvbG9yLlxuICovXG5VSS5DT0xPUi5kYXJrR3JheUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCA4NSwgODUsIDg1LCAxLjAgKTtcbn07XG4vKiogQHN0YXRpY1xuICogQG1ldGhvZCBHcmF5Q29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSBncmF5IGNvbG9yLlxuICovXG5VSS5DT0xPUi5HcmF5Q29sb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBVSS5tYWtlQ29sb3IoIDEyNywgMTI3LCAxMjcsIDEuMCApO1xufTtcbi8qKiBAc3RhdGljXG4gKiBAbWV0aG9kIGxpZ2h0R3JheUNvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgbGlnaHQgZ3JheSBjb2xvci5cbiAqL1xuVUkuQ09MT1IubGlnaHRHcmF5Q29sb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBVSS5tYWtlQ29sb3IoIDE3MCwgMTcwLCAxNzAsIDEuMCApO1xufTtcbi8qKiBAc3RhdGljXG4gKiBAbWV0aG9kIHdoaXRlQ29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSB3aGl0ZSBjb2xvci5cbiAqL1xuVUkuQ09MT1Iud2hpdGVDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFVJLm1ha2VDb2xvciggMjU1LCAyNTUsIDI1NSwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgYmx1ZUNvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgYmx1ZSBjb2xvci5cbiAqL1xuVUkuQ09MT1IuYmx1ZUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAwLCAwLCAyNTUsIDEuMCApO1xufTtcbi8qKiBAc3RhdGljXG4gKiBAbWV0aG9kIGdyZWVuQ29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSBncmVlbiBjb2xvci5cbiAqL1xuVUkuQ09MT1IuZ3JlZW5Db2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFVJLm1ha2VDb2xvciggMCwgMjU1LCAwLCAxLjAgKTtcbn07XG4vKiogQHN0YXRpY1xuICogQG1ldGhvZCByZWRDb2xvclxuICogQHJldHVybnMge2NvbG9yfSBhIHJlZCBjb2xvci5cbiAqL1xuVUkuQ09MT1IucmVkQ29sb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBVSS5tYWtlQ29sb3IoIDI1NSwgMCwgMCwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgY3lhbkNvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgY3lhbiBjb2xvci5cbiAqL1xuVUkuQ09MT1IuY3lhbkNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAwLCAyNTUsIDI1NSwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgeWVsbG93Q29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSB5ZWxsb3cgY29sb3IuXG4gKi9cblVJLkNPTE9SLnllbGxvd0NvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAyNTUsIDI1NSwgMCwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgbWFnZW50YUNvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgbWFnZW50YSBjb2xvci5cbiAqL1xuVUkuQ09MT1IubWFnZW50YUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAyNTUsIDAsIDI1NSwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2Qgb3JhbmdlQ29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSBvcmFuZ2UgY29sb3IuXG4gKi9cblVJLkNPTE9SLm9yYW5nZUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAyNTUsIDEyNywgMCwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgcHVycGxlQ29sb3JcbiAqIEByZXR1cm5zIHtjb2xvcn0gYSBwdXJwbGUgY29sb3IuXG4gKi9cblVJLkNPTE9SLnB1cnBsZUNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAxMjcsIDAsIDEyNywgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgYnJvd25Db2xvclxuICogQHJldHVybnMge2NvbG9yfSBhIGJyb3duIGNvbG9yLlxuICovXG5VSS5DT0xPUi5icm93bkNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAxNTMsIDEwMiwgNTEsIDEuMCApO1xufTtcbi8qKiBAc3RhdGljXG4gKiBAbWV0aG9kIGxpZ2h0VGV4dENvbG9yXG4gKiBAcmV0dXJucyB7Y29sb3J9IGEgbGlnaHQgdGV4dCBjb2xvciBzdWl0YWJsZSBmb3IgZGlzcGxheSBvbiBkYXJrIGJhY2tncm91bmRzLlxuICovXG5VSS5DT0xPUi5saWdodFRleHRDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFVJLm1ha2VDb2xvciggMjQwLCAyNDAsIDI0MCwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgZGFya1RleHRDb2xvclxuICogQHJldHVybnMge2NvbG9yfSBhIGRhcmsgdGV4dCBjb2xvciBzdWl0YWJsZSBmb3IgZGlzcGxheSBvbiBsaWdodCBiYWNrZ3JvdW5kcy5cbiAqL1xuVUkuQ09MT1IuZGFya1RleHRDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFVJLm1ha2VDb2xvciggMTUsIDE1LCAxNSwgMS4wICk7XG59O1xuLyoqIEBzdGF0aWNcbiAqIEBtZXRob2QgY2xlYXJDb2xvclxuICogQHJldHVybnMge2NvbG9yfSBhIHRyYW5zcGFyZW50IGNvbG9yLlxuICovXG5VSS5DT0xPUi5jbGVhckNvbG9yID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gVUkubWFrZUNvbG9yKCAwLCAwLCAwLCAwLjAgKTtcbn07XG4vKipcbiAqIE1hbmFnZXMgdGhlIHJvb3QgZWxlbWVudFxuICpcbiAqIEBwcm9wZXJ0eSBfcm9vdENvbnRhaW5lclxuICogQHByaXZhdGVcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIE5vZGVcbiAqL1xuVUkuX3Jvb3RDb250YWluZXIgPSBudWxsO1xuLyoqXG4gKiBDcmVhdGVzIHRoZSByb290IGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgdmlldyBoaWVyYXJjaHlcbiAqXG4gKiBAbWV0aG9kIF9jcmVhdGVSb290Q29udGFpbmVyXG4gKiBAc3RhdGljXG4gKiBAcHJvdGVjdGVkXG4gKi9cblVJLl9jcmVhdGVSb290Q29udGFpbmVyID0gZnVuY3Rpb24gKCkge1xuICBVSS5fcm9vdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcbiAgVUkuX3Jvb3RDb250YWluZXIuY2xhc3NOYW1lID0gXCJ1aS1jb250YWluZXJcIjtcbiAgVUkuX3Jvb3RDb250YWluZXIuaWQgPSBcInJvb3RDb250YWluZXJcIjtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggVUkuX3Jvb3RDb250YWluZXIgKTtcbn07XG4vKipcbiAqIE1hbmFnZXMgdGhlIHJvb3QgdmlldyAodG9wbW9zdClcbiAqXG4gKiBAcHJvcGVydHkgX3Jvb3RWaWV3XG4gKiBAcHJpdmF0ZVxuICogQHN0YXRpY1xuICogQHR5cGUgVmlld0NvbnRhaW5lclxuICogQGRlZmF1bHQgbnVsbFxuICovXG5VSS5fcm9vdFZpZXcgPSBudWxsO1xuLyoqXG4gKiBBc3NpZ25zIGEgdmlldyB0byBiZSB0aGUgdG9wIHZpZXcgaW4gdGhlIGhpZXJhcmNoeVxuICpcbiAqIEBtZXRob2Qgc2V0Um9vdFZpZXdcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSB7Vmlld0NvbnRhaW5lcn0gdGhlVmlld1xuICovXG5VSS5zZXRSb290VmlldyA9IGZ1bmN0aW9uICggdGhlVmlldyApIHtcbiAgaWYgKCBVSS5fcm9vdENvbnRhaW5lciA9PT0gbnVsbCApIHtcbiAgICBVSS5fY3JlYXRlUm9vdENvbnRhaW5lcigpO1xuICB9XG4gIGlmICggVUkuX3Jvb3RWaWV3ICE9PSBudWxsICkge1xuICAgIFVJLnJlbW92ZVJvb3RWaWV3KCk7XG4gIH1cbiAgVUkuX3Jvb3RWaWV3ID0gdGhlVmlldztcbiAgVUkuX3Jvb3RWaWV3LnBhcmVudEVsZW1lbnQgPSBVSS5fcm9vdENvbnRhaW5lcjtcbn07XG4vKipcbiAqIFJlbW92ZXMgYSB2aWV3IGZyb20gdGhlIHJvb3Qgdmlld1xuICpcbiAqIEBtZXRob2QgcmVtb3ZlUm9vdFZpZXdcbiAqIEBzdGF0aWNcbiAqL1xuVUkucmVtb3ZlUm9vdFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICggVUkuX3Jvb3RWaWV3ICE9PSBudWxsICkge1xuICAgIFVJLl9yb290Vmlldy5wYXJlbnRFbGVtZW50ID0gbnVsbDtcbiAgfVxuICBVSS5fcm9vdFZpZXcgPSBudWxsO1xufTtcbi8qKlxuICpcbiAqIFJldHVybnMgdGhlIHJvb3Qgdmlld1xuICpcbiAqIEBtZXRob2QgZ2V0Um9vdFZpZXdcbiAqIEBzdGF0aWNcbiAqIEByZXR1cm5zIHtWaWV3Q29udGFpbmVyfVxuICovXG5VSS5nZXRSb290VmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIFVJLl9yb290Vmlldztcbn07XG4vKipcbiAqIFRoZSByb290IHZpZXdcbiAqIEBwcm9wZXJ0eSByb290Vmlld1xuICogQHN0YXRpY1xuICogQHR5cGUgTm9kZVxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoIFVJLCBcInJvb3RWaWV3XCIsIHtcbiAgZ2V0OiBVSS5nZXRSb290VmlldyxcbiAgc2V0OiBVSS5zZXRSb290Vmlld1xufSApO1xuLyoqXG4gKiBQcml2YXRlIGJhY2sgYnV0dG9uIGhhbmRsZXIgY2xhc3NcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3MgX0JhY2tCdXR0b25IYW5kbGVyXG4gKiBAcmV0dXJucyB7QmFzZU9iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cblVJLl9CYWNrQnV0dG9uSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSBuZXcgQmFzZU9iamVjdCgpO1xuICBzZWxmLnN1YmNsYXNzKCBcIkJhY2tCdXR0b25IYW5kbGVyXCIgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJiYWNrQnV0dG9uUHJlc3NlZFwiICk7XG4gIHNlbGYuX2xhc3RCYWNrQnV0dG9uVGltZSA9IC0xO1xuICBzZWxmLmhhbmRsZUJhY2tCdXR0b24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gKCBuZXcgRGF0ZSgpICkuZ2V0VGltZSgpO1xuICAgIGlmICggc2VsZi5fbGFzdEJhY2tCdXR0b25UaW1lIDwgY3VycmVudFRpbWUgLSAxMDAwICkge1xuICAgICAgc2VsZi5fbGFzdEJhY2tCdXR0b25UaW1lID0gKCBuZXcgRGF0ZSgpICkuZ2V0VGltZSgpO1xuICAgICAgc2VsZi5ub3RpZnlNb3N0UmVjZW50KCBcImJhY2tCdXR0b25QcmVzc2VkXCIgKTtcbiAgICB9XG4gIH07XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiYmFja2J1dHRvblwiLCBzZWxmLmhhbmRsZUJhY2tCdXR0b24sIGZhbHNlICk7XG4gIHJldHVybiBzZWxmO1xufTtcbi8qKlxuICpcbiAqIEdsb2JhbCBCYWNrIEJ1dHRvbiBIYW5kbGVyIE9iamVjdFxuICpcbiAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIHRoZSBiYWNrQnV0dG9uUHJlc3NlZCBub3RpZmljYXRpb24gaW4gb3JkZXJcbiAqIHRvIGJlIG5vdGlmaWVkIHdoZW4gdGhlIGJhY2sgYnV0dG9uIGlzIHByZXNzZWQuXG4gKlxuICogQXBwbGllcyBvbmx5IHRvIGEgcGh5c2ljYWwgYmFjayBidXR0b24sIG5vdCBvbmUgb24gdGhlIHNjcmVlbi5cbiAqXG4gKiBAcHJvcGVydHkgYmFja0J1dHRvblxuICogQHN0YXRpY1xuICogQGZpbmFsXG4gKiBAdHlwZSBfQmFja0J1dHRvbkhhbmRsZXJcbiAqL1xuVUkuYmFja0J1dHRvbiA9IG5ldyBVSS5fQmFja0J1dHRvbkhhbmRsZXIoKTtcbi8qKlxuICogUHJpdmF0ZSBvcmllbnRhdGlvbiBoYW5kbGVyIGNsYXNzXG4gKiBAY2xhc3MgX09yaWVudGF0aW9uSGFuZGxlclxuICogQHJldHVybnMge0Jhc2VPYmplY3R9XG4gKiBAcHJpdmF0ZVxuICovXG5VSS5fT3JpZW50YXRpb25IYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IG5ldyBCYXNlT2JqZWN0KCk7XG4gIHNlbGYuc3ViY2xhc3MoIFwiT3JpZW50YXRpb25IYW5kbGVyXCIgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJvcmllbnRhdGlvbkNoYW5nZWRcIiApO1xuICBzZWxmLmhhbmRsZU9yaWVudGF0aW9uQ2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJPcmllbnRhdGlvbixcbiAgICAgIGN1ckZvcm1GYWN0b3IsXG4gICAgICBjdXJTY2FsZSxcbiAgICAgIGN1ckNvbnZlbmllbmNlLFxuICAgICAgY3VyRGV2aWNlID0gdGhlRGV2aWNlLnBsYXRmb3JtKCksXG4gICAgICBPU0xldmVsO1xuICAgIHN3aXRjaCAoIGN1ckRldmljZSApIHtcbiAgICAgIGNhc2UgXCJtYWNcIjpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBPU0xldmVsID0gXCJcIiArIHBhcnNlRmxvYXQoICggbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCggL09TIFggKFswLTlfXSspLyApWzFdICkucmVwbGFjZSggL18vZywgXCIuXCIgKSApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoICggZSApIHt9XG4gICAgICAgIGlmICggT1NMZXZlbCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIGN1ckRldmljZSArPSBcIiBtYWNcIiArICggT1NMZXZlbC5sZW5ndGggPCA1ID8gXCJDXCIgOiBcIk1cIiApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImlvc1wiOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIE9TTGV2ZWwgPSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKCAvT1MgKFswLTldKykvIClbMV07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKCBlICkge31cbiAgICAgICAgaWYgKCBPU0xldmVsICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgY3VyRGV2aWNlICs9IFwiIGlvc1wiICsgT1NMZXZlbCArIFwiIGlvc1wiICsgKCBPU0xldmVsIDwgNyA/IFwiQ1wiIDogXCJNXCIgKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJhbmRyb2lkXCI6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgT1NMZXZlbCA9IHBhcnNlRmxvYXQoIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goIC9BbmRyb2lkIChbMC05Ll0rKS8gKVsxXSApO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoICggZSApIHt9XG4gICAgICAgIGlmICggT1NMZXZlbCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIGN1ckRldmljZSArPSBcIiBhbmRyb2lkXCIgKyAoIFwiXCIgKyBPU0xldmVsICkucmVwbGFjZSggL1xcLi9nLCBcIi1cIiApICsgXCIgYW5kcm9pZFwiICsgKCAoIE9TTGV2ZWwgPCA0LjQgKSA/IFwiQ1wiIDogKCAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBPU0xldmVsID49IDUgKSA/IFwiTVwiIDogXCJLXCIgKSApXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgIH1cbiAgICAvKlxuICAgICBpZiAoIGN1ckRldmljZSA9PT0gXCJpb3NcIiApIHtcbiAgICAgaWYgKCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoIFwiT1MgOVwiICkgPiAtMSApIHtcbiAgICAgY3VyRGV2aWNlICs9IFwiIGlvczkgaW9zTVwiO1xuICAgICB9XG4gICAgIGlmICggbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCBcIk9TIDhcIiApID4gLTEgKSB7XG4gICAgIGN1ckRldmljZSArPSBcIiBpb3M4IGlvc01cIjtcbiAgICAgfVxuICAgICBpZiAoIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZiggXCJPUyA3XCIgKSA+IC0xICkge1xuICAgICBjdXJEZXZpY2UgKz0gXCIgaW9zNyBpb3NNXCI7XG4gICAgIH1cbiAgICAgaWYgKCBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoIFwiT1MgNlwiICkgPiAtMSApIHtcbiAgICAgY3VyRGV2aWNlICs9IFwiIGlvczYgaW9zQ1wiO1xuICAgICB9XG4gICAgIGlmICggbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCBcIk9TIDVcIiApID4gLTEgKSB7XG4gICAgIGN1ckRldmljZSArPSBcIiBpb3M1IGlvc0NcIjtcbiAgICAgfVxuICAgICB9ICovXG4gICAgY3VyRm9ybUZhY3RvciA9IHRoZURldmljZS5mb3JtRmFjdG9yKCk7XG4gICAgY3VyT3JpZW50YXRpb24gPSB0aGVEZXZpY2UuaXNQb3J0cmFpdCgpID8gXCJwb3J0cmFpdFwiIDogXCJsYW5kc2NhcGVcIjtcbiAgICBjdXJTY2FsZSA9IHRoZURldmljZS5pc1JldGluYSgpID8gXCJoaURQSVwiIDogXCJsb0RQSVwiO1xuICAgIGN1clNjYWxlICs9IFwiIHNjYWxlXCIgKyB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyArIFwieFwiO1xuICAgIGN1ckNvbnZlbmllbmNlID0gXCJcIjtcbiAgICBpZiAoIHRoZURldmljZS5pUGFkKCkgKSB7XG4gICAgICBjdXJDb252ZW5pZW5jZSA9IFwiaXBhZFwiO1xuICAgIH1cbiAgICBpZiAoIHRoZURldmljZS5pUGhvbmUoKSApIHtcbiAgICAgIGN1ckNvbnZlbmllbmNlID0gXCJpcGhvbmVcIjtcbiAgICB9XG4gICAgaWYgKCB0aGVEZXZpY2UuZHJvaWRUYWJsZXQoKSApIHtcbiAgICAgIGN1ckNvbnZlbmllbmNlID0gXCJkcm9pZC10YWJsZXRcIjtcbiAgICB9XG4gICAgaWYgKCB0aGVEZXZpY2UuZHJvaWRQaG9uZSgpICkge1xuICAgICAgY3VyQ29udmVuaWVuY2UgPSBcImRyb2lkLXBob25lXCI7XG4gICAgfVxuICAgIGlmICggdHlwZW9mIGRvY3VtZW50LmJvZHkgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQuYm9keSAhPT0gbnVsbCApIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCBcImNsYXNzXCIsIFtjdXJEZXZpY2UsIGN1ckZvcm1GYWN0b3IsIGN1ck9yaWVudGF0aW9uLCBjdXJTY2FsZSwgY3VyQ29udmVuaWVuY2VdLmpvaW4oXG4gICAgICAgIFwiIFwiICkgKTtcbiAgICB9XG4gICAgc2VsZi5ub3RpZnkoIFwib3JpZW50YXRpb25DaGFuZ2VkXCIgKTtcbiAgfTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIFwib3JpZW50YXRpb25jaGFuZ2VcIiwgc2VsZi5oYW5kbGVPcmllbnRhdGlvbkNoYW5nZSwgZmFsc2UgKTtcbiAgaWYgKCB0eXBlb2YgZG9jdW1lbnQuYm9keSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudC5ib2R5ICE9PSBudWxsICkge1xuICAgIHNlbGYuaGFuZGxlT3JpZW50YXRpb25DaGFuZ2UoKTtcbiAgfSBlbHNlIHtcbiAgICBzZXRUaW1lb3V0KCBzZWxmLmhhbmRsZU9yaWVudGF0aW9uQ2hhbmdlLCAwICk7XG4gIH1cbiAgcmV0dXJuIHNlbGY7XG59O1xuLyoqXG4gKlxuICogR2xvYmFsIE9yaWVudGF0aW9uIEhhbmRsZXIgT2JqZWN0XG4gKlxuICogUmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgdGhlIG9yaWVudGF0aW9uQ2hhbmdlZCBub3RpZmljYXRpb24gaW4gb3JkZXJcbiAqIHRvIGJlIG5vdGlmaWVkIHdoZW4gdGhlIG9yaWVudGF0aW9uIGNoYW5nZXMuXG4gKlxuICogQHByb3BlcnR5IG9yaWVudGF0aW9uSGFuZGxlclxuICogQHN0YXRpY1xuICogQGZpbmFsXG4gKiBAdHlwZSBfT3JpZW50YXRpb25IYW5kbGVyXG4gKi9cblVJLm9yaWVudGF0aW9uSGFuZGxlciA9IG5ldyBVSS5fT3JpZW50YXRpb25IYW5kbGVyKCk7XG4vKipcbiAqXG4gKiBHbG9iYWwgTm90aWZpY2F0aW9uIE9iamVjdCAtLSB1c2VkIGZvciBzZW5kaW5nIGFuZCByZWNlaXZpbmcgZ2xvYmFsIG5vdGlmaWNhdGlvbnNcbiAqXG4gKiBAcHJvcGVydHkgZ2xvYmFsTm90aWZpY2F0aW9uc1xuICogQHN0YXRpY1xuICogQGZpbmFsXG4gKiBAdHlwZSBCYXNlT2JqZWN0XG4gKi9cblVJLmdsb2JhbE5vdGlmaWNhdGlvbnMgPSBuZXcgQmFzZU9iamVjdCgpO1xuLyoqXG4gKiBDcmVhdGUgdGhlIHJvb3QgY29udGFpbmVyXG4gKi9cbmlmICggdHlwZW9mIGRvY3VtZW50LmJvZHkgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQuYm9keSAhPT0gbnVsbCApIHtcbiAgVUkuX2NyZWF0ZVJvb3RDb250YWluZXIoKTtcbn0gZWxzZSB7XG4gIHNldFRpbWVvdXQoIFVJLl9jcmVhdGVSb290Q29udGFpbmVyLCAwICk7XG59XG4vLyBoZWxwZXIgbWV0aG9kcyBvbiBOb2Rlc1xuTm9kZS5wcm90b3R5cGUuJHMgPSBVSS5zdHlsZUVsZW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IFVJO1xuIiwiLyoqXG4gKlxuICogQmFzaWMgY3Jvc3MtcGxhdGZvcm0gbW9iaWxlIEV2ZW50IEhhbmRsaW5nIGZvciBZQVNNRlxuICpcbiAqIEBtb2R1bGUgZXZlbnRzLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC40XG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxMyBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgZGVmaW5lKi9cblwidXNlIHN0cmljdFwiO1xudmFyIHRoZURldmljZSA9IHJlcXVpcmUoIFwiLi4vdXRpbC9kZXZpY2VcIiApO1xuLyoqXG4gKiBUcmFuc2xhdGVzIHRvdWNoIGV2ZW50cyB0byBtb3VzZSBldmVudHMgaWYgdGhlIHBsYXRmb3JtIGRvZXNuJ3Qgc3VwcG9ydFxuICogdG91Y2ggZXZlbnRzLiBMZWF2ZXMgb3RoZXIgZXZlbnRzIHVuYWZmZWN0ZWQuXG4gKlxuICogQG1ldGhvZCBfdHJhbnNsYXRlRXZlbnRcbiAqIEBzdGF0aWNcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1N0cmluZ30gdGhlRXZlbnQgLSB0aGUgZXZlbnQgbmFtZSB0byB0cmFuc2xhdGVcbiAqL1xudmFyIF90cmFuc2xhdGVFdmVudCA9IGZ1bmN0aW9uICggdGhlRXZlbnQgKSB7XG4gIHZhciB0aGVUcmFuc2xhdGVkRXZlbnQgPSB0aGVFdmVudDtcbiAgaWYgKCAhdGhlVHJhbnNsYXRlZEV2ZW50ICkge1xuICAgIHJldHVybiB0aGVUcmFuc2xhdGVkRXZlbnQ7XG4gIH1cbiAgdmFyIHBsYXRmb3JtID0gdGhlRGV2aWNlLnBsYXRmb3JtKCk7XG4gIHZhciBub25Ub3VjaFBsYXRmb3JtID0gKCBwbGF0Zm9ybSA9PT0gXCJ3aW5jZVwiIHx8IHBsYXRmb3JtID09PSBcInVua25vd25cIiB8fCBwbGF0Zm9ybSA9PT0gXCJtYWNcIiB8fCBwbGF0Zm9ybSA9PT0gXCJ3aW5kb3dzXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXRmb3JtID09PSBcImxpbnV4XCIgKTtcbiAgaWYgKCBub25Ub3VjaFBsYXRmb3JtICYmIHRoZVRyYW5zbGF0ZWRFdmVudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoIFwidG91Y2hcIiApID4gLTEgKSB7XG4gICAgdGhlVHJhbnNsYXRlZEV2ZW50ID0gdGhlVHJhbnNsYXRlZEV2ZW50LnJlcGxhY2UoIFwidG91Y2hcIiwgXCJtb3VzZVwiICk7XG4gICAgdGhlVHJhbnNsYXRlZEV2ZW50ID0gdGhlVHJhbnNsYXRlZEV2ZW50LnJlcGxhY2UoIFwic3RhcnRcIiwgXCJkb3duXCIgKTtcbiAgICB0aGVUcmFuc2xhdGVkRXZlbnQgPSB0aGVUcmFuc2xhdGVkRXZlbnQucmVwbGFjZSggXCJlbmRcIiwgXCJ1cFwiICk7XG4gIH1cbiAgcmV0dXJuIHRoZVRyYW5zbGF0ZWRFdmVudDtcbn07XG52YXIgZXZlbnQgPSB7fTtcbi8qKlxuICogQHR5cGVkZWYge3tfb3JpZ2luYWxFdmVudDogRXZlbnQsIHRvdWNoZXM6IEFycmF5LCB4OiBudW1iZXIsIHk6IG51bWJlciwgYXZnWDogbnVtYmVyLCBhdmdZOiBudW1iZXIsIGVsZW1lbnQ6IChFdmVudFRhcmdldHxPYmplY3QpLCB0YXJnZXQ6IE5vZGV9fSBOb3JtYWxpemVkRXZlbnRcbiAqL1xuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBldmVudCBvYmplY3QgZnJvbSBhIERPTSBldmVudC5cbiAqXG4gKiBUaGUgZXZlbnQgcmV0dXJuZWQgY29udGFpbnMgYWxsIHRoZSB0b3VjaGVzIGZyb20gdGhlIERPTSBldmVudCBpbiBhbiBhcnJheSBvZiB7eCx5fSBvYmplY3RzLlxuICogVGhlIGV2ZW50IGFsc28gY29udGFpbnMgdGhlIGZpcnN0IHRvdWNoIGFzIHgseSBwcm9wZXJ0aWVzIGFuZCB0aGUgYXZlcmFnZSBvZiBhbGwgdG91Y2hlc1xuICogYXMgYXZnWCxhdmdZLiBJZiBubyB0b3VjaGVzIGFyZSBpbiB0aGUgZXZlbnQsIHRoZXNlIHZhbHVlcyB3aWxsIGJlIC0xLlxuICpcbiAqIEBtZXRob2QgbWFrZUV2ZW50XG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge05vZGV9IHRoYXQgLSBgdGhpc2A7IHdoYXQgZmlyZXMgdGhlIGV2ZW50XG4gKiBAcGFyYW0ge0V2ZW50fSBlIC0gdGhlIERPTSBldmVudFxuICogQHJldHVybnMge05vcm1hbGl6ZWRFdmVudH1cbiAqXG4gKi9cbmV2ZW50LmNvbnZlcnQgPSBmdW5jdGlvbiAoIHRoYXQsIGUgKSB7XG4gIGlmICggdHlwZW9mIGUgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgZSA9IHdpbmRvdy5ldmVudDtcbiAgfVxuICB2YXIgbmV3RXZlbnQgPSB7XG4gICAgX29yaWdpbmFsRXZlbnQ6IGUsXG4gICAgdG91Y2hlczogICAgICAgIFtdLFxuICAgIHg6ICAgICAgICAgICAgICAtMSxcbiAgICB5OiAgICAgICAgICAgICAgLTEsXG4gICAgYXZnWDogICAgICAgICAgIC0xLFxuICAgIGF2Z1k6ICAgICAgICAgICAtMSxcbiAgICBlbGVtZW50OiAgICAgICAgZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50LFxuICAgIHRhcmdldDogICAgICAgICB0aGF0XG4gIH07XG4gIGlmICggZS50b3VjaGVzICkge1xuICAgIHZhciBhdmdYVG90YWwgPSAwO1xuICAgIHZhciBhdmdZVG90YWwgPSAwO1xuICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGUudG91Y2hlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIG5ld0V2ZW50LnRvdWNoZXMucHVzaCgge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGUudG91Y2hlc1tpXS5jbGllbnRYLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGUudG91Y2hlc1tpXS5jbGllbnRZXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgIGF2Z1hUb3RhbCArPSBlLnRvdWNoZXNbaV0uY2xpZW50WDtcbiAgICAgIGF2Z1lUb3RhbCArPSBlLnRvdWNoZXNbaV0uY2xpZW50WTtcbiAgICAgIGlmICggaSA9PT0gMCApIHtcbiAgICAgICAgbmV3RXZlbnQueCA9IGUudG91Y2hlc1tpXS5jbGllbnRYO1xuICAgICAgICBuZXdFdmVudC55ID0gZS50b3VjaGVzW2ldLmNsaWVudFk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICggZS50b3VjaGVzLmxlbmd0aCA+IDAgKSB7XG4gICAgICBuZXdFdmVudC5hdmdYID0gYXZnWFRvdGFsIC8gZS50b3VjaGVzLmxlbmd0aDtcbiAgICAgIG5ld0V2ZW50LmF2Z1kgPSBhdmdZVG90YWwgLyBlLnRvdWNoZXMubGVuZ3RoO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIGV2ZW50LnBhZ2VYICkge1xuICAgICAgbmV3RXZlbnQudG91Y2hlcy5wdXNoKCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogZS5wYWdlWCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBlLnBhZ2VZXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgIG5ld0V2ZW50LnggPSBlLnBhZ2VYO1xuICAgICAgbmV3RXZlbnQueSA9IGUucGFnZVk7XG4gICAgICBuZXdFdmVudC5hdmdYID0gZS5wYWdlWDtcbiAgICAgIG5ld0V2ZW50LmF2Z1kgPSBlLnBhZ2VZO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3RXZlbnQ7XG59O1xuLyoqXG4gKlxuICogQ2FuY2VscyBhbiBldmVudCB0aGF0J3MgYmVlbiBjcmVhdGVkIHVzaW5nIHtAbGluayBldmVudC5jb252ZXJ0fS5cbiAqXG4gKiBAbWV0aG9kIGNhbmNlbEV2ZW50XG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge05vcm1hbGl6ZWRFdmVudH0gZSAtIHRoZSBldmVudCB0byBjYW5jZWxcbiAqXG4gKi9cbmV2ZW50LmNhbmNlbCA9IGZ1bmN0aW9uICggZSApIHtcbiAgaWYgKCBlLl9vcmlnaW5hbEV2ZW50LmNhbmNlbEJ1YmJsZSApIHtcbiAgICBlLl9vcmlnaW5hbEV2ZW50LmNhbmNlbEJ1YmJsZSgpO1xuICB9XG4gIGlmICggZS5fb3JpZ2luYWxFdmVudC5zdG9wUHJvcGFnYXRpb24gKSB7XG4gICAgZS5fb3JpZ2luYWxFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuICBpZiAoIGUuX29yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQgKSB7XG4gICAgZS5fb3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9IGVsc2Uge1xuICAgIGUuX29yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgfVxufTtcbi8qKlxuICogQWRkcyBhIHRvdWNoIGxpc3RlbmVyIHRvIHRoZUVsZW1lbnQsIGNvbnZlcnRpbmcgdG91Y2ggZXZlbnRzIGZvciBXUDcuXG4gKlxuICogQG1ldGhvZCBhZGRFdmVudExpc3RlbmVyXG4gKiBAcGFyYW0ge05vZGV9IHRoZUVsZW1lbnQgIHRoZSBlbGVtZW50IHRvIGF0dGFjaCB0aGUgZXZlbnQgdG9cbiAqIEBwYXJhbSB7U3RyaW5nfSB0aGVFdmVudCAgdGhlIGV2ZW50IHRvIGhhbmRsZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gdGhlRnVuY3Rpb24gIHRoZSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGV2ZW50IGlzIGZpcmVkXG4gKlxuICovXG5ldmVudC5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uICggdGhlRWxlbWVudCwgdGhlRXZlbnQsIHRoZUZ1bmN0aW9uICkge1xuICB2YXIgdGhlVHJhbnNsYXRlZEV2ZW50ID0gX3RyYW5zbGF0ZUV2ZW50KCB0aGVFdmVudC50b0xvd2VyQ2FzZSgpICk7XG4gIHRoZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggdGhlVHJhbnNsYXRlZEV2ZW50LCB0aGVGdW5jdGlvbiwgZmFsc2UgKTtcbn07XG4vKipcbiAqIFJlbW92ZXMgYSB0b3VjaCBsaXN0ZW5lciBhZGRlZCBieSBhZGRUb3VjaExpc3RlbmVyXG4gKlxuICogQG1ldGhvZCByZW1vdmVFdmVudExpc3RlbmVyXG4gKiBAcGFyYW0ge05vZGV9IHRoZUVsZW1lbnQgIHRoZSBlbGVtZW50IHRvIHJlbW92ZSBhbiBldmVudCBmcm9tXG4gKiBAcGFyYW0ge1N0cmluZ30gdGhlRXZlbnQgIHRoZSBldmVudCB0byByZW1vdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRoZUZ1bmN0aW9uICB0aGUgZnVuY3Rpb24gdG8gcmVtb3ZlXG4gKlxuICovXG5ldmVudC5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uICggdGhlRWxlbWVudCwgdGhlRXZlbnQsIHRoZUZ1bmN0aW9uICkge1xuICB2YXIgdGhlVHJhbnNsYXRlZEV2ZW50ID0gX3RyYW5zbGF0ZUV2ZW50KCB0aGVFdmVudC50b0xvd2VyQ2FzZSgpICk7XG4gIHRoZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggdGhlVHJhbnNsYXRlZEV2ZW50LCB0aGVGdW5jdGlvbiApO1xufTtcbm1vZHVsZS5leHBvcnRzID0gZXZlbnQ7XG4iLCIvKipcbiAqXG4gKiBOYXZpZ2F0aW9uIENvbnRyb2xsZXJzIHByb3ZpZGUgYmFzaWMgc3VwcG9ydCBmb3IgdmlldyBzdGFjayBtYW5hZ2VtZW50IChhcyBpbiBwdXNoLCBwb3ApXG4gKlxuICogQG1vZHVsZSBuYXZpZ2F0aW9uQ29udHJvbGxlci5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNVxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSovXG5cInVzZSBzdHJpY3RcIjtcbnZhciBVSSA9IHJlcXVpcmUoIFwiLi9jb3JlXCIgKSxcbiAgVmlld0NvbnRhaW5lciA9IHJlcXVpcmUoIFwiLi92aWV3Q29udGFpbmVyXCIgKSxcbiAgVVRJTCA9IHJlcXVpcmUoIFwiLi4vdXRpbC9jb3JlXCIgKTtcbnZhciBfY2xhc3NOYW1lID0gXCJOYXZpZ2F0aW9uQ29udHJvbGxlclwiLFxuICBOYXZpZ2F0aW9uQ29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IG5ldyBWaWV3Q29udGFpbmVyKCk7XG4gICAgc2VsZi5zdWJjbGFzcyggX2NsYXNzTmFtZSApO1xuICAgIC8vICMgTm90aWZpY2F0aW9uc1xuICAgIC8vXG4gICAgLy8gKiBgdmlld1B1c2hlZGAgaXMgZmlyZWQgd2hlbiBhIHZpZXcgaXMgcHVzaGVkIG9udG8gdGhlIHZpZXcgc3RhY2suIFRoZSB2aWV3IHB1c2hlZCBpcyBwYXNzZWQgYXMgYSBwYXJhbWV0ZXIuXG4gICAgLy8gKiBgdmlld1BvcHBlZGAgaXMgZmlyZWQgd2hlbiBhIHZpZXcgaXMgcG9wcGVkIG9mZiB0aGUgdmlldyBzdGFjay4gVGhlIHZpZXcgcG9wcGVkIGlzIHBhc3NlZCBhcyBhIHBhcmFtZXRlci5cbiAgICAvL1xuICAgIHNlbGYucmVnaXN0ZXJOb3RpZmljYXRpb24oIFwidmlld1B1c2hlZFwiICk7XG4gICAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJ2aWV3UG9wcGVkXCIgKTtcbiAgICAvKipcbiAgICAgKiBUaGUgYXJyYXkgb2Ygdmlld3MgdGhhdCB0aGlzIG5hdmlnYXRpb24gY29udHJvbGxlciBtYW5hZ2VzLlxuICAgICAqIEBwcm9wZXJ0eSBzdWJ2aWV3c1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInN1YnZpZXdzXCIsIHtcbiAgICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgICB3cml0ZTogICBmYWxzZSxcbiAgICAgIGRlZmF1bHQ6IFtdXG4gICAgfSApO1xuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyB0aGUgY3VycmVudCB0b3Agdmlld1xuICAgICAqIEBwcm9wZXJ0eSB0b3BWaWV3XG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBzZWxmLmdldFRvcFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIHNlbGYuX3N1YnZpZXdzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9zdWJ2aWV3c1tzZWxmLl9zdWJ2aWV3cy5sZW5ndGggLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH07XG4gICAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJ0b3BWaWV3XCIsIHtcbiAgICAgIHJlYWQ6ICAgICAgICAgICAgdHJ1ZSxcbiAgICAgIHdyaXRlOiAgICAgICAgICAgZmFsc2UsXG4gICAgICBiYWNraW5nVmFyaWFibGU6IGZhbHNlXG4gICAgfSApO1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGluaXRpYWwgdmlldyBpbiB0aGUgdmlldyBzdGFja1xuICAgICAqIEBwcm9wZXJ0eSByb290Vmlld1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgc2VsZi5nZXRSb290VmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICggc2VsZi5fc3Vidmlld3MubGVuZ3RoID4gMCApIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX3N1YnZpZXdzWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfTtcbiAgICBzZWxmLnNldFJvb3RWaWV3ID0gZnVuY3Rpb24gKCB0aGVOZXdSb290ICkge1xuICAgICAgaWYgKCBzZWxmLl9zdWJ2aWV3cy5sZW5ndGggPiAwICkge1xuICAgICAgICAvLyBtdXN0IHJlbW92ZSBhbGwgdGhlIHN1YnZpZXdzIGZyb20gdGhlIERPTVxuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBzZWxmLl9zdWJ2aWV3cy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICB2YXIgdGhlUG9wcGluZ1ZpZXcgPSBzZWxmLl9zdWJ2aWV3c1tpXTtcbiAgICAgICAgICB0aGVQb3BwaW5nVmlldy5ub3RpZnkoIFwidmlld1dpbGxEaXNhcHBlYXJcIiApO1xuICAgICAgICAgIGlmICggaSA9PT0gMCApIHtcbiAgICAgICAgICAgIHRoZVBvcHBpbmdWaWV3LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggXCJ1aS1yb290LXZpZXdcIiApO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGVQb3BwaW5nVmlldy5wYXJlbnRFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICB0aGVQb3BwaW5nVmlldy5ub3RpZnkoIFwidmlld0RpZERpc2FwcGVhclwiICk7XG4gICAgICAgICAgdGhlUG9wcGluZ1ZpZXcubm90aWZ5KCBcInZpZXdXYXNQb3BwZWRcIiApO1xuICAgICAgICAgIGRlbGV0ZSB0aGVQb3BwaW5nVmlldy5uYXZpZ2F0aW9uQ29udHJvbGxlcjtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9zdWJ2aWV3cyA9IFtdO1xuICAgICAgfVxuICAgICAgc2VsZi5fc3Vidmlld3MucHVzaCggdGhlTmV3Um9vdCApOyAvLyBhZGQgaXQgdG8gb3VyIHZpZXdzXG4gICAgICB0aGVOZXdSb290Lm5hdmlnYXRpb25Db250cm9sbGVyID0gc2VsZjtcbiAgICAgIHRoZU5ld1Jvb3Qubm90aWZ5KCBcInZpZXdXYXNQdXNoZWRcIiApO1xuICAgICAgdGhlTmV3Um9vdC5ub3RpZnkoIFwidmlld1dpbGxBcHBlYXJcIiApOyAvLyBub3RpZnkgdGhlIHZpZXdcbiAgICAgIHRoZU5ld1Jvb3QucGFyZW50RWxlbWVudCA9IHNlbGYuZWxlbWVudDsgLy8gYW5kIG1ha2UgdXMgdGhlIHBhcmVudFxuICAgICAgdGhlTmV3Um9vdC5lbGVtZW50LmNsYXNzTGlzdC5hZGQoIFwidWktcm9vdC12aWV3XCIgKTtcbiAgICAgIHRoZU5ld1Jvb3Qubm90aWZ5KCBcInZpZXdEaWRBcHBlYXJcIiApOyAvLyBhbmQgbm90aWZ5IGl0IHRoYXQgaXQncyBhY3R1YWxseSB0aGVyZS5cbiAgICB9O1xuICAgIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwicm9vdFZpZXdcIiwge1xuICAgICAgcmVhZDogICAgICAgICAgICB0cnVlLFxuICAgICAgd3JpdGU6ICAgICAgICAgICB0cnVlLFxuICAgICAgYmFja2luZ1ZhcmlhYmxlOiBmYWxzZVxuICAgIH0gKTtcbiAgICBzZWxmLmRlZmluZVByb3BlcnR5KCBcIm1vZGFsXCIsIHtcbiAgICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgICB3cml0ZTogICBmYWxzZSxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSApO1xuICAgIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwibW9kYWxWaWV3XCIsIHtcbiAgICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgICB3cml0ZTogICBmYWxzZSxcbiAgICAgIGRlZmF1bHQ6IG51bGxcbiAgICB9ICk7XG4gICAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJtb2RhbFZpZXdUeXBlXCIsIHtcbiAgICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgICB3cml0ZTogICBmYWxzZSxcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICB9ICk7XG4gICAgc2VsZi5fbW9kYWxDbGlja1ByZXZlbnRlciA9IG51bGw7XG4gICAgc2VsZi5fcHJldmVudENsaWNrcyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGNsaWNrLXByZXZlbnRpb24gZWxlbWVudCAtLSBlc3NlbnRpYWxseSBhIHRyYW5zcGFyZW50IERJViB0aGF0XG4gICAgICogZmlsbHMgdGhlIHNjcmVlbi5cbiAgICAgKiBAbWV0aG9kIF9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzZWxmLl9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5jcmVhdGVFbGVtZW50SWZOb3RDcmVhdGVkKCk7XG4gICAgICBzZWxmLl9wcmV2ZW50Q2xpY2tzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgICAgc2VsZi5fcHJldmVudENsaWNrcy5jbGFzc05hbWUgPSBcInVpLXByZXZlbnQtY2xpY2tzXCI7XG4gICAgICBzZWxmLmVsZW1lbnQuYXBwZW5kQ2hpbGQoIHNlbGYuX3ByZXZlbnRDbGlja3MgKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGNsaWNrLXByZXZlbnRpb24gZWxlbWVudCBpZiBuZWNlc3NhcnlcbiAgICAgKiBAbWV0aG9kIF9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50SWZOb3RDcmVhdGVkXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzZWxmLl9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50SWZOb3RDcmVhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCBzZWxmLl9wcmV2ZW50Q2xpY2tzID09PSBudWxsICkge1xuICAgICAgICBzZWxmLl9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50KCk7XG4gICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBwdXNoIGEgdmlldyBvbnRvIHRoZSB2aWV3IHN0YWNrLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBwdXNoVmlld1xuICAgICAqIEBwYXJhbSB7Vmlld0NvbnRhaW5lcn0gYVZpZXdcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoQW5pbWF0aW9uXSBEZXRlcm1pbmUgaWYgdGhlIHZpZXcgc2hvdWxkIGJlIHB1c2hlZCB3aXRoIGFuIGFuaW1hdGlvbiwgZGVmYXVsdCBpcyBgdHJ1ZWBcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3dpdGhEZWxheV0gTnVtYmVyIG9mIHNlY29uZHMgZm9yIHRoZSBhbmltYXRpb24sIGRlZmF1bHQgaXMgYDAuM2BcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW3dpdGhUeXBlXSBDU1MgQW5pbWF0aW9uLCBkZWZhdWx0IGlzIGBlYXNlLWluLW91dGBcbiAgICAgKi9cbiAgICBzZWxmLnB1c2hWaWV3ID0gZnVuY3Rpb24gKCBhVmlldywgd2l0aEFuaW1hdGlvbiwgd2l0aERlbGF5LCB3aXRoVHlwZSApIHtcbiAgICAgIHZhciB0aGVIaWRpbmdWaWV3ID0gc2VsZi50b3BWaWV3LFxuICAgICAgICB0aGVTaG93aW5nVmlldyA9IGFWaWV3LFxuICAgICAgICB1c2luZ0FuaW1hdGlvbiA9IHRydWUsXG4gICAgICAgIGFuaW1hdGlvbkRlbGF5ID0gMC4zLFxuICAgICAgICBhbmltYXRpb25UeXBlID0gXCJlYXNlLWluLW91dFwiO1xuICAgICAgaWYgKCB0eXBlb2Ygd2l0aEFuaW1hdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgdXNpbmdBbmltYXRpb24gPSB3aXRoQW5pbWF0aW9uO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygd2l0aERlbGF5ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBhbmltYXRpb25EZWxheSA9IHdpdGhEZWxheTtcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIHdpdGhUeXBlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBhbmltYXRpb25UeXBlID0gd2l0aFR5cGU7XG4gICAgICB9XG4gICAgICBpZiAoICF1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgYW5pbWF0aW9uRGVsYXkgPSAwO1xuICAgICAgfVxuICAgICAgLy8gYWRkIHRoZSB2aWV3IHRvIG91ciBhcnJheSwgYXQgdGhlIGVuZFxuICAgICAgc2VsZi5fc3Vidmlld3MucHVzaCggdGhlU2hvd2luZ1ZpZXcgKTtcbiAgICAgIHRoZVNob3dpbmdWaWV3Lm5hdmlnYXRpb25Db250cm9sbGVyID0gc2VsZjtcbiAgICAgIHRoZVNob3dpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3V2FzUHVzaGVkXCIgKTtcbiAgICAgIC8vIGdldCBlYWNoIGVsZW1lbnQncyB6LWluZGV4LCBpZiBzcGVjaWZpZWRcbiAgICAgIHZhciB0aGVIaWRpbmdWaWV3WiA9IHBhcnNlSW50KCBnZXRDb21wdXRlZFN0eWxlKCB0aGVIaWRpbmdWaWV3LmVsZW1lbnQgKS5nZXRQcm9wZXJ0eVZhbHVlKCBcInotaW5kZXhcIiApIHx8IFwiMFwiLCAxMCApLFxuICAgICAgICB0aGVTaG93aW5nVmlld1ogPSBwYXJzZUludCggZ2V0Q29tcHV0ZWRTdHlsZSggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudCApLmdldFByb3BlcnR5VmFsdWUoIFwiei1pbmRleFwiICkgfHwgXCIwXCIsIDEwICk7XG4gICAgICBpZiAoIHRoZUhpZGluZ1ZpZXdaID49IHRoZVNob3dpbmdWaWV3WiApIHtcbiAgICAgICAgdGhlU2hvd2luZ1ZpZXdaID0gdGhlSGlkaW5nVmlld1ogKyAxMDtcbiAgICAgIH1cbiAgICAgIC8vIHRoZW4gcG9zaXRpb24gdGhlIHZpZXcgc28gYXMgdG8gYmUgb2ZmLXNjcmVlbiwgd2l0aCB0aGUgY3VycmVudCB2aWV3IG9uIHNjcmVlblxuICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVIaWRpbmdWaWV3LmVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlM2QoMCwwLFwiICsgdGhlSGlkaW5nVmlld1ogKyBcInB4KVwiICk7XG4gICAgICBVSS5zdHlsZUVsZW1lbnQoIHRoZVNob3dpbmdWaWV3LmVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlM2QoMTAwJSwwLFwiICsgdGhlU2hvd2luZ1ZpZXdaICsgXCJweClcIiApO1xuICAgICAgLy8gc2V0IHVwIGFuIGFuaW1hdGlvblxuICAgICAgaWYgKCB1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggW3RoZVNob3dpbmdWaWV3LmVsZW1lbnQsIHRoZUhpZGluZ1ZpZXcuZWxlbWVudF0sIFwidHJhbnNpdGlvblwiLCBcIi13ZWJraXQtdHJhbnNmb3JtIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uRGVsYXkgKyBcInMgXCIgKyBhbmltYXRpb25UeXBlICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIFt0aGVTaG93aW5nVmlldy5lbGVtZW50LCB0aGVIaWRpbmdWaWV3LmVsZW1lbnRdLCBcInRyYW5zaXRpb25cIiwgXCItbW96LXRyYW5zZm9ybSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkRlbGF5ICsgXCJzIFwiICsgYW5pbWF0aW9uVHlwZSApO1xuICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCBbdGhlU2hvd2luZ1ZpZXcuZWxlbWVudCwgdGhlSGlkaW5nVmlldy5lbGVtZW50XSwgXCJ0cmFuc2l0aW9uXCIsIFwiLW1zLXRyYW5zZm9ybSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkRlbGF5ICsgXCJzIFwiICsgYW5pbWF0aW9uVHlwZSApO1xuICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCBbdGhlU2hvd2luZ1ZpZXcuZWxlbWVudCwgdGhlSGlkaW5nVmlldy5lbGVtZW50XSwgXCJ0cmFuc2l0aW9uXCIsIFwidHJhbnNmb3JtIFwiICsgYW5pbWF0aW9uRGVsYXkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInMgXCIgKyBhbmltYXRpb25UeXBlICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZUhpZGluZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJ0cmFuc2l0aW9uXCIsIFwib3BhY2l0eSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uRGVsYXkgKyBcInMgXCIgKyBhbmltYXRpb25UeXBlICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVNob3dpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwidHJhbnNpdGlvblwiLCBcIm9wYWNpdHkgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25EZWxheSArIFwicyBcIiArIGFuaW1hdGlvblR5cGUgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlSGlkaW5nVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLnVpLW5hdmlnYXRpb24tYmFyICpcIiApLCBcIm9wYWNpdHlcIiwgXCIxXCIgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJvcGFjaXR5XCIsIFwiMFwiICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCBbdGhlU2hvd2luZ1ZpZXcuZWxlbWVudCwgdGhlSGlkaW5nVmlldy5lbGVtZW50XSwgXCJ0cmFuc2l0aW9uXCIsIFwiaW5oZXJpdFwiICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZUhpZGluZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJ0cmFuc2l0aW9uXCIsIFwiaW5oZXJpdFwiICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVNob3dpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwidHJhbnNpdGlvblwiLCBcImluaGVyaXRcIiApO1xuICAgICAgfVxuICAgICAgLy8gYW5kIGFkZCB0aGUgZWxlbWVudCB3aXRoIHVzIGFzIHRoZSBwYXJlbnRcbiAgICAgIHRoZVNob3dpbmdWaWV3LnBhcmVudEVsZW1lbnQgPSBzZWxmLmVsZW1lbnQ7XG4gICAgICAvLyBkaXNwbGF5IHRoZSBjbGljayBwcmV2ZW50aW9uIGVsZW1lbnRcbiAgICAgIHNlbGYuX3ByZXZlbnRDbGlja3Muc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGVsbCB0aGUgdG9wVmlldyB0byBtb3ZlIG92ZXIgdG8gdGhlIGxlZnRcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVIaWRpbmdWaWV3LmVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlM2QoLTUwJSwwLFwiICsgdGhlSGlkaW5nVmlld1ogKyBcInB4KVwiICk7XG4gICAgICAgIC8vIGFuZCB0ZWxsIG91ciBuZXcgdmlldyB0byBtb3ZlIGFzIHdlbGxcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVTaG93aW5nVmlldy5lbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZTNkKDAsMCxcIiArIHRoZVNob3dpbmdWaWV3WiArIFwicHgpXCIgKTtcbiAgICAgICAgaWYgKCB1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCB0aGVIaWRpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwib3BhY2l0eVwiLCBcIjBcIiApO1xuICAgICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVNob3dpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwib3BhY2l0eVwiLCBcIjFcIiApO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoZSB0aGUgdmlldyBpdCdzIGFib3V0IHRvIHNob3cuLi5cbiAgICAgICAgdGhlSGlkaW5nVmlldy5ub3RpZnkoIFwidmlld1dpbGxEaXNhcHBlYXJcIiApO1xuICAgICAgICB0aGVTaG93aW5nVmlldy5ub3RpZnkoIFwidmlld1dpbGxBcHBlYXJcIiApO1xuICAgICAgICAvLyB0ZWxsIGFueW9uZSB3aG8gaXMgbGlzdGVuaW5nIHdobyBnb3QgcHVzaGVkXG4gICAgICAgIHNlbGYubm90aWZ5KCBcInZpZXdQdXNoZWRcIiwgW3RoZVNob3dpbmdWaWV3XSApO1xuICAgICAgICAvLyB0ZWxsIHRoZSB2aWV3IGl0J3MgdmlzaWJsZSBhZnRlciB0aGUgZGVsYXkgaGFzIHBhc3NlZFxuICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhlSGlkaW5nVmlldy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICB0aGVIaWRpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3RGlkRGlzYXBwZWFyXCIgKTtcbiAgICAgICAgICB0aGVTaG93aW5nVmlldy5ub3RpZnkoIFwidmlld0RpZEFwcGVhclwiICk7XG4gICAgICAgICAgLy8gaGlkZSBjbGljayBwcmV2ZW50ZXJcbiAgICAgICAgICBzZWxmLl9wcmV2ZW50Q2xpY2tzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkgKiAxMDAwICk7XG4gICAgICB9LCA1MCApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogcG9wcyB0aGUgdG9wIHZpZXcgZnJvbSB0aGUgdmlldyBzdGFja1xuICAgICAqXG4gICAgICogQG1ldGhvZCBwb3BWaWV3XG4gICAgICogQHBhcmFtIHtCb29sZWFufSB3aXRoQW5pbWF0aW9uIFVzZSBhbmltYXRpb24gd2hlbiBwb3BwaW5nLCBkZWZhdWx0IGB0cnVlYFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB3aXRoRGVsYXkgRHVyYXRpb24gb2YgYW5pbWF0aW9uIGluIHNlY29uZHMsIERlZmF1bHQgYDAuM2BcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gd2l0aFR5cGUgQ1NTIEFuaW1hdGlvbiwgZGVmYXVsdCBpcyBgZWFzZS1pbi1vdXRgXG4gICAgICovXG4gICAgc2VsZi5wb3BWaWV3ID0gZnVuY3Rpb24gKCB3aXRoQW5pbWF0aW9uLCB3aXRoRGVsYXksIHdpdGhUeXBlICkge1xuICAgICAgdmFyIHVzaW5nQW5pbWF0aW9uID0gdHJ1ZSxcbiAgICAgICAgYW5pbWF0aW9uRGVsYXkgPSAwLjMsXG4gICAgICAgIGFuaW1hdGlvblR5cGUgPSBcImVhc2UtaW4tb3V0XCI7XG4gICAgICBpZiAoIHR5cGVvZiB3aXRoQW5pbWF0aW9uICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB1c2luZ0FuaW1hdGlvbiA9IHdpdGhBbmltYXRpb247XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiB3aXRoRGVsYXkgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIGFuaW1hdGlvbkRlbGF5ID0gd2l0aERlbGF5O1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygd2l0aFR5cGUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIGFuaW1hdGlvblR5cGUgPSB3aXRoVHlwZTtcbiAgICAgIH1cbiAgICAgIGlmICggIXVzaW5nQW5pbWF0aW9uICkge1xuICAgICAgICBhbmltYXRpb25EZWxheSA9IDA7XG4gICAgICB9XG4gICAgICAvLyBvbmx5IHBvcCBpZiB3ZSBoYXZlIHZpZXdzIHRvIHBvcCAoQ2FuJ3QgcG9wIHRoZSBmaXJzdCEpXG4gICAgICBpZiAoIHNlbGYuX3N1YnZpZXdzLmxlbmd0aCA8PSAxICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBwb3AgdGhlIHRvcCB2aWV3IG9mZiB0aGUgc3RhY2tcbiAgICAgIHZhciB0aGVQb3BwaW5nVmlldyA9IHNlbGYuX3N1YnZpZXdzLnBvcCgpLFxuICAgICAgICB0aGVTaG93aW5nVmlldyA9IHNlbGYudG9wVmlldyxcbiAgICAgICAgdGhlUG9wcGluZ1ZpZXdaID0gcGFyc2VJbnQoIGdldENvbXB1dGVkU3R5bGUoIHRoZVBvcHBpbmdWaWV3LmVsZW1lbnQgKS5nZXRQcm9wZXJ0eVZhbHVlKCBcInotaW5kZXhcIiApIHx8IFwiMFwiLCAxMCApLFxuICAgICAgICB0aGVTaG93aW5nVmlld1ogPSBwYXJzZUludCggZ2V0Q29tcHV0ZWRTdHlsZSggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudCApLmdldFByb3BlcnR5VmFsdWUoIFwiei1pbmRleFwiICkgfHwgXCIwXCIsIDEwICk7XG4gICAgICBpZiAoIHRoZVNob3dpbmdWaWV3WiA+PSB0aGVQb3BwaW5nVmlld1ogKSB7XG4gICAgICAgIHRoZVBvcHBpbmdWaWV3WiA9IHRoZVNob3dpbmdWaWV3WiArIDEwO1xuICAgICAgfVxuICAgICAgdGhlU2hvd2luZ1ZpZXcuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJpbmhlcml0XCI7XG4gICAgICAvLyBtYWtlIHN1cmUgdGhhdCB0aGVTaG93aW5nVmlldyBpcyBvZmYgc2NyZWVuIHRvIHRoZSBsZWZ0LCBhbmQgdGhlIHBvcHBpbmdcbiAgICAgIC8vIHZpZXcgaXMgYXQgMFxuICAgICAgVUkuc3R5bGVFbGVtZW50cyggW3RoZVBvcHBpbmdWaWV3LmVsZW1lbnQsIHRoZVNob3dpbmdWaWV3LmVsZW1lbnRdLCBcInRyYW5zaXRpb25cIiwgXCJpbmhlcml0XCIgKTtcbiAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVBvcHBpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwidHJhbnNpdGlvblwiLCBcImluaGVyaXRcIiApO1xuICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJ0cmFuc2l0aW9uXCIsIFwiaW5oZXJpdFwiICk7XG4gICAgICBVSS5zdHlsZUVsZW1lbnQoIHRoZVNob3dpbmdWaWV3LmVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlM2QoLTUwJSwwLFwiICsgdGhlU2hvd2luZ1ZpZXdaICsgXCJweClcIiApO1xuICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVQb3BwaW5nVmlldy5lbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZTNkKDAsMCxcIiArIHRoZVBvcHBpbmdWaWV3WiArIFwicHhcIiApO1xuICAgICAgaWYgKCB1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJvcGFjaXR5XCIsIFwiMFwiICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVBvcHBpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwib3BhY2l0eVwiLCBcIjFcIiApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlU2hvd2luZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJvcGFjaXR5XCIsIFwiMVwiICk7XG4gICAgICAgIFVJLnN0eWxlRWxlbWVudHMoIHRoZVBvcHBpbmdWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggXCIudWktbmF2aWdhdGlvbi1iYXIgKlwiICksIFwib3BhY2l0eVwiLCBcIjFcIiApO1xuICAgICAgfVxuICAgICAgLy8gc2V0IHVwIGFuIGFuaW1hdGlvblxuICAgICAgaWYgKCB1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggW3RoZVBvcHBpbmdWaWV3LmVsZW1lbnQsIHRoZVNob3dpbmdWaWV3LmVsZW1lbnRdLCBcInRyYW5zaXRpb25cIiwgXCItd2Via2l0LXRyYW5zZm9ybSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25EZWxheSArIFwicyBcIiArIGFuaW1hdGlvblR5cGUgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggW3RoZVBvcHBpbmdWaWV3LmVsZW1lbnQsIHRoZVNob3dpbmdWaWV3LmVsZW1lbnRdLCBcInRyYW5zaXRpb25cIiwgXCItbW96LXRyYW5zZm9ybSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25EZWxheSArIFwicyBcIiArIGFuaW1hdGlvblR5cGUgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggW3RoZVBvcHBpbmdWaWV3LmVsZW1lbnQsIHRoZVNob3dpbmdWaWV3LmVsZW1lbnRdLCBcInRyYW5zaXRpb25cIiwgXCItbXMtdHJhbnNmb3JtIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkRlbGF5ICsgXCJzIFwiICsgYW5pbWF0aW9uVHlwZSApO1xuICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCBbdGhlUG9wcGluZ1ZpZXcuZWxlbWVudCwgdGhlU2hvd2luZ1ZpZXcuZWxlbWVudF0sIFwidHJhbnNpdGlvblwiLCBcInRyYW5zZm9ybSBcIiArIGFuaW1hdGlvbkRlbGF5ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicyBcIiArIGFuaW1hdGlvblR5cGUgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50cyggdGhlUG9wcGluZ1ZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi51aS1uYXZpZ2F0aW9uLWJhciAqXCIgKSwgXCJ0cmFuc2l0aW9uXCIsIFwib3BhY2l0eSBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbkRlbGF5ICsgXCJzIFwiICsgYW5pbWF0aW9uVHlwZSApO1xuICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCB0aGVTaG93aW5nVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLnVpLW5hdmlnYXRpb24tYmFyICpcIiApLCBcInRyYW5zaXRpb25cIiwgXCJvcGFjaXR5IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uRGVsYXkgKyBcInMgXCIgKyBhbmltYXRpb25UeXBlICk7XG4gICAgICB9XG4gICAgICAvLyBkaXNwbGF5IHRoZSBjbGljayBwcmV2ZW50aW9uIGVsZW1lbnRcbiAgICAgIHNlbGYuX3ByZXZlbnRDbGlja3Muc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gYW5kIG1vdmUgZXZlcnlvbmVcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVTaG93aW5nVmlldy5lbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZTNkKDAsMCxcIiArIHRoZVNob3dpbmdWaWV3WiArIFwicHgpXCIgKTtcbiAgICAgICAgVUkuc3R5bGVFbGVtZW50KCB0aGVQb3BwaW5nVmlldy5lbGVtZW50LCBcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZTNkKDEwMCUsMCxcIiArIHRoZVBvcHBpbmdWaWV3WiArIFwicHgpXCIgKTtcbiAgICAgICAgaWYgKCB1c2luZ0FuaW1hdGlvbiApIHtcbiAgICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCB0aGVQb3BwaW5nVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLnVpLW5hdmlnYXRpb24tYmFyICpcIiApLCBcIm9wYWNpdHlcIiwgXCIwXCIgKTtcbiAgICAgICAgICBVSS5zdHlsZUVsZW1lbnRzKCB0aGVTaG93aW5nVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLnVpLW5hdmlnYXRpb24tYmFyICpcIiApLCBcIm9wYWNpdHlcIiwgXCIxXCIgKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGUgdGhlIHZpZXcgaXQncyBhYm91dCB0byBzaG93Li4uXG4gICAgICAgIHRoZVBvcHBpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3V2lsbERpc2FwcGVhclwiICk7XG4gICAgICAgIHRoZVNob3dpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3V2lsbEFwcGVhclwiICk7XG4gICAgICAgIC8vIHRlbGwgdGhlIHZpZXcgaXQncyB2aXNpYmxlIGFmdGVyIHRoZSBkZWxheSBoYXMgcGFzc2VkXG4gICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGVQb3BwaW5nVmlldy5ub3RpZnkoIFwidmlld0RpZERpc2FwcGVhclwiICk7XG4gICAgICAgICAgdGhlUG9wcGluZ1ZpZXcubm90aWZ5KCBcInZpZXdXYXNQb3BwZWRcIiApO1xuICAgICAgICAgIHRoZVNob3dpbmdWaWV3Lm5vdGlmeSggXCJ2aWV3RGlkQXBwZWFyXCIgKTtcbiAgICAgICAgICAvLyB0ZWxsIGFueW9uZSB3aG8gaXMgbGlzdGVuaW5nIHdobyBnb3QgcG9wcGVkXG4gICAgICAgICAgc2VsZi5ub3RpZnkoIFwidmlld1BvcHBlZFwiLCBbdGhlUG9wcGluZ1ZpZXddICk7XG4gICAgICAgICAgLy8gaGlkZSBjbGljayBwcmV2ZW50ZXJcbiAgICAgICAgICBzZWxmLl9wcmV2ZW50Q2xpY2tzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAvLyBhbmQgcmVtb3ZlIHRoZSBwb3BwaW5nIHZpZXcgZnJvbSB0aGUgaGllcmFyY2h5XG4gICAgICAgICAgdGhlUG9wcGluZ1ZpZXcucGFyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgZGVsZXRlIHRoZVBvcHBpbmdWaWV3Lm5hdmlnYXRpb25Db250cm9sbGVyO1xuICAgICAgICB9LCAoIGFuaW1hdGlvbkRlbGF5ICogMTAwMCApICk7XG4gICAgICB9LCA1MCApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUHJlc2VudHMgdGhlIG5hdmlnYXRpb24gY29udHJvbGxlciBhcyBhIG1vZGFsIG5hdmlnYXRpb24gY29udHJvbGxlci4gSXQgc2l0c1xuICAgICAqIGFkamFjZW50IHRvIGBmcm9tVmlld2AgaW4gdGhlIERPTSwgbm90IHdpdGhpbiwgYW5kIGFzIHN1Y2ggY2FuIHByZXZlbnQgaXRcbiAgICAgKiBmcm9tIHJlY2VpdmluZyBhbnkgZXZlbnRzLiBUaGUgcmVuZGVyaW5nIGlzIHJvdWdseSB0aGUgc2FtZSBhcyBhbnkgb3RoZXJcbiAgICAgKiBuYXZpZ2F0aW9uIGNvbnRyb2xsZXIsIHNhdmUgdGhhdCBhbiBleHRyYSBjbGFzcyBhZGRlZCB0byB0aGUgZWxlbWVudCdzXG4gICAgICogYHVpLWNvbnRhaW5lcmAgdGhhdCBlbnN1cmVzIHRoYXQgb24gbGFyZ2VyIGRpc3BsYXlzIHRoZSBtb2RhbCBkb2Vzbid0XG4gICAgICogZmlsbCB0aGUgZW50aXJlIHNjcmVlbi4gSWYgZGVzaXJlZCwgdGhpcyBjbGFzcyBjYW4gYmUgY29udHJvbGxlZCBieSB0aGUgc2Vjb25kXG4gICAgICogcGFyYW1ldGVyIChgb3B0aW9uc2ApLlxuICAgICAqXG4gICAgICogaWYgYG9wdGlvbnNgIGFyZSBzcGVjaWZpZWQsIGl0IG11c3QgYmUgb2YgdGhlIGZvcm06XG4gICAgICogYGBgXG4gICAgICogeyBkaXNwbGF5VHlwZTogXCJtb2RhbFdpbmRvd3xtb2RhbFBhZ2V8bW9kYWxGaWxsXCIsICAgLy8gbW9kYWwgZGlzcGxheSB0eXBlXG4gICAgICAgKiAgIHdpdGhBbmltYXRpb246IHRydWV8ZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvdWxkIGFuaW1hdGlvbiBiZSB1c2VkP1xuICAgICAgICogICB3aXRoRGVsYXk6IDAuMywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGFuaW1hdGlvbiBpcyB1c2VkLCB0aW1lIGluIHNlY29uZHNcbiAgICAgICAqICAgd2l0aFRpbWluZ0Z1bmN0aW9uOiBcImVhc2UtaW4tb3V0fC4uLlwiICAgICAgICAgICAgIC8vIHRpbWluZyBmdW5jdGlvbiB0byB1c2UgZm9yIGFuaW1hdGlvblxuICAgICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1ldGhvZCBwcmVzZW50TW9kYWxDb250cm9sbGVyXG4gICAgICogQHBhcmFtIHtOb2RlfSBmcm9tVmlldyAgICAgICAgICAgICAgICAgICAgICB0aGUgdG9wLWxldmVsIHZpZXcgdG8gY292ZXIgKHR5cGljYWxseSByb290Q29udGFpbmVyKVxuICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9ucyAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyB0byBhcHBseVxuICAgICAqL1xuICAgIHNlbGYucHJlc2VudE1vZGFsQ29udHJvbGxlciA9IGZ1bmN0aW9uIHByZXNlbnRNb2RlbENvbnRyb2xsZXIoIGZyb21WaWV3LCBvcHRpb25zICkge1xuICAgICAgdmFyIGRlZmF1bHRPcHRzID0ge1xuICAgICAgICBkaXNwbGF5VHlwZTogICAgICAgIFwibW9kYWxXaW5kb3dcIixcbiAgICAgICAgd2l0aEFuaW1hdGlvbjogICAgICB0cnVlLFxuICAgICAgICB3aXRoRGVsYXk6ICAgICAgICAgIDAuMyxcbiAgICAgICAgd2l0aFRpbWluZ0Z1bmN0aW9uOiBcImVhc2UtaW4tb3V0XCJcbiAgICAgIH07XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmRpc3BsYXlUeXBlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgIGRlZmF1bHRPcHRzLmRpc3BsYXlUeXBlID0gb3B0aW9ucy5kaXNwbGF5VHlwZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLndpdGhBbmltYXRpb24gIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgZGVmYXVsdE9wdHMud2l0aEFuaW1hdGlvbiA9IG9wdGlvbnMud2l0aEFuaW1hdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLndpdGhEZWxheSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICBkZWZhdWx0T3B0cy53aXRoRGVsYXkgPSBvcHRpb25zLndpdGhEZWxheTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLndpdGhUaW1pbmdGdW5jdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICBkZWZhdWx0T3B0cy53aXRoVGltaW5nRnVuY3Rpb24gPSBvcHRpb25zLndpdGhUaW1pbmdGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCAhZGVmYXVsdE9wdHMud2l0aEFuaW1hdGlvbiApIHtcbiAgICAgICAgZGVmYXVsdE9wdHMud2l0aERlbGF5ID0gMDtcbiAgICAgIH1cbiAgICAgIC8vIGNoZWNrIG91ciBmb3JtIGZhY3RvciBjbGFzczsgaWYgd2UncmUgYSBwaG9uZSwgb25seSBwZXJtaXQgbW9kYWxGaWxsXG4gICAgICBpZiAoIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCBcInBob25lXCIgKSApIHtcbiAgICAgICAgZGVmYXVsdE9wdHMuZGlzcGxheVR5cGUgPSBcIm1vZGFsRmlsbFwiO1xuICAgICAgfVxuICAgICAgc2VsZi5fbW9kYWxWaWV3ID0gZnJvbVZpZXc7XG4gICAgICBzZWxmLl9tb2RhbCA9IHRydWU7XG4gICAgICBzZWxmLl9tb2RhbFZpZXdUeXBlID0gZGVmYXVsdE9wdHMuZGlzcGxheVR5cGU7XG4gICAgICBzZWxmLl9tb2RhbENsaWNrUHJldmVudGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgICAgc2VsZi5fbW9kYWxDbGlja1ByZXZlbnRlci5jbGFzc05hbWUgPSBcInVpLWNvbnRhaW5lciB1aS10cmFuc3BhcmVudFwiO1xuICAgICAgLy8gd2UgbmVlZCB0byBjYWxjdWxhdGUgdGhlIHogaW5kaWNlcyBvZiB0aGUgYWRqYWNlbnQgdmlldyBhbmQgdXNcbiAgICAgIHZhciB0aGVBZGphY2VudFZpZXdaID0gcGFyc2VJbnQoIGdldENvbXB1dGVkU3R5bGUoIGZyb21WaWV3ICkuZ2V0UHJvcGVydHlWYWx1ZSggXCJ6LWluZGV4XCIgKSB8fCBcIjBcIiwgMTAgKSxcbiAgICAgICAgdGhlTW9kYWxWaWV3WiA9IHBhcnNlSW50KCBnZXRDb21wdXRlZFN0eWxlKCBzZWxmLmVsZW1lbnQgKS5nZXRQcm9wZXJ0eVZhbHVlKCBcInotaW5kZXhcIiApIHx8IFwiMFwiLCAxMCApO1xuICAgICAgaWYgKCB0aGVNb2RhbFZpZXdaIDw9IHRoZUFkamFjZW50Vmlld1ogKSB7XG4gICAgICAgIHRoZU1vZGFsVmlld1ogPSB0aGVBZGphY2VudFZpZXdaICsgMTA7IC8vIHRoZSBtb2RhbCBzaG91bGQgYWx3YXlzIGJlIGFib3ZlIHRoZSBhZGphY2VudCB2aWV3XG4gICAgICB9XG4gICAgICAvLyBtYWtlIHN1cmUgb3VyIGN1cnJlbnQgdmlldyBpcyBvZmYtc2NyZWVuIHNvIHRoYXQgd2hlbiBpdCBpcyBhZGRlZCwgaXQgd29uJ3QgZmxpY2tlclxuICAgICAgc2VsZi5lbGVtZW50LiRzKCBcInRyYW5zZm9ybVwiLCBVVElMLnRlbXBsYXRlKCBcInRyYW5zbGF0ZTNkKCVYJSwlWSUsJVolKVwiLCB7XG4gICAgICAgIHg6IFwiMFwiLFxuICAgICAgICB5OiBcIjE1MCVcIixcbiAgICAgICAgejogXCJcIiArIHRoZU1vZGFsVmlld1ogKyBcInB4XCJcbiAgICAgIH0gKSApO1xuICAgICAgc2VsZi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoIGRlZmF1bHRPcHRzLmRpc3BsYXlUeXBlICk7XG4gICAgICAvLyBhbmQgYXR0YWNoIHRoZSBlbGVtZW50XG4gICAgICBzZWxmLl9tb2RhbENsaWNrUHJldmVudGVyLmFwcGVuZENoaWxkKCBzZWxmLmVsZW1lbnQgKTtcbiAgICAgIGZyb21WaWV3LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIHNlbGYuX21vZGFsQ2xpY2tQcmV2ZW50ZXIgKTtcbiAgICAgIC8vIHNlbmQgYW55IG5vdGlmaWNhdGlvbnMgd2UgbmVlZFxuICAgICAgc2VsZi5lbWl0KCBcInZpZXdXYXNQdXNoZWRcIiApO1xuICAgICAgc2VsZi5lbWl0KCBcInZpZXdXaWxsQXBwZWFyXCIgKTtcbiAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnJvbVZpZXcuY2xhc3NMaXN0LmFkZCggXCJ1aS1kaXNhYmxlZFwiICk7XG4gICAgICAgIFVJLmJlZ2luQW5pbWF0aW9uKCBmcm9tVmlldyApLnNldFRpbWluZyggZGVmYXVsdE9wdHMud2l0aERlbGF5ICkuc2V0VGltaW5nRnVuY3Rpb24oIGRlZmF1bHRPcHRzLndpdGhUaW1pbmdGdW5jdGlvbiApXG4gICAgICAgICAgLnNjYWxlKCBcIjAuOVwiICkub3BhY2l0eSggXCIwLjlcIiApLmVuZEFuaW1hdGlvbigpO1xuICAgICAgICBVSS5iZWdpbkFuaW1hdGlvbiggc2VsZi5lbGVtZW50ICkuc2V0VGltaW5nKCBkZWZhdWx0T3B0cy53aXRoRGVsYXkgKS5zZXRUaW1pbmdGdW5jdGlvbiggZGVmYXVsdE9wdHMud2l0aFRpbWluZ0Z1bmN0aW9uIClcbiAgICAgICAgICAudHJhbnNsYXRlM2QoIFwiMFwiLCBcIjBcIiwgXCJcIiArIHRoZU1vZGFsVmlld1ogKyBcInB4XCIgKS5lbmRBbmltYXRpb24oIGZ1bmN0aW9uIHNlbmROb3RpZmljYXRpb25zKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5lbWl0KCBcInZpZXdEaWRBcHBlYXJcIiApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgIH0sIDUwICk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBEaXNtaXNzIGEgY29udHJvbGxlciBwcmVzZW50ZWQgd2l0aCBgcHJlc2VudE1vZGVsQ29udHJvbGxlcmAuIE9wdGlvbnMgY2FuIGJlXG4gICAgICpcbiAgICAgKiBgYGBcbiAgICAgKiB7IHdpdGhBbmltYXRpb246IHRydWV8ZmFsc2UsICAgICAgICAgLy8gaWYgZmFsc2UsIG5vIGFuaW1hdGlvbiBvY2N1cnNcbiAgICAgICAqICAgd2l0aERlbGF5OiAwLjMsICAgICAgICAgICAgICAgICAgICAvLyB0aW1lIGluIHNlY29uZHNcbiAgICAgICAqICAgd2l0aFRpbWluZ0Z1bmN0aW9uOiBcImVhc2UtaW4tb3V0XCIgIC8vIGVhc2luZyBmdW5jdGlvbiB0byB1c2VcbiAgICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGlzbWlzc01vZGFsQ29udHJvbGxlclxuICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9uc1xuICAgICAqL1xuICAgIHNlbGYuZGlzbWlzc01vZGFsQ29udHJvbGxlciA9IGZ1bmN0aW9uIGRpc21pc3NNb2RlbENvbnRyb2xsZXIoIG9wdGlvbnMgKSB7XG4gICAgICB2YXIgZGVmYXVsdE9wdHMgPSB7XG4gICAgICAgIHdpdGhBbmltYXRpb246ICAgICAgdHJ1ZSxcbiAgICAgICAgd2l0aERlbGF5OiAgICAgICAgICAwLjMsXG4gICAgICAgIHdpdGhUaW1pbmdGdW5jdGlvbjogXCJlYXNlLWluLW91dFwiXG4gICAgICB9O1xuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy53aXRoQW5pbWF0aW9uICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgIGRlZmF1bHRPcHRzLndpdGhBbmltYXRpb24gPSBvcHRpb25zLndpdGhBbmltYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy53aXRoRGVsYXkgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgZGVmYXVsdE9wdHMud2l0aERlbGF5ID0gb3B0aW9ucy53aXRoRGVsYXk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy53aXRoVGltaW5nRnVuY3Rpb24gIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgZGVmYXVsdE9wdHMud2l0aFRpbWluZ0Z1bmN0aW9uID0gb3B0aW9ucy53aXRoVGltaW5nRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICggIWRlZmF1bHRPcHRzLndpdGhBbmltYXRpb24gKSB7XG4gICAgICAgIGRlZmF1bHRPcHRzLndpdGhEZWxheSA9IDA7XG4gICAgICB9XG4gICAgICAvLyB3ZSBuZWVkIHRvIGNhbGN1bGF0ZSB0aGUgeiBpbmRpY2VzIG9mIHRoZSBhZGphY2VudCB2aWV3IGFuZCB1c1xuICAgICAgdmFyIHRoZUFkamFjZW50Vmlld1ogPSBwYXJzZUludCggZ2V0Q29tcHV0ZWRTdHlsZSggc2VsZi5tb2RhbFZpZXcgKS5nZXRQcm9wZXJ0eVZhbHVlKCBcInotaW5kZXhcIiApIHx8IFwiMFwiLCAxMCApLFxuICAgICAgICB0aGVNb2RhbFZpZXdaID0gcGFyc2VJbnQoIGdldENvbXB1dGVkU3R5bGUoIHNlbGYuZWxlbWVudCApLmdldFByb3BlcnR5VmFsdWUoIFwiei1pbmRleFwiICkgfHwgXCIwXCIsIDEwICk7XG4gICAgICBpZiAoIHRoZU1vZGFsVmlld1ogPD0gdGhlQWRqYWNlbnRWaWV3WiApIHtcbiAgICAgICAgdGhlTW9kYWxWaWV3WiA9IHRoZUFkamFjZW50Vmlld1ogKyAxMDsgLy8gdGhlIG1vZGFsIHNob3VsZCBhbHdheXMgYmUgYWJvdmUgdGhlIGFkamFjZW50IHZpZXdcbiAgICAgIH1cbiAgICAgIC8vIHNlbmQgYW55IG5vdGlmaWNhdGlvbnMgd2UgbmVlZFxuICAgICAgc2VsZi5lbWl0KCBcInZpZXdXaWxsRGlzYXBwZWFyXCIgKTtcbiAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5tb2RhbFZpZXcuY2xhc3NMaXN0LnJlbW92ZSggXCJ1aS1kaXNhYmxlZFwiICk7XG4gICAgICAgIFVJLmJlZ2luQW5pbWF0aW9uKCBzZWxmLm1vZGFsVmlldyApLnNldFRpbWluZyggZGVmYXVsdE9wdHMud2l0aERlbGF5ICkuc2V0VGltaW5nRnVuY3Rpb24oIGRlZmF1bHRPcHRzLndpdGhUaW1pbmdGdW5jdGlvbiApXG4gICAgICAgICAgLnNjYWxlKCBcIjFcIiApLm9wYWNpdHkoIFwiMVwiICkuZW5kQW5pbWF0aW9uKCk7XG4gICAgICAgIFVJLmJlZ2luQW5pbWF0aW9uKCBzZWxmLmVsZW1lbnQgKS5zZXRUaW1pbmcoIGRlZmF1bHRPcHRzLndpdGhEZWxheSApLnNldFRpbWluZ0Z1bmN0aW9uKCBkZWZhdWx0T3B0cy53aXRoVGltaW5nRnVuY3Rpb24gKVxuICAgICAgICAgIC50cmFuc2xhdGUzZCggXCIwXCIsIFwiMTUwJVwiLCBcIlwiICsgdGhlTW9kYWxWaWV3WiArIFwicHhcIiApLmVuZEFuaW1hdGlvbihcbiAgICAgICAgICBmdW5jdGlvbiBzZW5kTm90aWZpY2F0aW9ucygpIHtcbiAgICAgICAgICAgIHNlbGYuZW1pdCggXCJ2aWV3RGlkRGlzYXBwZWFyXCIgKTtcbiAgICAgICAgICAgIHNlbGYuZW1pdCggXCJ2aWV3V2FzUG9wcGVkXCIgKTtcbiAgICAgICAgICAgIHNlbGYuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCBzZWxmLm1vZGFsVmlld1R5cGUgKTtcbiAgICAgICAgICAgIHNlbGYuX21vZGFsQ2xpY2tQcmV2ZW50ZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggc2VsZi5fbW9kYWxDbGlja1ByZXZlbnRlciApO1xuICAgICAgICAgICAgc2VsZi5fbW9kYWxDbGlja1ByZXZlbnRlci5yZW1vdmVDaGlsZCggc2VsZi5lbGVtZW50ICk7XG4gICAgICAgICAgICBzZWxmLl9tb2RhbCA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5fbW9kYWxWaWV3ID0gbnVsbDtcbiAgICAgICAgICAgIHNlbGYuX21vZGFsVmlld1R5cGUgPSBcIlwiO1xuICAgICAgICAgICAgc2VsZi5fbW9kYWxDbGlja1ByZXZlbnRlciA9IG51bGw7XG4gICAgICAgICAgfSApO1xuICAgICAgfSwgNTAgKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEBtZXRob2QgcmVuZGVyXG4gICAgICogQGFic3RyYWN0XG4gICAgICovXG4gICAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIFwiXCI7IC8vIG5vdGhpbmcgdG8gcmVuZGVyIVxuICAgIH0gKTtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgZWxlbWVudHMgYW5kIGNsaWNrIHByZXZlbnRpb24gZWxlbWVudHMgaWYgbmVjZXNzYXJ5OyBvdGhlcndpc2UgdGhlcmUncyBub3RoaW5nIHRvIGRvXG4gICAgICogQG1ldGhvZCByZW5kZXJUb0VsZW1lbnRcbiAgICAgKi9cbiAgICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiByZW5kZXJUb0VsZW1lbnQoKSB7XG4gICAgICBzZWxmLmNyZWF0ZUVsZW1lbnRJZk5vdENyZWF0ZWQoKTtcbiAgICAgIHNlbGYuX2NyZWF0ZUNsaWNrUHJldmVudGlvbkVsZW1lbnRJZk5vdENyZWF0ZWQoKTtcbiAgICAgIHJldHVybjsgLy8gbm90aGluZyB0byBkby5cbiAgICB9ICk7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSB0aGUgbmF2aWdhdGlvbiBjb250cm9sbGVyXG4gICAgICogQG1ldGhvZCBpbml0XG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGluaXQoIHRoZVJvb3RWaWV3LCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApIHtcbiAgICAgIGlmICggdHlwZW9mIHRoZVJvb3RWaWV3ID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiQ2FuJ3QgaW5pdGlhbGl6ZSBhIG5hdmlnYXRpb24gY29udHJvbGxlciB3aXRob3V0IGEgcm9vdCB2aWV3LlwiICk7XG4gICAgICB9XG4gICAgICAvLyBkbyB3aGF0IGEgbm9ybWFsIHZpZXcgY29udGFpbmVyIGRvZXNcbiAgICAgIHNlbGYuJHN1cGVyKCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApO1xuICAgICAgLy9zZWxmLnN1cGVyKCBfY2xhc3NOYW1lLCBcImluaXRcIiwgW3RoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50IF0gKTtcbiAgICAgIC8vIG5vdyBhZGQgdGhlIHJvb3Qgdmlld1xuICAgICAgc2VsZi5yb290VmlldyA9IHRoZVJvb3RWaWV3O1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfSApO1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgdGhlIG5hdmlnYXRpb24gY29udHJvbGxlclxuICAgICAqIEBtZXRob2QgaW5pdFdpdGhPcHRpb25zXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGluaXRXaXRoT3B0aW9ucyggb3B0aW9ucyApIHtcbiAgICAgIHZhciB0aGVSb290VmlldywgdGhlRWxlbWVudElkLCB0aGVFbGVtZW50VGFnLCB0aGVFbGVtZW50Q2xhc3MsXG4gICAgICAgIHRoZVBhcmVudEVsZW1lbnQ7XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmlkICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgIHRoZUVsZW1lbnRJZCA9IG9wdGlvbnMuaWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50YWcgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgdGhlRWxlbWVudFRhZyA9IG9wdGlvbnMudGFnO1xuICAgICAgICB9XG4gICAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMuY2xhc3MgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgdGhlRWxlbWVudENsYXNzID0gb3B0aW9ucy5jbGFzcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICB0aGVQYXJlbnRFbGVtZW50ID0gb3B0aW9ucy5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5yb290VmlldyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICB0aGVSb290VmlldyA9IG9wdGlvbnMucm9vdFZpZXc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxmLmluaXQoIHRoZVJvb3RWaWV3LCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApO1xuICAgIH0gKTtcbiAgICAvLyBoYW5kbGUgYXV0byBpbml0aWFsaXphdGlvblxuICAgIHNlbGYuX2F1dG9Jbml0LmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbm1vZHVsZS5leHBvcnRzID0gTmF2aWdhdGlvbkNvbnRyb2xsZXI7XG4iLCIvKipcbiAqXG4gKiBQcm92aWRlcyBuYXRpdmUtbGlrZSBhbGVydCBtZXRob2RzLCBpbmNsdWRpbmcgcHJvbXB0cyBhbmQgbWVzc2FnZXMuXG4gKlxuICogQG1vZHVsZSBhbGVydC5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNFxuICpcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDEzIEtlcnJpIFNob3R0cywgcGhvdG9LYW5keSBTdHVkaW9zIExMQ1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllc1xuICogb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUlxuICogUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVFxuICogT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqIGBgYFxuICovXG4vKmdsb2JhbCBtb2R1bGUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX3kgPSByZXF1aXJlKCBcIi4uL3V0aWwvY29yZVwiICksXG4gIEJhc2VPYmplY3QgPSByZXF1aXJlKCBcIi4uL3V0aWwvb2JqZWN0XCIgKSxcbiAgVUkgPSByZXF1aXJlKCBcIi4vY29yZVwiICksXG4gIGggPSByZXF1aXJlKCBcIi4uL3V0aWwvaFwiICk7XG52YXIgX2NsYXNzTmFtZSA9IFwiU3Bpbm5lclwiO1xuXG5mdW5jdGlvbiBTcGlubmVyKCkge1xuICB2YXIgc2VsZiA9IG5ldyBCYXNlT2JqZWN0KCk7XG4gIHNlbGYuc3ViY2xhc3MoIF9jbGFzc05hbWUgKTtcbiAgc2VsZi5fZWxlbWVudCA9IG51bGw7XG4gIHNlbGYuZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnR5KCBcInRleHRcIiApO1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInZpc2libGVcIiwge1xuICAgIGRlZmF1bHQ6IGZhbHNlXG4gIH0gKTtcbiAgc2VsZi5zZXRPYnNlcnZhYmxlVGludGVkQmFja2dyb3VuZCA9IGZ1bmN0aW9uIHNldE9ic2VydmFibGVUaW50ZWRCYWNrZ3JvdW5kKCB2ICkge1xuICAgIGlmICggdiApIHtcbiAgICAgIHNlbGYuX2VsZW1lbnQuY2xhc3NMaXN0LmFkZCggXCJvYnNjdXJlLWJhY2tncm91bmRcIiApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl9lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoIFwib2JzY3VyZS1iYWNrZ3JvdW5kXCIgKTtcbiAgICB9XG4gICAgcmV0dXJuIHY7XG4gIH1cbiAgc2VsZi5kZWZpbmVPYnNlcnZhYmxlUHJvcGVydHkoIFwidGludGVkQmFja2dyb3VuZFwiLCB7XG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfSApO1xuICBzZWxmLnNob3cgPSBmdW5jdGlvbiBzaG93KCkge1xuICAgIGlmICggIXNlbGYudmlzaWJsZSApIHtcbiAgICAgIFVJLl9yb290Q29udGFpbmVyLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIHNlbGYuX2VsZW1lbnQgKTtcbiAgICAgIHNlbGYudmlzaWJsZSA9IHRydWU7XG4gICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuX2VsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuICAgICAgfSwgMCApO1xuICAgIH1cbiAgfTtcbiAgc2VsZi5oaWRlID0gZnVuY3Rpb24gaGlkZSggY2IgKSB7XG4gICAgaWYgKCBzZWxmLnZpc2libGUgKSB7XG4gICAgICBzZWxmLl9lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICAgIHNlbGYudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuICAgICAgICBVSS5fcm9vdENvbnRhaW5lci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBzZWxmLl9lbGVtZW50ICk7XG4gICAgICAgIGlmICggdHlwZW9mIGNiID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgICAgICAgc2V0VGltZW91dCggY2IsIDAgKTtcbiAgICAgICAgfVxuICAgICAgfSwgMjUwICk7XG4gICAgfVxuICB9O1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiBpbml0KCkge1xuICAgIHNlbGYuc3VwZXIoIF9jbGFzc05hbWUsIFwiaW5pdFwiICk7XG4gICAgc2VsZi5fZWxlbWVudCA9IGguZWwoIFwiZGl2LnVpLXNwaW5uZXItb3V0ZXItY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGguZWwoIFwiZGl2LnVpLXNwaW5uZXItaW5uZXItY29udGFpbmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtoLmVsKCBcImRpdi51aS1zcGlubmVyLWlubmVyLXNwaW5uZXJcIiApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaC5lbCggXCJkaXYudWktc3Bpbm5lci1pbm5lci10ZXh0XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdDogIHNlbGYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5UGF0aDogXCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0gKSApO1xuICAgIHJldHVybiBzZWxmO1xuICB9ICk7XG4gIHNlbGYuaW5pdFdpdGhPcHRpb25zID0gZnVuY3Rpb24gaW5pdFdpdGhPcHRpb25zKCBvcHRpb25zICkge1xuICAgIHNlbGYuaW5pdCgpO1xuICAgIHNlbGYudGV4dCA9IG9wdGlvbnMudGV4dDtcbiAgICBzZWxmLnRpbnRlZEJhY2tncm91bmQgPSAoIG9wdGlvbnMudGludGVkQmFja2dyb3VuZCAhPT0gdW5kZWZpbmVkICkgPyBvcHRpb25zLnRpbnRlZEJhY2tncm91bmQgOiBmYWxzZTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbiAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBpZiAoIHNlbGYudmlzaWJsZSApIHtcbiAgICAgIFVJLl9yb290Q29udGFpbmVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIHNlbGYuX2VsZW1lbnQgKTtcbiAgICAgIHNlbGYudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICBzZWxmLl9lbGVtZW50ID0gbnVsbDtcbiAgICBzZWxmLnN1cGVyKCBfY2xhc3NOYW1lLCBcImRlc3Ryb3lcIiApO1xuICB9IClcbiAgc2VsZi5fYXV0b0luaXQuYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xuICByZXR1cm4gc2VsZjtcbn1cbm1vZHVsZS5leHBvcnRzID0gU3Bpbm5lcjtcbiIsIi8qKlxuICpcbiAqIFNwbGl0IFZpZXcgQ29udHJvbGxlcnMgcHJvdmlkZSBiYXNpYyBzdXBwb3J0IGZvciBzaWRlLWJ5LXNpZGUgdmlld3NcbiAqXG4gKiBAbW9kdWxlIHNwbGl0Vmlld0NvbnRyb2xsZXIuanNcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjRcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDEzIEtlcnJpIFNob3R0cywgcGhvdG9LYW5keSBTdHVkaW9zIExMQ1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllc1xuICogb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUlxuICogUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVFxuICogT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqIGBgYFxuICovXG4vKmdsb2JhbCBtb2R1bGUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgVUkgPSByZXF1aXJlKCBcIi4vY29yZVwiICksXG4gIFZpZXdDb250YWluZXIgPSByZXF1aXJlKCBcIi4vdmlld0NvbnRhaW5lclwiICk7XG52YXIgX2NsYXNzTmFtZSA9IFwiU3BsaXRWaWV3Q29udHJvbGxlclwiO1xudmFyIFNwbGl0Vmlld0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gbmV3IFZpZXdDb250YWluZXIoKTtcbiAgc2VsZi5zdWJjbGFzcyggX2NsYXNzTmFtZSApO1xuICAvLyAjIE5vdGlmaWNhdGlvbnNcbiAgLy9cbiAgLy8gKiBgdmlld3NDaGFuZ2VkYCAtIGZpcmVkIHdoZW4gdGhlIGxlZnQgb3IgcmlnaHQgc2lkZSB2aWV3IGNoYW5nZXNcbiAgLy9cbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJ2aWV3c0NoYW5nZWRcIiApO1xuICBzZWxmLl9wcmV2ZW50Q2xpY2tzID0gbnVsbDtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjbGljay1wcmV2ZW50aW9uIGVsZW1lbnQgLS0gZXNzZW50aWFsbHkgYSB0cmFuc3BhcmVudCBESVYgdGhhdFxuICAgKiBmaWxscyB0aGUgc2NyZWVuLlxuICAgKiBAbWV0aG9kIF9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZWxmLl9jcmVhdGVDbGlja1ByZXZlbnRpb25FbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuY3JlYXRlRWxlbWVudElmTm90Q3JlYXRlZCgpO1xuICAgIHNlbGYuX3ByZXZlbnRDbGlja3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG4gICAgc2VsZi5fcHJldmVudENsaWNrcy5jbGFzc05hbWUgPSBcInVpLXByZXZlbnQtY2xpY2tzXCI7XG4gICAgc2VsZi5lbGVtZW50LmFwcGVuZENoaWxkKCBzZWxmLl9wcmV2ZW50Q2xpY2tzICk7XG4gIH07XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBjbGljay1wcmV2ZW50aW9uIGVsZW1lbnQgaWYgbmVjZXNzYXJ5XG4gICAqIEBtZXRob2QgX2NyZWF0ZUNsaWNrUHJldmVudGlvbkVsZW1lbnRJZk5vdENyZWF0ZWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2NyZWF0ZUNsaWNrUHJldmVudGlvbkVsZW1lbnRJZk5vdENyZWF0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCBzZWxmLl9wcmV2ZW50Q2xpY2tzID09PSBudWxsICkge1xuICAgICAgc2VsZi5fY3JlYXRlQ2xpY2tQcmV2ZW50aW9uRWxlbWVudCgpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEluZGljYXRlcyB0aGUgdHlwZSBvZiBzcGxpdCBjYW52YXM6XG4gICAqXG4gICAqICogYHNwbGl0YDogdHlwaWNhbCBzcGxpdC12aWV3IC0gbGVmdCBhbmQgcmlnaHQgc2lkZSBzaGFyZXMgc3BhY2Ugb24gc2NyZWVuXG4gICAqICogYG9mZi1jYW52YXNgOiBvZmYtY2FudmFzIHZpZXcgQUtBIEZhY2Vib29rIHNwbGl0IHZpZXcuIExlZnQgc2lkZSBpcyBvZmYgc2NyZWVuIGFuZCBjYW4gc2xpZGUgaW5cbiAgICogKiBgc3BsaXQtb3ZlcmxheWA6IGxlZnQgc2lkZSBzbGlkZXMgb3ZlciB0aGUgcmlnaHQgc2lkZSB3aGVuIHZpc2libGVcbiAgICpcbiAgICogQHByb3BlcnR5IHZpZXdUeXBlXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBzZWxmLnNldFZpZXdUeXBlID0gZnVuY3Rpb24gKCB0aGVWaWV3VHlwZSApIHtcbiAgICBzZWxmLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggXCJ1aS1cIiArIHNlbGYuX3ZpZXdUeXBlICsgXCItdmlld1wiICk7XG4gICAgc2VsZi5fdmlld1R5cGUgPSB0aGVWaWV3VHlwZTtcbiAgICBzZWxmLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCggXCJ1aS1cIiArIHRoZVZpZXdUeXBlICsgXCItdmlld1wiICk7XG4gICAgc2VsZi5sZWZ0Vmlld1N0YXR1cyA9IFwiaW52aXNpYmxlXCI7XG4gIH07XG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwidmlld1R5cGVcIiwge1xuICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgd3JpdGU6ICAgdHJ1ZSxcbiAgICBkZWZhdWx0OiBcInNwbGl0XCJcbiAgfSApO1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBsZWZ0IHZpZXcgaXMgYHZpc2libGVgIG9yIGBpbnZpc2libGVgLlxuICAgKlxuICAgKiBAcHJvcGVydHkgbGVmdFZpZXdTdGF0dXNcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHNlbGYuc2V0TGVmdFZpZXdTdGF0dXMgPSBmdW5jdGlvbiAoIHZpZXdTdGF0dXMgKSB7XG4gICAgc2VsZi5fcHJldmVudENsaWNrcy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIHNlbGYuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCBcInVpLWxlZnQtc2lkZS1cIiArIHNlbGYuX2xlZnRWaWV3U3RhdHVzICk7XG4gICAgc2VsZi5fbGVmdFZpZXdTdGF0dXMgPSB2aWV3U3RhdHVzO1xuICAgIHNlbGYuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCBcInVpLWxlZnQtc2lkZS1cIiArIHZpZXdTdGF0dXMgKTtcbiAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9wcmV2ZW50Q2xpY2tzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9LCA2MDAgKTtcbiAgfTtcbiAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJsZWZ0Vmlld1N0YXR1c1wiLCB7XG4gICAgcmVhZDogICAgdHJ1ZSxcbiAgICB3cml0ZTogICB0cnVlLFxuICAgIGRlZmF1bHQ6IFwiaW52aXNpYmxlXCJcbiAgfSApO1xuICAvKipcbiAgICogVG9nZ2xlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBsZWZ0IHNpZGUgdmlld1xuICAgKiBAbWV0aG9kIHRvZ2dsZUxlZnRWaWV3XG4gICAqL1xuICBzZWxmLnRvZ2dsZUxlZnRWaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICggc2VsZi5sZWZ0Vmlld1N0YXR1cyA9PT0gXCJ2aXNpYmxlXCIgKSB7XG4gICAgICBzZWxmLmxlZnRWaWV3U3RhdHVzID0gXCJpbnZpc2libGVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5sZWZ0Vmlld1N0YXR1cyA9IFwidmlzaWJsZVwiO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFRoZSBhcnJheSBvZiB2aWV3cyB0aGF0IHRoaXMgc3BsaXQgdmlldyBjb250cm9sbGVyIG1hbmFnZXMuXG4gICAqIEBwcm9wZXJ0eSBzdWJ2aWV3c1xuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInN1YnZpZXdzXCIsIHtcbiAgICByZWFkOiAgICB0cnVlLFxuICAgIHdyaXRlOiAgIGZhbHNlLFxuICAgIGRlZmF1bHQ6IFtudWxsLCBudWxsXVxuICB9ICk7XG4gIC8vIGludGVybmFsIGVsZW1lbnRzXG4gIHNlbGYuX2xlZnRFbGVtZW50ID0gbnVsbDtcbiAgc2VsZi5fcmlnaHRFbGVtZW50ID0gbnVsbDtcbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgbGVmdCBhbmQgcmlnaHQgZWxlbWVudHNcbiAgICogQG1ldGhvZCBfY3JlYXRlRWxlbWVudHNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2NyZWF0ZUVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICggc2VsZi5fbGVmdEVsZW1lbnQgIT09IG51bGwgKSB7XG4gICAgICBzZWxmLmVsZW1lbnQucmVtb3ZlQ2hpbGQoIHNlbGYuX2xlZnRFbGVtZW50ICk7XG4gICAgfVxuICAgIGlmICggc2VsZi5fcmlnaHRFbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgc2VsZi5lbGVtZW50LnJlbW92ZUNoaWxkKCBzZWxmLl9yaWdodEVsZW1lbnQgKTtcbiAgICB9XG4gICAgc2VsZi5fbGVmdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG4gICAgc2VsZi5fcmlnaHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuICAgIHNlbGYuX2xlZnRFbGVtZW50LmNsYXNzTmFtZSA9IFwidWktY29udGFpbmVyIGxlZnQtc2lkZVwiO1xuICAgIHNlbGYuX3JpZ2h0RWxlbWVudC5jbGFzc05hbWUgPSBcInVpLWNvbnRhaW5lciByaWdodC1zaWRlXCI7XG4gICAgc2VsZi5lbGVtZW50LmFwcGVuZENoaWxkKCBzZWxmLl9sZWZ0RWxlbWVudCApO1xuICAgIHNlbGYuZWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fcmlnaHRFbGVtZW50ICk7XG4gIH07XG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIGxlZnQgYW5kIHJpZ2h0IGVsZW1lbnRzIGlmIG5lY2Vzc2FyeVxuICAgKiBAbWV0aG9kIF9jcmVhdGVFbGVtZW50c0lmTmVjZXNzYXJ5XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZWxmLl9jcmVhdGVFbGVtZW50c0lmTmVjZXNzYXJ5ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICggc2VsZi5fbGVmdEVsZW1lbnQgIT09IG51bGwgJiYgc2VsZi5fcmlnaHRFbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLl9jcmVhdGVFbGVtZW50cygpO1xuICB9O1xuICAvKipcbiAgICogQXNzaWducyBhIHZpZXcgdG8gYSBnaXZlbiBzaWRlXG4gICAqIEBtZXRob2QgX2Fzc2lnblZpZXdUb1NpZGVcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSB3aGljaEVsZW1lbnRcbiAgICogQHBhcmFtIHtWaWV3Q29udGFpbmVyfSBhVmlld1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VsZi5fYXNzaWduVmlld1RvU2lkZSA9IGZ1bmN0aW9uICggd2hpY2hFbGVtZW50LCBhVmlldyApIHtcbiAgICBzZWxmLl9jcmVhdGVFbGVtZW50c0lmTmVjZXNzYXJ5KCk7XG4gICAgYVZpZXcuc3BsaXRWaWV3Q29udHJvbGxlciA9IHNlbGY7XG4gICAgYVZpZXcubm90aWZ5KCBcInZpZXdXYXNQdXNoZWRcIiApOyAvLyBub3RpZnkgdGhlIHZpZXcgaXQgd2FzIFwicHVzaGVkXCJcbiAgICBhVmlldy5ub3RpZnkoIFwidmlld1dpbGxBcHBlYXJcIiApOyAvLyBub3RpZnkgdGhlIHZpZXcgaXQgd2lsbCBhcHBlYXJcbiAgICBhVmlldy5wYXJlbnRFbGVtZW50ID0gd2hpY2hFbGVtZW50OyAvLyBhbmQgbWFrZSB1cyB0aGUgcGFyZW50XG4gICAgYVZpZXcubm90aWZ5KCBcInZpZXdEaWRBcHBlYXJcIiApOyAvLyBhbmQgbm90aWZ5IGl0IHRoYXQgaXQncyBhY3R1YWxseSB0aGVyZS5cbiAgfTtcbiAgLyoqXG4gICAqIFVucGFyZW50cyBhIHZpZXcgb24gYSBnaXZlbiBzaWRlLCBzZW5kaW5nIGFsbCB0aGUgcmVxdWlzaXRlIG5vdGlmaWNhdGlvbnNcbiAgICpcbiAgICogQG1ldGhvZCBfdW5wYXJlbnRTaWRlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaWRlSW5kZXhcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX3VucGFyZW50U2lkZSA9IGZ1bmN0aW9uICggc2lkZUluZGV4ICkge1xuICAgIGlmICggc2VsZi5fc3Vidmlld3MubGVuZ3RoID49IHNpZGVJbmRleCApIHtcbiAgICAgIHZhciBhVmlldyA9IHNlbGYuX3N1YnZpZXdzW3NpZGVJbmRleF07XG4gICAgICBpZiAoIGFWaWV3ICE9PSBudWxsICkge1xuICAgICAgICBhVmlldy5ub3RpZnkoIFwidmlld1dpbGxEaXNhcHBlYXJcIiApOyAvLyBub3RpZnkgdGhlIHZpZXcgdGhhdCBpdCBpcyBnb2luZyB0byBkaXNhcHBlYXJcbiAgICAgICAgYVZpZXcucGFyZW50RWxlbWVudCA9IG51bGw7IC8vIHJlbW92ZSB0aGUgdmlld1xuICAgICAgICBhVmlldy5ub3RpZnkoIFwidmlld0RpZERpc2FwcGVhclwiICk7IC8vIG5vdGlmeSB0aGUgdmlldyB0aGF0IGl0IGRpZCBkaXNhcHBlYXJcbiAgICAgICAgYVZpZXcubm90aWZ5KCBcInZpZXdXYXNQb3BwZWRcIiApOyAvLyBub3RpZnkgdGhlIHZpZXcgdGhhdCBpdCB3YXMgXCJwb3BwZWRcIlxuICAgICAgICBkZWxldGUgYVZpZXcuc3BsaXRWaWV3Q29udHJvbGxlcjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBBbGxvd3MgYWNjZXNzIHRvIHRoZSBsZWZ0IHZpZXdcbiAgICogQHByb3BlcnR5IGxlZnRWaWV3XG4gICAqIEB0eXBlIHtWaWV3Q29udGFpbmVyfVxuICAgKi9cbiAgc2VsZi5nZXRMZWZ0VmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHNlbGYuX3N1YnZpZXdzLmxlbmd0aCA+IDAgKSB7XG4gICAgICByZXR1cm4gc2VsZi5fc3Vidmlld3NbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcbiAgc2VsZi5zZXRMZWZ0VmlldyA9IGZ1bmN0aW9uICggYVZpZXcgKSB7XG4gICAgc2VsZi5fdW5wYXJlbnRTaWRlKCAwICk7IC8vIHNlbmQgZGlzYXBwZWFyIG5vdGljZXNcbiAgICBpZiAoIHNlbGYuX3N1YnZpZXdzLmxlbmd0aCA+IDAgKSB7XG4gICAgICBzZWxmLl9zdWJ2aWV3c1swXSA9IGFWaWV3O1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLl9zdWJ2aWV3cy5wdXNoKCBhVmlldyApO1xuICAgIH1cbiAgICBzZWxmLl9hc3NpZ25WaWV3VG9TaWRlKCBzZWxmLl9sZWZ0RWxlbWVudCwgYVZpZXcgKTtcbiAgICBzZWxmLm5vdGlmeSggXCJ2aWV3c0NoYW5nZWRcIiApO1xuICB9O1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcImxlZnRWaWV3XCIsIHtcbiAgICByZWFkOiAgICAgICAgICAgIHRydWUsXG4gICAgd3JpdGU6ICAgICAgICAgICB0cnVlLFxuICAgIGJhY2tpbmdWYXJpYWJsZTogZmFsc2VcbiAgfSApO1xuICAvKipcbiAgICogQWxsb3dzIGFjY2VzcyB0byB0aGUgcmlnaHQgdmlld1xuICAgKiBAcHJvcGVydHkgcmlnaHRWaWV3XG4gICAqIEB0eXBlIHtWaWV3Q29udGFpbmVyfVxuICAgKi9cbiAgc2VsZi5nZXRSaWdodFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCBzZWxmLl9zdWJ2aWV3cy5sZW5ndGggPiAxICkge1xuICAgICAgcmV0dXJuIHNlbGYuX3N1YnZpZXdzWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG4gIHNlbGYuc2V0UmlnaHRWaWV3ID0gZnVuY3Rpb24gKCBhVmlldyApIHtcbiAgICBzZWxmLl91bnBhcmVudFNpZGUoIDEgKTsgLy8gc2VuZCBkaXNhcHBlYXIgbm90aWNlcyBmb3IgcmlnaHQgc2lkZVxuICAgIGlmICggc2VsZi5fc3Vidmlld3MubGVuZ3RoID4gMSApIHtcbiAgICAgIHNlbGYuX3N1YnZpZXdzWzFdID0gYVZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGYuX3N1YnZpZXdzLnB1c2goIGFWaWV3ICk7XG4gICAgfVxuICAgIHNlbGYuX2Fzc2lnblZpZXdUb1NpZGUoIHNlbGYuX3JpZ2h0RWxlbWVudCwgYVZpZXcgKTtcbiAgICBzZWxmLm5vdGlmeSggXCJ2aWV3c0NoYW5nZWRcIiApO1xuICB9O1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInJpZ2h0Vmlld1wiLCB7XG4gICAgcmVhZDogICAgICAgICAgICB0cnVlLFxuICAgIHdyaXRlOiAgICAgICAgICAgdHJ1ZSxcbiAgICBiYWNraW5nVmFyaWFibGU6IGZhbHNlXG4gIH0gKTtcbiAgLyoqXG4gICAqIEBtZXRob2QgcmVuZGVyXG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBcIlwiOyAvLyBub3RoaW5nIHRvIHJlbmRlciFcbiAgfSApO1xuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgbGVmdCBhbmQgcmlnaHQgZWxlbWVudHMgaWYgbmVjZXNzYXJ5XG4gICAqIEBtZXRob2QgcmVuZGVyVG9FbGVtZW50XG4gICAqL1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiByZW5kZXJUb0VsZW1lbnQoKSB7XG4gICAgc2VsZi5fY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeSgpO1xuICAgIHNlbGYuX2NyZWF0ZUNsaWNrUHJldmVudGlvbkVsZW1lbnRJZk5vdENyZWF0ZWQoKTtcbiAgICByZXR1cm47IC8vIG5vdGhpbmcgdG8gZG8uXG4gIH0gKTtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIHNwbGl0IHZpZXcgY29udHJvbGxlclxuICAgKiBAbWV0aG9kIGluaXRcbiAgICogQHBhcmFtIHtWaWV3Q29udGFpbmVyfSB0aGVMZWZ0Vmlld1xuICAgKiBAcGFyYW0ge1ZpZXdDb250YWluZXJ9IHRoZVJpZ2h0Vmlld1xuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RoZUVsZW1lbnRJZF1cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0aGVFbGVtZW50Q2xhc3NdXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdGhlRWxlbWVudFRhZ11cbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBbdGhlUGFyZW50RWxlbWVudF1cbiAgICovXG4gIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGluaXQoIHRoZUxlZnRWaWV3LCB0aGVSaWdodFZpZXcsIHRoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50ICkge1xuICAgIGlmICggdHlwZW9mIHRoZUxlZnRWaWV3ID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIkNhbid0IGluaXRpYWxpemUgYSBuYXZpZ2F0aW9uIGNvbnRyb2xsZXIgd2l0aG91dCBhIGxlZnQgdmlldy5cIiApO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiB0aGVSaWdodFZpZXcgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiQ2FuJ3QgaW5pdGlhbGl6ZSBhIG5hdmlnYXRpb24gY29udHJvbGxlciB3aXRob3V0IGEgcmlnaHQgdmlldy5cIiApO1xuICAgIH1cbiAgICAvLyBkbyB3aGF0IGEgbm9ybWFsIHZpZXcgY29udGFpbmVyIGRvZXNcbiAgICBzZWxmLiRzdXBlciggdGhlRWxlbWVudElkLCB0aGVFbGVtZW50VGFnLCB0aGVFbGVtZW50Q2xhc3MsIHRoZVBhcmVudEVsZW1lbnQgKTtcbi8vICAgIHNlbGYuc3VwZXIoIF9jbGFzc05hbWUsIFwiaW5pdFwiLCBbdGhlRWxlbWVudElkLCB0aGVFbGVtZW50VGFnLCB0aGVFbGVtZW50Q2xhc3MsIHRoZVBhcmVudEVsZW1lbnQgXSApO1xuICAgIC8vIG5vdyBhZGQgdGhlIGxlZnQgYW5kIHJpZ2h0IHZpZXdzXG4gICAgc2VsZi5sZWZ0VmlldyA9IHRoZUxlZnRWaWV3O1xuICAgIHNlbGYucmlnaHRWaWV3ID0gdGhlUmlnaHRWaWV3O1xuICAgIHJldHVybiBzZWxmO1xuICB9ICk7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzcGxpdCB2aWV3IGNvbnRyb2xsZXJcbiAgICogQG1ldGhvZCBpbml0V2l0aE9wdGlvbnNcbiAgICovXG4gIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGluaXRXaXRoT3B0aW9ucyggb3B0aW9ucyApIHtcbiAgICB2YXIgdGhlTGVmdFZpZXcsIHRoZVJpZ2h0VmlldywgdGhlRWxlbWVudElkLCB0aGVFbGVtZW50VGFnLCB0aGVFbGVtZW50Q2xhc3MsXG4gICAgICB0aGVQYXJlbnRFbGVtZW50O1xuICAgIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmlkICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aGVFbGVtZW50SWQgPSBvcHRpb25zLmlkO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50YWcgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZUVsZW1lbnRUYWcgPSBvcHRpb25zLnRhZztcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMuY2xhc3MgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZUVsZW1lbnRDbGFzcyA9IG9wdGlvbnMuY2xhc3M7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgdGhlUGFyZW50RWxlbWVudCA9IG9wdGlvbnMucGFyZW50O1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5sZWZ0VmlldyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgdGhlTGVmdFZpZXcgPSBvcHRpb25zLmxlZnRWaWV3O1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5yaWdodFZpZXcgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZVJpZ2h0VmlldyA9IG9wdGlvbnMucmlnaHRWaWV3O1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLmluaXQoIHRoZUxlZnRWaWV3LCB0aGVSaWdodFZpZXcsIHRoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50ICk7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMudmlld1R5cGUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHNlbGYudmlld1R5cGUgPSBvcHRpb25zLnZpZXdUeXBlO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5sZWZ0Vmlld1N0YXR1cyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgc2VsZi5sZWZ0Vmlld1N0YXR1cyA9IG9wdGlvbnMubGVmdFZpZXdTdGF0dXM7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWxmO1xuICB9ICk7XG4gIC8qKlxuICAgKiBEZXN0cm95IG91ciBlbGVtZW50cyBhbmQgY2xlYW4gdXBcbiAgICpcbiAgICogQG1ldGhvZCBkZXN0cm95XG4gICAqL1xuICBzZWxmLm92ZXJyaWRlKCBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHNlbGYuX3VucGFyZW50U2lkZSggMCApO1xuICAgIHNlbGYuX3VucGFyZW50U2lkZSggMSApO1xuICAgIGlmICggc2VsZi5fbGVmdEVsZW1lbnQgIT09IG51bGwgKSB7XG4gICAgICBzZWxmLmVsZW1lbnQucmVtb3ZlQ2hpbGQoIHNlbGYuX2xlZnRFbGVtZW50ICk7XG4gICAgfVxuICAgIGlmICggc2VsZi5fcmlnaHRFbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgc2VsZi5lbGVtZW50LnJlbW92ZUNoaWxkKCBzZWxmLl9yaWdodEVsZW1lbnQgKTtcbiAgICB9XG4gICAgc2VsZi5fbGVmdEVsZW1lbnQgPSBudWxsO1xuICAgIHNlbGYuX3JpZ2h0RWxlbWVudCA9IG51bGw7XG4gICAgc2VsZi4kc3VwZXIoKTtcbiAgICAvL3NlbGYuc3VwZXIoIF9jbGFzc05hbWUsIFwiZGVzdHJveVwiICk7XG4gIH0gKTtcbiAgLy8gYXV0byBpbml0aWFsaXplXG4gIHNlbGYuX2F1dG9Jbml0LmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcbiAgcmV0dXJuIHNlbGY7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBTcGxpdFZpZXdDb250cm9sbGVyO1xuIiwiLyoqXG4gKlxuICogVGFiIFZpZXcgQ29udHJvbGxlcnMgcHJvdmlkZSBiYXNpYyBzdXBwb3J0IGZvciB0YWJiZWQgdmlld3NcbiAqXG4gKiBAbW9kdWxlIHRhYlZpZXdDb250cm9sbGVyLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC40XG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxMyBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgbW9kdWxlKi9cblwidXNlIHN0cmljdFwiO1xudmFyIFVJID0gcmVxdWlyZSggXCIuL2NvcmVcIiApLFxuICBWaWV3Q29udGFpbmVyID0gcmVxdWlyZSggXCIuL3ZpZXdDb250YWluZXJcIiApLFxuICBldmVudCA9IHJlcXVpcmUoIFwiLi9ldmVudFwiICk7XG52YXIgX2NsYXNzTmFtZSA9IFwiVGFiVmlld0NvbnRyb2xsZXJcIjtcbnZhciBUYWJWaWV3Q29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSBuZXcgVmlld0NvbnRhaW5lcigpO1xuICBzZWxmLnN1YmNsYXNzKCBfY2xhc3NOYW1lICk7XG4gIC8vICMgTm90aWZpY2F0aW9uc1xuICAvL1xuICAvLyAqIGB2aWV3c0NoYW5nZWRgIC0gRmlyZWQgd2hlbiB0aGUgdmlld3MgY2hhbmdlXG4gIHNlbGYucmVnaXN0ZXJOb3RpZmljYXRpb24oIFwidmlld3NDaGFuZ2VkXCIgKTtcbiAgLy8gaW50ZXJuYWwgZWxlbWVudHNcbiAgc2VsZi5fdGFiRWxlbWVudHMgPSBbXTsgLy8gZWFjaCB0YWIgb24gdGhlIHRhYiBiYXJcbiAgc2VsZi5fdGFiQmFyRWxlbWVudCA9IG51bGw7IC8vIGNvbnRhaW5zIG91ciBiYXIgYnV0dG9uIGdyb3VwXG4gIHNlbGYuX2JhckJ1dHRvbkdyb3VwID0gbnVsbDsgLy8gY29udGFpbnMgYWxsIG91ciB0YWJzXG4gIHNlbGYuX3ZpZXdDb250YWluZXIgPSBudWxsOyAvLyBjb250YWlucyBhbGwgb3VyIHN1YnZpZXdzXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIHRhYiBiYXIgZWxlbWVudFxuICAgKiBAbWV0aG9kIF9jcmVhdGVUYWJCYXJFbGVtZW50XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZWxmLl9jcmVhdGVUYWJCYXJFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX3RhYkJhckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG4gICAgc2VsZi5fdGFiQmFyRWxlbWVudC5jbGFzc05hbWUgPSBcInVpLXRhYi1iYXIgdWktdGFiLWRlZmF1bHQtcG9zaXRpb25cIjtcbiAgICBzZWxmLl9iYXJCdXR0b25Hcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcbiAgICBzZWxmLl9iYXJCdXR0b25Hcm91cC5jbGFzc05hbWUgPSBcInVpLWJhci1idXR0b24tZ3JvdXAgdWktYWxpZ24tY2VudGVyXCI7XG4gICAgc2VsZi5fdGFiQmFyRWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fYmFyQnV0dG9uR3JvdXAgKTtcbiAgfTtcbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgdGFiIGJhciBlbGVtZW50IGlmIG5lY2Vzc2FyeVxuICAgKiBAbWV0aG9kIF9jcmVhdGVUYWJCYXJFbGVtZW50SWZOZWNlc3NhcnlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2NyZWF0ZVRhYkJhckVsZW1lbnRJZk5lY2Vzc2FyeSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHNlbGYuX3RhYkJhckVsZW1lbnQgPT09IG51bGwgKSB7XG4gICAgICBzZWxmLl9jcmVhdGVUYWJCYXJFbGVtZW50KCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogY3JlYXRlIHRoZSB2aWV3IGNvbnRhaW5lciB0aGF0IHdpbGwgaG9sZCBhbGwgdGhlIHZpZXdzIHRoaXMgdGFiIGJhciBvd25zXG4gICAqIEBtZXRob2QgX2NyZWF0ZVZpZXdDb250YWluZXJcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2NyZWF0ZVZpZXdDb250YWluZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fdmlld0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcbiAgICBzZWxmLl92aWV3Q29udGFpbmVyLmNsYXNzTmFtZSA9IFwidWktY29udGFpbmVyIHVpLWF2b2lkLXRhYi1iYXIgdWktdGFiLWRlZmF1bHQtcG9zaXRpb25cIjtcbiAgfTtcbiAgLyoqXG4gICAqIEBtZXRob2QgX2NyZWF0ZVZpZXdDb250YWluZXJJZk5lY2Vzc2FyeVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VsZi5fY3JlYXRlVmlld0NvbnRhaW5lcklmTmVjZXNzYXJ5ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICggc2VsZi5fdmlld0NvbnRhaW5lciA9PT0gbnVsbCApIHtcbiAgICAgIHNlbGYuX2NyZWF0ZVZpZXdDb250YWluZXIoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBDcmVhdGUgYWxsIHRoZSBlbGVtZW50cyBhbmQgdGhlIERPTSBzdHJ1Y3R1cmVcbiAgICogQG1ldGhvZCBfY3JlYXRlRWxlbWVudHNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2NyZWF0ZUVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX2NyZWF0ZVRhYkJhckVsZW1lbnRJZk5lY2Vzc2FyeSgpO1xuICAgIHNlbGYuX2NyZWF0ZVZpZXdDb250YWluZXJJZk5lY2Vzc2FyeSgpO1xuICAgIHNlbGYuZWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fdGFiQmFyRWxlbWVudCApO1xuICAgIHNlbGYuZWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fdmlld0NvbnRhaW5lciApO1xuICB9O1xuICAvKipcbiAgICogQG1ldGhvZCBfY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2VsZi5fY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHNlbGYuX3RhYkJhckVsZW1lbnQgIT09IG51bGwgfHwgc2VsZi5fdmlld0NvbnRhaW5lciAhPT0gbnVsbCApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2VsZi5fY3JlYXRlRWxlbWVudHMoKTtcbiAgfTtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIHRhYiBlbGVtZW50IGFuZCBhdHRhY2ggdGhlIGFwcHJvcHJpYXRlIGV2ZW50IGxpc3RlbmVyXG4gICAqIEBtZXRob2QgX2NyZWF0ZVRhYkVsZW1lbnRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNlbGYuX2NyZWF0ZVRhYkVsZW1lbnQgPSBmdW5jdGlvbiAoIGFWaWV3LCBpZHggKSB7XG4gICAgdmFyIGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG4gICAgZS5jbGFzc05hbWUgPSBcInVpLWJhci1idXR0b24gdWktdGludC1jb2xvclwiO1xuICAgIGUuaW5uZXJIVE1MID0gYVZpZXcudGl0bGU7XG4gICAgZS5zZXRBdHRyaWJ1dGUoIFwiZGF0YS10YWdcIiwgaWR4IClcbiAgICBldmVudC5hZGRMaXN0ZW5lciggZSwgXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuc2VsZWN0ZWRUYWIgPSBwYXJzZUludCggdGhpcy5nZXRBdHRyaWJ1dGUoIFwiZGF0YS10YWdcIiApLCAxMCApO1xuICAgIH0gKTtcbiAgICByZXR1cm4gZTtcbiAgfTtcbiAgLyoqXG4gICAqIFRoZSBwb3NpdGlvbiBvZiB0aGUgdGhlIHRhYiBiYXJcbiAgICogVmFsaWQgb3B0aW9ucyBpbmNsdWRlOiBgZGVmYXVsdGAsIGB0b3BgLCBhbmQgYGJvdHRvbWBcbiAgICogQHByb3BlcnR5IGJhclBvc2l0aW9uXG4gICAqIEB0eXBlIHtUYWJWaWV3Q29udHJvbGxlci5CQVJcXF9QT1NJVElPTn1cbiAgICovXG4gIHNlbGYuc2V0T2JzZXJ2YWJsZUJhclBvc2l0aW9uID0gZnVuY3Rpb24gKCBuZXdQb3NpdGlvbiwgb2xkUG9zaXRpb24gKSB7XG4gICAgc2VsZi5fY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeSgpO1xuICAgIHNlbGYuX3RhYkJhckVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggXCJ1aS10YWItXCIgKyBvbGRQb3NpdGlvbiArIFwiLXBvc2l0aW9uXCIgKTtcbiAgICBzZWxmLl90YWJCYXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoIFwidWktdGFiLVwiICsgbmV3UG9zaXRpb24gKyBcIi1wb3NpdGlvblwiICk7XG4gICAgc2VsZi5fdmlld0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCBcInVpLXRhYi1cIiArIG9sZFBvc2l0aW9uICsgXCItcG9zaXRpb25cIiApO1xuICAgIHNlbGYuX3ZpZXdDb250YWluZXIuY2xhc3NMaXN0LmFkZCggXCJ1aS10YWItXCIgKyBuZXdQb3NpdGlvbiArIFwiLXBvc2l0aW9uXCIgKTtcbiAgICByZXR1cm4gbmV3UG9zaXRpb247XG4gIH07XG4gIHNlbGYuZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnR5KCBcImJhclBvc2l0aW9uXCIsIHtcbiAgICBkZWZhdWx0OiBcImRlZmF1bHRcIlxuICB9ICk7XG4gIC8qKlxuICAgKiBUaGUgYWxpZ25tZW50IG9mIHRoZSBiYXIgaXRlbXNcbiAgICogVmFsaWQgb3B0aW9ucyBhcmU6IGBsZWZ0YCwgYGNlbnRlcmAsIGByaWdodGBcbiAgICogQHByb3BlcnR5IGJhckFsaWdubWVudFxuICAgKiBAdHlwZSB7VGFiVmlld0NvbnRyb2xsZXIuQkFSXFxfQUxJR05NRU5UfVxuICAgKi9cbiAgc2VsZi5zZXRPYnNlcnZhYmxlQmFyQWxpZ25tZW50ID0gZnVuY3Rpb24gKCBuZXdBbGlnbm1lbnQsIG9sZEFsaWdubWVudCApIHtcbiAgICBzZWxmLl9jcmVhdGVFbGVtZW50c0lmTmVjZXNzYXJ5KCk7XG4gICAgc2VsZi5fYmFyQnV0dG9uR3JvdXAuY2xhc3NMaXN0LnJlbW92ZSggXCJ1aS1hbGlnbi1cIiArIG9sZEFsaWdubWVudCApO1xuICAgIHNlbGYuX2JhckJ1dHRvbkdyb3VwLmNsYXNzTGlzdC5hZGQoIFwidWktYWxpZ24tXCIgKyBuZXdBbGlnbm1lbnQgKTtcbiAgICByZXR1cm4gbmV3QWxpZ25tZW50O1xuICB9O1xuICBzZWxmLmRlZmluZU9ic2VydmFibGVQcm9wZXJ0eSggXCJiYXJBbGlnbm1lbnRcIiwge1xuICAgIGRlZmF1bHQ6IFwiY2VudGVyXCJcbiAgfSApO1xuICAvKipcbiAgICogVGhlIGFycmF5IG9mIHZpZXdzIHRoYXQgdGhpcyB0YWIgdmlldyBjb250cm9sbGVyIG1hbmFnZXMuXG4gICAqIEBwcm9wZXJ0eSBzdWJ2aWV3c1xuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBzZWxmLmRlZmluZVByb3BlcnR5KCBcInN1YnZpZXdzXCIsIHtcbiAgICByZWFkOiAgICB0cnVlLFxuICAgIHdyaXRlOiAgIGZhbHNlLFxuICAgIGRlZmF1bHQ6IFtdXG4gIH0gKTtcbiAgLyoqXG4gICAqIEFkZCBhIHN1YnZpZXcgdG8gdGhlIHRhYiBiYXIuXG4gICAqIEBtZXRob2QgYWRkU3Vidmlld1xuICAgKiBAcHJvcGVydHkge1ZpZXdDb250YWluZXJ9IHZpZXdcbiAgICovXG4gIHNlbGYuYWRkU3VidmlldyA9IGZ1bmN0aW9uICggdmlldyApIHtcbiAgICBzZWxmLl9jcmVhdGVFbGVtZW50c0lmTmVjZXNzYXJ5KCk7XG4gICAgdmFyIGUgPSBzZWxmLl9jcmVhdGVUYWJFbGVtZW50KCB2aWV3LCBzZWxmLl90YWJFbGVtZW50cy5sZW5ndGggKTtcbiAgICBzZWxmLl9iYXJCdXR0b25Hcm91cC5hcHBlbmRDaGlsZCggZSApO1xuICAgIHNlbGYuX3RhYkVsZW1lbnRzLnB1c2goIGUgKTtcbiAgICBzZWxmLl9zdWJ2aWV3cy5wdXNoKCB2aWV3ICk7XG4gICAgdmlldy50YWJWaWV3Q29udHJvbGxlciA9IHNlbGY7XG4gICAgdmlldy5ub3RpZnkoIFwidmlld1dhc1B1c2hlZFwiICk7XG4gIH07XG4gIC8qKlxuICAgKiBSZW1vdmUgYSBzcGVjaWZpYyB2aWV3IGZyb20gdGhlIHRhYiBiYXIuXG4gICAqIEBtZXRob2QgcmVtb3ZlU3Vidmlld1xuICAgKiBAcHJvcGVydHkge1ZpZXdDb250YWluZXJ9IHZpZXdcbiAgICovXG4gIHNlbGYucmVtb3ZlU3VidmlldyA9IGZ1bmN0aW9uICggdmlldyApIHtcbiAgICBzZWxmLl9jcmVhdGVFbGVtZW50c0lmTmVjZXNzYXJ5KCk7XG4gICAgdmFyIGkgPSBzZWxmLl9zdWJ2aWV3cy5pbmRleE9mKCB2aWV3ICk7XG4gICAgaWYgKCBpID4gLTEgKSB7XG4gICAgICB2YXIgaGlkaW5nVmlldyA9IHNlbGYuX3N1YnZpZXdzW2ldO1xuICAgICAgdmFyIGhpZGluZ1ZpZXdQYXJlbnQgPSBoaWRpbmdWaWV3LnBhcmVudEVsZW1lbnQ7XG4gICAgICBpZiAoIGhpZGluZ1ZpZXdQYXJlbnQgIT09IG51bGwgKSB7XG4gICAgICAgIGhpZGluZ1ZpZXcubm90aWZ5KCBcInZpZXdXaWxsRGlzYXBwZWFyXCIgKTtcbiAgICAgIH1cbiAgICAgIGhpZGluZ1ZpZXcucGFyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICBpZiAoIGhpZGluZ1ZpZXdQYXJlbnQgIT09IG51bGwgKSB7XG4gICAgICAgIGhpZGluZ1ZpZXcubm90aWZ5KCBcInZpZXdEaWREaXNhcHBlYXJcIiApO1xuICAgICAgfVxuICAgICAgc2VsZi5fc3Vidmlld3Muc3BsaWNlKCBpLCAxICk7XG4gICAgICBzZWxmLl9iYXJCdXR0b25Hcm91cC5yZW1vdmVDaGlsZCggc2VsZi5fdGFiRWxlbWVudHNbaV0gKTtcbiAgICAgIHNlbGYuX3RhYkVsZW1lbnRzLnNwbGljZSggaSwgMSApO1xuICAgICAgdmFyIGN1clNlbGVjdGVkVGFiID0gc2VsZi5zZWxlY3RlZFRhYjtcbiAgICAgIGlmICggY3VyU2VsZWN0ZWRUYWIgPiBpICkge1xuICAgICAgICBjdXJTZWxlY3RlZFRhYi0tO1xuICAgICAgfVxuICAgICAgaWYgKCBjdXJTZWxlY3RlZFRhYiA+IHNlbGYuX3RhYkVsZW1lbnRzLmxlbmd0aCApIHtcbiAgICAgICAgY3VyU2VsZWN0ZWRUYWIgPSBzZWxmLl90YWJFbGVtZW50cy5sZW5ndGg7XG4gICAgICB9XG4gICAgICBzZWxmLnNlbGVjdGVkVGFiID0gY3VyU2VsZWN0ZWRUYWI7XG4gICAgfVxuICAgIHZpZXcubm90aWZ5KCBcInZpZXdXYXNQb3BwZWRcIiApO1xuICAgIGRlbGV0ZSB2aWV3LnRhYlZpZXdDb250cm9sbGVyO1xuICB9O1xuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGljaCB0YWIgaXMgc2VsZWN0ZWQ7IGNoYW5naW5nIHdpbGwgZGlzcGxheSB0aGUgYXBwcm9wcmlhdGVcbiAgICogdGFiLlxuICAgKlxuICAgKiBAcHJvcGVydHkgc2VsZWN0ZWRUYWJcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHNlbGYuc2V0T2JzZXJ2YWJsZVNlbGVjdGVkVGFiID0gZnVuY3Rpb24gKCBuZXdJbmRleCwgb2xkSW5kZXggKSB7XG4gICAgdmFyIG9sZFZpZXcsIG5ld1ZpZXc7XG4gICAgc2VsZi5fY3JlYXRlRWxlbWVudHNJZk5lY2Vzc2FyeSgpO1xuICAgIGlmICggb2xkSW5kZXggPiAtMSApIHtcbiAgICAgIG9sZFZpZXcgPSBzZWxmLl9zdWJ2aWV3c1tvbGRJbmRleF07XG4gICAgICBpZiAoIG5ld0luZGV4ID4gLTEgKSB7XG4gICAgICAgIG5ld1ZpZXcgPSBzZWxmLl9zdWJ2aWV3c1tuZXdJbmRleF07XG4gICAgICB9XG4gICAgICBvbGRWaWV3Lm5vdGlmeSggXCJ2aWV3V2lsbERpc2FwcGVhclwiICk7XG4gICAgICBpZiAoIG5ld0luZGV4ID4gLTEgKSB7XG4gICAgICAgIG5ld1ZpZXcubm90aWZ5KCBcInZpZXdXaWxsQXBwZWFyXCIgKTtcbiAgICAgIH1cbiAgICAgIG9sZFZpZXcucGFyZW50RWxlbWVudCA9IG51bGw7XG4gICAgICBpZiAoIG5ld0luZGV4ID4gLTEgKSB7XG4gICAgICAgIHNlbGYuX3N1YnZpZXdzW25ld0luZGV4XS5wYXJlbnRFbGVtZW50ID0gc2VsZi5fdmlld0NvbnRhaW5lcjtcbiAgICAgIH1cbiAgICAgIG9sZFZpZXcubm90aWZ5KCBcInZpZXdEaWREaXNhcHBlYXJcIiApO1xuICAgICAgaWYgKCBuZXdJbmRleCA+IC0xICkge1xuICAgICAgICBuZXdWaWV3Lm5vdGlmeSggXCJ2aWV3RGlkQXBwZWFyXCIgKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3VmlldyA9IHNlbGYuX3N1YnZpZXdzW25ld0luZGV4XTtcbiAgICAgIG5ld1ZpZXcubm90aWZ5KCBcInZpZXdXaWxsQXBwZWFyXCIgKTtcbiAgICAgIHNlbGYuX3N1YnZpZXdzW25ld0luZGV4XS5wYXJlbnRFbGVtZW50ID0gc2VsZi5fdmlld0NvbnRhaW5lcjtcbiAgICAgIG5ld1ZpZXcubm90aWZ5KCBcInZpZXdEaWRBcHBlYXJcIiApO1xuICAgIH1cbiAgICByZXR1cm4gbmV3SW5kZXg7XG4gIH07XG4gIHNlbGYuZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnR5KCBcInNlbGVjdGVkVGFiXCIsIHtcbiAgICBkZWZhdWx0OiAgICAgIC0xLFxuICAgIG5vdGlmeUFsd2F5czogdHJ1ZVxuICB9ICk7XG4gIC8qKlxuICAgKiBAbWV0aG9kIHJlbmRlclxuICAgKi9cbiAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiBcIlwiOyAvLyBub3RoaW5nIHRvIHJlbmRlciFcbiAgfSApO1xuICAvKipcbiAgICogQG1ldGhvZCByZW5kZXJUb0VsZW1lbnRcbiAgICovXG4gIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIHJlbmRlclRvRWxlbWVudCgpIHtcbiAgICBzZWxmLl9jcmVhdGVFbGVtZW50c0lmTmVjZXNzYXJ5KCk7XG4gICAgcmV0dXJuOyAvLyBub3RoaW5nIHRvIGRvLlxuICB9ICk7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSB0YWIgY29udHJvbGxlclxuICAgKiBAbWV0aG9kIGluaXRcbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0aGVFbGVtZW50SWRdXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbdGhlRWxlbWVudFRhZ11cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0aGVFbGVtZW50Q2xhc3NdXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gW3RoZVBhcmVudEVsZW1lbnRdXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGluaXQoIHRoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50ICkge1xuICAgIC8vIGRvIHdoYXQgYSBub3JtYWwgdmlldyBjb250YWluZXIgZG9lc1xuICAgIHNlbGYuJHN1cGVyKCB0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCApO1xuICAgIC8vc2VsZi5zdXBlciggX2NsYXNzTmFtZSwgXCJpbml0XCIsIFt0aGVFbGVtZW50SWQsIHRoZUVsZW1lbnRUYWcsIHRoZUVsZW1lbnRDbGFzcywgdGhlUGFyZW50RWxlbWVudCBdICk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0gKTtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIHRhYiBjb250cm9sbGVyXG4gICAqIEBtZXRob2QgaW5pdFdpdGhPcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGluaXRXaXRoT3B0aW9ucyggb3B0aW9ucyApIHtcbiAgICB2YXIgdGhlRWxlbWVudElkLCB0aGVFbGVtZW50VGFnLCB0aGVFbGVtZW50Q2xhc3MsIHRoZVBhcmVudEVsZW1lbnQ7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMuaWQgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZUVsZW1lbnRJZCA9IG9wdGlvbnMuaWQ7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnRhZyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgdGhlRWxlbWVudFRhZyA9IG9wdGlvbnMudGFnO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5jbGFzcyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgdGhlRWxlbWVudENsYXNzID0gb3B0aW9ucy5jbGFzcztcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMucGFyZW50ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aGVQYXJlbnRFbGVtZW50ID0gb3B0aW9ucy5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYuaW5pdCggdGhlRWxlbWVudElkLCB0aGVFbGVtZW50VGFnLCB0aGVFbGVtZW50Q2xhc3MsIHRoZVBhcmVudEVsZW1lbnQgKTtcbiAgICBpZiAoIHR5cGVvZiBvcHRpb25zICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5iYXJQb3NpdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgc2VsZi5iYXJQb3NpdGlvbiA9IG9wdGlvbnMuYmFyUG9zaXRpb247XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmJhckFsaWdubWVudCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgc2VsZi5iYXJBbGlnbm1lbnQgPSBvcHRpb25zLmJhckFsaWdubWVudDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0gKTtcbiAgLy8gYXV0byBpbml0XG4gIHNlbGYuX2F1dG9Jbml0LmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcbiAgcmV0dXJuIHNlbGY7XG59O1xuVGFiVmlld0NvbnRyb2xsZXIuQkFSX1BPU0lUSU9OID0ge1xuICBkZWZhdWx0OiBcImRlZmF1bHRcIixcbiAgdG9wOiAgICAgXCJ0b3BcIixcbiAgYm90dG9tOiAgXCJib3R0b21cIlxufTtcblRhYlZpZXdDb250cm9sbGVyLkJBUl9BTElHTk1FTlQgPSB7XG4gIGNlbnRlcjogXCJjZW50ZXJcIixcbiAgbGVmdDogICBcImxlZnRcIixcbiAgcmlnaHQ6ICBcInJpZ2h0XCJcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFRhYlZpZXdDb250cm9sbGVyO1xuIiwiLyoqXG4gKlxuICogVmlldyBDb250YWluZXJzIGFyZSBzaW1wbGUgb2JqZWN0cyB0aGF0IHByb3ZpZGUgdmVyeSBiYXNpYyB2aWV3IG1hbmFnZW1lbnQgd2l0aFxuICogYSB0aGluIGxheWVyIG92ZXIgdGhlIGNvcnJlc3BvbmRpbmcgRE9NIGVsZW1lbnQuXG4gKlxuICogQG1vZHVsZSB2aWV3Q29udGFpbmVyLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC41XG4gKlxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSovXG5cInVzZSBzdHJpY3RcIjtcbnZhciBCYXNlT2JqZWN0ID0gcmVxdWlyZSggXCIuLi91dGlsL29iamVjdFwiICksXG4gIGggPSByZXF1aXJlKCBcIi4uL3V0aWwvaFwiICk7XG52YXIgX2NsYXNzTmFtZSA9IFwiVmlld0NvbnRhaW5lclwiO1xudmFyIFZpZXdDb250YWluZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gbmV3IEJhc2VPYmplY3QoKTtcbiAgc2VsZi5zdWJjbGFzcyggX2NsYXNzTmFtZSApO1xuICAvLyAjIE5vdGlmaWNhdGlvbnNcbiAgLy8gKiBgdmlld1dhc1B1c2hlZGAgaXMgZmlyZWQgYnkgYSBjb250YWluaW5nIGBWaWV3Q29udHJvbGxlcmAgd2hlbiB0aGUgdmlldyBpcyBhZGRlZFxuICAvLyAgIHRvIHRoZSB2aWV3IHN0YWNrXG4gIC8vICogYHZpZXdXYXNQb3BwZWRgIGlzIGZpcmVkIGJ5IGEgY29udGFpbmVyIHdoZW4gdGhlIHZpZXcgaXMgcmVtb3ZlZCBmcm9tIHRoZSB2aWV3IHN0YWNrXG4gIC8vICogYHZpZXdXaWxsQXBwZWFyYCBpcyBmaXJlZCBieSBhIGNvbnRhaW5lciB3aGVuIHRoZSB2aWV3IGlzIGFib3V0IHRvIGFwcGVhciAob25lIHNob3VsZCBhdm9pZFxuICAvLyAgIGFueSBzaWduaWZpY2FudCBET00gY2hhbmdlcyBvciBjYWxjdWxhdGlvbnMgZHVyaW5nIHRoaXMgdGltZSwgb3IgYW5pbWF0aW9ucyBtYXkgc3R1dHRlcilcbiAgLy8gKiBgdmlld1dpbGxEaXNhcHBlYXJgIGlzIGZpcmVkIGJ5IGEgY29udGFpbmVyIHdoZW4gdGhlIHZpZXcgaXMgYWJvdXQgdG8gZGlzYXBwZWFyXG4gIC8vICogYHZpZXdEaWRBcHBlYXJgIGlzIGZpcmVkIGJ5IGEgY29udGFpbmVyIHdoZW4gdGhlIHZpZXcgaXMgb24gc2NyZWVuLlxuICAvLyAqIGB2aWV3RGlkRGlzYXBwZWFyYCBpcyBmaXJlZCBieSBhIGNvbnRhaW5lciB3aGVuIHRoZSB2aWV3IGlzIG9mZiBzY3JlZW4uXG4gIHNlbGYucmVnaXN0ZXJOb3RpZmljYXRpb24oIFwidmlld1dhc1B1c2hlZFwiICk7XG4gIHNlbGYucmVnaXN0ZXJOb3RpZmljYXRpb24oIFwidmlld1dhc1BvcHBlZFwiICk7XG4gIHNlbGYucmVnaXN0ZXJOb3RpZmljYXRpb24oIFwidmlld1dpbGxBcHBlYXJcIiApO1xuICBzZWxmLnJlZ2lzdGVyTm90aWZpY2F0aW9uKCBcInZpZXdXaWxsRGlzYXBwZWFyXCIgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJ2aWV3RGlkQXBwZWFyXCIgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJ2aWV3RGlkRGlzYXBwZWFyXCIgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJ3aWxsUmVuZGVyXCIgKTtcbiAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiggXCJkaWRSZW5kZXJcIiApO1xuICAvLyBwcml2YXRlIHByb3BlcnRpZXMgdXNlZCB0byBtYW5hZ2UgdGhlIGNvcnJlc3BvbmRpbmcgRE9NIGVsZW1lbnRcbiAgc2VsZi5fZWxlbWVudCA9IG51bGw7XG4gIHNlbGYuX2VsZW1lbnRDbGFzcyA9IFwidWktY29udGFpbmVyXCI7IC8vIGRlZmF1bHQ7IGNhbiBiZSBjaGFuZ2VkIHRvIGFueSBjbGFzcyBmb3Igc3R5bGluZyBwdXJwb3Nlc1xuICBzZWxmLl9lbGVtZW50SWQgPSBudWxsOyAvLyBiYWQgZGVzaWduIGRlY2lzaW9uIC0tIHByb2JhYmx5IGdvaW5nIHRvIG1hcmsgdGhpcyBhcyBkZXByZWNhdGVkIHNvb25cbiAgc2VsZi5fZWxlbWVudFRhZyA9IFwiZGl2XCI7IC8vIHNvbWUgZWxlbWVudHMgbWlnaHQgbmVlZCB0byBiZSBzb21ldGhpbmcgb3RoZXIgdGhhbiBhIERJVlxuICBzZWxmLl9wYXJlbnRFbGVtZW50ID0gbnVsbDsgLy8gb3duaW5nIGVsZW1lbnRcbiAgLyoqXG4gICAqIFRoZSB0aXRsZSBpc24ndCBkaXNwbGF5ZWQgYW55d2hlcmUgKHVubGVzcyB5b3UgdXNlIGl0IHlvdXJzZWxmIGluIGByZW5kZXJUb0VsZW1lbnRgLCBidXRcbiAgICogaXMgdXNlZnVsIGZvciBjb250YWluZXJzIHRoYXQgd2FudCB0byBrbm93IHRoZSB0aXRsZSBvZiB0aGVpciB2aWV3cy5cbiAgICogQHByb3BlcnR5IHRpdGxlXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBvYnNlcnZhYmxlXG4gICAqL1xuICBzZWxmLmRlZmluZU9ic2VydmFibGVQcm9wZXJ0eSggXCJ0aXRsZVwiICk7XG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBpbnRlcm5hbCBlbGVtZW50cy5cbiAgICogQG1ldGhvZCBjcmVhdGVFbGVtZW50XG4gICAqL1xuICBzZWxmLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHNlbGYuX2VsZW1lbnRUYWcgKTtcbiAgICBpZiAoIHNlbGYuZWxlbWVudENsYXNzICE9PSBudWxsICkge1xuICAgICAgc2VsZi5fZWxlbWVudC5jbGFzc05hbWUgPSBzZWxmLmVsZW1lbnRDbGFzcztcbiAgICB9XG4gICAgaWYgKCBzZWxmLmVsZW1lbnRJZCAhPT0gbnVsbCApIHtcbiAgICAgIHNlbGYuX2VsZW1lbnQuaWQgPSBzZWxmLmVsZW1lbnRJZDtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSBpbnRlcm5hbCBlbGVtZW50cyBpZiBuZWNlc3NhcnkgKHRoYXQgaXMsIGlmIHRoZXkgYXJlbid0IGFscmVhZHkgaW4gZXhpc3RlbmNlKVxuICAgKiBAbWV0aG9kIGNyZWF0ZUVsZW1lbnRJZk5vdENyZWF0ZWRcbiAgICovXG4gIHNlbGYuY3JlYXRlRWxlbWVudElmTm90Q3JlYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIHNlbGYuX2VsZW1lbnQgPT09IG51bGwgKSB7XG4gICAgICBzZWxmLmNyZWF0ZUVsZW1lbnQoKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBUaGUgYGVsZW1lbnRgIHByb3BlcnR5IGFsbG93IGRpcmVjdCBhY2Nlc3MgdG8gdGhlIERPTSBlbGVtZW50IGJhY2tpbmcgdGhlIHZpZXdcbiAgICogQHByb3BlcnR5IGVsZW1lbnRcbiAgICogQHR5cGUge0RPTUVsZW1lbnR9XG4gICAqL1xuICBzZWxmLmdldEVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5jcmVhdGVFbGVtZW50SWZOb3RDcmVhdGVkKCk7XG4gICAgcmV0dXJuIHNlbGYuX2VsZW1lbnQ7XG4gIH07XG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwiZWxlbWVudFwiLCB7XG4gICAgcmVhZDogICAgdHJ1ZSxcbiAgICB3cml0ZTogICB0cnVlLFxuICAgIGRlZmF1bHQ6IG51bGxcbiAgfSApO1xuICAvKipcbiAgICogVGhlIGBlbGVtZW50Q2xhc3NgIHByb3BlcnR5IGluZGljYXRlcyB0aGUgY2xhc3Mgb2YgdGhlIERPTSBlbGVtZW50LiBDaGFuZ2luZ1xuICAgKiB0aGUgY2xhc3Mgd2lsbCBhbHRlciB0aGUgYmFja2luZyBET00gZWxlbWVudCBpZiBjcmVhdGVkLlxuICAgKiBAcHJvcGVydHkgZWxlbWVudENsYXNzXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBkZWZhdWx0IFwidWktY29udGFpbmVyXCJcbiAgICovXG4gIHNlbGYuc2V0RWxlbWVudENsYXNzID0gZnVuY3Rpb24gKCB0aGVDbGFzc05hbWUgKSB7XG4gICAgc2VsZi5fZWxlbWVudENsYXNzID0gdGhlQ2xhc3NOYW1lO1xuICAgIGlmICggc2VsZi5fZWxlbWVudCAhPT0gbnVsbCApIHtcbiAgICAgIHNlbGYuX2VsZW1lbnQuY2xhc3NOYW1lID0gdGhlQ2xhc3NOYW1lO1xuICAgIH1cbiAgfTtcbiAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJlbGVtZW50Q2xhc3NcIiwge1xuICAgIHJlYWQ6ICAgIHRydWUsXG4gICAgd3JpdGU6ICAgdHJ1ZSxcbiAgICBkZWZhdWx0OiBcInVpLWNvbnRhaW5lclwiXG4gIH0gKTtcbiAgLyoqXG4gICAqIERldGVybWluZXMgdGhlIGBpZGAgZm9yIHRoZSBiYWNraW5nIERPTSBlbGVtZW50LiBOb3QgdGhlIGJlc3QgY2hvaWNlIHRvXG4gICAqIHVzZSwgc2luY2UgdGhpcyBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIERPTS4gUHJvYmFibHkgZ29pbmcgdG8gYmVjb21lXG4gICAqIGRlcHJlY2F0ZWQgZXZlbnR1YWxseVxuICAgKi9cbiAgc2VsZi5zZXRFbGVtZW50SWQgPSBmdW5jdGlvbiAoIHRoZUVsZW1lbnRJZCApIHtcbiAgICBzZWxmLl9lbGVtZW50SWQgPSB0aGVFbGVtZW50SWQ7XG4gICAgaWYgKCBzZWxmLl9lbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgc2VsZi5fZWxlbWVudC5pZCA9IHRoZUVsZW1lbnRJZDtcbiAgICB9XG4gIH07XG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwiZWxlbWVudElkXCIsIHtcbiAgICByZWFkOiAgICB0cnVlLFxuICAgIHdyaXRlOiAgIHRydWUsXG4gICAgZGVmYXVsdDogbnVsbFxuICB9ICk7XG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIHRoZSB0eXBlIG9mIERPTSBFbGVtZW50OyBieSBkZWZhdWx0IHRoaXMgaXMgYSBESVYuXG4gICAqIEBwcm9wZXJ0eSBlbGVtZW50VGFnXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBkZWZhdWx0IFwiZGl2XCJcbiAgICovXG4gIHNlbGYuZGVmaW5lUHJvcGVydHkoIFwiZWxlbWVudFRhZ1wiLCB7XG4gICAgcmVhZDogICAgdHJ1ZSxcbiAgICB3cml0ZTogICB0cnVlLFxuICAgIGRlZmF1bHQ6IFwiZGl2XCJcbiAgfSApO1xuICAvKipcbiAgICogSW5kaWNhdGVzIHRoZSBwYXJlbnQgZWxlbWVudCwgaWYgaXQgZXhpc3RzLiBUaGlzIGlzIGEgRE9NIGVsZW1lbnRcbiAgICogdGhhdCBvd25zIHRoaXMgdmlldyAocGFyZW50IC0+IGNoaWxkKS4gQ2hhbmdpbmcgdGhlIHBhcmVudCByZW1vdmVzXG4gICAqIHRoaXMgZWxlbWVudCBmcm9tIHRoZSBwYXJlbnQgYW5kIHJlcGFyZW50cyB0byBhbm90aGVyIGVsZW1lbnQuXG4gICAqIEBwcm9wZXJ0eSBwYXJlbnRFbGVtZW50XG4gICAqIEB0eXBlIHtET01FbGVtZW50fVxuICAgKi9cbiAgc2VsZi5zZXRQYXJlbnRFbGVtZW50ID0gZnVuY3Rpb24gKCB0aGVQYXJlbnRFbGVtZW50ICkge1xuICAgIGlmICggc2VsZi5fcGFyZW50RWxlbWVudCAhPT0gbnVsbCAmJiBzZWxmLl9lbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgLy8gcmVtb3ZlIG91cnNlbHZlcyBmcm9tIHRoZSBleGlzdGluZyBwYXJlbnQgZWxlbWVudCBmaXJzdFxuICAgICAgc2VsZi5fcGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCggc2VsZi5fZWxlbWVudCApO1xuICAgICAgc2VsZi5fcGFyZW50RWxlbWVudCA9IG51bGw7XG4gICAgfVxuICAgIHNlbGYuX3BhcmVudEVsZW1lbnQgPSB0aGVQYXJlbnRFbGVtZW50O1xuICAgIGlmICggc2VsZi5fcGFyZW50RWxlbWVudCAhPT0gbnVsbCAmJiBzZWxmLl9lbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgc2VsZi5fcGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZCggc2VsZi5fZWxlbWVudCApO1xuICAgIH1cbiAgfTtcbiAgc2VsZi5kZWZpbmVQcm9wZXJ0eSggXCJwYXJlbnRFbGVtZW50XCIsIHtcbiAgICByZWFkOiAgICB0cnVlLFxuICAgIHdyaXRlOiAgIHRydWUsXG4gICAgZGVmYXVsdDogbnVsbFxuICB9ICk7XG4gIC8qKlxuICAgKiBAbWV0aG9kIHJlbmRlclxuICAgKiBAcmV0dXJuIHtTdHJpbmd8RE9NRWxlbWVudHxEb2N1bWVudEZyYWdtZW50fVxuICAgKiBgcmVuZGVyYCBpcyBjYWxsZWQgYnkgYHJlbmRlclRvRWxlbWVudGAuIFRoZSBpZGVhIGJlaGluZCB0aGlzIGlzIHRvIGdlbmVyYXRlXG4gICAqIGEgcmV0dXJuIHZhbHVlIGNvbnNpc3Rpbmcgb2YgdGhlIERPTSB0cmVlIG5lY2Vzc2FyeSB0byBjcmVhdGUgdGhlIHZpZXcnc1xuICAgKiBjb250ZW50cy5cbiAgICoqL1xuICBzZWxmLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyByaWdodCBub3csIHRoaXMgZG9lc24ndCBkbyBhbnl0aGluZywgYnV0IGl0J3MgaGVyZSBmb3IgaW5oZXJpdGFuY2UgcHVycG9zZXNcbiAgICByZXR1cm4gXCJFcnJvcjogQWJzdHJhY3QgTWV0aG9kXCI7XG4gIH07XG4gIC8qKlxuICAgKiBSZW5kZXJzIHRoZSBjb250ZW50IG9mIHRoZSB2aWV3LiBDYW4gYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlLCBidXQgbW9yZVxuICAgKiBvZnRlbiBpcyBjYWxsZWQgb25jZSBkdXJpbmcgYGluaXRgLiBDYWxscyBgcmVuZGVyYCBpbW1lZGlhdGVseSBhbmRcbiAgICogYXNzaWducyBpdCB0byBgZWxlbWVudGAncyBgaW5uZXJIVE1MYCAtLSB0aGlzIGltcGxpY2l0bHkgY3JlYXRlcyB0aGVcbiAgICogRE9NIGVsZW1lbnRzIGJhY2tpbmcgdGhlIHZpZXcgaWYgdGhleSB3ZXJlbid0IGFscmVhZHkgY3JlYXRlZC5cbiAgICogQG1ldGhvZCByZW5kZXJUb0VsZW1lbnRcbiAgICovXG4gIHNlbGYucmVuZGVyVG9FbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuZW1pdCggXCJ3aWxsUmVuZGVyXCIgKTtcbiAgICB2YXIgcmVuZGVyT3V0cHV0ID0gc2VsZi5yZW5kZXIoKTtcbiAgICBpZiAoIHR5cGVvZiByZW5kZXJPdXRwdXQgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgICBzZWxmLmVsZW1lbnQuaW5uZXJIVE1MID0gc2VsZi5yZW5kZXIoKTtcbiAgICB9IGVsc2UgaWYgKCB0eXBlb2YgcmVuZGVyT3V0cHV0ID09PSBcIm9iamVjdFwiICkge1xuICAgICAgaC5yZW5kZXJUbyggcmVuZGVyT3V0cHV0LCBzZWxmLmVsZW1lbnQgKTtcbiAgICB9XG4gICAgc2VsZi5lbWl0KCBcImRpZFJlbmRlclwiICk7XG4gIH07XG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgdmlldyBjb250YWluZXI7IHJldHVybnMgYHNlbGZgXG4gICAqIEBtZXRob2QgaW5pdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RoZUVsZW1lbnRJZF1cbiAgICogQHBhcmFtIHtTdHJpbmd9IFt0aGVFbGVtZW50VGFnXVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3RoZUVsZW1lbnRDbGFzc11cbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBbdGhlUGFyZW50RWxlbWVudF1cbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIHNlbGYub3ZlcnJpZGUoIGZ1bmN0aW9uIGluaXQoIHRoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50ICkge1xuICAgIHNlbGYuJHN1cGVyKCk7XG4gICAgLy9zZWxmLnN1cGVyKCBfY2xhc3NOYW1lLCBcImluaXRcIiApOyAvLyBzdXBlciBoYXMgbm8gcGFyYW1ldGVyc1xuICAgIC8vIHNldCBvdXIgSWQsIFRhZywgYW5kIENsYXNzXG4gICAgaWYgKCB0eXBlb2YgdGhlRWxlbWVudElkICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgc2VsZi5lbGVtZW50SWQgPSB0aGVFbGVtZW50SWQ7XG4gICAgfVxuICAgIGlmICggdHlwZW9mIHRoZUVsZW1lbnRUYWcgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBzZWxmLmVsZW1lbnRUYWcgPSB0aGVFbGVtZW50VGFnO1xuICAgIH1cbiAgICBpZiAoIHR5cGVvZiB0aGVFbGVtZW50Q2xhc3MgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBzZWxmLmVsZW1lbnRDbGFzcyA9IHRoZUVsZW1lbnRDbGFzcztcbiAgICB9XG4gICAgLy8gcmVuZGVyIG91cnNlbHZlcyB0byB0aGUgZWxlbWVudCAodmlhIHJlbmRlcik7IHRoaXMgaW1wbGljaXRseSBjcmVhdGVzIHRoZSBlbGVtZW50XG4gICAgLy8gd2l0aCB0aGUgYWJvdmUgcHJvcGVydGllcy5cbiAgICBzZWxmLnJlbmRlclRvRWxlbWVudCgpO1xuICAgIC8vIGFkZCBvdXJzZWx2ZXMgdG8gb3VyIHBhcmVudC5cbiAgICBpZiAoIHR5cGVvZiB0aGVQYXJlbnRFbGVtZW50ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgc2VsZi5wYXJlbnRFbGVtZW50ID0gdGhlUGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGY7XG4gIH0gKTtcbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSB2aWV3IGNvbnRhaW5lci4gYG9wdGlvbnNgIGNhbiBzcGVjaWZ5IGFueSBvZiB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqXG4gICAqICAqIGBpZGAgLSB0aGUgYGlkYCBvZiB0aGUgZWxlbWVudFxuICAgKiAgKiBgdGFnYCAtIHRoZSBlbGVtZW50IHRhZyB0byB1c2UgKGBkaXZgIGlzIHRoZSBkZWZhdWx0KVxuICAgKiAgKiBgY2xhc3NgIC0gdGhlIGNsYXNzIG5hbWUgdG8gdXNlIChgdWktY29udGFpbmVyYCBpcyB0aGUgZGVmYXVsdClcbiAgICogICogYHBhcmVudGAgLSB0aGUgcGFyZW50IERPTUVsZW1lbnRcbiAgICpcbiAgICogQG1ldGhvZCBpbml0V2l0aE9wdGlvbnNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgc2VsZi5pbml0V2l0aE9wdGlvbnMgPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG4gICAgdmFyIHRoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50O1xuICAgIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLmlkICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICB0aGVFbGVtZW50SWQgPSBvcHRpb25zLmlkO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy50YWcgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZUVsZW1lbnRUYWcgPSBvcHRpb25zLnRhZztcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMuY2xhc3MgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHRoZUVsZW1lbnRDbGFzcyA9IG9wdGlvbnMuY2xhc3M7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnBhcmVudCAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgdGhlUGFyZW50RWxlbWVudCA9IG9wdGlvbnMucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxmLmluaXQoIHRoZUVsZW1lbnRJZCwgdGhlRWxlbWVudFRhZywgdGhlRWxlbWVudENsYXNzLCB0aGVQYXJlbnRFbGVtZW50ICk7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMudGl0bGUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHNlbGYudGl0bGUgPSBvcHRpb25zLnRpdGxlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbiAgLyoqXG4gICAqIENsZWFuIHVwXG4gICAqIEBtZXRob2QgZGVzdHJveVxuICAgKi9cbiAgc2VsZi5vdmVycmlkZSggZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAvLyByZW1vdmUgb3Vyc2VsdmVzIGZyb20gdGhlIHBhcmVudCB2aWV3LCBpZiBhdHRhY2hlZFxuICAgIGlmICggc2VsZi5fcGFyZW50RWxlbWVudCAhPT0gbnVsbCAmJiBzZWxmLl9lbGVtZW50ICE9PSBudWxsICkge1xuICAgICAgLy8gcmVtb3ZlIG91cnNlbHZlcyBmcm9tIHRoZSBleGlzdGluZyBwYXJlbnQgZWxlbWVudCBmaXJzdFxuICAgICAgc2VsZi5fcGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCggc2VsZi5fZWxlbWVudCApO1xuICAgICAgc2VsZi5fcGFyZW50RWxlbWVudCA9IG51bGw7XG4gICAgfVxuICAgIC8vIGFuZCBsZXQgb3VyIHN1cGVyIGtub3cgdGhhdCBpdCBjYW4gY2xlYW4gdXBcbiAgICBzZWxmLiRzdXBlcigpO1xuICAgIC8vc2VsZi5zdXBlciggX2NsYXNzTmFtZSwgXCJkZXN0cm95XCIgKTtcbiAgfSApO1xuICAvLyBoYW5kbGUgYXV0by1pbml0aWFsaXphdGlvblxuICBzZWxmLl9hdXRvSW5pdC5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gIC8vIHJldHVybiB0aGUgbmV3IG9iamVjdFxuICByZXR1cm4gc2VsZjtcbn07XG4vLyByZXR1cm4gdGhlIG5ldyBmYWN0b3J5XG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdDb250YWluZXI7XG4iLCIvKipcbiAqXG4gKiBDb3JlIG9mIFlBU01GLVVUSUw7IGRlZmluZXMgdGhlIHZlcnNpb24sIERPTSwgYW5kIGxvY2FsaXphdGlvbiBjb252ZW5pZW5jZSBtZXRob2RzLlxuICpcbiAqIEBtb2R1bGUgY29yZS5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNVxuICpcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDEzIEtlcnJpIFNob3R0cywgcGhvdG9LYW5keSBTdHVkaW9zIExMQ1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllc1xuICogb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUlxuICogUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVFxuICogT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqIGBgYFxuICovXG4vKmdsb2JhbCBkZWZpbmUsIEdsb2JhbGl6ZSwgZGV2aWNlLCBkb2N1bWVudCwgd2luZG93LCBzZXRUaW1lb3V0LCBuYXZpZ2F0b3IsIGNvbnNvbGUsIE5vZGUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEBtZXRob2QgZ2V0Q29tcHV0ZWRTdHlsZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gZWxlbWVudCAgICAgIHRoZSBlbGVtZW50IHRvIHJlcXVlc3QgdGhlIGNvbXB1dGVkIHN0eWxlIGZyb21cbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAgIHRoZSBwcm9wZXJ0eSB0byByZXF1ZXN0IChsaWtlIGB3aWR0aGApOyBvcHRpb25hbFxuICogQHJldHVybnMgeyp9ICAgICAgICAgICAgICAgRWl0aGVyIHRoZSBwcm9wZXJ0eSByZXF1ZXN0ZWQgb3IgdGhlIGVudGlyZSBDU1Mgc3R5bGUgZGVjbGFyYXRpb25cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbWVudCwgcHJvcGVydHkgKSB7XG4gIGlmICggISggZWxlbWVudCBpbnN0YW5jZW9mIE5vZGUgKSAmJiB0eXBlb2YgZWxlbWVudCA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICBwcm9wZXJ0eSA9IGVsZW1lbnQ7XG4gICAgZWxlbWVudCA9IHRoaXM7XG4gIH1cbiAgdmFyIGNvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbWVudCApO1xuICBpZiAoIHR5cGVvZiBwcm9wZXJ0eSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICByZXR1cm4gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCBwcm9wZXJ0eSApO1xuICB9XG4gIHJldHVybiBjb21wdXRlZFN0eWxlO1xufVxuLyoqXG4gKiBAbWV0aG9kIF9hcnJheWl6ZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZUxpc3R9IGxpc3QgICAgIHRoZSBsaXN0IHRvIGNvbnZlcnRcbiAqIEByZXR1cm5zIHtBcnJheX0gICAgICAgICAgIHRoZSBjb252ZXJ0ZWQgYXJyYXlcbiAqL1xuZnVuY3Rpb24gX2FycmF5aXplKCBsaXN0ICkge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNwbGljZS5jYWxsKCBsaXN0LCAwICk7XG59XG4vKipcbiAqIEBtZXRob2QgZ2V0RWxlbWVudEJ5SWRcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge05vZGV9IHBhcmVudCAgICAgIHRoZSBwYXJlbnQgdG8gZXhlY3V0ZSBnZXRFbGVtZW50QnlJZCBvblxuICogQHBhcmFtIHtzdHJpbmd9IGVsZW1lbnRJZCB0aGUgZWxlbWVudCBJRCB0byBzZWFyY2ggZm9yXG4gKiBAcmV0dXJucyB7Tm9kZX0gICAgICAgICAgIHRoZSBlbGVtZW50IG9yIG51bGwgaWYgbm90IGZvdW5kXG4gKi9cbmZ1bmN0aW9uIGdldEVsZW1lbnRCeUlkKCBwYXJlbnQsIGVsZW1lbnRJZCApIHtcbiAgaWYgKCB0eXBlb2YgcGFyZW50ID09PSBcInN0cmluZ1wiICkge1xuICAgIGVsZW1lbnRJZCA9IHBhcmVudDtcbiAgICBwYXJlbnQgPSBkb2N1bWVudDtcbiAgfVxuICByZXR1cm4gKCBwYXJlbnQuZ2V0RWxlbWVudEJ5SWQoIGVsZW1lbnRJZCApICk7XG59XG4vKipcbiAqIEBtZXRob2QgcXVlcnlTZWxlY3RvclxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Tm9kZX0gcGFyZW50ICAgICAgIHRoZSBwYXJlbnQgdG8gZXhlY3V0ZSBxdWVyeVNlbGVjdG9yIG9uXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgICB0aGUgQ1NTIHNlbGVjdG9yIHRvIHVzZVxuICogQHJldHVybnMge05vZGV9ICAgICAgICAgICAgdGhlIGxvY2F0ZWQgZWxlbWVudCBvciBudWxsIGlmIG5vdCBmb3VuZFxuICovXG5mdW5jdGlvbiBxdWVyeVNlbGVjdG9yKCBwYXJlbnQsIHNlbGVjdG9yICkge1xuICBpZiAoIHR5cGVvZiBwYXJlbnQgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgc2VsZWN0b3IgPSBwYXJlbnQ7XG4gICAgcGFyZW50ID0gZG9jdW1lbnQ7XG4gIH1cbiAgcmV0dXJuICggcGFyZW50LnF1ZXJ5U2VsZWN0b3IoIHNlbGVjdG9yICkgKTtcbn1cbi8qKlxuICogQG1ldGhvZCBxdWVyeVNlbGVjdG9yQWxsXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtOb2RlfSBwYXJlbnQgICAgIHRoZSBwYXJlbnQgdG8gZXhlY3V0ZSBxdWVyeVNlbGVjdG9yQWxsIG9uXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgdGhlIHNlbGVjdG9yIHRvIHVzZVxuICogQHJldHVybnMge0FycmF5fSAgICAgICAgIHRoZSBmb3VuZCBlbGVtZW50czsgaWYgbm9uZTogW11cbiAqL1xuZnVuY3Rpb24gcXVlcnlTZWxlY3RvckFsbCggcGFyZW50LCBzZWxlY3RvciApIHtcbiAgaWYgKCB0eXBlb2YgcGFyZW50ID09PSBcInN0cmluZ1wiICkge1xuICAgIHNlbGVjdG9yID0gcGFyZW50O1xuICAgIHBhcmVudCA9IGRvY3VtZW50O1xuICB9XG4gIHJldHVybiBfYXJyYXlpemUoIHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciApICk7XG59XG4vKipcbiAqIEBtZXRob2QgJFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciAgIHRoZSBDU1Mgc2VsZWN0b3IgdG8gdXNlXG4gKiBAcmV0dXJucyB7Tm9kZX0gICAgICAgICAgICBUaGUgbG9jYXRlZCBlbGVtZW50LCByZWxhdGl2ZSB0byBgdGhpc2BcbiAqL1xuZnVuY3Rpb24gJCggc2VsZWN0b3IgKSB7XG4gIHJldHVybiBxdWVyeVNlbGVjdG9yKCB0aGlzLCBzZWxlY3RvciApO1xufVxuLyoqXG4gKiBAbWV0aG9kICQkXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yICAgdGhlIENTUyBzZWxlY3RvciB0byB1c2VcbiAqIEByZXR1cm5zIHtBcnJheX0gICAgICAgICAgIHRoZSBsb2NhdGVkIGVsZW1lbnRzLCByZWxhdGl2ZSB0byBgdGhpc2BcbiAqL1xuZnVuY3Rpb24gJCQoIHNlbGVjdG9yICkge1xuICByZXR1cm4gcXVlcnlTZWxlY3RvckFsbCggdGhpcywgc2VsZWN0b3IgKTtcbn1cbi8qKlxuICogQG1ldGhvZCAkaWRcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gaWQgICAgICAgICB0aGUgaWQgb2YgdGhlIGVsZW1lbnRcbiAqIEByZXR1cm5zIHtOb2RlfSAgICAgICAgICAgIHRoZSBsb2NhdGVkIGVsZW1lbnQgb3IgbnVsbCBpZiBub3QgZm91bmRcbiAqL1xuZnVuY3Rpb24gJGlkKCBpZCApIHtcbiAgcmV0dXJuIGdldEVsZW1lbnRCeUlkKCB0aGlzLCBpZCApO1xufVxuLy8gbW9kaWZ5IE5vZGUncyBwcm90b3R5cGUgdG8gcHJvdmlkZSB1c2VmdWwgYWRkaXRpb25hbCBzaG9ydGN1dHNcbnZhciBwcm90byA9IE5vZGUucHJvdG90eXBlO1xuW1xuICBbXCIkXCIsICRdLFxuICBbXCIkJFwiLCAkJF0sXG4gIFtcIiQxXCIsICRdLFxuICBbXCIkaWRcIiwgJGlkXSxcbiAgW1wiZ3NjXCIsIGdldENvbXB1dGVkU3R5bGVdLFxuICBbXCJnY3NcIiwgZ2V0Q29tcHV0ZWRTdHlsZV0sXG4gIFtcImdldENvbXB1dGVkU3R5bGVcIiwgZ2V0Q29tcHV0ZWRTdHlsZV1cbl0uZm9yRWFjaCggZnVuY3Rpb24gKCBpICkge1xuICAgICAgICAgICAgIGlmICggdHlwZW9mIHByb3RvW2lbMF1dID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgICAgICAgcHJvdG9baVswXV0gPSBpWzFdO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfSApO1xuLyoqXG4gKiBSZXR1cm5zIGEgdmFsdWUgZm9yIHRoZSBzcGVjaWZpZWQga2V5cGF0aC4gSWYgYW55IGludGVydmVuaW5nXG4gKiB2YWx1ZXMgZXZhbHVhdGUgdG8gdW5kZWZpbmVkIG9yIG51bGwsIHRoZSBlbnRpcmUgcmVzdWx0IGlzXG4gKiB1bmRlZmluZWQgb3IgbnVsbCwgcmVzcGVjdGl2ZWx5LlxuICpcbiAqIElmIHlvdSBuZWVkIGEgZGVmYXVsdCB2YWx1ZSB0byBiZSByZXR1cm5lZCBpbiBzdWNoIGFuIGluc3RhbmNlLFxuICogc3BlY2lmeSBpdCBhZnRlciB0aGUga2V5cGF0aC5cbiAqXG4gKiBOb3RlOiBpZiBgb2AgaXMgbm90IGFuIG9iamVjdCwgaXQgaXMgYXNzdW1lZCB0aGF0IHRoZSBmdW5jdGlvblxuICogaGFzIGJlZW4gYm91bmQgdG8gYHRoaXNgLiBBcyBzdWNoLCBhbGwgYXJndW1lbnRzIGFyZSBzaGlmdGVkIGJ5XG4gKiBvbmUgcG9zaXRpb24gdG8gdGhlIHJpZ2h0LlxuICpcbiAqIEtleSBwYXRocyBhcmUgb2YgdGhlIGZvcm06XG4gKlxuICogICAgb2JqZWN0LmZpZWxkLmZpZWxkLmZpZWxkW2luZGV4XVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvICAgICAgICB0aGUgb2JqZWN0IHRvIHNlYXJjaFxuICogQHBhcmFtIHtzdHJpbmd9IGsgICAgICAgIHRoZSBrZXlwYXRoXG4gKiBAcGFyYW0geyp9IGQgICAgICAgICAgICAgKG9wdGlvbmFsKSB0aGUgZGVmYXVsdCB2YWx1ZSB0byByZXR1cm5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBzaG91bGQgdGhlIGtleXBhdGggZXZhbHVhdGUgdG8gbnVsbCBvclxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZC5cbiAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICB0aGUgdmFsdWUgYXQgdGhlIGtleXBhdGhcbiAqXG4gKiBMaWNlbnNlIE1JVDogQ29weXJpZ2h0IDIwMTQgS2VycmkgU2hvdHRzXG4gKi9cbmZ1bmN0aW9uIHZhbHVlRm9yS2V5UGF0aCggbywgaywgZCApIHtcbiAgaWYgKCBvID09PSB1bmRlZmluZWQgfHwgbyA9PT0gbnVsbCApIHtcbiAgICByZXR1cm4gKCBkICE9PSB1bmRlZmluZWQgKSA/IGQgOiBvO1xuICB9XG4gIGlmICggISggbyBpbnN0YW5jZW9mIE9iamVjdCApICkge1xuICAgIGQgPSBrO1xuICAgIGsgPSBvO1xuICAgIG8gPSB0aGlzO1xuICB9XG4gIHZhciB2ID0gbztcbiAgLy8gVGhlcmUncyBhIG1pbGxpb24gd2F5cyB0aGF0IHRoaXMgcmVnZXggY2FuIGdvIHdyb25nXG4gIC8vIHdpdGggcmVzcGVjdCB0byBKYXZhU2NyaXB0IGlkZW50aWZpZXJzLiBTcGxpdHMgd2lsbFxuICAvLyB0ZWNobmljYWxseSB3b3JrIHdpdGgganVzdCBhYm91dCBldmVyeSBub24tQS1aYS16XFwkLVxuICAvLyB2YWx1ZSwgc28geW91ciBrZXlwYXRoIGNvdWxkIGJlIFwiZmllbGQvZmllbGQvZmllbGRcIlxuICAvLyBhbmQgaXQgd291bGQgd29yayBsaWtlIFwiZmllbGQuZmllbGQuZmllbGRcIi5cbiAgdiA9IGsubWF0Y2goIC8oW1xcd1xcJFxcXFxcXC1dKykvZyApLnJlZHVjZSggZnVuY3Rpb24gKCB2LCBrZXlQYXJ0ICkge1xuICAgIGlmICggdiA9PT0gdW5kZWZpbmVkIHx8IHYgPT09IG51bGwgKSB7XG4gICAgICByZXR1cm4gdjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB2W2tleVBhcnRdO1xuICAgIH1cbiAgICBjYXRjaCAoIGVyciApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9LCB2ICk7XG4gIHJldHVybiAoICggdiA9PT0gdW5kZWZpbmVkIHx8IHYgPT09IG51bGwgKSAmJiAoIGQgIT09IHVuZGVmaW5lZCApICkgPyBkIDogdjtcbn1cbi8qKlxuICogSW50ZXJwb2xhdGVzIHZhbHVlcyBmcm9tIHRoZSBjb250ZXh0IGludG8gdGhlIHN0cmluZy4gUGxhY2Vob2xkZXJzIGFyZSBvZiB0aGVcbiAqIGZvcm0gey4uLn0uIElmIHZhbHVlcyB3aXRoaW4gey4uLn0gZG8gbm90IGV4aXN0IHdpdGhpbiBjb250ZXh0LCB0aGV5IGFyZVxuICogcmVwbGFjZWQgd2l0aCB1bmRlZmluZWQuXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciAgICAgc3RyaW5nIHRvIGludGVycG9sYXRlXG4gKiBAcGFyYW0gIHsqfSBjb250ZXh0ICAgICAgY29udGV4dCB0byB1c2UgZm9yIGludGVycG9sYXRpb25cbiAqIEByZXR1cm4ge3N0cmluZ319ICAgICAgICBpbnRlcnBvbGF0ZWQgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIGludGVycG9sYXRlKCBzdHIsIGNvbnRleHQgKSB7XG4gIHZhciBuZXdTdHIgPSBzdHI7XG4gIGlmICggdHlwZW9mIGNvbnRleHQgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgcmV0dXJuIG5ld1N0cjtcbiAgfVxuICBzdHIubWF0Y2goIC9cXHsoW15cXH1dKylcXH0vZyApLmZvckVhY2goIGZ1bmN0aW9uICggbWF0Y2ggKSB7XG4gICAgdmFyIHByb3AgPSBtYXRjaC5zdWJzdHIoIDEsIG1hdGNoLmxlbmd0aCAtIDIgKS50cmltKCk7XG4gICAgbmV3U3RyID0gbmV3U3RyLnJlcGxhY2UoIG1hdGNoLCB2YWx1ZUZvcktleVBhdGgoIGNvbnRleHQsIHByb3AgKSApO1xuICB9ICk7XG4gIHJldHVybiBuZXdTdHI7XG59XG4vKipcbiAqIE1lcmdlcyB0aGUgc3VwcGxpZWQgb2JqZWN0cyB0b2dldGhlciBhbmQgcmV0dXJucyBhIGNvcHkgY29udGFpbmluIHRoZSBtZXJnZWQgb2JqZWN0cy4gVGhlIG9yaWdpbmFsXG4gKiBvYmplY3RzIGFyZSB1bnRvdWNoZWQsIGFuZCBhIG5ldyBvYmplY3QgaXMgcmV0dXJuZWQgY29udGFpbmluZyBhIHJlbGF0aXZlbHkgZGVlcCBjb3B5IG9mIGVhY2ggb2JqZWN0LlxuICpcbiAqIEltcG9ydGFudCBOb3RlczpcbiAqICAgLSBJdGVtcyB0aGF0IGV4aXN0IGluIGFueSBvYmplY3QgYnV0IG5vdCBpbiBhbnkgb3RoZXIgd2lsbCBiZSBhZGRlZCB0byB0aGUgdGFyZ2V0XG4gKiAgIC0gU2hvdWxkIG1vcmUgdGhhbiBvbmUgaXRlbSBleGlzdCBpbiB0aGUgc2V0IG9mIG9iamVjdHMgd2l0aCB0aGUgc2FtZSBrZXksIHRoZSBmb2xsb3dpbmcgcnVsZXMgb2NjdXI6XG4gKiAgICAgLSBJZiBib3RoIHR5cGVzIGFyZSBhcnJheXMsIHRoZSByZXN1bHQgaXMgYS5jb25jYXQoYilcbiAqICAgICAtIElmIGJvdGggdHlwZXMgYXJlIG9iamVjdHMsIHRoZSByZXN1bHQgaXMgbWVyZ2UoYSxiKVxuICogICAgIC0gT3RoZXJ3aXNlIHRoZSByZXN1bHQgaXMgYiAoYiBvdmVyd3JpdGVzIGEpXG4gKiAgIC0gU2hvdWxkIG1vcmUgdGhhbiBvbmUgaXRlbSBleGlzdCBpbiB0aGUgc2V0IG9mIG9iamVjdHMgd2l0aCB0aGUgc2FtZSBrZXksIGJ1dCBkaWZmZXIgaW4gdHlwZSwgdGhlXG4gKiAgICAgc2Vjb25kIHZhbHVlIG92ZXJ3cml0ZXMgdGhlIGZpcnN0LlxuICogICAtIFRoaXMgaXMgbm90IGEgdHJ1ZSBkZWVwIGNvcHkhIFNob3VsZCBhbnkgcHJvcGVydHkgYmUgYSByZWZlcmVuY2UgdG8gYW5vdGhlciBvYmplY3Qgb3IgYXJyYXksIHRoZVxuICogICAgIGNvcGllZCByZXN1bHQgbWF5IGFsc28gYmUgYSByZWZlcmVuY2UgKHVubGVzcyBib3RoIHRoZSB0YXJnZXQgYW5kIHRoZSBzb3VyY2Ugc2hhcmUgdGhlIHNhbWUgaXRlbVxuICogICAgIHdpdGggdGhlIHNhbWUgdHlwZSkuIEluIG90aGVyIHdvcmRzOiBET04nVCBVU0UgVEhJUyBBUyBBIERFRVAgQ09QWSBNRVRIT0RcbiAqXG4gKiBJdCdzIHJlYWxseSBtZWFudCB0byBtYWtlIHRoaXMga2luZCBvZiB3b3JrIGVhc3k6XG4gKlxuICogdmFyIHggPSB7IGE6IDEsIGI6IFwiaGlcIiwgYzogWzEsMl0gfSxcbiAqICAgICB5ID0geyBhOiAzLCBjOiBbMywgNF0sIGQ6IDAgfSxcbiAqICAgICB6ID0gbWVyZ2UgKHgseSk7XG4gKlxuICogeiBpcyBub3cgeyBhOiAzLCBiOiBcImhpXCIsIGM6IFsxLDIsMyw0XSwgZDowIH0uXG4gKlxuICogTGljZW5zZSBNSVQuIENvcHlyaWdodCBLZXJyaSBTaG90dHMgMjAxNFxuICovXG5mdW5jdGlvbiBtZXJnZSgpIHtcbiAgdmFyIHQgPSB7fSxcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cywgMCApO1xuICBhcmdzLmZvckVhY2goIGZ1bmN0aW9uICggcyApIHtcbiAgICBpZiAocyA9PT0gdW5kZWZpbmVkIHx8IHMgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjsgLy8gbm8ga2V5cywgd2h5IGJvdGhlciFcbiAgICB9XG4gICAgT2JqZWN0LmtleXMoIHMgKS5mb3JFYWNoKCBmdW5jdGlvbiAoIHByb3AgKSB7XG4gICAgICB2YXIgZSA9IHNbcHJvcF07XG4gICAgICBpZiAoIGUgaW5zdGFuY2VvZiBBcnJheSApIHtcbiAgICAgICAgaWYgKCB0W3Byb3BdIGluc3RhbmNlb2YgQXJyYXkgKSB7XG4gICAgICAgICAgdFtwcm9wXSA9IHRbcHJvcF0uY29uY2F0KCBlICk7XG4gICAgICAgIH0gZWxzZSBpZiAoICEoIHRbcHJvcF0gaW5zdGFuY2VvZiBPYmplY3QgKSB8fCAhKCB0W3Byb3BdIGluc3RhbmNlb2YgQXJyYXkgKSApIHtcbiAgICAgICAgICB0W3Byb3BdID0gZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICggZSBpbnN0YW5jZW9mIE9iamVjdCAmJiB0W3Byb3BdIGluc3RhbmNlb2YgT2JqZWN0ICkge1xuICAgICAgICB0W3Byb3BdID0gbWVyZ2UoIHRbcHJvcF0sIGUgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRbcHJvcF0gPSBlO1xuICAgICAgfVxuICAgIH0gKTtcbiAgfSApO1xuICByZXR1cm4gdDtcbn1cbi8qKlxuICogVmFsaWRhdGVzIGEgc291cmNlIGFnYWluc3QgdGhlIHNwZWNpZmllZCBydWxlcy4gYHNvdXJjZWAgY2FuIGxvb2sgbGlrZSB0aGlzOlxuICpcbiAqICAgICB7IGFTdHJpbmc6IFwiaGlcIiwgYU51bWJlcjogeyBoaTogMjk0LjEyIH0sIGFuSW50ZWdlcjogMTk0NC4zMiB9XG4gKlxuICogYHJ1bGVzYCBjYW4gbG9vayBsaWtlIHRoaXM6XG4gKlxuICogICAgIHtcbiAgICAgKiAgICAgICBcImEtc3RyaW5nXCI6IHtcbiAgICAgKiAgICAgICAgIHRpdGxlOiBcIkEgU3RyaW5nXCIsICAgICAtLSBvcHRpb25hbDsgaWYgbm90IHN1cHBsaWVkLCBrZXkgaXMgdXNlZFxuICAgICAqICAgICAgICAga2V5OiBcImFTdHJpbmdcIiwgICAgICAgIC0tIG9wdGlvbmFsOiBpZiBub3Qgc3VwcGxpZWQgdGhlIG5hbWUgb2YgdGhpcyBydWxlIGlzIHVzZWQgYXMgdGhlIGtleVxuICAgICAqICAgICAgICAgcmVxdWlyZWQ6IHRydWUsICAgICAgICAtLSBvcHRpb25hbDogaWYgbm90IHN1cHBsaWVkLCB2YWx1ZSBpcyBub3QgcmVxdWlyZWRcbiAgICAgKiAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsICAgICAgICAtLSBzdHJpbmcsIG51bWJlciwgaW50ZWdlciwgYXJyYXksIGRhdGUsIGJvb2xlYW4sIG9iamVjdCwgKihhbnkpXG4gICAgICogICAgICAgICBtaW5MZW5ndGg6IDEsICAgICAgICAgIC0tIG9wdGlvbmFsOiBtaW5pbXVtIGxlbmd0aCAoc3RyaW5nLCBhcnJheSlcbiAgICAgKiAgICAgICAgIG1heExlbmd0aDogMjU1ICAgICAgICAgLS0gb3B0aW9uYWw6IG1heGltdW0gbGVuZ3RoIChzdHJpbmcsIGFycmF5KVxuICAgICAqICAgICAgIH0sXG4gICAgICogICAgICAgXCJhLW51bWJlclwiOiB7XG4gICAgICogICAgICAgICB0aXRsZTogXCJBIE51bWJlclwiLFxuICAgICAqICAgICAgICAga2V5OiBcImFOdW1iZXIuaGlcIiwgICAgIC0tIGtleXMgY2FuIGhhdmUgLiBhbmQgW10gdG8gcmVmZXJlbmNlIHByb3BlcnRpZXMgd2l0aGluIG9iamVjdHNcbiAgICAgKiAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgKiAgICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICogICAgICAgICBtaW46IDAsICAgICAgICAgICAgICAgIC0tIGlmIHNwZWNpZmllZCwgbnVtYmVyL2ludGVnZXIgY2FuJ3QgYmUgc21hbGxlciB0aGFuIHRoaXMgbnVtYmVyXG4gICAgICogICAgICAgICBtYXg6IDEwMCAgICAgICAgICAgICAgIC0tIGlmIHNwZWNpZmllZCwgbnVtYmVyL2ludGVnZXIgY2FuJ3QgYmUgbGFyZ2VyIHRoYW4gdGhpcyBudW1iZXJcbiAgICAgKiAgICAgICB9LFxuICAgICAqICAgICAgIFwiYW4taW50ZWdlclwiOiB7XG4gICAgICogICAgICAgICB0aXRsZTogXCJBbiBJbnRlZ2VyXCIsXG4gICAgICogICAgICAgICBrZXk6IFwiYW5JbnRlZ2VyXCIsXG4gICAgICogICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgKiAgICAgICAgIHR5cGU6IFwiaW50ZWdlclwiLFxuICAgICAqICAgICAgICAgZW51bTogWzEsIDIsIDQsIDhdICAgICAtLSBpZiBzcGVjaWZpZWQsIHRoZSB2YWx1ZSBtdXN0IGJlIGEgcGFydCBvZiB0aGUgYXJyYXlcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gbWF5IGFsc28gYmUgc3BlY2lmaWVkIGFzIGFuIGFycmF5IG9mIG9iamVjdHMgd2l0aCB0aXRsZS92YWx1ZSBwcm9wZXJ0aWVzXG4gICAgICogICAgICAgfVxuICAgICAqICAgICB9XG4gKlxuICogQHBhcmFtIHsqfSBzb3VyY2UgICAgICAgc291cmNlIHRvIHZhbGlkYXRlXG4gKiBAcGFyYW0geyp9IHJ1bGVzICAgICAgICB2YWxpZGF0aW9uIHJ1bGVzXG4gKiBAcmV0dXJucyB7Kn0gICAgICAgICAgICBhbiBvYmplY3Qgd2l0aCB0d28gZmllbGRzOiBgdmFsaWRhdGVzOiB0cnVlfGZhbHNlYCBhbmQgYG1lc3NhZ2U6IHZhbGlkYXRpb24gbWVzc2FnZWBcbiAqXG4gKiBMSUNFTlNFOiBNSVRcbiAqIENvcHlyaWdodCBLZXJyaSBTaG90dHMsIDIwMTRcbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGUoIHNvdXJjZSwgcnVsZXMgKSB7XG4gIHZhciByID0ge1xuICAgIHZhbGlkYXRlczogdHJ1ZSxcbiAgICBtZXNzYWdlOiAgIFwiXCJcbiAgfTtcbiAgaWYgKCAhKCBydWxlcyBpbnN0YW5jZW9mIE9iamVjdCApICkge1xuICAgIHJldHVybiByO1xuICB9XG4gIC8vIGdvIG92ZXIgZWFjaCBydWxlIGluIGBydWxlc2BcbiAgT2JqZWN0LmtleXMoIHJ1bGVzICkuZm9yRWFjaCggZnVuY3Rpb24gKCBwcm9wICkge1xuICAgIGlmICggci52YWxpZGF0ZXMgKSB7XG4gICAgICAvLyBnZXQgdGhlIHJ1bGVcbiAgICAgIHZhciBydWxlID0gcnVsZXNbcHJvcF0sXG4gICAgICAgIHYgPSBzb3VyY2UsXG4gICAgICAvLyBhbmQgZ2V0IHRoZSB2YWx1ZSBpbiBzb3VyY2VcbiAgICAgICAgayA9ICggcnVsZS5rZXkgIT09IHVuZGVmaW5lZCApID8gcnVsZS5rZXkgOiBwcm9wLFxuICAgICAgICB0aXRsZSA9ICggcnVsZS50aXRsZSAhPT0gdW5kZWZpbmVkICkgPyBydWxlLnRpdGxlIDogcHJvcDtcbiAgICAgIGsgPSBrLnJlcGxhY2UoIFwiW1wiLCBcIi5cIiApLnJlcGxhY2UoIFwiXVwiLCBcIlwiICkucmVwbGFjZSggXCJcXFwiXCIsIFwiXCIgKTtcbiAgICAgIGsuc3BsaXQoIFwiLlwiICkuZm9yRWFjaCggZnVuY3Rpb24gKCBrZXlQYXJ0ICkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHYgPSB2W2tleVBhcnRdO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoICggZXJyICkge1xuICAgICAgICAgIHYgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gKTtcbiAgICAgIC8vIGlzIGl0IHJlcXVpcmVkP1xuICAgICAgaWYgKCAoICggcnVsZS5yZXF1aXJlZCAhPT0gdW5kZWZpbmVkICkgPyBydWxlLnJlcXVpcmVkIDogZmFsc2UgKSAmJiB2ID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgIHIubWVzc2FnZSA9IFwiTWlzc2luZyByZXF1aXJlZCB2YWx1ZSBcIiArIHRpdGxlO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBjYW4gaXQgYmUgbnVsbD9cbiAgICAgIGlmICggISggKCBydWxlLm51bGxhYmxlICE9PSB1bmRlZmluZWQgKSA/IHJ1bGUubnVsbGFibGUgOiBmYWxzZSApICYmIHYgPT09IG51bGwgKSB7XG4gICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgIHIubWVzc2FnZSA9IFwiVW5leHBlY3RlZCBudWxsIGluIFwiICsgdGl0bGU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIGlzIGl0IG9mIHRoZSByaWdodCB0eXBlP1xuICAgICAgaWYgKCB2ICE9PSBudWxsICYmIHYgIT09IHVuZGVmaW5lZCAmJiB2ICE9IFwiXCIgKSB7XG4gICAgICAgIHIubWVzc2FnZSA9IFwiVHlwZSBNaXNtYXRjaDsgZXhwZWN0ZWQgXCIgKyBydWxlLnR5cGUgKyBcIiBub3QgXCIgKyAoIHR5cGVvZiB2ICkgKyBcIiBpbiBcIiArIHRpdGxlO1xuICAgICAgICBzd2l0Y2ggKCBydWxlLnR5cGUgKSB7XG4gICAgICAgICAgY2FzZSBcImZsb2F0XCI6XG4gICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgaWYgKCB2ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgIGlmICggaXNOYU4oIHBhcnNlRmxvYXQoIHYgKSApICkge1xuICAgICAgICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICggdiAhPSBwYXJzZUZsb2F0KCB2ICkgKSB7XG4gICAgICAgICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJpbnRlZ2VyXCI6XG4gICAgICAgICAgICBpZiAoIHYgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgaWYgKCBpc05hTiggcGFyc2VJbnQoIHYsIDEwICkgKSApIHtcbiAgICAgICAgICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIHYgIT0gcGFyc2VJbnQoIHYsIDEwICkgKSB7XG4gICAgICAgICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJhcnJheVwiOlxuICAgICAgICAgICAgaWYgKCB2ICE9PSB1bmRlZmluZWQgJiYgISggdiBpbnN0YW5jZW9mIEFycmF5ICkgKSB7XG4gICAgICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XG4gICAgICAgICAgICBpZiAoIHYgaW5zdGFuY2VvZiBPYmplY3QgKSB7XG4gICAgICAgICAgICAgIGlmICggISggdiBpbnN0YW5jZW9mIERhdGUgKSApIHtcbiAgICAgICAgICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICggdiBpbnN0YW5jZW9mIERhdGUgJiYgaXNOYU4oIHYuZ2V0VGltZSgpICkgKSB7XG4gICAgICAgICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByLm1lc3NhZ2UgPSBcIkludmFsaWQgZGF0ZSBpbiBcIiArIHRpdGxlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIHYgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgICAgICAgICAgIGlmICggaXNOYU4oICggbmV3IERhdGUoIHYgKSApLmdldFRpbWUoKSApICkge1xuICAgICAgICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgci5tZXNzYWdlID0gXCJJbnZhbGlkIGRhdGUgaW4gXCIgKyB0aXRsZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICEoIHYgaW5zdGFuY2VvZiBcIm9iamVjdFwiICkgJiYgdiAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICBpZiAoICEoIHYgaW5zdGFuY2VvZiBPYmplY3QgKSAmJiB2ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCIqXCI6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKCAhKCB0eXBlb2YgdiA9PT0gcnVsZS50eXBlIHx8IHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSBudWxsICkgKSB7XG4gICAgICAgICAgICAgIHIudmFsaWRhdGVzID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAvLyBpZiB3ZSdyZSBzdGlsbCBoZXJlLCB0eXBlcyBhcmUgZ29vZC4gTm93IGNoZWNrIGxlbmd0aCwgcmFuZ2UsIGFuZCBlbnVtXG4gICAgICAgIC8vIGNoZWNrIHJhbmdlXG4gICAgICAgIHIubWVzc2FnZSA9IFwiVmFsdWUgb3V0IG9mIHJhbmdlIFwiICsgdiArIFwiIGluIFwiICsgdGl0bGU7XG4gICAgICAgIGlmICggdHlwZW9mIHJ1bGUubWluID09PSBcIm51bWJlclwiICYmIHYgPCBydWxlLm1pbiApIHtcbiAgICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBydWxlLm1heCA9PT0gXCJudW1iZXJcIiAmJiB2ID4gcnVsZS5tYXggKSB7XG4gICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgci5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgLy8gY2hlY2sgbGVuZ3RoXG4gICAgICAgIGlmICggKCB0eXBlb2YgcnVsZS5taW5MZW5ndGggPT09IFwibnVtYmVyXCIgJiYgdiAhPT0gdW5kZWZpbmVkICYmIHYubGVuZ3RoICE9PSB1bmRlZmluZWQgJiYgdi5sZW5ndGggPCBydWxlLm1pbkxlbmd0aCApIHx8XG4gICAgICAgICAgICAgKCB0eXBlb2YgcnVsZS5tYXhMZW5ndGggPT09IFwibnVtYmVyXCIgJiYgdiAhPT0gdW5kZWZpbmVkICYmIHYubGVuZ3RoICE9PSB1bmRlZmluZWQgJiYgdi5sZW5ndGggPiBydWxlLm1heExlbmd0aCApXG4gICAgICAgICkge1xuICAgICAgICAgIHIubWVzc2FnZSA9IFwiXCIgKyB0aXRsZSArIFwiIG91dCBvZiBsZW5ndGggcmFuZ2VcIjtcbiAgICAgICAgICByLnZhbGlkYXRlcyA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGVjayBlbnVtXG4gICAgICAgIGlmICggcnVsZS5lbnVtIGluc3RhbmNlb2YgT2JqZWN0ICYmIHYgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICBpZiAoIHJ1bGUuZW51bS5maWx0ZXIoIGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgICAgICAgaWYgKCBlLnZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUudmFsdWUgPT0gdjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZSA9PSB2O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ICkubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgci5tZXNzYWdlID0gXCJcIiArIHRpdGxlICsgXCIgY29udGFpbnMgdW5leHBlY3RlZCB2YWx1ZSBcIiArIHYgKyBcIiBpbiBcIiArIHRpdGxlO1xuICAgICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgcGF0dGVyblxuICAgICAgICBpZiAoIHJ1bGUucGF0dGVybiBpbnN0YW5jZW9mIE9iamVjdCAmJiB2ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgaWYgKCB2Lm1hdGNoKCBydWxlLnBhdHRlcm4gKSA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgIHIubWVzc2FnZSA9IFwiXCIgKyB0aXRsZSArIFwiIGRvZXNuJ3QgbWF0Y2ggcGF0dGVybiBpbiBcIiArIHRpdGxlO1xuICAgICAgICAgICAgci52YWxpZGF0ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gKTtcbiAgcmV0dXJuIHI7XG59XG52YXIgX3kgPSB7XG4gIFZFUlNJT046ICAgICAgICAgICAgICAgIFwiMC41LjE0MlwiLFxuICB2YWx1ZUZvcktleVBhdGg6ICAgICAgICB2YWx1ZUZvcktleVBhdGgsXG4gIGludGVycG9sYXRlOiAgICAgICAgICAgIGludGVycG9sYXRlLFxuICBtZXJnZTogICAgICAgICAgICAgICAgICBtZXJnZSxcbiAgdmFsaWRhdGU6ICAgICAgICAgICAgICAgdmFsaWRhdGUsXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGVsZW1lbnQgZnJvbSB0aGUgRE9NIHdpdGggdGhlIHNwZWNpZmllZFxuICAgKiBJRC4gU2ltaWxhciB0byAoYnV0IG5vdCBsaWtlKSBqUXVlcnkncyAkKCksIGV4Y2VwdFxuICAgKiB0aGF0IHRoaXMgaXMgYSBwdXJlIERPTSBlbGVtZW50LlxuICAgKiBAbWV0aG9kIGdlXG4gICAqIEBhbGlhcyAkaWRcbiAgICogQHBhcmFtICB7U3RyaW5nfSBlbGVtZW50SWQgICAgIGlkIHRvIHNlYXJjaCBmb3IsIHJlbGF0aXZlIHRvIGRvY3VtZW50XG4gICAqIEByZXR1cm4ge05vZGV9ICAgICAgICAgICAgICAgICBudWxsIGlmIG5vIG5vZGUgZm91bmRcbiAgICovXG4gIGdlOiAgICAgICAgICAgICAgICAgICAgICRpZC5iaW5kKCBkb2N1bWVudCApLFxuICAkaWQ6ICAgICAgICAgICAgICAgICAgICAkaWQuYmluZCggZG9jdW1lbnQgKSxcbiAgLyoqXG4gICAqIFJldHVybnMgYW4gZWxlbWVudCBmcm9tIHRoZSBET00gdXNpbmcgYHF1ZXJ5U2VsZWN0b3JgLlxuICAgKiBAbWV0aG9kIHFzXG4gICAqIEBhbGlhcyAkXG4gICAqIEBhbGlhcyAkMVxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgICAgICAgQ1NTIHNlbGVjdG9yIHRvIHNlYXJjaCwgcmVsYXRpdmUgdG8gZG9jdW1lbnRcbiAgICogQHJldHVybnMge05vZGV9ICAgICAgICAgICAgICAgIG51bGwgaWYgbm8gbm9kZSBmb3VuZCB0aGF0IG1hdGNoZXMgc2VhcmNoXG4gICAqL1xuICAkOiAgICAgICAgICAgICAgICAgICAgICAkLmJpbmQoIGRvY3VtZW50ICksXG4gICQxOiAgICAgICAgICAgICAgICAgICAgICQuYmluZCggZG9jdW1lbnQgKSxcbiAgcXM6ICAgICAgICAgICAgICAgICAgICAgJC5iaW5kKCBkb2N1bWVudCApLFxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgYSBnaXZlblxuICAgKiBzZWxlY3Rvci4gVGhlIGFycmF5IGlzIHByb2Nlc3NlZCB0byBiZSBhIHJlYWwgYXJyYXksXG4gICAqIG5vdCBhIG5vZGVMaXN0LlxuICAgKiBAbWV0aG9kIGdhY1xuICAgKiBAYWxpYXMgJCRcbiAgICogQGFsaWFzIHFzYVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNlbGVjdG9yICAgICAgQ1NTIHNlbGVjdG9yIHRvIHNlYXJjaCwgcmVsYXRpdmUgdG8gZG9jdW1lbnRcbiAgICogQHJldHVybiB7QXJyYXl9IG9mIE5vZGVzICAgICAgIEFycmF5IG9mIG5vZGVzOyBbXSBpZiBub25lIGZvdW5kXG4gICAqL1xuICAkJDogICAgICAgICAgICAgICAgICAgICAkJC5iaW5kKCBkb2N1bWVudCApLFxuICBnYWM6ICAgICAgICAgICAgICAgICAgICAkJC5iaW5kKCBkb2N1bWVudCApLFxuICBxc2E6ICAgICAgICAgICAgICAgICAgICAkJC5iaW5kKCBkb2N1bWVudCApLFxuICAvKipcbiAgICogUmV0dXJucyBhIENvbXB1dGVkIENTUyBTdHlsZSByZWFkeSBmb3IgaW50ZXJyb2dhdGlvbiBpZlxuICAgKiBgcHJvcGVydHlgIGlzIG5vdCBkZWZpbmVkLCBvciB0aGUgYWN0dWFsIHByb3BlcnR5IHZhbHVlXG4gICAqIGlmIGBwcm9wZXJ0eWAgaXMgZGVmaW5lZC5cbiAgICogQG1ldGhvZCBnY3NcbiAgICogQGFsaWFzIGdzY1xuICAgKiBAYWxpYXMgZ2V0Q29tcHV0ZWRTdHlsZVxuICAgKiBAcGFyYW0ge05vZGV9IGVsZW1lbnQgIEEgc3BlY2lmaWMgRE9NIGVsZW1lbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtwcm9wZXJ0eV0gIEEgQ1NTIHByb3BlcnR5IHRvIHF1ZXJ5XG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZ2V0Q29tcHV0ZWRTdHlsZTogICAgICAgZ2V0Q29tcHV0ZWRTdHlsZSxcbiAgZ2NzOiAgICAgICAgICAgICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZSxcbiAgZ3NjOiAgICAgICAgICAgICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZSxcbiAgLyoqXG4gICAqIFJldHVybnMgYSBwYXJzZWQgdGVtcGxhdGUuIFRoZSB0ZW1wbGF0ZSBjYW4gYmUgYSBzaW1wbGVcbiAgICogc3RyaW5nLCBpbiB3aGljaCBjYXNlIHRoZSByZXBsYWNlbWVudCB2YXJpYWJsZSBhcmUgcmVwbGFjZWRcbiAgICogYW5kIHJldHVybmVkIHNpbXBseSwgb3IgdGhlIHRlbXBsYXRlIGNhbiBiZSBhIERPTSBlbGVtZW50LFxuICAgKiBpbiB3aGljaCBjYXNlIHRoZSB0ZW1wbGF0ZSBpcyBhc3N1bWVkIHRvIGJlIHRoZSBET00gRWxlbWVudCdzXG4gICAqIGBpbm5lckhUTUxgLCBhbmQgdGhlbiB0aGUgcmVwbGFjZW1lbnQgdmFyaWFibGVzIGFyZSBwYXJzZWQuXG4gICAqXG4gICAqIFJlcGxhY2VtZW50IHZhcmlhYmxlcyBhcmUgb2YgdGhlIGZvcm0gYCVWQVJJQUJMRSVgLCBhbmRcbiAgICogY2FuIG9jY3VyIGFueXdoZXJlLCBub3QganVzdCB3aXRoaW4gc3RyaW5ncyBpbiBIVE1MLlxuICAgKlxuICAgKiBUaGUgcmVwbGFjZW1lbnRzIGFycmF5IGlzIG9mIHRoZSBmb3JtXG4gICAqIGBgYFxuICAgKiAgICAgeyBcIlZBUklBQkxFXCI6IHJlcGxhY2VtZW50LCBcIlZBUklBQkxFMlwiOiByZXBsYWNlbWVudCwgLi4uIH1cbiAgICogYGBgXG4gICAqXG4gICAqIElmIGBhZGR0bE9wdGlvbnNgIGlzIHNwZWNpZmllZCwgaXQgbWF5IG92ZXJyaWRlIHRoZSBkZWZhdWx0XG4gICAqIG9wdGlvbnMgd2hlcmUgYCVgIGlzIHVzZWQgYXMgYSBzdWJzdGl0dXRpb24gbWFya2VyIGFuZCBgdG9VcHBlckNhc2VgXG4gICAqIGlzIHVzZWQgYXMgYSB0cmFuc2Zvcm0uIEZvciBleGFtcGxlOlxuICAgKlxuICAgKiBgYGBcbiAgICogdGVtcGxhdGUgKCBcIkhlbGxvLCB7e25hbWV9fVwiLCB7XCJuYW1lXCI6IFwiTWFyeVwifSxcbiAgICogICAgICAgICAgICB7IGJyYWNrZXRzOiBbIFwie3tcIiwgXCJ9fVwiIF0sXG4gICAgICogICAgICAgICAgICAgIHRyYW5zZm9ybTogXCJ0b0xvd2VyQ2FzZVwiIH0gKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBtZXRob2QgdGVtcGxhdGVcbiAgICogQHBhcmFtICB7Tm9kZXxTdHJpbmd9IHRlbXBsYXRlRWxlbWVudFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJlcGxhY2VtZW50c1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICB0ZW1wbGF0ZTogICAgICAgICAgICAgICBmdW5jdGlvbiAoIHRlbXBsYXRlRWxlbWVudCwgcmVwbGFjZW1lbnRzLCBhZGR0bE9wdGlvbnMgKSB7XG4gICAgdmFyIGJyYWNrZXRzID0gW1wiJVwiLCBcIiVcIl0sXG4gICAgICB0cmFuc2Zvcm0gPSBcInRvVXBwZXJDYXNlXCIsXG4gICAgICB0ZW1wbGF0ZUhUTUwsIHRoZVZhciwgdGhpc1ZhcjtcbiAgICBpZiAoIHR5cGVvZiBhZGR0bE9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBhZGR0bE9wdGlvbnMuYnJhY2tldHMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIGJyYWNrZXRzID0gYWRkdGxPcHRpb25zLmJyYWNrZXRzO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2YgYWRkdGxPcHRpb25zLnRyYW5zZm9ybSA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgdHJhbnNmb3JtID0gYWRkdGxPcHRpb25zLnRyYW5zZm9ybTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCB0ZW1wbGF0ZUVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlICkge1xuICAgICAgdGVtcGxhdGVIVE1MID0gdGVtcGxhdGVFbGVtZW50LmlubmVySFRNTDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGVtcGxhdGVIVE1MID0gdGVtcGxhdGVFbGVtZW50O1xuICAgIH1cbiAgICBmb3IgKCB0aGVWYXIgaW4gcmVwbGFjZW1lbnRzICkge1xuICAgICAgaWYgKCByZXBsYWNlbWVudHMuaGFzT3duUHJvcGVydHkoIHRoZVZhciApICkge1xuICAgICAgICB0aGlzVmFyID0gYnJhY2tldHNbMF07XG4gICAgICAgIGlmICggdHJhbnNmb3JtICE9PSBcIlwiICkge1xuICAgICAgICAgIHRoaXNWYXIgKz0gdGhlVmFyW3RyYW5zZm9ybV0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzVmFyICs9IHRoZVZhcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzVmFyICs9IGJyYWNrZXRzWzFdO1xuICAgICAgICB3aGlsZSAoIHRlbXBsYXRlSFRNTC5pbmRleE9mKCB0aGlzVmFyICkgPiAtMSApIHtcbiAgICAgICAgICB0ZW1wbGF0ZUhUTUwgPSB0ZW1wbGF0ZUhUTUwucmVwbGFjZSggdGhpc1ZhciwgcmVwbGFjZW1lbnRzW3RoZVZhcl0gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVtcGxhdGVIVE1MO1xuICB9LFxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBhcHAgaXMgcnVubmluZyBpbiBhIENvcmRvdmEgY29udGFpbmVyLlxuICAgKiBPbmx5IHZhbGlkIGlmIGBleGVjdXRlV2hlblJlYWR5YCBpcyB1c2VkIHRvIHN0YXJ0IGFuIGFwcC5cbiAgICogQHByb3BlcnR5IHVuZGVyQ29yZG92YVxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgdW5kZXJDb3Jkb3ZhOiAgICAgICAgICAgZmFsc2UsXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSBjb251bmRydW0gb2YgZXhlY3V0aW5nIGEgYmxvY2sgb2YgY29kZSB3aGVuXG4gICAqIHRoZSBtb2JpbGUgZGV2aWNlIG9yIGRlc2t0b3AgYnJvd3NlciBpcyByZWFkeS4gSWYgcnVubmluZ1xuICAgKiB1bmRlciBDb3Jkb3ZhLCB0aGUgYGRldmljZXJlYWR5YCBldmVudCB3aWxsIGZpcmUsIGFuZFxuICAgKiB0aGUgYGNhbGxiYWNrYCB3aWxsIGV4ZWN1dGUuIE90aGVyd2lzZSwgYWZ0ZXIgMXMsIHRoZVxuICAgKiBgY2FsbGJhY2tgIHdpbGwgZXhlY3V0ZSAqaWYgaXQgaGFzbid0IGFscmVhZHkqLlxuICAgKlxuICAgKiBAbWV0aG9kIGV4ZWN1dGVXaGVuUmVhZHlcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIGV4ZWN1dGVXaGVuUmVhZHk6ICAgICAgIGZ1bmN0aW9uICggY2FsbGJhY2sgKSB7XG4gICAgdmFyIGV4ZWN1dGVkID0gZmFsc2U7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJkZXZpY2VyZWFkeVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoICFleGVjdXRlZCApIHtcbiAgICAgICAgZXhlY3V0ZWQgPSB0cnVlO1xuICAgICAgICBfeS51bmRlckNvcmRvdmEgPSB0cnVlO1xuICAgICAgICBpZiAoIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBmYWxzZSApO1xuICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICggIWV4ZWN1dGVkICkge1xuICAgICAgICBleGVjdXRlZCA9IHRydWU7XG4gICAgICAgIF95LnVuZGVyQ29yZG92YSA9IGZhbHNlO1xuICAgICAgICBpZiAoIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCAxMDAwICk7XG4gIH0sXG4gIC8qKlxuICAgKiA+IFRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIGFyZSByZWxhdGVkIHRvIGdsb2JhbGl6YXRpb24gYW5kIGxvY2FsaXphdGlvbiwgd2hpY2hcbiAgICogPiBhcmUgbm93IGNvbnNpZGVyZWQgdG8gYmUgY29yZSBmdW5jdGlvbnMgKHByZXZpb3VzbHkgaXQgd2FzIGJyb2tlbiBvdXQgaW5cbiAgICogPiBQS0xPQylcbiAgICovXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7U3RyaW5nfSBMb2NhbGVcbiAgICovXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhlIHVzZXIncyBsb2NhbGUuIEl0J3Mgb25seSB2YWxpZCBhZnRlclxuICAgKiBhIGNhbGwgdG8gYGdldFVzZXJMb2NhbGVgLCBidXQgaXQgY2FuIGJlIHdyaXR0ZW4gdG9cbiAgICogYXQgYW55IHRpbWUgaW4gb3JkZXIgdG8gb3ZlcnJpZGUgYGdldFVzZXJMb2NhbGVgJ3NcbiAgICogY2FsY3VsYXRpb24gb2YgdGhlIHVzZXIncyBsb2NhbGUuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSBjdXJyZW50VXNlckxvY2FsZVxuICAgKiBAZGVmYXVsdCAoZW1wdHkgc3RyaW5nKVxuICAgKiBAdHlwZSB7TG9jYWxlfVxuICAgKi9cbiAgY3VycmVudFVzZXJMb2NhbGU6ICAgICAgXCJcIixcbiAgLyoqXG4gICAqIEEgdHJhbnNsYXRpb24gbWF0cml4LiBVc2VkIGJ5IGBhZGRUcmFuc2xhdGlvbihzKWAgYW5kIGBUYC5cbiAgICpcbiAgICogQHByb3BlcnR5IGxvY2FsaXplZFRleHRcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGxvY2FsaXplZFRleHQ6ICAgICAgICAgIHt9LFxuICAvKipcbiAgICogR2l2ZW4gYSBsb2NhbGUgc3RyaW5nLCBub3JtYWxpemUgaXQgdG8gdGhlIGZvcm0gb2YgYGxhLVJFYCBvciBgbGFgLCBkZXBlbmRpbmcgb24gdGhlIGxlbmd0aC5cbiAgICogYGBgXG4gICAqICAgICBcImVudXNcIiwgXCJlbl91c1wiLCBcImVuXy0tLV9fLS1VU1wiLCBcIkVOLVVTXCIgLS0+IFwiZW4tVVNcIlxuICAgKiAgICAgXCJlblwiLCBcImVuLVwiLCBcIkVOIVwiIC0tPiBcImVuXCJcbiAgICogYGBgXG4gICAqIEBtZXRob2Qgbm9ybWFsaXplTG9jYWxlXG4gICAqIEBwYXJhbSB7TG9jYWxlfSB0aGVMb2NhbGVcbiAgICovXG4gIG5vcm1hbGl6ZUxvY2FsZTogICAgICAgIGZ1bmN0aW9uICggdGhlTG9jYWxlICkge1xuICAgIHZhciB0aGVOZXdMb2NhbGUgPSB0aGVMb2NhbGU7XG4gICAgaWYgKCB0aGVOZXdMb2NhbGUubGVuZ3RoIDwgMiApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvciggXCJGYXRhbDogaW52YWxpZCBsb2NhbGU7IG5vdCBvZiB0aGUgZm9ybWF0IGxhLVJFLlwiICk7XG4gICAgfVxuICAgIHZhciB0aGVMYW5ndWFnZSA9IHRoZU5ld0xvY2FsZS5zdWJzdHIoIDAsIDIgKS50b0xvd2VyQ2FzZSgpLFxuICAgICAgdGhlUmVnaW9uID0gdGhlTmV3TG9jYWxlLnN1YnN0ciggLTIgKS50b1VwcGVyQ2FzZSgpO1xuICAgIGlmICggdGhlTmV3TG9jYWxlLmxlbmd0aCA8IDQgKSB7XG4gICAgICB0aGVSZWdpb24gPSBcIlwiOyAvLyB0aGVyZSBjYW4ndCBwb3NzaWJseSBiZSBhIHZhbGlkIHJlZ2lvbiBvbiBhIDMtY2hhciBzdHJpbmdcbiAgICB9XG4gICAgaWYgKCB0aGVSZWdpb24gIT09IFwiXCIgKSB7XG4gICAgICB0aGVOZXdMb2NhbGUgPSB0aGVMYW5ndWFnZSArIFwiLVwiICsgdGhlUmVnaW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGVOZXdMb2NhbGUgPSB0aGVMYW5ndWFnZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoZU5ld0xvY2FsZTtcbiAgfSxcbiAgLyoqXG4gICAqIFNldHMgdGhlIGN1cnJlbnQgbG9jYWxlIGZvciBqUXVlcnkvR2xvYmFsaXplXG4gICAqIEBtZXRob2Qgc2V0R2xvYmFsaXphdGlvbkxvY2FsZVxuICAgKiBAcGFyYW0ge0xvY2FsZX0gdGhlTG9jYWxlXG4gICAqL1xuICBzZXRHbG9iYWxpemF0aW9uTG9jYWxlOiBmdW5jdGlvbiAoIHRoZUxvY2FsZSApIHtcbiAgICB2YXIgdGhlTmV3TG9jYWxlID0gX3kubm9ybWFsaXplTG9jYWxlKCB0aGVMb2NhbGUgKTtcbiAgICBHbG9iYWxpemUuY3VsdHVyZSggdGhlTmV3TG9jYWxlICk7XG4gIH0sXG4gIC8qKlxuICAgKiBBZGQgYSB0cmFuc2xhdGlvbiB0byB0aGUgZXhpc3RpbmcgdHJhbnNsYXRpb24gbWF0cml4XG4gICAqIEBtZXRob2QgYWRkVHJhbnNsYXRpb25cbiAgICogQHBhcmFtIHtMb2NhbGV9IGxvY2FsZVxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgKi9cbiAgYWRkVHJhbnNsYXRpb246ICAgICAgICAgZnVuY3Rpb24gKCBsb2NhbGUsIGtleSwgdmFsdWUgKSB7XG4gICAgdmFyIHNlbGYgPSBfeSxcbiAgICAvLyB3ZSdsbCBzdG9yZSB0cmFuc2xhdGlvbnMgd2l0aCB1cHBlci1jYXNlIGxvY2FsZXMsIHNvIGNhc2UgbmV2ZXIgbWF0dGVyc1xuICAgICAgdGhlTmV3TG9jYWxlID0gc2VsZi5ub3JtYWxpemVMb2NhbGUoIGxvY2FsZSApLnRvVXBwZXJDYXNlKCk7XG4gICAgLy8gc3RvcmUgdGhlIHZhbHVlXG4gICAgaWYgKCB0eXBlb2Ygc2VsZi5sb2NhbGl6ZWRUZXh0W3RoZU5ld0xvY2FsZV0gPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBzZWxmLmxvY2FsaXplZFRleHRbdGhlTmV3TG9jYWxlXSA9IHt9O1xuICAgIH1cbiAgICBzZWxmLmxvY2FsaXplZFRleHRbdGhlTmV3TG9jYWxlXVtrZXkudG9VcHBlckNhc2UoKV0gPSB2YWx1ZTtcbiAgfSxcbiAgLyoqXG4gICAqIEFkZCB0cmFuc2xhdGlvbnMgaW4gYmF0Y2gsIGFzIGZvbGxvd3M6XG4gICAqIGBgYFxuICAgKiAgIHtcbiAgICAgKiAgICAgXCJIRUxMT1wiOlxuICAgICAqICAgICB7XG4gICAgICogICAgICAgXCJlbi1VU1wiOiBcIkhlbGxvXCIsXG4gICAgICogICAgICAgXCJlcy1VU1wiOiBcIkhvbGFcIlxuICAgICAqICAgICB9LFxuICAgICAqICAgICBcIkdPT0RCWUVcIjpcbiAgICAgKiAgICAge1xuICAgICAqICAgICAgIFwiZW4tVVNcIjogXCJCeWVcIixcbiAgICAgKiAgICAgICBcImVzLVVTXCI6IFwiQWRpb3NcIlxuICAgICAqICAgICB9XG4gICAgICogICB9XG4gICAqIGBgYFxuICAgKiBAbWV0aG9kIGFkZFRyYW5zbGF0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb1xuICAgKi9cbiAgYWRkVHJhbnNsYXRpb25zOiAgICAgICAgZnVuY3Rpb24gKCBvICkge1xuICAgIHZhciBzZWxmID0gX3k7XG4gICAgZm9yICggdmFyIGtleSBpbiBvICkge1xuICAgICAgaWYgKCBvLmhhc093blByb3BlcnR5KCBrZXkgKSApIHtcbiAgICAgICAgZm9yICggdmFyIGxvY2FsZSBpbiBvW2tleV0gKSB7XG4gICAgICAgICAgaWYgKCBvW2tleV0uaGFzT3duUHJvcGVydHkoIGxvY2FsZSApICkge1xuICAgICAgICAgICAgc2VsZi5hZGRUcmFuc2xhdGlvbiggbG9jYWxlLCBrZXksIG9ba2V5XVtsb2NhbGVdICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdXNlcidzIGxvY2FsZSAoZS5nLiwgYGVuLVVTYCBvciBgZnItRlJgKS4gSWYgb25lXG4gICAqIGNhbid0IGJlIGZvdW5kLCBgZW4tVVNgIGlzIHJldHVybmVkLiBJZiBgY3VycmVudFVzZXJMb2NhbGVgXG4gICAqIGlzIGFscmVhZHkgZGVmaW5lZCwgaXQgd29uJ3QgYXR0ZW1wdCB0byByZWNhbGN1bGF0ZSBpdC5cbiAgICogQG1ldGhvZCBnZXRVc2VyTG9jYWxlXG4gICAqIEByZXR1cm4ge0xvY2FsZX1cbiAgICovXG4gIGdldFVzZXJMb2NhbGU6ICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IF95O1xuICAgIGlmICggc2VsZi5jdXJyZW50VXNlckxvY2FsZSApIHtcbiAgICAgIHJldHVybiBzZWxmLmN1cnJlbnRVc2VyTG9jYWxlO1xuICAgIH1cbiAgICB2YXIgY3VycmVudFBsYXRmb3JtID0gXCJ1bmtub3duXCI7XG4gICAgaWYgKCB0eXBlb2YgZGV2aWNlICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgY3VycmVudFBsYXRmb3JtID0gZGV2aWNlLnBsYXRmb3JtO1xuICAgIH1cbiAgICB2YXIgdXNlckxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAvLyBhIHN1aXRhYmxlIGRlZmF1bHRcbiAgICBpZiAoIGN1cnJlbnRQbGF0Zm9ybSA9PT0gXCJBbmRyb2lkXCIgKSB7XG4gICAgICAvLyBwYXJzZSB0aGUgbmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgICAgdmFyIHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQsXG4gICAgICAvLyBpbnNwaXJlZCBieSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS83NzI4NTA3Lzc0MTA0M1xuICAgICAgICB0ZW1wTG9jYWxlID0gdXNlckFnZW50Lm1hdGNoKCAvQW5kcm9pZC4qKFthLXpBLVpdezJ9LVthLXpBLVpdezJ9KS8gKTtcbiAgICAgIGlmICggdGVtcExvY2FsZSApIHtcbiAgICAgICAgdXNlckxvY2FsZSA9IHRlbXBMb2NhbGVbMV07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJMb2NhbGUgPSBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZSB8fCBuYXZpZ2F0b3Iuc3lzdGVtTGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLnVzZXJMYW5ndWFnZTtcbiAgICB9XG4gICAgc2VsZi5jdXJyZW50VXNlckxvY2FsZSA9IHNlbGYubm9ybWFsaXplTG9jYWxlKCB1c2VyTG9jYWxlICk7XG4gICAgcmV0dXJuIHNlbGYuY3VycmVudFVzZXJMb2NhbGU7XG4gIH0sXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkZXZpY2UgbG9jYWxlLCBpZiBhdmFpbGFibGUuIEl0IGRlcGVuZHMgb24gdGhlXG4gICAqIEdsb2JhbGl6YXRpb24gcGx1Z2luIHByb3ZpZGVkIGJ5IENvcmRvdmEsIGJ1dCBpZiB0aGVcbiAgICogcGx1Z2luIGlzIG5vdCBhdmFpbGFibGUsIGl0IGFzc3VtZXMgdGhlIGRldmljZSBsb2NhbGVcbiAgICogY2FuJ3QgYmUgZGV0ZXJtaW5lZCByYXRoZXIgdGhhbiB0aHJvdyBhbiBlcnJvci5cbiAgICpcbiAgICogT25jZSB0aGUgbG9jYWxlIGlzIGRldGVybWluZWQgb25lIHdheSBvciB0aGUgb3RoZXIsIGBjYWxsYmFja2BcbiAgICogaXMgY2FsbGVkLlxuICAgKlxuICAgKiBAbWV0aG9kIGdldERldmljZUxvY2FsZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgZ2V0RGV2aWNlTG9jYWxlOiAgICAgICAgZnVuY3Rpb24gKCBjYWxsYmFjayApIHtcbiAgICB2YXIgc2VsZiA9IF95O1xuICAgIGlmICggdHlwZW9mIG5hdmlnYXRvci5nbG9iYWxpemF0aW9uICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgaWYgKCB0eXBlb2YgbmF2aWdhdG9yLmdsb2JhbGl6YXRpb24uZ2V0TG9jYWxlTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgbmF2aWdhdG9yLmdsb2JhbGl6YXRpb24uZ2V0TG9jYWxlTmFtZSggZnVuY3Rpb24gKCBsb2NhbGUgKSB7XG4gICAgICAgICAgc2VsZi5jdXJyZW50VXNlckxvY2FsZSA9IHNlbGYubm9ybWFsaXplTG9jYWxlKCBsb2NhbGUudmFsdWUgKTtcbiAgICAgICAgICBpZiAoIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBlcnJvcjsgZ28gYWhlYWQgYW5kIGNhbGwgdGhlIGNhbGxiYWNrLCBidXQgZG9uJ3Qgc2V0IHRoZSBsb2NhbGVcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJXQVJOOiBDb3VsZG4ndCBnZXQgdXNlciBsb2NhbGUgZnJvbSBkZXZpY2UuXCIgKTtcbiAgICAgICAgICBpZiAoIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAgKiBMb29rcyB1cCBhIHRyYW5zbGF0aW9uIGZvciBhIGdpdmVuIGBrZXlgIGFuZCBsb2NhbGUuIElmXG4gICAqIHRoZSB0cmFuc2xhdGlvbiBkb2VzIG5vdCBleGlzdCwgYHVuZGVmaW5lZGAgaXMgcmV0dXJuZWQuXG4gICAqXG4gICAqIFRoZSBga2V5YCBpcyBjb252ZXJ0ZWQgdG8gdXBwZXJjYXNlLCBhbmQgdGhlIGxvY2FsZSBpc1xuICAgKiBwcm9wZXJseSBub3JtYWxpemVkIGFuZCB0aGVuIGNvbnZlcnRlZCB0byB1cHBlcmNhc2UgYmVmb3JlXG4gICAqIGFueSBsb29rdXAgaXMgYXR0ZW1wdGVkLlxuICAgKlxuICAgKiBAbWV0aG9kIGxvb2t1cFRyYW5zbGF0aW9uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICogQHBhcmFtIHtMb2NhbGV9IFt0aGVMb2NhbGVdXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgbG9va3VwVHJhbnNsYXRpb246ICAgICAgZnVuY3Rpb24gKCBrZXksIHRoZUxvY2FsZSApIHtcbiAgICB2YXIgc2VsZiA9IF95LFxuICAgICAgdXBwZXJLZXkgPSBrZXkudG9VcHBlckNhc2UoKSxcbiAgICAgIHVzZXJMb2NhbGUgPSB0aGVMb2NhbGUgfHwgc2VsZi5nZXRVc2VyTG9jYWxlKCk7XG4gICAgdXNlckxvY2FsZSA9IHNlbGYubm9ybWFsaXplTG9jYWxlKCB1c2VyTG9jYWxlICkudG9VcHBlckNhc2UoKTtcbiAgICAvLyBsb29rIGl0IHVwIGJ5IGNoZWNraW5nIGlmIHVzZXJMb2NhbGUgZXhpc3RzLCBhbmQgdGhlbiBpZiB0aGUga2V5ICh1cHBlcmNhc2VkKSBleGlzdHNcbiAgICBpZiAoIHR5cGVvZiBzZWxmLmxvY2FsaXplZFRleHRbdXNlckxvY2FsZV0gIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICBpZiAoIHR5cGVvZiBzZWxmLmxvY2FsaXplZFRleHRbdXNlckxvY2FsZV1bdXBwZXJLZXldICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICByZXR1cm4gc2VsZi5sb2NhbGl6ZWRUZXh0W3VzZXJMb2NhbGVdW3VwcGVyS2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaWYgbm90IGZvdW5kLCB3ZSBkb24ndCByZXR1cm4gYW55dGhpbmdcbiAgICByZXR1cm4gdm9pZCggMCApO1xuICB9LFxuICAvKipcbiAgICogQHByb3BlcnR5IGxvY2FsZU9mTGFzdFJlc29ydFxuICAgKiBAZGVmYXVsdCBcImVuLVVTXCJcbiAgICogQHR5cGUge0xvY2FsZX1cbiAgICovXG4gIGxvY2FsZU9mTGFzdFJlc29ydDogICAgIFwiZW4tVVNcIixcbiAgLyoqXG4gICAqIEBwcm9wZXJ0eSBsYW5ndWFnZU9mTGFzdFJlc29ydFxuICAgKiBAZGVmYXVsdCBcImVuXCJcbiAgICogQHR5cGUge0xvY2FsZX1cbiAgICovXG4gIGxhbmd1YWdlT2ZMYXN0UmVzb3J0OiAgIFwiZW5cIixcbiAgLyoqXG4gICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciB0cmFuc2xhdGluZyB0ZXh0LiBLZXkgaXMgdGhlIG9ubHlcbiAgICogcmVxdWlyZWQgdmFsdWUgYW5kIGNhc2UgZG9lc24ndCBtYXR0ZXIgKGl0J3MgdXBwZXJjYXNlZCkuIFJlcGxhY2VtZW50XG4gICAqIHZhcmlhYmxlcyBjYW4gYmUgc3BlY2lmaWVkIHVzaW5nIHJlcGxhY2VtZW50IHZhcmlhYmxlcyBvZiB0aGUgZm9ybSBgeyBcIlZBUlwiOlwiVkFMVUVcIiB9YCxcbiAgICogdXNpbmcgYCVWQVIlYCBpbiB0aGUga2V5L3ZhbHVlIHJldHVybmVkLiBJZiBgbG9jYWxlYCBpcyBzcGVjaWZpZWQsIGl0XG4gICAqIHRha2VzIHByZWNlZGVuY2Ugb3ZlciB0aGUgdXNlcidzIGN1cnJlbnQgbG9jYWxlLlxuICAgKlxuICAgKiBAbWV0aG9kIFRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgKiBAcGFyYW0ge09iamVjdH0gW3Bhcm1zXSByZXBsYWNlbWVudCB2YXJpYWJsZXNcbiAgICogQHBhcmFtIHtMb2NhbGV9IFtsb2NhbGVdXG4gICAqL1xuICBUOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoIGtleSwgcGFybXMsIGxvY2FsZSApIHtcbiAgICB2YXIgc2VsZiA9IF95LFxuICAgICAgdXNlckxvY2FsZSA9IGxvY2FsZSB8fCBzZWxmLmdldFVzZXJMb2NhbGUoKSxcbiAgICAgIGN1cnJlbnRWYWx1ZTtcbiAgICBpZiAoIHR5cGVvZiAoIGN1cnJlbnRWYWx1ZSA9IHNlbGYubG9va3VwVHJhbnNsYXRpb24oIGtleSwgdXNlckxvY2FsZSApICkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAvLyB3ZSBoYXZlbid0IGZvdW5kIGl0IHVuZGVyIHRoZSBnaXZlbiBsb2NhbGUgKG9mIGZvcm06IHh4LVhYKSwgdHJ5IHRoZSBmYWxsYmFjayBsb2NhbGUgKHh4KVxuICAgICAgdXNlckxvY2FsZSA9IHVzZXJMb2NhbGUuc3Vic3RyKCAwLCAyICk7XG4gICAgICBpZiAoIHR5cGVvZiAoIGN1cnJlbnRWYWx1ZSA9IHNlbGYubG9va3VwVHJhbnNsYXRpb24oIGtleSwgdXNlckxvY2FsZSApICkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIC8vIHdlIGhhdmVuJ3QgZm91bmQgaXQgdW5kZXIgYW55IG9mIHRoZSBnaXZlbiBsb2NhbGVzOyB0cnkgdGhlIGxhbmd1YWdlIG9mIGxhc3QgcmVzb3J0XG4gICAgICAgIGlmICggdHlwZW9mICggY3VycmVudFZhbHVlID0gc2VsZi5sb29rdXBUcmFuc2xhdGlvbigga2V5LCBzZWxmLmxhbmd1YWdlT2ZMYXN0UmVzb3J0ICkgKSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICAvLyB3ZSBoYXZlbid0IGZvdW5kIGl0IHVuZGVyIGFueSBvZiB0aGUgZ2l2ZW4gbG9jYWxlczsgdHJ5IGxvY2FsZSBvZiBsYXN0IHJlc29ydFxuICAgICAgICAgIGlmICggdHlwZW9mICggY3VycmVudFZhbHVlID0gc2VsZi5sb29rdXBUcmFuc2xhdGlvbigga2V5LCBzZWxmLmxvY2FsZU9mTGFzdFJlc29ydCApICkgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgICAvLyB3ZSBkaWRuJ3QgZmluZCBpdCBhdCBhbGwuLi4gd2UnbGwgdXNlIHRoZSBrZXlcbiAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IGtleTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbGYudGVtcGxhdGUoIGN1cnJlbnRWYWx1ZSwgcGFybXMgKTtcbiAgfSxcbiAgLyoqXG4gICAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBsb2NhbGl6aW5nIG51bWJlcnMgYWNjb3JkaW5nIHRoZSBmb3JtYXQgKG9wdGlvbmFsKSBhbmRcbiAgICogdGhlIGxvY2FsZSAob3B0aW9uYWwpLiB0aGVGb3JtYXQgaXMgdHlwaWNhbGx5IHRoZSBudW1iZXIgb2YgcGxhY2VzIHRvIHVzZTsgXCJuXCIgaWZcbiAgICogbm90IHNwZWNpZmllZC5cbiAgICpcbiAgICogQG1ldGhvZCBOXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aGVOdW1iZXJcbiAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSB0aGVGb3JtYXRcbiAgICogQHBhcmFtIHtMb2NhbGV9IFt0aGVMb2NhbGVdXG4gICAqL1xuICBOOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoIHRoZU51bWJlciwgdGhlRm9ybWF0LCB0aGVMb2NhbGUgKSB7XG4gICAgdmFyIHNlbGYgPSBfeSxcbiAgICAgIGlGb3JtYXQgPSBcIm5cIiArICggKCB0eXBlb2YgdGhlRm9ybWF0ID09PSBcInVuZGVmaW5lZFwiICkgPyBcIjBcIiA6IHRoZUZvcm1hdCApLFxuICAgICAgaUxvY2FsZSA9IHRoZUxvY2FsZSB8fCBzZWxmLmdldFVzZXJMb2NhbGUoKTtcbiAgICBzZWxmLnNldEdsb2JhbGl6YXRpb25Mb2NhbGUoIGlMb2NhbGUgKTtcbiAgICByZXR1cm4gR2xvYmFsaXplLmZvcm1hdCggdGhlTnVtYmVyLCBpRm9ybWF0ICk7XG4gIH0sXG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgbG9jYWxpemluZyBjdXJyZW5jeS4gdGhlRm9ybWF0IGlzIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXNcbiAgICogb3IgXCIyXCIgaWYgbm90IHNwZWNpZmllZC4gSWYgdGhlcmUgYXJlIG1vcmUgcGxhY2VzIHRoYW4gZGlnaXRzLCBwYWRkaW5nIGlzIGFkZGVkOyBpZiB0aGVyZVxuICAgKiBhcmUgZmV3ZXIgcGxhY2VzLCByb3VuZGluZyBpcyBwZXJmb3JtZWQuXG4gICAqXG4gICAqIEBtZXRob2QgQ1xuICAgKiBAcGFyYW0ge051bWJlcn0gdGhlTnVtYmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVGb3JtYXRcbiAgICogQHBhcmFtIHtMb2NhbGV9IFt0aGVMb2NhbGVdXG4gICAqL1xuICBDOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoIHRoZU51bWJlciwgdGhlRm9ybWF0LCB0aGVMb2NhbGUgKSB7XG4gICAgdmFyIHNlbGYgPSBfeSxcbiAgICAgIGlGb3JtYXQgPSBcImNcIiArICggKCB0eXBlb2YgdGhlRm9ybWF0ID09PSBcInVuZGVmaW5lZFwiICkgPyBcIjJcIiA6IHRoZUZvcm1hdCApLFxuICAgICAgaUxvY2FsZSA9IHRoZUxvY2FsZSB8fCBzZWxmLmdldFVzZXJMb2NhbGUoKTtcbiAgICBzZWxmLnNldEdsb2JhbGl6YXRpb25Mb2NhbGUoIGlMb2NhbGUgKTtcbiAgICByZXR1cm4gR2xvYmFsaXplLmZvcm1hdCggdGhlTnVtYmVyLCBpRm9ybWF0ICk7XG4gIH0sXG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgbG9jYWxpemluZyBwZXJjZW50YWdlcy4gdGhlRm9ybWF0IHNwZWNpZmllcyB0aGUgbnVtYmVyIG9mXG4gICAqIGRlY2ltYWwgcGxhY2VzOyB0d28gaWYgbm90IHNwZWNpZmllZC5cbiAgICogQG1ldGhvZCBQQ1RcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRoZU51bWJlclxuICAgKiBAcGFyYW0ge051bWJlcn0gdGhlRm9ybWF0XG4gICAqIEBwYXJhbSB7TG9jYWxlfSBbdGhlTG9jYWxlXVxuICAgKi9cbiAgUENUOiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCB0aGVOdW1iZXIsIHRoZUZvcm1hdCwgdGhlTG9jYWxlICkge1xuICAgIHZhciBzZWxmID0gX3ksXG4gICAgICBpRm9ybWF0ID0gXCJwXCIgKyAoICggdHlwZW9mIHRoZUZvcm1hdCA9PT0gXCJ1bmRlZmluZWRcIiApID8gXCIyXCIgOiB0aGVGb3JtYXQgKSxcbiAgICAgIGlMb2NhbGUgPSB0aGVMb2NhbGUgfHwgc2VsZi5nZXRVc2VyTG9jYWxlKCk7XG4gICAgc2VsZi5zZXRHbG9iYWxpemF0aW9uTG9jYWxlKCBpTG9jYWxlICk7XG4gICAgcmV0dXJuIEdsb2JhbGl6ZS5mb3JtYXQoIHRoZU51bWJlciwgaUZvcm1hdCApO1xuICB9LFxuICAvKipcbiAgICogQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGxvY2FsaXppbmcgZGF0ZXMuXG4gICAqXG4gICAqIHRoZUZvcm1hdCBzcGVjaWZpZXMgdGhlIGZvcm1hdDsgXCJkXCIgaXMgYXNzdW1lZCBpZiBub3QgcHJvdmlkZWQuXG4gICAqXG4gICAqIEBtZXRob2QgRFxuICAgKiBAcGFyYW0ge0RhdGV9IHRoZURhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRoZUZvcm1hdFxuICAgKiBAcGFyYW0ge0xvY2FsZX0gW3RoZUxvY2FsZV1cbiAgICovXG4gIEQ6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICggdGhlRGF0ZSwgdGhlRm9ybWF0LCB0aGVMb2NhbGUgKSB7XG4gICAgdmFyIHNlbGYgPSBfeSxcbiAgICAgIGlGb3JtYXQgPSB0aGVGb3JtYXQgfHwgXCJkXCIsXG4gICAgICBpTG9jYWxlID0gdGhlTG9jYWxlIHx8IHNlbGYuZ2V0VXNlckxvY2FsZSgpO1xuICAgIHNlbGYuc2V0R2xvYmFsaXphdGlvbkxvY2FsZSggaUxvY2FsZSApO1xuICAgIHJldHVybiBHbG9iYWxpemUuZm9ybWF0KCB0aGVEYXRlLCBpRm9ybWF0ICk7XG4gIH0sXG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgalF1ZXJ5L0dsb2JhbGl6ZSdzIGBmb3JtYXRgIG1ldGhvZFxuICAgKiBAbWV0aG9kIGZvcm1hdFxuICAgKiBAcGFyYW0geyp9IHRoZVZhbHVlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVGb3JtYXRcbiAgICogQHBhcmFtIHtMb2NhbGV9IFt0aGVMb2NhbGVdXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgZm9ybWF0OiAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCB0aGVWYWx1ZSwgdGhlRm9ybWF0LCB0aGVMb2NhbGUgKSB7XG4gICAgdmFyIHNlbGYgPSBfeSxcbiAgICAgIGlGb3JtYXQgPSB0aGVGb3JtYXQsXG4gICAgICBpTG9jYWxlID0gdGhlTG9jYWxlIHx8IHNlbGYuZ2V0VXNlckxvY2FsZSgpO1xuICAgIHNlbGYuc2V0R2xvYmFsaXphdGlvbkxvY2FsZSggaUxvY2FsZSApO1xuICAgIHJldHVybiBHbG9iYWxpemUuZm9ybWF0KCB0aGVWYWx1ZSwgaUZvcm1hdCApO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBfeTtcbiIsIi8qKlxuICpcbiAqIFByb3ZpZGVzIGRhdGUvdGltZSBjb252ZW5pZW5jZSBtZXRob2RzXG4gKlxuICogQG1vZHVsZSBkYXRldGltZS5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNFxuICpcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDEzIEtlcnJpIFNob3R0cywgcGhvdG9LYW5keSBTdHVkaW9zIExMQ1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllc1xuICogb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUlxuICogUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVFxuICogT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqIGBgYFxuICovXG4vKmdsb2JhbCBtb2R1bGUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdGltZSBpbiB0aGUgVW5peCB0aW1lIGZvcm1hdFxuICAgKiBAbWV0aG9kIGdldFVuaXhUaW1lXG4gICAqIEByZXR1cm4ge1VuaXhUaW1lfVxuICAgKi9cbiAgZ2V0VW5peFRpbWU6ICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoIG5ldyBEYXRlKCkgKS5nZXRUaW1lKCk7XG4gIH0sXG4gIC8qKlxuICAgKiAjIFBSRUNJU0lPTl94IENvbnN0YW50c1xuICAgKiBUaGVzZSBzcGVjaWZ5IHRoZSBhbW91bnQgb2YgcHJlY2lzaW9uIHJlcXVpcmVkIGZvciBgZ2V0UGFydHNGcm9tU2Vjb25kc2AuXG4gICAqIEZvciBleGFtcGxlLCBpZiBgUFJFQ0lTSU9OX0RBWVNgIGlzIHNwZWNpZmllZCwgdGhlIG51bWJlciBvZiBwYXJ0cyBvYnRhaW5lZFxuICAgKiBjb25zaXN0IG9mIGRheXMsIGhvdXJzLCBtaW51dGVzLCBhbmQgc2Vjb25kcy5cbiAgICovXG4gIFBSRUNJU0lPTl9TRUNPTkRTOiAgIDEsXG4gIFBSRUNJU0lPTl9NSU5VVEVTOiAgIDIsXG4gIFBSRUNJU0lPTl9IT1VSUzogICAgIDMsXG4gIFBSRUNJU0lPTl9EQVlTOiAgICAgIDQsXG4gIFBSRUNJU0lPTl9XRUVLUzogICAgIDUsXG4gIFBSRUNJU0lPTl9ZRUFSUzogICAgIDYsXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7e2ZyYWN0aW9uczogbnVtYmVyLCBzZWNvbmRzOiBudW1iZXIsIG1pbnV0ZXM6IG51bWJlciwgaG91cnM6IG51bWJlciwgZGF5czogbnVtYmVyLCB3ZWVrczogbnVtYmVyLCB5ZWFyczogbnVtYmVyfX0gVGltZVBhcnRzXG4gICAqL1xuICAvKipcbiAgICogVGFrZXMgYSBnaXZlbiBudW1iZXIgb2Ygc2Vjb25kcyBhbmQgcmV0dXJucyBhbiBvYmplY3QgY29uc2lzdGluZyBvZiB0aGUgbnVtYmVyIG9mIHNlY29uZHMsIG1pbnV0ZXMsIGhvdXJzLCBldGMuXG4gICAqIFRoZSB2YWx1ZSBpcyBsaW1pdGVkIGJ5IHRoZSBwcmVjaXNpb24gcGFyYW1ldGVyIC0tIHdoaWNoIG11c3QgYmUgc3BlY2lmaWVkLiBXaGljaCBldmVyIHZhbHVlIGlzIHNwZWNpZmllZCB3aWxsXG4gICAqIGJlIHRoZSBtYXhpbXVtIGxpbWl0IGZvciB0aGUgcm91dGluZTsgdGhhdCBpcyBgUFJFQ0lTSU9OX0RBWVNgIHdpbGwgbmV2ZXIgcmV0dXJuIGEgcmVzdWx0IGZvciB3ZWVrcyBvciB5ZWFycy5cbiAgICogQG1ldGhvZCBnZXRQYXJ0c0Zyb21TZWNvbmRzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBzZWNvbmRzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwcmVjaXNpb25cbiAgICogQHJldHVybnMge1RpbWVQYXJ0c31cbiAgICovXG4gIGdldFBhcnRzRnJvbVNlY29uZHM6IGZ1bmN0aW9uICggc2Vjb25kcywgcHJlY2lzaW9uICkge1xuICAgIHZhciBwYXJ0VmFsdWVzID0gWzAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICAgICAgbW9kVmFsdWVzID0gWzEsIDYwLCAzNjAwLCA4NjQwMCwgNjA0ODAwLCAzMTU1NzYwMF07XG4gICAgZm9yICggdmFyIGkgPSBwcmVjaXNpb247IGkgPiAwOyBpLS0gKSB7XG4gICAgICBpZiAoIGkgPT09IDEgKSB7XG4gICAgICAgIHBhcnRWYWx1ZXNbaSAtIDFdID0gc2Vjb25kcyAlIG1vZFZhbHVlc1tpIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0VmFsdWVzW2kgLSAxXSA9IE1hdGguZmxvb3IoIHNlY29uZHMgJSBtb2RWYWx1ZXNbaSAtIDFdICk7XG4gICAgICB9XG4gICAgICBwYXJ0VmFsdWVzW2ldID0gTWF0aC5mbG9vciggc2Vjb25kcyAvIG1vZFZhbHVlc1tpIC0gMV0gKTtcbiAgICAgIHNlY29uZHMgPSBzZWNvbmRzIC0gcGFydFZhbHVlc1tpXSAqIG1vZFZhbHVlc1tpIC0gMV07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBmcmFjdGlvbnM6IHBhcnRWYWx1ZXNbMF0sXG4gICAgICBzZWNvbmRzOiAgIHBhcnRWYWx1ZXNbMV0sXG4gICAgICBtaW51dGVzOiAgIHBhcnRWYWx1ZXNbMl0sXG4gICAgICBob3VyczogICAgIHBhcnRWYWx1ZXNbM10sXG4gICAgICBkYXlzOiAgICAgIHBhcnRWYWx1ZXNbNF0sXG4gICAgICB3ZWVrczogICAgIHBhcnRWYWx1ZXNbNV0sXG4gICAgICB5ZWFyczogICAgIHBhcnRWYWx1ZXNbNl1cbiAgICB9O1xuICB9XG59O1xuIiwiLyoqXG4gKlxuICogUHJvdmlkZXMgYmFzaWMgZGV2aWNlLWhhbmRsaW5nIGNvbnZlbmllbmNlIGZ1bmN0aW9ucyBmb3IgZGV0ZXJtaW5pbmcgaWYgdGhlIGRldmljZVxuICogaXMgYW4gaURldmljZSBvciBhIERyb2lkIERldmljZSwgYW5kIHdoYXQgdGhlIG9yaWVudGF0aW9uIGlzLlxuICpcbiAqIEBtb2R1bGUgZGV2aWNlLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC41XG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxMyBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgbW9kdWxlLCBkZWZpbmUsIGRldmljZSwgbmF2aWdhdG9yLCB3aW5kb3cgKi9cblwidXNlIHN0cmljdFwiO1xuLyoqXG4gKlxuICogUEtERVZJQ0UgcHJvdmlkZXMgc2ltcGxlIG1ldGhvZHMgZm9yIGdldHRpbmcgZGV2aWNlIGluZm9ybWF0aW9uLCBzdWNoIGFzIHBsYXRmb3JtLFxuICogZm9ybSBmYWN0b3IsIGFuZCBvcmllbnRhdGlvbi5cbiAqXG4gKiBAY2xhc3MgUEtERVZJQ0VcbiAqL1xudmFyIFBLREVWSUNFID0ge1xuICAvKipcbiAgICogVGhlIHZlcnNpb24gb2YgdGhlIGNsYXNzIHdpdGggbWFqb3IsIG1pbm9yLCBhbmQgcmV2IHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB2ZXJzaW9uXG4gICAqIEB0eXBlIE9iamVjdFxuICAgKlxuICAgKi9cbiAgdmVyc2lvbjogICAgICAgICAgICBcIjAuNS4xMDBcIixcbiAgLyoqXG4gICAqIFBlcm1pdHMgb3ZlcnJpZGluZyB0aGUgcGxhdGZvcm0gZm9yIHRlc3RpbmcuIExlYXZlIHNldCB0byBgZmFsc2VgIGZvclxuICAgKiBwcm9kdWN0aW9uIGFwcGxpY2F0aW9ucy5cbiAgICpcbiAgICogQHByb3BlcnR5IHBsYXRmb3JtT3ZlcnJpZGVcbiAgICogQHR5cGUgYm9vbGVhblxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcGxhdGZvcm1PdmVycmlkZTogICBmYWxzZSxcbiAgLyoqXG4gICAqIFBlcm1pdHMgb3ZlcnJpZGluZyB0aGUgZm9ybSBmYWN0b3IuIFVzdWFsbHkgdXNlZCBmb3IgdGVzdGluZy5cbiAgICpcbiAgICogQHByb3BlcnR5IGZvcm1GYWN0b3JPdmVycmlkZVxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBmb3JtRmFjdG9yT3ZlcnJpZGU6IGZhbHNlLFxuICAvKipcbiAgICpcbiAgICogUmV0dXJucyB0aGUgZGV2aWNlIHBsYXRmb3JtLCBsb3dlcmNhc2VkLiBJZiBQS0RFVklDRS5wbGF0Zm9ybU92ZXJyaWRlIGlzXG4gICAqIG90aGVyIHRoYW4gXCJmYWxzZVwiLCBpdCBpcyByZXR1cm5lZCBpbnN0ZWFkLlxuICAgKlxuICAgKiBTZWUgUGhvbmVHYXAncyBkb2N1bWVudGF0aW9uIG9uIHRoZSBmdWxsIHJhbmdlIG9mIHBsYXRmb3JtcyB0aGF0IGNhbiBiZVxuICAgKiByZXR1cm5lZDsgd2l0aG91dCBQRyBhdmFpbGFibGUsIHRoZSBtZXRob2Qgd2lsbCBhdHRlbXQgdG8gZGV0ZXJtaW5lIHRoZVxuICAgKiBwbGF0Zm9ybSBmcm9tIGBuYXZpZ2F0b3IucGxhdGZvcm1gIGFuZCB0aGUgYHVzZXJBZ2VudGAsIGJ1dCBvbmx5IHN1cHBvcnRzXG4gICAqIGlPUyBhbmQgQW5kcm9pZCBpbiB0aGF0IGNhcGFjaXR5LlxuICAgKlxuICAgKiBAbWV0aG9kIHBsYXRmb3JtXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge1N0cmluZ30gdGhlIGRldmljZSBwbGF0Zm9ybSwgbG93ZXJjYXNlLlxuICAgKi9cbiAgcGxhdGZvcm06ICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCBQS0RFVklDRS5wbGF0Zm9ybU92ZXJyaWRlICkge1xuICAgICAgcmV0dXJuIFBLREVWSUNFLnBsYXRmb3JtT3ZlcnJpZGUudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgaWYgKCB0eXBlb2YgZGV2aWNlID09PSBcInVuZGVmaW5lZFwiIHx8ICFkZXZpY2UucGxhdGZvcm0gKSB7XG4gICAgICAvLyBkZXRlY3QgbW9iaWxlIGRldmljZXMgZmlyc3RcbiAgICAgIGlmICggbmF2aWdhdG9yLnBsYXRmb3JtID09PSBcImlQYWRcIiB8fCBuYXZpZ2F0b3IucGxhdGZvcm0gPT09IFwiaVBhZCBTaW11bGF0b3JcIiB8fCBuYXZpZ2F0b3IucGxhdGZvcm0gPT09IFwiaVBob25lXCIgfHxcbiAgICAgICAgICAgbmF2aWdhdG9yLnBsYXRmb3JtID09PSBcImlQaG9uZSBTaW11bGF0b3JcIiB8fCBuYXZpZ2F0b3IucGxhdGZvcm0gPT09IFwiaVBvZFwiICkge1xuICAgICAgICByZXR1cm4gXCJpb3NcIjtcbiAgICAgIH1cbiAgICAgIGlmICggbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoIFwiYW5kcm9pZFwiICkgPiAtMSApIHtcbiAgICAgICAgcmV0dXJuIFwiYW5kcm9pZFwiO1xuICAgICAgfVxuICAgICAgLy8gbm8gcmVhc29uIHdoeSB3ZSBjYW4ndCByZXR1cm4gb3RoZXIgaW5mb3JtYXRpb25cbiAgICAgIGlmICggbmF2aWdhdG9yLnBsYXRmb3JtLmluZGV4T2YoIFwiTWFjXCIgKSA+IC0xICkge1xuICAgICAgICByZXR1cm4gXCJtYWNcIjtcbiAgICAgIH1cbiAgICAgIGlmICggbmF2aWdhdG9yLnBsYXRmb3JtLmluZGV4T2YoIFwiV2luXCIgKSA+IC0xICkge1xuICAgICAgICByZXR1cm4gXCJ3aW5kb3dzXCI7XG4gICAgICB9XG4gICAgICBpZiAoIG5hdmlnYXRvci5wbGF0Zm9ybS5pbmRleE9mKCBcIkxpbnV4XCIgKSA+IC0xICkge1xuICAgICAgICByZXR1cm4gXCJsaW51eFwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xuICAgIH1cbiAgICB2YXIgdGhlUGxhdGZvcm0gPSBkZXZpY2UucGxhdGZvcm0udG9Mb3dlckNhc2UoKTtcbiAgICAvL1xuICAgIC8vIHR1cm5zIG91dCB0aGF0IGZvciBDb3Jkb3ZhID4gMi4zLCBkZWl2Y2VwbGF0Zm9ybSBub3cgcmV0dXJucyBpT1MsIHNvIHRoZVxuICAgIC8vIGZvbGxvd2luZyBpcyByZWFsbHkgbm90IG5lY2Vzc2FyeSBvbiB0aG9zZSB2ZXJzaW9ucy4gV2UgbGVhdmUgaXQgaGVyZVxuICAgIC8vIGZvciB0aG9zZSB1c2luZyBDb3Jkb3ZhIDw9IDIuMi5cbiAgICBpZiAoIHRoZVBsYXRmb3JtLmluZGV4T2YoIFwiaXBhZFwiICkgPiAtMSB8fCB0aGVQbGF0Zm9ybS5pbmRleE9mKCBcImlwaG9uZVwiICkgPiAtMSApIHtcbiAgICAgIHRoZVBsYXRmb3JtID0gXCJpb3NcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoZVBsYXRmb3JtO1xuICB9LFxuICAvKipcbiAgICpcbiAgICogUmV0dXJucyB0aGUgZGV2aWNlJ3MgZm9ybSBmYWN0b3IuIFBvc3NpYmxlIHZhbHVlcyBhcmUgXCJ0YWJsZXRcIiBhbmRcbiAgICogXCJwaG9uZVwiLiBJZiBQS0RFVklDRS5mb3JtRmFjdG9yT3ZlcnJpZGUgaXMgbm90IGZhbHNlLCBpdCBpcyByZXR1cm5lZFxuICAgKiBpbnN0ZWFkLlxuICAgKlxuICAgKiBAbWV0aG9kIGZvcm1GYWN0b3JcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBgdGFibGV0YCBvciBgcGhvbmVgLCBhcyBhcHByb3ByaWF0ZVxuICAgKi9cbiAgZm9ybUZhY3RvcjogICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCBQS0RFVklDRS5mb3JtRmFjdG9yT3ZlcnJpZGUgKSB7XG4gICAgICByZXR1cm4gUEtERVZJQ0UuZm9ybUZhY3Rvck92ZXJyaWRlLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGlmICggbmF2aWdhdG9yLnBsYXRmb3JtID09PSBcImlQYWRcIiApIHtcbiAgICAgIHJldHVybiBcInRhYmxldFwiO1xuICAgIH1cbiAgICBpZiAoICggbmF2aWdhdG9yLnBsYXRmb3JtID09PSBcImlQaG9uZVwiICkgfHwgKCBuYXZpZ2F0b3IucGxhdGZvcm0gPT09IFwiaVBob25lIFNpbXVsYXRvclwiICkgKSB7XG4gICAgICByZXR1cm4gXCJwaG9uZVwiO1xuICAgIH1cbiAgICB2YXIgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCB1YS5pbmRleE9mKCBcImFuZHJvaWRcIiApID4gLTEgKSB7XG4gICAgICAvLyBhbmRyb2lkIHJlcG9ydHMgaWYgaXQgaXMgYSBwaG9uZSBvciB0YWJsZXQgYmFzZWQgb24gdXNlciBhZ2VudFxuICAgICAgaWYgKCB1YS5pbmRleE9mKCBcIm1vYmlsZSBzYWZhcmlcIiApID4gLTEgKSB7XG4gICAgICAgIHJldHVybiBcInBob25lXCI7XG4gICAgICB9XG4gICAgICBpZiAoIHVhLmluZGV4T2YoIFwibW9iaWxlIHNhZmFyaVwiICkgPCAwICYmIHVhLmluZGV4T2YoIFwic2FmYXJpXCIgKSA+IC0xICkge1xuICAgICAgICByZXR1cm4gXCJ0YWJsZXRcIjtcbiAgICAgIH1cbiAgICAgIGlmICggKCBNYXRoLm1heCggd2luZG93LnNjcmVlbi53aWR0aCwgd2luZG93LnNjcmVlbi5oZWlnaHQgKSAvIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICkgPj0gOTAwICkge1xuICAgICAgICByZXR1cm4gXCJ0YWJsZXRcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcInBob25lXCI7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHRoZSBmb2xsb3dpbmcgaXMgaGFja3ksIGFuZCBub3QgZ3VhcmFudGVlZCB0byB3b3JrIGFsbCB0aGUgdGltZSxcbiAgICAvLyBlc3BlY2lhbGx5IGFzIHBob25lcyBnZXQgYmlnZ2VyIHNjcmVlbnMgd2l0aCBoaWdoZXIgRFBJLlxuICAgIGlmICggKCBNYXRoLm1heCggd2luZG93LnNjcmVlbi53aWR0aCwgd2luZG93LnNjcmVlbi5oZWlnaHQgKSApID49IDkwMCApIHtcbiAgICAgIHJldHVybiBcInRhYmxldFwiO1xuICAgIH1cbiAgICByZXR1cm4gXCJwaG9uZVwiO1xuICB9LFxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgZGV2aWNlIGlzIGEgdGFibGV0IChvciB0YWJsZXQtc2l6ZWQsIG1vcmUgYWNjdXJhdGVseSlcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzVGFibGV0OiAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQS0RFVklDRS5mb3JtRmFjdG9yKCkgPT09IFwidGFibGV0XCI7XG4gIH0sXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBkZXZpY2UgaXMgYSB0YWJsZXQgKG9yIHRhYmxldC1zaXplZCwgbW9yZSBhY2N1cmF0ZWx5KVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNQaG9uZTogICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFBLREVWSUNFLmZvcm1GYWN0b3IoKSA9PT0gXCJwaG9uZVwiO1xuICB9LFxuICAvKipcbiAgICpcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgZGV2aWNlIGlzIGluIFBvcnRyYWl0IG9yaWVudGF0aW9uLlxuICAgKlxuICAgKiBAbWV0aG9kIGlzUG9ydHJhaXRcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZSBkZXZpY2UgaXMgaW4gYSBQb3J0cmFpdCBvcmllbnRhdGlvbjsgYGZhbHNlYCBvdGhlcndpc2VcbiAgICovXG4gIGlzUG9ydHJhaXQ6ICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB3aW5kb3cub3JpZW50YXRpb24gPT09IDAgfHwgd2luZG93Lm9yaWVudGF0aW9uID09PSAxODAgfHwgd2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZiggXCI/cG9ydHJhaXRcIiApID4gLTE7XG4gIH0sXG4gIC8qKlxuICAgKlxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBkZXZpY2UgaXMgaW4gTGFuZHNjYXBlIG9yaWVudGF0aW9uLlxuICAgKlxuICAgKiBAbWV0aG9kIGlzTGFuZHNjYXBlXG4gICAqIEBzdGF0aWNcbiAgICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgZGV2aWNlIGlzIGluIGEgbGFuZHNjYXBlIG9yaWVudGF0aW9uOyBgZmFsc2VgIG90aGVyd2lzZVxuICAgKi9cbiAgaXNMYW5kc2NhcGU6ICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCBcIj9sYW5kc2NhcGVcIiApID4gLTEgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuICFQS0RFVklDRS5pc1BvcnRyYWl0KCk7XG4gIH0sXG4gIC8qKlxuICAgKlxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBkZXZpY2UgaXMgYSBoaURQSSBkZXZpY2UgKGFrYSByZXRpbmEpXG4gICAqXG4gICAqIEBtZXRob2QgaXNSZXRpbmFcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHRoZSBkZXZpY2UgaGFzIGEgYHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvYCBncmVhdGVyIHRoYW4gYDEuMGA7IGBmYWxzZWAgb3RoZXJ3aXNlXG4gICAqL1xuICBpc1JldGluYTogICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gd2luZG93LmRldmljZVBpeGVsUmF0aW8gPiAxO1xuICB9LFxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGRldmljZSBpcyBhbiBpUGFkLlxuICAgKlxuICAgKiBAbWV0aG9kIGlQYWRcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlQYWQ6ICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQS0RFVklDRS5wbGF0Zm9ybSgpID09PSBcImlvc1wiICYmIFBLREVWSUNFLmZvcm1GYWN0b3IoKSA9PT0gXCJ0YWJsZXRcIjtcbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBkZXZpY2UgaXMgYW4gaVBob25lIChvciBpUG9kKS5cbiAgICpcbiAgICogQG1ldGhvZCBpUGhvbmVcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlQaG9uZTogICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQS0RFVklDRS5wbGF0Zm9ybSgpID09PSBcImlvc1wiICYmIFBLREVWSUNFLmZvcm1GYWN0b3IoKSA9PT0gXCJwaG9uZVwiO1xuICB9LFxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGRldmljZSBpcyBhbiBBbmRyb2lkIFBob25lLlxuICAgKlxuICAgKiBAbWV0aG9kIGRyb2lkUGhvbmVcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGRyb2lkUGhvbmU6ICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQS0RFVklDRS5wbGF0Zm9ybSgpID09PSBcImFuZHJvaWRcIiAmJiBQS0RFVklDRS5mb3JtRmFjdG9yKCkgPT09IFwicGhvbmVcIjtcbiAgfSxcbiAgLyoqXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBkZXZpY2UgaXMgYW4gQW5kcm9pZCBUYWJsZXQuXG4gICAqXG4gICAqIEBtZXRob2QgZHJvaWRUYWJsZXRcbiAgICogQHN0YXRpY1xuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGRyb2lkVGFibGV0OiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQS0RFVklDRS5wbGF0Zm9ybSgpID09PSBcImFuZHJvaWRcIiAmJiBQS0RFVklDRS5mb3JtRmFjdG9yKCkgPT09IFwidGFibGV0XCI7XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IFBLREVWSUNFO1xuIiwiLyoqXG4gKlxuICogRmlsZU1hbmFnZXIgaW1wbGVtZW50cyBtZXRob2RzIHRoYXQgaW50ZXJhY3Qgd2l0aCB0aGUgSFRNTDUgQVBJXG4gKlxuICogQG1vZHVsZSBmaWxlTWFuYWdlci5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNFxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFscyBtb2R1bGUsIGRlZmluZSwgUSwgTG9jYWxGaWxlU3lzdGVtLCBjb25zb2xlLCB3aW5kb3csIG5hdmlnYXRvciwgRmlsZVJlYWRlciovXG52YXIgUSA9IHJlcXVpcmUoIFwiLi4vLi4vcVwiICk7XG52YXIgQmFzZU9iamVjdCA9IHJlcXVpcmUoIFwiLi9vYmplY3QuanNcIiApO1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgSU5fWUFTTUYgPSB0cnVlO1xucmV0dXJuIChmdW5jdGlvbiAoIFEsIEJhc2VPYmplY3QsIGdsb2JhbENvbnRleHQsIG1vZHVsZSApIHtcbiAgLyoqXG4gICAqIERlZmluZWQgYnkgUSwgYWN0dWFsbHksIGJ1dCBkZWZpbmVkIGhlcmUgdG8gbWFrZSB0eXBlIGhhbmRsaW5nIG5pY2VyXG4gICAqIEB0eXBlZGVmIHt7fX0gUHJvbWlzZVxuICAgKi9cbiAgdmFyIERFQlVHID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFJlcXVlc3RzIGEgcXVvdGEgZnJvbSB0aGUgZmlsZSBzeXN0ZW1cbiAgICogQG1ldGhvZCBfcmVxdWVzdFF1b3RhXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAgeyp9IGZpbGVTeXN0ZW1UeXBlICAgIFBFUlNJU1RFTlQgb3IgVEVNUE9SQVJZXG4gICAqIEBwYXJhbSAge051bWJlcn0gcmVxdWVzdGVkRGF0YVNpemUgVGhlIHF1b3RhIHdlJ3JlIGFza2luZyBmb3JcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICAgVGhlIHByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9yZXF1ZXN0UXVvdGEoIGZpbGVTeXN0ZW1UeXBlLCByZXF1ZXN0ZWREYXRhU2l6ZSApIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfcmVxdWVzdFF1b3RhOiBcIiwgZmlsZVN5c3RlbVR5cGUsIHJlcXVlc3RlZERhdGFTaXplXS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyBhdHRlbXB0IHRvIGFzayBmb3IgYSBxdW90YVxuICAgICAgdmFyIFBFUlNJU1RFTlQgPSAoIHR5cGVvZiBMb2NhbEZpbGVTeXN0ZW0gIT09IFwidW5kZWZpbmVkXCIgKSA/IExvY2FsRmlsZVN5c3RlbS5QRVJTSVNURU5UIDogd2luZG93LlBFUlNJU1RFTlQsXG4gICAgICAvLyBDaHJvbWUgaGFzIGB3ZWJraXRQZXJzaXN0ZW50U3RvcmFnZWAgYW5kIGBuYXZpZ2F0b3Iud2Via2l0VGVtcG9yYXJ5U3RvcmFnZWBcbiAgICAgICAgc3RvcmFnZUluZm8gPSBmaWxlU3lzdGVtVHlwZSA9PT0gUEVSU0lTVEVOVCA/IG5hdmlnYXRvci53ZWJraXRQZXJzaXN0ZW50U3RvcmFnZSA6IG5hdmlnYXRvci53ZWJraXRUZW1wb3JhcnlTdG9yYWdlO1xuICAgICAgaWYgKCBzdG9yYWdlSW5mbyApIHtcbiAgICAgICAgLy8gbm93IG1ha2Ugc3VyZSB3ZSBjYW4gcmVxdWVzdCBhIHF1b3RhXG4gICAgICAgIGlmICggc3RvcmFnZUluZm8ucmVxdWVzdFF1b3RhICkge1xuICAgICAgICAgIC8vIHJlcXVlc3QgdGhlIHF1b3RhXG4gICAgICAgICAgc3RvcmFnZUluZm8ucmVxdWVzdFF1b3RhKCByZXF1ZXN0ZWREYXRhU2l6ZSwgZnVuY3Rpb24gc3VjY2VzcyggZ3JhbnRlZEJ5dGVzICkge1xuICAgICAgICAgICAgaWYgKCBERUJVRyApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coIFtcIl9yZXF1ZXN0UXVvdGE6IHF1b3RhIGdyYW50ZWQ6IFwiLCBmaWxlU3lzdGVtVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFudGVkQnl0ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbiggXCIgXCIgKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggZ3JhbnRlZEJ5dGVzICk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gZmFpbHVyZSggYW5FcnJvciApIHtcbiAgICAgICAgICAgIGlmICggREVCVUcgKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBbXCJfcmVxdWVzdFF1b3RhOiBxdW90YSByZWplY3RlZDogXCIsIGZpbGVTeXN0ZW1UeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RlZERhdGFTaXplLCBhbkVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oIFwiIFwiICkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgIH0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBub3QgZXZlcnl0aGluZyBzdXBwb3J0cyBhc2tpbmcgZm9yIGEgcXVvdGEgLS0gbGlrZSBDb3Jkb3ZhLlxuICAgICAgICAgIC8vIEluc3RlYWQsIGxldCdzIGFzc3VtZSB3ZSBnZXQgcGVybWlzc2lvblxuICAgICAgICAgIGlmICggREVCVUcgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggW1wiX3JlcXVlc3RRdW90YTogY291bGRuJ3QgcmVxdWVzdCBxdW90YSAtLSBubyByZXF1ZXN0UXVvdGE6IFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtVHlwZSwgcmVxdWVzdGVkRGF0YVNpemVcbiAgICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oIFwiIFwiICkgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggcmVxdWVzdGVkRGF0YVNpemUgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCBERUJVRyApIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyggW1wiX3JlcXVlc3RRdW90YTogY291bGRuJ3QgcmVxdWVzdCBxdW90YSAtLSBubyBzdG9yYWdlSW5mbzogXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlU3lzdGVtVHlwZSwgcmVxdWVzdGVkRGF0YVNpemVcbiAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCBcIiBcIiApICk7XG4gICAgICAgIH1cbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggcmVxdWVzdGVkRGF0YVNpemUgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgYSBmaWxlIHN5c3RlbSB3aXRoIHRoZSByZXF1ZXN0ZWQgc2l6ZSAob2J0YWluZWQgZmlyc3QgYnkgZ2V0dGluZyBhIHF1b3RhKVxuICAgKiBAbWV0aG9kIF9yZXF1ZXN0RmlsZVN5c3RlbVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHsqfSBmaWxlU3lzdGVtVHlwZSAgICBURU1QT1JBUlkgb3IgUEVSU0lTVEVOVFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9IHJlcXVlc3RlZERhdGFTaXplIFRoZSBxdW90YVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICBUaGUgcHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX3JlcXVlc3RGaWxlU3lzdGVtKCBmaWxlU3lzdGVtVHlwZSwgcmVxdWVzdGVkRGF0YVNpemUgKSB7XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX3JlcXVlc3RGaWxlU3lzdGVtOiBcIiwgZmlsZVN5c3RlbVR5cGUsIHJlcXVlc3RlZERhdGFTaXplXS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyBmaXggaXNzdWUgIzIgYnkgY2hhc2VuIHdoZXJlIHVzaW5nIGB3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbWAgd2FzIGhhdmluZyBwcm9ibGVtc1xuICAgICAgLy8gb24gQW5kcm9pZCA0LjIuMlxuICAgICAgdmFyIHJlcXVlc3RGaWxlU3lzdGVtID0gd2luZG93LnJlcXVlc3RGaWxlU3lzdGVtIHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbTtcbiAgICAgIHJlcXVlc3RGaWxlU3lzdGVtKCBmaWxlU3lzdGVtVHlwZSwgcmVxdWVzdGVkRGF0YVNpemUsIGZ1bmN0aW9uIHN1Y2Nlc3MoIHRoZUZpbGVTeXN0ZW0gKSB7XG4gICAgICAgIGlmICggREVCVUcgKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coIFtcIl9yZXF1ZXN0RmlsZVN5c3RlbTogZ290IGEgZmlsZSBzeXN0ZW1cIiwgdGhlRmlsZVN5c3RlbV0uam9pbiggXCIgXCIgKSApO1xuICAgICAgICB9XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZUZpbGVTeXN0ZW0gKTtcbiAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgIGlmICggREVCVUcgKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coIFtcIl9yZXF1ZXN0RmlsZVN5c3RlbTogY291bGRuJ3QgZ2V0IGEgZmlsZSBzeXN0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW1UeXBlXG4gICAgICAgICAgICAgICAgICAgICAgIF0uam9pbiggXCIgXCIgKSApO1xuICAgICAgICB9XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgfSApO1xuICAgIH1cbiAgICBjYXRjaCAoIGFuRXJyb3IgKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZXMgdGhlVVJJIHRvIGEgZmlsZUVudHJ5IG9yIGRpcmVjdG9yeUVudHJ5LCBpZiBwb3NzaWJsZS5cbiAgICogSWYgYHRoZVVSTGAgY29udGFpbnMgYHByaXZhdGVgIG9yIGBsb2NhbGhvc3RgIGFzIGl0cyBmaXJzdCBlbGVtZW50LCBpdCB3aWxsIGJlIHJlbW92ZWQuIElmXG4gICAqIGB0aGVVUkxgIGRvZXMgbm90IGhhdmUgYSBVUkwgc2NoZW1lLCBgZmlsZTovL2Agd2lsbCBiZSBhc3N1bWVkLlxuICAgKiBAbWV0aG9kIF9yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdGhlVVJMIHRoZSBwYXRoLCBzaG91bGQgc3RhcnQgd2l0aCBmaWxlOi8vLCBidXQgaWYgaXQgZG9lc24ndCB3ZSdsbCBhZGQgaXQuXG4gICAqL1xuICBmdW5jdGlvbiBfcmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCggdGhlVVJMICkge1xuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBpZiAoIERFQlVHICkge1xuICAgICAgY29uc29sZS5sb2coIFtcIl9yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMOiBcIiwgdGhlVVJMXS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAvLyBzcGxpdCB0aGUgcGFydHMgb2YgdGhlIFVSTFxuICAgICAgdmFyIHBhcnRzID0gdGhlVVJMLnNwbGl0KCBcIjpcIiApLFxuICAgICAgICBwcm90b2NvbCwgcGF0aDtcbiAgICAgIC8vIGNhbiBvbmx5IGhhdmUgdHdvIHBhcnRzXG4gICAgICBpZiAoIHBhcnRzLmxlbmd0aCA+IDIgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvciggXCJUaGUgVVJJIGlzIG5vdCB3ZWxsLWZvcm1lZDsgbWlzc2luZyBwcm90b2NvbDogXCIgKyB0aGVVUkwgKTtcbiAgICAgIH1cbiAgICAgIC8vIGlmIG9ubHkgb25lIHBhcnQsIHdlIGFzc3VtZSBgZmlsZWAgYXMgdGhlIHByb3RvY29sXG4gICAgICBpZiAoIHBhcnRzLmxlbmd0aCA8IDIgKSB7XG4gICAgICAgIHByb3RvY29sID0gXCJmaWxlXCI7XG4gICAgICAgIHBhdGggPSBwYXJ0c1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb3RvY29sID0gcGFydHNbMF07XG4gICAgICAgIHBhdGggPSBwYXJ0c1sxXTtcbiAgICAgIH1cbiAgICAgIC8vIHNwbGl0IHRoZSBwYXRoIGNvbXBvbmVudHNcbiAgICAgIHZhciBwYXRoQ29tcG9uZW50cyA9IHBhdGguc3BsaXQoIFwiL1wiICksXG4gICAgICAgIG5ld1BhdGhDb21wb25lbnRzID0gW107XG4gICAgICAvLyBpdGVyYXRlIG92ZXIgZWFjaCBjb21wb25lbnQgYW5kIHRyaW0gYXMgd2UgZ29cbiAgICAgIHBhdGhDb21wb25lbnRzLmZvckVhY2goIGZ1bmN0aW9uICggcGFydCApIHtcbiAgICAgICAgcGFydCA9IHBhcnQudHJpbSgpO1xuICAgICAgICBpZiAoIHBhcnQgIT09IFwiXCIgKSB7IC8vIHJlbW92ZSAvcHJpdmF0ZSBpZiBpdCBpcyB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgbmV3IGFycmF5LCBmb3IgaU9TIHNha2VcbiAgICAgICAgICBpZiAoICEoICggcGFydCA9PT0gXCJwcml2YXRlXCIgfHwgcGFydCA9PT0gXCJsb2NhbGhvc3RcIiApICYmIG5ld1BhdGhDb21wb25lbnRzLmxlbmd0aCA9PT0gMCApICkge1xuICAgICAgICAgICAgbmV3UGF0aENvbXBvbmVudHMucHVzaCggcGFydCApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSApO1xuICAgICAgLy8gcmVqb2luIHRoZSBwYXRoIGNvbXBvbmVudHNcbiAgICAgIHZhciB0aGVOZXdVUkkgPSBuZXdQYXRoQ29tcG9uZW50cy5qb2luKCBcIi9cIiApO1xuICAgICAgLy8gYWRkIHRoZSBwcm90b2NvbFxuICAgICAgdGhlTmV3VVJJID0gcHJvdG9jb2wgKyBcIjovLy9cIiArIHRoZU5ld1VSSTtcbiAgICAgIC8vIGFuZCByZXNvbHZlIHRoZSBVUkwuXG4gICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCggdGhlTmV3VVJJLCBmdW5jdGlvbiAoIHRoZUVudHJ5ICkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVFbnRyeSApO1xuICAgICAgfSwgZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHt7fX0gRGlyZWN0b3J5RW50cnlcbiAgICogSFRNTDUgRmlsZSBBUEkgRGlyZWN0b3J5IFR5cGVcbiAgICovXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgZGlyZWN0b3J5IGVudHJ5IGJhc2VkIG9uIHRoZSBwYXRoIGZyb20gdGhlIHBhcmVudCB1c2luZ1xuICAgKiB0aGUgc3BlY2lmaWVkIG9wdGlvbnMsIGlmIHNwZWNpZmllZC4gYG9wdGlvbnNgIHRha2VzIHRoZSBmb3JtOlxuICAgKiBgIHtjcmVhdGU6IHRydWUvZmFsc2UsIGV4Y2x1c2l2ZSB0cnVlL2ZhbHNlIH1gXG4gICAqIEBtZXRob2QgX2dldERpcmVjdG9yeUVudHJ5XG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeUVudHJ5fSBwYXJlbnQgIFRoZSBwYXJlbnQgdGhhdCBwYXRoIGlzIHJlbGF0aXZlIGZyb20gKG9yIGFic29sdXRlKVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGggICAgVGhlIHJlbGF0aXZlIG9yIGFic29sdXRlIHBhdGggb3IgYSB7RGlyZWN0b3J5RW50cnl9XG4gICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyAodGhhdCBpcywgY3JlYXRlIHRoZSBkaXJlY3RvcnkgaWYgaXQgZG9lc24ndCBleGlzdCwgZXRjLilcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICBUaGUgcHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX2dldERpcmVjdG9yeUVudHJ5KCBwYXJlbnQsIHBhdGgsIG9wdGlvbnMgKSB7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfZ2V0RGlyZWN0b3J5RW50cnk6XCIsIHBhcmVudCwgcGF0aCwgb3B0aW9uc10uam9pbiggXCIgXCIgKSApO1xuICAgIH1cbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIGlmICggdHlwZW9mIHBhdGggPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHBhdGggKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudC5nZXREaXJlY3RvcnkoIHBhdGgsIG9wdGlvbnMgfHwge30sIGZ1bmN0aW9uIHN1Y2Nlc3MoIHRoZURpcmVjdG9yeUVudHJ5ICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZURpcmVjdG9yeUVudHJ5ICk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgIH0gKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBmaWxlIGVudHJ5IGJhc2VkIG9uIHRoZSBwYXRoIGZyb20gdGhlIHBhcmVudCB1c2luZ1xuICAgKiB0aGUgc3BlY2lmaWVkIG9wdGlvbnMuIGBvcHRpb25zYCB0YWtlcyB0aGUgZm9ybSBvZiBgeyBjcmVhdGU6IHRydWUvZmFsc2UsIGV4Y2x1c2l2ZTogdHJ1ZS9mYWxzZX1gXG4gICAqIEBtZXRob2QgZ2V0RmlsZUVudHJ5XG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeUVudHJ5fSBwYXJlbnQgIFRoZSBwYXJlbnQgdGhhdCBwYXRoIGlzIHJlbGF0aXZlIGZyb20gKG9yIGFic29sdXRlKVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHBhdGggICAgVGhlIHJlbGF0aXZlIG9yIGFic29sdXRlIHBhdGhcbiAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zICh0aGF0IGlzLCBjcmVhdGUgdGhlIGZpbGUgaWYgaXQgZG9lc24ndCBleGlzdCwgZXRjLilcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICBUaGUgcHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX2dldEZpbGVFbnRyeSggcGFyZW50LCBwYXRoLCBvcHRpb25zICkge1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX2dldEZpbGVFbnRyeTpcIiwgcGFyZW50LCBwYXRoLCBvcHRpb25zXS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgaWYgKCB0eXBlb2YgcGF0aCA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggcGF0aCApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50LmdldEZpbGUoIHBhdGgsIG9wdGlvbnMgfHwge30sIGZ1bmN0aW9uIHN1Y2Nlc3MoIHRoZUZpbGVFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVGaWxlRW50cnkgKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gZmFpbHVyZSggYW5FcnJvciApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgfSApO1xuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoIGFuRXJyb3IgKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge3t9fSBGaWxlRW50cnlcbiAgICogSFRNTDUgRmlsZSBBUEkgRmlsZSBFbnRyeVxuICAgKi9cbiAgLyoqXG4gICAqIFJldHVybnMgYSBmaWxlIG9iamVjdCBiYXNlZCBvbiB0aGUgZmlsZSBlbnRyeS5cbiAgICogQG1ldGhvZCBfZ2V0RmlsZU9iamVjdFxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtGaWxlRW50cnl9IGZpbGVFbnRyeSBUaGUgZmlsZSBFbnRyeVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgVGhlIFByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9nZXRGaWxlT2JqZWN0KCBmaWxlRW50cnkgKSB7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfZ2V0RmlsZU9iamVjdDpcIiwgZmlsZUVudHJ5XS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgZmlsZUVudHJ5LmZpbGUoIGZ1bmN0aW9uIHN1Y2Nlc3MoIHRoZUZpbGUgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZUZpbGUgKTtcbiAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgfSApO1xuICAgIH1cbiAgICBjYXRjaCAoIGFuRXJyb3IgKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVhZHMgdGhlIGZpbGUgY29udGVudHMgZnJvbSBhIGZpbGUgb2JqZWN0LiByZWFkQXNLaW5kIGluZGljYXRlcyBob3dcbiAgICogdG8gcmVhZCB0aGUgZmlsZSAoXCJUZXh0XCIsIFwiRGF0YVVSTFwiLCBcIkJpbmFyeVN0cmluZ1wiLCBcIkFycmF5QnVmZmVyXCIpLlxuICAgKiBAbWV0aG9kIF9yZWFkRmlsZUNvbnRlbnRzXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0ZpbGV9IGZpbGVPYmplY3QgRmlsZSB0byByZWFkXG4gICAqIEBwYXJhbSAge1N0cmluZ30gcmVhZEFzS2luZCBcIlRleHRcIiwgXCJEYXRhVVJMXCIsIFwiQmluYXJ5U3RyaW5nXCIsIFwiQXJyYXlCdWZmZXJcIlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgIFRoZSBQcm9taXNlXG4gICAqL1xuICBmdW5jdGlvbiBfcmVhZEZpbGVDb250ZW50cyggZmlsZU9iamVjdCwgcmVhZEFzS2luZCApIHtcbiAgICBpZiAoIERFQlVHICkge1xuICAgICAgY29uc29sZS5sb2coIFtcIl9yZWFkRmlsZUNvbnRlbnRzOlwiLCBmaWxlT2JqZWN0LCByZWFkQXNLaW5kXS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgdmFyIGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgZmlsZVJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoIGUudGFyZ2V0LnJlc3VsdCApO1xuICAgICAgfTtcbiAgICAgIGZpbGVSZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICB9O1xuICAgICAgZmlsZVJlYWRlcltcInJlYWRBc1wiICsgcmVhZEFzS2luZF0oIGZpbGVPYmplY3QgKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmaWxlIHdyaXRlciBmb3IgdGhlIGZpbGUgZW50cnk7IGBmaWxlRW50cnlgIG11c3QgZXhpc3RcbiAgICogQG1ldGhvZCBfY3JlYXRlRmlsZVdyaXRlclxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtGaWxlRW50cnl9IGZpbGVFbnRyeSBUaGUgZmlsZSBlbnRyeSB0byB3cml0ZSB0b1xuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgdGhlIFByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9jcmVhdGVGaWxlV3JpdGVyKCBmaWxlRW50cnkgKSB7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfY3JlYXRlRmlsZVdyaXRlcjpcIiwgZmlsZUVudHJ5XS5qb2luKCBcIiBcIiApICk7XG4gICAgfVxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgdmFyIGZpbGVXcml0ZXIgPSBmaWxlRW50cnkuY3JlYXRlV3JpdGVyKCBmdW5jdGlvbiBzdWNjZXNzKCB0aGVGaWxlV3JpdGVyICkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVGaWxlV3JpdGVyICk7XG4gICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHt7fX0gRmlsZVdyaXRlclxuICAgKiBIVE1MNSBGaWxlIEFQSSBGaWxlIFdyaXRlciBUeXBlXG4gICAqL1xuICAvKipcbiAgICogV3JpdGUgdGhlIGNvbnRlbnRzIHRvIHRoZSBmaWxlV3JpdGVyOyBgY29udGVudHNgIHNob3VsZCBiZSBhIEJsb2IuXG4gICAqIEBtZXRob2QgX3dyaXRlRmlsZUNvbnRlbnRzXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0ZpbGVXcml0ZXJ9IGZpbGVXcml0ZXIgT2J0YWluZWQgZnJvbSBfY3JlYXRlRmlsZVdyaXRlclxuICAgKiBAcGFyYW0gIHsqfSBjb250ZW50cyAgIFRoZSBjb250ZW50cyB0byB3cml0ZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgIHRoZSBQcm9taXNlXG4gICAqL1xuICBmdW5jdGlvbiBfd3JpdGVGaWxlQ29udGVudHMoIGZpbGVXcml0ZXIsIGNvbnRlbnRzICkge1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX3dyaXRlRmlsZUNvbnRlbnRzOlwiLCBmaWxlV3JpdGVyLCBjb250ZW50c10uam9pbiggXCIgXCIgKSApO1xuICAgIH1cbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgdHJ5IHtcbiAgICAgIGZpbGVXcml0ZXIub253cml0ZSA9IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgZmlsZVdyaXRlci5vbndyaXRlID0gZnVuY3Rpb24gKCBlICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIGUgKTtcbiAgICAgICAgfTtcbiAgICAgICAgZmlsZVdyaXRlci53cml0ZSggY29udGVudHMgKTtcbiAgICAgIH07XG4gICAgICBmaWxlV3JpdGVyLm9uRXJyb3IgPSBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgfTtcbiAgICAgIGZpbGVXcml0ZXIudHJ1bmNhdGUoIDAgKTsgLy8gY2xlYXIgb3V0IHRoZSBjb250ZW50cywgZmlyc3RcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcHkgdGhlIGZpbGUgdG8gdGhlIHNwZWNpZmllZCBwYXJlbnQgZGlyZWN0b3J5LCB3aXRoIGFuIG9wdGlvbmFsIG5ldyBuYW1lXG4gICAqIEBtZXRob2QgX2NvcHlGaWxlXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0ZpbGVFbnRyeX0gdGhlRmlsZUVudHJ5ICAgICAgICAgICAgVGhlIGZpbGUgdG8gY29weVxuICAgKiBAcGFyYW0gIHtEaXJlY3RvcnlFbnRyeX0gdGhlUGFyZW50RGlyZWN0b3J5RW50cnkgVGhlIHBhcmVudCBkaXJlY3RvcnkgdG8gY29weSB0aGUgZmlsZSB0b1xuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZU5ld05hbWUgICAgICAgICAgICAgIFRoZSBuZXcgbmFtZSBvZiB0aGUgZmlsZSAoIG9yIHVuZGVmaW5lZCBzaW1wbHkgdG8gY29weSApXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBQcm9taXNlXG4gICAqL1xuICBmdW5jdGlvbiBfY29weUZpbGUoIHRoZUZpbGVFbnRyeSwgdGhlUGFyZW50RGlyZWN0b3J5RW50cnksIHRoZU5ld05hbWUgKSB7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfY29weUZpbGU6XCIsIHRoZUZpbGVFbnRyeSwgdGhlUGFyZW50RGlyZWN0b3J5RW50cnksXG4gICAgICAgICAgICAgICAgICAgIHRoZU5ld05hbWVcbiAgICAgICAgICAgICAgICAgICBdLmpvaW4oIFwiIFwiICkgKTtcbiAgICB9XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHRyeSB7XG4gICAgICB0aGVGaWxlRW50cnkuY29weVRvKCB0aGVQYXJlbnREaXJlY3RvcnlFbnRyeSwgdGhlTmV3TmFtZSwgZnVuY3Rpb24gc3VjY2VzcyggdGhlTmV3RmlsZUVudHJ5ICkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVOZXdGaWxlRW50cnkgKTtcbiAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgfSApO1xuICAgIH1cbiAgICBjYXRjaCAoIGFuRXJyb3IgKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogTW92ZSB0aGUgZmlsZSB0byB0aGUgc3BlY2lmaWVkIHBhcmVudCBkaXJlY3RvcnksIHdpdGggYW4gb3B0aW9uYWwgbmV3IG5hbWVcbiAgICogQG1ldGhvZCBfbW92ZUZpbGVcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7RmlsZUVudHJ5fSB0aGVGaWxlRW50cnkgICAgICAgICAgICBUaGUgZmlsZSB0byBtb3ZlIG9yIHJlbmFtZVxuICAgKiBAcGFyYW0gIHtEaXJlY3RvcnlFbnRyeX0gdGhlUGFyZW50RGlyZWN0b3J5RW50cnkgVGhlIHBhcmVudCBkaXJlY3RvcnkgdG8gbW92ZSB0aGUgZmlsZSB0byAob3IgdGhlIHNhbWUgYXMgdGhlIGZpbGUgaW4gb3JkZXIgdG8gcmVuYW1lKVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZU5ld05hbWUgICAgICAgICAgICAgIFRoZSBuZXcgbmFtZSBvZiB0aGUgZmlsZSAoIG9yIHVuZGVmaW5lZCBzaW1wbHkgdG8gbW92ZSApXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBQcm9taXNlXG4gICAqL1xuICBmdW5jdGlvbiBfbW92ZUZpbGUoIHRoZUZpbGVFbnRyeSwgdGhlUGFyZW50RGlyZWN0b3J5RW50cnksIHRoZU5ld05hbWUgKSB7XG4gICAgaWYgKCBERUJVRyApIHtcbiAgICAgIGNvbnNvbGUubG9nKCBbXCJfbW92ZUZpbGU6XCIsIHRoZUZpbGVFbnRyeSwgdGhlUGFyZW50RGlyZWN0b3J5RW50cnksXG4gICAgICAgICAgICAgICAgICAgIHRoZU5ld05hbWVcbiAgICAgICAgICAgICAgICAgICBdLmpvaW4oIFwiIFwiICkgKTtcbiAgICB9XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHRyeSB7XG4gICAgICB0aGVGaWxlRW50cnkubW92ZVRvKCB0aGVQYXJlbnREaXJlY3RvcnlFbnRyeSwgdGhlTmV3TmFtZSwgZnVuY3Rpb24gc3VjY2VzcyggdGhlTmV3RmlsZUVudHJ5ICkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVOZXdGaWxlRW50cnkgKTtcbiAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgfSApO1xuICAgIH1cbiAgICBjYXRjaCAoIGFuRXJyb3IgKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBmaWxlIGZyb20gdGhlIGZpbGUgc3lzdGVtXG4gICAqIEBtZXRob2QgX3JlbW92ZUZpbGVcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7RmlsZUVudHJ5fSB0aGVGaWxlRW50cnkgVGhlIGZpbGUgdG8gcmVtb3ZlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX3JlbW92ZUZpbGUoIHRoZUZpbGVFbnRyeSApIHtcbiAgICBpZiAoIERFQlVHICkge1xuICAgICAgY29uc29sZS5sb2coIFtcIl9yZW1vdmVGaWxlOlwiLCB0aGVGaWxlRW50cnldLmpvaW4oIFwiIFwiICkgKTtcbiAgICB9XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHRyeSB7XG4gICAgICB0aGVGaWxlRW50cnkucmVtb3ZlKCBmdW5jdGlvbiBzdWNjZXNzKCkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgIH0gKTtcbiAgICB9XG4gICAgY2F0Y2ggKCBhbkVycm9yICkge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcGllcyBhIGRpcmVjdG9yeSB0byB0aGUgc3BlY2lmaWVkIGRpcmVjdG9yeSwgd2l0aCBhbiBvcHRpb25hbCBuZXcgbmFtZS4gVGhlIGRpcmVjdG9yeVxuICAgKiBpcyBjb3BpZWQgcmVjdXJzaXZlbHkuXG4gICAqIEBtZXRob2QgX2NvcHlEaXJlY3RvcnlcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5RW50cnl9IHRoZURpcmVjdG9yeUVudHJ5ICAgICAgIFRoZSBkaXJlY3RvcnkgdG8gY29weVxuICAgKiBAcGFyYW0gIHtEaXJlY3RvcnlFbnRyeX0gdGhlUGFyZW50RGlyZWN0b3J5RW50cnkgVGhlIHBhcmVudCBkaXJlY3RvcnkgdG8gY29weSB0aGUgZmlyc3QgZGlyZWN0b3J5IHRvXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdGhlTmV3TmFtZSAgICAgICAgICAgICAgVGhlIG9wdGlvbmFsIG5ldyBuYW1lIGZvciB0aGUgZGlyZWN0b3J5XG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgICAgICAgIEEgcHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX2NvcHlEaXJlY3RvcnkoIHRoZURpcmVjdG9yeUVudHJ5LCB0aGVQYXJlbnREaXJlY3RvcnlFbnRyeSwgdGhlTmV3TmFtZSApIHtcbiAgICBpZiAoIERFQlVHICkge1xuICAgICAgY29uc29sZS5sb2coIFtcIl9jb3B5RGlyZWN0b3J5OlwiLCB0aGVEaXJlY3RvcnlFbnRyeSxcbiAgICAgICAgICAgICAgICAgICAgdGhlUGFyZW50RGlyZWN0b3J5RW50cnksXG4gICAgICAgICAgICAgICAgICAgIHRoZU5ld05hbWVcbiAgICAgICAgICAgICAgICAgICBdLmpvaW4oIFwiIFwiICkgKTtcbiAgICB9XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHRyeSB7XG4gICAgICB0aGVEaXJlY3RvcnlFbnRyeS5jb3B5VG8oIHRoZVBhcmVudERpcmVjdG9yeUVudHJ5LCB0aGVOZXdOYW1lLCBmdW5jdGlvbiBzdWNjZXNzKCB0aGVOZXdEaXJlY3RvcnlFbnRyeSApIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlTmV3RGlyZWN0b3J5RW50cnkgKTtcbiAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgfSApO1xuICAgIH1cbiAgICBjYXRjaCAoIGFuRXJyb3IgKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgYSBkaXJlY3RvcnkgdG8gdGhlIHNwZWNpZmllZCBkaXJlY3RvcnksIHdpdGggYW4gb3B0aW9uYWwgbmV3IG5hbWUuIFRoZSBkaXJlY3RvcnlcbiAgICogaXMgbW92ZWQgcmVjdXJzaXZlbHkuXG4gICAqIEBtZXRob2QgX21vdmVEaXJlY3RvcnlcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5RW50cnl9IHRoZURpcmVjdG9yeUVudHJ5ICAgICAgIFRoZSBkaXJlY3RvcnkgdG8gbW92ZVxuICAgKiBAcGFyYW0gIHtEaXJlY3RvcnlFbnRyeX0gdGhlUGFyZW50RGlyZWN0b3J5RW50cnkgVGhlIHBhcmVudCBkaXJlY3RvcnkgdG8gbW92ZSB0aGUgZmlyc3QgZGlyZWN0b3J5IHRvXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdGhlTmV3TmFtZSAgICAgICAgICAgICAgVGhlIG9wdGlvbmFsIG5ldyBuYW1lIGZvciB0aGUgZGlyZWN0b3J5XG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgICAgICAgIEEgcHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX21vdmVEaXJlY3RvcnkoIHRoZURpcmVjdG9yeUVudHJ5LCB0aGVQYXJlbnREaXJlY3RvcnlFbnRyeSwgdGhlTmV3TmFtZSApIHtcbiAgICBpZiAoIERFQlVHICkge1xuICAgICAgY29uc29sZS5sb2coIFtcIl9tb3ZlRGlyZWN0b3J5OlwiLCB0aGVEaXJlY3RvcnlFbnRyeSxcbiAgICAgICAgICAgICAgICAgICAgdGhlUGFyZW50RGlyZWN0b3J5RW50cnksXG4gICAgICAgICAgICAgICAgICAgIHRoZU5ld05hbWVcbiAgICAgICAgICAgICAgICAgICBdLmpvaW4oIFwiIFwiICkgKTtcbiAgICB9XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHRyeSB7XG4gICAgICB0aGVEaXJlY3RvcnlFbnRyeS5tb3ZlVG8oIHRoZVBhcmVudERpcmVjdG9yeUVudHJ5LCB0aGVOZXdOYW1lLCBmdW5jdGlvbiBzdWNjZXNzKCB0aGVOZXdEaXJlY3RvcnlFbnRyeSApIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlTmV3RGlyZWN0b3J5RW50cnkgKTtcbiAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgfSApO1xuICAgIH1cbiAgICBjYXRjaCAoIGFuRXJyb3IgKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGRpcmVjdG9yeSBmcm9tIHRoZSBmaWxlIHN5c3RlbS4gSWYgcmVjdXJzaXZlbHkgaXMgdHJ1ZSwgdGhlIGRpcmVjdG9yeSBpcyByZW1vdmVkXG4gICAqIHJlY3Vyc2l2ZWx5LlxuICAgKiBAbWV0aG9kIF9yZW1vdmVEaXJlY3RvcnlcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5RW50cnl9IHRoZURpcmVjdG9yeUVudHJ5IFRoZSBkaXJlY3RvcnkgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IHJlY3Vyc2l2ZWx5ICAgICAgIElmIHRydWUsIHJlbW92ZSByZWN1cnNpdmVseVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgKi9cbiAgZnVuY3Rpb24gX3JlbW92ZURpcmVjdG9yeSggdGhlRGlyZWN0b3J5RW50cnksIHJlY3Vyc2l2ZWx5ICkge1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX3JlbW92ZURpcmVjdG9yeTpcIiwgdGhlRGlyZWN0b3J5RW50cnksIFwicmVjdXJzaXZlbHlcIixcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzaXZlbHlcbiAgICAgICAgICAgICAgICAgICBdLmpvaW4oIFwiIFwiICkgKTtcbiAgICB9XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHRyeSB7XG4gICAgICBpZiAoICFyZWN1cnNpdmVseSApIHtcbiAgICAgICAgdGhlRGlyZWN0b3J5RW50cnkucmVtb3ZlKCBmdW5jdGlvbiBzdWNjZXNzKCkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gZmFpbHVyZSggYW5FcnJvciApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgfSApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhlRGlyZWN0b3J5RW50cnkucmVtb3ZlUmVjdXJzaXZlbHkoIGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbiBmYWlsdXJlKCBhbkVycm9yICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICB9ICk7XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoICggYW5FcnJvciApIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkcyB0aGUgY29udGVudHMgb2YgYSBkaXJlY3RvcnlcbiAgICogQG1ldGhvZCBfcmVhZERpcmVjdG9yeUNvbnRlbnRzXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeUVudHJ5fSB0aGVEaXJlY3RvcnlFbnRyeSBUaGUgZGlyZWN0b3J5IHRvIGxpc3RcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICAgVGhlIHByb21pc2VcbiAgICovXG4gIGZ1bmN0aW9uIF9yZWFkRGlyZWN0b3J5Q29udGVudHMoIHRoZURpcmVjdG9yeUVudHJ5ICkge1xuICAgIGlmICggREVCVUcgKSB7XG4gICAgICBjb25zb2xlLmxvZyggW1wiX3JlYWREaXJlY3RvcnlDb250ZW50czpcIiwgdGhlRGlyZWN0b3J5RW50cnldLmpvaW4oIFwiIFwiICkgKTtcbiAgICB9XG4gICAgdmFyIGRpcmVjdG9yeVJlYWRlciA9IHRoZURpcmVjdG9yeUVudHJ5LmNyZWF0ZVJlYWRlcigpLFxuICAgICAgZW50cmllcyA9IFtdLFxuICAgICAgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICBmdW5jdGlvbiByZWFkRW50cmllcygpIHtcbiAgICAgIGRpcmVjdG9yeVJlYWRlci5yZWFkRW50cmllcyggZnVuY3Rpb24gc3VjY2VzcyggdGhlRW50cmllcyApIHtcbiAgICAgICAgaWYgKCAhdGhlRW50cmllcy5sZW5ndGggKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggZW50cmllcyApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudHJpZXMgPSBlbnRyaWVzLmNvbmNhdCggQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIHRoZUVudHJpZXMgfHwgW10sIDAgKSApO1xuICAgICAgICAgIHJlYWRFbnRyaWVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIGZhaWx1cmUoIGFuRXJyb3IgKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgfSApO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByZWFkRW50cmllcygpO1xuICAgIH1cbiAgICBjYXRjaCAoIGFuRXJyb3IgKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogQGNsYXNzIEZpbGVNYW5hZ2VyXG4gICAqL1xuICB2YXIgX2NsYXNzTmFtZSA9IFwiVVRJTC5GaWxlTWFuYWdlclwiLFxuICAgIEZpbGVNYW5hZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYsXG4gICAgICAvLyBkZXRlcm1pbmUgaWYgd2UgaGF2ZSBhIGBCYXNlT2JqZWN0YCBhdmFpbGFibGUgb3Igbm90XG4gICAgICAgIGhhc0Jhc2VPYmplY3QgPSAoIHR5cGVvZiBCYXNlT2JqZWN0ICE9PSBcInVuZGVmaW5lZFwiICk7XG4gICAgICBpZiAoIGhhc0Jhc2VPYmplY3QgKSB7XG4gICAgICAgIC8vIGlmIHdlIGRvLCBzdWJjbGFzcyBpdFxuICAgICAgICBzZWxmID0gbmV3IEJhc2VPYmplY3QoKTtcbiAgICAgICAgc2VsZi5zdWJjbGFzcyggX2NsYXNzTmFtZSApO1xuICAgICAgICBzZWxmLnJlZ2lzdGVyTm90aWZpY2F0aW9uKCBcImNoYW5nZWRDdXJyZW50V29ya2luZ0RpcmVjdG9yeVwiICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBvdGhlcndpc2UsIGJhc2Ugb2ZmIHt9XG4gICAgICAgIHNlbGYgPSB7fTtcbiAgICAgIH1cbiAgICAgIC8vIGdldCB0aGUgcGVyc2lzdGVudCBhbmQgdGVtcG9yYXJ5IGZpbGVzeXN0ZW0gY29uc3RhbnRzXG4gICAgICBzZWxmLlBFUlNJU1RFTlQgPSAoIHR5cGVvZiBMb2NhbEZpbGVTeXN0ZW0gIT09IFwidW5kZWZpbmVkXCIgKSA/IExvY2FsRmlsZVN5c3RlbS5QRVJTSVNURU5UIDogd2luZG93LlBFUlNJU1RFTlQ7XG4gICAgICBzZWxmLlRFTVBPUkFSWSA9ICggdHlwZW9mIExvY2FsRmlsZVN5c3RlbSAhPT0gXCJ1bmRlZmluZWRcIiApID8gTG9jYWxGaWxlU3lzdGVtLlRFTVBPUkFSWSA6IHdpbmRvdy5URU1QT1JBUlk7XG4gICAgICAvLyBkZXRlcm1pbmUgdGhlIHZhcmlvdXMgZmlsZSB0eXBlcyB3ZSBzdXBwb3J0XG4gICAgICBzZWxmLkZJTEVUWVBFID0ge1xuICAgICAgICBURVhUOiAgICAgICAgIFwiVGV4dFwiLFxuICAgICAgICBEQVRBX1VSTDogICAgIFwiRGF0YVVSTFwiLFxuICAgICAgICBCSU5BUlk6ICAgICAgIFwiQmluYXJ5U3RyaW5nXCIsXG4gICAgICAgIEFSUkFZX0JVRkZFUjogXCJBcnJheUJ1ZmZlclwiXG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgZ2xvYmFsIGBERUJVR2AgdmFyaWFibGUuXG4gICAgICAgKiBAbWV0aG9kIGdldEdsb2JhbERlYnVnXG4gICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgICAqL1xuICAgICAgc2VsZi5nZXRHbG9iYWxEZWJ1ZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIERFQlVHO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogU2V0cyB0aGUgZ2xvYmFsIERFQlVHIHZhcmlhYmxlLiBJZiBgdHJ1ZWAsIGRlYnVnIG1lc3NhZ2VzIGFyZSBsb2dnZWQgdG8gdGhlIGNvbnNvbGUuXG4gICAgICAgKiBAbWV0aG9kIHNldEdsb2JhbERlYnVnXG4gICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRlYnVnXG4gICAgICAgKi9cbiAgICAgIHNlbGYuc2V0R2xvYmFsRGVidWcgPSBmdW5jdGlvbiAoIGRlYnVnICkge1xuICAgICAgICBERUJVRyA9IGRlYnVnO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQHByb3BlcnR5IGdsb2JhbERlYnVnXG4gICAgICAgKiBAdHlwZSB7Qm9vbGVhbn0gSWYgYHRydWVgLCBsb2dzIG1lc3NhZ2VzIHRvIGNvbnNvbGUgYXMgb3BlcmF0aW9ucyBvY2N1ci5cbiAgICAgICAqL1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBcImdsb2JhbERlYnVnXCIsIHtcbiAgICAgICAgZ2V0OiAgICAgICAgICBzZWxmLmdldEdsb2JhbERlYnVnLFxuICAgICAgICBzZXQ6ICAgICAgICAgIHNlbGYuc2V0R2xvYmFsRGVidWcsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSApO1xuICAgICAgLyoqXG4gICAgICAgKiB0aGUgZmlsZVN5c3RlbVR5cGUgY2FuIGVpdGhlciBiZSBgc2VsZi5QRVJTSVNURU5UYCBvciBgc2VsZi5URU1QT1JBUllgLCBhbmQgaXMgb25seVxuICAgICAgICogc2V0IGR1cmluZyBhbiBgaW5pdGAgb3BlcmF0aW9uLiBJdCBjYW5ub3QgYmUgc2V0IGF0IGFueSBvdGhlciB0aW1lLlxuICAgICAgICogQHByb3BlcnR5IGZpbGVTeXN0ZW1UeXBlXG4gICAgICAgKiBAdHlwZSB7RmlsZVN5c3RlbX1cbiAgICAgICAqL1xuICAgICAgc2VsZi5fZmlsZVN5c3RlbVR5cGUgPSBudWxsOyAvLyBjYW4gb25seSBiZSBjaGFuZ2VkIGR1cmluZyBJTklUXG4gICAgICBzZWxmLmdldEZpbGVTeXN0ZW1UeXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fZmlsZVN5c3RlbVR5cGU7XG4gICAgICB9O1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBcImZpbGVTeXN0ZW1UeXBlXCIsIHtcbiAgICAgICAgZ2V0OiAgICAgICAgICBzZWxmLmdldEZpbGVTeXN0ZW1UeXBlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0gKTtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIHJlcXVlc3RlZCBxdW90YSAtLSBzdG9yZWQgZm9yIGZ1dHVyZSByZWZlcmVuY2UsIHNpbmNlIHdlIGFzayBmb3IgaXRcbiAgICAgICAqIHNwZWNpZmljYWxseSBkdXJpbmcgYW4gYGluaXRgIG9wZXJhdGlvbi4gSXQgY2Fubm90IGJlIGNoYW5nZWQuXG4gICAgICAgKiBAcHJvcGVydHkgcmVxdWVzdGVkUXVvdGFcbiAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgKi9cbiAgICAgIHNlbGYuX3JlcXVlc3RlZFF1b3RhID0gMDsgLy8gY2FuIG9ubHkgYmUgY2hhbmdlZCBkdXJpbmcgSU5JVFxuICAgICAgc2VsZi5nZXRSZXF1ZXN0ZWRRdW90YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX3JlcXVlc3RlZFF1b3RhO1xuICAgICAgfTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgXCJyZXF1ZXN0ZWRRdW90YVwiLCB7XG4gICAgICAgIGdldDogICAgICAgICAgc2VsZi5nZXRSZXF1ZXN0ZWRRdW90YSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9ICk7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBhY3R1YWwgcXVvdGEgb2J0YWluZWQgZnJvbSB0aGUgc3lzdGVtLiBJdCBjYW5ub3QgYmUgY2hhbmdlZCwgYW5kIGlzXG4gICAgICAgKiBvbmx5IG9idGFpbmVkIGR1cmluZyBgaW5pdGAuIFRoZSByZXN1bHQgZG9lcyBub3QgaGF2ZSB0byBtYXRjaCB0aGVcbiAgICAgICAqIGByZXF1ZXN0ZWRRdW90YWAuIElmIGl0IGRvZXNuJ3QgbWF0Y2gsIGl0IG1heSBiZSByZXByZXNlbnRhdGl2ZSBvZiB0aGVcbiAgICAgICAqIGFjdHVhbCBzcGFjZSBhdmFpbGFibGUsIGRlcGVuZGluZyBvbiB0aGUgcGxhdGZvcm1cbiAgICAgICAqIEBwcm9wZXJ0eSBhY3R1YWxRdW90YVxuICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAqL1xuICAgICAgc2VsZi5fYWN0dWFsUXVvdGEgPSAwO1xuICAgICAgc2VsZi5nZXRBY3R1YWxRdW90YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2FjdHVhbFF1b3RhO1xuICAgICAgfTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgXCJhY3R1YWxRdW90YVwiLCB7XG4gICAgICAgIGdldDogICAgICAgICAgc2VsZi5nZXRBY3R1YWxRdW90YSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9ICk7XG4gICAgICAvKipcbiAgICAgICAqIEB0eXBlZGVmIHt7fX0gRmlsZVN5c3RlbVxuICAgICAgICogSFRNTDUgRmlsZSBBUEkgRmlsZSBTeXN0ZW1cbiAgICAgICAqL1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY3VycmVudCBmaWxlc3lzdGVtIC0tIGVpdGhlciB0aGUgdGVtcG9yYXJ5IG9yIHBlcnNpc3RlbnQgb25lOyBpdCBjYW4ndCBiZSBjaGFuZ2VkXG4gICAgICAgKiBAcHJvcGVydHkgZmlsZVN5c3RlbVxuICAgICAgICogQHR5cGUge0ZpbGVTeXN0ZW19XG4gICAgICAgKi9cbiAgICAgIHNlbGYuX2ZpbGVTeXN0ZW0gPSBudWxsO1xuICAgICAgc2VsZi5nZXRGaWxlU3lzdGVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fZmlsZVN5c3RlbTtcbiAgICAgIH07XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIFwiZmlsZVN5c3RlbVwiLCB7XG4gICAgICAgIGdldDogICAgICAgICAgc2VsZi5nZXRGaWxlU3lzdGVtLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0gKTtcbiAgICAgIC8qKlxuICAgICAgICogQ3VycmVudCBXb3JraW5nIERpcmVjdG9yeSBFbnRyeVxuICAgICAgICogQHByb3BlcnR5IGN3ZFxuICAgICAgICogQHR5cGUge0RpcmVjdG9yeUVudHJ5fVxuICAgICAgICovXG4gICAgICBzZWxmLl9yb290ID0gbnVsbDtcbiAgICAgIHNlbGYuX2N3ZCA9IG51bGw7XG4gICAgICBzZWxmLmdldEN1cnJlbnRXb3JraW5nRGlyZWN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fY3dkO1xuICAgICAgfTtcbiAgICAgIHNlbGYuc2V0Q3VycmVudFdvcmtpbmdEaXJlY3RvcnkgPSBmdW5jdGlvbiAoIHRoZUNXRCApIHtcbiAgICAgICAgc2VsZi5fY3dkID0gdGhlQ1dEO1xuICAgICAgICBpZiAoIGhhc0Jhc2VPYmplY3QgKSB7XG4gICAgICAgICAgc2VsZi5ub3RpZnkoIFwiY2hhbmdlZEN1cnJlbnRXb3JraW5nRGlyZWN0b3J5XCIgKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgXCJjd2RcIiwge1xuICAgICAgICBnZXQ6ICAgICAgICAgIHNlbGYuZ2V0Q3VycmVudFdvcmtpbmdEaXJlY3RvcnksXG4gICAgICAgIHNldDogICAgICAgICAgc2VsZi5zZXRDdXJyZW50V29ya2luZ0RpcmVjdG9yeSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9ICk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHNlbGYsIFwiY3VycmVudFdvcmtpbmdEaXJlY3RvcnlcIiwge1xuICAgICAgICBnZXQ6ICAgICAgICAgIHNlbGYuZ2V0Q3VycmVudFdvcmtpbmdEaXJlY3RvcnksXG4gICAgICAgIHNldDogICAgICAgICAgc2VsZi5zZXRDdXJyZW50V29ya2luZ0RpcmVjdG9yeSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9ICk7XG4gICAgICAvKipcbiAgICAgICAqIEN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnkgc3RhY2tcbiAgICAgICAqIEBwcm9wZXJ0eSBfY3dkc1xuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAqL1xuICAgICAgc2VsZi5fY3dkcyA9IFtdO1xuICAgICAgLyoqXG4gICAgICAgKiBQdXNoIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5IG9uIHRvIHRoZSBzdGFja1xuICAgICAgICogQG1ldGhvZCBwdXNoQ3VycmVudFdvcmtpbmdEaXJlY3RvcnlcbiAgICAgICAqL1xuICAgICAgc2VsZi5wdXNoQ3VycmVudFdvcmtpbmdEaXJlY3RvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuX2N3ZHMucHVzaCggc2VsZi5fY3dkICk7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBQb3AgdGhlIHRvcG1vc3QgZGlyZWN0b3J5IG9uIHRoZSBzdGFjayBhbmQgY2hhbmdlIHRvIGl0XG4gICAgICAgKiBAbWV0aG9kIHBvcEN1cnJlbnRXb3JraW5nRGlyZWN0b3J5XG4gICAgICAgKi9cbiAgICAgIHNlbGYucG9wQ3VycmVudFdvcmtpbmdEaXJlY3RvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuc2V0Q3VycmVudFdvcmtpbmdEaXJlY3RvcnkoIHNlbGYuX2N3ZHMucG9wKCkgKTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFJlc29sdmVzIGEgVVJMIHRvIGEgbG9jYWwgZmlsZSBzeXN0ZW0uIElmIHRoZSBVUkwgc2NoZW1lIGlzIG5vdCBwcmVzZW50LCBgZmlsZWBcbiAgICAgICAqIGlzIGFzc3VtZWQuXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlVVJJIFRoZSBVUkkgdG8gcmVzb2x2ZVxuICAgICAgICovXG4gICAgICBzZWxmLnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwgPSBmdW5jdGlvbiAoIHRoZVVSSSApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfcmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCggdGhlVVJJICkudGhlbiggZnVuY3Rpb24gZ290RW50cnkoIHRoZUVudHJ5ICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZUVudHJ5ICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdGhlIGZpbGUgZW50cnkgZm9yIHRoZSBnaXZlbiBwYXRoICh1c2VmdWwgZm9yXG4gICAgICAgKiBnZXR0aW5nIHRoZSBmdWxsIHBhdGggb2YgYSBmaWxlKS4gYG9wdGlvbnNgIGlzIG9mIHRoZVxuICAgICAgICogZm9ybSBge2NyZWF0ZTogdHJ1ZS9mYWxzZSwgZXhjbHVzaXZlOiB0cnVlL2ZhbHNlfWBcbiAgICAgICAqIEBtZXRob2QgZ2V0RmlsZUVudHJ5XG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlRmlsZVBhdGggVGhlIGZpbGUgcGF0aCBvciBGaWxlRW50cnkgb2JqZWN0XG4gICAgICAgKiBAcGFyYW0geyp9IG9wdGlvbnMgY3JlYXRpb24gb3B0aW9uc1xuICAgICAgICovXG4gICAgICBzZWxmLmdldEZpbGVFbnRyeSA9IGZ1bmN0aW9uICggdGhlRmlsZVBhdGgsIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX2dldEZpbGVFbnRyeSggc2VsZi5fY3dkLCB0aGVGaWxlUGF0aCwgb3B0aW9ucyApLnRoZW4oIGZ1bmN0aW9uIGdvdEZpbGVFbnRyeSggdGhlRmlsZUVudHJ5ICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZUZpbGVFbnRyeSApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRoZSBmaWxlIG9iamVjdCBmb3IgYSBnaXZlbiBmaWxlICh1c2VmdWwgZm9yIGdldHRpbmdcbiAgICAgICAqIHRoZSBzaXplIG9mIGEgZmlsZSk7IGBvcHRpb25gIGlzIG9mIHRoZSBmb3JtIGB7Y3JlYXRlOiB0cnVlL2ZhbHNlLCBleGNsdXNpdmU6IHRydWUvZmFsc2V9YFxuICAgICAgICogQG1ldGhvZCBnZXRGaWxlXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlRmlsZVBhdGhcbiAgICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9uXG4gICAgICAgKi9cbiAgICAgIHNlbGYuZ2V0RmlsZSA9IGZ1bmN0aW9uICggdGhlRmlsZVBhdGgsIG9wdGlvbnMgKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmdldEZpbGVFbnRyeSggdGhlRmlsZVBhdGgsIG9wdGlvbnMgKS50aGVuKCBfZ2V0RmlsZU9iamVjdCApO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgZGlyZWN0b3J5IGVudHJ5IGZvciBhIGdpdmVuIHBhdGhcbiAgICAgICAqIEBtZXRob2QgZ2V0RGlyZWN0b3J5RW50cnlcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVEaXJlY3RvcnlQYXRoXG4gICAgICAgKiBAcGFyYW0geyp9IG9wdGlvbnNcbiAgICAgICAqL1xuICAgICAgc2VsZi5nZXREaXJlY3RvcnlFbnRyeSA9IGZ1bmN0aW9uICggdGhlRGlyZWN0b3J5UGF0aCwgb3B0aW9ucyApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgdGhlRGlyZWN0b3J5UGF0aCwgb3B0aW9ucyApLnRoZW4oIGZ1bmN0aW9uIGdvdERpcmVjdG9yeUVudHJ5KCB0aGVEaXJlY3RvcnlFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVEaXJlY3RvcnlFbnRyeSApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiByZXR1cm5zIHRoZSBVUkwgZm9yIGEgZ2l2ZW4gZmlsZVxuICAgICAgICogQG1ldGhvZCBnZXRGaWxlVVJMXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlRmlsZVBhdGhcbiAgICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9uc1xuICAgICAgICovXG4gICAgICBzZWxmLmdldEZpbGVVUkwgPSBmdW5jdGlvbiAoIHRoZUZpbGVQYXRoLCBvcHRpb25zICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgIF9nZXRGaWxlRW50cnkoIHNlbGYuX2N3ZCwgdGhlRmlsZVBhdGgsIG9wdGlvbnMgKS50aGVuKCBmdW5jdGlvbiBnb3RGaWxlRW50cnkoIHRoZUZpbGVFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVGaWxlRW50cnkudG9VUkwoKSApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIGEgVVJMIGZvciB0aGUgZ2l2ZW4gZGlyZWN0b3J5XG4gICAgICAgKiBAbWV0aG9kIGdldERpcmVjdG9yeVVSTFxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZVBhdGhcbiAgICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9uc1xuICAgICAgICovXG4gICAgICBzZWxmLmdldERpcmVjdG9yeVVSTCA9IGZ1bmN0aW9uICggdGhlUGF0aCwgb3B0aW9ucyApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgdGhlUGF0aCB8fCBcIi5cIiwgb3B0aW9ucyApLnRoZW4oIGZ1bmN0aW9uIGdvdERpcmVjdG9yeUVudHJ5KCB0aGVEaXJlY3RvcnlFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVEaXJlY3RvcnlFbnRyeS50b1VSTCgpICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdGhlIG5hdGl2ZSBVUkwgZm9yIGFuIGVudHJ5IGJ5IGNvbWJpbmluZyB0aGUgYGZ1bGxQYXRoYCBvZiB0aGUgZW50cnlcbiAgICAgICAqIHdpdGggdGhlIGBuYXRpdmVVUkxgIG9mIHRoZSBgcm9vdGAgZGlyZWN0b3J5IGlmIGFic29sdXRlIG9yIG9mIHRoZSBgY3VycmVudGBcbiAgICAgICAqIGRpcmVjdG9yeSBpZiBub3QgYWJzb2x1dGUuXG4gICAgICAgKiBAbWV0aG9kIGdldE5hdGl2ZVVSTFxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZUVudHJ5IFBhdGggb2YgdGhlIGZpbGUgb3IgZGlyZWN0b3J5OyBjYW4gYWxzbyBiZSBhIEZpbGUvRGlyZWN0b3J5RW50cnlcbiAgICAgICAqL1xuICAgICAgc2VsZi5nZXROYXRpdmVVUkwgPSBmdW5jdGlvbiAoIHRoZUVudHJ5ICkge1xuICAgICAgICB2YXIgdGhlUGF0aCA9IHRoZUVudHJ5O1xuICAgICAgICBpZiAoIHR5cGVvZiB0aGVFbnRyeSAhPT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgICB0aGVQYXRoID0gdGhlRW50cnkuZnVsbFBhdGgoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaXNBYnNvbHV0ZSA9ICggdGhlUGF0aC5zdWJzdHIoIDAsIDEgKSA9PT0gXCIvXCIgKSxcbiAgICAgICAgICB0aGVSb290UGF0aCA9IGlzQWJzb2x1dGUgPyBzZWxmLl9yb290Lm5hdGl2ZVVSTCA6IHNlbGYuY3dkLm5hdGl2ZVVSTDtcbiAgICAgICAgcmV0dXJuIHRoZVJvb3RQYXRoICsgKCBpc0Fic29sdXRlID8gXCJcIiA6IFwiL1wiICkgKyB0aGVQYXRoO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogcmV0dXJucyB0aGUgbmF0aXZlIGZpbGUgcGF0aCBmb3IgYSBnaXZlbiBmaWxlXG4gICAgICAgKiBAbWV0aG9kIGdldE5hdGl2ZUZpbGVVUkxcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVGaWxlUGF0aFxuICAgICAgICogQHBhcmFtIHsqfSBvcHRpb25zXG4gICAgICAgKi9cbiAgICAgIHNlbGYuZ2V0TmF0aXZlRmlsZVVSTCA9IGZ1bmN0aW9uICggdGhlRmlsZVBhdGgsIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX2dldEZpbGVFbnRyeSggc2VsZi5fY3dkLCB0aGVGaWxlUGF0aCwgb3B0aW9ucyApLnRoZW4oIGZ1bmN0aW9uIGdvdEZpbGVFbnRyeSggdGhlRmlsZUVudHJ5ICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZUZpbGVFbnRyeS5uYXRpdmVVUkwgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyBhIFVSTCBmb3IgdGhlIGdpdmVuIGRpcmVjdG9yeVxuICAgICAgICogQG1ldGhvZCBnZXROYXRpdmVEaXJlY3RvcnlVUkxcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVQYXRoXG4gICAgICAgKiBAcGFyYW0geyp9IG9wdGlvbnNcbiAgICAgICAqL1xuICAgICAgc2VsZi5nZXROYXRpdmVEaXJlY3RvcnlVUkwgPSBmdW5jdGlvbiAoIHRoZVBhdGgsIG9wdGlvbnMgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX2dldERpcmVjdG9yeUVudHJ5KCBzZWxmLl9jd2QsIHRoZVBhdGggfHwgXCIuXCIsIG9wdGlvbnMgKS50aGVuKCBmdW5jdGlvbiBnb3REaXJlY3RvcnlFbnRyeSggdGhlRGlyZWN0b3J5RW50cnkgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlRGlyZWN0b3J5RW50cnkubmF0aXZlVVJMICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIENoYW5nZSB0byBhbiBhcmJpdHJhcnkgZGlyZWN0b3J5XG4gICAgICAgKiBAbWV0aG9kIGNoYW5nZURpcmVjdG9yeVxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB0aGVOZXdQYXRoIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnksIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLmNoYW5nZURpcmVjdG9yeSA9IGZ1bmN0aW9uICggdGhlTmV3UGF0aCApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgdGhlTmV3UGF0aCwge30gKS50aGVuKCBmdW5jdGlvbiBnb3REaXJlY3RvcnkoIHRoZU5ld0RpcmVjdG9yeSApIHtcbiAgICAgICAgICBzZWxmLmN3ZCA9IHRoZU5ld0RpcmVjdG9yeTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGFsbERvbmUoKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggc2VsZiApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBSZWFkIGFuIGFyYml0cmFyeSBmaWxlJ3MgY29udGVudHMuXG4gICAgICAgKiBAbWV0aG9kIHJlYWRGaWxlQ29udGVudHNcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdGhlRmlsZVBhdGggVGhlIHBhdGggdG8gdGhlIGZpbGUsIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zICAgICBUaGUgb3B0aW9ucyB0byB1c2Ugd2hlbiBvcGVuaW5nIHRoZSBmaWxlIChzdWNoIGFzIGNyZWF0aW5nIGl0KVxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSByZWFkQXNLaW5kICBIb3cgdG8gcmVhZCB0aGUgZmlsZSAtLSBiZXN0IHRvIHVzZSBzZWxmLkZJTEVUWVBFLlRFWFQsIGV0Yy5cbiAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgIFRoZSBQcm9taXNlXG4gICAgICAgKi9cbiAgICAgIHNlbGYucmVhZEZpbGVDb250ZW50cyA9IGZ1bmN0aW9uICggdGhlRmlsZVBhdGgsIG9wdGlvbnMsIHJlYWRBc0tpbmQgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgX2dldEZpbGVFbnRyeSggc2VsZi5fY3dkLCB0aGVGaWxlUGF0aCwgb3B0aW9ucyB8fCB7fSApLnRoZW4oIGZ1bmN0aW9uIGdvdFRoZUZpbGVFbnRyeSggdGhlRmlsZUVudHJ5ICkge1xuICAgICAgICAgIHJldHVybiBfZ2V0RmlsZU9iamVjdCggdGhlRmlsZUVudHJ5ICk7XG4gICAgICAgIH0gKS50aGVuKCBmdW5jdGlvbiBnb3RUaGVGaWxlT2JqZWN0KCB0aGVGaWxlT2JqZWN0ICkge1xuICAgICAgICAgIHJldHVybiBfcmVhZEZpbGVDb250ZW50cyggdGhlRmlsZU9iamVjdCwgcmVhZEFzS2luZCB8fCBcIlRleHRcIiApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gZ2V0VGhlRmlsZUNvbnRlbnRzKCB0aGVGaWxlQ29udGVudHMgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlRmlsZUNvbnRlbnRzICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFJlYWQgYW4gYXJiaXRyYXJ5IGRpcmVjdG9yeSdzIGVudHJpZXMuXG4gICAgICAgKiBAbWV0aG9kIHJlYWREaXJlY3RvcnlDb250ZW50c1xuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB0aGVEaXJlY3RvcnlQYXRoIFRoZSBwYXRoIHRvIHRoZSBkaXJlY3RvcnksIHJlbGF0aXZlIHRvIGN3ZDsgXCIuXCIgaWYgbm90IHNwZWNpZmllZFxuICAgICAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zICAgICAgICAgIFRoZSBvcHRpb25zIHRvIHVzZSB3aGVuIG9wZW5pbmcgdGhlIGRpcmVjdG9yeSAoc3VjaCBhcyBjcmVhdGluZyBpdClcbiAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgIFRoZSBQcm9taXNlXG4gICAgICAgKi9cbiAgICAgIHNlbGYucmVhZERpcmVjdG9yeUNvbnRlbnRzID0gZnVuY3Rpb24gKCB0aGVEaXJlY3RvcnlQYXRoLCBvcHRpb25zICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgIF9nZXREaXJlY3RvcnlFbnRyeSggc2VsZi5fY3dkLCB0aGVEaXJlY3RvcnlQYXRoIHx8IFwiLlwiLCBvcHRpb25zIHx8IHt9ICkudGhlbiggZnVuY3Rpb24gZ290VGhlRGlyZWN0b3J5RW50cnkoIHRoZURpcmVjdG9yeUVudHJ5ICkge1xuICAgICAgICAgIHJldHVybiBfcmVhZERpcmVjdG9yeUNvbnRlbnRzKCB0aGVEaXJlY3RvcnlFbnRyeSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gZ290VGhlRGlyZWN0b3J5RW50cmllcyggdGhlRW50cmllcyApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVFbnRyaWVzICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIFdyaXRlIGRhdGEgdG8gYW4gYXJiaXRyYXJ5IGZpbGVcbiAgICAgICAqIEBtZXRob2Qgd3JpdGVGaWxlQ29udGVudHNcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdGhlRmlsZVBhdGggVGhlIGZpbGUgbmFtZSB0byB3cml0ZSB0bywgcmVsYXRpdmUgdG8gY3dkXG4gICAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgICAgIFRoZSBvcHRpb25zIHRvIHVzZSB3aGVuIG9wZW5pbmcgdGhlIGZpbGVcbiAgICAgICAqIEBwYXJhbSAgeyp9IHRoZURhdGEgICAgIFRoZSBkYXRhIHRvIHdyaXRlXG4gICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLndyaXRlRmlsZUNvbnRlbnRzID0gZnVuY3Rpb24gKCB0aGVGaWxlUGF0aCwgb3B0aW9ucywgdGhlRGF0YSApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfZ2V0RmlsZUVudHJ5KCBzZWxmLl9jd2QsIHRoZUZpbGVQYXRoLCBvcHRpb25zIHx8IHtcbiAgICAgICAgICBjcmVhdGU6ICAgIHRydWUsXG4gICAgICAgICAgZXhjbHVzaXZlOiBmYWxzZVxuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gZ290VGhlRmlsZUVudHJ5KCB0aGVGaWxlRW50cnkgKSB7XG4gICAgICAgICAgcmV0dXJuIF9jcmVhdGVGaWxlV3JpdGVyKCB0aGVGaWxlRW50cnkgKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGdvdFRoZUZpbGVXcml0ZXIoIHRoZUZpbGVXcml0ZXIgKSB7XG4gICAgICAgICAgcmV0dXJuIF93cml0ZUZpbGVDb250ZW50cyggdGhlRmlsZVdyaXRlciwgdGhlRGF0YSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gYWxsRG9uZSgpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCBzZWxmICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYW4gYXJiaXRyYXJ5IGRpcmVjdG9yeVxuICAgICAgICogQG1ldGhvZCBjcmVhdGVEaXJlY3RvcnlcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdGhlRGlyZWN0b3J5UGF0aCBUaGUgcGF0aCwgcmVsYXRpdmUgdG8gY3dkXG4gICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgIFRoZSBQcm9taXNlXG4gICAgICAgKi9cbiAgICAgIHNlbGYuY3JlYXRlRGlyZWN0b3J5ID0gZnVuY3Rpb24gKCB0aGVEaXJlY3RvcnlQYXRoICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgIF9nZXREaXJlY3RvcnlFbnRyeSggc2VsZi5fY3dkLCB0aGVEaXJlY3RvcnlQYXRoLCB7XG4gICAgICAgICAgY3JlYXRlOiAgICB0cnVlLFxuICAgICAgICAgIGV4Y2x1c2l2ZTogZmFsc2VcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGdvdERpcmVjdG9yeSggdGhlTmV3RGlyZWN0b3J5ICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZU5ld0RpcmVjdG9yeSApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBDb3BpZXMgYSBmaWxlIHRvIGEgbmV3IGRpcmVjdG9yeSwgd2l0aCBhbiBvcHRpb25hbCBuZXcgbmFtZVxuICAgICAgICogQG1ldGhvZCBjb3B5RmlsZVxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBzb3VyY2VGaWxlUGF0aCAgICAgIFBhdGggdG8gZmlsZSwgcmVsYXRpdmUgdG8gY3dkXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRhcmdldERpcmVjdG9yeVBhdGggUGF0aCB0byBuZXcgZGlyZWN0b3J5LCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gd2l0aE5ld05hbWUgICAgICAgICBOZXcgbmFtZSwgaWYgZGVzaXJlZFxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLmNvcHlGaWxlID0gZnVuY3Rpb24gKCBzb3VyY2VGaWxlUGF0aCwgdGFyZ2V0RGlyZWN0b3J5UGF0aCwgd2l0aE5ld05hbWUgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKSxcbiAgICAgICAgICB0aGVGaWxlVG9Db3B5O1xuICAgICAgICBfZ2V0RmlsZUVudHJ5KCBzZWxmLl9jd2QsIHNvdXJjZUZpbGVQYXRoLCB7fSApLnRoZW4oIGZ1bmN0aW9uIGdvdEZpbGVFbnRyeSggYUZpbGVUb0NvcHkgKSB7XG4gICAgICAgICAgdGhlRmlsZVRvQ29weSA9IGFGaWxlVG9Db3B5O1xuICAgICAgICAgIHJldHVybiBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgdGFyZ2V0RGlyZWN0b3J5UGF0aCwge30gKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGdvdERpcmVjdG9yeUVudHJ5KCB0aGVUYXJnZXREaXJlY3RvcnkgKSB7XG4gICAgICAgICAgcmV0dXJuIF9jb3B5RmlsZSggdGhlRmlsZVRvQ29weSwgdGhlVGFyZ2V0RGlyZWN0b3J5LCB3aXRoTmV3TmFtZSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gYWxsRG9uZSggdGhlTmV3RmlsZUVudHJ5ICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZU5ld0ZpbGVFbnRyeSApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBDb3BpZXMgYSBkaXJlY3RvcnkgdG8gYSBuZXcgZGlyZWN0b3J5LCB3aXRoIGFuIG9wdGlvbmFsIG5ldyBuYW1lXG4gICAgICAgKiBAbWV0aG9kIGNvcHlEaXJlY3RvcnlcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gc291cmNlRGlyZWN0b3J5UGF0aCBQYXRoIHRvIGRpcmVjdG9yeSwgcmVsYXRpdmUgdG8gY3dkXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRhcmdldERpcmVjdG9yeVBhdGggUGF0aCB0byBuZXcgZGlyZWN0b3J5LCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gd2l0aE5ld05hbWUgICAgICAgICBOZXcgbmFtZSwgaWYgZGVzaXJlZFxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLmNvcHlEaXJlY3RvcnkgPSBmdW5jdGlvbiAoIHNvdXJjZURpcmVjdG9yeVBhdGgsIHRhcmdldERpcmVjdG9yeVBhdGgsIHdpdGhOZXdOYW1lICkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCksXG4gICAgICAgICAgdGhlRGlyZWN0b3J5VG9Db3B5O1xuICAgICAgICBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgc291cmNlRGlyZWN0b3J5UGF0aCwge30gKS50aGVuKCBmdW5jdGlvbiBnb3RTb3VyY2VEaXJlY3RvcnlFbnRyeSggc291cmNlRGlyZWN0b3J5RW50cnkgKSB7XG4gICAgICAgICAgdGhlRGlyZWN0b3J5VG9Db3B5ID0gc291cmNlRGlyZWN0b3J5RW50cnk7XG4gICAgICAgICAgcmV0dXJuIF9nZXREaXJlY3RvcnlFbnRyeSggc2VsZi5fY3dkLCB0YXJnZXREaXJlY3RvcnlQYXRoLCB7fSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gZ290VGFyZ2V0RGlyZWN0b3J5RW50cnkoIHRoZVRhcmdldERpcmVjdG9yeSApIHtcbiAgICAgICAgICByZXR1cm4gX2NvcHlEaXJlY3RvcnkoIHRoZURpcmVjdG9yeVRvQ29weSwgdGhlVGFyZ2V0RGlyZWN0b3J5LCB3aXRoTmV3TmFtZSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gYWxsRG9uZSggdGhlTmV3RGlyZWN0b3J5RW50cnkgKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSggdGhlTmV3RGlyZWN0b3J5RW50cnkgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogQG1ldGhvZCBtb3ZlRmlsZVxuICAgICAgICogTW92ZXMgYSBmaWxlIHRvIGEgbmV3IGRpcmVjdG9yeSwgd2l0aCBhbiBvcHRpb25hbCBuZXcgbmFtZVxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBzb3VyY2VGaWxlUGF0aCAgICAgIFBhdGggdG8gZmlsZSwgcmVsYXRpdmUgdG8gY3dkXG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRhcmdldERpcmVjdG9yeVBhdGggUGF0aCB0byBuZXcgZGlyZWN0b3J5LCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gd2l0aE5ld05hbWUgICAgICAgICBOZXcgbmFtZSwgaWYgZGVzaXJlZFxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLm1vdmVGaWxlID0gZnVuY3Rpb24gKCBzb3VyY2VGaWxlUGF0aCwgdGFyZ2V0RGlyZWN0b3J5UGF0aCwgd2l0aE5ld05hbWUgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKSxcbiAgICAgICAgICB0aGVGaWxlVG9Nb3ZlO1xuICAgICAgICBfZ2V0RmlsZUVudHJ5KCBzZWxmLl9jd2QsIHNvdXJjZUZpbGVQYXRoLCB7fSApLnRoZW4oIGZ1bmN0aW9uIGdvdEZpbGVFbnRyeSggYUZpbGVUb01vdmUgKSB7XG4gICAgICAgICAgdGhlRmlsZVRvTW92ZSA9IGFGaWxlVG9Nb3ZlO1xuICAgICAgICAgIHJldHVybiBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgdGFyZ2V0RGlyZWN0b3J5UGF0aCwge30gKTtcbiAgICAgICAgfSApLnRoZW4oIGZ1bmN0aW9uIGdvdERpcmVjdG9yeUVudHJ5KCB0aGVUYXJnZXREaXJlY3RvcnkgKSB7XG4gICAgICAgICAgcmV0dXJuIF9tb3ZlRmlsZSggdGhlRmlsZVRvTW92ZSwgdGhlVGFyZ2V0RGlyZWN0b3J5LCB3aXRoTmV3TmFtZSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gYWxsRG9uZSggdGhlTmV3RmlsZUVudHJ5ICkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHRoZU5ld0ZpbGVFbnRyeSApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBNb3ZlcyBhIGRpcmVjdG9yeSB0byBhIG5ldyBkaXJlY3RvcnksIHdpdGggYW4gb3B0aW9uYWwgbmV3IG5hbWVcbiAgICAgICAqIEBtZXRob2QgbW92ZURpcmVjdG9yeVxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBzb3VyY2VEaXJlY3RvcnlQYXRoIFBhdGggdG8gZGlyZWN0b3J5LCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gdGFyZ2V0RGlyZWN0b3J5UGF0aCBQYXRoIHRvIG5ldyBkaXJlY3RvcnksIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB3aXRoTmV3TmFtZSAgICAgICAgIE5ldyBuYW1lLCBpZiBkZXNpcmVkXG4gICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICAgIFRoZSBQcm9taXNlXG4gICAgICAgKi9cbiAgICAgIHNlbGYubW92ZURpcmVjdG9yeSA9IGZ1bmN0aW9uICggc291cmNlRGlyZWN0b3J5UGF0aCwgdGFyZ2V0RGlyZWN0b3J5UGF0aCwgd2l0aE5ld05hbWUgKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKSxcbiAgICAgICAgICB0aGVEaXJlY3RvcnlUb01vdmU7XG4gICAgICAgIF9nZXREaXJlY3RvcnlFbnRyeSggc2VsZi5fY3dkLCBzb3VyY2VEaXJlY3RvcnlQYXRoLCB7fSApLnRoZW4oIGZ1bmN0aW9uIGdvdFNvdXJjZURpcmVjdG9yeUVudHJ5KCBzb3VyY2VEaXJlY3RvcnlFbnRyeSApIHtcbiAgICAgICAgICB0aGVEaXJlY3RvcnlUb01vdmUgPSBzb3VyY2VEaXJlY3RvcnlFbnRyeTtcbiAgICAgICAgICByZXR1cm4gX2dldERpcmVjdG9yeUVudHJ5KCBzZWxmLl9jd2QsIHRhcmdldERpcmVjdG9yeVBhdGgsIHt9ICk7XG4gICAgICAgIH0gKS50aGVuKCBmdW5jdGlvbiBnb3RUYXJnZXREaXJlY3RvcnlFbnRyeSggdGhlVGFyZ2V0RGlyZWN0b3J5ICkge1xuICAgICAgICAgIHJldHVybiBfbW92ZURpcmVjdG9yeSggdGhlRGlyZWN0b3J5VG9Nb3ZlLCB0aGVUYXJnZXREaXJlY3RvcnksIHdpdGhOZXdOYW1lICk7XG4gICAgICAgIH0gKS50aGVuKCBmdW5jdGlvbiBhbGxEb25lKCB0aGVOZXdEaXJlY3RvcnlFbnRyeSApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCB0aGVOZXdEaXJlY3RvcnlFbnRyeSApO1xuICAgICAgICB9ICkuXG4gICAgICAgICAgY2F0Y2goIGZ1bmN0aW9uICggYW5FcnJvciApIHtcbiAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoIGFuRXJyb3IgKTtcbiAgICAgICAgICAgICAgICAgfSApLmRvbmUoKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9O1xuICAgICAgLyoqXG4gICAgICAgKiBSZW5hbWVzIGEgZmlsZSB0byBhIG5ldyBuYW1lLCBpbiB0aGUgY3dkXG4gICAgICAgKiBAbWV0aG9kIHJlbmFtZUZpbGVcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gc291cmNlRmlsZVBhdGggICAgICBQYXRoIHRvIGZpbGUsIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB3aXRoTmV3TmFtZSAgICAgICAgIE5ldyBuYW1lXG4gICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICAgIFRoZSBQcm9taXNlXG4gICAgICAgKi9cbiAgICAgIHNlbGYucmVuYW1lRmlsZSA9IGZ1bmN0aW9uICggc291cmNlRmlsZVBhdGgsIHdpdGhOZXdOYW1lICkge1xuICAgICAgICByZXR1cm4gc2VsZi5tb3ZlRmlsZSggc291cmNlRmlsZVBhdGgsIFwiLlwiLCB3aXRoTmV3TmFtZSApO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUmVuYW1lcyBhIGRpcmVjdG9yeSB0byBhIG5ldyBuYW1lLCBpbiB0aGUgY3dkXG4gICAgICAgKiBAbWV0aG9kIHJlbmFtZURpcmVjdG9yeVxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBzb3VyY2VEaXJlY3RvcnlQYXRoIFBhdGggdG8gZGlyZWN0b3J5LCByZWxhdGl2ZSB0byBjd2RcbiAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gd2l0aE5ld05hbWUgICAgICAgICBOZXcgbmFtZVxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgICAgICBUaGUgUHJvbWlzZVxuICAgICAgICovXG4gICAgICBzZWxmLnJlbmFtZURpcmVjdG9yeSA9IGZ1bmN0aW9uICggc291cmNlRGlyZWN0b3J5UGF0aCwgd2l0aE5ld05hbWUgKSB7XG4gICAgICAgIHJldHVybiBzZWxmLm1vdmVEaXJlY3RvcnkoIHNvdXJjZURpcmVjdG9yeVBhdGgsIFwiLlwiLCB3aXRoTmV3TmFtZSApO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogRGVsZXRlcyBhIGZpbGVcbiAgICAgICAqIEBtZXRob2QgZGVsZXRlRmlsZVxuICAgICAgICogQHBhcmFtICB7U3RyaW5nfSB0aGVGaWxlUGF0aCBQYXRoIHRvIGZpbGUsIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgVGhlIFByb21pc2VcbiAgICAgICAqL1xuICAgICAgc2VsZi5kZWxldGVGaWxlID0gZnVuY3Rpb24gKCB0aGVGaWxlUGF0aCApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfZ2V0RmlsZUVudHJ5KCBzZWxmLl9jd2QsIHRoZUZpbGVQYXRoLCB7fSApLnRoZW4oIGZ1bmN0aW9uIGdvdFRoZUZpbGVUb0RlbGV0ZSggdGhlRmlsZUVudHJ5ICkge1xuICAgICAgICAgIHJldHVybiBfcmVtb3ZlRmlsZSggdGhlRmlsZUVudHJ5ICk7XG4gICAgICAgIH0gKS50aGVuKCBmdW5jdGlvbiBhbGxEb25lKCkge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoIHNlbGYgKTtcbiAgICAgICAgfSApLlxuICAgICAgICAgIGNhdGNoKCBmdW5jdGlvbiAoIGFuRXJyb3IgKSB7XG4gICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KCBhbkVycm9yICk7XG4gICAgICAgICAgICAgICAgIH0gKS5kb25lKCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfTtcbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlcyBhIGRpcmVjdG9yeSwgcG9zc2libHkgcmVjdXJzaXZlbHlcbiAgICAgICAqIEBtZXRob2QgcmVtb3ZlRGlyZWN0b3J5XG4gICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZURpcmVjdG9yeVBhdGggcGF0aCB0byBkaXJlY3RvcnksIHJlbGF0aXZlIHRvIGN3ZFxuICAgICAgICogQHBhcmFtICB7Qm9vbGVhbn0gcmVjdXJzaXZlbHkgICAgICBJZiB0cnVlLCByZWN1cnNpdmUgcmVtb3ZlXG4gICAgICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgIFRoZSBwcm9taXNlXG4gICAgICAgKi9cbiAgICAgIHNlbGYucmVtb3ZlRGlyZWN0b3J5ID0gZnVuY3Rpb24gKCB0aGVEaXJlY3RvcnlQYXRoLCByZWN1cnNpdmVseSApIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICBfZ2V0RGlyZWN0b3J5RW50cnkoIHNlbGYuX2N3ZCwgdGhlRGlyZWN0b3J5UGF0aCwge30gKS50aGVuKCBmdW5jdGlvbiBnb3RUaGVEaXJlY3RvcnlUb0RlbGV0ZSggdGhlRGlyZWN0b3J5RW50cnkgKSB7XG4gICAgICAgICAgcmV0dXJuIF9yZW1vdmVEaXJlY3RvcnkoIHRoZURpcmVjdG9yeUVudHJ5LCByZWN1cnNpdmVseSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gYWxsRG9uZSgpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCBzZWxmICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEFza3MgdGhlIGJyb3dzZXIgZm9yIHRoZSByZXF1ZXN0ZWQgcXVvdGEsIGFuZCB0aGVuIHJlcXVlc3RzIHRoZSBmaWxlIHN5c3RlbVxuICAgICAgICogYW5kIHNldHMgdGhlIGN3ZCB0byB0aGUgcm9vdCBkaXJlY3RvcnkuXG4gICAgICAgKiBAbWV0aG9kIF9pbml0aWFsaXplRmlsZVN5c3RlbVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEByZXR1cm4ge1Byb21pc2V9IFRoZSBwcm9taXNlXG4gICAgICAgKi9cbiAgICAgIHNlbGYuX2luaXRpYWxpemVGaWxlU3lzdGVtID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgIF9yZXF1ZXN0UXVvdGEoIHNlbGYuZmlsZVN5c3RlbVR5cGUsIHNlbGYucmVxdWVzdGVkUXVvdGEgKS50aGVuKCBmdW5jdGlvbiBnb3RRdW90YSggdGhlUXVvdGEgKSB7XG4gICAgICAgICAgc2VsZi5fYWN0dWFsUXVvdGEgPSB0aGVRdW90YTtcbiAgICAgICAgICByZXR1cm4gX3JlcXVlc3RGaWxlU3lzdGVtKCBzZWxmLmZpbGVTeXN0ZW1UeXBlLCBzZWxmLmFjdHVhbFF1b3RhICk7XG4gICAgICAgIH0gKS50aGVuKCBmdW5jdGlvbiBnb3RGUyggdGhlRlMgKSB7XG4gICAgICAgICAgc2VsZi5fZmlsZVN5c3RlbSA9IHRoZUZTO1xuICAgICAgICAgIC8vc2VsZi5fY3dkID0gdGhlRlMucm9vdDtcbiAgICAgICAgICByZXR1cm4gX2dldERpcmVjdG9yeUVudHJ5KCB0aGVGUy5yb290LCBcIlwiLCB7fSApO1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gZ290Um9vdERpcmVjdG9yeSggdGhlUm9vdERpcmVjdG9yeSApIHtcbiAgICAgICAgICBzZWxmLl9yb290ID0gdGhlUm9vdERpcmVjdG9yeTtcbiAgICAgICAgICBzZWxmLl9jd2QgPSB0aGVSb290RGlyZWN0b3J5O1xuICAgICAgICB9ICkudGhlbiggZnVuY3Rpb24gYWxsRG9uZSgpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCBzZWxmICk7XG4gICAgICAgIH0gKS5cbiAgICAgICAgICBjYXRjaCggZnVuY3Rpb24gKCBhbkVycm9yICkge1xuICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCggYW5FcnJvciApO1xuICAgICAgICAgICAgICAgICB9ICkuZG9uZSgpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH07XG4gICAgICBpZiAoIHNlbGYub3ZlcnJpZGVTdXBlciApIHtcbiAgICAgICAgc2VsZi5vdmVycmlkZVN1cGVyKCBzZWxmLmNsYXNzLCBcImluaXRcIiwgc2VsZi5pbml0ICk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEluaXRpYWxpemVzIHRoZSBmaWxlIG1hbmFnZXIgd2l0aCB0aGUgcmVxdWVzdGVkIGZpbGUgc3lzdGVtIHR5cGUgKHNlbGYuUEVSU0lTVEVOVCBvciBzZWxmLlRFTVBPUkFSWSlcbiAgICAgICAqIGFuZCByZXF1ZXN0ZWQgcXVvdGEgc2l6ZS4gQm90aCBtdXN0IGJlIHNwZWNpZmllZC5cbiAgICAgICAqIEBtZXRob2QgaW5pdFxuICAgICAgICogQHBhcmFtIHtGaWxlU3lzdGVtfSBmaWxlU3lzdGVtVHlwZVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHJlcXVlc3RlZFF1b3RhXG4gICAgICAgKi9cbiAgICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uICggZmlsZVN5c3RlbVR5cGUsIHJlcXVlc3RlZFF1b3RhICkge1xuICAgICAgICBpZiAoIHNlbGYuc3VwZXIgKSB7XG4gICAgICAgICAgc2VsZi5zdXBlciggX2NsYXNzTmFtZSwgXCJpbml0XCIgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBmaWxlU3lzdGVtVHlwZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiTm8gZmlsZSBzeXN0ZW0gdHlwZSBzcGVjaWZpZWQ7IHNwZWNpZnkgUEVSU0lTVEVOVCBvciBURU1QT1JBUlkuXCIgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiByZXF1ZXN0ZWRRdW90YSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiTm8gcXVvdGEgcmVxdWVzdGVkLiBJZiB5b3UgZG9uJ3Qga25vdywgc3BlY2lmeSBaRVJPLlwiICk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5fcmVxdWVzdGVkUXVvdGEgPSByZXF1ZXN0ZWRRdW90YTtcbiAgICAgICAgc2VsZi5fZmlsZVN5c3RlbVR5cGUgPSBmaWxlU3lzdGVtVHlwZTtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2luaXRpYWxpemVGaWxlU3lzdGVtKCk7IC8vIHRoaXMgcmV0dXJucyBhIHByb21pc2UsIHNvIHdlIGNhbiAudGhlbiBhZnRlci5cbiAgICAgIH07XG4gICAgICAvKipcbiAgICAgICAqIEluaXRpYWxpemVzIHRoZSBmaWxlIG1hbmFnZXIgd2l0aCB0aGUgcmVxdWVzdGVkIGZpbGUgc3lzdGVtIHR5cGUgKHNlbGYuUEVSU0lTVEVOVCBvciBzZWxmLlRFTVBPUkFSWSlcbiAgICAgICAqIGFuZCByZXF1ZXN0ZWQgcXVvdGEgc2l6ZS4gQm90aCBtdXN0IGJlIHNwZWNpZmllZC5cbiAgICAgICAqIEBtZXRob2QgaW5pdFdpdGhPcHRpb25zXG4gICAgICAgKiBAcGFyYW0geyp9IG9wdGlvbnNcbiAgICAgICAqL1xuICAgICAgc2VsZi5pbml0V2l0aE9wdGlvbnMgPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG4gICAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcIk5vIG9wdGlvbnMgc3BlY2lmaWVkLiBOZWVkIHR5cGUgYW5kIHF1b3RhLlwiICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5maWxlU3lzdGVtVHlwZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoIFwiTm8gZmlsZSBzeXN0ZW0gdHlwZSBzcGVjaWZpZWQ7IHNwZWNpZnkgUEVSU0lTVEVOVCBvciBURU1QT1JBUlkuXCIgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLnJlcXVlc3RlZFF1b3RhID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvciggXCJObyBxdW90YSByZXF1ZXN0ZWQuIElmIHlvdSBkb24ndCBrbm93LCBzcGVjaWZ5IFpFUk8uXCIgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZi5pbml0KCBvcHRpb25zLmZpbGVTeXN0ZW1UeXBlLCBvcHRpb25zLnJlcXVlc3RlZFF1b3RhICk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgLy8gbWV0YSBpbmZvcm1hdGlvblxuICBGaWxlTWFuYWdlci5tZXRhID0ge1xuICAgIHZlcnNpb246ICAgICAgICAgICBcIjAwLjA0LjQ1MFwiLFxuICAgIGNsYXNzOiAgICAgICAgICAgICBfY2xhc3NOYW1lLFxuICAgIGF1dG9Jbml0aWFsaXphYmxlOiBmYWxzZSxcbiAgICBjYXRlZ29yaXphYmxlOiAgICAgZmFsc2VcbiAgfTtcbiAgLy8gYXNzaWduIHRvIGB3aW5kb3dgIGlmIHN0YW5kLWFsb25lXG4gIGlmICggZ2xvYmFsQ29udGV4dCApIHtcbiAgICBnbG9iYWxDb250ZXh0LkZpbGVNYW5hZ2VyID0gRmlsZU1hbmFnZXI7XG4gIH1cbiAgaWYgKCBtb2R1bGUgKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBGaWxlTWFuYWdlcjtcbiAgfVxufSkoIFEsIEJhc2VPYmplY3QsICggdHlwZW9mIElOX1lBU01GICE9PSBcInVuZGVmaW5lZFwiICkgPyB1bmRlZmluZWQgOiB3aW5kb3csIG1vZHVsZSApO1xuIiwiLyoqXG4gKlxuICogUHJvdmlkZXMgY29udmVuaWVuY2UgbWV0aG9kcyBmb3IgcGFyc2luZyB1bml4LXN0eWxlIHBhdGggbmFtZXMuIElmIHRoZVxuICogcGF0aCBzZXBhcmF0b3IgaXMgY2hhbmdlZCBmcm9tIFwiL1wiIHRvIFwiXFxcIiwgaXQgc2hvdWxkIHBhcnNlIFdpbmRvd3MgcGF0aHMgYXMgd2VsbC5cbiAqXG4gKiBAbW9kdWxlIGZpbGVuYW1lLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC40XG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxMyBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgbW9kdWxlKi9cblwidXNlIHN0cmljdFwiO1xudmFyIFBLRklMRSA9IHtcbiAgLyoqXG4gICAqIEBwcm9wZXJ0eSBWZXJzaW9uXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB2ZXJzaW9uOiAgICAgICAgICAgICAgXCIwMC4wNC4xMDBcIixcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgY2hhcmFjdGVycyB0aGF0IGFyZSBub3QgYWxsb3dlZCBpbiBmaWxlIG5hbWVzLlxuICAgKiBAcHJvcGVydHkgaW52YWxpZENoYXJhY3RlcnNcbiAgICogQGRlZmF1bHQgW1wiL1wiLFwiXFxcIixcIjpcIixcInxcIixcIjxcIixcIj5cIixcIipcIixcIj9cIixcIjtcIixcIiVcIl1cbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgaW52YWxpZENoYXJhY3RlcnM6ICAgIFwiLyxcXFxcLDosfCw8LD4sKiw/LDssJVwiLnNwbGl0KCBcIixcIiApLFxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoZSBjaGFyYWN0ZXIgdGhhdCBzZXBhcmF0ZXMgYSBuYW1lIGZyb20gaXRzIGV4dGVuc2lvbixcbiAgICogYXMgaW4gXCJmaWxlbmFtZS5leHRcIi5cbiAgICogQHByb3BlcnR5IGV4dGVuc2lvblNlcGFyYXRvclxuICAgKiBAZGVmYXVsdCBcIi5cIlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgZXh0ZW5zaW9uU2VwYXJhdG9yOiAgIFwiLlwiLFxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoZSBjaGFyYWN0ZXIgdGhhdCBzZXBhcmF0ZXMgcGF0aCBjb21wb25lbnRzLlxuICAgKiBAcHJvcGVydHkgcGF0aFNlcGFyYXRvclxuICAgKiBAZGVmYXVsdCBcIi9cIlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgcGF0aFNlcGFyYXRvcjogICAgICAgIFwiL1wiLFxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoZSBjaGFyYWN0ZXIgdXNlZCB3aGVuIHJlcGxhY2luZyBpbnZhbGlkIGNoYXJhY3RlcnNcbiAgICogQHByb3BlcnR5IHJlcGxhY2VtZW50Q2hhcmFjdGVyXG4gICAqIEBkZWZhdWx0IFwiLVwiXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICByZXBsYWNlbWVudENoYXJhY3RlcjogXCItXCIsXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIHBvdGVudGlhbCBpbnZhbGlkIGZpbGVuYW1lIHRvIGEgdmFsaWQgZmlsZW5hbWUgYnkgcmVwbGFjaW5nXG4gICAqIGludmFsaWQgY2hhcmFjdGVycyAoYXMgc3BlY2lmaWVkIGluIFwiaW52YWxpZENoYXJhY3RlcnNcIikgd2l0aCBcInJlcGxhY2VtZW50Q2hhcmFjdGVyXCIuXG4gICAqXG4gICAqIEBtZXRob2QgbWFrZVZhbGlkXG4gICAqIEBwYXJhbSAge1N0cmluZ30gdGhlRmlsZU5hbWVcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgbWFrZVZhbGlkOiAgICAgICAgICAgIGZ1bmN0aW9uICggdGhlRmlsZU5hbWUgKSB7XG4gICAgdmFyIHNlbGYgPSBQS0ZJTEU7XG4gICAgdmFyIHRoZU5ld0ZpbGVOYW1lID0gdGhlRmlsZU5hbWU7XG4gICAgZm9yICggdmFyIGkgPSAwOyBpIDwgc2VsZi5pbnZhbGlkQ2hhcmFjdGVycy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIHZhciBkID0gMDtcbiAgICAgIHdoaWxlICggdGhlTmV3RmlsZU5hbWUuaW5kZXhPZiggc2VsZi5pbnZhbGlkQ2hhcmFjdGVyc1tpXSApID4gLTEgJiYgKCBkKysgKSA8IDUwICkge1xuICAgICAgICB0aGVOZXdGaWxlTmFtZSA9IHRoZU5ld0ZpbGVOYW1lLnJlcGxhY2UoIHNlbGYuaW52YWxpZENoYXJhY3RlcnNbaV0sIHNlbGYucmVwbGFjZW1lbnRDaGFyYWN0ZXIgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoZU5ld0ZpbGVOYW1lO1xuICB9LFxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbmFtZStleHRlbnNpb24gcG9ydGlvbiBvZiBhIGZ1bGwgcGF0aC5cbiAgICpcbiAgICogQG1ldGhvZCBnZXRGaWxlUGFydFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZUZpbGVOYW1lXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGdldEZpbGVQYXJ0OiAgICAgICAgICBmdW5jdGlvbiAoIHRoZUZpbGVOYW1lICkge1xuICAgIHZhciBzZWxmID0gUEtGSUxFO1xuICAgIHZhciB0aGVTbGFzaFBvc2l0aW9uID0gdGhlRmlsZU5hbWUubGFzdEluZGV4T2YoIHNlbGYucGF0aFNlcGFyYXRvciApO1xuICAgIGlmICggdGhlU2xhc2hQb3NpdGlvbiA8IDAgKSB7XG4gICAgICByZXR1cm4gdGhlRmlsZU5hbWU7XG4gICAgfVxuICAgIHJldHVybiB0aGVGaWxlTmFtZS5zdWJzdHIoIHRoZVNsYXNoUG9zaXRpb24gKyAxLCB0aGVGaWxlTmFtZS5sZW5ndGggLSB0aGVTbGFzaFBvc2l0aW9uICk7XG4gIH0sXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwYXRoIHBvcnRpb24gb2YgYSBmdWxsIHBhdGguXG4gICAqIEBtZXRob2QgZ2V0UGF0aFBhcnRcbiAgICogQHBhcmFtICB7U3RyaW5nfSB0aGVGaWxlTmFtZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBnZXRQYXRoUGFydDogICAgICAgICAgZnVuY3Rpb24gKCB0aGVGaWxlTmFtZSApIHtcbiAgICB2YXIgc2VsZiA9IFBLRklMRTtcbiAgICB2YXIgdGhlU2xhc2hQb3NpdGlvbiA9IHRoZUZpbGVOYW1lLmxhc3RJbmRleE9mKCBzZWxmLnBhdGhTZXBhcmF0b3IgKTtcbiAgICBpZiAoIHRoZVNsYXNoUG9zaXRpb24gPCAwICkge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHJldHVybiB0aGVGaWxlTmFtZS5zdWJzdHIoIDAsIHRoZVNsYXNoUG9zaXRpb24gKyAxICk7XG4gIH0sXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBmaWxlbmFtZSwgbWludXMgdGhlIGV4dGVuc2lvbi5cbiAgICogQG1ldGhvZCBnZXRGaWxlTmFtZVBhcnRcbiAgICogQHBhcmFtICB7U3RyaW5nfSB0aGVGaWxlTmFtZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBnZXRGaWxlTmFtZVBhcnQ6ICAgICAgZnVuY3Rpb24gKCB0aGVGaWxlTmFtZSApIHtcbiAgICB2YXIgc2VsZiA9IFBLRklMRTtcbiAgICB2YXIgdGhlRmlsZU5hbWVOb1BhdGggPSBzZWxmLmdldEZpbGVQYXJ0KCB0aGVGaWxlTmFtZSApO1xuICAgIHZhciB0aGVEb3RQb3NpdGlvbiA9IHRoZUZpbGVOYW1lTm9QYXRoLmxhc3RJbmRleE9mKCBzZWxmLmV4dGVuc2lvblNlcGFyYXRvciApO1xuICAgIGlmICggdGhlRG90UG9zaXRpb24gPCAwICkge1xuICAgICAgcmV0dXJuIHRoZUZpbGVOYW1lTm9QYXRoO1xuICAgIH1cbiAgICByZXR1cm4gdGhlRmlsZU5hbWVOb1BhdGguc3Vic3RyKCAwLCB0aGVEb3RQb3NpdGlvbiApO1xuICB9LFxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXh0ZW5zaW9uIG9mIGEgZmlsZW5hbWVcbiAgICogQG1ldGhvZCBnZXRGaWxlRXh0ZW5zaW9uUGFydFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHRoZUZpbGVOYW1lXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGdldEZpbGVFeHRlbnNpb25QYXJ0OiBmdW5jdGlvbiAoIHRoZUZpbGVOYW1lICkge1xuICAgIHZhciBzZWxmID0gUEtGSUxFO1xuICAgIHZhciB0aGVGaWxlTmFtZU5vUGF0aCA9IHNlbGYuZ2V0RmlsZVBhcnQoIHRoZUZpbGVOYW1lICk7XG4gICAgdmFyIHRoZURvdFBvc2l0aW9uID0gdGhlRmlsZU5hbWVOb1BhdGgubGFzdEluZGV4T2YoIHNlbGYuZXh0ZW5zaW9uU2VwYXJhdG9yICk7XG4gICAgaWYgKCB0aGVEb3RQb3NpdGlvbiA8IDAgKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgcmV0dXJuIHRoZUZpbGVOYW1lTm9QYXRoLnN1YnN0ciggdGhlRG90UG9zaXRpb24gKyAxLCB0aGVGaWxlTmFtZU5vUGF0aC5sZW5ndGggLSB0aGVEb3RQb3NpdGlvbiAtIDEgKTtcbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gUEtGSUxFO1xuIiwiLyoqXG4gKlxuICogIyBoIC0gc2ltcGxlIERPTSB0ZW1wbGF0aW5nXG4gKlxuICogQG1vZHVsZSBoLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC4xXG4gKlxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKlxuICogR2VuZXJhdGVzIGEgRE9NIHRyZWUgKG9yIGp1c3QgYSBzaW5nbGUgbm9kZSkgYmFzZWQgb24gYSBzZXJpZXMgb2YgbWV0aG9kIGNhbGxzXG4gKiBpbnRvICoqaCoqLiAqKmgqKiBoYXMgb25lIHJvb3QgbWV0aG9kIChgZWxgKSB0aGF0IGNyZWF0ZXMgYWxsIERPTSBlbGVtZW50cywgYnV0IGFsc28gaGFzXG4gKiBoZWxwZXIgbWV0aG9kcyBmb3IgZWFjaCBIVE1MIHRhZy4gVGhpcyBtZWFucyB0aGF0IGEgVUwgY2FuIGJlIGNyZWF0ZWQgc2ltcGx5IGJ5XG4gKiBjYWxsaW5nIGBoLnVsYC5cbiAqXG4gKiBUZWNobmljYWxseSB0aGVyZSdzIG5vIHN1Y2ggdGhpbmcgYXMgYSB0ZW1wbGF0ZSB1c2luZyB0aGlzIGxpYnJhcnksIGJ1dCBmdW5jdGlvbnNcbiAqIGVuY2Fwc3VsYXRpbmcgYSBzZXJpZXMgb2YgaCBjYWxscyBmdW5jdGlvbiBhcyBhbiBlcXVpdmFsZW50IGlmIHByb3Blcmx5IGRlY291cGxlZFxuICogZnJvbSB0aGVpciBzdXJyb3VuZHMuXG4gKlxuICogVGVtcGxhdGVzIGFyZSBlc3NlbnRpYWxseSBtZXRob2RzIGF0dGFjaGVkIHRvIHRoZSBET00gdXNpbmcgYGgucmVuZGVyVG8odGVtcGxhdGVGbihjb250ZXh0LC4uLikpYFxuICogYW5kIHJldHVybiBET00gbm9kZSBlbGVtZW50cyBvciBhcnJheXMuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYFxuICogZnVuY3Rpb24gYVRlbXBsYXRlICggY29udGV4dCApIHtcbiAqICAgcmV0dXJuIGguZGl2IChcbiAqICAgICBbIGguc3BhbiAoIGNvbnRleHQudGl0bGUgKSwgaC5zcGFuICggY29udGV4dC5kZXNjcmlwdGlvbiApIF1cbiAqICAgKTtcbiAqIH07XG4gKiBgYGBcbiAqXG4gKiBUaGUgcmVzdWx0aW5nIERPTSB0cmVlIGxvb2tzIGxpa2UgdGhpcyAoYXNzdW1pbmcgYGNvbnRleHRgIGlzIGRlZmluZWQgYXNcbiAqIGB7dGl0bGU6IFwiVGl0bGVcIiwgZGVzY3JpcHRpb246IFwiRGVzY3JpcHRpb25cIn1gOlxuICpcbiAqIGBgYFxuICogPGRpdj5cbiAqICAgPHNwYW4+VGl0bGU8L3NwYW4+XG4gKiAgIDxzcGFuPkRlc2NyaXB0aW9uPC9zcGFuPlxuICogPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBUZW1wbGF0ZSByZXN1bHRzIGFyZSBhZGRlZCB0byB0aGUgRE9NIHVzaW5nIGBoLnJlbmRlclRvYDpcbiAqXG4gKiBgYGBcbiAqIGgucmVuZGVyVG8gKCBhRE9NRWxlbWVudCwgYVRlbXBsYXRlICggY29udGV4dCApICk7XG4gKiBgYGBcbiAqXG4gKiBUZWNobmljYWxseSBgYXBwZW5kQ2hpbGRgIGNvdWxkIGJlIHVzZWQsIGJ1dCBpdCdzIHBvc3NpYmxlIHRoYXQgYW4gYXR0cmlidXRlXG4gKiBtaWdodCBqdXN0IHJldHVybiBhbiBhcnJheSBvZiBET00gbm9kZXMsIGluIHdoaWNoIGNhc2UgYGFwcGVuZENoaWxkYCBmYWlscy5cbiAqXG4gKiBUaGVyZSBhcmUgYWxzbyBhIHZhcmlldHkgb2YgdXRpbGl0eSBtZXRob2RzIGRlZmluZWQgaW4gKipoKiosIHN1Y2ggYXM6XG4gKiAtIGBmb3JFYWNoICggYXJyLCBmbiApYCAtLSB0aGlzIGV4ZWN1dGVzIGBhcnIubWFwKGZuKWAuXG4gKiAtIGBmb3JJbiAoIG9iamVjdCwgZm4gKWAgLS0gaXRlcmF0ZXMgb3ZlciBlYWNoIHByb3BlcnR5IG93bmVkIGJ5IGBvYmplY3RgIGFuZCBjYWxscyBgZm5gXG4gKiAtIGBpZmRlZiAoIGV4cHIsIGEsIGIgKWAgLS0gZGV0ZXJtaW5lcyBpZiBgZXhwcmAgaXMgZGVmaW5lZCwgYW5kIGlmIHNvLCByZXR1cm5zIGBhYCwgb3RoZXJ3aXNlIGBiYFxuICogLSBgaWlmICggZXhwciwgYSwgYiApYCAtLSByZXR1cm5zIGBhYCBpZiBgZXhwcmAgZXZhbHVhdGVzIHRvIHRydWUsIG90aGVyd2lzZSBgYmBcbiAqXG4gKiBXaGVuIGNvbnN0cnVjdGluZyBOb2RlIGVsZW1lbnRzIHVzaW5nIGBoYCwgaXQncyBpbXBvcnRhbnQgdG8gcmVjb2duaXplIHRoYXQgYW4gdW5kZXJseWluZ1xuICogZnVuY3Rpb24gY2FsbGVkIGBlbGAgaXMgYmVpbmcgY2FsbGVkIChhbmQgY2FuIGJlIGNhbGxlZCBkaXJlY3RseSkuIFRoZSBvcmRlciBwYXJhbWV0ZXJzIGhlcmUgaXNcbiAqIHNvbWV3aGF0IG1hbGxlYWJsZSAtIG9ubHkgdGhlIGZpcnN0IHBhcmFtZXRlciBtdXN0IGJlIHRoZSB0YWcgbmFtZSAod2hlbiB1c2luZyBgZWxgKS4gT3RoZXJ3aXNlLFxuICogdGhlIG9wdGlvbnMgZm9yIHRoZSB0YWcgbXVzdCBiZSB3aXRoaW4gdGhlIGZpcnN0IHRocmVlIHBhcmFtZXRlcnMuIFRoZSB0ZXh0IGNvbnRlbnQgb3IgdmFsdWUgY29udGVudFxuICogZm9yIHRoZSB0YWcgbXVzdCBiZSBpbiB0aGUgc2FtZSBmaXJzdCB0aHJlZSBwYXJhbWV0ZXJzLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIHJldHVybiBoLmVsKFwiZGl2XCIsIHsgYXR0cnM6IHsgaWQ6IFwiYW5FbGVtZW50XCIgfSB9LCBcIlRleHQgY29udGVudFwiKTtcbiAqIGBgYFxuICpcbiAqIGlzIGVxdWl2YWxlbnQgdG86XG4gKlxuICogYGBgXG4gKiByZXR1cm4gaC5lbChcImRpdlwiLCBcIlRleHQgQ29udGVudFwiLCB7IGF0dHJzOiB7IGlkOiBcImFuRWxlbWVudFwiIH0gfSApO1xuICogYGBgXG4gKlxuICogd2hpY2ggaXMgYWxzbyBpbiB0dXJuIGVxdWl2YWxlbnQgdG86XG4gKlxuICogYGBgXG4gKiByZXR1cm4gaC5kaXYoXCJUZXh0IENvbnRlbnRcIiwgeyBhdHRyczogeyBpZDogXCJhbkVsZW1lbnRcIiB9IH0gKTtcbiAqIGBgYFxuICpcbiAqIElmIGFuIG9iamVjdCBoYXMgYm90aCB0ZXh0IGFuZCB2YWx1ZSBjb250ZW50IChsaWtlIGJ1dHRvbnMpLCB0aGUgZmlyc3Qgc3RyaW5nIG9yIG51bWJlciBpcyB1c2VkXG4gKiBhcyB0aGUgYHZhbHVlYCBhbmQgdGhlIHNlY29uZCBpcyB1c2VkIGFzIGB0ZXh0Q29udGVudGA6XG4gKlxuICogYGBgXG4gKiByZXR1cm4gaC5idXR0b24oXCJUaGlzIGdvZXMgaW50byB2YWx1ZSBhdHRyaWJ1dGVcIiwgXCJUaGlzIGlzIGluIHRleHRDb250ZW50XCIpO1xuICogYGBgXG4gKlxuICogU28gd2h5IGBlbGAgYW5kIGBoLmRpdmAgZXF1aXZhbGVudHM/IElmIHlvdSBuZWVkIHRvIHNwZWNpZnkgYSBjdXN0b20gdGFnIE9SIHdhbnQgdG8gdXNlIHNob3J0aGFuZFxuICogeW91J2xsIHdhbnQgdG8gdXNlIGBlbGAuIElmIHlvdSBkb24ndCBuZWVkIHRvIHNwZWNpZnkgc2hvcnRoYW5kIHByb3BlcnRpZXMsIHVzZSB0aGUgZWFzaWVyLXRvLXJlYWRcbiAqIGBoLnRhZ05hbWVgLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIHJldHVybiBoLnAgKCBcInBhcmFncmFwaCBjb250ZW50XCIgKTtcbiAqIHJldHVybiBoLmVsICggXCJwXCIsIFwicGFyYWdyYXBoIGNvbnRlbnRcIiApO1xuICpcbiAqIHJldHVybiBoLmVsICggXCJpbnB1dCN0eHRVc2VybmFtZS5iaWdGaWVsZD90eXBlPXRleHQmc2l6ZT0yMFwiLCBcInN0YXJ0aW5nIHZhbHVlXCIgKTtcbiAqIHJldHVybiBoLmlucHV0ICggeyBhdHRyczogeyB0eXBlOiBcInRleHRcIiwgc2l6ZTogXCIyMFwiLCBjbGFzczogXCJiaWdGaWVsZFwiLCBpZDogXCJ0eHRVc2VyTmFtZVwiIH0gfSxcbiAqICAgICAgICAgICAgICAgICAgXCJzdGFydGluZyB2YWx1ZVwiICk7XG4gKiBgYGBcbiAqXG4gKiBXaGVuIHNwZWNpZnlpbmcgdGFnIG9wdGlvbnMsIHlvdSBoYXZlIHNldmVyYWwgb3B0aW9ucyB0aGF0IGNhbiBiZSBzcGVjaWZpZWQ6XG4gKiAqIGF0dHJpYnV0ZXMgdXNpbmcgYGF0dHJzYCBvYmplY3RcbiAqICogc3R5bGVzIHVzaW5nIGBzdHlsZXNgIG9iamVjdFxuICogKiBldmVudCBoYW5kbGVycyB1c2luZyBgb25gIG9iamVjdFxuICogKiBoYW1tZXIgaGFuZGxlcnMgdXNpbmcgYGhhbW1lcmAgb2JqZWN0XG4gKiAqIGRhdGEgYmluZGluZyB1c2luZyBgYmluZGAgb2JqZWN0XG4gKiAqIHN0b3JlIGVsZW1lbnQgcmVmZXJlbmNlcyB0byBhIGNvbnRhaW5lciBvYmplY3QgdXNpbmcgYHN0b3JlVG9gIG9iamVjdFxuICpcbiAqXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSwgTm9kZSwgZG9jdW1lbnQqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgQmFzZU9iamVjdCA9IHJlcXVpcmUoIFwiLi9vYmplY3RcIiApO1xuLyoqXG4gKlxuICogaW50ZXJuYWwgcHJpdmF0ZSBtZXRob2QgdG8gaGFuZGxlIHBhcnNpbmcgY2hpbGRyZW5cbiAqIGFuZCBhdHRhY2hpbmcgdGhlbSB0byB0aGVpciBwYXJlbnRzXG4gKlxuICogSWYgdGhlIGNoaWxkIGlzIGEgYE5vZGVgLCBpdCBpcyBhdHRhY2hlZCBkaXJlY3RseSB0byB0aGUgcGFyZW50IGFzIGEgY2hpbGRcbiAqIElmIHRoZSBjaGlsZCBpcyBhIGBmdW5jdGlvbmAsIHRoZSAqcmVzdXRzKiBhcmUgcmUtcGFyc2VkLCB1bHRpbWF0ZWx5IHRvIGJlIGF0dGFjaGVkIHRvIHRoZSBwYXJlbnRcbiAqICAgYXMgY2hpbGRyZW5cbiAqIElmIHRoZSBjaGlsZCBpcyBhbiBgQXJyYXlgLCBlYWNoIGVsZW1lbnQgd2l0aGluIHRoZSBhcnJheSBpcyByZS1wYXJzZWQsIHVsdGltYXRlbHkgdG8gYmUgYXR0YWNoZWRcbiAqICAgdG8gdGhlIHBhcmVudCBhcyBjaGlsZHJlblxuICpcbiAqIEBtZXRob2QgaGFuZGxlQ2hpbGRcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufE5vZGV9IGNoaWxkICAgICAgIGNoaWxkIHRvIGhhbmRsZSBhbmQgYXR0YWNoXG4gKiBAcGFyYW0ge05vZGV9IHBhcmVudCAgICAgICAgICAgICAgICAgICAgIHBhcmVudFxuICpcbiAqL1xuZnVuY3Rpb24gaGFuZGxlQ2hpbGQoIGNoaWxkLCBwYXJlbnQgKSB7XG4gIGlmICggdHlwZW9mIGNoaWxkID09PSBcIm9iamVjdFwiICkge1xuICAgIGlmICggY2hpbGQgaW5zdGFuY2VvZiBBcnJheSApIHtcbiAgICAgIGZvciAoIHZhciBpID0gMCwgbCA9IGNoaWxkLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgaGFuZGxlQ2hpbGQoIGNoaWxkW2ldLCBwYXJlbnQgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCBjaGlsZCBpbnN0YW5jZW9mIE5vZGUgKSB7XG4gICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoIGNoaWxkICk7XG4gICAgfVxuICB9XG4gIGlmICggdHlwZW9mIGNoaWxkID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgaGFuZGxlQ2hpbGQoIGNoaWxkKCksIHBhcmVudCApO1xuICB9XG59XG4vKipcbiAqIHBhcnNlcyBhbiBpbmNvbWluZyB0YWcgaW50byBpdHMgdGFnIGBuYW1lYCwgYGlkYCwgYW5kIGBjbGFzc2AgY29uc3RpdHVlbnRzXG4gKiBBIHRhZyBpcyBvZiB0aGUgZm9ybSBgdGFnTmFtZS5jbGFzcyNpZGAgb3IgYHRhZ05hbWUjaWQuY2xhc3NgLiBUaGUgYGlkYCBhbmQgYGNsYXNzYFxuICogYXJlIG9wdGlvbmFsLlxuICpcbiAqIElmIGF0dHJpYnV0ZXMgbmVlZCB0byBiZSBzdXBwbGllZCwgaXQncyBwb3NzaWJsZSB2aWEgdGhlIGA/YCBxdWVyeSBzdHJpbmcuIEF0dHJpYnV0ZXNcbiAqIGFyZSBvZiB0aGUgZm9ybSBgP2F0dHI9dmFsdWUmYXR0cj12YWx1ZS4uLmAuXG4gKlxuICogQG1ldGhvZCBwYXJzZVRhZ1xuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgICAgICB0YWcgdG8gcGFyc2VcbiAqIEByZXR1cm4geyp9IE9iamVjdCBvZiB0aGUgZm9ybSBgeyB0YWc6IHRhZ05hbWUsIGlkOiBpZCwgY2xhc3M6IGNsYXNzLCBxdWVyeTogcXVlcnksIHF1ZXJ5UGFyczogQXJyYXkgfWBcbiAqL1xuZnVuY3Rpb24gcGFyc2VUYWcoIHRhZyApIHtcbiAgdmFyIHRhZ1BhcnRzID0ge1xuICAgICAgdGFnOiAgICAgICAgXCJcIixcbiAgICAgIGlkOiAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgIGNsYXNzOiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHF1ZXJ5OiAgICAgIHVuZGVmaW5lZCxcbiAgICAgIHF1ZXJ5UGFydHM6IFtdXG4gICAgfSxcbiAgICBoYXNoUG9zID0gdGFnLmluZGV4T2YoIFwiI1wiICksXG4gICAgZG90UG9zID0gdGFnLmluZGV4T2YoIFwiLlwiICksXG4gICAgcW1Qb3MgPSB0YWcuaW5kZXhPZiggXCI/XCIgKTtcbiAgaWYgKCBxbVBvcyA+PSAwICkge1xuICAgIHRhZ1BhcnRzLnF1ZXJ5ID0gdGFnLnN1YnN0ciggcW1Qb3MgKyAxICk7XG4gICAgdGFnUGFydHMucXVlcnlQYXJ0cyA9IHRhZ1BhcnRzLnF1ZXJ5LnNwbGl0KCBcIiZcIiApO1xuICAgIHRhZyA9IHRhZy5zdWJzdHIoIDAsIHFtUG9zICk7XG4gIH1cbiAgaWYgKCBoYXNoUG9zIDwgMCAmJiBkb3RQb3MgPCAwICkge1xuICAgIHRhZ1BhcnRzLnRhZyA9IHRhZztcbiAgICByZXR1cm4gdGFnUGFydHM7XG4gIH1cbiAgaWYgKCBoYXNoUG9zID49IDAgJiYgZG90UG9zIDwgMCApIHtcbiAgICB0YWdQYXJ0cy50YWcgPSB0YWcuc3Vic3RyKCAwLCBoYXNoUG9zICk7XG4gICAgdGFnUGFydHMuaWQgPSB0YWcuc3Vic3RyKCBoYXNoUG9zICsgMSApO1xuICAgIHJldHVybiB0YWdQYXJ0cztcbiAgfVxuICBpZiAoIGRvdFBvcyA+PSAwICYmIGhhc2hQb3MgPCAwICkge1xuICAgIHRhZ1BhcnRzLnRhZyA9IHRhZy5zdWJzdHIoIDAsIGRvdFBvcyApO1xuICAgIHRhZ1BhcnRzLmNsYXNzID0gdGFnLnN1YnN0ciggZG90UG9zICsgMSApO1xuICAgIHJldHVybiB0YWdQYXJ0cztcbiAgfVxuICBpZiAoIGRvdFBvcyA+PSAwICYmIGhhc2hQb3MgPj0gMCAmJiBoYXNoUG9zIDwgZG90UG9zICkge1xuICAgIHRhZ1BhcnRzLnRhZyA9IHRhZy5zdWJzdHIoIDAsIGhhc2hQb3MgKTtcbiAgICB0YWdQYXJ0cy5pZCA9IHRhZy5zdWJzdHIoIGhhc2hQb3MgKyAxLCAoIGRvdFBvcyAtIGhhc2hQb3MgKSAtIDEgKTtcbiAgICB0YWdQYXJ0cy5jbGFzcyA9IHRhZy5zdWJzdHIoIGRvdFBvcyArIDEgKTtcbiAgICByZXR1cm4gdGFnUGFydHM7XG4gIH1cbiAgaWYgKCBkb3RQb3MgPj0gMCAmJiBoYXNoUG9zID49IDAgJiYgZG90UG9zIDwgaGFzaFBvcyApIHtcbiAgICB0YWdQYXJ0cy50YWcgPSB0YWcuc3Vic3RyKCAwLCBkb3RQb3MgKTtcbiAgICB0YWdQYXJ0cy5jbGFzcyA9IHRhZy5zdWJzdHIoIGRvdFBvcyArIDEsICggaGFzaFBvcyAtIGRvdFBvcyApIC0gMSApO1xuICAgIHRhZ1BhcnRzLmlkID0gdGFnLnN1YnN0ciggaGFzaFBvcyArIDEgKTtcbiAgICByZXR1cm4gdGFnUGFydHM7XG4gIH1cbiAgcmV0dXJuIHRhZ1BhcnRzO1xufVxudmFyIGdsb2JhbEV2ZW50cyA9IHt9LFxuICByZW5kZXJFdmVudHMgPSB7fTtcbnZhciBnbG9iYWxTZXF1ZW5jZSA9IDA7XG5cbmZ1bmN0aW9uIGdldEFuZFNldEVsZW1lbnRJZCggZSApIHtcbiAgdmFyIGlkID0gZS5nZXRBdHRyaWJ1dGUoIFwiaWRcIiApO1xuICBpZiAoIGlkID09PSB1bmRlZmluZWQgfHwgaWQgPT09IG51bGwgKSB7XG4gICAgZ2xvYmFsU2VxdWVuY2UrKztcbiAgICBpZCA9IFwiaC15LVwiICsgZ2xvYmFsU2VxdWVuY2U7XG4gICAgZS5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgaWQgKTtcbiAgfVxuICByZXR1cm4gaWQ7XG59XG4vKipcbiAqIGggdGVtcGxhdGluZyBlbmdpbmVcbiAqL1xudmFyIGggPSB7XG4gICAgVkVSU0lPTjogICAgICAgXCIwLjEuMTAwXCIsXG4gICAgdXNlRG9tTWVyZ2luZzogZmFsc2UsXG4gICAgZGVidWc6ICAgICAgICAgZmFsc2UsXG4gICAgX2dsb2JhbEV2ZW50czogZ2xvYmFsRXZlbnRzLFxuICAgIF9yZW5kZXJFdmVudHM6IHJlbmRlckV2ZW50cyxcbiAgICAvKiBleHBlcmltZW50YWwhICovXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIERPTSB0cmVlIGNvbnRhaW5pbmcgdGhlIHJlcXVlc3RlZCBlbGVtZW50IGFuZCBhbnkgZnVydGhlciBjaGlsZFxuICAgICAqIGVsZW1lbnRzIChhcyBleHRyYSBwYXJhbWV0ZXJzKVxuICAgICAqXG4gICAgICogYHRhZ09wdGlvbnNgIHNob3VsZCBiZSBhbiBvYmplY3QgY29uc2lzdGluZyBvZiB0aGUgZm9sbG93aW5nIG9wdGlvbmFsIHNlZ21lbnRzOlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICoge1xuICAgICAgICogICAgYXR0cnM6IHsuLi59ICAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcyB0byBhZGQgdG8gdGhlIGVsZW1lbnRcbiAgICAgICAqICAgIHN0eWxlczogey4uLn0gICAgICAgICAgICAgICAgICAgIHN0eWxlIGF0dHJpYnV0ZXMgdG8gYWRkIHRvIHRoZSBlbGVtZW50XG4gICAgICAgKiAgICBvbjogey4uLn0gICAgICAgICAgICAgICAgICAgICAgICBldmVudCBoYW5kbGVycyB0byBhdHRhY2ggdG8gdGhlIGVsZW1lbnRcbiAgICAgICAqICAgIGhhbW1lcjogey4uLn0gICAgICAgICAgICAgICAgICAgIGhhbW1lciBoYW5kbGVyc1xuICAgICAgICogICAgYmluZDogeyBvYmplY3Q6LCBrZXlQYXRoOiwga2V5VHlwZTogfSAgICAgIGRhdGEgYmluZGluZ1xuICAgICAgICogICAgc3RvcmU6IHsgb2JqZWN0Oiwga2V5UGF0aDosIGlkT25seTogfSAgICAgc3RvcmUgZWxlbWVudCB0byBvYmplY3Qua2V5UGF0aFxuICAgICAgICogfVxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1ldGhvZCBlbFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgICAgICAgICAgICAgICAgIHRhZyBvZiB0aGUgZm9ybSBgdGFnTmFtZS5jbGFzcyNpZGAgb3IgYHRhZ05hbWUjaWQuY2xhc3NgXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnIGNhbiBhbHNvIHNwZWNpZnkgYXR0cmlidXRlczpcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgaW5wdXQ/dHlwZT10ZXh0JnNpemU9MjBgXG4gICAgICogQHBhcmFtIHsqfSB0YWdPcHRpb25zICAgICAgICAgICAgICAgb3B0aW9ucyBmb3IgdGhlIHRhZyAoc2VlIGFib3ZlKVxuICAgICAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258U3RyaW5nfSAuLi4gIGNoaWxkcmVuIHRoYXQgc2hvdWxkIGJlIGF0dGFjaGVkXG4gICAgICogQHJldHVybnMge05vZGV9ICAgICAgICAgICAgICAgICAgICAgRE9NIHRyZWVcbiAgICAgKlxuICAgICAqL1xuICAgIGVsOiAgICAgICAgICAgIGZ1bmN0aW9uICggdGFnICkge1xuICAgICAgdmFyIGUsIGksIGwsIGYsIGV2dCxcbiAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgY29udGVudCA9IFtdLFxuICAgICAgICBjb250ZW50VGFyZ2V0ID0gW10sXG4gICAgICAgIGJpbmRWYWx1ZSxcbiAgICAgICAgdGFnUGFydHMgPSBwYXJzZVRhZyggdGFnICksXG4gICAgICAgIGVsaWQsXG4gICAgICAgIGV2ZW50cyA9IFtdO1xuXG4gICAgICAvLyBwYXJzZSB0YWc7IGl0IHNob3VsZCBiZSBvZiB0aGUgZm9ybSBgdGFnWyNpZF1bLmNsYXNzXVs/YXR0cj12YWx1ZVsmYXR0cj12YWx1ZS4uLl1gXG4gICAgICAvLyBjcmVhdGUgdGhlIGVsZW1lbnQ7IGlmIGBAREZgIGlzIHVzZWQsIGEgZG9jdW1lbnQgZnJhZ21lbnQgaXMgdXNlZCBpbnN0ZWFkXG4gICAgICBpZiAoIHRhZ1BhcnRzLnRhZyAhPT0gXCJAREZcIiApIHtcbiAgICAgICAgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHRhZ1BhcnRzLnRhZyApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIH1cbiAgICAgIC8vIGF0dGFjaCB0aGUgYGNsYXNzYCBhbmQgYGlkYCBmcm9tIHRoZSB0YWcgbmFtZSwgaWYgYXZhaWxhYmxlXG4gICAgICBpZiAoIHRhZ1BhcnRzLmNsYXNzICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIGUuY2xhc3NOYW1lID0gdGFnUGFydHMuY2xhc3M7XG4gICAgICB9XG4gICAgICBpZiAoIHRhZ1BhcnRzLmlkICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIGVsaWQgPSB0YWdQYXJ0cy5pZDtcbiAgICAgICAgZS5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgdGFnUGFydHMuaWQgKTtcbiAgICAgIH1cbiAgICAgIC8vIGdldCB0aGUgYXJndW1lbnRzIGFzIGFuIGFycmF5LCBpZ25vcmluZyB0aGUgZmlyc3QgcGFyYW1ldGVyXG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKTtcbiAgICAgIC8vIGRldGVybWluZSB3aGF0IHdlJ3ZlIHBhc3NlZCBpbiB0aGUgc2Vjb25kL3RoaXJkIHBhcmFtZXRlclxuICAgICAgLy8gaWYgaXQgaXMgYW4gb2JqZWN0IChidXQgbm90IGEgbm9kZSBvciBhcnJheSksIGl0J3MgYSBsaXN0IG9mXG4gICAgICAvLyBvcHRpb25zIHRvIGF0dGFjaCB0byB0aGUgZWxlbWVudC4gSWYgaXQgaXMgYSBzdHJpbmcsIGl0J3MgdGV4dFxuICAgICAgLy8gY29udGVudCB0aGF0IHNob3VsZCBiZSBhZGRlZCB1c2luZyBgdGV4dENvbnRlbnRgIG9yIGB2YWx1ZWBcbiAgICAgIC8vID4gbm90ZTogd2UgY291bGQgcGFyc2UgdGhlIGVudGlyZSBhcmd1bWVudCBsaXN0LCBidXQgdGhhdCB3b3VsZFxuICAgICAgLy8gPiBhIGJpdCBhYnN1cmQuXG4gICAgICBmb3IgKCBpID0gMDsgaSA8IDM7IGkrKyApIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgYXJnc1swXSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICBpZiAoIHR5cGVvZiBhcmdzWzBdID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgICAgLy8gY291bGQgYmUgYSBET00gbm9kZSwgYW4gYXJyYXksIG9yIHRhZyBvcHRpb25zXG4gICAgICAgICAgICBpZiAoICEoIGFyZ3NbMF0gaW5zdGFuY2VvZiBOb2RlICkgJiYgISggYXJnc1swXSBpbnN0YW5jZW9mIEFycmF5ICkgKSB7XG4gICAgICAgICAgICAgIG9wdGlvbnMgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICggdHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGFyZ3NbMF0gPT09IFwibnVtYmVyXCIgKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRleHQgY29udGVudFxuICAgICAgICAgICAgY29udGVudC5wdXNoKCBhcmdzLnNoaWZ0KCkgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGNvcHkgb3ZlciBhbnkgYHF1ZXJ5UGFydHNgIGF0dHJpYnV0ZXNcbiAgICAgIGlmICggdGFnUGFydHMucXVlcnlQYXJ0cy5sZW5ndGggPiAwICkge1xuICAgICAgICB2YXIgYXJyO1xuICAgICAgICBmb3IgKCBpID0gMCwgbCA9IHRhZ1BhcnRzLnF1ZXJ5UGFydHMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgIGFyciA9IHRhZ1BhcnRzLnF1ZXJ5UGFydHNbaV0uc3BsaXQoIFwiPVwiICk7XG4gICAgICAgICAgaWYgKCBhcnIubGVuZ3RoID09PSAyICkge1xuICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoIGFyclswXS50cmltKCksIGFyclsxXS50cmltKCkgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGNvcHkgb3ZlciBhbnkgYXR0cmlidXRlcyBhbmQgc3R5bGVzIGluIGBvcHRpb25zLmF0dHJzYCBhbmQgYG9wdGlvbnMuc3R5bGVgXG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zID09PSBcIm9iamVjdFwiICYmIG9wdGlvbnMgIT09IG51bGwgKSB7XG4gICAgICAgIC8vIGFkZCBhdHRyaWJ1dGVzXG4gICAgICAgIGlmICggb3B0aW9ucy5hdHRycyApIHtcbiAgICAgICAgICBmb3IgKCB2YXIgYXR0ciBpbiBvcHRpb25zLmF0dHJzICkge1xuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmF0dHJzLmhhc093blByb3BlcnR5KCBhdHRyICkgKSB7XG4gICAgICAgICAgICAgIGlmICggb3B0aW9ucy5hdHRyc1thdHRyXSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuYXR0cnNbYXR0cl0gIT09IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgZS5zZXRBdHRyaWJ1dGUoIGF0dHIsIG9wdGlvbnMuYXR0cnNbYXR0cl0gKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBhZGQgc3R5bGVzXG4gICAgICAgIGlmICggb3B0aW9ucy5zdHlsZXMgKSB7XG4gICAgICAgICAgZm9yICggdmFyIHN0eWxlIGluIG9wdGlvbnMuc3R5bGVzICkge1xuICAgICAgICAgICAgaWYgKCBvcHRpb25zLnN0eWxlcy5oYXNPd25Qcm9wZXJ0eSggc3R5bGUgKSApIHtcbiAgICAgICAgICAgICAgaWYgKCBvcHRpb25zLnN0eWxlc1tzdHlsZV0gIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLnN0eWxlc1tzdHlsZV0gIT09IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgZS5zdHlsZVtzdHlsZV0gPSBvcHRpb25zLnN0eWxlc1tzdHlsZV07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWRkIGV2ZW50IGhhbmRsZXJzOyBoYW5kbGVyIHByb3BlcnR5IGlzIGV4cGVjdGVkIHRvIGJlIGEgdmFsaWQgRE9NXG4gICAgICAgIC8vIGV2ZW50LCBpLmUuIGB7IFwiY2hhbmdlXCI6IGZ1bmN0aW9uLi4uIH1gIG9yIGB7IGNoYW5nZTogZnVuY3Rpb24uLi4gfWBcbiAgICAgICAgLy8gaWYgdGhlIGhhbmRsZXIgaXMgYW4gb2JqZWN0LCBpdCBtdXN0IGJlIG9mIHRoZSBmb3JtXG4gICAgICAgIC8vIGBgYFxuICAgICAgICAvLyAgIHsgaGFuZGxlcjogZnVuY3Rpb24gLi4uLFxuICAgICAgICAvLyAgICAgY2FwdHVyZTogdHJ1ZS9mYWxzZSB9XG4gICAgICAgIC8vIGBgYFxuICAgICAgICBpZiAoIG9wdGlvbnMub24gKSB7XG4gICAgICAgICAgZm9yICggZXZ0IGluIG9wdGlvbnMub24gKSB7XG4gICAgICAgICAgICBpZiAoIG9wdGlvbnMub24uaGFzT3duUHJvcGVydHkoIGV2dCApICkge1xuICAgICAgICAgICAgICBpZiAoIHR5cGVvZiBvcHRpb25zLm9uW2V2dF0gPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICAgICAgICBmID0gb3B0aW9ucy5vbltldnRdLmJpbmQoIGUgKTtcbiAgICAgICAgICAgICAgICAvKmV2ZW50cy5wdXNoKCB7XG4gICAgICAgICAgICAgICAgIHR5cGU6IFwib25cIixcbiAgICAgICAgICAgICAgICAgZXZ0OiBldnQsXG4gICAgICAgICAgICAgICAgIGhhbmRsZXI6IGYsXG4gICAgICAgICAgICAgICAgIGNhcHR1cmU6IGZhbHNlXG4gICAgICAgICAgICAgICAgIH0gKTsgKi9cbiAgICAgICAgICAgICAgICBlLmFkZEV2ZW50TGlzdGVuZXIoIGV2dCwgZiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmID0gb3B0aW9ucy5vbltldnRdLmhhbmRsZXIuYmluZCggZSApO1xuICAgICAgICAgICAgICAgIC8qZXZlbnRzLnB1c2goIHtcbiAgICAgICAgICAgICAgICAgdHlwZTogXCJvblwiLFxuICAgICAgICAgICAgICAgICBldnQ6IGV2dCxcbiAgICAgICAgICAgICAgICAgaGFuZGxlcjogZixcbiAgICAgICAgICAgICAgICAgY2FwdHVyZTogdHlwZW9mIG9wdGlvbnMub25bIGV2dCBdLmNhcHR1cmUgIT09IFwidW5kZWZpbmVkXCIgPyBvcHRpb25zLm9uWyBldnQgXS5jYXB0dXJlIDogZmFsc2VcbiAgICAgICAgICAgICAgICAgfSApOyAqL1xuICAgICAgICAgICAgICAgIGUuYWRkRXZlbnRMaXN0ZW5lciggZXZ0LCBmLCB0eXBlb2Ygb3B0aW9ucy5vbltldnRdLmNhcHR1cmUgIT09IFwidW5kZWZpbmVkXCIgPyBvcHRpb25zLm9uW2V2dF0uY2FwdHVyZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gd2Ugc3VwcG9ydCBoYW1tZXIgdG9vLCBhc3N1bWluZyB3ZSdyZSBnaXZlbiBhIHJlZmVyZW5jZVxuICAgICAgICAvLyBpdCBtdXN0IGJlIG9mIHRoZSBmb3JtIGB7IGhhbW1lcjogeyBnZXN0dXJlOiB7IGhhbmRsZXI6IGZuLCBvcHRpb25zOiB9LCBoYW1tZXI6IGhhbW1lciB9IH1gXG4gICAgICAgIGlmICggb3B0aW9ucy5oYW1tZXIgKSB7XG4gICAgICAgICAgdmFyIGhhbW1lciA9IG9wdGlvbnMuaGFtbWVyLmhhbW1lcjtcbiAgICAgICAgICBmb3IgKCBldnQgaW4gb3B0aW9ucy5oYW1tZXIgKSB7XG4gICAgICAgICAgICBpZiAoIG9wdGlvbnMuaGFtbWVyLmhhc093blByb3BlcnR5KCBldnQgKSAmJiBldnQgIT09IFwiaGFtbWVyXCIgKSB7XG4gICAgICAgICAgICAgIC8qZXZlbnRzLnB1c2goIHtcbiAgICAgICAgICAgICAgIHR5cGU6IFwiaGFtbWVyXCIsXG4gICAgICAgICAgICAgICBldnQ6IGV2dCxcbiAgICAgICAgICAgICAgIGhhbW1lcjogaGFtbWVyLFxuICAgICAgICAgICAgICAgb3B0aW9uczogb3B0aW9ucy5oYW1tZXJbIGV2dCBdXG4gICAgICAgICAgICAgICB9ICk7Ki9cbiAgICAgICAgICAgICAgaGFtbWVyKCBlLCBvcHRpb25zLmhhbW1lcltldnRdLm9wdGlvbnMgKS5vbiggZXZ0LCBvcHRpb25zLmhhbW1lcltldnRdLmhhbmRsZXIgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWxsb3cgZWxlbWVudHMgdG8gYmUgc3RvcmVkIGludG8gYSBjb250ZXh0XG4gICAgICAgIC8vIHN0b3JlIG11c3QgYmUgYW4gb2JqZWN0IG9mIHRoZSBmb3JtIGB7b2JqZWN0Om9iamVjdFJlZiwga2V5UGF0aDogXCJrZXlQYXRoXCIsIFtpZE9ubHk6dHJ1ZXxmYWxzZV0gfWBcbiAgICAgICAgLy8gaWYgaWRPbmx5IGlzIHRydWUsIG9ubHkgdGhlIGVsZW1lbnQncyBpZCBpcyBzdG9yZWRcbiAgICAgICAgaWYgKCBvcHRpb25zLnN0b3JlICkge1xuICAgICAgICAgIGlmICggb3B0aW9ucy5zdG9yZS5pZE9ubHkgKSB7XG4gICAgICAgICAgICBlbGlkID0gZ2V0QW5kU2V0RWxlbWVudElkKCBlICk7XG4gICAgICAgICAgICBvcHRpb25zLnN0b3JlLm9iamVjdFtvcHRpb25zLnN0b3JlLmtleVBhdGhdID0gZWxpZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3B0aW9ucy5zdG9yZS5vYmplY3Rbb3B0aW9ucy5zdG9yZS5rZXlQYXRoXSA9IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBpZiB3ZSBoYXZlIGNvbnRlbnQsIGdvIGFoZWFkIGFuZCBhZGQgaXQ7XG4gICAgICAvLyBpZiB3ZSdyZSBhbiBlbGVtZW50IHRoYXQgaGFzIGEgYHZhbHVlYCwgd2UgYXR0YWNoIGl0IHRvIHRoZSB2YWx1ZVxuICAgICAgLy8gcHJvcGVydHkgaW5zdGVhZCBvZiBgdGV4dENvbnRlbnRgLiBJZiBgdGV4dENvbnRlbnRgIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgIC8vIHdlIHVzZSBgaW5uZXJUZXh0YDsgaWYgdGhhdCdzIG5vdCBhdmFpbGFibGUsIHdlIGNvbXBsYWluIGFuZCBkb1xuICAgICAgLy8gbm90aGluZy4gRmFsbGluZyBiYWNrIHRvIGBpbm5lckhUTUxgIGlzbid0IGFuIG9wdGlvbiwgYXMgdGhhdCdzIHdoYXRcbiAgICAgIC8vIHdlIGFyZSBleHBsaWNpdGx5IHRyeWluZyB0byBhdm9pZC5cbiAgICAgIC8vXG4gICAgICAvLyBGaXJzdCwgZGV0ZXJtaW5lIGlmIHdlIGhhdmUgYHZhbHVlYCBhbmQgYHRleHRDb250ZW50YCBvcHRpb25zIG9yIG9ubHlcbiAgICAgIC8vIGB0ZXh0Q29udGVudGAgKGJ1dHRvbnMgaGF2ZSBib3RoKSBJZiBib3RoIGFyZSBwcmVzZW50LCB0aGUgZmlyc3RcbiAgICAgIC8vIGNvbnRlbnQgaXRlbSBpcyBhcHBsaWVkIHRvIGB2YWx1ZWAsIGFuZCB0aGUgc2Vjb25kIGlzIGFwcGxpZWQgdG9cbiAgICAgIC8vIGB0ZXh0Q29udGVudGB8YGlubmVyVGV4dGBcbiAgICAgIGlmICggdHlwZW9mIGUudmFsdWUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIGNvbnRlbnRUYXJnZXQucHVzaCggXCJ2YWx1ZVwiICk7XG4gICAgICB9XG4gICAgICBpZiAoICggdHlwZW9mIGUudGV4dENvbnRlbnQgIT09IFwidW5kZWZpbmVkXCIgKSB8fCAoIHR5cGVvZiBlLmlubmVyVGV4dCAhPT0gXCJ1bmRlZmluZWRcIiApICkge1xuICAgICAgICBjb250ZW50VGFyZ2V0LnB1c2goIHR5cGVvZiBlLnRleHRDb250ZW50ICE9PSBcInVuZGVmaW5lZFwiID8gXCJ0ZXh0Q29udGVudFwiIDogXCJpbm5lclRleHRcIiApO1xuICAgICAgfVxuICAgICAgZm9yICggaSA9IDAsIGwgPSBjb250ZW50VGFyZ2V0Lmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgdmFyIHggPSBjb250ZW50LnNoaWZ0KCk7XG4gICAgICAgIGlmICggdHlwZW9mIHggIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgZVtjb250ZW50VGFyZ2V0W2ldXSA9IHg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEhhbmRsZSBjaGlsZHJlbjsgYGhhbmRsZUNoaWxkYCBhcHBlbmRzIGVhY2ggb25lIHRvIHRoZSBwYXJlbnRcbiAgICAgIHZhciBjaGlsZDtcbiAgICAgIGZvciAoIGkgPSAwLCBsID0gYXJncy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICAgIGNoaWxkID0gYXJnc1tpXTtcbiAgICAgICAgaGFuZGxlQ2hpbGQoIGNoaWxkLCBlICk7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiBvcHRpb25zID09PSBcIm9iamVjdFwiICYmIG9wdGlvbnMgIT09IG51bGwgKSB7XG4gICAgICAgIC8vIERhdGEgYmluZGluZyBvbmx5IG9jY3VycyBpZiB1c2luZyBZQVNNRidzIEJhc2VPYmplY3QgZm9yIG5vdyAoYnVpbHQtaW4gcHVic3ViL29ic2VydmFibGVzKVxuICAgICAgICAvLyBhbG9uZyB3aXRoIG9ic2VydmFibGUgcHJvcGVydGllc1xuICAgICAgICAvLyB0aGUgYmluZGluZyBvYmplY3QgaXMgb2YgdGhlIGZvcm0gYHsgb2JqZWN0OiBvYmplY3RSZWYsIGtleVBhdGg6IFwia2V5UGF0aFwiLCBba2V5VHlwZTpcInN0cmluZ1wiXSB9YFxuICAgICAgICBpZiAoIG9wdGlvbnMuYmluZCApIHtcbiAgICAgICAgICBpZiAoIHR5cGVvZiBCYXNlT2JqZWN0ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmJpbmQub2JqZWN0IGluc3RhbmNlb2YgQmFzZU9iamVjdCApIHtcbiAgICAgICAgICAgICAgZWxpZCA9IGdldEFuZFNldEVsZW1lbnRJZCggZSApO1xuICAgICAgICAgICAgICAvLyB3ZSBoYXZlIGFuIG9iamVjdCB0aGF0IGhhcyBvYnNlcnZhYmxlIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgb3B0aW9ucy5iaW5kLm9iamVjdC5kYXRhQmluZE9uKCBlLCBvcHRpb25zLmJpbmQua2V5UGF0aCwgb3B0aW9ucy5iaW5kLmtleVR5cGUgKTtcbiAgICAgICAgICAgICAgb3B0aW9ucy5iaW5kLm9iamVjdC5ub3RpZnlEYXRhQmluZGluZ0VsZW1lbnRzRm9yS2V5UGF0aCggb3B0aW9ucy5iaW5kLmtleVBhdGggKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vcmVuZGVyRXZlbnRzW2VsaWRdID0gZXZlbnRzO1xuICAgICAgLy8gcmV0dXJuIHRoZSBlbGVtZW50IChhbmQgYXNzb2NpYXRlZCB0cmVlKVxuICAgICAgcmV0dXJuIGU7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBtYXBUbyAtIE1hcHMgYSBrZXlwYXRoIHRvIGFub3RoZXIga2V5cGF0aCBiYXNlZCBvbiBgbWFwYC4gYG1hcGAgc2hvdWxkIGxvb2sgbGlrZSB0aGlzOlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICoge1xuICAgICAgICogICBcIm1hcHBpbmdfa2V5XCI6IFwidGFyZ2V0X2tleVwiLCAuLi5cbiAgICAgICAqIH1cbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlLCBsZXQncyBhc3N1bWUgdGhhdCBzb21lIG9iamVjdCBgb2AgaGFzIHRoZSBwcm9wZXJ0aWVzIGBpZGAgYW5kIGBuYW1lYC4gV2VcbiAgICAgKiB3YW50IHRvIG1hcCB0aGVzZSB0byBjb25zaXN0ZW50IHZhbHVlcyBsaWtlIGB2YWx1ZWAgYW5kIGBkZXNjcmlwdGlvbmAgZm9yIGEgY29tcG9uZW50LlxuICAgICAqIGBtYXBgIHNob3VsZCBsb29rIGxpa2UgdGhpczogYHsgXCJ2YWx1ZVwiOiBcImlkXCIsIFwiZGVzY3JpcHRpb25cIjogXCJuYW1lXCIgfWAuIEluIHRoaXMgY2FzZVxuICAgICAqIGNhbGxpbmcgYG1hcFRvKFwidmFsdWVcIiwgbWFwKWAgd291bGQgcmV0dXJuIGBpZGAsIHdoaWNoIGNvdWxkIHRoZW4gYmUgaW5kZXhlZCBvbiBgb2BcbiAgICAgKiBsaWtlIHNvOiBgb1ttYXBUbyhcInZhbHVlXCIsbWFwKV1gLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBtYXBUb1xuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICAga2V5UGF0aCB0byBtYXBcbiAgICAgKiBAcGFyYW0gIHsqfSBtYXAgICAgIG1hcCBkZXNjcmlwdGlvblxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gICAgbWFwcGVkIGtleVBhdGhcbiAgICAgKi9cbiAgICBtYXBUbzogICAgICAgICBmdW5jdGlvbiBtYXBUbygga2V5UGF0aCwgbWFwICkge1xuICAgICAgaWYgKCB0eXBlb2YgbWFwID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICByZXR1cm4ga2V5UGF0aDtcbiAgICAgIH1cbiAgICAgIGlmICggdHlwZW9mIG1hcFtrZXlQYXRoXSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgcmV0dXJuIG1hcFtrZXlQYXRoXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBrZXlQYXRoO1xuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogaWlmIC0gZXZhbHVhdGUgYGV4cHJgIGFuZCBpZiBpdCBpcyBgdHJ1ZWAsIHJldHVybiBgYWAuIElmIGl0IGlzIGZhbHNlLFxuICAgICAqIHJldHVybiBgYmAuIElmIGBhYCBpcyBub3Qgc3VwcGxpZWQsIGB0cnVlYCBpcyB0aGUgcmV0dXJuIHJlc3VsdCBpZiBgYWBcbiAgICAgKiB3b3VsZCBoYXZlIGJlZW4gcmV0dXJuZWQuIElmIGBiYCBpcyBub3Qgc3VwcGxpZWQsIGBmYWxzZWAgaXMgdGhlIHJldHVyblxuICAgICAqIHJlc3VsdCBpZiBgYmAgd291bGQgaGF2ZSBiZWVuIHJldHVybmVkLiBOb3QgbXVjaCBkaWZmZXJlbmNlIHRoYW4gdGhlXG4gICAgICogdGVybmFyeSAoYD86YCkgb3BlcmF0b3IsIGJ1dCBtaWdodCBiZSBlYXNpZXIgdG8gcmVhZCBmb3Igc29tZS5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgaWlmXG4gICAgICogQHBhcmFtICB7Ym9vbGVhbn0gZXhwciBleHByZXNzaW9uIHRvIGV2YWx1YXRlXG4gICAgICogQHBhcmFtICB7Kn0gYSAgICAgdmFsdWUgdG8gcmV0dXJuIGlmIGBleHByYCBpcyB0cnVlOyBgdHJ1ZWAgaXMgdGhlIGRlZmF1bHQgaWYgbm90IHN1cHBsaWVkXG4gICAgICogQHBhcmFtICB7Kn0gYiAgICAgdmFsdWUgdG8gcmV0dXJuIGlmIGBleHByYCBpcyBmYWxzZTsgYGZhbHNlYCBpcyB0aGUgZGVmYXVsdCBpZiBub3Qgc3VwcGxpZWRcbiAgICAgKiBAcmV0dXJuIHsqfSAgICAgICBgZXhwciA/IGEgOiBiYFxuICAgICAqL1xuICAgIGlpZjogICAgICAgICAgIGZ1bmN0aW9uIGlpZiggZXhwciwgYSwgYiApIHtcbiAgICAgIHJldHVybiBleHByID8gKCAoIHR5cGVvZiBhICE9PSBcInVuZGVmaW5lZFwiICkgPyBhIDogdHJ1ZSApIDogKCAoIHR5cGVvZiBiICE9PSBcInVuZGVmaW5lZFwiICkgPyBiIDogZmFsc2UgKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIGlmZGVmIC0gQ2hlY2sgaWYgYW4gZXhwcmVzc2lvbiBpcyBkZWZpbmVkIGFuZCByZXR1cm4gYGFgIGlmIGl0IGlzIGFuZCBgYmBcbiAgICAgKiBpZiBpdCBpc24ndC4gSWYgYGFgIGlzIG5vdCBzdXBwbGllZCwgYGFgIGV2YWx1YXRlcyB0byBgdHJ1ZWAgYW5kIGlmIGBiYFxuICAgICAqIGlzIG5vdCBzdXBwbGllZCwgYGJgIGV2YWx1YXRlcyB0byBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBpZmRlZlxuICAgICAqIEBwYXJhbSAge2Jvb2xlYW59IGV4cHIgZXhwcmVzc2lvbiB0byBjaGVja1xuICAgICAqIEBwYXJhbSAgeyp9ICAgICAgIGEgICAgdmFsdWUgdG8gcmV0dXJuIGlmIGV4cHJlc3Npb24gaXMgZGVmaW5lZFxuICAgICAqIEBwYXJhbSAgeyp9ICAgICAgIGIgICAgdmFsdWUgdG8gcmV0dXJuIGlmIGV4cHJlc3Npb24gaXMgbm90IGRlZmluZWRcbiAgICAgKiBAcmV0dXJuIHsqfSAgICAgICBhIG9yIGJcbiAgICAgKi9cbiAgICBpZmRlZjogICAgICAgICBmdW5jdGlvbiBpZmRlZiggZXhwciwgYSwgYiApIHtcbiAgICAgIHJldHVybiAoIHR5cGVvZiBleHByICE9PSBcInVuZGVmaW5lZFwiICkgPyAoICggdHlwZW9mIGEgIT09IFwidW5kZWZpbmVkXCIgKSA/IGEgOiB0cnVlICkgOiAoICggdHlwZW9mIGIgIT09IFwidW5kZWZpbmVkXCIgKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGIgOiBmYWxzZSApO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogZm9ySW4gLSByZXR1cm4gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIGBmbmAgZm9yXG4gICAgICogZWFjaCBwcm9wZXJ0eSB3aXRoaW4gYG9iamVjdGAuIEVxdWl2YWxlbnQgdG8gYG1hcGAgb24gYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBUaGUgZnVuY3Rpb24gc2hvdWxkIGhhdmUgdGhlIHNpZ25hdHVyZSBgKCB2YWx1ZSwgb2JqZWN0LCBwcm9wZXJ0eSApYFxuICAgICAqIGFuZCByZXR1cm4gdGhlIHJlc3VsdC4gVGhlIHJlc3VsdHMgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIGNvbGxhdGVkIGluXG4gICAgICogYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGZvckluXG4gICAgICogQHBhcmFtICB7Kn0gICAgICAgIG9iamVjdCBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyXG4gICAgICogQHBhcmFtICB7ZnVuY3Rpb259IGZuICAgICBmdW5jdGlvbiB0byBjYWxsXG4gICAgICogQHJldHVybiB7QXJyYXl9ICAgICAgICAgICByZXN1dHNcbiAgICAgKi9cbiAgICBmb3JJbjogICAgICAgICBmdW5jdGlvbiBmb3JJbiggb2JqZWN0LCBmbiApIHtcbiAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgIGZvciAoIHZhciBwcm9wIGluIG9iamVjdCApIHtcbiAgICAgICAgaWYgKCBvYmplY3QuaGFzT3duUHJvcGVydHkoIHByb3AgKSApIHtcbiAgICAgICAgICBhcnIucHVzaCggZm4oIG9iamVjdFtwcm9wXSwgb2JqZWN0LCBwcm9wICkgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGFycjtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIGZvckVhY2ggLSBFeGVjdXRlcyBgbWFwYCBvbiBhbiBhcnJheSwgY2FsbGluZyBgZm5gLiBOYW1lZCBzdWNoIGJlY2F1c2VcbiAgICAgKiBpdCBtYWtlcyBtb3JlIHNlbnNlIHRoYW4gdXNpbmcgYG1hcGAgaW4gYSB0ZW1wbGF0ZSwgYnV0IGl0IG1lYW5zIHRoZVxuICAgICAqIHNhbWUgdGhpbmcuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGZvckVhY2hcbiAgICAgKiBAcGFyYW0gIHtBcnJheX0gICAgYXJyIEFycmF5IHRvIGl0ZXJhdGVcbiAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0gZm4gIEZ1bmN0aW9uIHRvIGNhbGxcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gICAgICAgIEFycmF5IGFmdGVyIGl0ZXJhdGlvblxuICAgICAqL1xuICAgIGZvckVhY2g6ICAgICAgIGZ1bmN0aW9uIGZvckVhY2goIGFyciwgZm4gKSB7XG4gICAgICByZXR1cm4gYXJyLm1hcCggZm4gKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIHJlbmRlclRvIC0gUmVuZGVycyBhIG5vZGUgb3IgYXJyYXkgb2Ygbm9kZXMgdG8gYSBnaXZlbiBlbGVtZW50LiBJZiBhblxuICAgICAqIGFycmF5IGlzIHByb3ZpZGVkLCBlYWNoIGlzIGFwcGVuZGVkIGluIHR1cm4uXG4gICAgICpcbiAgICAgKiBOb3RlOiB0ZWNobmljYWxseSB5b3UgY2FuIGp1c3QgdXNlIGBhcHBlbmRDaGlsZGAgb3IgZXF1aXZhbGVudCBET01cbiAgICAgKiBtZXRob2RzLCBidXQgdGhpcyB3b3JrcyBvbmx5IGFzIGZhciBhcyB0aGUgcmV0dXJuIHJlc3VsdCBpcyBhIHNpbmdsZVxuICAgICAqIG5vZGUuIE9jY2FzaW9uYWxseSB5b3VyIHRlbXBsYXRlIG1heSByZXR1cm4gYW4gYXJyYXkgb2Ygbm9kZXMsIGFuZFxuICAgICAqIGF0IHRoYXQgcG9pbnQgYGFwcGVuZENoaWxkYCBmYWlscy5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVuZGVyVG9cbiAgICAgKiBAcGFyYW0gIHtBcnJheXxOb2RlfSBuICBBcnJheSBvciBzaW5nbGUgbm9kZSB0byBhcHBlbmQgdG8gdGhlIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gIHtOb2RlfSBlbCBFbGVtZW50IHRvIGF0dGFjaCB0b1xuICAgICAqIEBwYXJhbSAge051bWJlcn0gaWR4ICBpbmRleCAob3B0aW9uYWwpXG4gICAgICovXG4gICAgcmVuZGVyVG86ICAgICAgZnVuY3Rpb24gcmVuZGVyVG8oIG4sIGVsLCBpZHggKSB7XG4gICAgICBmdW5jdGlvbiB0cmFuc2Zvcm0oIHBhcmVudCwgbm9kZUEsIG5vZGVCICkge1xuICAgICAgICB2YXIgaGFzQ2hpbGRyZW4gPSBbZmFsc2UsIGZhbHNlXSxcbiAgICAgICAgICBjaGlsZE5vZGVzID0gW1xuICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBbXVxuICAgICAgICAgIF0sXG4gICAgICAgICAgX0EgPSAwLFxuICAgICAgICAgIF9CID0gMSxcbiAgICAgICAgICBpLCBsLFxuICAgICAgICAgIGxlbiA9IFswLCAwXSxcbiAgICAgICAgICBub2RlcyA9IFtub2RlQSwgbm9kZUJdLFxuICAgICAgICAgIGF0dHJzID0gW1xuICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBbXVxuICAgICAgICAgIF0sXG4gICAgICAgICAgc3R5bGVzID0gW3t9LCB7fV0sXG4gICAgICAgICAgc3R5bGVLZXlzID0gW1xuICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBbXVxuICAgICAgICAgIF0sXG4gICAgICAgICAgZXZlbnRzID0gW1xuICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBbXVxuICAgICAgICAgIF0sXG4gICAgICAgICAgZWxpZCA9IFtudWxsLCBudWxsXTtcbiAgICAgICAgaWYgKCAhbm9kZUEgJiYgIW5vZGVCICkge1xuICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG8uXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICggIW5vZGVBICYmIG5vZGVCICkge1xuICAgICAgICAgIC8vIHRoZXJlJ3Mgbm8gY29ycmVzcG9uZGluZyBlbGVtZW50IGluIEE7IGp1c3QgYWRkIEIuXG4gICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKCBub2RlQiApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIG5vZGVBICYmICFub2RlQiApIHtcbiAgICAgICAgICAvLyB0aGVyZSdzIG5vIGNvcnJlc3BvbmRpbmcgZWxlbWVudCBpbiBCOyByZW1vdmUgQSdzIGVsZW1lbnRcbiAgICAgICAgICBub2RlQS5yZW1vdmUoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCAoIG5vZGVBLm5vZGVUeXBlICE9PSBub2RlQi5ub2RlVHlwZSApIHx8ICggbm9kZUIubm9kZVR5cGUgIT09IDEgKSApIHtcbiAgICAgICAgICAvLyBpZiB0aGUgbm9kZSB0eXBlcyBhcmUgZGlmZmVyZW50LCB0aGVyZSdzIG5vIHJlYXNvbiB0byB0cmFuc2Zvcm0gdHJlZSBBIC0tIGp1c3QgcmVwbGFjZSB0aGUgd2hvbGUgdGhpbmdcbiAgICAgICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKCBub2RlQiwgbm9kZUEgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBub2RlQi5jbGFzc0xpc3QgKSB7XG4gICAgICAgICAgaWYgKCAhbm9kZUIuY2xhc3NMaXN0LmNvbnRhaW5zKCBcInVpLWNvbnRhaW5lclwiICkgJiYgIW5vZGVCLmNsYXNzTGlzdC5jb250YWlucyggXCJ1aS1saXN0XCIgKSAmJiAhbm9kZUIuY2xhc3NMaXN0LmNvbnRhaW5zKFxuICAgICAgICAgICAgICBcInVpLXNjcm9sbC1jb250YWluZXJcIiApICkge1xuICAgICAgICAgICAgLy8gaWYgdGhlIG5vZGUgdHlwZXMgYXJlIGRpZmZlcmVudCwgdGhlcmUncyBubyByZWFzb24gdG8gdHJhbnNmb3JtIHRyZWUgQSAtLSBqdXN0IHJlcGxhY2UgdGhlIHdob2xlIHRoaW5nXG4gICAgICAgICAgICBwYXJlbnQucmVwbGFjZUNoaWxkKCBub2RlQiwgbm9kZUEgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2V0IHVwIGZvciB0cmFuc2Zvcm1pbmcgdGhpcyBub2RlXG4gICAgICAgIG5vZGVzLmZvckVhY2goIGZ1bmN0aW9uIGluaXQoIG5vZGUsIGlkeCApIHtcbiAgICAgICAgICBoYXNDaGlsZHJlbltpZHhdID0gbm9kZS5oYXNDaGlsZE5vZGVzKCk7XG4gICAgICAgICAgbGVuW2lkeF0gPSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoO1xuICAgICAgICAgIGlmICggbm9kZS5nZXRBdHRyaWJ1dGUgKSB7XG4gICAgICAgICAgICBlbGlkW2lkeF0gPSBub2RlLmdldEF0dHJpYnV0ZSggXCJpZFwiICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICggbm9kZS5jaGlsZE5vZGVzICkge1xuICAgICAgICAgICAgY2hpbGROb2Rlc1tpZHhdID0gW10uc2xpY2UuY2FsbCggbm9kZS5jaGlsZE5vZGVzLCAwICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICggbm9kZS5hdHRyaWJ1dGVzICkge1xuICAgICAgICAgICAgYXR0cnNbaWR4XSA9IFtdLnNsaWNlLmNhbGwoIG5vZGUuYXR0cmlidXRlcywgMCApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIG5vZGUuc3R5bGVzICkge1xuICAgICAgICAgICAgc3R5bGVzW2lkeF0gPSBub2RlLnN0eWxlO1xuICAgICAgICAgICAgc3R5bGVLZXlzW2lkeF0gPSBPYmplY3Qua2V5cyggc3R5bGVzW2lkeF0gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gKTtcbiAgICAgICAgLy9ldmVudHNbX0FdID0gZ2xvYmFsRXZlbnRzW2VsaWRbX0FdXSB8fCBbXTtcbiAgICAgICAgLy9ldmVudHNbX0JdID0gcmVuZGVyRXZlbnRzW2VsaWRbX0JdXSB8fCBbXTtcbiAgICAgICAgLy8gdHJhbnNmb3JtIGFsbCBvdXIgY2hpbGRyZW5cbiAgICAgICAgZm9yICggaSA9IDAsIGwgPSBNYXRoLm1heCggbGVuW19BXSwgbGVuW19CXSApOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgIHRyYW5zZm9ybSggbm9kZUEsIGNoaWxkTm9kZXNbX0FdW2ldLCBjaGlsZE5vZGVzW19CXVtpXSApO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvcHkgYXR0cmlidXRlc1xuICAgICAgICBmb3IgKCBpID0gMCwgbCA9IE1hdGgubWF4KCBhdHRyc1tfQV0ubGVuZ3RoLCBhdHRyc1tfQl0ubGVuZ3RoICk7IGkgPCBsOyBpKysgKSB7XG4gICAgICAgICAgaWYgKCBhdHRyc1tfQV1baV0gKSB7XG4gICAgICAgICAgICBpZiAoICFub2RlQi5oYXNBdHRyaWJ1dGUoIGF0dHJzW19BXVtpXS5uYW1lICkgKSB7XG4gICAgICAgICAgICAgIC8vIHJlbW92ZSBhbnkgYXR0cmlidXRlcyB0aGF0IGFyZW4ndCBwcmVzZW50IGluIEJcbiAgICAgICAgICAgICAgbm9kZUEucmVtb3ZlQXR0cmlidXRlKCBhdHRyc1tfQV1baV0ubmFtZSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIGF0dHJzW19CXVtpXSApIHtcbiAgICAgICAgICAgIG5vZGVBLnNldEF0dHJpYnV0ZSggYXR0cnNbX0JdW2ldLm5hbWUsIGF0dHJzW19CXVtpXS52YWx1ZSApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb3B5IHN0eWxlc1xuICAgICAgICBmb3IgKCBpID0gMCwgbCA9IE1hdGgubWF4KCBzdHlsZXNbX0FdLmxlbmd0aCwgc3R5bGVzW19CXS5sZW5ndGggKTsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgICBpZiAoIHN0eWxlc1tfQV1baV0gKSB7XG4gICAgICAgICAgICBpZiAoICEoIHN0eWxlS2V5c1tfQl1baV0gaW4gc3R5bGVLZXlzW19BXSApICkge1xuICAgICAgICAgICAgICAvLyByZW1vdmUgYW55IHN0eWxlcyB0aGF0IGFyZW4ndCBwcmVzZW50IGluIEJcbiAgICAgICAgICAgICAgbm9kZUEuc3R5bGVbc3R5bGVLZXlzW19CXVtpXV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIHN0eWxlc1tfQl1baV0gKSB7XG4gICAgICAgICAgICBub2RlQS5zdHlsZVtzdHlsZUtleXNbX0JdW2ldXSA9IHN0eWxlc1tfQl1bc3R5bGVLZXlzW19CXVtpXV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvcHkgZXZlbnRzXG4gICAgICAgIC8qZm9yICggaSA9IDAsIGwgPSBNYXRoLm1heCggZXZlbnRzWyBfQSBdLmxlbmd0aCwgZXZlbnRzWyBfQiBdLmxlbmd0aCApOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgWyAwLCAxIF0uZm9yRWFjaCggZnVuY3Rpb24gZG9BTm9kZSggd2hpY2hOb2RlICkge1xuICAgICAgICAgdmFyIGV2dCA9IGV2ZW50c1sgd2hpY2hOb2RlIF1bIGkgXSxcbiAgICAgICAgIG5vZGUgPSBub2Rlc1sgd2hpY2hOb2RlIF0sXG4gICAgICAgICBoYW5kbGVyO1xuICAgICAgICAgaWYgKCBldnQgKSB7XG4gICAgICAgICBzd2l0Y2ggKCBldnQudHlwZSApIHtcbiAgICAgICAgIGNhc2UgXCJvblwiOlxuICAgICAgICAgaGFuZGxlciA9IHdoaWNoTm9kZSA9PT0gX0EgPyBcInJlbW92ZUV2ZW50TGlzdGVuZXJcIiA6IFwiYWRkRXZlbnRMaXN0ZW5lclwiO1xuICAgICAgICAgbm9kZUFbIGhhbmRsZXIgXSggZXZ0LmV2dCwgZXZ0LmhhbmRsZXIsIGV2dC5jYXB0dXJlICk7XG4gICAgICAgICBicmVhaztcbiAgICAgICAgIGNhc2UgXCJoYW1tZXJcIjpcbiAgICAgICAgIGhhbmRsZXIgPSB3aGljaE5vZGUgPT09IF9BID8gXCJvZmZcIiA6IFwib25cIjtcbiAgICAgICAgIGNvbnNvbGUubG9nKCBoYW5kbGVyLCBub2RlQSwgZXZ0LmV2dCwgZXZ0Lm9wdGlvbnMuaGFuZGxlciApO1xuICAgICAgICAgZXZ0LmhhbW1lciggbm9kZUEsIGV2dC5vcHRpb25zLm9wdGlvbnMgKVsgaGFuZGxlciBdKCBldnQuZXZ0LCBldnQub3B0aW9ucy5oYW5kbGVyICk7XG4gICAgICAgICBicmVhaztcbiAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICAgICB9ICk7XG4gICAgICAgICB9XG4gICAgICAgICBpZiAoIGVsaWRbIF9BIF0gKSB7XG4gICAgICAgICBnbG9iYWxFdmVudHNbIGVsaWRbIF9BIF0gXSA9IG51bGw7XG4gICAgICAgICBkZWxldGUgZ2xvYmFsRXZlbnRzWyBlbGlkWyBfQSBdIF07XG4gICAgICAgICB9XG4gICAgICAgICBpZiAoIGVsaWRbIF9CIF0gKSB7XG4gICAgICAgICBnbG9iYWxFdmVudHNbIGVsaWRbIF9CIF0gXSA9IHJlbmRlckV2ZW50c1sgZWxpZFsgX0IgXSBdO1xuICAgICAgICAgcmVuZGVyRXZlbnRzWyBlbGlkWyBfQiBdIF0gPSBudWxsO1xuICAgICAgICAgZGVsZXRlIHJlbmRlckV2ZW50c1sgZWxpZFsgX0IgXSBdO1xuICAgICAgICAgfSovXG4gICAgICB9XG5cbiAgICAgIGlmICggIWlkeCApIHtcbiAgICAgICAgaWR4ID0gMDtcbiAgICAgIH1cbiAgICAgIGlmICggbiBpbnN0YW5jZW9mIEFycmF5ICkge1xuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBuLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgICBpZiAoIG5baV0gIT09IHVuZGVmaW5lZCAmJiBuW2ldICE9PSBudWxsICkge1xuICAgICAgICAgICAgcmVuZGVyVG8oIG5baV0sIGVsLCBpICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIG4gPT09IHVuZGVmaW5lZCB8fCBuID09PSBudWxsIHx8IGVsID09PSB1bmRlZmluZWQgfHwgZWwgPT09IG51bGwgKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbGlkID0gW251bGwsIG51bGxdO1xuICAgICAgICAvKmlmICggbiApIHtcbiAgICAgICAgIGVsaWRbMV0gPSBuLmdldEF0dHJpYnV0ZSggXCJpZFwiICk7XG4gICAgICAgICB9Ki9cbiAgICAgICAgaWYgKCBlbC5oYXNDaGlsZE5vZGVzKCkgJiYgaWR4IDwgZWwuY2hpbGROb2Rlcy5sZW5ndGggKSB7XG4gICAgICAgICAgZWxpZFswXSA9IGVsLmNoaWxkTm9kZXNbaWR4XS5nZXRBdHRyaWJ1dGUoIFwiaWRcIiApO1xuICAgICAgICAgIGlmICggaC51c2VEb21NZXJnaW5nICkge1xuICAgICAgICAgICAgdHJhbnNmb3JtKCBlbCwgZWwuY2hpbGROb2Rlc1tpZHhdLCBuICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnJlcGxhY2VDaGlsZCggbiwgZWwuY2hpbGROb2Rlc1tpZHhdICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVsLmFwcGVuZENoaWxkKCBuICk7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgIGlmICggZWxpZFsgMCBdICkge1xuICAgICAgICAgZ2xvYmFsRXZlbnRzWyBlbGlkWyAwIF0gXSA9IG51bGw7XG4gICAgICAgICBkZWxldGUgZ2xvYmFsRXZlbnRzWyBlbGlkWyAwIF0gXTtcbiAgICAgICAgIH1cbiAgICAgICAgIGlmICggZWxpZFsgMSBdICkge1xuICAgICAgICAgZ2xvYmFsRXZlbnRzWyBlbGlkWyAxIF0gXSA9IHJlbmRlckV2ZW50c1sgZWxpZFsgMSBdIF07XG4gICAgICAgICByZW5kZXJFdmVudHNbIGVsaWRbIDEgXSBdID0gbnVsbDtcbiAgICAgICAgIGRlbGV0ZSByZW5kZXJFdmVudHNbIGVsaWRbIDEgXSBdO1xuICAgICAgICAgfSovXG4gICAgICB9XG4gICAgfVxuICB9LFxuLy8gY3JlYXRlIGJpbmRpbmdzIGZvciBlYWNoIEhUTUwgZWxlbWVudCAoZnJvbTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRNTC9FbGVtZW50KVxuICBlbHMgPSBbXCJhXCIsIFwiYWJiclwiLCBcImFjcm9ueW1cIiwgXCJhZGRyZXNzXCIsIFwiYXBwbGV0XCIsIFwiYXJlYVwiLCBcImFydGljbGVcIiwgXCJhc2lkZVwiLCBcImF1ZGlvXCIsIFwiYlwiLCBcImJhc2VcIiwgXCJiYXNlZm9udFwiLCBcImJkaVwiLFxuICAgICAgICAgXCJiZG9cIiwgXCJiZ3NvdW5kXCIsIFwiYmlnXCIsIFwiYmxpbmtcIiwgXCJibG9ja3F1b3RlXCIsIFwiYm9keVwiLCBcImJyXCIsIFwiYnV0dG9uXCIsIFwiY2FudmFzXCIsIFwiY2FwdGlvblwiLCBcImNlbnRlclwiLCBcImNpdGVcIiwgXCJjb2RlXCIsXG4gICAgICAgICBcImNvbFwiLCBcImNvbGdyb3VwXCIsIFwiY29udGVudFwiLCBcImRhdGFcIiwgXCJkYXRhbGlzdFwiLCBcImRkXCIsIFwiZGVjb3JhdG9yXCIsIFwiZGVsXCIsIFwiZGV0YWlsc1wiLCBcImRmblwiLCBcImRpYWxvZ1wiLCBcImRpclwiLCBcImRpdlwiLFxuICAgICAgICAgXCJkbFwiLCBcImR0XCIsIFwiZWxlbWVudFwiLCBcImVtXCIsIFwiZW1iZWRcIiwgXCJmaWVsZHNldFwiLCBcImZpZ2NhcHRpb25cIiwgXCJmaWd1cmVcIiwgXCJmb250XCIsIFwiZm9vdGVyXCIsIFwiZm9ybVwiLCBcImZyYW1lc2V0XCIsIFwiaDFcIixcbiAgICAgICAgIFwiaDJcIiwgXCJoM1wiLCBcImg0XCIsIFwiaDVcIiwgXCJoNlwiLCBcImhlYWRcIiwgXCJoZWFkZXJcIiwgXCJoZ3JvdXBcIiwgXCJoclwiLCBcImh0bWxcIiwgXCJpXCIsIFwiaWZyYW1lXCIsIFwiaW1nXCIsIFwiaW5wdXRcIiwgXCJpbnNcIiwgXCJpc2luZGV4XCIsXG4gICAgICAgICBcImtiZFwiLCBcImtleWdlblwiLCBcImxhYmVsXCIsIFwibGVnZW5kXCIsIFwibGlcIiwgXCJsaW5rXCIsIFwibGlzdGluZ1wiLCBcIm1haW5cIiwgXCJtYXBcIiwgXCJtYXJrXCIsIFwibWFycXVlZVwiLCBcIm1lbnVcIiwgXCJtZW51aXRlbVwiLCBcIm1ldGFcIixcbiAgICAgICAgIFwibWV0ZXJcIiwgXCJuYXZcIiwgXCJub2JyXCIsIFwibm9mcmFtZXNcIiwgXCJub3NjcmlwdFwiLCBcIm9iamVjdFwiLCBcIm9sXCIsIFwib3B0Z3JvdXBcIiwgXCJvcHRpb25cIiwgXCJvdXRwdXRcIiwgXCJwXCIsIFwicGFyYW1cIiwgXCJwaWN0dXJlXCIsXG4gICAgICAgICBcInBsYWludGV4dFwiLCBcInByZVwiLCBcInByb2dyZXNzXCIsIFwicVwiLCBcInJwXCIsIFwicnRcIiwgXCJydWJ5XCIsIFwic1wiLCBcInNhbXBcIiwgXCJzY3JpcHRcIiwgXCJzZWN0aW9uXCIsIFwic2VsZWN0XCIsIFwic2hhZG93XCIsIFwic21hbGxcIixcbiAgICAgICAgIFwic291cmNlXCIsIFwic3BhY2VyXCIsIFwic3BhblwiLCBcInN0cmlrZVwiLCBcInN0cm9uZ1wiLCBcInN0eWxlXCIsIFwic3ViXCIsIFwic3VtbWFyeVwiLCBcInN1cFwiLCBcInRhYmxlXCIsIFwidGJvZHlcIiwgXCJ0ZFwiLCBcInRlbXBsYXRlXCIsXG4gICAgICAgICBcInRleHRhcmVhXCIsIFwidGZvb3RcIiwgXCJ0aFwiLCBcInRoZWFkXCIsIFwidGltZVwiLCBcInRpdGxlXCIsIFwidHJcIiwgXCJ0cmFja1wiLCBcInR0XCIsIFwidVwiLCBcInVsXCIsIFwidmFyXCIsIFwidmlkZW9cIiwgXCJ3YnJcIiwgXCJ4bXBcIlxuICBdO1xuZWxzLmZvckVhY2goIGZ1bmN0aW9uICggZWwgKSB7XG4gIGhbZWxdID0gaC5lbC5iaW5kKCBoLCBlbCApO1xufSApO1xuLy8gYmluZCBkb2N1bWVudCBmcmFnbWVudCB0b29cbmguREYgPSBoLmVsLmJpbmQoIGgsIFwiQERGXCIgKTtcbmguZEYgPSBoLkRGO1xubW9kdWxlLmV4cG9ydHMgPSBoO1xuIiwiLyoqXG4gKlxuICogUHJvdmlkZXMgbWlzY2VsbGFuZW91cyBmdW5jdGlvbnMgdGhhdCBoYWQgbm8gb3RoZXIgY2F0ZWdvcnkuXG4gKlxuICogQG1vZHVsZSBtaXNjLmpzXG4gKiBAYXV0aG9yIEtlcnJpIFNob3R0c1xuICogQHZlcnNpb24gMC40XG4gKiBgYGBcbiAqIENvcHlyaWdodCAoYykgMjAxMyBLZXJyaSBTaG90dHMsIHBob3RvS2FuZHkgU3R1ZGlvcyBMTENcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpc1xuICogc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlXG4gKiB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksXG4gKiBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvXG4gKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZ1xuICogY29uZGl0aW9uczpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXNcbiAqIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCxcbiAqIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVJcbiAqIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkVcbiAqIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlRcbiAqIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKiBgYGBcbiAqL1xuLypnbG9iYWwgbW9kdWxlKi9cblwidXNlIHN0cmljdFwiO1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgcHNldWRvLVVVSUQuIE5vdCBndWFyYW50ZWVkIHRvIGJlIHVuaXF1ZSAoZmFyIGZyb20gaXQsIHByb2JhYmx5KSwgYnV0XG4gICAqIGNsb3NlIGVub3VnaCBmb3IgbW9zdCBwdXJwb3Nlcy4gWW91IHNob3VsZCBoYW5kbGUgY29sbGlzaW9ucyBncmFjZWZ1bGx5IG9uIHlvdXJcbiAgICogb3duLCBvZiBjb3Vyc2UuIHNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS84ODA5NDcyXG4gICAqIEBtZXRob2QgbWFrZUZhdXhVVUlEXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIG1ha2VGYXV4VVVJRDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdmFyIHV1aWQgPSBcInh4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eFwiLnJlcGxhY2UoIC9beHldL2csIGZ1bmN0aW9uICggYyApIHtcbiAgICAgIHZhciByID0gKCBkICsgTWF0aC5yYW5kb20oKSAqIDE2ICkgJSAxNiB8IDA7XG4gICAgICBkID0gTWF0aC5mbG9vciggZCAvIDE2ICk7XG4gICAgICByZXR1cm4gKCBjID09PSBcInhcIiA/IHIgOiAoIHIgJiAweDcgfCAweDggKSApLnRvU3RyaW5nKCAxNiApO1xuICAgIH0gKTtcbiAgICByZXR1cm4gdXVpZDtcbiAgfVxufTtcbiIsIi8qKlxuICpcbiAqICMgQmFzZSBPYmplY3RcbiAqXG4gKiBAbW9kdWxlIG9iamVjdC5qc1xuICogQGF1dGhvciBLZXJyaSBTaG90dHNcbiAqIEB2ZXJzaW9uIDAuNVxuICogYGBgXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgS2VycmkgU2hvdHRzLCBwaG90b0thbmR5IFN0dWRpb3MgTExDXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXNcbiAqIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZVxuICogd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LFxuICogbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzXG4gKiBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsXG4gKiBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSXG4gKiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFXG4gKiBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUXG4gKiBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUlxuICogT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICogYGBgXG4gKi9cbi8qZ2xvYmFsIG1vZHVsZSwgY29uc29sZSwgc2V0VGltZW91dCovXG5cInVzZSBzdHJpY3RcIjtcbnZhciBfY2xhc3NOYW1lID0gXCJCYXNlT2JqZWN0XCIsXG4gIC8qKlxuICAgKiBCYXNlT2JqZWN0IGlzIHRoZSBiYXNlIG9iamVjdCBmb3IgYWxsIGNvbXBsZXggb2JqZWN0cyB1c2VkIGJ5IFlBU01GO1xuICAgKiBzaW1wbGVyIG9iamVjdHMgdGhhdCBhcmUgcHJvcGVydGllcy1vbmx5IGRvIG5vdCBpbmhlcml0IGZyb20gdGhpc1xuICAgKiBjbGFzcy5cbiAgICpcbiAgICogQmFzZU9iamVjdCBwcm92aWRlcyBzaW1wbGUgaW5oZXJpdGFuY2UsIGJ1dCBub3QgYnkgdXNpbmcgdGhlIHR5cGljYWxcbiAgICogcHJvdG90eXBhbCBtZXRob2QuIFJhdGhlciBpbmhlcml0YW5jZSBpcyBmb3JtZWQgYnkgb2JqZWN0IGNvbXBvc2l0aW9uXG4gICAqIHdoZXJlIGFsbCBvYmplY3RzIGFyZSBpbnN0YW5jZXMgb2YgQmFzZU9iamVjdCB3aXRoIG1ldGhvZHMgb3ZlcnJpZGRlblxuICAgKiBpbnN0ZWFkLiBBcyBzdWNoLCB5b3UgY2FuICpub3QqIHVzZSBhbnkgSmF2YXNjcmlwdCB0eXBlIGNoZWNraW5nIHRvXG4gICAqIGRpZmZlcmVudGlhdGUgUEtPYmplY3RzOyB5b3Ugc2hvdWxkIGluc3RlYWQgdXNlIHRoZSBgY2xhc3NgXG4gICAqIHByb3BlcnR5LlxuICAgKlxuICAgKiBCYXNlT2JqZWN0IHByb3ZpZGVzIGluaGVyaXRhbmNlIHRvIG1vcmUgdGhhbiBqdXN0IGEgY29uc3RydWN0b3I6IGFueVxuICAgKiBtZXRob2QgY2FuIGJlIG92ZXJyaWRkZW4sIGJ1dCBpdCBpcyBjcml0aWNhbCB0aGF0IHRoZSBzdXBlci1jaGFpblxuICAgKiBiZSBwcm9wZXJseSBpbml0aWFsaXplZC4gU2VlIHRoZSBgc3VwZXJgIGFuZCBgb3ZlcnJpZGVTdXBlcmBcbiAgICogbWV0aG9kcyBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgICpcbiAgICogQGNsYXNzIEJhc2VPYmplY3RcbiAgICovXG4gIEJhc2VPYmplY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogV2UgbmVlZCBhIHdheSB0byBwcm92aWRlIGluaGVyaXRhbmNlLiBNb3N0IG1ldGhvZHMgb25seSBwcm92aWRlXG4gICAgICogaW5oZXJpdGFuY2UgYWNyb3NzIHRoZSBjb25zdHJ1Y3RvciBjaGFpbiwgbm90IGFjcm9zcyBhbnkgcG9zc2libGVcbiAgICAgKiBtZXRob2QuIEJ1dCBmb3Igb3VyIHB1cnBvc2VzLCB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gcHJvdmlkZSBmb3JcbiAgICAgKiBvdmVycmlkaW5nIGFueSBtZXRob2QgKHN1Y2ggYXMgZHJhd2luZywgdG91Y2ggcmVzcG9uc2VzLCBldGMuKSxcbiAgICAgKiBhbmQgc28gd2UgaW1wbGVtZW50IGluaGVyaXRhbmNlIGluIGEgZGlmZmVyZW50IHdheS5cbiAgICAgKlxuICAgICAqIEZpcnN0LCB0aGUgX2NsYXNzSGllcmFyY2h5LCBhIHByaXZhdGUgcHJvcGVydHksIHByb3ZpZGVzIHRoZVxuICAgICAqIGluaGVyaXRhbmNlIHRyZWUuIEFsbCBvYmplY3RzIGluaGVyaXQgZnJvbSBcIkJhc2VPYmplY3RcIi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHByb3BlcnR5IF9jbGFzc0hpZXJhcmNoeVxuICAgICAqIEB0eXBlIEFycmF5XG4gICAgICogQGRlZmF1bHQgW1wiQmFzZU9iamVjdFwiXVxuICAgICAqL1xuICAgIHNlbGYuX2NsYXNzSGllcmFyY2h5ID0gW19jbGFzc05hbWVdO1xuICAgIC8qKlxuICAgICAqXG4gICAgICogT2JqZWN0cyBhcmUgc3ViY2xhc3NlZCB1c2luZyB0aGlzIG1ldGhvZC4gVGhlIG5ld0NsYXNzIGlzIHRoZVxuICAgICAqIHVuaXF1ZSBjbGFzcyBuYW1lIG9mIHRoZSBvYmplY3QgKGFuZCBzaG91bGQgbWF0Y2ggdGhlIGNsYXNzJ1xuICAgICAqIGFjdHVhbCBuYW1lLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBzdWJjbGFzc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuZXdDbGFzcyAtIHRoZSBuZXcgdW5pcXVlIGNsYXNzIG9mIHRoZSBvYmplY3RcbiAgICAgKi9cbiAgICBzZWxmLnN1YmNsYXNzID0gZnVuY3Rpb24gKCBuZXdDbGFzcyApIHtcbiAgICAgIHNlbGYuX2NsYXNzSGllcmFyY2h5LnB1c2goIG5ld0NsYXNzICk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIGdldENsYXNzIHJldHVybnMgdGhlIGN1cnJlbnQgY2xhc3Mgb2YgdGhlIG9iamVjdC4gVGhlXG4gICAgICogYGNsYXNzYCBwcm9wZXJ0eSBjYW4gYmUgdXNlZCBhcyB3ZWxsLiBOb3RlIHRoYXQgdGhlcmVcbiAgICAgKiBpcyBubyBgc2V0dGVyYCBmb3IgdGhpcyBwcm9wZXJ0eTsgYW4gb2JqZWN0J3MgY2xhc3NcbiAgICAgKiBjYW4gKm5vdCogYmUgY2hhbmdlZC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0Q2xhc3NcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSB0aGUgY2xhc3Mgb2YgdGhlIGluc3RhbmNlXG4gICAgICpcbiAgICAgKi9cbiAgICBzZWxmLmdldENsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNlbGYuX2NsYXNzSGllcmFyY2h5W3NlbGYuX2NsYXNzSGllcmFyY2h5Lmxlbmd0aCAtIDFdO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBUaGUgY2xhc3Mgb2YgdGhlIGluc3RhbmNlLiAqKlJlYWQtb25seSoqXG4gICAgICogQHByb3BlcnR5IGNsYXNzXG4gICAgICogQHR5cGUgU3RyaW5nXG4gICAgICogQHJlYWRPbmx5XG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBcImNsYXNzXCIsIHtcbiAgICAgIGdldDogICAgICAgICAgc2VsZi5nZXRDbGFzcyxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9ICk7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBSZXR1cm5zIHRoZSBzdXBlciBjbGFzcyBmb3IgdGhlIGdpdmVuIGNsYXNzLiBJZiB0aGVcbiAgICAgKiBjbGFzcyBpcyBub3Qgc3VwcGxpZWQsIHRoZSBjbGFzcyBpcyBhc3N1bWVkIHRvIGJlIHRoZVxuICAgICAqIG9iamVjdCdzIG93biBjbGFzcy5cbiAgICAgKlxuICAgICAqIFRoZSBwcm9wZXJ0eSBcInN1cGVyQ2xhc3NcIiB1c2VzIHRoaXMgdG8gcmV0dXJuIHRoZVxuICAgICAqIG9iamVjdCdzIGRpcmVjdCBzdXBlcmNsYXNzLCBidXQgZ2V0U3VwZXJDbGFzc09mQ2xhc3NcbiAgICAgKiBjYW4gYmUgdXNlZCB0byBkZXRlcm1pbmUgc3VwZXJjbGFzc2VzIGhpZ2hlciB1cFxuICAgICAqIHRoZSBoaWVyYXJjaHkuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldFN1cGVyQ2xhc3NPZkNsYXNzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFthQ2xhc3M9Y3VycmVudENsYXNzXSB0aGUgY2xhc3MgZm9yIHdoaWNoIHlvdSB3YW50IHRoZSBzdXBlciBjbGFzcy4gSWYgbm90IHNwZWNpZmllZCxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgaW5zdGFuY2UncyBjbGFzcyBpcyB1c2VkLlxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IHRoZSBzdXBlci1jbGFzcyBvZiB0aGUgc3BlY2lmaWVkIGNsYXNzLlxuICAgICAqL1xuICAgIHNlbGYuZ2V0U3VwZXJDbGFzc09mQ2xhc3MgPSBmdW5jdGlvbiAoIGFDbGFzcyApIHtcbiAgICAgIHZhciB0aGVDbGFzcyA9IGFDbGFzcyB8fCBzZWxmLmNsYXNzO1xuICAgICAgdmFyIGkgPSBzZWxmLl9jbGFzc0hpZXJhcmNoeS5pbmRleE9mKCB0aGVDbGFzcyApO1xuICAgICAgaWYgKCBpID4gLTEgKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9jbGFzc0hpZXJhcmNoeVtpIC0gMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogVGhlIHN1cGVyY2xhc3Mgb2YgdGhlIGluc3RhbmNlLlxuICAgICAqIEBwcm9wZXJ0eSBzdXBlckNsYXNzXG4gICAgICogQHR5cGUgU3RyaW5nXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBcInN1cGVyQ2xhc3NcIiwge1xuICAgICAgZ2V0OiAgICAgICAgICBzZWxmLmdldFN1cGVyQ2xhc3NPZkNsYXNzLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0gKTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIF9zdXBlciBpcyBhbiBvYmplY3QgdGhhdCBzdG9yZXMgb3ZlcnJpZGRlbiBmdW5jdGlvbnMgYnkgY2xhc3MgYW5kIG1ldGhvZFxuICAgICAqIG5hbWUuIFRoaXMgaXMgaG93IHdlIGdldCB0aGUgYWJpbGl0eSB0byBhcmJpdHJhcmlseSBvdmVycmlkZSBhbnkgbWV0aG9kXG4gICAgICogYWxyZWFkeSBwcmVzZW50IGluIHRoZSBzdXBlcmNsYXNzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcHJvcGVydHkgX3N1cGVyXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgc2VsZi5fc3VwZXIgPSB7fTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIE11c3QgYmUgY2FsbGVkIHByaW9yIHRvIGRlZmluaW5nIHRoZSBvdmVycmlkZGVuIGZ1bmN0aW9uIGFzIHRoaXMgbW92ZXNcbiAgICAgKiB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gaW50byB0aGUgX3N1cGVyIG9iamVjdC4gVGhlIGZ1bmN0aW9uTmFtZSBtdXN0XG4gICAgICogbWF0Y2ggdGhlIG5hbWUgb2YgdGhlIG1ldGhvZCBleGFjdGx5LCBzaW5jZSB0aGVyZSBtYXkgYmUgYSBsb25nIHRyZWVcbiAgICAgKiBvZiBjb2RlIHRoYXQgZGVwZW5kcyBvbiBpdC5cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgb3ZlcnJpZGVTdXBlclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVDbGFzcyAgdGhlIGNsYXNzIGZvciB3aGljaCB0aGUgZnVuY3Rpb24gb3ZlcnJpZGUgaXMgZGVzaXJlZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVGdW5jdGlvbk5hbWUgIHRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0byBvdmVycmlkZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHRoZUFjdHVhbEZ1bmN0aW9uICB0aGUgYWN0dWFsIGZ1bmN0aW9uIChvciBwb2ludGVyIHRvIGZ1bmN0aW9uKVxuICAgICAqXG4gICAgICovXG4gICAgc2VsZi5vdmVycmlkZVN1cGVyID0gZnVuY3Rpb24gKCB0aGVDbGFzcywgdGhlRnVuY3Rpb25OYW1lLCB0aGVBY3R1YWxGdW5jdGlvbiApIHtcbiAgICAgIHZhciBzdXBlckNsYXNzID0gc2VsZi5nZXRTdXBlckNsYXNzT2ZDbGFzcyggdGhlQ2xhc3MgKTtcbiAgICAgIGlmICggIXNlbGYuX3N1cGVyW3N1cGVyQ2xhc3NdICkge1xuICAgICAgICBzZWxmLl9zdXBlcltzdXBlckNsYXNzXSA9IHt9O1xuICAgICAgfVxuICAgICAgc2VsZi5fc3VwZXJbc3VwZXJDbGFzc11bdGhlRnVuY3Rpb25OYW1lXSA9IHRoZUFjdHVhbEZ1bmN0aW9uO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBvdmVycmlkZVxuICAgICAqXG4gICAgICogT3ZlcnJpZGVzIGFuIGV4aXN0aW5nIGZ1bmN0aW9uIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBgdGhlTmV3RnVuY3Rpb25gLiBFc3NlbnRpYWxseVxuICAgICAqIGEgY2FsbCB0byBgb3ZlcnJpZGVTdXBlciAoc2VsZi5jbGFzcywgdGhlTmV3RnVuY3Rpb24ubmFtZSwgc2VsZlt0aGVOZXdGdW5jdGlvbi5uYW1lXSlgXG4gICAgICogZm9sbG93ZWQgYnkgdGhlIHJlZGVmaW5pdGlvbiBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGBgYFxuICAgICAqIG9iai5vdmVycmlkZSAoIGZ1bmN0aW9uIGluaXRXaXRoT3B0aW9ucyAoIG9wdGlvbnMgKVxuICAgICAqICAgICAgICAgICAgICAgIHsgLi4uIH0gKTtcbiAgICAgKiBgYGBcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHRoZU5ld0Z1bmN0aW9uIC0gVGhlIGZ1bmN0aW9uIHRvIG92ZXJyaWRlLiBNdXN0IGhhdmUgdGhlIG5hbWUgb2YgdGhlIG92ZXJyaWRpbmcgZnVuY3Rpb24uXG4gICAgICovXG4gICAgc2VsZi5vdmVycmlkZSA9IGZ1bmN0aW9uICggdGhlTmV3RnVuY3Rpb24gKSB7XG4gICAgICB2YXIgdGhlRnVuY3Rpb25OYW1lID0gdGhlTmV3RnVuY3Rpb24ubmFtZSxcbiAgICAgICAgdGhlT2xkRnVuY3Rpb24gPSBzZWxmW3RoZUZ1bmN0aW9uTmFtZV07XG4gICAgICBpZiAoIHRoZUZ1bmN0aW9uTmFtZSAhPT0gXCJcIiApIHtcbiAgICAgICAgc2VsZi5vdmVycmlkZVN1cGVyKCBzZWxmLmNsYXNzLCB0aGVGdW5jdGlvbk5hbWUsIHRoZU9sZEZ1bmN0aW9uICk7XG4gICAgICAgIHNlbGZbdGhlRnVuY3Rpb25OYW1lXSA9IGZ1bmN0aW9uIF9fc3VwZXJfXygpIHtcbiAgICAgICAgICB2YXIgcmV0LFxuICAgICAgICAgICAgb2xkJGNsYXNzID0gc2VsZi4kY2xhc3MsXG4gICAgICAgICAgICBvbGQkc3VwZXJjbGFzcyA9IHNlbGYuJHN1cGVyY2xhc3MsXG4gICAgICAgICAgICBvbGQkc3VwZXIgPSBzZWxmLiRzdXBlcjtcbiAgICAgICAgICBzZWxmLiRjbGFzcyA9IHNlbGYuY2xhc3M7XG4gICAgICAgICAgc2VsZi4kc3VwZXJjbGFzcyA9IHNlbGYuc3VwZXJDbGFzcztcbiAgICAgICAgICBzZWxmLiRzdXBlciA9IGZ1bmN0aW9uICRzdXBlcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGVPbGRGdW5jdGlvbi5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0ID0gdGhlTmV3RnVuY3Rpb24uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoIGVyciApIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICBzZWxmLiRjbGFzcyA9IG9sZCRjbGFzcztcbiAgICAgICAgICAgIHNlbGYuJHN1cGVyY2xhc3MgPSBvbGQkc3VwZXJjbGFzcztcbiAgICAgICAgICAgIHNlbGYuJHN1cGVyID0gb2xkJHN1cGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBDYWxscyBhIHN1cGVyIGZ1bmN0aW9uIHdpdGggYW55IG51bWJlciBvZiBhcmd1bWVudHMuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHN1cGVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZUNsYXNzICB0aGUgY3VycmVudCBjbGFzcyBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0aGVGdW5jdGlvbk5hbWUgdGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbYXJnc10gIEFueSBudW1iZXIgb2YgcGFyYW1ldGVycyB0byBwYXNzIHRvIHRoZSBzdXBlciBtZXRob2RcbiAgICAgKlxuICAgICAqL1xuICAgIHNlbGYuc3VwZXIgPSBmdW5jdGlvbiAoIHRoZUNsYXNzLCB0aGVGdW5jdGlvbk5hbWUsIGFyZ3MgKSB7XG4gICAgICB2YXIgc3VwZXJDbGFzcyA9IHNlbGYuZ2V0U3VwZXJDbGFzc09mQ2xhc3MoIHRoZUNsYXNzICk7XG4gICAgICBpZiAoIHNlbGYuX3N1cGVyW3N1cGVyQ2xhc3NdICkge1xuICAgICAgICBpZiAoIHNlbGYuX3N1cGVyW3N1cGVyQ2xhc3NdW3RoZUZ1bmN0aW9uTmFtZV0gKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX3N1cGVyW3N1cGVyQ2xhc3NdW3RoZUZ1bmN0aW9uTmFtZV0uYXBwbHkoIHNlbGYsIGFyZ3MgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQ2F0ZWdvcnkgc3VwcG9ydDsgZm9yIGFuIG9iamVjdCB0byBnZXQgY2F0ZWdvcnkgc3VwcG9ydCBmb3IgdGhlaXIgY2xhc3MsXG4gICAgICogdGhleSBtdXN0IGNhbGwgdGhpcyBtZXRob2QgcHJpb3IgdG8gYW55IGF1dG8gaW5pdGlhbGl6YXRpb25cbiAgICAgKlxuICAgICAqIEBtZXRob2QgX2NvbnN0cnVjdE9iamVjdENhdGVnb3JpZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHNlbGYuX2NvbnN0cnVjdE9iamVjdENhdGVnb3JpZXMgPSBmdW5jdGlvbiBfY29uc3RydWN0T2JqZWN0Q2F0ZWdvcmllcyggcHJpICkge1xuICAgICAgdmFyIHByaW9yaXR5ID0gQmFzZU9iamVjdC5PTl9DUkVBVEVfQ0FURUdPUlk7XG4gICAgICBpZiAoIHR5cGVvZiBwcmkgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIHByaW9yaXR5ID0gcHJpO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2YgQmFzZU9iamVjdC5fb2JqZWN0Q2F0ZWdvcmllc1twcmlvcml0eV1bc2VsZi5jbGFzc10gIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIEJhc2VPYmplY3QuX29iamVjdENhdGVnb3JpZXNbcHJpb3JpdHldW3NlbGYuY2xhc3NdLmZvckVhY2goIGZ1bmN0aW9uICggY2F0ZWdvcnlDb25zdHJ1Y3RvciApIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2F0ZWdvcnlDb25zdHJ1Y3Rvciggc2VsZiApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoIGUgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggXCJFcnJvciBkdXJpbmcgY2F0ZWdvcnkgY29uc3RydWN0aW9uOiBcIiArIGUubWVzc2FnZSApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSApO1xuICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBpbml0aWFsaXplcyB0aGUgb2JqZWN0XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgKlxuICAgICAqL1xuICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2NvbnN0cnVjdE9iamVjdENhdGVnb3JpZXMoIEJhc2VPYmplY3QuT05fSU5JVF9DQVRFR09SWSApO1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICAvKlxuICAgICAqXG4gICAgICogT2JqZWN0cyBoYXZlIHNvbWUgcHJvcGVydGllcyB0aGF0IHdlIHdhbnQgYWxsIG9iamVjdHMgdG8gaGF2ZS4uLlxuICAgICAqXG4gICAgICovXG4gICAgLyoqXG4gICAgICogU3RvcmVzIHRoZSB2YWx1ZXMgb2YgYWxsIHRoZSB0YWdzIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwcm9wZXJ0eSBfdGFnXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgc2VsZi5fdGFncyA9IHt9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogU3RvcmVzIHRoZSAqbGlzdGVuZXJzKiBmb3IgYWxsIHRoZSB0YWdzIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwcm9wZXJ0eSBfdGFnTGlzdGVuZXJzXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgc2VsZi5fdGFnTGlzdGVuZXJzID0ge307XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgYSBzcGVjaWZpYyB0YWcgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnN0YW5jZS4gSWYgdGhlXG4gICAgICogdGFnIGRvZXMgbm90IGV4aXN0LCBpdCBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQW55IGxpc3RlbmVycyBhdHRhY2hlZCB0byB0aGUgdGFnIHZpYSBgYWRkVGFnTGlzdGVuZXJGb3JLZXlgIHdpbGwgYmVcbiAgICAgKiBub3RpZmllZCBvZiB0aGUgY2hhbmdlLiBMaXN0ZW5lcnMgYXJlIHBhc3NlZCB0aHJlZSBwYXJhbWV0ZXJzOlxuICAgICAqIGBzZWxmYCAodGhlIG9yaWdpbmF0aW5nIGluc3RhbmNlKSxcbiAgICAgKiBgdGhlS2V5YCAodGhlIHRhZyBiZWluZyBjaGFuZ2VkKSxcbiAgICAgKiBhbmQgYHRoZVZhbHVlYCAodGhlIHZhbHVlIG9mIHRoZSB0YWcpOyB0aGUgdGFnIGlzICphbHJlYWR5KiBjaGFuZ2VkXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHNldFRhZ0ZvcktleVxuICAgICAqIEBwYXJhbSB7Kn0gdGhlS2V5ICB0aGUgbmFtZSBvZiB0aGUgdGFnOyBcIl9fZGVmYXVsdFwiIGlzIHNwZWNpYWwgYW5kXG4gICAgICogICAgICAgICAgICAgICAgICAgICByZWZlcnMgdG8gdGhlIGRlZmF1bHQgdGFnIHZpc2libGUgdmlhIHRoZSBgdGFnYFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuXG4gICAgICogQHBhcmFtIHsqfSB0aGVWYWx1ZSAgdGhlIHZhbHVlIHRvIGFzc2lnbiB0byB0aGUgdGFnLlxuICAgICAqXG4gICAgICovXG4gICAgc2VsZi5zZXRUYWdGb3JLZXkgPSBmdW5jdGlvbiAoIHRoZUtleSwgdGhlVmFsdWUgKSB7XG4gICAgICBzZWxmLl90YWdzW3RoZUtleV0gPSB0aGVWYWx1ZTtcbiAgICAgIHZhciBub3RpZnlMaXN0ZW5lciA9IGZ1bmN0aW9uICggdGhlTGlzdGVuZXIsIHRoZUtleSwgdGhlVmFsdWUgKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhlTGlzdGVuZXIoIHNlbGYsIHRoZUtleSwgdGhlVmFsdWUgKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICBpZiAoIHNlbGYuX3RhZ0xpc3RlbmVyc1t0aGVLZXldICkge1xuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBzZWxmLl90YWdMaXN0ZW5lcnNbdGhlS2V5XS5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCBub3RpZnlMaXN0ZW5lciggc2VsZi5fdGFnTGlzdGVuZXJzW3RoZUtleV1baV0sIHRoZUtleSwgdGhlVmFsdWUgKSwgMCApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJldHVybnMgdGhlIHZhbHVlIGZvciBhIGdpdmVuIGtleS4gSWYgdGhlIGtleSBkb2VzIG5vdCBleGlzdCwgdGhlXG4gICAgICogcmVzdWx0IGlzIHVuZGVmaW5lZC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0VGFnRm9yS2V5XG4gICAgICogQHBhcmFtIHsqfSB0aGVLZXkgIHRoZSB0YWc7IFwiX19kZWZhdWx0XCIgaXMgc3BlY2lhbCBhbmQgcmVmZXJzIHRvXG4gICAgICogICAgICAgICAgICAgICAgICAgICB0aGUgZGVmYXVsdCB0YWcgdmlzaWJsZSB2aWEgdGhlIGB0YWdgIHByb3BlcnR5LlxuICAgICAqIEByZXR1cm5zIHsqfSB0aGUgdmFsdWUgb2YgdGhlIGtleVxuICAgICAqXG4gICAgICovXG4gICAgc2VsZi5nZXRUYWdGb3JLZXkgPSBmdW5jdGlvbiAoIHRoZUtleSApIHtcbiAgICAgIHJldHVybiBzZWxmLl90YWdzW3RoZUtleV07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFkZCBhIGxpc3RlbmVyIHRvIGEgc3BlY2lmaWMgdGFnLiBUaGUgbGlzdGVuZXIgd2lsbCByZWNlaXZlIHRocmVlXG4gICAgICogcGFyYW1ldGVycyB3aGVuZXZlciB0aGUgdGFnIGNoYW5nZXMgKHRob3VnaCB0aGV5IGFyZSBvcHRpb25hbCkuIFRoZSB0YWdcbiAgICAgKiBpdHNlbGYgZG9lc24ndCBuZWVkIHRvIGV4aXN0IGluIG9yZGVyIHRvIGFzc2lnbiBhIGxpc3RlbmVyIHRvIGl0LlxuICAgICAqXG4gICAgICogVGhlIGZpcnN0IHBhcmFtZXRlciBpcyB0aGUgb2JqZWN0IGZvciB3aGljaCB0aGUgdGFnIGhhcyBiZWVuIGNoYW5nZWQuXG4gICAgICogVGhlIHNlY29uZCBwYXJhbWV0ZXIgaXMgdGhlIHRhZyBiZWluZyBjaGFuZ2VkLCBhbmQgdGhlIHRoaXJkIHBhcmFtZXRlclxuICAgICAqIGlzIHRoZSB2YWx1ZSBvZiB0aGUgdGFnLiAqKk5vdGU6KiogdGhlIHZhbHVlIGhhcyBhbHJlYWR5IGNoYW5nZWQgYnlcbiAgICAgKiB0aGUgdGltZSB0aGUgbGlzdGVuZXIgaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBhZGRMaXN0ZW5lckZvcktleVxuICAgICAqIEBwYXJhbSB7Kn0gdGhlS2V5IFRoZSB0YWcgZm9yIHdoaWNoIHRvIGFkZCBhIGxpc3RlbmVyOyBgX19kZWZhdWx0YFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgaXMgc3BlY2lhbCBhbmQgcmVmZXJzIHRoZSBkZWZhdWx0IHRhZyB2aXNpYmxlIHZpYVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgdGhlIGB0YWdgIHByb3BlcnR5LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHRoZUxpc3RlbmVyICB0aGUgZnVuY3Rpb24gKG9yIHJlZmVyZW5jZSkgdG8gY2FsbFxuICAgICAqICAgICAgICAgICAgICAgICAgICB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgICAqL1xuICAgIHNlbGYuYWRkVGFnTGlzdGVuZXJGb3JLZXkgPSBmdW5jdGlvbiAoIHRoZUtleSwgdGhlTGlzdGVuZXIgKSB7XG4gICAgICBpZiAoICFzZWxmLl90YWdMaXN0ZW5lcnNbdGhlS2V5XSApIHtcbiAgICAgICAgc2VsZi5fdGFnTGlzdGVuZXJzW3RoZUtleV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIHNlbGYuX3RhZ0xpc3RlbmVyc1t0aGVLZXldLnB1c2goIHRoZUxpc3RlbmVyICk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJlbW92ZXMgYSBsaXN0ZW5lciBmcm9tIGJlaW5nIG5vdGlmaWVkIHdoZW4gYSB0YWcgY2hhbmdlcy5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVtb3ZlVGFnTGlzdGVuZXJGb3JLZXlcbiAgICAgKiBAcGFyYW0geyp9IHRoZUtleSAgdGhlIHRhZyBmcm9tIHdoaWNoIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXI7IGBfX2RlZmF1bHRgXG4gICAgICogICAgICAgICAgICAgICAgICAgICBpcyBzcGVjaWFsIGFuZCByZWZlcnMgdG8gdGhlIGRlZmF1bHQgdGFnIHZpc2libGUgdmlhXG4gICAgICogICAgICAgICAgICAgICAgICAgICB0aGUgYHRhZ2AgcHJvcGVydHkuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gdGhlTGlzdGVuZXIgIHRoZSBmdW5jdGlvbiAob3IgcmVmZXJlbmNlKSB0byByZW1vdmUuXG4gICAgICpcbiAgICAgKi9cbiAgICBzZWxmLnJlbW92ZVRhZ0xpc3RlbmVyRm9yS2V5ID0gZnVuY3Rpb24gKCB0aGVLZXksIHRoZUxpc3RlbmVyICkge1xuICAgICAgaWYgKCAhc2VsZi5fdGFnTGlzdGVuZXJzW3RoZUtleV0gKSB7XG4gICAgICAgIHNlbGYuX3RhZ0xpc3RlbmVyc1t0aGVLZXldID0gW107XG4gICAgICB9XG4gICAgICB2YXIgaSA9IHNlbGYuX3RhZ0xpc3RlbmVyc1t0aGVLZXldLmluZGV4T2YoIHRoZUxpc3RlbmVyICk7XG4gICAgICBpZiAoIGkgPiAtMSApIHtcbiAgICAgICAgc2VsZi5fdGFnTGlzdGVuZXJzW3RoZUtleV0uc3BsaWNlKCBpLCAxICk7XG4gICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIFNldHMgdGhlIHZhbHVlIGZvciB0aGUgc2ltcGxlIHRhZyAoYF9fZGVmYXVsdGApLiBBbnkgbGlzdGVuZXJzIGF0dGFjaGVkXG4gICAgICogdG8gYF9fZGVmYXVsdGAgd2lsbCBiZSBub3RpZmllZC5cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgc2V0VGFnXG4gICAgICogQHBhcmFtIHsqfSB0aGVWYWx1ZSAgdGhlIHZhbHVlIGZvciB0aGUgdGFnXG4gICAgICpcbiAgICAgKi9cbiAgICBzZWxmLnNldFRhZyA9IGZ1bmN0aW9uICggdGhlVmFsdWUgKSB7XG4gICAgICBzZWxmLnNldFRhZ0ZvcktleSggXCJfX2RlZmF1bHRcIiwgdGhlVmFsdWUgKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogUmV0dXJucyB0aGUgdmFsdWUgZm9yIHRoZSBnaXZlbiB0YWcgKGBfX2RlZmF1bHRgKS4gSWYgdGhlIHRhZyBoYXMgbmV2ZXIgYmVlblxuICAgICAqIHNldCwgdGhlIHJlc3VsdCBpcyB1bmRlZmluZWQuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldFRhZ1xuICAgICAqIEByZXR1cm5zIHsqfSB0aGUgdmFsdWUgb2YgdGhlIHRhZy5cbiAgICAgKi9cbiAgICBzZWxmLmdldFRhZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzZWxmLmdldFRhZ0ZvcktleSggXCJfX2RlZmF1bHRcIiApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBUaGUgZGVmYXVsdCB0YWcgZm9yIHRoZSBpbnN0YW5jZS4gQ2hhbmdpbmcgdGhlIHRhZyBpdHNlbGYgKG5vdCBhbnkgc3ViLXByb3BlcnRpZXMgb2YgYW4gb2JqZWN0KVxuICAgICAqIHdpbGwgbm90aWZ5IGFueSBsaXN0ZW5lcnMgYXR0YWNoZWQgdG8gYF9fZGVmYXVsdGAuXG4gICAgICpcbiAgICAgKiBAcHJvcGVydHkgdGFnXG4gICAgICogQHR5cGUgKlxuICAgICAqXG4gICAgICovXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZWxmLCBcInRhZ1wiLCB7XG4gICAgICBnZXQ6ICAgICAgICAgIHNlbGYuZ2V0VGFnLFxuICAgICAgc2V0OiAgICAgICAgICBzZWxmLnNldFRhZyxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0gKTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEFsbCBvYmplY3RzIHN1YmplY3Qgbm90aWZpY2F0aW9ucyBmb3IgZXZlbnRzXG4gICAgICpcbiAgICAgKi9cbiAgICAvKipcbiAgICAgKiBTdXBwb3J0cyBub3RpZmljYXRpb24gbGlzdGVuZXJzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHByb3BlcnR5IF9ub3RpZmljYXRpb25MaXN0ZW5lcnNcbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICBzZWxmLl9ub3RpZmljYXRpb25MaXN0ZW5lcnMgPSB7fTtcbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbGlzdGVuZXIgZm9yIGEgbm90aWZpY2F0aW9uLiBJZiBhIG5vdGlmaWNhdGlvbiBoYXMgbm90IGJlZW5cbiAgICAgKiByZWdpc3RlcmVkICh2aWEgYHJlZ2lzdGVyTm90aWZpY2F0aW9uYCksIGFuIGVycm9yIGlzIGxvZ2dlZCBvbiB0aGUgY29uc29sZVxuICAgICAqIGFuZCB0aGUgZnVuY3Rpb24gcmV0dXJucyB3aXRob3V0IGF0dGFjaGluZyB0aGUgbGlzdGVuZXIuIFRoaXMgbWVhbnMgaWZcbiAgICAgKiB5b3UgYXJlbid0IHdhdGNoaW5nIHRoZSBjb25zb2xlLCB0aGUgZnVuY3Rpb24gZmFpbHMgbmVhcmx5IHNpbGVudGx5LlxuICAgICAqXG4gICAgICogPiBCeSBkZWZhdWx0LCBubyBub3RpZmljYXRpb25zIGFyZSByZWdpc3RlcmVkLlxuICAgICAqXG4gICAgICogSWYgdGhlIGZpcnN0IHBhcmFtZXRlciBpcyBhbiBvYmplY3QsIG11bHRpcGxlIGxpc3RlbmVycyBjYW4gYmUgcmVnaXN0ZXJlZDpcbiAgICAgKiB7IFwidmlld1dpbGxBcHBlYXJcIjogaGFuZGxlciwgXCJ2aWV3RGlkQXBwZWFyXCI6IGhhbmRsZXIyfS5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgYWRkTGlzdGVuZXJGb3JOb3RpZmljYXRpb25cbiAgICAgKiBAYWxpYXMgb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ3wqfSB0aGVOb3RpZmljYXRpb24gIHRoZSBuYW1lIG9mIHRoZSBub3RpZmljYXRpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB0aGVMaXN0ZW5lciAgdGhlIGZ1bmN0aW9uIChvciByZWZlcmVuY2UpIHRvIGJlIGNhbGxlZCB3aGVuIHRoZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RpZmljYXRpb24gaXMgdHJpZ2dlcmVkLlxuICAgICAqIEByZXR1cm5zIHsqfSByZXR1cm5zIHNlbGYgZm9yIGNoYWluaW5nXG4gICAgICovXG4gICAgc2VsZi5hZGRMaXN0ZW5lckZvck5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyRm9yTm90aWZpY2F0aW9uKCB0aGVOb3RpZmljYXRpb24sIHRoZUxpc3RlbmVyLCBhc3luYyApIHtcbiAgICAgIGlmICggdGhlTm90aWZpY2F0aW9uIGluc3RhbmNlb2YgQXJyYXkgKSB7XG4gICAgICAgIHRoZU5vdGlmaWNhdGlvbi5mb3JFYWNoKCBmdW5jdGlvbiAoIG4gKSB7XG4gICAgICAgICAgYWRkTGlzdGVuZXJGb3JOb3RpZmljYXRpb24oIG4sIHRoZUxpc3RlbmVyLCBhc3luYyApO1xuICAgICAgICB9ICk7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuICAgICAgaWYgKCB0eXBlb2YgdGhlTm90aWZpY2F0aW9uID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICBmb3IgKCB2YXIgbiBpbiB0aGVOb3RpZmljYXRpb24gKSB7XG4gICAgICAgICAgaWYgKCB0aGVOb3RpZmljYXRpb24uaGFzT3duUHJvcGVydHkoIG4gKSApIHtcbiAgICAgICAgICAgIGFkZExpc3RlbmVyRm9yTm90aWZpY2F0aW9uKCBuLCB0aGVOb3RpZmljYXRpb25bbl0sIHRoZUxpc3RlbmVyICk7IC8vIGFzeW5jIHdvdWxkIHNoaWZ0IHVwXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuICAgICAgaWYgKCAhc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW3RoZU5vdGlmaWNhdGlvbl0gKSB7XG4gICAgICAgIHNlbGYucmVnaXN0ZXJOb3RpZmljYXRpb24oIHRoZU5vdGlmaWNhdGlvbiwgKCB0eXBlb2YgYXN5bmMgIT09IFwidW5kZWZpbmVkXCIgKSA/IGFzeW5jIDogZmFsc2UgKTtcbiAgICAgIH1cbiAgICAgIHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1t0aGVOb3RpZmljYXRpb25dLnB1c2goIHRoZUxpc3RlbmVyICk7XG4gICAgICBpZiAoIHNlbGYuX3RyYWNlTm90aWZpY2F0aW9ucyApIHtcbiAgICAgICAgY29uc29sZS5sb2coIFwiQWRkaW5nIGxpc3RlbmVyIFwiICsgdGhlTGlzdGVuZXIgKyBcIiBmb3Igbm90aWZpY2F0aW9uIFwiICsgdGhlTm90aWZpY2F0aW9uICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICAgIHNlbGYub24gPSBzZWxmLmFkZExpc3RlbmVyRm9yTm90aWZpY2F0aW9uO1xuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIGxpc3RlbmVyIHZhbGlkIGZvciBvbmUgbm90aWZpY2F0aW9uIG9ubHkuIEltbWVkaWF0ZWx5IGFmdGVyXG4gICAgICogQG1ldGhvZCBvbmNlXG4gICAgICogQHBhcmFtICB7W3R5cGVdfSB0aGVOb3RpZmljYXRpb24gW2Rlc2NyaXB0aW9uXVxuICAgICAqIEBwYXJhbSAge1t0eXBlXX0gdGhlTGlzdGVuZXIgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgKiBAcGFyYW0gIHtbdHlwZV19IGFzeW5jICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIHNlbGYub25jZSA9IGZ1bmN0aW9uIG9uY2UoIHRoZU5vdGlmaWNhdGlvbiwgdGhlTGlzdGVuZXIsIGFzeW5jICkge1xuICAgICAgc2VsZi5hZGRMaXN0ZW5lckZvck5vdGlmaWNhdGlvbiggdGhlTm90aWZpY2F0aW9uLCBmdW5jdGlvbiBvbmNlSGFuZGxlciggc2VuZGVyLCBub3RpY2UsIGFyZ3MgKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlTGlzdGVuZXIuYXBwbHkoIHNlbGYsIFtzZWxmLCB0aGVOb3RpZmljYXRpb24sIGFyZ3NdLmNvbmNhdCggYXJndW1lbnRzICkgKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoIGVyciApIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyggXCJPTkNFIEhhbmRsZXIgaGFkIGFuIGVycm9yXCIsIGVyciApO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYucmVtb3ZlTGlzdGVuZXJGb3JOb3RpZmljYXRpb24oIHRoZU5vdGlmaWNhdGlvbiwgb25jZUhhbmRsZXIgKTtcbiAgICAgIH0sIGFzeW5jICk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSBhIG5vdGlmaWNhdGlvbi4gSWYgYSBub3RpZmljYXRpb24gaGFzIG5vdCBiZWVuXG4gICAgICogcmVnaXN0ZXJlZCAodmlhIGByZWdpc3Rlck5vdGlmaWNhdGlvbmApLCBhbiBlcnJvciBpcyBsb2dnZWQgb24gdGhlIGNvbnNvbGVcbiAgICAgKiBhbmQgdGhlIGZ1bmN0aW9uIHJldHVybnMgd2l0aG91dCBhdHRhY2hpbmcgdGhlIGxpc3RlbmVyLiBUaGlzIG1lYW5zIGlmXG4gICAgICogeW91IGFyZW4ndCB3YXRjaGluZyB0aGUgY29uc29sZSwgdGhlIGZ1bmN0aW9uIGZhaWxzIG5lYXJseSBzaWxlbnRseS5cbiAgICAgKlxuICAgICAqID4gQnkgZGVmYXVsdCwgbm8gbm90aWZpY2F0aW9ucyBhcmUgcmVnaXN0ZXJlZC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVtb3ZlTGlzdGVuZXJGb3JOb3RpZmljYXRpb25cbiAgICAgKiBAYWxpYXMgb2ZmXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZU5vdGlmaWNhdGlvbiAgdGhlIG5vdGlmaWNhdGlvblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHRoZUxpc3RlbmVyICBUaGUgZnVuY3Rpb24gb3IgcmVmZXJlbmNlIHRvIHJlbW92ZVxuICAgICAqL1xuICAgIHNlbGYucmVtb3ZlTGlzdGVuZXJGb3JOb3RpZmljYXRpb24gPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lckZvck5vdGlmaWNhdGlvbiggdGhlTm90aWZpY2F0aW9uLCB0aGVMaXN0ZW5lciApIHtcbiAgICAgIGlmICggdGhlTm90aWZpY2F0aW9uIGluc3RhbmNlb2YgQXJyYXkgKSB7XG4gICAgICAgIHRoZU5vdGlmaWNhdGlvbi5mb3JFYWNoKCBmdW5jdGlvbiAoIG4gKSB7XG4gICAgICAgICAgcmVtb3ZlTGlzdGVuZXJGb3JOb3RpZmljYXRpb24oIG4sIHRoZUxpc3RlbmVyICk7XG4gICAgICAgIH0gKTtcbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG4gICAgICBpZiAoIHR5cGVvZiB0aGVOb3RpZmljYXRpb24gPT09IFwib2JqZWN0XCIgKSB7XG4gICAgICAgIGZvciAoIHZhciBuIGluIHRoZU5vdGlmaWNhdGlvbiApIHtcbiAgICAgICAgICBpZiAoIHRoZU5vdGlmaWNhdGlvbi5oYXNPd25Qcm9wZXJ0eSggbiApICkge1xuICAgICAgICAgICAgc2VsZi5yZW1vdmVMaXN0ZW5lckZvck5vdGlmaWNhdGlvbiggbiwgdGhlTm90aWZpY2F0aW9uW25dICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuICAgICAgaWYgKCAhc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW3RoZU5vdGlmaWNhdGlvbl0gKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCB0aGVOb3RpZmljYXRpb24gKyBcIiBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZC5cIiApO1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cbiAgICAgIHZhciBpID0gc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW3RoZU5vdGlmaWNhdGlvbl0uaW5kZXhPZiggdGhlTGlzdGVuZXIgKTtcbiAgICAgIGlmICggc2VsZi5fdHJhY2VOb3RpZmljYXRpb25zICkge1xuICAgICAgICBjb25zb2xlLmxvZyggXCJSZW1vdmluZyBsaXN0ZW5lciBcIiArIHRoZUxpc3RlbmVyICsgXCIgKGluZGV4OiBcIiArIGkgKyBcIikgZnJvbSAgbm90aWZpY2F0aW9uIFwiICsgdGhlTm90aWZpY2F0aW9uICk7XG4gICAgICB9XG4gICAgICBpZiAoIGkgPiAtMSApIHtcbiAgICAgICAgc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW3RoZU5vdGlmaWNhdGlvbl0uc3BsaWNlKCBpLCAxICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICAgIHNlbGYub2ZmID0gc2VsZi5yZW1vdmVMaXN0ZW5lckZvck5vdGlmaWNhdGlvbjtcbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBub3RpZmljYXRpb24gc28gdGhhdCBsaXN0ZW5lcnMgY2FuIHRoZW4gYmUgYXR0YWNoZWQuIE5vdGlmaWNhdGlvbnNcbiAgICAgKiBzaG91bGQgYmUgcmVnaXN0ZXJlZCBhcyBzb29uIGFzIHBvc3NpYmxlLCBvdGhlcndpc2UgbGlzdGVuZXJzIG1heSBhdHRlbXB0IHRvXG4gICAgICogYXR0YWNoIHRvIGEgbm90aWZpY2F0aW9uIHRoYXQgaXNuJ3QgcmVnaXN0ZXJlZC5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgcmVnaXN0ZXJOb3RpZmljYXRpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlTm90aWZpY2F0aW9uICB0aGUgbmFtZSBvZiB0aGUgbm90aWZpY2F0aW9uLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYXN5bmMgIGlmIHRydWUsIG5vdGlmaWNhdGlvbnMgYXJlIHNlbnQgd3JhcHBlZCBpbiBzZXRUaW1lb3V0XG4gICAgICovXG4gICAgc2VsZi5yZWdpc3Rlck5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uICggdGhlTm90aWZpY2F0aW9uLCBhc3luYyApIHtcbiAgICAgIGlmICggdHlwZW9mIHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1t0aGVOb3RpZmljYXRpb25dID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICBzZWxmLl9ub3RpZmljYXRpb25MaXN0ZW5lcnNbdGhlTm90aWZpY2F0aW9uXSA9IFtdO1xuICAgICAgICBzZWxmLl9ub3RpZmljYXRpb25MaXN0ZW5lcnNbdGhlTm90aWZpY2F0aW9uXS5fdXNlQXN5bmNOb3RpZmljYXRpb25zID0gKCB0eXBlb2YgYXN5bmMgIT09IFwidW5kZWZpbmVkXCIgPyBhc3luYyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUgKTtcbiAgICAgIH1cbiAgICAgIGlmICggc2VsZi5fdHJhY2VOb3RpZmljYXRpb25zICkge1xuICAgICAgICBjb25zb2xlLmxvZyggXCJSZWdpc3RlcmluZyBub3RpZmljYXRpb24gXCIgKyB0aGVOb3RpZmljYXRpb24gKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHNlbGYuX3RyYWNlTm90aWZpY2F0aW9ucyA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gX2RvTm90aWZpY2F0aW9uKCB0aGVOb3RpZmljYXRpb24sIG9wdGlvbnMgKSB7XG4gICAgICB2YXIgYXJncyxcbiAgICAgICAgbGFzdE9ubHkgPSBmYWxzZTtcbiAgICAgIGlmICggdHlwZW9mIG9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgIGFyZ3MgPSAoIHR5cGVvZiBvcHRpb25zLmFyZ3MgIT09IFwidW5kZWZpbmVkXCIgKSA/IG9wdGlvbnMuYXJncyA6IHVuZGVmaW5lZDtcbiAgICAgICAgbGFzdE9ubHkgPSAoIHR5cGVvZiBvcHRpb25zLmxhc3RPbmx5ICE9PSBcInVuZGVmaW5lZFwiICkgPyBvcHRpb25zLmxhc3RPbmx5IDogZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoICFzZWxmLl9ub3RpZmljYXRpb25MaXN0ZW5lcnNbdGhlTm90aWZpY2F0aW9uXSApIHtcbiAgICAgICAgY29uc29sZS5sb2coIHRoZU5vdGlmaWNhdGlvbiArIFwiIGhhcyBub3QgYmVlbiByZWdpc3RlcmVkLlwiICk7XG4gICAgICAgIC8vcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCBzZWxmLl90cmFjZU5vdGlmaWNhdGlvbnMgKSB7XG4gICAgICAgIGlmICggc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW3RoZU5vdGlmaWNhdGlvbl0gKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coIFwiTm90aWZ5aW5nIFwiICsgc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW3RoZU5vdGlmaWNhdGlvbl0ubGVuZ3RoICsgXCIgbGlzdGVuZXJzIGZvciBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgIHRoZU5vdGlmaWNhdGlvbiArIFwiICggXCIgKyBhcmdzICsgXCIgKSBcIiApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCBcIkNhbid0IG5vdGlmeSBhbnkgZXhwbGljaXQgbGlzdGVuZXJzIGZvciBcIiwgdGhlTm90aWZpY2F0aW9uLCBcImJ1dCB3aWxkY2FyZHMgd2lsbCBmaXJlLlwiICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBhc3luYyA9IHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1t0aGVOb3RpZmljYXRpb25dICE9PSB1bmRlZmluZWQgPyBzZWxmLl9ub3RpZmljYXRpb25MaXN0ZW5lcnNbXG4gICAgICAgICAgdGhlTm90aWZpY2F0aW9uXS5fdXNlQXN5bmNOb3RpZmljYXRpb25zIDogdHJ1ZSxcbiAgICAgICAgbm90aWZ5TGlzdGVuZXIgPSBmdW5jdGlvbiAoIHRoZUxpc3RlbmVyLCB0aGVOb3RpZmljYXRpb24sIGFyZ3MgKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHRoZUxpc3RlbmVyLmFwcGx5KCBzZWxmLCBbc2VsZiwgdGhlTm90aWZpY2F0aW9uLCBhcmdzXS5jb25jYXQoIGFyZ3VtZW50cyApICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoIGVyciApIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwiV0FSTklOR1wiLCB0aGVOb3RpZmljYXRpb24sIFwiZXhwZXJpZW5jZWQgYW4gdW5jYXVnaHQgZXJyb3I6XCIsIGVyciApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIGhhbmRsZXJzID0gc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW3RoZU5vdGlmaWNhdGlvbl0gIT09IHVuZGVmaW5lZCA/IHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVyc1tcbiAgICAgICAgICB0aGVOb3RpZmljYXRpb25dLnNsaWNlKCkgOiBbXTsgLy8gY29weSFcbiAgICAgIGlmICggbGFzdE9ubHkgJiYgaGFuZGxlcnMubGVuZ3RoID4gMSApIHtcbiAgICAgICAgaGFuZGxlcnMgPSBbaGFuZGxlcnMucG9wKCldO1xuICAgICAgfVxuICAgICAgLy8gYXR0YWNoICogaGFuZGxlcnNcbiAgICAgIHZhciBoYW5kbGVyLCBwdXNoID0gZmFsc2U7XG4gICAgICBmb3IgKCB2YXIgbGlzdGVuZXIgaW4gc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzICkge1xuICAgICAgICBpZiAoIHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eSggbGlzdGVuZXIgKSApIHtcbiAgICAgICAgICBoYW5kbGVyID0gc2VsZi5fbm90aWZpY2F0aW9uTGlzdGVuZXJzW2xpc3RlbmVyXTtcbiAgICAgICAgICBwdXNoID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCBsaXN0ZW5lci5pbmRleE9mKCBcIipcIiApID4gLTEgKSB7XG4gICAgICAgICAgICAvLyBjYW5kaWRhdGUgbGlzdGVuZXI7IHNlZSBpZiBpdCBtYXRjaGVzXG4gICAgICAgICAgICBpZiAoIGxpc3RlbmVyID09PSBcIipcIiApIHtcbiAgICAgICAgICAgICAgcHVzaCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBsaXN0ZW5lci5zdWJzdHIoIDAsIDEgKSA9PT0gXCIqXCIgJiYgbGlzdGVuZXIuc3Vic3RyKCAxICkgPT09IHRoZU5vdGlmaWNhdGlvbi5zdWJzdHIoIC0xICogKCBsaXN0ZW5lclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmxlbmd0aCAtIDEgKSApICkge1xuICAgICAgICAgICAgICBwdXNoID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxpc3RlbmVyLnN1YnN0ciggLTEsIDEgKSA9PT0gXCIqXCIgJiYgbGlzdGVuZXIuc3Vic3RyKCAwLCBsaXN0ZW5lci5sZW5ndGggLSAxICkgPT09IHRoZU5vdGlmaWNhdGlvbi5zdWJzdHIoXG4gICAgICAgICAgICAgICAgMCwgbGlzdGVuZXIubGVuZ3RoIC0gMSApICkge1xuICAgICAgICAgICAgICBwdXNoID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBzdGFyUG9zID0gbGlzdGVuZXIuaW5kZXhPZiggXCIqXCIgKTtcbiAgICAgICAgICAgICAgaWYgKCBsaXN0ZW5lci5zdWJzdHIoIDAsIHN0YXJQb3MgKSA9PT0gdGhlTm90aWZpY2F0aW9uLnN1YnN0ciggMCwgc3RhclBvcyApICYmIGxpc3RlbmVyLnN1YnN0ciggc3RhclBvcyArIDEgKSA9PT1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZU5vdGlmaWNhdGlvbi5zdWJzdHIoIC0xICogKCBsaXN0ZW5lci5sZW5ndGggLSBzdGFyUG9zIC0gMSApICkgKSB7XG4gICAgICAgICAgICAgICAgcHVzaCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICggcHVzaCApIHtcbiAgICAgICAgICAgICAgaGFuZGxlci5mb3JFYWNoKCBmdW5jdGlvbiAoIGhhbmRsZXIgKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcnMucHVzaCggaGFuZGxlciApO1xuICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKCB2YXIgaSA9IDAsIGwgPSBoYW5kbGVycy5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICAgIGlmICggYXN5bmMgKSB7XG4gICAgICAgICAgc2V0VGltZW91dCggbm90aWZ5TGlzdGVuZXIoIGhhbmRsZXJzW2ldLCB0aGVOb3RpZmljYXRpb24sIGFyZ3MgKSwgMCApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICggbm90aWZ5TGlzdGVuZXIoIGhhbmRsZXJzW2ldLCB0aGVOb3RpZmljYXRpb24sIGFyZ3MgKSApKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOb3RpZmllcyBhbGwgbGlzdGVuZXJzIG9mIGEgcGFydGljdWxhciBub3RpZmljYXRpb24gdGhhdCB0aGUgbm90aWZpY2F0aW9uXG4gICAgICogaGFzIGJlZW4gdHJpZ2dlcmVkLiBJZiB0aGUgbm90aWZpY2F0aW9uIGhhc24ndCBiZWVuIHJlZ2lzdGVyZWQgdmlhXG4gICAgICogYHJlZ2lzdGVyTm90aWZpY2F0aW9uYCwgYW4gZXJyb3IgaXMgbG9nZ2VkIHRvIHRoZSBjb25zb2xlLCBidXQgdGhlIGZ1bmN0aW9uXG4gICAgICogaXRzZWxmIHJldHVybnMgc2lsZW50bHksIHNvIGJlIHN1cmUgdG8gd2F0Y2ggdGhlIGNvbnNvbGUgZm9yIGVycm9ycy5cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgbm90aWZ5XG4gICAgICogQGFsaWFzIGVtaXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGhlTm90aWZpY2F0aW9uICB0aGUgbm90aWZpY2F0aW9uIHRvIHRyaWdnZXJcbiAgICAgKiBAcGFyYW0geyp9IFthcmdzXSAgQXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIGxpc3RlbmVyOyB1c3VhbGx5IGFuIGFycmF5XG4gICAgICovXG4gICAgc2VsZi5ub3RpZnkgPSBmdW5jdGlvbiAoIHRoZU5vdGlmaWNhdGlvbiwgYXJncyApIHtcbiAgICAgIF9kb05vdGlmaWNhdGlvbiggdGhlTm90aWZpY2F0aW9uLCB7XG4gICAgICAgIGFyZ3M6ICAgICBhcmdzLFxuICAgICAgICBsYXN0T25seTogZmFsc2VcbiAgICAgIH0gKTtcbiAgICB9O1xuICAgIHNlbGYuZW1pdCA9IHNlbGYubm90aWZ5O1xuICAgIC8qKlxuICAgICAqXG4gICAgICogTm90aWZpZXMgb25seSB0aGUgbW9zdCByZWNlbnQgbGlzdGVuZXIgb2YgYSBwYXJ0aWN1bGFyIG5vdGlmaWNhdGlvbiB0aGF0XG4gICAgICogdGhlIG5vdGlmaWNhdGlvbiBoYXMgYmVlbiB0cmlnZ2VyZWQuIElmIHRoZSBub3RpZmljYXRpb24gaGFzbid0IGJlZW4gcmVnaXN0ZXJlZFxuICAgICAqIHZpYSBgcmVnaXN0ZXJOb3RpZmljYXRpb25gLCBhbiBlcnJvciBpcyBsb2dnZWQgdG8gdGhlIGNvbnNvbGUsIGJ1dCB0aGUgZnVuY3Rpb25cbiAgICAgKiBpdHNlbGYgcmV0dXJucyBzaWxlbnRseS5cbiAgICAgKlxuICAgICAqIEBtZXRob2Qgbm90aWZ5TW9zdFJlY2VudFxuICAgICAqIEBhbGlhcyBlbWl0VG9MYXN0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRoZU5vdGlmaWNhdGlvbiAgdGhlIHNwZWNpZmljIG5vdGlmaWNhdGlvbiB0byB0cmlnZ2VyXG4gICAgICogQHBhcmFtIHsqfSBbYXJnc10gIEFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBsaXN0ZW5lcjsgdXN1YWxseSBhbiBhcnJheVxuICAgICAqL1xuICAgIHNlbGYubm90aWZ5TW9zdFJlY2VudCA9IGZ1bmN0aW9uICggdGhlTm90aWZpY2F0aW9uLCBhcmdzICkge1xuICAgICAgX2RvTm90aWZpY2F0aW9uKCB0aGVOb3RpZmljYXRpb24sIHtcbiAgICAgICAgYXJnczogICAgIGFyZ3MsXG4gICAgICAgIGxhc3RPbmx5OiB0cnVlXG4gICAgICB9ICk7XG4gICAgfTtcbiAgICBzZWxmLmVtaXRUb0xhc3QgPSBzZWxmLm5vdGlmeU1vc3RSZWNlbnQ7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBEZWZpbmVzIGEgcHJvcGVydHkgb24gdGhlIG9iamVjdC4gRXNzZW50aWFsbHkgc2hvcnRoYW5kIGZvciBgT2JqZWN0LmRlZmluZVByb3BlcnR5YC4gQW5cbiAgICAgKiBpbnRlcm5hbCBgX3Byb3BlcnR5TmFtZWAgdmFyaWFibGUgaXMgZGVjbGFyZWQgd2hpY2ggZ2V0dGVycyBhbmQgc2V0dGVycyBjYW4gYWNjZXNzLlxuICAgICAqXG4gICAgICogVGhlIHByb3BlcnR5IGNhbiBiZSByZWFkLXdyaXRlLCByZWFkLW9ubHksIG9yIHdyaXRlLW9ubHkgZGVwZW5kaW5nIG9uIHRoZSB2YWx1ZXMgaW5cbiAgICAgKiBgcHJvcGVydHlPcHRpb25zLnJlYWRgIGFuZCBgcHJvcGVydHlPcHRpb25zLndyaXRlYC4gVGhlIGRlZmF1bHQgaXMgcmVhZC13cml0ZS5cbiAgICAgKlxuICAgICAqIEdldHRlcnMgYW5kIHNldHRlcnMgY2FuIGJlIHByb3ZpZGVkIGluIG9uZSBvZiB0d28gd2F5czogdGhleSBjYW4gYmUgYXV0b21hdGljYWxseVxuICAgICAqIGRpc2NvdmVyZWQgYnkgZm9sbG93aW5nIGEgc3BlY2lmaWMgbmFtaW5nIHBhdHRlcm4gKGBnZXRQcm9wZXJ0eU5hbWVgKSBpZlxuICAgICAqIGBwcm9wZXJ0eU9wdGlvbnMuc2VsZkRpc2NvdmVyYCBpcyBgdHJ1ZWAgKHRoZSBkZWZhdWx0KS4gVGhleSBjYW4gYWxzbyBiZSBleHBsaWNpdGx5XG4gICAgICogZGVmaW5lZCBieSBzZXR0aW5nIGBwcm9wZXJ0eU9wdGlvbnMuZ2V0YCBhbmQgYHByb3BlcnR5T3B0aW9ucy5zZXRgLlxuICAgICAqXG4gICAgICogQSBwcm9wZXJ0eSBkb2VzIG5vdCBuZWNlc3NhcmlseSBuZWVkIGEgZ2V0dGVyIG9yIHNldHRlciBpbiBvcmRlciB0byBiZSByZWFkYWJsZSBvclxuICAgICAqIHdyaXRhYmxlLiBBIGJhc2ljIHBhdHRlcm4gb2Ygc2V0dGluZyBvciByZXR1cm5pbmcgdGhlIHByaXZhdGUgdmFyaWFibGUgaXMgaW1wbGVtZW50ZWRcbiAgICAgKiBmb3IgYW55IHByb3BlcnR5IHdpdGhvdXQgc3BlY2lmaWMgZ2V0dGVycyBhbmQgc2V0dGVycyBidXQgd2hvIGhhdmUgaW5kaWNhdGUgdGhhdCB0aGVcbiAgICAgKiBwcm9wZXJ0eSBpcyByZWFkYWJsZSBvciB3cml0YWJsZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogYGBgXG4gICAgICogc2VsZi5kZWZpbmVQcm9wZXJ0eSAoIFwic29tZVByb3BlcnR5XCIgKTsgICAgICAgIC8vIHNvbWVQcm9wZXJ0eSwgcmVhZC13cml0ZVxuICAgICAqIHNlbGYuZGVmaW5lUHJvcGVydHkgKCBcImFub3RoZXJQcm9wZXJ0eVwiLCB7IGRlZmF1bHQ6IDIgfSApO1xuICAgICAqIHNlbGYuc2V0V2lkdGggPSBmdW5jdGlvbiAoIG5ld1dpZHRoLCBvbGRXaWR0aCApXG4gICAgICoge1xuICAgICAgICogICAgc2VsZi5fd2lkdGggPSBuZXdXaWR0aDtcbiAgICAgICAqICAgIHNlbGYuZWxlbWVudC5zdHlsZS53aWR0aCA9IG5ld1dpZHRoICsgXCJweFwiO1xuICAgICAgICogfVxuICAgICAqIHNlbGYuZGVmaW5lUHJvcGVydHkgKCBcIndpZHRoXCIgKTsgICAvLyBhdXRvbWF0aWNhbGx5IGRpc2NvdmVycyBzZXRXaWR0aCBhcyB0aGUgc2V0dGVyLlxuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1ldGhvZCBkZWZpbmVQcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eU5hbWUgIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eTsgdXNlIGNhbWVsQ2FzZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0eU9wdGlvbnMgIHRoZSB2YXJpb3VzIG9wdGlvbnMgYXMgZGVzY3JpYmVkIGFib3ZlLlxuICAgICAqL1xuICAgIHNlbGYuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAoIHByb3BlcnR5TmFtZSwgcHJvcGVydHlPcHRpb25zICkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIGRlZmF1bHQ6ICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICByZWFkOiAgICAgICAgICAgIHRydWUsXG4gICAgICAgIHdyaXRlOiAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgZ2V0OiAgICAgICAgICAgICBudWxsLFxuICAgICAgICBzZXQ6ICAgICAgICAgICAgIG51bGwsXG4gICAgICAgIHNlbGZEaXNjb3ZlcjogICAgdHJ1ZSxcbiAgICAgICAgcHJlZml4OiAgICAgICAgICBcIlwiLFxuICAgICAgICBjb25maWd1cmFibGU6ICAgIHRydWUsXG4gICAgICAgIGJhY2tpbmdWYXJpYWJsZTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIC8vIHByaXZhdGUgcHJvcGVydGllcyBhcmUgaGFuZGxlZCBkaWZmZXJlbnRseSAtLSB3ZSB3YW50IHRvIGJlIGFibGUgdG8gc2VhcmNoIGZvclxuICAgICAgLy8gX2dldFByaXZhdGVQcm9wZXJ0eSwgbm90IGdldF9wcml2YXRlUHJvcGVydHlcbiAgICAgIGlmICggcHJvcGVydHlOYW1lLnN1YnN0ciggMCwgMSApID09PSBcIl9cIiApIHtcbiAgICAgICAgb3B0aW9ucy5wcmVmaXggPSBcIl9cIjtcbiAgICAgIH1cbiAgICAgIC8vIGFsbG93IG90aGVyIHBvdGVudGlhbCBwcmVmaXhlc1xuICAgICAgaWYgKCBvcHRpb25zLnByZWZpeCAhPT0gXCJcIiApIHtcbiAgICAgICAgaWYgKCBwcm9wZXJ0eU5hbWUuc3Vic3RyKCAwLCAxICkgPT09IG9wdGlvbnMucHJlZml4ICkge1xuICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHIoIDEgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gbWVyZ2Ugb3VyIGRlZmF1bHQgb3B0aW9ucyB3aXRoIHRoZSB1c2VyIG9wdGlvbnNcbiAgICAgIGZvciAoIHZhciBwcm9wZXJ0eSBpbiBwcm9wZXJ0eU9wdGlvbnMgKSB7XG4gICAgICAgIGlmICggcHJvcGVydHlPcHRpb25zLmhhc093blByb3BlcnR5KCBwcm9wZXJ0eSApICkge1xuICAgICAgICAgIG9wdGlvbnNbcHJvcGVydHldID0gcHJvcGVydHlPcHRpb25zW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQ2FwaXRhbCBDYW1lbCBDYXNlIG91ciBmdW5jdGlvbiBuYW1lc1xuICAgICAgdmFyIGZuTmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHIoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHlOYW1lLnN1YnN0ciggMSApO1xuICAgICAgdmFyIGdldEZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJnZXRcIiArIGZuTmFtZSxcbiAgICAgICAgc2V0Rm5OYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcInNldFwiICsgZm5OYW1lLFxuICAgICAgICBfcHJvcGVydHlOYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcIl9cIiArIHByb3BlcnR5TmFtZSxcbiAgICAgICAgX3lfZ2V0Rm5OYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcIl95X2dldFwiICsgZm5OYW1lLFxuICAgICAgICBfeV9zZXRGbk5hbWUgPSBvcHRpb25zLnByZWZpeCArIFwiX3lfc2V0XCIgKyBmbk5hbWUsXG4gICAgICAgIF95X19nZXRGbk5hbWUgPSBvcHRpb25zLnByZWZpeCArIFwiX3lfX2dldFwiICsgZm5OYW1lLFxuICAgICAgICBfeV9fc2V0Rm5OYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcIl95X19zZXRcIiArIGZuTmFtZTtcbiAgICAgIC8vIGlmIGdldC9zZXQgYXJlIG5vdCBzcGVjaWZpZWQsIHdlJ2xsIGF0dGVtcHQgdG8gc2VsZi1kaXNjb3ZlciB0aGVtXG4gICAgICBpZiAoIG9wdGlvbnMuZ2V0ID09PSBudWxsICYmIG9wdGlvbnMuc2VsZkRpc2NvdmVyICkge1xuICAgICAgICBpZiAoIHR5cGVvZiBzZWxmW2dldEZuTmFtZV0gPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICBvcHRpb25zLmdldCA9IHNlbGZbZ2V0Rm5OYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCBvcHRpb25zLnNldCA9PT0gbnVsbCAmJiBvcHRpb25zLnNlbGZEaXNjb3ZlciApIHtcbiAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZltzZXRGbk5hbWVdID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgICAgICAgb3B0aW9ucy5zZXQgPSBzZWxmW3NldEZuTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGNyZWF0ZSB0aGUgcHJpdmF0ZSB2YXJpYWJsZVxuICAgICAgaWYgKCBvcHRpb25zLmJhY2tpbmdWYXJpYWJsZSApIHtcbiAgICAgICAgc2VsZltfcHJvcGVydHlOYW1lXSA9IG9wdGlvbnMuZGVmYXVsdDtcbiAgICAgIH1cbiAgICAgIGlmICggIW9wdGlvbnMucmVhZCAmJiAhb3B0aW9ucy53cml0ZSApIHtcbiAgICAgICAgcmV0dXJuOyAvLyBub3QgcmVhZC93cml0ZSwgc28gbm90aGluZyBtb3JlLlxuICAgICAgfVxuICAgICAgdmFyIGRlZlByb3BPcHRpb25zID0ge1xuICAgICAgICBjb25maWd1cmFibGU6IG9wdGlvbnMuY29uZmlndXJhYmxlXG4gICAgICB9O1xuICAgICAgaWYgKCBvcHRpb25zLnJlYWQgKSB7XG4gICAgICAgIHNlbGZbX3lfX2dldEZuTmFtZV0gPSBvcHRpb25zLmdldDtcbiAgICAgICAgc2VsZltfeV9nZXRGbk5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgZ2V0dGVyLCB1c2UgaXRcbiAgICAgICAgICBpZiAoIHR5cGVvZiBzZWxmW195X19nZXRGbk5hbWVdID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZltfeV9fZ2V0Rm5OYW1lXSggc2VsZltfcHJvcGVydHlOYW1lXSApO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBvdGhlcndpc2UgcmV0dXJuIHRoZSBwcml2YXRlIHZhcmlhYmxlXG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZltfcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGlmICggdHlwZW9mIHNlbGZbZ2V0Rm5OYW1lXSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICBzZWxmW2dldEZuTmFtZV0gPSBzZWxmW195X2dldEZuTmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgZGVmUHJvcE9wdGlvbnMuZ2V0ID0gc2VsZltfeV9nZXRGbk5hbWVdO1xuICAgICAgfVxuICAgICAgaWYgKCBvcHRpb25zLndyaXRlICkge1xuICAgICAgICBzZWxmW195X19zZXRGbk5hbWVdID0gb3B0aW9ucy5zZXQ7XG4gICAgICAgIHNlbGZbX3lfc2V0Rm5OYW1lXSA9IGZ1bmN0aW9uICggdiApIHtcbiAgICAgICAgICB2YXIgb2xkViA9IHNlbGZbX3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZltfeV9fc2V0Rm5OYW1lXSA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgICAgc2VsZltfeV9fc2V0Rm5OYW1lXSggdiwgb2xkViApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmW19wcm9wZXJ0eU5hbWVdID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCBvbGRWICE9PSB2ICkge1xuICAgICAgICAgICAgc2VsZi5ub3RpZnlEYXRhQmluZGluZ0VsZW1lbnRzRm9yS2V5UGF0aCggcHJvcGVydHlOYW1lICk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZiAoIHR5cGVvZiBzZWxmW3NldEZuTmFtZV0gPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgc2VsZltzZXRGbk5hbWVdID0gc2VsZltfeV9zZXRGbk5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGRlZlByb3BPcHRpb25zLnNldCA9IHNlbGZbX3lfc2V0Rm5OYW1lXTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgcHJvcGVydHlOYW1lLCBkZWZQcm9wT3B0aW9ucyApO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhIGN1c3RvbSBwcm9wZXJ0eSwgd2hpY2ggYWxzbyBpbXBsZW1lbnRzIGEgZm9ybSBvZiBLVk8uXG4gICAgICpcbiAgICAgKiBBbnkgb3B0aW9ucyBub3Qgc3BlY2lmaWVkIGFyZSBkZWZhdWx0ZWQgaW4uIFRoZSBkZWZhdWx0IGlzIGZvciBhIHByb3BlcnR5XG4gICAgICogdG8gYmUgb2JzZXJ2YWJsZSAod2hpY2ggZmlyZXMgdGhlIGRlZmF1bHQgcHJvcGVydHlOYW1lQ2hhbmdlZCBub3RpY2UpLFxuICAgICAqIHJlYWQvd3JpdGUgd2l0aCBubyBjdXN0b20gZ2V0L3NldC92YWxpZGF0ZSByb3V0aW5lcywgYW5kIG5vIGRlZmF1bHQuXG4gICAgICpcbiAgICAgKiBPYnNlcnZhYmxlIFByb3BlcnRpZXMgY2FuIGhhdmUgZ2V0dGVycywgc2V0dGVycywgYW5kIHZhbGlkYXRvcnMuIFRoZXkgY2FuIGJlXG4gICAgICogYXV0b21hdGljYWxseSBkaXNjb3ZlcmVkLCBhc3N1bWluZyB0aGV5IGZvbGxvdyB0aGUgcGF0dGVybiBgZ2V0T2JzZXJ2YWJsZVByb3BlcnR5TmFtZWAsXG4gICAgICogYHNldE9ic2VydmFibGVQcm9wZXJ0eU5hbWVgLCBhbmQgYHZhbGlkYXRlT2JzZXJ2YWJsZVByb3BlcnR5TmFtZWAuIFRoZXkgY2FuIGFsc28gYmVcbiAgICAgKiBzcGVjaWZpZWQgZXhwbGljaXRseSBieSBzZXR0aW5nIGBwcm9wZXJ0eU9wdGlvbnMuZ2V0YCwgYHNldGAsIGFuZCBgdmFsaWRhdGVgLlxuICAgICAqXG4gICAgICogUHJvcGVydGllcyBjYW4gYmUgcmVhZC13cml0ZSwgcmVhZC1vbmx5LCBvciB3cml0ZS1vbmx5LiBUaGlzIGlzIGNvbnRyb2xsZWQgYnlcbiAgICAgKiBgcHJvcGVydHlPcHRpb25zLnJlYWRgIGFuZCBgd3JpdGVgLiBUaGUgZGVmYXVsdCBpcyByZWFkLXdyaXRlLlxuICAgICAqXG4gICAgICogUHJvcGVydGllcyBjYW4gaGF2ZSBhIGRlZmF1bHQgdmFsdWUgcHJvdmlkZWQgYXMgd2VsbCwgc3BlY2lmaWVkIGJ5IHNldHRpbmdcbiAgICAgKiBgcHJvcGVydHlPcHRpb25zLmRlZmF1bHRgLlxuICAgICAqXG4gICAgICogRmluYWxseSwgYSBub3RpZmljYXRpb24gb2YgdGhlIGZvcm0gYHByb3BlcnR5TmFtZUNoYW5nZWRgIGlzIGZpcmVkIGlmXG4gICAgICogdGhlIHZhbHVlIGNoYW5nZXMuIElmIHRoZSB2YWx1ZSBkb2VzICpub3QqIGNoYW5nZSwgdGhlIG5vdGlmaWNhdGlvbiBpcyBub3QgZmlyZWQuXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIG5vdGlmaWNhdGlvbiBpcyBjb250cm9sbGVkIGJ5IHNldHRpbmcgYHByb3BlcnR5T3B0aW9ucy5ub3RpZmljYXRpb25gLlxuICAgICAqIElmIHlvdSBuZWVkIGEgbm90aWZpY2F0aW9uIHRvIGZpcmUgd2hlbiBhIHByb3BlcnR5IGlzIHNpbXBseSBzZXQgKHJlZ2FyZGxlc3Mgb2YgdGhlXG4gICAgICogY2hhbmdlIGluIHZhbHVlKSwgc2V0IGBwcm9wZXJ0eU9wdGlvbnMubm90aWZ5QWx3YXlzYCB0byBgdHJ1ZWAuXG4gICAgICpcbiAgICAgKiBLVk8gZ2V0dGVycywgc2V0dGVycywgYW5kIHZhbGlkYXRvcnMgZm9sbG93IHZlcnkgZGlmZmVyZW50IHBhdHRlcm5zIHRoYW4gbm9ybWFsXG4gICAgICogcHJvcGVydHkgZ2V0dGVycyBhbmQgc2V0dGVycy5cbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIHNlbGYuZ2V0T2JzZXJ2YWJsZVdpZHRoID0gZnVuY3Rpb24gKCByZXR1cm5WYWx1ZSApIHsgcmV0dXJuIHJldHVyblZhbHVlOyB9O1xuICAgICAqIHNlbGYuc2V0T2JzZXJ2YWJsZVdpZHRoID0gZnVuY3Rpb24gKCBuZXdWYWx1ZSwgb2xkVmFsdWUgKSB7IHJldHVybiBuZXdWYWx1ZTsgfTtcbiAgICAgKiBzZWxmLnZhbGlkYXRlT2JzZXJ2YWJsZVdpZHRoID0gZnVuY3Rpb24gKCB0ZXN0VmFsdWUgKSB7IHJldHVybiB0ZXN0VmFsdWUhPT0xMDsgfTtcbiAgICAgKiBzZWxmLmRlZmluZU9ic2VydmFibGVQcm9wZXJ0eSAoIFwid2lkdGhcIiApO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogQG1ldGhvZCBkZWZpbmVPYnNlcnZhYmxlUHJvcGVydHlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHlOYW1lIFRoZSBzcGVjaWZpYyBwcm9wZXJ0eSB0byBkZWZpbmVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydHlPcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGlzIHByb3BlcnR5LlxuICAgICAqXG4gICAgICovXG4gICAgc2VsZi5kZWZpbmVPYnNlcnZhYmxlUHJvcGVydHkgPSBmdW5jdGlvbiAoIHByb3BlcnR5TmFtZSwgcHJvcGVydHlPcHRpb25zICkge1xuICAgICAgLy8gc2V0IHRoZSBkZWZhdWx0IG9wdGlvbnMgYW5kIGNvcHkgdGhlIHNwZWNpZmllZCBvcHRpb25zXG4gICAgICB2YXIgb3JpZ1Byb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZSxcbiAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICBvYnNlcnZhYmxlOiAgIHRydWUsXG4gICAgICAgICAgbm90aWZpY2F0aW9uOiBwcm9wZXJ0eU5hbWUgKyBcIkNoYW5nZWRcIixcbiAgICAgICAgICBkZWZhdWx0OiAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICByZWFkOiAgICAgICAgIHRydWUsXG4gICAgICAgICAgd3JpdGU6ICAgICAgICB0cnVlLFxuICAgICAgICAgIGdldDogICAgICAgICAgbnVsbCxcbiAgICAgICAgICB2YWxpZGF0ZTogICAgIG51bGwsXG4gICAgICAgICAgc2V0OiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHNlbGZEaXNjb3ZlcjogdHJ1ZSxcbiAgICAgICAgICBub3RpZnlBbHdheXM6IGZhbHNlLFxuICAgICAgICAgIHByZWZpeDogICAgICAgXCJcIixcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIC8vIHByaXZhdGUgcHJvcGVydGllcyBhcmUgaGFuZGxlZCBkaWZmZXJlbnRseSAtLSB3ZSB3YW50IHRvIGJlIGFibGUgdG8gc2VhcmNoIGZvclxuICAgICAgLy8gX2dldFByaXZhdGVQcm9wZXJ0eSwgbm90IGdldF9wcml2YXRlUHJvcGVydHlcbiAgICAgIGlmICggcHJvcGVydHlOYW1lLnN1YnN0ciggMCwgMSApID09PSBcIl9cIiApIHtcbiAgICAgICAgb3B0aW9ucy5wcmVmaXggPSBcIl9cIjtcbiAgICAgIH1cbiAgICAgIC8vIGFsbG93IG90aGVyIHBvdGVudGlhbCBwcmVmaXhlc1xuICAgICAgaWYgKCBvcHRpb25zLnByZWZpeCAhPT0gXCJcIiApIHtcbiAgICAgICAgaWYgKCBwcm9wZXJ0eU5hbWUuc3Vic3RyKCAwLCAxICkgPT09IG9wdGlvbnMucHJlZml4ICkge1xuICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHIoIDEgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGZuTmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHIoIDAsIDEgKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHlOYW1lLnN1YnN0ciggMSApO1xuICAgICAgdmFyIGdldE9ic2VydmFibGVGbk5hbWUgPSBvcHRpb25zLnByZWZpeCArIFwiZ2V0T2JzZXJ2YWJsZVwiICsgZm5OYW1lLFxuICAgICAgICBzZXRPYnNlcnZhYmxlRm5OYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcInNldE9ic2VydmFibGVcIiArIGZuTmFtZSxcbiAgICAgICAgdmFsaWRhdGVPYnNlcnZhYmxlRm5OYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcInZhbGlkYXRlT2JzZXJ2YWJsZVwiICsgZm5OYW1lLFxuICAgICAgICBfeV9wcm9wZXJ0eU5hbWUgPSBvcHRpb25zLnByZWZpeCArIFwiX3lfXCIgKyBwcm9wZXJ0eU5hbWUsXG4gICAgICAgIF95X2dldEZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJfeV9nZXRcIiArIGZuTmFtZSxcbiAgICAgICAgX3lfc2V0Rm5OYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcIl95X3NldFwiICsgZm5OYW1lLFxuICAgICAgICBfeV92YWxpZGF0ZUZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJfeV92YWxpZGF0ZVwiICsgZm5OYW1lLFxuICAgICAgICBfeV9fZ2V0Rm5OYW1lID0gb3B0aW9ucy5wcmVmaXggKyBcIl95X19nZXRcIiArIGZuTmFtZSxcbiAgICAgICAgX3lfX3NldEZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJfeV9fc2V0XCIgKyBmbk5hbWUsXG4gICAgICAgIF95X192YWxpZGF0ZUZuTmFtZSA9IG9wdGlvbnMucHJlZml4ICsgXCJfeV9fdmFsaWRhdGVcIiArIGZuTmFtZTtcbiAgICAgIGZvciAoIHZhciBwcm9wZXJ0eSBpbiBwcm9wZXJ0eU9wdGlvbnMgKSB7XG4gICAgICAgIGlmICggcHJvcGVydHlPcHRpb25zLmhhc093blByb3BlcnR5KCBwcm9wZXJ0eSApICkge1xuICAgICAgICAgIG9wdGlvbnNbcHJvcGVydHldID0gcHJvcGVydHlPcHRpb25zW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gaWYgZ2V0L3NldCBhcmUgbm90IHNwZWNpZmllZCwgd2UnbGwgYXR0ZW1wdCB0byBzZWxmLWRpc2NvdmVyIHRoZW1cbiAgICAgIGlmICggb3B0aW9ucy5nZXQgPT09IG51bGwgJiYgb3B0aW9ucy5zZWxmRGlzY292ZXIgKSB7XG4gICAgICAgIGlmICggdHlwZW9mIHNlbGZbZ2V0T2JzZXJ2YWJsZUZuTmFtZV0gPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICBvcHRpb25zLmdldCA9IHNlbGZbZ2V0T2JzZXJ2YWJsZUZuTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICggb3B0aW9ucy5zZXQgPT09IG51bGwgJiYgb3B0aW9ucy5zZWxmRGlzY292ZXIgKSB7XG4gICAgICAgIGlmICggdHlwZW9mIHNlbGZbc2V0T2JzZXJ2YWJsZUZuTmFtZV0gPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICBvcHRpb25zLnNldCA9IHNlbGZbc2V0T2JzZXJ2YWJsZUZuTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICggb3B0aW9ucy52YWxpZGF0ZSA9PT0gbnVsbCAmJiBvcHRpb25zLnNlbGZEaXNjb3ZlciApIHtcbiAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZlt2YWxpZGF0ZU9ic2VydmFibGVGbk5hbWVdID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgICAgICAgb3B0aW9ucy52YWxpZGF0ZSA9IHNlbGZbdmFsaWRhdGVPYnNlcnZhYmxlRm5OYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gaWYgdGhlIHByb3BlcnR5IGlzIG9ic2VydmFibGUsIHJlZ2lzdGVyIGl0cyBub3RpZmljYXRpb25cbiAgICAgIGlmICggb3B0aW9ucy5vYnNlcnZhYmxlICkge1xuICAgICAgICBzZWxmLnJlZ2lzdGVyTm90aWZpY2F0aW9uKCBvcHRpb25zLm5vdGlmaWNhdGlvbiApO1xuICAgICAgfVxuICAgICAgLy8gY3JlYXRlIHRoZSBwcml2YXRlIHZhcmlhYmxlOyBfXyBoZXJlIHRvIGF2b2lkIHNlbGYtZGVmaW5lZCBfXG4gICAgICBzZWxmW195X3Byb3BlcnR5TmFtZV0gPSBvcHRpb25zLmRlZmF1bHQ7XG4gICAgICBpZiAoICFvcHRpb25zLnJlYWQgJiYgIW9wdGlvbnMud3JpdGUgKSB7XG4gICAgICAgIHJldHVybjsgLy8gbm90IHJlYWQvd3JpdGUsIHNvIG5vdGhpbmcgbW9yZS5cbiAgICAgIH1cbiAgICAgIHZhciBkZWZQcm9wT3B0aW9ucyA9IHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9O1xuICAgICAgaWYgKCBvcHRpb25zLnJlYWQgKSB7XG4gICAgICAgIHNlbGZbX3lfX2dldEZuTmFtZV0gPSBvcHRpb25zLmdldDtcbiAgICAgICAgc2VsZltfeV9nZXRGbk5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgZ2V0dGVyLCB1c2UgaXRcbiAgICAgICAgICBpZiAoIHR5cGVvZiBzZWxmW195X19nZXRGbk5hbWVdID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZltfeV9fZ2V0Rm5OYW1lXSggc2VsZltfeV9wcm9wZXJ0eU5hbWVdICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG90aGVyd2lzZSByZXR1cm4gdGhlIHByaXZhdGUgdmFyaWFibGVcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmW195X3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBkZWZQcm9wT3B0aW9ucy5nZXQgPSBzZWxmW195X2dldEZuTmFtZV07XG4gICAgICB9XG4gICAgICBpZiAoIG9wdGlvbnMud3JpdGUgKSB7XG4gICAgICAgIHNlbGZbX3lfX3ZhbGlkYXRlRm5OYW1lXSA9IG9wdGlvbnMudmFsaWRhdGU7XG4gICAgICAgIHNlbGZbX3lfX3NldEZuTmFtZV0gPSBvcHRpb25zLnNldDtcbiAgICAgICAgc2VsZltfeV9zZXRGbk5hbWVdID0gZnVuY3Rpb24gKCB2ICkge1xuICAgICAgICAgIHZhciBvbGRWID0gc2VsZltfeV9wcm9wZXJ0eU5hbWVdLFxuICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgIGlmICggdHlwZW9mIHNlbGZbX3lfX3ZhbGlkYXRlRm5OYW1lXSA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgICAgdmFsaWQgPSBzZWxmW195X192YWxpZGF0ZUZuTmFtZV0oIHYgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCB2YWxpZCApIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHNlbGZbX3lfX3NldEZuTmFtZV0gPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgICAgICAgICAgc2VsZltfeV9wcm9wZXJ0eU5hbWVdID0gc2VsZltfeV9fc2V0Rm5OYW1lXSggdiwgb2xkViApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZltfeV9wcm9wZXJ0eU5hbWVdID0gdjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICggb2xkViAhPT0gdiApIHtcbiAgICAgICAgICAgICAgc2VsZi5ub3RpZnlEYXRhQmluZGluZ0VsZW1lbnRzRm9yS2V5UGF0aCggcHJvcGVydHlOYW1lICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIHYgIT09IG9sZFYgfHwgb3B0aW9ucy5ub3RpZnlBbHdheXMgKSB7XG4gICAgICAgICAgICAgIGlmICggb3B0aW9ucy5vYnNlcnZhYmxlICkge1xuICAgICAgICAgICAgICAgIHNlbGYubm90aWZ5KCBvcHRpb25zLm5vdGlmaWNhdGlvbiwge1xuICAgICAgICAgICAgICAgICAgXCJuZXdcIjogdixcbiAgICAgICAgICAgICAgICAgIFwib2xkXCI6IG9sZFZcbiAgICAgICAgICAgICAgICB9ICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGRlZlByb3BPcHRpb25zLnNldCA9IHNlbGZbX3lfc2V0Rm5OYW1lXTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggc2VsZiwgb3JpZ1Byb3BlcnR5TmFtZSwgZGVmUHJvcE9wdGlvbnMgKTtcbiAgICB9O1xuICAgIC8qXG4gICAgICogZGF0YSBiaW5kaW5nIHN1cHBvcnRcbiAgICAgKi9cbiAgICBzZWxmLl9kYXRhQmluZGluZ3MgPSB7fTtcbiAgICBzZWxmLl9kYXRhQmluZGluZ1R5cGVzID0ge307XG4gICAgLy9zZWxmLl9kYXRhQmluZGluZ0V2ZW50cyA9IFsgXCJpbnB1dFwiLCBcImNoYW5nZVwiLCBcImtleXVwXCIsIFwiYmx1clwiIF07XG4gICAgc2VsZi5fZGF0YUJpbmRpbmdFdmVudHMgPSBbXCJpbnB1dFwiLCBcImNoYW5nZVwiLCBcImJsdXJcIl07XG4gICAgLyoqXG4gICAgICogQ29uZmlndXJlIGEgZGF0YSBiaW5kaW5nIHRvIGFuIEhUTUwgZWxlbWVudCAoZWwpIGZvclxuICAgICAqIGEgcGFydGljdWxhciBwcm9wZXJ0eSAoa2V5UGF0aCkuIFJldHVybnMgc2VsZiBmb3IgY2hhaW5pbmcuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGRhdGFCaW5kT25cbiAgICAgKiBAcGFyYW0gIHtOb2RlfSAgIGVsICAgICAgdGhlIERPTSBlbGVtZW50IHRvIGJpbmQgdG87IG11c3Qgc3VwcG9ydCB0aGUgY2hhbmdlIGV2ZW50LCBhbmQgbXVzdCBoYXZlIGFuIElEXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBrZXlQYXRoIHRoZSBwcm9wZXJ0eSB0byBvYnNlcnZlIChzaGFsbG93IG9ubHk7IGRvZXNuJ3QgZm9sbG93IGRvdHMuKVxuICAgICAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICBzZWxmOyBjaGFpbiBhd2F5IVxuICAgICAqL1xuICAgIHNlbGYuZGF0YUJpbmRPbiA9IGZ1bmN0aW9uIGRhdGFCaW5kT24oIGVsLCBrZXlQYXRoLCBrZXlUeXBlICkge1xuICAgICAgaWYgKCBzZWxmLl9kYXRhQmluZGluZ3Nba2V5UGF0aF0gPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgc2VsZi5fZGF0YUJpbmRpbmdzW2tleVBhdGhdID0gW107XG4gICAgICB9XG4gICAgICBzZWxmLl9kYXRhQmluZGluZ3Nba2V5UGF0aF0ucHVzaCggZWwgKTtcbiAgICAgIHNlbGYuX2RhdGFCaW5kaW5nVHlwZXNba2V5UGF0aF0gPSBrZXlUeXBlO1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCBcImRhdGEteS1rZXlQYXRoXCIsIGtleVBhdGggKTtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSggXCJkYXRhLXkta2V5VHlwZVwiLCAoIGtleVR5cGUgIT09IHVuZGVmaW5lZCA/IGtleVR5cGUgOiBcInN0cmluZ1wiICkgKTtcbiAgICAgIHNlbGYuX2RhdGFCaW5kaW5nRXZlbnRzLmZvckVhY2goIGZ1bmN0aW9uICggZXZ0ICkge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCBldnQsIHNlbGYudXBkYXRlUHJvcGVydHlGb3JLZXlQYXRoLCBmYWxzZSApO1xuICAgICAgfSApO1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUdXJuIG9mZiBkYXRhIGJpbmRpbmcgZm9yIGEgcGFydGljdWxhciBlbGVtZW50IGFuZFxuICAgICAqIGtleXBhdGguXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGRhdGFCaW5kT2ZmXG4gICAgICogQHBhcmFtICB7Tm9kZX0gICBlbCAgICAgIGVsZW1lbnQgdG8gcmVtb3ZlIGRhdGEgYmluZGluZyBmcm9tXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBrZXlQYXRoIGtleXBhdGggdG8gc3RvcCBvYnNlcnZpbmdcbiAgICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICAgICAgc2VsZjsgY2hhaW4gYXdheSFcbiAgICAgKi9cbiAgICBzZWxmLmRhdGFCaW5kT2ZmID0gZnVuY3Rpb24gZGF0YUJpbmRPZmYoIGVsLCBrZXlQYXRoICkge1xuICAgICAgdmFyIGtleVBhdGhFbHMgPSBzZWxmLl9kYXRhQmluZGluZ3Nba2V5UGF0aF0sXG4gICAgICAgIGVsUG9zO1xuICAgICAgaWYgKCBrZXlQYXRoRWxzICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIGVsUG9zID0ga2V5UGF0aEVscy5pbmRleE9mKCBlbCApO1xuICAgICAgICBpZiAoIGVsUG9zID4gLTEgKSB7XG4gICAgICAgICAga2V5UGF0aEVscy5zcGxpY2UoIGVsUG9zLCAxICk7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCBcImRhdGEteS1rZXlQYXRoXCIgKTtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoIFwiZGF0YS15LWtleVR5cGVcIiApO1xuICAgICAgICAgIHNlbGYuX2RhdGFCaW5kaW5nRXZlbnRzLmZvckVhY2goIGZ1bmN0aW9uICggZXZ0ICkge1xuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggZXZ0LCBzZWxmLnVwZGF0ZVByb3BlcnR5Rm9yS2V5UGF0aCApO1xuICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIGRhdGEgYmluZGluZ3MgZm9yIGEgZ2l2ZW4gcHJvcGVydHlcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZGF0YUJpbmRBbGxPZmZGb3JLZXlQYXRoXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBrZXlQYXRoIGtleXBhdGggdG8gc3RvcCBvYnNlcnZpbmdcbiAgICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICAgICAgc2VsZjsgY2hhaW4gYXdheVxuICAgICAqL1xuICAgIHNlbGYuZGF0YUJpbmRBbGxPZmZGb3JLZXlQYXRoID0gZnVuY3Rpb24gZGF0YUJpbmRBbGxPZmZGb3JLZXlQYXRoKCBrZXlQYXRoICkge1xuICAgICAgdmFyIGtleVBhdGhFbHMgPSBzZWxmLl9kYXRhQmluZGluZ3Nba2V5UGF0aF07XG4gICAgICBpZiAoIGtleVBhdGhFbHMgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAga2V5UGF0aEVscy5mb3JFYWNoKCBmdW5jdGlvbiAoIGVsICkge1xuICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSggXCJkYXRhLXkta2V5UGF0aFwiICk7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKCBcImRhdGEteS1rZXlUeXBlXCIgKTtcbiAgICAgICAgICBzZWxmLl9kYXRhQmluZGluZ0V2ZW50cy5mb3JFYWNoKCBmdW5jdGlvbiAoIGV2dCApIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2dCwgc2VsZi51cGRhdGVQcm9wZXJ0eUZvcktleVBhdGggKTtcbiAgICAgICAgICB9ICk7XG4gICAgICAgIH0gKTtcbiAgICAgICAga2V5UGF0aEVscyA9IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIGRhdGEgYmluZGluZ3MgZm9yIHRoaXMgb2JqZWN0XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGRhdGFCaW5kQWxsT2ZmXG4gICAgICogQHJldHVybiB7Kn0gIHNlbGZcbiAgICAgKi9cbiAgICBzZWxmLmRhdGFCaW5kQWxsT2ZmID0gZnVuY3Rpb24gZGF0YUJpbmRBbGxPZmYoKSB7XG4gICAgICBmb3IgKCB2YXIga2V5UGF0aCBpbiBzZWxmLl9kYXRhQmluZGluZ3MgKSB7XG4gICAgICAgIGlmICggc2VsZi5fZGF0YUJpbmRpbmdzLmhhc093blByb3BlcnR5KCBrZXlQYXRoICkgKSB7XG4gICAgICAgICAgc2VsZi5kYXRhQmluZEFsbE9mZkZvcktleVBhdGgoIGtleVBhdGggKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogVXBkYXRlIGEgcHJvcGVydHkgb24gdGhpcyBvYmplY3QgYmFzZWQgb24gdGhlXG4gICAgICoga2V5UGF0aCBhbmQgdmFsdWUuIElmIGNhbGxlZCBhcyBhbiBldmVudCBoYW5kbGVyLCBgdGhpc2AgcmVmZXJzIHRvIHRoZVxuICAgICAqIHRyaWdnZXJpbmcgZWxlbWVudCwgYW5kIGtleVBhdGggaXMgb24gYGRhdGEteS1rZXlQYXRoYCBhdHRyaWJ1dGUuXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHVwZGF0ZVByb3BlcnR5Rm9yS2V5UGF0aFxuICAgICAqIEBwYXJhbSAge1N0cmluZ30ga2V5UGF0aCBwcm9wZXJ0eSB0byBzZXRcbiAgICAgKiBAcGFyYW0gIHsqfSB2YWx1ZSAgICAgICAgdmFsdWUgdG8gc2V0XG4gICAgICovXG4gICAgc2VsZi51cGRhdGVQcm9wZXJ0eUZvcktleVBhdGggPSBmdW5jdGlvbiB1cGRhdGVQcm9wZXJ0eUZvcktleVBhdGgoIGluS2V5UGF0aCwgaW5WYWx1ZSwgaW5LZXlUeXBlICkge1xuICAgICAgdmFyIGtleVR5cGUgPSBpbktleVR5cGUsXG4gICAgICAgIGtleVBhdGggPSBpbktleVBhdGgsXG4gICAgICAgIGRhdGFWYWx1ZSA9IGluVmFsdWUsXG4gICAgICAgIGVsVHlwZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICggdGhpcyAhPT0gc2VsZiAmJiB0aGlzIGluc3RhbmNlb2YgTm9kZSApIHtcbiAgICAgICAgICAvLyB3ZSd2ZSBiZWVuIGNhbGxlZCBmcm9tIGFuIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICBpZiAoIHRoaXMuZ2V0QXR0cmlidXRlKCBcImRhdGEteS1rZXlUeXBlXCIgKSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAga2V5VHlwZSA9IHRoaXMuZ2V0QXR0cmlidXRlKCBcImRhdGEteS1rZXlUeXBlXCIgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAga2V5UGF0aCA9IHRoaXMuZ2V0QXR0cmlidXRlKCBcImRhdGEteS1rZXlQYXRoXCIgKTtcbiAgICAgICAgICBlbFR5cGUgPSB0aGlzLmdldEF0dHJpYnV0ZSggXCJ0eXBlXCIgKTtcbiAgICAgICAgICBkYXRhVmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgIHN3aXRjaCAoIGtleVR5cGUgKSB7XG4gICAgICAgICAgICBjYXNlIFwiaW50ZWdlclwiOlxuICAgICAgICAgICAgICBzZWxmW2tleVBhdGhdID0gKCBkYXRhVmFsdWUgPT09IFwiXCIgKSA/IG51bGwgOiBwYXJzZUludCggZGF0YVZhbHVlLCAxMCApO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJmbG9hdFwiOlxuICAgICAgICAgICAgICBzZWxmW2tleVBhdGhdID0gKCBkYXRhVmFsdWUgPT09IFwiXCIgKSA/IG51bGwgOiBwYXJzZUZsb2F0KCBkYXRhVmFsdWUgKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgICAgICBpZiAoIHRoaXMuY2hlY2tlZCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIHNlbGZba2V5UGF0aF0gPSB0aGlzLmNoZWNrZWQ7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9ICggXCJcIiArIGRhdGFWYWx1ZSApID09PSBcIjFcIiB8fCBkYXRhVmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0cnVlXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XG4gICAgICAgICAgICAgIGlmICggdGhpcy50eXBlID09PSBcInRleHRcIiApIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwidHJ5aW5nIHRvIHB1bGwgZGF0ZSBmcm9tIFwiLCB0aGlzLnZhbHVlICk7XG4gICAgICAgICAgICAgICAgICBzZWxmW2tleVBhdGhdID0gbmV3IERhdGUoIHRoaXMudmFsdWUgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoIGVyciApIHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIm5vcGU7IHNldCB0byBudWxsXCIgKTtcbiAgICAgICAgICAgICAgICAgIHNlbGZba2V5UGF0aF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmW2tleVBhdGhdID0gdGhpcy52YWx1ZUFzRGF0ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHNlbGZba2V5UGF0aF0gPSBkYXRhVmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGtleVR5cGUgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICBrZXlUeXBlID0gc2VsZi5fZGF0YUJpbmRpbmdUeXBlc1trZXlQYXRoXTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKCBrZXlUeXBlICkge1xuICAgICAgICAgIGNhc2UgXCJpbnRlZ2VyXCI6XG4gICAgICAgICAgICBzZWxmW2tleVBhdGhdID0gcGFyc2VJbnQoIGRhdGFWYWx1ZSwgMTAgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJmbG9hdFwiOlxuICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9IHBhcnNlRmxvYXQoIGRhdGFWYWx1ZSApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgIGlmICggZGF0YVZhbHVlID09PSBcIjFcIiB8fCBkYXRhVmFsdWUgPT09IDEgfHwgZGF0YVZhbHVlLnRvTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiIHx8IGRhdGFWYWx1ZSA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmW2tleVBhdGhdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiZGF0ZVwiOlxuICAgICAgICAgICAgc2VsZltrZXlQYXRoXSA9IG5ldyBEYXRlKCBkYXRhVmFsdWUgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzZWxmW2tleVBhdGhdID0gZGF0YVZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjYXRjaCAoIGVyciApIHtcbiAgICAgICAgY29uc29sZS5sb2coIFwiRmFpbGVkIHRvIHVwZGF0ZVwiLCBrZXlQYXRoLCBcIndpdGhcIiwgZGF0YVZhbHVlLCBcImFuZFwiLCBrZXlUeXBlLCBlcnIsIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogbm90aWZ5IGFsbCBlbGVtZW50cyBhdHRhY2hlZCB0byBhXG4gICAgICoga2V5IHBhdGggdGhhdCB0aGUgc291cmNlIHZhbHVlIGhhcyBjaGFuZ2VkLiBDYWxsZWQgYnkgYWxsIHByb3BlcnRpZXMgY3JlYXRlZFxuICAgICAqIHdpdGggZGVmaW5lUHJvcGVydHkgYW5kIGRlZmluZU9ic2VydmFibGVQcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqIEBtZXRob2QgQG5vdGlmeURhdGFCaW5kaW5nRWxlbWVudHNGb3JLZXlQYXRoXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBrZXlQYXRoIGtleXBhdGggb2YgZWxlbWVudHMgdG8gbm90aWZ5XG4gICAgICovXG4gICAgc2VsZi5ub3RpZnlEYXRhQmluZGluZ0VsZW1lbnRzRm9yS2V5UGF0aCA9IGZ1bmN0aW9uIG5vdGlmeURhdGFCaW5kaW5nRWxlbWVudHNGb3JLZXlQYXRoKCBrZXlQYXRoICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIGtleVBhdGhFbHMgPSBzZWxmLl9kYXRhQmluZGluZ3Nba2V5UGF0aF0sXG4gICAgICAgICAga2V5VHlwZSA9IHNlbGYuX2RhdGFCaW5kaW5nVHlwZXNba2V5UGF0aF0sXG4gICAgICAgICAgZWwsIHYsIGVsVHlwZSwgdCwgY3Vyc29yUG9zLCBzZWxlY3Rpb25Qb3M7XG4gICAgICAgIGlmICgga2V5VHlwZSA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIGtleVR5cGUgPSBcInN0cmluZ1wiO1xuICAgICAgICB9XG4gICAgICAgIHYgPSBzZWxmW2tleVBhdGhdO1xuICAgICAgICBpZiAoIHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSBudWxsICkge1xuICAgICAgICAgIHYgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICgga2V5UGF0aEVscyAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIGZvciAoIHZhciBpID0gMCwgbCA9IGtleVBhdGhFbHMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgICAgICAgICAgZWwgPSBrZXlQYXRoRWxzW2ldO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKCB0eXBlb2YgZWwuc2VsZWN0aW9uU3RhcnQgPT09IFwibnVtYmVyXCIgKSB7XG4gICAgICAgICAgICAgICAgY3Vyc29yUG9zID0gZWwuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uUG9zID0gZWwuc2VsZWN0aW9uRW5kO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnNvclBvcyA9IC0xO1xuICAgICAgICAgICAgICAgIHNlbGVjdGlvblBvcyA9IC0xO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoIGVyciApIHtcbiAgICAgICAgICAgICAgY3Vyc29yUG9zID0gLTE7XG4gICAgICAgICAgICAgIHNlbGVjdGlvblBvcyA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxUeXBlID0gZWwuZ2V0QXR0cmlidXRlKCBcInR5cGVcIiApO1xuICAgICAgICAgICAgaWYgKCBlbFR5cGUgPT09IFwiZGF0ZVwiICkge1xuICAgICAgICAgICAgICBpZiAoIGVsLnR5cGUgIT09IGVsVHlwZSApIHtcbiAgICAgICAgICAgICAgICAvLyBwcm9ibGVtOyB3ZSBhbG1vc3QgY2VydGFpbmx5IGhhdmUgYSBmaWVsZCB0aGF0IGRvZXNuJ3QgdW5kZXJzdGFuZCB2YWx1ZUFzRGF0ZVxuICAgICAgICAgICAgICAgIGlmICggdi50b0lTT1N0cmluZyApIHtcbiAgICAgICAgICAgICAgICAgIHQgPSB2LnRvSVNPU3RyaW5nKCkuc3BsaXQoIFwiVFwiIClbMF07XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJ0cnlpbmcgdG8gc2V0IHZhbHVlIHRvICBcIiwgdCApO1xuICAgICAgICAgICAgICAgICAgaWYgKCBlbC52YWx1ZSAhPT0gdCApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwiZG9pbmcgaXQgIFwiLCB0ICk7XG4gICAgICAgICAgICAgICAgICAgIGVsLnZhbHVlID0gdDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCBcInYgaXMgYW4gdW5leHBlY3RlZCB0eXBlOiBcIiArIHR5cGVvZiB2ICsgXCI7IFwiICsgdiApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIGVsLnZhbHVlQXNEYXRlICE9PSB2ICkge1xuICAgICAgICAgICAgICAgICAgZWwudmFsdWVBc0RhdGUgPSB2O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICggZWwudHlwZSA9PT0gXCJjaGVja2JveFwiICkge1xuICAgICAgICAgICAgICBlbC5pbmRldGVybWluYXRlID0gKCB2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gbnVsbCApO1xuICAgICAgICAgICAgICBpZiAoIGVsLmNoZWNrZWQgIT09IHYgKSB7XG4gICAgICAgICAgICAgICAgZWwuY2hlY2tlZCA9IHY7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBlbC52YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgICAgICAgICAgaWYgKCBlbC52YWx1ZSAhPSB2ICkge1xuICAgICAgICAgICAgICAgIGVsLnZhbHVlID0gdjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIGVsLnRleHRDb250ZW50ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgICAgICBpZiAoIGVsLnRleHRDb250ZW50ICE9IHYgKSB7XG4gICAgICAgICAgICAgICAgZWwudGV4dENvbnRlbnQgPSB2O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgZWwuaW5uZXJUZXh0ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgICAgICAgICBpZiAoIGVsLmlubmVyVGV4dCAhPSB2ICkge1xuICAgICAgICAgICAgICAgIGVsLmlubmVyVGV4dCA9IHY7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIkRhdGEgYmluZCBmYWlsdXJlOyBicm93c2VyIGRvZXNuJ3QgdW5kZXJzdGFuZCB2YWx1ZSwgdGV4dENvbnRlbnQsIG9yIGlubmVyVGV4dC5cIiApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCBjdXJzb3JQb3MgPiAtMSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBlbCApIHtcbiAgICAgICAgICAgICAgZWwuc2VsZWN0aW9uU3RhcnQgPSBjdXJzb3JQb3M7XG4gICAgICAgICAgICAgIGVsLnNlbGVjdGlvbkVuZCA9IHNlbGVjdGlvblBvcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNhdGNoICggZXJyICkge1xuICAgICAgICBjb25zb2xlLmxvZyggXCJGYWlsZWQgdG8gdXBkYXRlIGVsZW1lbnRzIGZvciBcIiwga2V5UGF0aCwgZXJyLCBhcmd1bWVudHMgKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEF1dG8gaW5pdGlhbGl6ZXMgdGhlIG9iamVjdCBiYXNlZCBvbiB0aGUgYXJndW1lbnRzIHBhc3NlZCB0byB0aGUgb2JqZWN0IGNvbnN0cnVjdG9yLiBBbnkgb2JqZWN0XG4gICAgICogdGhhdCBkZXNpcmVzIHRvIGJlIGF1dG8taW5pdGlhbGl6YWJsZSBtdXN0IHBlcmZvcm0gdGhlIGZvbGxvd2luZyBwcmlvciB0byByZXR1cm5pbmcgdGhlbXNlbHZlczpcbiAgICAgKlxuICAgICAqIGBgYFxuICAgICAqIHNlbGYuX2F1dG9Jbml0LmFwcGx5IChzZWxmLCBhcmd1bWVudHMpO1xuICAgICAqIGBgYFxuICAgICAqXG4gICAgICogRWFjaCBpbml0IG11c3QgY2FsbCB0aGUgc3VwZXIgb2YgaW5pdCwgYW5kIGVhY2ggaW5pdCBtdXN0IHJldHVybiBzZWxmLlxuICAgICAqXG4gICAgICogSWYgdGhlIGZpcnN0IHBhcmFtZXRlciB0byBfYXV0b0luaXQgKGFuZCB0aHVzIHRvIHRoZSBvYmplY3QgY29uc3RydWN0b3IpIGlzIGFuIG9iamVjdCxcbiAgICAgKiBpbml0V2l0aE9wdGlvbnMgaXMgY2FsbGVkIGlmIGl0IGV4aXN0cy4gT3RoZXJ3aXNlIGluaXQgaXMgY2FsbGVkIHdpdGggYWxsIHRoZSBhcmd1bWVudHMuXG4gICAgICpcbiAgICAgKiBJZiBOTyBhcmd1bWVudHMgYXJlIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IgKGFuZCB0aHVzIHRvIHRoaXMgbWV0aG9kKSwgdGhlbiBub1xuICAgICAqIGF1dG8gaW5pdGlhbGl6YXRpb24gaXMgcGVyZm9ybWVkLiBJZiBvbmUgZGVzaXJlcyBhbiBhdXRvLWluaXQgb24gYW4gb2JqZWN0IHRoYXQgcmVxdWlyZXNcbiAgICAgKiBubyBwYXJhbWV0ZXJzLCBwYXNzIGEgZHVtbXkgcGFyYW1ldGVyIHRvIGVuc3VyZSBpbml0IHdpbGwgYmUgY2FsbGVkXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIF9hdXRvSW5pdFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHNlbGYuX2F1dG9Jbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgIC8vIGNoYW5jZXMgYXJlIHRoaXMgaXMgYW4gaW5pdFdpdGhPcHRpb25zLCBidXQgbWFrZSBzdXJlIHRoZSBpbmNvbWluZyBwYXJhbWV0ZXIgaXMgYW4gb2JqZWN0XG4gICAgICAgICAgaWYgKCB0eXBlb2YgYXJndW1lbnRzWzBdID09PSBcIm9iamVjdFwiICkge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2Ygc2VsZi5pbml0V2l0aE9wdGlvbnMgIT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWxmLmluaXRXaXRoT3B0aW9ucy5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gc2VsZi5pbml0LmFwcGx5KCBzZWxmLCBhcmd1bWVudHMgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuaW5pdC5hcHBseSggc2VsZiwgYXJndW1lbnRzICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzZWxmLmluaXQuYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIFJlYWRpZXMgYW4gb2JqZWN0IHRvIGJlIGRlc3Ryb3llZC4gVGhlIGJhc2Ugb2JqZWN0IG9ubHkgY2xlYXJzIHRoZSBub3RpZmljYXRpb25zIGFuZFxuICAgICAqIHRoZSBhdHRhY2hlZCBsaXN0ZW5lcnMuXG4gICAgICogQG1ldGhvZCBkZXN0cm95XG4gICAgICovXG4gICAgc2VsZi5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gY2xlYXIgZGF0YSBiaW5kaW5nc1xuICAgICAgc2VsZi5kYXRhQmluZEFsbE9mZigpO1xuICAgICAgLy8gY2xlYXIgYW55IGxpc3RlbmVycy5cbiAgICAgIHNlbGYuX25vdGlmaWNhdGlvbkxpc3RlbmVycyA9IHt9O1xuICAgICAgc2VsZi5fdGFnTGlzdGVuZXJzID0ge307XG4gICAgICBzZWxmLl9jb25zdHJ1Y3RPYmplY3RDYXRlZ29yaWVzKCBCYXNlT2JqZWN0Lk9OX0RFU1RST1lfQ0FURUdPUlkgKTtcbiAgICAgIC8vIHJlYWR5IHRvIGJlIGRlc3Ryb3llZFxuICAgIH07XG4gICAgLy8gc2VsZi1jYXRlZ29yaXplXG4gICAgc2VsZi5fY29uc3RydWN0T2JqZWN0Q2F0ZWdvcmllcygpO1xuICAgIC8vIGNhbGwgYXV0byBpbml0XG4gICAgc2VsZi5fYXV0b0luaXQuYXBwbHkoIHNlbGYsIGFyZ3VtZW50cyApO1xuICAgIC8vIGRvbmVcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbi8qKlxuICogUHJvbW90ZXMgYSBub24tQmFzZU9iamVjdCBpbnRvIGEgQmFzZU9iamVjdCBieSBjb3B5aW5nIGFsbCBpdHMgbWV0aG9kcyB0b1xuICogdGhlIG5ldyBvYmplY3QgYW5kIGNvcHlpbmcgYWxsIGl0cyBwcm9wZXJ0aWVzIGFzIG9ic2VydmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAbWV0aG9kIHByb21vdGVcbiAqIEBwYXJhbSAgeyp9IG5vbkJhc2VPYmplY3QgVGhlIG5vbi1CYXNlT2JqZWN0IHRvIHByb21vdGVcbiAqIEByZXR1cm4ge0Jhc2VPYmplY3R9ICAgICAgICAgICAgICAgQmFzZU9iamVjdFxuICovXG5CYXNlT2JqZWN0LnByb21vdGUgPSBmdW5jdGlvbiBwcm9tb3RlKCBub25CYXNlT2JqZWN0ICkge1xuICB2YXIgbmV3QmFzZU9iamVjdCwgdGhlUHJvcDtcbiAgaWYgKCBub25CYXNlT2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgbmV3QmFzZU9iamVjdCA9IG5ldyBCYXNlT2JqZWN0KCk7XG4gICAgZm9yICggdmFyIHByb3AgaW4gbm9uQmFzZU9iamVjdCApIHtcbiAgICAgIGlmICggbm9uQmFzZU9iamVjdC5oYXNPd25Qcm9wZXJ0eSggcHJvcCApICkge1xuICAgICAgICB0aGVQcm9wID0gbm9uQmFzZU9iamVjdFtwcm9wXTtcbiAgICAgICAgaWYgKCB0eXBlb2YgdGhlUHJvcCA9PT0gXCJmdW5jdGlvblwiICkge1xuICAgICAgICAgIG5ld0Jhc2VPYmplY3RbcHJvcF0gPSB0aGVQcm9wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0Jhc2VPYmplY3QuZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnR5KCBwcm9wLCB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0aGVQcm9wXG4gICAgICAgICAgfSApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdCYXNlT2JqZWN0O1xufTtcbi8qKlxuICogT2JqZWN0IGNhdGVnb3JpZXMuIE9mIHRoZSBmb3JtOlxuICpcbiAqIGBgYFxuICogeyBjbGFzc05hbWU6IFsgY29uc3RydWN0b3IxLCBjb25zdHJ1Y3RvcjIsIC4uLiBdLCAuLi4gfVxuICogYGBgXG4gKlxuICogR2xvYmFsIHRvIHRoZSBhcHAgYW5kIGxpYnJhcnkuIEJhc2VPYmplY3QncyBpbml0KCkgbWV0aG9kIHdpbGwgY2FsbCBlYWNoIGNhdGVnb3J5IGluIHRoZSBjbGFzcyBoaWVyYXJjaHkuXG4gKlxuICogQHByb3BlcnR5IF9vYmplY3RDYXRlZ29yaWVzXG4gKiBAdHlwZSB7e319XG4gKiBAcHJpdmF0ZVxuICovXG5CYXNlT2JqZWN0Ll9vYmplY3RDYXRlZ29yaWVzID0gW3t9LCB7fSwge31dO1xuQmFzZU9iamVjdC5PTl9DUkVBVEVfQ0FURUdPUlkgPSAwO1xuQmFzZU9iamVjdC5PTl9JTklUX0NBVEVHT1JZID0gMTtcbkJhc2VPYmplY3QuT05fREVTVFJPWV9DQVRFR09SWSA9IDI7XG4vKipcbiAqIFJlZ2lzdGVyIGEgY2F0ZWdvcnkgY29uc3RydWN0b3IgZm9yIGEgc3BlY2lmaWMgY2xhc3MuIFRoZSBmdW5jdGlvbiBtdXN0IHRha2UgYHNlbGZgIGFzIGEgcGFyYW1ldGVyLCBhbmQgbXVzdFxuICogbm90IGFzc3VtZSB0aGUgcHJlc2VuY2Ugb2YgYW55IG90aGVyIGNhdGVnb3J5XG4gKlxuICogVGhlIG9wdGlvbnMgcGFyYW1ldGVyIHRha2VzIHRoZSBmb3JtOlxuICpcbiAqIGBgYFxuICogeyBjbGFzczogY2xhc3MgbmFtZSB0byByZWdpc3RlciBmb3JcbiAgICogICBtZXRob2Q6IGNvbnN0cnVjdG9yIG1ldGhvZFxuICAgKiAgIHByaW9yaXR5OiBPTl9DUkVBVEVfQ0FURUdPUlkgb3IgT05fSU5JVF9DQVRFR09SWVxuICAgKiB9XG4gKiBgYGBcbiAqXG4gKiBAbWV0aG9kIHJlZ2lzdGVyQ2F0ZWdvcnlDb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuQmFzZU9iamVjdC5yZWdpc3RlckNhdGVnb3J5Q29uc3RydWN0b3IgPSBmdW5jdGlvbiByZWdpc3RlckNhdGVnb3J5Q29uc3RydWN0b3IoIG9wdGlvbnMgKSB7XG4gIGlmICggdHlwZW9mIG9wdGlvbnMgPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCBcInJlZ2lzdGVyQ2F0ZWdvcnlDb25zdHJ1Y3RvciByZXF1aXJlcyBhIGNsYXNzIG5hbWUgYW5kIGEgY29uc3RydWN0b3IgbWV0aG9kLlwiICk7XG4gIH1cbiAgaWYgKCB0eXBlb2Ygb3B0aW9ucy5jbGFzcyAhPT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoIFwicmVnaXN0ZXJDYXRlZ29yeUNvbnN0cnVjdG9yIHJlcXVpcmVzIG9wdGlvbnMuY2xhc3NcIiApO1xuICB9XG4gIGlmICggdHlwZW9mIG9wdGlvbnMubWV0aG9kICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgIHRocm93IG5ldyBFcnJvciggXCJyZWdpc3RlckNhdGVnb3J5Q29uc3RydWN0b3IgcmVxdWlyZXMgb3B0aW9ucy5tZXRob2RcIiApO1xuICB9XG4gIHZhciBjbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzO1xuICB2YXIgbWV0aG9kID0gb3B0aW9ucy5tZXRob2Q7XG4gIHZhciBwcmlvcml0eSA9IEJhc2VPYmplY3QuT05fQ1JFQVRFX0NBVEVHT1JZO1xuICBpZiAoIHR5cGVvZiBvcHRpb25zLnByaW9yaXR5ICE9PSBcInVuZGVmaW5lZFwiICkge1xuICAgIHByaW9yaXR5ID0gb3B0aW9ucy5wcmlvcml0eTtcbiAgfVxuICBpZiAoIHR5cGVvZiBCYXNlT2JqZWN0Ll9vYmplY3RDYXRlZ29yaWVzW3ByaW9yaXR5XVtjbGFzc05hbWVdID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgIEJhc2VPYmplY3QuX29iamVjdENhdGVnb3JpZXNbcHJpb3JpdHldW2NsYXNzTmFtZV0gPSBbXTtcbiAgfVxuICBCYXNlT2JqZWN0Ll9vYmplY3RDYXRlZ29yaWVzW3ByaW9yaXR5XVtjbGFzc05hbWVdLnB1c2goIG1ldGhvZCApO1xufTtcbi8qKlxuICogRXh0ZW5kIChzdWJjbGFzcykgYW4gb2JqZWN0LiBgb2Agc2hvdWxkIGJlIG9mIHRoZSBmb3JtOlxuICpcbiAqIHtcbiAgICogICBjbGFzc05hbWU6IFwiTmV3Q2xhc3NcIixcbiAgICogICBwcm9wZXJ0aWVzOiBbXSxcbiAgICogICBvYnNlcnZhYmxlUHJvcGVydGllczogW10sXG4gICAqICAgbWV0aG9kczogW10sXG4gICAqICAgb3ZlcnJpZGVzOiBbXVxuICAgKiB9XG4gKlxuICogQG1ldGhvZCAgIGV4dGVuZFxuICpcbiAqIEBwYXJhbSAgICB7W3R5cGVdfSAgIGNsYXNzT2JqZWN0ICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICAgIHtbdHlwZV19ICAgbyAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKlxuICogQHJldHVybiAgIHtbdHlwZV19ICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbkJhc2VPYmplY3QuZXh0ZW5kID0gZnVuY3Rpb24gZXh0ZW5kKCBjbGFzc09iamVjdCwgbyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHt9O1xufTtcbkJhc2VPYmplY3QubWV0YSA9IHtcbiAgdmVyc2lvbjogICAgICAgICAgIFwiMDAuMDUuMTAxXCIsXG4gIGNsYXNzOiAgICAgICAgICAgICBfY2xhc3NOYW1lLFxuICBhdXRvSW5pdGlhbGl6YWJsZTogdHJ1ZSxcbiAgY2F0ZWdvcml6YWJsZTogICAgIHRydWVcbn07XG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VPYmplY3Q7XG4iLCIvKipcbiAqXG4gKiAjIHNpbXBsZSByb3V0aW5nXG4gKlxuICogQG1vZHVsZSByb3V0ZXIuanNcbiAqIEBhdXRob3IgS2VycmkgU2hvdHRzXG4gKiBAdmVyc2lvbiAwLjFcbiAqXG4gKiBTaW1wbGUgZXhhbXBsZTpcbiAqIGBgYFxuICogdmFyIHkgPSBmdW5jdGlvbiAodixzLHIsdCx1KSB7IGNvbnNvbGUubG9nKHYscyxyLHQsdSk7IH0sIHJvdXRlciA9IF95LlJvdXRlcjtcbiAqIHJvdXRlci5hZGRVUkwgKCBcIi9cIiwgXCJIb21lXCIgKVxuICogLmFkZFVSTCAoIFwiL3Rhc2tcIiwgXCJUYXNrIExpc3RcIiApXG4gKiAuYWRkVVJMICggXCIvdGFzay86dGFza0lkXCIsIFwiVGFzayBWaWV3XCIgKVxuICogLmFkZEhhbmRsZXIgKCBcIi9cIiwgeSApXG4gKiAuYWRkSGFuZGxlciAoIFwiL3Rhc2tcIiwgeSApXG4gKiAuYWRkSGFuZGxlciAoIFwiL3Rhc2svOnRhc2tJZFwiLCB5IClcbiAqIC5yZXBsYWNlKCBcIi9cIiwgMSlcbiAqIC5saXN0ZW4oKTtcbiAqIGBgYFxuICpcbiAqIGBgYFxuICogQ29weXJpZ2h0IChjKSAyMDE0IEtlcnJpIFNob3R0cywgcGhvdG9LYW5keSBTdHVkaW9zIExMQ1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzXG4gKiBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmVcbiAqIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSxcbiAqIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nXG4gKiBjb25kaXRpb25zOlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllc1xuICogb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELFxuICogSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUlxuICogUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRVxuICogTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVFxuICogT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqIGBgYFxuICovXG4vKmdsb2JhbCBtb2R1bGUsIE5vZGUsIGRvY3VtZW50LCBoaXN0b3J5LCB3aW5kb3csIGNvbnNvbGUqL1xuXCJ1c2Ugc3RyaWN0XCI7XG52YXIgcm91dGVzID0gW107XG4vKipcbiAqIFBhcnNlcyBhIFVSTCBpbnRvIGl0cyBjb25zdGl0dWVudCBwYXJ0cy4gVGhlIHJldHVybiB2YWx1ZVxuICogaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhdGgsIHRoZSBxdWVyeSwgYW5kIHRoZSBoYXNoIGNvbXBvbmVudHMuXG4gKiBFYWNoIG9mIHRob3NlIGlzIGFsc28gc3BsaXQgdXAgaW50byBwYXJ0cyAtLSBwYXRoIGFuZCBoYXNoIHNlcGFyYXRlZFxuICogYnkgc2xhc2hlcywgd2hpbGUgcXVlcnkgaXMgc2VwYXJhdGVkIGJ5IGFtcGVyc2FuZHMuIElmIGhhc2ggaXMgZW1wdHlcbiAqIHRoaXMgcm91dGluZSB0cmVhdGVzIGl0IGFzIGEgXCIjL1wiIHVubGVzZSBgcGFyc2VIYXNoYCBpcyBgZmFsc2VgLlxuICogVGhlIGBiYXNlVVJMYCBpcyBhbHNvIHJlbW92ZWQgZnJvbSB0aGUgcGF0aDsgaWYgbm90IHNwZWNpZmllZCBpdFxuICogZGVmYXVsdHMgdG8gYC9gLlxuICpcbiAqIEBtZXRob2QgcGFyc2VVUkxcbiAqIEBwYXJhbSAge1N0cmluZ30gIHVybCAgICAgICAgdXJsIHRvIHBhcnNlXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICBiYXNlVVJMICAgIG9wdGlvbmFsIGJhc2UgdXJsLCBkZWZhdWx0cyB0byBcIi9cIlxuICogQHBhcmFtICB7Qm9vbGVhbn0gcGFyc2VIYXNoICBvcHRpb25hbCwgaW5kaWNhdGVzIGlmIGhhc2ggc2hvdWxkIGJlIHBhcnNlZCB3aXRoIHNsYXNoZXNcbiAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICAgICAgY29tcG9uZW50IHBpZWNlc1xuICovXG5mdW5jdGlvbiBwYXJzZVVSTCggdXJsLCBiYXNlVVJMLCBwYXJzZUhhc2ggKSB7XG4gIGlmICggYmFzZVVSTCA9PT0gdW5kZWZpbmVkICkge1xuICAgIGJhc2VVUkwgPSBcIi9cIjtcbiAgfVxuICBpZiAoIHBhcnNlSGFzaCA9PT0gdW5kZWZpbmVkICkge1xuICAgIHBhcnNlSGFzaCA9IHRydWU7XG4gIH1cbiAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImFcIiApLFxuICAgIHBhdGhTdHJpbmcsXG4gICAgcXVlcnlTdHJpbmcsXG4gICAgaGFzaFN0cmluZyxcbiAgICBxdWVyeVBhcnRzLCBwYXRoUGFydHMsIGhhc2hQYXJ0cztcbiAgLy8gcGFyc2UgdGhlIHVybFxuICBhLmhyZWYgPSB1cmw7XG4gIHBhdGhTdHJpbmcgPSBkZWNvZGVVUklDb21wb25lbnQoIGEucGF0aG5hbWUgKTtcbiAgcXVlcnlTdHJpbmcgPSBkZWNvZGVVUklDb21wb25lbnQoIGEuc2VhcmNoICk7XG4gIGhhc2hTdHJpbmcgPSBkZWNvZGVVUklDb21wb25lbnQoIGEuaGFzaCApO1xuICBpZiAoIGhhc2hTdHJpbmcgPT09IFwiXCIgJiYgcGFyc2VIYXNoICkge1xuICAgIGhhc2hTdHJpbmcgPSBcIiMvXCI7XG4gIH1cbiAgLy8gcmVtb3ZlIHRoZSBiYXNlIHVybFxuICBpZiAoIHBhdGhTdHJpbmcuc3Vic3RyKCAwLCBiYXNlVVJMLmxlbmd0aCApID09PSBiYXNlVVJMICkge1xuICAgIHBhdGhTdHJpbmcgPSBwYXRoU3RyaW5nLnN1YnN0ciggYmFzZVVSTC5sZW5ndGggKTtcbiAgfVxuICAvLyBkb24ndCBuZWVkIHRoZSA/IG9yICMgb24gdGhlIHF1ZXJ5L2hhc2ggc3RyaW5nXG4gIHF1ZXJ5U3RyaW5nID0gcXVlcnlTdHJpbmcuc3Vic3RyKCAxICk7XG4gIGhhc2hTdHJpbmcgPSBoYXNoU3RyaW5nLnN1YnN0ciggMSApO1xuICAvLyBzcGxpdCB0aGUgcXVlcnkgc3RyaW5nXG4gIHF1ZXJ5UGFydHMgPSBxdWVyeVN0cmluZy5zcGxpdCggXCImXCIgKTtcbiAgLy8gYW5kIHNwbGl0IHRoZSBocmVmXG4gIHBhdGhQYXJ0cyA9IHBhdGhTdHJpbmcuc3BsaXQoIFwiL1wiICk7XG4gIC8vIHNwbGl0IHRoZSBoYXNoLCB0b29cbiAgaWYgKCBwYXJzZUhhc2ggKSB7XG4gICAgaGFzaFBhcnRzID0gaGFzaFN0cmluZy5zcGxpdCggXCIvXCIgKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHBhdGg6ICAgICAgIHBhdGhTdHJpbmcsXG4gICAgcXVlcnk6ICAgICAgcXVlcnlTdHJpbmcsXG4gICAgaGFzaDogICAgICAgaGFzaFN0cmluZyxcbiAgICBxdWVyeVBhcnRzOiBxdWVyeVBhcnRzLFxuICAgIHBhdGhQYXJ0czogIHBhdGhQYXJ0cyxcbiAgICBoYXNoUGFydHM6ICBoYXNoUGFydHNcbiAgfTtcbn1cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiBhIHJvdXRlIG1hdGNoZXMsIGFuZCBpZiBpdCBkb2VzLCBjb3BpZXNcbiAqIGFueSB2YXJpYWJsZXMgb3V0IGludG8gYHZhcnNgLiBUaGUgcm91dGVzIG11c3QgaGF2ZSBiZWVuIHByZXZpb3VzbHlcbiAqIHBhcnNlZCB3aXRoIHBhcnNlVVJMLlxuICpcbiAqIEBtZXRob2Qgcm91dGVNYXRjaGVzXG4gKiBAcGFyYW0gIHt0eXBlfSBjYW5kaWRhdGUgY2FuZGlkYXRlIFVSTFxuICogQHBhcmFtICB7dHlwZX0gdGVtcGxhdGUgIHRlbXBsYXRlIHRvIGNoZWNrICh2YXJpYWJsZXMgb2YgdGhlIGZvcm0gOnNvbWVJZClcbiAqIEBwYXJhbSAge3R5cGV9IHZhcnMgICAgICBieXJlZjogdGhpcyBvYmplY3Qgd2lsbCByZWNlaXZlIGFueSB2YXJpYWJsZXNcbiAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICBpZiBtYXRjaGVzLCB0cnVlLlxuICovXG5mdW5jdGlvbiByb3V0ZU1hdGNoZXMoIGNhbmRpZGF0ZSwgdGVtcGxhdGUsIHZhcnMgKSB7XG4gIC8vIHJvdXRlcyBtdXN0IGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIHBhcnRzXG4gIGlmICggY2FuZGlkYXRlLmhhc2hQYXJ0cy5sZW5ndGggIT09IHRlbXBsYXRlLmhhc2hQYXJ0cy5sZW5ndGggKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBjcCwgdHA7XG4gIGZvciAoIHZhciBpID0gMCwgbCA9IGNhbmRpZGF0ZS5oYXNoUGFydHMubGVuZ3RoOyBpIDwgbDsgaSsrICkge1xuICAgIC8vIGVhY2ggcGFydCBuZWVkcyB0byBtYXRjaCBleGFjdGx5LCBPUiBpdCBuZWVkcyB0byBzdGFydCB3aXRoIGEgXCI6XCIgdG8gZGVub3RlIGEgdmFyaWFibGVcbiAgICBjcCA9IGNhbmRpZGF0ZS5oYXNoUGFydHNbaV07XG4gICAgdHAgPSB0ZW1wbGF0ZS5oYXNoUGFydHNbaV07XG4gICAgaWYgKCB0cC5zdWJzdHIoIDAsIDEgKSA9PT0gXCI6XCIgJiYgdHAubGVuZ3RoID4gMSApIHtcbiAgICAgIC8vIHZhcmlhYmxlXG4gICAgICB2YXJzW3RwLnN1YnN0ciggMSApXSA9IGNwOyAvLyByZXR1cm4gdGhlIHZhcmlhYmxlIHRvIHRoZSBjYWxsZXJcbiAgICB9IGVsc2UgaWYgKCBjcCAhPT0gdHAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxudmFyIFJvdXRlciA9IHtcbiAgVkVSU0lPTjogICAgICAgIFwiMC4xLjEwMFwiLFxuICBiYXNlVVJMOiAgICAgICAgXCIvXCIsIC8vIG5vdCBjdXJyZW50bHkgdXNlZFxuICAvKipcbiAgICogcmVnaXN0ZXJzIGEgVVJMIGFuZCBhbiBhc3NvY2lhdGVkIHRpdGxlXG4gICAqXG4gICAqIEBtZXRob2QgYWRkVVJMXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsICAgdXJsIHRvIHJlZ2lzdGVyXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGl0bGUgYXNzb2NpYXRlZCB0aXRsZSAobm90IHZpc2libGUgYW55d2hlcmUpXG4gICAqIEByZXR1cm4geyp9ICAgICAgICAgICAgc2VsZlxuICAgKi9cbiAgYWRkVVJMOiAgICAgICAgIGZ1bmN0aW9uIGFkZFVSTCggdXJsLCB0aXRsZSApIHtcbiAgICBpZiAoIHJvdXRlc1t1cmxdID09PSB1bmRlZmluZWQgKSB7XG4gICAgICByb3V0ZXNbdXJsXSA9IFtdO1xuICAgIH1cbiAgICByb3V0ZXNbdXJsXS50aXRsZSA9IHRpdGxlO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICAvKipcbiAgICogQWRkcyBhIGhhbmRsZXIgdG8gdGhlIGFzc29jaWF0ZWQgVVJMLiBIYW5kbGVyc1xuICAgKiBzaG91bGQgYmUgb2YgdGhlIGZvcm0gYGZ1bmN0aW9uKCB2YXJzLCBzdGF0ZSwgdXJsLCB0aXRsZSwgcGFyc2VkVVJMIClgXG4gICAqIHdoZXJlIGB2YXJzYCBjb250YWlucyB0aGUgdmFyaWFibGVzIGluIHRoZSBVUkwsIGBzdGF0ZWAgY29udGFpbnMgYW55XG4gICAqIHN0YXRlIHBhc3NlZCB0byBoaXN0b3J5LCBgdXJsYCBpcyB0aGUgbWF0Y2hlZCBVUkwsIGB0aXRsZWAgaXMgdGhlXG4gICAqIHRpdGxlIG9mIHRoZSBVUkwsIGFuZCBgcGFyc2VkVVJMYCBjb250YWlucyB0aGUgYWN0dWFsIFVSTCBjb21wb25lbnRzLlxuICAgKlxuICAgKiBAbWV0aG9kIGFkZEhhbmRsZXJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmwgICAgICAgdXJsIHRvIHJlZ2lzdGVyIHRoZSBoYW5kbGVyIGZvclxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0gaGFuZGxlciBoYW5kbGVyIHRvIGNhbGxcbiAgICogQHJldHVybiB7Kn0gICAgICAgICAgICAgICAgc2VsZlxuICAgKi9cbiAgYWRkSGFuZGxlcjogICAgIGZ1bmN0aW9uIGFkZEhhbmRsZXIoIHVybCwgaGFuZGxlciApIHtcbiAgICByb3V0ZXNbdXJsXS5wdXNoKCBoYW5kbGVyICk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgaGFuZGxlciBmcm9tIHRoZSBzcGVjaWZpZWQgdXJsXG4gICAqXG4gICAqIEBtZXRob2QgcmVtb3ZlSGFuZGxlclxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgdXJsICAgICB1cmxcbiAgICogQHBhcmFtICB7ZnVuY3Rpb259IGhhbmRsZXIgaGFuZGxlciB0byByZW1vdmVcbiAgICogQHJldHVybiB7Kn0gICAgICAgIHNlbGZcbiAgICovXG4gIHJlbW92ZUhhbmRsZXI6ICBmdW5jdGlvbiByZW1vdmVIYW5kbGVyKCB1cmwsIGhhbmRsZXIgKSB7XG4gICAgdmFyIGhhbmRsZXJzID0gcm91dGVzW3VybF0sXG4gICAgICBoYW5kbGVySW5kZXg7XG4gICAgaWYgKCBoYW5kbGVycyAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgaGFuZGxlckluZGV4ID0gaGFuZGxlcnMuaW5kZXhPZiggaGFuZGxlciApO1xuICAgICAgaWYgKCBoYW5kbGVySW5kZXggPiAtMSApIHtcbiAgICAgICAgaGFuZGxlcnMuc3BsaWNlKCBoYW5kbGVySW5kZXgsIDEgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8qKlxuICAgKiBQYXJzZXMgYSBVUkwgaW50byBpdHMgY29uc3RpdHVlbnQgcGFydHMuIFRoZSByZXR1cm4gdmFsdWVcbiAgICogaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHBhdGgsIHRoZSBxdWVyeSwgYW5kIHRoZSBoYXNoIGNvbXBvbmVudHMuXG4gICAqIEVhY2ggb2YgdGhvc2UgaXMgYWxzbyBzcGxpdCB1cCBpbnRvIHBhcnRzIC0tIHBhdGggYW5kIGhhc2ggc2VwYXJhdGVkXG4gICAqIGJ5IHNsYXNoZXMsIHdoaWxlIHF1ZXJ5IGlzIHNlcGFyYXRlZCBieSBhbXBlcnNhbmRzLiBJZiBoYXNoIGlzIGVtcHR5XG4gICAqIHRoaXMgcm91dGluZSB0cmVhdGVzIGl0IGFzIGEgXCIjL1wiIHVubGVzZSBgcGFyc2VIYXNoYCBpcyBgZmFsc2VgLlxuICAgKiBUaGUgYGJhc2VVUkxgIGlzIGFsc28gcmVtb3ZlZCBmcm9tIHRoZSBwYXRoOyBpZiBub3Qgc3BlY2lmaWVkIGl0XG4gICAqIGRlZmF1bHRzIHRvIGAvYC5cbiAgICpcbiAgICogQG1ldGhvZCBwYXJzZVVSTFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICB1cmwgICAgICAgIHVybCB0byBwYXJzZVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBiYXNlVVJMICAgIG9wdGlvbmFsIGJhc2UgdXJsLCBkZWZhdWx0cyB0byBcIi9cIlxuICAgKiBAcGFyYW0gIHtCb29sZWFufSBwYXJzZUhhc2ggIG9wdGlvbmFsLCBpbmRpY2F0ZXMgaWYgaGFzaCBzaG91bGQgYmUgcGFyc2VkIHdpdGggc2xhc2hlc1xuICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICAgICAgICAgIGNvbXBvbmVudCBwaWVjZXNcbiAgICovXG4gIHBhcnNlVVJMOiAgICAgICBwYXJzZVVSTCxcbiAgLyoqXG4gICAqIEdpdmVuIGEgdXJsIGFuZCBzdGF0ZSwgcHJvY2VzcyB0aGUgdXJsIGhhbmRsZXJzIHRoYXRcbiAgICogYXJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gdXJsLiBEb2VzIG5vdCBhZmZlY3QgaGlzdG9yeSBpbiBhbnkgd2F5LFxuICAgKiBzbyBjYW4gYmUgdXNlZCB0byBjYWxsIGhhbmRsZXIgd2l0aG91dCBhY3R1YWxseSBuYXZpZ2F0aW5nIChtb3N0IHVzZWZ1bFxuICAgKiBkdXJpbmcgdGVzdGluZykuXG4gICAqXG4gICAqIEBtZXRob2QgcHJvY2Vzc1JvdXRlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsICAgdXJsIHRvIHByb2Nlc3NcbiAgICogQHBhcmFtICB7Kn0gc3RhdGUgICAgICBzdGF0ZSB0byBwYXNzIChjYW4gYmUgYW55dGhpbmcgb3Igbm90aGluZylcbiAgICovXG4gIHByb2Nlc3NSb3V0ZTogICBmdW5jdGlvbiBwcm9jZXNzUm91dGUoIHVybCwgc3RhdGUgKSB7XG4gICAgaWYgKCB1cmwgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIH1cbiAgICB2YXIgcGFyc2VkVVJMID0gcGFyc2VVUkwoIHVybCApLFxuICAgICAgdGVtcGxhdGVVUkwsIGhhbmRsZXJzLCB2YXJzLCB0aXRsZTtcbiAgICBmb3IgKCB1cmwgaW4gcm91dGVzICkge1xuICAgICAgaWYgKCByb3V0ZXMuaGFzT3duUHJvcGVydHkoIHVybCApICkge1xuICAgICAgICB0ZW1wbGF0ZVVSTCA9IHBhcnNlVVJMKCBcIiNcIiArIHVybCApO1xuICAgICAgICBoYW5kbGVycyA9IHJvdXRlc1t1cmxdO1xuICAgICAgICB0aXRsZSA9IGhhbmRsZXJzLnRpdGxlO1xuICAgICAgICB2YXJzID0ge307XG4gICAgICAgIGlmICggcm91dGVNYXRjaGVzKCBwYXJzZWRVUkwsIHRlbXBsYXRlVVJMLCB2YXJzICkgKSB7XG4gICAgICAgICAgaGFuZGxlcnMuZm9yRWFjaCggZnVuY3Rpb24gKCBoYW5kbGVyICkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaGFuZGxlciggdmFycywgc3RhdGUsIHVybCwgdGl0bGUsIHBhcnNlZFVSTCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKCBlcnIgKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIldBUk5JTkchIEZhaWxlZCB0byBwcm9jZXNzIGEgcm91dGUgZm9yXCIsIHVybCApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIHByaXZhdGUgcm91dGUgbGlzdGVuZXI7IGNhbGxzIGBwcm9jZXNzUm91dGVgIHdpdGhcbiAgICogdGhlIGV2ZW50IHN0YXRlIHJldHJpZXZlZCB3aGVuIHRoZSBoaXN0b3J5IGlzIHBvcHBlZC5cbiAgICogQG1ldGhvZCBfcm91dGVMaXN0ZW5lclxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JvdXRlTGlzdGVuZXI6IGZ1bmN0aW9uIF9yb3V0ZUxpc3RlbmVyKCBlICkge1xuICAgIFJvdXRlci5wcm9jZXNzUm91dGUoIHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBlLnN0YXRlICk7XG4gIH0sXG4gIC8qKlxuICAgKiBDaGVjayB0aGUgY3VycmVudCBVUkwgYW5kIGNhbGwgYW55IGFzc29jaWF0ZWQgaGFuZGxlcnNcbiAgICpcbiAgICogQG1ldGhvZCBjaGVja1xuICAgKiBAcmV0dXJuIHsqfSBzZWxmXG4gICAqL1xuICBjaGVjazogICAgICAgICAgZnVuY3Rpb24gY2hlY2soKSB7XG4gICAgdGhpcy5wcm9jZXNzUm91dGUoIHdpbmRvdy5sb2NhdGlvbi5ocmVmICk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhlIHJvdXRlciBpcyBsaXN0ZW5pbmcgdG8gaGlzdG9yeSBjaGFuZ2VzLlxuICAgKiBAcHJvcGVydHkgbGlzdGVuaW5nXG4gICAqIEB0eXBlIGJvb2xlYW5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGxpc3RlbmluZzogICAgICBmYWxzZSxcbiAgLyoqXG4gICAqIFN0YXJ0IGxpc3RlbmluZyBmb3IgaGlzdG9yeSBjaGFuZ2VzXG4gICAqIEBtZXRob2QgbGlzdGVuXG4gICAqL1xuICBsaXN0ZW46ICAgICAgICAgZnVuY3Rpb24gbGlzdGVuKCkge1xuICAgIGlmICggdGhpcy5saXN0ZW5pbmcgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubGlzdGVuaW5nID0gdHJ1ZTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggXCJwb3BzdGF0ZVwiLCB0aGlzLl9yb3V0ZUxpc3RlbmVyLCBmYWxzZSApO1xuICB9LFxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgZm9yIGhpc3RvcnkgY2hhbmdlc1xuICAgKlxuICAgKiBAbWV0aG9kIHN0b3BMaXN0ZW5pbmdcbiAgICogQHJldHVybiB7dHlwZX0gIGRlc2NyaXB0aW9uXG4gICAqL1xuICBzdG9wTGlzdGVuaW5nOiAgZnVuY3Rpb24gc3RvcExpc3RlbmluZygpIHtcbiAgICBpZiAoICF0aGlzLmxpc3RlbmluZyApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoIFwicG9wc3RhdGVcIiwgdGhpcy5fcm91dGVMaXN0ZW5lciApO1xuICB9LFxuICAvKipcbiAgICogTmF2aWdhdGUgdG8gYSB1cmwgd2l0aCBhIGdpdmVuIHN0YXRlLCBjYWxsaW5nIGhhbmRsZXJzXG4gICAqXG4gICAqIEBtZXRob2QgZ29cbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmwgICB1cmxcbiAgICogQHBhcmFtICB7Kn0gc3RhdGUgICAgICBzdGF0ZSB0byBzdG9yZSBmb3IgdGhpcyBVUkwsIGNhbiBiZSBhbnl0aGluZ1xuICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICAgIHNlbGZcbiAgICovXG4gIGdvOiAgICAgICAgICAgICBmdW5jdGlvbiBnbyggdXJsLCBzdGF0ZSApIHtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSggc3RhdGUsIG51bGwsIFwiI1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KCB1cmwgKSApO1xuICAgIHJldHVybiB0aGlzLmNoZWNrKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZSB0byB1cmwgd2l0aCBhIGdpdmVuIHN0YXRlLCByZXBsYWNpbmcgaGlzdG9yeVxuICAgKiBhbmQgY2FsbGluZyBoYW5kbGVycy4gU2hvdWxkIGJlIGNhbGxlZCBpbml0aWFsbHkgd2l0aCBcIi9cIiBhbmRcbiAgICogYW55IGluaXRpYWwgc3RhdGUgc2hvdWxkIHlvdSB3YW50IHRvIHJlY2VpdmUgYSBzdGF0ZSB2YWx1ZSB3aGVuXG4gICAqIG5hdmlnYXRpbmcgYmFjayBmcm9tIGEgZnV0dXJlIHBhZ2VcbiAgICpcbiAgICogQG1ldGhvZCByZXBsYWNlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdXJsICAgdXJsXG4gICAqIEBwYXJhbSAgeyp9IHN0YXRlICAgICAgc3RhdGUgdG8gc3RvcmUgZm9yIHRoaXMgVVJMLCBjYW4gYmUgYW55dGhpbmdcbiAgICogQHJldHVybiB7Kn0gICAgICAgICAgICBzZWxmXG4gICAqL1xuICByZXBsYWNlOiAgICAgICAgZnVuY3Rpb24gcmVwbGFjZSggdXJsLCBzdGF0ZSApIHtcbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSggc3RhdGUsIG51bGwsIFwiI1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KCB1cmwgKSApO1xuICAgIHJldHVybiB0aGlzLmNoZWNrKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgYmFjayBpbiBoaXN0b3J5XG4gICAqXG4gICAqIEBtZXRob2QgYmFja1xuICAgKiBAcGFyYW0gIHtudW1iZXJ9IG4gbnVtYmVyIG9mIHBhZ2VzIHRvIG5hdmlnYXRlIGJhY2ssIG9wdGlvbmFsICgxIGlzIGRlZmF1bHQpXG4gICAqL1xuICBiYWNrOiAgICAgICAgICAgZnVuY3Rpb24gYmFjayggbiApIHtcbiAgICBoaXN0b3J5LmJhY2soIG4gKTtcbiAgICBpZiAoICF0aGlzLmxpc3RlbmluZyApIHtcbiAgICAgIHRoaXMucHJvY2Vzc1JvdXRlKCB3aW5kb3cubG9jYXRpb24uaHJlZiwgaGlzdG9yeS5zdGF0ZSApO1xuICAgIH1cbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gUm91dGVyO1xuIl19
