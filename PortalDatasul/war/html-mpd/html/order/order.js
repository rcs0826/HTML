/* global TOTVSEvent, angular*/
define(['index',
		'/dts/mpd/html/dashboard/messages.js',
		'/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/zoom/estabelec.js',
		'/dts/mpd/js/zoom/tpoperacaoportal.js',
		'/dts/mcf/html/pendingproduct/pendingproduct-informConfiguration.js',
		'/dts/mcf/html/smartconfiguration/smartconfiguration-configuration.js',
		'/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/zoom/tb-preco-pv.js',
		'/dts/mpd/js/zoom/modalidade-frete.js',
		'/dts/mpd/js/zoom/emitente.js',
		'/dts/dts-utils/js/lodash-angular.js',
		'/dts/mpd/js/api/fchdis0035api.js'], function (index) {

	index.stateProvider

			.state('dts/mpd/order', {
				abstract: true,
				template: '<ui-view/>'
			})
			.state('dts/mpd/order.start', {
				url: '/dts/mpd/order/:orderId?itemAdded',
				controller: 'salesorder.order.Controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/order/order.html'
			})
			.state('dts/mpd/order.edit', {
				url: '/dts/mpd/order/:orderId/edit?hasError',
				controller: 'salesorder.order.EditController',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/order/order.edit.html'
			})
			.state('dts/mpd/order.edititem', {
				url: '/dts/mpd/order/:orderId/edititem/:nrSeq/:itcode/:refId/:tpPreco',
				controller: 'salesorder.modalItemcontroller.Controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/order/orderitem.html'
			})
			.state('dts/mpd/order.detailitem', {
				url: '/dts/mpd/order/:orderId/detailitem/:nrSeq/:itcode/:refId',
				controller: 'salesorder.modalItemcontroller.Controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/order/orderitem.detail.html'
			})
			.state('dts/mpd/order.additem', {
				url: '/dts/mpd/order/:orderId/additem/:nrSeq/:tpPreco',
				controller: 'salesorder.modalSearchItemcontroller.Controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/order/itemsearch.html'
			})
			.state('dts/mpd/order.new', {
				url: '/dts/mpd/order/:orderId/:idModel?nrPedcli&codEmit&isLead',
				controller: 'salesorder.order.Controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/order/order.html'
			});

	editordercontroller.$inject = [
		'$rootScope',
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
		'mpd.fchdis0035.factory'];
	function editordercontroller(
		$rootScope,
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
		fchdis0035) {
		var controller = this;
		var i18n = $filter('i18n');

		this.orderId = $stateParams.orderId;
		this.hasError = $stateParams.hasError;
		this.isLead = false;
		this.changeEstab = false;
		this.orderSource;
		this.orderDisabled = true;
		this.currentUserRoles  = [];

		this.customOrderEdit = function(){
			result = customService.callCustomEvent('customOrderEdit', {controller: controller});
		};

		this.getOrderHeaderResult = function (ttOrder) {
			controller.order = ttOrder;

			if (controller.order['log-cotacao'] == true && controller.order['cod-id-prosp']) {
				controller.isLead = true;
			}

			if (controller.order['data-1'] == null || controller.order['dt-cancela'] != null) {
				controller.orderDisabled = true;
			} else {
				controller.orderDisabled = false;
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

			customService.callCustomEvent('afterGetHeader', { controller: controller });
		}

		this.getHeader = function() {
			var paramVisibleFieldsCad = {cTable: "ped-venda-cadastro"},
				icount  = 0,
				itotal  = 3,
				fnAfter;

			fnAfter = function () {
				/* Se houver algo q so possa ser executado apos retorno de todas requisicoes
				if (icount >= itotal) {

				}
				*/
			};

			// Busca papéis do usuário
			fchdis0035.getUserRoles({usuario: userData['user-name']}, function(result){
				icount++;
				controller.currentUserRoles = result.out.split(",");
				fnAfter();
			}, true);

			fchdis0035.getVisibleFields(paramVisibleFieldsCad, function(result) {
				icount++;
				controller.pedVendaCadastroVisibleFields = result;
				fnAfter();
			}, true, userData['user-name']);

			if(this.hasError == 'true') {
				controller.getOrderHeaderResult($rootScope.ttOrderWithError[0]);
			} else {
				orderResource.getOrderHeader({nrPedido: controller.orderId}, function(data) {
					icount++;
					fnAfter();
					controller.getOrderHeaderResult(data[0]);
				});
			}
		};

		this.save = function() {

			var lEstabExclusivo = false;
			var isPositiveResult = undefined;

			orderResource.getOrderParam(function(ttPortalParam){

				for (var i = 0; i < ttPortalParam.length; i++) {
					if (ttPortalParam[i]['cod-param'] == 'TrataEstabExclivo' && controller.changeEstab) {
						lEstabExclusivo = true;
					}
				}

				if (lEstabExclusivo == true) {
					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
							title: 'l-remove-order-title',
							text: $rootScope.i18n('l-remove-order-sanitize-text'),
							cancelLabel: 'l-no',
							confirmLabel: 'l-yes',
						callback: function(isPositiveResult) {
							orderResource.saveOrderHeader({nrPedido: controller.orderId, lCentralSales:isPositiveResult}, controller.order, function(result) {
								if (!result.$hasError) { 
									controller.hasError = 'false';
									controller.reloadOrderAndItems()
								};
							});

						}
					});
				} else {
					orderResource.saveOrderHeader({nrPedido: controller.orderId, lCentralSales:isPositiveResult}, controller.order, function(result) {
						if (!result.$hasError) {
							controller.hasError = 'false';
							controller.reloadOrderAndItems();
						}
					});
				}
			});
		};

		this.cancel = function() {
			 $state.go('dts/mpd/order.start', {orderId: controller.orderId});
		};

		this.reloadOrderAndItems = function(){
			$state.go('dts/mpd/order.start', {orderId: controller.orderId, itemAdded: 'true'});
		}

		this.applyLeaveOrder = function(field, oldvalue) {
			controller.changeEstab = oldvalue;

			if (oldvalue)
				orderResource.leaveOrder({nrPedido: controller.orderId, leaveField: field}, controller.order, function(result) {
					controller.order = result[0];
				});
		};

		this.setModalidade = function(selected){
			controller.order['modalidade'] = selected['modalidade'];
		}

		this.destinosMercadoria = [
			{codDesMerc: 0, descDesMerc: i18n('l-select')},
			{codDesMerc: 1, descDesMerc: i18n('l-comercio-industria')},
			{codDesMerc: 2, descDesMerc: i18n('l-consumo-proprio-ativo')}
		];

		this.especiePedido = [
			{espPed: 1, descEspPed: i18n('l-pedido-simples')},
			{espPed: 2, descEspPed: i18n('l-pedido-programacao')}
		];

		this.tipoPreco = [
			{tpPreco: 1, descTpPreco: i18n('l-tipo-preco-1')},
			{tpPreco: 2, descTpPreco: i18n('l-tipo-preco-2')},
			{tpPreco: 3, descTpPreco: i18n('l-tipo-preco-3')}
		];
		controller.getHeader();
	}


	ordercontroller.$inject = ['$rootScope',
							   '$filter',
							   '$stateParams',
							   '$state',
							   '$modal',
							   '$window',
							   '$injector',
							   'totvs.app-main-view.Service',
							   'salesorder.salesorders.Factory',
							   'salesorder.model.Factory',
							   'customization.generic.Factory',
							   'portal.getUserData.factory',
							   '$location',
							   'mcf.pendingproduct.informConfiguration.modal',
							   '$q',
							   'userPreference',
							   'TOTVSEvent',
							   'mpd.fchdis0035.factory'];

	function ordercontroller($rootScope, $filter, $stateParams, $state, $modal, $window, $injector, appViewService,
							 orderResource, modelResource, customService, userData, $location, modalInformConfiguration, $q, userPreference, TOTVSEvent, fchdis0035) {

		var controller = this;

		controller.bussinessContexts = null;
		controller.selectedRowItemGrid = null;
		controller.orderItemsWithGrid = null;
		controller.disableOrderProcess = null;
		controller.orderDisabled = true;
		controller.currentUserRoles  = [];

		controller.currentPage = 0;
		controller.pageSize = 8;

		controller.listGroups = [
			{item:{codeGroup: 1,expanded: true, avalaible: true}},
			{item:{codeGroup: 2,expanded: true, avalaible: true}},
			{item:{codeGroup: 3,expanded: true, avalaible: true}},
			{item:{codeGroup: 4,expanded: true, avalaible: true}}];

		controller.numberOfPages = function(){
			return Math.ceil(controller.orderItens.length/controller.pageSize);
		};

		if ($injector.has('totvs.app-bussiness-Contexts.Service')) {
			controller.bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');
		};

		this.i18n = $filter('i18n');

		this.orderId = $stateParams.orderId;
		this.idModel = $stateParams.idModel;
		this.nrPedcli = $stateParams.nrPedcli;
		this.codEmit = $stateParams.codEmit;

		this.cancelledStatus = this.i18n('l-cancelled');

		this.controllerName = 'salesorder.order.Controller';
		this.viewName = $rootScope.i18n('l-pedido') + " " + controller.orderId;

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

		this.isLead  = this.getBoolean($stateParams.isLead);

		this.closeView = function () {
			 var url = "/dts/mpd/order/" + controller.orderId;
			 appViewService.removeView({active: true, url: url});
		};

		this.editOrder = function () {
			$state.go('dts/mpd/order.edit', {orderId: controller.orderId, hasError: false});
		};

		this.print = function () {
			if(this.recImpPortal == "yes") {
				orderResource.recalculateOrder({nrPedido: controller.orderId}, function(result) {
					controller.getOrderAndItems();

					orderResource.getPrintUrl(controller.orderId, function (url) {
					   $window.open(url);
					});
				});
			} else {
				orderResource.getPrintUrl(controller.orderId, function (url) {
					$window.open(url);
				});
			}
		};

		this.getOrderAndItems = function(callback) {

			orderResource.getOrder({nrPedido: controller.orderId}, function(result) {

				if (result.ttDetailOrder.length < 1) {
					controller.closeView();
					return;
				}

				controller.orderDetail = result.ttDetailOrder[0];
				controller.orderItens = result.ttOrderItem;

				// cotacao lead
				if (controller.orderDetail['log-cotacao'] == true && controller.orderDetail['cod-id-prosp']) {
					controller.isLead = true;
				}

				//PESO DO PEDIDO - inicialização do pedido
				controller.returnOrderWeight();

				//Carrega preferencia de usuário para tipo de grade de itens do pedido
				controller.getOrderItemsWithGrid();

				// chamada de ponto de customização
				customService.callCustomEvent('afterLoadOrder', {controller: controller});
				customService.callCustomEvent('onEditOrderItem', controller);
				//customService.callEvent ('salesorder.order', 'afterLoadOrder', {controller: controller});

				//controller.showChild = true;

				for (var i = controller.orderItens.length - 1; i >= 0; i--) {
					if (controller.orderItens[i]['ind-componen'] == 3) {
						controller.orderItens[i].showChildren = controller.showChild;
					} else {
						controller.orderItens[i].showChildren = true;
					}
				}

				controller.userMessagesData = controller.orderDetail.customerMessages.split("-|-");
				if (controller.userMessagesData.length > 0) {
					controller.userMessagesData = controller.userMessagesData.slice(1);
				}

				controller.checkOrderEnable();

				if (controller.bussinessContexts && controller.bussinessContexts.getContextData('selected.sales.order')) {
					//Novo pedido
					if ((controller.bussinessContexts.getContextData('selected.sales.order').orderId == undefined) && (controller.bussinessContexts.getContextData('selected.sales.order').complete)) {
						controller.addItemFromShoppingCart();
					}
				}

				controller.createShoppingCartToOrder();

				if(controller.orderSource === 23 && callback != undefined){
					callback();
					controller.appSource = true;
				}

				/* Busca os campos visíveis para o pedido */
				var paramVisibleFieldsResume = {cTable: "ped-venda-resumo"};
				fchdis0035.getVisibleFields(paramVisibleFieldsResume, function(result) {
					controller.pedVendaResumoVisibleFields = result;
				}, true, userData['user-name']);

			});
		};

		this.setQuickFilterShowChildren = function() {
			for (var i = controller.orderItens.length - 1; i >= 0; i--) {
				if (controller.orderItens[i]['ind-componen'] == 3) {
					controller.orderItens[i].showChildren = controller.showChild;
				}
			}
		};

		this.checkOrderEnable = function() {

			if (controller.orderDetail['data-1'] == null || controller.orderDetail['dt-cancela'] != null) {

				controller.orderDisabled = true;

				controller.disableOrderCalculate = true;
				controller.disableOrderProcess = true;

				controller.labelEditOrder = controller.i18n('l-order-detail');
				controller.labelEditCancel = controller.i18n('btn-close');

			} else {

				controller.orderDisabled = false;

				controller.disableOrderCalculate = false;
				controller.disableOrderProcess = false;

				this.labelEditOrder = controller.i18n('l-order-detail-edit');
				this.labelEditCancel = controller.i18n('l-order-detail-cancel-update');
			}

			if (controller.orderDetail['vl-tot-ped'] == 0) {
				controller.disableOrderProcess = true;
			}
		};

		this.removeOrderItem = function(item) {
			   $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-remove-item-title',
				text: $rootScope.i18n('l-remove-item-text'),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function(isPositiveResult) {
					if (isPositiveResult) {

						if (item['it-codigo'] == "") {
							item['it-codigo'] = " ";
						}
						if (item['cod-refer'] == "") {
							item['cod-refer'] = " ";
						}
						
						orderResource.deleteOrderItem(
								{
									nrPedido: controller.orderId,
									nrSeq: item['nr-sequencia'],
									itemCode: item['it-codigo'],
									itemReference: item['cod-refer']
								},
						function(result) {
							controller.getOrderAndItems();
						});
					}
				}
			});
		};

		this.setOrderPayTerm = function(item, newvalue) {
			if (item === null && controller.orderDetail['cod-cond-pag'] === undefined ) return;

			orderResource.saveOrderPayTerm({nrPedido: controller.orderId, payterm: controller.orderDetail['cod-cond-pag']}, function(result) {
				controller.getOrderAndItems();
			});
		};

		this.recalculate = function() {
			orderResource.recalculateOrder({nrPedido: controller.orderId}, function(result) {
				controller.getOrderAndItems();
			});
		};

		this.freightSimulation = function() {

			var params = {};
			params = {
				nrPedido: controller.orderId
			};

			if (controller.orderDetail['cod-sit-ped'] >= 3) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-sit-ped-frete', [], 'dts/mpd'),
					detail: $rootScope.i18n('l-sit-ped-frete-desc', [], 'dts/mpd'),
					timeout: 100000,
					type: 'warning',
				});
			} else if (controller.disableOrderProcess === true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('l-ped-calc', [], 'dts/mpd'),
					detail: $rootScope.i18n('l-ped-calc-frete', [], 'dts/mpd'),
					timeout: 100000,
					type: 'warning',
				});
			} else {
				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/order/order-freight.html',
					controller: 'salesorder.modalFreightController.Controller as controller',
					size: 'lg',
					resolve: {
					  modalParams: function() {
						  return params;
					  }
					}
				});
			}
		};

		this.returnOrderWeight = function(){

			//PESO DO PEDIDO
			orderResource.orderItemsWeight({nrPedido: controller.orderId}, function(orderweight) {
				angular.forEach(orderweight, function(row) {
					switch(row['campo']) {
						case 'pesoTotalAtendido':
							controller.orderDetail['pesoTotalAtendido'] = row.valor;
							break;
						case 'pesoTotalNaoAtendido':
							controller.orderDetail['pesoTotalNaoAtendido'] = row.valor;
							break;
						case 'pesoTotal':
							controller.orderDetail['pesoTotal'] = row.valor;
							break;
					}
				});


			});
		}


		this.process = function(isQuotation) {
			orderResource.processOrder({nrPedido: controller.orderId}, {}, function(result) {
				if(result['hasError'] == false){
					if (isQuotation && isQuotation === true) {
						$rootScope.$broadcast(TOTVSEvent.showMessage, {
							title: $rootScope.i18n('l-success'),
							text: $rootScope.i18n('l-msg-release-quotation', [controller.orderId], 'dts/mpd')
						});
					} else {
						$rootScope.$broadcast(TOTVSEvent.showMessage, {
							title: $rootScope.i18n('l-success'),
							text: $rootScope.i18n('l-msg-release-order', [controller.orderId], 'dts/mpd')
						});
					}

					if (controller.bussinessContexts) {
						if(controller.bussinessContexts.getContextData('selected.sales.order').orderId == controller.orderId) {
							controller.bussinessContexts.removeContext('selected.sales.order');
						}
					}

					controller.getOrderAndItems();
				}
			});
		};

		this.openCancelModal = function(tipo, item) {
			var params = {};
			if (tipo == "order") {
				params = {
					tipo: tipo,
					nrPedido: controller.orderId
				};
			} else if (tipo == "item") {
				if (item['it-codigo'] == "") {
					item['it-codigo'] = " ";
				}
				if (item['cod-refer'] == "") {
					item['cod-refer'] = " ";
				}
				params = {
					tipo: tipo,
					nrPedido: controller.orderId,
					nrSeq: item['nr-sequencia'],
					itemCode: item['it-codigo'],
					itemReference: item['cod-refer']
				};
			}

			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/order/cancel.html',
			  controller: 'salesorder.modalCancelcontroller.Controller as controller',
			  size: 'lg',
			  resolve: {
				modalParams: function() {
					return params;
				}
			  }
			});

			modalInstance.result.then(function () {
				controller.getOrderAndItems();
			});
		};

		this.openItemModal = function(item) {
			if (!controller.orderDisabled && item.situacao != $rootScope.i18n('l-cancelled')) {
				$state.go('dts/mpd/order.edititem', {
					orderId: controller.orderId,
					nrSeq: item['nr-sequencia'],
					itcode: item['it-codigo'],
					refId: item['cod-refer'],
					tpPreco: controller.orderDetail['tp-preco']
				});
			} else {
				$state.go('dts/mpd/order.detailitem', {
					orderId: controller.orderId,
					nrSeq: item['nr-sequencia'],
					itcode: item['it-codigo'],
					refId: item['cod-refer']
				});
			}
		};

		this.openAddItemModal = function(nrSequencia) {
			$state.go('dts/mpd/order.additem', {
				orderId: controller.orderId,
				nrSeq: nrSequencia,
				tpPreco: controller.orderDetail['tp-preco']
			});
		};

		this.openAddItemModelModal = function(itens) {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/order/itemmodel.html',
			  controller: 'salesorder.modalAddItemModelcontroller.Controller as controller',
			  size: 'lg',
			  resolve: {
				modalParams: function() {
					return {
						nrPedido: controller.orderId,
						itens: itens
					};
				}
			  }
			});

			modalInstance.result.then(function () {
				controller.getOrderAndItems();
			});
		};

		//retorna a view de acordo com um dos parametros nessa ordem view ativa, nome, url ou controllerName
		this.getView = function (type, value, callback) {
			var views = appViewService.openViews;
			var i, len = views.length, view;

			if (type == 'active') {
				for (i = 0; i < len; i += 1) {
					if (views[i].active === true) {
						view = views[i];
						break;
					}
				}
			} else if (type == 'name') {
				for (i = 0; i < len; i += 1) {
					if (views[i].name === value) {
						view = views[i];
						break;
					}
				}
			} else if (type == 'url') {
				for (i = 0; i < len; i += 1) {
					if (views[i].url === value) {
						view = views[i];
						break;
					}
				}
			} else if (type == 'controllerName') {
				for (i = 0; i < len; i += 1) {
					if (views[i].controllerName === value) {
						view = views[i];
						break;
					}
				}
			}

			if (callback) {
				callback(view);
			}

		};

		this.closeModelView = function () {
			controller.getView('controllerName', 'salesorder.model.Controller', function (view) {
				if (view)
					appViewService.removeView(view);
			});
		};


		this.getProfileConfig = function(){

			controller.showButtonCancel = false;
			controller.hasEditableOrderFields = false;
			controller.isRepresentative = false;
			controller.isCustomer = false;
			controller.enableFreightSimulation = false;


			for (var i = controller.currentUserRoles.length - 1; i >= 0; i--) {
				if(controller.currentUserRoles[i] == "representative"){
					controller.isRepresentative = true;
				}

				if(controller.currentUserRoles[i] == "customer"){
					controller.isCustomer = true;
				}
			}

			for (var i = controller.pedVendaResumoVisibleFields.length - 1; i >= 0; i--) {

				if(controller.pedVendaResumoVisibleFields[i]['fieldName'] != "permite-alterar-preco"){
					controller.hasEditableSummaryOrderFields = true;
				}

				if(controller.pedVendaResumoVisibleFields[i]['fieldName'] == "btn-cancel"){
					controller.showButtonCancel = true;
				}

				if(controller.pedVendaResumoVisibleFields[i]['fieldName'] == "btn-simul" && controller.isRepresentative == true){
					controller.enableFreightSimulation = true;
				}

			}

			for (var i = controller.pedVendaCadastroVisibleFields.length - 1; i >= 0; i--) {
				if(controller.pedVendaCadastroVisibleFields[i]['fieldName'] != "permite-alterar-preco"){
					controller.hasEditableOrderFields = true;
				}
			}


			controller.mainOrderProfileConfig = {fields: controller.pedVendaCadastroVisibleFields,
											  fieldsSummary: controller.pedVendaResumoVisibleFields,
											  hasEditableOrderFields: controller.hasEditableOrderFields,
											  hasEditableSummaryOrderFields: controller.hasEditableSummaryOrderFields,
											  showButtonCancel: controller.showButtonCancel,
											  isRepresentative: controller.isRepresentative,
											  isCustomer: controller.isCustomer
											};

		}

		if (appViewService.startView(controller.viewName, controller.controllerName, controller)) {
			this.orderDisabled = true;
			this.disableOrderProcess = true;
			this.disableOrderCalculate = true;

			var paramVisibleFieldsCadastro = {cTable: "ped-venda-cadastro"},
				paramVisibleFieldsResumo = {cTable: "ped-venda-resumo"},
				paramVisibleFields = {cTable: "ped-item-lista"},
				icount  = 0,
				itotal  = 4, // ajustar conforme necessidade
				fnAfter;

			fnAfter = function () {
				/* Se houver algo q so possa ser executado apos retorno de todas requisicoes */
				if (icount >= itotal) {
					controller.getProfileConfig();

					if (controller.idModel == undefined) {
						orderResource.getOrderSource({nrPedido: controller.orderId}, function(orderSourcer){
							controller.orderSource = orderSourcer['p_numero_origem_pedido'];

							controller.getOrderAndItems(function calculaPedido(){
								orderResource.recalculateOrder({nrPedido: controller.orderId}, function(resultRecalculateOrder) {
									controller.getOrderAndItems();
								});
							})
						})
					} else {
						var params = {
							idModel: controller.idModel,
							nrPedido: controller.orderId,
							nrPedcli: controller.nrPedcli
						};

						if (controller.codEmit) {
							params.codEmit = controller.codEmit;
						}

						params.isLead = controller.isLead || false;

						orderResource.getNewOrder01(params, function(resultNewOrder) {

							orderResource.saveOrderHeader({nrPedido: controller.orderId, idModel: controller.idModel}, resultNewOrder, function(data) {

								if (!data.$hasError) {
									controller.getOrderAndItems();
									modelResource.getModelItens({idModel: controller.idModel, nrPedido: controller.orderId}, function(resultModelItens) {
										if (resultModelItens.length > 0) {
											controller.openAddItemModelModal(resultModelItens);
										}
									});

									//$state.go('dts/mpd/order.start', {orderId: controller.orderId}, {notify: false}); // vai para o state da URL de lista sem pesquisa
									controller.closeModelView();
 
								} else {
									if(data.ttOrder) {
										$rootScope.ttOrderWithError = data.ttOrder;
										$state.go('dts/mpd/order.edit', {orderId: controller.orderId, hasError: true});
									}
								}

							});

						});
					}

				}
			};

			fchdis0035.getUserRoles({usuario: userData['user-name']}, function(result){
				icount++;
				controller.currentUserRoles = result.out.split(",");
				fnAfter();
			}, true);

			fchdis0035.getVisibleFields(paramVisibleFieldsCadastro, function(result) {
				icount++;
				controller.pedVendaCadastroVisibleFields = result;
				fnAfter();
			}, true, userData['user-name']);

			fchdis0035.getVisibleFields(paramVisibleFieldsResumo, function(result) {
				icount++;
				controller.pedVendaResumoVisibleFields = result;
				fnAfter();
			}, true, userData['user-name']);

			/* Busca os campos visíveis */
			fchdis0035.getVisibleFields(paramVisibleFields, function(result) {
				icount++;
				controller.pedItemListaVisibleFields = result;
				fnAfter();
			}, true, userData['user-name']);

		} else {
			if($stateParams.itemAdded == 'true'){
				controller.getOrderAndItems();
				$stateParams['itemAdded'] = 'false';
				$location.search('itemAdded', 'false');
			}
		}

		this.addItemFromShoppingCart = function() {
			controller.itensToAddShoppingCart = new Array();

			if (controller.bussinessContexts) {
				var simpleOrderItemFromShoppingCart = controller.bussinessContexts.getContextData('selected.sales.order').simpleOrderItems;

				if (simpleOrderItemFromShoppingCart.length) {
					for (var i = 0; i < simpleOrderItemFromShoppingCart.length; i++) {
						var objItem = angular.copy(simpleOrderItemFromShoppingCart[i]);
						controller.itensToAddShoppingCart.push(objItem);
					}

					orderResource.addOrderItem({
						nrPedido: controller.orderId
					}, controller.itensToAddShoppingCart, function(result) {
					   if (!result.$hasError) controller.getOrderAndItems();
					});
				}
			}
		};

		this.createShoppingCartToOrder = function() {
			if (controller.bussinessContexts) {
				if (!controller.orderDisabled) {
					var dataContext = null;
					if (controller.bussinessContexts.getContextData('selected.sales.order')) {
						dataContext = controller.bussinessContexts.getContextData('selected.sales.order');
						dataContext.simpleOrderItems.length = 0; //Remove o objeto controller.simpleOrderItemsToNewOrder da tela priceItem
						dataContext.complete = false;
						dataContext.orderId = controller.orderId;
						dataContext.order2 = false;
						dataContext.isQuotation = false;
						dataContext.shoppingCartActionAdd = undefined;
						dataContext.order2CustomerId = undefined;
						dataContext.order2modelId = undefined;
					} else {
						dataContext = {complete: false, orderId: controller.orderId, simpleOrderItems: [], order2: false, isQuotation: false, shoppingCartActionAdd: undefined, order2CustomerId: undefined, order2modelId: undefined};
					}

					controller.bussinessContexts.setContext('selected.sales.order',
							$rootScope.i18n('l-pedido') + ' ' + controller.orderId + ' (' + 0 + ' ' + $rootScope.i18n('l-items-qtd') + ')',
							'glyphicon-shopping-cart ',
							[{name: $rootScope.i18n('remove'),
									icon: 'glyphicon-remove',
									click: function() {
										controller.bussinessContexts.removeContext('selected.sales.order');
									}
								}],
							dataContext);
				} else {
					controller.bussinessContexts.removeContext('selected.sales.order');
				}

			}
		};

		this.configProduct = function(item){

			modalInformConfiguration.open({itemCotacao: item['it-codigo'], descItem: item.itemDesc, un: item['cod-un'], nrPedido: controller.orderId, sequencia: item['nr-sequencia'], nomeAbrev: item['nome-abrev']}).then(function(result){

				if (result.nrEstrut) {
					orderResource.addOrderItemConfigured({nrEstrut: result.nrEstrut}, item, function(result) {

						if (!result.$hasError) controller.getOrderAndItems();
					});
				}
			});
		};

		if (controller.bussinessContexts && controller.bussinessContexts.getContextData('selected.sales.order')) {
			if ((controller.bussinessContexts.getContextData('selected.sales.order').orderId != undefined) && (controller.bussinessContexts.getContextData('selected.sales.order').complete)) {
				controller.addItemFromShoppingCart();
			}
		}


		this.setOrderItemsWithGrid = function(){
			controller.orderItemsWithGrid = !controller.orderItemsWithGrid;
			$q.all([userPreference.setPreference('mpd.portal.orderitemgrid', controller.orderItemsWithGrid)]).then(function() {});
		};

		this.getOrderItemsWithGrid = function(){
			$q.all([userPreference.getPreference('mpd.portal.orderitemgrid')]).then(function(results) {

				if(results){
					if(results[0].prefValue == 'true') controller.orderItemsWithGrid = true;
					else controller.orderItemsWithGrid = false;
				}else{
					controller.orderItemsWithGrid = true;
				}
			});
		};

		this.selecteRowGridItem = function(item, dataItems){
			//Permite apenas uma seleção na grade
			for (var i = 0; i < dataItems.length; i++) {
				if(item['$$hashKey'] != dataItems[i]['$$hashKey']){
					dataItems[i].selectedRow = false;
				}
			}

			//Inverte a seleção do item na grade
			item.selectedRow = !item.selectedRow;

			//Define se existe um objeto de item selecionado na grade
			if(item.selectedRow == true) controller.selectedRowItemGrid = item;
			else controller.selectedRowItemGrid = null;

		};

		this.itemsGridActions = function(type, param1, param2){

			if(controller.selectedRowItemGrid != null){
				switch (type) {
					case 'configproduct':
						controller.configProduct(param1);
						break;
					case 'openitem':
						controller.openItemModal(param1)
						break;
					case 'additemchild':
						controller.openAddItemModal(param1)
						break;
					case 'edititem':
						controller.openItemModal(param1)
						break;
					case 'removeitem':
						controller.removeOrderItem(param1)
						break;
					case 'cancelitem':
						controller.openCancelModal(param1, param2)
						break;
				}
			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
				   title: $rootScope.i18n('l-warning'),
				   detail: $rootScope.i18n('l-select-item-in-grid')
			   });
			}

		};

		this.saveContext = function () {
			var context = {}, view;

			context[controller.controllerName] = {};

			fnController = function (value, key) {
				if (key.charAt(0) !== '$' && key !== 'this' && !angular.isFunction(value)) {
					context[view.controllerName][key] = value;
				}
			};

			controller.getView('name', controller.viewName, function (result) {
				if (result) {
					view = result;
					//ctxt = appViewService.getContextByController(controller.viewName, controller.controllerName);
					angular.forEach(controller, fnController);
					view.context = context;
					//appViewService.updated(); //se disparar o evento entra em loop
				}
			});

		};

		// escuta o evento q dispara na atualizacao das views
		$rootScope.$on(TOTVSEvent.updateViewsScope, function () {
			var view = appViewService.getPageActive();
			if (!view || !view.name) { return; }
			if (view.name == controller.viewName) {
				controller.saveContext();
			}
		});


	} // function ordercontroller(loadedModules)

	modalAddItemModelcontroller.$inject = ['salesorder.salesorders.Factory', 'modalParams', '$modalInstance'];

	function modalAddItemModelcontroller(orderResource, modalParams, $modalInstance) {

		var controller = this;

		this.itens = modalParams.itens;
		this.nrPedido = modalParams.nrPedido;

		this.addItens = function() {

			controller.itensToAdd = new Array();

			angular.forEach(controller.itens, function(item) {
				if (item['qt-un-fat'] > 0) {
					controller.itensToAdd.push(item);
				}
			});

			if (controller.itensToAdd.length) {

				orderResource.addOrderItem({
					nrPedido: controller.nrPedido
				}, controller.itensToAdd, function(result) {
					$modalInstance.close();
				});
			} else {
				$modalInstance.dismiss();
			}
		};

		this.cancel = function() {
			$modalInstance.dismiss();
		};

	};

	modalSearchItemcontroller.$inject = ['$rootScope', 'salesorder.prices.Factory', 'salesorder.products.Factory', 'salesorder.salesorders.Factory', '$stateParams', '$state', 'portal.generic.Controller', 'customization.generic.Factory', 'portal.getUserData.factory', '$q', 'userPreference', 'TOTVSEvent', '$timeout', 'mpd.fchdis0035.factory'];

	function modalSearchItemcontroller($rootScope, priceResource, productsResource, orderResource, $stateParams, $state, genericController, customService, userData, $q, userPreference, TOTVSEvent, $timeout, fchdis0035) {

		var controller = this;

		controller.orderSearchItemsWithGrid = null;

		genericController.decorate(this, productsResource);

		this.max = 10;

		this.nrPedido = $stateParams.orderId;
		this.nrSequencia = $stateParams.nrSeq;
		this.tpPreco  = $stateParams.tpPreco;

		this.firstTabSelected = false;
		this.secondTabSelected =  false;

		this.listResultLength = 0;

		this.quickSearchText = '';

		this.itemsListoToAddAfter = [];

		this.itemsToAfterDrawAttention = false;

		this.showNumberReplacement = false;

		this.showItemImage = false;

		this.shoppingPeriod = 1; //30 dias

		this.listResult = [];
		this.listResult2 = [];
		this.listResult3 = [];
		this.listResult4 = [];

		this.totalRecords3 = 0;
		this.totalRecords2 = 0;

		this.currentUserRoles = [];

		this.isLoading = $rootScope.i18n('l-loading', [], 'dts/mpd');


		//Define a aba selecionada e faz a pesquisa se não houver registros previamente carregados
		this.selectedTab = function(selected){

			controller.quickSearchText = "";

			controller.clearFilter();

			controller.addFilter('nrPedido', controller.nrPedido, '', '');
			controller.addFilter('searchTerm', controller.quickSearchText, '', '');

			if(selected == 1){
				controller.setTabPreferenceOnOpenSearch(1);

				if(controller.listResult2.length < 1 || controller.listResult4.length < 1){
					controller.searchButton();
				}
			}

			if(selected == 2){
				controller.setTabPreferenceOnOpenSearch(2);

				if(controller.listResult3.length < 1){
					controller.searchButton();
				}
			}

		}

		//Define a primeira aba como selecionada
		this.setFirstTab = function(){
			controller.firstTabSelected = true;
			controller.secondTabSelected = false
		}

		//Define a aba selecionada como preferência de usuário
		this.setTabPreferenceOnOpenSearch = function(tabvalue){
			$q.all([userPreference.setPreference('mpd.portal.searchitemtab', tabvalue)]).then(function() {});
		}

		//Retorna a aba selecionada como preferência do usuário
		this.getTabPreferenceOnOpenSearch = function(){
			$q.all([userPreference.getPreference('mpd.portal.searchitemtab')]).then(function(results) {
				if(results){

					if(results[0].prefValue == '1'){
						controller.firstTabSelected = true;
						controller.secondTabSelected = false;
					}

					if(results[0].prefValue == '2'){
						controller.firstTabSelected = false;
						controller.secondTabSelected = true;
					}

				}else{
					controller.firstTabSelected = true;
				}

				controller.getPeriodShopping();

			});
		};

		//Define o periodo de compra da pequisa para Reposição
		this.setPeriodShopping = function(numberPeriod){
			controller.shoppingPeriod = numberPeriod;
			$q.all([userPreference.setPreference('mpd.portal.periodshop', numberPeriod)]).then(function() {});
			controller.searchButton();
		}

		//Define se será carregado a quantidade da última compra nos items para Reposição
		this.setShowNumberReplacement = function(showQtd){
			controller.showNumberReplacement = showQtd;
			$q.all([userPreference.setPreference('mpd.portal.showqtdrep', showQtd)]).then(function() {});

			for (var i = 0; i < controller.listResult3.length; i++) {

				for (var x = 0; x < controller.listResult3[i].replacement.length; x++) {
					if(controller.listResult3[i]['cod-un'] == controller.listResult3[i].replacement[x].codun){
						controller.listResult3[i].replacementtext = $rootScope.i18n('l-shopped') + " " + controller.listResult3[i].replacement[x].qtd_tot + " " + controller.listResult3[i].replacement[x].codun + " " + $rootScope.i18n('l-in-last') + " " +  controller.listResult3[i].replacement[x].tot_dias + " " +  $rootScope.i18n('l-days');
						if (parseFloat(controller.listResult3[i].replacement[x].ult_vl_preuni) > 0)
							controller.listResult3[i].replacementtext = controller.listResult3[i].replacementtext + ". " + $rootScope.i18n('l-last-price') + " " + controller.listResult3[i].replacement[x].ult_vl_preuni;

						if(controller.showNumberReplacement == true){
							//adiciona quantidade do ultimo pedido
							controller.listResult3[i]['qt-un-fat'] = controller.listResult3[i].replacement[x].qtd_ult_ped;
						}else{
							//remove quantidade do ultimo pedido
							controller.listResult3[i]['qt-un-fat'] = 0;
						}
					}
				}
			}
		}

		this.setShowItemImage = function(showImage){
			controller.showItemImage = showImage;
			$q.all([userPreference.setPreference('mpd.portal.showitimg', showImage)]).then(function() {});
		}


		//Retorna as preferencias do usuário para periodo e se mostra quantidade da última compra
		this.getPeriodShopping = function(){

			$q.all([userPreference.getPreference('mpd.portal.periodshop'),
					userPreference.getPreference('mpd.portal.showqtdrep'),
					userPreference.getPreference('mpd.portal.showitimg')]).then(function(results) {

				if (results && results[0].prefValue) {
					controller.shoppingPeriod = results[0].prefValue;
				}

				if (results && results[1].prefValue) {
					if(results[1].prefValue == 'true'){
						controller.showNumberReplacement = true;
					}else{
						controller.showNumberReplacement = false;
					}
				}

				if (results && results[2].prefValue) {
					if(results[2].prefValue == 'true'){
						controller.showItemImage = true;
					}else{
						controller.showItemImage = false;
					}
				}

				controller.searchButton();

			});

		};


		this.addItemsToAfter = function(item){

			var itemToAdd = angular.copy(item);

			if(itemToAdd['qt-un-fat'] > 0){
				this.itemsListoToAddAfter.push(itemToAdd);
				item['qt-un-fat'] = 0;

				var result = document.getElementsByClassName("panel-heading");

				var elementPanelHeading = angular.element(result);

				elementPanelHeading.addClass('accordionDrawAttention');
				item.itemsToAfterDrawAttention = true;

				$timeout(function () {
					item.itemsToAfterDrawAttention = false;
				}, 350);

				$timeout(function () {
					elementPanelHeading.removeClass('accordionDrawAttention');
				}, 750);


			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
				   title: $rootScope.i18n('l-warning'),
				   detail: $rootScope.i18n('l-set-qtd-to-add')
				});
			}

		};

		this.removeItemToAddAfter = function(index){
			this.itemsListoToAddAfter.splice(index, 1);
		};

		this.getRelatedPrices = function(item, isNotOpenPopover, callback) {
			var ret, params;

			params = {
				nrPedido: controller.nrPedido,
				itemCode: item['it-codigo'] || " ",
				itemReference: item['cod-refer'] || " "
			};

			item.priceRelatedResult = undefined;

			if (item.priceRelated) {

				if (!isNotOpenPopover) {
					item.priceRelatedResult = item.priceRelated;
				}

				if (callback) { callback(item.priceRelated); }

			} else {

				if (!isNotOpenPopover) {
					ret = priceResource.getRelatedPrice(params, function(data) {
						item.priceRelated = data;
						if (callback) { callback(item.priceRelated); }
					});
					item.priceRelatedResult = ret;
				} else {
					ret = priceResource.getRelatedPriceWithNoCountRequest(params, function(data) {
						item.priceRelated = data;
						if (callback) { callback(item.priceRelated); }
					});
				}

			}
		};

		this.getItemsRelated = function(item) {

			if ((!!item.itemsRelatedRequire) || (!!item.itemsRelatedUpSelling) || (!!item.itemsRelatedCrossSelling))
				return;

			productsResource.getItemsRelated({
				nrPedido: controller.nrPedido,
				itCodigo: item['it-codigo'] || " ",
				nrTabPreco: item['nr-tabpre'] || " "
			}, function(data) {

				item.itemsRelatedRequire = [];
				item.itemsRelatedUpSelling = [];
				item.itemsRelatedCrossSelling = [];

				for (var i = 0; i < data.length; i++) {
					data[i].isRepresentative = controller.searchProfileConfig.isRepresentative;
					data[i].isCustomer = controller.searchProfileConfig.isCustomer;

					if (data[i]['nr-sequencia'] == 0) {
						item.itemsRelatedRequire.push(data[i]);
					} else {
						if (data[i]['nr-sequencia'] == 1) {
							item.itemsRelatedUpSelling.push(data[i]);
						} else {
							if (data[i]['nr-sequencia'] == 2) {
								item.itemsRelatedCrossSelling.push(data[i]);
							}
						}
					}
				}
			});
		};

		this.getEquivalentItems = function(item) {

			if (!!item.itemsEquivalent)
				return;

			item.serchitemctrl = controller;

			productsResource.getItemsEquivalent({
				nrPedido: controller.nrPedido,
				itCodigo: item['it-codigo'] || " ",
				nrTabPreco: item['nr-tabpre'] || " "
			}, function(data) {
				item.itemsEquivalent = data;
				item.serchitemcontroller = controller;
				item.bestEquivalent = '';
				if (item.itemsEquivalent.length > 0) {
					for (var i = 0; i < item.itemsEquivalent.length; i++) {

						item.itemsEquivalent[i].isRepresentative = controller.searchProfileConfig.isRepresentative;
						item.itemsEquivalent[i].isCustomer = controller.searchProfileConfig.isCustomer;

						if (item.itemsEquivalent[i].hasBalance)
							item.bestEquivalent = item.bestEquivalent + ", " + item.itemsEquivalent[i]['it-codigo'];
					}
					item.bestEquivalent = item.bestEquivalent.substring(2);
				}
			});
		};


		this.addItens = function() {

			controller.itensToAdd = new Array();

			angular.forEach(controller.itemsListoToAddAfter, function(item) {

				//Produto Composto - Adiciona a mesma sequencia do item pai
				item['nr-sequencia'] = 0;
				if ((controller.nrSequencia != undefined) && (controller.nrSequencia > 0)) {
					item['nr-sequencia'] = controller.nrSequencia;
				}

				if (item['qt-un-fat'] > 0) {

					var objRelated = {};

					//Adiciona todos os itens obrigatórios
					if (item.itemsRelatedRequire != undefined)
						if (item.itemsRelatedRequire.length > 0) {
							for (var i = 0; i < item.itemsRelatedRequire.length; i++) {
								item.itemsRelatedRequire[i]['qt-un-fat'] = item['qt-un-fat'];
								item.itemsRelatedRequire[i]['nr-tabpre'] = item['nr-tabpre'];
								item.itemsRelatedRequire[i]['nr-sequencia'] = item['nr-sequencia'];
								objRelated = angular.copy(item.itemsRelatedRequire[i]);
								controller.itensToAdd.push(objRelated);
							}
						}

					//Adiciona os itens up-selling selecionados
					if (item.itemsRelatedUpSelling != undefined)
						if (item.itemsRelatedUpSelling.length > 0) {
							for (var i = 0; i < item.itemsRelatedUpSelling.length; i++) {
								item.itemsRelatedUpSelling[i]['qt-un-fat'] = item['qt-un-fat'];
								item.itemsRelatedUpSelling[i]['nr-tabpre'] = item['nr-tabpre'];
								item.itemsRelatedUpSelling[i]['nr-sequencia'] = item['nr-sequencia'];
								if (item.itemsRelatedUpSelling[i].selected) {
									objRelated = angular.copy(item.itemsRelatedUpSelling[i]);
									if (objRelated.hasOwnProperty('selected'))
										delete objRelated['selected'];
									controller.itensToAdd.push(objRelated);
								}
							}
						}

					//Adiciona os itens cross-selling selecionados
					if (item.itemsRelatedCrossSelling != undefined)
						if (item.itemsRelatedCrossSelling.length > 0) {
							for (var i = 0; i < item.itemsRelatedCrossSelling.length; i++) {
								item.itemsRelatedCrossSelling[i]['qt-un-fat'] = item['qt-un-fat'];
								item.itemsRelatedCrossSelling[i]['nr-tabpre'] = item['nr-tabpre'];
								item.itemsRelatedCrossSelling[i]['nr-sequencia'] = item['nr-sequencia'];
								if (item.itemsRelatedCrossSelling[i].selected) {
									objRelated = angular.copy(item.itemsRelatedCrossSelling[i]);
									if (objRelated.hasOwnProperty('selected'))
										delete objRelated['selected'];
									controller.itensToAdd.push(objRelated);
								}
							}
						}

					controller.itensToAdd.push(item);
				}
			});

			if (controller.itensToAdd.length) {
				orderResource.validateOrderItem({
					nrPedido: controller.nrPedido
				}, controller.itensToAdd, function(resultitems) {
					if (!resultitems.$hasError){
						if(resultitems.length > 0){
							orderResource.addOrderItem({
								nrPedido: controller.nrPedido
							}, resultitems, function(result) {
							   if (!result.$hasError) controller.reloadItems();
							});
						}
					}
				});
			} else {
				//controller.cancel();

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
				   title: $rootScope.i18n('l-warning'),
				   detail: $rootScope.i18n('l-select-item-qtd-in-grid')
				});

			}
		};

		this.reloadItems = function() {
			$state.go('dts/mpd/order.start', {orderId: controller.nrPedido, itemAdded: 'true'});
		};

		this.cancel = function() {
			if(this.itemsListoToAddAfter.length > 0){
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
							title: $rootScope.i18n('l-order-items-not-added'),
							text: $rootScope.i18n('l-order-items-not-added-question'),
							cancelLabel: 'l-no',
							confirmLabel: 'l-yes',
						callback: function(isPositiveResult) {
							if(isPositiveResult){
								$state.go('dts/mpd/order.start', {orderId: controller.nrPedido});
							}
						}
				});
			}else{
				$state.go('dts/mpd/order.start', {orderId: controller.nrPedido});
			}
		};

		this.setKeyUp = function(keyEvent, item){
			  if (keyEvent.which === 13){

				var target = keyEvent.target;

				target.blur();

				this.addItemsToAfter(item)
			  }
		}

		this.removeAllItemsToAfter = function(){
			this.itemsListoToAddAfter = [];
		}
		this.changeUn = function(item) {

			item.manuallyEdited = false;

			item['vl-preuni'] = item.precosUnidade[item['cod-un']];

			var hasUn = false;

			for (var i = 0; i < item.replacement.length; i++) {
				if(item['cod-un'] == item.replacement[i].codun){

					hasUn = true;
					item.replacementtext = $rootScope.i18n('l-shopped') + " " + item.replacement[i].qtd_tot + " " + item.replacement[i].codun + " " + $rootScope.i18n('l-in-last') + " " +  item.replacement[i].tot_dias + " " +  $rootScope.i18n('l-days');
					if (parseFloat(item.replacement[i].ult_vl_preuni) > 0)
						item.replacementtext = item.replacementtext + ". " + $rootScope.i18n('l-last-price') + " " + item.replacement[i].ult_vl_preuni;

					//adiciona quantidade do ultimo pedido
					if(controller.showNumberReplacement == true){
						item['qt-un-fat'] = item.replacement[i].qtd_ult_ped;
					}

				}
			}

			if(hasUn == false){
				item.replacementtext = $rootScope.i18n('l-no-has-item-shopped');
				if(controller.showNumberReplacement == true){
					item['qt-un-fat'] = 0;
				}
			}

		};


		this.checkChange = function(item) {
			item.manuallyEdited = true;
		}

		this.searchPrice = function(item) {

			if (!item.hasRelatedPrice) { return; }

			var prices = [], quantMin = 0, fnAfter;

			item.isLoadingPrice = true;

			fnAfter = function (prices) {
				item.isLoadingPrice = false;

				if (item.manuallyEdited != true) {

					angular.forEach(prices,function(value,key){
						if(value['nr-tabpre'].toUpperCase() == item['nr-tabpre'].toUpperCase() && value['cod-unid-med'].toUpperCase() == item['cod-un'].toUpperCase() && item['qt-un-fat'] >= value['quant-min'] && value['quant-min'] >= quantMin){
							item['vl-preuni'] = value['preco-venda'];
							quantMin = value['quant-min'];
						}
					});

				}
			};

			if(item.priceRelated){
				fnAfter(item.priceRelated);
			}
			else {
				//ttPricesRelatedByItem nao retorna +, devido a performance, por isso foi comentado
				//prices = item.ttPricesRelatedByItem;

				this.getRelatedPrices(item, true, function (relatedPrices) {
					fnAfter(item.priceRelated);
				});
			}
		};

		this.keys = Object.keys;

		this.quickSearchText = '';

		this.searchButton = function() {

			controller.clearFilter();
			controller.listResult2 = [];
			controller.listResult3 = [];
			controller.listResult4 = [];

			controller.addFilter('nrPedido', controller.nrPedido, '', '');
			controller.addFilter('searchTerm', controller.quickSearchText, '', '');

			if(controller.secondTabSelected == true){
				controller.addFilter('searchType', '3', '', ''); //Reposição
				controller.addFilter('shoppingPeriod', controller.shoppingPeriod, '', '');
			}else{
				controller.addFilter('searchType', '1', '', ''); //Todos
			}


			controller.findRecords(null, controller.filterBy).then(function(result) {
				for (var i = 0; i < result.length; i++) {
					result[i].precosUnidade = angular.fromJson(result[i].precosUnidade.replace(/'/g, '"'));
					result[i].replacement = angular.fromJson(result[i].replacement.replace(/'/g, '"'));
				}

				if(controller.secondTabSelected == true){

					//controller.listResult3 = angular.copy(controller.listResult); //Reposição
					for (var i = 0; i < result.length; i++) {
						controller.listResult3.push(angular.copy(result[i]));  //Reposição
					}

					controller.totalRecords3 = controller.totalRecords;

					for (var i = 0; i < controller.listResult3.length; i++) {

						for (var x = 0; x < controller.listResult3[i].replacement.length; x++) {
							if(controller.listResult3[i]['cod-un'] == controller.listResult3[i].replacement[x].codun){
								//texto de ultimas compras
								controller.listResult3[i].replacementtext = $rootScope.i18n('l-shopped') + " " + controller.listResult3[i].replacement[x].qtd_tot + " " + controller.listResult3[i].replacement[x].codun + " " + $rootScope.i18n('l-in-last') + " " +  controller.listResult3[i].replacement[x].tot_dias + " " +  $rootScope.i18n('l-days');
								if (parseFloat(controller.listResult3[i].replacement[x].ult_vl_preuni) > 0)
									controller.listResult3[i].replacementtext = controller.listResult3[i].replacementtext + ". " + $rootScope.i18n('l-last-price') + " " + controller.listResult3[i].replacement[x].ult_vl_preuni;

								//adiciona quantidade do ultimo pedido
								if(controller.showNumberReplacement == true){
									controller.listResult3[i]['qt-un-fat'] = controller.listResult3[i].replacement[x].qtd_ult_ped;
								}
							}
						}
					}

				}else{

					for (var i = 0; i < result.length; i++) {
						controller.listResult2.push(angular.copy(result[i]));
						controller.listResult4.push(angular.copy(result[i]));
					}

					//controller.listResult2 = angular.copy(controller.listResult); //Todos Lista
					//controller.listResult4 = angular.copy(controller.listResult); //Todos Grid
					controller.totalRecords2 = controller.totalRecords;
				}

				controller.setClosePopoverAllButtons();

			}).then(function(){
				productsResource.getItemBalance({pStart: 0, nrPedido: controller.nrPedido}, controller.listResult, function(data) {
					//Carrega o saldo estoque dos itens na lista
					for(var i = 0; i < controller.listResult2.length; i++){
						for(var j = 0; j < data.length; j++){
							if(data[j]['it-codigo'] == controller.listResult2[i]['it-codigo'] && data[j]['cod-refer'] == controller.listResult2[i]['cod-refer']){
								if(controller.listResult2[i].balanceLoaded != true){
									controller.listResult2[i].balanceLoaded = true;
									controller.listResult2[i]['vl-saldo'] = data[j]['vl-saldo'];
								}

								controller.listResult2[i].hasEquivalent = data[j]['hasEquivalent'];
								controller.listResult2[i].hasRelated = data[j]['hasRelated'];
								controller.listResult2[i].hasRelatedPrice = data[j]['hasRelatedPrice'];
								controller.listResult2[i].hasBalance = data[j]['hasBalance'];

							}
						}
					}
					//Carrega o saldo estoque dos itens no grid
					for(var i = 0; i < controller.listResult4.length; i++){
						for(var j = 0; j < data.length; j++){
							if(data[j]['it-codigo'] == controller.listResult4[i]['it-codigo'] && data[j]['cod-refer'] == controller.listResult4[i]['cod-refer']){
								if(controller.listResult4[i].balanceLoaded != true){
									controller.listResult4[i].balanceLoaded = true;
									controller.listResult4[i]['vl-saldo'] = data[j]['vl-saldo'];
								}

								controller.listResult4[i].hasEquivalent = data[j]['hasEquivalent'];
								controller.listResult4[i].hasRelated = data[j]['hasRelated'];
								controller.listResult4[i].hasRelatedPrice = data[j]['hasRelatedPrice'];
								controller.listResult4[i].hasBalance = data[j]['hasBalance'];
							}
						}
					}
					//Carrega o saldo estoque da aba reposicao
					for(var i = 0; i < controller.listResult3.length; i++){
						for(var j = 0; j < data.length; j++){
							if(data[j]['it-codigo'] == controller.listResult3[i]['it-codigo'] && data[j]['cod-refer'] == controller.listResult3[i]['cod-refer']){
								if(controller.listResult3[i].balanceLoaded != true){
									controller.listResult3[i].balanceLoaded = true;
									controller.listResult3[i]['vl-saldo'] = data[j]['vl-saldo'];
								}

								controller.listResult3[i].hasEquivalent = data[j]['hasEquivalent'];
								controller.listResult3[i].hasRelated = data[j]['hasRelated'];
								controller.listResult3[i].hasRelatedPrice = data[j]['hasRelatedPrice'];
								controller.listResult3[i].hasBalance = data[j]['hasBalance'];
							}
						}
					}
				});
			});
		};

		this.setClosePopoverAllButtons = function(){
			angular.forEach(angular.element("button,a,span"), function(value, key){
				var elem = angular.element(value);
				elem.bind('click', function() {
					controller.closePopovers();
				});
			});
		}

		this.loadMore = function() {

			controller.clearFilter();

			let beforeLengthList = controller.listResult.length;

			controller.addFilter('nrPedido', controller.nrPedido, '', '');
			controller.addFilter('searchTerm', controller.quickSearchText, '', '');

			if(controller.secondTabSelected == true){
				controller.addFilter('searchType', '3', '', ''); //Reposição
				controller.addFilter('shoppingPeriod', controller.shoppingPeriod, '', '');
			}else{
				controller.addFilter('searchType', '1', '', ''); //Todos
			}

			// Controle de paginação por código do item e referência
			var lastPortalRegClien = controller.listResult[controller.listResult.length -1]['it-codigo'] + "@#$" +
									 controller.listResult[controller.listResult.length -1]['cod-refer'];

			controller.addFilter('lastPortalRegClien', lastPortalRegClien, '', ''); // Para paginação manual

			controller.findRecords(controller.listResult.length, controller.filterBy).then(function(result) {
				for (var i = 0; i < result.length; i++) {
					result[i].precosUnidade = angular.fromJson(result[i].precosUnidade.replace(/'/g, '"'));
					result[i].replacement = angular.fromJson(result[i].replacement.replace(/'/g, '"'));
				}

				if(controller.secondTabSelected == true){
					//controller.listResult3 = angular.copy(controller.listResult); //Reposição
					for (var i = 0; i < result.length; i++) {
						controller.listResult3.push(angular.copy(result[i]));  //Reposição
					}


					controller.totalRecords3 = controller.totalRecords;

					for (var i = 0; i < controller.listResult3.length; i++) {

						for (var x = 0; x < controller.listResult3[i].replacement.length; x++) {
							if(controller.listResult3[i]['cod-un'] == controller.listResult3[i].replacement[x].codun){
								controller.listResult3[i].replacementtext = $rootScope.i18n('l-shopped') + " " + controller.listResult3[i].replacement[x].qtd_tot + " " + controller.listResult3[i].replacement[x].codun + " " + $rootScope.i18n('l-in-last') + " " +  controller.listResult3[i].replacement[x].tot_dias + " " +  $rootScope.i18n('l-days');
								if (parseFloat(controller.listResult3[i].replacement[x].ult_vl_preuni) > 0)
									controller.listResult3[i].replacementtext = controller.listResult3[i].replacementtext + ". " + $rootScope.i18n('l-last-price') + " " + controller.listResult3[i].replacement[x].ult_vl_preuni;

								//adiciona quantidade do ultimo pedido
								if(controller.showNumberReplacement == true){
									controller.listResult3[i]['qt-un-fat'] = controller.listResult3[i].replacement[x].qtd_ult_ped;
								}
							}
						}
					}


				}else{
					//controller.listResult2 = angular.copy(controller.listResult); //Todos Lista
					//controller.listResult4 = angular.copy(controller.listResult); //Todos Grid

					for (var i = 0; i < result.length; i++) {
						controller.listResult2.push(angular.copy(result[i]));
						controller.listResult4.push(angular.copy(result[i]));
					}

					controller.totalRecords2 = controller.totalRecords;
				}

				controller.setClosePopoverAllButtons();

			}).then(function(){

				productsResource.getItemBalance({pStart: beforeLengthList, nrPedido: controller.nrPedido}, controller.listResult, function(data) {

					//Carrega o saldo estoque dos itens na lista
					for(var i = 0; i < controller.listResult2.length; i++){
						for(var j = 0; j < data.length; j++){
							if(data[j]['it-codigo'] == controller.listResult2[i]['it-codigo'] && data[j]['cod-refer'] == controller.listResult2[i]['cod-refer']){
								if(controller.listResult2[i].balanceLoaded != true){
									controller.listResult2[i].balanceLoaded = true;
									controller.listResult2[i]['vl-saldo'] = data[j]['vl-saldo'];
								}
							}
						}
					}
					//Carrega o saldo estoque dos itens no grid
					for(var i = 0; i < controller.listResult4.length; i++){
						for(var j = 0; j < data.length; j++){
							if(data[j]['it-codigo'] == controller.listResult4[i]['it-codigo'] && data[j]['cod-refer'] == controller.listResult4[i]['cod-refer']){
								if(controller.listResult4[i].balanceLoaded != true){
									controller.listResult4[i].balanceLoaded = true;
									controller.listResult4[i]['vl-saldo'] = data[j]['vl-saldo'];
								}
							}
						}
					}
					//Carrega o saldo estoque da aba reposicao
					for(var i = 0; i < controller.listResult3.length; i++){
						for(var j = 0; j < data.length; j++){
							if(data[j]['it-codigo'] == controller.listResult3[i]['it-codigo'] && data[j]['cod-refer'] == controller.listResult3[i]['cod-refer']){
								if(controller.listResult3[i].balanceLoaded != true){
									controller.listResult3[i].balanceLoaded = true;
									controller.listResult3[i]['vl-saldo'] = data[j]['vl-saldo'];
								}
							}
						}
					}
				});
			});
		};

		this.setOrderSearchItemsWithGrid = function(){
			controller.closePopovers();
			$timeout(function () {
				controller.orderSearchItemsWithGrid = !controller.orderSearchItemsWithGrid;
				$timeout(function () {
					controller.closePopovers();
				}, 125);
				$q.all([userPreference.setPreference('mpd.portal.searchitemgrid', controller.orderSearchItemsWithGrid)]).then(function() {});
			}, 500);
		};

		this.closePopovers = function(){

			var els = angular.element('[template-popover]');
			angular.forEach(els, function( el ){
				var element = angular.element(el);

				if (element.data('bs.popover')) {
					element.popover('hide');
				}
			});
		}

		this.getOrderSearchItems = function(){
			$q.all([userPreference.getPreference('mpd.portal.searchitemgrid')]).then(function(results) {
				if(results){

					if(results[0].prefValue == 'true' || results[0].prefValue == true){
						controller.orderSearchItemsWithGrid = true;
					}
					else {
						controller.orderSearchItemsWithGrid = false;
					}
				}else{
					controller.orderSearchItemsWithGrid = true;
				}

				controller.getTabPreferenceOnOpenSearch()
			});
		};


		this.getProfileConfig = function(){

			controller.useItCodigo = false;
			controller.useItemDesc = false;
			controller.useCodRefer = false;
			controller.editablePrice = false;
			controller.isRepresentative = false;
			controller.isCustomer = false;

			for (var i = controller.currentUserRoles.length - 1; i >= 0; i--) {
				if(controller.currentUserRoles[i] == "representative"){
					controller.isRepresentative = true;
				}

				if(controller.currentUserRoles[i] == "customer"){
					controller.isCustomer = true;
				}
			}

			for (var i = controller.pesquisaVisibleFields.length - 1; i >= 0; i--) {

				if(controller.pesquisaVisibleFields[i]['fieldName'] == "it-codigo"){
					controller.useItCodigo = true;
				}

				if(controller.pesquisaVisibleFields[i]['fieldName'] == "desc-item"){
					controller.useItemDesc = true;
				}

				if(controller.pesquisaVisibleFields[i]['fieldName'] == "cod-refer"){
					controller.useCodRefer = true;
				}

				if(controller.pesquisaVisibleFields[i]['fieldName'] == "permite-alterar-preco"){
					controller.editablePrice = true;
				}

			}

			controller.searchProfileConfig = {fields: controller.pesquisaVisibleFields,
											  useItCodigo: controller.useItCodigo,
											  useItemDesc: controller.useItemDesc,
											  useCodRefer: controller.useCodRefer,
											  editablePrice: controller.editablePrice,
											  isRepresentative: controller.isRepresentative,
											  isCustomer: controller.isCustomer,
											  tpPreco: this.tpPreco
											};

		}


		this.startView = function startView(){

			var paramVisibleFieldsPedVendaCadastro = {cTable: "ped-venda-cadastro"},
				paramVisibleFieldsPesquisa = {cTable: "pesquisa"},
				icount  = 0,
				itotal  = 3,
				fnAfter;

			fnAfter = function () {
				if (icount >= itotal) {
					controller.getProfileConfig();
					controller.getOrderSearchItems();
				}
			};

			fchdis0035.getUserRoles({usuario: userData['user-name']}, function(result){
				icount++;
				controller.currentUserRoles = result.out.split(",");
				fnAfter();
			}, true);

			fchdis0035.getVisibleFields(paramVisibleFieldsPedVendaCadastro, function(result) {
				icount++;
				controller.pedVendaCadastroVisibleFields = result;
				fnAfter();
			}, true, userData['user-name']);

			fchdis0035.getVisibleFields(paramVisibleFieldsPesquisa, function(result) {
				icount++;
				controller.pesquisaVisibleFields = result;
				fnAfter();
			}, true, userData['user-name']);
		}

		this.startView();
	}

	modalCancelcontroller.$inject = ['salesorder.salesorders.Factory', 'modalParams', '$modalInstance', '$filter'];

	function modalCancelcontroller(orderResource, modalParams, $modalInstance, $filter) {

		var controller = this;
		var i18n = $filter('i18n');

		this.myParams = angular.copy(modalParams);

		this.showSave = this.myParams.showSave;

		this.motivoCancelamento = '';

		if (this.myParams.tipo == "order") {
			controller.tipo = i18n('l-pedido');
		} else if (this.myParams.tipo == "item") {
			controller.tipo = i18n('l-cod-item');
		}

		this.close = function() {
			$modalInstance.dismiss('cancel');
		};

		this.confirm = function() {
			if (controller.myParams.tipo == "item") {

				orderResource.cancelOrderItem({nrPedido: controller.myParams.nrPedido, nrSeq: controller.myParams.nrSeq, itemCode: controller.myParams.itemCode, itemReference: controller.myParams.itemReference, motivo: controller.motivoCancelamento}, {}, function(data) {
					$modalInstance.close('confirm');
				});

			} else if (this.myParams.tipo == "order") {

				orderResource.cancelOrder({nrPedido: controller.myParams.nrPedido, motivo: controller.motivoCancelamento}, function(data) {
					$modalInstance.close('confirm');
				});
			}
		};
	}

	modalItemcontroller.$inject = ['salesorder.salesorders.Factory', '$stateParams', '$state', '$window', '$filter', '$timeout', 'customization.generic.Factory', 'mpd.fchdis0035.factory', 'portal.getUserData.factory'];

	function modalItemcontroller(orderResource, $stateParams, $state, $window, $filter, $timeout, customService, fchdis0035, userData) {

		var controller = this;
		var i18n = $filter('i18n');

		controller.enabledClassFiscal = false;

		/* Busca os campos visíveis para lista*/
		var paramVisibleFields = {cTable: "ped-item-cadastro"};

		fchdis0035.getVisibleFields(paramVisibleFields, function(result) {
			controller.pedItemCadastroVisibleFields = result;
		}, true, userData['user-name']);

		this.indFatQtfam = [{id: false, desc: i18n('l-order-ind-qt-fam-1')},
			{id: true, desc: i18n('l-order-ind-qt-fam-2')},
			{id: null, desc: i18n('l-order-ind-qt-fam-3')}];

		this.tipoAtend = [{id: 1, desc: i18n('l-order-tipo-atend-1')},
			{id: 2, desc: i18n('l-order-tipo-atend-2')},
			{id: 3, desc: i18n('l-order-tipo-atend-3')}];

		this.itemCode = $stateParams.itcode || " ";
		this.nrPedido = $stateParams.orderId;
		this.nrSequencia = $stateParams.nrSeq;
		this.codRefer = $stateParams.refId || " ";
		this.estabelecFilter = null;
		this.tpPreco = $stateParams.tpPreco;

		this.estabAtendFilter = function(){
			if (controller.codRefer == "" || controller.codRefer == null){
				controller.codRefer = " ";
			}

			if (controller.itemCode == "" || controller.itemCode == null){
				controller.itemCode = " ";
			}

			orderResource.getEstabAtend({nrPedido: controller.nrPedido, nomeAbrev: " ", itCodigo: controller.itemCode, codRefer: controller.codRefer}, function(result) {
				controller.estabelecFilter = result['estabelec-filter'];
								controller.getOrderItem();
			});
		};

		this.customOrderItemEdit = function(){
			result = customService.callCustomEvent('customOrderItemEdit', controller);
		};

		this.estabAtendFilter();

		this.getOrderItem = function(){
			orderResource.getOrderItem({
				nrPedido: controller.nrPedido,
				nrSeq: controller.nrSequencia,
				itemCode: controller.itemCode,
				itemRef: controller.codRefer,
			}, {}, function(result) {
				controller.item = result[0];
				controller.validateClassFis();

				angular.forEach(angular.element('input[autonumeric=""]'), function(value, key){
					var a = angular.element(value);
					a.on('click', function () {
						if (!$window.getSelection().toString()) {
							// Required for mobile Safari
							this.setSelectionRange(0, this.value.length)
						}
					});
				});

				controller.callEditItemEpc();			

			});
		}

		this.validateClassFis = function(){

			if((controller.item['ind-ipi-dife'] == false) && (controller.item['tipo-contr'] != 4)){
				controller.enabledClassFiscal = true;
			}else{
				controller.enabledClassFiscal = false;
			}
		}

		this.cancel = function() {
			 $state.go('dts/mpd/order.start', {orderId: controller.nrPedido});
		};

		this.reloadItems = function(){
			$state.go('dts/mpd/order.start', {orderId: controller.nrPedido, itemAdded: 'true'});
		}

		this.applyLeaveEstabAtend = function() {

			var item = controller.item;

			if (item['it-codigo'] == "") {
				item['it-codigo'] = " ";
			}

			if (item['cod-refer'] == "") {
				item['cod-refer'] = " ";
			}

			if (item['estab-atend-item'] != undefined) {

				orderResource.leaveEstabAtend(
					{
						nomeAbrev: item['nome-abrev'],
						nrPedcli: item['nr-pedcli'],
						codEntrega: item['cod-entrega'],
						estabAtendItem: item['estab-atend-item'],
						itCodigo: item['it-codigo']
					}, function(result) {
					item['nat-operacao'] = result['nat-operacao'];
					item['cod-servico-iss'] = result['codigo-servico-iss'];
				});
			}
		};

		this.callEditItemEpc = function(){
			// chamada de ponto de customização
			customService.callEvent ('salesorder.order', 'onEditOrderItem', {controller: controller});
		}

		this.applyLeaveItem = function(field, oldvalue) {
			$timeout(function () {
				var item = controller.item;

				if (oldvalue && item) {

					if (item['it-codigo'] == "") {
						item['it-codigo'] = " ";
					}

					if (item['cod-refer'] == "") {
						item['cod-refer'] = " ";
					}

					orderResource.leaveOrderItem({
						nrPedido: controller.nrPedido,
						nrSeq: item['nr-sequencia'],
						itemCode: item['it-codigo'],
						itemRef: item['cod-refer'],
						leaveField: field
					}, item, function(result) {
						controller.item = result[0];
					});
				}
			});
		};

		this.save = function() {

			if (controller.item.hasOwnProperty('showChildren'))
				delete controller.item['showChildren'];

			var item = controller.item;

			if (item['it-codigo'] == "") {
				item['it-codigo'] = " ";
			}

			if (item['cod-refer'] == "") {
				item['cod-refer'] = " ";
			}

			orderResource.saveOrderItem({
				nrPedido: controller.nrPedido,
				nrSeq: item['nr-sequencia'],
				itemCode: item['it-codigo'],
				itemRef: item['cod-refer']
			}, item, function(result) {
				if (!result.$hasError) controller.reloadItems();
			});
		};
	}

	modalFreightController.$inject = [
		'$rootScope',
		'salesorder.salesorders.Factory',
		'modalParams',
		'$modalInstance',
		'TOTVSEvent',
		'$filter'];

	function modalFreightController(
		$rootScope,
		orderResource,
		modalParams,
		$modalInstance,
		TOTVSEvent,
		$filter) {

		var modalFreightController = this;
		var i18n = $filter('i18n');

		this.myParams = angular.copy(modalParams);

		this.nrPedido = this.myParams.nrPedido;

		this.close = function() {
			$modalInstance.dismiss('cancel');
		}

		this.getSimulationResult = function() {

			orderResource.freightSimulation({
				vehicleType: modalFreightController.vehicleType,
				freightClass: modalFreightController.freightClass,
				operationType: modalFreightController.operationType,
				considNegoc: /* modalFreightcontroller.considNegoc*/ false,
				nrPedido: modalFreightController.nrPedido
			},function(result) {

				modalFreightController.listResult = result;

			})
		};

		this.confirm = function() {

			if(!modalFreightController.mantemSimul) {

				if(!modalFreightController.gridSelectedSimulation) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						title: $rootScope.i18n('Nenhuma Simulação Selecionada!', [], 'dts/mpd'),
						detail: $rootScope.i18n('Por favor selecionar uma simulação para que seja gravada e enviada para o Gestão de Fretes com a Nota Fiscal.', [], 'dts/mpd'),
						timeout: 100000,
						type: 'warning',
					});
				} else {
					this.selectedSimulation = {};

					this.selectedSimulation.nomeTransp = modalFreightController.gridSelectedSimulation.nomeTransp;
					this.selectedSimulation.codTransp = modalFreightController.gridSelectedSimulation.codTransp;
					this.selectedSimulation.cgcTransp = modalFreightController.gridSelectedSimulation.cgcTransp;
					this.selectedSimulation.nomeRota = modalFreightController.gridSelectedSimulation.nomeRota;
					this.selectedSimulation.codRota = modalFreightController.gridSelectedSimulation.codRota;
					this.selectedSimulation.tipoCapac = modalFreightController.gridSelectedSimulation.tipoCapac;
					this.selectedSimulation.vlFrete = modalFreightController.gridSelectedSimulation.vlFrete;
					this.selectedSimulation.vlFreteImp = modalFreightController.gridSelectedSimulation.vlFreteImp;
					this.selectedSimulation.dtEntrega = modalFreightController.gridSelectedSimulation.dtEntrega;
					this.selectedSimulation.hraEntrega = modalFreightController.gridSelectedSimulation.hraEntrega;

					orderResource.saveFreightSimulation({
						nrPedido: modalFreightController.nrPedido
					},this.selectedSimulation,
					function(result){
						if (!result.messages) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								title: $rootScope.i18n('Simulação de Frete gravada com sucesso!'),
								timeout: 100000,
								type: 'success'
							});
							$modalInstance.dismiss('cancel');
						}
					})
				}
			}
			 else {
				this.close();
			 }
		};
	}

	index.register.controller('salesorder.order.Controller', ordercontroller);
	index.register.controller('salesorder.order.EditController', editordercontroller);
	index.register.controller('salesorder.modalSearchItemcontroller.Controller', modalSearchItemcontroller);
	index.register.controller('salesorder.modalCancelcontroller.Controller', modalCancelcontroller);
	index.register.controller('salesorder.modalItemcontroller.Controller', modalItemcontroller);
	index.register.controller('salesorder.modalAddItemModelcontroller.Controller', modalAddItemModelcontroller);
	index.register.controller('salesorder.modalFreightController.Controller', modalFreightController);
});
