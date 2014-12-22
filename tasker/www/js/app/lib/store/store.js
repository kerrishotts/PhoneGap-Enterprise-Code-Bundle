/**
 *
 * store.js
 * @author Kerri Shotts
 * @version 3.0.0
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
/*global define, device, PKLocalStorage*/
define(function (require, exports, module) {
    "use strict";

    var
        backend = require("./backend"),
        mock = require("./mock");

    function doAction ( task, options ) {
        var whichOne;
        whichOne = this.MOCK ? mock : backend;
        if (whichOne[task]) {
            return whichOne[task](options);
        } else {
            throw new Error ("Unsupported action", task);
        }
    }

    var store = {
        MOCK:      false
    };

    // partially apply the methods that exist on the backend to the store (we assume the mock has them too)
    var methods = Object.keys(backend);
    methods.forEach( function addMethod (methodName) {
        store[methodName] = doAction.bind(store, methodName);
        if (!mock[methodName]) {
            // we won't die, but let the console know
            console.info("Mock is missing action", methodName);
        }
    });

    module.exports = store;

});
