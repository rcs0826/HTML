/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1051.js',
	'/dts/crm/js/api/fchcrm1052.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_propried.js',
	'/dts/crm/html/user/user-services.js'
], function (index) {

	'use strict';

	var modalReportEdit,
		controllerReportEdit;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalReportEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/report/report.edit.html',
				controller: 'crm.report.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalReportEdit.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerReportEdit = function ($rootScope, $scope, $modalInstance, $filter, TOTVSEvent,
									  parameters, helper, reportFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlReportEdit = this;

		this.model = undefined;
		this.editMode = false;

		this.modules = helper.getCRMModules();

		this.modules.splice(0, 1);

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {

			if (this.isInvalidForm()) { return; }

			var vo = this.convertToSave();

			if (!vo) { return; }

			if (this.editMode) {
				reportFactory.updateRecord(vo.num_id, vo, CRMControlReportEdit.afterSave);
			} else {
				reportFactory.saveRecord(vo, CRMControlReportEdit.afterSave);
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.validadeParameterModel = function () {

			var report = this.model || {};

			this.editMode = (report.num_id > 0);
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false;

			if (!this.model.ttCRMModule) {
				isInvalidForm = true;
				messages.push('l-module');
			}

			if (!this.model.nom_relat || this.model.nom_relat.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!this.model.nom_arq_relat || this.model.nom_arq_relat.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-file');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-report', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {};

			if (this.model.num_id && this.model.num_id > 0) {
				vo.num_id = this.model.num_id;
			}

			vo.nom_relat     = this.model.nom_relat;
			vo.nom_arq_relat = this.model.nom_arq_relat;
			vo.log_hier_time = this.model.log_hier_time;

			if (this.model.ttCRMModule) {
				vo.idi_modul_crm = this.model.ttCRMModule.num_id;
			}

			return vo;
		};

		this.afterSave = function (report) {

			if (!report) { return; }

			var detailMsg = CRMControlReportEdit.editMode ? 'msg-update-generic' : 'msg-save-generic';

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-report', [], 'dts/crm'),
				detail: $rootScope.i18n(detailMsg, [
					$rootScope.i18n('l-report', [], 'dts/crm'), report.nom_relat
				], 'dts/crm')
			});

			$scope.$broadcast(CRMEvent.scopeSaveReport, report);

			$modalInstance.close(report);
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.report ? angular.copy(parameters.report) : {};

		this.validadeParameterModel();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlReportEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerReportEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'TOTVSEvent', 'parameters', 'crm.helper',
		'crm.crm_relat_web.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.report.modal.edit', modalReportEdit);
	index.register.controller('crm.report.edit.control', controllerReportEdit);
});
