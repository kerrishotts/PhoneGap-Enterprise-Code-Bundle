define( function () {
  "use strict";

  function Session( data ) {
    if ( data !== undefined ) {
      this.sessionId = data.sessionId;
      this.userId = data.userId;
      this.hmacSecret = data.hmacSecret;
    }
  }

  return Session;
} );
