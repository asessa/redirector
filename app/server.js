/*jslint node: true */
"use strict";

var config			= require('./config');
var logger			= require('./logger');

var http			= require('http');
var url				= require('url');
var qs				= require('querystring');
var cluster			= require('cluster');
var express			= require('express');
var fs 				= require('fs');
var csv 			= require('csv');

var routes = [];

exports.routes = routes;

exports.load_configuration = function()
{
	csv()
		.from.path(__dirname + '/../redirector.txt', { delimiter: ',', escape: '"' })
		.transform( function(row) {
			return row;
		})
		.on('record', function(row,index){
			routes[row[0]] = row[1];
		})
		.on('close', function(count){
			console.log('Loaded Configuration file: ' + count + ' line/s.');
		});
};

exports.start = function (app)
{
	if (cluster.isMaster)
	{
		for (var x = 0; x < config.HTTP_WORKERS; x++)
		{
			cluster.fork();
		}

		cluster.on('death', function(worker)
		{
			logger.log('INFO', "Worker " + worker.process.pid + " just died. Spawning a new one.");
			cluster.fork();
		});

		// As workers come up.
		cluster.on('listening', function(worker, address)
		{
			logger.log('INFO', "Worker " + worker.process.pid + " is now listening to " + address.address + ":" + address.port);
		});
	}
	else
	{
		http.createServer(app).listen(app.get('port'));
	}
};