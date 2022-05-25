/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1000.js',
    '/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/dashboard/task-summary-parameters.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/task/task-services.param.js',
    '/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTaskSummary;

	// *************************************************************************************
	// *** CONTROLLER
	// *************************************************************************************
	controllerTaskSummary = function ($rootScope, $scope, $filter, $location, $totvsprofile, TOTVSEvent, helper, taskFactory, helperTask, accountHelper, modalTaskSummaryParameter, serviceTaskParam, modalTaskEdit, accountFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerTaskSummary = this;

        this.accessRestriction = undefined;
		this.series = [];
		this.categories = [];
		this.data = undefined;
		this.options = {};

		this.disclaimers = [];
		this.accountDisclaimer = undefined;
		this.tooltip = "";

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.isAccountDisclaimerAvail = function () {
			return (CRMControllerTaskSummary.accountSelected && CRMControllerTaskSummary.accountDisclaimer);
		};

		this.parseToolTip = function (account) {
			if (!account) {
				return;
			}
			CRMControllerTaskSummary.tooltip = "<b>" + $rootScope.i18n('l-selected-customer', [], 'dts/mpd/') + "</b>: " + account.nom_razao_social + " (" + account.cod_pessoa_erp + ")";
		};

		this.parseAccountDisclaimer = function (account) {
			if (!account) {
				return;
			}
			CRMControllerTaskSummary.accountDisclaimer = {
				property: 'num_id_pessoa',
				value: account.num_id,
				title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + account.nom_razao_social,
				model: account.num_id
			};
		};

		this.onSelectAccountCrm = function (callback) {
			var account = $scope.selectedAccountCRM;

			CRMControllerTaskSummary.parseAccountDisclaimer(account);
			CRMControllerTaskSummary.parseToolTip(account);

			CRMControllerTaskSummary.applySelectedAccount(account, function () {
				if (callback) { callback(); }
			});
		};

		this.onSelectCustomer = function (isInitializing, callback) {
			var selected = $scope.selectedcustomer, applyConfig;

			if (CRMControllerTaskSummary.accountSelected && selected) {
				if (this.accountSelected.cod_pessoa_erp === selected['cod-emitente'].toString()) {
					return; //ja esta posicionado na conta
				}
			}

			applyConfig = function (account) {
				CRMControllerTaskSummary.applySelectedAccount(account, function () {
					if (callback) { callback(); }
				});
			};

			if (selected !== undefined) {
				accountFactory.getAccountByERPCode($scope.selectedcustomer['cod-emitente'], function (account) {
					if (CRMUtil.isUndefined(account)) {
						return;
					}

					CRMControllerTaskSummary.parseAccountDisclaimer(account);
					CRMControllerTaskSummary.parseToolTip(account);

					applyConfig(account);
				});
			} else {
				applyConfig();
			}
		};

		this.applySelectedAccount = function (account, callback) {
			CRMControllerTaskSummary.accountSelected = account;

			if (account === undefined) {
				CRMControllerTaskSummary.accountDisclaimer = undefined;
				CRMControllerTaskSummary.tooltip = "";
			}

			CRMControllerTaskSummary.saveConfig(CRMControllerTaskSummary.disclaimers, CRMControllerTaskSummary.accountDisclaimer);

			if (callback) { callback(); }
		};

		this.onClick = function (event) {

			if (!event) {
				return;
			}

			CRMControllerTaskSummary.openDetail(false, event.dataItem.group);
		};

		this.openDetail = function (isCalendar, group) {
			var url = '/dts/crm/task/',
				disclaimers = [],
				propertyValue = '';

			if (group && group.name && group.id) {
				propertyValue = group.name + "#" + group.id.toString();
			}

			if (!CRMControllerTaskSummary.data || CRMControllerTaskSummary.data.length <= 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-task-summary', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-no-data-detail', [], 'dts/crm')
				});
				return;
			}

			if (isCalendar) {
				url = url + 'calendar';
			}

			disclaimers.push({
				property: 'custom.tasksummary',
				value: propertyValue,
				title: $rootScope.i18n('l-widget-task-summary', [], 'dts/crm'),
				model: {property: 'custom.tasksummary', value: propertyValue}
			});

			serviceTaskParam.setParamOpp(disclaimers, function () {
				$scope.safeApply(function () {
					$location.path(url);
				});
			});
		};

		this.openTask = function () {
			var fnOpen = function (account) {
				modalTaskEdit.open({ task: { ttConta: account } });
			};

			fnOpen(CRMControllerTaskSummary.accountSelected);
		};

		this.showConfig = function () {

			modalTaskSummaryParameter.open({
				disclaimers: CRMControllerTaskSummary.disclaimers
			}).then(function (result) {

				if (!result) {
					return;
				}

				CRMControllerTaskSummary.disclaimers = angular.copy(result.disclaimers);

				CRMControllerTaskSummary.loadData(CRMControllerTaskSummary.disclaimers);
				CRMControllerTaskSummary.saveConfig(CRMControllerTaskSummary.disclaimers, CRMControllerTaskSummary.accountDisclaimer);
			});

		};

		this.getConfig = function (callback) {
			$totvsprofile.remote.get(helperTask.taskSummaryConfig, undefined, function (result) {

				if (result && angular.isArray(result)) {
					result = result[0];
				}

				if (result && result.dataValue) {
					result = result.dataValue;
				}

				result = CRMControllerTaskSummary.parseConfigToModel(result);

				if (callback) { callback(result); }
			});
		};

		this.saveConfig = function (disclaimers, accountDisclaimer, callback) {

			var config;

			config = CRMControllerTaskSummary.parseConfig(disclaimers, accountDisclaimer);

			$totvsprofile.remote.set(helperTask.taskSummaryConfig, {dataValue: config}, callback);
		};

		this.parseConfig = function (disclaimers, accountDisclaimer) {

			var template;

			if (!accountDisclaimer) {
				accountDisclaimer = [];
			}

			if (!angular.isArray(accountDisclaimer)) {
				accountDisclaimer = [accountDisclaimer];
			}

			template = {
				"dsResumoTarefa": {
					"ttFilterAccount": accountDisclaimer,
					"ttFilterTask": disclaimers
				}
			};

			return template;
		};

		this.parseConfigToModel = function (config) {
			var disclaimers;

			if (config) {
				disclaimers = angular.copy(config.dsResumoTarefa.ttFilterTask);
			}

			if (CRMUtil.isUndefined(disclaimers)) {
				disclaimers = [{
					"property": "custom.idi_agrupador",
					"value": 1
				}, {
					"property": "custom.idi_period",
					"value": 3
				}];
			}

			return {
				disclaimers: disclaimers
			};
		};

		this.refresh = function () {
			CRMControllerTaskSummary.loadData(CRMControllerTaskSummary.disclaimers);
		};

		this.apply = function (result) {
			var i,
				propertyName = "idi_status_tar", /* default */
				val_total;

			for (i = 0; i < CRMControllerTaskSummary.disclaimers.length; i++) {
				if (CRMControllerTaskSummary.disclaimers[i].property === "custom.idi_agrupador") {

					switch (CRMControllerTaskSummary.disclaimers[i].value) {
					case 2:
						propertyName = 'num_id_respons';
						break;
					case 3:
						propertyName = 'num_id_acao';
						break;
					case 4:
						propertyName = 'num_id_campanha';
						break;
					}

				}
			}

			if (result && result[0].$length > 0) {

				val_total = result[0].$length;

				CRMControllerTaskSummary.data = [];

				for (i = 0; i < result.length; i++) {

					CRMControllerTaskSummary.data.push({
						category: $rootScope.i18n(result[i].nom_grupo, [], 'dts/crm'),
						value: (result[i].val_total_grupo / val_total * 100).toFixed(2),
						total: result[i].val_total_grupo,
						color: result[i].nom_cor,
						ids: result[i].nom_total_grupo,
						group: {name: propertyName, id: result[i].id_grupo}
					});

				}
			} else {
				CRMControllerTaskSummary.data = [];
			}

			CRMControllerTaskSummary.options = {
				legend: {
					position: "bottom",
					visible: true
				},
				chartArea: {
					height: 330
				},
				valueAxis: {
					majorUnit: 1
				},
				seriesDefaults: {
					labels: {
						visible: true,
						background: "transparent",
						template: "#= category #: \n #= value #%"
					}
				},
				tooltip: {
					visible: true,
					template: function (dataItem) {
						return dataItem.dataItem.category + ": " +  dataItem.dataItem.total;
					}
				},
				series: [{
					overlay: {
						gradient: "roundedBevel"
					},
					startAngle: 180,
					data: CRMControllerTaskSummary.data,
					type: "pie"
				}]
			};

		};

		this.loadData = function (disclaimers) {
			var load;

			if (CRMControllerTaskSummary.isPendingListSearch === true) { return; }

			if (!disclaimers || !angular.isArray(disclaimers)) {
				disclaimers = [];
			}

			load = function () {
				CRMControllerTaskSummary.isPendingListSearch = true;

				taskFactory.getTaskSummary(disclaimers, function (result) {
					CRMControllerTaskSummary.isPendingListSearch = false;
					CRMControllerTaskSummary.apply(result);
				});
			};

			if (CRMControllerTaskSummary.isAccountDisclaimerAvail()) {
				disclaimers = disclaimers.concat([CRMControllerTaskSummary.accountDisclaimer]);
			}

			load();

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

		this.parseConfigSelectedAccountToModel = function (result) {
			var dsCarteiraClienteCRM,
				selectedAccount;

			if (result && angular.isArray(result)) {
				result = result[0];
			}
			if (result && result.dataValue) {
				result = result.dataValue;
			}

			dsCarteiraClienteCRM = result ? result.dsCarteiraClienteCRM : undefined;

			if (dsCarteiraClienteCRM && dsCarteiraClienteCRM.selectedAccount) {
				selectedAccount = dsCarteiraClienteCRM.selectedAccount;
			}

			return selectedAccount !== undefined;
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		this.init = function () {
			var total = 2,
				count = 0,
				isAccountSelected = false,
				loadData = function () {
					if (!isAccountSelected) {
						CRMControllerTaskSummary.loadData(CRMControllerTaskSummary.disclaimers);
					}
				};
            
            accessRestrictionFactory.getUserRestrictions('task.list', $rootScope.currentuser.login, function (result) {
                CRMControllerTaskSummary.accessRestriction = result || {};
            });


			CRMControllerTaskSummary.getConfig(function (result) {
				if (result && (result.disclaimers && result.disclaimers.length > 0)) {
					CRMControllerTaskSummary.disclaimers = result.disclaimers;
				}
				count++;
				if (count === total) {
					loadData(CRMControllerTaskSummary.disclaimers);
				}
			});

			$totvsprofile.remote.get(accountHelper.selectedAccountConfig, undefined, function (result) {

				isAccountSelected = CRMControllerTaskSummary.parseConfigSelectedAccountToModel(result);
				count++;
				if (count === total) {
					loadData(CRMControllerTaskSummary.disclaimers);
				}
			});

		};

		if ($rootScope.currentuserLoaded) { CRMControllerTaskSummary.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControllerTaskSummary.init();
		});

		$scope.$on('selectedcustomer', function (event) {
			if ($scope.selectedAccountCRM) { return; }
			if (CRMControllerTaskSummary.accountSelected === $scope.selectedcustomer) { return; }
			CRMControllerTaskSummary.onSelectCustomer(CRMControllerTaskSummary.refresh);
		});

		$scope.$watch(function () {
			return $rootScope.selectedAccountCRM;
		}, function (data, oldData) {
			if (data === undefined && oldData === data) { return; }
			CRMControllerTaskSummary.onSelectAccountCrm(CRMControllerTaskSummary.refresh);
		}, true);

		$scope.$on('$destroy', function () {
			CRMControllerTaskSummary = undefined;
		});

		$scope.$on('$killyourself', function (identifiers) {
			if (!angular.isArray(identifiers)) { return; }

			var i;

			for (i = 0; i < identifiers.length; i += 1) {
				if (CRMUtil.isDefined(identifiers[i].widgetMenuName) && identifiers[i].widgetMenuName === "html-crm.dashboard.task-summary") {
					CRMControllerTaskSummary = undefined;
				}
			}
		});
	};

	controllerTaskSummary.$inject = [
		'$rootScope',
		'$scope',
		'$filter',
		'$location',
		'$totvsprofile',
		'TOTVSEvent',
		'crm.helper',
		'crm.crm_tar.factory',
		'crm.task.helper',
		'crm.account.helper',
		'crm.dashboard.task-summary.modal.parameter',
		'crm.task.param-service',
		'crm.task.modal.edit',
		'crm.crm_pessoa.conta.factory',
        'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.dashboard.task-summary.controller', controllerTaskSummary);
});

