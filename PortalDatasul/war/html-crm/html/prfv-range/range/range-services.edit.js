/*globals index, define, TOTVSEvent, CRMControl, console, CRMUtil */
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1117.js'
], function (index) {
	'use strict';

	var controller, modal;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/prfv-range/range/range.edit.html',
				controller: 'crm.crm_faixa.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters, helper, rangeFactory) {

		var CRMControl = this, i;

		this.resultList = [];

		this.colors = [
			{num_id: 1, nom_cor: $rootScope.i18n('l-color-yellow', [], 'dts/crm')},
			{num_id: 2, nom_cor: $rootScope.i18n('l-color-orange', [], 'dts/crm')},
			{num_id: 3, nom_cor: $rootScope.i18n('l-color-red', [], 'dts/crm')},
			{num_id: 4, nom_cor: $rootScope.i18n('l-color-pink', [], 'dts/crm')},
			{num_id: 5, nom_cor: $rootScope.i18n('l-color-dark-blue', [], 'dts/crm')},
			{num_id: 6, nom_cor: $rootScope.i18n('l-color-light-blue', [], 'dts/crm')},
			{num_id: 7, nom_cor: $rootScope.i18n('l-color-green', [], 'dts/crm')},
			{num_id: 8, nom_cor: $rootScope.i18n('l-color-brown', [], 'dts/crm')},
			{num_id: 9, nom_cor: $rootScope.i18n('l-color-black', [], 'dts/crm')},
			{num_id: 10, nom_cor: $rootScope.i18n('l-color-silver', [], 'dts/crm')},
			{num_id: 11, nom_cor: $rootScope.i18n('l-color-white', [], 'dts/crm')},
			{num_id: 12, nom_cor: $rootScope.i18n('l-color-violet', [], 'dts/crm')}
		];

		this.loadDefaults = function () {

			if (this.editMode) {
				if (this.model.idi_cor_con > 0) {
					this.model.ttCor = this.colors[this.model.idi_cor_con - 1];
				}
			} else {
				if (!this.model) {
					this.model = {};
				}
				this.model.ttCor = this.colors[0];
			}

		};

		this.init = function () {
			this.loadDefaults();
		};

		this.save = function (isSaveAndNew) {
			var vo;

			if (this.isInvalidForm()) { return; }

			vo = this.convertToSave();

			if (CRMControl.editMode === true) {
				rangeFactory.updateRange(CRMControl.headerRangeId, vo.num_id, vo, function (result) {
					if (result && result.length > 0) {
						CRMControl.resultList.push(result[0]);
						$modalInstance.close(CRMControl.resultList);
					}
				});
			} else {
				rangeFactory.saveRange(CRMControl.headerRangeId, vo, function (result) {
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
			}
		};

		this.clear = function () {
			CRMControl.model = undefined;
		};

		this.convertToSave = function () {
			var vo = {};

			vo.num_id = CRMControl.model.num_id;
			vo.des_faixa_prfv = CRMControl.model.des_faixa_prfv;
			vo.vli_inicial = CRMControl.model.vli_inicial;
			vo.vli_final = CRMControl.model.vli_final;
			vo.idi_cor_con = CRMControl.model.ttCor.num_id;
			vo.num_id_prfv = CRMControl.headerRangeId;

			return vo;
		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.des_faixa_prfv) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!model.vli_inicial || model.vli_inicial < 0) {
				isInvalidForm = true;
				messages.push('l-initial-range');
			}

			if (!model.vli_final || model.vli_final < 1) {
				isInvalidForm = true;
				messages.push('l-final-range');
			}

			if (!model.ttCor || model.ttCor.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-color');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-ranges', messages);
			}

			return isInvalidForm;
		};

		this.cancel = function () {
			$modalInstance.close(CRMControl.resultList);
		};

		this.model = parameters.range || {};
		this.headerRangeId = parameters.headerRangeId;
		this.editMode = parameters.range && parameters.range.num_id && parameters.range.num_id > 0 ? true : false;

		this.init();
	};

	controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'crm.helper', 'crm.crm_prfv_faixa_cabec.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.crm_faixa.modal.edit', modal);
	index.register.controller('crm.crm_faixa.edit.control', controller);
});
