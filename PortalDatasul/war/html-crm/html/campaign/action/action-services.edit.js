/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1062.js',
	'/dts/crm/html/action/action-services.edit.js'
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
				templateUrl: '/dts/crm/html/campaign/action/action.edit.html',
				controller: 'crm.campaign-action.edit.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, legend,
							helper, preferenceFactory, factory, modalActionEdit, factorySegmentation) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;

		this.resultList = undefined;

		this.actions = undefined;
		this.campaign = undefined;
		this.sequence = undefined;
		this.workflows = undefined;
		this.informationGroups = undefined;

		this.isIntegratedECM = false;
		this.refresh = true;

		this.relatedProcess = [
			{ id: 1, name: legend.campaignActionRelatedProcess.NAME(1) },
			{ id: 2, name: legend.campaignActionRelatedProcess.NAME(2) },
			// { id: 3, name: legend.campaignActionRelatedProcess.NAME(3) },
			// { id: 4, name: legend.campaignActionRelatedProcess.NAME(4) },
			// { id: 5, name: legend.campaignActionRelatedProcess.NAME(5) },
			// { id: 6, name: legend.campaignActionRelatedProcess.NAME(6) },
			{ id: 7, name: legend.campaignActionRelatedProcess.NAME(7) }
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (model.num_id_acao > 0) {
				model.ttAcao = {
					num_id: model.num_id_acao,
					nom_acao: model.nom_acao
				};
			}

			if (model.idi_proces_relacto > 0) {
				model.ttProcessoRelacionado = {
					id: model.idi_proces_relacto,
					name: model.nom_proces_relacto
				};
			}

			if (model.nom_workflow_process) {
				model.ttWorkflow = {
					nom_workflow: model.nom_workflow,
					nom_workflow_process: model.nom_workflow_process
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
					title: $rootScope.i18n('l-campaign-action', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-action', [], 'dts/crm'),
						item.nom_acao
					], 'dts/crm')
				});

				item.ttObjetivo = CRMControl.model.ttObjetivo;
				item.ttMidia = CRMControl.model.ttMidia;
				item.ttResultado = CRMControl.model.ttResultado;
				item.ttUsuario = CRMControl.model.ttUsuario;
				item.ttGrupo = CRMControl.model.ttGrupo;

				if (item.num_id_segmtcao_dados && item.num_id_segmtcao_dados > 0) {
					item.ttGrupoInformacao = {
						num_id: item.num_id_segmtcao_dados,
						nom_grp_inform: item.nom_grp_inform
					};
				}

				CRMControl.close(item, isToContinue);
			};

			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateCampaignAction(CRMControl.campaign, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.addCampaignAction(CRMControl.campaign, vo, fnAfterSave);
			}
		};

		this.close = function (item, isToContinue) {

			CRMControl.resultList = CRMControl.resultList || [];

			if (CRMUtil.isDefined(item)) {
				CRMControl.resultList.push(item);
			}

			if (isToContinue === true) {
				this.refresh = false;

				delete CRMControl.model.ttAcao;
				delete CRMControl.model.ttProcessoRelacionado;
				CRMControl.model.log_acao_default = false;
				CRMControl.model.log_gps_obrig = false;
				CRMControl.model.log_alter_tar_fluig = false;
				CRMControl.model.log_workflow_finaliza = false;
				CRMControl.validadeParameterModel();

				this.refresh = true;
			} else if ($modalInstance) {
				$modalInstance.close(CRMControl.resultList);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.ttAcao || model.ttAcao.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-action');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-campaign-action', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;

			vo.num_ord_acao = model.num_ord_acao || this.sequence;
			vo.log_acao_default = model.log_acao_default;

			vo.num_id_campanha = CRMControl.campaign;

			if (model.ttAcao) {
				vo.num_id_acao = model.ttAcao.num_id;
			}

			if (model.ttGrupoInformacao) {
				vo.num_id_segmtcao_dados = model.ttGrupoInformacao.num_id;
			}


			if (model.ttProcessoRelacionado) {
				vo.idi_proces_relacto = model.ttProcessoRelacionado.id;
			} else {
				vo.idi_proces_relacto = 0;
			}

			if (model.ttWorkflow) {
				vo.nom_workflow = model.ttWorkflow.nom_workflow;
				vo.nom_workflow_process = model.ttWorkflow.nom_workflow_process;
			} else {
				vo.nom_workflow = '';
				vo.nom_workflow_process = '';
			}

			vo.log_gps_obrig = model.log_gps_obrig;
			vo.log_alter_tar_fluig = model.log_alter_tar_fluig;
			vo.log_workflow_finaliza = model.log_workflow_finaliza;

			return vo;
		};

		this.getActions = function () {
			factory.getAllActions(undefined, undefined, function (result) {
				CRMControl.actions = result || [];
			}, false);
		};

		this.getWorkflowProcess = function () {
			factory.getAllWorkflowProcess(function (result) {
				CRMControl.workflows = result || [];
			});
		};

		this.getInformationGroup = function () {
			factorySegmentation.getAll(function (result) {
				CRMControl.informationGroups = result || [];
			});
		};

		this.addAction = function () {
			modalActionEdit.open(undefined).then(function (results) {

				results = results || [];

				CRMControl.actions = CRMControl.actions || [];

				var i, result;

				for (i = 0; i < results.length; i++) {

					result = results[i];

					if (CRMUtil.isUndefined(result)) { continue; }

					CRMControl.actions.push(result);
				}

				CRMControl.model.ttAcao = result;
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.action ? angular.copy(parameters.action) : {};
		this.campaign  = parameters.campaign ? angular.copy(parameters.campaign) : undefined;
		this.sequence  = parameters.sequence ? angular.copy(parameters.sequence) : undefined;

		this.getActions();

		this.validadeParameterModel();

		preferenceFactory.isIntegratedWithECM(function (result) {

			CRMControl.isIntegratedECM = (result === true);

			if (result === true) {
				CRMControl.getWorkflowProcess();
				CRMControl.getInformationGroup();
			}
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
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.legend',
		'crm.helper', 'crm.crm_param.factory', 'crm.crm_campanha.factory', 'crm.action.modal.edit',
		'crm.crm_segmtcao_dados.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.campaign-action.modal.edit', modal);
	index.register.controller('crm.campaign-action.edit.control', controller);
});
