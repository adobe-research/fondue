/*
 * Copyright (c) 2012 Massachusetts Institute of Technology, Adobe Systems
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

var basename = require('path').basename;
var falafel = require('falafel');
var falafelMap = require('falafel-map');
var eselector = require('../esprima-selector');
var helpers = require('../falafel-helpers');
var fs = require('fs');
var beautify_js = require('js-beautify');
var UglifyJS = require('uglify-js');

// adds keys from options to defaultOptions, overwriting on conflicts & returning defaultOptions
function mergeInto(options, defaultOptions) {
	for (var key in options) {
		if (options[key] !== undefined) {
			defaultOptions[key] = options[key];
		}
	}
	return defaultOptions;
}

// tiny templating library
// replaces {name} with vars.name
function template(s, vars) {
	for (var p in vars) {
		s = s.replace(new RegExp('{' + p + '}', 'g'), vars[p]);
	}
	return s;
}

function makeId(type, path, loc) {
	return path + '-'
	     + type + '-'
	     + loc.start.line + '-'
	     + loc.start.column + '-'
	     + loc.end.line + '-'
	     + loc.end.column;
};

function instrumentationPrefix(options) {
	options = mergeInto(options, {
		name: '__tracer',
		nodejs: false,
		maxInvocationsPerTick: 4096,
	});

	// the inline comments below are markers for building the browser version of
	// fondue, where the file contents will be inlined as a string.
	var tracerSource = /*tracer.js{*/fs.readFileSync(__dirname + '/tracer.js', 'utf8')/*}tracer.js*/;
	return template(tracerSource, {
		name: options.name,
		version: JSON.stringify(require('./package.json').version),
		nodejs: options.nodejs,
		maxInvocationsPerTick: options.maxInvocationsPerTick,
	});
}

// uses the surrounding code to generate a reasonable name for a function
function concoctFunctionName(node) {
	var name = undefined;

	if (node.type === 'FunctionDeclaration') {
		// function xxx() { }
		//  -> "xxx"
		name = node.id.name;
	} else if (node.type === 'FunctionExpression') {
		if (node.id) {
			// (function xxx() { })
			//  -> "xxx"
			name = node.id.name;
		} else if (node.parent.type === 'VariableDeclarator') {
			// var xxx = function () { }
			//  -> "xxx"
			name = node.parent.id.name;
		} else if (node.parent.type === 'AssignmentExpression') {
			var left = node.parent.left;
			if (left.type === 'MemberExpression' && !left.computed) {
				if (left.object.type === 'MemberExpression' && !left.object.computed) {
					if (left.object.property.type === 'Identifier' && left.object.property.name === 'prototype') {
						// yyy.prototype.xxx = function () { }
						//  -> "yyy.xxx"
						name = left.object.object.name + '.' + left.property.name;
					}
				}
			}
		} else if (node.parent.type === 'CallExpression') {
			// look, I know this is a regexp, I'm just sick of parsing ASTs
			if (/\.on$/.test(node.parent.callee.source())) {
				var args = node.parent.arguments;
				if (args[0].type === 'Literal' && typeof args[0].value === 'string') {
					// .on('event', function () { })
					//  -> "('event' handler)"
					name = "('" + args[0].value + "' handler)";
				}
			} else if (node.parent.callee.type === 'Identifier') {
				if (['setTimeout', 'setInterval'].indexOf(node.parent.callee.name) !== -1) {
					// setTimeout(function () { }, xxx)
					// setInterval(function () { }, xxx)
					//  -> "timer handler"
					name = 'timer handler';
					if (node.parent.arguments[1] && node.parent.arguments[1].type === 'Literal' && typeof node.parent.arguments[1].value === 'number') {
						// setTimeout(function () { }, 100)
						// setInterval(function () { }, 1500)
						//  -> "timer handler (100ms)"
						//  -> "timer handler (1.5s)"
						if (node.parent.arguments[1].value < 1000) {
							name += ' (' + node.parent.arguments[1].value + 'ms)';
						} else {
							name += ' (' + (node.parent.arguments[1].value / 1000) + 's)';
						}
					}
					name = '(' + name + ')';
				} else {
					// xxx(function () { })
					//  -> "('xxx' callback)"
					name = "('" + node.parent.callee.source() + "' callback)";
				}
			} else if (node.parent.callee.type === 'MemberExpression') {
				if (node.parent.callee.property.type === 'Identifier') {
					// xxx.yyy(..., function () { }, ...)
					//  -> "('yyy' callback)"
					name = "('" + node.parent.callee.property.name + "' callback)";
				}
			}
		} else if (node.parent.type === 'Property') {
			// { xxx: function () { } }
			//  -> "xxx"
			name = node.parent.key.name || node.parent.key.value;
			if (name !== undefined) {
				if (node.parent.parent.type === 'ObjectExpression') {
					var obj = node.parent.parent;
					if (obj.parent.type === 'VariableDeclarator') {
						// var yyy = { xxx: function () { } }
						//  -> "yyy.xxx"
						name = obj.parent.id.name + '.' + name;
					} else if(obj.parent.type === 'AssignmentExpression') {
						var left = obj.parent.left;
						if (left.type === 'MemberExpression' && !left.computed) {
							if (left.object.type === 'Identifier' && left.property.name === 'prototype') {
								// yyy.prototype = { xxx: function () { } }
								//  -> "yyy.xxx"
								name = left.object.name + '.' + name;
							}
						}
					}
				}
			}
		}
	}

	return name;
}

function traceFilter(src, options) {
	options = mergeInto(options, {
		path: '<anonymous>',
		prefix: '',
		tracer_name: '__tracer',
		source_map: false,
		throw_parse_errors: false,
	});

	try {
		var nodes = [];
    var preNodes = {};
		var functionSources = {};

		// some code looks at the source code for callback functions and does
		// different things depending on what it finds. since fondue wraps all
		// anonymous functions, we need to capture the original source code for
		// those functions so that we can return it from the wrapper function's
		// toString.

    //TODO - Callbacks here are actually handlers, not async
		falafel(src, { loc: true }, eselector.tester([
			{
				selector: '.function',
				callback: function (node) {
					var id = makeId('function', options.path, node.loc);
					functionSources[id] = node.source();
				}
			}
		]));

    //
    //falafel(src, { loc: true }, helpers.wrap(eselector.tester([
		//	{
		//		selector: 'program',
		//		callback: function (node) {
		//			var id = makeId('toplevel', options.path, node.loc);
     //     node.originalSource = node.source() + " ";
     //     preNodes[id] = node;
		//		}
		//	},
		//	{
		//		selector: '.function > block',
		//		callback: function (node) {
		//			var id = makeId('function', options.path, node.parent.loc);
     //     node.originalSource = node.source() + " ";
     //     preNodes[id] = node;
		//		}
		//	},
		//	{
		//		selector: 'expression.function',
		//		callback: function (node) {
		//			if (node.parent.type !== 'Property' || node.parent.kind === 'init') {
     //       var id = makeId('function', options.path, node.loc);
     //       node.originalSource = node.source() + " ";
     //       preNodes[id] = node;
		//			}
		//		}
		//	},
		//	{
		//		selector: '.call',
		//		callback: function (node) {
		//			var id = makeId('callsite', options.path, node.loc);
     //     node.originalSource = node.source() + " ";
     //     preNodes[id] = node;
		//		}
		//	}
		//])));

		// instrument the source code
		var instrumentedSrc = falafel(src, { loc: true }, helpers.wrap(eselector.tester([
			{
				selector: 'program',
				callback: function (node) {
					var id = makeId('toplevel', options.path, node.loc);
					nodes.push({
						path: options.path,
						start: node.loc.start,
						end: node.loc.end,
						id: id,
            //originalSource:preNodes[id].originalSource,
						type: 'toplevel',
						name: '(' + basename(options.path) + ' toplevel)',
					});
					traceFileEntry(node, id);
				}
			},
			{
				selector: '.function > block',
				callback: function (node) {
					var id = makeId('function', options.path, node.parent.loc);
					var params = node.parent.params.map(function (param) {
						return { name: param.name, start: param.loc.start, end: param.loc.end };
					});
					nodes.push({
						path: options.path,
						start: node.parent.loc.start,
						end: node.parent.loc.end,
						id: id,
            //originalSource:preNodes[id].originalSource,
						type: 'function',
						name: concoctFunctionName(node.parent),
						params: params,
					});
					traceEntry(node, id, [
						'arguments: ' + options.tracer_name + '.Array.prototype.slice.apply(arguments)',
						'this: this',
					]);
				},
			},
			{
				selector: 'expression.function',
				callback: function (node) {
					if (node.parent.type !== 'Property' || node.parent.kind === 'init') {
						var id = makeId('function', options.path, node.loc);
						node.wrap(options.tracer_name + '.traceFunCreate(', ', ' + JSON.stringify(functionSources[id]) + ')')
					}
				},
			},
			{
				selector: '.call',
				callback: function (node) {
					var id = makeId('callsite', options.path, node.loc);
					var nameLoc = (node.callee.type === 'MemberExpression') ? node.callee.property.loc : node.callee.loc;
          nodes.push({
						path: options.path,
						start: node.loc.start,
						end: node.loc.end,
						id: id,
            //originalSource:preNodes[id].originalSource,
						type: 'callsite',
						name: node.callee.source(),
						nameStart: nameLoc.start,
						nameEnd: nameLoc.end,
					});
					if (node.callee.source() === "eval") {
						if (node.arguments.length === 1 && node.arguments[0].type === 'Literal' && typeof(node.arguments[0].value) === 'string') {
							var path = '<anonymous>';
							var m = /\/\/# sourceURL=([^\s]+)/.exec(node.arguments[0].value);
							if (m) {
								path = m[1];
							}
							path = options.path + '-eval-' + path;

							var suboptions = JSON.parse(JSON.stringify(options));
							suboptions.path = path;
							var instrumentedEvalSource = traceFilter(node.arguments[0].value, suboptions);
							node.arguments[0].update(JSON.stringify(String(instrumentedEvalSource)))
						}
					} else if (node.callee.source() !== "require") {
						//node.callee.originalSource = node.callee.source();
						if (node.callee.type === 'MemberExpression') {
							if (node.callee.computed) {
								node.callee.update(' ', options.tracer_name, '.traceFunCall({ this: ', node.callee.object.source(), ', property: ', node.callee.property.source(), ', nodeId: ', JSON.stringify(id), ' })');
							} else {
								node.callee.update(' ', options.tracer_name, '.traceFunCall({ this: ', node.callee.object.source(), ', property: "', node.callee.property.source(), '", nodeId: ', JSON.stringify(id), ' })');
							}
						} else {
							node.callee.wrap(options.tracer_name + '.traceFunCall({ func: (', '), nodeId: ' + JSON.stringify(id) + '})');
						}
					}
				},
			},
		])));

		var prologue = options.prefix;
		prologue += template(/*tracer-stub.js{*/fs.readFileSync(__dirname + '/tracer-stub.js', 'utf8')/*}tracer-stub.js*/, { name: options.tracer_name });
		if (options.source_map) prologue += '/*mapshere*/';
		prologue += options.tracer_name + '.add(' + JSON.stringify(options.path) + ', ' + JSON.stringify(src) + ', { nodes: ' + JSON.stringify(nodes) + ' });\n\n';

		return {
			map: function () { return '' },
			toString: function () {
        return prologue + instrumentedSrc
      }
		};

		function traceEntry(node, nodeId, args) {
			args = ['nodeId: ' + JSON.stringify(nodeId)].concat(args || []);
			node.before(options.tracer_name + '.traceEnter({' + args.join(',') + '});');
			node.after(options.tracer_name + '.traceExit(' + JSON.stringify({ nodeId: nodeId }) + ');',
			           options.tracer_name + '.traceExceptionThrown(' + JSON.stringify({ nodeId: nodeId }) + ', __e);throw __e;');
		}

		function traceFileEntry(node, nodeId, args) {
			args = ['nodeId: ' + JSON.stringify(nodeId)].concat(args || []);
			node.before(options.tracer_name + '.traceFileEntry({' + args.join(',') + '});');
			node.after(options.tracer_name + '.traceFileExit(' + JSON.stringify({ nodeId: nodeId }) + ');', true);
		}
	} catch (e) {
		if (options.throw_parse_errors) {
			throw e;
		} else {
			console.error('exception during parsing', options.path, e.stack);
			return options.prefix + src;
		}
	}
}

/**
 * options:
 *   path (<anonymous>): path of the source being instrumented
 *       (should be unique if multiple instrumented files are to be run together)
 *   include_prefix (true): include the instrumentation thunk
 *   tracer_name (__tracer): name for the global tracer object
 *   nodejs (false): true to enable Node.js-specific functionality
 *   maxInvocationsPerTick (4096): stop collecting trace information for a tick
 *       with more than this many invocations
 *   throw_parse_errors (false): if false, parse exceptions are caught and the
 *       original source code is returned.
 **/
function instrument(src, options) {
	options = mergeInto(options, {
		include_prefix: true,
		tracer_name: '__tracer',
	});

	var prefix = '', shebang = '', output, m;

	try {
		src = UglifyJS.minify(src, {
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
			},
			output: {
				indent_start: 0,
				indent_level: 2,
				quote_keys: false,
				space_colon: true,
				ascii_only: false,
				unescape_regexps: false,
				inline_script: false,
				width: 120,
				max_line_len: 32000,
				beautify: true,
				source_map: null,
				bracketize: false,
				semicolons: false,
				comments: true,
				preserve_line: false,
				screw_ie8: false,
				preamble: null,
				quote_style: 0
			}
		}).code;
	} catch (ignored) {
		console.log(options.path + ": Parse Error, No Trace Installed.")
	}

  if (options.noTheseus || options.path.indexOf("theseus=no") > -1) {
    return src;
	}

	if (m = /^(#![^\n]+)\n/.exec(src)) {
		shebang = m[1];
		src = src.slice(shebang.length);
	}

	if (options.include_prefix) {
		prefix += instrumentationPrefix({
			name: options.tracer_name,
			nodejs: options.nodejs,
			maxInvocationsPerTick: options.maxInvocationsPerTick,
		});
	}

	if (src.indexOf("/*theseus" + " instrument: false */") !== -1) {
		output = shebang + prefix + src;
	} else {

		try{

		} catch (err){}

		var m = traceFilter(src, {
			prefix: prefix,
			path: options.path,
			tracer_name: options.tracer_name,
			sourceFilename: options.sourceFilename,
			generatedFilename: options.generatedFilename,
			throw_parse_errors: options.throw_parse_errors,
		});
		var oldToString = m.toString;
		m.toString = function () {
			return shebang + oldToString();
		}
		return m;
	}

	return output;
}

module.exports = {
	instrument: instrument,
	instrumentationPrefix: instrumentationPrefix,
};
