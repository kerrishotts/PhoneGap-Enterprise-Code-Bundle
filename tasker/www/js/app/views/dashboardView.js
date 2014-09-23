/**
 *
 * dashboard view
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
define( [ "yasmf", "app/templates/dashboardTemplate" ], function ( _y, dashboardTemplate ) {
  "use strict";
  var _className = "DashboardView",
      DashboardView = function () {
        // we descend from a simple ViewContainer
        var self = new _y.UI.ViewContainer();
        // always subclass
        self.subclass( _className );
        //
        // reference to unordered list where we can put list bar graphs
        self.defineObservableProperty( "taskList", {
          default: ""
        } );
        //
        // the template will attach event handlers to our methods
        // submit and forgot
        self.doLogInOut = function doLogInOut( e ) {
          _y.UI.globalNotifications.emit( "APP:needsLogin" );
        };
        //
        // return the login template when the view is rendered
        // `self` is both the view and controller
        self.override( function render() {
          return dashboardTemplate( self, self );
        } );
        //
        // init
        self.override( function init( theParentElement ) {
          self.super( _className, "init", [ undefined, "div", "dashboardView ui-container",
                                            theParentElement
          ] );
        } );
        //
        // initWithOptions
        self.override( function initWithOptions( options ) {
          var theParentElement;
          if ( typeof options !== "undefined" ) {
            if ( typeof options.parent !== "undefined" ) {
              theParentElement = options.parent;
            }
          }
          self.init( theParentElement );
        } );
        self._autoInit.apply( self, arguments );
        return self;
      };
  return DashboardView;
} );