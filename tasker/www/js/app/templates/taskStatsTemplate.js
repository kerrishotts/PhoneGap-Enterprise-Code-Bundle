/**
 *
 * task stats template
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
define( [ "yasmf", "hammer" ], function ( _y, hammer ) {
  "use strict";
  function taskStatsTemplate( stats, tapHandler ) {
    var h = _y.h;
    return h.el( "li.ui-list-item",
                 [
                   h.el( "div.ui-list-item-flex-contents", { hammer: { tap: { handler: tapHandler }, hammer: hammer } },
                         [
                           h.el( "div.task-stat-part inProgress", _y.PCT( stats.inProgress,0 ),
                                 { styles: { width: "" + (stats.inProgress*100) + "%" } } ),
                           h.el( "div.task-stat-part onHold", _y.PCT( stats.onHold, 0 ),
                                 { styles: { width: "" + (stats.onHold*100) + "%" } } ),
                           h.el( "div.task-stat-part complete", _y.PCT( stats.complete, 0 ),
                                 { styles: { width: "" + (stats.complete*100) + "%" } } ),
                           h.el( "div.task-stat-part unknown", "",
                                 { styles: { width: "" + (stats.unknown*100) + "%" } } ),
                           h.el( "div.ui-indicator ui-arrow-direction-right" )
                         ] )
                 ] );
  }

  return taskStatsTemplate;
} );
