/*global $, index, angular, define, TOTVSEvent, CRMEvent */
/*jslint plusplus: true */
define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1101.js',
	'/dts/crm/html/rpw-schedule/rpw-schedule-services.js'
], function (index) {

	'use strict';

	var controllerAccountStatus;

	controllerAccountStatus = function ($rootScope, $scope, TOTVSEvent, helper, modalSchedule,
									  backgroundRoutinesFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMAccountStatus = this;

		this.model = {};

		this.programName = "crm1003";
		this.summary = [];
		this.summaryOpen = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.openModalSchedule = function (callback) {

			modalSchedule.open({
				programName: CRMAccountStatus.programName
			}).then(function (result) {
				if (callback) { callback(result); }
			});

		};

		this.execute = function () {
			if (CRMAccountStatus.isInvalidForm()) { return; }

			CRMAccountStatus.openModalSchedule(function (schedule) {

				var vo = CRMAccountStatus.convertToSave(schedule);

				if (!vo) { return; }

				backgroundRoutinesFactory.updateAccountStatus(vo, function (result) {

					if (result.$hasError === true) { return; }

					if (result) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-account-status', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-account-status-success', [
								$rootScope.i18n('l-account-status')
							], 'dts/crm')
						});
					}

				});

			});
		};

		this.convertToSave = function (schedule) {
			var vo = {
				RPWServer: schedule.RPWServer,
				executeDate: schedule.executeDate,
				initialHour: schedule.initialHour,
				isAutomaticCalendar: schedule.isAutomaticCalendar
			};

			return vo;
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false;

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-account-status', messages);
			}

			return isInvalidForm;
		};

		this.getSummary = function () {
			backgroundRoutinesFactory.getInfoSchedule(CRMAccountStatus.programName, function (result) {
				CRMAccountStatus.summary = (result && result.length > 0) ? result : [];
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			this.getSummary();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		CRMAccountStatus.init();

		$scope.$on('$destroy', function () {
			CRMAccountStatus = undefined;
		});


	};

	controllerAccountStatus.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.rpw-schedule.modal.edit', 'crm.crm_backgroundruntimes.factory'
	];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('account-status.control', controllerAccountStatus);

});
