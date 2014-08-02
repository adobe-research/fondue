function except() { throw 'foo' }

function catches() {
	try {
		except();
	} catch (e) {
	}
}

function doesNotCatch() {
	except();
}

setTimeout(catches, 100);
// setTimeout(doesNotCatch, 100); // the test harness can't handle this yet
catches();
doesNotCatch();
