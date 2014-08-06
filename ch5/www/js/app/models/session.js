define ( [ "app/lib/objUtils", "../lib/cryptojs" ], function ( objUtils, CryptoJS) {
  function Session ( data ) {
    if (typeof data !== "undefined") {
      this.sessionId = data.sessionId;
      this.userId = data.userId;
      this.sessionSalt = data.sessionSalt;
      this.nextIncompleteToken = data.nextToken;
    }
  }

  Session.prototype.computeNextToken = function () {
    var token1 = this.nextIncompleteToken.substr(0,256);
    var token2 = this.nextIncompleteToken.substr(256,256);
    var token2H = CryptoJS.PBKDF2( token2, this.sessionSalt,
                                   {keySize: 32, iterations: 256}).toString(CryptoJS.enc.Hex).toUpperCase();
    return token1+token2H;
  };

  return Session;
});