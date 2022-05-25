/*global $, index, angular, define, TOTVSEvent, CRMEvent */
/*jslint plusplus: true */
define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1101.js',
	'/dts/crm/js/api/fchcrm1054.js',
	'/dts/crm/html/rpw-schedule/rpw-schedule-services.js'
], function (index) {

	'use strict';

	var controllerSupAccData;

	controllerSupAccData = function ($rootScope, $scope, TOTVSEvent, helper, targetFactory, modalSchedule,
									  backgroundRoutinesFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMSupAccData = this;

		this.model = {};

		this.programName = "crm338";
		this.summary = [];
		this.summaryOpen = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.openModalSchedule = function (callback) {

			modalSchedule.open({
				programName: CRMSupAccData.programName
			}).then(function (result) {
				if (callback) { callback(result); }
			});

		};

		this.execute = function () {
			if (CRMSupAccData.isInvalidForm()) { return; }

			CRMSupAccData.openModalSchedule(function (schedule) {

				var vo = CRMSupAccData.convertToSave(schedule);

				if (!vo) { return; }

				backgroundRoutinesFactory.createSupplementaryAccountData(vo, function (result) {

					if (result.$hasError === true) { return; }

					if (result) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-supplementary-account-data', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-complementary-account-data-success', [
								$rootScope.i18n('l-supplementary-account-data')
							], 'dts/crm')
						});
					}

				});

			});
		};

		this.convertToSave = function (schedule) {
			var vo = {},
				ttSupplementaryAccountData = {},
				ttRPWSchedule = {};


			vo.ttSupplementaryAccountData = {
				num_id_public: this.model.ttPublic ? this.model.ttPublic.num_id : 0,
				data: (new Date()).setYear(1900)
			};

			vo.ttRPWSchedule = {
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
				helper.showInvalidFormMessage('l-supplementary-account-data', messages);
			}

			return isInvalidForm;
		};

		this.getTargets = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_public_alvo', value: helper.parseStrictValue(value) };

			targetFactory.typeahead(filter, undefined, function (result) {
				CRMSupAccData.targets = result;
			});
		};

		this.getSummary = function () {
			backgroundRoutinesFactory.getInfoSchedule(CRMSupAccData.programName, function (result) {
				CRMSupAccData.summary = (result && result.length > 0) ? result : [];
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

		CRMSupAccData.init();

		$scope.$on('$destroy', function () {
			CRMSupAccData = undefined;
		});

		/*
		$scope.$on(CRMEvent.scopeLoadxpto..., function () {
			CRMSupAccData.init();
		});
		*/

	};

	controllerSupAccData.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_public.factory', 'crm.rpw-schedule.modal.edit', 'crm.crm_backgroundruntimes.factory'
	];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('supplementary-account-data.control', controllerSupAccData);

});
