/*jslint node: true */
"use strict";

var config	= require('./config');
var cluster = require('cluster');
var express = require('express');

var app = express();

/**
 * Adds debug info to debug strings
 * @param  {String} message
 * @return {String}
 */
exports.log = function (level, message)
{
	if (app.get('env') == 'development')
	{
		var now = new Date();

		var current_datetime = this.prepend_zero(now.getUTCFullYear()) + "-" + this.prepend_zero((now.getUTCMonth() + 1)) + "-" + this.prepend_zero(now.getUTCDate()) + " " + this.prepend_zero(now.getUTCHours()) + ":" + this.prepend_zero(now.getUTCMinutes()) + ":" + this.prepend_zero(now.getUTCSeconds()) + " (UTC)";
		var http_worker = ((cluster.isWorker) ? " (worker " + cluster.worker.process.pid + ") " : " ");
		console.log(current_datetime + " (" + level + ") " + http_worker + message);
	}
};

/**
 * Add a "0" in front if the value is < 10
 * @param  {int}
 * @return {String}
 */
exports.prepend_zero = function (value)
{
	if(value < 10) return "0" + value;
	else return value;
};