/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1076.js',
	'/dts/crm/js/api/fchcrm1077.js'
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
				templateUrl: '/dts/crm/html/strategy/transition/transition.edit.html',
				controller: 'crm.strategy-transition.edit.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, parameters, TOTVSEvent,
							helper, factory, factoryPhase, factoryCampaign) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		this.resultList = undefined;
		this.phases = undefined;
		this.strategy = undefined;

		this.campaigns = undefined;
		this.actions = undefined;
		this.results = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (model.num_id_fase > 0) {
				model.ttFase = {
					num_id_fase: model.num_id_fase,
					des_fase: model.des_fase
				};
			}

			if (model.num_id_prox_fase > 0) {
				model.ttProximaFase = {
					num_id: model.num_id_prox_fase,
					des_fase: model.des_prox_fase
				};
			}

			if (model.num_id_campanha > 0) {
				model.ttCampanha = {
					num_id: model.num_id_campanha,
					nom_campanha: model.nom_campanha
				};
			}

			if (model.num_id_campanha_acao > 0) {
				model.ttAcao = {
					num_id: model.num_id_campanha_acao,
					nom_acao: model.nom_acao
				};
			}

			if (model.num_id_restdo > 0) {
				model.ttResultado = {
					num_id: model.num_id_restdo,
					nom_restdo: model.nom_restdo
				};
			}
		};

		this.save = function (isToContinue) {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave(),
				message,
				fnAfterSave;

			if (!vo) { return; }

			fnAfterSave = function (item) {
				if (!item) { return; }
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-strategy-transition', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-transition', [], 'dts/crm'),
						item.des_fase + ' > ' + item.des_prox_fase
					], 'dts/crm')
				});
				CRMControl.close(item, isToContinue);
			};
			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateStrategyTransition(CRMControl.strategy, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.addStrategyTransition(CRMControl.strategy, vo, fnAfterSave);
			}
		};

		this.close = function (item, isToContinue) {

			CRMControl.resultList = CRMControl.resultList || [];
			
			if (CRMUtil.isDefined(item)) {
				CRMControl.resultList.push(item);
			}
			
			if (isToContinue === true) {
								
				CRMControl.model = undefined;
				CRMControl.validadeParameterModel();
				
			} else if ($modalInstance) {
				$modalInstance.close(CRMControl.resultList);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model || {};

			if (!model.ttFase || model.ttFase.num_id_fase < 1) {
				isInvalidForm = true;
				messages.push('l-phase');
			}

			if (!model.ttProximaFase || model.ttProximaFase.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-next-phase');
			}

			if (!model.ttCampanha || model.ttCampanha.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-campaign');
			}

			if (!model.ttAcao || model.ttAcao.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-action');
			}

			if (!model.ttResultado || model.ttResultado.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-result');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-strategy-transition', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model || {};

			vo.num_id = model.num_id;
			vo.num_id_estrateg_vda = CRMControl.strategy;

			if (model.ttFase) {
				vo.num_id_fase = model.ttFase.num_id_fase;
			}

			if (model.ttProximaFase) {
				vo.num_id_prox_fase = model.ttProximaFase.num_id_fase;
			}

			if (model.ttCampanha) {
				vo.num_id_campanha = model.ttCampanha.num_id;
			}

			if (model.ttAcao) {
				vo.num_id_campanha_acao = model.ttAcao.num_id;
			}

			if (model.ttResultado) {
				vo.num_id_restdo = model.ttResultado.num_id;
			}

			return vo;
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

					if (model.num_id_campanha_acao > 0) {
						if (model.num_id_campanha_acao === action.num_id) {
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

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.transition ? angular.copy(parameters.transition) : {};
		this.phases = parameters.phases ? angular.copy(parameters.phases) : [];
		this.strategy  = parameters.strategy ? angular.copy(parameters.strategy) : undefined;

		this.validadeParameterModel();

		this.getCampaigns();

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
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.crm_estrateg_vda.factory', 'crm.crm_fase_estrateg_vda.factory', 'crm.crm_campanha.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.strategy-transition.modal.edit', modal);
	index.register.controller('crm.strategy-transition.edit.control', controller);
});
