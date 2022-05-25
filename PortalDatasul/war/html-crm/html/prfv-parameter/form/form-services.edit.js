/*globals index, define, TOTVSEvent, CRMControl, console, CRMUtil */
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1116.js'
], function (index) {
	'use strict';

	var controller, modal;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/prfv-parameter/form/form.edit.html',
				controller: 'crm.crm_prfv_forma.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters, helper, parameterFactory) {

		var CRMControl = this, i;

		this.resultList = [];

		this.prfvForms = [
			{num_id: 1, nom_form: $rootScope.i18n('l-prfv-form-global', [], 'dts/crm')},
			{num_id: 2, nom_form: $rootScope.i18n('l-prfv-form-customer-type', [], 'dts/crm')},
			{num_id: 3, nom_form: $rootScope.i18n('l-prfv-form-activity-field', [], 'dts/crm')},
			{num_id: 4, nom_form: $rootScope.i18n('l-prfv-form-customer-group', [], 'dts/crm')},
			{num_id: 5, nom_form: $rootScope.i18n('l-prfv-form-classification', [], 'dts/crm')},
			{num_id: 6, nom_form: $rootScope.i18n('l-prfv-form-person-type', [], 'dts/crm')},
			{num_id: 7, nom_form: $rootScope.i18n('l-prfv-form-country', [], 'dts/crm')},
			{num_id: 8, nom_form: $rootScope.i18n('l-prfv-form-state', [], 'dts/crm')},
			{num_id: 9, nom_form: $rootScope.i18n('l-prfv-form-region', [], 'dts/crm')},
			{num_id: 10, nom_form: $rootScope.i18n('l-prfv-form-representative', [], 'dts/crm')},
			{num_id: 11, nom_form: $rootScope.i18n('l-prfv-form-sale-channel', [], 'dts/crm')}
		];

		this.loadDefaults = function () {

			if (!this.model) {
				this.model = {};
			}
			this.model.ttPRFVForma = this.prfvForms[0];

		};

		this.init = function () {
			this.loadDefaults();
		};

		this.save = function (isSaveAndNew) {
			var vo;

			if (this.isInvalidForm()) { return; }

			vo = this.convertToSave();

			parameterFactory.saveForm(CRMControl.parameterId, vo, function (result) {
				if (result && result.length > 0) {
					CRMControl.resultList.push(result[0]);

					if (!isSaveAndNew) {
						$modalInstance.close(CRMControl.resultList);
					} else {
						CRMControl.clear();
						CRMControl.loadDefaults();
					}
				}

			});
		};

		this.clear = function () {
			CRMControl.model = undefined;
		};

		this.convertToSave = function () {
			var vo = {};

			vo.num_id = CRMControl.model.num_id;
			vo.idi_forma_calc_prfv = CRMControl.model.ttPRFVForma.num_id;
			vo.num_id_prfv = CRMControl.parameterId;

			return vo;
		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.ttPRFVForma || model.ttPRFVForma.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-prfv-form');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-prfv-forms', messages);
			}

			return isInvalidForm;
		};

		this.cancel = function () {
			$modalInstance.close(CRMControl.resultList);
		};

		this.model = parameters.prfvForm || {};
		this.parameterId = parameters.parameterId;

		this.init();
	};

	controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'crm.helper', 'crm.crm_param_prfv.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.crm_prfv_forma.modal.edit', modal);
	index.register.controller('crm.crm_prfv_forma.edit.control', controller);
});
