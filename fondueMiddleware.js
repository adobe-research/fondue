/*
 * Copyright (c) 2013 Massachusetts Institute of Technology, Adobe Systems
 * Incorporated, and other contributors. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/* global unescape */

"use strict";

var crypto = require("crypto");
var fondue = require("../fondue");
var zlib = require("zlib");

var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
	console.log('Redis Connected.');
});

/**
 Usage:

   function foo(options) {
     options = mergeInto(options, { bar: "baz" });
     // ...
   }
 */
function mergeInto(options, defaultOptions) {
	for (var key in options) {
		if (options[key] !== undefined) {
			defaultOptions[key] = options[key];
		}
	}
	return defaultOptions;
}

/**
 Returns instrumented JavaScript. From the cache, if it's there.
 */
function instrumentJavaScript(src, fondueOptions, callback, passedSource, i, iterLoc) {
	var md5 = crypto.createHash("md5");
	md5.update(JSON.stringify(arguments));
	var digest = md5.digest("hex");

  client.get(digest, function (err, foundSrc) {
    if (foundSrc != null) {
      console.log("Found src:", digest);
      callback(foundSrc, passedSource, i, iterLoc);
    } else {
      console.log("Adding New Instrumented Source:", digest);
      var instrumentedSrc = fondue.instrument(src, fondueOptions).toString();


			client.set(digest, instrumentedSrc, function (err, reply) {
				callback(instrumentedSrc, passedSource, i, iterLoc);
			});
    }
  });
}

/**
 Returns the given HTML after instrumenting all JavaScript found in <script> tags.
 */
function instrumentHTML(src, fondueOptions, callback) {
	var scriptLocs = [];
	var scriptBeginRegexp = /<\s*script[^>]*>/ig;
	var scriptEndRegexp = /<\s*\/\s*script/i;
	var lastScriptEnd = 0;

	var match;
	while (match = scriptBeginRegexp.exec(src)) {
		var scriptBegin = match.index + match[0].length;
		if (scriptBegin < lastScriptEnd) {
			continue;
		}
		var endMatch = scriptEndRegexp.exec(src.slice(scriptBegin));
		if (endMatch) {
			var scriptEnd = scriptBegin + endMatch.index;
			scriptLocs.push({ start: scriptBegin, end: scriptEnd });
			lastScriptEnd = scriptEnd;
		}
	}

  var hits = 0;
  var retSrc = [];
  var instCallback = function(instSrc, passedSrc, preI, iterLoc){
    hits++;
    retSrc[preI] = instSrc;

    if (hits === scriptLocs.length) {
      for (var i = scriptLocs.length - 1; i >= 0; i--) {
        passedSrc = passedSrc.slice(0, scriptLocs[i].start) + retSrc[i] + passedSrc.slice(scriptLocs[i].end);
      }

      // remove the doctype if there was one (it gets put back below)
      var doctype = "";
      var doctypeMatch = /^(<!doctype[^\n]+\n)/i.exec(passedSrc);
      if (doctypeMatch) {
        doctype = doctypeMatch[1];
        passedSrc = passedSrc.slice(doctypeMatch[1].length);
      }

      // assemble!
      passedSrc = doctype + "<script>\n" + fondue.instrumentationPrefix(fondueOptions) + "\n</script>\n" + passedSrc;

      callback(passedSrc);
    }
  };

	// process the scripts in reverse order
	for (var i = scriptLocs.length - 1; i >= 0; i--) {
		var loc = scriptLocs[i];
		var script = src.slice(loc.start, loc.end);
		var options = mergeInto(fondueOptions, {});
		options.path = options.path + "-script-" + i;
		var prefix = src.slice(0, loc.start).replace(/[^\n]/g, " "); // padding it out so line numbers make sense
		instrumentJavaScript(prefix + script, options, instCallback, src.valueOf(), i, loc);
	}
}

/**
 Middleware. Filters text/html responses with instrumentHTML(). Filters
 application/javascript responses with instrument JavaScript().

 Also sends no-cache headers.
 */
module.exports = function (options) {
	options = options || {};

	return function(req, res, next){
		var written = [];
		var writeHead = res.writeHead, write = res.write, end = res.end;
		var encoding;

		// advise against caching so that we can turn on and off instrumentation as we please
		res.setHeader("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");

		res.writeHead = function () {
			encoding = res.getHeader("Content-Encoding");
			if (encoding === 'gzip') {
				res.removeHeader("Content-Encoding");
			}

			res.removeHeader("Content-Length"); // since we don't know what length the rewritten files will be
			writeHead.apply(res, arguments);
		};

		res.write = function(chunk) {
			written.push(chunk);
		};

		res.end = function(chunk) {
			if (chunk) this.write.apply(this, arguments);

			var buffer = Buffer.concat(written);

			if (encoding === 'gzip') {
				zlib.gunzip(buffer, function (err, decoded) {
					if (err) {
						console.log("gzip error: " + err);
						return;
					}

					buffer = decoded;
					written = [buffer]
					finish();
				});
			} else {
				finish();
			}

			function finish() {
				var type = res.getHeader("Content-Type");
				var fondueOptions = mergeInto(options, { path: unescape(req.url), include_prefix: false });
				var src;
        var endCall = function (instSrc) {
					if(instSrc){
	          written = [instSrc];
					}
          written.forEach(function (c) {
            write.call(res, c);
          });

          return end.call(res);
        };

				if (/(application|text)\/javascript/.test(type)) {
					src = buffer.toString();
          instrumentJavaScript(src, fondueOptions, endCall);
        } else if (/text\/html/.test(type)) {
					src = buffer.toString();
          instrumentHTML(src, fondueOptions, endCall);
				} else {
					endCall();
				}
			}
		};

		next();
	};
};
