/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1003.js',
    '/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/dashboard/selected-account-parameters.js',
	'/dts/crm/html/account/account-services.list.js',
	'ng-load!/dts/crm/js/libs/3rdparty/ng-infinite-scroll/ng-infinite-scroll.min.js',
    '/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerSelectedAccount;

	// *************************************************************************************
	// *** CONTROLLER
	// *************************************************************************************
	controllerSelectedAccount = function ($rootScope, $scope, $filter, $location, $totvsprofile, TOTVSEvent,
										  helper, accountHelper, accountFactory, modalParametersEdit, preferenceFactory,
										  modalAccountEdit, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerSelectedAccount = this;

        this.accessRestriction = undefined;
		this.selectedAccount = undefined;
		this.disclaimers = [];
		this.listOfAccounts = [];
		this.listOfAccountsCount = 0;
		this.tooltipLegend = "";
		this.quickSearchText = "";
		this.quickSearchLabel = 'l-search-selected-account';

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.quickSearch = function () {
			CRMControllerSelectedAccount.loadData();
		};

		this.oncCleanQuickSearch = function () {
			CRMControllerSelectedAccount.quickSearchText = "";
			CRMControllerSelectedAccount.quickSearch();
		};

		this.onSelect = function (act) {
			if (act && this.selectedAccount && act.num_id === this.selectedAccount.num_id) { return; }

			this.selectedAccount = angular.copy(act);

			CRMControllerSelectedAccount.saveConfig(CRMControllerSelectedAccount.disclaimers);
			$rootScope.selectedAccountCRM = this.selectedAccount;
			//$rootScope.$broadcast('selectedaccountcrm', this.selectedAccount);
		};

		// quando há a seleção de cliente no widget de distribuição
		this.onSelectCustomer = function (callback) {

			var selected = $scope.selectedcustomer, i, act;

			//$rootScope.selectedAccountCRM = undefined;

			if ((this.selectedAccount && selected) && (this.selectedAccount.cod_pessoa_erp === selected['cod-emitente'].toString())) {
				return; //ja esta posicionado na conta
			}

			//this.selectedAccount = undefined;

			if (selected !== undefined) {
				CRMControllerSelectedAccount.getAccountByERPCode($scope.selectedcustomer['cod-emitente'], function (account) {
					CRMControllerSelectedAccount.onSelect(account);
				});
			} else {
				CRMControllerSelectedAccount.onSelect(act);
			}

		};

		this.getAccountByERPCode = function (codEmitente, callback) {
			accountFactory.getAccountByERPCode(codEmitente, function (result) {
				if (callback) { callback(result); }
			});
		};

		this.showConfig = function () {
			var disclaimers;

			modalParametersEdit.open({
				disclaimers: CRMControllerSelectedAccount.disclaimers
			}).then(function (result) {
				if (!result) {
					return;
				}

				CRMControllerSelectedAccount.disclaimers = angular.copy(result.disclaimers);
				CRMControllerSelectedAccount.loadData();
				CRMControllerSelectedAccount.saveConfig(CRMControllerSelectedAccount.disclaimers);
			});

		};

		this.getConfig = function (callback) {
			$totvsprofile.remote.get(accountHelper.selectedAccountConfig, undefined, function (result) {

				if (result && angular.isArray(result)) {
					result = result[0];
				}

				if (result && result.dataValue) {
					result = result.dataValue;
				}

				result = CRMControllerSelectedAccount.parseConfigToModel(result);

				if (callback) { callback(result); }
			});
		};

		this.saveConfig = function (disclaimers, callback) {
			var config;

			config = CRMControllerSelectedAccount.parseConfig(disclaimers);
			$totvsprofile.remote.set(accountHelper.selectedAccountConfig, {dataValue: config}, callback);
		};

		this.parseConfig = function (disclaimers) {
			var template, selectedAccount;

			selectedAccount = CRMControllerSelectedAccount.selectedAccount || undefined;

			template = {
				"dsCarteiraClienteCRM": {
					"ttFilterWidget": disclaimers,
					"selectedAccount": selectedAccount
				}
			};

			return template;
		};

		this.parseConfigToModel = function (config) {
			var disclaimers = [], dsCarteiraClienteCRM, selectedAccount;

			dsCarteiraClienteCRM = config ? config.dsCarteiraClienteCRM : undefined;

			if (dsCarteiraClienteCRM && dsCarteiraClienteCRM.ttFilterWidget) {
				disclaimers = angular.copy(config.dsCarteiraClienteCRM.ttFilterWidget);
			}

			if (dsCarteiraClienteCRM && dsCarteiraClienteCRM.selectedAccount) {
				selectedAccount = dsCarteiraClienteCRM.selectedAccount;
			}

			return {
				disclaimers: disclaimers,
				selectedAccount: selectedAccount
			};
		};

		this.parseSelectedAccount = function (account) {
			if (!account || !CRMControllerSelectedAccount.selectedAccount) { return; }

			if (account.num_id === CRMControllerSelectedAccount.selectedAccount.num_id) {
				CRMControllerSelectedAccount.onSelect(account);
			}
		};

		this.formatAccountToDisplay = function (account) {
			if (CRMUtil.isUndefined(account)) {
				return;
			}

			accountHelper.parseSex(account);
			accountHelper.parsePersonType(account);
			accountHelper.parseAccountType(account);
			accountHelper.parseAccessLevel(account);
			accountHelper.parseAccountColor(account);
			accountHelper.parseStatus(account, CRMControllerSelectedAccount.integratedWith);

			return account;
		};

		this.addAccountInList = function (accounts, isNew) {
			var i,
				account;

			if (!accounts) {
				return;
			}

			if (!angular.isArray(accounts)) {
				accounts = [accounts];
			}

			for (i = 0; i < accounts.length; i++) {
				CRMControllerSelectedAccount.listOfAccountsCount++;

				account = accounts[i];

				CRMControllerSelectedAccount.formatAccountToDisplay(account);
				CRMControllerSelectedAccount.parseSelectedAccount(account);

				if (isNew === true) {
					CRMControllerSelectedAccount.listOfAccounts.unshift(account);
				} else {
					CRMControllerSelectedAccount.listOfAccounts.push(account);
				}

			}

		};

		this.loadPreferences = function (callback) {
			var count = 0,
				total = 3;

			preferenceFactory.isIntegratedWithEMS(function (result) {
				CRMControllerSelectedAccount.isIntegratedWithEMS = result;
				count++;
				if (count >= total) {
					if (callback) { callback(); }
				}
			});
			preferenceFactory.isIntegratedWithERP(function (result) {
				CRMControllerSelectedAccount.isIntegratedWithERP = result;
				count++;
				if (count >= total) {
					if (callback) { callback(); }
				}
			});
			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControllerSelectedAccount.isIntegratedWithGP = result;
				count++;
				if (count >= total) {
					if (callback) { callback(); }
				}
			});
		};

		this.loadData = function (start) {

			var i = 0,
				options = {};

			options.quickSearchText = CRMControllerSelectedAccount.quickSearchText;
			options.start = start || 0;
			options.pageSize = 50;

			if (!CRMControllerSelectedAccount.disclaimers || !angular.isArray(CRMControllerSelectedAccount.disclaimers)) {
				CRMControllerSelectedAccount.disclaimers = [];
			}

			if (options.start < 1) { // se nova consulta
				CRMControllerSelectedAccount.listOfAccountsCount = 0;
				CRMControllerSelectedAccount.listOfAccounts = [];
			} else if ((CRMControllerSelectedAccount.listOfAccountsCount % options.pageSize) !== 0) { // ultima pagina
				return;
			}

			if (CRMControllerSelectedAccount.isPendingListSearch === true) { return; }

			CRMControllerSelectedAccount.isPendingListSearch = true;

			accountFactory.getAccountPortfolio(options, function (result) {
				if (result) {
					CRMControllerSelectedAccount.addAccountInList(result);
				}

				CRMControllerSelectedAccount.isPendingListSearch = false;
			});
		};

		this.openAddAccount = function (isLead) {

			var account = {}, fnOpen = modalAccountEdit;

			if (isLead) {
				account.idi_tip_cta = 1;
			} else {
				account.idi_tip_cta = 2;
			}

			fnOpen.open({
				account		: account,
				isAccount	: !isLead,
				isConvert	: false,
				isToLoad	: CRMUtil.isDefined(account)
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					CRMControllerSelectedAccount.addAccountInList(result, true);
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

		this.parseLegend = function () {
			var i, legend = '';

			CRMControllerSelectedAccount.integratedWith = CRMControllerSelectedAccount.isIntegratedWithGP === true ? 'GP' : 'ERP';

			for (i = 0; i < accountHelper.legendColors.length; i++) {
				legend = legend + '<div class="col-xs-12 pull-left tag legend ' + accountHelper.legendColors[i] + ' ng-binding">'  + $rootScope.i18n(accountHelper.legendStatus[i], [CRMControllerSelectedAccount.integratedWith], 'dts/crm') + '</div>';
			}

			CRMControllerSelectedAccount.tooltipLegend = '<div><totvs-page-tags class="text-left"><div class="row"><div><div class="page-tags">' + legend + '</div></div></div></totvs-page-tags></div>';
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			helper.loadCRMContext(function () {
                
                accessRestrictionFactory.getUserRestrictions('account.list', $rootScope.currentuser.login, function (result) {
                    CRMControllerSelectedAccount.accessRestriction = result || {};
                });

                
				CRMControllerSelectedAccount.loadPreferences(CRMControllerSelectedAccount.parseLegend);

				CRMControllerSelectedAccount.getConfig(function (result) {
					CRMControllerSelectedAccount.disclaimers = result ? result.disclaimers : [];
					CRMControllerSelectedAccount.selectedAccount = result ? result.selectedAccount : undefined;
					$rootScope.selectedAccountCRM = CRMControllerSelectedAccount.selectedAccount;
					CRMControllerSelectedAccount.loadData();
				});
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControllerSelectedAccount.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControllerSelectedAccount.init();
		});

		$scope.$on('selectedcustomer', function (event) {
			if (CRMControllerSelectedAccount.selectedAccount === $scope.selectedcustomer) { return; }
			CRMControllerSelectedAccount.onSelectCustomer();
		});

		$scope.$on('$destroy', function () {
			$rootScope.selectedAccountCRM = undefined;
			CRMControllerSelectedAccount = undefined;
		});

		$scope.$on('$killyourself', function (identifiers) {
			if (!angular.isArray(identifiers)) { return; }

			var i;

			for (i = 0; i < identifiers.length; i += 1) {
				if (CRMUtil.isDefined(identifiers[i].widgetMenuName) && identifiers[i].widgetMenuName === "html-crm.dashboard.selected-account") {
					$rootScope.selectedAccountCRM = undefined;
					CRMControllerSelectedAccount = undefined;
				}
			}
		});
	};

	controllerSelectedAccount.$inject = [
		'$rootScope',
		'$scope',
		'$filter',
		'$location',
		'$totvsprofile',
		'TOTVSEvent',
		'crm.helper',
		'crm.account.helper',
		'crm.crm_pessoa.conta.factory',
		'crm.dashboard.selected-account.modal.parameter',
		'crm.crm_param.factory',
		'crm.account.modal.edit',
        'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.dashboard.selected-account.controller', controllerSelectedAccount);
});


