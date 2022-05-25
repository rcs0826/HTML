/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1113.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/zoom/crm_campanha.js'
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
				templateUrl: '/dts/crm/html/generic-action-setting/generic-action-setting.edit.html',
				controller: 'crm.generic-action-setting.edit.control as controller',
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

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters,
							TOTVSEvent, helper, helperGenericActionSetting, factory, campaignFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;
		this.isOpen = true;

		this.campaigns = [];
		this.actions = [];
		this.results = [];
		this.medias = [];

		this.models = [
			{ name: $rootScope.i18n('l-default', [], 'dts/crm'), id: 1 },
			{ name: $rootScope.i18n('l-automatic', [], 'dts/crm'), id: 2 },
			{ name: $rootScope.i18n('l-predefined', [], 'dts/crm'), id: 3 }
		];

		this.operations = [
			{ name: $rootScope.i18n('l-inclusion', [], 'dts/crm'), id: 1 },
			{ name: $rootScope.i18n('l-change', [], 'dts/crm'), id: 2 },
			{ name: $rootScope.i18n('l-all', [], 'dts/crm'), id: 3 }
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};
			this.editMode = (model.num_id > 0);

			if (this.editMode === true) {

				if (model.idi_operac) {
					model.ttOperation = {id: model.idi_operac , name: model.nom_operac};
				}

				if (model.idi_modo_reg_acao) {
					model.ttModel = {id: model.idi_modo_reg_acao , name: model.nom_modo_reg_acao};

					if (model.idi_modo_reg_acao == 1) {
						CRMControl.isOpen = false;
					}
				}

				if (model.num_id_campanha) {
					model.ttCampaign = {num_id: model.num_id_campanha, nom_campanha: model.nom_campanha};
					CRMControl.campaigns = [model.ttCampaign];
				}

				if (model.num_id_campanha_acao) {
					model.ttAction = {num_id: model.num_id_campanha_acao, nom_acao: model.nom_acao};
				}

				if (model.num_id_restdo) {
					model.ttResult = {num_id: model.num_id_restdo, nom_restdo: model.nom_restdo};
				}

				if (model.num_id_mid) {
					model.ttMedia = {num_id: model.num_id_mid, nom_mid_relacto: model.nom_mid_relacto};
				}

				CRMControl.getAllActions(model.num_id_campanha, false, true, function (action) {
					if (action) {
						CRMControl.getAllResults(model.num_id_campanha, model.ttAction.num_id_acao, false, true);
						CRMControl.getAllMedias(model.num_id_campanha, model.ttAction.num_id_acao, false, true);
					}
				});

			}
		};

		this.save = function () {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			if (CRMControl.editMode === true) {
				factory.updateRecord(vo.num_id, vo, CRMControl.afterSave);
			} else {
				factory.saveRecord(vo, CRMControl.afterSave);
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

			if (!model.nom_configur || model.nom_configur.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!model.ttOperation || model.ttOperation.id < 1) {
				isInvalidForm = true;
				messages.push('l-operation-type');
			}

			if (!model.ttModel || model.ttModel.id < 1) {
				isInvalidForm = true;
				messages.push('l-model');
			} else if (model.ttModel.id > 1) {
				if (!model.ttCampaign || model.ttCampaign.num_id < 1) {
					isInvalidForm = true;
					messages.push('l-campaign');
				}
				if (!model.ttAction || model.ttAction.num_id < 1) {
					isInvalidForm = true;
					messages.push('l-action');
				}
				if (!model.ttResult || model.ttResult.num_id < 1) {
					isInvalidForm = true;
					messages.push('l-result');
				}
				if (!model.ttMedia || model.ttMedia.num_id < 1) {
					isInvalidForm = true;
					messages.push('l-media');
				}
			}


			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-generic-action-setting', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id || 0;
			vo.nom_configur = model.nom_configur;
			vo.log_mov_ocor = model.log_mov_ocor || false;
			vo.dsl_histor_acao = model.dsl_histor_acao;
			vo.idi_operac = model.ttOperation ? model.ttOperation.id : 1;
			vo.idi_modo_reg_acao = model.ttModel ? model.ttModel.id : 1;

			if (vo.idi_modo_reg_acao !== 1 && model.ttCampaign && model.ttCampaign.num_id) {
				vo.num_id_campanha = model.ttCampaign ? model.ttCampaign.num_id : 0;
				vo.num_id_campanha_acao = model.ttAction ? model.ttAction.num_id : 0;
				vo.num_id_restdo = model.ttResult ? model.ttResult.num_id : 0;

				if (model.ttMedia && model.ttMedia.num_id) {
					vo.num_id_mid = model.ttMedia ? model.ttMedia.num_id : 0;
				}
			}

			return vo;
		};

		this.afterSave = function (item) {

			if (!item) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-generic-action-setting', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-generic-action-setting', [], 'dts/crm'),
					item.nom_configur
				], 'dts/crm')
			});

			$modalInstance.close(item);
			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/generic-action-setting/detail/' + item.num_id);
			}
		};

		this.getCampaigns = function (value) {
			if (!value || value === '') { return []; }

			value = helper.parseStrictValue(value);
			var filter = { property: 'nom_campanha', value: value };

			campaignFactory.typeahead(filter, undefined, function (result) {
				CRMControl.campaigns = result;
			});
		};

		this.getAllRecords = function () {
			if (CRMControl.model.ttAction) {
				CRMControl.getAllResults(CRMControl.model.ttCampaign.num_id, CRMControl.model.ttAction.num_id_acao, true);
				CRMControl.getAllMedias(CRMControl.model.ttCampaign.num_id, CRMControl.model.ttAction.num_id_acao, true);
			}
		}

		this.onChangeCampaign = function (selected) {

			if (selected && CRMUtil.isDefined(selected.num_id)) {
				CRMControl.model.ttCampaign = selected;
			}

			if (!CRMControl.model.ttCampaign) { return; }

			CRMControl.getAllActions(CRMControl.model.ttCampaign.num_id, true);

		};

		this.onChangeAction = function (action) {
			var model = CRMControl.model;

			if (!model || !model.ttCampaign || !action) { return; }

			CRMControl.getAllRecords();
		}

		this.getAllActions = function (campaignId, isClear, ignoreDefault, callback) {
			var i;

			if (isClear == true) {
				CRMControl.model.num_id_acao = undefined;
				CRMControl.actions = [];
				CRMControl.model.ttAction = undefined;
			}

			if (!campaignId) { return; }

			campaignFactory.getCampaignActions(campaignId, function (result) {

				if (!result) { callback(result); }

				CRMControl.actions = result;

				if (ignoreDefault != true) {
					for (i = 0; i < result.length; i++) {
						if (result[i].log_acao_default == true || result.length === 1) {
							CRMControl.model.ttAction = result[i];
							break;
						}
					}
				} else {
					for (i = 0; i < result.length; i++) {
						if (result[i].num_id == CRMControl.model.ttAction.num_id || result.length === 1) {
							CRMControl.model.ttAction.num_id_acao = result[i].num_id_acao;
							break;
						}
					}
				}

				CRMControl.getAllRecords();

				if (callback) {
					callback(result);
				}
			}, true);
		};

		this.getAllResults = function (campaignId, actionId, isClear, ignoreDefault) {
			// actionId = id da acao, n acao campanha

			var i;

			if (isClear == true) {
				CRMControl.model.num_id_restdo = undefined;
				CRMControl.results = [];
				CRMControl.model.ttResult = undefined;
			}

			if (!campaignId || !actionId) { return; }

			campaignFactory.getAllResults(campaignId, actionId, function (result) {

				if (!result) { return; }

				CRMControl.results = result;

				if (ignoreDefault != true) {
					for (i = 0; i < result.length; i++) {
						if (result[i].log_restdo_default == true || result.length === 1) {
							CRMControl.model.ttResult = result[i];
							break;
						}
					}
				}

			}, true);
		};

		this.getAllMedias = function (campaignId, actionId, isClear, ignoreDefault) {
			// actionId = id da acao, n acao campanha

			var i;

			if (isClear == true) {
				CRMControl.model.num_id_mid = undefined;
				CRMControl.medias = [];
				CRMControl.model.ttMedia = undefined;
			}

			if (!campaignId || !actionId) { return; }

			campaignFactory.getAllMedias(campaignId, actionId, function (result) {

				if (!result) { return; }

				CRMControl.medias = result;

				if (ignoreDefault != true) {
					for (i = 0; i < result.length; i++) {
						if (result[i].log_mid_default == true || result.length === 1) {
							CRMControl.model.ttMedia = result[i];
							break;
						}
					}
				}

			}, true);
		};


		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.model ? angular.copy(parameters.model) : {};

		this.validadeParameterModel();

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
		'crm.generic_action_setting.helper', 'crm.crm_configur_acao_ocor.factory', 'crm.crm_campanha.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.generic-action-setting.modal.edit', modal);
	index.register.controller('crm.generic-action-setting.edit.control', controller);
});
