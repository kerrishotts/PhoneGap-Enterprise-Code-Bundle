var express = require("express");

var action = 
{
	"action": "authorize",
	"verb": "post",
	"description": 
	{
		"title": "Authorization",
		"href": "/auth",	
		"type": "application/json",
		"accept": "application/json"
	},
	"handler": function ( req, res, next ) {
		res.json ( 200, { "message": "Authorized.", code: "OK000",
			                "links": req.app.get("x-api-discovery") } );
	}
};

module.exports = action;
