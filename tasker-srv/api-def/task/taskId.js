var express = require("express");

var param = {
	"name": "taskId",
	"handler": function (req, res, next, taskId) {
		req.taskId = taskId;
		next();
	}
};

module.exports = param;