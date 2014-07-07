var nconf = require('nconf');

function Config() {
	nconf.argv().env("_");
	var env = nconf.get("NODE:ENV") || "development";
	this.env = env;
	nconf.file("default", "config/default.json");
	nconf.file(env, "config/" + env + ".json");
}

Config.prototype.get = function (key) {
	return nconf.get(key);
}

module.exports = new Config();


