var express = require("express");
var apiUtils = require("../../api-utils");

var action = {
	"action": "get-task",
	"verb": "get",
	"description": 
	{
		"title": "Get Task",
		"template": "/task/{taskId}",
		"type": "application/json",
		"accept": "application/json"
	},
	"handler": function ( req, res, next ) {
		var links = {};
		apiUtils.generateHypermediaForAction ( require ("./getTaskList"), links );
		res.json ( 200, { "taskId": req.taskId, code: "OK000",
											"links": links } );
	}
};

module.exports = action;
