var express = require("express");
var apiUtils = require("../../api-utils");

var action =
			{
				"action": "deauthorize",
				"verb": "delete",
				"description": 
				{
					"title": "Deauthorization",
					"href": "/auth",
					"type": "application/json" 
				},
				"handler": function ( req, res, next ) {
					res.json ( 200, { "message": "Logged out.", code: "OK000",
					                  "links": req.app.get("x-api-discovery") } );
				}
			};

module.exports = action;