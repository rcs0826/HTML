define([
	'index',
	'/dts/mpd/js/api/fchdis0059.js',
	'/dts/mpd/js/userpreference.js',
	'/dts/mpd/js/zoom/emitente.js',
	'/dts/men/js/zoom/item.js',
	'/dts/mpd/js/api/fchdis0028.js',
	'/dts/mpd/js/zoom/referencia.js',	
], function(index) {
	'use strict';

	deliveryWindowsListController.$inject = [
		'$scope', '$rootScope', 'mpd.deliverywindows.Factory', '$filter', '$totvsprofile', 'totvs.app-main-view.Service', '$stateParams', '$q', 'userPreference', '$location', 'TOTVSEvent', 'mpd.deliverywindows.helper', '$modal', '$timeout',
	];
	function deliveryWindowsListController($scope, $rootScope, deliverywindowsFactory, $filter, $totvsprofile, appViewService, $stateParams, $q, userPreference, $location, TOTVSEvent, helper, $modal, $timeout) {

		var vm = this;

		vm.i18n = $filter('i18n');
			
		vm.deliveries = [];
		vm.disclaimers = [];
		vm.allPaymentMethods = [];
		vm.onlyOnedeliveries = [];

		this.init = function init() {
			vm.search(false);
		};


		this.init = function init() {
			var hasError = false;
						
			$timeout(function () {												
				deliverywindowsFactory.getParameters(function(result) {						
					if (!result['QP_l_log_usa_otif']){						
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'warning',
							title: $rootScope.i18n('l-warning'),
							detail: $rootScope.i18n('l-param-otif', [], 'dts/mpd/')
						});
						var pageActive = appViewService.getPageActive();
						appViewService.releaseConsume(pageActive);
						appViewService.removeView(pageActive);									
				   }       
				});				
			}, 500);			
			            
            if (!hasError) {
                vm.search(false);
            }            
		};

		vm.search = function search(isMore) {

			var options, filters = [];

			vm.deliveriesCount = 0;
			if (!isMore) {
				vm.deliveries = [];
			}

			options = {
				start: vm.deliveries.length,
				max: 50
			};

			angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));

			//Busca Registros da grade
			deliverywindowsFactory.getDeliveryWindowsItemCust(options, function(result) {				
				if(result && result[0] && result[0].hasOwnProperty('$length')) {
					vm.deliveriesCount = result[0].$length;
				}
				vm.deliveries = vm.deliveries.concat(result).reverse();
			});
		};

		vm.applySimpleFilter = function applySimpleFilter() {
			if (vm.quickSearch && vm.quickSearch.trim().length > 0) {
				var quickSearch = $.grep(vm.disclaimers, function(filter){ return filter.property.indexOf('quickSearch') >= 0; });
				var disclaimer = helper.addFilter('quickSearch', vm.quickSearch, $rootScope.i18n('l-simple-filter'));
				if(quickSearch.length > 0) {
					var index = vm.disclaimers.indexOf(quickSearch[0]);
					vm.disclaimers[index] = disclaimer;
				} else {
					vm.disclaimers.push(disclaimer);
				}

			}else{
				vm.disclaimers.forEach(function(tag) {
					var index = tag.property.indexOf('quickSearch');
					if (index >= 0) {
						vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
					}
				});
			}
			vm.search(false);
		};

		vm.removeDisclaimer = function removeDisclaimer(disclaimer) {
			var index = vm.disclaimers.indexOf(disclaimer);
			if(index >= 0) {
				vm.disclaimers.splice(index,1);
			}
			vm.search(false);
		};

		vm.removeSimpleFilter = function removeSimpleFilter() {
			vm.quickSearch = "";
		};

		vm.removeCustomFilter = function removeCustomFilter(filter) {
			$totvsprofile.remote.remove('dts.mpd.paymentmethods.filters', filter.title, function(result) {
				if(!result.$hasError) {
					var index = vm.listOfCustomFilters.indexOf(filter);
					vm.listOfCustomFilters.splice(index, 1);
				}
			});
		};

		vm.setQuickFilter = function setQuickFilter(filter) {
			vm.disclaimers = [].concat(filter.value);
			vm.search(false);
		};
		
		vm.deleteDeliveries = function(window){

			if(window != undefined){

				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/deliverywindows/deliverywindows.confirm.html',
					controller: 'deliveries.confirm.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'md'
				});

				modalInstance.result.then(function (data) {
					if (data.confirm) {
						deliverywindowsFactory.deleteDeliveryWindow({ idiSeq: window['cdn-otif-excec-id'] }, function (result) {
							if (!result.$hasError) {
								vm.search(false);
							}
						});
						
					}
				});
			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-a-relationship')
				});
			}
		}
		

		vm.addDeliveries = function(){
			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/deliverywindows/deliverywindows.add.html',
				controller: 'deliveries.add.control as controller',
				backdrop: 'static',
                keyboard: false,
				size: 'lg',
			});

			modalInstance.result.then(function(data) {
				vm.search(false);
			});
		}

		
		vm.updateDeliveries = function(window){
			if(window != undefined){
				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/deliverywindows/deliverywindows.update.html',
					controller: 'deliveries.update.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'lg',
					resolve: {
						modalParams: function() {
							return {
								windowToEdit: window							
							}
						}
					}
				});

				modalInstance.result.then(function(data) {
					vm.search(false);
				});
 			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-a-relationship')
				});
			}
		}

		vm.copyDeliveries = function (window) {
			if (window != undefined) {
				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/deliverywindows/deliverywindows.copy.html',
					controller: 'deliveries.copy.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'lg',
					resolve: {
						modalParams: function () {
							return {
								windowToCopy: window
							}
						}
					}
				});

				modalInstance.result.then(function (data) {
					vm.search(false);
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-a-relationship')
				});
			}
		}

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		//if ($rootScope.currentuserLoaded) { vm.init(); }
		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			vm = undefined;
		});

		if (appViewService.startView(vm.i18n('l-delivery-windowns-otif'), this)) {
			vm.init();
		}else{
			vm.init();
		}
		

	}

	// *************************************************************************************
	// ***  CONTROLLER BOTAO NOVO
	// *************************************************************************************
	deliveriesAddController.$inject = ['$scope', '$modalInstance', '$rootScope', '$modal', 'TOTVSEvent', 'mpd.fchdis0028.FactoryApi', 'mpd.deliverywindows.Factory', '$timeout'];
	function deliveriesAddController($scope, $modalInstance, $rootScope, $modal, TOTVSEvent, portalRegFactoryApi, deliverywindowsFactory, $timeout) {

		//Variaveis do controller
		var controller        = this;
		controller.referHide  = true;
		controller.canSave    = true;
		controller.diasantes  = 0;
		controller.diasdepois = 0;
		controller.model      = {};
		controller.tag 		  = true;

		// Tratamento para itens com referência
		this.onChangeItem = function(codItem){			
			controller['referencia'] = undefined;
			
			if (codItem == null || codItem == undefined){
				controller.referHide = true;
			}else{								
				if (codItem == ""){
					codItem = " ";
				}				
				portalRegFactoryApi.getRef({itCodigo: codItem}, function(result){
					controller.referHide = result.lControle;
				});
			}
		}
			
		//Tratamento para salvar pelo enter e limpar a tela
		this.saveandnew = function($event){						
			if(($event.keyCode === 13 && controller.tag) || $event.type === 'click'){
				controller.save(true);
				controller.tag = false;				
				angular.element('input[name="controller_customer_input"]').focus();
			}
		}
			
		//Salva o registro
		this.save = function(newRecord) {			
																
			if($("input[name=controller_customer_input]").val()   === "?") {controller.customer = "?"}
			if($("input[name=controller_customer_input]").val()   === "")  {controller.customer = undefined};			
			if($("input[name=controller_item_input]").val()       === "?") {controller.item = "?"};			
			if($("input[name=controller_item_input]").val()       === "")  {controller.item = undefined};			
			if($("input[name=controller_referencia_input]").val() === "?") {controller.referencia = "?"};
			if($("input[name=controller_referencia_input]").val() === "")  {controller.referencia = undefined};
																				
			if (controller.customer   === undefined) { controller.canSave = false; }
			if (controller.item       === undefined) { controller.canSave = false; }
			if (controller.referencia === undefined && !controller.referHide) { controller.canSave = false; }

			if(!controller.canSave){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-missing-fields')
				});
				controller.canSave = true;
			}else{
												
				if(controller.diasantes === undefined || controller.diasdepois === undefined) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('Dias antes e depois do prazo devem respeitar o intervalo de 0 - 9999')
					});
				} else {

					if (controller.item === "?") { controller.item = undefined }
					if (controller.referencia === "?") { controller.referencia = undefined }

					controller.model = {
						'nome-abrev': controller.customer['nome-abrev'],
						'it-codigo': controller.item,
						'cod-refer': controller.referencia,
						'cdn-quant-dias-ant-praz': controller.diasantes,
						'cdn-quant-dias-depois-praz': controller.diasdepois,				
					};
																														
					deliverywindowsFactory.postNewDeliveryWindow(controller.model, function(response){
						if(!response.$hasError){
							if(newRecord){
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success',
									title: $rootScope.i18n('l-success'),
									detail: $rootScope.i18n('Nova Jalela de Entrega incluída com sucesso!')
								});
								controller.customer   = undefined;
								controller.item 	  = undefined;
								controller.referencia = undefined;
							}else{
								$modalInstance.close();
							}							
						}
					})					
				}				
				
			}		
						
		}

		// Tratamento para fazer depois que a tela é carregada
		$scope.init = function () {
			angular.element('input[name="controller_customer_input"]').focus();
			angular.element('input[name="controller_item_input"]').blur(function(){				
				if($("input[name=controller_item_input]").val() == "?"){										
					controller.referHide     = false;
					controller.referDisabled = true;
					angular.element('input[name="controller_referencia_input"]').val("?");					
					angular.element('input[name="controller_diasantes"]').focus();
				}else{					
					controller.referDisabled = false;
				}
			});			
		}
		$timeout($scope.init);

		// Fecha o modal e atualiza a lista
		this.close = function() {			
			$modalInstance.close();
		}
	}

	// *************************************************************************************
	// ***  CONTROLLER BOTAO ALTERAR
	// *************************************************************************************
	deliveriesUpdateController.$inject = ['$modalInstance', '$rootScope', '$modal', 'modalParams', 'TOTVSEvent', 'mpd.fchdis0028.FactoryApi', 'mpd.deliverywindows.Factory'];
	function deliveriesUpdateController($modalInstance, $rootScope, $modal, modalParams, TOTVSEvent, portalRegFactoryApi, deliverywindowsFactory) {

		var controller = this;
		controller.canSave = true;
		controller.model = {};

		controller.customer = modalParams.windowToEdit['nome-abrev'];
		controller.item = modalParams.windowToEdit['it-codigo-and-desc'];
		controller.referencia = modalParams.windowToEdit['cod-refer-and-desc'];
		controller.diasantes = modalParams.windowToEdit['cdn-quant-dias-ant-praz'];
		controller.diasdepois = modalParams.windowToEdit['cdn-quant-dias-depois-praz'];
		controller.cdnOtifExcecId = modalParams.windowToEdit['cdn-otif-excec-id'];
		
		if (controller.referencia === "") {
			controller.referHide = true;
		}
								
		this.save = function() {

			if(controller.diasantes === undefined || controller.diasdepois === undefined) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('Dias antes e depois do prazo devem respeitar o intervalo de 0 - 9999')
				});
			}else{

				controller.model = {					
					'cdn-quant-dias-ant-praz': controller.diasantes,
					'cdn-quant-dias-depois-praz': controller.diasdepois,
					'cdn-otif-excec-id': controller.cdnOtifExcecId
				};
																	
				deliverywindowsFactory.putDeliveryWindow(controller.model, function(response){
					if(!response.$hasError){
						$modalInstance.close();
					}
				})

			}
		}

		this.close = function () {
			$modalInstance.dismiss('cancel');
		}
	}

	// *************************************************************************************
	// ***  CONTROLLER BOTAO COPIAR
	// *************************************************************************************
	deliveriesCopyController.$inject = ['$modalInstance', '$scope', '$rootScope', '$modal', 'modalParams', 'TOTVSEvent', 'mpd.fchdis0028.FactoryApi', 'mpd.deliverywindows.Factory', '$timeout'];
	function deliveriesCopyController($modalInstance, $scope, $rootScope, $modal, modalParams, TOTVSEvent, portalRegFactoryApi, deliverywindowsFactory, $timeout) {

		var controller = this;
		controller.canSave = true;
		controller.model = {};
		controller.referHide = true;
				
		controller.customer = modalParams.windowToCopy['nome-abrev'];
		controller.item = modalParams.windowToCopy['it-codigo'];
		controller.referencia = modalParams.windowToCopy['cod-refer'];
		controller.diasantes = modalParams.windowToCopy['cdn-quant-dias-ant-praz'];
		controller.diasdepois = modalParams.windowToCopy['cdn-quant-dias-depois-praz'];
		controller.cdnOtifExcecId = modalParams.windowToCopy['cdn-otif-excec-id'];
		
		// Tratamento para itens com referência
		this.onChangeItem = function (codItem) {
			controller['referencia'] = undefined;

			if (codItem == null || codItem == undefined) {
				controller.referHide = true;
			} else {
				if (codItem == "") {
					codItem = " ";
				}
				portalRegFactoryApi.getRef({ itCodigo: codItem }, function (result) {
					controller.referHide = result.lControle;
				});
			}
		}

		//Salva o registro
		this.save = function () {
			
			if ($("input[name=controller_customer_input]").val() === "?") { controller.customer = "?" }
			if ($("input[name=controller_customer_input]").val() === "") { controller.customer = undefined };
			if ($("input[name=controller_item_input]").val() === "?") { controller.item = "?" };
			if ($("input[name=controller_item_input]").val() === "") { controller.item = undefined };
			if ($("input[name=controller_referencia_input]").val() === "?") { controller.referencia = "?" };
			if ($("input[name=controller_referencia_input]").val() === "") { controller.referencia = undefined };
		
			if (controller.customer === undefined) { controller.canSave = false; }
			if (controller.item === undefined) { controller.canSave = false; }
			if (controller.referencia === undefined && !controller.referHide) { controller.canSave = false; }

			if (!controller.canSave) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-missing-fields')
				});
				controller.canSave = true;
			} else {

				if (controller.diasantes === undefined || controller.diasdepois === undefined) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('Dias antes e depois do prazo devem respeitar o intervalo de 0 - 9999')
					});
				} else {

					if (controller.item === "?") { controller.item = undefined }
					if (controller.referencia === "?") { controller.referencia = undefined }

					controller.model = {
						'nome-abrev': controller.customer['nome-abrev'],
						'it-codigo': controller.item,
						'cod-refer': controller.referencia,
						'cdn-quant-dias-ant-praz': controller.diasantes,
						'cdn-quant-dias-depois-praz': controller.diasdepois,
					};
					
					deliverywindowsFactory.postNewDeliveryWindow(controller.model, function (response) {
						if (!response.$hasError) {
							$modalInstance.close();							
						}
					})
				}
			}
		}

		// Tratamento para fazer depois que a tela é carregada
		$scope.init = function () {	
			angular.element('input[name="controller_item_input"]').blur(function(){						
				if($("input[name=controller_item_input]").val() == "?"){															
					controller.referHide     = false;
					controller.referDisabled = true;
					angular.element('input[name="controller_referencia_input"]').val("?");
					angular.element('input[name="controller_diasantes"]').focus();
				}else{					
					controller.referDisabled = false;
				}
			});
			angular.element('input[name="controller_customer_input"]').val(controller.customer);
			if(modalParams.windowToCopy['it-codigo-and-desc'] === "?"){
				angular.element('input[name="controller_item_input"]').val("?");
			}
			if(modalParams.windowToCopy['cod-refer-and-desc'] === "?"){
				controller.referHide = false;
				angular.element('input[name="controller_referencia_input"]').val("?");
			}				
		}
		$timeout($scope.init);

		this.close = function() {
			$modalInstance.dismiss('cancel');
		}
	}

	// *************************************************************************************
	// ***  CONTROLLER MENSAGEM DE EXCLUSÃO DE RELACIONAMENTO
	// *************************************************************************************
	deliveriesDeleteController.$inject = ['$modalInstance'];
	function deliveriesDeleteController($modalInstance) {

		var controller = this;

		controller.close = function() {
			$modalInstance.dismiss('cancel');
		}

		controller.confirm = function(){
			$modalInstance.close({
				confirm: true
			});
		}
	}

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************
	deliveryWindowsHelper.$inject = ['$filter'];
	function deliveryWindowsHelper($filter) {

		return {

			addFilter: function (property, value, title, type, hide) {
				var filter = {
					'property': property,
					'value': value,
					'type': type ? type : 'string',
					'hide': hide === true
				};

				switch (type) {
					case 'date':
						filter.title = title + ': ' + $filter('date')(value, 'shortDate');
					break;
					case 'boolean':
						filter.title = title;
					break;
					default:
						filter.title = title + ': ' + value;
					break;
				}
				return filter;
			},

			parseDisclaimersToFilter: function(disclaimers) {
				disclaimers = disclaimers || [];
				var filters = {};
				disclaimers.forEach(function(disclaimer) {
					filters[disclaimer.property] = disclaimer.value;
				});
				return filters;
			},

			parseDisclaimersToParameters: function(disclaimers) {
				disclaimers = disclaimers || [];
				var options = {
					properties: [],
					values: []
				};
				disclaimers.forEach(function(filter) {
					if (filter.property) {
						options.properties.push(filter.property);
						switch (filter.type) {
							case 'date':
								options.values.push($filter('date')(filter.value, 'shortDate'));
							break;
							default:
								options.values.push(filter.value);
							break;
						}
					}
				});
				return options;
			}
		};
		

	}
	
	index.register.controller('deliveries.confirm.control', deliveriesDeleteController);
	index.register.controller('deliveries.add.control', deliveriesAddController);
	index.register.controller('deliveries.update.control', deliveriesUpdateController);
	index.register.controller('deliveries.copy.control', deliveriesCopyController);
	index.register.service('mpd.deliverywindows.helper', deliveryWindowsHelper);
	index.register.controller('mpd.deliverywindows.list.control', deliveryWindowsListController);
	
});
