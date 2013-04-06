/*
 * Copyright (c) 2012 Adobe Systems Incorporated and other contributors.
 * All rights reserved.
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

var test = require('tap').test;
var simulate = require('./helper/simulate');

test('nodes', function (t) {
	var o = simulate('scripts/nodes.js');
	t.ok(o.tracer); t.notOk(o.exception);
	var tracer = o.tracer;

	var nodes = tracer.nodes();
	t.equal(nodes.length, 5);

	var nodeWithId = function (id) {
		return nodes.filter(function (n) { return n.id === id })[0];
	};

	var nodeWithTypeName = function (type, name) {
		return nodes.filter(function (n) { return n.type === type && n.name === name })[0];
	};

	// built-ins

	t.similar(nodeWithId('log'), {
		id: 'log',
		type: 'function',
		start: { line: 0, column: 0 },
		end: { line: 0, column: 0 },
	});

	// function declaration

	t.similar(nodeWithTypeName('function', 'a'), {
		id: 'scripts/nodes.js-1-0-4-1',
		start: { line: 1, column: 0 },
		end: { line: 4, column: 1 },
		childrenIds: [
			'scripts/nodes.js-2-1-2-16',
			'scripts/nodes.js-3-8-3-23',
		],
		params: [
			{
				name: 'alpha',
				start: { line: 1, column: 11 },
				end: { line: 1, column: 16 },
			},
			{
				name: 'beta',
				start: { line: 1, column: 18 },
				end: { line: 1, column: 22 },
			}
		],
	});

	t.similar(nodeWithTypeName('function', 'b'), {
		id: 'scripts/nodes.js-2-1-2-16',
		start: { line: 2, column: 1 },
		end: { line: 2, column: 16 },
		childrenIds: [],
		params: [],
	});

	t.similar(nodeWithTypeName('function', 'c'), {
		id: 'scripts/nodes.js-3-8-3-23',
		start: { line: 3, column: 8 },
		end: { line: 3, column: 23 },
		childrenIds: [],
		params: [],
	});

	t.similar(nodeWithTypeName('callsite', 'a'), {
		id: 'scripts/nodes.js-5-0-5-3',
		start: { line: 5, column: 0 },
		end: { line: 5, column: 3 },
		childrenIds: [],
	});

	t.end();
});
