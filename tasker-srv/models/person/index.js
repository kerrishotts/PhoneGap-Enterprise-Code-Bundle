/******************************************************************************
 *
 * Tasker Server (PhoneGap Enterprise Book)
 * ----------------------------------------
 *
 * @author Kerri Shotts
 * @version 0.1.0
 * @license MIT
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
 *
 ******************************************************************************/
"use strict";
var objUtils = require("../../obj-utils");

/**
 * Person -
 *
 * @param  {*} props            object containing values to assign
 * @return {Person}             A person
 */
function Person(props) {
    "use strict";
    var def = {
        "id":            undefined,
        "administrator": undefined,
        "fullName":      "",
        "prefName":      "",
        "userId":        "",
        "changeDate":    new Date(),
        "changeUser":    undefined
    };
    var dbFieldMap = {
        "ID":               {key: "id"},
        "ADMINISTRATOR_ID": {key: "administrator"},
        "FULL_NAME":        {key: "fullName"},
        "PREF_NAME":        {key: "prefName"},
        "USER_ID":          {key: "userId"},
        "CHANGE_DATE":      {
            key: "changeDate", cvt: function (v) {
                return new Date(v);
            }
        },
        "CHANGE_USER":      {key: "changeUser"}
    };

    return objUtils.mergeIntoUsingMap(props, def, dbFieldMap);
}

Person.prototype.copy = function () {
    return new Person(this);
};

module.exports = Person;
