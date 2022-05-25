/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint continue: true*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1000.js'
], function (index) {

	'use strict';

	var modalParametersEdit,
		controllerTaskSummaryModal;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modalParametersEdit = function ($modal) {
		this.open = function (params) {

			var template,
				instance;

			template = '/dts/crm/html/dashboard/task-summary-parameters.html';
			instance = $modal.open({
				templateUrl: template,
				controller: 'crm.dashboard.task-summary.controller.modal as controller',
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



	controllerTaskSummaryModal = function ($rootScope, $scope, $modalInstance, $filter, $location, $totvsprofile,
											parameters, TOTVSEvent, helper, modalParametersEdit, campaignFactory, userFactory) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerConfig = this;

		this.model = {};
		this.disclaimers = [];

		this.periods = [
			{ value: 1, label: $rootScope.i18n('l-day', [], 'dts/crm')},
			{ value: 2, label: $rootScope.i18n('l-week', [], 'dts/crm')},
			{ value: 3, label: $rootScope.i18n('l-month', [], 'dts/crm')},
			{ value: 4, label: $rootScope.i18n('l-trimester', [], 'dts/crm')},
			{ value: 5, label: $rootScope.i18n('l-semester', [], 'dts/crm')},
			{ value: 6, label: $rootScope.i18n('l-year', [], 'dts/crm')}
		];

		this.groups = [
			{ value: 1, label: $rootScope.i18n('l-status', [], 'dts/crm')},
			{ value: 2, label: $rootScope.i18n('l-user-responsible', [], 'dts/crm')},
			{ value: 3, label: $rootScope.i18n('l-action', [], 'dts/crm')},
			{ value: 4, label: $rootScope.i18n('l-campaign', [], 'dts/crm')}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************
		this.parseDisclaimersToModel = function (disclaimers) {
			var i;

			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {
				CRMControllerConfig.model = model;
				CRMControllerConfig.disclaimers = disclaimers;

				for (i = 0; i < disclaimers.length; i++) {
					if (disclaimers[i].property === 'custom.idi_agrupador') {
						CRMControllerConfig.model.idi_agrupador = disclaimers[i].value;
						continue;
					} else if (disclaimers[i].property === 'idi_status_tar') {
						CRMControllerConfig.model.log_only_open_tasks = true;
						continue;
					} else if (disclaimers[i].property === 'custom.idi_period') {
						CRMControllerConfig.model.idi_period = disclaimers[i].value;
						continue;
					}
				}
			});

			if (CRMUtil.isUndefined(CRMControllerConfig.model.idi_agrupador)) {
				CRMControllerConfig.model.idi_agrupador = 1;
			}

		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				model,
				isOnlyLoggedUser,
				modelValue,
				modelDesc,
				modelObj,
				orString = " " + $rootScope.i18n('l-or', [], 'dts/crm') + " ";

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					modelValue = "";
					modelDesc = "";
					modelObj = {
						value: []
					};

					if (key === 'num_id_respons' || key === 'log_only_user_task') {

						if (this.model.hasOwnProperty('log_only_user_task')) {
							isOnlyLoggedUser = this.model.log_only_user_task;
						}

						if (isOnlyLoggedUser === true) {

							this.disclaimers.push({
								property: 'num_id_respons',
								value: $rootScope.currentuser.idCRM,
								title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + $rootScope.currentuser['user-desc'],
								model: {
									property: 'log_only_user_task',
									value: true
								}
							});

						} else if (key === 'num_id_respons' && model.length > 0) {

							for (i = 0; i < model.length; i++) {
								modelValue = modelValue + model[i].num_id + "|";
								modelDesc  = modelDesc + orString + model[i].nom_usuar;
								modelObj.value.push({
									num_id: model[i].num_id,
									nom_usuar: model[i].nom_usuar
								});
							}

							modelDesc = modelDesc.substring(orString.length, modelDesc.length);
							modelValue = modelValue.substring(0, modelValue.length - 1);

							this.disclaimers.push({
								property: 'num_id_respons',
								value: modelValue,
								title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + modelDesc,
								model: modelObj
							});

						}

					} else if (key === 'num_id_campanha' && model.length > 0) {

						for (i = 0; i < model.length; i++) {
							modelValue = modelValue + model[i].num_id + "|";
							modelDesc  = modelDesc + orString + model[i].nom_campanha;
							modelObj.value.push({
								num_id: model[i].num_id,
								nom_campanha: model[i].nom_campanha
							});
						}

						modelDesc = modelDesc.substring(orString.length, modelDesc.length);
						modelValue = modelValue.substring(0, modelValue.length - 1);

						this.disclaimers.push({
							property: 'num_id_campanha',
							value: modelValue,
							title: $rootScope.i18n('l-campaign', [], 'dts/crm') + ': ' + modelDesc,
							model: modelObj
						});


					} else if (key === 'num_id_acao' && model.length > 0) {

						for (i = 0; i < model.length; i++) {
							modelValue = modelValue + model[i].num_id + "|";
							modelDesc  = modelDesc + orString + model[i].nom_acao;
							modelObj.value.push({
								num_id: model[i].num_id,
								nom_acao: model[i].nom_acao
							});
						}

						modelDesc = modelDesc.substring(orString.length, modelDesc.length);
						modelValue = modelValue.substring(0, modelValue.length - 1);

						this.disclaimers.push({
							property: 'num_id_acao',
							value: modelValue,
							title: $rootScope.i18n('l-action', [], 'dts/crm') + ': ' + modelDesc,
							model: modelObj
						});

					} else if (key === 'num_id_objet' && model.length > 0) {

						for (i = 0; i < model.length; i++) {
							modelValue = modelValue + model[i].num_id + "|";
							modelDesc  = modelDesc + orString + model[i].nom_objet_acao;
							modelObj.value.push({
								num_id: model[i].num_id,
								nom_objet_acao: model[i].nom_objet_acao
							});

						}

						modelDesc = modelDesc.substring(orString.length, modelDesc.length);
						modelValue = modelValue.substring(0, modelValue.length - 1);

						this.disclaimers.push({
							property: 'num_id_objet',
							value: modelValue,
							title: $rootScope.i18n('l-objective', [], 'dts/crm') + ': ' + modelDesc,
							model: modelObj
						});

					} else if (key === 'idi_period') {

						this.disclaimers.push({
							property: 'custom.idi_period',
							value: model
						});

					} else if (key === 'idi_agrupador') {
						if (model) {
							this.disclaimers.push({
								property: 'custom.idi_agrupador',
								value: model
							});
						}
					} else if (key === 'log_only_open_tasks') {
						if (model) {
							this.disclaimers.push({
								property: 'idi_status_tar',
								value: 1
							});
						}
					}
				}
			}

		};

		this.formatDate = function (date, isFinal) {

			if (isFinal) {
				date.setHours(23);
				date.setMinutes(59);
				date.setSeconds(59);
			} else {
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
			}

			return date.getTime();
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
				isInvalidForm = false,
				fields = '',
				message = '',
				isPlural,
				i;

			if (!CRMControllerConfig.model.idi_period
					|| CRMControllerConfig.model.idi_period > 6) {
				isInvalidForm = true;
				messages.push('l-opening-period');
			}

			if (!CRMControllerConfig.model.idi_agrupador
					|| CRMControllerConfig.model.idi_agrupador > 6) {
				isInvalidForm = true;
				messages.push('l-view-by');
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
					title:  $rootScope.i18n('l-widget-task-summary', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			return isInvalidForm;
		};

		this.loadResources = function (callback, disclaimers) {
			var count = 0,
				total = 4;

			campaignFactory.getAllCampaigns(false, undefined, function (result) {
				if (!result) { return; }
				CRMControllerConfig.campaigns = result;
				if (++count === total && callback) { callback(disclaimers); }
			});

			campaignFactory.getAllActions(undefined, undefined, function (result) {
				if (!result) { return; }
				CRMControllerConfig.actions = result;
				if (++count === total && callback) { callback(disclaimers); }
			});

			campaignFactory.getAllObjectives(undefined, undefined, function (result) {
				if (!result) { return; }
				CRMControllerConfig.objectives = result;
				if (++count === total && callback) { callback(disclaimers); }
			});

			userFactory.getAllWithAccess(function (result) {
				CRMControllerConfig.users = result;
				if (++count === total && callback) { callback(disclaimers); }
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

	controllerTaskSummaryModal.$inject = ['$rootScope', '$scope', '$modalInstance', '$filter',
		'$location', '$totvsprofile', 'parameters', 'TOTVSEvent', 'crm.helper', 'crm.dashboard.task-summary.modal.parameter',
		'crm.crm_campanha.factory', 'crm.crm_usuar.factory'
		];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.dashboard.task-summary.modal.parameter', modalParametersEdit);
	index.register.controller('crm.dashboard.task-summary.controller.modal', controllerTaskSummaryModal);
});
