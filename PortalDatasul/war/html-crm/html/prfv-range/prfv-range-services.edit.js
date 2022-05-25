/*global angular, define, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1027.js',
	'/dts/crm/js/api/fchcrm1054.js',
	'/dts/crm/js/api/fchcrm1116.js',
	'/dts/crm/js/api/fchcrm1117.js'
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
				templateUrl: '/dts/crm/html/prfv-range/prfv-range.edit.html',
				controller: 'crm.prfv-range.edit.control as controller',
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

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent,
							helper, rangeFactory, legend) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.loadDefaults = function () {
		};

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);
			this.loadDefaults();
		};

		this.save = function () {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			if (CRMControl.editMode === true) {
				rangeFactory.updateRecord(vo.num_id, vo, function (result) {
					if (!result) {
						return;
					}
					CRMControl.afterSave(result);
				});
			} else {
				rangeFactory.saveRecord(vo, function (result) {
					if (!result) {
						return;
					}
					CRMControl.afterSave(result);
				});
			}
		};

		this.cancel = function (range) {

			if ($modalInstance) {
				if (range) {
					$modalInstance.close(range);
				} else {
					$modalInstance.dismiss('cancel');
				}
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.des_faixa_prfv || model.des_faixa_prfv.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-prfv-range', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;
			vo.des_faixa_prfv = model.des_faixa_prfv;

			return vo;
		};

		this.afterSave = function (range) {

			if (!range) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-prfv-range', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-prfv-range', [], 'dts/crm'),
					range.des_faixa_prfv
				], 'dts/crm')
			});

			$modalInstance.close(range);

			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/prfv-range/detail/' + range.num_id);
			}
		};

		this.init = function () {
			this.validadeParameterModel();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.range ? angular.copy(parameters.range) : {};

		this.init();

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
		'crm.crm_prfv_faixa_cabec.factory', 'crm.legend'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.prfv-range.modal.edit', modal);
	index.register.controller('crm.prfv-range.edit.control', controller);
});

