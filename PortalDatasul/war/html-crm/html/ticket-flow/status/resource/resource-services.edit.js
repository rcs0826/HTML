/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, helper*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1098.js',
	'/dts/crm/js/api/fchcrm1100.js',
	'/dts/crm/js/api/fchcrm1105.js'

], function (index) {

	'use strict';
	var controllerStatusResourceEdit,
		modalStatusResourceEdit;

	controllerStatusResourceEdit = function ($rootScope, $scope, $modalInstance, $filter, helper, parameters,
											 TOTVSEvent, factory, ticketFlowResourceFactory, resourceLevelFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = {};

		this.status = undefined;
		this.resourceList = [];
		this.resourceLevelList = [];
		this.editMode = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.getResourcesByFlow = function () {
			ticketFlowResourceFactory.getResourcesByFlow(this.status.num_id_ocor_fluxo, function (result) {
				CRMControl.resourceList = result || [];
			});
		};

		this.getAllResourceLevel = function () {
			resourceLevelFactory.getAll(function (result) {
				CRMControl.resourceLevelList = result || [];
			}, true);
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
					title: $rootScope.i18n('l-ticket-flow-status-resource', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-resource', [], 'dts/crm'),
						item.ttRecurso.nom_usuar
					], 'dts/crm')
				});

				CRMControl.close(item, isToContinue);
			};

			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateRecord(vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.saveRecord(vo, fnAfterSave);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.ttRecurso || model.ttRecurso.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-resource');
			}

			if (!model.ttNivelRecurso || model.ttNivelRecurso.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-resource-level');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-ticket-flow-status-resource', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;
			vo.log_padr = model.log_padr || false;

			vo.num_id_ocor_fluxo_status = CRMControl.status.num_id;

			if (model.ttRecurso) {
				vo.num_id_ocor_fluxo_recur = model.ttRecurso.num_id;
			}

			if (model.ttNivelRecurso) {
				vo.num_id_niv_recur = model.ttNivelRecurso.num_id;
			}

			return vo;
		};

		this.validadeParameterModel = function () {

			var model = CRMControl.model || {};

			CRMControl.editMode = (model.num_id && model.num_id > 0);

			if (CRMControl.editMode === true) {

				if (model.num_id_ocor_fluxo_recur > 0) {
					model.ttRecurso = {
						num_id: model.num_id_ocor_fluxo_recur,
						num_id_recur: model.num_id_recur,
						nom_usuar: model.nom_usuar,
						cod_usuario: model.cod_usuario
					};
				}

				if (model.num_id_niv_recur > 0) {
					model.ttNivelRecurso = {
						num_id: model.num_id_niv_recur,
						nom_niv_recur: model.nom_niv_recur
					};
				}
			}

		};

		this.load = function () {
			CRMControl.getResourcesByFlow();
			CRMControl.getAllResourceLevel();
		};

		this.close = function (item, isToContinue) {

			if (isToContinue === true) {
				delete CRMControl.model.ttRecurso;
				delete CRMControl.model.ttNivelRecurso;
				CRMControl.model.log_padr = false;
				CRMControl.model.num_id = undefined;
				CRMControl.validadeParameterModel();
			} else if ($modalInstance) {
				$modalInstance.close(item);
			}

		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.init = function () {
			CRMControl.load();
			CRMControl.validadeParameterModel();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.status = parameters.status || angular.copy(parameters.status);
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

	}; // controllerStatusResourceEdit
	controllerStatusResourceEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'crm.helper', 'parameters', 'TOTVSEvent', 'crm.crm_ocor_fluxo_status_recur.factory', 'crm.crm_ocor_fluxo_recur.factory', 'crm.crm_niv_recur.factory'
	];

	// *************************************************************************************
	// *** MODAL SELECT STYLE TO ACCOUNT
	// *************************************************************************************
	modalStatusResourceEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-flow/status/resource/resource.edit.html',
				controller: 'crm.ticket-flow-status-resource.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalStatusResourceEdit.$inject = ['$modal'];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.ticket-flow-status-resource.modal.selection', modalStatusResourceEdit);

	index.register.controller('crm.ticket-flow-status-resource.edit.control', controllerStatusResourceEdit);

});
