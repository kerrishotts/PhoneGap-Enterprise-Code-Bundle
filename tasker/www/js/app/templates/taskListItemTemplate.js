/**
 *
 * task list item template
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
        hammer = require("hammer"),
        Task = require("app/models/task/model");

    module.exports = function taskListItemTemplate(task, people, tapHandler) {
        var h = _y.h;
        return h.el("li.ui-list-item", {
                attrs:  {"data-task-id": task.id},
                hammer: {tap: {handler: tapHandler}, hammer: hammer}
            },
            [
                h.el("div.ui-list-item-flex-contents",
                    [
                        h.el("div.ui-label task-status " + Task.CODE_DESCRIPTION[task.status], h.el("div.task-pct", _y.PCT(task.pctComplete/100, "0"))),
                        h.el("div.ui-fill", [
                            h.el("div.ui-label task-title", task.title),
                            h.el("div.ui-label task-description", task.description),
                            h.el("div.ui-label task-assignee", _y.T("TO_%PERSON%", {person: _y.valueForKeyPath(people.getPersonById(task.assignedTo), "fullName", _y.T("NO_ONE"))})),
                            h.el("div.ui-label task-owner", _y.T("FROM_%PERSON%", {person: _y.valueForKeyPath(people.getPersonById(task.owner), "fullName", _y.T("NO_ONE"))}))
                        ]),
                        h.el("div.ui-indicator ui-arrow-direction-right")
                    ])
            ]);
    }
});
