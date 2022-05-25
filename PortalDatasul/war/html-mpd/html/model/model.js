/* global angular*/
define(['index',
		'/dts/mpd/js/portal-factories.js', '/dts/mpd/js/api/fchdis0035api.js', '/dts/dts-utils/js/lodash-angular.js'], function (index) {

	index.stateProvider
	.state('dts/mpd/model', {
		abstract: true,
		template: '<ui-view/>'
	})
	.state('dts/mpd/model.start', {
		url: '/dts/mpd/model',
		controller: 'salesorder.model.Controller',
		controllerAs: 'controller',
		templateUrl: '/dts/mpd/html/model/model.html'
	})
	.state('dts/mpd/model.customer', {
		url: '/dts/mpd/model/:customerId?isLead',
		//url: '/dts/mpd/model/:customerId',
		controller: 'salesorder.model.Controller',
		controllerAs: 'controller',
		templateUrl: '/dts/mpd/html/model/model.html'
	});

	modelcontroller.$inject = ['$rootScope', '$timeout', 'totvs.app-main-view.Service', '$stateParams', '$location', '$filter', 'salesorder.salesorders.Factory', 'salesorder.model.Factory', 'portal.getUserData.factory', 'TOTVSEvent', 'mpd.fchdis0035.factory'];

	function modelcontroller($rootScope, $timeout, appViewService, $stateParams, $location, $filter, orderResource, modelResource, userdata, TOTVSEvent, fchdis0035) {

		var controller = this;

		controller.btnNovoPedido = false;
		controller.selecaoModelo = false;
		controller.nrPedCliModelo = false;

		controller.paramVisibleFieldsCad = {cTable: "ped-venda-cadastro"};

		controller.getBoolean = function (value){
		   switch(value){
				case true:
				case "true":
				case 1:
				case "1":
				case "yes":
					return true;
				default:
					return false;
			}
		};

		this.reloadView = function(){
			this.isLead = this.getBoolean($stateParams.isLead);

			orderResource.newCopy({}, function(result) {
			controller.customerId = $stateParams.customerId;
				controller.newNrOrder = result.nrPedido;
				controller.newCustOrderNo = result.nrPedido;

				modelResource.getModels({modelType: 1}, function(resultmodels) {

					controller.models = angular.copy(resultmodels);
					controller.startModels = angular.copy(resultmodels);

					angular.forEach(resultmodels, function(model, index) {
						if (model['log-favorito']) {
							controller.quickFilter['log-favorito'] = true;
						}
					});

					if(!controller.selecaoModelo){
						if(controller.customerId == undefined)
							controller.customerId = 0;

						$location.url('/dts/mpd/order/'+controller.newNrOrder+'/0?nrPedcli='+controller.newCustOrderNo + '&codEmit=' + controller.customerId + '&isLead=' + (controller.isLead || 'false'));
					}
				});
			});
		};

		this.initSearchModel = function(){
			var searchModel = angular.element('#search-model').children();

			$timeout( function(){
				searchModel.attr('class', 'col-lg-10 col-md-9 col-sm-8');
			}, 0);

		};

		this.validatorNrPedCli = function(){
			if(controller.newCustOrderNo.length > 12){
				controller.newCustOrderNo = controller.newCustOrderNoVal;
			}else{
				controller.newCustOrderNoVal = controller.newCustOrderNo;
			}
		};

		this.search = function () {

			if(!controller.quickSearchText){
				controller.quickSearchText = "";
			}

			if(controller.quickSearchText.length > 0){
				controller.models = [];

				var hasName = false;
				var hasDesc = false;

				angular.forEach(controller.startModels, function(model, index) {
					hasName = false;
					hasDesc = false;

					if(model['nom-model'].indexOf(controller.quickSearchText) !== -1){
						hasName = true;
					}

					if(model['nom-desc'].indexOf(controller.quickSearchText) !== -1){
						hasDesc = true;
					}

					if(hasName || hasDesc){
						controller.models.push(model);
					}
				});

				if(controller.models.length == 0){
					controller.models = angular.copy(controller.startModels);
				}

			}else{
				controller.models = angular.copy(controller.startModels);
			}

		};


		this.setFavoriteModel = function(idModel, logFavorito) {
			//Inverte estado da estrela
			if (logFavorito == true) {
				logFavorito = false;
			} else {
				logFavorito = true;
			}

			//Atualiza Favorito
			modelResource.favorite({idiModel: idModel, favorite: logFavorito}, function(result) {
				angular.forEach(controller.models, function(model, index) {
					if (model['idi-model'] == idModel) {
						model['log-favorito'] = logFavorito;
					}
				});
			});
		};

		this.setQuickFilter = function(logFavorito) {
			if (logFavorito == false) {
				controller.quickFilter['log-favorito'] = undefined;
			}
			else {
				controller.quickFilter['log-favorito'] = logFavorito;
			}
		};

		this.valNewOrderNo = function(idiModel) {

			if(controller.newCustOrderNo){

				if(controller.customerId == undefined) controller.customerId = 0;

				if (controller.newNrOrder != controller.newCustOrderNo) {
					orderResource.valNewOrderNo({customerId: controller.customerId, newCustOrderNo: controller.newCustOrderNo}, function(result) {
						$location.url('/dts/mpd/order/'+controller.newNrOrder+'/'+idiModel+'?nrPedcli='+controller.newCustOrderNo + '&codEmit=' + controller.customerId + '&isLead=' + (controller.isLead || 'false'));
					});
				} else {
					 $location.url('/dts/mpd/order/'+controller.newNrOrder+'/'+idiModel+'?nrPedcli='+controller.newCustOrderNo + '&codEmit=' + controller.customerId + '&isLead=' + (controller.isLead || 'false'));
				}

			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
				   title: $rootScope.i18n('l-warning'),
				   detail: $rootScope.i18n('required-customer-nrorder')
				});
			}

		};

		fchdis0035.getVisibleFields(controller.paramVisibleFieldsCad, function (result) {

			controller.mainModelObject = result;

			for (var i = controller.mainModelObject.length - 1; i >= 0; i--) {

				if (controller.mainModelObject[i]['fieldName'] == "nr-pedcli-modelo") {
					controller.nrPedCliModelo = true;
				}

				if (controller.mainModelObject[i]['fieldName'] == "selecao-modelos") {
					controller.selecaoModelo = true;
				}

				if (controller.mainModelObject[i]['fieldName'] == "btn-novo-pedido") {
					controller.btnNovoPedido = true;
				}

			}

			controller.mainModelObjectData = {
				nrPedCliModelo: controller.nrPedCliModelo,
				selecaoModelo: controller.selecaoModelo,
				btnNovoPedido: controller.btnNovoPedido
			}

			controller.customerId = $stateParams.customerId;
			if (controller.customerId) {
				controller.nrCli = "&codEmit=" + controller.customerId;
			} else {
				controller.nrCli = "";
			}

			var i18n = $filter('i18n');
			controller.tooltipfavorite = i18n('l-favorite-models');

			controller.models = {};
			controller.quickFilter = { "nom-model": "", "nom-desc": "", "log-favorito": undefined };

			if (controller.selecaoModelo) {
				if (appViewService.startView(i18n('l-select-model'), 'salesorder.model.Controller', controller)) {
					controller.reloadView();
				} else {
					if (controller.customerId != $stateParams.customerId) {
						controller.reloadView();
					}
				}
			} else {
				controller.reloadView();
			}

		}, true, userdata['user-name']);

	}//function modelcontroller($location, loadedModules)

	index.register.controller('salesorder.model.Controller', modelcontroller);

});
