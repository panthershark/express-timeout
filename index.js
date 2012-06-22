require('underscore');

exports.timeout = function(options) {
	var defaults = { 
		timeout: 10000,
		ontimeout: null
	};
	options = _.extend(defaults, options);

	return function(req, res, next) {
	    var timeout = options.timeout,
	        sock = req.socket;

	    sock.setTimeout(timeout);
	    sock.on('timeout', function() {
	        // if no bytes have been written, then abort the request.
	        if (sock.bytesWritten === 0) {
	            sock.end();
	        }
	        if (ontimeout) {
	        	ontimeout(null, sock);  // no need for error at this time so error is always null.
	        }
	    });

	    next();
	}
}