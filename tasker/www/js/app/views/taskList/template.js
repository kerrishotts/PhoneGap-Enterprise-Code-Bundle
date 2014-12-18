/**
 *
 * task list template
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
        taskListItemTemplate = require("app/templates/taskListItemTemplate"),
        colorKeyBarTemplate = require("app/templates/colorKeyBarTemplate");

    _y.addTranslations({
        "TASKLIST:TITLE":    {"EN": "Tasks"},
        "TASKLIST:NO_TASKS": {"EN": "No tasks. Why not create one?"},
        "TASKLIST:BACK":     {"EN": "Home"},
        "NO_ONE":            {"EN": "No one"},
        "TO_%PERSON%":       {"EN": "To: %PERSON%"},
        "FROM_%PERSON%":     {"EN": "From: %PERSON%"}

    });

    module.exports = function taskListTemplate(v, c, map, session, networkStatus) {
        var h = _y.h;
        return [
            //
            // navigation bar; includes title
            h.el("div.ui-navigation-bar",
                [
                    h.el("div.ui-bar-button-group ui-align-left", [
                            h.el("div.ui-bar-button ui-back-button ui-tint-color", _y.T("TASKLIST:BACK"), {
                                hammer: {
                                    tap:    {handler: c.goBack},
                                    hammer: hammer
                                }
                            })]
                    ),
                    h.el("div.ui-title", _y.T("TASKLIST:TITLE")),
                    h.el("div.ui-bar-button-group ui-align-right",
                        networkStatus ? (
                            [
                                h.el("div.ui-bar-button ui-glyph ui-background-tint-color ui-glyph-gear",
                                    {
                                        hammer: {
                                            tap:    {handler: c.chooseFilter},
                                            hammer: hammer
                                        }
                                    }),
                                h.el("div.ui-bar-button ui-glyph ui-background-tint-color ui-glyph-plus",
                                    {
                                        hammer: {
                                            tap:    {handler: c.createTask},
                                            hammer: hammer
                                        }
                                    })
                            ]) : (
                            undefined
                        )
                    )
                ]
            ),
            // key bar
            colorKeyBarTemplate(),
            //
            // scroll container containing login form and text; avoid the navigation bar
            h.el("div.ui-scroll-container",
                networkStatus ? (
                    session ? (
                        (v.tasks && v.tasks.getCount() > 0) ? (
                            h.el("ul.ui-list ui-avoid-navigation-bar",
                                v.tasks.items.map(function (task) {
                                    if (((v.filter === "my-tasks") && (task.assignedTo === GLOBALS.session.personId)) ||
                                        ((v.filter === "other-tasks") && (task.assignedTo !== GLOBALS.session.personId))) {
                                        return taskListItemTemplate(task, v.people, c.editTask);
                                    } else {
                                        return undefined;
                                    }
                                }))
                        ) : (
                            h.el("div.noItems ui-avoid-navigation-bar", {
                                bind: {
                                    object:  v,
                                    keyPath: "message"
                                }
                            })
                        )
                    ) : (
                        h.el("div.needAuth ui-avoid-navigation-bar", _y.T("NEEDS_AUTH"))
                    )
                ) : (
                    h.el("div.noNetwork ui-avoid-navigation-bar", _y.T("NO_NETWORK"))
                )
            )
        ];
    }
});
