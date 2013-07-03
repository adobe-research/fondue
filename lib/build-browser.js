var child_process = require('child_process');
var fs = require('fs');

process.chdir(__dirname);

var browserify = child_process.spawn('browserify', [__dirname + '/fondue.js', '-r', './fondue:fondue']);
var fondueSource = '';

browserify.stdout.on('data', function (data) {
	fondueSource += data.toString();
});

browserify.stderr.on('data', function (data) {
	console.error(data.toString());
});

browserify.on('close', function (code) {
	if (code !== 0) {
		console.error('browserify exited with', code);
		return;
	}

	var tracerRegexp = /\/\*tracer.js{\*\/.+\/\*}tracer.js\*\//;
	if (!tracerRegexp.test(fondueSource)) {
		console.error('location where tracer.js is was not found in browserified fondue.js');
		return;
	}

	var tracerSource = fs.readFileSync(__dirname + '/tracer.js', 'utf8');
	var newFondueSource = fondueSource.replace(tracerRegexp, JSON.stringify(tracerSource));
	fs.writeFileSync(__dirname + '/fondue.browser.js', newFondueSource);
});
