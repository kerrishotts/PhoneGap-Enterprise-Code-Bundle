var express = require ("express");

var routes = 
[
	{
		"route": "/heartbeat",
		"actions": 
		[
			{
				"action": "heartbeat",
				"verb": "get",
				"handler": function (req, res, next) {
					res.json ( 200, "OK" );
				},
				"description": 
				{
					"title": "Heartbeat",
					"href": "/heartbeat",	
					"type": "application/json"
				}
			}
		]
	}
];

module.exports = routes ;