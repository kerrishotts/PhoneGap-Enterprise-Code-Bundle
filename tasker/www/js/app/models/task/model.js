define(function (require, exports, module) {
    "use strict";

    var ObjUtils = require("app/lib/objUtils");

    var TASK_DESCRIPTION_CODE = {
            "inProgress": "I",
            "complete":   "C",
            "onHold":     "H",
            "deleted":    "X"
        },
        TASK_CODE_DESCRIPTION = {
            "I": "inProgress",
            "C": "complete",
            "H": "onHold",
            "X": "deleted"
        },
        TASK_ENUM = [
            {title: "In Progress", value: "I"},
            {title: "On Hold", value: "H"},
            {title: "Complete", value: "C"},
            {title: "Deleted", value: "X"}
        ];

    function Task(data) {
        var defaultTask = {
            id: null,
            title: "",
            description: "",
            pctComplete: 0,
            status: TASK_DESCRIPTION_CODE.inProgress,
            owner: null,
            assignedTo: null,
            changeDate: new Date(),
            changeUser: null
        };

        ObjUtils.mergeInto(defaultTask, data, this);
        if (!(this.changeDate instanceof Date)) {
            this.changeDate = new Date(this.changeDate);
        }
    }

    Task.DESCRIPTION_CODE = TASK_DESCRIPTION_CODE;
    Task.CODE_DESCRIPTION = TASK_CODE_DESCRIPTION;
    Task.ENUM = TASK_ENUM;

    module.exports = Task;
});
