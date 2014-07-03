/*
 * Copyright (c) 2010-2014 BinarySEC SAS
 * Core engine [http://www.binarysec.com]
 * 
 * This file is part of Gate.js.
 * 
 * Gate.js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var fs = require('fs');

var core = function() { /* loader below */ };

core.utils = require(__dirname+'/build/Release/core.node');
core.ipc = require(__dirname+'/js/ipc.js');
core.logger = require(__dirname+'/js/logger.js');
core.graceful = require(__dirname+'/js/graceful.js');
core.pipeline = require(__dirname+'/js/pipeline.js');
core.stats = require(__dirname+'/js/stats.js');
core.plugin = require(__dirname+'/js/plugin.js');
core.hosts = require(__dirname+'/js/hosts.js');

function parseDoubleDot(dst, filename) {
	var lines = fs.readFileSync(filename).toString().split("\n");
	for(var a in lines) {
		var t = lines[a].split(':');
		if(t.length > 1)
			dst[t[0]] = t;
	}
}

core.usersByName = {}
core.groupsByName = {}

core.loader = function(gjs) {
	if(!gjs.serverConfig.runDir) {
		console.log('* No runDir defined, exiting');
		process.exit(0);
	}
	
	parseDoubleDot(core.usersByName, '/etc/passwd');
	parseDoubleDot(core.groupsByName, '/etc/group');	
	
	core.ipc.loader(gjs);
	core.logger.loader(gjs);
	core.graceful.loader(gjs);
	core.pipeline.loader(gjs);
	core.stats.loader(gjs);
	core.plugin.loader(gjs);
	core.hosts.loader(gjs);
}

core.getUser = function(name) {
	if(core.usersByName[name])
		return(core.usersByName[name]);
	return(null);
}

core.getGroup = function(name) {
	if(core.groupsByName[name])
		return(core.groupsByName[name]);
	return(null);
}

core.fixCamelLike = function(str) { 
	return str.replace(/(^|-)([a-zA-Z])/g,
		function (x, dash, chr) { 
			return dash + chr.toUpperCase(); 
	}); 
}

core.lookupSSLFile = function(options) {
	/* ca and crl as possible array */
	var root = gjs.serverConfig.libDir+'/ssl';
	var keyLookup = ['cert', 'ca', 'pfx', 'key'];
	for(var a in keyLookup) {
		var z = keyLookup[a];
		if(options[z]) {
			var file = root+'/'+options[z];
			try {
				var fss = fs.statSync(file);
				options[z] = fs.readFileSync(file);
				
			} catch(e) {
				console.log('Can not open '+file+' '+e);
				return(false);
			}
		}
	}
	return(true);
}
	
	
core.dateToStr = core.utils.dateToStr;
core.cstrrev = core.utils.cstrrev;
core.nreg = core.utils.nreg;

module.exports = core;
