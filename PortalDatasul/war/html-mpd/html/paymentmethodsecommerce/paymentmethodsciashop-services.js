define([
	'index',
	'/dts/mpd/js/api/fchdis0053.js',
	'/dts/mpd/js/userpreference.js',
	'/dts/mpd/js/portal-factories.js',
	'/dts/mpd/js/zoom/estabelec.js',
	'/dts/acr/js/zoom/espec-docto-financ-acr.js',
	'/dts/utb/js/zoom/ser-fisc-nota.js',
	'/dts/utb/js/zoom/portador.js',
	'/dts/acr/js/zoom/cart-bcia.js',
	'/dts/sco/js/zoom/admdra-cartao-cr.js',
	'/dts/mpd/js/zoom/emitente.js',
	'/dts/mpd/js/zoom/repres.js',
	'/dts/mpd/js/zoom/cond-pagto.js'
], function(index) {
	'use strict';

	paymentMethodsListController.$inject = [
		'$scope', '$rootScope', 'mpd.paymentmethodsapd.Factory', '$filter', '$totvsprofile', 'totvs.app-main-view.Service', '$stateParams', '$q', 'userPreference', '$location', 'TOTVSEvent', 'mpd.paymentmethods.helper', '$modal',
	];
	function paymentMethodsListController($scope, $rootScope, paymentMethodsFactory, $filter, $totvsprofile, appViewService, $stateParams, $q, userPreference, $location, TOTVSEvent, helper, $modal) {

		var vm = this;

		vm.i18n = $filter('i18n');
		vm.relationShip = [];
		vm.disclaimers = [];
		vm.allPaymentMethods = [];
		vm.onlyOneRelationShip = [];

		this.init = function init() {
			vm.search(false);
		};

		vm.search = function search(isMore) {

			var options, filters = [];

			vm.relationShipCount = 0;
			if (!isMore) {
				vm.relationShip = [];
			}

			options = {
				start: vm.relationShip.length,
				max: 50
			};

			angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));

			//Busca Relacionamento
			paymentMethodsFactory.getRelationShipPaymentMethods(options, function(result) {
				if(result && result[0] && result[0].hasOwnProperty('$length')) {
					vm.relationShipCount = result[0].$length;
				}
				vm.relationShip = vm.relationShip.concat(result);
			});

			// Busca Metodos de Pagamento caso ainda no tenha feito
			if(vm.allPaymentMethods.length == 0){
				paymentMethodsFactory.getPaymentMethods(function(result) {
					vm.allPaymentMethods = vm.allPaymentMethods.concat(result);
				});
			}
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

		vm.openPaymentMethods = function openPaymentMethods() {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/paymentmethodsciashop/paymentmethodsciashop.methods.html',
				controller: 'payment.methods.control as paymentMethodsController',
				size: 'lg',
				resolve: {
					modalParams: function() {
						return {
							paymentmeth: vm.allPaymentMethods,
						}
					}
				}
			});
			
			modalInstance.result.then(function(data) {
				paymentMethodsFactory.getPaymentMethods(function(result) {					
					vm.allPaymentMethods = result;
				});
			});						
		}

		vm.deleteRelationShipPaymentMethods = function(paymentRelationShip){

			if(paymentRelationShip != undefined){

				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/paymentmethodsciashop/paymentmethodsciashop.confirm.html',
					controller: 'paymentrelationship.confirm.control as relationShipMethodsDeleteController',
					size: 'md'
				});

				modalInstance.result.then(function(data) {
					if(data.confirm){
						for(var i = 0; i < vm.relationShip.length; i ++){
							if(vm.relationShip[i]['cod_metodo_pgto']  == paymentRelationShip['cod_metodo_pgto'] && vm.relationShip[i]['cod_estabel']  == paymentRelationShip['cod_estabel']){
								vm.onlyOneRelationShip.push(paymentRelationShip);
							}
						}

						paymentMethodsFactory.deleteRelationShipPaymentMethods(vm.onlyOneRelationShip, function(result) {
							if(!result.$hasError){
								for(var i = 0; i < vm.relationShip.length; i ++){
									vm.search(false);
								};
								vm.onlyOneRelationShip = [];
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

		vm.addRelationShipPaymentMethods = function(){

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/paymentmethodsciashop/paymentmethodsciashop.update.html',
				controller: 'paymentrelationship.update.control as controller',
				size: 'lg',
				resolve: {
					modalParams: function() {
						return {
							paymentmeth: vm.allPaymentMethods,
						}
					}
				}
			});

			modalInstance.result.then(function(data) {
				vm.search(false);
			});
		}

		vm.updateRelationShipPaymentMethods = function(paymentRelationShip){
			if(paymentRelationShip != undefined){
				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/paymentmethodsciashop/paymentmethodsciashop.update.html',
					controller: 'paymentrelationship.edit.control as controller',
					size: 'lg',
					resolve: {
						modalParams: function() {
							return {
								paymentmeth: paymentRelationShip,
								allPaymentMethods: vm.allPaymentMethods
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

		if (appViewService.startView(vm.i18n('l-payment-methods-ciashop'), this)) {
			vm.init();
		}else{
			vm.init();
		}

	}


	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************
	paymentMethodsHelper.$inject = ['$filter'];
	function paymentMethodsHelper($filter) {

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

	index.register.service('mpd.paymentmethods.helper', paymentMethodsHelper);
	index.register.controller('mpd.paymentmethods.list.control', paymentMethodsListController);

	// *************************************************************************************
	// ***  CONTROLLER METODOS DE PAGAMENTO
	// *************************************************************************************
	paymentMethodsController.$inject = ['modalParams', '$modalInstance', '$rootScope', 'mpd.paymentmethodsapd.Factory', '$modal', 'TOTVSEvent'];
	function paymentMethodsController(modalParams, $modalInstance, $rootScope, paymentMethodsFactory, $modal, TOTVSEvent) {

		var paymentMethodsController             = this;
		paymentMethodsController.listResult      = modalParams.paymentmeth;
		paymentMethodsController.customerMethods = [];

		var removaFromIndex = [];

		for(var i = 0; i < paymentMethodsController.listResult.length; i ++){
			if(paymentMethodsController.listResult[i]['cod-desc'] == ''){
				var index = paymentMethodsController.listResult.indexOf(paymentMethodsController.listResult[i]);
				removaFromIndex.push(index);
			}
		};

		for (var i = removaFromIndex.length -1; i >= 0; i--){
			paymentMethodsController.listResult.splice(removaFromIndex[i],1);
		}

		$rootScope.$broadcast(TOTVSEvent.showNotification, {
			type: 'warning',
			title: $rootScope.i18n('l-attention'),
			detail: $rootScope.i18n('l-alert-open-payment-methods')
		});

		for(var i = 0; i < paymentMethodsController.listResult.length; i ++){
			if(paymentMethodsController.listResult[i]['belong-cia'] == true || paymentMethodsController.listResult[i]['belong-cia'] == "Sim"){
				paymentMethodsController.listResult[i]['belong-cia'] = "Sim"
			}else{
			   paymentMethodsController.listResult[i]['belong-cia'] = "Não"
			}
		};

		paymentMethodsController.close = function() {
			$modalInstance.dismiss('cancel');
		}

		paymentMethodsController.remove = function(codValor) {
			if(codValor != undefined){
				if(codValor['belong-cia'] == "Sim"){
					paymentMethodsController.searchItemsGrid.closeCell();
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-default-method-cia')
					});
				}else{
					if(codValor['cod-chave'] != ""){						
						paymentMethodsFactory.isMethodAlreadyUsed({codRelationship: codValor['cod-chave']}, function(response){
							if(response.$hasError){						
								paymentMethodsController.searchItemsGrid.closeCell();						
							}else{
								for(var i = 0; i < paymentMethodsController.listResult.length; i ++){
									if(paymentMethodsController.listResult[i]["num-id"] == codValor["num-id"]){
										var index = paymentMethodsController.listResult.indexOf(paymentMethodsController.listResult[i]);
										if(index >= 0) {
											paymentMethodsController.listResult.splice(index, 1);
										}		
									}
								};
							}
						});															
					}else{
						for(var i = 0; i < paymentMethodsController.listResult.length; i ++){
							if(paymentMethodsController.listResult[i]["num-id"] == codValor["num-id"]){
								var index = paymentMethodsController.listResult.indexOf(paymentMethodsController.listResult[i]);
								if(index >= 0) {
									paymentMethodsController.listResult.splice(index, 1);
								}		
							}
						 };
					}

				}
			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-a-method')
				});
			}
		};
				
		paymentMethodsController.add = function() {
												
			paymentMethodsController.listResult.push({
				'belong-cia': 'Não',
				'cod-campo': 'methodname',
				'cod-chave': '',
				'cod-comp': '',
				'cod-desc': '',
				'cod-localiz': 'mpd.ciashop',
				'cod-valor': ''
			})
			
			$(".k-grid-content").animate({ scrollTop: 9999}, 400);
											
		};
		
		paymentMethodsController.save = function() {
			
			var return_error_message = false;

			for(var i = 0; i < paymentMethodsController.listResult.length; i ++){
				if(paymentMethodsController.listResult[i]['cod-valor'] == '' || paymentMethodsController.listResult[i]['cod-chave'] == '' || paymentMethodsController.listResult[i]['cod-comp'] == ''){
					return_error_message = true;
				}
			};

			if(return_error_message){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-missing-fields')
				});

				 $(".k-grid-content").animate({ scrollTop: 9999}, 400);

			}else{
				for(var i = 0; i < paymentMethodsController.listResult.length; i ++){
					if(paymentMethodsController.listResult[i]['belong-cia'] === 'Não'){
						
						paymentMethodsController.customerMethods.push({'belong-cia': 'Não',
																	   'num-id': paymentMethodsController.listResult[i]['num-id'],
																	   'cod-campo': paymentMethodsController.listResult[i]['cod-campo'],
																	   'cod-desc': 'Método de Pagamento',
																	   'cod-localiz': paymentMethodsController.listResult[i]['cod-localiz'],
																	   'cod-valor': paymentMethodsController.listResult[i]['cod-valor'],
																	   'cod-chave': paymentMethodsController.listResult[i]['cod-chave'],
																	   'cod-comp': paymentMethodsController.listResult[i]['cod-comp']})
					}
				}
				
				paymentMethodsFactory.putPaymentMethods(paymentMethodsController.customerMethods, function(response){
					if(!response.$hasError){						
						$modalInstance.close({
							allPaymentMethods: paymentMethodsController.listResult
						});
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-success'),
							detail: $rootScope.i18n('l-updated-added-payment-methods')
						});
					}else{
						paymentMethodsController.customerMethods = [];
					}
				});				
			}
		};

		paymentMethodsController.itemsGridEdit = function(event, column) {			
			if(event.model['belong-cia'] == "Sim"){
				paymentMethodsController.searchItemsGrid.closeCell();
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-default-method-cia')
				});
			}else{								
				if(event.model['cod-chave'] != ""){										
					paymentMethodsFactory.isMethodAlreadyUsed({codRelationship: event.model['cod-chave']}, function(response){
						if(response.$hasError){						
							paymentMethodsController.searchItemsGrid.closeCell();						
						}
					});															
				}
			}
		}

		paymentMethodsController.removeMethodFiltered = function() {
			paymentMethodsController.methodsFiltered = "";
			paymentMethodsController.listResult = modalParams.paymentmeth;
		};

		paymentMethodsController.applyMethodFilter = function(screenValue) {

			paymentMethodsController.listResult = modalParams.paymentmeth;

			var res = paymentMethodsController.listResult.filter(function (el) {
				return  (el['cod-chave'].match(screenValue) || el['cod-comp'].match(screenValue) || el['cod-valor'].match(screenValue) || el['belong-cia'].match(screenValue));
			});

			if(res.length > 0){
				paymentMethodsController.listResult = res;
			}else{
				 $rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-method-not-found')
				});
			}
		};
	}

	index.register.controller('payment.methods.control', paymentMethodsController);

	// *************************************************************************************
	// ***  CONTROLLER MENSAGEM DE EXCLUSÃO DE RELACIONAMENTO
	// *************************************************************************************

	relationShipMethodsDeleteController.$inject = ['$modalInstance'];
	function relationShipMethodsDeleteController($modalInstance) {

		var relationShipMethodsDeleteController = this;

		relationShipMethodsDeleteController.close = function() {
			$modalInstance.dismiss('cancel');
		}

		relationShipMethodsDeleteController.confirm = function(){
			$modalInstance.close({
				confirm: true
			});
		}
	}

	index.register.controller('paymentrelationship.confirm.control', relationShipMethodsDeleteController);

	// *************************************************************************************
	// ***  CONTROLLER INCLUSÃO DE RELACIONAMENTO
	// *************************************************************************************

	relationShipMethodsAddController.$inject = ['$rootScope', 'modalParams', '$modalInstance', 'mpd.paymentmethodsapd.Factory', 'TOTVSEvent'];
	function relationShipMethodsAddController($rootScope, modalParams, $modalInstance, paymentMethodsFactory, TOTVSEvent) {

		var controller  = this;
		this.payMethod  = {model: {}};
		this.methodType = {model: {}};

		var paymentMethodValue;
		var siteIdValue;
		var paymentTypeValue;
		var disableSelectMethodType = true;		
		var sitecannotbeempty       = false; 

		controller.payMethod.model.methodId    = 0;
		controller.methodType.model.typeId     = 0;
		controller.cardType                    = true;
		controller.validKey                    = true;
		controller.validTypePaymentMethod      = true;
		controller.validTypePaymentToCustomer  = true;
		controller.requireCodEstabel           = true;
		controller.addType                     = true;
		controller.desabilitaEstab             = false;
		controller.disableAllSites             = false;
		controller.paymentMethodRelationShip   = [];
		controller.payMethod.allPaymentMethods = [];
		controller.element = {};

		controller.methodType.types = [
			{typeId: 0, descType: '1 - Boleto'},
			{typeId: 1, descType: '2 - Transferência Bancária'},
			{typeId: 2, descType: '3 - Cartão de Crédito'},
			{typeId: 3, descType: '4 - Faturado ou Intermediador'}
		];

		controller.initTipoPortador = [{tipo: 'Banco'}];
		controller.initTipoCarteira = [{tipo: 'Portador'}];
		
		for(var i = 0; i < modalParams.paymentmeth.length; i ++){
			controller.payMethod.allPaymentMethods.push({numId: i,
														 metodoPagamento: modalParams.paymentmeth[i]['cod-chave'],
														 descMetodo: modalParams.paymentmeth[i]['cod-valor'],
														 grupoMetodo: modalParams.paymentmeth[i]['cod-comp']})
		};

		controller.descMethodPayment  = controller.payMethod.allPaymentMethods[0].descMetodo;
		controller.groupMethodPayment = controller.payMethod.allPaymentMethods[0].grupoMetodo;

		this.selectedMethod = function(selectedPaymentMethod, codEstabel, selectedPaymentType){

			// Valor Método de Pagamento
			for(var i = 0; i < controller.payMethod.allPaymentMethods.length; i ++){
				if(controller.payMethod.allPaymentMethods[i].numId == selectedPaymentMethod){
				   controller.descMethodPayment  = controller.payMethod.allPaymentMethods[i].descMetodo;
				   controller.groupMethodPayment = controller.payMethod.allPaymentMethods[i].grupoMetodo;
				   paymentMethodValue = controller.payMethod.allPaymentMethods[i].metodoPagamento;
				}
			};

			if((codEstabel != undefined && !controller.allSites) || (codEstabel === undefined && controller.allSites)){

				controller.validTypePaymentMethod     = true;
				controller.validKey                   = true;
				controller.cardType                   = true;
				controller.validTypePaymentToCustomer = true;
				
				// Valor Método de Pagamento
				for(var i = 0; i < controller.payMethod.allPaymentMethods.length; i ++){
					if(controller.payMethod.allPaymentMethods[i].numId == selectedPaymentMethod){
						controller.descMethodPayment  = controller.payMethod.allPaymentMethods[i].descMetodo;
						controller.groupMethodPayment = controller.payMethod.allPaymentMethods[i].grupoMetodo;
						paymentMethodValue = controller.payMethod.allPaymentMethods[i].metodoPagamento;
					}
				};				

				// Valor Tipo Pagamento
				for(var i = 0; i < controller.methodType.types.length; i ++){
					if(controller.methodType.types[i].typeId == selectedPaymentType){
						paymentTypeValue = controller.methodType.types[i].descType;
					}
				};

				// Valor Estabelecimento
				siteIdValue = codEstabel;

				// Valida chave do Relacionamento
				if(siteIdValue != undefined){
					paymentMethodsFactory.validRelationShipPaymentMethods({validationId: 'validKeyRelationShip',
																		paymentMethod: paymentMethodValue,
																		siteId: siteIdValue,
																		paymentType: paymentTypeValue},
																		function(result) {

						if(!result.$hasError){
							disableSelectMethodType      = false;
							controller.requireCodEstabel = false;
							if(selectedPaymentType === 0 || selectedPaymentType === 1){
								controller.validTypePaymentMethod     = false;
								controller.validKey                   = false;
								controller.cardType                   = true;
								controller.validTypePaymentToCustomer = false;
							}else if(selectedPaymentType === 2){
								controller.validTypePaymentMethod     = true;
								controller.validKey                   = false;
								controller.cardType                   = false;
								controller.validTypePaymentToCustomer = true;
							}else{
								controller.validTypePaymentMethod     = true;
								controller.validKey                   = false;
								controller.cardType                   = true;
								controller.validTypePaymentToCustomer = false;
							}
						}else{
							disableSelectMethodType      = true;
							controller.requireCodEstabel = true;
						}
					});
				}else{
					paymentMethodsFactory.validRelationShipPaymentMethods({validationId: 'validKeyRelationShip',
																		paymentMethod: paymentMethodValue,
																		siteId: 'Todos',
																		paymentType: paymentTypeValue},
																		function(result) {

						if(!result.$hasError){
							disableSelectMethodType      = false;
							controller.requireCodEstabel = false;
							if(selectedPaymentType === 0 || selectedPaymentType === 1){
								controller.validTypePaymentMethod     = false;
								controller.validKey                   = false;
								controller.cardType                   = true;
								controller.validTypePaymentToCustomer = false;
							}else if(selectedPaymentType === 2){
								controller.validTypePaymentMethod     = true;
								controller.validKey                   = false;
								controller.cardType                   = false;
								controller.validTypePaymentToCustomer = true;
							}else{
								controller.validTypePaymentMethod     = true;
								controller.validKey                   = false;
								controller.cardType                   = true;
								controller.validTypePaymentToCustomer = false;
							}
						}else{
							disableSelectMethodType      = true;
							controller.requireCodEstabel = true;
						}
					});

				}
			}			
		}

		this.selectedSite = function(codEstabel, selectedPaymentMethod, selectedPaymentType){
			
			$("input[name=controller_estabelecimento_input]")
				.blur(function() {    
    				  if($("input[name=controller_estabelecimento_input]").val() === ""){							  						  
						  sitecannotbeempty = true;						  
					  }					  
					  else{						  
						  sitecannotbeempty = false;
					  }
		  		});			  
															
				if(codEstabel != undefined){
										
					controller.validTypePaymentMethod     = true;
					controller.validKey                   = true;
					controller.cardType                   = true;
					controller.validTypePaymentToCustomer = true;

					// Valor Estabelecimento
					siteIdValue = codEstabel;

					// Valor Método de Pagamento
					for(var i = 0; i < controller.payMethod.allPaymentMethods.length; i ++){
						if(controller.payMethod.allPaymentMethods[i].numId == selectedPaymentMethod){
							paymentMethodValue = controller.payMethod.allPaymentMethods[i].metodoPagamento;
						}
					};

					// Valor Tipo Pagamento
					for(var i = 0; i < controller.methodType.types.length; i ++){
						if(controller.methodType.types[i].typeId == selectedPaymentType){
							paymentTypeValue = controller.methodType.types[i].descType;
						}
					};

					// Valida chave do Relacionamento
					paymentMethodsFactory.validRelationShipPaymentMethods({validationId: 'validKeyRelationShipAllSites',
																		paymentMethod: paymentMethodValue,
																		siteId: siteIdValue,
																		paymentType: paymentTypeValue},
																		function(result) {
						if(!result.$hasError){
							disableSelectMethodType      = false;
							controller.requireCodEstabel = false;
							if(selectedPaymentType === 0 || selectedPaymentType === 1){
								controller.validTypePaymentMethod     = false;
								controller.validKey                   = false;
								controller.cardType                   = true;
								controller.validTypePaymentToCustomer = false;
							}else if(selectedPaymentType === 2){
								controller.validTypePaymentMethod     = true;
								controller.validKey                   = false;
								controller.cardType                   = false;
								controller.validTypePaymentToCustomer = true;
							}else{
								controller.validTypePaymentMethod     = true;
								controller.validKey                   = false;
								controller.cardType                   = true;
								controller.validTypePaymentToCustomer = false;
							}
						}else{
							disableSelectMethodType      = true;
							controller.requireCodEstabel = true;
						}
					});
				}
								
		}

		this.selectedType = function(selectedPaymentType, selectedPaymentMethod, codEstabel, allSitesSelected){
			
			controller.validTypePaymentMethod     = true;
			controller.validKey                   = true;
			controller.cardType                   = true;
			controller.validTypePaymentToCustomer = true;
		
			if(codEstabel == undefined && allSitesSelected){
				valKeyRelationShip('Todos', selectedPaymentType, selectedPaymentMethod);
			}else if(codEstabel != undefined && !allSitesSelected){
				valKeyRelationShip(codEstabel, selectedPaymentType, selectedPaymentMethod);
			}
			
			function valKeyRelationShip(siteIdValue, type, method){
				
				// Valor Tipo Pagamento
				for(var i = 0; i < controller.methodType.types.length; i ++){
					if(controller.methodType.types[i].typeId == type){
						var typeValue = controller.methodType.types[i].descType;
					}
				};

				// Valor Método de Pagamento
				for(var i = 0; i < controller.payMethod.allPaymentMethods.length; i ++){
					if(controller.payMethod.allPaymentMethods[i].numId == method){
						var methodValue = controller.payMethod.allPaymentMethods[i].metodoPagamento;
					}
				};

				// Valida chave duplicada no Progress
				paymentMethodsFactory.validRelationShipPaymentMethods({validationId: 'validKeyRelationShipAllSites',
																		paymentMethod: methodValue,
																		siteId: siteIdValue,
																		paymentType: typeValue},
																		function(result) {																			
						if(!result.$hasError){
							disableSelectMethodType = false;
							controller.requireCodEstabel = false;
							valEnableFields();
						}
				});

			}			

			function valEnableFields(){				

				if(!disableSelectMethodType){
					if(selectedPaymentType === 0 || selectedPaymentType === 1){
						controller.validTypePaymentMethod     = false;
						controller.validKey                   = false;
						controller.cardType                   = true;
						controller.validTypePaymentToCustomer = false;
						controller.initTipoPortador = [{tipo: 'Banco'}];
						controller.initTipoCarteira = [{tipo: 'Portador'}];
					}else if(selectedPaymentType === 2){
						controller.validTypePaymentMethod     = true;
						controller.validKey                   = false;
						controller.cardType                   = false;
						controller.validTypePaymentToCustomer = true;
						controller.initTipoPortador = [{tipo: 'Administradora'}];
						controller.initTipoCarteira = [{tipo: 'Cartão Crédito'}];
					}else{
						controller.validTypePaymentMethod     = true;
						controller.validKey                   = false;
						controller.cardType                   = true;
						controller.validTypePaymentToCustomer = false;
						controller.initTipoPortador = [{tipo: 'Caixa'}, {tipo: 'Banco'}];
						controller.initTipoCarteira = [{tipo: 'Portador'}, {tipo: 'Carteira'}];
					}
				}						
			}
			
		}

		controller.activeAllSites = function(activeSites, selectedPaymentMethod, selectedPaymentType){
			
			controller.validTypePaymentMethod     = true;
			controller.validKey                   = true;
			controller.cardType                   = true;
			controller.validTypePaymentToCustomer = true;

			if(activeSites){

				controller.estabelecimento  = undefined;
				controller.desabilitaEstab  = true;

				 // Valor Método de Pagamento
				for(var i = 0; i < controller.payMethod.allPaymentMethods.length; i ++){
					if(controller.payMethod.allPaymentMethods[i].numId == selectedPaymentMethod){
						paymentMethodValue = controller.payMethod.allPaymentMethods[i].metodoPagamento;
					}
				};

				// Valor Tipo Pagamento
				for(var i = 0; i < controller.methodType.types.length; i ++){
					if(controller.methodType.types[i].typeId == selectedPaymentType){
						paymentTypeValue = controller.methodType.types[i].descType;
					}
				};

				// Valida chave do Relacionamento
				paymentMethodsFactory.validRelationShipPaymentMethods({validationId: 'validKeyRelationShipAllSites',
																	   paymentMethod: paymentMethodValue,
																	   siteId: 'Todos',
																	   paymentType: paymentTypeValue},
																	   function(result) {
					if(!result.$hasError){
						disableSelectMethodType      = false;
						controller.requireCodEstabel = false;
						if(selectedPaymentType === 0 || selectedPaymentType === 1){
							controller.validTypePaymentMethod     = false;
							controller.validKey                   = false;
							controller.cardType                   = true;
							controller.validTypePaymentToCustomer = false;
						}else if(selectedPaymentType === 2){
							controller.validTypePaymentMethod     = true;
							controller.validKey                   = false;
							controller.cardType                   = false;
							controller.validTypePaymentToCustomer = true;
						}else{
							controller.validTypePaymentMethod     = true;
							controller.validKey                   = false;
							controller.cardType                   = true;
							controller.validTypePaymentToCustomer = false;
						}
					}else{
						disableSelectMethodType      = true;
						controller.requireCodEstabel = true;
					}
				});

			}else{
				controller.desabilitaEstab   = false;
				disableSelectMethodType      = true;
				controller.requireCodEstabel = true;
			}
			
		}

		controller.filledCodBand = function(){			
			controller.bandeira = controller.administradoraEMS5['cod_band'];
		}

		controller.confirm = function(){
			
			if(sitecannotbeempty){											
				controller.validTypePaymentMethod     = true;
				controller.validKey                   = true;
				controller.cardType                   = true;
				controller.validTypePaymentToCustomer = true;
				controller.requireCodEstabel = true;
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-site-cannot-be-empty')
				});				
			}else{
						
				// Váriaveis locais para criação do objeto de Relacionamento
				let codMetodoPgto;
				let codEstabel        = controller.estabelecimento;
				let codTipoMetodPagto = controller.methodType.model.typeId;
				let codEspPedVda      = controller.especieEMS5;
				let codSerPedVda      = controller.seriesEMS5;
				let codPortador       = controller.portadorEMS5;
				let codCartBcia       = controller.carteiraEMS5;						
				let codAdmdraCartaoCr = controller.administradoraEMS5;
				let codBand           = controller.bandeira;
				let codEmitente       = controller.customer !== "" ? controller.customer : undefined;
				let codRepres         = controller.representante !== "" ? controller.representante : undefined;
				//let codCondPagto      = controller.condicaopagamento;
				let canSave           = true;

				// Busca método de Pagamento
				for(var i = 0; i < controller.payMethod.allPaymentMethods.length; i ++){
					if(controller.payMethod.allPaymentMethods[i].numId == controller.payMethod.model.methodId){
						codMetodoPgto = controller.payMethod.allPaymentMethods[i].metodoPagamento;
					}
				};

				codTipoMetodPagto += 1;
				controller.element['cod_metodo_pgto'] = codMetodoPgto;
				controller.element['cod_estabel'] = codEstabel;
				controller.element['cod_tipo_metod_pagto'] = codTipoMetodPagto;
				controller.element['cod_esp_ped_vda'] = codEspPedVda;
				controller.element['cod_ser_ped_vda'] = codSerPedVda;
				controller.element['cod_portador'] = codPortador;
				controller.element['cod_cart_bcia'] = codCartBcia;			
				controller.element['cod_admdra_cartao_cr'] = codAdmdraCartaoCr;
				controller.element['cod_band'] = codBand;
				controller.element['cod_emitente_acr'] = codEmitente;
				controller.element['cod_repres'] = codRepres;
				//controller.element['cod_cond_pagto'] = codCondPagto;


				// Valida se os campos foram preenchidos antes de mandar para o progress
				if(codTipoMetodPagto == 1 || codTipoMetodPagto == 2){
					if(controller.element['cod_esp_ped_vda'] === undefined){canSave = false;};
					if(controller.element['cod_ser_ped_vda'] === undefined){canSave = false;};
					if(controller.element['cod_portador'] === undefined){canSave = false;};
					if(controller.element['cod_cart_bcia'] === undefined){canSave = false;};
					//if(controller.element['cod_emitente_acr'] === undefined){canSave = false;};
					//if(controller.element['cod_repres'] === undefined){canSave = false;};
					//if(controller.element['cod_cond_pagto'] === undefined){canSave = false;};
				}else if(codTipoMetodPagto == 3){
					if(controller.element['cod_portador'] === undefined){canSave = false;};
					if(controller.element['cod_cart_bcia'] === undefined){canSave = false;};
					if(controller.element['cod_admdra_cartao_cr'] === undefined){canSave = false;};				
					//if(controller.element['cod_repres'] === undefined){canSave = false;};
					//if(controller.element['cod_cond_pagto'] === undefined){canSave = false;};
				}else{
					if(controller.element['cod_portador'] === undefined){canSave = false;};
					if(controller.element['cod_cart_bcia'] === undefined){canSave = false;};
					//if(controller.element['cod_emitente_acr'] === undefined){canSave = false;};
					//if(controller.element['cod_repres'] === undefined){canSave = false;};
					//if(controller.element['cod_cond_pagto'] === undefined){canSave = false;};
				}
				
				// Verifica se os campos foram preenchidos antes de mandar para o progress
				if(!canSave){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-missing-fields')
					});
				}else{
					// Inclui o novo relacionamento na lista
					controller.paymentMethodRelationShip.push(controller.element);
					
					paymentMethodsFactory.saveRelationShipPaymentMethods(controller.paymentMethodRelationShip, function(response){
						if(!response.$hasError){
							$modalInstance.close({
								newRelationShip: controller.element
							});
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-success'),
								detail: $rootScope.i18n('l-relationship-added')
							});

							// Limpa objeto
							controller.paymentMethodRelationShip = [];
						}else{
							// Limpa objeto
							controller.paymentMethodRelationShip = [];
						}
					});					
				}
			}						
		}

		controller.close = function() {
			$modalInstance.dismiss('cancel');
		}
		
	}

	index.register.controller('paymentrelationship.update.control', relationShipMethodsAddController);

	// *************************************************************************************
	// ***  CONTROLLER ALTERAÇÃO DO RELACIONAMENTO
	// *************************************************************************************

	relationShipMethodsEditController.$inject = ['$rootScope', 'modalParams', '$modalInstance', 'mpd.paymentmethodsapd.Factory', 'TOTVSEvent'];
	function relationShipMethodsEditController($rootScope, modalParams, $modalInstance, paymentMethodsFactory, TOTVSEvent) {

		var controller = this;

		controller.editType                  = true;
		controller.methodPayment 			 = modalParams.paymentmeth.cod_metodo_pgto;
		controller.desabilitaEstab 			 = true;
		controller.disableAllSites           = true;
		controller.paymentMethodRelationShip = [];
			
		for(var i = 0; i < modalParams.allPaymentMethods.length; i ++){
			if(controller.methodPayment == modalParams.allPaymentMethods[i]['cod-chave']){
				controller.descMethodPayment = modalParams.allPaymentMethods[i]['cod-valor']
				controller.groupMethodPayment = modalParams.allPaymentMethods[i]['cod-comp']
			}
		};
				
		if(modalParams.paymentmeth['cod_estabel'] === 'Todos'){
			controller.allSites = true;		
		}else{
			controller.estabelecimento = modalParams.paymentmeth['cod_estabel'];
		}
						
		switch(modalParams.paymentmeth.cod_tipo_metod_pagto){
			case '1':
				controller.descType          = 'Boleto';
				controller.cardType          = true;
				controller.especieEMS5       = modalParams.paymentmeth['cod_esp_ped_vda'];
				controller.seriesEMS5        = modalParams.paymentmeth['cod_ser_ped_vda'];
				controller.portadorEMS5      = modalParams.paymentmeth['cod_portador'];
				controller.carteiraEMS5      = modalParams.paymentmeth['cod_cart_bcia'];
				controller.customer          = modalParams.paymentmeth['des_emitente_acr'];
				controller.representante     = modalParams.paymentmeth['cod_repres'];
				//controller.condicaopagamento = modalParams.paymentmeth['cod_cond_pagto'];
			break;
			case '2':
				controller.descType          = 'Transferência Bancária';
				controller.cardType          = true;
				controller.especieEMS5       = modalParams.paymentmeth['cod_esp_ped_vda'];
				controller.seriesEMS5        = modalParams.paymentmeth['cod_ser_ped_vda'];
				controller.portadorEMS5      = modalParams.paymentmeth['cod_portador'];
				controller.carteiraEMS5      = modalParams.paymentmeth['cod_cart_bcia'];
				controller.customer          = modalParams.paymentmeth['cod_emitente_acr'];
				controller.representante     = modalParams.paymentmeth['cod_repres'];
				//controller.condicaopagamento = modalParams.paymentmeth['cod_cond_pagto'];
			break;
			case '3':						   
				controller.descType = 'Cartão de Crédito';
				controller.validTypePaymentMethod     = true;
				controller.validTypePaymentToCustomer = true;
				controller.portadorEMS5               = modalParams.paymentmeth['cod_portador'];
				controller.carteiraEMS5               = modalParams.paymentmeth['cod_cart_bcia'];
				controller.administradoraEMS5         = modalParams.paymentmeth['cod_admdra_cartao_cr'];
				controller.bandeira                   = modalParams.paymentmeth['cod_band'];
				controller.representante              = modalParams.paymentmeth['cod_repres'];
				//controller.condicaopagamento          = modalParams.paymentmeth['cod_cond_pagto'];
			break;
			case '4':					
				controller.descType               = 'Faturado ou Intermediador';
				controller.validTypePaymentMethod = true;
				controller.cardType               = true;
				controller.portadorEMS5           = modalParams.paymentmeth['cod_portador'];
				controller.carteiraEMS5           = modalParams.paymentmeth['cod_cart_bcia'];
				controller.customer               = modalParams.paymentmeth['des_emitente_acr'];
				controller.representante          = modalParams.paymentmeth['cod_repres'];

				//controller.condicaopagamento      = modalParams.paymentmeth['cod_cond_pagto'];
			break;
		}

		controller.confirm = function(){
			
			// Váriaveis locais para criação do objeto de Relacionamento
			let codEspPedVda      = controller.especieEMS5;
			let codSerPedVda      = controller.seriesEMS5;
			let codPortador       = controller.portadorEMS5;
			let codCartBcia       = controller.carteiraEMS5;
			let codAdmdraCartaoCr = controller.administradoraEMS5;
			let codBand           = controller.bandeira;
			let codEmitente       = controller.customer !== "" ? controller.customer : undefined;
			let codRepres         = controller.representante !== "" ? controller.representante : undefined;
			//let codCondPagto      = controller.condicaopagamento;
			let canSave           = true;

			modalParams.paymentmeth['cod_esp_ped_vda'] = codEspPedVda;
			modalParams.paymentmeth['cod_ser_ped_vda'] = codSerPedVda;
			modalParams.paymentmeth['cod_portador'] = codPortador;
			modalParams.paymentmeth['cod_cart_bcia'] = codCartBcia;			
			modalParams.paymentmeth['cod_band'] = codBand;
			modalParams.paymentmeth['cod_emitente_acr'] = codEmitente;
			modalParams.paymentmeth['cod_repres'] = codRepres;
			//modalParams.paymentmeth['cod_cond_pagto'] = codCondPagto;


			// Valida se os campos foram preenchidos antes de mandar para o progress
			if(controller.descType == 'Boleto' || controller.descType == 'Transferência Bancária'){
				if(modalParams.paymentmeth['cod_esp_ped_vda'] === undefined){canSave = false;};
				if(modalParams.paymentmeth['cod_ser_ped_vda'] === undefined){canSave = false;};
				if(modalParams.paymentmeth['cod_portador'] === undefined){canSave = false;};
				if(modalParams.paymentmeth['cod_cart_bcia'] === undefined){canSave = false;};
				//if(modalParams.paymentmeth['cod_emitente_acr'] === undefined){canSave = false;};
				//if(modalParams.paymentmeth['cod_repres'] === undefined){canSave = false;};
				//if(modalParams.paymentmeth['cod_cond_pagto'] === undefined){canSave = false;};
			}else if(controller.descType == 'Cartão de Crédito'){
				modalParams.paymentmeth['cod_admdra_cartao_cr'] = codAdmdraCartaoCr['cod_admdra_cartao_cr'];
				if(modalParams.paymentmeth['cod_portador'] === undefined){canSave = false;};
				if(modalParams.paymentmeth['cod_cart_bcia'] === undefined){canSave = false;};
				if(modalParams.paymentmeth['cod_admdra_cartao_cr'] === undefined){canSave = false;};				
				//if(modalParams.paymentmeth['cod_repres'] === undefined){canSave = false;};
				//if(modalParams.paymentmeth['cod_cond_pagto'] === undefined){canSave = false;};
			}else{				
				if(modalParams.paymentmeth['cod_portador'] === undefined){canSave = false;};
				if(modalParams.paymentmeth['cod_cart_bcia'] === undefined){canSave = false;};
				//if(modalParams.paymentmeth['cod_emitente_acr'] === undefined){canSave = false;};
				//if(modalParams.paymentmeth['cod_repres'] === undefined){canSave = false;};
				//if(modalParams.paymentmeth['cod_cond_pagto'] === undefined){canSave = false;};			
			}

			// Verifica se os campos foram preenchidos antes de mandar para o progress
			if(!canSave){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-missing-fields')
				});
			}else{

				controller.paymentMethodRelationShip.push(modalParams.paymentmeth);

				paymentMethodsFactory.saveEditedRelationshipPaymentMethod(controller.paymentMethodRelationShip, function(response){
					if(!response.$hasError){
						$modalInstance.close({
							  newRelationShip: controller.element
						});
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-success'),
							detail: $rootScope.i18n('l-relationship-updated')
						});
						// Limpa objeto
						controller.paymentMethodRelationShip = [];
					}
				});

			}			
		}
		
		controller.close = function() {
			$modalInstance.dismiss('cancel');
		}
		
	}

	index.register.controller('paymentrelationship.edit.control', relationShipMethodsEditController);

});
