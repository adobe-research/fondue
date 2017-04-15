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

test('vals', function (t) {
	var o = simulate('scripts/vals.js');
	t.ok(o.tracer); t.notOk(o.exception);
	var tracer = o.tracer;
	var nodes = tracer.nodes();

	var probeNodeIds = nodes.filter(function (n) {
		return n.type === "probe";
	}).map(function (n) {
		return n.id;
	});

	var handle = tracer.trackProbeValues({ nodeIds: probeNodeIds });
	var delta = tracer.probeValuesDelta(handle);
	var keys = Object.keys(delta);

	t.equal(keys.length, probeNodeIds.length - 3, "Probe values should exist for all but the 3 deferred probe nodes");
	
	var probedNumbers = keys.filter(function (key) {
		return delta[key].val.type === 'number';
	}).map(function (key) {
		return delta[key].val.value;
	});

	function probeShouldReport(val) {
		t.ok(probedNumbers.indexOf(val) >= 0, "A probe should report the value " + val);
	}

	probeShouldReport(1);
	probeShouldReport(2);
	probeShouldReport(3);
	probeShouldReport(4);
	probeShouldReport(5);
	probeShouldReport(6);

	setTimeout(function () {
		t.equal(Object.keys(tracer.probeValuesDelta(handle)).length, 3);
		t.end();
	}, 200);
});
