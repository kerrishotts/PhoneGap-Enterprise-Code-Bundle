/**
 *
 * task template
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
        hammer = require("hammer");

    _y.addTranslations({
        "TASKVIEW:TITLE":              {"EN": "Task"},
        "TASKVIEW:NO_TASK":            {"EN": "The requested task could not be found."},
        "TASKVIEW:BACK":               {"EN": "Tasks"},
        "TASKVIEW:SAVE":               {"EN": "Save"},
        "TASKVIEW:SAVED":              {"EN": "Saved"},
        "TASKVIEW:ERROR":              {"EN": "Error"},
        "TASKVIEW:CREATE":             {"EN": "Create"},
        "TASKVIEW:FIELD:TITLE":        {"EN": "Title"},
        "TASKVIEW:FIELD:DESCRIPTION":  {"EN": "Description"},
        "TASKVIEW:FIELD:PCT_COMPLETE": {"EN": "% Complete"},
        "TASKVIEW:FIELD:STATUS":       {"EN": "Status"},
        "TASKVIEW:FIELD:OWNER":        {"EN": "Owned By"},
        "TASKVIEW:FIELD:ASSIGNED_TO":  {"EN": "Assigned To"},
        "TASKVIEW:FIELD:CHANGE_DATE":  {"EN": "Changed On"},
        "TASKVIEW:FIELD:CHANGE_USER":  {"EN": "Changed By"}
    });

    module.exports = function taskTemplate(v, c, map, session, networkStatus, task, taskStatuses, people, personId) {
        var h = _y.h;
        return [
            _y.UI.templates.uiNavigationBar({
                title:      _y.T("TASKVIEW:TITLE"),
                leftGroup:  [_y.UI.templates.uiBarButton({
                    text:   _y.T("TASKVIEW:BACK"), backButton: true,
                    hammer: {
                        tap:    {handler: c.goBack},
                        hammer: hammer
                    }
                })],
                rightGroup: networkStatus && session ? [
                    _y.UI.templates.uiBarButton({
                        glyph:  "chat-bubble-dots",
                        hammer: {tap: {handler: c.viewComments}, hammer: hammer}
                    }),
                    _y.UI.templates.uiBarButton({
                        text:   _y.T((task && task.id !== null ? "TASKVIEW:SAVE" : "TASKVIEW:CREATE")),
                        hammer: {
                            tap:    {handler: c.saveTask},
                            hammer: hammer
                        }
                    })
                ] : undefined
            }),
            //
            // scroll container containing the task form; if we really wanted to be HATEOAS compliant, we should
            // generate this dynamically based on a model retrieved from the server. That's a bit overkill for this
            // demo, but it would potentially allow for model changes to be propagated automatically down to the client
            // without rebuilding the app.
            h.el("div.ui-scroll-container",
                networkStatus ? (
                    session ? (
                        (v.task) ? (
                            h.el("form.vertical-layout ui-avoid-navigation-bar", [
                                // title
                                h.el("div.field", [
                                    h.label(
                                        h.span(_y.T("TASKVIEW:FIELD:TITLE") + ":"),
                                        h.el("input?type=text", {
                                            attrs: {
                                                required:  "required",
                                                minlength: 1,
                                                maxlength: 255,
                                                disabled:  (task.id !== null) ? "disabled" : undefined
                                            },
                                            bind:  {object: task, keyPath: "title", keyType: "string"}
                                        })
                                    )
                                ]),
                                // description
                                h.el("div.field", [
                                    h.label(
                                        h.span(_y.T("TASKVIEW:FIELD:DESCRIPTION") + ":"),
                                        h.el("textarea", {
                                            attrs: {
                                                required: "required", minlength: 1, maxlength: 4000,
                                                disabled: (task.id !== null) ? "disabled" : undefined
                                            },
                                            bind:  {object: task, keyPath: "description", keyType: "string"}
                                        })
                                    )
                                ]),
                                // pct complete
                                h.el("div.field", [
                                    h.label(
                                        h.span(_y.T("TASKVIEW:FIELD:PCT_COMPLETE") + ":"),
                                        h.el("input?type=range", {
                                            attrs: {
                                                min:      0, max: 100, step: 0.1,
                                                disabled: (task.id === null) ? "disabled" : undefined
                                            },
                                            bind:  {object: task, keyPath: "pctComplete", keyType: "number"}
                                        })
                                    )
                                ]),
                                // status
                                h.el("div.field", [
                                    h.label(
                                        h.span(_y.T("TASKVIEW:FIELD:STATUS") + ":"),
                                        h.el("select", {
                                                attrs: {
                                                    required: "required",
                                                    disabled: (task.id === null) ? "disabled" : undefined
                                                },
                                                bind:  {object: task, keyPath: "status", keyType: "string"}
                                            }, taskStatuses.map(function makeOption(item) {
                                                return h.option(item.value, item.title);
                                            })
                                        )
                                    )
                                ]),
                                // assigned to
                                h.el("div.field", [
                                    h.label(
                                        h.span(_y.T("TASKVIEW:FIELD:ASSIGNED_TO") + ":"),
                                        h.el("select", {
                                            attrs: {
                                                disabled: (task.id === null || task.owner !== GLOBALS.session.personId ) ? "disabled" : undefined
                                            },
                                            bind:  {object: task, keyPath: "assignedTo", keyType: "number"}
                                        }, people && people.items ? people.items.map(function makeOption(person) {
                                            return ( person.administeredBy === task.owner || person.id === task.assignedTo || person.id === personId ) ?
                                                h.option(person.id, person.fullName)
                                                : undefined;
                                        }).concat([h.option("", _y.T("NO_ONE"))]) : undefined)
                                    )
                                ]),
                                // owner
                                h.el("div.field", [
                                    h.label(
                                        h.span(_y.T("TASKVIEW:FIELD:OWNER") + ":"),
                                        h.el("select", {
                                            attrs: {required: "required", disabled: "disabled"},
                                            bind:  {object: task, keyPath: "owner", keyType: "number"}
                                        }, people && people.items ? people.items.map(function makeOption(person) {
                                            return h.option(person.id, person.fullName);
                                        }).concat([h.option("", _y.T("NO_ONE"))]) : undefined)
                                    )
                                ]),
                                // change date
                                h.el("div.field", [
                                    h.label(
                                        h.span(_y.T("TASKVIEW:FIELD:CHANGE_DATE") + ":"),
                                        h.el("input?type=date", {
                                            attrs: {readonly: "readonly", disabled: "disabled"},
                                            bind:  {object: task, keyPath: "changeDate", keyType: "date"}
                                        })
                                    )
                                ]),
                                // change user
                                h.el("div.field", [
                                    h.label(
                                        h.span(_y.T("TASKVIEW:FIELD:CHANGE_USER") + ":"),
                                        h.el("input?type=text", {
                                            attrs: {readonly: "readonly", disabled: "disabled"},
                                            bind:  {object: task, keyPath: "changeUser", keyType: "string"}
                                        })
                                    )
                                ])
                            ])
                        ) : (
                            // no task; display a nice message (bound)
                            h.el("div.noItems ui-avoid-navigation-bar", {
                                bind: {
                                    object:  v,
                                    keyPath: "message"
                                }
                            })
                        )
                    ) : (
                        // if we need authentication, say so
                        h.el("div.needAuth ui-avoid-navigation-bar", _y.T("NEEDS_AUTH"))
                    )
                ) : (
                    // hide form if no network is available
                    h.el("div.noNetwork ui-avoid-navigation-bar", _y.T("NO_NETWORK"))
                )
            )
        ];
    }
});
