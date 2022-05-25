/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_grp_usuar.js',
	'/dts/crm/html/user/user-services.js'
], function (index) {

	'use strict';

	var modalAccessRestrictionEdit,
		controllerAccessRestrictionEdit;

		// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalAccessRestrictionEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/access-restriction/access-restriction.edit.html',
				controller: 'crm.access-restriction.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalAccessRestrictionEdit.$inject = ['$modal'];
	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerAccessRestrictionEdit = function ($rootScope, $scope, $modalInstance, $filter, TOTVSEvent, parameters, helper,
		accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccessRestrictionEdit = this;

		this.model = undefined;
		this.editMode = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {

			if (this.isInvalidForm()) { return; }

			var vo = this.convertToSave();

			if (!vo) { return; }

			if (this.editMode) {
				accessRestrictionFactory.updateRecord(vo.num_id, vo, CRMControlAccessRestrictionEdit.afterSave);
			} else {
				accessRestrictionFactory.saveRecord(vo, CRMControlAccessRestrictionEdit.afterSave);
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.validadeParameterModel = function () {

			var restriction = this.model || {};

			this.editMode = (restriction.num_id > 0);
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false;

			if (!this.model.nom_acess || this.model.nom_acess.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-restriction', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {};

			if (this.model.num_id && this.model.num_id > 0) {
				vo.num_id = this.model.num_id;
			}

			vo.nom_acess = this.model.nom_acess;

			return vo;
		};

		this.afterSave = function (restriction) {

			if (!restriction) { return; }

			if (CRMControlAccessRestrictionEdit.editMode) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-restriction', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-update-restriction', [restriction.nom_acess], 'dts/crm')
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-restriction', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-restriction', [restriction.nom_acess], 'dts/crm')
				});
			}

			$scope.$broadcast(CRMEvent.scopeSaveAccessRestriction, restriction);

			$modalInstance.close(restriction);
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.restriction ? angular.copy(parameters.restriction) : {};

		this.validadeParameterModel();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccessRestrictionEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	}; // controllerAccessRestrictionEdit
	controllerAccessRestrictionEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'TOTVSEvent', 'parameters', 'crm.helper',
		'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.access-restriction.modal.edit', modalAccessRestrictionEdit);
	index.register.controller('crm.access-restriction.edit.control', controllerAccessRestrictionEdit);
});
