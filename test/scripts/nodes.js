function a(alpha, beta) {
	function b() {}
	return function c() {};
}
a();
a(function () { });

var x = { y: function () { } };
x.y(function () { });

var abc = 1, def = 2;
var ghi = 3,
    jkl = 4;
