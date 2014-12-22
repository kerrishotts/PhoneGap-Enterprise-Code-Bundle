/**
 *
 * person/model.js
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
define(function (require, exports, module) {
    "use strict";

    var ObjUtils = require("app/lib/objUtils");

    function Person(data) {
        var defaultPerson = {
            id:             null,
            userId:         "",
            fullName:       "",
            prefName:       "",
            administeredBy: 0,
            changeDate:     new Date(),
            changeUser:     null
        };

        var contextMap = {
            "id":             "person-id",
            "userId":         "user-id",
            "fullName":       "full-name",
            "prefName":       "pref-name",
            "administeredBy": "administrator",
            "changeDate":     "change-date",
            "changeUser":     "change-user"
        };

        Object.keys(defaultPerson).forEach(function copyValue(prop) {
            if (data) {
                if (data[prop] !== undefined && data[prop] !== null) {
                    this[prop] = data[prop];
                } else if (data[contextMap[prop]] !== undefined && data[contextMap[prop]] !== null) {
                    this[prop] = data[contextMap[prop]]
                } else {
                    this[prop] = defaultPerson[prop];
                }
            } else {
                this[prop] = defaultPerson[prop];
            }
        }, this);

        if (!(this.changeDate instanceof Date)) {
            this.changeDate = new Date(this.changeDate);
        }
    }

    module.exports = Person;
});
