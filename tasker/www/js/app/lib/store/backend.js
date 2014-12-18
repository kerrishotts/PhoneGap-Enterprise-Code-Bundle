/**
 *
 * backend.js
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

    var
        Tasks = require("app/models/tasks/model"),
        People = require("app/models/people/model"),
        _y = require("yasmf");

    /*
     * The backend provides the methods to interact with the backend server.
     */

    module.exports = {
        /**
         * Get tasks from the backend. Opt can supply query parameters if
         * desired. Opt should look like {ownedBy:, assignedTo,}, but both
         * are optional. Returns a promise.
         *
         * @param {[ownedBy], [assignedTo]} opt
         * @returns {*} Promise
         */
        getTasks:  function getTasks(opt) {
            var ownedBy = _y.valueForKeyPath(opt, "ownedBy"),
                assignedTo = _y.valueForKeyPath(opt, "assignedTo"),
                options = {},
                api = GLOBALS.api;

            if (ownedBy !== undefined && ownedBy !== null) {
                options["owned-by"] = ownedBy;
            }
            if (assignedTo !== undefined && assignedTo !== null) {
                options["assigned-to"] = assignedTo;
            }

            return api.getTasks(options)
                .then(function transformTasks(r) {
                    // not quite HATEOAS, but hey; better than requesting each task one-by-one
                    var embedded = r.body._embedded,
                        serverTasks = Object.keys(embedded).map(function (key) {
                            return embedded[key];
                        });
                    return new Tasks(serverTasks);
                });
        },
        getPeople: function getPeople(opt) {
            var administeredBy = _y.valueForKeyPath(opt, "administeredBy"),
                options = {},
                api = GLOBALS.api;
            if (administeredBy !== undefined && administeredBy !== null) {
                options["administered-by"] = administeredBy;
            }
            return api.getPeople(options)
                .then(function transformPeople(r) {
                    // not quite HATEOAS, but hey; better than requesting each person one-by-one
                    var embedded = r.body._embedded,
                        serverPeople = Object.keys(embedded).map(function (key) {
                            return embedded[key];
                        });
                    return new People(serverPeople);
                });
        }


    }


});
