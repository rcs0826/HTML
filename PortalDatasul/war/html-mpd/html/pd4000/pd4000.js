/* global angular*/
define(['index',
	// message com controle de foco
	'/dts/dts-utils/js/msg-utils.js',
	// undercore para template
	'/dts/dts-utils/js/lodash-angular.js',
	// tecinca de resize de elemento de acordo com a tela
	'/dts/dts-utils/js/resizer.js',
	// fachada para o pedido HTML
	'/dts/mpd/js/api/fchdis0051.js',
	// fachada para configuração do pedido HTML
	'/dts/mpd/js/api/fchdis0052.js',
	// configurações
	'/dts/mpd/js/api/fchdis0035api.js',
	// controllers das sub-telas
	'/dts/mpd/html/pd4000/pd4000.cancel.js',
	'/dts/mpd/html/pd4000/pd4000.susp.js',
	'/dts/mpd/html/pd4000/pd4000.reativar.js',
	'/dts/mpd/html/pd4000/pd4000.config.js',
	'/dts/mpd/html/pd4000/pd4000.config.fields.js',
	'/dts/mpd/html/pd4000/pd4000.config.models.js',
	'/dts/mpd/html/pd4000/pd4000.copy.js',
	'/dts/mpd/html/pd4000/pd4000.item.js',
	'/dts/mpd/html/pd4000/pd4000.model.js',
	'/dts/mpd/html/pd4000/pd4000.new.js',
	'/dts/mpd/html/pd4000/pd4000.open.js',
	'/dts/mpd/html/pd4000/pd4000.print.js',
	'/dts/mpd/html/pd4000/pd4000.params.js',
	'/dts/mpd/html/pd4000/pd4000.rentab.js',
	'/dts/mpd/html/pd4000/pd4000.stock.js',
	'/dts/mpd/html/pd4000/pd4000.stock.params.js',
	'/dts/mpd/html/pd4000/pd4000.freight.js',
	'/dts/mpd/html/pd4000/pd4000a.js',
	'/dts/mpd/html/pd4000/pd4000b.js',
	'/dts/mpd/html/pd4000/pd4000c.js',
	'/dts/mpd/html/pd4000/pd4000d.js',
	'/dts/mpd/html/pd4000/pd4000e.js',
	'/dts/mpd/html/pd4000/pd4000f.js',
	'/dts/mpd/html/pd4000/pd4000g.js',
	'/dts/mpd/html/pd4000/pd4000h.js',
	'/dts/mpd/html/pd4000/pd4000i.js',
	'/dts/mpd/html/pd4000/pd4000j.js',
	// definições de zooms utilizados nas telas
	'/dts/mpd/js/zoom/emitente.js',
	'/dts/mpd/js/zoom/motivocancelamento.js',
	'/dts/mpd/js/zoom/motivosuspensao.js',
	'/dts/mpd/js/zoom/motivoreativacao.js',
	'/dts/mpd/js/zoom/estabelec.js',
	'/dts/mpd/js/zoom/natur-oper.js',
	'/dts/mpd/js/zoom/canal-venda.js',
	'/dts/mpd/js/zoom/campanha.js',
	'/dts/mpd/js/zoom/oportunidade.js',
	'/dts/mpd/js/zoom/tb-preco-inter.js',
	'/dts/mpd/js/zoom/moeda.js',
	'/dts/mpd/js/zoom/loc-entr.js',
	'/dts/mpd/js/zoom/estado.js',
	'/dts/mpd/js/zoom/pais.js',
	'/dts/mpd/js/zoom/rota.js',
	'/dts/mpd/js/zoom/transporte.js',
	'/dts/mpd/js/zoom/mensagem.js',
	'/dts/mpd/js/zoom/portador.js',
	'/dts/mpd/js/zoom/unid-negoc.js',
	'/dts/mpd/js/zoom/cond-pagto.js',
	'/dts/mpd/js/zoom/cond-pagto-inter.js',
	'/dts/mpd/js/zoom/tab-finan.js',
	'/dts/mpd/js/zoom/tab-finan-indice.js',
	'/dts/mpd/js/zoom/classif-fisc.js',
	'/dts/mpd/js/zoom/repres.js',
	'/dts/mpd/js/zoom/tab-codser.js',
	'/dts/mpd/js/zoom/usuario.js',
	'/dts/mpd/js/zoom/grp_usuar.js',
	'/dts/mpd/js/zoom/grup-estoque.js',
	'/dts/mpd/js/zoom/fam-comerc.js',
	'/dts/mcc/js/zoom/tab-unidade.js',
	'/dts/utb/js/zoom/cta-ctbl-integr.js',
	'/dts/utb/js/zoom/ccusto.js',
	'/dts/men/js/zoom/item.js',
	'/dts/mpd/js/zoom/referencia.js',
	'/dts/mce/js/zoom/deposito.js',
	'/dts/mpd/js/zoom/modalidade-frete.js',
	'/dts/mpd/js/zoom/ped-venda.js',
    '/dts/mpd/js/zoom/tpoperacao.js',
    '/dts/mpd/js/zoom/local-carregamento.js',
	'/dts/mpd/js/zoom/emitente-triangular.js',
	'/dts/mpd/js/userpreference.js',
	'/dts/mpd/js/dbo/bodi159.js',
	'/dts/mpd/js/mpd-promise.js',

	// fachada de contas CRM
	'/dts/mpd/js/api/fchcrm1003api.js',
	// edição de contas CRM
	//'/dts/crm/js/crm-services.js',
	//'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',

	//Configurador de produtos
	'/dts/mcf/html/pendingproduct/pendingproduct-informConfiguration.js',
	'/dts/mcf/html/smartconfiguration/smartconfiguration-configuration.js',

	// Modal narrative: Import's necessários para abertura da modal narrativa(openConfigNarrative).
    '/dts/mpd/html/order2/orderItems.js',
    '/dts/mpd/js/api/cfapi004.js'

], function (index) {

	index.stateProvider

		.state('dts/mpd/pd4000', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/mpd/pd4000.start', {
			url: '/dts/mpd/pd4000/new',
			controller: 'salesorder.pd4000.model.Controller',
			controllerAs: 'modelController',
			templateUrl: '/dts/mpd/html/pd4000/pd4000.model.html'
		})
		.state('dts/mpd/pd4000.model', {
			url: '/dts/mpd/pd4000/model/:customerId',
			controller: 'salesorder.pd4000.model.Controller',
			controllerAs: 'modelController',
			templateUrl: '/dts/mpd/html/pd4000/pd4000.model.html'
		})
		.state('dts/mpd/pd4000.config', {
			url: '/dts/mpd/pd4000/config',
			controller: 'salesorder.pd4000.config.Controller',
			controllerAs: 'configController',
			templateUrl: '/dts/mpd/html/pd4000/pd4000.config.html'
		})
		.state('dts/mpd/pd4000.fields', {
			url: '/dts/mpd/pd4000/config/:idiSeq/fields',
			controller: 'salesorder.pd4000.config.fields.Controller',
			controllerAs: 'configFieldsController',
			templateUrl: '/dts/mpd/html/pd4000/pd4000.config.fields.html'
		})
		.state('dts/mpd/pd4000.models', {
			url: '/dts/mpd/pd4000/config/:idiSeq/models',
			controller: 'salesorder.pd4000.config.models.Controller',
			controllerAs: 'configModelsController',
			templateUrl: '/dts/mpd/html/pd4000/pd4000.config.models.html'
		})
		.state('dts/mpd/pd4000.edit', {
			url: '/dts/mpd/pd4000/:orderId',
			controller: 'salesorder.pd4000.OrderController',
			controllerAs: 'orderController',
			templateUrl: '/dts/mpd/html/pd4000/pd4000.html'
		})
		.state('dts/mpd/pd4000.copy', {
			url: '/dts/mpd/pd4000/:orderId/copy',
			controller: 'salesorder.pd4000.CopyController',
			controllerAs: 'copyController',
			templateUrl: '/dts/mpd/html/pd4000/pd4000.copy.html'
		})
		.state('dts/mpd/pd4000.new', {
			url: '/dts/mpd/pd4000/:orderId/:idiModel?nrPedcli&codEmit',
			controller: 'salesorder.pd4000.NewController',
			controllerAs: 'newController',
			templateUrl: '/dts/mpd/html/pd4000/pd4000.new.html'
		});



	ordercontroller.$inject = [
		'$rootScope',
		'$scope',
		'$filter',
		'$stateParams',
		'$state',
		'$modal',
		'$window',
		'$location',
		'$timeout',
		'hotkeys',
		'totvs.app-main-view.Service',
		'dts-utils.Resize.Service',
		'customization.generic.Factory',
		'mpd.fchdis0051.Factory',
		'dts-utils.message.Service',
		'TOTVSEvent',
		'$q',
		'mpd.fchdis0035.factory',
		'crm.account.modal.edit',
		'crm.crm_lead.factory'];

	function ordercontroller(
		$rootScope,
		$scope,
		$filter,
		$stateParams,
		$state,
		$modal,
		$window,
		$location,
		$timeout,
		hotkeys,
		appViewService,
		resizeService,
		customService,
		fchdis0051,
		messageUtils,
		TOTVSEvent,
		$q,
		fchdis0035,
		modalAccountEdit,
		leadFactory) {

		if ($stateParams.orderId == "" || $stateParams.orderId == undefined) {
			$state.go('dts/mpd/pd4000.start');
			return;
		}

		var orderController = this;

		var i18n = $filter('i18n');
		var currency = $filter('currency');
		var number = $filter('number');
		var loadItemsGrid = false;

		orderController.orderId = $stateParams.orderId;
		orderController.idiModel = $stateParams.idiModel;
		orderController.nrPedcli = $stateParams.nrPedcli;
		orderController.codEmit = $stateParams.codEmit;
		orderController.fullSize = false;
		orderController.activateitens = true;
		orderController.isCRMActive = false;

		orderController.activeTab = {
			pd4000a: true
		};

		orderController.hotKeysPage = getHotkeysPage();

		function getHotkeysPage() {
			return [{
				combo: 'ctrl+alt+f8',
				allowIn: ['INPUT'],
				description: 'Calcular o pedido',
				callback: function (event) {
					orderController.recalculate();
				}
			},
			{
				combo: 'ctrl+alt+f9',
				allowIn: ['INPUT'],
				description: 'Completar o pedido',
				callback: function (event) {
					orderController.beforeCommit();
				}
			},
			{
				combo: 'ctrl+alt+m',
				allowIn: ['INPUT'],
				description: 'Maximizar/Minimizar',
				callback: function (event) {
					orderController.changeSize();
				}
			},
			{
				combo: 'ctrl+alt+a',
				allowIn: ['INPUT'],
				description: 'Alteração dos itens na grade',
				callback: function (event) {
					orderController.changeTab("pd4000a");
					$scope.$broadcast("salesorder.pd4000.hotkey.inlineEdit");
				}
			},
			{
				combo: 'ctrl+alt+s',
				allowIn: ['INPUT'],
				description: 'Salva as alterações dos itens na grade',
				callback: function (event) {
					if (orderController.activeTab["pd4000a"] = true) {
						$scope.$broadcast("salesorder.pd4000.hotkey.inlineEditSave");
					}
				}
			},
			{
				combo: 'ctrl+alt+d',
				allowIn: ['INPUT'],
				description: 'Descarta alterações dos itens na grade',
				callback: function (event) {
					if (orderController.activeTab["pd4000a"] = true) {
						$scope.$broadcast("salesorder.pd4000.hotkey.inlineEditCancel");
					}
				}
			},
			{
				combo: 'ctrl+alt+p',
				allowIn: ['INPUT'],
				description: 'Pesquisa de Produtos',
				callback: function (event) {
					orderController.changeTab("pd4000b");
					$scope.$broadcast("salesorder.pd4000.hotkey.quickSearchText");
				}
			},
			{
				combo: 'ctrl+alt+i',
				allowIn: ['INPUT'],
				description: 'Adiciona os itens da aba Pesquisa de Produtos',
				callback: function (event) {
					if (orderController.activeTab["pd4000b"] = true) {
						$scope.$broadcast("salesorder.pd4000.hotkey.addItens");
					}
				}
			}];
		}

		orderController.changeTab = function (tab) {
			orderController.activeTab = {}; // reset
			orderController.activeTab[tab] = true
		}

		// para fazer o resize do totvs-grid da nova aba selecionada
		orderController.select = function (page) {
			resizeService.doResize();

			if (page) {
				orderController.changeTab(page);
				$scope.$broadcast("salesorder.pd4000.selectview", page);
			}
		};

		orderController.closeView = function () {
			var url = "/dts/mpd/pd4000/" + orderController.orderId;
			appViewService.removeView({ active: true, url: url });
		};

		$scope.$on("salesorder.pd4000.loaditems", function (event, data) {
			orderController.getOrderAndItems(data);
		})

		$scope.$on("salesorder.pd4000.loaditemsGrid", function (event, data) {
			orderController.loadItemsGrid = true;
			orderController.getOrderAndItems(data);
		})

		$scope.$on("salesorder.pd4000.loadorder", function (event, data) {
			if (data != "pd4000")
				orderController.getOrderAndItems();
		})

		orderController.changeSize = function () {
			orderController.fullSize = !orderController.fullSize;
			resizeService.doResize();
		}

		orderController.getCodSitPed = function () {
			if (orderController.order) {
				if (orderController.order['log-cotacao'] == true) return i18n('l-status-order-11', [], 'dts/mpd');
				if (orderController.order['cod-sit-ped'] == 1) return i18n('Aberto', [], 'dts/mpd');
				if (orderController.order['cod-sit-ped'] == 2) return i18n('Atendido Parcial', [], 'dts/mpd');
				if (orderController.order['cod-sit-ped'] == 3) return i18n('Atendido Total', [], 'dts/mpd');
				if (orderController.order['cod-sit-ped'] == 4) return i18n('Pendente', [], 'dts/mpd');
				if (orderController.order['cod-sit-ped'] == 5) return i18n('Suspenso', [], 'dts/mpd');
				if (orderController.order['cod-sit-ped'] == 6) return i18n('Cancelado', [], 'dts/mpd');
				if (orderController.order['cod-sit-ped'] == 7) return i18n('Fatur. Balcão', [], 'dts/mpd');
			}

			return "";
		}

		orderController.hasHistory = function () {
			if (orderController.ttVisibleFields) {
				for (var index = 0; index < orderController.ttVisibleFields.length; index++) {
					var element = orderController.ttVisibleFields[index];
					if (element.fieldName == "orderHistory" && element.fieldEnabled) return true;
				}
			}

			return false;
		}

		orderController.getOrderAndItems = function (gotoitems, source) {

			if (gotoitems) {
				orderController.activateitens = true;
			}

			fchdis0051.getOrderItemsFaturAntecip({ nrPedido: orderController.orderId }, function (result) {

				orderController.listFaturAntecip = result;

				var p1 = new Promise(function (resolve, reject) {
					fchdis0051.getOrder({ nrPedido: orderController.orderId }, function (result) {
						resolve(result);
					});
				});

				p1.then(function (result) {
					result.ttOrder[0]["cod-estabel"] = result.ttOrder[0]["cod-estabel"].trim();
					orderController.loadOrderAndItems(result, source);
				});
			});
		};

		orderController.loadOrderAndItems = function (result, source) {

			customService.callCustomEvent("beforeGetOrder", {
				controller: orderController,
				result: result
			});

			if (result.ttOrder == undefined || result.ttOrder.length < 1) {
				orderController.closeView();
				return;
			}

			orderController.order = result.ttOrder[0];
			orderController.ttParamBonif = result.ttParamBonif[0];
			orderController.ttOrderPeso = result.ttOrderPeso[0];
			orderController.orderExport = result.ttOrderExportInfo[0];
			orderController.orderExportExpense = result.ttOrderExportExpenseInfo;
			orderController.orderVendor = result.ttOrderVendor[0];
			orderController.enableExportTab = result.enableExportTab;
			orderController.ttVisibleFields = result.ttVisibleFields;
			orderController.ttSpecialPaymentConditionPD4000 = result.ttSpecialPaymentConditionPD4000;
			orderController.ttFinancingRatesPD4000 = result.ttFinancingRatesPD4000;
			orderController.ttOrderRepresentative = result.ttOrderRepresentative;
			orderController.comissaoItem = result.comissaoItem;
			orderController.alocacaoItem = result.alocacaoItem;
			orderController.disabledOrder = result.disabledOrder;
			orderController.showMsgAllocated = result.showMsgAllocated;
			orderController.ttPrepaymentPD4000 = result.ttPrepaymentPD4000;
			orderController.orderItens = result.dsOrderItemPD4000;

			if (orderController.showMsgAllocated == 1) {
				if (orderController.disabledOrder == 1) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						title: $rootScope.i18n('Pedido já alocado para embarque!', [], 'dts/mpd'),
						detail: $rootScope.i18n('Para alterar o pedido é necessário desalocar o pedido.', [], 'dts/mpd'),
						timeout: 100000,
						type: 'warning',
					});
				}
				else {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						title: $rootScope.i18n('Pedido já alocado para embarque!', [], 'dts/mpd'),
						detail: $rootScope.i18n('Para alterar o pedido é recomendado desalocar o pedido.', [], 'dts/mpd'),
						timeout: 100000,
						type: 'warning',
					});
				}
			}

			angular.forEach(orderController.listFaturAntecip, function (value, key) {
				for (i = 0; i < orderController.orderItens.length; i++) {
					if (value['nrSeq'] == orderController.orderItens[i]['nr-sequencia']) {
						orderController.orderItens[i]['showWarning'] = value['showWarning'];
					}
				}
			});

			if (orderController.ttPrepaymentPD4000.length == 0)
				orderController.ttPrepaymentPD4000.push({});

			orderController.integrationAccountInit = {
				filters: {
					'cod_modul_dtsul': 'FTP',
					'cod_plano_cta_ctbl': orderController.order.accountPlan
				}
			};

			orderController.costCenterInit = {
				filters: {
					'cod_plano_ccusto': orderController.order.costCenterPlan
				}
			};

			orderController.checkOrderEnable();

			orderController.calcRentability();
			orderController.showAlertOrderInTyping();

			customService.callCustomEvent("afterGetOrder", {
				controller: orderController
			});

			$scope.$broadcast("salesorder.pd4000.loadorder", source ? source : "pd4000");

			if (orderController.order['origem'] === 23 && orderController.order['vl-tot-ped'] === 0 && callback != undefined) {
				callback();
			}

			if (orderController.loadItemsGrid) {
				$timeout(function () {
					$scope.$broadcast("salesorder.pd4000.scrollGrid", true);
					orderController.loadItemsGrid = false;
				}, 100)
			}
		};

		orderController.calcRentability = function () {
			orderController.showRentability = orderController.orderParameters.isAdmPricesActive && orderController.order.completo && orderController.pd4000['rentabilidade-pedido'];
			if (orderController.showRentability) {
				fchdis0051.getOrderRentability({ nrPedido: orderController.orderId }, function (result) {
					customService.callCustomEvent("getOrderRentability", {
						controller: orderController,
						result: result
					});
					orderController.ttOrderRentability = result.ttOrderRentability[0];
					orderController.ttOrderRentabilityItems = result.ttOrderRentabilityItems;
					orderController.idiCalcRentab = result.idiCalcRentab;
					if (orderController.ttOrderRentability.rentabilityPercent > 100) {
						orderController.showRentability = 1;
						orderController.ttOrderRentability.barsize = 10000 / orderController.ttOrderRentability.rentabilityPercent;
					}
					else if (orderController.ttOrderRentability.rentabilityPercent < 0) {
						orderController.showRentability = 3;
						orderController.ttOrderRentability.barsize = 10000 / (100 - orderController.ttOrderRentability.rentabilityPercent);
					}
					else {
						orderController.showRentability = 2;
					}
					if (orderController.ttOrderRentability.rentabilityPercent >= orderController.ttOrderRentability.rentabilityMinPercent) {
						orderController.ttOrderRentability.barcolor = '#BCFFBC';
					} else {
						orderController.ttOrderRentability.barcolor = '#FFBCBC';
					}
				});
			}
		}

		orderController.openRentability = function () {

			if (!orderController.pd4000['rentabilidade-detalhe-pedido']) return;

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/pd4000/pd4000.rentab.html',
				controller: 'salesorder.pd4000Rentab.Controller as modalRentabController',
				size: 'lg',
				resolve: {
					modalParams: function () {
						return {
							ttOrderRentability: orderController.ttOrderRentability,
							ttOrderRentabilityItems: orderController.ttOrderRentabilityItems,
							idiCalcRentab: orderController.idiCalcRentab
						};
					}
				}
			});
		}

		orderController.checkOrderEnable = function () {
			// Faz as validações normais para desabilitar os campos.
			if (orderController.disabledOrder == 0) {
				if (
					orderController.order['cod-sit-ped'] == 5
					|| orderController.order['cod-sit-ped'] == 6
					|| orderController.order['cod-sit-ped'] == 3
				) {
					orderController.orderDisabled = true;
					orderController.canOrderCommit = false;
				} else {
					orderController.orderDisabled = false;
					orderController.canOrderCommit = !orderController.order['completo'];
				}
			} else {
				// Força o disabled.
				orderController.orderDisabled = true;
			}
		};

		orderController.print = function () {

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/pd4000/pd4000.print.html',
				controller: 'salesorder.pd4000Print.Controller as printController',
				size: 'lg',
				resolve: {
					orderstatus: function () {
						return {
							cancalculate: orderController.orderItens.length > 0,
							iscompleted: orderController.order.completo
						}
					}
				}
			});

			modalInstance.result.then(function (data) {
				data.orderId = orderController.orderId

				if (data.recalculateOrder) {
					fchdis0051.calculateOrder({ nrPedido: orderController.orderId }, function (result) {

						customService.callCustomEvent("calculateOrder", {
							controller: orderController,
							result: result
						});

						fchdis0051.getPrintUrl(data, function (url) {
							$window.open(url);
							orderController.getOrderAndItems();
						});
					});
				} else {
					fchdis0051.getPrintUrl(data, function (url) {
						$window.open(url);
					});
				}
			});

		};

		orderController.copyOrder = function () {
			fchdis0051.cancopyorder({ nrPedido: orderController.orderId }, function (result) {
				customService.callCustomEvent("canCopyOrder", {
					controller: orderController,
					result: result
				});

				if (result.canCopy) {
					$state.go('dts/mpd/pd4000.copy', { orderId: orderController.orderId });
				}
			});
		}

		orderController.recalculate = function () {
			fchdis0051.calculateOrder({ nrPedido: orderController.orderId }, function (result) {
				customService.callCustomEvent("calculateOrder", {
					controller: orderController,
					result: result
				});
				orderController.getOrderAndItems();
			});
		};

		orderController.showAlertOrderInTyping = function () {
			if (orderController.order["data-1"] != null &&
				orderController.order["data-1"] != undefined &&
				orderController.order["origem"] != 23) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('Pedido em digitação no Portal de Vendas', [], 'dts/mpd'),
					detail: $rootScope.i18n('O pedido encontra-se em digitação no Portal de Vendas pelo cliente ou representante', [], 'dts/mpd'),
					timeout: 100000,
					type: 'warning',
				});
			};
		};

		orderController.convertQuotation = function () {
			if (orderController.order["log-cotacao"] != true) { return; } //N e cotacao

			var convert = function () {
				fchdis0051.convertQuotationToOrder({ nrPedido: orderController.orderId }, function (result) {

					if (result && result.lOK) {
						orderController.getOrderAndItems();

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-salesorder', [], 'dts/mpd'),
							detail: $rootScope.i18n('Pedido ' + orderController.orderId + ' convertido com sucesso!')
						});
					}

				});
			};

			// Se o pedido ainda não foi liberado no Portal de Vendas
			if ((orderController.order["data-1"] != null && orderController.order["data-1"] != undefined) ||
				(orderController.order["data-2"] == null || orderController.order["data-2"] == undefined)) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-salesorder', [], 'dts/mpd'),
					detail: $rootScope.i18n('msg-validate-quotation-not-released', [], 'dts/mpd')
				});

				return;
			}

			if (!orderController.order["cod-id-prosp"] && orderController.order["cod-id-prosp"] == '') {
				convert(); // cotacao aberta pelo portal, mas ja esta para o cliente correto
			} else {
				leadFactory.canConvertQuotation(orderController.order["cod-id-prosp"], function (result) {
					if (result && result == true) {	// ja é cliente
						convert();
					} else { // ainda é lead, precisa converter primeiro

						$rootScope.$broadcast(TOTVSEvent.showQuestion, {
							title: 'l-customer-portfolio',
							cancelLabel: 'l-cancel',
							confirmLabel: 'l-confirmar',
							text: $rootScope.i18n('msg-question-convert-lead', [], 'dts/mpd'),
							callback: function (isPositiveResult) {
								if (!isPositiveResult) { return; }

								orderController.openConvertLead(parseInt(orderController.order["cod-id-prosp"], 10), function (lead) {
									if (lead) {
										convert();
									}
								});

							}
						});

					}
				});
			}

		};

		orderController.openConvertLead = function (leadId, callback) {

			if (!orderController.order["cod-id-prosp"]) { return; }

			var account = {
				num_id: leadId,
				idi_tip_cta: 2 // alterando conta para cliente
			};

			modalAccountEdit.open({
				account: account,
				isAccount: true,
				isConvert: true,
				isToLoad: false,
				isSourceMpd: true
			}).then(function (result) {

				if (result && result.cod_pessoa_erp && result.cod_pessoa_erp != '') {
					if (callback) { callback(result); }
				} else {
					if (callback) { callback(undefined); }
				}

			});

		};

		orderController.beforeCommit = function () {

			if (orderController.order["origem"] == 23) {

				fchdis0051.approvedBudget({ nrPedido: orderController.orderId }, function (result) {

					if (!result.approvedBudget && result['cDescSit'] != "Vencido") {
						messageUtils.question({
							title: 'l-order-source-app',
							text: $rootScope.i18n('l-budget') + ": " + result.codOrcto + " " + $rootScope.i18n('l-situation-find') + " " + result.cDescSit + ". " + $rootScope.i18n('l-wish-really') + " " + result.cDescTask + " " + $rootScope.i18n('l-the-order'),
							cancelLabel: 'l-no',
							confirmLabel: 'l-yes',
							defaultCancel: true,
							callback: function (isPositiveResult) {
								if (isPositiveResult) {
									orderController.commit();
								}
								else {
									return;
								}
							}
						});
					} else {
						orderController.commit();
					}
				});
			} else {
				// Pedido em digitação no Portal de Vendas
				if (orderController.order["data-1"] != null &&
					orderController.order["data-1"] != undefined &&
					orderController.order["origem"] != 23) {
					messageUtils.question({
						title: 'l-order-typing',
						text: $rootScope.i18n('l-order-typing-question'),
						cancelLabel: 'l-no',
						confirmLabel: 'l-yes',
						defaultCancel: true,
						callback: function (isPositiveResult) {
							if (isPositiveResult) {
								orderController.commit();
							}
							else {
								return;
							}
						}
					});
				} else {
					orderController.commit();
				}
			}
		};

		orderController.commit = function () {
			var auxloop = true;
			var totItens = 0;
			if (orderController.orderParameters.notifyOrderBreak) {
				angular.forEach(orderController.orderItens, function (value) {
					totItens = totItens + 1;
					if ((value['char-1'].substr(79, 5).trim() != '') && (value['char-1'].substr(79, 5).trim() != orderController.order['cod-estabel']) && auxloop) {
						auxloop = false;
						messageUtils.question({
							title: 'Central de Vendas',
							text: $rootScope.i18n('O pedido será quebrado conforme o estabelecimento de atendimento dos itens. Deseja completar os pedidos gerados?'),
							cancelLabel: 'Não',
							confirmLabel: 'Sim',
							defaultCancel: true,
							callback: function (isPositiveResult) {
								if (isPositiveResult) {
									fchdis0051.commitOrder({
										nrPedido: orderController.orderId
									}, {
										completeSalesCentralOrders: true,
										orderParameters: orderController.orderParameters
									}, function (result) {

										if (result['hasError'] == false) orderController.ShowMessageSuccess();

										customService.callCustomEvent("commitOrder", {
											controller: orderController,
											result: result
										});
										orderController.getOrderAndItems();
									});
								}
								else {
									fchdis0051.commitOrder({
										nrPedido: orderController.orderId
									}, {
										completeSalesCentralOrders: false,
										orderParameters: orderController.orderParameters
									}, function (result) {

										if (result['hasError'] == false) orderController.ShowMessageSuccess();

										customService.callCustomEvent("commitOrder", {
											controller: orderController,
											result: result
										});
										orderController.getOrderAndItems();
									});
								}
							}
						})
					}
					else if (orderController.orderItens.length == totItens && auxloop) {
						fchdis0051.commitOrder({
							nrPedido: orderController.orderId
						}, {
							completeSalesCentralOrders: true,
							orderParameters: orderController.orderParameters
						}, function (result) {

							if (result['hasError'] == false) orderController.ShowMessageSuccess();

							customService.callCustomEvent("commitOrder", {
								controller: orderController,
								result: result
							});
							orderController.getOrderAndItems();
						});
					}
				});
			}
			else {
				fchdis0051.commitOrder({
					nrPedido: orderController.orderId
				}, {
					completeSalesCentralOrders: true,
					orderParameters: orderController.orderParameters
				}, function (result) {

					if (result['hasError'] == false) orderController.ShowMessageSuccess();

					customService.callCustomEvent("commitOrder", {
						controller: orderController,
						result: result
					});
					orderController.getOrderAndItems();
				});
			}
		};

		orderController.ShowMessageSuccess = function () {

			$rootScope.$broadcast(TOTVSEvent.showMessage, {
				title: $rootScope.i18n('l-success'),
				text: $rootScope.i18n('Pedido ' + orderController.orderId + ' implantado com sucesso!')
			});

		};

		orderController.addOrder = function () {
			$location.url('/dts/mpd/pd4000/model/' + orderController.order['cod-emitente']);
		};

		orderController.deleteOrder = function () {

			messageUtils.question({
				title: 'Remover Pedido',
				text: $rootScope.i18n('Confirma a eliminação do pedido?'),
				cancelLabel: 'Não',
				confirmLabel: 'Sim',
				defaultCancel: true,
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						fchdis0051.deleteOrder({ nrPedido: orderController.orderId }, {}, function (result) {
							customService.callCustomEvent("deleteOrder", {
								controller: orderController,
								result: result
							});

							if (result.removed)
								orderController.closeView();
						});
					}
				}
			});

		};

		orderController.openSuspendModal = function () {
			var params = {};
			params = {
				nrPedido: orderController.orderId,
				orderParameters: orderController.orderParameters
			};

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/pd4000/pd4000.susp.html',
				controller: 'salesorder.pd4000Suspend.Controller as modalSuspendcontroller',
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
		};

		orderController.openReativarModal = function () {
			var params = {};
			params = {
				nrPedido: orderController.orderId,
				orderParameters: orderController.orderParameters
			};

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/pd4000/pd4000.reativar.html',
				controller: 'salesorder.pd4000Reativar.Controller as modalReativarcontroller',
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
		};


		orderController.openParamsModal = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/pd4000/pd4000.params.html',
				controller: 'salesorder.pd4000Params.Controller as modalParamscontroller',
				size: 'lg',
				resolve: {
					modalParams: function () {
						return orderController.orderParameters;
					}
				}
			});

			modalInstance.result.then(function (data) {
				orderController.orderParameters = data;

				$scope.$broadcast("salesorder.pd4000.changeparameters");

			});
		};

		orderController.openCancelModal = function () {
			var params = {};
			params = {
				tipo: "order",
				nrPedido: orderController.orderId,
				orderParameters: orderController.orderParameters
			};

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/pd4000/pd4000.cancel.html',
				controller: 'salesorder.pd4000Cancel.Controller as modalCancelcontroller',
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
		};

		orderController.openOtherOrder = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/pd4000/pd4000.open.html',
				controller: 'salesorder.pd4000Open.Controller as modalOpenController',
				size: 'lg'
			});
			modalInstance.rendered.then(function () {
				$('input[name="modalopencontroller_customerid_input"]').focus();
			})

		}

		orderController.freightSimulation = function () {
			var params = {};
			params = {
				nrPedido: orderController.orderId
			};

			if (!orderController.order.completo) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('Pedido não está completo!', [], 'dts/mpd'),
					detail: $rootScope.i18n('Para realizar a simulação de frete é necessário completar o pedido.', [], 'dts/mpd'),
					timeout: 100000,
					type: 'warning',
				});
			}
			else if (orderController.order['cod-sit-ped'] >= 3) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					title: $rootScope.i18n('Situação do Pedido não permite Simulação!', [], 'dts/mpd'),
					detail: $rootScope.i18n('É permitido somente simular o frete de pedidos em aberto ou atendidos parcialmente.', [], 'dts/mpd'),
					timeout: 100000,
					type: 'warning',
				});
			} else {
				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/pd4000/pd4000.freight.html',
					controller: 'salesorder.pd4000Freight.Controller as modalFreightcontroller',
					size: 'lg',
					resolve: {
						modalParams: function () {
							return params;
						}
					}
				});
			}

			/*modalInstance.result.then(function () {
				orderController.getOrderAndItems();
			});*/
		};

		orderController.getCRMIsActive = function () {
			fchdis0035.isCRMActive(function (result) {
				orderController.isCRMActive = (result && result.isActive) ? result.isActive : false;
			});
		}

		appViewService.startView(i18n('Pedido', [], 'dts/mpd') + " " + orderController.orderId);

		if (orderController.orderParameters == undefined) {
			orderController.getCRMIsActive();

			fchdis0051.getParametersAux({}, function (data) {
				angular.forEach(data, function (value, key) {

					if (value["cod-param"] === "formato-casas-dec") {
						orderController.originalPriceFormat = value["val-param"];
					}

					if (value["cod-param"] === "numero-casas-dec") {
						orderController.originalPriceNumberDecimalFormat = value["val-param"];
					}
				});

				fchdis0051.getParameters(function result(result) {

					customService.callCustomEvent("getParameters", {
						controller: orderController,
						result: result
					});

					orderController.orderParameters = result.ttOrderParameters[0];

					orderController.permissions = {
						'ped-venda-add': [],
						'ped-venda-edit': [],
						'ped-item-add-edit': [],
						'ped-item-child': [],
						'ped-item-fastadd': [],
						'ped-item-grid': [],
						'ped-item-search': [],
						'ped-repre': [],
						'ped-ent': [],
						'ped-repres-item': [],
						'ped-saldo': [],
						'pd4000': [],
						'carteira-pedidos': []
					}

					orderController.pd4000 = {
						"rentabilidade-pedido": false,
						"rentabilidade-detalhe-pedido": false,
						"peso-pedido": false,
						"peso-atendido-pedido": false,
						"peso-aberto-pedido": false,

						"adicionar-item": false,
						"adicionar-fast-item": false,
						"adicionar-filho-item": false,
						"editar-item": false,
						"editar-grade-item": false,
						"remover-item": false,
						"cancelar-item": false,

						"aba-pesquisar": false,
						"aba-cabecalho": false,
						"aba-pagamento": false,
						"aba-financiamento": false,
						"aba-antecipacoes": false,
						"aba-exportacao": false,
						"aba-entregas": false,
						"aba-representantes-item": false,
						"aba-representantes-pedido": false,
						"aba-alocacao": false,
					};

					for (var i = 0; i < result.ttVisibleFieldsPD4000.length; i++) {
						var field = result.ttVisibleFieldsPD4000[i];
						orderController.permissions[field.screenName].push(field);
						if (field.screenName == "pd4000") {
							orderController.pd4000[field.fieldName] = field;
						}
					}

					for (var i = 0; i < orderController.permissions['ped-item-add-edit'].length; i++) {
						if (orderController.permissions['ped-item-add-edit'][i].fieldName == 'vl-preori') {
							orderController.permissions['ped-item-add-edit'][i].fieldFormat = orderController.originalPriceFormat;
							orderController.permissions['ped-item-add-edit'][i].fieldDecimalNumber = Number(orderController.originalPriceNumberDecimalFormat);
						}
					}

					for (var i = 0; i < orderController.permissions['ped-item-search'].length; i++) {
						if (orderController.permissions['ped-item-search'][i].fieldName == 'vl-preori') {
							orderController.permissions['ped-item-search'][i].fieldFormat = orderController.originalPriceFormat;
							orderController.permissions['ped-item-search'][i].fieldDecimalNumber = Number(orderController.originalPriceNumberDecimalFormat);
						}
					}

					for (var i = 0; i < orderController.permissions['ped-item-grid'].length; i++) {
						if (orderController.permissions['ped-item-grid'][i].fieldName == 'vl-preori') {
							orderController.permissions['ped-item-grid'][i].fieldFormat = orderController.originalPriceFormat;
							orderController.permissions['ped-item-grid'][i].fieldDecimalNumber = Number(orderController.originalPriceNumberDecimalFormat);
						}
					}

					if (orderController.order == undefined) {
						orderController.getOrderAndItems(null, null, function callback() {
							orderController.recalculate();
						})
					}
				});

			});
		}



	} // function ordercontroller(loadedModules)

	index.register.controller('salesorder.pd4000.OrderController', ordercontroller);

});
