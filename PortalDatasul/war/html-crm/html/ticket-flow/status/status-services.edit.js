/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1036.js',
	'/dts/crm/js/api/fchcrm1097.js',
	'/dts/crm/html/ticket-flow/status/status-services.edit.js',
	'/dts/crm/html/status/status-services.edit.js'
], function (index) {

	'use strict';

	var modal,
		controller;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-flow/status/status.edit.html',
				controller: 'crm.ticket-flow-status.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controller = function ($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, legend,
							helper, factory, modalStatusEdit, statusFactory, ticketFlowHelper) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;

		this.resultList = undefined;

		this.statusList = undefined;

		this.changePermissionList = ticketFlowHelper.changePermissions;

		this.refresh = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (model.num_id_status_ocor > 0) {
				model.ttStatus = {
					num_id: model.num_id_status_ocor,
					nom_status_ocor: model.nom_status_ocor
				};
			}

			if (model.num_livre_1 > 0) {
				ticketFlowHelper.parseStatusChangePermission(model.num_livre_1);
			}

		};

		this.save = function (isToContinue) {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave(),
				message,
				fnAfterSave;

			if (!vo) { return; }

			fnAfterSave = function (item) {

				if (!item) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-ticket-flow', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-ticket-flow', [], 'dts/crm'),
						item.nom_status_ocor
					], 'dts/crm')
				});

				CRMControl.close(item, isToContinue);
			};

			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateTicketFlowStatus(CRMControl.flow, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.addTicketFlowStatus(CRMControl.flow, vo, fnAfterSave);
			}
		};

		this.close = function (item, isToContinue) {

			CRMControl.resultList = CRMControl.resultList || [];

			if (CRMUtil.isDefined(item)) {
				CRMControl.resultList.push(item);
			}

			if (isToContinue === true) {
				this.refresh = false;

				delete CRMControl.model.ttStatus;
				CRMControl.model.log_encerra_ocor = false;
				CRMControl.model.log_status_reaber = false;
				CRMControl.model.log_todas_regra_status = false;
				CRMControl.model.log_suspenso = false;

				this.sequence++;

				CRMControl.validadeParameterModel();

				this.refresh = true;
			} else if ($modalInstance) {
				$modalInstance.close(CRMControl.resultList);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.ttStatus || model.ttStatus.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-status');
			}

			if (!model.ttChangePermission || model.ttChangePermission.id < 1) {
				isInvalidForm = true;
				messages.push('l-change-permissions');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-ticket-flow', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;

			vo.num_seq = model.num_seq || this.sequence;
			vo.num_id_ocor_fluxo = CRMControl.flow;

			if (model.ttStatus && model.ttStatus.num_id > 0) {
				vo.num_id_status_ocor = model.ttStatus.num_id;
			}

			if (model.ttChangePermission && model.ttChangePermission.id > 0) {
				vo.num_livre_1 = model.ttChangePermission.id;
			}

			vo.log_encerra_ocor = model.log_encerra_ocor || false;
			vo.log_status_reaber = model.log_status_reaber  || false;
			vo.log_suspenso = model.log_suspenso  || false;
			vo.log_recur_respons = model.log_recur_respons  || false;
			vo.log_todas_regra_status = model.log_todas_regra_status || false;

			return vo;
		};

		this.getStatus = function () {
			statusFactory.getAll(function (result) {
				CRMControl.statusList = result || [];
			}, true);
		};

		this.addStatus = function () {
			modalStatusEdit.open(undefined).then(function (results) {

				results = results || [];

				CRMControl.statusList = CRMControl.statusList || [];

				var i, result;

				for (i = 0; i < results.length; i++) {

					result = results[i];

					if (CRMUtil.isUndefined(result)) { continue; }

					CRMControl.statusList.push(result);

					if (i === results.length - 1) {
						CRMControl.model.ttStatus = result;
					}
				}

				CRMControl.model.ttAcao = result;
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.status ? angular.copy(parameters.status) : {};
		this.flow  = parameters.flow ? angular.copy(parameters.flow) : undefined;
		this.sequence  = parameters.sequence ? angular.copy(parameters.sequence) : undefined;

		this.getStatus();

		this.validadeParameterModel();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$modalInstance.dismiss('cancel');
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.legend',
		'crm.helper', 'crm.crm_ocor_fluxo.factory', 'crm.status.modal.edit', 'crm.crm_status_ocor.factory',
		'crm.ticket-flow.helper'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.ticket-flow-status.modal.edit', modal);
	index.register.controller('crm.ticket-flow-status.edit.control', controller);
});
