/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/zoom/crm_produt.padrao.js'
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
				templateUrl: '/dts/crm/html/product/component/component.edit.html',
				controller: 'crm.product-component.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent, helper,
							factory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = {};
		this.editMode = false;
		this.products = [];
		this.findCustom = 'find_products';

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function (callback) {
			var model = this.model || {};

			CRMControl.editMode = (this.model.num_id && this.model.num_id > 0) ? true : false;

			if (callback) { callback(model); }
		};

		this.save = function () {
			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			if (CRMControl.editMode === true) {
				//factory.updateRecord(vo.num_id, vo, CRMControl.afterSave);
			} else {
				factory.addComponent(vo, CRMControl.afterSave);
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

			if (!model.component || !model.component.num_id || model.component.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-component');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-component', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id || 0;
			vo.num_id_produt_filho = model.component ? model.component.num_id : 0;
			vo.num_id_produt = model.product.num_id; /* id do pai */

			return vo;
		};

		this.afterSave = function (item) {

			if (!item || item.num_id < 1) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-component', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-component', [], 'dts/crm'),
					item.nom_produt
				], 'dts/crm')
			});

			$modalInstance.close(item);
		};

		this.getProducts = function (value) {
			if (!value || value === '') { return []; }

			var filter,
				options = {method: CRMControl.findCustom};

			filter = [{
				property: 'custom.quick_search',
				value: helper.parseStrictValue(value)
			}];

			factory.typeahead(filter, options, function (result) {
				CRMControl.products = result || [];
			});
		};

		this.loadData = function (callback) {};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model.product = parameters.product ? angular.copy(parameters.product) : {};

		this.validadeParameterModel(function () {
			if (!CRMControl.model.product || CRMControl.model.product.log_integrad_erp === true) {
				$modalInstance.dismiss('cancel');
			}
			CRMControl.loadData();
		});

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
		'crm.crm_produt.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.product-component.modal.edit', modal);
	index.register.controller('crm.product-component.edit.control', controller);
});
