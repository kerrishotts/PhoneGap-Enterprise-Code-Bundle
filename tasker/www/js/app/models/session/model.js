/**
 *
 * session.js
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
/*globals Keychain*/
define(function (require, exports, module) {
        "use strict";

        var Q = require("Q");

        function Session(data) {
            if (data !== undefined) {
                this.sessionId = data.sessionId;
                this.userId = data.userId;
                this.hmacSecret = data.hmacSecret;
                this.nextToken = data.nextToken;
                this.personId = data.personId;
            }
            this.save().done();
        }

        Session.prototype.save = function save() {
            //TODO: use keychain if available
            var deferred = Q.defer(),
                self = this;

            // if on iOS, save to the key chain
            if (typeof Keychain !== "undefined") {
                (function saveToKeychain() {
                    var kc = new Keychain();
                    kc.setForKey(function () {
                        deferred.resolve();
                        console.log("Session saved");
                    }, function (err) {
                        deferred.reject(err);
                        console.error("Couldn't save session", err);
                    }, "session", "auth", JSON.stringify(self));
                })();
            } else {
                // Use localStorage.
                // NOTE: THIS IS NOT IDEAL! On Android, use the File plugin to write to internal storage.
                // NOTE: On a browser, well... there's no great options.
                localStorage.setItem("auth", JSON.stringify(self));
                deferred.resolve();
            }

            return deferred.promise;
        };

        Session.load = function load() {
            var deferred = Q.defer();

            // use the iOS keychain if available
            if (typeof Keychain !== "undefined") {
                (function loadFromKeychain() {
                    var kc = new Keychain();
                    kc.getForKey(
                        function gotKey(v) {
                            var o;
                            try {
                                console.log("Got a session from the keychain");
                                o = JSON.parse(v);
                                deferred.resolve(new Session(o));
                            }
                            catch (err) {
                                console.log("Failed to get session from keychain", err);
                                deferred.reject("Failed to load session from keychain; might be corrupt.");
                            }
                        },
                        function keyError(err) {
                            console.log("Failed to get session from keychain", err);
                            deferred.reject("Failed to load session from keychain; may not exist.");
                        }, "session", "auth");
                })();
            } else {
                // Use localStorage.
                // NOTE: THIS IS NOT IDEAL! On Android, use the File plugin to write to internal storage.
                // NOTE: On a browser, well... there's no great options.
                try {
                    deferred.resolve(new Session(JSON.parse(localStorage.getItem("auth"))));
                }
                catch (err) {
                    deferred.reject("Couldn't load session from localStorage; may not exist.");
                }
            }
            return deferred.promise;
        };

        Session.clear = function clear() {
            // TODO: use keychain

            // if on iOS, save to the key chain
            if (typeof Keychain !== "undefined") {
                (function clearKeynhain() {
                    var kc = new Keychain();
                    kc.removeForKey(function () {
                        console.log("Session Removed");
                    }, function (err) {
                        console.error("Couldn't remove session", err);
                    }, "session", "auth");
                })();
            } else {
                // Use localStorage.
                // NOTE: THIS IS NOT IDEAL! On Android, use the File plugin to write to internal storage.
                // NOTE: On a browser, well... there's no great options.
                localStorage.removeItem("auth");
            }
            return null;
        };

        Session.prototype.setNextToken = function setNextToken(nextToken) {
            if (nextToken !== undefined && nextToken !== null && nextToken !== "") {
                this.nextToken = nextToken;
                this.save();
            }
        };

        module.exports = Session;
    }
)
;
