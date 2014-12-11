define(function (require, exports, module) {
    "use strict";

    function Session(data) {
        if (data !== undefined) {
            this.sessionId = data.sessionId;
            this.userId = data.userId;
            this.hmacSecret = data.hmacSecret;
            this.nextToken = data.nextToken;
        }
    }

    Session.prototype.setNextToken = function setNextToken(nextToken) {
        if (nextToken !== undefined && nextToken !== null) {
            this.nextToken = nextToken;
        }
    };

    module.exports = Session;
});
