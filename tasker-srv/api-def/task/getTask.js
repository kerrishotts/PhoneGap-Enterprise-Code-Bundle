/******************************************************************************
*
* Tasker Server (PhoneGap Enterprise Book)
* ----------------------------------------
*
* @author Kerri Shotts
* @version 0.1.0
* @license MIT
*
* Copyright (c) 2014 Packt Publishing
* Permission is hereby granted, free of charge, to any person obtaining a copy of this
* software and associated documentation files (the "Software"), to deal in the Software
* without restriction, including without limitation the rights to use, copy, modify,
* merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to the following
* conditions:
* The above copyright notice and this permission notice shall be included in all copies
* or substantial portions of the Software.
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
* OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*
******************************************************************************/

//
// dependencies
//
var express = require("express");
var apiUtils = require("../../api-utils");
var DBUtils = require("../../db-utils");
var winston = require("winston");

// get a specific task
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
	
		if (!req.user) {
		  var err = new Error ("Forbidden");
		  err.status = 403;
		  next(err);
		}
		res.json ( 200, { content: req.task,
			                  links: links } );	
	}
};

module.exports = action;
