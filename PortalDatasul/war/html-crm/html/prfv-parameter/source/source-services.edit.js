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
				templateUrl: '/dts/crm/html/prfv-parameter/source/source.edit.html',
				controller: 'crm.crm_prfv_ped.edit.control as controller',
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

		this.prfvSources = [
			{num_id: 1, nom_fonte: $rootScope.i18n('l-prfv-source-open', [], 'dts/crm')},
			{num_id: 2, nom_fonte: $rootScope.i18n('l-prfv-source-partial', [], 'dts/crm')},
			{num_id: 3, nom_fonte: $rootScope.i18n('l-prfv-source-total', [], 'dts/crm')},
			{num_id: 4, nom_fonte: $rootScope.i18n('l-prfv-source-suspended', [], 'dts/crm')},
			{num_id: 5, nom_fonte: $rootScope.i18n('l-prfv-source-canceled', [], 'dts/crm')}
		];

		this.loadDefaults = function () {

			if (!this.model) {
				this.model = {};
			}
			this.model.ttPRFVFonte = this.prfvSources[0];

		};

		this.init = function () {
			this.loadDefaults();
		};

		this.save = function (isSaveAndNew) {
			var vo;

			if (this.isInvalidForm()) { return; }

			vo = this.convertToSave();

			parameterFactory.saveSource(CRMControl.parameterId, vo, function (result) {
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
			vo.idi_status_ped = CRMControl.model.ttPRFVFonte.num_id;
			vo.num_id_prfv = CRMControl.parameterId;

			return vo;
		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.ttPRFVFonte || model.ttPRFVFonte.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-prfv-source');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-prfv-sources', messages);
			}

			return isInvalidForm;
		};

		this.cancel = function () {
			$modalInstance.close(CRMControl.resultList);
		};

		this.model = parameters.source || {};
		this.parameterId = parameters.parameterId;

		this.init();
	};

	controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'crm.helper', 'crm.crm_param_prfv.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.crm_prfv_ped.modal.edit', modal);
	index.register.controller('crm.crm_prfv_ped.edit.control', controller);
});
