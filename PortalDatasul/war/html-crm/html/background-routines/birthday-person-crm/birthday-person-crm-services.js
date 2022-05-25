/*global $, index, angular, define, TOTVSEvent, CRMEvent */
/*jslint plusplus: true */
define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1101.js',
	'/dts/crm/js/api/fchcrm1060.js',
	'/dts/crm/html/rpw-schedule/rpw-schedule-services.js'
], function (index) {

	'use strict';

	var controllerBirthdayPerson;

	controllerBirthdayPerson = function ($rootScope, $scope, TOTVSEvent, helper, targetFactory, modalSchedule,
									  backgroundRoutinesFactory, notificationTemplateFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMBirthdayPerson = this;

		this.model = {};
		this.templates = [];
		this.programName = "crm304rp";
		this.summary = [];
		this.summaryOpen = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.openModalSchedule = function (callback) {

			modalSchedule.open({
				programName: CRMBirthdayPerson.programName
			}).then(function (result) {
				if (callback) { callback(result); }
			});

		};

		this.execute = function () {
			if (CRMBirthdayPerson.isInvalidForm()) { return; }

			CRMBirthdayPerson.openModalSchedule(function (schedule) {

				var vo = CRMBirthdayPerson.convertToSave(schedule);

				if (!vo) { return; }

				backgroundRoutinesFactory.createBackgroundRoutinesBirthdayPerson(vo, function (result) {

					if (result.$hasError === true) { return; }

					if (result) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-birthday-person', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-birthday-person-success', [
								$rootScope.i18n('l-birthday-person')
							], 'dts/crm')
						});
					}

				});

			});
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false;

			if (!this.model.nom_assunto || this.model.nom_assunto.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-subject');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-birthday-person', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function (schedule) {

		    var vo = {};

		    vo.ttBirthdayPerson = {};

			vo.ttBirthdayPerson.nom_assunto = this.model.nom_assunto;
			if (this.model.num_id_public_layout) {
			    vo.ttBirthdayPerson.num_id_public_layout = this.model.num_id_public_layout.num_id;
			}
			
			vo.ttRPWSchedule = {
				RPWServer: schedule.RPWServer,
				executeDate: schedule.executeDate,
				initialHour: schedule.initialHour,
				isAutomaticCalendar: schedule.isAutomaticCalendar
			};

			return vo;
		};

		this.getTemplates = function () {
			notificationTemplateFactory.getAll(function (result) {
				CRMBirthdayPerson.templates = result || [];
			}, true);
		};

		this.getSummary = function () {
			backgroundRoutinesFactory.getInfoSchedule(CRMBirthdayPerson.programName, function (result) {
				CRMBirthdayPerson.summary = (result && result.length > 0) ? result : [];
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			this.getSummary();
			this.getTemplates();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		CRMBirthdayPerson.init();

		$scope.$on('$destroy', function () {
			CRMBirthdayPerson = undefined;
		});

	};

	controllerBirthdayPerson.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_public.factory', 'crm.rpw-schedule.modal.edit', 'crm.crm_backgroundruntimes.factory', 'crm.crm_public_layout.factory'
	];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('birthday-person.control', controllerBirthdayPerson);

});
