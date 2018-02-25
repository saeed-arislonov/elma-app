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