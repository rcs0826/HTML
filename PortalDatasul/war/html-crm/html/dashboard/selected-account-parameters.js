/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint continue: true*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1003.js'
], function (index) {

	'use strict';

	var modalParametersEdit,
		controllerSelectedAccountModal;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modalParametersEdit = function ($modal) {
		this.open = function (params) {

			var template,
				instance;

			template = '/dts/crm/html/dashboard/selected-account-parameters.html';
			instance = $modal.open({
				templateUrl: template,
				controller: 'crm.dashboard.selected-account.controller.modal as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});

			return instance.result;
		};
	};

	modalParametersEdit.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER MODAL
	// *************************************************************************************
	controllerSelectedAccountModal = function ($rootScope, $scope, $modalInstance, $filter, $location, $totvsprofile,
											parameters, TOTVSEvent, helper, modalParametersEdit, userFactory, legend) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerConfig = this;

		this.model = {};
		this.disclaimers = [];
		this.users = [];

		this.accountTypes = [
			{num_id: 1, nom_tipo: legend.accountType.NAME(1)},
			{num_id: 2, nom_tipo: legend.accountType.NAME(2)},
			{num_id: 3, nom_tipo: legend.accountType.NAME(3)},
			{num_id: 4, nom_tipo: legend.accountType.NAME(4)},
			{num_id: 5, nom_tipo: legend.accountType.NAME(5)},
			{num_id: 6, nom_tipo: legend.accountType.NAME(6)},
			{num_id: 7, nom_tipo: legend.accountType.NAME(7)},
			{num_id: 8, nom_tipo: legend.accountType.NAME(8)}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************
		this.parseDisclaimersToModel = function (disclaimers) {
			var i, users = [];

			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {

				for (i = 0; i < disclaimers.length; i++) {
					if (disclaimers[i].property === "custom.idi_tip_cta") {
						if (CRMUtil.isUndefined(model.idi_tip_cta)) {
							model.idi_tip_cta = [];
						}
						model.idi_tip_cta.push(CRMControllerConfig.accountTypes[(parseInt(disclaimers[i].value, 10) - 1)]);
					} else if (disclaimers[i].property === "num_id_usuar_respons") {
						users.push(disclaimers[i].model);
					}
				}

				model.num_id_usuar_respons = users;
				CRMControllerConfig.model = model;
				CRMControllerConfig.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				model,
				modelDesc;

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];
					modelDesc = "";

					if (key === 'num_id_usuar_respons' && model.length > 0) {

						for (i = 0; i < model.length; i++) {
							this.disclaimers.push({
								property: 'num_id_usuar_respons',
								value: model[i].num_id,
								title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + model[i].nom_usuar,
								model: {num_id: model[i].num_id, nom_usuar: model[i].nom_usuar}
							});
						}

					} else if (key === 'idi_tip_cta' && model.length > 0) {

						if (angular.isArray(model)) {

							for (i = 0; i < model.length; i++) {

								switch (model[i].num_id) {
								case 1:
									modelDesc = $rootScope.i18n('l-lead', [], 'dts/crm');
									break;
								case 2:
									modelDesc = $rootScope.i18n('l-client', [], 'dts/crm');
									break;
								case 3:
									modelDesc = $rootScope.i18n('l-contact', [], 'dts/crm');
									break;
								case 4:
									modelDesc = $rootScope.i18n('l-provider', [], 'dts/crm');
									break;
								case 5:
									modelDesc = $rootScope.i18n('l-client-provider', [], 'dts/crm');
									break;
								case 6:
									modelDesc = $rootScope.i18n('l-client-contact', [], 'dts/crm');
									break;
								case 7:
									modelDesc = $rootScope.i18n('l-provider-contact', [], 'dts/crm');
									break;
								case 8:
									modelDesc = $rootScope.i18n('l-client-provider-contact', [], 'dts/crm');
									break;
								}

								this.disclaimers.push({
									property: 'custom.idi_tip_cta',
									value: model[i].num_id,
									title: modelDesc + ": " + $rootScope.i18n('l-yes', [], 'dts/crm')
								});
							}
						}
					}
				}
			}

		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.apply = function (doApply) {
			this.parseModelToDisclaimers();

			if (CRMControllerConfig.isInvalidForm() || !CRMControllerConfig.model) { return; }

			var closeObj = {};

			closeObj.apply = doApply;
			closeObj.disclaimers = {};
			closeObj.disclaimers = CRMControllerConfig.disclaimers;

			$modalInstance.close(closeObj);
		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false;

			return isInvalidForm;
		};

		this.loadResources = function (callback, disclaimers) {
			userFactory.getAll(function (result) {
				CRMControllerConfig.users = result;
				if (callback) { callback(disclaimers); }
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			CRMControllerConfig.loadResources(CRMControllerConfig.parseDisclaimersToModel, parameters.disclaimers);
		};

		CRMControllerConfig.init();

	};

	controllerSelectedAccountModal.$inject = ['$rootScope', '$scope', '$modalInstance', '$filter', '$location',
											  '$totvsprofile', 'parameters', 'TOTVSEvent', 'crm.helper', 'crm.dashboard.selected-account.modal.parameter', 'crm.crm_usuar.factory',
											  'crm.legend'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.dashboard.selected-account.modal.parameter', modalParametersEdit);
	index.register.controller('crm.dashboard.selected-account.controller.modal', controllerSelectedAccountModal);
});
