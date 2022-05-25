/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/zoom/crm_usuar.js'
], function (index) {

	'use strict';

	var modalParametersEdit,
		controllerOpenTicketClosedModal;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modalParametersEdit = function ($modal) {
		this.open = function (params) {

			var template,
				instance;

			template = '/dts/crm/html/dashboard/account-birthday-parameters.html';
			instance = $modal.open({
				templateUrl: template,
				controller: 'crm.dashboard.account-birthday.controller.modal as controller',
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

	controllerOpenTicketClosedModal = function ($rootScope, $scope, $modalInstance, $filter, $location, $totvsprofile, parameters, TOTVSEvent, helper, userFactory, modalParametersEdit, legend) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerConfig = this;
		this.model = {};

		this.listOfPeriod = [
			{ id: 1, name: $rootScope.i18n('l-day', [], 'dts/crm')},
			{ id: 2, name: $rootScope.i18n('l-week', [], 'dts/crm')},
			{ id: 3, name: $rootScope.i18n('l-month', [], 'dts/crm')}
		];

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

		this.parseSelectedToModel = function (list, model) {

			if (!list || !model) {
				return;
			}

			var i, x, listOfSelected = [];

			for (i = 0; i < model.length; i += 1) {
				for (x = 0; x < list.length; x += 1) {
					if (list[x].num_id === model[i].num_id) {
						listOfSelected.push(list[x]);
					}
				}
			}

			return listOfSelected;
		};

		this.getUsers = function () {
			userFactory.getAll(function (result) {
				CRMControllerConfig.listOfResponsible = result;
				if (CRMControllerConfig.model) {
					CRMControllerConfig.model.ttResponsible = CRMControllerConfig.parseSelectedToModel(CRMControllerConfig.listOfResponsible, CRMControllerConfig.model.ttResponsible);
				}
			}, true);
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				model,
				item,
				param1;

			CRMControllerConfig.disclaimers = [];

			for (key in CRMControllerConfig.model) {

				if (CRMControllerConfig.model.hasOwnProperty(key)) {

					model = CRMControllerConfig.model[key];

					if (CRMUtil.isUndefined(model)) {
						if (key !== 'num_id_usuar_respons') {
							continue;
						}
					}

					if (key === 'ttPeriodType') {

						CRMControllerConfig.disclaimers.push({
							property: 'custom.idi_birtdate_period',
							title: $rootScope.i18n('l-display-type', [], 'dts/crm'),
							value: CRMControllerConfig.model.ttPeriodType.id
						});

					} else if (key === 'idi_tip_cta') {

						if (angular.isArray(model)) {

							for (i = 0; i < model.length; i++) {
								item = model[i];

								switch (item.num_id) {
								case 1:
									param1 = $rootScope.i18n('l-lead', [], 'dts/crm');
									break;
								case 2:
									param1 = $rootScope.i18n('l-client', [], 'dts/crm');
									break;
								case 3:
									param1 = $rootScope.i18n('l-contact', [], 'dts/crm');
									break;
								case 4:
									param1 = $rootScope.i18n('l-provider', [], 'dts/crm');
									break;
								case 5:
									param1 = $rootScope.i18n('l-client-provider', [], 'dts/crm');
									break;
								case 6:
									param1 = $rootScope.i18n('l-client-contact', [], 'dts/crm');
									break;
								case 7:
									param1 = $rootScope.i18n('l-provider-contact', [], 'dts/crm');
									break;
								case 8:
									param1 = $rootScope.i18n('l-client-provider-contact', [], 'dts/crm');
									break;
								}

								CRMControllerConfig.disclaimers.push({
									property: 'custom.idi_tip_cta',
									value: item.num_id,
									title: param1 + ": " + $rootScope.i18n('l-yes', [], 'dts/crm')
								});
							}
						}

					} else if (key === 'ttResponsible') {

						if (angular.isArray(model)) {

							for (i = 0; i < model.length; i++) {
								item = model[i];
								if (item && CRMUtil.isDefined(item.num_id)) {
									CRMControllerConfig.disclaimers.push({
										property: 'num_id_usuar_respons',
										value: item.num_id,
										title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + item.nom_usuar,
										model: { value: item }
									});
								}
							}
						}

					}

				}
			}

		};

		this.parseDisclaimersToModel = function (disclaimers) {
			var i;

			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {

				for (i = 0; i < disclaimers.length; i++) {
					if (disclaimers[i].property === "custom.idi_birtdate_period") {

						model.ttPeriodType = CRMControllerConfig.listOfPeriod[disclaimers[i].value - 1];

					} else if (disclaimers[i].property === "custom.idi_tip_cta") {
						if (CRMUtil.isUndefined(model.idi_tip_cta)) {
							model.idi_tip_cta = [];
						}
						model.idi_tip_cta.push(CRMControllerConfig.accountTypes[(parseInt(disclaimers[i].value, 10) - 1)]);
					} else if (disclaimers[i].property === "num_id_usuar_respons") {
						if (CRMUtil.isUndefined(model.ttResponsible)) {
							model.ttResponsible = [];
						}
						model.ttResponsible.push(disclaimers[i].model.value);
					}
				}

				CRMControllerConfig.model = model;
				CRMControllerConfig.disclaimers = disclaimers;
			});

			if (CRMUtil.isUndefined(CRMControllerConfig.model.ttPeriodType)) {
				CRMControllerConfig.model.ttPeriodType = 3;
			}

		};

		this.apply = function (doApply) {

			if (CRMControllerConfig.isInvalidForm() || !CRMControllerConfig.disclaimers) { return; }

			var closeObj = {};

			CRMControllerConfig.parseModelToDisclaimers();

			closeObj.apply = doApply;
			closeObj.disclaimers = {};
			closeObj.disclaimers = CRMControllerConfig.disclaimers;

			$modalInstance.close(closeObj);

		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				fields = '',
				message = '',
				isPlural,
				i;

			if (!CRMControllerConfig.model.ttPeriodType) {
				isInvalidForm = true;
				messages.push('l-display-type');
			}

			if (isInvalidForm) {

				isPlural = messages.length > 1;

				message	 = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i += 1) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-summary-account-birthday', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			return isInvalidForm;
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		CRMControllerConfig.disclaimers = parameters.disclaimers;

		this.init = function () {
			CRMControllerConfig.getUsers();
			CRMControllerConfig.parseDisclaimersToModel();
		};

		CRMControllerConfig.init();

	};

	controllerOpenTicketClosedModal.$inject = ['$rootScope', '$scope', '$modalInstance', '$filter',
		'$location', '$totvsprofile', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.crm_usuar.factory', 'crm.dashboard.account-birthday.modal.parameter', 'crm.legend'
		];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.dashboard.account-birthday.modal.parameter', modalParametersEdit);
	index.register.controller('crm.dashboard.account-birthday.controller.modal', controllerOpenTicketClosedModal);
});
