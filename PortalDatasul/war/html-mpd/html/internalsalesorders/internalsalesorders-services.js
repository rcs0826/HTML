define([
	'index',
	'/dts/dts-utils/js/lodash-angular.js',
	// tecnica de resize de elemento de acordo com a tela
	'/dts/dts-utils/js/resizer.js',
	// fachada para o pedido HTML
	'/dts/mpd/js/api/fchdis0035api.js',
	'/dts/mpd/js/api/fchdis0046.js',
	'/dts/mpd/js/api/fchdis0048.js',
	'/dts/mpd/js/portal-factories.js',
	'/dts/mpd/html/pd4000/pd4000.print.js',
	'/dts/mpd/js/api/fchdis0051.js',
	'/dts/mpd/js/userpreference.js',
	'/dts/dts-utils/js/msg-utils.js'
], function(index) {
	'use strict';

	internalSalesOrdersListController.$inject = [
		'$scope',
		'$rootScope',
		'userPreference',
		'totvs.app-main-view.Service',
		'mpd.fchdis0046.Factory',
		'$stateParams',
		'$filter',
		'mpd.internalsalesorders.helper',
		'$timeout',
		'mpd.internalsalesorders.modal.advanced.search',
		'$totvsprofile',
		'$q',
		'$location',
		'mpd.fchdis0051.Factory',
		'$modal',
		'$window',
		'mpd.customerapd.Factory',
		'salesorder.salesorders.Factory',
		'dts-utils.message.Service',
		'customization.generic.Factory',
		'TOTVSEvent',
		'mpd.fchdis0035.factory'
	];
	function internalSalesOrdersListController(
		$scope,
		$rootScope,
		userPreference,
		appViewService,
		orderSummaryApdFactory,
		$stateParams,
		$filter,
		helper,
		$timeout,
		modalAdvancedSearch,
		$totvsprofile,
		$q,
		$location,
		fchdis0051,
		$modal,
		$window,
		customerapd,
		salesorders,
		messageUtils,
		customService,
		TOTVSEvent,
		fchdis0035
	) {
		var vm = this;

		vm.i18n = $filter('i18n');
		vm.disclaimers = [];
		vm.quickFilters = [];
		vm.listOfCustomFilters = [];
		vm.orderList = [];
		vm.orderItems = {};
		vm.isCRMActive = false;
		vm.hideNewOrder = true;
		vm.hideEditOrder = true;
		vm.hideOrderDetails = true;
		vm.hideCopyOrder = true;
		vm.hidePrintOrder = true;
		vm.hideOrderHistory = true;
		vm.hideRemoveOrder = true;
		vm.hideCustomerDetails = true;
		vm.hideSelectCustomer = true;
		vm.hideNewOrderCustomer = true;

		this.startDataView = function init() {
			salesorders.getOrderParam({}, function(dataParams) {
				if ($stateParams.openby == 'openbysummary') {
					vm.setDefaults(function() {
						$q.all([
							userPreference.getPreference('sumInitDate'),
							userPreference.getPreference('sumCodEstabel'),
							userPreference.getPreference('sumUsuarioImp'),
							userPreference.getPreference('allCustomerPortletOrderAPD'),
							userPreference.getPreference('portalOrderPortletOrderAPD')
						]).then(function (results) {
							vm.disclaimers = [];

							if (results && results.length > 0) {
								if (results[0].prefValue) {
									vm.disclaimers.push(helper.addFilter('iAddedDate', new Date(Number(results[0].prefValue)).getTime(), $rootScope.i18n('l-initial-dt-impl'), 'date'));
								}

								if (results[1].prefValue) {
									vm.disclaimers.push(helper.addFilter('iSite', results[1].prefValue, $rootScope.i18n('l-initial-site')));
									vm.disclaimers.push(helper.addFilter('fSite', results[1].prefValue, $rootScope.i18n('l-final-site')));
								}

								if (results[2].prefValue) {
									vm.disclaimers.push(helper.addFilter('iAdditionUser', results[2].prefValue, $rootScope.i18n('l-initial-addition-user')));
									vm.disclaimers.push(helper.addFilter('fAdditionUser', results[2].prefValue, $rootScope.i18n('l-final-addition-user')));
								}

								if (results[3].prefValue == 'false' && $rootScope.selectedcustomer) {
									vm.disclaimers.push(helper.addFilter('iShortName', $rootScope.selectedcustomer['nome-abrev'], $rootScope.i18n('l-initial-short-name')));
									vm.disclaimers.push(helper.addFilter('fShortName', $rootScope.selectedcustomer['nome-abrev'], $rootScope.i18n('l-final-short-name')));
								}

								if (results[4].prefValue == 'true') {
									vm.disclaimers.push(helper.addFilter('onlyPortal', results[4].prefValue, $rootScope.i18n('l-only-portal'), 'boolean'));
								}
							}

							vm.getQuickFiltersObj();
							vm.search(false);
						});
					});
				} else {
					if ($stateParams.openby == 'openbycustomer') {
						vm.disclaimers = [];
						vm.disclaimers.push(helper.addFilter('iShortName', $stateParams.customershorname, $rootScope.i18n('l-initial-short-name')));
						vm.disclaimers.push(helper.addFilter('fShortName', $stateParams.customershorname, $rootScope.i18n('l-final-short-name')));
						vm.getQuickFiltersObj();
						vm.search(false);
					} else {
						vm.setDefaults(function () {
							vm.search(false);
						});
					}
				}
			});
		};

		vm.getParameters = function getParameters() {
			fchdis0051.getParameters(function result(result) {
				for (var i = 0; i < result.ttVisibleFieldsPD4000.filter(function(e) { return e.screenName === "carteira-pedidos"}).length; i++) {
					var field = result.ttVisibleFieldsPD4000[i];

					switch (field.fieldName) {
						case "adicionar-pedido":
							vm.hideNewOrder = false;
							break;
						case "editar-pedido":
							vm.hideEditOrder = false;
							break;
						case "detalhes-pedido":
							vm.hideOrderDetails = false;
							break;
						case "copiar-pedido":
							vm.hideCopyOrder = false;
							break;
						case "imprimir-pedido":
							vm.hidePrintOrder = false;
							break;
						case "historico-pedido":
							vm.hideOrderHistory = false;
							break;
						case "remover-pedido":
							vm.hideRemoveOrder = false;
							break;
						case "detalhar-cliente":
							vm.hideCustomerDetails = false;
							break;
						case "selecionar-pedido-cliente":
							vm.hideSelectCustomer = false;
							break;
						case "novo-pedido-cliente":
							vm.hideNewOrderCustomer = false;
							break;
					}
				}
			});
		}

		this.orderButton = function(buttonId) {
			if (!vm.orderListSelectedOrder) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-order')
				});
				return;
			}

			switch (buttonId) {
				case 'btopen':
					if (vm.orderListSelectedOrder['cod-sit-ped'] == 3) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'warning',
							title: $rootScope.i18n('l-cod-sit-item-3'),
							detail: $rootScope.i18n('l-ped-atend-tot')
						});
					}

					$location.url('/dts/mpd/pd4000/' + vm.orderListSelectedOrder['nr-pedido']);

					break;
				case 'btdetail':
					$location.url('/dts/mpd/internalorderdetail/' + vm.orderListSelectedOrder['nr-pedido']);

					break;
				case 'btcopy':
					$location.url('/dts/mpd/pd4000/' + vm.orderListSelectedOrder['nr-pedido'] + '/copy');

					break;
				case 'btprint':
					vm.printOrder();

					break;
				case 'bthistory':
					$location.url('/dts/mpd/internalorderhistory/' + vm.orderListSelectedOrder['nr-pedido']);

					break;
				case 'btcustomerdetail':
					if (vm.orderListSelectedOrder['log-cotacao'] == true && vm.orderListSelectedOrder['cod-id-prosp'] && vm.orderListSelectedOrder['cod-id-prosp'] !== '') {
						$location.url('/dts/crm/account/detail/' + vm.orderListSelectedOrder['cod-id-prosp']);
					} else {
						$location.url('/dts/mpd/internalcustomerdetail/' + vm.orderListSelectedOrder['cod-emitente']);
					}

					break;
				case 'btselectcustomer':
					vm.selectCustomer(vm.orderListSelectedOrder['cod-emitente']);

					break;
				case 'btdelete':
					vm.deleteOrder();

					break;
			}
		};

		vm.selectCustomer = function(codEmitente) {
			var params = {};
			params.codEmitente = codEmitente;
			customerapd.findByCustomerCode(params, function(data) {
				$rootScope.selectedcustomer = data[0];

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-selected-customer'),
					detail: $rootScope.selectedcustomer['cod-emitente'] + ' - ' + $rootScope.selectedcustomer['nome-abrev']
				});
			});
		};

		vm.newordertoselectedcustomer = function() {
			if ($rootScope.selectedcustomer) {
				$rootScope.selectedcustomer['cod-emitente'];
				$location.url('/dts/mpd/pd4000/model/' + $rootScope.selectedcustomer['cod-emitente']);
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-customer')
				});
			}
		};

		vm.printOrder = function() {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/pd4000/pd4000.print.html',
				controller: 'salesorder.pd4000Print.Controller as printController',
				size: 'lg',
				resolve: {
					orderstatus: function() {
						return {
							cancalculate: false,
							iscompleted: true
						}
					}
				}
			});

			modalInstance.result.then(function(data) {
				data.orderId = vm.orderListSelectedOrder['nr-pedido']
				fchdis0051.getPrintUrl(data, function(url) {
					$window.open(url);
				});
			});
		};

		vm.deleteOrder = function() {
			messageUtils.question({
				title: 'Remover Pedido',
				text: $rootScope.i18n('l-confirm-remove-order'),
				cancelLabel: $rootScope.i18n('l-no'),
				confirmLabel: $rootScope.i18n('l-yes'),
				defaultCancel: true,
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						fchdis0051.deleteOrder({ nrPedido: vm.orderListSelectedOrder['nr-pedido'] }, {}, function(result) {
							customService.callCustomEvent("deleteOrder", {
								controller: vm,
								result: result
							});

							if (result.removed) {
								vm.search(false);
								vm.closeView();
							}
						});
					}
				}
			});
		}

		//Define objeto com a lista de filtros padrões da interface
		vm.getQuickFiltersObj = function() {
			vm.quickFilters = [{
				property: 'quickfilter',
				value: [
					helper.addFilter('iIssueDate', new Date().setMonth(new Date().getMonth() - 1), $rootScope.i18n('l-initial-dt-emiss'), 'date')
				],
				title: $rootScope.i18n('l-last-orders', [], 'dts/mpd')
			}, {
				property: 'quickfilter',
				value: [
					helper.addFilter('tag.status', '1', $rootScope.i18n('l-status-order-9'), 'boolean')
				],
				title: $rootScope.i18n('l-status-order-9', [], 'dts/mpd')
			}, {
				property: 'quickfilter',
				value: [
					helper.addFilter('tag.status', '2', $rootScope.i18n('l-status-order-4'), 'boolean')
				],
				title: $rootScope.i18n('l-status-order-4', [], 'dts/mpd')
			}, {
				property: 'quickfilter',
				value: [
					helper.addFilter('tag.status', '3', $rootScope.i18n('l-status-order-5'), 'boolean')
				],
				title: $rootScope.i18n('l-status-order-5', [], 'dts/mpd')
			}, {
				property: 'quickfilter',
				value: [
					helper.addFilter('tag.status', '4', $rootScope.i18n('l-status-order-6'), 'boolean')
				],
				title: $rootScope.i18n('l-status-order-6', [], 'dts/mpd')
			}, {
				property: 'quickfilter',
				value: [
					helper.addFilter('tag.status', '5', $rootScope.i18n('l-status-order-7'), 'boolean')
				],
				title: $rootScope.i18n('l-status-order-7', [], 'dts/mpd')
			}, {
				property: 'quickfilter',
				value: [
					helper.addFilter('tag.status', '6', $rootScope.i18n('l-status-order-8'), 'boolean')
				],
				title: $rootScope.i18n('l-status-order-8', [], 'dts/mpd')
			}, {
				property: 'quickfilter',
				value: [
					helper.addFilter('tag.status', '7', $rootScope.i18n('l-status-order-10'), 'boolean')
				],
				title: $rootScope.i18n('l-status-order-10', [], 'dts/mpd')
			}];

			if (vm.isCRMActive === true) {
				vm.quickFilters.push({
					property: 'quickfilter',
					value: [
						helper.addFilter('tag.status', '8', $rootScope.i18n('l-status-cotation-lead'), 'boolean')
					],
					title: $rootScope.i18n('l-status-cotation-lead', [], 'dts/mpd')
				});
			}

		};

		/**
		 * Inicializa as variáveis com os valores padrões de acordo com preferências
		 * @param {Function} callback Callback chamado após finalizar a execução de todas as lógicas
		 */
		vm.setDefaults = function setDefaults(callback) {
			// Default filters
			vm.getQuickFiltersObj();

			// Custom filters
			$totvsprofile.remote.get('dts.mpd.internalsalesorders.filters', '', function(result) {
				if (result) {
					vm.listOfCustomFilters = [];
					result.forEach(function (filter) {
						vm.listOfCustomFilters.push({
							'property': 'quickfilter',
							'title': filter.dataCode,
							'value': filter.dataValue
						});
					});
				}
			});

			// Filtro default do usuário
			$totvsprofile.remote.get('/dts/mpd/internalsalesorders', '$defaultfilter', function(result) {
				if (result.length > 0) {
					vm.disclaimers = result[0].dataValue.value;
				} else { // Se não tiver sido seleciona um filtro default
					vm.disclaimers = vm.quickFilters[0].value; // últimos pedidos
				}
				callback();
			});
		};

		vm.customFiltersReload = function() {
			$totvsprofile.remote.get('dts.mpd.internalsalesorders.filters', '', function (result) {
				if (result) {
					vm.listOfCustomFilters = [];
					result.forEach(function (filter) {
						vm.listOfCustomFilters.push({
							'property': 'quickfilter',
							'title': filter.dataCode,
							'value': filter.dataValue
						});
					});
				}
			});
		};

		/**
		 * Faz a requisição para buscar os registros da lista
		 * @param  {Boolean} isMore Identifica se a função foi executada a partir do botão de paginação
		 * @return {}
		 */
		vm.search = function search(isMore) {
			var options, filters = [];

			vm.orderListCount = 0;
			if (!isMore) {
				vm.orderList = [];
			}

			options = {
				start: vm.orderList.length,
				max: 50
			};

			// Parâmetros para a API
			angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));

			orderSummaryApdFactory.getInternalSalesOrders(options, function(result) {
				if (result && result[0] && result[0].hasOwnProperty('$length')) {
					vm.orderListCount = result[0].$length;
				}

				vm.orderList = vm.orderList.concat(result);
			});
		};

		vm.getItems = function getItems(order) {
			if (order) {
				if (order['nr-pedido']) {
					orderSummaryApdFactory.getInternalSalesOrderItems({
						'short_name': order['nome-abrev'],
						'customer_order': order['nr-pedcli']
					}, function (result) {
						vm.orderItems[order['nr-pedido']] = result;
					});
				}
			}
		};

		vm.applySimpleFilter = function applySimpleFilter() {

			if (vm.quickSearch && vm.quickSearch.trim().length > 0) {
				var quickSearch = $.grep(vm.disclaimers, function(filter) {
					return filter.property.indexOf('quickSearch') >= 0;
				});
				var disclaimer = helper.addFilter('quickSearch', vm.quickSearch, $rootScope.i18n('l-simple-filter'));

				if (quickSearch.length > 0) {
					var index = vm.disclaimers.indexOf(quickSearch[0]);
					vm.disclaimers[index] = disclaimer;
				} else {
					vm.disclaimers.push(disclaimer);
				}
			} else {
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
			if (index >= 0) {
				vm.disclaimers.splice(index, 1);
			}
			if (vm.disclaimers.length <= 0) {
				vm.disclaimers.push(
					helper.addFilter('iIssueDate', new Date().setMonth(new Date().getMonth() - 1), $rootScope.i18n('l-initial-dt-emiss'), 'date')
				);
			}
			vm.search(false);
		};

		vm.openAdvancedSearch = function openAdvancedSearch() {
			var instance = modalAdvancedSearch.open({
				'filters': vm.disclaimers,
				'isQuickFilter': false,
				'isCRMActive': vm.isCRMActive
			});

			onCloseAdvancedSearch(instance);
		};

		/**
		 * Abre a modal de pesquisa avançada para criar um filtro customizado
		 * @param {Object} filter Se for uma edição de filtro a função recebe o filtro que será editado
		 */
		vm.addEditCustomFilters = function addEditCustomFilters(filter) {
			var instance = modalAdvancedSearch.open({
				'filters': filter,
				'isQuickFilter': true,
				'isFilterEdit': filter.hasOwnProperty('title'),
				'filtersToLoad': vm.disclaimers,
				'isCRMActive': vm.isCRMActive
			});

			onCloseAdvancedSearch(instance, true, filter.hasOwnProperty('title'), filter);
		};

		/**
		 * Função executada ao fecha a modal de pesquisa avançada
		 * @param  {Promise}  instance      Instância da modal
		 * @param  {Boolean} isQuickFilter Identifica se é um filtro customizado
		 * @param  {Boolean} isFilterEdit  Identifica se é edição de um filtro customizado
		 * @param  {Object}  customFilter  Se for uma edição de filtro a função recebe o filtro que está sendo editado
		 * @return {}
		 */
		function onCloseAdvancedSearch(instance, isQuickFilter, isFilterEdit, customFilter) {
			instance.then(function(parameters) {
				if (isQuickFilter) {
					if (isFilterEdit) { // Edição do filtro (sobrescreve os disclaimerss)
						var index = vm.listOfCustomFilters.indexOf(customFilter);
						vm.listOfCustomFilters[index].value = parameters.filters;
					} else { // Novo filtro
						vm.listOfCustomFilters.push(parameters.customFilter);
					}
				}

				// Se deve buscar os registros novamente de acordo com os filtros
				if (parameters.search) {
					vm.disclaimers = parameters.filters;
					vm.search(false);
				}
			});
		}

		/**
		 * Função executada ao remover um filtro customizado
		 * @param  {Object} filter Filtro a ser removido
		 * @return {}
		 */
		vm.removeCustomFilter = function removeCustomFilter(filter) {
			$totvsprofile.remote.remove('dts.mpd.internalsalesorders.filters', filter.title, function (result) {
				if (!result.$hasError) {
					var index = vm.listOfCustomFilters.indexOf(filter);
					vm.listOfCustomFilters.splice(index, 1);
				}
			});
		};

		function parseFiltersToDisclaimers(filters) {
			vm.model = filters.value;
			vm.disclaimers = [];

			for (var i in vm.model) {
				switch (vm.model[i].property) {
					case 'iOrder':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-initial-nr-pedido')));
						break;
					case 'fOrder':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-final-nr-pedido')));
						break;
					case 'iCustomerOrder':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-initial-nr-customer-order')));
						break;
					case 'fCustomerOrder':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-final-nr-customer-order')));
						break;
					case 'iShortName':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-initial-short-name')));
						break;
					case 'fShortName':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-final-short-name')));
						break;
					case 'iIssueDate':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-initial-dt-emiss'), 'date'));
						break;
					case 'fIssueDate':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-final-dt-emiss'), 'date'));
						break;
					case 'iAddedDate':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-initial-dt-impl'), 'date'));
						break;
					case 'fAddedDate':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-final-dt-impl'), 'date'));
						break;
					case 'iDeliveryDate':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-initial-dt-entrega'), 'date'));
						break;
					case 'fDeliveryDate':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-final-dt-entrega'), 'date'));
						break;
					case 'iSite':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-initial-site')));
						break;
					case 'fSite':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-final-site')));
						break;
					case 'iAdditionUser':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-initial-addition-user')));
						break;
					case 'fAdditionUser':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-final-addition-user')));
						break;
					case 'iPurchaseOrder':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-nr-ordem-start')));
						break;
					case 'fPurchaseOrder':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-nr-ordem-end')));
						break;		
					case 'iAbrevRepresentant':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-abrev-representant-start')));
						break;
					case 'fAbrevRepresentant':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-abrev-representant-end')));
						break;							
					case 'iRepresentant':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-representant-start')));
						break;
					case 'fRepresentant':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-representant-end')));
						break;							
					case 'onlyPortal':
						vm.disclaimers.push(helper.addFilter(vm.model[i].property, vm.model[i].value, $rootScope.i18n('l-only-portal'), 'boolean'));
						break;
					case 'tag.status':
						switch (vm.model[i].value) {
							case '1':
								vm.disclaimers.push(helper.addFilter('tag.status', vm.model[i].value, $rootScope.i18n('l-status-order-9'), 'boolean'));
								break;
							case '2':
								vm.disclaimers.push(helper.addFilter('tag.status', vm.model[i].value, $rootScope.i18n('l-status-order-4'), 'boolean'));
								break;
							case '3':
								vm.disclaimers.push(helper.addFilter('tag.status', vm.model[i].value, $rootScope.i18n('l-status-order-5'), 'boolean'));
								break;
							case '4':
								vm.disclaimers.push(helper.addFilter('tag.status', vm.model[i].value, $rootScope.i18n('l-status-order-6'), 'boolean'));
								break;
							case '5':
								vm.disclaimers.push(helper.addFilter('tag.status', vm.model[i].value, $rootScope.i18n('l-status-order-7'), 'boolean'));
								break;
							case '6':
								vm.disclaimers.push(helper.addFilter('tag.status', vm.model[i].value, $rootScope.i18n('l-status-order-8'), 'boolean'));
								break;
							case '7':
								vm.disclaimers.push(helper.addFilter('tag.status', vm.model[i].value, $rootScope.i18n('l-status-order-10'), 'boolean'));
								break;
							case '8':
								vm.disclaimers.push(helper.addFilter('tag.status', vm.model[i].value, $rootScope.i18n('l-status-cotation-lead'), 'boolean'));
								break;
						}
						break;
				}

			}

			vm.search(false);
		}

		/**
		 * Seta um filtro simples
		 * @param {Object} filter Filtro que será utilizado para buscar os registros
		 */
		vm.setQuickFilter = function setQuickFilter(filter) {
			parseFiltersToDisclaimers(filter);
		};

		vm.customGridData = function() {
			customService.callCustomEvent('customGridData', vm);
		}

		vm.isCRMActive = function(callback) {
			fchdis0035.isCRMActive(function(result) {
				vm.isCRMActive = (result && result.isActive) ? result.isActive : false;
				if (callback) { callback(vm.isCRMActive); }
			});
		};

		$timeout(function() {
			vm.orderListGrid.content.dblclick(function() {
				vm.orderButton('btopen');
			});
		});

		$scope.$on('$destroy', function() {
			vm = undefined;
		});

		vm.getParameters();

		if (appViewService.startView(vm.i18n('l-internal-order-portfolio'), 'mpd.internalsalesorders.list.control', this)) {
			vm.isCRMActive(function(value) {
				vm.startDataView();
			});
		} else {
			if ($stateParams.openby == 'openbycustomer') {				
				if (typeof vm.isCRMActive == 'function') {			
					vm.isCRMActive(function(value) {
						vm.startDataView();
					});
				}
			}
		}

	}

	internalSalesOrdersAdvancedSearchController.$inject = [
		'$modalInstance',
		'parameters',
		'$rootScope',
		'mpd.internalsalesorders.helper',
		'$totvsprofile',
		'TOTVSEvent'
	];
	function internalSalesOrdersAdvancedSearchController(
		$modalInstance,
		parameters,
		$rootScope,
		helper,
		$totvsprofile,
		TOTVSEvent
	) {
		var vm = this;

		vm.model = {};
		vm.isQuickFilter = parameters.isQuickFilter;
		vm.isFilterEdit = parameters.isFilterEdit;
		vm.isDefaultFilter = false;
		vm.filtersToLoad = parameters.filtersToLoad;
		vm.isCRMActive = parameters.isCRMActive;

		var wasDefaultFilter;

		vm.loadFilters = function() {
			angular.forEach(vm.filtersToLoad, function(filter, key) {
				switch (filter.property) {
					case 'iOrder':
						vm.model.iOrder = filter.value
						break;
					case 'fOrder':
						vm.model.fOrder = filter.value
						break;
					case 'iCustomerOrder':
						vm.model.iCustomerOrder = filter.value
						break;
					case 'fCustomerOrder':
						vm.model.fCustomerOrder = filter.value
						break;
					case 'iShortName':
						vm.model.iShortName = filter.value
						break;
					case 'fShortName':
						vm.model.fShortName = filter.value
						break;
					case 'iIssueDate':
						vm.model.iIssueDate = filter.value
						break;
					case 'fIssueDate':
						vm.model.fIssueDate = filter.value
						break;
					case 'iAddedDate':
						vm.model.iAddedDate = filter.value
						break;
					case 'fAddedDate':
						vm.model.fAddedDate = filter.value
						break;
					case 'iDeliveryDate':
						vm.model.iDeliveryDate = filter.value
						break;
					case 'fDeliveryDate':
						vm.model.fDeliveryDate = filter.value
						break;
					case 'iSite':
						vm.model.iSite = filter.value
						break;
					case 'fSite':
						vm.model.fSite = filter.value
						break;
					case 'iAdditionUser':
						vm.model.iAdditionUser = filter.value
						break;
					case 'fAdditionUser':
						vm.model.fAdditionUser = filter.value
						break;
					case 'iPurchaseOrder':
						vm.model.iPurchaseOrder = filter.value
						break;
					case 'fPurchaseOrder':
						vm.model.fPurchaseOrder = filter.value
						break;
					case 'iAbrevRepresentant':
						vm.model.iAbrevRepresentant = filter.value
						break;
					case 'fAbrevRepresentant':
						vm.model.fAbrevRepresentant = filter.value
						break;						
					case 'iRepresentant':
						vm.model.iRepresentant = filter.value
						break;
					case 'fRepresentant':
						vm.model.fRepresentant = filter.value
						break;
					case 'onlyPortal':
						vm.model.onlyPortal = filter.value
						break;
					case 'tag.status':
						vm.model['tag.status'] = filter.value;
						break;
				}
			});
		};

		vm.init = function init() {
			if (parameters.isQuickFilter && parameters.isFilterEdit) {
				vm.customFilter = parameters.filters;
				vm.model = helper.parseDisclaimersToFilter(parameters.filters.value);

				$totvsprofile.remote.get('/dts/mpd/internalsalesorders', '$defaultfilter', function(result) {
					vm.isDefaultFilter = result.length > 0 && vm.customFilter.title === result[0].dataValue.title;
					wasDefaultFilter = vm.isDefaultFilter;
				});
			} else if (!parameters.isQuickFilter) {
				vm.model = helper.parseDisclaimersToFilter(parameters.filters);
			}
		};

		vm.search = function search() {
			$modalInstance.close({
				'filters': parseFiltersToDisclaimers(),
				'search': true
			});
		};

		/**
		 * Salva um filtro customizado. Executada ao clicar no botão "Salvar" ou "Aplicar e Salvar" da modal durante criação/edição de um filtro customizado.
		 * @param  {boolean} search Quando true: Foi clicado no botão "Aplicar e salvar", quando false: Foi clicado apenas em "Salvar".
		 * @return {}
		 */
		vm.save = function save(search) {
			if (!vm.customFilter) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-filer-title-validate')
				});
				return;
			} else {
				if (!vm.customFilter.title) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-filer-title-validate')
					});
					return;
				}
			}

			var filters = parseFiltersToDisclaimers();
			var customFilter = {
				'property': 'quickfilter',
				'title': vm.customFilter.title,
				'value': filters
			};

			$totvsprofile.remote.set('dts.mpd.internalsalesorders.filters', { dataCode: vm.customFilter.title, dataValue: filters }, function(result) {
				$modalInstance.close({
					'filters': filters,
					'search': search,
					'customFilter': customFilter
				});
			});

			if (vm.isDefaultFilter) { // Se é um filtro padrão
				$totvsprofile.remote.set('/dts/mpd/internalsalesorders', { dataCode: '$defaultfilter', 'dataValue': customFilter });
			} else if (wasDefaultFilter) { // Se era um filtro padrão e o usuário desmarcou, elimina das preferencias
				$totvsprofile.remote.remove('/dts/mpd/internalsalesorders', '$defaultfilter');
			}

		};

		vm.clear = function clear() {
			vm.model = {};
		};

		vm.close = function close() {
			$modalInstance.dismiss();
		};

		/**
		 * Converte os campos de filtro (inputs) para o padrão de objeto de um disclaimer.
		 * @return {}
		 */
		function parseFiltersToDisclaimers() {
			var filters = [];

			for (var property in vm.model) {
				if (vm.model.hasOwnProperty(property) && vm.model[property]) {
					switch (property) {
						case 'iOrder':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-initial-nr-pedido')));
							break;
						case 'fOrder':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-final-nr-pedido')));
							break;
						case 'iCustomerOrder':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-initial-nr-customer-order')));
							break;
						case 'fCustomerOrder':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-final-nr-customer-order')));
							break;
						case 'iShortName':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-initial-short-name')));
							break;
						case 'fShortName':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-final-short-name')));
							break;
						case 'iIssueDate':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-initial-dt-emiss'), 'date'));
							break;
						case 'fIssueDate':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-final-dt-emiss'), 'date'));
							break;
						case 'iAddedDate':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-initial-dt-impl'), 'date'));
							break;
						case 'fAddedDate':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-final-dt-impl'), 'date'));
							break;
						case 'iDeliveryDate':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-initial-dt-entrega'), 'date'));
							break;
						case 'fDeliveryDate':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-final-dt-entrega'), 'date'));
							break;
						case 'iSite':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-initial-site')));
							break;
						case 'fSite':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-final-site')));
							break;
						case 'iAdditionUser':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-initial-addition-user')));
							break;
						case 'fAdditionUser':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-final-addition-user')));
							break;
						case 'iPurchaseOrder':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-nr-ordem-start')));
							break;
						case 'fPurchaseOrder':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-nr-ordem-end')));
							break;
						case 'iAbrevRepresentant':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-abrev-representant-start')));							
							break;
						case 'fAbrevRepresentant':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-abrev-representant-end')));							
							break;	
						case 'iRepresentant':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-representant-start')));							
							break;
						case 'fRepresentant':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-representant-end')));							
							break;			
						case 'onlyPortal':
							filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-only-portal'), 'boolean'));
							break;
						case 'tag.status':
							switch (vm.model[property]) {
								case '1':
									filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-status-order-9'), 'boolean'));
									break;
								case '2':
									filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-status-order-4'), 'boolean'));
									break;
								case '3':
									filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-status-order-5'), 'boolean'));
									break;
								case '4':
									filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-status-order-6'), 'boolean'));
									break;
								case '5':
									filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-status-order-7'), 'boolean'));
									break;
								case '6':
									filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-status-order-8'), 'boolean'));
									break;
								case '7':
									filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-status-order-10'), 'boolean'));
									break;
								case '8':
									filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-status-cotation-lead'), 'boolean'));
									break;
							}
							break;
					}
				}
			}

			return filters;
		}

		vm.init();
	}

	internalSalesOrdersHelper.$inject = ['$filter'];
	function internalSalesOrdersHelper($filter) {
		return {
			addFilter: function(property, value, title, type, hide) {
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

			/**
			 * Converte os disclaimers para um objeto contendo os respectivos valores.
			 * @param  {Array}  disclaimers Disclaimers que serão convertidos
			 * @return {Object} Objeto contendo os disclaimers convertidos da seguinte forma: object[disclaimer.property] = disclaimer.value
			 */
			parseDisclaimersToFilter: function(disclaimers) {
				disclaimers = disclaimers || [];
				var filters = {};
				disclaimers.forEach(function(disclaimer) {
					filters[disclaimer.property] = disclaimer.value;
				});
				return filters;
			},

			/**
			 * Transforma os disclaimers em parâmetros para a API
			 * @param  {Array}  disclaimers Disclaimers que serão convertidos em filtros para a API
			 * @return {Object} filtros para a API
			 */
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

	modalAdvancedSearch.$inject = ['$modal'];
	function modalAdvancedSearch($modal) {
		/**
		 * Abre a modal de pesquisa avançada
		 * @param  {Object} params Parâmetros que deverão ser passados para o controller da modal
		 * @return {Promise}       Retorna a instância da modal
		 */
		this.open = function(params) {
			var instance = $modal.open({
				templateUrl: '/dts/mpd/html/internalsalesorders/internalsalesorders.advanced.search.html',
				controller: 'mpd.internalsalesorders.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: {
					parameters: function() {
						return params;
					}
				}
			});

			return instance.result;
		};
	}

	internalSalesOrderItemsCtrl.$inject = ['mpd.fchdis0046.Factory'];
	function internalSalesOrderItemsCtrl(orderSummaryApdFactory) {
		var internalSalesOrderItemsCtrl = this;

		this.getItems = function(order) {
			if (order) {
				if (order['nr-pedido']) {
					orderSummaryApdFactory.getInternalSalesOrderItems({
						'short_name': order['nome-abrev'],
						'customer_order': order['nr-pedcli']
					}, function(result) {
						internalSalesOrderItemsCtrl.orderItemList = result;
					});
				}
			}
		};
	}

	index.register.service('mpd.internalsalesorders.helper', internalSalesOrdersHelper);
	index.register.service('mpd.internalsalesorders.modal.advanced.search', modalAdvancedSearch);
	index.register.controller('mpd.internalsalesorders.list.control', internalSalesOrdersListController);
	index.register.controller('salesorder.internalSalesOrderItems.Controller', internalSalesOrderItemsCtrl);
	index.register.controller('mpd.internalsalesorders.advanced.search.control', internalSalesOrdersAdvancedSearchController);
});
