/*global $, index, angular, define, TOTVSEvent, CRMEvent */
/*jslint plusplus: true */
define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1101.js',
	'/dts/crm/js/api/fchcrm1104.js',
	'/dts/crm/html/rpw-schedule/rpw-schedule-services.js'
], function (index) {

	'use strict';

	var controllerMonitorAccMov;

	controllerMonitorAccMov = function ($rootScope, $scope, TOTVSEvent, helper, modalSchedule,
										 backgroundRoutinesFactory, accountMonitorParameterFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMMonitorAccMov = this;

		this.model = {};

		this.monitorParameters = [];

		this.programName = "crm00356";
		this.summary = [];
		this.summaryOpen = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.openModalSchedule = function (callback) {

			modalSchedule.open({
				programName: CRMMonitorAccMov.programName
			}).then(function (result) {
				if (callback) { callback(result); }
			});

		};

		this.execute = function () {
			if (CRMMonitorAccMov.isInvalidForm()) { return; }

			CRMMonitorAccMov.openModalSchedule(function (schedule) {

				var vo = CRMMonitorAccMov.convertToSave(schedule);

				if (!vo) { return; }

				backgroundRoutinesFactory.executeMonitorAccountMovement(vo, function (result) {

					if (result.$hasError === true) { return; }

					if (result) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-monitor-account-movement', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-monitor-account-movement-success', [
								$rootScope.i18n('l-monitor-account-movement')
							], 'dts/crm')
						});
					}

				});

			});
		};

		this.convertToSave = function (schedule) {

			var vo = {
					ttMonitorAccountMoviment: {
						num_id_param: CRMMonitorAccMov.model.parameter.id
					},
					ttRPWSchedule: {
						RPWServer: schedule.RPWServer,
						executeDate: schedule.executeDate,
						initialHour: schedule.initialHour,
						isAutomaticCalendar: schedule.isAutomaticCalendar
					}
				};

			return vo;
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false;

			if (!this.model.parameter || !this.model.parameter.id || this.model.parameter.id < 1) {
				isInvalidForm = true;
				messages.push('l-account-monitor-parameter');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-monitor-account-movement', messages);
			}

			return isInvalidForm;
		};

		this.getSummary = function () {
			backgroundRoutinesFactory.getInfoSchedule(CRMMonitorAccMov.programName, function (result) {
				CRMMonitorAccMov.summary = (result && result.length > 0) ? result : [];
			});
		};

		this.getAllParameters = function () {
			accountMonitorParameterFactory.getAllParameters(function (result) {
				CRMMonitorAccMov.monitorParameters = (result && result.length > 0) ? result : [];
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			this.getSummary();
			this.getAllParameters();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		CRMMonitorAccMov.init();

		$scope.$on('$destroy', function () {
			CRMMonitorAccMov = undefined;
		});


	};

	controllerMonitorAccMov.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.rpw-schedule.modal.edit', 'crm.crm_backgroundruntimes.factory', 'crm.crm_monitor_account_movement.factory'
	];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('monitor-account-movement.control', controllerMonitorAccMov);

});
