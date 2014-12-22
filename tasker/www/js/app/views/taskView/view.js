/**
 *
 * task view
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
        Task = require("app/models/task/model"),
        _className = "TaskView";

    module.exports = function TaskView() {
        var self = new _y.UI.ViewContainer();
        self.subclass(_className);

        /**
         * @property task
         * @type Task
         * @observable
         */
        self.defineObservableProperty("task", {default: null});

        /**
         * @property people
         * @type Person
         * @observable
         */
        self.defineObservableProperty("people", {default: null});

        /**
         * @property taskId
         * @type number
         * @observable
         */
        self.defineObservableProperty("taskId", {default: null});

        /**
         * @property dirty
         * @type boolean
         */
        self.defineProperty("dirty", {default: false});

        /**
         * @property message
         * @type string
         */
        self.defineObservableProperty("message", {default: ""});

        /**
         * Go back; ask the user if they want to, though, if we're dirty
         */
        self.goBack = function goBack() {
            var alert;
            if (self.dirty) {
                alert = new _y.UI.Alert({
                    title:       "Unsaved Changes",
                    text:        "You have unsaved changes. Are you sure you want to go back? If you do, the changes will be lost.",
                    promise:     true,
                    wideButtons: true,
                    buttons:     [
                        _y.UI.Alert.button("Go back"),
                        _y.UI.Alert.button("Cancel", {
                            type: "bold",
                            tag:  -1
                        })
                    ]
                });
                alert.show()
                    .then(function goBack() {
                        GLOBALS.events.emit("APP:NAV:back");
                    })
                    .done();
            } else {
                GLOBALS.events.emit("APP:NAV:back");
            }
        };

        /**
         * Notify the user of a successful save by flashing the save button.
         */
        self.notifyUser = function notifyUser(msg) {
            var saveButton = self.element.$$(".ui-bar-button")[2];
            if (saveButton) {
                saveButton.textContent = _y.T(msg);
                setTimeout(function () {
                    saveButton.textContent = _y.T("TASKVIEW:SAVE");
                }, 3000);
            }
        };

        /**
         * Ask the app to save the task
         * @method editTask
         */
        self.saveTask = function saveTask() {
            if (self.taskId === null || self.taskId === undefined) {
                // need to create the task
                GLOBALS.store.createTask(self.task)
                    .then(function (r) {
                        self.dirty = false;
                        self.taskId = r._context["task-id"];
                        self.getData();
                    })
                    .catch(function () {
                        self.notifyUser("TASKVIEW:ERROR");
                    })
                    .done();
            } else {
                GLOBALS.store.patchTask(self.task)
                    .then(function () {
                        self.dirty = false;
                        self.notifyUser("TASKVIEW:SAVED");
                    })
                    .catch(function () {
                        self.notifyUser("TASKVIEW:ERROR");
                    })
                    .done();

            }
        };

        self.viewComments = function viewComments() {

        };

        /**
         * Set our dirty flag whenever a field changes
         */
        self.setDirty = function setDirty() {
            self.dirty = true;
        };

        /**
         * Clear any binds before re-rendering (or destroying)
         */
        self.clearBinds = function clearBinds() {
            if (self.task) {
                self.task.dataBindAllOff();
            }
        };

        /**
         * @method render
         * Render the dashboard template
         */
        self.override(function render() {
            return viewTemplate(self, self, {}, GLOBALS.session, GLOBALS.checkNetworkAvailable(), self.task,
                Task.ENUM, self.people, GLOBALS.session.personId);
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
                        console.log("getting task", self.taskId);
                        if (self.taskId !== null) {
                            return GLOBALS.store.getTask(self.taskId);
                        } else {
                            return new Task({owner: GLOBALS.session.personId, changeUser: GLOBALS.session.userId});
                        }
                    })
                    .then(function processTask(task) {
                        console.log(task);
                        self.clearBinds();
                        self.dirty = false;
                        self.task = _y.BaseObject.promote(task); // promote in order to observe changes on the object
                        if (!self.task && self.taskId !== null) {
                            self.message = _y.T("TASKVIEW:NO_TASK");
                        } else {
                            self.task.on("*Changed", self.setDirty);
                        }
                        self.renderToElement();
                    })
                    .done();
            } else {
                self.message = _y.T("NEEDS_AUTH");
                self.renderToElement();
            }
        };

        /**
         * Initialize the view
         * @method init
         * @param {*} theParentElement
         */
        self.override(function init(theParentElement, taskId) {
            self.$super(undefined, "div", "taskView ui-container", theParentElement);
            GLOBALS.events.on("login:*", self.getData);
            GLOBALS.events.on("network*", self.renderToElement);
            self.on("viewWasPushed", self.getData);
            self.on("viewWasPopped", self.destroy);
            self.on("willRender", self.clearBinds);
            if (taskId) {
                self.taskId = taskId;
            }
            return self;
        });

        /**
         * Initialize the view (with options)
         * @method initWithOptions
         * @param options
         */
        self.override(function initWithOptions(options) {
            var theParentElement, taskId;
            if (options !== undefined) {
                if (options.parent !== undefined) {
                    theParentElement = options.parent;
                }
                if (options.taskId !== undefined) {
                    taskId = options.taskId;
                }
            }
            return self.init(theParentElement, taskId);
        });

        /**
         * Clean up
         * @method destroy
         */
        self.override(function destroy() {
            self.clearBinds();
            if (self.task) {
                self.task.off("*Changed", self.setDirty);
            }
            self.off("willRender", self.clearBinds);
            GLOBALS.events.off("login:*", self.getData);
            GLOBALS.events.off("network*", self.renderToElement);
            self.off("viewWasPushed", self.getData);
            self.off("viewWasPopped", self.destroy);
            self.$super();
        });

        // boilerplate for auto init
        self._autoInit.apply(self, arguments);

        return self;
    };
});
