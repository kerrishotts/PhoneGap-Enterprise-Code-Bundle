/**
 *
 * login template
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
define( [ "yasmf", "hammer" ], function ( _y, hammer ) {
  "use strict";
  _y.addTranslations( {
                        "TASKER":                     {
                          "EN": "Tasker"
                        },
                        "LOGIN:TITLE":                {
                          "EN": "Log in"
                        },
                        "LOGIN:USERNAME":             {
                          "EN": "Username"
                        },
                        "LOGIN:PASSWORD":             {
                          "EN": "Password"
                        },
                        "LOGIN:USERNAME:PLACEHOLDER": {
                          "EN": "Enter user name"
                        },
                        "LOGIN:PASSWORD:PLACEHOLDER": {
                          "EN": "Type your password"
                        },
                        "LOGIN:LOGIN":                {
                          "EN": "Log in"
                        },
                        "LOGIN:FORGOT":               {
                          "EN": "Forgot?"
                        },
                        "LOGIN:WELCOME":              {
                          "EN": "Welcome to Tasker! Please log in below using your username " +
                                "and password provided to you by Information Technology."
                        }
                      } );
  /**
   * @method loginTemplate
   * @param {*} v      view to bind to
   * @param {*) c      controller (for events)
   * @param {*} map    map "password" and "username" to view fields
   */
  function loginTemplate( v, c, map ) {
    var h = _y.h;
    return [
      //
      // navigation bar; includes title
      h.el( "div.ui-navigation-bar", h.el( "div.ui-title", _y.T( "LOGIN:TITLE" ) ) ),
      //
      // scroll container containing login form and text; avoid the navigation bar
      h.el( "div.ui-scroll-container", h.el( "form.vertical-layout ui-avoid-navigation-bar", {
        on: {
          submit: c.doAuthentication
        }
      }, [
                                               //
                                               // header and welcome text
                                               h.el( "div.text", [
                                                 h.h1( _y.T( "TASKER" ) ),
                                                 h.p( _y.T( "LOGIN:WELCOME" ) )
                                               ] ),
                                               //
                                               // user name field; bound to v.username
                                               h.el( "div.field", [
                                                 h.span( _y.T( "LOGIN:USERNAME" ) + ":" ),
                                                 h.el( "input?type=text", {
                                                   attrs: {
                                                     placeholder: _y.T( "LOGIN:USERNAME:PLACEHOLDER" )
                                                   },
                                                   bind:  {
                                                     object:  v,
                                                     keyPath: h.mapTo( "username", map )
                                                   }
                                                 } )
                                               ] ),
                                               //
                                               // password field; bound to v.password
                                               h.el( "div.field", [
                                                 h.span( _y.T( "LOGIN:PASSWORD" ) + ":" ),
                                                 h.el( "input?type=password", {
                                                   attrs: {
                                                     placeholder: _y.T( "LOGIN:PASSWORD:PLACEHOLDER" )
                                                   },
                                                   bind:  {
                                                     object:  v,
                                                     keyPath: h.mapTo( "password", map )
                                                   }
                                                 } )
                                               ] ),
                                               //
                                               // button group
                                               h.el( "div.button-group", [
                                                 //
                                                 // submit button; when submitted sends c.login:go
                                                 h.el( "input?type=submit", _y.T( "LOGIN:LOGIN" ) ),
                                                 //
                                                 // forgot password button; sends c.login:forgot
                                                 h.el( "input?type=button", _y.T( "LOGIN:FORGOT" ), {
                                                   hammer: {
                                                     tap:    {
                                                       handler: c.doForgotPassword
                                                     },
                                                     hammer: hammer
                                                   }
                                                 } )
                                               ] )
                                             ] ) )
    ];
  }

  return loginTemplate;
} );