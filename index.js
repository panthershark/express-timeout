var _ = require('underscore');

/**
* Takes the req and set the socket timeout and handles the timeout event.  If options.callback exists, then 
* the socket will be left open and the res passed to the handler.  If not, then the socket is closed when the timeout occurs.
* @param timeout: number of ms of the timeout.  Default is node.js default of 2m
* @param dahmer: if Dahmer mode is on then kill all sockets.  If not on, then any socket which bytes have been written will be allowed to live with the assumption that it is in process of sending content.  Default: false
* @param callback: function(err, {req: the original request, res: the original response})
* 
* NOTE: This will change in a future release due to this bug fix.  https://github.com/joyent/node/issues/3460
**/
module.exports = function requestTimeout(options) {
	var defaults = { 
		timeout: null,
		dahmer: false,
		callback: null
	};
	options = _.extend(defaults, options);

	return function(req, res, next) {
	    var sock = req.socket;

	    if (options.timeout) {
	    	sock.setTimeout(options.timeout);
	    }

	    // This is for 0.6.19 or older.  May change in future, but this should keep backward compatibility.
	    sock.removeAllListeners('timeout');

	    // Listen for the timeout.
	    sock.once('timeout', function() {

	        if (options.callback) {
	        	options.callback(null, { req: req, res: res });
	        }
	        
	        if (options.dahmer || sock.bytesWritten === 0) {
	        	process.nextTick(sock.destroy);
	        }
	    });

	    next();
	}
};