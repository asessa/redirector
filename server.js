/*jslint node: true */

/**
 * Module dependencies.
 */

var config			= require('./app/config');
var server			= require('./app/server');
var logger 			= require('./app/logger');

var express = require('express');

var routes = require('./routes');

var http = require('http');
var path = require('path');
var cluster = require('cluster');
var fs = require('fs');

var app = express();

if (cluster.isMaster)
{
	var fs = require('fs');
	var json_package = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8'));

	console.log(json_package.description + ' v.' + json_package.version);
}

// all environments
app.set('port', process.env.PORT || config.LISTEN_PORT);

if (app.get('env') == 'development')
{
	app.use(express.logger('dev'));
	app.use(express.errorHandler());
}
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.enable('trust proxy');

// listen for kill signals, for graceful exit
process.on('SIGTERM', function ()
{
	logger.log('INFO', "Gracefully shutting down.");
	if (cluster.isWorker)
	{
		app.close();
	}
});

server.load_configuration();

fs.watchFile(__dirname + '/redirector.txt', function(curr,prev) {
	server.load_configuration();
});

// Workers Routes
if (cluster.isWorker)
{
	app.get('*', routes.index);
}

server.start(app);
