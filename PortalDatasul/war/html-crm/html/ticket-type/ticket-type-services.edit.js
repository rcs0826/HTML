/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1032.js',
	'/dts/crm/html/ticket-type/ticket-subject/ticket-subject-services.selection.js',
	'/dts/crm/html/ticket-type/ticket-subject/ticket-subject-services.tab.js',
	'/dts/crm/html/user/user-services.js'
], function (index) {

	'use strict';

	var modalTypeEdit,
		controllerTicketTypeEdit;

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************
	controllerTicketTypeEdit = function ($rootScope, $scope, $modalInstance, $filter, TOTVSEvent, parameters, helper,
		typeFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketTypeEdit = this;

		this.model = undefined;
		this.editMode = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.init = function () {
			this.validadeParameterModel();
		};

		this.validadeParameterModel = function () {
			var ticketType = this.model || {};

			this.editMode = (ticketType.num_id > 0);
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.save = function () {

			if (this.isInvalidForm()) { return; }

			var vo = this.convertToSave();

			if (!vo) { return; }

			if (this.editMode) {
				typeFactory.updateRecord(vo.num_id, vo, CRMControlTicketTypeEdit.afterSave);
			} else {
				typeFactory.saveRecord(vo, CRMControlTicketTypeEdit.afterSave);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false;

			if (!this.model.nom_tip_ocor || this.model.nom_tip_ocor.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-description');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-ticket-type', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {};

			if (this.model.num_id && this.model.num_id > 0) {
				vo.num_id = this.model.num_id;
			}

			vo.nom_tip_ocor = this.model.nom_tip_ocor;
			vo.log_suspenso = this.model.log_suspenso;
			vo.log_reg_acao = this.model.log_reg_acao;

			return vo;
		};

		this.afterSave = function (ticketType) {

			if (!ticketType) { return; }

			if (CRMControlTicketTypeEdit.editMode) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-ticket-type', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-update-generic',
							[$rootScope.i18n('l-ticket-type', [], 'dts/crm'), ticketType.nom_tip_ocor], 'dts/crm')
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-ticket-type', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-generic',
							[$rootScope.i18n('l-ticket-type'), ticketType.nom_tip_ocor], 'dts/crm')

				});
			}

			$rootScope.$broadcast(CRMEvent.scopeSaveTicketType, ticketType);

			$modalInstance.close(ticketType);
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.ticketType ? angular.copy(parameters.ticketType) : {};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketTypeEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	}; // controllerTicketTypeEdit
	controllerTicketTypeEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'TOTVSEvent', 'parameters', 'crm.helper',
		'crm.crm_tip_ocor.factory'
	];

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalTypeEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-type/ticket-type.edit.html',
				controller: 'crm.ticket-type.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalTypeEdit.$inject = ['$modal'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.ticket-type.modal.edit', modalTypeEdit);
	index.register.controller('crm.ticket-type.edit.control', controllerTicketTypeEdit);
});
