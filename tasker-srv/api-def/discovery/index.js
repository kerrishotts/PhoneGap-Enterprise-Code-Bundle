var express = require ("express");
var routes =
[
	{
		"route": "/",
		"actions":
		[
			{
				"action": "discover",
				"verb": "get",
				"handler": function ( req, res, next) {
					res.json ( 200, req.app.get ("x-api-discovery") );
				},
				"description": {
					"title": "API Discovery",
					"href": "/",	
					"type": "application/json"
				}
			}
		]
	}
];

module.exports = routes;