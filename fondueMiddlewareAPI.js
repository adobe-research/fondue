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
var redisClient = redis.createClient();
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var _ = require('underscore');
var moment = require('moment');
var htmlMinify = require('html-minifier').minify;
var URI = require('URIjs');

redisClient.on('connect', function () {
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

  redisClient.get(digest, function (err, foundSrc) {
    if (foundSrc != null) {
      console.log("Found src:", digest);
      callback(foundSrc, passedSource, i, iterLoc);
    } else {
      console.log("Adding New Instrumented Source:", digest);
      var instrumentedSrc = fondue.instrument(src, fondueOptions).toString();

      redisClient.set(digest, instrumentedSrc, function (err, reply) {
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
      scriptLocs.push({start: scriptBegin, end: scriptEnd});
      lastScriptEnd = scriptEnd;
    }
  }

  var hits = 0;
  var retSrc = [];
  var instCallback = function (instSrc, passedSrc, preI, iterLoc) {
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

      callback(passedSrc, true);
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
var request = require("request");
module.exports = function (req, res, next) {
  var resourceURL;
  var basePath;
  var fileName;
  var params = {};
  var isHTML = false;

  if (req.url.indexOf("/htmlUrl") === 0) {
    if (!req.body.originalHTML) {
      res.send(200);
      return;
    } else {
      var arr = req.url.split("/");
      resourceURL = decodeURIComponent(arr[2]);
      basePath = decodeURIComponent(arr[4]);
      params.beautifyOnly = "true";
      params.html = "true";
      isHTML = true;
    }
  }

  if (!resourceURL) {

    try {
      var paramArr = req.url.split("?")[1].split("&");
      _(paramArr).each(function (set) {
        var key = set.split("=")[0];
        var value = set.split("=")[1];
        params[key] = value;
      });
    } catch (ignored) {
    }

    if (params.html && params.html === "true") {
      isHTML = true;
      resourceURL = decodeURIComponent(params.url);
      basePath = decodeURIComponent(params.basePath);
    } else if (req.query && req.query.url.indexOf("?url=") > -1) {
      try {
        resourceURL = decodeURIComponent(req.query.url.split("?url=")[1]);
      } catch (err) {
        res.send("");
        return;
      }
    } else if (req.query && req.query.url.indexOf("http") > -1) {
      resourceURL = req.query.url;
    }

    var arr = resourceURL.split("/");
    fileName = arr[arr.length - 1];
  }

  var opts = {
    url: resourceURL,
    fileName: fileName,
    method: "GET"
  };

  if (isHTML) {
    delete opts.fileName;
  }

  var reqCallback = function (err, subRes, body) {
    if (err) {
      throw err;
    }

    var fondueOptions = {
      path: resourceURL,
      include_prefix: false,
      noTheseus: params.theseus === "no"
    };

    var endCall = function (src, alterScript) {
      var parsed;

      if (alterScript) {
        var $ = cheerio.load(src);
        //var domItems = $("*");
        $("html > head").prepend($("script")[0]);
        //$($("script")[0]).remove();
        parsed = $.html();
      }

      res.send(parsed || src);
    };

    if (!isHTML) {
      instrumentJavaScript(body, fondueOptions, endCall);
    } else if (isHTML) {
      var extraParam = "";
      if (params.beautifyOnly && params.beautifyOnly === "true") {
        extraParam = "&theseus=no";
        fondueOptions.noTheseus = true;
      }

      //Remove crap that breaks fondue
      body = htmlMinify(body, {
        removeComments: true,
        minifyJS: {
          fromString: true,
          warnings: true,
          mangle: false,
          compress: {
            sequences: false,  // join consecutive statemets with the “comma operator”
            properties: false,  // optimize property access: a["foo"] → a.foo
            dead_code: false,  // discard unreachable code
            drop_debugger: false,  // discard “debugger” statements
            unsafe: false, // some unsafe optimizations (see below)
            conditionals: false,  // optimize if-s and conditional expressions
            comparisons: false,  // optimize comparisons
            evaluate: false,  // evaluate constant expressions
            booleans: false,  // optimize boolean expressions
            loops: false,  // optimize loops
            unused: false,  // drop unused variables/functions
            hoist_funs: false,  // hoist function declarations
            hoist_vars: false, // hoist variable declarations
            if_return: false,  // optimize if-s followed by return/continue
            join_vars: false,  // join var declarations
            cascade: false,  // try to cascade `right` into `left` in sequences
            side_effects: false,  // drop side-effect-free statements
            warnings: true,  // warn about potentially dangerous optimizations/code
            global_defs: {}     // global definitions
          }
        }
      });

      var $ = cheerio.load(body);
      var domItems = $("*");
      _(domItems).each(function (domItem) {
        var $domItem = $(domItem);

        if ($domItem.is("script")) {
          var elSrcLink = $domItem.attr("src");
          if (elSrcLink && elSrcLink.indexOf("chrome-extension") < 0) {
            if ($domItem.is("script")) {
              if (elSrcLink && elSrcLink.indexOf("http") < 0) {
                elSrcLink = URI(elSrcLink).absoluteTo(basePath).toString();
              }

              $domItem.attr("src", "https://localhost:9001?url=" + encodeURIComponent(elSrcLink) + extraParam);
            }
          }
        }

      });

      var parsed = $.html();

      instrumentHTML(parsed, fondueOptions, endCall);
    }
  };

  if (req.body && req.body.originalHTML) {
    reqCallback(null, null, req.body.originalHTML);
  } else {
    request(opts, reqCallback);
  }
};