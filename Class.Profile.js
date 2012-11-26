(function() {

	var times = {};
	var dates = {};
	var depth = {};

	var profile = function(label) {

		if (dates[label] === undefined) {
			dates[label] = Date.now();
			times[label] = 0;
			depth[label] = 0;
		}

		depth[label]++;
	};

	var profileEnd = function(label) {

		depth[label]--;

		if (depth[label] === 0) {
			times[label] += Date.now() - dates[label];
			dates[label] = undefined;
		}
	};

	Class.profile = function(klass) {
		for (var key in klass.prototype) {
			var method = klass.prototype[key];
			if (typeof method === 'function') {
				(function() {
					var k = key;
					var m = klass.prototype[k];
					klass.prototype[key] = function() {
						monitor(k);
						var ret = m.apply(this, arguments);
						monitorEnd(k);
						return ret;
					}
				})()
			}
		}

		Class.profileEnd = function() {
			var res = [];
			var len = 0;
			Object.each(times, function(value, label) {
				res.push({label: label, value:value})
				if (len < label.length) {
					len = label.length;
				}
			});
			res.sort(function(a, b) {
				return b.value - a.value
			}).each(function(r) {
				console.log(r.label.pad(len), r.value + 'ms');
			});
		}
	}

})()