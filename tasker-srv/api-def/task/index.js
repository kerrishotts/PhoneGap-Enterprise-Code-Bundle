var express = require ("express");
var getTaskList = require ("./getTaskList");
var getTask = require ("./getTask");

var taskId = require ("./taskId");

var routes = 
[
	{
		"route": "/task",
		"actions": 
		[
			getTaskList,
		]
	},
	{
		"route": "/task/:taskId",
		"params":
		[
			taskId
		],
		"actions":
		[
			getTask
		]
	}
];

module.exports = routes;