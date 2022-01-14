/* global TOTVSEvent, angular*/
define(['index',

	// Genéricos
	'/dts/mpd/html/dashboard/messages.js',
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
	'/dts/mpd/js/zoom/classif-fisc.js',
	'/dts/mpd/js/zoom/loc-entr.js',
	'/dts/mpd/js/zoom/estabelec.js',
	'/dts/mpd/js/zoom/tpoperacaoportal.js',
	'/dts/mpd/js/zoom/natur-oper.js',
	'/dts/mpd/js/zoom/referencia.js',
	'/dts/mpd/js/zoom/campanha.js',
	'/dts/mpd/js/zoom/unid-negoc.js',
	'/dts/mpd/js/zoom/canal-venda-pv.js'
	,
	// Pedido HTML
	'/dts/mpd/js/portal-factories.js',
	'/dts/mpd/js/api/fchdis0051.js',
	'/dts/mpd/js/api/fchdis0063.js',
	'/dts/mpd/js/api/fchdis0035api.js',
	'/dts/mpd/js/api/fchdis0064.js',
	'/dts/mpd/html/order2/itemSearch.js',
	'/dts/mpd/html/order2/orderItem.js',
	'/dts/mpd/html/order2/orderItems.js',
	'/dts/mpd/html/order2/itemSearch.stock.js',
	'/dts/mpd/html/order2/itemSearch.stock.params.js',
	'/dts/mpd/html/order2/order.cancel.js',
	'/dts/mpd/html/order2/lastShopping.js',
	'/dts/mpd/html/order2/orderFreight.js',

	// MCF - Configurador de produtos
	'/dts/mcf/html/pendingproduct/pendingproduct-informConfiguration.js',
	'/dts/mcf/html/smartconfiguration/smartconfiguration-configuration.js',
	'/dts/mpd/js/api/cfapi004.js'
], function (index) {

	index.stateProvider

		.state('dts/mpd/order', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/mpd/order.new', {
			url: '/dts/mpd/order2/new/:codEmit?isLead',
			controller: 'salesorder.order2.controller',
			controllerAs: 'controller',
			templateUrl: '/dts/mpd/html/order2/order.html'
		})
		.state('dts/mpd/order.edit', {
			url: '/dts/mpd/order2/:orderId/edit?modelId',
			controller: 'salesorder.order2.controller',
			controllerAs: 'controller',
			templateUrl: '/dts/mpd/html/order2/order.html'
		});


	order2Controller.$inject = [
		'$rootScope',
		'$scope',
		'$state',
		'$filter',
		'$stateParams',
		'totvs.app-main-view.Service',
		'salesorder.salesorders.Factory',
		'portal.getUserData.factory',
		'$window',
		'$timeout',
		'customization.generic.Factory',
		'TOTVSEvent',
		'mpd.fchdis0035.factory',
		'mpd.fchdis0063.Factory',
		'mpd.fchdis0064.Factory',
		'$modal',
		'dts-utils.Resize.Service',
		'salesorder.model.Factory',
		'salesorder.message.Factory',
		'$q',
		'userPreference',
		'$http',
		'$location',
		'$injector'];
	function order2Controller(
		$rootScope,
		$scope,
		$state,
		$filter,
		$stateParams,
		appViewService,
		orderResource,
		userData,
		$window,
		$timeout,
		customService,
		TOTVSEvent,
		fchdis0035,
		fchdis0063,
		fchdis0064,
		$modal,
		resizeService,
		modelResource,
		userMessages,
		$q,
		userPreference,
		$http,
		$location,
		$injector) {

		var orderController = this;

		$scope.orderController = orderController;

		var i18n = $filter('i18n');

		this.orderId = 0;
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
		this.selectModelRequired = false;
		this.selectedOrderModel = null;
		this.selectedOrderModelId = 0;
		this.isRepresentative = false;
		this.isCustomer = false;
		this.newOrderHeader = true;
		this.openHeader = true
		this.openSearchItems = false;
		this.openOrderItems = false;
		this.canOrderCommit = false;
		this.orderItens = [];
		this.pedVendaCadastroVisibleFields = [];
		this.pesquisaVisibleFields = [];
		this.itemCadastroVisibleFields = [];
		this.opcoesMenuVendasVisibleFields = [];
		this.messages = [];
		this.modelItems = [];
		this.modelItemsToAdd = [];
		this.calculateRequired = false;
		this.editablePrice = false;
		this.enableFreightSimulation = false;
		this.loadModelCompleted = false;
		this.newOrderInclusionFlow = false;
		this.lastRejectionReason = undefined;
		this.showRejectionReason = false;
		this.waitingCancellationProcess = undefined;

		if ($injector.has('totvs.app-bussiness-Contexts.Service')) {
			orderController.bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');
		};

		$scope.$on("salesorder.portal.loaditems", function (event, data) {
			orderController.getOrderAndItems(data);
		})

		$scope.$on("salesorder.portal.calculaterequired", function (event, required) {
			orderController.calculateRequired = required;
		})


		$scope.$on("salesorder.portal.loadorder", function (event, data) {
			if (data != "reloadOrder") {
				orderController.getOrderAndItems();
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


		this.applySelectRange = function ($event) {
			if ($event) {
				$event.target.setSelectionRange(0, 999);
			}
		}
		
		this.changeTpOper = function(){
			customService.callCustomEvent("changeTpOper", {
											controller: orderController
										});
			
		}


		this.getMessages = function (displayLocalization) {
			return userMessages.getMessages(displayLocalization, function (dataMessages) {

				orderController.messages = [];

				angular.forEach(dataMessages, function (value, key) {
					orderController.messages.push(value['user-message']);
				});
			});
		}


		this.validatorNrPedCli = function () {
			// Ajusta o problema de limpar o campo e tentar salvar o cabeçalho.
			if (orderController.order['nr-pedcli'] == undefined) {
				orderController.order['nr-pedcli'] = "";
			}

			if (orderController.order['nr-pedcli']) {
				if (orderController.order['nr-pedcli'].length > 12) {
					orderController.order['nr-pedcli'] = orderController.newCustOrderNoVal;
				} else {
					orderController.newCustOrderNoVal = orderController.order['nr-pedcli'];
				}
			}
		};


		this.customOrderNew = function () {
			result = customService.callCustomEvent('customOrderNew', { controller: controller });
		};


		this.getHeader = function () {

			var params = {
				nrPedido: orderController.orderId,
				codEmit: orderController.codEmit,
				idiModel: orderController.selectedOrderModelId,
				nrPedcli: orderController.nrPedcli,
				isLead: orderController.isLead
			};

			fchdis0064.getNewOrder(params, function (data) {
				orderController.order = data.ttOrderPortal[0];

				if (orderController.order) {

					orderController.initializeWeight();

					if (orderController.order['log-cotacao'] == true && orderController.order['cod-id-prosp']) {
						orderController.isLead = true;
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

					customService.callCustomEvent('afterGetNewOrder', { controller: orderController });

				}
			});
		}


		this.getDefaultHeader = function () {

			var params = {
				nrPedido: orderController.orderId,
				isLead: orderController.isLead
			};

			fchdis0064.getDefaultHeader(params, function (data) {
				orderController.order = data.ttOrderPortal[0];
			})
		};

		this.inEditMode = function() {
			var url = $location.url();
			var modeEdit = false;
			orderController.editMode = false;

			if(url.indexOf('dts/mpd/order2/' + $stateParams.orderId + '/edit') !== -1) {
				modeEdit = true;
				orderController.editMode = true;
			}

			return modeEdit;
		}


		this.saveOrderHeader = function () {
			if (!orderController.selectedOrderModel && orderController.selectModelRequired && !orderController.inEditMode()) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-warning'),
					detail: $rootScope.i18n('msg-select-order-model', [], 'dts/mpd/')
				});
			} else {

				var lEstabExclusivo = false;
				var isPositiveResult = undefined;

				fchdis0064.getOrderParam(function (ttPortalParam) {

					for (var i = 0; i < ttPortalParam.length; i++) {
						if (ttPortalParam[i]['cod-param'] == 'TrataEstabExclivo' && orderController.changeEstab) {
							lEstabExclusivo = true;
						}
					}

					if (lEstabExclusivo == true) {
						$rootScope.$broadcast(TOTVSEvent.showQuestion, {
							title: 'l-remove-order-title',
							text: $rootScope.i18n('l-remove-order-sanitize-text'),
							cancelLabel: 'l-no',
							confirmLabel: 'l-yes',
							callback: function (isPositiveResult) {
								orderController.saveOrderHeaderService(isPositiveResult)
							}
						});
					} else {
						orderController.saveOrderHeaderService(false)
					}
				});
			}
		};

		this.saveOrderHeaderService = function (isPositiveResult) {
			fchdis0064.saveOrderHeader({ nrPedido: orderController.orderId, lCentralSales: isPositiveResult }, orderController.order, function (result) {
				if (!result.$hasError) {

					if ($stateParams.orderId) {

						orderController.setCalculateRequired(true);
						orderController.getOrderAndItems();
						if (orderController.selectedOrderModelId) {
							orderController.getModelItens(orderController.selectedOrderModelId, orderController.order['nr-pedido'])
						}

					} else {
						if ($stateParams.codEmit) {
							orderController.closeViewNewOrder($stateParams.codEmit);
						}
						$location.url('dts/mpd/order2/' + orderController.orderId + '/edit?modelId=' + orderController.selectedOrderModelId);
					}

				} else {
					orderController.openHeader = true;
				}
			});
		}

		this.closeViewNewOrder = function (codEmit) {

			var url = "/dts/mpd/order2/new/" + codEmit;
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
			for (var i = orderController.pesquisaVisibleFields.length - 1; i >= 0; i--) {
				if (orderController.pesquisaVisibleFields[i]['fieldName'] == "permite-alterar-preco") {
					if (orderController.order['tp-preco'] == 1) {
						orderController.editablePrice = true;
						$scope.$broadcast("salesorder.portal.editableprice", orderController.editablePrice);
					}
				}
			}
		}


		this.edit = function () {
			$window.scrollTo(0, 0);
			orderController.openHeader = true;
		}


		this.applyLeaveOrder = function (field, oldvalue) {
			orderController.changeEstab = oldvalue;

			if (oldvalue) {
				fchdis0064.leaveOrder({ nrPedido: orderController.order['nr-pedido'], leaveField: field }, orderController.order, function (result) {
					orderController.order = result[0];

					/**
					 * Quando removido o valor de um input, o if abaixo não vai permitir que o valor fique undefined.
					 * Quando o valor fica undefined, a mensagem de validação quebra.
					 */
					if ('dt-implant' == field) { 
						if(orderController.order[field] == undefined) {
							orderController.order[field] = null;
							return;
						}
					}

					// Complemento do IF de cima.
					if (orderController.order[field] == undefined) {
						orderController.order[field] = "";
					}
				}, 500);
			}
		};


		this.setModalidade = function (selected) {
			orderController.order['modalidade'] = selected['modalidade'];
		}


		this.openSelectModel = function () {
			var params = { newHeader: orderController.newOrderHeader };

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/order2/selectModel.html',
				controller: 'salesorder.order2.selectModel.controller as controller',
				size: 'lg',
				resolve: {
					model: function () { },
					parameters: function () { return params; }
				}
			});

			modalInstance.result.then(function (data) {
				orderController.selectedOrderModel = data;
				orderController.selectedOrderModelId = orderController.selectedOrderModel['idi-model'];

				if (orderController.newOrderHeader) {
					orderController.getHeader();
				} else {

					var oderId = 0;
					if(orderController.order['nr-pedido']) {
						oderId = orderController.order['nr-pedido'];
					} else {
						oderId = $stateParams.orderId
					}	

					orderController.getModelForCreatedOrder(orderController.selectedOrderModelId, oderId);
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
						orderController.selectSearchItemsTab('searchAllItems');

						setTimeout(function () {

							orderController.selectedOrderModel = null;
							orderController.selectedOrderModelId = 0;

							if(!orderController.inEditMode()) {
								if (orderController.selectModelRequired && orderController.showSelectModel) {
									orderController.order = null;
									orderController.openSelectModel();
									orderController.initializeWeight();
								} else {
									if (orderController.newOrderHeader) {
										orderController.getHeader();
									} else {
										orderController.getDefaultHeader();
									}
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
						return { messages: orderController.messages }
					}
				}
			});

			modalInstance.result.then(function (data) { });
		}


		this.initializeWeight = function () {
			if (orderController.order) {
				orderController.order['pesoTotalAtendido'] = "0";
				orderController.order['pesoTotalNaoAtendido'] = "0";
				orderController.order['pesoTotal'] = "0";
			}
		}


		this.returnOrderWeight = function () {
			//PESO DO PEDIDO
			orderResource.orderItemsWeight({ nrPedido: orderController.orderId }, function (orderweight) {
				angular.forEach(orderweight, function (row) {
					switch (row['campo']) {
						case 'pesoTotalAtendido':
							orderController.order['pesoTotalAtendido'] = row.valor;
							break;
						case 'pesoTotalNaoAtendido':
							orderController.order['pesoTotalNaoAtendido'] = row.valor;
							break;
						case 'pesoTotal':
							orderController.order['pesoTotal'] = row.valor;
							break;
					}
				});
			});
		}


		this.checkOrderEnable = function () {

			orderController.openHeader = false;

			if (orderController.orderItens.length <= 0) {
				orderController.openSearchItems = true;
			}

			orderController.canOrderCommit = false;

			if (orderController.order['data-1'] == null || orderController.order['cod-sit-ped'] == 5 || orderController.order['cod-sit-ped'] == 6 || orderController.order['dt-cancela'] != null) {
				orderController.canOrderCommit = false;
				orderController.orderDisabled = true;

			} else {

				if (orderController.order['data-1'] && orderController.orderItens.length > 0 && !orderController.order['completo'] && orderController.order['vl-tot-ped'] > 0) {
					orderController.canOrderCommit = true;
				} else {
					orderController.canOrderCommit = false;
				}

				orderController.orderDisabled = false;
			}

			orderController.newOrderHeader = false;

		};


		this.getOrderAndItems = function (callback) {

			fchdis0064.getOrder({ nrPedido: orderController.orderId }, function (result) {

				orderController.order = result.ttOrderPortal[0];

				orderController.orderId = orderController.order['nr-pedido'];
				orderController.codEmit = orderController.order['cod-emitente'];

				orderController.orderItens = result.ttOrderItemPortal;
				orderController.ttParamBonif = result.ttParamBonif;

				orderController.setEditablePrice();

				if (orderController.orderItens.length > 0) {
					orderController.openOrderItems = true;
				}

				// cotacao lead
				if (orderController.order['log-cotacao'] == true && orderController.order['cod-id-prosp']) {
					orderController.isLead = true;
				}

				//PESO DO PEDIDO - inicialização do pedido
				orderController.returnOrderWeight();

				// chamada de ponto de customização
				customService.callCustomEvent('afterLoadOrder', { controller: orderController });
				customService.callCustomEvent('onEditOrderItem', { controller: orderController });
				//customService.callEvent ('salesorder.order', 'afterLoadOrder', {controller: controller});

				//orderController.showChild = true;

				for (var i = orderController.orderItens.length - 1; i >= 0; i--) {
					if (orderController.orderItens[i]['ind-componen'] == 3) {
						orderController.orderItens[i].showChildren = orderController.showChild;
					} else {
						orderController.orderItens[i].showChildren = true;
					}
				}

				orderController.userMessagesData = orderController.order.customerMessages.split("-|-");
				if (orderController.userMessagesData.length > 0) {
					orderController.userMessagesData = orderController.userMessagesData.slice(1);
				}

				orderController.checkOrderEnable();

				if (orderController.bussinessContexts && orderController.bussinessContexts.getContextData('selected.sales.order')) {

					if (orderController.bussinessContexts && orderController.bussinessContexts.getContextData('selected.sales.order').complete) {
						var simpleOrderItemFromShoppingCart = orderController.bussinessContexts.getContextData('selected.sales.order').simpleOrderItems;

						if (simpleOrderItemFromShoppingCart.length) {

							orderController.itensToAddShoppingCart = new Array();
							orderController.validedItensToOrder = new Array();

							for (var i = 0; i < simpleOrderItemFromShoppingCart.length; i++) {
								var objItem = angular.copy(simpleOrderItemFromShoppingCart[i]);

								if (objItem['qt-un-fat'] > 0) {
									orderController.itensToAddShoppingCart.push(objItem);
								}
							}

							if (orderController.itensToAddShoppingCart.length) {
								for (var i = 0; i < orderController.itensToAddShoppingCart.length; i++) {
									orderController.addItemFromShoppingCart(orderController.itensToAddShoppingCart[i], orderController.itensToAddShoppingCart.length);
								}
							}

						}

						orderController.createShoppingCartToOrder();
					}

				} else {
					orderController.createShoppingCartToOrder();	
				}


				if (orderController.orderSource === 23 && callback != undefined) {
					callback();
					orderController.appSource = true;
				}

				if (orderController.calculateRequired) {
					orderController.order['vl-tot-ped'] = 0;
				}

				if (!orderController.calculateRequired && !orderController.orderDisabled && orderController.canOrderCommit && !orderController.newOrderHeader && !orderController.openHeader) {
					orderController.calculateRequired = false;
				} else {
					orderController.calculateRequired = true;
				}

				orderController.waitingCancellationProcess = orderController.order['char-2'].substring(116,117);

				$timeout(function () {
					$scope.$broadcast("salesorder.portal.loadorder", "reloadOrder");
				}, 500);

				fchdis0064.getRejectionReason({ nrPedido: orderController.order['nr-pedido'] }, function (result) {
					orderController.lastRejectionReason = result.lastRejectionReason;
				});

			});
		};


		this.calculateOrder = function () {

			if (orderController.orderItens.length > 0) {


				fchdis0064.recalculateOrder({ nrPedido: orderController.order['nr-pedido'] }, function (result) {
					if (!result.$hasError) {
						orderController.setCalculateRequired(false);
						orderController.getOrderAndItems();
					} else {
						orderController.openHeader = true;
					}
				});

			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-warning'),
					detail: $rootScope.i18n('msg-add-items-to-order'),
					type: 'warning',
				});
			}
		}


		this.changeSize = function () {
			orderController.fullSize = !orderController.fullSize;
			resizeService.doResize();
		}


		this.selectSearchItemsTab = function (page) {
			resizeService.doResize();

			if (page) {
				orderController.changeTab(page);
				$scope.$broadcast("salesorder.portal.selectview", page);
			}
		};


		this.changeTab = function (tab) {
			orderController.activeTab = {}; // reset
			orderController.activeTab[tab] = true


			if (tab === 'recentShopping') {
				$scope.$broadcast("salesorder.portal.lastshopping", tab);
			}

		}


		this.getModelForCreatedOrder = function (ModelId, OrderNumber) {
			fchdis0064.getModelForCreatedOrder({ idiModel: ModelId, nrPedido: OrderNumber }, function (result) {
				if (!result.$hasError) {
					orderController.order = result.ttOrderPortal[0];
					orderController.getModelItens(ModelId, orderController.order['nr-pedido']);
				}
			});

		}


		this.getModelItens = function (ModelId, OrderNumber) {

			orderController.modelItems = [];

			if (orderController.selectedOrderModelId > 0) {

				fchdis0063.getModelItens({ idModel: ModelId, nrPedido: OrderNumber }, function (result) {

					if (!result.$hasError) {

						var resultModelItens = result.ttOrderItemSearch;
						orderController.selectedOrderModel = result.ttOrderModel[0];

						if (resultModelItens.length > 0) {
							orderController.modelItems = resultModelItens;
							orderController.modelItemsFiltered = resultModelItens;
							orderController.selectSearchItemsTab('templateItems');
						} else {
							orderController.selectSearchItemsTab('searchAllItems');
						}

						if (orderController.modelItemsFiltered) {
							for (var i = 0; i < orderController.modelItemsFiltered.length; i++) {
								if (orderController.modelItemsFiltered[i]['qt-un-fat'] > 0) {
									orderController.leaveModelItemField(orderController.modelItemsFiltered[i], 'qt-un-fat')
								}
							}
						}

						orderController.loadModelCompleted = true;
					}

				});
			}
		}


		this.leaveModelItemField = function (item, fieldName) {

			var ttOrderParameters = orderController.orderParameters;

			if (!item['nr-sequencia'] > 0) {

				$timeout(function () {
					fchdis0063.startAddItem({
						nrPedido: orderController.order['nr-pedido'],
						itemCode: item['it-codigo'],
						field: fieldName
					}, {
						ttOrderParameters: ttOrderParameters,
						ttOrderItemSearch: item
					}, function (result) {
						customService.callCustomEvent("startAddModelItem", {
							controller: orderController,
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

					fchdis0063.leaveOrderItem({
						nrPedido: orderController.order['nr-pedido'],
						nrSeq: item['nr-sequencia'],
						itemCode: item['it-codigo'],
						fieldname: fieldName,
						action: "Add"
					}, {
						ttOrderItemPortalScreen: [item],
						ttOrderParameters: ttOrderParameters
					}, function (result) {
						customService.callCustomEvent("leaveOrderModelItemSearch", {
							controller: orderController,
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
			var ttOrderParameters = orderController.orderParameters;

			orderController.modelItemsToAdd = new Array();

			var lista = orderController.modelItemsFiltered;

			var countItemToAdd = 0;
			angular.forEach(lista, function (item) {

				if (item['qt-un-fat'] > 0) {
					orderController.modelItemsToAdd.push(item);
					countItemToAdd = countItemToAdd + 1;
				}
			});
			if (orderController.modelItemsFiltered.length > 0) {
				if (countItemToAdd == 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, [{
						type: 'warning',
						title: $rootScope.i18n('l-items'),
						detail: $rootScope.i18n('l-enter-quantity')
					}]);
				}
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{
					type: 'warning',
					title: $rootScope.i18n('l-items'),
					detail: $rootScope.i18n('l-perfom-search')
				}]);
			}

			orderController.customLoading = false;

			if (orderController.modelItemsToAdd.length) {

				$timeout(function () {

					fchdis0063.validateOrderItem(
						{
							nrPedido: orderController.nrPedido
						},
						{
							ttOrderParameters: ttOrderParameters,
							dsOrderItemSearch: {
								ttOrderItemSearch: orderController.modelItemsToAdd
							}
						},
						function (resultitems) {
							customService.callCustomEvent("validateOrderItem", {
								controller: orderController,
								result: resultitems
							});

							for (var i = 0; i < orderController.modelItemsFiltered.length; i++) {
								orderController.modelItemsFiltered[i]["qt-un-fat"] = 0;
								orderController.modelItemsFiltered[i]["qt-un-fat"] = 0;
							}

							if (!resultitems.$hasError) {
								if (resultitems.ttOrderItemSearch.length > 0) {
									fchdis0063.addOrderItem({
										nrPedido: orderController.order['nr-pedido']
									}, {
										ttOrderItemSearch: resultitems.ttOrderItemSearch,
										ttOrderParameters: ttOrderParameters,
									}, function (result) {
										customService.callCustomEvent("addOrderItem", {
											controller: orderController,
											result: result
										});
										if (!result.$hasError) {
											orderController.reloadFromModelItems(gotoitems);
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

			orderController.customLoading = true;

			$timeout(function () {
				if ($http.pendingRequests.length === 0) {
					orderController.addModelItems(gotoitems);
				} else {
					orderController.quickSearchText = '';
					orderController.addModelItemsWithTimeOut(gotoitems);
				}
			}, 500);
		}


		this.reloadFromModelItems = function (gotoitems) {

			$scope.$emit("salesorder.portal.loaditems", gotoitems);

			if (!gotoitems) {
				orderController.setFocusSearchModelItem();
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{
					type: 'info',
					title: $rootScope.i18n('l-items'),
					detail: $rootScope.i18n('l-added-to-order')
				}]);
			}
		};


		this.setFocusSearchModelItem = function () {
			var searchModelItemEl = document.getElementById('searchModelItemField');
			var angularEl = angular.element(searchModelItemEl);
			angularEl.focus();
		}


		this.searchTemplateItems = function () {

			orderController.modelItemsFiltered = [];

			if (!orderController.quickSearchTemplateItems) {
				orderController.quickSearchTemplateItems = "";
			}

			if (orderController.quickSearchTemplateItems.length > 0) {
				orderController.models = [];

				var hasCode = false;
				var hasDesc = false;

				angular.forEach(orderController.modelItems, function (item, index) {
					hasCode = false;
					hasDesc = false;

					if (item['it-codigo'].toLowerCase().indexOf(orderController.quickSearchTemplateItems.toLowerCase()) !== -1) {
						hasCode = true;
					}

					if (item['desc-item'].toLowerCase().indexOf(orderController.quickSearchTemplateItems.toLowerCase()) !== -1) {
						hasDesc = true;
					}

					if (hasCode || hasDesc) {
						orderController.modelItemsFiltered.push(item);
					}
				});

			} else {
				orderController.modelItemsFiltered = angular.copy(orderController.modelItems);
			}
		};


		this.openCancelModal = function () {
			if(orderController.waitingCancellationProcess === 'S') {
				$rootScope.$broadcast(TOTVSEvent.showMessage, {
					title: $rootScope.i18n('l-warning'),
					text: $rootScope.i18n('l-msg-requested-cancellation', [orderController.orderId], 'dts/mpd')
				});
			} else {

				var params = {};
				params = {
					tipo: "order",
					nrPedido: orderController.orderId,
					orderParameters: orderController.orderParameters
				};

				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/order2/order.cancel.html',
					controller: 'salesorder.portalOrderCancel.Controller as modalCancelcontroller',
					size: 'lg',
					resolve: {
						modalParams: function () {
							return params;
						}
					}
				});

				modalInstance.result.then(function () {
					orderController.getOrderAndItems();
				});

			}
		};


		this.print = function () {
			if (this.recImpPortal == "yes") {
				fchdis0064.recalculateOrder({ nrPedido: orderController.orderId }, function (result) {
					orderController.getOrderAndItems();

					fchdis0064.getPrintUrl(orderController.orderId, function (url) {
						$window.open(url);
					});
				});
			} else {
				fchdis0064.getPrintUrl(orderController.orderId, function (url) {
					$window.open(url);
				});
			}
		};


		this.processOrder = function (isQuotation) {
			fchdis0064.processOrder({ nrPedido: orderController.orderId }, {}, function (result) {
				if (result['hasError'] == false) {
					if (isQuotation && isQuotation === true) {
						$rootScope.$broadcast(TOTVSEvent.showMessage, {
							title: $rootScope.i18n('l-success'),
							text: $rootScope.i18n('l-msg-release-quotation', [orderController.orderId], 'dts/mpd')
						});
					} else {
						$rootScope.$broadcast(TOTVSEvent.showMessage, {
							title: $rootScope.i18n('l-success'),
							text: $rootScope.i18n('l-msg-release-order', [orderController.orderId], 'dts/mpd')
						});
					}

					if (orderController.bussinessContexts) {
						if(orderController.bussinessContexts.getContextData('selected.sales.order').orderId == orderController.orderId) {
							orderController.bussinessContexts.removeContext('selected.sales.order');
						}	
					}

					orderController.getOrderAndItems();
				}
			});
		};


		this.setCalculateRequired = function (required) {
			orderController.calculateRequired = required;
		}


		this.init = function () {

			orderController.loadModelCompleted = false;
			var paramVisibleFieldsCad = { cTable: "ped-venda-cadastro" };
			var paramVisibleFieldsPesquisa = { cTable: "pesquisa" };
			var paramVisibleFieldsPedItemLista = { cTable: "ped-item-lista" };
			var paramVisibleFieldsItemCadastro = { cTable: "ped-item-cadastro" };
			var paramVisibleFieldsOpcoesMenuVendas = { cTable: "opcoes-menu-vendas" };

			if ($stateParams.isLead) {
				orderController.isLead = $stateParams.isLead;
			}

			/**
			 * Quando tiver uma aba de 'Novo pedido' aberta e ficar navegando entre abas, o if abaixo vai fazer
			 * com que não fique criando um novo pedido toda a vez que entrar na aba novamente.
			 */
			if ($stateParams.codEmit != 0 && orderController.codEmit == $stateParams.codEmit) {
				return;
			}

			/**
			 * Quando tiver uma aba de 'Novo Pedido' aberta e voltar para 'Carteira de Pedidos' e criar um novo
			 * com outro cliente, o if abaixo vai fazer com que zere o código para que crie um novo pedido.
			 */
			if (orderController.codEmit != $stateParams.codEmit && $stateParams.codEmit != undefined) {
				orderController.orderId = 0;
			}

			if ($stateParams.codEmit) {
				orderController.codEmit = $stateParams.codEmit;
			}

			fchdis0035.getUserRoles({ usuario: userData['user-name'] }, function (result) {
				orderController.currentUserRoles = result.out.split(",");

				for (var i = orderController.currentUserRoles.length - 1; i >= 0; i--) {
					if (orderController.currentUserRoles[i] == "representative") {
						orderController.isRepresentative = true;
					}

					if (orderController.currentUserRoles[i] == "customer") {
						orderController.isCustomer = true;
					}
				}


				fchdis0035.getVisibleFields(paramVisibleFieldsPesquisa, function (result) {
					orderController.pesquisaVisibleFields = result;
				}, true, userData['user-name']);

				fchdis0035.getVisibleFields(paramVisibleFieldsItemCadastro, function (result) {
					orderController.itemCadastroVisibleFields = result;
				}, true, userData['user-name']);


				fchdis0035.getVisibleFields(paramVisibleFieldsPedItemLista, function (result) {
					orderController.pedItemListaVisibleFields = result;
				}, true, userData['user-name']);

				fchdis0035.getVisibleFields(paramVisibleFieldsOpcoesMenuVendas, function (result) {
					orderController.opcoesMenuVendasVisibleFields = result;
				}, true, userData['user-name']);


				fchdis0035.getVisibleFields(paramVisibleFieldsCad, function (result) {

					orderController.pedVendaCadastroVisibleFields = result;

					for (var i = 0; i < orderController.pedVendaCadastroVisibleFields.length; i++) {
						if (orderController.pedVendaCadastroVisibleFields[i]['fieldName'] === 'nr-pedcli') {
							orderController.showNrPedcli = true;
							orderController.disabledNrPedcli = !orderController.pedVendaCadastroVisibleFields[i]['fieldEnabled'];
						}

						if (orderController.pedVendaCadastroVisibleFields[i]['fieldName'] == "selecao-modelos") {
							orderController.showSelectModel = true;
						}

						if (orderController.pedVendaCadastroVisibleFields[i]['fieldName'] == "uso-modelo-obrigatorio") {
							orderController.selectModelRequired = true;
						}

						if (orderController.pedVendaCadastroVisibleFields[i]['fieldName'] == "peso-atendido") {
							orderController.showEstimatedWeightMet = true;
						}

						if (orderController.pedVendaCadastroVisibleFields[i]['fieldName'] == "total-peso") {
							orderController.showTotalWeight = true;
						}

						if (orderController.pedVendaCadastroVisibleFields[i]['fieldName'] == "btn-simul-frete-novo-fluxo" && orderController.isRepresentative == true) {
							orderController.enableFreightSimulation = true;
						}


						if (orderController.pedVendaCadastroVisibleFields[i]['fieldName'] == "btn-cancel-novo-fluxo") {
							orderController.showButtonCancel = true;
						}

						if (orderController.pedVendaCadastroVisibleFields[i]['fieldName'] === "novo-fluxo-inclusao-pedido") {
							orderController.newOrderInclusionFlow = orderController.pedVendaCadastroVisibleFields[i]['fieldEnabled'];
						}

						if (orderController.pedVendaCadastroVisibleFields[i]['fieldName'] === "motivo-rejeicao") {
							orderController.showRejectionReason = orderController.pedVendaCadastroVisibleFields[i]['fieldEnabled'];
						}

					}

					// Inicia novo pedido.
					if (!orderController.orderId) {

						fchdis0064.newCopy({}, function (result) {
							orderController.orderId = result.nrPedido;
							orderController.nrPedcli = result.nrPedido;

							if (orderController.selectModelRequired && orderController.showSelectModel) {
								orderController.openSelectModel();
							} else {
								orderController.getHeader();
							}

							orderController.getMessages('order').then(function () {
								if (orderController.messages.length > 0) {
									orderController.openMessages();
								}
							});
						});

					} else {
						// Carrega pedido para edição.
						orderController.getOrderAndItems();

						if ($stateParams.modelId && $stateParams.orderId) {

							orderController.selectedOrderModelId = $stateParams.modelId;

							if (orderController.selectedOrderModelId) {
								orderController.getModelItens(orderController.selectedOrderModelId, $stateParams.orderId)
							}
						}
					}


				}, true, userData['user-name']);

			}, true);

		};

		this.freightSimulation = function () {

			var params = {};
			params = {
				nrPedido: orderController.orderId
			};

			if (orderController.order['cod-sit-ped'] >= 3) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-sit-ped-frete', [], 'dts/mpd'),
					detail: $rootScope.i18n('l-sit-ped-frete-desc', [], 'dts/mpd'),
					timeout: 100000,
					type: 'warning',
				});
			} else if (orderController.calculateRequired === true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-ped-calc', [], 'dts/mpd'),
					detail: $rootScope.i18n('l-ped-calc-frete', [], 'dts/mpd'),
					timeout: 100000,
					type: 'warning',
				});
			} else {
				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/order2/orderFreight.html',
					controller: 'salesorder.orderFreight.controller as modalFreightController',
					size: 'lg',
					resolve: {
						modalParams: function () {
							return params;
						}
					}
				});
			}
		};


		this.addItemFromShoppingCart = function (paramItemToAdd, itemQuantity) {

			var paramItemToAddArray = [];
			orderController.completeAdd = false;
			paramItemToAddArray.push(paramItemToAdd);

			$timeout(function () {
				fchdis0063.startAddItemCountRequest({
					nrPedido: orderController.order['nr-pedido'],
					itemCode: paramItemToAdd['it-codigo'],
					field: 'qt-un-fat'
				}, {
					ttOrderItemSearch: paramItemToAddArray
				}, function (result) {

					orderController.validedItensToOrder.push(result.ttOrderItemSearch[0]);

					if(!orderController.completeAdd) {
						orderController.addItemFromShoppingCartToOrderWithTimeout(orderController.validedItensToOrder);
					}

				});
			}, 100);

		};

		this.addItemFromShoppingCartToOrderWithTimeout = function (arrayItemsToOrder) {

			$timeout(function () {
				if ($http.pendingRequests.length === 0) {
					orderController.completeAdd = true;
					orderController.addItemFromShoppingCartToOrder(arrayItemsToOrder);
				} else {
					if (!orderController.completeAdd) {
						orderController.addItemFromShoppingCartToOrderWithTimeout(arrayItemsToOrder);
					}	
				}
			}, 250);
		}

		
		this.addItemFromShoppingCartToOrder = function (arrayItemsToOrder) {

			if (arrayItemsToOrder.length > 0) {

				fchdis0063.addOrderItem({
					nrPedido: orderController.order['nr-pedido']
				}, {
					ttOrderItemSearch: arrayItemsToOrder,
					ttOrderParameters: orderController.orderParameters,
				}, function (result) {
					orderController.reloadFromShoppingCart(arrayItemsToOrder.length, result)
				});
			}
			
		}

		this.reloadFromShoppingCart = function (itemQuantity, result) {

			$scope.$emit("salesorder.portal.loaditems", false);

			var messageItem = "";

			if (itemQuantity > 1) {
				messageItem = $rootScope.i18n('l-added-items-from-shopping-cart-to-order');
			} else {
				messageItem = $rootScope.i18n('l-added-items-from-shopping-cart-to-order');
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
			
			if (orderController.isRepresentative) {
				for (var i = 0; i < orderController.opcoesMenuVendasVisibleFields.length; i++) {
					if (orderController.opcoesMenuVendasVisibleFields[i]['fieldName'] === 'pesquisa-tab-pre') {
						showPriceListOption = orderController.opcoesMenuVendasVisibleFields[i]['fieldEnabled'];
					}
				}
			}

			if (orderController.isCustomer) {
				for (var i = 0; i < orderController.opcoesMenuVendasVisibleFields.length; i++) {
					if (orderController.opcoesMenuVendasVisibleFields[i]['fieldName'] === 'preco-item') {
						showPriceListOption = orderController.opcoesMenuVendasVisibleFields[i]['fieldEnabled'];
					}
				}
			}

			if(showPriceListOption){ 
				if (orderController.isRepresentative) {
					urlAddItem = '/dts/mpd/prices';
				} else if (orderController.isCustomer) {
					urlAddItem = '/dts/mpd/priceItem/0';
				} else {
					urlAddItem = '/dts/mpd/prices';
				}
			}

			if (orderController.bussinessContexts) {

				if (!orderController.orderDisabled) {
					var dataContext = null;
					if (orderController.bussinessContexts.getContextData('selected.sales.order')) {
						dataContext = orderController.bussinessContexts.getContextData('selected.sales.order');
						dataContext.simpleOrderItems.length = 0; //Remove o objeto controller.simpleOrderItemsToNewOrder da tela priceItem
						dataContext.complete = false;
						dataContext.orderId = orderController.orderId;
						dataContext.order2 = orderController.newOrderInclusionFlow;
						dataContext.isQuotation = false;
						dataContext.shoppingCartActionAdd = orderController.newOrderHeader;
						dataContext.order2CustomerId = orderController.codEmit;
						dataContext.order2modelId = orderController.selectedOrderModelId;
					} else {
						dataContext = { complete: false, orderId: orderController.orderId, simpleOrderItems: [], order2: orderController.newOrderInclusionFlow, isQuotation: false, shoppingCartActionAdd: orderController.newOrderHeader, order2CustomerId: orderController.codEmit, order2modelId: orderController.selectedOrderModelId };
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
						name: $rootScope.i18n('l-remove-shopping-cart') + ' (' + orderController.orderId + ')',
						icon: 'glyphicon-remove',
						click: function () {
							orderController.bussinessContexts.removeContext('selected.sales.order');
						}
					})

					orderController.bussinessContexts.setContext('selected.sales.order',
						$rootScope.i18n('l-pedido') + ' ' + orderController.orderId + ' (' + 0 + ' ' + $rootScope.i18n('l-items-qtd') + ')',
						'glyphicon-shopping-cart',
						cartOptions,
						dataContext);
				} else {
					orderController.bussinessContexts.removeContext('selected.sales.order');
				}

			}
		};


		if ($stateParams.orderId) {
			orderController.orderId = $stateParams.orderId;
			
			if(orderController.bussinessContexts.getContextData('selected.sales.order') && orderController.bussinessContexts.getContextData('selected.sales.order').orderId != undefined) {
				if(orderController.bussinessContexts.getContextData('selected.sales.order').orderId != $stateParams.orderId) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'warning',
						title:  $rootScope.i18n('l-warning', [], 'dts/mpd'),
						detail: $rootScope.i18n('l-order-diff-order-cart', [orderController.bussinessContexts.getContextData('selected.sales.order').orderId], 'dts/mpd')
					});
				}
			}

			var title = $rootScope.i18n('l-order') + " " + orderController.orderId;

			appViewService.startView(title, 'salesorder.order2.controller', this)
			orderController.init();
		}
		else {
			var title = $rootScope.i18n('l-new-order');
			appViewService.startView(title, 'salesorder.order2.controller', this)
			orderController.init();
		}

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
			modelResource.getModels({ modelType: 1 }, function (resultmodels) {

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

	index.register.controller('salesorder.order2.controller', order2Controller);
	index.register.controller('salesorder.order2.selectModel.controller', SelectModelController);
	index.register.controller('salesorder.order2.messages.controller', MessagesController);
});
