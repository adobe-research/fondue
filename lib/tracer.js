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

// the contents of this file are to be inserted above instrumented code
// to collect trace information

if (typeof {name} === 'undefined') {
{name} = new (function () {
	var TRACER_ID = String(Math.random());

	var globalThis = undefined;

	var nodes = []; // objects describing functions, branches, call sites, etc
	var nodeById = {}; // id(string) -> node
	var invocationStack = [];
	var invocationById = {}; // id(string) -> invocation
	var extraInvocationInfoById = {}; // id(string) -> extra invocation info (stuff we don't want to send over the wire by default)
	var invocationsByNodeId = {}; // id(string) -> array of invocations
	var exceptionsByNodeId = {}; // nodeId -> array of { exception: ..., invocationId: ... }
	var topLevelInvocations = [];
	var nodeHitCounts = {}; // { query-handle: { nodeId: hit-count } }
	var exceptionCounts = {}; // { query-handle: { nodeId: exception-count } }
	var logEntries = {}; // { query-handle: [invocation id] }
	var anonFuncParentInvocation, lastException; // yucky globals track state between trace* calls
	var nextInvocationId = 0;
	var _hitQueries = [];
	var _exceptionQueries = [];
	var _logQueries = [];

	var _connected = false;

	// epochs
	var _lastEpochID = 0;
	var _lastEmitterID = 0;
	var _epochsById = []; // int -> epoch (only epochs that end up as part of the call graph are saved)
	var _epochsByName = {}; // string -> [epoch] (only epochs that end up as part of the call graph are saved)
	var _topLevelEpochsByName = {}; // string -> [epoch]
	var _epochStack = [];
	var _epochInvocationDepth = []; // stack of how deep into the invocation stack of each epoch we are
	var _topLevelInvocationsByEventName = {};

	// bail
	var _bailedTick = false;
	var _invocationsThisTick = 0;
	var _invocationStackSize = 0;
	var _explainedBails = false;

	/*
	Fetching data from fondue happens by requesting a handle for the data you
	want, then calling another function to get the latest data from that handle.
	Typically, the first call to that function returns all the historical data
	and subsequent calls return the changes since the last call.

	The bookkeeping was the same in all the cases. Now this 'base class' handles
	it. Just make a new instance and override backfill() and updateSingle().
	*/
	function Tracker(handlePrefix) {
		this.lastHandleID = 0;
		this.handlePrefix = handlePrefix;
		this.queries = {}; // handle -> query
		this.data = {}; // handle -> data
	}
	Tracker.prototype = {
		track: function (query) {
			var handleID = ++this.lastHandleID;
			var handle = this.handlePrefix + '-' + handleID;
			this.queries[handle] = query;
			this.data[handle] = this.backfill(query);
			return handle;
		},
		untrack: function (handle) {
			this._checkHandle(handle);

			delete this.queries[handle];
			delete this.data[handle];
		},
		/** return the data to be returned from the first call to delta() */
		backfill: function (query) {
			// override this
			return {};
		},
		update: function () {
			for (var handle in this.data) {
				var data = this.data[handle];
				var args = [data].concat(Array.prototype.slice.apply(arguments));
				this.data[handle] = this.updateSingle.apply(this, args);
			}
		},
		/**
		data: the previous data for this query
		arguments passed to update() will be passed after the data argument.
		*/
		updateSingle: function (data, extraData1, extraData2) {
			// override this
			data['foo'] = 'bar';
			return data;
		},
		delta: function (handle) {
			this._checkHandle(handle);

			var result = this.data[handle];
			this.data[handle] = this.emptyData(handle);
			return result;
		},
		/** after a call to delta(), the data for a handle is reset to this */
		emptyData: function (handle) {
			return {};
		},
		_checkHandle: function (handle) {
			if (!(handle in this.queries)) {
				throw new Error("unrecognized query");
			}
		}
	}

	var nodeTracker = new Tracker('node');
	nodeTracker.emptyData = function () {
		return [];
	};
	nodeTracker.backfill = function () {
		return nodes.slice();
	};
	nodeTracker.updateSingle = function (data, newNodes) {
		data.push.apply(data, newNodes);
		return data;
	};

	var epochTracker = new Tracker('epoch');
	epochTracker.backfill = function () {
		var data = {};
		for (var epochName in _topLevelEpochsByName) {
			data[epochName] = { hits: _topLevelEpochsByName[epochName].length };
		}
		return data;
	};
	epochTracker.updateSingle = function (data, epoch) {
		if (!(epoch.eventName in data)) {
			data[epoch.eventName] = { hits: 0 };
		}
		data[epoch.eventName].hits++;
		return data;
	};

	function _addSpecialNodes() {
		var node = {
			path: "[built-in]",
			start: { line: 0, column: 0 },
			end: { line: 0, column: 0 },
			id: "log",
			type: "function",
			childrenIds: [],
			parentId: undefined,
			name: "[log]",
			params: []
		};
		nodes.push(node);
		nodeById[node.id] = node;
	}
	_addSpecialNodes();


	// helpers

	// adds keys from options to defaultOptions, overwriting on conflicts & returning defaultOptions
	function mergeInto(options, defaultOptions) {
		for (var key in options) {
			defaultOptions[key] = options[key];
		}
		return defaultOptions;
	}

	/**
	 * calls callback with (item, index, collect) where collect is a function
	 * whose argument should be one of the strings to be de-duped.
	 * returns an array where each string appears only once.
	 */
	function dedup(collection, callback) {
		var o = {};
		var collect = function (str) {
			o[str] = true;
		};
		for (var i in collection) {
			callback(collect, collection[i], i);
		}
		var arr = [];
		for (var str in o) {
			arr.push(str);
		}
		return arr;
	};

	function count(collection, callback) {
		var o = {};
		var collect = function (str) {
			if (str in o) {
				o[str]++;
			} else {
				o[str] = 1;
			}
		};
		for (var i in collection) {
			callback(collect, collection[i], i);
		}
		return o;
	};

	function flattenmap(collection, callback) {
		var arr = [];
		var collect = function (o) {
			arr.push(o);
		};
		for (var i in collection) {
			callback(collect, collection[i], i, collection);
		}
		return arr;
	};

	/**
	 * behaves like de-dup, but collect takes a second, 'value' argument.
	 * returns an object whose keys are the first arguments to collect,
	 * and values are arrays of all the values passed with that key
	 */
	function cluster(collection, callback) {
		var o = {};
		var collect = function (key, value) {
			if (key in o) {
				o[key].push(value);
			} else {
				o[key] = [value];
			}
		};
		for (var i in collection) {
			callback(collect, collection[i], i);
		}
		return o;
	};

	/**
	 * returns a version of an object that's safe to JSON,
	 * and is very conservative
	 *
	 *   undefined -> { type: 'undefined', value: undefined }
	 *   null -> { type: 'undefined', value: null }
	 *   true -> { type: 'boolean', value: true }
	 *   4 -> { type: 'number', value: 4 }
	 *   "foo" -> { type: 'string', value: "foo" }
	 *   (function () { }) -> { type: 'object' }
	 *   { a: "b" } -> { type: 'object' }
	 */
	function marshalForTransmission(val, maxDepth) {
		if (maxDepth === undefined) {
			maxDepth = 1;
		}

		var o = { type: typeof(val) };
		if (["undefined", "boolean", "number", "string"].indexOf(o.type) !== -1 || val === null) {
			if (typeof(val) === "undefined" && val !== undefined) {
				// special case: document.all claims to be undefined http://stackoverflow.com/questions/10350142/why-is-document-all-falsy
				o.type = "object";
				o.preview = "" + val;
			} else if (val === null) {
				o.type = "null";
				o.preview = "null";
			} else {
				o.value = val;
			}
		} else if (o.type === "object") {
			var newDepth = maxDepth - 1;

			if (val instanceof Array) {
				var len = val.length;
				if (val.__theseusTruncated && val.__theseusTruncated.length) {
					len += val.__theseusTruncated.length;
				}
				o.preview = "[Array:" + len + "]";
				newDepth = maxDepth - 0.5; // count for half
			} else if (typeof(Buffer) === "function" && (val instanceof Buffer)) {
				var len = val.length;
				if (val.__theseusTruncated && val.__theseusTruncated.length) {
					len += val.__theseusTruncated.length;
				}
				o.preview = "[Buffer:" + len + "]";
			} else {
				try { o.preview = String(val) } catch (e) { o.preview = "[Object]" }
			}

			if (maxDepth > 0) {
				o.ownProperties = {};
				for (var key in val) {
					if (val.hasOwnProperty(key) && !/^__theseus/.test(key)) {
						o.ownProperties[key] = marshalForTransmission(val[key], newDepth);
					}
				}
			}

			if ("__theseusTruncated" in val) {
				o.truncated = {};
				if ("length" in val.__theseusTruncated) {
					o.truncated.length = {
						amount: val.__theseusTruncated.length,
					};
				}
				if ("keys" in val.__theseusTruncated) {
					o.truncated.keys = {
						amount: val.__theseusTruncated.keys,
					};
				}
			}
		}
		return o;
	}

	function scrapeObject(object, depth) {
		var MAX_BUFFER_LENGTH = 32;
		var MAX_TOTAL_SIZE = 512;

		/**
		It's everyone's favorite game: bin packing!

		There's a big bin: total memory
		There's a smaller bin: the memory used by this scraped object
		There's smaller bins: the memory used by each child of this scraped object

		Our job is to copy as much useful information we can without overflowing
		the big bin (total memory). For now, we pretend that bin is bottomless.

		So our job is really to copy as much useful information as we can into
		the MAX_TOTAL_SIZE "bytes" allocated to this scraped object. We do this
		by performing a deep copy, and any time we encounter an object that's
		sufficiently large to put us over the limit, we store a reference to it
		instead of copying it.

		In this function, the "size" of a copy is approximated by summing the
		lengths of all strings, the lengths of all keys, and the count of
		objects of any other type, ignoring the overhead of array/object storage.
		**/

		// returns array: [approx size of copy, copy]
		var scrape = function (o, depth) {
			if (typeof(o) === "string") return [o.length, o]; // don't worry about retaining strings > MAX_TOTAL_SIZE, for now

			if (depth <= 0) return [1, o]; // XXX: even if there's a ton there, count it as 1
			if (o === null || typeof(o) !== "object") return [1, o];

			// return only the first MAX_BUFFER_LENGTH bytes of a Buffer
			if (typeof(Buffer) === "function" && (o instanceof Buffer)) {
				var len = Math.min(o.length, MAX_BUFFER_LENGTH);
				var o2 = new Buffer(len);
				if (o.length > MAX_BUFFER_LENGTH) {
					o2.__theseusTruncated = { length: o.length - MAX_BUFFER_LENGTH };
				}
				try { o.copy(o2, 0, 0, len); } catch (e) { }
				return [len, o2];
			}

			try {
				var size = 0;
				var o2 = (o instanceof Array) ? [] : {};
				for (var key in o) {
					if ((o.__lookupGetter__ instanceof Function) && o.__lookupGetter__(key))
						continue;
					if (!(o.hasOwnProperty instanceof Function) || !o.hasOwnProperty(key))
						continue;
					var scraped = scrape(o[key], depth - 1);
					var childSize = key.length + scraped[0];
					if (size + childSize <= MAX_TOTAL_SIZE) {
						size += childSize;
						o2[key] = scraped[1];
					} else {
						// XXX: if it's an array and this is a numeric key, count it as truncating the length instead
						if (!("__theseusTruncated" in o2)) {
							o2.__theseusTruncated = { keys: 0 };
						}
						o2.__theseusTruncated.keys++;
						o2[key] = o[key];
					}
				}
				return [size, o2];
			} catch (e) {
				console.log("couldn't scrape", o, e);
				return [1, o];
			}
		};

		return scrape(object, 1)[1];
	}

	function Invocation(info, type) {
		this.tick = nextInvocationId++;
		this.id = TRACER_ID + "-" + this.tick;
		this.timestamp = new Date().getTime();
		this.type = type;
		this.f = nodeById[info.nodeId];
		this.childLinks = [];
		this.parentLinks = [];
		this.returnValue = undefined;
		this.exception = undefined;
		this.topLevelInvocationId = undefined;
		this.epochID = undefined;
		this.epochDepth = undefined;

		invocationById[this.id] = this;
		extraInvocationInfoById[this.id] = {
			arguments: info.arguments ? info.arguments.map(function (a) { return scrapeObject(a) }) : undefined,
			this: (info.this && info.this !== globalThis) ? scrapeObject(info.this) : undefined,
		};
	}
	Invocation.prototype.equalToInfo = function (info) {
		return this.f.id === info.nodeId;
	};
	Invocation.prototype.linkToChild = function (child, linkType) {
		this.childLinks.push(new InvocationLink(child.id, linkType));
		child.parentLinks.push(new InvocationLink(this.id, linkType));
		if (['call', 'branch-enter'].indexOf(linkType) !== -1) {
			child.topLevelInvocationId = this.topLevelInvocationId;
		}
	};
	Invocation.prototype.addExitVars = function (vars) {
		this.extraInfo().exitVars = vars;
	};
	Invocation.prototype.extraInfo = function () {
		return extraInvocationInfoById[this.id];
	}
	Invocation.prototype.getChildren = function () {
		return this.childLinks.map(function (link) { return invocationById[link.id]; });
	};
	Invocation.prototype.getParents = function () {
		return this.parentLinks.map(function (link) { return invocationById[link.id]; });
	};
	Invocation.prototype.getParentLinks = function () {
		return this.parentLinks;
	};

	function InvocationLink(destId, type) {
		this.id = destId;
		this.type = type;
	}

	function Epoch(id, emitterID, eventName) {
		this.id = id;
		this.emitterID = emitterID;
		this.eventName = eventName;
	}

	function nextEpoch(emitterID, eventName) {
		var epochID = ++_lastEpochID;
		var epoch = new Epoch(epochID, emitterID, eventName);
		return epoch;
	}

	function hit(invocation) {
		var id = invocation.f.id;
		for (var handle in nodeHitCounts) {
			var hits = nodeHitCounts[handle];
			hits[id] = (hits[id] || 0) + 1;
		}
		for (var handle in logEntries) {
			if (invocation.f.id === "log" || _logQueries[handle].ids.indexOf(id) !== -1) {
				logEntries[handle].push(invocation.id);
			}
		}
	}

	function calculateHitCounts() {
		var hits = {};
		nodes.forEach(function (n) {
			if (n.id in invocationsByNodeId) {
				hits[n.id] = invocationsByNodeId[n.id].length;
			}
		});
		return hits;
	}

	function calculateExceptionCounts() {
		var counts = {};
		nodes.forEach(function (n) {
			if (n.id in exceptionsByNodeId) {
				counts[n.id] = exceptionsByNodeId[n.id].length;
			}
		});
		return counts;
	}

	/** return ordered list of invocation ids for the given log query */
	function backlog(query) {
		var seenIds = {};
		var ids = [];

		function addUnseen(newIds) {
			newIds.forEach(function (id) {
				if (!(id in seenIds)) {
					ids.push(id);
					seenIds[id] = true;
				}
			});
		}

		(query.ids.concat("log")).forEach(function (nodeId) {
			var nodeInvIds = (invocationsByNodeId[nodeId] || []).map(function (inv) { return inv.id });
			addUnseen(nodeInvIds);
		});

		if ("eventNames" in query) {
			query.eventNames.forEach(function (name) {
				var newIds = (_topLevelInvocationsByEventName[name] || []).map(function (inv) { return inv.id });
				addUnseen(newIds);
			});
		}

		if (query.exceptions) {
			for (var nodeId in exceptionsByNodeId) {
				var newIds = exceptionsByNodeId[nodeId].map(function (o) { return o.invocationId });
				addUnseen(newIds);
			}
		}

		if (query.logs) {
			var nodeId = "log";
			var nodeInvIds = (invocationsByNodeId[nodeId] || []).map(function (inv) { return inv.id });
			addUnseen(nodeInvIds);
		}

		ids = ids.sort(function (a, b) { return invocationById[a].tick - invocationById[b].tick });
		return ids;
	}


	// instrumentation

	function bailThisTick() {
		_bailedTick = true;
		invocationStack = [];
		_epochStack = [];
		_epochInvocationDepth = [];
		anonFuncParentInvocation = undefined;
		lastException = undefined;
		console.log("[fondue] bailing! trace collection will resume next tick");
		if (!_explainedBails) {
			console.log("[fondue] (fondue is set to automatically bail after {maxInvocationsPerTick} invocations within a single tick)");
			_explainedBails = true;
		}
	}

	function endBail() {
		_bailedTick = false;
		_invocationsThisTick = 0;
		console.log('[fondue] resuming trace collection after bailed tick');
	}

	function pushNewInvocation(info, type) {
		if (_bailedTick) {
			_invocationStackSize++;
			return;
		}

		var invocation = new Invocation(info, type);
		pushInvocation(invocation);
		return invocation;
	}

	function pushInvocation(invocation) {
		_invocationStackSize++;

		if (_bailedTick) return;

		_invocationsThisTick++;
		if (_invocationsThisTick === {maxInvocationsPerTick}) {
			bailThisTick();
			return;
		}

		// associate with epoch, if there is one
		if (_epochStack.length > 0) {
			var epoch = _epochStack[_epochStack.length - 1];
			var depth = _epochInvocationDepth[_epochInvocationDepth.length - 1];
			invocation.epochID = epoch.id;
			invocation.epochDepth = depth;

			_epochInvocationDepth[_epochInvocationDepth.length - 1]++;

			// hang on to the epoch now that it's part of the call graph
			_epochsById[epoch.id] = epoch;

			if (!(epoch.eventName in _epochsByName)) {
				_epochsByName[epoch.eventName] = [];
			}
			_epochsByName[epoch.eventName].push(epoch);

			if (depth === 0) {
				epochTracker.update(epoch);

				if (!(epoch.eventName in _topLevelEpochsByName)) {
					_topLevelEpochsByName[epoch.eventName] = [];
					_topLevelInvocationsByEventName[epoch.eventName] = [];
				}
				_topLevelEpochsByName[epoch.eventName].push(epoch);
				_topLevelInvocationsByEventName[epoch.eventName].push(invocation);

				for (var handle in _logQueries) {
					var query = _logQueries[handle];
					if (query.eventNames && query.eventNames.indexOf(epoch.eventName) !== -1) {
						logEntries[handle].push(invocation.id);
					}
				}
			}
		}

		// add to invocationsByNodeId
		if (!invocationsByNodeId[invocation.f.id]) {
			invocationsByNodeId[invocation.f.id] = [];
		}
		invocationsByNodeId[invocation.f.id].push(invocation);

		// update hit counts
		hit(invocation);

		// associate with caller, if there is one; otherwise, save as a top-level invocation
		var top = invocationStack[invocationStack.length - 1];
		if (top) {
			top.linkToChild(invocation, 'call');
		} else {
			topLevelInvocations.push(invocation);
			invocation.topLevelInvocationId = invocation.id;
		}

		// associate with the invocation where this anonymous function was created
		if (anonFuncParentInvocation) {
			anonFuncParentInvocation.linkToChild(invocation, 'async');
			anonFuncParentInvocation = undefined;
		}

		invocationStack.push(invocation);
	}

	function popInvocation(info) {
		_invocationStackSize--;
		if (_bailedTick && _invocationStackSize === 0) {
			endBail();
			return;
		}

		if (_bailedTick) return;

		if (info) {
			var top = invocationStack[invocationStack.length - 1];
			if (!top || !top.equalToInfo(info)) {
				throw new Error('exit from a non-matching enter');
			}
			top.addExitVars(info.vars);
		}

		invocationStack.pop();

		if (invocationStack.length === 0) {
			_invocationsThisTick = 0;
		}

		if (_epochStack.length > 0) {
			_epochInvocationDepth[_epochInvocationDepth.length - 1]--;
		}
	}

	/**
	 * called from the top of every script processed by the rewriter
	 */
	this.add = function (path, options) {
		nodes.push.apply(nodes, options.nodes);
		options.nodes.forEach(function (n) { nodeById[n.id] = n; });

		nodeTracker.update(options.nodes);

		_sendNodes(options.nodes);
	};

	this.traceFileEntry = function () {
	};

	this.traceFileExit = function () {
	};

	this.setGlobal = function (gthis) {
		globalThis = gthis;
	}

	/**
	 * the rewriter wraps every anonymous function in a call to traceFunCreate.
	 * a new function is returned that's associated with the parent invocation.
	 */
	this.traceFunCreate = function (f, src) {
		var creatorInvocation = invocationStack[invocationStack.length - 1];
		var newF;

		// Some code changes its behavior depending on the arity of the callback.
		// Therefore, we construct a replacement function that has the same arity.
		// The most direct route seems to be to use eval() (as opposed to
		// new Function()), so that creatorInvocation can be accessed from the
		// closure.

		var arglist = '';
		for (var i = 0; i < f.length; i++) {
			arglist += (i > 0 ? ', ' : '') + 'v' + i;
		}

		var sharedBody = 'return f.apply(this, arguments);';

		if (creatorInvocation) {
			// traceEnter checks anonFuncParentInvocation and creates
			// an edge in the graph from the creator to the new invocation
			var asyncBody = 'anonFuncParentInvocation = creatorInvocation;';
			var newSrc = '(function (' + arglist + ') { ' + asyncBody + sharedBody + '})';
			newF = eval(newSrc);
		} else {
			var newSrc = '(function (' + arglist + ') { ' + sharedBody + '})';
			newF = eval(newSrc);
		}
		newF.toString = function () { return src };
		return newF;
	};

	/**
	 * the rewriter wraps the callee portion of every function call with a call
	 * to traceFunCall like this:
	 *
	 *   a.b('foo') -> (traceFunCall({ this: a, property: 'b', nodeId: '...', vars: {}))('foo')
	 *   b('foo') -> (traceFunCall({ func: b, nodeId: '...', vars: {}))('foo')
	 */
	var _traceLogCall = function (info) {
		return function () {
			console.log.apply(console, arguments);
			pushNewInvocation(info, 'callsite');
			pushNewInvocation({ nodeId: "log", arguments: Array.prototype.slice.apply(arguments) }, 'function');
			popInvocation();
			popInvocation();
		}
	};
	this.traceFunCall = function (info) {
		if ('func' in info) {
			var func = info.func;
			if (!func) return func;
			if (typeof console !== 'undefined' && func === console.log) {
				return _traceLogCall(info);
			}
			return function () {
				var invocation = pushNewInvocation(info, 'callsite');

				try {
					return func.apply(this, arguments);
				} finally {
					popInvocation();
				}
			}
		} else {
			var fthis = info.this;
			var func = fthis[info.property];
			if (!func) return func;
			if (typeof console !== 'undefined' && func === console.log) {
				return _traceLogCall(info);
			}
			return function () {
				var invocation = pushNewInvocation(info, 'callsite');

				try {
					return func.apply(fthis, arguments);
				} finally {
					popInvocation();
				}
			}
		}
	};

	/**
	 * the rewriter calls traceEnter from just before the try clause it wraps
	 * function bodies in. info is an object like:
	 *
	 *   {
	 *     start: { line: ..., column: ... },
	 *     end: { line: ..., column: ... },
	 *     vars: { a: a, b: b, ... }
	 *   }
	 */
	this.traceEnter = function (info) {
		pushNewInvocation(info, 'function');
	};

	/**
	 * the rewriter calls traceExit from the finally clause it wraps function
	 * bodies in. info is an object like:
	 *
	 *   {
	 *     start: { line: ..., column: ... },
	 *     end: { line: ..., column: ... }
	 *   }
	 *
	 * in the future, traceExit will be passed an object with all the
	 * local variables of the instrumented function.
	 */
	this.traceExit = function (info) {
		popInvocation(info);
		lastException = undefined;
	};

	this.traceReturnValue = function (value) {
		if (_bailedTick) return value;

		var top = invocationStack[invocationStack.length - 1];
		if (!top) {
			throw new Error('value returned with nothing on the stack');
		}
		top.returnValue = scrapeObject(value);
		return value;
	}

	/**
	 * the rewriter calls traceExceptionThrown from the catch clause it wraps
	 * function bodies in. info is an object like:
	 *
	 *   {
	 *     start: { line: ..., column: ... },
	 *     end: { line: ..., column: ... }
	 *   }
	 */
	this.traceExceptionThrown = function (info, exception) {
		if (_bailedTick) return;

		if (exception === lastException) {
			return;
		}

		var top = invocationStack[invocationStack.length - 1];
		if (!top || !top.equalToInfo(info)) {
			throw new Error('exception thrown from a non-matching enter');
		}
		top.exception = exception;
		lastException = exception;

		if (!exceptionsByNodeId[top.f.id]) {
			exceptionsByNodeId[top.f.id] = [];
		}
		exceptionsByNodeId[top.f.id].push({ exception: exception, invocationId: top.id });

		var id = top.f.id;
		for (var handle in exceptionCounts) {
			var hits = exceptionCounts[handle];
			hits[id] = (hits[id] || 0) + 1;
		}

		for (var handle in _logQueries) {
			if (_logQueries[handle].exceptions) {
				logEntries[handle].push(top.id);
			}
		}
	};

	/** cease collecting trace information until the next tick **/
	this.bailThisTick = bailThisTick;

	this.pushEpoch = function (epoch) {
		_epochStack.push(epoch);
		_epochInvocationDepth.push(0);
	};

	this.popEpoch = function () {
		_epochStack.pop();
		_epochInvocationDepth.pop();
	}

	if ({nodejs}) {
		// override EventEmitter.emit() to automatically begin epochs when events are thrown
		var EventEmitter = require('events').EventEmitter;
		var oldEmit = EventEmitter.prototype.emit;
		EventEmitter.prototype.emit = function (ev) {
			// give this emitter an identifier if it doesn't already have one
			if (!this._emitterID) {
				this._emitterID = ++_lastEmitterID;
			}

			// start an epoch & emit the event
			var epoch = nextEpoch(this._emitterID, ev);
			{name}.pushEpoch(epoch);
			try {
				oldEmit.apply(this, arguments);
			} finally {
				{name}.popEpoch();
			}
		};
	}


	// remote prebuggin' (from Brackets)

	var _sendNodes = function (nodes) {
		if (_connected) {
			_sendBracketsMessage('scripts-added', JSON.stringify({ nodes: nodes }));
		}
	};

	function _sendBracketsMessage(name, value) {
		var key = "data-{name}-" + name;
		document.body.setAttribute(key, value);
		window.setTimeout(function () { document.body.removeAttribute(key); });
	}

	this.version = function () {
		return {version};
	};

	// deprecated
	this.connect = function () {
		if (typeof console !== 'undefined') console.log("Opening the Developer Console will break the connection with Brackets!");
		_connected = true;
		_sendNodes(nodes);
		return this;
	};

	// accessors

	// this is mostly here for unit tests, and not necessary or encouraged
	// use trackNodes instead
	this.nodes = function () {
		return nodes;
	};

	this.trackNodes = function () {
		return nodeTracker.track();
	};

	this.untrackNodes = function () {
		return nodeTracker.untrack();
	};

	this.newNodes = function (handle) {
		return nodeTracker.delta(handle);
	};

	this.trackHits = function () {
		var handle = _hitQueries.push(true) - 1;
		nodeHitCounts[handle] = calculateHitCounts();
		return handle;
	};

	this.trackExceptions = function () {
		var handle = _exceptionQueries.push(true) - 1;
		exceptionCounts[handle] = calculateExceptionCounts();
		return handle;
	};

	this.trackLogs = function (query) {
		var handle = _logQueries.push(query) - 1;
		logEntries[handle] = backlog(query);
		return handle;
	};

	this.trackEpochs = function () {
		return epochTracker.track();
	};

	this.untrackEpochs = function (handle) {
		return epochTracker.untrack(handle);
	}

	this.hitCountDeltas = function (handle) {
		if (!(handle in _hitQueries)) {
			throw new Error("unrecognized query");
		}
		var result = nodeHitCounts[handle];
		nodeHitCounts[handle] = {};
		return result;
	};

	this.newExceptions = function (handle) {
		if (!(handle in _exceptionQueries)) {
			throw new Error("unrecognized query");
		}
		var result = exceptionCounts[handle];
		exceptionCounts[handle] = {};
		return { counts: result };
	};

	this.epochDelta = function (handle) {
		return epochTracker.delta(handle);
	};

	// okay, the second argument is kind of a hack
	function makeLogEntry(invocation, parents) {
		parents = (parents || []);
		var extra = extraInvocationInfoById[invocation.id];
		var entry = {
			timestamp: invocation.timestamp,
			tick: invocation.tick,
			invocationId: invocation.id,
			topLevelInvocationId: invocation.topLevelInvocationId,
			nodeId: invocation.f.id,
		};
		if (invocation.epochID !== undefined) {
			var epoch = _epochsById[invocation.epochID];
			entry.epoch = {
				id: epoch.id,
				emitterID: epoch.emitterID,
				eventName: epoch.eventName,
			};
			entry.epochDepth = invocation.epochDepth;
		}
		if (invocation.returnValue !== undefined) {
			entry.returnValue = marshalForTransmission(invocation.returnValue);
		}
		if (invocation.exception !== undefined) {
			entry.exception = marshalForTransmission(invocation.exception);
		}
		if (invocation.f.params) {
			entry.arguments = [];
			var params = invocation.f.params;
			for (var i = 0; i < params.length; i++) {
				var param = params[i];
				entry.arguments.push({
					name: param.name,
					value: marshalForTransmission(extra.arguments[i]),
				});
			}
			for (var i = params.length; i < extra.arguments.length; i++) {
				entry.arguments.push({
					value: marshalForTransmission(extra.arguments[i]),
				});
			}
		}
		if (extra.this !== undefined) {
			entry.this = marshalForTransmission(extra.this);
		}
		if (parents.length > 0) {
			entry.parents = parents;
		}
		return entry;
	}

	this.logCount = function (handle) {
		if (!(handle in _logQueries)) {
			throw new Error("unrecognized query");
		}

		return logEntries[handle].length;
	};

	this.logDelta = function (handle, maxResults) {
		if (!(handle in _logQueries)) {
			throw new Error("unrecognized query");
		}

		maxResults = maxResults || 10;

		var ids = logEntries[handle].splice(0, maxResults);
		var results = ids.map(function (invocationId, i) {
			var invocation = invocationById[invocationId];
			return makeLogEntry(invocation, findParentsInQuery(invocation, _logQueries[handle]));
		});
		return results;
	};

	this.backtrace = function (options) {
		options = mergeInto(options, {
			range: [0, 10],
		});

		var invocation = invocationById[options.invocationId];
		if (!invocation) {
			throw new Error("invocation not found");
		}

		var stack = [];
		if (options.range[0] <= 0) {
			stack.push(invocation);
		}

		function search(invocation, depth) {
			// stop if we're too deep
			if (depth+1 >= options.range[1]) {
				return;
			}

			var callers = findCallers(invocation);
			var directCallers = callers.filter(function (c) { return c.type === "call" })
			var caller = directCallers[0];

			if (caller) {
				var parent = invocationById[caller.invocationId];
				if (options.range[0] <= depth+1) {
					stack.push(parent);
				}
				search(parent, depth + 1);
			}
		}
		search(invocation, 0);
		var results = stack.map(function (invocation) {
			return makeLogEntry(invocation);
		});
		return results;
	};

	function findParentsInQuery(invocation, query) {
		if (query.ids.length === 0) {
			return [];
		}

		var matches = {}; // invocation id -> link
		var types = ['async', 'call', 'branch-enter']; // in priority order
		function promoteType(type, newType) {
			if (types.indexOf(type) === -1 || types.indexOf(newType) === -1) {
				throw new Exception("invocation link type not known")
			}
			if (types.indexOf(newType) < types.indexOf(type)) {
				return newType;
			}
			return type;
		}
		function search(link, type) {
			if (query.ids.indexOf(invocationById[link.id].f.id) !== -1) {
				if (link.id in matches) {
					if (link.type === 'call' && matches[link.id].type === 'async') {
						matches[link.id] = {
							invocationId: link.id,
							type: type,
							inbetween: []
						};
					}
				} else {
					matches[link.id] = {
						invocationId: link.id,
						type: type,
						inbetween: []
					};
				}
				return; // search no more down this path
			}
			invocationById[link.id].getParentLinks().forEach(function (link) { search(link, promoteType(type, link.type)); });
		}
		invocation.getParentLinks().forEach(function (link) { search(link, link.type); });

		// convert matches to an array
		var matchesArr = [];
		for (var id in matches) {
			matchesArr.push(matches[id]);
		}
		return matchesArr;
	}

	function findCallers(invocation) {
		var matches = {}; // invocation id -> link
		var types = ['async', 'call', 'branch-enter']; // in priority order
		function promoteType(type, newType) {
			if (types.indexOf(type) === -1 || types.indexOf(newType) === -1) {
				throw new Exception("invocation link type not known")
			}
			if (types.indexOf(newType) < types.indexOf(type)) {
				return newType;
			}
			return type;
		}
		function search(link, type) {
			if (invocationById[link.id].f.type === "function") {
				if (link.id in matches) {
					if (link.type === 'call' && matches[link.id].type === 'async') {
						matches[link.id] = {
							invocationId: link.id,
							type: type,
						};
					}
				} else {
					matches[link.id] = {
						invocationId: link.id,
						type: type,
					};
				}
				return; // search no more down this path
			}
			invocationById[link.id].getParentLinks().forEach(function (link) { search(link, promoteType(type, link.type)); });
		}
		invocation.getParentLinks().forEach(function (link) { search(link, link.type); });

		// convert matches to an array
		var matchesArr = [];
		for (var id in matches) {
			matchesArr.push(matches[id]);
		}
		return matchesArr;
	}
});
}
(function () { {name}.setGlobal(this); })();
