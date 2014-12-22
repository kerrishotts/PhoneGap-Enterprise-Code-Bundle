/**
 *
 * session.js
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
define(function (require, exports, module) {
    "use strict";

    function Session(data) {
        if (data !== undefined) {
            this.sessionId = data.sessionId;
            this.userId = data.userId;
            this.hmacSecret = data.hmacSecret;
            this.nextToken = data.nextToken;
            this.personId = data.personId;
        }
        this.save();
    }

    Session.prototype.save = function save() {
        //TODO: use keychain if available
        localStorage.setItem("auth", JSON.stringify(this));
    };

    Session.load = function load() {
        //TODO: use keychain if available
        return new Session(JSON.parse(localStorage.getItem("auth")));
    };

    Session.clear = function clear() {
        // TODO: use keychain
        localStorage.removeItem("auth");
        return null;
    };

    Session.prototype.setNextToken = function setNextToken(nextToken) {
        if (nextToken !== undefined && nextToken !== null & nextToken !== "") {
            this.nextToken = nextToken;
            this.save();
        }
    };

    module.exports = Session;
});