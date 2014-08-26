function a() { logTest(); infoTest(); warnTest(); errorTest(); traceTest() }
function logTest() { console.log(1) }
function infoTest() { console.info(1) }
function warnTest() { console.warn(1) }
function errorTest() { console.error(1) }
function traceTest() { console.trace(1) }
a();
setTimeout(function () { a(); }, 100);
