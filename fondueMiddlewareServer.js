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
  var isHTML = false;

  if (req.url.indexOf("&html=true") > -1) {
    isHTML = true;
    resourceURL = req.url.split("&html=true")[0];
    resourceURL = decodeURIComponent(resourceURL.split("?url=")[1])
  } else if (req.query.url.indexOf("?url=") > -1) {
    try {
      resourceURL = decodeURIComponent(req.query.url.split("?url=")[1]);
    } catch (err) {
      res.send("");
      return;
    }
  } else if (req.query.url.indexOf("http") > -1) {
    resourceURL = req.query.url;
  }

  var arr = resourceURL.split("/");
  var fileName = arr[arr.length - 1];

  var opts = {
    url: resourceURL,
    fileName: fileName,
    method: "GET",
    headers: {
      //"host": "localhost:9000",
      //"connection": "keep-alive",
      //"fondue": "https://code.jquery.com/jquery-2.1.4.min.js",
      //"cache-control": "no-cache",
      //"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.99 Safari/537.36",
      //"content-type": "application/javascript",
      //"accept": "*/*",
      //"dnt": "1",
      //"accept-encoding": "gzip, deflate, sdch",
      //"accept-language": "en-US,en;q=0.8",
      //"cookie": "__ssid=960a52f9-f185-4df6-9a77-744978a23bdd; _cb_ls=1; _chartbeat2=CXLD_-fH9zC5-IYW.1441494174656.1441494182897.1; mp_75b1d24a516ecfc955eadfadc4910661_mixpanel=%7B%22distinct_id%22%3A%20%2214f9fbf8c19736-09250e619-10386952-1aeaa0-14f9fbf8c1a13bc%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; ywandp=10001561398679%3A1732691266; rtna=1; ctoLocalVisitor={%22localVisitorId%22:%221442263082662-3120987901929%22}; ctoVisitor={%22firstPageName%22:%22dcom|dhome|homepage|homepage%22%2C%22firstRefUrl%22:%22%22%2C%22firstUrl%22:%22http://localhost:63342/node-offliner/sites/disney.com-2015-09-14-3-37-27/index.html%22%2C%22sessionCount%22:38}; rx=6234623244963586.1442352229465; liqpw=1280; liqph=1011; csm-hit=s-0M3C0PJKG9FMMMZVT2KQ|1442615020345; jsbin=s%3Aj%3A%7B%22version%22%3A%223.34.3%22%2C%22_csrf%22%3A%22j%2Fipt%2FoDv31i%2FW6f87sKKCx8%22%2C%22flashCache%22%3A%7B%7D%7D.7r6bhBdsnCtnTmqgBUKNQjTWU1jvSWOgXuzamTcwPcw"
    }
  };

  if (isHTML) {
    delete opts.fileName;
  }

  //var type = req.headers["content-type"];
  //if (/(application|text)\/javascript/.test(type) || /text\/html/.test(type)) {
  console.log("Requesting:", opts.url);

  request(opts, function (err, subRes, body) {
    if (err) {
      throw err;
    }

    res.setHeader("origin", req.headers.origin);
    res.setHeader("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    //res.setHeader('Access-Control-Allow-Origin', 'chrome-extension://mnpkfjilckjdlfgggeohheepnlhfnjao');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    var fondueOptions = {
      path: unescape(resourceURL),
      include_prefix: false
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
          if (elSrcLink) {
            if ($domItem.is("script")) {
              $domItem.attr("src", "https://localhost:9001?url=" + encodeURIComponent(elSrcLink));
            }
          }
        }

      });

      var parsed = $.html();
      instrumentHTML(parsed, fondueOptions, endCall);
    }
  });
  //} else {
  //  var newReq = request(resourceURL, function (error) {
  //    if (error) {
  //      throw error;
  //    }
  //  });
  //
  //  req.pipe(newReq).on('response', function (res) {
  //    //alter response before piping
  //  }).pipe(res);
  //}
};