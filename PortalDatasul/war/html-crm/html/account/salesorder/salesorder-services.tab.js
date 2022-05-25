/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1085.js',
	'/dts/crm/html/account/salesorder/salesorder-services.advanced.search.js',
	'/dts/crm/html/account/salesorder/items/items-services.modal.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerAccountSalesOrderTab;


	controllerAccountSalesOrderTab = function ($rootScope, $modal, $scope, $location, TOTVSEvent, helper, salesOrderFactory, salesOrderHelper, modalAdvancedSearch, filterHelper, modalItemsSalesOrder, preferenceFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountSalesOrderTab = this;

		this.accessRestriction = undefined;

		this.orders = [];
		this.ordersCount = 0;

		this.disclaimers = [];
		this.fixedDisclaimers = [];

		this.account = undefined;

		this.representative = undefined;

		this.orderDetailProgram = 1;

		this.isPortalContext = undefined;

		this.currentUserRepresentativeOrClient = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.addOrderInList = function (orders, isNew) {

			var order, i;

			if (!orders) { return; }

			if (!angular.isArray(orders)) {
				orders = [orders];
				CRMControlAccountSalesOrderTab.ordersCount += 1;
			}

			for (i = 0; i < orders.length; i += 1) {

				order = orders[i];

				salesOrderHelper.parseSalesOrderStatus(order);

				if (order && order.$length) {
					CRMControlAccountSalesOrderTab.ordersCount = order.$length;
				}

				if (isNew !== true) {
					CRMControlAccountSalesOrderTab.orders.push(order);
				} else {
					CRMControlAccountSalesOrderTab.orders.unshift(order);
				}

			}
		};

		this.openAdvancedSearch = function () {
			modalAdvancedSearch.open({
				disclaimers: CRMControlAccountSalesOrderTab.disclaimers,
				fixedDisclaimers: CRMControlAccountSalesOrderTab.fixedDisclaimers,
				representative: CRMControlAccountSalesOrderTab.representative
			}).then(function (result) {
				CRMControlAccountSalesOrderTab.quickSearchText = undefined;
				CRMControlAccountSalesOrderTab.disclaimers = result.disclaimers || [];
				CRMControlAccountSalesOrderTab.fixedDisclaimers = result.fixedDisclaimers || [];
				CRMControlAccountSalesOrderTab.search(false);
			});
		};

		this.selectQuickFilter = function (filters) {
			filterHelper.selectQuickFilter(
				filters,
				CRMControlAccountSalesOrderTab.disclaimers,
				CRMControlAccountSalesOrderTab.fixedDisclaimers,
				function (newDisclaimers) {
					CRMControlAccountSalesOrderTab.disclaimers = newDisclaimers.disclaimers;
					CRMControlAccountSalesOrderTab.fixedDisclaimers = newDisclaimers.fixedDisclaimers;
					CRMControlAccountSalesOrderTab.quickSearchText = undefined;
					CRMControlAccountSalesOrderTab.search(false);
				}
			);
		};

		this.parseQuickFilter = function (filters) {

			if (CRMUtil.isDefined(CRMControlAccountSalesOrderTab.quickSearchText) && CRMControlAccountSalesOrderTab.quickSearchText.toString().trim().length > 0) {

				CRMControlAccountSalesOrderTab.disclaimers = [];
				CRMControlAccountSalesOrderTab.loadDefaults();

				filters.push({
					property: "custom.quick_search",
					value:  CRMControlAccountSalesOrderTab.quickSearchText
				});

			}
		};

		this.search = function (isMore) {

			var options, filters = [];

			if (CRMControlAccountSalesOrderTab.isPendingListSearch === true) {
				return;
			}

			CRMControlAccountSalesOrderTab.ordersCount = 0;

			if (!isMore) {
				CRMControlAccountSalesOrderTab.orders = [];
			}

			options = {
				start: CRMControlAccountSalesOrderTab.orders.length,
				end: 10
			};

			if (CRMControlAccountSalesOrderTab.selectedOrderBy) {
				options.orderBy = CRMControlAccountSalesOrderTab.selectedOrderBy.property;
				options.asc = CRMControlAccountSalesOrderTab.selectedOrderBy.asc;
			}
			CRMControlAccountSalesOrderTab.parseQuickFilter(filters);

			filters = filters.concat(CRMControlAccountSalesOrderTab.disclaimers);

			CRMControlAccountSalesOrderTab.isPendingListSearch = true;

			salesOrderFactory.findRecords(filters, options, function (result) {
				CRMControlAccountSalesOrderTab.addOrderInList(result);
				CRMControlAccountSalesOrderTab.isPendingListSearch = false;
			});

		};

		this.removeDisclaimer = function (disclaimer) {

			var i,
				index = CRMControlAccountSalesOrderTab.disclaimers.indexOf(disclaimer);

			if (index !== -1) {

				CRMControlAccountSalesOrderTab.disclaimers.splice(index, 1);

				for (i = 0; i < CRMControlAccountSalesOrderTab.fixedDisclaimers.length; i++) {
					if (CRMControlAccountSalesOrderTab.fixedDisclaimers[i].property === disclaimer.property) {
						CRMControlAccountSalesOrderTab.disclaimers.push(CRMControlAccountSalesOrderTab.fixedDisclaimers[i]);
						break;
					}
				}

				CRMControlAccountSalesOrderTab.search(false);
			}
		};

		this.openOrderProgram = function (param) {
			var control = CRMControlAccountSalesOrderTab;

			switch (control.orderDetailProgram) {
			case 1:
				this.openHTMLOrderDetail(param);
				break;
			case 2:
				this.openPD4000Progress(param);
				break;
			case 3:
				this.openPD4050Progress(param);
				break;
			}
		};

		this.openPD4000Progress = function (param) {
			this.openProgress("fch/fchcrm/fchcrm1003wpd4000.p", "fchcrm1003wpd4000", [
				{"type": "integer", "value": param[0]}
			]);
		};

		this.openPD4050Progress = function (param) {
			this.openProgress("fch/fchcrm/fchcrm1003wpd4050.p", "fchcrm1003wpd4050", [
				{"type": "integer", "value": param[0]}
			]);
		};

		this.openHTMLOrderDetail = function (param) {
			if (CRMControlAccountSalesOrderTab.isPortalContext === true) {
				$location.url("/dts/mpd/orderdetail/" + param[0]);
			} else {
				$location.url("/dts/mpd/internalorderdetail/" + param[0]);
			}
		};

		this.openProgress  = function (path, program, param) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'info',
				title: $rootScope.i18n('nav-sales-order-quotation', [], 'dts/crm'),
				detail: $rootScope.i18n('msg-open-di-flex', [], 'dts/crm')
			});
			$rootScope.openProgramProgress(path, program, param);
		};

		this.isCurrentUserRepresentativeOrClient = function () {
			var currentUser = $rootScope.currentuser;

			if (currentUser.roles.indexOf("representative") !== -1 || currentUser.roles.indexOf("client") !== -1) {
				return true;
			}
			return false;
		};

		this.loadDefaults = function (disclaimers) {

			var i;

			if (disclaimers) {

				if (!angular.isArray(disclaimers)) {
					disclaimers = [disclaimers];
				}

				this.disclaimers = [];

				for (i = 0; i < disclaimers.length; i++) {
					if (disclaimers[i].fixed === true) {
						this.fixedDisclaimers.push(disclaimers[i]);
					} else {
						this.disclaimers.push(disclaimers[i]);
					}
				}
			}

			this.disclaimers = this.fixedDisclaimers.concat(this.disclaimers);
		};

		this.openModalItems = function (order) {
			modalItemsSalesOrder.open({
				nrPedCli: order['nr-pedcli'],
				nomAbrev: order['nome-abrev']
			}).then(function (result) {
			});
		};

		this.isPortalAccessContext = function () {
			return helper.isPortalAccessContext($rootScope.appRootContext);
		};
		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (account) {
            var isPortal = typeof (APP_BASE_URL) !== "undefined" ? (APP_BASE_URL.indexOf('/portal/') >= 0) : false;

			accessRestrictionFactory.getUserRestrictions('salesorder.tab', $rootScope.currentuser.login, function (result) {
				CRMControlAccountSalesOrderTab.accessRestriction = result || {};
			});

			if (isPortal) {
				CRMControlAccountSalesOrderTab.isPortalContext = true;
				CRMControlAccountSalesOrderTab.orderDetailProgram = 1;
			} else {
				preferenceFactory.getPreferenceAsInteger('PROGRAM_ORDER_DETAIL', function (result) {
					CRMControlAccountSalesOrderTab.orderDetailProgram = result || 1;
				});
			}

			CRMControlAccountSalesOrderTab.currentUserRepresentativeOrClient = CRMControlAccountSalesOrderTab.isCurrentUserRepresentativeOrClient();

			CRMControlAccountSalesOrderTab.account = account;

			CRMControlAccountSalesOrderTab.quickFilters = [{
				property: 'custom.status',
				value: 1,
				title: $rootScope.i18n('l-status-order-1', [], 'dts/crm'),
				fixed: false
			}, {
				property: 'custom.status',
				value: 2,
				title: $rootScope.i18n('l-status-order-2', [], 'dts/crm'),
				fixed: false
			}, {
				property: 'custom.status',
				value: 3,
				title: $rootScope.i18n('l-status-order-3', [], 'dts/crm'),
				fixed: false
			}, {
				property: 'custom.status',
				value: 4,
				title: $rootScope.i18n('l-status-order-5', [], 'dts/crm'),
				fixed: false
			}, {
				property: 'custom.status',
				value: 5,
				title: $rootScope.i18n('l-status-order-6', [], 'dts/crm'),
				fixed: false
			}, {
				property: 'custom.status',
				value: 6,
				title: $rootScope.i18n('l-status-order-8', [], 'dts/crm'),
				fixed: false
			}, {
				property: 'custom.status',
				value: 7,
				title: $rootScope.i18n('l-status-order-9', [], 'dts/crm'),
				fixed: false
			}];

			CRMControlAccountSalesOrderTab.loadDefaults({
				property: 'nome_abrev',
				value: account.nom_abrev,
				title: $rootScope.i18n('l-nick-name', [], 'dts/crm') + ': ' + account.nom_abrev,
				fixed: true
			});

			salesOrderFactory.getRepresentativeCode(function (result) {

				if (result) {
					CRMControlAccountSalesOrderTab.representative = result[0];
				}

				// Filtro por representante deve ser aplicado apenas para o portal.
				if(CRMControlAccountSalesOrderTab.isPortalAccessContext()) {

					if (CRMUtil.isDefined(CRMControlAccountSalesOrderTab.representative)) {
						CRMControlAccountSalesOrderTab.loadDefaults({
							property: 'num_id_repres',
							value: CRMControlAccountSalesOrderTab.representative.num_id,
							title: $rootScope.i18n('l-representative-portal-user', [], 'dts/crm') + ': ' + CRMControlAccountSalesOrderTab.representative.nom_abrev_repres_erp,
							fixed: true
						});
					}

				}

				if (account.nom_abrev.length > 0 && account.cod_pessoa_erp.length > 0) {
					CRMControlAccountSalesOrderTab.search(false);
				}
			});

		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountSalesOrderTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlAccountSalesOrderTab.init(account);
		});

	};
	controllerAccountSalesOrderTab.$inject = [
		'$rootScope', '$modal', '$scope', '$location', 'TOTVSEvent', 'crm.helper', 'crm.mpd_pedvenda.factory', 'crm.salesorder.helper', 'crm.account-salesorder.modal.advanced.search', 'crm.filter.helper', 'crm.items-salesorder.modal', 'crm.crm_param.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.account-salesorder.tab.control', controllerAccountSalesOrderTab);

});
