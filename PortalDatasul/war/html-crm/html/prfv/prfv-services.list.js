/*global $, index, angular, define, TOTVSEvent, CRMUtil, CRMEvent*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1048.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerRangePrfvList;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controllerRangePrfvList = function ($rootScope, $scope, TOTVSEvent, prfvFactory,
		modalPrfvAdvancedSearch, helper, prfvHelper, userPreferenceModal, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlRangePrfvList = this;

		this.listOfRangePrfv = [];
		this.listOfRangePrfvCount = 0;

		this.disclaimers = [];
		this.fixedDisclaimers = [];

		this.selectedOrderBy = undefined;
		this.listOfOrderBy = [
			{title: $rootScope.i18n('l-prfv', [], 'dts/crm'), property: 'val_recenc_freq_val'},
			{title: $rootScope.i18n('l-recency', [], 'dts/crm'), property: 'val_recenc'},
			{title: $rootScope.i18n('l-frequency', [], 'dts/crm'), property: 'val_freq'},
			{title: $rootScope.i18n('l-potential', [], 'dts/crm'), property: 'val_potenc'},
			{title: $rootScope.i18n('l-value', [], 'dts/crm'), property: 'val_val'}
		];

		this.quickFilters = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.selectOrderBy = function (order) {
			if (!order) { return; }

			CRMControlRangePrfvList.selectedOrderBy = order;

			CRMControlRangePrfvList.search(false);
		};

		this.selectQuickFilter = function (filter) {
			if (CRMUtil.isUndefined(filter)) { return; }

			CRMControlRangePrfvList.disclaimers = [];
			CRMControlRangePrfvList.quickSearchText = undefined;

			var i,
				hasFilterFixedProperty = false;

			for (i = 0; i < CRMControlRangePrfvList.fixedDisclaimers.length; i++) {
				if (CRMControlRangePrfvList.fixedDisclaimers[i].property === filter.property) {
					CRMControlRangePrfvList.disclaimers.push(filter);
					hasFilterFixedProperty = true;
					break;
				} else {
					CRMControlRangePrfvList.disclaimers.push(CRMControlRangePrfvList.fixedDisclaimers[i]);
				}
			}
			if (!hasFilterFixedProperty) {
				CRMControlRangePrfvList.disclaimers.push(filter);
			}
			CRMControlRangePrfvList.search(false);
		};

		this.loadDefaults = function (disclaimers) {

			if (disclaimers) {
				this.disclaimers = disclaimers;
			} else {
				this.disclaimers = [];
			}

			this.disclaimers = this.fixedDisclaimers.concat(this.disclaimers);

		};

		this.openAdvancedSearch = function () {
			modalPrfvAdvancedSearch.open({
				disclaimers: CRMControlRangePrfvList.disclaimers,
				fixedDisclaimers: CRMControlRangePrfvList.fixedDisclaimers
			}).then(function (result) {
				CRMControlRangePrfvList.quickSearchText = undefined;
				CRMControlRangePrfvList.disclaimers = result.disclaimers;
				CRMControlRangePrfvList.fixedDisclaimers = result.fixedDisclaimers;
				CRMControlRangePrfvList.search(false);
			});
		};

		this.removeDisclaimer = function (disclaimer) {
			var i,
				index = CRMControlRangePrfvList.disclaimers.indexOf(disclaimer);
			if (index !== -1) {
				CRMControlRangePrfvList.disclaimers.splice(index, 1);
				for (i = 0; i < CRMControlRangePrfvList.fixedDisclaimers.length; i++) {
					if (CRMControlRangePrfvList.fixedDisclaimers[i].property === disclaimer.property) {
						CRMControlRangePrfvList.disclaimers.push(CRMControlRangePrfvList.fixedDisclaimers[i]);
						break;
					}
				}
				CRMControlRangePrfvList.search(false);
			}
		};

		this.search = function (isMore) {

			if (CRMControlRangePrfvList.isPendingListSearch === true) {
				return;
			}

			CRMControlRangePrfvList.listOfRangePrfvCount = 0;

			if (!isMore) {
				CRMControlRangePrfvList.listOfRangePrfv = [];
			}

			var i,
				filters,
				options = { start: CRMControlRangePrfvList.listOfRangePrfv.length, end: 50};

			if (CRMControlRangePrfvList.selectedOrderBy) {
				options.orderBy = CRMControlRangePrfvList.selectedOrderBy.property;
				options.asc = CRMControlRangePrfvList.selectedOrderBy.asc;
			}

			filters = [];

			if (CRMControlRangePrfvList.quickSearchText
					&& CRMControlRangePrfvList.quickSearchText.trim().length > 0) {

				this.loadDefaults();

				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControlRangePrfvList.quickSearchText)
				});
			}

			filters = filters.concat(this.disclaimers);

			CRMControlRangePrfvList.isPendingListSearch = true;

			prfvFactory.findRecords(filters, options, function (result) {

				for (i = 0; i < result.length; i++) {

					var rangePrfv = result[i];

					if (rangePrfv && rangePrfv.$length) {
						CRMControlRangePrfvList.listOfRangePrfvCount = rangePrfv.$length;
					}

					prfvHelper.parseCalculationFrequency(rangePrfv);
					CRMControlRangePrfvList.listOfRangePrfv.push(rangePrfv);
				}

				CRMControlRangePrfvList.isPendingListSearch = false;
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'prfv.list' });
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (disclaimers) {

			CRMControlRangePrfvList.quickFilters = [];

			helper.loadCRMContext(function () {
				accessRestrictionFactory.getUserRestrictions('range-prfv.list', $rootScope.currentuser.login, function (result) {
					CRMControlRangePrfvList.accessRestriction = result || {};
				});

				if (CRMControlRangePrfvList.isChild !== true) {

					var viewName = $rootScope.i18n('nav-prfv', [], 'dts/crm'),
						startView,
						viewController = 'crm.prfv.list.control';

					startView = helper.startView(viewName, viewController, CRMControlRangePrfvList);

					if (startView.isNewContext === true) {
						CRMControlRangePrfvList.search(false);
					}

				} else if (disclaimers) {
					CRMControlRangePrfvList.loadDefaults(disclaimers);
					CRMControlRangePrfvList.search(false);
				}

			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlRangePrfvList = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlRangePrfvList.init();
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlRangePrfvList.init([{
				property: 'num_id_pessoa',
				value: account.num_id,
				title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + account.num_id + ' - ' + account.nom_razao_social +
					(account.cod_pessoa_erp ? ' (' + account.cod_pessoa_erp + ')' : ''),
				fixed: true
			}]);
		});
	};
	controllerRangePrfvList.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.crm_prfv_faixa.factory',
		'crm.prfv.modal.advanced.search', 'crm.helper', 'crm.prfv.helper', 'crm.user.modal.preference', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.prfv.list.control', controllerRangePrfvList);
});
