/*global angular */
define(['index',
	'less!/dts/mpd/assets/css/portalvendas.less',
	'less!/dts/mpd/assets/css/modalimage.less',
	'less!/dts/mpd/assets/css/customersummary.less',
	'/dts/mpd/js/api/fchdisdbo.js'], function (index) {

		booleanI18N.$inject = ['$filter'];

		function booleanI18N($filter) {

			return function (sentence, param) {
				if (sentence) {
					return $filter('i18n')('l-yes');
				} else {
					return $filter('i18n')('l-no');
				}
			};
		}
		index.register.filter('booleanI18N', booleanI18N);

		startFrom.$inject = ['$filter'];

		function startFrom() {
			return function (input, start) {
				start = +start; //parse to int
				return input.slice(start);
			}
		}
		index.register.filter('startFrom', startFrom);

		portalUserDataFactory.$inject = ["$http", "$rootScope"];
		function portalUserDataFactory($http, $rootScope) {

			$http.get(
				'/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/preference/menu.defaultPage'
			).success(function (data) {
				if (!data) { return; }
				$rootScope.defaultPageHome = data.prefValue;
			});

			if ($rootScope.currentuser && $rootScope.currentuser.hasOwnProperty("user-entity"))
				return $rootScope.currentuser;

			if ($rootScope.currentuser && $rootScope.currentuser.then) {
				$rootScope.currentuser.then(function () {

					if ($rootScope.currentuser && $rootScope.currentuser.hasOwnProperty("user-entity"))
						return $rootScope.currentuser;
					$http.get("/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035").then(function (result) {
						angular.extend($rootScope.currentuser, result.data[0]);
						return $rootScope.currentuser;
					});
				});

			} else {
				$http.get("/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035").then(function (result) {
					angular.extend($rootScope.currentuser, result.data[0]);
					return $rootScope.currentuser;
				});
			}

			return $rootScope.currentuser;
		}
		index.register.factory('portal.getUserData.factory', portalUserDataFactory);


		genericController.$inject = ['$filter'];
		function genericController($filter) {
			return {

				max: 10,
				orderBy: [],
				asc: [],
				filterBy: [],

				decorate: function (controller, resource) {
					angular.extend(controller, this);
					controller.resource = resource;
				},

				clearDefaultData: function (lQuickSearch) {

					this.listResult = [];
					this.totalRecords = 0;
					this.isAdvancedSearch = false;

					if (!lQuickSearch || lQuickSearch == undefined) {
						this.quickSearchText = '';
					}
				},

				addFilter: function (property, value, label, labelValue) {

					if (!labelValue) {
						if (value == null || value === undefined) {
							labelValue = $filter('i18n')('l-not-supplied');
							value = null;
						} else {
							if (value instanceof Boolean) {
								if (value == true) {
									labelValue = $filter('i18n')('l-yes');
								} else {
									labelValue = $filter('i18n')('l-no');
								}
							}
							labelValue = value.toString();
						}
					}
					this.filterBy.push({
						property: property,
						label: label,
						value: value,
						title: labelValue
					});
				},

				removeFilter: function (filter) {
					var index = this.filterBy.indexOf(filter);
					if (index != -1) {
						this.filterBy.splice(index, 1);
					}
				},

				clearFilter: function () {
					this.filterBy = [];
				},

				processResultSearch: function (result) {
					if (this.listResult === undefined)
						this.listResult = [];

					var that = this;
					that.totalRecords = 0;
					angular.forEach(result, function (value) {
						if (value && value.$length)
							that.totalRecords = value.$length;

						that.listResult.push(value);

					});
				},

				findRecords: function (start, filters) {

					if (start === null || start === undefined)
						this.listResult = [];

					var properties = [];
					var values = [];

					// Aplica os filtros
					if (filters) {
						if (filters instanceof Array) {
							angular.forEach(filters, function (filter) {
								if (filter.property) {
									properties.push(filter.property);
									values.push(filter.value);
								}
							});
						} else {
							if (filters.property) {
								properties.push(filters.property);
								values.push(filters.value);
							}
						}
					}

					var params = {
						start: start ? start : 0,
						max: this.max,
						properties: properties,
						values: values,
						orderBy: this.orderBy,
						asc: this.asc
					};

					var that = this;
					return this.resource.TOTVSQuery(params, function (result) {
						that.processResultSearch(result);
					});
				}
			};
		}
		index.register.factory('portal.generic.Controller', genericController);

		factoryMessage.$inject = ['$totvsresource'];
		function factoryMessage($totvsresource) {

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/messages/:page', { page: '@page' }, {});

			factory.getMessages = function (page, callback) {
				return this.TOTVSQuery({ page: page }, callback);
			};

			return factory;

		} // function factoryMessage ($totvsresource)
		index.register.factory('salesorder.message.Factory', factoryMessage);


		factorySalesOrders.$inject = ['$totvsresource', 'ReportService'];
		function factorySalesOrders($totvsresource, ReportService) {

			var specificResources = {
				'getOrderSummary': {
					method: 'GET',
					isArray: true,
					params: { emitente: '@emitente', repres: '@repres', iniDate: '@iniDate' },
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/ordersummary/:emitente/:repres/:iniDate',
					headers: { noCountRequest: true }
				},
				'searchOrders': {
					method: 'GET',
					isArray: true,
					params: { iniDate: '@iniDate' },
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/searchorders'
				},
				'getOrder': {
					method: 'GET',
					isArray: false,
					params: { nrPedido: '@nrPedido' },
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/order/:nrPedido'
				},
				'getOrderHistory': {
					method: 'GET',
					isArray: true,
					params: { nrPedido: '@nrPedido' },
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/history/:nrPedido'
				},
				'newCopy': {
					method: 'GET',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/newcopy'
				},
				'copy': {
					method: 'GET',
					isArray: false,
					params: { nrPedido: '@nrPedido' },
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/copy/:nrPedido'
				},
				'getNewOrder': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/new/:nrPedido',
					params: { idiModel: '@idiModel', nrPedido: '@nrPedido', nrPedcli: '@nrPedcli' }
				},
				'getNewOrder01': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/new01/:nrPedido',
					params: { idiModel: '@idiModel', nrPedido: '@nrPedido', nrPedcli: '@nrPedcli' }
				},
				'saveOrderHeader': {
					method: 'PUT',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/header/:nrPedido',
					params: { nrPedido: '@nrPedido' }
				},
				'getOrderHeader': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/header/:nrPedido',
					params: { nrPedido: '@nrPedido' }
				},
				'getOrderParam': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/getOrderParam'
				},
				'saveOrderItem': {
					method: 'PUT',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/item/:nrPedido/:nrSeq/:itemCode/:itemRef',
					params: { nrPedido: '@nrPedido', nrSeq: '@nrSeq', itemCode: '@itemCode', itemRef: '@itemRef' }
				},
				'getOrderItem': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/item/:nrPedido/:nrSeq/:itemCode/:itemRef',
					params: { nrPedido: '@nrPedido', nrSeq: '@nrSeq', itemCode: '@itemCode', itemRef: '@itemRef' }
				},
				'leaveOrder': {
					method: 'PUT',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/change/:nrPedido',
					params: { nrPedido: '@nrPedido' }
				},
				'leaveOrderItem': {
					method: 'PUT',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/changeitem/:nrPedido/:nrSeq/:itemCode/:itemRef',
					params: { nrPedido: '@nrPedido', nrSeq: '@nrSeq', itemCode: '@itemCode', itemRef: '@itemRef' }
				},
				'deleteOrderItem': {
					method: 'DELETE',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/item/:nrPedido/:nrSeq/:itemCode/:itemReference',
					params: { nrPedido: '@nrPedido', nrSeq: '@nrSeq', itemCode: '@itemCode', itemReference: '@itemReference' }
				},
				'addOrderItem': {
					method: 'POST',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/item/:nrPedido',
					params: { nrPedido: '@nrPedido' }
				},
				'recalculateOrder': {
					method: 'PUT',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/recalculate/:nrPedido',
					params: { nrPedido: '@nrPedido' }
				},
				'saveOrderPayTerm': {
					method: 'PUT',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/payterm/:nrPedido',
					params: { nrPedido: '@nrPedido', payterm: '@payterm' }
				},
				'processOrder': {
					method: 'PUT',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/process/:nrPedido',
					params: { nrPedido: '@nrPedido' }
				},
				'cancelOrder': {
					method: 'PUT',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/cancel/:nrPedido',
					params: { nrPedido: '@nrPedido', motivo: '@motivo' }
				},
				'cancelOrderItem': {
					method: 'PUT',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/itemcancel/:nrPedido/:nrSeq/:itemCode/:itemReference',
					params: { nrPedido: '@nrPedido', nrSeq: '@nrSeq', itemCode: '@itemCode', itemReference: '@itemReference', motivo: '@motivo' }
				},
				'valNewOrderNo': {
					method: 'GET',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/validate',
					params: { customerId: '@customerId', newCustOrderNo: '@newCustOrderNo' }
				},
				'getEstabAtend': {
					method: 'GET',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/getEstabAtend/:nrPedido/:nomeAbrev/:itCodigo/:codRefer',
					params: { nrPedido: '@nrPedido', nomeAbrev: '@nomeAbrev', itCodigo: '@itCodigo', codRefer: '@codRefer' }
				},
				'leaveEstabAtend': {
					method: 'GET',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/leaveEstabAtend/:nomeAbrev/:nrPedcli/:codEntrega/:estabAtendItem/:itCodigo',
					params: { nomeAbrev: '@nomeAbrev', nrPedcli: '@nrPedcli', codEntrega: '@codEntrega', estabAtendItem: '@estabAtendItem', itCodigo: '@itCodigo' }
				},
				'printOrder': {
					method: 'POST',
					isArray: false,
					url: '/dts/datasul-rest/resources/birt/:reportname',
					params: { reportname: '@reportname' }
				},
				'validateOrderItem': {
					method: 'PUT',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/validateitem',
					params: { nrPedido: '@nrPedido' }
				},
				'addOrderItemConfigured': {
					method: 'PUT',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/itemConfigured/:nrEstrut',
					params: { nrEstrut: '@nrEstrut' }
				},
				//PESO NO PEDIDO
				'orderItemsWeight': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/orderItemsWeight/:nrPedido',
					params: { nrPedido: '@nrPedido' }
				},
				'getParametersFunctions': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/parametersFunctions'
				},
				'getOrderSource': {
					method: 'GET',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/getOrderSource/:nrPedido',
					params: { nrPedido: '@nrPedido' }
				},
				'freightSimulation': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/freightSimulation',
					params: { vehicleType: '@vehicleType', freightClass: '@freightClass', operationType: '@operationType', considNegoc: '@considNegoc', nrPedido: '@nrPedido' }
				},
				'saveFreightSimulation': {
					method: 'POST',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/saveFreightSimulation/:nrPedido',
				},
				'getRejectOrders': {
					method: 'GET',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/rejectOrders',
					params: { iDateFilter: '@iDateFilter' }
				},
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/:method', {}, specificResources);

			factory.getPrintUrl = function (params, callback) {

				ReportService.run('mpd/rel_salesorder', {
					format: 'PDF',
					program: '/report/mpd/mpd0002',
					resultFileName: "Pedido " + params,
					orderId: params,
					printFullDescription: "false",
					detailDeliveries: "false",
					detailItemComposition: "false",
					measureUnit: "0",
					validatePrintOrder: "false"
				}, {});

				/*
				factory.printOrder(
					{reportname: 'SalesOrderReport.xml'},
					[
						[
							{"id": "printFullDescription",		"value": "false"},
							{"id": "detailDeliveries",			"value": "false"},
							{"id": "detailItemComposition",		"value": "false"},
							{"id": "measureUnit",				"value": "0"}
						],
						[
							{"id": "order" + orderId,"value": orderId}
						]
					],
					function (result) {
						callback("/dts/datasul-rest/resources/birt/" + result.reportName);
					}
				);
				*/
			};

			return factory;

		} // function factorySalesOrders(genericFactory)
		index.register.factory('salesorder.salesorders.Factory', factorySalesOrders);

		factoryQuotations.$inject = ['$totvsresource', 'ReportService'];
		function factoryQuotations($totvsresource, ReportService) {

			var specificResources = {
				'getQuotationParam': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0065/getQuotationParam'
				},
				'getQuotation': {
					method: 'GET',
					isArray: false,
					params: { nrPedido: '@nrPedido' },
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0065/quotation/:nrPedido'
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0065/:method', {}, specificResources);

			factory.getPrintUrl = function (params, callback) {
				ReportService.run('mpd/rel_quotation', {
					format: 'PDF',
					program: '/report/mpd/mpd0002',
					resultFileName: "Cotação " + params,
					orderId: params,
					printFullDescription: "false",
					detailDeliveries: "false",
					detailItemComposition: "false",
					measureUnit: "0",
					validatePrintOrder: "false"
				}, {});
			};

			return factory;

		} // function factoryQuotations(genericFactory)
		index.register.factory('quotation.quotations.Factory', factoryQuotations);

		factoryCustomer.$inject = ['$totvsresource'];
		function factoryCustomer($totvsresource, genericService) {

			var specificResources = {
				'getCustomerName': {
					method: 'GET',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/name'
				},
				'getCustomerDetails': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/details/:codEmitente',
					params: { codEmitente: '@codEmitente' }
				},
				'getCustomerContacts': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/contacts/:codEmitente',
					params: { codEmitente: '@codEmitente' }
				},
				'getCustomerDeliveryPlaces': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/deliveryplaces/:codEmitente',
					params: { codEmitente: '@codEmitente' }
				},
				'getCustomerSites': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/sites/:codEmitente',
					params: { codEmitente: '@codEmitente' }
				},
				'getCustomerInformers': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/informers/:codEmitente',
					params: { codEmitente: '@codEmitente' }
				},
				'getCustomerItens': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/items/:codEmitente',
					params: { codEmitente: '@codEmitente' }
				},
				'getCustomerSummary': {
					method: 'PUT',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/summary',
					headers: { noCountRequest: true }
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036', {}, specificResources);

			return factory;
		}
		index.register.factory('salesorder.customer.Factory', factoryCustomer);

		factorySalesGoals.$inject = ['$totvsresource'];
		function factorySalesGoals($totvsresource) {

			var specificResources = {
				'getSalesGoalsSummary': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0040/summary/:siteId/:refdate',
					params: { siteId: '@siteId', refdate: '@refdate' },
					headers: { noCountRequest: true }
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0040/:method', {}, specificResources);

			return factory;

		} // function factorySalesGoals(genericFactory)
		index.register.factory('salesorder.salesgoals.Factory', factorySalesGoals);

		factoryAppCustomerSales.$inject = ['$totvsresource'];
		function factoryAppCustomerSales($totvsresource) {

			var specificResources = {
				'getItemsFromClient': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0060/getItemsFromClient/',
					params: { emitId: '@emitId', repId: '@repId' },
					headers: { noCountRequest: true }
				},
				'getPaymentConditionFromClient': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0060/getPaymentConditionFromClient/',
					params: { emitId: '@emitId', repId: '@repId' },
					headers: { noCountRequest: true }
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0060/:method', {}, specificResources);

			return factory;

		} // function factorySalesGoals(genericFactory)
		index.register.factory('salesorder.appCustomerSales.Factory', factoryAppCustomerSales);


		factoryInvoices.$inject = ['$totvsresource'];
		function factoryInvoices($totvsresource) {

			var specificResources = {
				'getInvoiceSummary': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0043/summary/:iniDate',
					params: { iniDate: '@iniDate', endDate: '@endDate' },
					headers: { noCountRequest: true }
				},
				'getInvoiceItems': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0043/items/:siteid/:series/:invoiceNumber',
					params: { siteid: '@siteid', series: '@series', invoiceNumber: '@invoiceNumber' }
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0043', {}, specificResources);

			return factory;

		} // function factoryInvoices(genericFactory)
		index.register.factory('salesorder.invoices.Factory', factoryInvoices);


		factoryScheduleSummary.$inject = ['$totvsresource'];
		function factoryScheduleSummary($totvsresource) {

			var specificResources = {
				'updateSchedule': {
					method: 'PUT',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0041/:cdnEmitente/:datAgenda'
				},
				'deleteSchedule': {
					method: 'DELETE',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0041/:cdnEmitente/:datAgenda'
				},
				'add': {
					method: 'POST',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0041'
				},
				'getSummary': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0041/summary',
					headers: { noCountRequest: true }
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0041', {}, specificResources);

			return factory;
		} // function factoryScheduleSummary (genericFactory, factoryResourceLoader)
		index.register.factory('salesorder.schedule.Factory', factoryScheduleSummary);

		factoryCustomerBill.$inject = ['$totvsresource'];
		function factoryCustomerBill($totvsresource) {

			var specificResources = {
				'getCustomerBillSummary': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0044/summary/:emitente/:repres/:dataini/:datafim',
					params: { emitente: '@emitente', repres: '@repres', dataini: '@dataini', datafim: '@datafim' },
					headers: { noCountRequest: true }
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0044', {}, specificResources);

			return factory;

		} // function factoryCustomerBill(genericFactory)
		index.register.factory('salesorder.customerbill.Factory', factoryCustomerBill);

		factorySalesCharge.$inject = ['$totvsresource'];
		function factorySalesCharge($totvsresource) {

			var specificResources = {
				'getSalesChargeSummary': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0042/summary/:emitente/:repres/:dataini/:datafim',
					params: { emitente: '@emitente', repres: '@repres', dataini: '@dataini', datafim: '@datafim' },
					headers: { noCountRequest: true }
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0042', {}, specificResources);

			return factory;

		} // function factorySalesCharge(genericFactory)
		index.register.factory('salesorder.salescharge.Factory', factorySalesCharge);

		factoryPrices.$inject = ['$totvsresource'];
		function factoryPrices($totvsresource) {

			var specificResources = {
				'getRelatedPrice': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0038/pricesrelated/:nrPedido/:itemCode/:itemReference',
					params: { nrPedido: '@nrPedido', itemCode: '@itemCode', itemReference: '@itemReference' }
				},
				'getRelatedPriceWithNoCountRequest': {
					method: 'GET',
					isArray: true,
					headers: { noCountRequest: true },
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0038/pricesrelated/:nrPedido/:itemCode/:itemReference',
					params: { nrPedido: '@nrPedido', itemCode: '@itemCode', itemReference: '@itemReference' }
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0045', {}, specificResources);

			return factory;

		} // function factoryPrices($resource)
		index.register.factory('salesorder.prices.Factory', factoryPrices);

		factoryProducts.$inject = ['$totvsresource'];
		function factoryProducts($totvsresource) {

			var specificResources = {
				'getItemsRelated': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0038/related/:nrPedido/:itCodigo/:nrTabPreco',
					params: { nrPedido: '@nrPedido', itCodigo: '@itCodigo', nrTabPreco: '@nrTabPreco' }
				},
				'getItemsEquivalent': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0038/equivalent/:nrPedido/:itCodigo/:nrTabPreco',
					params: { nrPedido: '@nrPedido', itCodigo: '@itCodigo', nrTabPreco: '@nrTabPreco' }
				},
				'getItemDetails': {
					method: 'GET',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0038/details/:itCodigo/:codRefer',
					params: { itCodigo: '@itCodigo', codRefer: '@codRefer' }
				},
				'getItemBalance': {
					method: 'PUT',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0038/balance/:pStart/:nrPedido',
					params: { pStart: '@pStart', nrPedido: '@nrPedido' },
					headers: { noCountRequest: true }
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0038', {}, specificResources);

			return factory;

		} // function factoryInvoices(genericFactory)

		index.register.factory('salesorder.products.Factory', factoryProducts);


		factoryModel.$inject = ['$totvsresource'];

		function factoryModel($totvsresource) {

			var specificResources = {
				'createModel': {
					method: 'POST',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0037/createmodel/:nrPedido',
					params: { nrPedido: '@nrPedido' }
				},
				'getModels': {
					method: 'GET',
					isArray: true
				},
				'favorite': {
					method: 'PUT',
					isArray: false,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0037/:idiModel',
					params: { idiModel: '@idiModel', favorite: '@favorite' }
				},
				'getModelItens': {
					method: 'GET',
					isArray: true,
					url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0037/item/:idModel',
					params: { idModel: '@idModel' }
				}
			};

			var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0037', {}, specificResources);

			return factory;
		}

		index.register.factory('salesorder.model.Factory', factoryModel);


		serviceZoomEstabelecimento.$inject = ['$timeout', '$totvsresource'];

		function serviceZoomEstabelecimento($timeout, $totvsresource) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad107na/:method/:siteId', { fields: "cod-estabel,nome,cidade,estado" }),

				zoomName: 'l-estabel',

				propertyFields: [{ label: 'l-code', property: 'cod-estabel', default: true },
				{ label: 'l-nome', property: 'nome' },
				{ label: 'l-cidade', property: 'cidade' },
				{ label: 'l-estado', property: 'estado' }],

				tableHeader: [{ label: 'l-code', property: 'cod-estabel' },
				{ label: 'l-nome', property: 'nome' },
				{ label: 'l-cidade', property: 'cidade' },
				{ label: 'l-estado', property: 'estado' }],

				getObjectFromValue: function (value, init) {
					if (value === "" || value === undefined || value === null) return;
					return this.resource.TOTVSGet({ siteId: value }, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {

					var that = this;
					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					if (parameters.isSelectValue) {
						queryproperties.siteId = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'cod-estabel,nome';

					} else {
						if (value != "") {
							queryproperties.property.push(field);
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.init) {
						queryproperties.property.push('cod-estabel');
						queryproperties.value.push(parameters.init.replace(/,/g, '|'));
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if (!parameters.more) that.zoomResultList = [];
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomEstabelecimento.Service', serviceZoomEstabelecimento);

		serviceZoomEmitente.$inject = ['$timeout', '$totvsresource', '$rootScope'];
		function serviceZoomEmitente($timeout, $totvsresource, $rootScope) {

			var service = {

				resource: $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/'),

				zoomName: $rootScope.i18n('l-emitente', undefined, 'dts/mpd'),

				propertyFields: [{
					label: $rootScope.i18n('l-cod-emitente', undefined, 'dts/mpd'),
					property: 'cod-emitente',
					default: true
				}, {
					label: $rootScope.i18n('l-nome-abrev', undefined, 'dts/mpd'),
					property: 'nome-abrev'
				}],
				tableHeader: [{
					label: $rootScope.i18n('l-cod-emitente', undefined, 'dts/mpd'),
					property: 'cod-emitente'
				},
				{
					label: $rootScope.i18n('l-nome-abrev', undefined, 'dts/mpd'),
					property: 'nome-abrev'
				},
				{
					label: $rootScope.i18n('l-cgc-zoom', undefined, 'dts/mpd'),
					property: 'cgc'
				},
				{
					label: $rootScope.i18n('l-nome-emit', undefined, 'dts/mpd'),
					property: 'nome-emit'
				},
				{
					label: $rootScope.i18n('l-cod-gr-cli', undefined, 'dts/mpd'),
					property: 'cod-gr-cli'
				},
				{
					label: $rootScope.i18n('l-nome-matriz', undefined, 'dts/mpd'),
					property: 'nome-matriz'
				}],
				getObjectFromValue: function (value) {
					if (value === "" || value === undefined || value === null)
						return;
					return this.resource.TOTVSGet({ property: 'cod-emitente', value: value }, undefined, { noErrorMessage: true, noCountRequest: true }, true);
				},
				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					var queryproperties = { max: 10 };

					if (value != undefined) {

						if (parameters.isSelectValue) {
							queryproperties.properties = 'simpleFilter';
							queryproperties.values = value;
						} else {
							if ((field == "cod-emitente") && (value > 0)) {
								queryproperties.properties = field;
								queryproperties.values = value;
							} else {
								queryproperties.properties = field;
								queryproperties.values = "*" + value + "*";
							}
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					//Status de inicio do zoom, não deve apresentar a interface de bloqueio para load (loading)
					if (queryproperties.properties == 'simpleFilter' && queryproperties.values == '') that.noLoadingView = true;
					else that.noLoadingView = false;

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if (!parameters.more)
							that.zoomResultList = [];
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noCountRequest: that.noLoadingView });
				}
			};
			return service;
		}

		index.register.service('salesorder.zoomEmitente.Service', serviceZoomEmitente);

		serviceZoomCondicaoPagamento.$inject = ['$timeout', '$totvsresource', '$q', '$rootScope', 'mpd.fchdisdbo.Factory'];

		function serviceZoomCondicaoPagamento($timeout, $totvsresource, $q, $rootScope, fchdisdbo) {

			var service = {

				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad039pv/:gotomethod/:id', { fields: "cod-cond-pag,descricao,log-cond-pagto-mais-negoc" }),

				zoomName: 'l-condicao-pagamento',

				propertyFields: [{
					label: 'l-code',
					property: 'cod-cond-pag'
				},
				{
					label: 'l-description',
					property: 'descricao',
					default: true
				}],

				tableHeader: [{
					label: 'l-code',
					property: 'cod-cond-pag'
				},
				{
					label: 'l-description',
					property: 'descricao'
				}],

				getObjectFromValue: function (value) {
					if (value) {
						if (service.zoomResultList && service.zoomResultList.length > 0) {
							return $q(function (resolve, reject) {
								resolve(service.zoomResultList[0]);
							});
						}
						var queryproperties = {
							where: ["cond-pagto.cod-cond-pag = INTEGER(" + value + ")"]
						};
						return $q(function (resolve, reject) {
							service.resource.TOTVSQuery(queryproperties, function (result) {
								resolve(result[0]);
							}, { noErrorMessage: true }, true);
						});
					}
				},

				applyFilter: function (parameters) {
					var that = this;
					var strQuery = "";

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.where = [];
					queryproperties.limit = that.limitZoom;
					
					if (parameters.isSelectValue) {
						strQuery = " STRING(cond-pagto.cod-cond-pag) MATCHES ('" + value + "*') OR cond-pagto.descricao MATCHES ('*" + value + "*')";

						delete queryproperties.method;
						delete queryproperties.searchfields;
						queryproperties.where.push(strQuery);
					} else {
						
						if ((field == "cod-cond-pag") && (value > 0)) {
							queryproperties.property = field;
							queryproperties.value = value;
						} else if ((field == "log-cond-pagto-mais-negoc") && (value)) {
							queryproperties.property = field;
							queryproperties.value = value.value;
						} else {
							/* Quando apertado o botao X o value acaba recebendo null,
							   fazendo com que ao "Aplicar" nao retorne as informacoes. */
							if (value == null) {
								value = "";
							}

							/* Definido 'descricao' para apresentar todos os registros
							   quando não informado um valor de busca. */
							queryproperties.property = 'descricao';
							queryproperties.value = "*" + value + "*";
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if ((!parameters.init || parameters.init.setDefaultValue) && (!parameters.selectedFilterValue)) return;

						that.zoomResultList = that.zoomResultList.concat(result);
						angular.forEach(that.zoomResultList, function (value, key) {
							switch (value['log-cond-pagto-mais-negoc']) {
								case true:
									value['log-cond-pagto-mais-negoc'] = $rootScope.i18n('l-yes', undefined, 'dts/mpd');
									break;
								case false:
									value['log-cond-pagto-mais-negoc'] = $rootScope.i18n('l-no', undefined, 'dts/mpd');
									break;							
							}
						});
						
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true });
				}
			};
			
			fchdisdbo.boad039_ReturnActiveMaisNegocios({}, function (result) {
				if (result['p-active-mais-negocios'] === true) {
					service.propertyFields.push(
						{label: 'l-more-business', property: 'log-cond-pagto-mais-negoc', propertyList: [
							{value: 'true', name: $rootScope.i18n('l-yes', undefined, 'dts/mpd')},
							{value: 'false', name: $rootScope.i18n('l-no', undefined, 'dts/mpd')}
						]}
					);
					
					service.tableHeader.push(
						{label: 'l-more-business', property: 'log-cond-pagto-mais-negoc'}
					);
				}
			});

			return service;
		}

		index.register.service('salesorder.zoomCondicaoPagamento.Service', serviceZoomCondicaoPagamento);

		serviceZoomNaturezaOperacao.$inject = ['$timeout', '$totvsresource', '$q'];

		function serviceZoomNaturezaOperacao($timeout, $totvsresource, $q) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin245/:id', { fields: "nat-operacao,denominacao,narrativa,aliquota-icm,cd-situacao,tipo,cd-trib-icm,cd-trib-ipi,cod-cfop" }),

				zoomName: 'l-natur-oper',
				propertyFields: [{
					label: 'l-natur-oper',
					property: 'nat-operacao',
					default: true
				},
				{
					label: 'l-description',
					property: 'denominacao'
				}],

				tableHeader: [{
					label: 'l-natur-oper',
					property: 'nat-operacao'
				},
				{
					label: 'l-description',
					property: 'denominacao'
				}],

				getObjectFromValue: function (value) {
					if (value) {
						if (service.zoomResultList && service.zoomResultList.length > 0) {
							return $q(function (resolve, reject) {
								resolve(service.zoomResultList[0]);
							});
						}
						var queryproperties = {
							where: ["natur-oper.nat-operacao = " + "'" + value + "'"]
						};
						return $q(function (resolve, reject) {
							service.resource.TOTVSQuery(queryproperties, function (result) {
								resolve(result[0]);
							}, { noErrorMessage: true }, true);
						});
					}
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};

					queryproperties.where = [];
					queryproperties.limit = that.limitZoom;

					if (parameters.isSelectValue) {
						strQuery = "natur-oper.nat-operacao MATCHES ('" + parameters.selectedFilterValue + 
								   "*') OR natur-oper.denominacao MATCHES ('*" + parameters.selectedFilterValue + "*')";

						delete queryproperties.method;
						delete queryproperties.searchfields;
						queryproperties.where.push(strQuery);
					} else {
						queryproperties.property = field;
						queryproperties.value = "*" + value + "*";
					}
					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if ((!parameters.init || parameters.init.setDefaultValue) && (!parameters.selectedFilterValue)) return;
							
						if (result) {
							that.zoomResultList = that.zoomResultList.concat(result);
							$timeout(function () {
								if (result.length > 0) {
									that.resultTotal = result[0].$length;
								} else {
									that.resultTotal = 0;
								}
							}, 0);
						}
					}, { noErrorMessage: true }, false);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomNatOperacao.Service', serviceZoomNaturezaOperacao);


		serviceZoomCanalVenda.$inject = ['$timeout', '$totvsresource'];
		function serviceZoomCanalVenda($timeout, $totvsresource) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi232na/:method/:id', { fields: "cod-canal-venda,descricao" }),

				getIdField: function () {
					return 'cod-canal-venda';
				},

				zoomName: 'l-canal-venda',

				propertyFields: [{
					label: 'l-code',
					property: 'cod-canal-venda'
				},
				{
					label: 'l-description',
					property: 'descricao',
					default: true
				}],

				tableHeader: [{
					label: 'l-code',
					property: 'cod-canal-venda'
				},
				{
					label: 'l-description',
					property: 'descricao'
				}],

				zoomResultList: [],

				getObjectFromValue: function (value) {
					if (value === "" || value === undefined || value === null) return;
					return this.resource.TOTVSGet({ id: value }, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {

					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};

					if (parameters.isSelectValue) {
						queryproperties.id = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'cod-canal-venda,descricao';

					} else {

						if ((field == "cod-canal-venda") && (value > 0)) {
							queryproperties.property = field;
							queryproperties.value = value;
						} else {
							queryproperties.property = field;
							queryproperties.value = "*" + value + "*";
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomCanalVenda.Service', serviceZoomCanalVenda);


		serviceZoomLocalEntrega.$inject = ['$timeout', '$totvsresource', '$q'];
		function serviceZoomLocalEntrega($timeout, $totvsresource, $q) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi102na/:nomeAbrev/:id', { fields: "cod-entrega,endereco,bairro,cidade,estado,cep,caixa-postal" }),

				zoomName: 'l-local-entrega',

				propertyFields: [{
					label: 'l-code',
					property: 'cod-entrega',
					default: true
				},
				{
					label: 'l-endereco',
					property: 'endereco'
				},
				{
					label: 'l-bairro',
					property: 'bairro'
				},
				{
					label: 'l-cidade',
					property: 'cidade'
				},
				{
					label: 'l-estado',
					property: 'estado'
				},
				{
					label: 'l-cep',
					property: 'cep'
				},
				{
					label: 'l-caixa-postal',
					property: 'caixa-postal'
				}],


				tableHeader: [{
					label: 'l-code',
					property: 'cod-entrega'
				},
				{
					label: 'l-endereco',
					property: 'endereco'
				},
				{
					label: 'l-bairro',
					property: 'bairro'
				},
				{
					label: 'l-cidade',
					property: 'cidade'
				},
				{
					label: 'l-estado',
					property: 'estado'
				},
				{
					label: 'l-cep',
					property: 'cep'
				},
				{
					label: 'l-caixa-postal',
					property: 'caixa-postal'
				}],

				getObjectFromValue: function (value) {
					if (value) {
						if (service.zoomResultList && service.zoomResultList.length > 0) {
							return $q(function (resolve, reject) {
								resolve(service.zoomResultList[0]);
							});
						}
						var queryproperties = {
							where: ["loc-entr.cod-entrega = " + "'" + value + "'"]
						};
						return $q(function (resolve, reject) {
							service.resource.TOTVSQuery(queryproperties, function (result) {
								resolve(result[0]);
							}, { noErrorMessage: true }, true);
						});
					}
				},

				applyFilter: function (parameters) {

					if (parameters.init == undefined) return undefined;
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					queryproperties.property.push('nome-abrev');
					queryproperties.value.push(parameters.init);

					var strQuery = "";

					queryproperties.where = [];
					queryproperties.limit = that.limitZoom;

					if (parameters.isSelectValue) {
						strQuery = "loc-entr.cod-entrega MATCHES ('*" + value + "*')";

						delete queryproperties.method;
						delete queryproperties.searchfields;
						queryproperties.where.push(strQuery);
					} else {
						if ((field == "cod-entrega") && (value > 0)) {
							queryproperties.property.push(field);
							queryproperties.value.push(value);
						} else {
							queryproperties.property.push(field);
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if (!parameters.more) that.zoomResultList = [];
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}

		index.register.service('salesorder.zoomLocalEntrega.Service', serviceZoomLocalEntrega);

		serviceZoomPais.$inject = ['$timeout', '$totvsresource'];
		function serviceZoomPais($timeout, $totvsresource) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/unbo/boun006na/:method/:gotomethod/:id', { fields: "cod-pais,nome-pais" }),

				zoomName: 'l-pais',

				propertyFields: [{
					label: 'l-code',
					property: 'cod-pais'
				},
				{
					label: 'l-pais',
					property: 'nome-pais',
					default: true
				}],

				tableHeader: [{
					label: 'l-code',
					property: 'cod-pais'
				},
				{
					label: 'l-pais',
					property: 'nome-pais'
				}],

				getObjectFromValue: function (value, init) {
					if (value === "" || value === undefined || value === null) return;
					var param = { id: value };
					angular.extend(param, init);
					return this.resource.TOTVSGet(param, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};

					if (parameters.isSelectValue) {
						queryproperties.id = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'cod-pais,nome-pais';

					} else {
						if ((field == "cod-pais") && (value > 0)) {
							queryproperties.property = field;
							queryproperties.value = value;
						} else {
							queryproperties.property = field;
							queryproperties.value = "*" + value + "*";
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if (!parameters.more) that.zoomResultList = [];
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true });
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomPais.Service', serviceZoomPais);

		serviceZoomEstado.$inject = ['$timeout', '$totvsresource'];

		function serviceZoomEstado($timeout, $totvsresource) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/unbo/boun007na/:method/:pais/:id', { fields: "pais,estado,no-estado" }),

				zoomName: 'l-estado',

				propertyFields: [{
					label: 'l-pais',
					property: 'pais'
				},
				{
					label: 'l-code',
					property: 'estado'
				},
				{
					label: 'l-estado',
					property: 'no-estado',
					default: true
				}],

				tableHeader: [{
					label: 'l-pais',
					property: 'pais'
				},
				{
					label: 'l-code',
					property: 'estado'
				},
				{
					label: 'l-estado',
					property: 'no-estado'
				}],

				getObjectFromValue: function (value, init) {
					if (value === "" || value === undefined || value === null) return;
					return this.resource.TOTVSGet({ pais: init, id: value }, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {

					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					if (parameters.init) {
						queryproperties.property.push('pais');
						queryproperties.value.push(parameters.init);
					}

					if (parameters.isSelectValue) {
						queryproperties.id = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'estado,no-estado';

					} else {
						if (value) {
							queryproperties.property.push(field);
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.more) queryproperties.start = this.zoomResultList.length;
					else that.zoomResultList = [];


					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if (!parameters.more) that.zoomResultList = [];
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomEstado.Service', serviceZoomEstado);


		serviceZoomPortador.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', '$q'];

		function serviceZoomPortador($timeout, $totvsresource, $rootScope, $filter, $q) {

			var i18n = $filter('i18n');

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad209na/:gotomethod/:epCodigo/:id/:modalidade', { fields: "cod-portador,modalidade,mo-codigo,nome,nome-abrev,cod-banco" }),

				zoomName: 'l-portador',

				propertyFields: [{
					label: 'l-code',
					property: 'cod-portador'
				},
				{
					label: 'l-nome',
					property: 'nome',
					default: true
				},
				{
					label: 'l-modalidade',
					property: 'modalidade'
				},
				{
					label: 'l-banco',
					property: 'cod-banco'
				}],

				tableHeader: [{
					label: 'l-code',
					property: 'cod-portador'
				},
				{
					label: 'l-nome',
					property: 'nome'
				},
				{
					label: 'l-modalidade',
					property: 'modalidade'
				},
				{
					label: 'l-zoom-portador-modalidade-desc',
					property: 'desc-modalidade'
				},
				{
					label: 'l-banco',
					property: 'cod-banco'
				},
				{
					label: 'l-moeda',
					property: 'mo-codigo'
				},],

				getObjectFromValue: function (value) {
					if (value) {
						if (service.zoomResultList && service.zoomResultList.length > 0) {
							return $q(function (resolve, reject) {
								resolve(service.zoomResultList[0]);
							});
						}
						var queryproperties = {
							where: ["portador.cod-portador = INTEGER(" + value + ")"]
						};
						return $q(function (resolve, reject) {
							service.resource.TOTVSQuery(queryproperties, function (result) {
								resolve(result[0]);
							}, { noErrorMessage: true }, true);
						});
					}
				},

				applyFilter: function (parameters) {

					if ($rootScope.currentuser == undefined) return undefined;

					var that = this;
					var strQuery = "";

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];
					queryproperties.where = [];
					queryproperties.limit = that.limitZoom;

					queryproperties.property.push('ep-codigo');
					queryproperties.value.push($rootScope.currentuser['ep-codigo']);

					if (parameters.isSelectValue) {
						strQuery = " (STRING(portador.cod-portador) MATCHES ('" + value + "*') OR portador.nome MATCHES ('*" + value + "*'))";

						delete queryproperties.method;
						delete queryproperties.searchfields;
						queryproperties.where.push(strQuery);

						queryproperties.property.push('modalidade');
						queryproperties.value.push(parameters.init);

					} else {
						queryproperties.property.push('ep-codigo');
						queryproperties.value.push($rootScope.currentuser['ep-codigo']);

						if ((field != 'modalidade') || ((field == 'modalidade') && (value <= 0))) {
							queryproperties.property.push('modalidade');
							queryproperties.value.push("1|2|3|4|5|6|7|8|9");
						}

						queryproperties.property.push(field);

						if (field == "cod-portador" || field == "modalidade" || field == "cod-banco") {
							queryproperties.value.push(value);
						} else {
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if (!parameters.more) that.zoomResultList = [];
						that.zoomResultList = that.zoomResultList.concat(result);

						angular.forEach(that.zoomResultList, function (value, key) {
							switch (value['modalidade']) {
								case 1:
									value['desc-modalidade'] = i18n('l-zoom-portador-modalidade-1');
									break;
								case 2:
									value['desc-modalidade'] = i18n('l-zoom-portador-modalidade-2');
									break;
								case 3:
									value['desc-modalidade'] = i18n('l-zoom-portador-modalidade-3');
									break;
								case 4:
									value['desc-modalidade'] = i18n('l-zoom-portador-modalidade-4');
									break;
								case 5:
									value['desc-modalidade'] = i18n('l-zoom-portador-modalidade-5');
									break;
								case 6:
									value['desc-modalidade'] = i18n('l-zoom-portador-modalidade-6');
									break;
								case 7:
									value['desc-modalidade'] = i18n('l-zoom-portador-modalidade-7');
									break;
								case 8:
									value['desc-modalidade'] = i18n('l-zoom-portador-modalidade-8');
									break;
								case 9:
									value['desc-modalidade'] = i18n('l-zoom-portador-modalidade-9');
									break;
							}
						});

						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}

		index.register.service('salesorder.zoomPortador.Service', serviceZoomPortador);


		serviceZoomRota.$inject = ['$timeout', '$totvsresource', '$q'];
		function serviceZoomRota($timeout, $totvsresource, $q) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi181na2/:gotomethod/:id', { fields: "cod-rota,descricao" }),

				zoomName: 'l-rota',
				configuration: false,

				propertyFields: [{
					label: 'l-code',
					property: 'cod-rota',
					default: true
				},
				{
					label: 'l-description',
					property: 'descricao'
				}],

				tableHeader: [{
					label: 'l-code',
					property: 'cod-rota'
				},
				{
					label: 'l-description',
					property: 'descricao'
				}],

				getObjectFromValue: function (value) {
					if (value) {
						if (service.zoomResultList && service.zoomResultList.length > 0) {
							return $q(function (resolve, reject) {
								resolve(service.zoomResultList[0]);
							});
						}
						var queryproperties = {
							where: ["rota.cod-rota = " + "'" + value + "'"]
						};
						return $q(function (resolve, reject) {
							service.resource.TOTVSQuery(queryproperties, function (result) {
								resolve(result[0]);
							}, { noErrorMessage: true }, true);
						});
					}
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					var strQuery = "";

					queryproperties.where = [];
					queryproperties.limit = that.limitZoom;

					if (parameters.isSelectValue) {
						strQuery = "rota.cod-rota MATCHES ('" + value + "*') OR rota.descricao MATCHES ('*" + value + "*')";

						delete queryproperties.method;
						delete queryproperties.searchfields;
						queryproperties.where.push(strQuery);
					} else {
						if (value) {
							queryproperties.property.push(field);

							if (field == 'cod-rota') {
								queryproperties.value.push(value + "*");
							} else {
								queryproperties.value.push("*" + value + "*");
							}
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if ((queryproperties.start == undefined) && (that.zoomResultList.length == 10)) return;
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomRota.Service', serviceZoomRota);

		serviceZoomTransportador.$inject = ['$timeout', '$totvsresource', '$q'];
		function serviceZoomTransportador($timeout, $totvsresource, $q) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad268na/:gotomethod/:id', { fields: "cod-transp,nome,nome-abrev,cgc" }),

				zoomName: 'l-transportador',

				propertyFields: [{
					label: 'l-code',
					property: 'cod-transp'
				},
				{
					label: 'l-transportador',
					property: 'nome-abrev',
					default: true
				},
				{
					label: 'l-nome',
					property: 'nome'
				},
				{
					label: 'l-cgc-zoom',
					property: 'cgc'
				}],

				tableHeader: [{
					label: 'l-code',
					property: 'cod-transp'
				},
				{
					label: 'l-transportador',
					property: 'nome-abrev'
				},
				{
					label: 'l-nome',
					property: 'nome'
				},
				{
					label: 'l-cgc-zoom',
					property: 'cgc'
				}],

				getObjectFromValue: function (value) {
					if (value) {
						if (service.zoomResultList && service.zoomResultList.length > 0) {
							return $q(function (resolve, reject) {
								resolve(service.zoomResultList[0]);
							});
						}
						var queryproperties = {
							where: ["transporte.nome-abrev = " + "'" + value + "'"]
						};
						return $q(function (resolve, reject) {
							service.resource.TOTVSQuery(queryproperties, function (result) {
								resolve(result[0]);
							}, { noErrorMessage: true }, true);
						});
					}
				},

				applyFilter: function (parameters) {
					var that = this;
					var strQuery = "";

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};

					queryproperties.property = [];
					queryproperties.value = [];
					queryproperties.where = [];
					queryproperties.limit = that.limitZoom;

					if (parameters.isSelectValue) {
						strQuery = "transporte.cod-transp MATCHES ('" + value + "*') OR transporte.nome-abrev MATCHES ('*" + value + "*')" +
							" OR nome MATCHES ('*" + value + "*') OR cgc MATCHES ('*" + value + "*')";

						delete queryproperties.method;
						delete queryproperties.searchfields;
						queryproperties.where.push(strQuery);

					} else {
						queryproperties.property.push(field);
						if (field == "cod-transp") {
							queryproperties.value.push(value);
						} else {
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if ((queryproperties.start == undefined) && (that.zoomResultList.length == 10)) return;
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};
			return service;
		}
		index.register.service('salesorder.zoomTransportador.Service', serviceZoomTransportador);


		serviceZoomUnidadeMedida.$inject = ['$timeout', '$totvsresource'];
		function serviceZoomUnidadeMedida($timeout, $totvsresource) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin417na/:method/:id', { fields: "un,descricao" }),

				zoomName: 'l-unidade-medida',

				propertyFields: [{
					label: 'l-unidade-medida',
					property: 'un',
					default: true
				},
				{
					label: 'l-description',
					property: 'descricao'
				}],

				tableHeader: [{
					label: 'l-unidade-medida',
					property: 'un'
				},
				{
					label: 'l-description',
					property: 'descricao'
				}],

				getObjectFromValue: function (value) {
					if (value === "" || value === undefined || value === null) return;
					return this.resource.TOTVSGet({ id: value }, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					if (parameters.isSelectValue) {
						queryproperties.id = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'un,descricao';

					} else {
						if (value) {
							queryproperties.property.push(field);
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.more) {
						queryproperties.start = this.zoomResultList.length;
					} else {
						that.zoomResultList = [];
					}

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if ((queryproperties.start == undefined) && (that.zoomResultList.length == 10)) return;
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomUnidadeMedida.Service', serviceZoomUnidadeMedida);


		serviceZoomUnidadeNegocio.$inject = ['$timeout', '$totvsresource'];
		function serviceZoomUnidadeNegocio($timeout, $totvsresource) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin745/:method/:id', { fields: "cod-unid-negoc,des-unid-negoc" }),

				zoomName: 'l-unidade-negocio',


				propertyFields: [{
					label: 'l-code',
					property: 'cod-unid-negoc',
					default: true
				},
				{
					label: 'l-description',
					property: 'des-unid-negoc'
				}],

				tableHeader: [{
					label: 'l-code',
					property: 'cod-unid-negoc'
				},
				{
					label: 'l-description',
					property: 'des-unid-negoc'
				}],

				getObjectFromValue: function (value) {
					if (value === "" || value === undefined || value === null) return;
					return this.resource.TOTVSGet({ id: value }, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					if (parameters.isSelectValue) {
						queryproperties.id = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'cod-unid-negoc,des-unid-negoc';
					} else {
						queryproperties.property.push(field);
						if (field == 'cod-unid-negoc') {
							queryproperties.value.push(value);
						} else {
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomUnidadeNegocio.Service', serviceZoomUnidadeNegocio);


		serviceZoomCampanhaCrm.$inject = ['$timeout', '$totvsresource', '$q'];
		function serviceZoomCampanhaCrm($timeout, $totvsresource, $q) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/crmbo/boCrmCampanha/:gotomethod/:id', { fields: "num_id,nom_campanha,dat_inic,dat_term" }),

				zoomName: 'l-campanh-crm',

				propertyFields: [{
					label: 'l-code',
					property: 'num_id'
				},
				{
					label: 'l-campanh-crm',
					property: 'nom_campanha',
					default: true
				}],

				tableHeader: [{
					label: 'l-code',
					property: 'num_id'
				},
				{
					label: 'l-campanh-crm',
					property: 'nom_campanha'
				},
				{
					label: 'l-dat-inic',
					property: 'dat_inic'
				},
				{
					label: 'l-dat-term',
					property: 'dat_term'
				}],

				getObjectFromValue: function (value) {
					if (value) {
						if (service.zoomResultList && service.zoomResultList.length > 0) {
							return $q(function (resolve, reject) {
								resolve(service.zoomResultList[0]);
							});
						}
						var queryproperties = {
							where: ["crm_campanha.num_id = INTEGER(" + value + ")"]
						};
						return $q(function (resolve, reject) {
							service.resource.TOTVSQuery(queryproperties, function (result) {
								resolve(result[0]);
							}, { noErrorMessage: true }, true);
						});
					}
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];
					queryproperties.where = [];
					queryproperties.limit = that.limitZoom;

					if (parameters.isSelectValue) {
						strQuery = " STRING(crm_campanha.num_id) MATCHES ('" + value + "*') OR crm_campanha.nom_campanha MATCHES ('*" + value + "*')";

						delete queryproperties.method;
						delete queryproperties.searchfields;
						queryproperties.where.push(strQuery);
					} else {
						queryproperties.property.push(field);
						if (field == 'num_id') {
							queryproperties.value.push(value);
						} else {
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomCampanhaCrm.Service', serviceZoomCampanhaCrm);


		serviceZoomServico.$inject = ['$timeout', '$totvsresource', '$q'];
		function serviceZoomServico($timeout, $totvsresource, $q) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi185md/:gotomethod/:id', { fields: "cod-servico,descricao,ind-imprenda,aliquota-iss,desc-ser" }),

				zoomName: 'l-codigo-servico',

				propertyFields: [{
					label: 'l-code',
					property: 'cod-servico'
				},
				{
					label: 'l-description',
					property: 'descricao',
					default: true
				}],

				tableHeader: [{
					label: 'l-code',
					property: 'cod-servico'
				},
				{
					label: 'l-description',
					property: 'descricao'
				}],

				getObjectFromValue: function (value) {
					if (value) {
						if (service.zoomResultList && service.zoomResultList.length > 0) {
							return $q(function (resolve, reject) {
								resolve(service.zoomResultList[0]);
							});
						}
						var queryproperties = {
							where: ["tab-codser.cod-servico = INTEGER(" + value + ")"]
						};
						return $q(function (resolve, reject) {
							service.resource.TOTVSQuery(queryproperties, function (result) {
								resolve(result[0]);
							}, { noErrorMessage: true }, true);
						});
					}
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];
					queryproperties.where = [];
					queryproperties.limit = that.limitZoom;

					if (parameters.isSelectValue) {
						strQuery = " STRING(tab-codser.cod-servico) MATCHES ('" + value + "*') OR tab-codser.descricao MATCHES ('*" + value + "*')";

						delete queryproperties.method;
						delete queryproperties.searchfields;
						queryproperties.where.push(strQuery);
					} else {
						queryproperties.property.push(field);
						if (field == 'cod-servico') {
							queryproperties.value.push(value);
						} else {
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomServico.Service', serviceZoomServico);


		serviceZoomClassificacaoFiscal.$inject = ['$timeout', '$totvsresource'];
		function serviceZoomClassificacaoFiscal($timeout, $totvsresource) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin046b/:method/:id', { fields: "class-fiscal,descricao" }),

				zoomName: 'l-classificacao-fiscal',

				propertyFields: [{
					label: 'l-code',
					property: 'class-fiscal',
					default: true
				},
				{
					label: 'l-description',
					property: 'descricao'
				}],

				tableHeader: [{
					label: 'l-code',
					property: 'class-fiscal'
				},
				{
					label: 'l-description',
					property: 'descricao'
				}],

				getObjectFromValue: function (value) {
					if (value === "" || value === undefined || value === null) return;
					return this.resource.TOTVSGet({ id: value }, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					if (parameters.isSelectValue) {
						queryproperties.id = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'class-fiscal,descricao';
					} else {
						queryproperties.property.push(field);
						if (field == 'class-fiscal') {
							queryproperties.value.push(value);
						} else {
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomClassificacaoFiscal.Service', serviceZoomClassificacaoFiscal);

		serviceZoomTabPreco.$inject = ['$timeout', '$totvsresource', '$filter'];
		function serviceZoomTabPreco($timeout, $totvsresource, $filter) {

			var dateformat = $filter('date');
			var i18n = $filter('i18n');

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi189pv/:method/:id', { fields: "nr-tabpre,descricao,dt-inival,dt-fimval,mo-codigo,situacao" }),

				zoomName: 'l-tab-preco',

				propertyFields: [{
					label: 'l-tab-preco',
					property: 'nr-tabpre',
					default: true
				},
				{
					label: 'l-description',
					property: 'descricao'
				}],

				tableHeader: [{
					label: 'l-tab-preco',
					property: 'nr-tabpre'
				},
				{
					label: 'l-description',
					property: 'descricao'
				},
				{
					label: 'l-dt-inival-tab-preco',
					property: 'dt-inival'
				},
				{
					label: 'l-dt-fimval-tab-preco',
					property: 'dt-fimval'
				},
				{
					label: 'l-situacao-tab-preco',
					property: 'situacao'
				}],


				getObjectFromValue: function (value) {
					if (value === "" || value === undefined || value === null) return;
					return this.resource.TOTVSGet({ id: value }, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					if (parameters.isSelectValue) {
						queryproperties.id = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'nr-tabpre,descricao';
					} else {
						if (value) {
							queryproperties.property.push(field);
							if (field == 'nr-tabpre') {
								queryproperties.value.push(value);
							} else {
								queryproperties.value.push("*" + value + "*");
							}
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else {
						that.zoomResultList = [];
					}

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						that.zoomResultList = that.zoomResultList.concat(result);

						angular.forEach(that.zoomResultList, function (value, key) {
							value['dt-inival'] = dateformat(value['dt-inival'], 'shortDate');
							value['dt-fimval'] = dateformat(value['dt-fimval'], 'shortDate');

							if (value['situacao'] == 1) value['situacao'] = value['situacao'] + " - " + i18n('l-zoom-tab-preco-sit-1');
							if (value['situacao'] == 2) value['situacao'] = value['situacao'] + " - " + i18n('l-zoom-tab-preco-sit-2');
							if (value['situacao'] == 3) value['situacao'] = value['situacao'] + " - " + i18n('l-zoom-tab-preco-sit-3');

						});

						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true });
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomTabPreco.Service', serviceZoomTabPreco);

		serviceZoomMoeda.$inject = ['$timeout', '$totvsresource'];
		function serviceZoomMoeda($timeout, $totvsresource) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/unbo/boun005na/:method/:id', { fields: "mo-codigo,descricao" }),

				zoomName: 'l-moeda',

				propertyFields: [{
					label: 'l-moeda',
					property: 'mo-codigo'
				},
				{
					label: 'l-description-moeda',
					property: 'descricao',
					default: true
				}],

				tableHeader: [{
					label: 'l-moeda',
					property: 'mo-codigo'
				},
				{
					label: 'l-description-moeda',
					property: 'descricao'
				}],


				getObjectFromValue: function (value) {
					if (value === "" || value === undefined || value === null) return;
					return this.resource.TOTVSGet({ id: value }, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					if (parameters.isSelectValue) {
						queryproperties.id = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'mo-codigo,descricao';
					} else {
						queryproperties.property.push(field);
						if (field == 'mo-codigo') {
							queryproperties.value.push(value);
						} else {
							queryproperties.value.push("*" + value + "*");
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomMoeda.Service', serviceZoomMoeda);


		serviceZoomTabFinan.$inject = ['$timeout', '$totvsresource', '$filter'];
		function serviceZoomTabFinan($timeout, $totvsresource, $filter) {

			var dateformat = $filter('date');

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi187na/:method/:id', { fields: "nr-tab-finan,dt-ini-val,dt-fim-val" }),

				zoomName: 'l-tab-finan',

				propertyFields: [{
					label: 'l-tab-finan',
					property: 'nr-tab-finan',
					default: true
				}],

				tableHeader: [{
					label: 'l-tab-finan',
					property: 'nr-tab-finan'
				},
				{
					label: 'l-dt-ini-val-tab-fin',
					property: 'dt-ini-val'
				},
				{
					label: 'l-dt-fim-val-tab-fin',
					property: 'dt-fim-val'
				}],


				getObjectFromValue: function (value, init) {
					if (value === "" || value === undefined || value === null) return;
					var param = { id: value, indice: init };
					return this.resource.TOTVSGet(param, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					if (parameters.isSelectValue) {
						queryproperties.id = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'nr-tab-finan';

					} else {
						if (value !== "") {
							queryproperties.property.push(field);
							if ((field == 'nr-tab-finan') && (value != undefined)) {
								queryproperties.value.push(value);
							} else {
								queryproperties.value.push("*" + value + "*");
							}
						}
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if (!parameters.more) that.zoomResultList = [];
						that.zoomResultList = that.zoomResultList.concat(result);

						angular.forEach(that.zoomResultList, function (value, key) {
							value['dt-ini-val'] = dateformat(value['dt-ini-val'], 'shortDate');
							value['dt-fim-val'] = dateformat(value['dt-fim-val'], 'shortDate');
						});

						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomTabFinan.Service', serviceZoomTabFinan);


		serviceZoomIndFinan.$inject = ['$timeout', '$totvsresource'];
		function serviceZoomIndFinan($timeout, $totvsresource) {

			var service = {
				resource: $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi388na/:method/:tabfinan/:id', { fields: "nr-tab-finan,num-seq,tab-ind-fin,tab-dia-fin" }),

				zoomName: 'l-nr-ind-finan',

				propertyFields: [{
					label: 'l-nr-ind-finan',
					property: 'num-seq',
					default: true
				}],

				tableHeader: [{
					label: 'l-tab-finan',
					property: 'nr-tab-finan'
				},
				{
					label: 'l-num-seq-tab-fin',
					property: 'num-seq'
				},
				{
					label: 'l-tab-ind-fin-tab-fin',
					property: 'tab-ind-fin'
				},
				{
					label: 'l-tab-dia-fin-tab-fin',
					property: 'tab-dia-fin'
				}],


				getObjectFromValue: function (value, init) {
					if (value === "" || value === undefined || value === null) return;
					var param = { id: value, tabfinan: init };
					return this.resource.TOTVSGet(param, undefined, { noErrorMessage: true }, true);
				},

				applyFilter: function (parameters) {
					var that = this;

					var field = parameters.selectedFilter.property;
					var value = parameters.selectedFilterValue;

					if (value === undefined) value = "";

					var queryproperties = {};
					queryproperties.property = [];
					queryproperties.value = [];

					if (parameters.isSelectValue) {
						queryproperties.id = value;
						queryproperties.method = 'search';
						queryproperties.searchfields = 'nr-tab-finan';
					} else {
						if (value !== "") {
							queryproperties.property.push(field);
							if ((field == 'num-seq') && (value != undefined)) {
								queryproperties.value.push(value);
							} else {
								queryproperties.value.push("*" + value + "*");
							}
						}
					}

					if (parameters.init) {
						queryproperties.property.push('nr-tab-finan');
						queryproperties.value.push(parameters.init);
					}

					if (parameters.more)
						queryproperties.start = this.zoomResultList.length;
					else
						that.zoomResultList = [];

					return this.resource.TOTVSQuery(queryproperties, function (result) {
						if (!parameters.more) that.zoomResultList = [];
						that.zoomResultList = that.zoomResultList.concat(result);

						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}, { noErrorMessage: true }, true);
				}
			};

			return service;
		}
		index.register.service('salesorder.zoomIndFinan.Service', serviceZoomIndFinan);

	});
