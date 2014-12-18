/**
 *
 * tasks/model.js
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

    var ObjUtils = require("app/lib/objUtils"),
        Task = require("app/models/task/model");

    function Tasks(data) {
        this.items = [];
        if (data instanceof Array) {
            this.items = data.map(function (item) {
                return new Task(item);
            });
        }
    }

    Tasks.prototype.getTaskById = function getTaskById(id) {
        var candidates = this.items.filter(function testCandidate(candidate) {
            return candidate.id === id;
        });
        if (candidates.length === 1) {
            return candidates[0];
        } else if (candidates.length < 1) {
            return null;
        }
        throw new Error("Multiple tasks found for id ", id);
    };

    Tasks.prototype.getCount = function count() {
        return this.items.length;
    };

    Tasks.prototype.getKeys = function keys() {
        return this.items.map(function makeKey(item) {
            return item.id
        });
    };

    module.exports = Tasks;
});
