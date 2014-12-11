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
        _className = "DashboardView";

    module.exports = function DashboardView() {
        var self = new _y.UI.ViewContainer();
        self.subclass(_className);

        /**
         * Handle log in/out
         * @param e
         */
        self.doLogInOut = function doLogInOut(e) {
            _y.UI.globalNotifications.emit("APP:needsLogin");
        };

        /**
         * @method render
         * Render the dashboard template
         */
        self.override(function render() {
            return dashboardTemplate(self, self, {});
        });

        /**
         * Initialize the view
         * @method init
         * @param {*} theParentElement
         */
        self.override(function init(theParentElement) {
            return self.$super(undefined, "div", "dashboardView ui-container", theParentElement);
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

        // boilerplate for auto init
        self._autoInit.apply(self, arguments);

        return self;
    };
});
