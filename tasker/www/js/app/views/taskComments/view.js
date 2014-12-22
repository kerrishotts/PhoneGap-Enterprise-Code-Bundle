/**
 *
 * task comments view
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
        viewTemplate = require("./template"),
        GLOBALS = require("app/lib/globals"),
        _className = "TaskListView";

    module.exports = function TaskCommentsView() {
        var self = new _y.UI.ViewContainer();
        self.subclass(_className);

        /**
         * @property tasks
         * @type Tasks
         * @observable
         */
        self.defineObservableProperty("tasks", {default: null});
        self.defineObservableProperty("people", {default: null});

        /**
         * @property filter
         * @type string
         */
        self.defineObservableProperty("filter", {default: "my-tasks"});

        /**
         * @property message
         * @type string
         */
        self.defineObservableProperty("message", {default: _y.T("TASKLIST:NO_TASKS")});

        self.goBack = function goBack() {
            GLOBALS.events.emit("APP:NAV:back");
        };

        self.chooseFilter = function chooseFilter() {
            var alert = new _y.UI.Alert({
                title:       "Select Filter",
                text:        "Please select a filter from the following list:",
                wideButtons: true,
                promise:     true,
                buttons:     [
                    _y.UI.Alert.button(_y.T("CATEGORY:ASSIGNED_TO_ME")),
                    _y.UI.Alert.button(_y.T("CATEGORY:ASSIGNED_TO_OTHERS")),
                    _y.UI.Alert.button(_y.T("CANCEL"), {
                        type: "bold",
                        tag:  -1
                    })
                ]
            });
            alert.show()
                .then(function (idx) {
                    self.filter = ["my-tasks", "other-tasks"][idx]
                })
                .done();
        };

        /**
         * Ask the app to view/edit a task
         * @method editTask
         */
        self.editTask = function editTask() {
            var taskId = this.getAttribute("data-task-id");
            GLOBALS.events.emit("APP:NAV:editTask", [taskId]);
        };

        /**
         * Ask the app to create a task
         * @method createTask
         */
        self.createTask = function createTask() {
            GLOBALS.events.emit("APP:NAV:createTask");
        };

        /**
         * @method render
         * Render the dashboard template
         */
        self.override(function render() {
            return viewTemplate(self, self, {}, GLOBALS.session, GLOBALS.checkNetworkAvailable());
        });

        /**
         * @method getData
         * Request the tasks data from the store
         */
        self.getData = function getData() {
            if (GLOBALS.session) {
                self.message = _y.T("LOADING");
                GLOBALS.store.getPeople()
                    .then(function processPeople(people) {
                        self.people = people;
                    })
                    .then(function () {
                        return GLOBALS.store.getTasks();
                    })
                    .then(function processTasks(tasks) {
                        self.tasks = tasks;
                        if (self.tasks.count === 0) {
                            self.message = _y.T("TASKLIST:NO_TASKS");
                        }
                        self.renderToElement();
                    })
                    .done();
            } else {
                self.message = _y.T("TASKLIST:NO_TASKS");
                self.renderToElement();
            }
        };

        /**
         * Initialize the view
         * @method init
         * @param {*} theParentElement
         */
        self.override(function init(theParentElement, filter) {
            self.$super(undefined, "div", "taskListView ui-container", theParentElement);
            GLOBALS.events.on("login:*", self.getData);
            GLOBALS.events.on("network*", self.renderToElement);
            self.on("viewDidAppear", self.getData);
            self.on("viewWasPopped", self.destroy);
            if (filter) {
                self.filter = filter;
            }
            self.on("filterChanged", self.getData);
            return self;
        });

        /**
         * Initialize the view (with options)
         * @method initWithOptions
         * @param options
         */
        self.override(function initWithOptions(options) {
            var theParentElement, filter;
            if (options !== undefined) {
                if (options.parent !== undefined) {
                    theParentElement = options.parent;
                }
                if (options.filter !== undefined) {
                    filter = options.filter;
                }
            }
            return self.init(theParentElement, filter);
        });

        self.override(function destroy() {
            GLOBALS.events.off("login:*", self.getData);
            GLOBALS.events.off("network*", self.renderToElement);
            self.off("filterChanged", self.getData);
            self.off("viewDidAppear", self.getData);
            self.off("filterChanged", self.getData);
            self.off("viewWasPopped", self.destroy);
            self.$super();
        });

        // boilerplate for auto init
        self._autoInit.apply(self, arguments);

        return self;
    };
});
