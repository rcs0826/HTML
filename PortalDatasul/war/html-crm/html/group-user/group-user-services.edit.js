/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1046.js'
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
				templateUrl: '/dts/crm/html/group-user/group-user.edit.html',
				controller: 'crm.group-user.edit.control as controller',
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

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters,
							TOTVSEvent, helper, factory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		this.users = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {
			var model = this.model || {};
			this.editMode = (model.num_id > 0);
		};

		this.save = function () {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			if (CRMControl.editMode === true) {
				factory.updateRecord(vo.num_id, vo, CRMControl.afterSave);
			} else {
				factory.saveRecord(vo, CRMControl.afterSave);
			}
		};

		this.cancel = function (item) {

			if ($modalInstance) {
				if (item) {
					$modalInstance.close(item);
				} else {
					$modalInstance.dismiss('cancel');
				}
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.nom_grp_usuar || model.nom_grp_usuar.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-group-user', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id || 0;
			vo.nom_grp_usuar = model.nom_grp_usuar;
			vo.log_usuar_respons_tar = model.log_usuar_respons_tar || false;
			vo.log_livre_1 = model.log_livre_1 || false;
			vo.isSupervisor = model.isSupervisor || false;
			vo.log_permis_especial_con = model.log_permis_especial_con || false;

			return vo;
		};

		this.afterSave = function (item) {

			if (!item || !item.num_id) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-group-user', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-group-user', [], 'dts/crm'),
					item.nom_grp_usuar
				], 'dts/crm')
			});

			$modalInstance.close(item);
			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/group-user/detail/' + item.num_id);
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.model ? angular.copy(parameters.model) : {};

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
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.crm_grp_usuar.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.group-user.modal.edit', modal);
	index.register.controller('crm.group-user.edit.control', controller);
});
