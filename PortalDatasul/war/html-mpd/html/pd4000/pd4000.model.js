/* global angular*/
define(['index'], function(index) {

	filterModelsMPD.$inject = [];

	function filterModelsMPD() {
		return function(array, query) {
			if(array[0]){

				var parts = query && query.trim().split(/\s+/),
					keys = Object.keys(array[0]);

				if (!parts || !parts.length) return array;
				return array.filter(function(obj) {
					return parts.every(function(part) {
						return keys.some(function(key) {
							return String(obj[key]).toLowerCase().indexOf(part.toLowerCase()) > -1;
						});
					});
				});
			}
		};
	};

	index.register.filter('filterModelsMPD', filterModelsMPD);


	/*filterStarMPD.$inject = [];

	function filterStarMPD() {
		return function(array, query) {
			var arrayReturn = [];

			if(array){
				for (i = 0; i < array.length; i++) {
					if(array[i]['log-favorito'] == query)
						arrayReturn.push(array[i])
				}
			}

			return arrayReturn;
		};
	};

	index.register.filter('filterStarMPD', filterStarMPD);

	filterStarMPD*/

	modelcontroller.$inject = [
		'$rootScope',
		'$timeout',
		'totvs.app-main-view.Service',
		'$stateParams',
		'$location',
		'$filter',
		'$modal',
		'mpd.fchdis0051.Factory',
		'customization.generic.Factory',
		'TOTVSEvent'];

	function modelcontroller(
		$rootScope,
		$timeout,
		appViewService,
		$stateParams,
		$location,
		$filter,
		$modal,
		fchdis0051,
		customService,
		TOTVSEvent) {

		var modelController = this;

		modelController.nrPedcliEnabled = false;

		modelController.quickFilter = {"nom-model": "", "nom-desc": "", "log-favorito": undefined};

		modelController.quickSearchText = "";

		modelController.reloadView = function(){
			fchdis0051.newOrderNumber({nomeAbrev:$stateParams.customerId}, function(result) {
				customService.callCustomEvent("newOrderNumber", {
					controller:modelController,
					result: result
				});

				modelController.newNrOrder = result['nr-pedido'];
				modelController.newCustOrderNo = result['nr-pedcli'];
				modelController.nrPedcliEnabled = result['l-nr-pedcli'];
				fchdis0051.getModels({}, function(result) {
					customService.callCustomEvent("getModels", {
						controller:modelController,
						result: result
					});
					modelController.models = angular.copy(result.ttOrderModel);
					modelController.startModels = angular.copy(result.ttOrderModel);
					angular.forEach(result.ttOrderModel, function(model, index) {
						if (model['log-favorito']) {
							modelController.quickFilter['log-favorito'] = true;
						}
					});
				});
			});
		}

		modelController.setFavoriteModel = function(idiModel, logFavorito) {
			//Inverte estado da estrela
			if (logFavorito == true) {
				logFavorito = false;
			} else {
				logFavorito = true;
			}

			//Atualiza Favorito
			fchdis0051.favoriteModel({modelId: idiModel, favorite: logFavorito},{}, function(result) {
				angular.forEach(modelController.models, function(model, index) {
					if (model['idi-model'] == idiModel) {
						model['log-favorito'] = logFavorito;
					}
				});
			});
		};


		modelController.setQuickFilter = function(logFavorito) {
			if (logFavorito == false) {
				modelController.quickFilter['log-favorito'] = undefined;
			}
			else {
				modelController.quickFilter['log-favorito'] = logFavorito;
			}
		};

		modelController.search = function () {

			if(!modelController.quickSearchText){
				modelController.quickSearchText = "";
			}

			if(modelController.quickSearchText.length > 0){
				modelController.models = [];

				var hasName = false;
				var hasDesc = false;

				angular.forEach(modelController.startModels, function(model, index) {
					hasName = false;
					hasDesc = false;

					if(model['nom-model'].indexOf(modelController.quickSearchText) !== -1){
						hasName = true;
					}

					if(model['nom-desc'].indexOf(modelController.quickSearchText) !== -1){
						hasDesc = true;
					}

					if(hasName || hasDesc){
						modelController.models.push(model);
					}
				});

				if(modelController.models.length == 0){
					modelController.models = angular.copy(modelController.startModels);
				}

			}else{
				modelController.models = angular.copy(modelController.startModels);
			}

			//modelController.quickFilter['nom-model'] = angular.copy(modelController.quickSearchText);
		}

		modelController.valNewOrderNo = function(idiModel) {
			if(modelController.newCustOrderNo == undefined || modelController.newCustOrderNo == "") {
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'warning', title: 'Nr Pedido Cliente', detail: 'Informe um numero de pedido para o cliente antes de incluir um Pedido de Venda'}]);
				return;
			}

			if(modelController.customerId == undefined || modelController.customerId == 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'warning', title: 'Cliente', detail: 'Informe um cliente para incluir um Pedido de Venda'}]);
				return;
			}

			if (modelController.newNrOrder != modelController.newCustOrderNo) {
				fchdis0051.valNewOrderNo({customerId: modelController.customerId, newCustOrderNo: modelController.newCustOrderNo}, function(result) {
					if (!result.$hasError) {
						$location.url('/dts/mpd/pd4000/'+modelController.newNrOrder+'/'+idiModel+'?nrPedcli='+modelController.newCustOrderNo + '&codEmit=' + modelController.customerId);
					}					
				});
			} else {
				 $location.url('/dts/mpd/pd4000/'+modelController.newNrOrder+'/'+idiModel+'?nrPedcli='+modelController.newCustOrderNo + '&codEmit=' + modelController.customerId);
			}
		}

		modelController.openOrder = function() {

			if(modelController.customerShortName != undefined && modelController.customerShortName != ""){
				$location.url('/dts/mpd/internalsalesorders/openbycustomer/' + modelController.customerShortName);
			}else{
				$location.url('/dts/mpd/internalsalesorders');
			};

		}

		modelController.selectCustomer = function(){
			if(modelController.selectedCustomer){
				modelController.customerId = modelController.selectedCustomer['cod-emitente'];
				modelController.customerShortName = modelController.selectedCustomer['nome-abrev'];
			}else{
				modelController.customerId = undefined;
				modelController.customerShortName = undefined;
			}

		}


		var i18n = $filter('i18n');
		modelController.tooltipfavorite = i18n('Modelos Favoritos');

		modelController.models = {};

		if (appViewService.startView(i18n('Selecione um Modelo'), 'salesorder.pd4000.model.Controller', modelController)) {
			//modelController.reloadView();
		}

		if(modelController.customerId && modelController.customerId != $stateParams.customerId) modelController.reloadView();

		modelController.selectedCustomer = $stateParams.customerId;
		//modelController.paramCustomer = !!$stateParams.customerId;

		if (!modelController.newNrOrder) {
			modelController.reloadView();
		}


	}//function modelcontroller($location, loadedModules)

	index.register.controller('salesorder.pd4000.model.Controller', modelcontroller);

});

