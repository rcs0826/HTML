/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1115.js',
	'/dts/crm/js/api/fchcrm1015.js',
	'/dts/crm/js/api/fchcrm1001.js'
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
				templateUrl: '/dts/crm/html/class-transition/class-transition.edit.html',
				controller: 'crm.class-transition.edit.control as controller',
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
	controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent, helper, factory, legend, fchcrm1015, factoryCampaign) {

		var CRMControl = this,
			i;

		this.classes = [];

		this.types = [
			{num_id: 1, nom_tipo: legend.classTransitionTrigger.NAME(1)},
			{num_id: 2, nom_tipo: legend.classTransitionTrigger.NAME(2)},
			{num_id: 3, nom_tipo: legend.classTransitionTrigger.NAME(3)},
			{num_id: 4, nom_tipo: legend.classTransitionTrigger.NAME(4)}
		];

		this.init = function () {
			fchcrm1015.getAll(function (result) {
				CRMControl.classes = result;
			}, true);

			CRMControl.getCampaigns();
		};

		this.convertModel = function () {
			if (CRMControl.model.idi_vendas) {
				CRMControl.model.idi_vendas = {
					"num_id": CRMControl.model.idi_vendas,
					"nom_tipo": legend.classTransitionTrigger.NAME(CRMControl.model.idi_vendas)
				};
			}
		};

		this.save = function () {
			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (CRMControl.editMode === true) {
				factory.updateRecord(vo.num_id, vo, CRMControl.afterSave);
			} else {
				factory.saveRecord(vo, CRMControl.afterSave);
			}
		};

		this.convertToSave = function () {
			var vo;

			CRMControl.editMode = (CRMControl.model.num_id > 0);

			vo = {
				"num_id": CRMControl.model.num_id || 0,
				"num_id_prox_clas": CRMControl.model.ttProximaClasse.num_id,
				"num_id_clas_pessoa": CRMControl.model.ttClasse.num_id,
				"qtd_restdo_acao": CRMControl.model.qtd_restdo_acao,
				"idi_vendas": CRMControl.model.idi_vendas.num_id,
				"num_livre_1": CRMControl.model.num_livre_1 || 0,
				"num_id_campanha": CRMControl.model.ttCampanha ? CRMControl.model.ttCampanha.num_id : 0,
				"num_id_acao": CRMControl.model.ttAcao ? CRMControl.model.ttAcao.num_id : 0,
				"num_id_restdo": CRMControl.model.ttResultado ? CRMControl.model.ttResultado.num_id : 0
			};

			return vo;
		};

		this.afterSave = function (item) {

			var name = '';

			if (!item) { return; }

			if (item.ttClasse && item.ttClasse.nom_clas_clien) {
				name = item.ttClasse.nom_clas_clien;
			}

			if (item.ttProximaClasse && item.ttProximaClasse.nom_clas_clien) {
				name = name + ' - ' + item.ttProximaClasse.nom_clas_clien;
			}

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-campaign-action-trans-class', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('l-campaign-action-trans-class', [], 'dts/crm'),
					name
				], 'dts/crm')
			});

			$modalInstance.close(item);
		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (CRMUtil.isUndefined(model) || !model.ttClasse) {
				isInvalidForm = true;
				messages.push('l-class');
			}

			if (CRMUtil.isUndefined(model) || !model.ttProximaClasse) {
				isInvalidForm = true;
				messages.push('l-next-class');
			}

			if (CRMUtil.isUndefined(model) || !model.idi_vendas) {
				isInvalidForm = true;
				messages.push('l-trigger-type');
			}

			if (CRMUtil.isDefined(model) && CRMUtil.isDefined(model.idi_vendas) && model.idi_vendas.num_id === 3) {

				if (CRMUtil.isUndefined(model) || !model.ttCampanha) {
					isInvalidForm = true;
					messages.push('l-campaign');
				}

				if (CRMUtil.isUndefined(model) || !model.ttAcao) {
					isInvalidForm = true;
					messages.push('l-action');
				}

				if (CRMUtil.isUndefined(model) || !model.ttResultado) {
					isInvalidForm = true;
					messages.push('l-result');
				}

			}

			if (CRMUtil.isUndefined(model) || !model.qtd_restdo_acao || (CRMUtil.isDefined(model) && model.qtd_restdo_acao === 0)) {
				isInvalidForm = true;
				messages.push('l-trigger-value');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-campaign-action-trans-class', messages);
			}

			return isInvalidForm;
		};

		this.cancel = function () {
			$modalInstance.close();
		};

		this.onChangeTriggerType = function () {
			if (CRMControl.model.idi_vendas) {
				if (CRMControl.model.idi_vendas.num_id !== 3) {
					delete CRMControl.model.ttCampanha;
					delete CRMControl.model.ttAcao;
					delete CRMControl.model.ttResultado;
				} else {
					CRMControl.model.qtd_restdo_acao = 0;
				}
			} else {
				delete CRMControl.model.ttCampanha;
				delete CRMControl.model.ttAcao;
				delete CRMControl.model.ttResultado;
				CRMControl.model.qtd_restdo_acao = 0;
			}
		};

		this.getCampaigns = function () {

			var i, campaignToSelect, model = CRMControl.model || {};

			factoryCampaign.getAllCampaigns(true, undefined, function (result) {

				CRMControl.campaigns = result || [];

				if (CRMControl.campaigns.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-strategy-transition', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-campaign', [], 'dts/crm')
					});
					return;
				}

				campaignToSelect = undefined;

				for (i = 0; i < CRMControl.campaigns.length; i++) {

					var campaign = CRMControl.campaigns[i];

					if (model.num_id_campanha > 0) {
						if (model.num_id_campanha === campaign.num_id) {
							campaignToSelect = campaign;
							break;
						}
					} else if (CRMControl.campaigns.length === 1) {
						campaignToSelect = campaign;
						break;
					}
				}

				if (campaignToSelect) {

					model.ttCampanha = campaignToSelect;
					CRMControl.onChangeCampaign();

				} else if (model.num_id_campanha > 0) {

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-strategy-transition', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-campaign-expired', [
							model.ttCampanha.nom_campanha
						], 'dts/crm')
					});
				}
			});
		};

		this.getActions = function () {

			var i, action, actionToSelect, model = CRMControl.model || {};

			model.ttAcao = undefined;
			model.ttResultado = undefined;

			if (!model.ttCampanha) { return []; }

			factoryCampaign.getAllActions(model.ttCampanha.num_id, undefined, function (result) {

				CRMControl.actions = result || [];

				for (i = 0; i < CRMControl.actions.length; i++) {

					action = CRMControl.actions[i];

					if (model.num_id_acao > 0) {
						if (model.num_id_acao === action.num_id) {
							actionToSelect = action;
							break;
						}
					} else if (action.log_acao_default === true  || CRMControl.actions.length === 1) {
						actionToSelect = action;
						break;
					}
				}

				if (actionToSelect) {
					model.ttAcao = actionToSelect;
					CRMControl.onChangeAction();
				}
			});
		};

		this.getResults = function () {

			var i, result, model = CRMControl.model || {};

			model.ttResultado = undefined;

			if (!model.ttCampanha || !model.ttAcao) { return []; }

			factoryCampaign.getAllResults(model.ttCampanha.num_id, model.ttAcao.num_id, function (data) {

				CRMControl.results = data || [];

				for (i = 0; i < CRMControl.results.length; i++) {

					result = CRMControl.results[i];

					if (model.num_id_restdo > 0) {
						if (model.num_id_restdo === result.num_id) {
							model.ttResultado = result;
							break;
						}
					} else if (result.log_restdo_default === true  || CRMControl.results.length === 1) {
						model.ttResultado = result;
						break;
					}
				}
			});
		};

		this.onChangeCampaign = function () {
			CRMControl.getActions();
		};

		this.onChangeAction = function () {
			CRMControl.getResults();
		};
		this.model = parameters.model || {};

		this.convertModel();
		this.init();
	};

	controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper', 'crm.crm_transf_class.factory', 'crm.legend', 'crm.crm_clas.factory', 'crm.crm_campanha.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.class-transition.modal.edit', modal);
	index.register.controller('crm.class-transition.edit.control', controller);
	//
});
