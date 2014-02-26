/*jslint node: true */

var sys = require("sys");
var exec = require("child_process").exec;
var async = require("async");
var config			= require('../app/config');
var server = require('../app/server');

function puts(error, stdout, stderr) { sys.puts(stdout) }

exports.index = function(req, res) {
	// Get requested host
	var requested_host = req.headers.host;
	if (requested_host.indexOf(':') > 0)
	{
		requested_host = requested_host.substring(0, requested_host.indexOf(':'));
	}

	if (server.routes[requested_host] === undefined)
	{
		res.send();
	}
	else
	{
		res.status(301).set({
			"Location": server.routes[requested_host] + req.params[0]
		}).send();
	}
};
