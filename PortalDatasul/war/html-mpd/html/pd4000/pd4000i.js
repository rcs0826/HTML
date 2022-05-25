/* global angular*/
define(['index'], function(index) {


	representativeController.$inject = [
		'$rootScope',
		'$scope',
		'$stateParams',
		'$timeout',
		'mpd.fchdis0051.Factory',
		'customization.generic.Factory',
		'dts-utils.message.Service'];

	function representativeController(
			$rootScope,
			$scope,
			$stateParams,
			$timeout,
			fchdis0051,
			customService,
			messageUtils) {

		var representativeController = this;

		representativeController.orderId = $stateParams.orderId;

		representativeController.loadData = function () {
			representativeController.comissaoItem = $scope.orderController.comissaoItem;
			representativeController.order = $scope.orderController.order;
			representativeController.ttOrderParameters = $scope.orderController.orderParameters
			representativeController.orderItens = $scope.orderController.orderItens;
			representativeController.orderDisabled = $scope.orderController.orderDisabled;
			representativeController.ttOrderRepresentative = $scope.orderController.ttOrderRepresentative;
			representativeController.originalOrderRepresentative = angular.copy(representativeController.ttOrderRepresentative);

			if ($scope.orderController.pd4000['aba-representantes-pedido'].fieldEnabled == false) {
				representativeController.orderDisabled = true;
			}

		};

		representativeController.reload = function () {
			representativeController.ttOrderRepresentative = angular.copy(representativeController.originalOrderRepresentative);
		}

		representativeController.doSave = function () {
			fchdis0051.saveorderrepresentative({
				nrPedido: representativeController.orderId
			}, representativeController.ttOrderRepresentative,
			function(result) {
				customService.callCustomEvent("saveorderrepresentative", {
					controller:representativeController,
					result: result
				});

				if (!result.$hasError)
					$scope.$emit("salesorder.pd4000.loadorder","pd4000i");
			});
		}

		representativeController.save = function () {

			if(representativeController.canSave()){

				if (representativeController.comissaoItem) {
					messageUtils.question( {
						title: 'Alterar os representantes dos itens',
						text: $rootScope.i18n('Confirma atualizar as informações de comissões dos itens?'),
						cancelLabel: 'Não',
						confirmLabel: 'Sim',
						callback: function(isPositiveResult) {
							if (isPositiveResult) {
								representativeController.doSave();
							}
						}
					});

				} else {
					representativeController.doSave();
				}

			}
		}

		representativeController.changeNoAbReppri = function () {
			fchdis0051.changeNoAbReppri({
				nrPedido: representativeController.orderId
			}, {
				ttOrder: representativeController.order,
				ttOrderParameters: representativeController.ttOrderParameters
			}, function(result) {
				customService.callCustomEvent("changeNoAbReppri", {
					controller:representativeController,
					result: result
				});

				if (!result.$hasError)
					$scope.$emit("salesorder.pd4000.loadorder","pd4000i");
			});
		}

		representativeController.add = function () {
			var i = representativeController.ttOrderRepresentative.push({
				'nome-ab-rep': '',
				'nr-pedido': representativeController.orderId,
				'idi-liber-pagto-comis-agent': 1,
				'idi-tip-base-comis-agent':1,
				'idi-tip-comis-agent':1
			});
            $timeout(function () {				
				var obj = representativeController.gridOrderRepresentative.dataSource.at(i - 1);
				representativeController.gridOrderRepresentative.select("tr[data-uid='" + obj.uid + "']");
                representativeController.gridOrderRepresentative.editCell("tr[data-uid='" + obj.uid + "'] td:eq(0)");
            });
				
		}

		representativeController.gridEdit = function(event) {
            $timeout(function () {
                var inputs = $(event.container).find("input:focus:text");
                if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
            },50);
		}

		representativeController.remove = function () {
			for (var index = 0; index < representativeController.ttOrderRepresentative.length; index++) {
				var element = representativeController.ttOrderRepresentative[index];

				if (element['nome-ab-rep'] == representativeController.gridSelectedItem['nome-ab-rep']) {
					representativeController.ttOrderRepresentative.splice(index,1);
					break;
				}
			}
		}

		representativeController.canSave = function () {
			return !angular.equals(representativeController.originalOrderRepresentative,representativeController.ttOrderRepresentative);
		}

		representativeController.canDelete = function () {
			if (representativeController.gridSelectedItems.length == 0) return false;
			for (var index = 0; index < representativeController.gridSelectedItems.length; index++) {
				var repres = representativeController.gridSelectedItems[index];
				if (repres['nome-ab-rep'] == representativeController.order['no-ab-reppri']) return false;
			}
			return true;
		}

		$scope.$on("salesorder.pd4000.loadorder", function (event,data) {
			if (data != "pd4000i") {
				// busca os dados do controller principal
				representativeController.loadData();
			}
		});

		$scope.$on("salesorder.pd4000.changeparameters", function (event,data) {
			representativeController.ttOrderParameters = $scope.orderController.orderParameters;
		});
		

		// normalmente não precisa, mas como o template é pos-processado pelo lodash é executado depois que foi carregado o pedido
		representativeController.loadData();

	}

	itemRepresentativeController.$inject = [
		'$scope',
		'$stateParams',
		'$timeout',
		'customization.generic.Factory',
		'mpd.fchdis0051.Factory'];

	function itemRepresentativeController(
			$scope,
			$stateParams,
			$timeout,
			customService,
			fchdis0051) {

		var itemRepresentativeController = this;

		itemRepresentativeController.orderId = $stateParams.orderId;

		itemRepresentativeController.itemsGridEdit = function(event) {
			 $timeout(function () {
                var inputs = $(event.container).find("input:focus:text");
                if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
            },50);
		}

		itemRepresentativeController.init = function (item) {
			if (item) {
				itemRepresentativeController.orderDisabled = $scope.orderController.orderDisabled;
				itemRepresentativeController.item = item;
				itemRepresentativeController.ttItemOrderRepresentative = item.ttItemOrderRepresentative
				itemRepresentativeController.originalItemOrderRepresentative = angular.copy(item.ttItemOrderRepresentative);

				if ($scope.orderController.pd4000['aba-representantes-item'].fieldEnabled == false) {
					itemRepresentativeController.orderDisabled = true;
				}

			}
		}

		itemRepresentativeController.reload = function () {
			itemRepresentativeController.ttItemOrderRepresentative = angular.copy(itemRepresentativeController.originalItemOrderRepresentative);
		}

		itemRepresentativeController.add = function () {
			var i = itemRepresentativeController.ttItemOrderRepresentative.push({
				'nome-ab-rep':''
			});
            $timeout(function () {				
				var obj = itemRepresentativeController.gridItemOrderRepresentative.dataSource.at(i - 1);
				itemRepresentativeController.gridItemOrderRepresentative.select("tr[data-uid='" + obj.uid + "']");
                itemRepresentativeController.gridItemOrderRepresentative.editCell("tr[data-uid='" + obj.uid + "'] td:eq(0)");
            });
			
		}

		itemRepresentativeController.remove = function () {
			for (var index = 0; index < itemRepresentativeController.ttItemOrderRepresentative.length; index++) {
				var element = itemRepresentativeController.ttItemOrderRepresentative[index];

				if (element['nome-ab-rep'] == itemRepresentativeController.gridSelectedItem['nome-ab-rep']) {
					itemRepresentativeController.ttItemOrderRepresentative.splice(index,1);
					break;
				}
			}
		}

		itemRepresentativeController.canSave = function () {
			return !angular.equals(itemRepresentativeController.originalItemOrderRepresentative,itemRepresentativeController.ttItemOrderRepresentative);
		}

		itemRepresentativeController.save = function () {

			if(itemRepresentativeController.canSave()){
				var itemCode = " ";
				var reference = " ";

				if (itemRepresentativeController.item['it-codigo'] != '')
					itemCode = itemRepresentativeController.item['it-codigo'];

				if (itemRepresentativeController.item['cod-refer'] != '')
					reference = itemRepresentativeController.item['cod-refer'];

				fchdis0051.saveorderitemrepresentative({
					nrPedido: itemRepresentativeController.orderId,
					sequence: itemRepresentativeController.item['nr-sequencia'],
					itemCode: itemCode,
					reference: reference
				}, itemRepresentativeController.ttItemOrderRepresentative,
				function(result) {
					customService.callCustomEvent("saveorderitemrepresentative", {
						controller:itemRepresentativeController,
						result: result
					});

					if (!result.$hasError) {
						itemRepresentativeController.originalItemOrderRepresentative = angular.copy(itemRepresentativeController.ttItemOrderRepresentative);
						itemRepresentativeController.ttItemOrderRepresentative = angular.copy(itemRepresentativeController.ttItemOrderRepresentative);
					}
				});
			}
		}


	}

	index.register.controller('salesorder.pd4000Representative.Controller', representativeController);
	index.register.controller('salesorder.pd4000ItemRepresentative.Controller', itemRepresentativeController);

});

