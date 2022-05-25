/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1001.js',
    '/dts/crm/js/api/fchcrm1107.js',
    '/dts/crm/html/ticket-flow/status/status-services.edit.js',
	'/dts/crm/html/status/status-services.edit.js'
], function (index) {
    'use strict';
    
    var controller,
		modal;
    
    controller = function ($rootScope, $scope, $modalInstance, $filter, factoryCampaign, modalStatus, parameters, factoryRules, TOTVSEvent, helper) {
        
        var CRMControl = this,
            status,
            firstLoadEdit = true;
        
        this.editMode = false;
        
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
            });
        };
        
        this.getActions = function () {

			var i, action, actionToSelect, model = CRMControl.model || {};
            
            if (!CRMControl.firstLoadEdit) {
                model.ttAcao = undefined;
                model.ttResultado = undefined;
            }

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

				if (actionToSelect && !CRMControl.firstLoadEdit) {
                    model.ttAcao = actionToSelect;
                    CRMControl.onChangeAction();
				}
			});
		};

		this.getResults = function () {

			var i, result, model = CRMControl.model || {};
            
            if (!CRMControl.firstLoadEdit) {
                model.ttResultado = undefined;
            }

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
                        if (!CRMControl.firstLoadEdit) {
                            model.ttResultado = result;
                            break;
                        }
					}
				}
                
                CRMControl.firstLoadEdit = false;
			});
		};

		this.onChangeCampaign = function () {
			CRMControl.getActions();
		};

		this.onChangeAction = function () {
			CRMControl.getResults();
		};
        
        this.close = function (isSaveAndNew) {
            $modalInstance.close();
		};
        
        this.addStatus = function () {
			modalStatus.open(undefined).then(function (results) {

				results = results || [];

				CRMControl.statusList = CRMControl.statusList || [];

				var i, result;

				for (i = 0; i < results.length; i++) {

					result = results[i];

					if (CRMUtil.isUndefined(result)) { continue; }

					CRMControl.statusList.push(result);
				}

				CRMControl.model.ttAcao = result;
			});
		};
        
        this.init = function () {
            if (this.rule) {
                this.editMode = true;
                this.firstLoadEdit = true;
                this.setDefaults();
            }
            
            this.getCampaigns();
        };
        
        this.setDefaults = function () {
            this.model = {
                ttCampanha: {
                    num_id: this.rule.ttCampanha.num_id,
                    nom_campanha: this.rule.ttCampanha.nom_campanha
                },
                ttAcao: {
                    num_id: this.rule.ttAcao.num_id,
                    nom_acao: this.rule.ttAcao.nom_acao
                },
                ttResultado: {
                    num_id: this.rule.ttResultado.num_id,
                    nom_restdo: this.rule.ttResultado.nom_restdo
                },
                ttStatus: {
                    num_id: this.rule.ttStatusFluxoDestino.num_id,
                    nom_status_ocor: this.rule.ttStatusFluxoDestino.nom_status_ocor
                }
            };
            
            this.onChangeCampaign();
            this.onChangeAction();
        };
        
        this.save = function (isSaveAndNew) {
            var vo;
            
            if (CRMControl.isInvalidForm()) { return; }
            
            vo = this.convertToSave();
            
            if (CRMControl.editMode) {
                factoryRules.updateRecord(vo.num_id, vo, function (result) {
                    if (result) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
                            detail: $rootScope.i18n('msg-update-rule', [], 'dts/crm')
                        });
                        CRMControl.close();
                    }
                });
            } else {
                factoryRules.saveRecord(vo, function (result) {
                    if (result) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
                            detail: $rootScope.i18n('msg-save-rule', [], 'dts/crm')
                        });

                        if (!isSaveAndNew) {
                            CRMControl.close();
                        } else {
                            CRMControl.clear();
                        }
                    }
                });
            }
        };
        
        this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model || !model.ttCampanha || model.ttCampanha.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-campaign');
			}

			if (!model || !model.ttAcao || model.ttAcao.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-action');
			}
            
            if (!model || !model.ttResultado || model.ttResultado.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-result');
			}
            
            if (!model || !model.ttStatus || model.ttStatus.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-status-destination');
			}
            
			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-rules', messages);
			}
            
			return isInvalidForm;
		};
        
        this.clear = function () {
            delete this.model.ttCampanha;
            delete this.model.ttAcao;
            delete this.model.ttResultado;
            delete this.model.ttStatus;
        };
        
        this.convertToSave = function () {
            var vo = {
                num_id : CRMControl.rule ? CRMControl.rule.num_id : 0,
                num_id_ocor_fluxo_status: CRMControl.status.num_id,
                num_id_campanha: CRMControl.model.ttCampanha.num_id,
                num_id_campanha_acao: CRMControl.model.ttAcao.num_id,
                num_id_acao_restdo: CRMControl.model.ttResultado.num_id,
                num_id_ocor_fluxo_status_dest: CRMControl.model.ttStatus.num_id
            };
            
            return vo;
        };
        
        this.status = angular.copy(parameters.status);
        this.statusFlow = angular.copy(parameters.statusFlow);
        this.rule = angular.copy(parameters.rule);
        
        this.init();
    };
    
    controller.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter',
        'crm.crm_campanha.factory', 'crm.status.modal.edit', 'parameters',
        'crm.ticket-flow-status-rules.factory', 'TOTVSEvent', 'crm.helper'
	];

    // *************************************************************************************
	// *** MODAL EDIT RULES
	// *************************************************************************************
    modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-flow/status/rules/rules.edit.html',
				controller: 'crm.ticket-flow-status-rules.edit.control as controller',
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
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.ticket-flow-status-rules.modal.selection', modal);
	index.register.controller('crm.ticket-flow-status-rules.edit.control', controller);
    
});
