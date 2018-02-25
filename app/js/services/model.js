(function () {
	'use strict';

	angular
		.module('App')
		.factory('Model', Model);

	Model.$inject = ['Users'];

	function Model(Users) {

		return {
			Users: Users
		};
	}
})();

(function () {
	'use strict';

	angular.module('App')
		.filter('unique', unique);

	function unique() {
		return function (collection, keyname) {
			var output = [],
				keys = [];

			angular.forEach(collection, function (item) {
				var key = item[keyname];
				if (keys.indexOf(key) === -1) {
					keys.push(key);
					output.push(item);
				}
			});

			return output;
		};
	}

})();