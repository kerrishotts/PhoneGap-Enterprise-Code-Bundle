//
// dependencies
//
var winston = require( "winston" ),
  oracle = require( "oracle" ),
  Q = require( "q" );

// DBUtils class provides useful methods for calling db functions without
// having unnecessary code reuse

function DBUtils( clientPool ) {
  "use strict";
  var self = this;
  self._clientPool = clientPool;
  return self;
}

/**
 *
 * Query the database using the client pool created at DBUtil creation
 *
 * @param {string} sql
 * @param {array} bindParameters
 * @param {function} callback       optional; if not supplied, returns a promise
 *
 */
DBUtils.prototype.query = function ( sql, bindParameters, cb ) {
  var self = this,
    clientPool = self._clientPool,
    deferred = Q.defer();

  clientPool.acquire( function ( err, client ) {
    if ( err ) {
      winston.error( " Failed to acquire connection from the pool." );
      if ( cb ) { cb( new Error( err ) ); } else { deferred.reject( err ); }
    }
    try {
      client.execute( sql, bindParameters, function ( err, results ) {
        if ( err ) {
          clientPool.release( client );
          if ( cb ) { cb( new Error( err ) ); } else { deferred.reject( err ); }
        }
        clientPool.release( client );

        if ( cb ) { cb( err, results ); } else { deferred.resolve( results ); }
      } );
    }
    catch ( err2 ) {
      try {
        clientPool.release( client );
      }
      catch ( err3 ) {
        // can't do anything...
      }
      if ( cb ) { cb( err2 ); } else { deferred.reject( err2 ); }
    }
  } );
  if ( !cb ) {
    return deferred.promise;
  }
};

DBUtils.prototype.execute = DBUtils.prototype.query;

DBUtils.prototype.outInteger = function ( options ) {
  return new oracle.OutParam( oracle.OCCIINT, options );
};
DBUtils.prototype.outVarchar2 = function ( options ) {
  return new oracle.OutParam( oracle.OCCISTRING, options );
};
DBUtils.prototype.outDouble = function ( options ) {
  return new oracle.OutParam( oracle.OCCIDOUBLE, options );
};
DBUtils.prototype.outFloat = function ( options ) {
  return new oracle.OutParam( oracle.OCCIFLOAT, options );
};
DBUtils.prototype.outCursor = function ( options ) {
  return new oracle.OutParam( oracle.OCCICURSOR, options );
};
DBUtils.prototype.outClob = function ( options ) {
  return new oracle.OutParam( oracle.OCCICLOB, options );
};
DBUtils.prototype.outDate = function ( options ) {
  return new oracle.OutParam( oracle.OCCIDATE, options );
};
DBUtils.prototype.outTimestamp = function ( options ) {
  return new oracle.OutParam( oracle.OCCITIMESTAMP, options );
};
DBUtils.prototype.outBlob = function ( options ) {
  return new oracle.OutParam( oracle.OCCIBLOB, options );
};
DBUtils.prototype.outNumber = function ( options ) {
  return new oracle.OutParam( oracle.OCCINUMBER, options );
};

module.exports = DBUtils;