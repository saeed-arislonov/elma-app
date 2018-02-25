(function () {
    'use strict';

    angular
        .module('App')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$ionicPopover', '$state'];
    function AppController($scope, $ionicPopover, $state) {
        

        $scope.exitApp = function () {
            ionic.Platform.exitApp();
        };
		
		if (localStorage.getItem('userSession') == null) {
			$state.go('home'); 
		}

        $ionicPopover.fromTemplateUrl('templates/modals/popover.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.popover = popover;
        });
		
		$scope.signOut = function(){
			localStorage.removeItem('userSession');
			$state.go('home')
		};

        $scope.openPopover = function ($event) {
            $scope.popover.show($event);
        };
        
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
    }
})();