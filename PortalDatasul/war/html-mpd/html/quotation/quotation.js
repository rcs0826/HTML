/* global TOTVSEvent, angular*/
define(['index',

	// Genéricos
	'/dts/mpd/js/userpreference.js',
	'/dts/dts-utils/js/lodash-angular.js',
	'/dts/dts-utils/js/resizer.js',	
	'/dts/mpd/js/mpd-promise.js',
	'/dts/dts-utils/js/msg-utils.js',

	// Zoom
	'/dts/mpd/js/zoom/tb-preco-inter.js',
	'/dts/mpd/js/zoom/grup-estoque.js',
	'/dts/mpd/js/zoom/fam-comerc.js',	
	'/dts/mpd/js/zoom/tb-preco-pv.js',
	'/dts/mcc/js/zoom/tab-unidade.js',
	'/dts/mpd/js/zoom/modalidade-frete.js',
	'/dts/mpd/js/zoom/emitente.js',
	'/dts/mpd/js/zoom/moeda.js',
	'/dts/mpd/js/zoom/classif-fisc.js',
	'/dts/mpd/js/zoom/loc-entr.js',
	'/dts/mpd/js/zoom/estabelec.js',
	'/dts/mpd/js/zoom/tpoperacaoportal.js',
	'/dts/mpd/js/zoom/natur-oper.js',
	'/dts/mpd/js/zoom/tab-finan.js',
	'/dts/mpd/js/zoom/tab-finan-indice.js',
	'/dts/mpd/js/zoom/repres.js',
	'/dts/mpd/js/zoom/referencia.js',
	'/dts/mce/js/zoom/deposito.js',
	'/dts/mpd/js/zoom/canal-venda-pv.js',

	// Pedido HTML
	'/dts/mpd/js/portal-factories.js',
	'/dts/mpd/js/api/fchdis0051.js',
	'/dts/mpd/js/api/fchdis0063.js',
	'/dts/mpd/js/api/fchdis0067.js',
	'/dts/mpd/js/api/fchdis0035api.js',
	'/dts/mpd/js/api/fchdis0064.js',
	'/dts/mpd/js/api/fchdis0066.js',
	'/dts/mpd/html/quotation/itemSearch.js',
	'/dts/mpd/html/quotation/quotationItems.js',
	'/dts/mpd/html/quotation/quotationItem.js',
	'/dts/mpd/html/quotation/itemSearch.stock.js',
	'/dts/mpd/html/quotation/itemSearch.stock.params.js',
	'/dts/mpd/html/quotation/quotation.cancel.js',
	'/dts/mpd/html/quotation/quotation.confirm.js',
	'/dts/mpd/html/quotation/lastShopping.js',

	// MCF - Configurador de produtos
	'/dts/mcf/html/pendingproduct/pendingproduct-informConfiguration.js',
	'/dts/mcf/html/smartconfiguration/smartconfiguration-configuration.js',
	'/dts/mpd/js/api/cfapi004.js'
	], function (index) {

		index.stateProvider
			.state('dts/mpd/quotation', {
				abstract: true,
				template: '<ui-view/>'
			})
			.state('dts/mpd/quotation.start', {
				url: '/dts/mpd/quotation',
				controller: 'salesorder.quotation.controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/quotation/quotation.html'
			})
			.state('dts/mpd/quotation.edit', {
				url: '/dts/mpd/quotation/:quotationId/edit?modelId',
				controller: 'salesorder.quotation.controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/quotation/quotation.html'
			})
			.state('dts/mpd/quotation.new', {
				url: '/dts/mpd/quotation/new/:codEmit',
				controller: 'salesorder.quotation.controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/quotation/quotation.html'
			});

		QuotationController.$inject = ['$rootScope', '$scope', '$location', '$filter', '$stateParams', 'totvs.app-main-view.Service', 'salesorder.salesorders.Factory', 'portal.getUserData.factory', '$window', '$timeout', 'customization.generic.Factory', 'TOTVSEvent', 'mpd.fchdis0035.factory', 'mpd.fchdis0067.Factory', 'mpd.fchdis0064.Factory', 'mpd.fchdis0063.Factory', 'mpd.fchdis0066.Factory', '$modal', 'dts-utils.Resize.Service', '$http', 'quotation.quotations.Factory', 'salesorder.message.Factory', '$injector'];
		function QuotationController($rootScope, $scope, $location, $filter, $stateParams, appViewService, orderResource, userData, $window, $timeout, customService, TOTVSEvent, fchdis0035, fchdis0067, fchdis0064, fchdis0063, fchdis0066, $modal, resizeService, $http, quotationsResource, userMessages, $injector) {
			
			var quotationController = this;
			var i18n = $filter('i18n');
			var date = $filter('date');

			$scope.quotationController = quotationController;

			this.quotationId = 0;
			this.codEmit = 0;
			this.isLead = false;
			this.changeEstab = false;
			this.orderSource;
			this.currentUserRoles = [];
			this.newCustOrderNo = '';
			this.showNrPedcli = false;
			this.disabledNrPedcli = false;
			this.showSelectModel = false;
			this.showEstimatedWeightMet = false;
			this.showTotalWeight = false;
			this.selectedOrderModel = null;
			this.selectedOrderModelId = 0;
			this.isRepresentative = false;
			this.isCustomer = false;
			this.newQuotationHeader = true;
			this.openHeader = true
			this.openSearchItems = false;
			this.openOrderItems = false;
			this.canOrderCommit = false;
			this.viewName = null;
			this.orderItens = [];
			this.pedVendaCadastroVisibleFields = [];
			this.pesquisaVisibleFields = [];
			this.opcoesMenuVendasVisibleFields = [];
			this.calculateRequired = false;
			this.editablePrice = false;
			this.validateDate = null;
			this.loadindfinan = true;
			this.changeProspectState= false;
			this.modelItems = [];
			this.modelItemsToAdd = [];
			this.loadModelCompleted = false;
			this.messages = [];
            this.showBtnReopen = false;

			if ($injector.has('totvs.app-bussiness-Contexts.Service')) {
				quotationController.bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');
			};			

			$scope.$on("salesorder.portal.loaditems", function (event, data) {
				quotationController.getOrderAndItems(data);
			})

			$scope.$on("salesorder.portal.calculaterequired", function (event, required) {
				quotationController.calculateRequired = required;
			})

			$scope.$on("salesorder.portal.loadorder", function (event, data) {
				if (data != "reloadOrder") {
					quotationController.getOrderAndItems();
				}
			})

			this.destinosMercadoria = [
				{ codDesMerc: 0, descDesMerc: i18n('l-select') },
				{ codDesMerc: 1, descDesMerc: i18n('l-comercio-industria') },
				{ codDesMerc: 2, descDesMerc: i18n('l-consumo-proprio-ativo') }
			];

			this.especiePedido = [
				{ espPed: 1, descEspPed: i18n('l-pedido-simples') },
				{ espPed: 2, descEspPed: i18n('l-pedido-programacao') }
			];

			this.tipoPreco = [
				{ tpPreco: 1, descTpPreco: i18n('l-tipo-preco-1') },
				{ tpPreco: 2, descTpPreco: i18n('l-tipo-preco-2') },
				{ tpPreco: 3, descTpPreco: i18n('l-tipo-preco-3') }
			];

			this.setIndFinan = function(){
				this.order['nr-ind-finan'] = '';
			}

			this.getIndFinan = function() {
				if (this.loadindfinan){
					if (this.order['nr-ind-finan'] == undefined){
						this.order['nr-ind-finan'] = this.indfinan;
					}
					this.loadindfinan = false;
				}
			};

			this.applySelectRange = function ($event) {
				if ($event) {
					$event.target.setSelectionRange(0, 999);
				}
			}
			
			this.getMessages = function (displayLocalization) {
				return userMessages.getMessages(displayLocalization, function (dataMessages) {

					quotationController.messages = [];

					angular.forEach(dataMessages, function (value, key) {
						quotationController.messages.push(value['user-message']);
					});
				});
		    }

			this.changeProspect = function() {
				this.setChangeProspectState(true);
			}
			
			this.saveChangeProspect = function() {

				if(quotationController.codEmitenteToChange) {

					fchdis0066.changeCustomer({ nrPedido: quotationController.quotationId, codEmitente:  quotationController.codEmitenteToChange}, null , function (result) {
						if (!result.$hasError) {
							quotationController.getOrderAndItems();
							quotationController.setChangeProspectState(false)
						} else {
							quotationController.setChangeProspectState(true);
							quotationController.openHeader = true;
						}
					});

				} else {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-warning'),
						detail: $rootScope.i18n('msg-select-a-customer', [], 'dts/mpd/') + '.'
					});
				} 

			}
			

			this.setChangeProspectState = function(value) {
				this.changeProspectState = value
			}


			this.checkValidDateQuotation = function () {

				var today = new Date();
				today.setHours(0,0,0,0)
				var validade = new Date(quotationController.order['dt-validade-cot']);

				if (validade < today) {

					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
							title: 'l-quotation-validity',
							text: $rootScope.i18n('mgs-quotation-validity', [date(validade,'dd/MM/yyyy')], 'dts/mpd'),
							cancelLabel: 'l-no',
							confirmLabel: 'l-yes',
						callback: function(isPositiveResult) {
							if (isPositiveResult) {
								quotationController.openConfirmQuotationModal();
							}
						}
					});
				
				} else {
					quotationController.openConfirmQuotationModal();
				}

			}
			

			this.openConfirmQuotationModal = function () {
				var params = {};
				params = {
					order: quotationController.order,
					bussinessContexts: quotationController.bussinessContexts
				};

				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/quotation/quotation.confirm.html',
					controller: 'salesorder.portalQuotationConfirm.Controller as modalConfirmQuotationcontroller',
					size: 'lg',
					resolve: {
						modalParams: function () {
							return params;
						}
					}
				});

				modalInstance.result.then(function () {
					quotationController.getOrderAndItems();
				});
			};

			this.validatorNrPedCli = function () {
				if (quotationController.order['nr-pedcli']) {
					if (quotationController.order['nr-pedcli'].length > 12) {
						quotationController.order['nr-pedcli'] = quotationController.newCustOrderNoVal;
					} else {
						quotationController.newCustOrderNoVal = quotationController.order['nr-pedcli'];
					}
				}
			};

			this.customOrderNew = function () {
				result = customService.callCustomEvent('customOrderNew', { controller: controller });
			};

			this.getHeader = function () {

				var params = {
					nrPedido: quotationController.quotationId,
					codEmit: quotationController.codEmit,
					idiModel: quotationController.selectedOrderModelId,
					nrPedcli: quotationController.nrPedcli,
					isLead: quotationController.isLead
				};

				fchdis0066.getNewOrder(params, function (data) {
					quotationController.order = data.ttOrderPortal[0];

					quotationController.initializeWeight();

					if (quotationController.order['log-cotacao'] == true && quotationController.order['cod-id-prosp']) {
						quotationController.isLead = true;
					}

					angular.forEach(angular.element('input[autonumeric=""]'), function (value, key) {
						var a = angular.element(value);
						a.on('click', function () {
							if (!$window.getSelection().toString()) {
								// Required for mobile Safari
								this.setSelectionRange(0, this.value.length)
							}
						});
					});

					customService.callCustomEvent('afterGetNewOrder', { controller: quotationController });
				});
			}

			this.getDefaultHeader = function () {

				var params = {
					nrPedido: quotationController.quotationId,
					isLead: quotationController.isLead
				};

				fchdis0067.getDefaultHeader(params, function (data) {
					quotationController.order = data.ttOrderPortal[0];
				})
			};


			this.inEditMode = function() {
				var url = $location.url();
				var modeEdit = false;

				if(url.indexOf('dts/mpd/quotation/' + $stateParams.quotationId + '/edit') !== -1) {
					modeEdit = true;
				}

				return modeEdit;
			}

			
			this.saveOrderHeader = function () {

				if(quotationController.inEditMode()){
					quotationController.saveQuotationHeaderService(false) 
				}else{
					if (!quotationController.selectedOrderModel && quotationController.selectModelRequired) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							title: $rootScope.i18n('l-warning'),
							detail: $rootScope.i18n('msg-select-quotation-model', [], 'dts/mpd/')
						});
					} else {
						quotationController.saveQuotationHeaderService(false) 
					}
				}
			};


			this.saveQuotationHeaderService = function() {
				fchdis0066.saveOrderHeader({ nrPedido: quotationController.quotationId }, quotationController.order, function (result) {
					if (!result.$hasError) {
						
						if($stateParams.quotationId){
						
							quotationController.setCalculateRequired(true);
							quotationController.getOrderAndItems();
							if (quotationController.selectedOrderModelId) {
								quotationController.getModelItens(quotationController.selectedOrderModelId, quotationController.order['nr-pedido'])
							}

						} else {
							if($stateParams.codEmit){
								quotationController.closeViewNewOrder($stateParams.codEmit);
							}
							$location.url('dts/mpd/quotation/' +  quotationController.quotationId + '/edit?modelId=' + quotationController.selectedOrderModelId);
						}

					} else {
						quotationController.openHeader = true;
					}
				});
			}

			this.closeViewNewOrder = function (codEmit) {

				var url = "/dts/mpd/quotation/new/" + codEmit;
				var views = appViewService.openViews;
				var i, len = views.length, view;

				for (i = 0; i < len; i += 1) {
					if (views[i].url === url) {
						view = views[i];
						break;
					}
				}

				if (view)
					appViewService.removeView(view);
		   };


			this.setEditablePrice = function () {		

				for (var i = quotationController.pesquisaVisibleFields.length - 1; i >= 0; i--) {
					if(quotationController.pesquisaVisibleFields[i]['fieldName'] == "permite-alterar-preco"){
						if(quotationController.order['tp-preco'] == 1){
							quotationController.editablePrice = true;
							$scope.$broadcast("salesorder.portal.editableprice", quotationController.editablePrice);
						}
					}
				}
			}

			this.edit = function () {
				$window.scrollTo(0, 0);
				quotationController.openHeader = true;
			}

			this.applyLeaveOrder = function (field, oldvalue) {
				quotationController.changeEstab = oldvalue;

				if (oldvalue) {
					fchdis0064.leaveOrder({ nrPedido: quotationController.order['nr-pedido'], leaveField: field }, quotationController.order, function (result) {
						quotationController.order = result[0];
					});
				}
			};

			this.setModalidade = function (selected) {
				quotationController.order['modalidade'] = selected['modalidade'];
			}

			this.openSelectModel = function () {

				var params = { newHeader: quotationController.newQuotationHeader };

				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/quotation/selectModel.html',
					controller: 'salesorder.quotation.selectModel.controller as controller',
					size: 'lg',
					resolve: {
						model: function () { },
						parameters: function () { return params; }
					}
				});

				modalInstance.result.then(function (data) {
					quotationController.selectedOrderModel = data;
					quotationController.selectedOrderModelId = quotationController.selectedOrderModel['idi-model'];

					if (quotationController.newQuotationHeader) {
						quotationController.getHeader();
					} else {
						quotationController.getModelForCreatedQuotation(quotationController.selectedOrderModelId, quotationController.order['nr-pedido']);
					}
				});
			}

			this.removeSelectedModel = function () {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-order-models',
					text: $rootScope.i18n('l-remove-order-model'),
					cancelLabel: 'l-no',
					confirmLabel: 'l-yes',
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							quotationController.selectSearchItemsTab('searchAllItems');

							setTimeout(function () {

								quotationController.selectedOrderModel = null;
								quotationController.selectedOrderModelId = 0;

								if (quotationController.selectModelRequired && quotationController.showSelectModel) {
									quotationController.order = null;
									quotationController.openSelectModel();
									quotationController.initializeWeight();
								} else {
									if (quotationController.newQuotationHeader) {
										quotationController.getHeader();
									} else {
										quotationController.getDefaultHeader();
									}
								}

							}, 100);
						}
					}
				});
			}
			
			this.openMessages = function () {
				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/order2/messages.html',
					controller: 'salesorder.order2.messages.controller as controller',
					size: 'lg',
					resolve: {
						modalParams: function () {
							return { messages: quotationController.messages }
						}
					}
				});

				modalInstance.result.then(function (data) { });
			}

			this.initializeWeight = function () {
				quotationController.order['pesoTotalAtendido'] = "0";
				quotationController.order['pesoTotalNaoAtendido'] = "0";
				quotationController.order['pesoTotal'] = "0";
			}

			this.returnOrderWeight = function () {
				//PESO DO PEDIDO
				orderResource.orderItemsWeight({ nrPedido: quotationController.quotationId }, function (orderweight) {
					angular.forEach(orderweight, function (row) {
						switch (row['campo']) {
							case 'pesoTotalAtendido':
								quotationController.order['pesoTotalAtendido'] = row.valor;
								break;
							case 'pesoTotalNaoAtendido':
								quotationController.order['pesoTotalNaoAtendido'] = row.valor;
								break;
							case 'pesoTotal':
								quotationController.order['pesoTotal'] = row.valor;
								break;
						}
					});
				});
			}

			this.checkOrderEnable = function () {

				quotationController.openHeader = false;

				if (quotationController.orderItens.length <= 0) {
					quotationController.openSearchItems = true;
				}

				quotationController.canOrderCommit = false;

				if (quotationController.order['data-1'] == null || quotationController.order['cod-sit-ped'] == 3 || quotationController.order['cod-sit-ped'] == 4 || quotationController.order['cod-sit-ped'] == 5 || quotationController.order['cod-sit-ped'] == 6 || quotationController.order['cod-sit-ped'] == 7 || quotationController.order['dt-cancela'] != null) {
					quotationController.canOrderCommit = false;
					quotationController.orderDisabled = true;

				} else {

					if (quotationController.order['data-1'] && quotationController.orderItens.length > 0 && !quotationController.order['completo'] && quotationController.order['vl-tot-ped'] > 0) {
						quotationController.canOrderCommit = true;
					} else {
						quotationController.canOrderCommit = false;
					}

					quotationController.orderDisabled = false;
				}

				quotationController.newQuotationHeader = false;

			};

			this.getOrderAndItems = function (callback) {

				fchdis0064.getOrder({ nrPedido: quotationController.quotationId }, function (result) {

					quotationController.order = result.ttOrderPortal[0];

					quotationController.quotationId = quotationController.order['nr-pedido'];
					quotationController.codEmit = quotationController.order['cod-emitente'];
					
					quotationController.orderItens   = result.ttOrderItemPortal;
					quotationController.ttParamBonif = result.ttParamBonif;

					quotationController.setEditablePrice();

					if (quotationController.orderItens.length > 0) {
						quotationController.openOrderItems = true;
					}

					// cotacao lead
					if (quotationController.order['log-cotacao'] == true && quotationController.order['cod-id-prosp']) {
						quotationController.isLead = true;
					}

					//PESO DO PEDIDO - inicialização do pedido
					quotationController.returnOrderWeight();

					// chamada de ponto de customização
					customService.callCustomEvent('afterLoadOrder', { controller: quotationController });
					customService.callCustomEvent('onEditOrderItem', { controller: quotationController });

					for (var i = quotationController.orderItens.length - 1; i >= 0; i--) {
						if (quotationController.orderItens[i]['ind-componen'] == 3) {
							quotationController.orderItens[i].showChildren = quotationController.showChild;
						} else {
							quotationController.orderItens[i].showChildren = true;
						}
					}

					quotationController.userMessagesData = quotationController.order.customerMessages.split("-|-");
					if (quotationController.userMessagesData.length > 0) {
						quotationController.userMessagesData = quotationController.userMessagesData.slice(1);
					}

					quotationController.checkOrderEnable();

					if (quotationController.bussinessContexts && quotationController.bussinessContexts.getContextData('selected.sales.order')) {

						if (quotationController.bussinessContexts && quotationController.bussinessContexts.getContextData('selected.sales.order').complete) {
							var simpleOrderItemFromShoppingCart = quotationController.bussinessContexts.getContextData('selected.sales.order').simpleOrderItems;
	
							if (simpleOrderItemFromShoppingCart.length) {
	
								quotationController.itensToAddShoppingCart = new Array();
								quotationController.validedItensToQuotation = new Array();
	
								for (var i = 0; i < simpleOrderItemFromShoppingCart.length; i++) {
									var objItem = angular.copy(simpleOrderItemFromShoppingCart[i]);
	
									if (objItem['qt-un-fat'] > 0) {
										quotationController.itensToAddShoppingCart.push(objItem);
									}
								}
	
								if (quotationController.itensToAddShoppingCart.length) {
									for (var i = 0; i < quotationController.itensToAddShoppingCart.length; i++) {
										quotationController.itensToAddShoppingCart[i].orderArray = i + 1;
										quotationController.addItemFromShoppingCart(quotationController.itensToAddShoppingCart[i], quotationController.itensToAddShoppingCart.length);
									}
								}
	
							}

							quotationController.createShoppingCartToOrder();
						}
	
					} else {
						quotationController.createShoppingCartToOrder();
					}
	
					


					if (quotationController.orderSource === 23 && callback != undefined) {
						callback();
						quotationController.appSource = true;
					}

					$timeout(function () {
						$scope.$broadcast("salesorder.portal.loadorder", "reloadOrder");
					}, 500);

				});
			};

			this.calculateQuotation = function () {

				if (quotationController.orderItens.length > 0) {
					

					fchdis0064.recalculateOrder({ nrPedido: quotationController.order['nr-pedido'] }, function (result) {
						if (!result.$hasError) {
							quotationController.setCalculateRequired(false);
							quotationController.getOrderAndItems();
						} else {
							quotationController.openHeader = true;
						}
					});

				} else {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						title: $rootScope.i18n('l-warning'),
						detail: $rootScope.i18n('msg-add-items-to-quotation'),
						type: 'warning',
					});
				}
			}

			this.changeSize = function () {
				quotationController.fullSize = !quotationController.fullSize;
				resizeService.doResize();
			}

			this.selectSearchItemsTab = function (page) {
				resizeService.doResize();

				if (page) {
					quotationController.changeTab(page);
					$scope.$broadcast("salesorder.portal.selectview", page);
				}
			};

			this.changeTab = function (tab) {
				quotationController.activeTab = {}; // reset
				quotationController.activeTab[tab] = true


				if (tab === 'recentShopping') {
					$scope.$broadcast("salesorder.portal.lastshopping", tab);
				}

			}


			this.getModelForCreatedQuotation = function (ModelId, OrderNumber) {
				fchdis0066.getModelForCreatedQuotation({ idiModel: ModelId, nrPedido: OrderNumber }, function (result) {
					if (!result.$hasError) {
						quotationController.order = result.ttOrderPortal[0];
						quotationController.getModelItens(ModelId, quotationController.order['nr-pedido']);
					}
				});
			}

			
			this.getModelItens = function (ModelId, OrderNumber) {

				quotationController.modelItems = [];

				if (quotationController.selectedOrderModelId > 0) {

					fchdis0063.getModelItens({ idModel: ModelId, nrPedido: OrderNumber }, function (result) {

						if (!result.$hasError) {

							var resultModelItens = result.ttOrderItemSearch;
							quotationController.selectedOrderModel = result.ttOrderModel[0];

							if (resultModelItens.length > 0) {
								quotationController.modelItems = resultModelItens;
								quotationController.modelItemsFiltered = resultModelItens;
								quotationController.selectSearchItemsTab('templateItems');
							} else {
								quotationController.selectSearchItemsTab('searchAllItems');
							}
	
							if(quotationController.modelItemsFiltered){
								for (var i = 0; i < quotationController.modelItemsFiltered.length; i++) {
									if (quotationController.modelItemsFiltered[i]['qt-un-fat'] > 0) {
										quotationController.leaveModelItemField(quotationController.modelItemsFiltered[i], 'qt-un-fat')
									}
								}
							}

							quotationController.loadModelCompleted = true;
						}

					});
				}
			}

			

			this.leaveModelItemField = function (item, fieldName) {

				var ttOrderParameters = quotationController.orderParameters;

				if (!item['nr-sequencia'] > 0) {

					$timeout(function () {
						fchdis0067.startAddItem({
							nrPedido: quotationController.order['nr-pedido'],
							itemCode: item['it-codigo'],
							field: fieldName
						}, {
							ttOrderParameters: ttOrderParameters,
							ttOrderItemSearch: item
						}, function (result) {
							customService.callCustomEvent("startAddModelItemQuotation", {
								controller: quotationController,
								result: result
							});

							var imageValue = item['nom-imagem'];
							var qtUnFat = item['qt-un-fat'];

							item = Object.assign(item, result.ttOrderItemSearch[0]);

							item['nom-imagem'] = imageValue;
							item['qt-un-fat'] = qtUnFat;

						});
					}, 250);

				} else {

					if (fieldName == "qt-un-fat" ||
						fieldName == "des-un-medida" ||
						fieldName == "log-usa-tabela-desconto" ||
						fieldName == "nr-tabpre" ||
						fieldName == "ct-codigo" ||
						fieldName == "nat-operacao" ||
						fieldName == "estab-atend-item" ||
						fieldName == "cod-entrega" ||
						fieldName == "dt-entrega") {

						fchdis0067.leaveOrderItem({
							nrPedido: quotationController.order['nr-pedido'],
							nrSeq: item['nr-sequencia'],
							itemCode: item['it-codigo'],
							fieldname: fieldName,
							action: "Add"
						}, {
							ttOrderItemPortalScreen: [item],
							ttOrderParameters: ttOrderParameters
						}, function (result) {
							customService.callCustomEvent("leaveQuotationModelItemSearch", {
								controller: quotationController,
								result: result
							});

							var imageValue = item['nom-imagem'];
							var qtUnFat = item['qt-un-fat'];

							item = Object.assign(item, result.ttOrderItemPortalScreen[0]);

							item['nom-imagem'] = imageValue;
							item['qt-un-fat'] = qtUnFat;

						});
					}
				}
			}


			this.addModelItems = function (gotoitems) {
				var ttOrderParameters = quotationController.orderParameters;

				quotationController.modelItemsToAdd = new Array();

				var lista = quotationController.modelItemsFiltered;

				var countItemToAdd = 0;
				angular.forEach(lista, function (item) {

					if (item['qt-un-fat'] > 0) {
						quotationController.modelItemsToAdd.push(item);
						countItemToAdd = countItemToAdd + 1;
					}
				});
				if (quotationController.modelItemsFiltered.length > 0) {
					if (countItemToAdd == 0) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, [{ 
							type: 'warning', 
							title: $rootScope.i18n('l-items'),
							detail: $rootScope.i18n('l-enter-quantity-2')
					    }]);
					}
				} else {
					$rootScope.$broadcast(TOTVSEvent.showNotification, [{ 
						type: 'warning', 
						title: $rootScope.i18n('l-items'),
					    detail: $rootScope.i18n('l-perfom-search-quotation')
					}]);
				}

				quotationController.customLoading = false;

				if (quotationController.modelItemsToAdd.length) {

					$timeout(function () {

						fchdis0067.validateOrderItem(
							{
								nrPedido: quotationController.nrPedido
							},
							{
								ttOrderParameters: ttOrderParameters,
								dsOrderItemSearch: {
									ttOrderItemSearch: quotationController.modelItemsToAdd
								}
							},
							function (resultitems) {
								customService.callCustomEvent("validateQuotationItem", {
									controller: quotationController,
									result: resultitems
								});

								for (var i = 0; i < quotationController.modelItemsFiltered.length; i++) {
									quotationController.modelItemsFiltered[i]["qt-un-fat"] = 0;
									quotationController.modelItemsFiltered[i]["qt-un-fat"] = 0;
								}

								if (!resultitems.$hasError) {
									if (resultitems.ttOrderItemSearch.length > 0) {
										fchdis0067.addOrderItem({
											nrPedido: quotationController.order['nr-pedido']
										}, {
											ttOrderItemSearch: resultitems.ttOrderItemSearch,
											ttOrderParameters: ttOrderParameters,
										}, function (result) {
											customService.callCustomEvent("addOrderItem", {
												controller: quotationController,
												result: result
											});
											if (!result.$hasError) {
												quotationController.reloadFromModelItems(gotoitems);
											}
										});
									}
								}
							}
						);
					}, 250);
				}
			};

			this.addModelItemsWithTimeOut = function (gotoitems) {

				quotationController.customLoading = true;

				$timeout(function () {
					if ($http.pendingRequests.length === 0) {
						quotationController.addModelItems(gotoitems);
					} else {
						quotationController.quickSearchText = '';
						quotationController.addModelItemsWithTimeOut(gotoitems);
					}
				}, 250);
			}


			this.reloadFromModelItems = function (gotoitems) {

				$scope.$emit("salesorder.portal.loaditems", gotoitems);

				if (!gotoitems) {
					quotationController.setFocusSearchModelItem();
					$rootScope.$broadcast(TOTVSEvent.showNotification, [{ 
						type: 'info', 
						title: $rootScope.i18n('l-items'),
						detail: $rootScope.i18n('l-added-to-quotation')
					}]);
				}
			};


			this.setFocusSearchModelItem = function () {
				var searchModelItemEl = document.getElementById('searchModelItemField');
				var angularEl = angular.element(searchModelItemEl);
				angularEl.focus();
			}

			this.searchTemplateItems = function () {

				quotationController.modelItemsFiltered = [];

				if (!quotationController.quickSearchTemplateItems) {
					quotationController.quickSearchTemplateItems = "";
				}

				if (quotationController.quickSearchTemplateItems.length > 0) {
					quotationController.models = [];

					var hasCode = false;
					var hasDesc = false;

					angular.forEach(quotationController.modelItems, function (item, index) {
						hasCode = false;
						hasDesc = false;

						if (item['it-codigo'].toLowerCase().indexOf(quotationController.quickSearchTemplateItems.toLowerCase()) !== -1) {
							hasCode = true;
						}

						if (item['desc-item'].toLowerCase().indexOf(quotationController.quickSearchTemplateItems.toLowerCase()) !== -1) {
							hasDesc = true;
						}

						if (hasCode || hasDesc) {
							quotationController.modelItemsFiltered.push(item);
						}
					});

				} else {
					quotationController.modelItemsFiltered = angular.copy(quotationController.modelItems);
				}
			};


			this.openCancelModal = function () {
				var params = {};
				params = {
					tipo: "quotation",
					nrPedido: quotationController.quotationId,
					orderParameters: quotationController.orderParameters
				};

				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/quotation/quotation.cancel.html',
					controller: 'salesorder.portalQuotationCancel.Controller as modalCancelcontroller',
					size: 'lg',
					resolve: {
						modalParams: function () {
							return params;
						}
					}
				});

				modalInstance.result.then(function () {
					quotationController.getOrderAndItems();
				});
			};

			this.print = function () {
				quotationsResource.getPrintUrl(quotationController.quotationId, function(url) {
					$window.open(url);
				});
			};

			this.processOrder = function (isQuotation) {
				fchdis0064.processOrder({ nrPedido: quotationController.quotationId }, {}, function (result) {
					if (result['hasError'] == false) {
						if (isQuotation && isQuotation === true) {
							$rootScope.$broadcast(TOTVSEvent.showMessage, {
								title: $rootScope.i18n('l-success'),
								text: $rootScope.i18n('l-msg-release-quotation', [quotationController.quotationId], 'dts/mpd')
							});
						} else {
							$rootScope.$broadcast(TOTVSEvent.showMessage, {
								title: $rootScope.i18n('l-success'),
								text: $rootScope.i18n('l-msg-release-order', [quotationController.quotationId], 'dts/mpd')
							});
						}

						if (quotationController.bussinessContexts) {
							if(quotationController.bussinessContexts.getContextData('selected.sales.order').orderId == quotationController.quotationId) {
								quotationController.bussinessContexts.removeContext('selected.sales.order');
							}
						}

						quotationController.getOrderAndItems();
					}
				});
			};

			this.setCalculateRequired = function(required){
				quotationController.calculateRequired = required;
			}

			this.closeViewNewQuotation = function (codEmit) {

				var url = "/dts/mpd/quotation/new/" + codEmit;
				var views = appViewService.openViews;
				var i, len = views.length, view;

				for (i = 0; i < len; i += 1) {
					if (views[i].url === url) {
						view = views[i];
						break;
					}
				}

				if (view)
					appViewService.removeView(view);
		   };


		   this.reopenQuotation = function(){
				fchdis0066.reopenQuotation(
					{
						nrPedido: quotationController.quotationId,
					}, null , function(data) {
						customService.callCustomEvent("reopenQuotation", {
							controller:quotationController,
							result: data 
						});

						if (!data.$hasError) {
							quotationController.getOrderAndItems();
						}
					}
				);
			}


			this.addItemFromShoppingCart = function(paramItemToAdd, itemQuantity) {
				var paramItemToAddArray = [];

				quotationController.completeAdd = false;
				paramItemToAddArray.push(paramItemToAdd);
	
				 $timeout(function() {
					 fchdis0067.startAddItemCountRequest({
						nrPedido: quotationController.order['nr-pedido'],
						itemCode: paramItemToAdd['it-codigo'],
						field: 'qt-un-fat'
					}, {
						ttOrderItemSearch: paramItemToAddArray
					}, function(result) {
						result.ttOrderItemSearch[0].orderArray = paramItemToAdd.orderArray;
						quotationController.validedItensToQuotation.push(result.ttOrderItemSearch[0]);
	
						if(!quotationController.completeAdd) {
							quotationController.addItemFromShoppingCartToQuotationWithTimeout(quotationController.validedItensToQuotation);
						}
	
					});
				}, 100);
	
			};
	
			this.addItemFromShoppingCartToQuotationWithTimeout = function(arrayItemsToQuotation) {
	
				 $timeout(function() {
					if ($http.pendingRequests.length === 0) {
						quotationController.completeAdd = true;
						quotationController.addItemFromShoppingCartToQuotation(arrayItemsToQuotation);
					} else {
						if (!quotationController.completeAdd) {
							quotationController.addItemFromShoppingCartToQuotationWithTimeout(arrayItemsToQuotation);
						}	
					}
				}, 250);
			}
	
			
			this.addItemFromShoppingCartToQuotation = function(arrayItems) {
	
				if (arrayItems.length > 0) {
					var arrayItemsToQuotation = angular.copy(arrayItems.sort(function(a, b){return a.orderArray - b.orderArray}));
					fchdis0067.addOrderItem({
						nrPedido: quotationController.order['nr-pedido']
					}, {
						ttOrderItemSearch: arrayItemsToQuotation,
						ttOrderParameters: quotationController.orderParameters,
					}, function(result) {
						quotationController.reloadFromShoppingCart(arrayItemsToQuotation.length, result)
					});
				}
				
			}
	
			this.reloadFromShoppingCart = function(itemQuantity, result) {
	
				$scope.$emit("salesorder.portal.loaditems", false);
	
				var messageItem = "";
	
				if (itemQuantity > 1) {
					messageItem = $rootScope.i18n('l-added-items-from-shopping-cart-to-order');
				} else {
					messageItem = $rootScope.i18n('l-added-item-from-shopping-cart-to-order');
				}
	
				if (!result.$hasError) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, [{
						type: 'info',
						title: $rootScope.i18n('l-items'),
						detail: messageItem
					}]);
				}	
	
			};
	
			this.createShoppingCartToOrder = function () {
	
				var urlAddItem = "";
				var showPriceListOption = false;
				var cartOptions = [];

				if (quotationController.isRepresentative) {
					for (var i = 0; i < quotationController.opcoesMenuVendasVisibleFields.length; i++) {
						if (quotationController.opcoesMenuVendasVisibleFields[i]['fieldName'] === 'pesquisa-tab-pre') {
							showPriceListOption = quotationController.opcoesMenuVendasVisibleFields[i]['fieldEnabled'];
						}
					}
				}
	
				if (quotationController.isCustomer) {
					for (var i = 0; i < quotationController.opcoesMenuVendasVisibleFields.length; i++) {
						if (quotationController.opcoesMenuVendasVisibleFields[i]['fieldName'] === 'preco-item') {
							showPriceListOption = quotationController.opcoesMenuVendasVisibleFields[i]['fieldEnabled'];
						}
					}
				}
	
				if(showPriceListOption){ 
					if (quotationController.isRepresentative) {
						urlAddItem = '/dts/mpd/prices';
					} else if (quotationController.isCustomer) {
						urlAddItem = '/dts/mpd/priceItem/0';
					} else {
						urlAddItem = '/dts/mpd/prices';
					}
				}
	
				if (quotationController.bussinessContexts) {
	
					if (!quotationController.orderDisabled) {
						var dataContext = null;
						if (quotationController.bussinessContexts.getContextData('selected.sales.order')) {
							dataContext = quotationController.bussinessContexts.getContextData('selected.sales.order');
							dataContext.simpleOrderItems.length = 0; //Remove o objeto controller.simpleOrderItemsToNewOrder da tela priceItem
							dataContext.complete = false;
							dataContext.orderId = quotationController.order['nr-pedido'];
							dataContext.order2 = false;
							dataContext.isQuotation = true;
							dataContext.shoppingCartActionAdd = quotationController.newQuotationHeader;
							dataContext.order2CustomerId = quotationController.codEmit;
							dataContext.order2modelId = quotationController.selectedOrderModelId;
						} else {
							dataContext = { complete: false, orderId: quotationController.order['nr-pedido'], simpleOrderItems: [], order2: false, isQuotation: true, shoppingCartActionAdd: quotationController.newQuotationHeader, order2CustomerId: quotationController.codEmit, order2modelId: quotationController.selectedOrderModelId };
						}

						cartOptions =  [];

						if(showPriceListOption == true) {
							cartOptions.push({
								name: i18n('l-item-list'),
								icon: 'glyphicon-list',
								click: function () {
									var url = $location.url();
									if(url.indexOf('dts/mpd/prices') !== -1) {
										$rootScope.$broadcast(TOTVSEvent.showNotification, {
											type:   'warning',
											title:  $rootScope.i18n('l-warning', [], 'dts/mpd'),
											detail: $rootScope.i18n('l-select-a-price-table', [], 'dts/mpd')
										});
									} else {
										$location.url(urlAddItem);
									}
								}
							});
						}

						cartOptions.push({
							name: $rootScope.i18n('l-remove-shopping-cart') + ' (' + quotationController.order['nr-pedido'] + ')',
							icon: 'glyphicon-remove',
							click: function () {
								quotationController.bussinessContexts.removeContext('selected.sales.order');
							}
						});
	
						quotationController.bussinessContexts.setContext('selected.sales.order',
							$rootScope.i18n('l-quotation') + ' ' + quotationController.order['nr-pedido'] + ' (' + 0 + ' ' + $rootScope.i18n('l-items-qtd') + ')',
							'glyphicon-shopping-cart',
							cartOptions,
							dataContext);
					} else {
						quotationController.bussinessContexts.removeContext('selected.sales.order');
					}
	
				}
			};


			this.init = function (loadData) {

				quotationController.loadModelCompleted = false;

				var paramVisibleFieldsCad = { cTable: "cotac-ped-venda-cadastro" };
				var paramVisibleFieldsPesquisa = { cTable: "pesquisa" };
				var paramVisibleFieldsPedItemLista = { cTable: "cotac-ped-item-lista" };
				var paramVisibleFieldsResumo = { cTable: "cotac-ped-venda-resumo" };
				var paramVisibleFieldsItemCadastro = { cTable: "cotac-ped-item-cadastro" };
				var paramVisibleFieldsOpcoesMenuVendas = { cTable: "opcoes-menu-vendas" };

				if ($stateParams.codEmit) {
					quotationController.codEmit = $stateParams.codEmit;
				}

				fchdis0035.getUserRoles({ usuario: userData['user-name'] }, function (result) {
					quotationController.currentUserRoles = result.out.split(",");

					for (var i = quotationController.currentUserRoles.length - 1; i >= 0; i--) {
						if (quotationController.currentUserRoles[i] == "representative") {
							quotationController.isRepresentative = true;
						}

						if (quotationController.currentUserRoles[i] == "customer") {
							quotationController.isCustomer = true;
						}
					}

					if($stateParams.quotationId){

						fchdis0035.getVisibleFields(paramVisibleFieldsPesquisa, function (result) {
							quotationController.pesquisaVisibleFields = result;
						}, true, userData['user-name']);

						fchdis0035.getVisibleFields(paramVisibleFieldsItemCadastro, function (result) {
							quotationController.itemCadastroVisibleFields = result;
						}, true, userData['user-name']);

						fchdis0035.getVisibleFields(paramVisibleFieldsPedItemLista, function (result) {
							quotationController.pedItemListaVisibleFields = result;
						}, true, userData['user-name']);

						fchdis0035.getVisibleFields(paramVisibleFieldsOpcoesMenuVendas, function (result) {
							quotationController.opcoesMenuVendasVisibleFields = result;
						}, true, userData['user-name']);

						/*fchdis0035.getVisibleFields(paramVisibleFieldsResumo, function (result) {
							quotationController.pedVendaResumoVisibleFields = result;

							for (var i = 0; i < quotationController.pedVendaResumoVisibleFields.length; i++) {

								if (quotationController.pedVendaResumoVisibleFields[i]['fieldName'] == "btn-cancel") {
									quotationController.showButtonCancel = true;
								}
								if (quotationController.pedVendaResumoVisibleFields[i]['fieldName'] == "btn-simul" && quotationController.isRepresentative == true) {
									quotationController.enableFreightSimulation = true;
								}
								if (quotationController.pedVendaResumoVisibleFields[i]['fieldName'] == "btn-reopen-quotation" && quotationController.isRepresentative == true) {
									quotationController.showBtnReopen = true;
								}                                
                                
							}

						}, true, userData['user-name']);*/
					}	

					fchdis0035.getVisibleFields(paramVisibleFieldsCad, function (result) {
						
						quotationController.pedVendaCadastroVisibleFields = result;
						
						for (var i = 0; i < quotationController.pedVendaCadastroVisibleFields.length; i++) {
							
							if (quotationController.pedVendaCadastroVisibleFields[i]['fieldName'] === 'nr-pedcli') {
								quotationController.showNrPedcli = true;
								quotationController.disabledNrPedcli = !quotationController.pedVendaCadastroVisibleFields[i]['fieldEnabled'];
							}

							if (quotationController.pedVendaCadastroVisibleFields[i]['fieldName'] == "selecao-modelos") {
								quotationController.showSelectModel = true;
							}

							if (quotationController.pedVendaCadastroVisibleFields[i]['fieldName'] == "uso-modelo-obrigatorio") {
								quotationController.selectModelRequired = true;
							}

							if (quotationController.pedVendaCadastroVisibleFields[i]['fieldName'] == "peso-atendido") {
								quotationController.showEstimatedWeightMet = true;
							}

							if (quotationController.pedVendaCadastroVisibleFields[i]['fieldName'] == "total-peso") {
								quotationController.showTotalWeight = true;
							}

						}

						// Inicia nova cotação.
						if(!quotationController.quotationId){

							fchdis0064.newCopy({}, function (result) {
								quotationController.quotationId = result.nrPedido;
								quotationController.nrPedcli = result.nrPedido;

								if (quotationController.selectModelRequired && quotationController.showSelectModel) {
									quotationController.openSelectModel();
								} else {
									quotationController.getHeader();
								}
								
								quotationController.getMessages('quotation').then(function () {
									if (quotationController.messages.length > 0) {
										quotationController.openMessages();
									}
								});

							});

						}else{
							// Carrega pedido para cotação.
							quotationController.getOrderAndItems();

							if($stateParams.modelId && $stateParams.quotationId){

								quotationController.selectedOrderModelId = $stateParams.modelId;

								if (quotationController.selectedOrderModelId) {
									quotationController.getModelItens(quotationController.selectedOrderModelId, $stateParams.quotationId)
								}
							}
						}


					}, true, userData['user-name']);

				}, true);

			};

			if($stateParams.quotationId){
				quotationController.quotationId = $stateParams.quotationId;
						
				quotationController.viewName = $rootScope.i18n('l-quotations') + " " + quotationController.quotationId;

				if(quotationController.bussinessContexts.getContextData('selected.sales.order')) {
					if (quotationController.bussinessContexts.getContextData('selected.sales.order').orderId != undefined) {
						if(quotationController.bussinessContexts.getContextData('selected.sales.order').orderId != $stateParams.quotationId) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type:   'warning',
								title:  $rootScope.i18n('l-warning', [], 'dts/mpd'),
								detail: $rootScope.i18n(
									'l-quotation-diff-order-cart',
									[quotationController.bussinessContexts.getContextData('selected.sales.order').orderId],
									'dts/mpd'
								)
							});
						}
					}
				}

				if (appViewService.startView(quotationController.viewName, quotationController.controllerName, quotationController)) {
					quotationController.init(true);
				}else {
					quotationController.init(false);
				}

			} else {
				quotationController.viewName = $rootScope.i18n('l-new-quotation');

				if (appViewService.startView(quotationController.viewName, quotationController.controllerName, quotationController)) {
					quotationController.init(true);
				} else {
					quotationController.init(false);
				}

			}

			/******* events *****/
			$rootScope.$on('selectedRepresentatives', function(event) {
				if ($rootScope.selectedRepresentatives){
					quotationController.repres = " ";
					angular.forEach($rootScope.selectedRepresentatives, function (value) {
						quotationController.repres = quotationController.repres + value['cod-rep'] + '|';
					});
				}
			});


		}


		SelectModelController.$inject = ['$modalInstance', 'model', '$filter', 'salesorder.model.Factory', '$rootScope', 'TOTVSEvent', 'parameters'];

		function SelectModelController($modalInstance, model, $filter, modelResource, $rootScope, TOTVSEvent, parameters) {

			var controller = this;

			this.selectOrderModel = function (orderModel) {

				if (!controller.newHeader) {
					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: 'l-order-models',
						text: $rootScope.i18n('l-update-order-model'),
						cancelLabel: 'l-no',
						confirmLabel: 'l-yes',

						callback: function (isPositiveResult) {
							if (isPositiveResult) {
								$modalInstance.close(orderModel);
							}
						}
					});

				} else {
					$modalInstance.close(orderModel);
				}
			}

			this.close = function () {
				$modalInstance.dismiss();
			}

			this.loadModels = function () {
				modelResource.getModels({modelType: 2}, function (resultmodels) {

					controller.models = angular.copy(resultmodels);
					controller.startModels = angular.copy(resultmodels);

					angular.forEach(resultmodels, function (model, index) {
						if (model['log-favorito']) {
							controller.quickFilter['log-favorito'] = true;
						}
					});

				});

			};

			this.search = function () {
				if (!controller.quickSearchText) {
					controller.quickSearchText = "";
				}

				if (controller.quickSearchText.length > 0) {
					controller.models = [];

					var hasName = false;
					var hasDesc = false;

					angular.forEach(controller.startModels, function (model, index) {
						hasName = false;
						hasDesc = false;

						if (model['nom-model'].indexOf(controller.quickSearchText) !== -1) {
							hasName = true;
						}

						if (model['nom-desc'].indexOf(controller.quickSearchText) !== -1) {
							hasDesc = true;
						}

						if (hasName || hasDesc) {
							controller.models.push(model);
						}
					});

					if (controller.models.length == 0) {
						controller.models = angular.copy(controller.startModels);
					}

				} else {
					controller.models = angular.copy(controller.startModels);
				}
			};


			this.setFavoriteModel = function (idModel, logFavorito) {
				//Inverte estado da estrela
				if (logFavorito == true) {
					logFavorito = false;
				} else {
					logFavorito = true;
				}

				//Atualiza Favorito
				modelResource.favorite({ idiModel: idModel, favorite: logFavorito }, function (result) {
					angular.forEach(controller.models, function (model, index) {
						if (model['idi-model'] == idModel) {
							model['log-favorito'] = logFavorito;
						}
					});
				});
			};

			this.setQuickFilter = function (logFavorito) {
				if (logFavorito == false) {
					controller.quickFilter['log-favorito'] = undefined;
				}
				else {
					controller.quickFilter['log-favorito'] = logFavorito;
				}
			};

			var i18n = $filter('i18n');
			controller.tooltipfavorite = i18n('l-favorite-models');

			controller.models = {};
			controller.newHeader = parameters.newHeader;

			controller.quickFilter = { "nom-model": "", "nom-desc": "", "log-favorito": undefined };

			controller.loadModels();

		}

		MessagesController.$inject = ['$rootScope', '$modalInstance', '$location', 'modalParams', 'TOTVSEvent'];

		function MessagesController($rootScope, $modalInstance, $location, modalParams, TOTVSEvent) {

			var controller = this;

			controller.messages = modalParams.messages;

			this.close = function () {
				$modalInstance.dismiss();
			}

		}
		index.register.controller('salesorder.quotation.controller', QuotationController);
		index.register.controller('salesorder.quotation.selectModel.controller', SelectModelController);
		index.register.controller('salesorder.order2.messages.controller', MessagesController);
	});
