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

//
// dependencies
//
var Errors = require( "../../errors" );

var TASK_STATUS = {
  "inProgress": "I",
  "complete": "C",
  "onHold": "H",
  "deleted": "X"
};


/**
 * Task - Returns a new task with the properties set to the specified values
 *        or default values. Data source is also set so that changes can
 *        be propagated back to the database
 *
 * @param  {*} taskOptions object containing values to assign
 * @return {Task}          A task
 */
function Task( taskProperties ) {
  "use strict";
  var defaultTask = {
    "id": undefined,
    "title": "",
    "description": "",
    "pctComplete": 0,
    "status": TASK_STATUS.inProgress,
    "owner": undefined,
    "assignedTo": undefined,
    "changeDate": new Date(),
    "changeUser": undefined
  };

  if ( typeof taskProperties !== "undefined" ) {
    for ( var prop in defaultTask ) {
      if ( defaultTask.hasOwnProperty( prop ) ) {
        if ( typeof taskProperties[ prop ] !== "undefined" ) {
          this[ prop ] = taskProperties[ prop ];
        } else {
          this[ prop ] = defaultTask[ prop ];
        }
      }
    }
  }
}

Task.prototype.copy = function() {
  return new Task( this );
};

function TaskReader( dataSource ) {
  "use strict";
  this._db = dataSource;
}

TaskReader.prototype.get = function( taskId, userId, next ) {
  var db = this._db;
  db.query( "SELECT * FROM table(tasker.task_mgmt.get_task(:1,:2))", [ taskId, userId ],
    function( err, results ) {
      if ( err ) {
        return next( new Error( err ) );
      }
      if ( results.length === 0 ) {
        return next( Errors.HTTP_NotFound() );
      }
      return next( new Task( results[ 0 ] ) );
    } );
};

function TaskWriter( dataSource ) {
  "use strict";
  this._db = dataSource;
}

TaskWriter.prototype.put = function( oldTask, newTask, userId, next ) {
  var db = this._db;
  if ( newTask.status !== oldTask.status ) {
    db.execute( "tasker.task_mgmt.update_task_status(:1,:2,:3)", [ oldTask.id, newTask.status,
        userId
      ],
      function( err, results ) {
        if ( err ) {
          return next( new Error( err ) );
        }
        if ( newTask.pctComplete !== oldTask.pctComplete ) {
          db.execute( "tasker.task_mgmt.update_task_percentage(:1,:2,:3)", [ oldTask.id, newTask.pctComplete,
              userId
            ],
            function( err, results ) {
              if ( err ) {
                return next( new Error( err ) );
              }
              return next();
            } );
        } else {
          return next();
        }
      } );
  }
};

Task.prototype.getTasks = function( query ) {

};

Task.prototype.createTask = function() {

};

module.exports = Task;