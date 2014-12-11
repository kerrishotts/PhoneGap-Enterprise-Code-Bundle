/**
 *
 * color key bar template
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
        "KEY:INPROGRESS": {"EN": "In Progress"},
        "KEY:ONHOLD":     {"EN": "On Hold"},
        "KEY:COMPLETE":   {"EN": "Complete"}
    });
    function colorKeyBarTemplate() {
        var h = _y.h;
        return h.el("div.color-key-bar",
            [
                h.el("span.inProgress", _y.T("KEY:INPROGRESS")),
                h.el("span.onHold", _y.T("KEY:ONHOLD")),
                h.el("span.complete", _y.T("KEY:COMPLETE"))
            ]);
    }

    module.exports = colorKeyBarTemplate;
});
