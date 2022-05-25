/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_tar.js',
	'/dts/crm/js/zoom/crm_ocor.js',
	'/dts/crm/js/zoom/crm_histor_acao.js',
	'/dts/crm/js/zoom/crm_oportun_vda.js',
	'/dts/crm/js/crm-calendar-proxy.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js',
	'/dts/crm/html/attachment/attachment-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';
	var modalTaskCalendarSummary,
		controllerTaskCalendarSummary;

	// *************************************************************************************
	// *** MODAL TASK CALENDAR SUMMARY
	// *************************************************************************************

	modalTaskCalendarSummary = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/task/task.calendar.summary.html',
				controller: 'crm.task.calendar.summary.control as controller',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalTaskCalendarSummary.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER CALENDAR SUMMARY
	// *************************************************************************************

	controllerTaskCalendarSummary = function ($rootScope, $scope, $modalInstance, parameters,
										   taskFactory, taskHelper, modalEmailEdit, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTaskCalendarSummary = this;

		this.model = undefined;

		this.status = taskHelper.status;
		this.isShowPhoneInTask = false;
		this.isActiveUserGroup = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.execute = function () {
			if (parameters.func.execute) {
				parameters.func.execute(this.model);
			}
			$modalInstance.close(this.model);
		};

		this.reopen = function () {
			if (parameters.func.reopen) {
				parameters.func.reopen(this.model);
			}
			$modalInstance.close(this.model);
		};

		this.assume = function () {
			if (parameters.func.assume) {
				parameters.func.assume(this.model);
			}
			$modalInstance.close(this.model);
		};

		this.addEdit = function () {
			if (parameters.func.addEdit) {
				parameters.func.addEdit(this.model);
			}
			$modalInstance.close(this.model);
		};

		this.sendEmail = function (task) {
			modalEmailEdit.open({
				model: {
					ttTarefaOrigem: task
				}
			}).then(function (email) {
				// TODO: ?
			});
		};

		this.loadPreferences = function () {
			var filter,
				options;

			filter = { property: "num_id", value: this.model.num_id };

			options = { start: 0, end: 999999 };

			taskFactory.isShowPhoneInTask(function (result) {
				CRMControlTaskCalendarSummary.isShowPhoneInTask = result;
			});

			taskFactory.isActiveUserGroup(function (result) {
				CRMControlTaskCalendarSummary.isActiveUserGroup = result;
			});

			taskFactory.findRecords(filter, options, function (result) {
				CRMControlTaskCalendarSummary.model = result[0];

				taskHelper.parseStatus(CRMControlTaskCalendarSummary.model);

				taskFactory.getDescription(CRMControlTaskCalendarSummary.model.num_id, function (result) {
					CRMControlTaskCalendarSummary.model.dsl_motivo = result.dsl_motivo;
				});
			});
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('task.calendar.summary', $rootScope.currentuser.login, function (result) {
				CRMControlTaskCalendarSummary.accessRestriction = result || {};
			});

			this.loadPreferences();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.task ? angular.copy(parameters.task) : {};

		parameters.func = parameters.func || {};

		this.init();


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTaskCalendarSummary = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerTaskCalendarSummary.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'crm.crm_tar.factory',
		'crm.task.helper', 'crm.send-email.modal', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.task.modal.calendar.summary', modalTaskCalendarSummary);
	index.register.controller('crm.task.calendar.summary.control', controllerTaskCalendarSummary);
});
