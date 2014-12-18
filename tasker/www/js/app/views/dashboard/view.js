/**
 *
 * dashboard view
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
        dashboardTemplate = require("./template"),
        GLOBALS = require("app/lib/globals"),
        Task = require("app/models/task/model"),
        _className = "DashboardView";

    /** @typedef {{inProgress: number, onHold: number, complete: number, unknown: number }} Stat */
    /**
     * Make a statistics object
     * @param options
     * @returns {Stat}
     */
    function makeStat(options) {
        var stat = {
            inProgress: 0,
            onHold:     0,
            complete:   0,
            unknown:    1
        };

        if (options && options.inProgress) {
            stat.inProgress = options.inProgress;
        }
        if (options && options.onHold) {
            stat.onHold = options.onHold;
        }
        if (options && options.complete) {
            stat.complete = options.complete;
        }
        if (options && options.unknown) {
            stat.unknown = options.unknown;
        }

        return stat;
    }

    module.exports = function DashboardView() {
        var self = new _y.UI.ViewContainer();
        self.subclass(_className);

        /**
         * @property tasks
         * @type Tasks
         * @observable
         */
        self.defineObservableProperty("tasks", {default: null});


        /**
         * @property statsForMe
         * @type {{inProgress, onHold, complete, unknown}}
         */
        self.defineObservableProperty("statsForMe", {default: makeStat()});

        /**
         * @property statsForOthers
         */
        self.defineObservableProperty("statsForOthers", {default: makeStat()});

        /**
         * Handle log in/out
         * @param e
         */
        self.doLogInOut = function doLogInOut(e) {
            if (GLOBALS.session) {
                GLOBALS.events.emit("APP:logout");
            } else {
                GLOBALS.events.emit("APP:needsLogin");
            }
        };

        /**
         * Ask the app to show tasks I own
         * @method showMyTasks
         */
        self.showMyTasks = function showMyTasks() {
            GLOBALS.events.emit("APP:NAV:viewTasks", ["my-tasks"]);
        };

        /**
         * Ask the app to show tasks assigned to others
         * @method showOtherTasks
         */
        self.showOtherTasks = function showOtherTasks() {
            GLOBALS.events.emit("APP:NAV:viewTasks", ["other-tasks"]);
        };
        /**
         * @method render
         * Render the dashboard template
         */
        self.override(function render() {
            return dashboardTemplate(self, self, {}, GLOBALS.session, GLOBALS.checkNetworkAvailable());
        });

        /**
         * @method calculateStatistics
         * Calculates the statistics for our tasks
         */
        self.calculateStatistics = function calculateStatistics() {
            var tasksForMe = makeStat(),
                tasksForOthers = makeStat();
            self.tasks.items.forEach(function calcStats(task) {
                var statsObject;
                if (task.assignedTo === GLOBALS.session.personId) {
                    // the task is mine
                    statsObject = tasksForMe;
                } else {
                    statsObject = tasksForOthers;
                }
                switch (task.status) {
                    case Task.DESCRIPTION_CODE.inProgress:
                        statsObject.inProgress++;
                        break;
                    case Task.DESCRIPTION_CODE.onHold:
                        statsObject.onHold++;
                        break;
                    case Task.DESCRIPTION_CODE.complete:
                        statsObject.complete++;
                        break;
                    case Task.DESCRIPTION_CODE.deleted:
                        break;
                }
            });
            [tasksForMe, tasksForOthers].forEach(function calcAvg(stat) {
                var total = stat.inProgress + stat.onHold + stat.complete;
                if (total > 0) {
                    stat.inProgress = stat.inProgress / total;
                    stat.onHold = stat.onHold / total;
                    stat.complete = stat.complete / total;
                    stat.unknown = 1 - (stat.inProgress + stat.onHold + stat.complete);
                } else {
                    stat.unknown = 1;
                }
                console.log(stat);
            });
            self.statsForMe = tasksForMe;
            self.statsForOthers = tasksForOthers;
            self.renderToElement();
        };

        /**
         * @method getData
         * Request the tasks data from the store
         */
        self.getData = function getData() {
            if (GLOBALS.session) {
                GLOBALS.store.getTasks()
                    .then(function processTasks(tasks) {
                        self.tasks = tasks;
                        self.calculateStatistics();
                    })
                    .done();
            } else {
                self.renderToElement();
            }
        };

        /**
         * Initialize the view
         * @method init
         * @param {*} theParentElement
         */
        self.override(function init(theParentElement) {
            self.$super(undefined, "div", "dashboardView ui-container", theParentElement);
            GLOBALS.events.on("login:*", self.getData);
            GLOBALS.events.on("network*", self.renderToElement);
            self.on("viewDidAppear", self.getData);
            self.on("viewWasPopped", self.destroy);
            return self;
        });

        /**
         * Initialize the view (with options)
         * @method initWithOptions
         * @param options
         */
        self.override(function initWithOptions(options) {
            var theParentElement;
            if (options !== undefined) {
                if (options.parent !== undefined) {
                    theParentElement = options.parent;
                }
            }
            return self.init(theParentElement);
        });

        self.override(function destroy() {
            GLOBALS.events.off("login:*", self.getData);
            GLOBALS.events.off("network*", self.renderToElement);
            self.off("viewDidAppear", self.getData);
            self.off("viewWasPopped", self.destroy);
            self.$super();
        });

        // boilerplate for auto init
        self._autoInit.apply(self, arguments);

        return self;
    };
});
