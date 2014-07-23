var express = require("express");
var apiUtils = require("../../api-utils");

var action = {
	"action": "get-task-list",
	"verb": "get",
	"description": 
	{
		"title": "Get Task List",
		"href": "/task",
		"type": "application/json",
		"accept": "application/json"
	},
	"handler": function ( req, res, next ) {
		var links = {};
		apiUtils.generateHypermediaForAction ( require ("./getTask"), links );
		res.json ( 200, { "tasks": "something", code: "OK000",
											"links": links } );
	}
};

module.exports = action;
