var express = require("express");
var apiUtils = require("../../api-utils");

var action = {
	"action": "get-token",
	"verb": "get",
	"description": 
	{
		"title": "Get Authorization Token",
		"href": "/auth",
		"type": "application/json",
		"accept": "application/json"
	},
	"handler": function ( req, res, next ) {
		var links = {};
		apiUtils.generateHypermediaForAction ( require ("./auth"), links );
		res.json ( 200, { "token": res.locals.csrftoken, code: "OK000",
		                  "links": links } );
	}
};

module.exports = action;
