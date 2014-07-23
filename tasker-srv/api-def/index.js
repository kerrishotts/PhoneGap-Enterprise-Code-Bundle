var express = require("express");

var apiDiscovery = require("./discovery");
var apiAuth = require("./auth");
var apiHeartbeat = require ("./heartbeat");
var apiTask = require("./task");

var api = [];

var pushRoute = function ( route ) {
	api.push ( route );
}

var all = [ apiDiscovery, apiAuth, apiHeartbeat, apiTask ];

all.forEach ( function ( segment ) {
	segment.forEach ( pushRoute );
});


module.exports = api;