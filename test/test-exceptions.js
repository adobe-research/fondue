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

var test = require('tap').test;
var simulate = require('./helper/simulate');

// report hits for caught and uncaught exceptions
test('hits', function (t) {
	var o = simulate('scripts/exceptions.js');
	t.ok(o.tracer); t.ok(o.exception);
	var tracer = o.tracer;
	var nodes = tracer.nodes();

	var nodeWithTypeName = function (type, name) {
		return nodes.filter(function (n) { return n.type === type && n.name === name })[0];
	};

	var nodesWithTypeName = function (type, name) {
		return nodes.filter(function (n) { return n.type === type && n.name === name });
	};

	var handle1 = tracer.trackExceptions();
	var handle2 = tracer.trackExceptions();
	var exceptNode = nodeWithTypeName('function', 'except');
	var catchesNode = nodeWithTypeName('function', 'catches');
	var doesNotCatchNode = nodeWithTypeName('function', 'doesNotCatch');

	var expected = { counts: {} };
	expected.counts[exceptNode.id] = 2;
	expected.counts[doesNotCatchNode.id] = 1;
	t.equivalent(tracer.newExceptions(handle1), expected);
	t.equivalent(tracer.newExceptions(handle2), expected);

	setTimeout(function () {
		var expected = { counts: {} };
		expected.counts[exceptNode.id] = 1;

		t.equivalent(tracer.newExceptions(handle1), expected);
		t.equivalent(tracer.newExceptions(handle2), expected);

		t.end();
	}, 200);
});

// exceptions show up on all invocations from which they're thrown
test('logs', function (t) {
	var o = simulate('scripts/exceptions.js');
	t.ok(o.tracer); t.ok(o.exception);
	var tracer = o.tracer;
	var nodes = tracer.nodes();

	var nodeWithTypeName = function (type, name) {
		return nodes.filter(function (n) { return n.type === type && n.name === name })[0];
	};

	var nodesWithTypeName = function (type, name) {
		return nodes.filter(function (n) { return n.type === type && n.name === name });
	};

	var exceptNode = nodeWithTypeName('function', 'except');
	var catchesNode = nodeWithTypeName('function', 'catches');
	var doesNotCatchNode = nodeWithTypeName('function', 'doesNotCatch');

	var handle = tracer.trackLogs({ ids: [exceptNode.id, catchesNode.id, doesNotCatchNode.id] });

	var log = tracer.logDelta(handle, 4);
	var expectedLog = [{
		nodeId: catchesNode.id,
		// no exception
	}, {
		nodeId: exceptNode.id,
		exception: {},
	}, {
		nodeId: doesNotCatchNode.id,
		exception: {},
	}, {
		nodeId: exceptNode.id,
		exception: {},
	}];
	t.similar(log, expectedLog);
	t.equivalent(tracer.logDelta(handle, 1), []);

	setTimeout(function () {
		var log = tracer.logDelta(handle, 2);
		var expectedLog = [{
			nodeId: catchesNode.id,
			// no exception
		}, {
			nodeId: exceptNode.id,
			exception: {},
		}];
		t.similar(log, expectedLog);
		t.equivalent(tracer.logDelta(handle, 1), []);

		t.end();
	}, 200);
});

// an exception log only shows uncaught exceptions
test('logs 2', function (t) {
	var o = simulate('scripts/exceptions.js');
	t.ok(o.tracer); t.ok(o.exception);
	var tracer = o.tracer;
	var nodes = tracer.nodes();

	var nodeWithTypeName = function (type, name) {
		return nodes.filter(function (n) { return n.type === type && n.name === name })[0];
	};

	var nodesWithTypeName = function (type, name) {
		return nodes.filter(function (n) { return n.type === type && n.name === name });
	};

	var exceptNode = nodeWithTypeName('function', 'except');
	var catchesNode = nodeWithTypeName('function', 'catches');
	var doesNotCatchNode = nodeWithTypeName('function', 'doesNotCatch');

	var handle = tracer.trackLogs({ exceptions: true });

	var log = tracer.logDelta(handle, 1);
	var expectedLog = [{
		nodeId: exceptNode.id,
		exception: {},
	}];
	t.similar(log, expectedLog);
	t.equivalent(tracer.logDelta(handle, 1), []);

	setTimeout(function () {
		t.equivalent(tracer.logDelta(handle, 1), []);

		t.end();
	}, 200);
});
