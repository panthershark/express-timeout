// TODO: Create a vanilla connect or express app and insure the timeout is what is expected.
var express = require('express'),
	http = require('http'),
	url = require('url'),
	_ = require('lodash'),
	requestTimeout = require('../index.js');

var port = 3000,
	app = express.createServer();

app.use(requestTimeout({
	timeout: 1000,
	callback: function(err, options) {
		var req = options.req,
			res = options.res;

		if (err) {
			console.log('Test failed' + err);
		}
 		console.log('Test passed');

 		res.end();
	}
}));

app.get('/', function(req, res){
    // do nothing so it times out.
});

app.listen(port);

// open browser and hit http://localhost:3000/ and check console.  Need to automate this.