/**
 *
 * login view
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
define(function (require, exports, module) {
    "use strict";
    var _y = require("yasmf"),
        loginTemplate = require("./template");
    _y.addTranslations({
        "LOGIN:INVALID_USERNAME_OR_PASSWORD": {"EN": "Invalid username or password. Please try again."},
        "LOGIN:PROBLEM":                      {"EN": "Login Failed"},
        "LOGIN:TRY_AGAIN":                    {"EN": "Try Again"},
        "LOGIN:CANCEL":                       {"EN": "Cancel"}
    });
    var _className = "LoginView";
    module.exports = function LoginView() {
        var self = new _y.UI.ViewContainer();
        self.subclass(_className);

        /**
         * @property username
         * @type string
         * @default blank
         * @observable
         */
        self.defineObservableProperty("username", {default: ""});

        /**
         * @property password
         * @type string
         * @default blank
         * @observable
         */
        self.defineObservableProperty("password", {default: ""});

        /**
         * Block the UI and send the login request; when the response is returned, handle appropriately
         * @param e
         * @returns {boolean}
         */
        self.doAuthentication = function doAuthentication(e) {

            // block the UI; this has the side effect of the letting the user know we're doing something
            _y.UI.globalNotifications.emit("APP:block");

            // send the login request. APP will pick it up and send it to the API
            _y.UI.globalNotifications.emit("login:auth", [self.username, self.password]);

            // Wait for the response, but only once
            _y.UI.globalNotifications.once("login:response", function (sender, notice, args) {

                // unblock the UI -- we're about to do something
                _y.UI.globalNotifications.emit("APP:unblock");

                // if args[0] isn't blank, we've got an error. If it is blank, the login was good
                if (args[0] !== "") {
                    // let the rest of the app know about the failure
                    _y.UI.globalNotifications.emit("login:fail");

                    // create an alert allowing the user to decide what they want to do
                    var alert = new _y.UI.Alert();
                    alert.initWithOptions({
                        title:   _y.T("LOGIN:PROBLEM"),
                        text:    _y.T(args[0]),
                        promise: true,
                        buttons: [
                            _y.UI.Alert.button(_y.T("LOGIN:TRY_AGAIN")),
                            _y.UI.Alert.button(_y.T("LOGIN:CANCEL"), {
                                type: "bold",
                                tag:  -1
                            })
                        ]
                    });
                    // and show
                    alert.show()
                        .then(function (idx) {
                            // we actually do nothing; the login screen is still visible
                            return;
                        })
                        .catch(function (e) {
                            // let the world know we're canceling the attempt
                            _y.UI.globalNotifications.emit("login:authCancel");

                            // and dismiss
                            self.navigationController.dismissModalController();
                        })
                        .done();
                } else {
                    // let the rest of the app know we have a good login
                    _y.UI.globalNotifications.emit("login:good");
                    // close us
                    self.navigationController.dismissModalController();
                }
            });

            // we don't want to actually submit the form
            e.preventDefault();
            return false;
        };

        /**
         * Called when the user clicks "Forgot?" on the login screen. Doesn't do much (DEMO!)
         * @param e
         * @stub
         */
        self.doForgotPassword = function doForgetPassword(e) {
            self.emit("login:forgot");
        };

        /**
         * Render our login view template when requested. `self` is both the view and controller.
         * The last object passed to `loginTemplate` maps the properties the template expects to our
         * own. Could be eliminated technically, but we're being explicit about the mapping here.
         * @method render
         */
        self.override(function render() {
            return loginTemplate(self, self, {
                "username": "username",
                "password": "password"
            });
        });

        /**
         * Initialize the view
         * @method init
         * @param {*} theParentElement
         */
        self.override(function init(theParentElement) {
            self.$super(undefined, "div", "loginView ui-container", theParentElement);
        });

        /**
         * Initialize the view (with options)
         * @method initWithOptions
         * @param {*} options
         */
        self.override(function initWithOptions(options) {
            var theParentElement;
            if (options !== undefined) {
                if (options.parent !== undefined) {
                    theParentElement = options.parent;
                }
            }
            self.init(theParentElement);
        });

        // boilerplate for auto init
        self._autoInit.apply(self, arguments);

        return self;
    };
});
