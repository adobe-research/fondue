/*
The following code has been modified by fondue to collect information about its
execution.

https://github.com/adobe-research/fondue
*/

if (typeof {name} === 'undefined') {
	{name} = {};
	var methods = ["add", "addSourceMap", "traceFileEntry", "traceFileExit", "setGlobal", "traceFunCreate", "traceFunCall", "traceEnter", "traceExit", "traceReturnValue", "traceExceptionThrown", "bailThisTick", "pushEpoch", "popEpoch", "augmentjQuery", "version", "connect", "nodes", "trackNodes", "untrackNodes", "newNodes", "trackHits", "trackExceptions", "trackLogs", "trackEpochs", "untrackEpochs", "trackFileCallGraph", "untrackFileCallGraph", "fileCallGraphDelta", "hitCountDeltas", "newExceptions", "epochDelta", "logCount", "logDelta", "backtrace"];
	for (var i = 0; i < methods.length; i++) {
		{name}[methods[i]] = function () { return arguments[0] };
	}
}

