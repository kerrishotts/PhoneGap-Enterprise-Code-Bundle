/**
 *
 * mock.js
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
        _y = require("yasmf"),
        Q = require("Q");

    /*
     * The mock module provides mechanisms for mocking without the backend
     */

    var
        bobPerson = {
            id:     1,
            userId: "BSMITH",
            name:   "Bob Smith"
        },
        joePerson = {
            id:             2,
            userId:         "JDOE",
            name:           "Joe Doe",
            administeredBy: bobPerson.id
        },
        mockPeople = [bobPerson, joePerson];

    var mockTaskA = {
            id:          1,
            title:       "Create website",
            description: "Shouldn't be a hard job",
            owner:       bobPerson.id,
            assignedTo:  joePerson.id,
            pctComplete: 10,
            status:      "I"
        },
        mockTaskB = {
            id:          2,
            title:       "Deploy website",
            description: "Cross your fingers!",
            owner:       bobPerson.id,
            assignedTo:  null,
            pctComplete: 50,
            status:      "I"

        },
        mockTasks = [mockTaskA, mockTaskB];

    module.exports = {
        /**
         * Get tasks from the backend. Opt can supply query parameters if
         * desired. Opt should look like {ownedBy:, assignedTo,}, but both
         * are optional. Returns a promise.
         *
         * @param {[ownedBy], [assignedTo]} opt
         * @returns {*} Promise
         */
        getTasks: function getTasks(opt) {
            var ownedBy = _y.valueForKeyPath(opt, "ownedBy"),
                assignedTo = _y.valueForKeyPath(opt, "assignedTo"),
                options = {};

            if (ownedBy !== undefined && ownedBy !== null) {
                options["owned-by"] = ownedBy;
            }
            if (assignedTo !== undefined && assignedTo !== null) {
                options["assigned-to"] = assignedTo;
            }

            return Q(new Tasks(mockTasks));
        }
    }


});
