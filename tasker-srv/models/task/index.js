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
/*eslint no-underscore-dangle:0*/
var objUtils = require( "../../obj-utils" );

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
  };

/**
 * Task - Returns a new task with the properties set to the specified values
 *        or default values. Data source is also set so that changes can
 *        be propagated back to the database
 *
 * @param  {*} taskProperties object containing values to assign
 * @return {Task}              A task
 */
function Task( taskProperties ) {
  "use strict";
  var defaultTask = {
    "id":          undefined,
    "title":       "",
    "description": "",
    "pctComplete": 0,
    "status":      TASK_DESCRIPTION_CODE.inProgress,
    "owner":       undefined,
    "assignedTo":  undefined,
    "changeDate":  new Date(),
    "changeUser":  undefined
  };
  var dbFieldMap = {
    "ID":           { key: "id" },
    "TITLE":        { key: "title" },
    "DESCRIPTION":  { key: "description" },
    "PCT_COMPLETE": { key: "pctComplete" },
    "STATUS":       { key: "status" },
    "OWNER":        { key: "owner" },
    "ASSIGNED_TO":  { key: "assignedTo" },
    "CHANGE_DATE":  { key: "changeDate", cvt: function ( v ) { return new Date( v ); } },
    "CHANGE_USER":  { key: "changeUser" }
  };

  return objUtils.mergeIntoUsingMap( taskProperties, defaultTask, dbFieldMap );
}

Task.prototype.copy = function () {
  return new Task( this );
};

Task.DESCRIPTION_CODE = TASK_DESCRIPTION_CODE;
Task.CODE_DESCRIPTION = TASK_CODE_DESCRIPTION;

module.exports = Task;