fondue
======

Pass in JavaScript source code, get a version of that code that's been instrumented to collect a trace of its execution.

Rough around the edges. Especially edges not used in [Theseus](https://github.com/adobe-research/theseus).

Plain objects are returned from all API calls so that they can be easily passed over a remote debugging connection as JSON.

Usage
-----

Execute instrumented code:

````javascript
var fondue = require('fondue'),
    vm = require('vm');

var src = fondue.instrument('function foo(a) { return a * 2 }; foo(4)');
var sandbox = { tracer: undefined };
var output = vm.runInNewContext(src, sandbox);
var tracer = sandbox.tracer; // created by fondue when instrumented code is run
````

Track hit counts:

````javascript
// tracer.nodes() returns all trace points
var fooNode = tracer.nodes().filter(function (n) { return n.type === 'function' && n.name === 'foo' })[0];
console.log('foo started at', fooNode.start, 'and ended at', fooNode.end);

// check how many times trace points have been hit
var hitsHandle = tracer.trackHits();
var hits1 = tracer.hitCountDeltas(hitsHandle);
console.log('foo was called ' + (hits1[fooNode.id] || 0) + ' time');

// call repeatedly to track hit counts over time
var hits2 = tracer.hitCountDeltas(hitsHandle);
console.log('foo was called ' + (hits2[fooNode.id] || 0) + ' times (since last check)');
````

Access function arguments and return values (and unhandled exceptions):

````javascript
var logHandle = tracer.trackLogs({ ids: [fooNode.id] });
var invocations = tracer.logDelta(logHandle);
console.log('foo returned:', invocations[0].returnValue);
console.log('foo accepted arguments:', invocations[0].arguments);
````
