/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1089.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/account/bill/bill-services.advanced.search.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerBillTab;


	controllerBillTab = function ($rootScope, $modal, $scope, TOTVSEvent, helper, billFactory,
												modalAdvancedSearch, filterHelper, billHelper, $filter, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountBillTab = this;

		this.accessRestriction = undefined;

		this.orders = [];
		this.ordersCount = 0;

		this.disclaimers = [];
		this.fixedDisclaimers = [];

		this.account = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.addBillInList = function (bills, isNew) {

			var bill, i;

			if (!bills) { return; }

			if (!angular.isArray(bills)) {
				bills = [bills];
				CRMControlAccountBillTab.billsCount += 1;
			}

			for (i = 0; i < bills.length; i += 1) {

				bill = bills[i];

				billHelper.parseBillStatus(bill);

				if (bill && bill.$length) {
					CRMControlAccountBillTab.billsCount = bill.$length;
				}

				if (isNew !== true) {
					CRMControlAccountBillTab.bills.push(bill);
				} else {
					CRMControlAccountBillTab.bills.unshift(bill);
				}

			}
		};

		this.openAdvancedSearch = function () {
			modalAdvancedSearch.open({
				disclaimers: CRMControlAccountBillTab.disclaimers,
				fixedDisclaimers: CRMControlAccountBillTab.fixedDisclaimers
			}).then(function (result) {
				CRMControlAccountBillTab.quickSearchText = undefined;
				CRMControlAccountBillTab.disclaimers = result.disclaimers || [];
				CRMControlAccountBillTab.fixedDisclaimers = result.fixedDisclaimers || [];
				CRMControlAccountBillTab.search(false);
			});
		};

		this.selectQuickFilter = function (filters) {
			filterHelper.selectQuickFilter(
				filters,
				CRMControlAccountBillTab.disclaimers,
				CRMControlAccountBillTab.fixedDisclaimers,
				function (newDisclaimers) {
					CRMControlAccountBillTab.disclaimers = newDisclaimers.disclaimers;
					CRMControlAccountBillTab.fixedDisclaimers = newDisclaimers.fixedDisclaimers;
					CRMControlAccountBillTab.quickSearchText = undefined;
					CRMControlAccountBillTab.search(false);
				}
			);
		};

		this.parseQuickFilter = function (filters) {

			if (CRMUtil.isDefined(CRMControlAccountBillTab.quickSearchText) && CRMControlAccountBillTab.quickSearchText.toString().trim().length > 0) {

				CRMControlAccountBillTab.disclaimers = [];
				CRMControlAccountBillTab.loadDefaults();

				filters.push({
					property: "quick_search",
					value:  CRMControlAccountBillTab.quickSearchText
				});

			}
		};

		this.search = function (isMore) {

			var options, filters = [];

			if (CRMControlAccountBillTab.isPendingListSearch === true) {
				return;
			}

			CRMControlAccountBillTab.billsCount = 0;

			if (!isMore) {
				CRMControlAccountBillTab.bills = [];
			}

			options = {
				start: CRMControlAccountBillTab.bills.length,
				end: 10
			};

			if (CRMControlAccountBillTab.selectedBillBy) {
				options.orderBy = CRMControlAccountBillTab.selectedBillBy.property;
				options.asc = CRMControlAccountBillTab.selectedBillBy.asc;
			}
			CRMControlAccountBillTab.parseQuickFilter(filters);

			filters = filters.concat(CRMControlAccountBillTab.disclaimers);

			CRMControlAccountBillTab.isPendingListSearch = true;

			billFactory.findRecords(filters, options, function (result) {
				CRMControlAccountBillTab.addBillInList(result);
				CRMControlAccountBillTab.isPendingListSearch = false;
			});

		};

		this.removeDisclaimer = function (disclaimer) {

			var i,
				index = CRMControlAccountBillTab.disclaimers.indexOf(disclaimer);

			if (index !== -1) {

				CRMControlAccountBillTab.disclaimers.splice(index, 1);

				for (i = 0; i < CRMControlAccountBillTab.fixedDisclaimers.length; i++) {
					if (CRMControlAccountBillTab.fixedDisclaimers[i].property === disclaimer.property) {
						CRMControlAccountBillTab.disclaimers.push(CRMControlAccountBillTab.fixedDisclaimers[i]);
						break;
					}
				}

				CRMControlAccountBillTab.search(false);
			}
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

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (account) {

			accessRestrictionFactory.getUserRestrictions('accountbill.tab', $rootScope.currentuser.login, function (result) {
				CRMControlAccountBillTab.accessRestriction = result || {};
			});

			var today = new Date(),
				dateFormat = $rootScope.i18n('l-date-format', [], 'dts/crm');

			CRMControlAccountBillTab.account = account;

			CRMControlAccountBillTab.quickFilters = [{
				property: 'log_vencid',
				value: true,
				title: $rootScope.i18n('l-sit-expired', [], 'dts/crm'),
				fixed: false
			}, {
				property: 'log_avencer',
				value: true,
				title: $rootScope.i18n('l-sit-to-win', [], 'dts/crm'),
				fixed: false
			}, {
				property: 'log_antecip',
				value: true,
				title: $rootScope.i18n('l-sit-anticipation', [], 'dts/crm'),
				fixed: false
			}];

			CRMControlAccountBillTab.loadDefaults([{
				property: 'cod_pessoa_erp',
				value: account.cod_pessoa_erp,
				title: $rootScope.i18n('l-code-erp', [], 'dts/crm') + ': ' + account.cod_pessoa_erp,
				fixed: true
			}]);

			if (account.nom_abrev.length > 0 && account.cod_pessoa_erp.length > 0) {
				CRMControlAccountBillTab.search(false);
			}

		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountBillTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlAccountBillTab.init(account);
		});

	};
	controllerBillTab.$inject = [
		'$rootScope', '$modal', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.tit_acr.factory',
		'crm.account-bill.modal.advanced.search', 'crm.filter.helper', 'crm.bill.helper', '$filter', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.account-bill.tab.control', controllerBillTab);

});
