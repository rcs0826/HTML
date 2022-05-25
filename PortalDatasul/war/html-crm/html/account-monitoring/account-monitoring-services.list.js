/*globals define, angular */
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1101.js',
	'/dts/crm/js/api/fchcrm1104.js',
	'/dts/crm/html/rpw-schedule/rpw-schedule-services.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controller = function ($scope, $rootScope, TOTVSEvent, helper, parameterFactory, userPreferenceModal, modalEdit,
						   modalSchedule, backgroundRoutinesFactory) {

		var CRMControl = this;

		this.listOfAccountMonitoring = [];
		this.listOfAccountMonitoringCount = 0;
		this.programName = "crm00356";

		this.disclaimers = [];

		this.isPendingListSearch = false;

		this.types = [
			{num_id: 1, nom_tipo: $rootScope.i18n('l-team-hierarchy', [], 'dts/crm')},
			{num_id: 2, nom_tipo: $rootScope.i18n('l-group-user', [], 'dts/crm')},
			{num_id: 3, nom_tipo: $rootScope.i18n('l-group-client', [], 'dts/crm')}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.removeDisclaimer = function (disclaimer) {

			var index;

			index = CRMControl.disclaimers.indexOf(disclaimer);

			if (index !== -1) {
				CRMControl.disclaimers.splice(index, 1);
				CRMControl.search(false);
			}
		};

		this.search = function (isMore) {

			var options, filters = [];

			if (CRMControl.isPendingListSearch === true) {
				return;
			}

			CRMControl.listOfAccountMonitoringCount = 0;

			if (!isMore) {
				CRMControl.listOfAccountMonitoring = [];
			}

			options = {
				start: CRMControl.listOfAccountMonitoring.length,
				end: 50
			};

			CRMControl.parseQuickFilters(filters);

			filters = filters.concat(CRMControl.disclaimers);

			CRMControl.isPendingListSearch = true;

			parameterFactory.findRecords(filters, options, function (result) {
				CRMControl.addItemInList(result);
				CRMControl.isPendingListSearch = false;
			});
		};

		this.updateItemInList = function (parameter, oldParameter) {

			oldParameter = oldParameter || parameter;

			var index = this.listOfAccountMonitoring.indexOf(oldParameter);

			this.listOfAccountMonitoring[index] = parameter;
		};

		this.addItemInList = function (parameters, isNew) {

			var i, parameter;

			if (!parameters) { return; }

			if (!angular.isArray(parameters)) {
				parameters = [parameters];
				CRMControl.listOfAccountMonitoringCount += 1;
			}

			for (i = 0; i < parameters.length; i += 1) {

				parameter = parameters[i];

				if (parameter && parameter.$length) {
					CRMControl.listOfAccountMonitoringCount = parameter.$length;
				}

				if (isNew !== true) {
					CRMControl.listOfAccountMonitoring.push(parameter);
				} else {
					CRMControl.listOfAccountMonitoring.unshift(parameter);
				}
			}
		};

		this.parseQuickFilters = function (filters) {
			if (CRMControl.quickSearchText && CRMControl.quickSearchText.trim().length > 0) {
				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControl.quickSearchText)
				});
			}
		};

		this.addEdit = function (parameter) {
			modalEdit.open({
				parameter: parameter
			}).then(function (result) {
				if (result !== undefined) {
					if (parameter !== undefined) {
						CRMControl.updateItemInList(result, parameter);
					} else {
						CRMControl.addItemInList(result, true);
					}
				}
			});
		};

		this.openModalSchedule = function (callback) {

			modalSchedule.open({
				programName: CRMControl.programName
			}).then(function (result) {
				if (callback) { callback(result); }
			});

		};

		this.execute = function (parameter) {
			CRMControl.openModalSchedule(function (schedule) {

				var vo = CRMControl.convertToSave(parameter, schedule);

				if (!vo) { return; }

				backgroundRoutinesFactory.executeMonitorAccountMovement(vo, function (result) {

					if (result.$hasError === true) { return; }

					if (result) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-account-monitoring', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-account-monitoring-rpw-success', [
								$rootScope.i18n('nav-account-monitoring')
							], 'dts/crm')
						});
					}

				});

			});
		};

		this.convertToSave = function (parameter, schedule) {
			var vo = {},
				ttMonitorAccountMoviment = {},
				ttRPWSchedule = {};

			vo.ttMonitorAccountMoviment = {
				num_id_param: parameter.num_id
			};

			vo.ttRPWSchedule = {
				RPWServer: schedule.RPWServer,
				executeDate: schedule.executeDate,
				initialHour: schedule.initialHour,
				isAutomaticCalendar: schedule.isAutomaticCalendar
			};


			return vo;
		};

		this.remove = function (item) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-account-monitoring', [], 'dts/crm').toLowerCase(), item.cod_livre_1
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					parameterFactory.deleteRecord(item.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						var index = CRMControl.listOfAccountMonitoring.indexOf(item);

						if (index !== -1) {
							CRMControl.listOfAccountMonitoring.splice(index, 1);
							CRMControl.listOfAccountMonitoringCount -= 1;
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-account-monitoring', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'account-monitoring.list' });
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function init() {

			var viewName = $rootScope.i18n('nav-account-monitoring', [], 'dts/crm'),
				viewController = 'crm.account-monitoring.list.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);
				CRMControl.search();
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});
	};

	controller.$inject = [
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_monitor_account_movement.factory',
		'crm.user.modal.preference', 'crm.account-monitoring.modal.edit', 'crm.rpw-schedule.modal.edit',
		'crm.crm_backgroundruntimes.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.account-monitoring.list.control', controller);
});
