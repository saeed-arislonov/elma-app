(function () {
	'use strict';

	angular
		.module('App')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope', '$ionicPopup', 'Modals', 'Model', '$http', '$state', '$rootScope'];
	function HomeController($scope, $ionicPopup, Modals, Model, $http, $state, $rootScope) {

		$scope.users = [];

		$scope.HelloWorld = function () {
			$ionicPopup.alert({
				title: 'Hello World',
				template: 'This is the best template to start with Ionic Framework!',
     		cssClass: 'animated bounceInDown'
			});
		};
		
		$scope.showUsers = function () {
			/*Model.Users.getAll().then(function (users) {
				$scope.users = angular.copy(users);
			});*/
			Modals.openModal($scope, 'templates/modals/users.html', 'animated rotateInDownLeft');
		};
		
		$scope.closeModal = function () {
			Modals.closeModal();
			$scope.users = [];
		};
		
		$scope.user = {};
		
		$scope.signIn = function(){
			console.log($scope.user)
			$http.post('https://www.online.uz:3007/elma/uz/api/auth/signin.json', $scope.user)
			.success(function(response){
			console.log(response);
				localStorage.setItem('userSession', response.data.token)
				$state.go('app.gallery');
				$rootScope.userInfo = response.data;
		}).error(function(err, status, config, headers){
			console.log(err, status, config, headers)
		})
		}
		
		
		//Center content
		//1. http://codepen.io/mhartington/pen/gcHeL
		//2. http://codepen.io/anon/pen/meQJvp
	}
})();