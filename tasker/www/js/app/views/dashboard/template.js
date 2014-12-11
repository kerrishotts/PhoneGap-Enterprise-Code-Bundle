/**
 *
 * dashboard template
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
        colorKeyBarTemplate = require("app/templates/colorKeyBarTemplate"),
        taskStatsTemplate = require("app/templates/taskStatsTemplate");

    _y.addTranslations({
        "TASKER":           {"EN": "Tasker"},
        "DASHBOARD:TITLE":  {"EN": "Dashboard"},
        "DASHBOARD:LOGIN":  {"EN": "Log in"},
        "DASHBOARD:LOGOUT": {"EN": "Log out"}
    });
    /**
     * @method dashboardTemplate
     * @param {*} v      view to bind to
     * @param {*} c      controller
     * @param {*} map
     */
    module.exports = function dashboardTemplate(v, c, map) {
        var h = _y.h;
        return [
            //
            // navigation bar; includes title
            h.el("div.ui-navigation-bar",
                [h.el("div.ui-title", _y.T("DASHBOARD:TITLE")),
                    h.el("div.ui-bar-button-group ui-align-right",
                        h.el("div.ui-bar-button ui-tint-color", _y.T("DASHBOARD:LOGIN"),
                            {
                                hammer: {
                                    tap:    {handler: c.doLogInOut},
                                    hammer: hammer
                                }
                            })
                    )
                ]
            ),
            // key bar
            colorKeyBarTemplate(),
            //
            // scroll container containing login form and text; avoid the navigation bar
            h.el("div.ui-scroll-container",
                h.el("ul.ui-list ui-avoid-navigation-bar", [
                    h.el("li.ui-list-heading",
                        h.el("div.ui-list-item-flex-contents",
                            h.el("div.ui-label", "Tasks Owned By Me")
                        )),
                    taskStatsTemplate({inProgress: 0.12, onHold: 0.25, complete: 0.63, unknown: 0.0}),
                    h.el("li.ui-list-heading",
                        h.el("div.ui-list-item-flex-contents",
                            h.el("div.ui-label", "Tasks Assigned to Others")
                        )),
                    taskStatsTemplate({inProgress: 0.12, onHold: 0.0, complete: 0.25, unknown: 0.63})
                ])
            )
        ];
    }
});
