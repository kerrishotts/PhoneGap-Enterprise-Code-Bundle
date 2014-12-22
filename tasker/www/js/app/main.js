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
/*global define, device, PKLocalStorage*/
define(function (require, exports, module) {
    "use strict";
    var _y = require("yasmf"),
        GLOBALS = require("app/lib/globals"),
        Session = require("app/models/session/model"),
        LoginView = require("app/views/login/view"),
        DashboardView = require("app/views/dashboard/view"),
        TaskListView = require("app/views/taskList/view"),
        TaskView = require("app/views/taskView/view"),
        API = require("app/api/api"),
        Hammer = require("hammer");
    Hammer.defaults.stop_browser_behavior.touchAction = "pan-y";

    // define our app object
    var APP = new _y.BaseObject(),
        self = APP;

    self.subclass("APP");

    // we want the API instance available from anywhere
    GLOBALS.api = new API({baseURL: GLOBALS.config.baseURL});

    // <-- Yes, bad. But we have some circular dependencies, and RequireJS doesn't
    // want to resolve them. So, we do this. If we were using Browserify, this wouldn't be an issue.
    // TODO: change to browserify! ;-)
    window.GLOBALS = GLOBALS;

    /**
     * Dispatches a applicationPausing or applicationResuming event synchronously, based on appState
     * @param appState {String} Pausing or Resuming
     * @private
     */
    function dispatchStateEvent(appState) {
        GLOBALS.events.emit("application" + appState);
        console.log("Application " + appState.toUpperCase());
    }

    /**
     * Dispatches the applicationPausing event synchronously
     */
    var dispatchPauseEvent = dispatchStateEvent.bind(undefined, "Pausing");
    /**
     * Dispatches the applicationResuming event synchronously
     */
    var dispatchResumeEvent = dispatchStateEvent.bind(undefined, "Resuming");

    /**
     * Dispatches a networkOnline or networkOffline event, based on status
     * @param status {String} Online or Offline
     * @private
     */
    function dispatchNetworkEvent(status) {
        GLOBALS._networkStatus = status;
        GLOBALS.events.emit("network" + status);
        console.log("Network is now " + status.toUpperCase());
    }

    /**
     * Dispatches a networkOnlineEvent
     */
    var dispatchOnlineEvent = dispatchNetworkEvent.bind(undefined, "Online");
    /**
     * Dispatches a networkOfflineEvent
     */
    var dispatchOfflineEvent = dispatchNetworkEvent.bind(undefined, "Offline");


    /**
     * presents a login UI
     */
    self.presentLoginUI = function presentLoginUI() {
        var loginView = new LoginView({});
        APP.loginView = loginView;
        var navigationController = new _y.UI.NavigationController({
            rootView: loginView
        });
        navigationController.presentModalController(_y.$id("rootContainer"));
    };

    /**
     * Requests the API to perform a login action.
     * @returns {Promise}
     * @private
     */
    self._loginViaAPI = function _loginViaAPI() {
        return GLOBALS.api.login()
            .catch(function (err) {
                console.log("got a login error", err);
            })
            .done();
    };

    self._logout = function _logout() {
        GLOBALS.api.logout()
            .finally(function logout() {
                // this happens no matter what, even if we error on logging out
                GLOBALS.session = Session.clear();
                GLOBALS.events.emit("login:logout");
            })
            .done();
    };

    self._spinner = null;
    self._spinnerCount = 0;
    /**
     * Show a blocking spinner; this will block all user interaction!
     */
    self.showSpinner = function showSpinner() {
        if (!self._spinner) {
            self._spinner = new _y.UI.Spinner({});
        }
        if (!self._spinner.visible) {
            self._spinner.show();
        }
        self._spinnerCount++;
    };

    /**
     * Hide any visible blocking spinner, but only if the spinnerCount < 1
     */
    self.hideSpinner = function hideSpinner() {
        if (self._spinner) {
            self._spinnerCount--;
            if (self._spinnerCount < 1) {
                self._spinnerCount = 0;
                self._spinner.hide();
            }
        }
    };

    self.handleNavigation = function handleNavigation(sender, notice, args) {
        switch (notice) {
            case "APP:NAV:back":
                if (self.navigationController.rootView !== self.navigationController.topView) {
                    self.navigationController.popView();
                } else {
                    if (_y.device.platform() === "android") {
                        navigator.app.exitApp();
                    }
                }
                break;
            case "APP:NAV:home":
                self.navigationController.rootView = self.navigationController.rootView;
                break;
            case "APP:NAV:viewTasks":
                self.navigationController.pushView(
                    new TaskListView({filter: args[0]})
                );
                break;
            case "APP:NAV:createTask":
            case "APP:NAV:editTask":
                self.navigationController.pushView(
                    new TaskView({taskId: (args && args[0] !== null && args[0] !== undefined) ? args[0] : null})
                );
                break;
            default:
                console.info("Unhandled navigation", sender, notice, args);
        }
    };

    // APP.start will load the first view and kick us off
    self.start = function () {
        // listen for online/offline network events
        if (_y.underCordova) {
            document.addEventListener("online", dispatchOnlineEvent, false);
            document.addEventListener("offline", dispatchOfflineEvent, false);
        } else {
            // browser has other event listeners
            window.addEventListener("online", dispatchOnlineEvent, false);
            window.addEventListener("offline", dispatchOfflineEvent, false);
            if (!navigator.onLine) {
                dispatchOfflineEvent();
            }
        }

        // find the rootContainer DOM element, make a new login view and show it
        var rootContainer = _y.$("#rootContainer"),
            dashboardView = new DashboardView({}),
            navigationController = new _y.UI.NavigationController({
                rootView: dashboardView,
                parent:   rootContainer
            });
        APP.navigationController = navigationController;

        // register login & app-related notifications
        [
            "APP:needsLogin", "APP:needsLoginUI", "login:auth", "login:authCancel",
            "login:response", "login:good", "login:fail", "login:dismiss",
            "login:sessionLoaded", "login:sessionSaved", "login:sessionCleared",
            "login:logout", "APP:block", "APP:unblock"
        ].forEach(function (n) {
                GLOBALS.events.registerNotification(n);
            });

        // when APP:needLogin is posted, we will attempt a login through the API
        GLOBALS.events.on("APP:needsLogin", APP._loginViaAPI);
        GLOBALS.events.on("APP:logout", APP._logout);

        // when APP:needsLoginUI is posted, we display the login UI
        GLOBALS.events.on("APP:needsLoginUI", APP.presentLoginUI);

        GLOBALS.events.on("APP:block", APP.showSpinner);
        GLOBALS.events.on("APP:unblock", APP.hideSpinner);

        _y.UI.backButton.on("backButtonPressed", function backButtonPressed() {
            GLOBALS.events.emit("APP:NAV:back");
        });

        // these are largely equivalent to routes, but done via events
        // instead
        ["APP:NAV:viewTasks", "APP:NAV:editTask", "APP:NAV:createTask", "APP:NAV:viewComments",
            "APP:NAV:addComment", "APP:NAV:home", "APP:NAV:back"].forEach(function (i) {
                GLOBALS.events.on(i, self.handleNavigation);
            });

    };
    module.exports = APP;
});
