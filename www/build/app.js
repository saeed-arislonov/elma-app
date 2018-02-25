// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'App' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App', ['ionic', 'ngCordova', 'ngAnimate', 'ui.mask', 'ngCookies'])

	.run(['$ionicPlatform',
			'$sqliteService',
      function ($ionicPlatform, $sqliteService) {
			$ionicPlatform.ready(function () {
				if (window.cordova && window.cordova.plugins.Keyboard) {
					// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
					// for form inputs)
					cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

					// Don't remove this line unless you know what you are doing. It stops the viewport
					// from snapping when text inputs are focused. Ionic handles this internally for
					// a much nicer keyboard experience.
					cordova.plugins.Keyboard.disableScroll(true);
				}
				if (window.StatusBar) {
					StatusBar.styleDefault();
				}

				//Load the Pre-populated database, debug = true
				$sqliteService.preloadDataBase(true);
			});
}])
	.config(['$stateProvider',
         '$urlRouterProvider',
         '$ionicConfigProvider',
         '$compileProvider',
         function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
			  
			$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content|ms-appx|x-wmapp0):|data:image\/|img\//);
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);

			$ionicConfigProvider.scrolling.jsScrolling(ionic.Platform.isIOS());

			$stateProvider
				.state('home', {
					url: "/home",
					templateUrl: "templates/home.html",
					controller: 'HomeController'
				})
				.state('app', {
					url: '/app',
					abstract: true,
					controller: 'AppController',
					templateUrl: 'templates/menu.html',
					onEnter: function ($state) {
						if (localStorage.getItem('userSession') == null) {
							$state.go('home');
						}
					}
				})
				.state('app.gallery', {
					url: "/gallery",
					cache: false,
					views: {
						viewContent: {
							templateUrl: "templates/gallery.html",
							controller: 'GalleryController'
						}
					}
				})
				.state('app.item', {
					url: "/item",
					cache: false,
					views: {
						viewContent: {
							templateUrl: "templates/item.html",
							controller: 'ItemController'
						}
					}
				})
				.state('app.new-client', {
					url: "/new-client",
					cache: false,
					views: {
						viewContent: {
							templateUrl: "templates/new-client.html",
							controller: 'ItemController'
						}
					}
				});

			$urlRouterProvider.otherwise(function ($injector, $location) {
				var $state = $injector.get("$state");
				$state.go("home");
			});
}]);
/* global ionic */
(function (angular, ionic) {
	"use strict";

	ionic.Platform.isIE = function () {
		return ionic.Platform.ua.toLowerCase().indexOf('trident') > -1;
	}

	if (ionic.Platform.isIE()) {
		angular.module('ionic')
			.factory('$ionicNgClick', ['$parse', '$timeout', function ($parse, $timeout) {
				return function (scope, element, clickExpr) {
					var clickHandler = angular.isFunction(clickExpr) ? clickExpr : $parse(clickExpr);

					element.on('click', function (event) {
						scope.$apply(function () {
							if (scope.clicktimer) return; // Second call
							clickHandler(scope, { $event: (event) });
							scope.clicktimer = $timeout(function () { delete scope.clicktimer; }, 1, false);
						});
					});

					// Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
					// something else nearby.
					element.onclick = function (event) { };
				};
			}]);
	}

	function SelectDirective() {
		'use strict';

		return {
			restrict: 'E',
			replace: false,
			link: function (scope, element) {
				if (ionic.Platform && (ionic.Platform.isWindowsPhone() || ionic.Platform.isIE() || ionic.Platform.platform() === "edge")) {
					element.attr('data-tap-disabled', 'true');
				}
			}
		};
	}

	angular.module('ionic')
    .directive('select', SelectDirective);

	/*angular.module('ionic-datepicker')
	.directive('select', SelectDirective);*/

})(angular, ionic);
window.queries = [
	//Drop tables
   "DROP TABLE IF EXISTS Users;",
	//Create tables
	"CREATE TABLE Users (IdUser integer primary key autoincrement, Name text not null);",
	//Insert Users
	"INSERT INTO 'Users' ('Name') VALUES ('Juan David Nicholls Cardona');",
	"INSERT INTO 'Users' ('Name') VALUES ('Khriztian Moreno Zuluaga');",
	"INSERT INTO 'Users' ('Name') VALUES ('Cristian Rivas Buitrago');",
	"INSERT INTO 'Users' ('Name') VALUES ('Juan David Sánchez');",
	"INSERT INTO 'Users' ('Name') VALUES ('Nicolas Molina');",
	"INSERT INTO 'Users' ('Name') VALUES ('Miyamoto Musashi FIlander');",
	"INSERT INTO 'Users' ('Name') VALUES ('Didier Hernandez');",
	"INSERT INTO 'Users' ('Name') VALUES ('Luis Eduardo Oquendo Pérez');",
	"INSERT INTO 'Users' ('Name') VALUES ('Carlos Rojas');",
	"INSERT INTO 'Users' ('Name') VALUES ('Levano Castilla Carlos Miguel');"
];
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
(function () {
	'use strict';

	angular
		.module('App')
		.controller('ItemController', ItemController);

	ItemController.$inject = ['$scope', '$stateParams', '$ionicViewSwitcher', '$state', '$ionicHistory', '$http', '$rootScope', 'Modals', '$ionicLoading'];

	function ItemController($scope, $stateParams, $ionicViewSwitcher, $state, $ionicHistory, $http, $rootScope, Modals, $ionicLoading) {

		$scope.item = {
			title: $stateParams.title,
			icon: $stateParams.icon,
			color: $stateParams.color
		};

		$scope.closeModal = function () {
			Modals.closeModal();
		};

		$scope.toggleProducts = function () {
			if ($('.products-list').css('display') == 'none') {
				$('.order-inputs').slideUp();
				$('.products-list').slideDown();
			} else {
				$('.order-inputs').slideDown();
				$('.products-list').slideUp();
			}
		};

		var date = new Date();

		console.log(date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() + 1).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2));

		//$scope.final_order.products = [];
		$scope.order = {};
		$scope.newClient = {};

		$scope.final_order = {};

		$scope.placeOrder = function () {
			$http.post('https://www.online.uz:3007/elma/uz/api/elma/point.json', $scope.newClient)
				.then(function (response) {
					console.log('success', resonse)
				}, function (err) {
					console.log('Error', err)
				})
		}

		$scope.showUsers = function () {
			$scope.order.products = [];
			var date = new Date()
			$scope.final_order = {
				active: 1,
				agent: $scope.order.agent._id,
				date: "2018-02-24T06:19:13.052Z",
				from_point: $scope.order.priceList.point,
				location: {
					"address": "sample address"
				},
				priceList: $scope.order.priceList._id,
				status: {
					"type": "sell"
				},
				products: []
			}
			$scope.products.forEach(function (p) {
				p.items.forEach(function (d) {
					if (d.total != 0) {
						$scope.order.products.push(d)
						$scope.final_order.products.push({
							product: d._id,
							count: d.total_boxes,
							prices: [{
								currency: "UZB",
								price: d.total,
								kurs: 1
								}]
						})
					}
				})
			});

			/*Model.Users.getAll().then(function (users) {
				$scope.users = angular.copy(users);
			});*/
			Modals.openModal($scope, 'templates/modals/users.html', 'animated rotateInDownLeft');
		};

		$scope.place_order = function () {
			$ionicLoading.show({
				content: 'Loading',
				animation: 'fade-in'
			});
			console.log($scope.final_order)
			$http({
					method: 'POST',
					url: 'https://www.online.uz:3007/elma/uz/api/elma/action.json',
					data: $scope.final_order
				})
				.then(function (resp) {
					console.log(resp);
					$ionicLoading.hide();
					$ionicLoading.show({
						content: resp.data,
						animation: 'fade-in',
						showBackdrop: true,
						maxWidth: 200,
						showDelay: 0
					});
				}, function (err, a, b, c) {
					console.log(err, a, b, c);
					$ionicLoading.hide();
				alert("Erro Occured")
				})
		}

		$scope.sum = function () {
			var totalPrice = 0;
			$scope.products.forEach(function (p) {
				p.items.forEach(function (d) {
					if (d.total != 0) {
						totalPrice += d.total
						//console.log(totalPrice)
						$scope.totalOrderPrice = totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
						//$scope.order.products.push(d)
					}
				})
			})
			//console.log(totalPrice)
		};

		$scope.confirmPopover = function () {

		}

		$scope.item_subtotal = function (byBox, inBox, byUnit, price, total, item) {
			/*var total_boxes = byBox * inBox;
			var total_price = price;
			console.log(typeof total_p rice)
			total_price *= total_boxes;
			if(byUnit != '')  {
				
			}*/
			//item.total = 0;
			var total_Unit = 0;
			var total_Box = 0;
			//var total_boxx = byBox * inBox
			/*console.log('byBox', typeof byBox);
			console.log('inBox', typeof inBox);
			console.log('byUnit', typeof byUnit);*/

			if (typeof byUnit == 'number') {
				total_Unit = byUnit * price;
			}

			if (typeof byBox == 'number') {
				byBox *= inBox;
				total_Box = byBox * price;
			}

			if (total_Unit != 0 && total_Box == 0) {
				//console.log('first IF');
				total = total_Unit;
			} else if (total_Unit == 0 && total_Box != 0) {
				total = total_Box;
				//console.log('second IF');
			} else {
				//console.log('THIRD IF');
				total = total_Box + total_Unit;
			}
			item.total = total;
			item.total_boxes = total / price;
			/*console.log(item.total)
			//item.total = total;*/
			return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		}

		$scope.updatePriceList = function (newPrice) {
			$http.get('https://www.online.uz:3007/elma/uz/api/elma/point-data/5901d0de5d9dcb0000000000/pricelist/' + newPrice._id + '.json')
				.success(function (data) {
					//console.log('agents', data.data);
					//$scope.pricelist = data.data;
					$scope.byPrice = data.data.data;
					//
					$scope.byPrice.forEach(function (d) {
						//console.log(d.prod);
						$scope.sub_products.forEach(function (p) {
							if (d.product == p._id) {
								p.price = d.prices;
								//console.log(p.price[0])
							} else {
								p.price == 'null'
							}
						})
					})
					//
				}).error(function (err) {
					console.log(err);
				});
		}

		$scope.numberWithSpaces = function (x) {
			if (x != undefined) {
				return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			}
		}

		$http.get('https://www.online.uz:3007/elma/uz/api/attr/product.category.json?limit=all')
			.success(function (data) {
				console.log(data.data);
				$scope.products = data.data;
				$http.get('https://www.online.uz:3007/elma/uz/api/elma/product.json?limit=all')
					.success(function (data) {
						/*/*/
						$scope.sub_products = data.data;
						$scope.products.forEach(function (p) {
							p.items = [];
							$scope.sub_products.forEach(function (d) {
								if (p._id == d.category) {
									d.total = 0;
									p.items.push(d)
								}
							});
						});
						console.log($scope.products)
					})
					.error(function (err) {
						console.log(err);
					});
			}).error(function (err) {
				console.log(err);
			});

		$http.get('https://www.online.uz:3007/elma/uz/api/elma/point.json?limit=all&select=number,agent,title,phone,type,location')
			.success(function (data) {
				//console.log('agents', data.data);
				$scope.agent_clients = data.data;
				$scope.agents = $scope.agent_clients.filter(function (p) {
					return p.type[0] == 'agent'
				});
				$scope.clients = $scope.agent_clients.filter(function (p) {
					return p.type[0] == 'client'
				})
				//console.log('agents', $scope.agents)
				//console.log('clients', $scope.clients)
			}).error(function (err) {
				console.log(err);
			});

		$http.get('https://www.online.uz:3007/elma/uz/api/elma/point-data/5901d0de5d9dcb0000000000/pricelist.json')
			.success(function (data) {
				//console.log('agents', data.data);
				$scope.pricelist = data.data;
				//console.log($scope.pricelist);
			}).error(function (err) {
				console.log(err);
			});

		$http.get('https://www.online.uz:3007/elma/uz/api/attr/region.json?limit=all')
			.success(function (data) {
				//console.log('agents', data.data);
				$scope.regions = data.data;
				console.log($scope.regions);
			}).error(function (err) {
				console.log(err);
			});

		$scope.filterClients = function (agentId) {
			$scope.clientById = $scope.clients.filter(function (p) {
				return p.agent == agentId._id
			});
			//console.log($scope.clientById)
		}


		/*
		 * if given group is the selected group, deselect it
		 * else, select the given group
		 */
		$scope.toggleGroup = function (product) {
			product.show = !product.show;
		};
		$scope.isGroupShown = function (product) {
			return product.show;
		};

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!

		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		var today = dd + '/' + mm + '/' + yyyy;
		$scope.order.date = today;

		/* if (!$scope.item.color) {
		     $ionicViewSwitcher.nextDirection('back');
		     $ionicHistory.nextViewOptions({
		         disableBack: true,
		         disableAnimate : true,
		         historyRoot  : true
		     });
		     $state.go('app.gallery');
		 }*/
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.directive('holdList', holdList);

	holdList.$inject = ['$ionicGesture'];
	function holdList($ionicGesture) {

		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				$ionicGesture.on('hold', function (e) {

					var content = element[0].querySelector('.item-content');

					var buttons = element[0].querySelector('.item-options');
					var buttonsWidth = buttons.offsetWidth;

					ionic.requestAnimationFrame(function () {
						content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

						if (!buttons.classList.contains('invisible')) {
							content.style[ionic.CSS.TRANSFORM] = '';
							setTimeout(function () {
								buttons.classList.add('invisible');
							}, 250);
						} else {
							buttons.classList.remove('invisible');
							content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
						}
					});


				}, element);
			}
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.directive('ionMultipleSelect', ionMultipleSelect);

	ionMultipleSelect.$inject = ['$ionicModal', '$ionicGesture'];
	function ionMultipleSelect($ionicModal, $ionicGesture) {

		return {
			restrict: 'E',
			scope: {
				options: "="
			},
			controller: function ($scope, $element, $attrs) {
				$scope.multipleSelect = {
					title: $attrs.title || "Select Options",
					tempOptions: [],
					keyProperty: $attrs.keyProperty || "id",
					valueProperty: $attrs.valueProperty || "value",
					selectedProperty: $attrs.selectedProperty || "selected",
					templateUrl: $attrs.templateUrl || 'templates/multipleSelect.html',
					renderCheckbox: $attrs.renderCheckbox ? $attrs.renderCheckbox == "true" : true,
					animation: $attrs.animation || 'slide-in-up'
				};

				$scope.OpenModalFromTemplate = function (templateUrl) {
					$ionicModal.fromTemplateUrl(templateUrl, {
						scope: $scope,
						animation: $scope.multipleSelect.animation
					}).then(function (modal) {
						$scope.modal = modal;
						$scope.modal.show();
					});
				};

				$ionicGesture.on('tap', function (e) {
					$scope.multipleSelect.tempOptions = $scope.options.map(function (option) {
						var tempOption = {};
						tempOption[$scope.multipleSelect.keyProperty] = option[$scope.multipleSelect.keyProperty];
						tempOption[$scope.multipleSelect.valueProperty] = option[$scope.multipleSelect.valueProperty];
						tempOption[$scope.multipleSelect.selectedProperty] = option[$scope.multipleSelect.selectedProperty];

						return tempOption;
					});
					$scope.OpenModalFromTemplate($scope.multipleSelect.templateUrl);
				}, $element);

				$scope.saveOptions = function () {
					for (var i = 0; i < $scope.multipleSelect.tempOptions.length; i++) {
						var tempOption = $scope.multipleSelect.tempOptions[i];
						for (var j = 0; j < $scope.options.length; j++) {
							var option = $scope.options[j];
							if (tempOption[$scope.multipleSelect.keyProperty] == option[$scope.multipleSelect.keyProperty]) {
								option[$scope.multipleSelect.selectedProperty] = tempOption[$scope.multipleSelect.selectedProperty];
								break;
							}
						}
					}
					$scope.closeModal();
				};

				$scope.closeModal = function () {
					$scope.modal.remove();
				};
				$scope.$on('$destroy', function () {
					if ($scope.modal) {
						$scope.modal.remove();
					}
				});
			}
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.directive('ionSearchSelect', ionSearchSelect);

	ionSearchSelect.$inject = ['$ionicModal', '$ionicGesture'];
	function ionSearchSelect($ionicModal, $ionicGesture) {

		return {
			restrict: 'E',
			scope: {
				options: "=",
				optionSelected: "="
			},
			controller: function ($scope, $element, $attrs) {
				$scope.searchSelect = {
					title: $attrs.title || "Search",
					keyProperty: $attrs.keyProperty,
					valueProperty: $attrs.valueProperty,
					templateUrl: $attrs.templateUrl || 'templates/searchSelect.html',
					animation: $attrs.animation || 'slide-in-up',
					option: null,
					searchvalue: "",
					enableSearch: $attrs.enableSearch ? $attrs.enableSearch == "true" : true
				};

				$ionicGesture.on('tap', function (e) {

					if (!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty) {
						if ($scope.optionSelected) {
							$scope.searchSelect.option = $scope.optionSelected[$scope.searchSelect.keyProperty];
						}
					}
					else {
						$scope.searchSelect.option = $scope.optionSelected;
					}
					$scope.OpenModalFromTemplate($scope.searchSelect.templateUrl);
				}, $element);

				$scope.saveOption = function () {
					if (!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty) {
						for (var i = 0; i < $scope.options.length; i++) {
							var currentOption = $scope.options[i];
							if (currentOption[$scope.searchSelect.keyProperty] == $scope.searchSelect.option) {
								$scope.optionSelected = currentOption;
								break;
							}
						}
					}
					else {
						$scope.optionSelected = $scope.searchSelect.option;
					}
					$scope.searchSelect.searchvalue = "";
					$scope.modal.remove();
				};

				$scope.clearSearch = function () {
					$scope.searchSelect.searchvalue = "";
				};

				$scope.closeModal = function () {
					$scope.modal.remove();
				};
				$scope.$on('$destroy', function () {
					if ($scope.modal) {
						$scope.modal.remove();
					}
				});

				$scope.OpenModalFromTemplate = function (templateUrl) {
					$ionicModal.fromTemplateUrl(templateUrl, {
						scope: $scope,
						animation: $scope.searchSelect.animation
					}).then(function (modal) {
						$scope.modal = modal;
						$scope.modal.show();
					});
				};
			}
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Modals', Modals);

	Modals.$inject = ['$ionicModal'];
	function Modals($ionicModal) {

		var modals = [];

		var _openModal = function ($scope, templateUrl, animation) {
			return $ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope,
				animation: animation || 'slide-in-up',
				backdropClickToClose: false
			}).then(function (modal) {
				modals.push(modal);
				modal.show();
			});
		};

		var _closeModal = function () {
			var currentModal = modals.splice(-1, 1)[0];
			currentModal.remove();
		};

		var _closeAllModals = function () {
			modals.map(function (modal) {
				modal.remove();
			});
			modals = [];
		};

		return {
			openModal: _openModal,
			closeModal: _closeModal,
			closeAllModals: _closeAllModals
		};
	}
})();
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
(function () {
	'use strict';

	angular
		.module('App')
		.service('$sqliteService', $sqliteService);

	$sqliteService.$inject = ['$q', '$cordovaSQLite'];
	function $sqliteService($q, $cordovaSQLite) {

		var self = this;
		var _db;

		self.db = function () {
			if (!_db) {
				if (window.sqlitePlugin !== undefined) {
					_db = window.sqlitePlugin.openDatabase({ name: "pre.db", location: 2, createFromLocation: 1 });
				} else {
					// For debugging in the browser
					_db = window.openDatabase("pre.db", "1.0", "Database", 200000);
				}
			}
			return _db;
		};

		self.getFirstItem = function (query, parameters) {
			var deferred = $q.defer();
			self.executeSql(query, parameters).then(function (res) {

				if (res.rows.length > 0)
					return deferred.resolve(res.rows.item(0));
				else
					return deferred.reject("There aren't items matching");
			}, function (err) {
				return deferred.reject(err);
			});

			return deferred.promise;
		};

		self.getFirstOrDefaultItem = function (query, parameters) {
			var deferred = $q.defer();
			self.executeSql(query, parameters).then(function (res) {

				if (res.rows.length > 0)
					return deferred.resolve(res.rows.item(0));
				else
					return deferred.resolve(null);
			}, function (err) {
				return deferred.reject(err);
			});

			return deferred.promise;
		};

		self.getItems = function (query, parameters) {
			var deferred = $q.defer();
			self.executeSql(query, parameters).then(function (res) {
				var items = [];
				for (var i = 0; i < res.rows.length; i++) {
					items.push(res.rows.item(i));
				}
				return deferred.resolve(items);
			}, function (err) {
				return deferred.reject(err);
			});

			return deferred.promise;
		};

		self.preloadDataBase = function (enableLog) {
			var deferred = $q.defer();

			//window.open("data:text/plain;charset=utf-8," + JSON.stringify({ data: window.queries.join('').replace(/\\n/g, '\n') }));
			if (window.sqlitePlugin === undefined) {
				enableLog && console.log('%c ***************** Starting the creation of the database in the browser ***************** ', 'background: #222; color: #bada55');
				self.db().transaction(function (tx) {
					for (var i = 0; i < window.queries.length; i++) {
						var query = window.queries[i].replace(/\\n/g, '\n');

						enableLog && console.log(window.queries[i]);
						tx.executeSql(query);
					}
				}, function (error) {
					deferred.reject(error);
				}, function () {
					enableLog && console.log('%c ***************** Completing the creation of the database in the browser ***************** ', 'background: #222; color: #bada55');
					deferred.resolve("OK");
				});
			}
			else {
				deferred.resolve("OK");
			}

			return deferred.promise;
		};

		self.executeSql = function (query, parameters) {
			return $cordovaSQLite.execute(self.db(), query, parameters);
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Users', Users);

	Users.$inject = ['$q', '$sqliteService'];
	function Users($q, $sqliteService) {

		return {
			getAll: function () {
				var query = "Select * FROM Users";
				return $q.when($sqliteService.getItems(query));
			},
			add: function (user) {
				var query = "INSERT INTO Users (Name) VALUES (?)";
				return $q.when($sqliteService.executeSql(query, [user.Name]));
			}
		};
	}
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImlzc3Vlcy5qcyIsInF1ZXJpZXMuanMiLCJjb250cm9sbGVycy9hcHAuanMiLCJjb250cm9sbGVycy9nYWxsZXJ5LmpzIiwiY29udHJvbGxlcnMvaG9tZS5qcyIsImNvbnRyb2xsZXJzL2l0ZW0uanMiLCJkaXJlY3RpdmVzL2hvbGRMaXN0LmpzIiwiZGlyZWN0aXZlcy9tdWx0aXBsZVNlbGVjdC5qcyIsImRpcmVjdGl2ZXMvc2VhcmNoU2VsZWN0LmpzIiwic2VydmljZXMvbW9kYWxzLmpzIiwic2VydmljZXMvbW9kZWwuanMiLCJzZXJ2aWNlcy9zcWxpdGUuanMiLCJzZXJ2aWNlcy91c2Vycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIElvbmljIFN0YXJ0ZXIgQXBwXHJcblxyXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xyXG4vLyAnQXBwJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxyXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXHJcbmFuZ3VsYXIubW9kdWxlKCdBcHAnLCBbJ2lvbmljJywgJ25nQ29yZG92YScsICduZ0FuaW1hdGUnLCAndWkubWFzaycsICduZ0Nvb2tpZXMnXSlcclxuXHJcblx0LnJ1bihbJyRpb25pY1BsYXRmb3JtJyxcclxuXHRcdFx0JyRzcWxpdGVTZXJ2aWNlJyxcclxuICAgICAgZnVuY3Rpb24gKCRpb25pY1BsYXRmb3JtLCAkc3FsaXRlU2VydmljZSkge1xyXG5cdFx0XHQkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcclxuXHRcdFx0XHRcdC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcclxuXHRcdFx0XHRcdC8vIGZvciBmb3JtIGlucHV0cylcclxuXHRcdFx0XHRcdGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gRG9uJ3QgcmVtb3ZlIHRoaXMgbGluZSB1bmxlc3MgeW91IGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nLiBJdCBzdG9wcyB0aGUgdmlld3BvcnRcclxuXHRcdFx0XHRcdC8vIGZyb20gc25hcHBpbmcgd2hlbiB0ZXh0IGlucHV0cyBhcmUgZm9jdXNlZC4gSW9uaWMgaGFuZGxlcyB0aGlzIGludGVybmFsbHkgZm9yXHJcblx0XHRcdFx0XHQvLyBhIG11Y2ggbmljZXIga2V5Ym9hcmQgZXhwZXJpZW5jZS5cclxuXHRcdFx0XHRcdGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAod2luZG93LlN0YXR1c0Jhcikge1xyXG5cdFx0XHRcdFx0U3RhdHVzQmFyLnN0eWxlRGVmYXVsdCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly9Mb2FkIHRoZSBQcmUtcG9wdWxhdGVkIGRhdGFiYXNlLCBkZWJ1ZyA9IHRydWVcclxuXHRcdFx0XHQkc3FsaXRlU2VydmljZS5wcmVsb2FkRGF0YUJhc2UodHJ1ZSk7XHJcblx0XHRcdH0pO1xyXG59XSlcclxuXHQuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLFxyXG4gICAgICAgICAnJHVybFJvdXRlclByb3ZpZGVyJyxcclxuICAgICAgICAgJyRpb25pY0NvbmZpZ1Byb3ZpZGVyJyxcclxuICAgICAgICAgJyRjb21waWxlUHJvdmlkZXInLFxyXG4gICAgICAgICBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGlvbmljQ29uZmlnUHJvdmlkZXIsICRjb21waWxlUHJvdmlkZXIpIHtcclxuXHRcdFx0ICBcclxuXHRcdFx0JGNvbXBpbGVQcm92aWRlci5pbWdTcmNTYW5pdGl6YXRpb25XaGl0ZWxpc3QoL15cXHMqKGh0dHBzP3xmdHB8ZmlsZXxibG9ifGNvbnRlbnR8bXMtYXBweHx4LXdtYXBwMCk6fGRhdGE6aW1hZ2VcXC98aW1nXFwvLyk7XHJcblx0XHRcdCRjb21waWxlUHJvdmlkZXIuYUhyZWZTYW5pdGl6YXRpb25XaGl0ZWxpc3QoL15cXHMqKGh0dHBzP3xmdHB8bWFpbHRvfGZpbGV8Z2h0dHBzP3xtcy1hcHB4fHgtd21hcHAwKTovKTtcclxuXHJcblx0XHRcdCRpb25pY0NvbmZpZ1Byb3ZpZGVyLnNjcm9sbGluZy5qc1Njcm9sbGluZyhpb25pYy5QbGF0Zm9ybS5pc0lPUygpKTtcclxuXHJcblx0XHRcdCRzdGF0ZVByb3ZpZGVyXHJcblx0XHRcdFx0LnN0YXRlKCdob21lJywge1xyXG5cdFx0XHRcdFx0dXJsOiBcIi9ob21lXCIsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvaG9tZS5odG1sXCIsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJ2FwcCcsIHtcclxuXHRcdFx0XHRcdHVybDogJy9hcHAnLFxyXG5cdFx0XHRcdFx0YWJzdHJhY3Q6IHRydWUsXHJcblx0XHRcdFx0XHRjb250cm9sbGVyOiAnQXBwQ29udHJvbGxlcicsXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9tZW51Lmh0bWwnLFxyXG5cdFx0XHRcdFx0b25FbnRlcjogZnVuY3Rpb24gKCRzdGF0ZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJTZXNzaW9uJykgPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdCRzdGF0ZS5nbygnaG9tZScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQuc3RhdGUoJ2FwcC5nYWxsZXJ5Jywge1xyXG5cdFx0XHRcdFx0dXJsOiBcIi9nYWxsZXJ5XCIsXHJcblx0XHRcdFx0XHRjYWNoZTogZmFsc2UsXHJcblx0XHRcdFx0XHR2aWV3czoge1xyXG5cdFx0XHRcdFx0XHR2aWV3Q29udGVudDoge1xyXG5cdFx0XHRcdFx0XHRcdHRlbXBsYXRlVXJsOiBcInRlbXBsYXRlcy9nYWxsZXJ5Lmh0bWxcIixcclxuXHRcdFx0XHRcdFx0XHRjb250cm9sbGVyOiAnR2FsbGVyeUNvbnRyb2xsZXInXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5zdGF0ZSgnYXBwLml0ZW0nLCB7XHJcblx0XHRcdFx0XHR1cmw6IFwiL2l0ZW1cIixcclxuXHRcdFx0XHRcdGNhY2hlOiBmYWxzZSxcclxuXHRcdFx0XHRcdHZpZXdzOiB7XHJcblx0XHRcdFx0XHRcdHZpZXdDb250ZW50OiB7XHJcblx0XHRcdFx0XHRcdFx0dGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2l0ZW0uaHRtbFwiLFxyXG5cdFx0XHRcdFx0XHRcdGNvbnRyb2xsZXI6ICdJdGVtQ29udHJvbGxlcidcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnN0YXRlKCdhcHAubmV3LWNsaWVudCcsIHtcclxuXHRcdFx0XHRcdHVybDogXCIvbmV3LWNsaWVudFwiLFxyXG5cdFx0XHRcdFx0Y2FjaGU6IGZhbHNlLFxyXG5cdFx0XHRcdFx0dmlld3M6IHtcclxuXHRcdFx0XHRcdFx0dmlld0NvbnRlbnQ6IHtcclxuXHRcdFx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvbmV3LWNsaWVudC5odG1sXCIsXHJcblx0XHRcdFx0XHRcdFx0Y29udHJvbGxlcjogJ0l0ZW1Db250cm9sbGVyJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKGZ1bmN0aW9uICgkaW5qZWN0b3IsICRsb2NhdGlvbikge1xyXG5cdFx0XHRcdHZhciAkc3RhdGUgPSAkaW5qZWN0b3IuZ2V0KFwiJHN0YXRlXCIpO1xyXG5cdFx0XHRcdCRzdGF0ZS5nbyhcImhvbWVcIik7XHJcblx0XHRcdH0pO1xyXG59XSk7IiwiLyogZ2xvYmFsIGlvbmljICovXHJcbihmdW5jdGlvbiAoYW5ndWxhciwgaW9uaWMpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0aW9uaWMuUGxhdGZvcm0uaXNJRSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBpb25pYy5QbGF0Zm9ybS51YS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ3RyaWRlbnQnKSA+IC0xO1xyXG5cdH1cclxuXHJcblx0aWYgKGlvbmljLlBsYXRmb3JtLmlzSUUoKSkge1xyXG5cdFx0YW5ndWxhci5tb2R1bGUoJ2lvbmljJylcclxuXHRcdFx0LmZhY3RvcnkoJyRpb25pY05nQ2xpY2snLCBbJyRwYXJzZScsICckdGltZW91dCcsIGZ1bmN0aW9uICgkcGFyc2UsICR0aW1lb3V0KSB7XHJcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgY2xpY2tFeHByKSB7XHJcblx0XHRcdFx0XHR2YXIgY2xpY2tIYW5kbGVyID0gYW5ndWxhci5pc0Z1bmN0aW9uKGNsaWNrRXhwcikgPyBjbGlja0V4cHIgOiAkcGFyc2UoY2xpY2tFeHByKTtcclxuXHJcblx0XHRcdFx0XHRlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG5cdFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChzY29wZS5jbGlja3RpbWVyKSByZXR1cm47IC8vIFNlY29uZCBjYWxsXHJcblx0XHRcdFx0XHRcdFx0Y2xpY2tIYW5kbGVyKHNjb3BlLCB7ICRldmVudDogKGV2ZW50KSB9KTtcclxuXHRcdFx0XHRcdFx0XHRzY29wZS5jbGlja3RpbWVyID0gJHRpbWVvdXQoZnVuY3Rpb24gKCkgeyBkZWxldGUgc2NvcGUuY2xpY2t0aW1lcjsgfSwgMSwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdC8vIEhhY2sgZm9yIGlPUyBTYWZhcmkncyBiZW5lZml0LiBJdCBnb2VzIHNlYXJjaGluZyBmb3Igb25jbGljayBoYW5kbGVycyBhbmQgaXMgbGlhYmxlIHRvIGNsaWNrXHJcblx0XHRcdFx0XHQvLyBzb21ldGhpbmcgZWxzZSBuZWFyYnkuXHJcblx0XHRcdFx0XHRlbGVtZW50Lm9uY2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHsgfTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9XSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBTZWxlY3REaXJlY3RpdmUoKSB7XHJcblx0XHQndXNlIHN0cmljdCc7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdFx0cmVwbGFjZTogZmFsc2UsXHJcblx0XHRcdGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCkge1xyXG5cdFx0XHRcdGlmIChpb25pYy5QbGF0Zm9ybSAmJiAoaW9uaWMuUGxhdGZvcm0uaXNXaW5kb3dzUGhvbmUoKSB8fCBpb25pYy5QbGF0Zm9ybS5pc0lFKCkgfHwgaW9uaWMuUGxhdGZvcm0ucGxhdGZvcm0oKSA9PT0gXCJlZGdlXCIpKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LmF0dHIoJ2RhdGEtdGFwLWRpc2FibGVkJywgJ3RydWUnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRhbmd1bGFyLm1vZHVsZSgnaW9uaWMnKVxyXG4gICAgLmRpcmVjdGl2ZSgnc2VsZWN0JywgU2VsZWN0RGlyZWN0aXZlKTtcclxuXHJcblx0Lyphbmd1bGFyLm1vZHVsZSgnaW9uaWMtZGF0ZXBpY2tlcicpXHJcblx0LmRpcmVjdGl2ZSgnc2VsZWN0JywgU2VsZWN0RGlyZWN0aXZlKTsqL1xyXG5cclxufSkoYW5ndWxhciwgaW9uaWMpOyIsIndpbmRvdy5xdWVyaWVzID0gW1xyXG5cdC8vRHJvcCB0YWJsZXNcclxuICAgXCJEUk9QIFRBQkxFIElGIEVYSVNUUyBVc2VycztcIixcclxuXHQvL0NyZWF0ZSB0YWJsZXNcclxuXHRcIkNSRUFURSBUQUJMRSBVc2VycyAoSWRVc2VyIGludGVnZXIgcHJpbWFyeSBrZXkgYXV0b2luY3JlbWVudCwgTmFtZSB0ZXh0IG5vdCBudWxsKTtcIixcclxuXHQvL0luc2VydCBVc2Vyc1xyXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdKdWFuIERhdmlkIE5pY2hvbGxzIENhcmRvbmEnKTtcIixcclxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnS2hyaXp0aWFuIE1vcmVubyBadWx1YWdhJyk7XCIsXHJcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0NyaXN0aWFuIFJpdmFzIEJ1aXRyYWdvJyk7XCIsXHJcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0p1YW4gRGF2aWQgU8OhbmNoZXonKTtcIixcclxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnTmljb2xhcyBNb2xpbmEnKTtcIixcclxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnTWl5YW1vdG8gTXVzYXNoaSBGSWxhbmRlcicpO1wiLFxyXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdEaWRpZXIgSGVybmFuZGV6Jyk7XCIsXHJcblx0XCJJTlNFUlQgSU5UTyAnVXNlcnMnICgnTmFtZScpIFZBTFVFUyAoJ0x1aXMgRWR1YXJkbyBPcXVlbmRvIFDDqXJleicpO1wiLFxyXG5cdFwiSU5TRVJUIElOVE8gJ1VzZXJzJyAoJ05hbWUnKSBWQUxVRVMgKCdDYXJsb3MgUm9qYXMnKTtcIixcclxuXHRcIklOU0VSVCBJTlRPICdVc2VycycgKCdOYW1lJykgVkFMVUVTICgnTGV2YW5vIENhc3RpbGxhIENhcmxvcyBNaWd1ZWwnKTtcIlxyXG5dOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ0FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FwcENvbnRyb2xsZXInLCBBcHBDb250cm9sbGVyKTtcclxuXHJcbiAgICBBcHBDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckaW9uaWNQb3BvdmVyJywgJyRzdGF0ZSddO1xyXG4gICAgZnVuY3Rpb24gQXBwQ29udHJvbGxlcigkc2NvcGUsICRpb25pY1BvcG92ZXIsICRzdGF0ZSkge1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAkc2NvcGUuZXhpdEFwcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaW9uaWMuUGxhdGZvcm0uZXhpdEFwcCgpO1xyXG4gICAgICAgIH07XHJcblx0XHRcclxuXHRcdGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlclNlc3Npb24nKSA9PSBudWxsKSB7XHJcblx0XHRcdCRzdGF0ZS5nbygnaG9tZScpOyBcclxuXHRcdH1cclxuXHJcbiAgICAgICAgJGlvbmljUG9wb3Zlci5mcm9tVGVtcGxhdGVVcmwoJ3RlbXBsYXRlcy9tb2RhbHMvcG9wb3Zlci5odG1sJywge1xyXG4gICAgICAgICAgICBzY29wZTogJHNjb3BlXHJcbiAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocG9wb3Zlcikge1xyXG4gICAgICAgICAgICAkc2NvcGUucG9wb3ZlciA9IHBvcG92ZXI7XHJcbiAgICAgICAgfSk7XHJcblx0XHRcclxuXHRcdCRzY29wZS5zaWduT3V0ID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXJTZXNzaW9uJyk7XHJcblx0XHRcdCRzdGF0ZS5nbygnaG9tZScpXHJcblx0XHR9O1xyXG5cclxuICAgICAgICAkc2NvcGUub3BlblBvcG92ZXIgPSBmdW5jdGlvbiAoJGV2ZW50KSB7XHJcbiAgICAgICAgICAgICRzY29wZS5wb3BvdmVyLnNob3coJGV2ZW50KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgICRzY29wZS4kb24oJyRkZXN0cm95JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5wb3BvdmVyLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0dhbGxlcnlDb250cm9sbGVyJywgR2FsbGVyeUNvbnRyb2xsZXIpO1xyXG5cclxuXHRHYWxsZXJ5Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJyRodHRwJ107XHJcblxyXG5cdGZ1bmN0aW9uIEdhbGxlcnlDb250cm9sbGVyKCRzY29wZSwgJHN0YXRlLCAkaHR0cCkge1xyXG5cclxuXHRcdFxyXG5cdFx0XHJcblx0XHRpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJTZXNzaW9uJykgPT0gbnVsbCkge1xyXG5cdFx0XHQkc3RhdGUuZ28oJ2hvbWUnKTtcclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUub3Blbkl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xyXG5cdFx0XHQkc3RhdGUuZ28oJ2FwcC5pdGVtJyk7XHJcblx0XHR9O1xyXG5cdFx0JHNjb3BlLmFkZE5ld0NsaWVudCA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdCRzdGF0ZS5nbygnYXBwLm5ldy1jbGllbnQnKTtcclxuXHRcdH07XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xyXG5cclxuXHRIb21lQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGlvbmljUG9wdXAnLCAnTW9kYWxzJywgJ01vZGVsJywgJyRodHRwJywgJyRzdGF0ZScsICckcm9vdFNjb3BlJ107XHJcblx0ZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIoJHNjb3BlLCAkaW9uaWNQb3B1cCwgTW9kYWxzLCBNb2RlbCwgJGh0dHAsICRzdGF0ZSwgJHJvb3RTY29wZSkge1xyXG5cclxuXHRcdCRzY29wZS51c2VycyA9IFtdO1xyXG5cclxuXHRcdCRzY29wZS5IZWxsb1dvcmxkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkaW9uaWNQb3B1cC5hbGVydCh7XHJcblx0XHRcdFx0dGl0bGU6ICdIZWxsbyBXb3JsZCcsXHJcblx0XHRcdFx0dGVtcGxhdGU6ICdUaGlzIGlzIHRoZSBiZXN0IHRlbXBsYXRlIHRvIHN0YXJ0IHdpdGggSW9uaWMgRnJhbWV3b3JrIScsXHJcbiAgICAgXHRcdGNzc0NsYXNzOiAnYW5pbWF0ZWQgYm91bmNlSW5Eb3duJ1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdCRzY29wZS5zaG93VXNlcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdC8qTW9kZWwuVXNlcnMuZ2V0QWxsKCkudGhlbihmdW5jdGlvbiAodXNlcnMpIHtcclxuXHRcdFx0XHQkc2NvcGUudXNlcnMgPSBhbmd1bGFyLmNvcHkodXNlcnMpO1xyXG5cdFx0XHR9KTsqL1xyXG5cdFx0XHRNb2RhbHMub3Blbk1vZGFsKCRzY29wZSwgJ3RlbXBsYXRlcy9tb2RhbHMvdXNlcnMuaHRtbCcsICdhbmltYXRlZCByb3RhdGVJbkRvd25MZWZ0Jyk7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHQkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0TW9kYWxzLmNsb3NlTW9kYWwoKTtcclxuXHRcdFx0JHNjb3BlLnVzZXJzID0gW107XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHQkc2NvcGUudXNlciA9IHt9O1xyXG5cdFx0XHJcblx0XHQkc2NvcGUuc2lnbkluID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLnVzZXIpXHJcblx0XHRcdCRodHRwLnBvc3QoJ2h0dHBzOi8vd3d3Lm9ubGluZS51ejozMDA3L2VsbWEvdXovYXBpL2F1dGgvc2lnbmluLmpzb24nLCAkc2NvcGUudXNlcilcclxuXHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJTZXNzaW9uJywgcmVzcG9uc2UuZGF0YS50b2tlbilcclxuXHRcdFx0XHQkc3RhdGUuZ28oJ2FwcC5nYWxsZXJ5Jyk7XHJcblx0XHRcdFx0JHJvb3RTY29wZS51c2VySW5mbyA9IHJlc3BvbnNlLmRhdGE7XHJcblx0XHR9KS5lcnJvcihmdW5jdGlvbihlcnIsIHN0YXR1cywgY29uZmlnLCBoZWFkZXJzKXtcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyLCBzdGF0dXMsIGNvbmZpZywgaGVhZGVycylcclxuXHRcdH0pXHJcblx0XHR9XHJcblx0XHRcclxuXHRcdFxyXG5cdFx0Ly9DZW50ZXIgY29udGVudFxyXG5cdFx0Ly8xLiBodHRwOi8vY29kZXBlbi5pby9taGFydGluZ3Rvbi9wZW4vZ2NIZUxcclxuXHRcdC8vMi4gaHR0cDovL2NvZGVwZW4uaW8vYW5vbi9wZW4vbWVRSnZwXHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0l0ZW1Db250cm9sbGVyJywgSXRlbUNvbnRyb2xsZXIpO1xyXG5cclxuXHRJdGVtQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1ZpZXdTd2l0Y2hlcicsICckc3RhdGUnLCAnJGlvbmljSGlzdG9yeScsICckaHR0cCcsICckcm9vdFNjb3BlJywgJ01vZGFscycsICckaW9uaWNMb2FkaW5nJ107XHJcblxyXG5cdGZ1bmN0aW9uIEl0ZW1Db250cm9sbGVyKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNWaWV3U3dpdGNoZXIsICRzdGF0ZSwgJGlvbmljSGlzdG9yeSwgJGh0dHAsICRyb290U2NvcGUsIE1vZGFscywgJGlvbmljTG9hZGluZykge1xyXG5cclxuXHRcdCRzY29wZS5pdGVtID0ge1xyXG5cdFx0XHR0aXRsZTogJHN0YXRlUGFyYW1zLnRpdGxlLFxyXG5cdFx0XHRpY29uOiAkc3RhdGVQYXJhbXMuaWNvbixcclxuXHRcdFx0Y29sb3I6ICRzdGF0ZVBhcmFtcy5jb2xvclxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0TW9kYWxzLmNsb3NlTW9kYWwoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnRvZ2dsZVByb2R1Y3RzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoJCgnLnByb2R1Y3RzLWxpc3QnKS5jc3MoJ2Rpc3BsYXknKSA9PSAnbm9uZScpIHtcclxuXHRcdFx0XHQkKCcub3JkZXItaW5wdXRzJykuc2xpZGVVcCgpO1xyXG5cdFx0XHRcdCQoJy5wcm9kdWN0cy1saXN0Jykuc2xpZGVEb3duKCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCgnLm9yZGVyLWlucHV0cycpLnNsaWRlRG93bigpO1xyXG5cdFx0XHRcdCQoJy5wcm9kdWN0cy1saXN0Jykuc2xpZGVVcCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBkYXRlID0gbmV3IERhdGUoKTtcclxuXHJcblx0XHRjb25zb2xlLmxvZyhkYXRlLmdldEZ1bGxZZWFyKCkgKyAoXCIwXCIgKyAoZGF0ZS5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKSArIChcIjBcIiArIGRhdGUuZ2V0RGF0ZSgpKS5zbGljZSgtMikgKyAoXCIwXCIgKyBkYXRlLmdldEhvdXJzKCkgKyAxKS5zbGljZSgtMikgKyAoXCIwXCIgKyBkYXRlLmdldE1pbnV0ZXMoKSkuc2xpY2UoLTIpICsgKFwiMFwiICsgZGF0ZS5nZXRTZWNvbmRzKCkpLnNsaWNlKC0yKSk7XHJcblxyXG5cdFx0Ly8kc2NvcGUuZmluYWxfb3JkZXIucHJvZHVjdHMgPSBbXTtcclxuXHRcdCRzY29wZS5vcmRlciA9IHt9O1xyXG5cdFx0JHNjb3BlLm5ld0NsaWVudCA9IHt9O1xyXG5cclxuXHRcdCRzY29wZS5maW5hbF9vcmRlciA9IHt9O1xyXG5cclxuXHRcdCRzY29wZS5wbGFjZU9yZGVyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkaHR0cC5wb3N0KCdodHRwczovL3d3dy5vbmxpbmUudXo6MzAwNy9lbG1hL3V6L2FwaS9lbG1hL3BvaW50Lmpzb24nLCAkc2NvcGUubmV3Q2xpZW50KVxyXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3N1Y2Nlc3MnLCByZXNvbnNlKVxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdFcnJvcicsIGVycilcclxuXHRcdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdCRzY29wZS5zaG93VXNlcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCRzY29wZS5vcmRlci5wcm9kdWN0cyA9IFtdO1xyXG5cdFx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKClcclxuXHRcdFx0JHNjb3BlLmZpbmFsX29yZGVyID0ge1xyXG5cdFx0XHRcdGFjdGl2ZTogMSxcclxuXHRcdFx0XHRhZ2VudDogJHNjb3BlLm9yZGVyLmFnZW50Ll9pZCxcclxuXHRcdFx0XHRkYXRlOiBcIjIwMTgtMDItMjRUMDY6MTk6MTMuMDUyWlwiLFxyXG5cdFx0XHRcdGZyb21fcG9pbnQ6ICRzY29wZS5vcmRlci5wcmljZUxpc3QucG9pbnQsXHJcblx0XHRcdFx0bG9jYXRpb246IHtcclxuXHRcdFx0XHRcdFwiYWRkcmVzc1wiOiBcInNhbXBsZSBhZGRyZXNzXCJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHByaWNlTGlzdDogJHNjb3BlLm9yZGVyLnByaWNlTGlzdC5faWQsXHJcblx0XHRcdFx0c3RhdHVzOiB7XHJcblx0XHRcdFx0XHRcInR5cGVcIjogXCJzZWxsXCJcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHByb2R1Y3RzOiBbXVxyXG5cdFx0XHR9XHJcblx0XHRcdCRzY29wZS5wcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XHJcblx0XHRcdFx0cC5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRpZiAoZC50b3RhbCAhPSAwKSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5vcmRlci5wcm9kdWN0cy5wdXNoKGQpXHJcblx0XHRcdFx0XHRcdCRzY29wZS5maW5hbF9vcmRlci5wcm9kdWN0cy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0XHRwcm9kdWN0OiBkLl9pZCxcclxuXHRcdFx0XHRcdFx0XHRjb3VudDogZC50b3RhbF9ib3hlcyxcclxuXHRcdFx0XHRcdFx0XHRwcmljZXM6IFt7XHJcblx0XHRcdFx0XHRcdFx0XHRjdXJyZW5jeTogXCJVWkJcIixcclxuXHRcdFx0XHRcdFx0XHRcdHByaWNlOiBkLnRvdGFsLFxyXG5cdFx0XHRcdFx0XHRcdFx0a3VyczogMVxyXG5cdFx0XHRcdFx0XHRcdFx0fV1cclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8qTW9kZWwuVXNlcnMuZ2V0QWxsKCkudGhlbihmdW5jdGlvbiAodXNlcnMpIHtcclxuXHRcdFx0XHQkc2NvcGUudXNlcnMgPSBhbmd1bGFyLmNvcHkodXNlcnMpO1xyXG5cdFx0XHR9KTsqL1xyXG5cdFx0XHRNb2RhbHMub3Blbk1vZGFsKCRzY29wZSwgJ3RlbXBsYXRlcy9tb2RhbHMvdXNlcnMuaHRtbCcsICdhbmltYXRlZCByb3RhdGVJbkRvd25MZWZ0Jyk7XHJcblx0XHR9O1xyXG5cclxuXHRcdCRzY29wZS5wbGFjZV9vcmRlciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JGlvbmljTG9hZGluZy5zaG93KHtcclxuXHRcdFx0XHRjb250ZW50OiAnTG9hZGluZycsXHJcblx0XHRcdFx0YW5pbWF0aW9uOiAnZmFkZS1pbidcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5maW5hbF9vcmRlcilcclxuXHRcdFx0JGh0dHAoe1xyXG5cdFx0XHRcdFx0bWV0aG9kOiAnUE9TVCcsXHJcblx0XHRcdFx0XHR1cmw6ICdodHRwczovL3d3dy5vbmxpbmUudXo6MzAwNy9lbG1hL3V6L2FwaS9lbG1hL2FjdGlvbi5qc29uJyxcclxuXHRcdFx0XHRcdGRhdGE6ICRzY29wZS5maW5hbF9vcmRlclxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3ApO1xyXG5cdFx0XHRcdFx0JGlvbmljTG9hZGluZy5oaWRlKCk7XHJcblx0XHRcdFx0XHQkaW9uaWNMb2FkaW5nLnNob3coe1xyXG5cdFx0XHRcdFx0XHRjb250ZW50OiByZXNwLmRhdGEsXHJcblx0XHRcdFx0XHRcdGFuaW1hdGlvbjogJ2ZhZGUtaW4nLFxyXG5cdFx0XHRcdFx0XHRzaG93QmFja2Ryb3A6IHRydWUsXHJcblx0XHRcdFx0XHRcdG1heFdpZHRoOiAyMDAsXHJcblx0XHRcdFx0XHRcdHNob3dEZWxheTogMFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSwgZnVuY3Rpb24gKGVyciwgYSwgYiwgYykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyLCBhLCBiLCBjKTtcclxuXHRcdFx0XHRcdCRpb25pY0xvYWRpbmcuaGlkZSgpO1xyXG5cdFx0XHRcdGFsZXJ0KFwiRXJybyBPY2N1cmVkXCIpXHJcblx0XHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUuc3VtID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgdG90YWxQcmljZSA9IDA7XHJcblx0XHRcdCRzY29wZS5wcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XHJcblx0XHRcdFx0cC5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XHJcblx0XHRcdFx0XHRpZiAoZC50b3RhbCAhPSAwKSB7XHJcblx0XHRcdFx0XHRcdHRvdGFsUHJpY2UgKz0gZC50b3RhbFxyXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHRvdGFsUHJpY2UpXHJcblx0XHRcdFx0XHRcdCRzY29wZS50b3RhbE9yZGVyUHJpY2UgPSB0b3RhbFByaWNlLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgXCIgXCIpO1xyXG5cdFx0XHRcdFx0XHQvLyRzY29wZS5vcmRlci5wcm9kdWN0cy5wdXNoKGQpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fSlcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyh0b3RhbFByaWNlKVxyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuY29uZmlybVBvcG92ZXIgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdCRzY29wZS5pdGVtX3N1YnRvdGFsID0gZnVuY3Rpb24gKGJ5Qm94LCBpbkJveCwgYnlVbml0LCBwcmljZSwgdG90YWwsIGl0ZW0pIHtcclxuXHRcdFx0Lyp2YXIgdG90YWxfYm94ZXMgPSBieUJveCAqIGluQm94O1xyXG5cdFx0XHR2YXIgdG90YWxfcHJpY2UgPSBwcmljZTtcclxuXHRcdFx0Y29uc29sZS5sb2codHlwZW9mIHRvdGFsX3AgcmljZSlcclxuXHRcdFx0dG90YWxfcHJpY2UgKj0gdG90YWxfYm94ZXM7XHJcblx0XHRcdGlmKGJ5VW5pdCAhPSAnJykgIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0fSovXHJcblx0XHRcdC8vaXRlbS50b3RhbCA9IDA7XHJcblx0XHRcdHZhciB0b3RhbF9Vbml0ID0gMDtcclxuXHRcdFx0dmFyIHRvdGFsX0JveCA9IDA7XHJcblx0XHRcdC8vdmFyIHRvdGFsX2JveHggPSBieUJveCAqIGluQm94XHJcblx0XHRcdC8qY29uc29sZS5sb2coJ2J5Qm94JywgdHlwZW9mIGJ5Qm94KTtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2luQm94JywgdHlwZW9mIGluQm94KTtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2J5VW5pdCcsIHR5cGVvZiBieVVuaXQpOyovXHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIGJ5VW5pdCA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdHRvdGFsX1VuaXQgPSBieVVuaXQgKiBwcmljZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHR5cGVvZiBieUJveCA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdGJ5Qm94ICo9IGluQm94O1xyXG5cdFx0XHRcdHRvdGFsX0JveCA9IGJ5Qm94ICogcHJpY2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0b3RhbF9Vbml0ICE9IDAgJiYgdG90YWxfQm94ID09IDApIHtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdmaXJzdCBJRicpO1xyXG5cdFx0XHRcdHRvdGFsID0gdG90YWxfVW5pdDtcclxuXHRcdFx0fSBlbHNlIGlmICh0b3RhbF9Vbml0ID09IDAgJiYgdG90YWxfQm94ICE9IDApIHtcclxuXHRcdFx0XHR0b3RhbCA9IHRvdGFsX0JveDtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdzZWNvbmQgSUYnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdUSElSRCBJRicpO1xyXG5cdFx0XHRcdHRvdGFsID0gdG90YWxfQm94ICsgdG90YWxfVW5pdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpdGVtLnRvdGFsID0gdG90YWw7XHJcblx0XHRcdGl0ZW0udG90YWxfYm94ZXMgPSB0b3RhbCAvIHByaWNlO1xyXG5cdFx0XHQvKmNvbnNvbGUubG9nKGl0ZW0udG90YWwpXHJcblx0XHRcdC8vaXRlbS50b3RhbCA9IHRvdGFsOyovXHJcblx0XHRcdHJldHVybiB0b3RhbC50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiIFwiKTtcclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUudXBkYXRlUHJpY2VMaXN0ID0gZnVuY3Rpb24gKG5ld1ByaWNlKSB7XHJcblx0XHRcdCRodHRwLmdldCgnaHR0cHM6Ly93d3cub25saW5lLnV6OjMwMDcvZWxtYS91ei9hcGkvZWxtYS9wb2ludC1kYXRhLzU5MDFkMGRlNWQ5ZGNiMDAwMDAwMDAwMC9wcmljZWxpc3QvJyArIG5ld1ByaWNlLl9pZCArICcuanNvbicpXHJcblx0XHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coJ2FnZW50cycsIGRhdGEuZGF0YSk7XHJcblx0XHRcdFx0XHQvLyRzY29wZS5wcmljZWxpc3QgPSBkYXRhLmRhdGE7XHJcblx0XHRcdFx0XHQkc2NvcGUuYnlQcmljZSA9IGRhdGEuZGF0YS5kYXRhO1xyXG5cdFx0XHRcdFx0Ly9cclxuXHRcdFx0XHRcdCRzY29wZS5ieVByaWNlLmZvckVhY2goZnVuY3Rpb24gKGQpIHtcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhkLnByb2QpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUuc3ViX3Byb2R1Y3RzLmZvckVhY2goZnVuY3Rpb24gKHApIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoZC5wcm9kdWN0ID09IHAuX2lkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRwLnByaWNlID0gZC5wcmljZXM7XHJcblx0XHRcdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKHAucHJpY2VbMF0pXHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHAucHJpY2UgPT0gJ251bGwnXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC8vXHJcblx0XHRcdFx0fSkuZXJyb3IoZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQkc2NvcGUubnVtYmVyV2l0aFNwYWNlcyA9IGZ1bmN0aW9uICh4KSB7XHJcblx0XHRcdGlmICh4ICE9IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHJldHVybiB4LnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgXCIgXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0JGh0dHAuZ2V0KCdodHRwczovL3d3dy5vbmxpbmUudXo6MzAwNy9lbG1hL3V6L2FwaS9hdHRyL3Byb2R1Y3QuY2F0ZWdvcnkuanNvbj9saW1pdD1hbGwnKVxyXG5cdFx0XHQuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEuZGF0YSk7XHJcblx0XHRcdFx0JHNjb3BlLnByb2R1Y3RzID0gZGF0YS5kYXRhO1xyXG5cdFx0XHRcdCRodHRwLmdldCgnaHR0cHM6Ly93d3cub25saW5lLnV6OjMwMDcvZWxtYS91ei9hcGkvZWxtYS9wcm9kdWN0Lmpzb24/bGltaXQ9YWxsJylcclxuXHRcdFx0XHRcdC5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XHJcblx0XHRcdFx0XHRcdC8qLyovXHJcblx0XHRcdFx0XHRcdCRzY29wZS5zdWJfcHJvZHVjdHMgPSBkYXRhLmRhdGE7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5wcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XHJcblx0XHRcdFx0XHRcdFx0cC5pdGVtcyA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5zdWJfcHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbiAoZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHAuX2lkID09IGQuY2F0ZWdvcnkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZC50b3RhbCA9IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHAuaXRlbXMucHVzaChkKVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLnByb2R1Y3RzKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC5lcnJvcihmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0fSkuZXJyb3IoZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdCRodHRwLmdldCgnaHR0cHM6Ly93d3cub25saW5lLnV6OjMwMDcvZWxtYS91ei9hcGkvZWxtYS9wb2ludC5qc29uP2xpbWl0PWFsbCZzZWxlY3Q9bnVtYmVyLGFnZW50LHRpdGxlLHBob25lLHR5cGUsbG9jYXRpb24nKVxyXG5cdFx0XHQuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2FnZW50cycsIGRhdGEuZGF0YSk7XHJcblx0XHRcdFx0JHNjb3BlLmFnZW50X2NsaWVudHMgPSBkYXRhLmRhdGE7XHJcblx0XHRcdFx0JHNjb3BlLmFnZW50cyA9ICRzY29wZS5hZ2VudF9jbGllbnRzLmZpbHRlcihmdW5jdGlvbiAocCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHAudHlwZVswXSA9PSAnYWdlbnQnXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0JHNjb3BlLmNsaWVudHMgPSAkc2NvcGUuYWdlbnRfY2xpZW50cy5maWx0ZXIoZnVuY3Rpb24gKHApIHtcclxuXHRcdFx0XHRcdHJldHVybiBwLnR5cGVbMF0gPT0gJ2NsaWVudCdcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2FnZW50cycsICRzY29wZS5hZ2VudHMpXHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnY2xpZW50cycsICRzY29wZS5jbGllbnRzKVxyXG5cdFx0XHR9KS5lcnJvcihmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0JGh0dHAuZ2V0KCdodHRwczovL3d3dy5vbmxpbmUudXo6MzAwNy9lbG1hL3V6L2FwaS9lbG1hL3BvaW50LWRhdGEvNTkwMWQwZGU1ZDlkY2IwMDAwMDAwMDAwL3ByaWNlbGlzdC5qc29uJylcclxuXHRcdFx0LnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCdhZ2VudHMnLCBkYXRhLmRhdGEpO1xyXG5cdFx0XHRcdCRzY29wZS5wcmljZWxpc3QgPSBkYXRhLmRhdGE7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygkc2NvcGUucHJpY2VsaXN0KTtcclxuXHRcdFx0fSkuZXJyb3IoZnVuY3Rpb24gKGVycikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdCRodHRwLmdldCgnaHR0cHM6Ly93d3cub25saW5lLnV6OjMwMDcvZWxtYS91ei9hcGkvYXR0ci9yZWdpb24uanNvbj9saW1pdD1hbGwnKVxyXG5cdFx0XHQuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coJ2FnZW50cycsIGRhdGEuZGF0YSk7XHJcblx0XHRcdFx0JHNjb3BlLnJlZ2lvbnMgPSBkYXRhLmRhdGE7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLnJlZ2lvbnMpO1xyXG5cdFx0XHR9KS5lcnJvcihmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0JHNjb3BlLmZpbHRlckNsaWVudHMgPSBmdW5jdGlvbiAoYWdlbnRJZCkge1xyXG5cdFx0XHQkc2NvcGUuY2xpZW50QnlJZCA9ICRzY29wZS5jbGllbnRzLmZpbHRlcihmdW5jdGlvbiAocCkge1xyXG5cdFx0XHRcdHJldHVybiBwLmFnZW50ID09IGFnZW50SWQuX2lkXHJcblx0XHRcdH0pO1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKCRzY29wZS5jbGllbnRCeUlkKVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogaWYgZ2l2ZW4gZ3JvdXAgaXMgdGhlIHNlbGVjdGVkIGdyb3VwLCBkZXNlbGVjdCBpdFxyXG5cdFx0ICogZWxzZSwgc2VsZWN0IHRoZSBnaXZlbiBncm91cFxyXG5cdFx0ICovXHJcblx0XHQkc2NvcGUudG9nZ2xlR3JvdXAgPSBmdW5jdGlvbiAocHJvZHVjdCkge1xyXG5cdFx0XHRwcm9kdWN0LnNob3cgPSAhcHJvZHVjdC5zaG93O1xyXG5cdFx0fTtcclxuXHRcdCRzY29wZS5pc0dyb3VwU2hvd24gPSBmdW5jdGlvbiAocHJvZHVjdCkge1xyXG5cdFx0XHRyZXR1cm4gcHJvZHVjdC5zaG93O1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0dmFyIGRkID0gdG9kYXkuZ2V0RGF0ZSgpO1xyXG5cdFx0dmFyIG1tID0gdG9kYXkuZ2V0TW9udGgoKSArIDE7IC8vSmFudWFyeSBpcyAwIVxyXG5cclxuXHRcdHZhciB5eXl5ID0gdG9kYXkuZ2V0RnVsbFllYXIoKTtcclxuXHRcdGlmIChkZCA8IDEwKSB7XHJcblx0XHRcdGRkID0gJzAnICsgZGQ7XHJcblx0XHR9XHJcblx0XHRpZiAobW0gPCAxMCkge1xyXG5cdFx0XHRtbSA9ICcwJyArIG1tO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHRvZGF5ID0gZGQgKyAnLycgKyBtbSArICcvJyArIHl5eXk7XHJcblx0XHQkc2NvcGUub3JkZXIuZGF0ZSA9IHRvZGF5O1xyXG5cclxuXHRcdC8qIGlmICghJHNjb3BlLml0ZW0uY29sb3IpIHtcclxuXHRcdCAgICAgJGlvbmljVmlld1N3aXRjaGVyLm5leHREaXJlY3Rpb24oJ2JhY2snKTtcclxuXHRcdCAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xyXG5cdFx0ICAgICAgICAgZGlzYWJsZUJhY2s6IHRydWUsXHJcblx0XHQgICAgICAgICBkaXNhYmxlQW5pbWF0ZSA6IHRydWUsXHJcblx0XHQgICAgICAgICBoaXN0b3J5Um9vdCAgOiB0cnVlXHJcblx0XHQgICAgIH0pO1xyXG5cdFx0ICAgICAkc3RhdGUuZ28oJ2FwcC5nYWxsZXJ5Jyk7XHJcblx0XHQgfSovXHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmRpcmVjdGl2ZSgnaG9sZExpc3QnLCBob2xkTGlzdCk7XHJcblxyXG5cdGhvbGRMaXN0LiRpbmplY3QgPSBbJyRpb25pY0dlc3R1cmUnXTtcclxuXHRmdW5jdGlvbiBob2xkTGlzdCgkaW9uaWNHZXN0dXJlKSB7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6ICdBJyxcclxuXHRcdFx0bGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG5cdFx0XHRcdCRpb25pY0dlc3R1cmUub24oJ2hvbGQnLCBmdW5jdGlvbiAoZSkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBjb250ZW50ID0gZWxlbWVudFswXS5xdWVyeVNlbGVjdG9yKCcuaXRlbS1jb250ZW50Jyk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGJ1dHRvbnMgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5pdGVtLW9wdGlvbnMnKTtcclxuXHRcdFx0XHRcdHZhciBidXR0b25zV2lkdGggPSBidXR0b25zLm9mZnNldFdpZHRoO1xyXG5cclxuXHRcdFx0XHRcdGlvbmljLnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQuc3R5bGVbaW9uaWMuQ1NTLlRSQU5TSVRJT05dID0gJ2FsbCBlYXNlLW91dCAuMjVzJztcclxuXHJcblx0XHRcdFx0XHRcdGlmICghYnV0dG9ucy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmlzaWJsZScpKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29udGVudC5zdHlsZVtpb25pYy5DU1MuVFJBTlNGT1JNXSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnV0dG9ucy5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcclxuXHRcdFx0XHRcdFx0XHR9LCAyNTApO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGJ1dHRvbnMuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XHJcblx0XHRcdFx0XHRcdFx0Y29udGVudC5zdHlsZVtpb25pYy5DU1MuVFJBTlNGT1JNXSA9ICd0cmFuc2xhdGUzZCgtJyArIGJ1dHRvbnNXaWR0aCArICdweCwgMCwgMCknO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblxyXG5cdFx0XHRcdH0sIGVsZW1lbnQpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5kaXJlY3RpdmUoJ2lvbk11bHRpcGxlU2VsZWN0JywgaW9uTXVsdGlwbGVTZWxlY3QpO1xyXG5cclxuXHRpb25NdWx0aXBsZVNlbGVjdC4kaW5qZWN0ID0gWyckaW9uaWNNb2RhbCcsICckaW9uaWNHZXN0dXJlJ107XHJcblx0ZnVuY3Rpb24gaW9uTXVsdGlwbGVTZWxlY3QoJGlvbmljTW9kYWwsICRpb25pY0dlc3R1cmUpIHtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRyZXN0cmljdDogJ0UnLFxyXG5cdFx0XHRzY29wZToge1xyXG5cdFx0XHRcdG9wdGlvbnM6IFwiPVwiXHJcblx0XHRcdH0sXHJcblx0XHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcclxuXHRcdFx0XHQkc2NvcGUubXVsdGlwbGVTZWxlY3QgPSB7XHJcblx0XHRcdFx0XHR0aXRsZTogJGF0dHJzLnRpdGxlIHx8IFwiU2VsZWN0IE9wdGlvbnNcIixcclxuXHRcdFx0XHRcdHRlbXBPcHRpb25zOiBbXSxcclxuXHRcdFx0XHRcdGtleVByb3BlcnR5OiAkYXR0cnMua2V5UHJvcGVydHkgfHwgXCJpZFwiLFxyXG5cdFx0XHRcdFx0dmFsdWVQcm9wZXJ0eTogJGF0dHJzLnZhbHVlUHJvcGVydHkgfHwgXCJ2YWx1ZVwiLFxyXG5cdFx0XHRcdFx0c2VsZWN0ZWRQcm9wZXJ0eTogJGF0dHJzLnNlbGVjdGVkUHJvcGVydHkgfHwgXCJzZWxlY3RlZFwiLFxyXG5cdFx0XHRcdFx0dGVtcGxhdGVVcmw6ICRhdHRycy50ZW1wbGF0ZVVybCB8fCAndGVtcGxhdGVzL211bHRpcGxlU2VsZWN0Lmh0bWwnLFxyXG5cdFx0XHRcdFx0cmVuZGVyQ2hlY2tib3g6ICRhdHRycy5yZW5kZXJDaGVja2JveCA/ICRhdHRycy5yZW5kZXJDaGVja2JveCA9PSBcInRydWVcIiA6IHRydWUsXHJcblx0XHRcdFx0XHRhbmltYXRpb246ICRhdHRycy5hbmltYXRpb24gfHwgJ3NsaWRlLWluLXVwJ1xyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdCRzY29wZS5PcGVuTW9kYWxGcm9tVGVtcGxhdGUgPSBmdW5jdGlvbiAodGVtcGxhdGVVcmwpIHtcclxuXHRcdFx0XHRcdCRpb25pY01vZGFsLmZyb21UZW1wbGF0ZVVybCh0ZW1wbGF0ZVVybCwge1xyXG5cdFx0XHRcdFx0XHRzY29wZTogJHNjb3BlLFxyXG5cdFx0XHRcdFx0XHRhbmltYXRpb246ICRzY29wZS5tdWx0aXBsZVNlbGVjdC5hbmltYXRpb25cclxuXHRcdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbCA9IG1vZGFsO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUubW9kYWwuc2hvdygpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0JGlvbmljR2VzdHVyZS5vbigndGFwJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0XHRcdCRzY29wZS5tdWx0aXBsZVNlbGVjdC50ZW1wT3B0aW9ucyA9ICRzY29wZS5vcHRpb25zLm1hcChmdW5jdGlvbiAob3B0aW9uKSB7XHJcblx0XHRcdFx0XHRcdHZhciB0ZW1wT3B0aW9uID0ge307XHJcblx0XHRcdFx0XHRcdHRlbXBPcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LmtleVByb3BlcnR5XSA9IG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Qua2V5UHJvcGVydHldO1xyXG5cdFx0XHRcdFx0XHR0ZW1wT3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC52YWx1ZVByb3BlcnR5XSA9IG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3QudmFsdWVQcm9wZXJ0eV07XHJcblx0XHRcdFx0XHRcdHRlbXBPcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LnNlbGVjdGVkUHJvcGVydHldID0gb3B0aW9uWyRzY29wZS5tdWx0aXBsZVNlbGVjdC5zZWxlY3RlZFByb3BlcnR5XTtcclxuXHJcblx0XHRcdFx0XHRcdHJldHVybiB0ZW1wT3B0aW9uO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHQkc2NvcGUuT3Blbk1vZGFsRnJvbVRlbXBsYXRlKCRzY29wZS5tdWx0aXBsZVNlbGVjdC50ZW1wbGF0ZVVybCk7XHJcblx0XHRcdFx0fSwgJGVsZW1lbnQpO1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuc2F2ZU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5tdWx0aXBsZVNlbGVjdC50ZW1wT3B0aW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0XHR2YXIgdGVtcE9wdGlvbiA9ICRzY29wZS5tdWx0aXBsZVNlbGVjdC50ZW1wT3B0aW9uc1tpXTtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCAkc2NvcGUub3B0aW9ucy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBvcHRpb24gPSAkc2NvcGUub3B0aW9uc1tqXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAodGVtcE9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Qua2V5UHJvcGVydHldID09IG9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Qua2V5UHJvcGVydHldKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRvcHRpb25bJHNjb3BlLm11bHRpcGxlU2VsZWN0LnNlbGVjdGVkUHJvcGVydHldID0gdGVtcE9wdGlvblskc2NvcGUubXVsdGlwbGVTZWxlY3Quc2VsZWN0ZWRQcm9wZXJ0eV07XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdCRzY29wZS5jbG9zZU1vZGFsKCk7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGlmICgkc2NvcGUubW9kYWwpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5kaXJlY3RpdmUoJ2lvblNlYXJjaFNlbGVjdCcsIGlvblNlYXJjaFNlbGVjdCk7XHJcblxyXG5cdGlvblNlYXJjaFNlbGVjdC4kaW5qZWN0ID0gWyckaW9uaWNNb2RhbCcsICckaW9uaWNHZXN0dXJlJ107XHJcblx0ZnVuY3Rpb24gaW9uU2VhcmNoU2VsZWN0KCRpb25pY01vZGFsLCAkaW9uaWNHZXN0dXJlKSB7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6ICdFJyxcclxuXHRcdFx0c2NvcGU6IHtcclxuXHRcdFx0XHRvcHRpb25zOiBcIj1cIixcclxuXHRcdFx0XHRvcHRpb25TZWxlY3RlZDogXCI9XCJcclxuXHRcdFx0fSxcclxuXHRcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xyXG5cdFx0XHRcdCRzY29wZS5zZWFyY2hTZWxlY3QgPSB7XHJcblx0XHRcdFx0XHR0aXRsZTogJGF0dHJzLnRpdGxlIHx8IFwiU2VhcmNoXCIsXHJcblx0XHRcdFx0XHRrZXlQcm9wZXJ0eTogJGF0dHJzLmtleVByb3BlcnR5LFxyXG5cdFx0XHRcdFx0dmFsdWVQcm9wZXJ0eTogJGF0dHJzLnZhbHVlUHJvcGVydHksXHJcblx0XHRcdFx0XHR0ZW1wbGF0ZVVybDogJGF0dHJzLnRlbXBsYXRlVXJsIHx8ICd0ZW1wbGF0ZXMvc2VhcmNoU2VsZWN0Lmh0bWwnLFxyXG5cdFx0XHRcdFx0YW5pbWF0aW9uOiAkYXR0cnMuYW5pbWF0aW9uIHx8ICdzbGlkZS1pbi11cCcsXHJcblx0XHRcdFx0XHRvcHRpb246IG51bGwsXHJcblx0XHRcdFx0XHRzZWFyY2h2YWx1ZTogXCJcIixcclxuXHRcdFx0XHRcdGVuYWJsZVNlYXJjaDogJGF0dHJzLmVuYWJsZVNlYXJjaCA/ICRhdHRycy5lbmFibGVTZWFyY2ggPT0gXCJ0cnVlXCIgOiB0cnVlXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0JGlvbmljR2VzdHVyZS5vbigndGFwJywgZnVuY3Rpb24gKGUpIHtcclxuXHJcblx0XHRcdFx0XHRpZiAoISEkc2NvcGUuc2VhcmNoU2VsZWN0LmtleVByb3BlcnR5ICYmICEhJHNjb3BlLnNlYXJjaFNlbGVjdC52YWx1ZVByb3BlcnR5KSB7XHJcblx0XHRcdFx0XHRcdGlmICgkc2NvcGUub3B0aW9uU2VsZWN0ZWQpIHtcclxuXHRcdFx0XHRcdFx0XHQkc2NvcGUuc2VhcmNoU2VsZWN0Lm9wdGlvbiA9ICRzY29wZS5vcHRpb25TZWxlY3RlZFskc2NvcGUuc2VhcmNoU2VsZWN0LmtleVByb3BlcnR5XTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5zZWFyY2hTZWxlY3Qub3B0aW9uID0gJHNjb3BlLm9wdGlvblNlbGVjdGVkO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JHNjb3BlLk9wZW5Nb2RhbEZyb21UZW1wbGF0ZSgkc2NvcGUuc2VhcmNoU2VsZWN0LnRlbXBsYXRlVXJsKTtcclxuXHRcdFx0XHR9LCAkZWxlbWVudCk7XHJcblxyXG5cdFx0XHRcdCRzY29wZS5zYXZlT3B0aW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0aWYgKCEhJHNjb3BlLnNlYXJjaFNlbGVjdC5rZXlQcm9wZXJ0eSAmJiAhISRzY29wZS5zZWFyY2hTZWxlY3QudmFsdWVQcm9wZXJ0eSkge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5vcHRpb25zLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGN1cnJlbnRPcHRpb24gPSAkc2NvcGUub3B0aW9uc1tpXTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoY3VycmVudE9wdGlvblskc2NvcGUuc2VhcmNoU2VsZWN0LmtleVByb3BlcnR5XSA9PSAkc2NvcGUuc2VhcmNoU2VsZWN0Lm9wdGlvbikge1xyXG5cdFx0XHRcdFx0XHRcdFx0JHNjb3BlLm9wdGlvblNlbGVjdGVkID0gY3VycmVudE9wdGlvbjtcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5vcHRpb25TZWxlY3RlZCA9ICRzY29wZS5zZWFyY2hTZWxlY3Qub3B0aW9uO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFNlbGVjdC5zZWFyY2h2YWx1ZSA9IFwiXCI7XHJcblx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmNsZWFyU2VhcmNoID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0JHNjb3BlLnNlYXJjaFNlbGVjdC5zZWFyY2h2YWx1ZSA9IFwiXCI7XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0JHNjb3BlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHQkc2NvcGUubW9kYWwucmVtb3ZlKCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGlmICgkc2NvcGUubW9kYWwpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQkc2NvcGUuT3Blbk1vZGFsRnJvbVRlbXBsYXRlID0gZnVuY3Rpb24gKHRlbXBsYXRlVXJsKSB7XHJcblx0XHRcdFx0XHQkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwodGVtcGxhdGVVcmwsIHtcclxuXHRcdFx0XHRcdFx0c2NvcGU6ICRzY29wZSxcclxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uOiAkc2NvcGUuc2VhcmNoU2VsZWN0LmFuaW1hdGlvblxyXG5cdFx0XHRcdFx0fSkudGhlbihmdW5jdGlvbiAobW9kYWwpIHtcclxuXHRcdFx0XHRcdFx0JHNjb3BlLm1vZGFsID0gbW9kYWw7XHJcblx0XHRcdFx0XHRcdCRzY29wZS5tb2RhbC5zaG93KCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5mYWN0b3J5KCdNb2RhbHMnLCBNb2RhbHMpO1xyXG5cclxuXHRNb2RhbHMuJGluamVjdCA9IFsnJGlvbmljTW9kYWwnXTtcclxuXHRmdW5jdGlvbiBNb2RhbHMoJGlvbmljTW9kYWwpIHtcclxuXHJcblx0XHR2YXIgbW9kYWxzID0gW107XHJcblxyXG5cdFx0dmFyIF9vcGVuTW9kYWwgPSBmdW5jdGlvbiAoJHNjb3BlLCB0ZW1wbGF0ZVVybCwgYW5pbWF0aW9uKSB7XHJcblx0XHRcdHJldHVybiAkaW9uaWNNb2RhbC5mcm9tVGVtcGxhdGVVcmwodGVtcGxhdGVVcmwsIHtcclxuXHRcdFx0XHRzY29wZTogJHNjb3BlLFxyXG5cdFx0XHRcdGFuaW1hdGlvbjogYW5pbWF0aW9uIHx8ICdzbGlkZS1pbi11cCcsXHJcblx0XHRcdFx0YmFja2Ryb3BDbGlja1RvQ2xvc2U6IGZhbHNlXHJcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XHJcblx0XHRcdFx0bW9kYWxzLnB1c2gobW9kYWwpO1xyXG5cdFx0XHRcdG1vZGFsLnNob3coKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBfY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnRNb2RhbCA9IG1vZGFscy5zcGxpY2UoLTEsIDEpWzBdO1xyXG5cdFx0XHRjdXJyZW50TW9kYWwucmVtb3ZlKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBfY2xvc2VBbGxNb2RhbHMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdG1vZGFscy5tYXAoZnVuY3Rpb24gKG1vZGFsKSB7XHJcblx0XHRcdFx0bW9kYWwucmVtb3ZlKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRtb2RhbHMgPSBbXTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0b3Blbk1vZGFsOiBfb3Blbk1vZGFsLFxyXG5cdFx0XHRjbG9zZU1vZGFsOiBfY2xvc2VNb2RhbCxcclxuXHRcdFx0Y2xvc2VBbGxNb2RhbHM6IF9jbG9zZUFsbE1vZGFsc1xyXG5cdFx0fTtcclxuXHR9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZmFjdG9yeSgnTW9kZWwnLCBNb2RlbCk7XHJcblxyXG5cdE1vZGVsLiRpbmplY3QgPSBbJ1VzZXJzJ107XHJcblxyXG5cdGZ1bmN0aW9uIE1vZGVsKFVzZXJzKSB7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0VXNlcnM6IFVzZXJzXHJcblx0XHR9O1xyXG5cdH1cclxufSkoKTtcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyLm1vZHVsZSgnQXBwJylcclxuXHRcdC5maWx0ZXIoJ3VuaXF1ZScsIHVuaXF1ZSk7XHJcblxyXG5cdGZ1bmN0aW9uIHVuaXF1ZSgpIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoY29sbGVjdGlvbiwga2V5bmFtZSkge1xyXG5cdFx0XHR2YXIgb3V0cHV0ID0gW10sXHJcblx0XHRcdFx0a2V5cyA9IFtdO1xyXG5cclxuXHRcdFx0YW5ndWxhci5mb3JFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uIChpdGVtKSB7XHJcblx0XHRcdFx0dmFyIGtleSA9IGl0ZW1ba2V5bmFtZV07XHJcblx0XHRcdFx0aWYgKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG5cdFx0XHRcdFx0a2V5cy5wdXNoKGtleSk7XHJcblx0XHRcdFx0XHRvdXRwdXQucHVzaChpdGVtKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIG91dHB1dDtcclxuXHRcdH07XHJcblx0fVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5zZXJ2aWNlKCckc3FsaXRlU2VydmljZScsICRzcWxpdGVTZXJ2aWNlKTtcclxuXHJcblx0JHNxbGl0ZVNlcnZpY2UuJGluamVjdCA9IFsnJHEnLCAnJGNvcmRvdmFTUUxpdGUnXTtcclxuXHRmdW5jdGlvbiAkc3FsaXRlU2VydmljZSgkcSwgJGNvcmRvdmFTUUxpdGUpIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgX2RiO1xyXG5cclxuXHRcdHNlbGYuZGIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICghX2RiKSB7XHJcblx0XHRcdFx0aWYgKHdpbmRvdy5zcWxpdGVQbHVnaW4gIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0X2RiID0gd2luZG93LnNxbGl0ZVBsdWdpbi5vcGVuRGF0YWJhc2UoeyBuYW1lOiBcInByZS5kYlwiLCBsb2NhdGlvbjogMiwgY3JlYXRlRnJvbUxvY2F0aW9uOiAxIH0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBGb3IgZGVidWdnaW5nIGluIHRoZSBicm93c2VyXHJcblx0XHRcdFx0XHRfZGIgPSB3aW5kb3cub3BlbkRhdGFiYXNlKFwicHJlLmRiXCIsIFwiMS4wXCIsIFwiRGF0YWJhc2VcIiwgMjAwMDAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIF9kYjtcclxuXHRcdH07XHJcblxyXG5cdFx0c2VsZi5nZXRGaXJzdEl0ZW0gPSBmdW5jdGlvbiAocXVlcnksIHBhcmFtZXRlcnMpIHtcclxuXHRcdFx0dmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHRcdFx0c2VsZi5leGVjdXRlU3FsKHF1ZXJ5LCBwYXJhbWV0ZXJzKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuXHJcblx0XHRcdFx0aWYgKHJlcy5yb3dzLmxlbmd0aCA+IDApXHJcblx0XHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShyZXMucm93cy5pdGVtKDApKTtcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gZGVmZXJyZWQucmVqZWN0KFwiVGhlcmUgYXJlbid0IGl0ZW1zIG1hdGNoaW5nXCIpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmLmdldEZpcnN0T3JEZWZhdWx0SXRlbSA9IGZ1bmN0aW9uIChxdWVyeSwgcGFyYW1ldGVycykge1xyXG5cdFx0XHR2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cdFx0XHRzZWxmLmV4ZWN1dGVTcWwocXVlcnksIHBhcmFtZXRlcnMpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xyXG5cclxuXHRcdFx0XHRpZiAocmVzLnJvd3MubGVuZ3RoID4gMClcclxuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKHJlcy5yb3dzLml0ZW0oMCkpO1xyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiBkZWZlcnJlZC5yZXNvbHZlKG51bGwpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmLmdldEl0ZW1zID0gZnVuY3Rpb24gKHF1ZXJ5LCBwYXJhbWV0ZXJzKSB7XHJcblx0XHRcdHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcblx0XHRcdHNlbGYuZXhlY3V0ZVNxbChxdWVyeSwgcGFyYW1ldGVycykudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcblx0XHRcdFx0dmFyIGl0ZW1zID0gW107XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCByZXMucm93cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0aXRlbXMucHVzaChyZXMucm93cy5pdGVtKGkpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlc29sdmUoaXRlbXMpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XHJcblx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmLnByZWxvYWREYXRhQmFzZSA9IGZ1bmN0aW9uIChlbmFibGVMb2cpIHtcclxuXHRcdFx0dmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcblx0XHRcdC8vd2luZG93Lm9wZW4oXCJkYXRhOnRleHQvcGxhaW47Y2hhcnNldD11dGYtOCxcIiArIEpTT04uc3RyaW5naWZ5KHsgZGF0YTogd2luZG93LnF1ZXJpZXMuam9pbignJykucmVwbGFjZSgvXFxcXG4vZywgJ1xcbicpIH0pKTtcclxuXHRcdFx0aWYgKHdpbmRvdy5zcWxpdGVQbHVnaW4gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdGVuYWJsZUxvZyAmJiBjb25zb2xlLmxvZygnJWMgKioqKioqKioqKioqKioqKiogU3RhcnRpbmcgdGhlIGNyZWF0aW9uIG9mIHRoZSBkYXRhYmFzZSBpbiB0aGUgYnJvd3NlciAqKioqKioqKioqKioqKioqKiAnLCAnYmFja2dyb3VuZDogIzIyMjsgY29sb3I6ICNiYWRhNTUnKTtcclxuXHRcdFx0XHRzZWxmLmRiKCkudHJhbnNhY3Rpb24oZnVuY3Rpb24gKHR4KSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHdpbmRvdy5xdWVyaWVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciBxdWVyeSA9IHdpbmRvdy5xdWVyaWVzW2ldLnJlcGxhY2UoL1xcXFxuL2csICdcXG4nKTtcclxuXHJcblx0XHRcdFx0XHRcdGVuYWJsZUxvZyAmJiBjb25zb2xlLmxvZyh3aW5kb3cucXVlcmllc1tpXSk7XHJcblx0XHRcdFx0XHRcdHR4LmV4ZWN1dGVTcWwocXVlcnkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcclxuXHRcdFx0XHR9LCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRlbmFibGVMb2cgJiYgY29uc29sZS5sb2coJyVjICoqKioqKioqKioqKioqKioqIENvbXBsZXRpbmcgdGhlIGNyZWF0aW9uIG9mIHRoZSBkYXRhYmFzZSBpbiB0aGUgYnJvd3NlciAqKioqKioqKioqKioqKioqKiAnLCAnYmFja2dyb3VuZDogIzIyMjsgY29sb3I6ICNiYWRhNTUnKTtcclxuXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUoXCJPS1wiKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKFwiT0tcIik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHRzZWxmLmV4ZWN1dGVTcWwgPSBmdW5jdGlvbiAocXVlcnksIHBhcmFtZXRlcnMpIHtcclxuXHRcdFx0cmV0dXJuICRjb3Jkb3ZhU1FMaXRlLmV4ZWN1dGUoc2VsZi5kYigpLCBxdWVyeSwgcGFyYW1ldGVycyk7XHJcblx0XHR9O1xyXG5cdH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5mYWN0b3J5KCdVc2VycycsIFVzZXJzKTtcclxuXHJcblx0VXNlcnMuJGluamVjdCA9IFsnJHEnLCAnJHNxbGl0ZVNlcnZpY2UnXTtcclxuXHRmdW5jdGlvbiBVc2VycygkcSwgJHNxbGl0ZVNlcnZpY2UpIHtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRnZXRBbGw6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgcXVlcnkgPSBcIlNlbGVjdCAqIEZST00gVXNlcnNcIjtcclxuXHRcdFx0XHRyZXR1cm4gJHEud2hlbigkc3FsaXRlU2VydmljZS5nZXRJdGVtcyhxdWVyeSkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhZGQ6IGZ1bmN0aW9uICh1c2VyKSB7XHJcblx0XHRcdFx0dmFyIHF1ZXJ5ID0gXCJJTlNFUlQgSU5UTyBVc2VycyAoTmFtZSkgVkFMVUVTICg/KVwiO1xyXG5cdFx0XHRcdHJldHVybiAkcS53aGVuKCRzcWxpdGVTZXJ2aWNlLmV4ZWN1dGVTcWwocXVlcnksIFt1c2VyLk5hbWVdKSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fVxyXG59KSgpOyJdfQ==
