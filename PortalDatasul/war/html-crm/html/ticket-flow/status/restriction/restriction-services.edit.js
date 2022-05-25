/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, helper*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1098.js',
	'/dts/crm/js/api/fchcrm1100.js',
	'/dts/crm/js/api/fchcrm1106.js'

], function (index) {

	'use strict';
	var controllerStatusRestrictionEdit,
		modalStatusRestrictionEdit;

	controllerStatusRestrictionEdit = function ($rootScope, $scope, $modalInstance, $filter, helper, parameters,
											 TOTVSEvent, ticketFlowRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = {};

		this.status = undefined;
		this.editMode = false;
		this.ttFluxoStatus = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {
			var i,
				vo,
				message,
				fnAfterSave;

			fnAfterSave = function (item) {

				if (!item) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('nav-status-restriction', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-restriction', [], 'dts/crm'),
						item.ttRestricao.nom_status_ocor
					], 'dts/crm')
				});

				CRMControl.close(item);
			};

			if (CRMControl.isInvalidForm()) { return; }

			if (CRMControl.model.num_id_restriction && CRMControl.model.num_id_restriction.length > 0) {
				for (i = 0; i < CRMControl.model.num_id_restriction.length; i++) {

					vo = CRMControl.convertToSave(CRMControl.model.num_id_restriction[i].num_id);

					if (!vo) { return; }

					if (CRMControl.editMode === true) {
						message = 'msg-update-generic';
						ticketFlowRestrictionFactory.updateRecord(vo.num_id, vo, fnAfterSave);
					} else {
						message = 'msg-save-generic';
						ticketFlowRestrictionFactory.saveRecord(vo, fnAfterSave);
					}
				}
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.num_id_restriction && model.num_id_restriction.length > 0) {
				isInvalidForm = true;
				messages.push('l-status');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-status-restriction', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function (id) {

			var vo = {};

			vo.num_id_ocor_fluxo_status = CRMControl.status.num_id;
			vo.num_id_ocor_fluxo_status_restric = id;

			return vo;
		};


		this.load = function () {
		};

		this.close = function (item) {
			if ($modalInstance) {
				$modalInstance.close(item);
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.init = function () {
			CRMControl.load();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.status = parameters.status || angular.copy(parameters.status);
		this.ttFluxoStatus = parameters.ttFluxoStatus || angular.copy(parameters.ttFluxoStatus);
		this.model  = parameters.model ? angular.copy(parameters.model) : {};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});

	}; // controllerStatusRestrictionEdit
	controllerStatusRestrictionEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'crm.helper', 'parameters', 'TOTVSEvent', 'crm.crm_ocor_fluxo_restric.factory'
	];

	// *************************************************************************************
	// *** MODAL SELECT STYLE TO ACCOUNT
	// *************************************************************************************
	modalStatusRestrictionEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-flow/status/restriction/restriction.edit.html',
				controller: 'crm.ticket-flow-status-restriction.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalStatusRestrictionEdit.$inject = ['$modal'];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.ticket-flow-status-restriction.modal.selection', modalStatusRestrictionEdit);

	index.register.controller('crm.ticket-flow-status-restriction.edit.control', controllerStatusRestrictionEdit);

});
