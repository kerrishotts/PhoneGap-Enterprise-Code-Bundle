var express = require ("express");
var auth = require ("./auth");
var deauth = require ("./deauth");
var getAuthToken = require ("./token");

var routes = 
[
	{
		"route": "/auth",
		"actions": 
		[
			getAuthToken,
			auth,
			deauth
		]
	}
];

module.exports = routes;