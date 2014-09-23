/*************************************************************
 * Boxcar
 * (C) Copyright 2014 Process One
 *
 * ALTERED BY KERRI SHOTTS FOR PHONEGAP / CORDOVA   08.31.2014
 * TO SUPPORT THE FOLLOWING FEATURES:
 * - need to be able to see the additional data sent with the
 *   push (such as object IDs)
 * - should be more resilient to missing data (like no
 *   sound field in the push)
 * - code formatting
 * - eliminate various errors and warnings
 * - better documentation for public methods
 * - bug fixes:
 *   - onerror was undefined in several places; turns out the
 *     order of the callbacks is different for SQL transactions
 *     vs executeSql methods. Fixed; data.onerror will now be
 *     called when a transaction fails.
 *   - specifying a udid would cause a failure response from
 *     boxcar because it was overwriting tags. Fixed.
 *   - If a sound wasn't specified, the notification wouldn't
 *     be fired. Fixed (sound is optional)
 *   - logging could not be disabled; fixed by adding a
 *     debug flag. true by default, but turn it to false to
 *     turn debugging off.
 *   - additional properties were not being passed to message
 *     handlers, nor were they being stored in the database.
 *     This required a modification to the pushes table --
 *     this code is almost certainly wrong for pre-existing
 *     installations -- to add a json field. This value is
 *     passed to the notification handler as well, and can
 *     be parsed for any additional information.
 *
 * TODO: It's conceivable that we'll run out of local database
 *       space if enough notifications are sent. There should
 *       probably be a purge mechanism in place to (at minimum)
 *       remove very old seen messages from the database.
 */
/*global device, module*/
var Boxcar = {
  /**
   * Determines whether or not debugging information is logged
   * to the console. Default is `true`, which is useful during
   * development, but this should be reset to `false` prior to
   * deploying to production.
   */
  debug: true,
  /**
   * If `debug` is `true`, logs the arguments to the console. If not,
   * it does nothing.
   * @private
   */
  _info: function() {
    if ( Boxcar.debug ) {
      var args = Array.prototype.slice.call( arguments, 0 );
      console.info.apply( console, args );
    }
  },
  /**
   * Initialize Boxcar push notifications
   *
   * data should look like this:
   * {
   *   clientKey: "...",                // your Access Key
   *   secret: "...",                   // your secret
   *   server: "https://boxcar-api.io"  // no trailing slash!
   * }
   *
   * @param {*} data     Method parameters
   */
  init: function( data ) {
    var verifyTo = {
      clientKey: 0,
      secret: 0,
      server: 0,
      richUrlBase: 0
    };
    // ensure that androidSenderID is passed when on Android platform
    if ( device.platform == 'android' || device.platform == 'Android' ) {
      verifyTo.androidSenderID = 0;
    }
    this._verifyArgs( data, verifyTo );
    this.server = data.server;
    this.clientKey = data.clientKey;
    this.secret = data.secret;
    this.androidSenderID = data.androidSenderID;
    this.richUrlBase = data.richUrlBase;
    this.initDb();
  },
  /**
   * Initializes the database. If the pushes table does not exist, it is
   * created.
   *
   * Note: if this is run on an existing app, this is almost certainly
   * certain to fail. You'll want to have appropriate logic to drop the
   * old table and recreate it, or alter the old table so that it matches
   * the new definition.
   */
  initDb: function() {
    if ( this.db ) {
      return;
    }
    try {
      this.db = window.openDatabase( "Boxcar", "", "Boxcar db", 1000000 );
      if ( this.db.version == "1.0" || !this.db.version || this.db.version == "1.1" ) {
        this.db.changeVersion( this.db.version, "2.0", function( tx ) {
          tx.executeSql( "CREATE TABLE IF NOT EXISTS pushes (" +
            "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
            "time INTEGER NOT NULL, body STRING NOT NULL," +
            "badge STRING NOT NULL, sound STRING ," +
            "richPush INTEGER NOT NULL, url STRING, flags INTEGER NOT NULL," +
            "json STRING NOT NULL);" );
          tx.executeSql( "CREATE INDEX pushes_on_time ON pushes (time);" );
        }, function( a ) {
          Boxcar._info( a );
        }, function( a ) {
          Boxcar._info( a );
        } );
      }
    } catch ( ex ) {}
  },
  /**
   * Registers a device with the suppide parameters. Data is a single object
   * that should look like this:
   *
   * {
   *   mode: "development",         // or "production"
   *   onsuccess: successCallback,  // success handler when device is registered
   *   onerror: errorCallback,      // called if an error occurs during registration
   *   onalert: alertCallback,      // called when a notification is received
   *   onnotificationclick: notificationClickCallback // called when a notice is clicked
   *   udid: device.uuid,           // optional, device UUID
   *   alias: "Bob's iPad",         // optional, human-readable device alias
   *   tags: [ "some_tag", ... ]    // optional, list of tags(channels) to subscribe to
   * }
   *
   * @param {*} data     Method parameters
   */
  registerDevice: function( data ) {
    var verifyArgs = {
      mode: 0,
      onsuccess: 0,
      onerror: 0
    };
    if ( !data.onalert && !data.onnotificationclick ) {
      verifyArgs.onalert = 0;
    }
    this._verifyArgs( data, verifyArgs );
    this._rdData = data;
    this.onalert = data.onalert;
    this.onnotificationclick = data.onnotificationclick;
    if ( device.platform == 'android' || device.platform == 'Android' ) {
      window.plugins.pushNotification.register( this._PNRegSuccess, this._PNRegError, {
        senderID: this.androidSenderID,
        ecb: "Boxcar.GCM_Listener",
        messageField: "aps-alert",
        msgcntField: "aps-badge",
        deliverAllPushes: true
      } );
    } else {
      window.plugins.pushNotification.register( function( arg ) {
        Boxcar._PNRegDone( arg );
      }, this._PNRegError, {
        "badge": "true",
        "sound": "true",
        "alert": "true",
        "ecb": "Boxcar.APN_Listener"
      } );
    }
  },
  /**
   * Unregisters the device. Data should contain the following:
   * {
   *   onsuccess: successCallback,   // notified when the device is unregistered
   *   onerror: errorCallback        // notified if an error occurs
   * }
   *
   * @param {*} data     Method parameters
   */
  unregisterDevice: function( data ) {
    this._verifyArgs( data, {
      onsuccess: 0,
      onerror: 0
    } );
    if ( !this.regid ) data.onsuccess();
    this._sendRequest( "DELETE", "/api/device_tokens/" + this.regid, {}, function() {
      window.plugins.pushNotification.unregister( data.onsuccess, data.onerror );
    }, data.onerror );
    this.regid = null;
  },
  /**
   * Retrieves received messages. Data should look like this:
   * {
   *   onsuccess: successCallback,   // notified for each received message
   *   onerror: errorCallback,       // notified if an error occurs
   *   before: time-value,           // optional, retrieves values before a given time
   *   after:  time-value,           // optional, retrieves values after a given time
   *   limit: limit,                 // optional, retrieves only the specified notices
   *   seen: boolean                 // optional, if false, returns only unseen notices
   * }
   *
   * @param {*} data     Method parameters
   */
  getReceivedMessages: function( data ) {
    this._verifyArgs( data, {
      onsuccess: 0,
      onerror: 0
    } );
    this.db.transaction( function( tx ) {
      var sql =
        "SELECT id, time, body, badge, sound, richPush, url, flags, json FROM pushes";
      var whereClauseAdded = false;
      var aClauseAdded = false;
      var args = [];
      if ( typeof data.before !== "undefined" ) {
        sql += ( whereClauseAdded ? "" : " WHERE " ) + " time < ?";
        if ( !whereClauseAdded ) {
          whereClauseAdded = true;
        }
        aClauseAdded = true;
        args.push( data.before );
      }
      if ( typeof data.after !== "undefined" ) {
        sql += ( whereClauseAdded ? "" : " WHERE " ) + ( aClauseAdded ? " AND " : "" ) +
          " time >= ?";
        if ( !whereClauseAdded ) {
          whereClauseAdded = true;
        }
        aClauseAdded = true;
        args.push( data.after );
      }
      if ( typeof data.seen !== "undefined" ) {
        sql += ( whereClauseAdded ? "" : " WHERE " ) + ( aClauseAdded ? " AND " : "" ) +
          " flags = ?";
        if ( !whereClauseAdded ) {
          whereClauseAdded = true;
        }
        aClauseAdded = true;
        args.push( data.seen ? 1 : 0 );
      }
      sql += " ORDER BY time DESC";
      if ( typeof data.limit !== "undefined" ) {
        sql += " LIMIT ?";
        args.push( data.limit );
      }
      tx.executeSql( sql, args, function( tx, results ) {
        var len = results.rows.length;
        var res = [];
        for ( var i = 0; i < len; i++ ) {
          var rp = results.rows.item( i ).richPush;
          if ( rp == "false" ) {
            rp = false;
          }
          res.push( {
            id: results.rows.item( i ).id,
            time: results.rows.item( i ).time,
            body: results.rows.item( i ).body,
            badge: results.rows.item( i ).badge,
            sound: results.rows.item( i ).sound,
            richPush: rp,
            url: results.rows.item( i ).url,
            seen: results.rows.item( i ).flags == 1,
            json: results.rows.item( i ).json
          } );
        }
        data.onsuccess( res );
      } );
    }, data.onerror, function() {} );
  },
  /**
   * Get a list of tags from the server that can be subscribed to.
   *
   * Data should look like this:
   * {
   *   onsuccess: successCallback,    // called with list of tags
   *   onerror: errorCallback         // called if an error occurs
   * }
   *
   * @param {*} data     Method parameters
   *
   */
  getTags: function( data ) {
    this._verifyArgs( data, {
      onsuccess: 0,
      onerror: 0
    } );
    if ( this._tags ) {
      data.onsuccess( this._tags );
    }
    this._sendRequest( "GET", "/api/tags", {}, function( recv ) {
      try {
        if ( recv === "" ) {
          Boxcar._tags = [];
        } else {
          Boxcar._tags = JSON.parse( recv ).ok;
        }
        data.onsuccess( Boxcar._tags );
      } catch ( ex ) {
        data.onerror( {
          error: "Can't parse response"
        } );
      }
    }, data.onerror );
  },
  /**
   * Resets the badge (iOS only)
   * Data should contain an onsuccess and onerror handler:
   * {
   *   onsuccess: successCallback,   // called when badge is reset
   *   onerror: errorCallback        // called when an error occurs
   * }
   *
   * @param {*} data     Method parameters
   *
   */
  resetBadge: function( data ) {
    this._verifyArgs( data, {
      onsuccess: 0,
      onerror: 0
    } );
    if ( !this.regid ) data.onerror( {
      error: "Device not registered in push service"
    } );
    this._sendRequest( "GET", "/api/reset_badge/" + this.regid, {}, data.onsuccess,
      data.onerror );
  },
  /**
   * Marks a notice as received and notifies Boxcar that it has been seen
   * Data should look like this:
   * {
   *   onsuccess: successCallback,     // notified when the message has been marked
   *   onerror: errorCallback,         // notified if an error occurs
   *   id: message-id                  // ID as obtained from notification
   *  }
   *
   * @param {*} data     Method parameters
   *
   */
  markAsReceived: function( data ) {
    this._verifyArgs( data, {
      onsuccess: 0,
      onerror: 0,
      id: 0
    } );
    if ( !this.regid ) {
      data.onerror( {
        error: "Device not registered in push service"
      } );
    }
    this.db.transaction( function( tx ) {
      tx.executeSql( "UPDATE pushes SET flags = 1 WHERE id = ?", [ data.id ] );
    }, data.onerror, function() {} );
    this._sendRequest( "POST", "/api/receive/" + this.regid, {
      id: data.id
    }, data.onsuccess, data.onerror );
  },
  /**
   * Verify arguments passed to public methods. Joins .android or .ios into
   * the main argument set if provided and on the same matching platform.
   * @private
   */
  _verifyArgs: function( args, names, defaults ) {
    var i;
    if ( !args ) {
      throw new Error( "Invalid Argument" );
    }
    if ( device.platform == 'android' || device.platform == 'Android' ) {
      for ( i in args.android || {} ) {
        args[ i ] = args.android[ i ];
      }
    } else {
      for ( i in args.ios || {} ) {
        args[ i ] = args.ios[ i ];
      }
    }
    for ( i in names ) {
      if ( !( i in args ) ) {
        throw new Error( "Invalid Argument - " + i );
      }
    }
    if ( defaults ) {
      for ( i in defaults ) {
        if ( !( i in args ) ) {
          args[ i ] = defaults[ i ];
        }
      }
    }
    return null;
  },
  _PNRegSuccess: function() {
    Boxcar._info( "ServiceOp success" );
  },
  _PNRegError: function( arg ) {
    Boxcar._info( "ServiceOp failed", arg );
  },
  /**
   * Called when registration is complete; sends the registration ID
   * to BoxCar and calls the proper success/error callback.
   * @private
   */
  _PNRegDone: function( regid ) {
    this.regid = regid;
    var fields = {
      mode: this._rdData.mode
    };
    if ( this._rdData.tags !== "undefined" ) {
      fields.tags = this._rdData.tags;
    }
    if ( this._rdData.udid !== "undefined" ) {
      fields.udid = this._rdData.udid;
    }
    if ( this._rdData.alias !== "undefined" ) {
      fields.alias = this._rdData.alias;
    }
    this._sendRequest( "PUT", "/api/device_tokens/" + regid, fields, this._rdData.onsuccess,
      this._rdData.onerror );
  },
  /**
   * Sends an XHR to Boxcar
   * @private
   */
  _sendRequest: function( method, url, data, success, error, expires ) {
    if ( !expires ) {
      expires = 5 * 60 * 1000;
    }
    var empty = true;
    for ( var i in data ) {
      empty = false;
    }
    var dataStr;
    if ( empty ) {
      dataStr = "";
    } else {
      expires += Date.now();
      data.expires = expires;
      dataStr = JSON.stringify( data );
    }
    var signData = method + "\n" + this.server.replace(
        /^(?:\w+:\/\/)?([^:]*?)(?::\d+)?(?:\/.*)?$/, "$1" ).toLowerCase() + "\n" + url +
      "\n" + dataStr;
    var signature = this.crypto.sha1_hmac( this.secret, signData );
    Boxcar._info( "Sending to " + this.server + url + "?clientkey=" + this.clientKey +
      "&signature=" + signature + " data: " + dataStr + " signData: " + signData );
    var req = new XMLHttpRequest();
    req.open( method, this.server + url + "?clientkey=" + this.clientKey +
      "&signature=" + signature );
    req.setRequestHeader( "Content-type", "application/json" );
    req.onreadystatechange = function() {
      Boxcar._info( "GOT RES: " + req.readyState + ", " + req.status + ", " + req.responseText );
      if ( req.readyState === 4 ) {
        if ( req.status === 200 || req.status === 0 || req.status === 204 ) {
          success( req.responseText );
        } else {
          error( req.status, req.responseText );
        }
      }
    };
    req.send( dataStr );
  },
  /**
   * Called when a notification is received. The message is inserted into
   * the local database for future reference, and the appropriate callbacks
   * are called.
   *
   * @private
   */
  _gotMessage: function( msg, fromNotificationClick ) {
    var _this = this;
    msg.seen = false;
    this.db.transaction( function( tx ) {
      tx.executeSql(
        "INSERT INTO pushes (id, time, body, badge, sound, richPush, url, flags, json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [ +
          msg.id, msg.time, msg.body, msg.badge, msg.sound, msg.richPush, msg.url, 0,
          msg.json
        ] );
    }, function() {
      if ( _this.onalert ) {
        _this.onalert( msg );
      }
      if ( fromNotificationClick && _this.onnotificationclick ) {
        _this.onnotificationclick( msg );
      }
    }, function() {
      if ( _this.onalert ) {
        _this.onalert( msg );
      }
      if ( fromNotificationClick && _this.onnotificationclick ) {
        _this.onnotificationclick( msg );
      }
    } );
  },
  /**
   * Crypto functions
   * @private
   */
  crypto: {
    string2bin: function( data ) {
      var ret = new Array( data.length >> 2 );
      var i;
      for ( i = 0; i < data.length; i += 4 ) ret[ i >> 2 ] = ( ( data.charCodeAt( i ) &
        0xff ) << 24 ) | ( ( data.charCodeAt( i + 1 ) & 0xff ) << 16 ) | ( ( data.charCodeAt(
        i + 2 ) & 0xff ) << 8 ) | ( data.charCodeAt( i + 3 ) & 0xff );
      for ( ; i < data.length; i++ ) ret[ i >> 2 ] |= ( data.charCodeAt( i ) & 0xff ) <<
        ( ( i % 4 ) << 3 );
      return ret;
    },
    bin2hex: function( data ) {
      var hexchars = "0123456789abcdef";
      var ret = "";
      for ( var i = 0; i < data.length; i++ ) {
        ret += hexchars.charAt( ( data[ i ] >> 28 ) & 0xf ) + hexchars.charAt( ( data[
          i ] >> 24 ) & 0xf ) + hexchars.charAt( ( data[ i ] >> 20 ) & 0xf ) + hexchars
          .charAt( ( data[ i ] >> 16 ) & 0xf ) + hexchars.charAt( ( data[ i ] >> 12 ) &
            0xf ) + hexchars.charAt( ( data[ i ] >> 8 ) & 0xf ) + hexchars.charAt( (
            data[ i ] >> 4 ) & 0xf ) + hexchars.charAt( data[ i ] & 0xf );
      }
      return ret;
    },
    madd: function( x, y ) {
      return ( ( x & 0x7FFFFFFF ) + ( y & 0x7FFFFFFF ) ) ^ ( x & 0x80000000 ) ^ ( y &
        0x80000000 );
    },
    bitroll: function( x, r ) {
      return ( x << r ) | ( x >>> ( 32 - r ) );
    },
    sha1_ft: function( t, b, c, d ) {
      if ( t < 20 ) return ( b & c ) | ( ( ~b ) & d );
      if ( t < 40 ) return b ^ c ^ d;
      if ( t < 60 ) return ( b & c ) | ( b & d ) | ( c & d );
      return b ^ c ^ d;
    },
    sha1_bin: function( data, length ) {
      var W = new Array( 80 );
      var A, B, C, D, E;
      var A2, B2, C2, D2, E2;
      var i, t, tmp;
      var K = [ 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6 ];
      data[ length >> 5 ] |= 0x80 << ( 24 - length % 32 );
      data[ ( ( length + 64 >> 9 ) << 4 ) + 15 ] = length;
      A = 0x67452301;
      B = 0xefcdab89;
      C = 0x98badcfe;
      D = 0x10325476;
      E = 0xc3d2e1f0;
      for ( i = 0; i < data.length; i += 16 ) {
        A2 = A;
        B2 = B;
        C2 = C;
        D2 = D;
        E2 = E;
        for ( t = 0; t < 80; t++ ) {
          W[ t ] = t < 16 ? data[ t + i ] : this.bitroll( W[ t - 3 ] ^ W[ t - 8 ] ^ W[
            t - 14 ] ^ W[ t - 16 ], 1 );
          tmp = this.madd( this.madd( this.bitroll( A, 5 ), this.sha1_ft( t, B, C, D ) ),
            this.madd( this.madd( E, W[ t ] ), K[ Math.floor( t / 20 ) ] ) );
          E = D;
          D = C;
          C = this.bitroll( B, 30 );
          B = A;
          A = tmp;
        }
        A = this.madd( A, A2 );
        B = this.madd( B, B2 );
        C = this.madd( C, C2 );
        D = this.madd( D, D2 );
        E = this.madd( E, E2 );
      }
      return new Array( A, B, C, D, E );
    },
    sha1_hmac_bin: function( key, data ) {
      var bkey = this.string2bin( key, true );
      if ( bkey.length > 16 ) bkey = this.sha1_bin( bkey, key.length * 8 );
      var ipad = Array( 16 ),
        opad = Array( 16 );
      for ( var i = 0; i < 16; i++ ) {
        ipad[ i ] = bkey[ i ] ^ 0x36363636;
        opad[ i ] = bkey[ i ] ^ 0x5C5C5C5C;
      }
      var hash = this.sha1_bin( ipad.concat( this.string2bin( data ) ), 512 + data.length *
        8 );
      return this.sha1_bin( opad.concat( hash ), 512 + 160 );
    },
    sha1: function sha1( data ) {
      return this.bin2hex( this.sha1_bin( this.string2bin( data ), data.length * 8 ) );
    },
    sha1_hmac: function sha1_hmac( key, data ) {
      return this.bin2hex( this.sha1_hmac_bin( key, data ) );
    }
  },
  /**
   * Called when we receive a message from Google Cloud Messaging
   * @private
   */
  GCM_Listener: function( data ) {
    Boxcar._info( "GCM_Listener: " + JSON.stringify( data ) );
    switch ( data.event ) {
      case "registered":
        Boxcar._PNRegDone( data.regid );
        break;
      case "message":
        var msg = {
          id: data.payload.i,
          time: Date.now(),
          sound: data.payload[ "aps-sound" ],
          badge: parseInt( data.payload[ "aps-badge" ] ) || 0,
          body: data.payload[ "aps-alert" ],
          richPush: data.payload.f == "1",
          url: data.payload.f == "1" ? this.richUrlBase + "/push-" + data.payload.i +
            ".html" : data.payload.u,
          json: JSON.stringify( data )
        };
        Boxcar._gotMessage( msg, data.notificationclick );
        break;
    }
  },
  /**
   * Called when we receive a message from Apple's Push Network
   * @private
   */
  APN_Listener: function( data ) {
    Boxcar._info( "APN_Listener", data );
    var msg;
    try {
      msg = {
        id: data.i,
        time: Date.now(),
        sound: data.sound,
        badge: parseInt( data.badge ) || 0,
        body: data.alert,
        richPush: data.f == "1",
        url: data.f == "1" ? Boxcar.richUrlBase + "/push-" + data.i + ".html" : data.u,
        json: JSON.stringify( data )
      };
      if ( msg.badge ) {
        window.plugins.pushNotification.setApplicationIconBadgeNumber( function() {},
          function() {}, msg.badge );
      }
    } catch ( ex ) {
      Boxcar._info( "EX ", ex );
    }
    Boxcar._gotMessage( msg, !data.foreground );
  }
};
if ( typeof( module ) !== "undefined" ) {
  module.exports = Boxcar;
}
