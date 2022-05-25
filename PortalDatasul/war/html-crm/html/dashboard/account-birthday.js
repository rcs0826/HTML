/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/html/dashboard/account-birthday-parameters.js',
	'/dts/crm/html/account/account-services.list.js',
	'ng-load!/dts/crm/js/libs/3rdparty/ng-infinite-scroll/ng-infinite-scroll.min.js'
], function (index) {

	'use strict';

	var controllerAccountBirthday;

	// *************************************************************************************
	// *** CONTROLLER
	// *************************************************************************************
	controllerAccountBirthday = function ($rootScope, $scope, $filter, $location, $totvsprofile, TOTVSEvent, helper, accountHelper, accountFactory, modalParametersAccountBirthday, preferenceFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerAccountBirthday = this;

		this.disclaimers = [];
		this.listOfAccounts = [];
		this.listOfAccountsCount = 0;
		this.tooltipLegend = "";
		this.quickSearchText = "";
		this.quickSearchLabel = 'l-name';

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************
		this.quickSearch = function () {
			CRMControllerAccountBirthday.loadData();
		};

		this.oncCleanQuickSearch = function () {
			CRMControllerAccountBirthday.quickSearchText = "";
			CRMControllerAccountBirthday.quickSearch();
		};

		this.openDetail = function (id) {
			var url = '/dts/crm/account/detail/' + id;

			$scope.safeApply(function () {
				$location.path(url);
			});
		};

		this.showConfig = function () {

			modalParametersAccountBirthday.open({
				disclaimers: CRMControllerAccountBirthday.disclaimers
			}).then(function (result) {

				if (!result) {
					return;
				}

				CRMControllerAccountBirthday.disclaimers = angular.copy(result.disclaimers);

				CRMControllerAccountBirthday.loadData(CRMControllerAccountBirthday.disclaimers);
				CRMControllerAccountBirthday.saveConfig(CRMControllerAccountBirthday.disclaimers);
			});

		};

		this.saveConfig = function (disclaimers, callback) {

			var config;

			config = CRMControllerAccountBirthday.parseConfig(disclaimers);

			$totvsprofile.remote.set(accountHelper.accountBirthdayConfig, {dataValue: config}, callback);
		};

		this.parseConfig = function (disclaimers) {

			var template;

			template = {
				"dsAccount": {
					"ttFilterAccount": disclaimers
				}
			};

			return template;
		};

		this.parseConfigToModel = function (config) {
			var disclaimers, dsAccount;

			dsAccount = config ? config.dsAccount : undefined;

			if (dsAccount) {
				disclaimers = angular.copy(config.dsAccount.ttFilterAccount);
			}

			if (CRMUtil.isUndefined(disclaimers)) {
				disclaimers = [{
					property: "custom.idi_birtdate_period",
					title: $rootScope.i18n('l-display-type', [], 'dts/crm'),
					value: 3
				}];
			}

			return {
				disclaimers: disclaimers
			};
		};

		this.isBirthday = function (accountDate) {
			var today = new Date(), day, month;

			if (CRMUtil.isUndefined(accountDate)) {
				return;
			}

			try {
				accountDate = new Date(accountDate);
			} catch (e) {
				return;
			}

			day = today.getDate();
			month = today.getMonth();

			if (accountDate.getDate() !== day) {
				return false;
			}

			if (accountDate.getMonth() !== month) {
				return false;
			}

			return true;
		};

		this.formatAccountToDisplay = function (account) {

			if (CRMUtil.isUndefined(account)) {
				return;
			}

			accountHelper.parseAccountType(account);
			accountHelper.parseAccountColor(account);

			return account;
		};

		this.formatToSort = function (account) {
			var birtdate = new Date(account.dat_nascimento);
			account.day = birtdate.getDate();
			account.month = birtdate.getMonth() + 1;
		};

		this.addAccountInList = function (accounts, isNew, callback) {
			var i,
				account;

			if (!accounts) {
				return;
			}

			if (!angular.isArray(accounts)) {
				accounts = [accounts];
				CRMControllerAccountBirthday.listOfAccountsCount++;
			}

			for (i = 0; i < accounts.length; i++) {

				account = accounts[i];

				if (account && account.$length) {
					CRMControllerAccountBirthday.listOfAccountsCount = account.$length;
				}

				CRMControllerAccountBirthday.formatAccountToDisplay(account);
				CRMControllerAccountBirthday.formatToSort(account);

				if (isNew === true) {
					CRMControllerAccountBirthday.listOfAccounts.unshift(account);
				} else {
					CRMControllerAccountBirthday.listOfAccounts.push(account);
				}

			}

			if (callback) {
				callback();
			}

		};

		this.loadPreferences = function (callback) {
			var count = 0,
				total = 3;

			preferenceFactory.isIntegratedWithEMS(function (result) {
				CRMControllerAccountBirthday.isIntegratedWithEMS = result;
				count++;
				if (count >= total) {
					if (callback) { callback(); }
				}
			});
			preferenceFactory.isIntegratedWithERP(function (result) {
				CRMControllerAccountBirthday.isIntegratedWithERP = result;
				count++;
				if (count >= total) {
					if (callback) { callback(); }
				}
			});
			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControllerAccountBirthday.isIntegratedWithGP = result;
				count++;
				if (count >= total) {
					if (callback) { callback(); }
				}
			});
		};

		this.parseLegend = function () {
			var i, legend = '';

			CRMControllerAccountBirthday.integratedWith = CRMControllerAccountBirthday.isIntegratedWithGP === true ? 'GP' : 'ERP';

			for (i = 0; i < accountHelper.legendColors.length; i++) {
				legend = legend + '<div class="col-xs-12 pull-left tag legend ' + accountHelper.legendColors[i] + ' ng-binding">'  + $rootScope.i18n(accountHelper.legendStatus[i], [CRMControllerAccountBirthday.integratedWith], 'dts/crm') + '</div>';
			}

			CRMControllerAccountBirthday.tooltipLegend = '<div><totvs-page-tags class="text-left"><div class="row"><div><div class="page-tags">' + legend + '</div></div></div></totvs-page-tags></div>';
		};

		this.parseQuickFilter = function (filters) {

			var quickProperty, quickValue;

			if (CRMUtil.isDefined(CRMControllerAccountBirthday.quickSearchText)) {

				quickProperty = 'nom_razao_social';
				quickValue = CRMControllerAccountBirthday.quickSearchText;

				if (CRMUtil.isDefined(quickValue) && quickValue.toString().trim().length > 0) {
					filters.push({
						property: quickProperty,
						value: helper.parseStrictValue(quickValue)
					});
				}
			}
		};

		this.sortByDayAndMonth = function (item1, item2) {
			return item1.day - item2.day || item1.month - item2.month;
		};

		this.loadData = function (disclaimers) {

			var options = {},
				filters = [];

			if (!disclaimers || !angular.isArray(disclaimers)) {
				disclaimers = [];
			}

			if (CRMControllerAccountBirthday.isPendingListSearch === true) {
				return;
			}

			CRMControllerAccountBirthday.listOfAccountsCount = 0;
			CRMControllerAccountBirthday.listOfAccounts = [];

			options.start = 0;

			options.quickSearchText = CRMControllerAccountBirthday.quickSearchText;

			options.orderBy = "dat_nascimento";
			options.asc = true;

			CRMControllerAccountBirthday.parseQuickFilter(filters);

			filters = filters.concat(CRMControllerAccountBirthday.disclaimers);

			CRMControllerAccountBirthday.isPendingListSearch = true;

			accountFactory.findRecords(filters, options, function (result) {
				CRMControllerAccountBirthday.addAccountInList(result, undefined, function () {
					CRMControllerAccountBirthday.listOfAccounts.sort(CRMControllerAccountBirthday.sortByDayAndMonth);
				});
				CRMControllerAccountBirthday.isPendingListSearch = false;
			});
		};

		this.getConfig = function (callback) {

			$totvsprofile.remote.get(accountHelper.accountBirthdayConfig, undefined, function (result) {

				if (result && angular.isArray(result)) {
					result = result[0];
				}

				if (result && result.dataValue) {
					result = result.dataValue;
				}

				result = CRMControllerAccountBirthday.parseConfigToModel(result);

				if (callback) {
					callback(result);
				}

			});

		};

		$scope.safeApply = function (fn) {
			var phase = (this.$root ? this.$root.$$phase : undefined);

			if (phase === '$apply' || phase === '$digest') {
				if (fn && (typeof (fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			helper.loadCRMContext(function () {

				CRMControllerAccountBirthday.loadPreferences(CRMControllerAccountBirthday.parseLegend);

				CRMControllerAccountBirthday.getConfig(function (result) {

					CRMControllerAccountBirthday.disclaimers = result.disclaimers;

					CRMControllerAccountBirthday.loadData(CRMControllerAccountBirthday.disclaimers);
				});
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControllerAccountBirthday.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControllerAccountBirthday.init();
		});


		$scope.$on('$destroy', function () {
			CRMControllerAccountBirthday = undefined;
		});

		$scope.$on('$killyourself', function (identifiers) {
			if (!angular.isArray(identifiers)) { return; }

			var i;

			for (i = 0; i < identifiers.length; i += 1) {
				if (CRMUtil.isDefined(identifiers[i].widgetMenuName) && identifiers[i].widgetMenuName === "html-crm.dashboard.account-birthday") {
					CRMControllerAccountBirthday = undefined;
				}
			}
		});
	};

	controllerAccountBirthday.$inject = [
		'$rootScope',
		'$scope',
		'$filter',
		'$location',
		'$totvsprofile',
		'TOTVSEvent',
		'crm.helper',
		'crm.account.helper',
		'crm.crm_pessoa.conta.factory',
		'crm.dashboard.account-birthday.modal.parameter',
		'crm.crm_param.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.dashboard.account-birthday.controller', controllerAccountBirthday);
});
