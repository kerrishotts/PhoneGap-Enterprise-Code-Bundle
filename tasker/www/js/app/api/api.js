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

define(function (require, exports, module) {
    "use strict";

    var Session = require("app/models/session/model"),
        ObjUtils = require("app/lib/objUtils"),
        XHR = require("app/lib/xhr"),
        CryptoJS = require("app/lib/cryptojs"),
        Hateoas = require("app/lib/hateoas"),
        _y = require("yasmf"),
        Q = require("Q"),
        GLOBALS = require("app/lib/globals"),
        _className = "API";

    function pad2(v) {
        return ( v < 10 ) ? "0" + v : "" + v;
    }

    module.exports = function API() {
        var self = new _y.BaseObject();
        self.subclass(_className);

        /**
         * Defines the base URL for the API
         *
         * @property baseURL
         * @type {String}
         */
        self.defineObservableProperty("baseURL", {
            default: "https://localhost:4443"
        });

        // private variables
        self._api = null; // we'll use this to store information about the API

        // some typical XHR options
        self._xhrOptions = {
            sending:   "application/json",
            receiving: "application/json"
        };

        /**
         * Makes the initial request to discover the API information. This is assumed
         * to be at the root of BaseURL. The returned response should include a hypertext
         * representation of the API. This is stored in _api.
         *
         * If the API has previously been discovered, the request is not made again.
         *
         * @method   _discoverAPI
         *
         * @return   {Promise}
         */
        self._discoverAPI = function _discoverAPI() {
            var deferred = Q.defer();
            if (self._api !== null) {
                deferred.resolve();
            } else {
                XHR.checkIfSecure(self.baseURL, GLOBALS.config.certificateFingerprints)
                    .then(function send() {
                        return XHR.send("GET", self.baseURL + "/", self._xhrOptions);
                    })
                    .then(function (r) {
                        // response contains everything we need to know about the API
                        // STORE IT.
                        self._api = r.body;
                        deferred.resolve();
                    })
                    .catch(function (err) {
                        deferred.reject(err);
                    })
                    .done();
            }
            return deferred.promise;
        };

        //
        // requests are queued because the API may return different tokens
        self._requestQueue = [];
        self._busy = false;

        /**
         * Pushes an API request on the queue, and the proceeds to process the queue
         * @param action
         * @param data
         * @param deferred
         * @private
         */
        self._pushRequest = function _pushRequest(action, data, deferred) {
            self._requestQueue.push({
                action:   action,
                data:     data,
                deferred: deferred
            });
            setTimeout(self._processQueue, 0);
        };

        /**
         * Sends an API request, taking care of things like CSRF, authentication, and
         * HMACs. Reduces boilerplate code for the actual API methods.
         *
         * The action should be a string as defined in the _links section of _api. For
         * example, "login" or "create-task". This tells us everything we need to know
         * about how to craft the request, including the HTTP verb to use, the URL,
         * if it is templated, etc.
         *
         * The data parameter is broken up into several parts:
         * {
             *   queryParameters: [ { name:, value: }, ... ], (mapped and validated according
             *                                                 to query-parameters on the action)
             *   urlContext: [ { name: value }, ... ], (used if the url is templated)
             *   body: { ... }, (the data to send in the body of the request. Should the action
             *                   have a template, it is mapped according to the template.)
             * }
         *
         * @method   _sendAPIRequest
         *
         * @param    {String}     action
         * @param    {*}          [data]
         *
         * @return   {Promise}
         */
        self.sendAPIRequest = function sendAPIRequest(action, data) {
            var deferred = Q.defer();
            self._pushRequest(action, data, deferred);
            console.log("pushed", action, data);
            return deferred.promise;
        };

        /**
         * Actually send the request (from the queue)
         * @param action
         * @param data
         * @returns {*}
         * @private
         */
        self._sendAPIRequest = function _sendAPIRequest(action, data) {
            var deferred = Q.defer();
            self._processAPIRequest(action, data, deferred);
            console.log("pushed", action, data);
            return deferred.promise;
        };

        /**
         * Process any API request from the queue.
         * @param action
         * @param data
         * @param deferred
         * @private
         */
        self._processAPIRequest = function _processAPIRequest(action, data, deferred) {
            var queryParameters, urlContext, body, url;

            // get the relevant portions of any data passed to us
            if (data !== undefined) {
                queryParameters = data.queryParameters;
                urlContext = data.urlContext;
                body = data.body;
            }

            // request the API to be discovered (if cached, we get an immediate return)
            self._discoverAPI()
                .then(function makeRequest() {
                    // now we can send the actual request to the API
                    var apiAction = self._api._links[action],
                        options = ObjUtils.merge(self._xhrOptions),
                        promise = Q();

                    // get the URL
                    url = ( apiAction.templated ? ObjUtils.interpolate(apiAction.href, urlContext) : apiAction.href );

                    // add the query parameters
                    if (apiAction["query-parameters"] !== undefined && queryParameters !== undefined) {
                        queryParameters = Hateoas.map(queryParameters, apiAction["query-parameters"]);
                        var valid = _y.validate(queryParameters, apiAction["query-parameters"]);
                        if (valid.validates) {
                            url += "?" + Object.keys(queryParameters)
                                .map(function (prop) {
                                    if (queryParameters[prop] !== undefined) {
                                        return "" + prop + "=" + queryParameters[prop];
                                    } else {
                                        return undefined;
                                    }
                                })
                                .filter(function (str) {
                                    return str !== undefined;
                                })
                                .join("&");
                        } else {
                            deferred.reject(new Error("Query Parameter validation failed " + valid.message));
                            self._busy = false;
                            setTimeout(self._processQueue, 0);
                        }
                    }

                    // map the body data
                    if (body !== undefined && body !== null) {
                        if (apiAction.template !== undefined) {
                            options.data = Hateoas.map(body, apiAction.template);
                        } else {
                            options.data = data;
                        }
                    }

                    // if the resource is secured, we also need to ask for a login
                    if (apiAction["secured-by"] !== undefined) {
                        if (GLOBALS.session === null) {
                            promise = promise.then(self.login.bind(self));
                        }
                    }

                    // we need to check if we need a CSRF token -- this is defined by a csrf property
                    if (apiAction.csrf !== undefined) {
                        promise = promise.then(self.getCSRF.bind(self, apiAction.csrf));
                    }

                    promise = promise.then(function performRequest(r) {
                        var context = {},
                            apiHeaders;

                        if (r && r._context) {
                            context = r._context;
                        }

                        // if we have a response, it's a CSRF token
                        if (r !== undefined) {
                            Hateoas.storeResponseToContext(r, context);
                        }

                        // merge in our session as well
                        if (GLOBALS.session !== null) {
                            context["session-id"] = GLOBALS.session.sessionId;
                            context["user-id"] = GLOBALS.session.userId;
                            context["next-token"] = GLOBALS.session.nextToken;
                            context["person-id"] = GLOBALS.session.personId;
                        }

                        // the action may also require an HMAC...
                        if (apiAction.hmac !== undefined) {
                            // compute the HMAC; technically this specified by the API, but I'm not
                            // going to attempt to parse it all the way.

                            var now = new Date(),
                                nowYYYY, nowMM, nowDD, nowHH, nowMI,
                                dateString, stringToHmac, hmacString;
                            now.setMinutes(now.getMinutes());
                            nowYYYY = now.getUTCFullYear();
                            nowMM = now.getUTCMonth() + 1;
                            nowDD = now.getUTCDate();
                            nowHH = now.getUTCHours();
                            nowMI = now.getUTCMinutes();
                            dateString = "" + nowYYYY + pad2(nowMM) + pad2(nowDD) + "." + pad2(nowHH) + pad2(nowMI);
                            stringToHmac = "" + dateString + "." + url;
                            if (body !== undefined && body !== null) {
                                stringToHmac += "." + JSON.stringify(options.data);
                            }
                            hmacString = CryptoJS.HmacSHA256(stringToHmac, GLOBALS.session.hmacSecret)
                                .toString(CryptoJS.enc.Base64);

                            context["hmac-token"] = hmacString;
                            console.log(stringToHmac, hmacString);

                        }

                        // if headers need to be sent...
                        if (( apiHeaders = ObjUtils.valueForKeyPath(apiAction, "attachments.headers") ) !== undefined) {
                            options.headers = Hateoas.buildHeadersAttachment(apiHeaders, context);
                        }
                        // encode the URL
                        url = encodeURI(self.baseURL + url);

                        // and after all that, send!
                        return XHR.checkIfSecure(self.baseURL, GLOBALS.config.certificateFingerprints)
                            .then(function send() {
                                return XHR.send(apiAction.verb, url, options);
                            });
                    });

                    return promise;
                })
                .then(function resolveRequest(r) {
                    var context = {};
                    Hateoas.storeResponseToContext(r, context);
                    if (context["next-token"]) {
                        if (GLOBALS.session) {
                            GLOBALS.session.setNextToken(context["next-token"])
                        }
                    }
                    r._context = context;
                    deferred.resolve(r);
                    // process the next request
                    self._busy = false;
                    setTimeout(self._processQueue, 0);
                })
                .catch(function rejectRequest(err) {
                    console.error(err);
                    deferred.reject(err);
                    // process the next request
                    self._busy = false;
                    setTimeout(self._processQueue, 0);
                })
                .done();
        };

        /**
         * Process the queue
         * @private
         */
        self._processQueue = function _processQueue() {
            var action, data, deferred, request;
            console.log("preProcess", self._requestQueue.length, self._busy);
            if (self._requestQueue.length > 0 && ( !self._busy || self._requestQueue[0].evenIfBusy )) {
                self._busy = true;
                request = self._requestQueue.shift();
                action = request.action;
                data = request.data;
                deferred = request.deferred;
                console.log("processing", action, data);
                self._processAPIRequest(action, data, deferred);
            }
        };

        /**
         * Obtains a CSRF token
         *
         * @method   getCSRF
         *
         * @param    {string}   csrfType   the type of CSRF token we're requesting
         *
         * @return   {Promise}
         */
        self.getCSRF = function getCSRF(csrfType) {
            return self._discoverAPI()
                .then(function sendCSRFRequest() {
                    return self._sendAPIRequest(self._api["csrf-defs"][csrfType]["csrf-action"][0], undefined, true);
                })
                .then(function (r) {
                    console.log("csrf", r);
                    return r;
                });
        };

        /**
         * Authenticates with the back end. If username/password aren't supplied,
         * it will request a modal login view by posting "APP:needsLogin" to the
         * global notification channel.
         *
         * @method   login
         *
         * @param    {String}   username   Username
         * @param    {String}   password   Password
         *
         * @return   {Promise}
         */
        self.login = function login(username, password) {
            var deferred = Q.defer();
            if (username === undefined || password === undefined) {
                // no username/password sent

                // ask the app to display a login UI
                _y.UI.globalNotifications.emit("APP:needsLoginUI");

                // and register for the response
                _y.UI.globalNotifications.on("login:auth*", function authCheck(sender, notice, args) {
                    if (notice === "login:auth") {
                        // call login again with the username and password
                        self.login(args[0], args[1])
                            .then(function loginGood(r) {
                                _y.UI.globalNotifications.off("login:auth*", authCheck);
                                _y.UI.globalNotifications.emit("login:response", [""]);
                                deferred.resolve(r);
                            })
                            .catch(function loginBad(err) {
                                _y.UI.globalNotifications.emit("login:response", ["LOGIN:INVALID_USERNAME_OR_PASSWORD"]);
                                deferred.reject(err);
                            })
                            .done();
                    } else {
                        // login failed, and user is giving up
                        _y.UI.globalNotifications.off("login:auth*", authCheck);
                        deferred.reject(new Error("Authorization failed; user giving up."));
                    }
                });
            } else {
                // username/password sent, try it
                self._discoverAPI()
                    .then(self._sendAPIRequest.bind(self, "login", {
                        body: {
                            "user-id":            username,
                            "candidate-password": password
                        }
                    }))
                    .then(function loginSucceeded(r) {
                        var context = {};
                        Hateoas.storeResponseToContext(r, context);
                        GLOBALS.session = new Session({
                            userId:     context["user-id"],
                            sessionId:  context["session-id"],
                            hmacSecret: context["hmac-secret"],
                            nextToken:  context["next-token"],
                            personId:   context["person-id"]
                        });
                        deferred.resolve(r);
                    })
                    .catch(function loginFailed(err) {
                        deferred.reject(err);
                    })
                    .done();
            }
            return deferred.promise;
        };

        /**
         * Log out
         *
         * @method logout
         * @returns {*}
         */
        self.logout = function logout() {
            return self._discoverAPI()
                .then(function () {
                    return self.sendAPIRequest("logout");
                });
        };

        /**
         * Returns a collection
         * @param collection
         * @param query
         * @param urlContext
         * @returns {*}
         */
        self.getCollection = function getCollection(collection, query, urlContext) {
            return self._discoverAPI()
                .then(self.sendAPIRequest.bind(self, "get-" + collection, {
                    urlContext:      urlContext,
                    queryParameters: query
                }));
        };

        /**
         * Get tasks using an optional query
         *
         * @method getTasks
         * @param {*} query
         * @returns {*}
         */
        /**
         * Get people using an optional query
         *
         * @method getPeople
         * @param {*} query
         * @returns {*}
         */
        [
            ["tasks", "tasks"],
            ["people", "people"]
        ].forEach(function bindAction(parms) {
                var collection = parms[0], action = parms[1],
                    properCase = collection.substr(0, 1).toUpperCase() + collection.substr(1);
                self["get" + properCase] = self.getCollection.bind(self, action);

            });

        /**
         * Get comments
         *
         * @method getTaskComments
         * @param {number} taskId
         * @returns {*}
         */
        self.getTaskComments = function getTaskComments(taskId) {
            return self.getCollection("task-comments", {}, {
                taskId: taskId
            });
        };

        /**
         * Return an entity
         *
         * @method getentityById
         * @param {String} obj
         * @param {String} keyPath
         * @param {*} id
         * @returns {*}
         */
        self.getEntityById = function getEntityById(obj, keyPath, id) {
            var urlContext = {};
            urlContext[keyPath] = id;
            return self._discoverAPI()
                .then(self.sendAPIRequest.bind(self, "get-" + obj, {urlContext: urlContext}));
        };

        /**
         * Get a task
         *
         * @method getTask
         * @param taskId
         * @returns {*}
         */
        /**
         * Get a person
         *
         * @method getPerson
         * @param personId
         * @returns {*}
         */
        [
            ["task", "taskId"],
            ["person", "personId"]
        ].forEach(function bindAction(parms) {
                var entity = parms[0], keyPath = parms[1],
                    properCase = parms[0].substr(0, 1).toUpperCase() + parms[0].substr(1);
                self["get" + properCase] = self.getEntityById.bind(self, entity, keyPath);
            });

        self.createTask = function createTask(data) {
            return self._discoverAPI()
                .then(self.sendAPIRequest.bind(self, "create-task", {
                    body: data
                }));
        };

        /**
         * Create a task comment. The data should look like this:
         *
         * ```
         * {
             *     "task-comments": task-comments
             * }
         * ```
         *
         * @method createTaskComment
         * @param taskId
         * @param data
         * @returns {*}
         */
        self.createTaskComment = function createTaskComment(taskId, data) {
            return self._discoverAPI()
                .then(self.sendAPIRequest.bind(self, "create-comment", {
                    urlContext: {taskId: taskId},
                    body:       data
                }));
        };

        /**
         * Patch a task with the requisite data. The data should look like this:
         *
         * ```
         * {
             *     "assigned-to": person-id,
             *     "status": status,
             *     "pct-complete": pct-complete
             * }
         * ```
         *
         * @method patchTask
         * @param taskId
         * @param data
         * @returns {*}
         */
        self.patchTask = function patchTask(taskId, data) {
            return self._discoverAPI()
                .then(self.sendAPIRequest.bind(self, "patch-task", {
                    urlContext: {taskId: taskId},
                    body:       data
                }));
        };

        /**
         * Initialize
         * @method init
         * @param {String} baseURL
         */
        self.override(function init(baseURL) {
            self.$super();
            self.baseURL = baseURL;
            return self;
        });

        /**
         * Initialize with Options
         * @method initWithOptions
         * @param {*} options
         */
        self.override(function initWithOptions(options) {
            return self.init(_y.valueForKeyPath(options, "baseURL", self.baseURL));
        });

        self._autoInit.apply(self, arguments);
        return self;
    }

});
