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
        config = require("app/config"),
        store = require("app/lib/store/store"),
        Session = require("app/models/session/model"),
        events = _y.UI.globalNotifications,
        session = null;

    // load in any stored session
    // TODO: use keychain
    if (localStorage.getItem("auth")) {
        session = new Session(JSON.parse(localStorage.getItem("auth")));
    }

    // register global events so that they can be listened to later

    // application state, must be synchronous (hence false)
    ["Pausing", "Resuming"].forEach(function (i) {
        events.registerNotification("application" + i, false);
    });

    // network state
    ["Online", "Offline"].forEach(function (i) {
        events.registerNotification("network" + i);
    });

    // NOTE: we could have used app/lib/GlobalEvents to be generic, but YASMF's
    // GlobalNotification object works roughly the same way.
    var GLOBALS = {
        events:                events,
        config:                config,
        session:               session,
        api:                   null,
        store:                 store,
        _networkStatus:        "Unknown",
        checkNetworkAvailable: function checkNetworkAvailable() {
            return this._networkStatus !== "Offline"
        }
    };

    module.exports = GLOBALS;
});
