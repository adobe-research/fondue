var a = 1;
var b = 2, c = 3;
var d = 4,
    e = 5;
a = 6;
a = foo();
a = foo().bar();
a = foo().
    bar();
a = foo()
   .bar();

function foo() {
	return {
		bar: function () { return 22 },
		baz: 42,
	};
}

setTimeout(function () {
	foo().bar();
}, 100);
