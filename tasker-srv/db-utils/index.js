//
// dependencies
//
var winston = require("winston");

// DBUtils class provides useful methods for calling db functions without
// having unnecessary code reuse

function DBUtils ( clientPool ) {
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
 * @param {function} callback
 *
 */
DBUtils.prototype.query = function ( sql, bindParameters, cb) {
	var self = this;
	var clientPool = self._clientPool;
	
	clientPool.acquire ( function ( err, client ) {
		if (err) {
			winston.error ( " Failed to acquire connection from the pool." );
			cb (new Error (err));
		}
		client.execute ( sql, bindParameters, function ( err, results ) {
			if (err) {
				clientPool.release ( client);
				cb (new Error (err));
			}
			clientPool.release ( client );
			cb (err, results );
		});
	});
};

DBUtils.prototype.execute = DBUtils.prototype.query;

module.exports = DBUtils;