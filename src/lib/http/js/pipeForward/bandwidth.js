var bandwidth = function(gjs) { }

bandwidth.request = function(pipe, speed) {
	if(!speed)
		return;
	
	pipe.response.on('response', function(response) {
		var throttle = new pipe.root.lib.throttle(speed);
		response.pipe(throttle);
		pipe.subPipe = throttle;
	});


}

bandwidth.upgrade = function(gjs, options) {
	return(bandwidth.request(gjs, options));
}

bandwidth.ctor = function(gjs) { }

module.exports = bandwidth; 
