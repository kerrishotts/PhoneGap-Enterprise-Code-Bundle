/**
 *
 * main.js
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
    /**
     * stores our global event listeners
     */
    var globalEventListeners = {};

    /**
     * Adds a listener for our global events
     * @param event {String} The event name to add (case-insensitive)
     * @param listener {Function} the listener; receives the name of the event
     */
    function addGlobalEventListener(event, listener) {
        var EVENT = event.toUpperCase();
        if (typeof globalEventListeners[EVENT] === "undefined") {
            globalEventListeners[EVENT] = [];
        }
        globalEventListeners[EVENT].push(listener);
    }
    /**
     * Removes a listener (if previously added) from a global event
     * @param event {String} the event name (case-insensitive)
     * @param listener {Function} the listener to remove
     */
    function removeGlobalEventListener(event, listener) {
        var EVENT = event.toUpperCase();
        var i = -1;
        if (typeof globalEventListeners[EVENT] !== "undefined") {
            i = globalEventListeners[EVENT].indexOf(listener);
            if (i > -1) {
                globalEventListeners[EVENT].splice(i, 1);
            }
        }
    }
    /**
     * Dispatches a global event asynchronously unless sync is true.
     * @param event {String} the event name (case-insensitive)
     * @param [sync] {Boolean} if true, dispatch synchronously, otherwise async.
     */
    function dispatchGlobalEvent(event, sync) {
        var EVENT = event.toUpperCase();
        var doSynchronously = false;
        if (typeof sync !== "undefined") {
            doSynchronously = sync;
        }
        if (typeof globalEventListeners[EVENT] !== "undefined") {
            globalEventListeners[EVENT].forEach(function dispatchToListener(listener) {
                if (doSynchronously) {
                    try {
                        listener(EVENT);
                    } catch (err) {
                        console.log("dispatchGlobalEvent caught error: " + JSON.stringify(err));
                    }
                } else {
                    setTimeout(function asyncDispatch() {
                        listener(EVENT);
                    }, 0);
                }
            });
        }
    }

    module.exports = {
        on:                        addGlobalEventListener,
        off:                       removeGlobalEventListener,
        emit:                      dispatchGlobalEvent,
        addGlobalEventListener:    addGlobalEventListener,
        removeGlobalEventListener: removeGlobalEventListener,
        dispatchGlobalEvent:       dispatchGlobalEvent
    }

});
