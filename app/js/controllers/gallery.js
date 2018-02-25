(function () {
	'use strict';

	angular
		.module('App')
		.controller('GalleryController', GalleryController);

	GalleryController.$inject = ['$scope', '$state', '$http'];

	function GalleryController($scope, $state, $http) {

		
		
		if (localStorage.getItem('userSession') == null) {
			$state.go('home');
		}

		$scope.openItem = function (item) {
			$state.go('app.item');
		};
		$scope.addNewClient = function (item) {
			$state.go('app.new-client');
		};
	}
})();