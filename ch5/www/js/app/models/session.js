define ( [ "app/lib/objUtils", "../lib/cryptojs" ], function ( objUtils, CryptoJS) {
  function Session ( data ) {
    if (typeof data !== "undefined") {
      this.sessionId = data.sessionId;
      this.userId = data.userId;
      this.sessionSalt = data.sessionSalt;
      this.nextIntermediateToken = data.nextIntermediateToken;
    }
  }

  Session.prototype.computeNextToken = function () {
    var token1 = this.nextIntermediateToken.substr(0,256);
    var token2 = this.nextIntermediateToken.substr(256,256);
    var token2H = CryptoJS.PBKDF2( token2, this.sessionSalt,
                                   {keySize: 32, iterations: 256}).toString(CryptoJS.enc.Hex).toUpperCase();
    return token1+token2H;
  };

  return Session;
});