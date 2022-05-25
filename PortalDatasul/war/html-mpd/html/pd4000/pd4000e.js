/* global TOTVSEvent, angular*/
define(['index'], function(index) {



	orderFinancingController.$inject = [
		'$scope',
		'$stateParams',
		'$timeout',
		'customization.generic.Factory',
		'mpd.fchdis0051.Factory',
		'TOTVSEvent',
		'$rootScope'];

	function orderFinancingController(
			$scope,
			$stateParams,
			$timeout,
			customService,
			fchdis0051,
			TOTVSEvent,
			$rootScope) {

		var orderFinancingController = this;

		orderFinancingController.orderId = $stateParams.orderId;
		orderFinancingController.enabled = false;
		orderFinancingController.ttFinancingRatesPD4000 = [];
		orderFinancingController.calculated = {};

		orderFinancingController.loadData = function () {
			orderFinancingController.order = angular.copy($scope.orderController.order);
			orderFinancingController.orderDisabled = $scope.orderController.orderDisabled;
			orderFinancingController.ttOrderParameters = $scope.orderController.orderParameters
			orderFinancingController.ttFinancingRatesPD4000 = $scope.orderController.ttFinancingRatesPD4000
			orderFinancingController.enabled = !orderFinancingController.orderDisabled;


			if (!orderFinancingController.orderDisabled) {
				var ttVisibleFields = $scope.orderController.ttVisibleFields;
				for (var i = 0; i < ttVisibleFields.length; i++) {
					if (ttVisibleFields[i].fieldName == 'nr-tab-finan') {
						orderFinancingController.enabled = ttVisibleFields[i].fieldEnabled;
					}
				}
			}

			if ($scope.orderController.pd4000['aba-financiamento'].fieldEnabled == false) {
				orderFinancingController.orderDisabled = true;
				orderFinancingController.enabled = false;
			}
			// calcula o prazo medio
			var ttSpecialPaymentConditionPD4000 = $scope.orderController.ttSpecialPaymentConditionPD4000;

			var total = 0;
			var totalparcela = 0;
			var totalperc = 0;

			for (var i = 0; i < ttSpecialPaymentConditionPD4000.length; i++) {
				totalparcela = totalparcela + ttSpecialPaymentConditionPD4000[i]['vl-pagto'];
				totalperc = totalperc + ttSpecialPaymentConditionPD4000[i]['perc-pagto'] * ttSpecialPaymentConditionPD4000[i]['nr-dias-venc'];
				total = total + ttSpecialPaymentConditionPD4000[i]['vl-pagto'] * ttSpecialPaymentConditionPD4000[i]['nr-dias-venc'];
			}

			if (totalparcela)
				orderFinancingController.prazomedio = total / totalparcela;
			else
				orderFinancingController.prazomedio = totalperc / 100;


		};

		$scope.$on("salesorder.pd4000.selectview", function (event,data) {
			if (data == 'pd4000e') {
				$timeout(function() {
					angular.element('input[name="orderfinancingcontroller_order_nr_tab_finan_input"]').focus();
				}, 100);				
            }
		});
		
		$scope.$on("salesorder.pd4000.changeparameters", function (event,data) {
			orderFinancingController.ttOrderParameters = $scope.orderController.orderParameters;
		});

		$scope.$on("salesorder.pd4000.loadorder", function (event,data) {
			if (data != "pd4000e") {
				// busca os dados do controller principal
				orderFinancingController.loadData();
			}
		});

		orderFinancingController.changeFinanc = function () {

			if (orderFinancingController.order['nr-tab-finan']) {
				fchdis0051.changeOrderNrTabFinan({
					nrPedido: orderFinancingController.orderId,
					nrTabFinan: orderFinancingController.order['nr-tab-finan'],
					prazo: Math.round(orderFinancingController.prazomedio)
				}, function (result) {
					customService.callCustomEvent("changeOrderNrTabFinan", {
						controller:orderFinancingController,
						result: result
					});
					orderFinancingController.ttFinancingRatesPD4000 = result.ttFinancingRatesPD4000;
				});
			}
		}


		orderFinancingController.select = function (seq) {
			$timeout(function () {
				for (var i = 0; i < orderFinancingController.ttFinancingRatesPD4000.length; i++) {
					orderFinancingController.ttFinancingRatesPD4000[i].selecionado = (seq == orderFinancingController.ttFinancingRatesPD4000[i]['num-seq']);
				}
				orderFinancingController.ratesGrid.dataSource.data(orderFinancingController.ttFinancingRatesPD4000);
			});
		}

		orderFinancingController.selectIndex = function (item) {
			if (item && item['num-seq'] != orderFinancingController.order['nr-ind-finan']) {
				fchdis0051.changeOrderNrIndFinan({nrPedido: orderFinancingController.orderId, nrIndFinan: item['num-seq']}, function(data) {
					customService.callCustomEvent("changeOrderNrIndFinan", {
						controller:orderFinancingController,
						result: data
					});

					if (!data.$hasErrors) {

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							title: $rootScope.i18n('l-warning'),
							detail: $rootScope.i18n('Para efetivar a seleção do Índice de Financiamento, calcule o pedido.')
						});

						orderFinancingController.order['nr-ind-finan'] = item['num-seq'];
						orderFinancingController.select(item['num-seq']);
					}

				});
			}
		}


	}

	index.register.controller('salesorder.pd4000Financing.Controller', orderFinancingController);

});

