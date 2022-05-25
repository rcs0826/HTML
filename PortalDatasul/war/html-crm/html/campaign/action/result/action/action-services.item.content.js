/*globals index, define, TOTVSEvent, CRMControl, console */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/html/campaign/action/result/action/action-services.edit.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** CAMPAIGN > ACTION > RESULT > ACTION TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalActionResultAction) {
		var CRMControl = this;

		CRMControl.isOpen = false;

        this.addEditActionResultNextAction = function (actionResultAction, actions, model, index) {
			var i, x, actionResultId, isEditMode, listOfActions = angular.copy(actions);

			if (!model) { model = {}; }

			if (actionResultAction && actionResultAction.num_id) {

				if (!model.num_id_acao_restdo || model.num_id_acao_restdo < 1) {
					actionResultId = actionResultAction.num_id;
				}

				for (i=0; i < actionResultAction.ttProximaAcao.length; i++) {
					for (x=0; x < listOfActions.length; x++) {
						if (actionResultAction.ttProximaAcao[i].num_id_acao == listOfActions[x].num_id_acao) {
							if (!model.num_id_acao || model.num_id_acao !== listOfActions[x].num_id_acao) {
								listOfActions.splice(x, 1);
								break;
							}
						}
					}
				}
			}
            
            isEditMode = (model && model.num_id) ? true : false;
            
            modalActionResultAction.open({
                model: model ? angular.copy(model) : {},
				actions: listOfActions,
				num_id_acao_restdo: actionResultId || model.num_id_acao_restdo
            }).then(function (result) {
                if (result && result.length > 0) {
                    if (!actionResultAction.ttProximaAcao) {
                        actionResultAction.ttProximaAcao = [];
                    }
                    
                    if (isEditMode) {
						actionResultAction.ttProximaAcao[index] = result[0];
						
                    } else {
                        for (i = 0; i < result.length; i = i + 1) {
                            actionResultAction.ttProximaAcao.push(result[i]);
                        }
                    }
                    /* UTILIZA O CAMPO ORDEM PARA ISSO, COM POSIBILIDADE DE ALTERAR VIA DRAG DROP
                    actionResultAction.ttProximaAcao.sort(function (a, b) {
                        if (a.nom_acao < b.nom_acao) {
                            return -1;
                        }
                        if (a.nom_acao > b.nom_acao) {
                            return 1;
                        }
                        
                        return 0;
					});
					*/

					CRMControl.reorderCampaignActionResultNextAction(actionResultAction);
                }
            });
        };		

		this.removeActionResultNextAction = function (resultAction, nextAction, $index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-next-action', [], 'dts/crm').toLowerCase(),
					nextAction.nom_acao
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteCampaignActionResultAction(nextAction.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						resultAction.ttProximaAcao.splice($index, 1);
					});
				}
			});
		};

		this.setActionResultNextActionAsRequired = function (nextAction) {
			factory.setCampaignActionResultActionAsRequired(nextAction.num_id, function (result) {
				if (!result || result.l_ok !== true) {
					nextAction.log_livre_1 = !nextAction.log_livre_1;
				}
			});
		};

		this.setNextActionAsAutomatic = function (nextAction) {
			factory.setCampaignActionResultActionAsAutomatic(nextAction.num_id, function (result) {
				if (!result || result.l_ok !== true) {
					nextAction.log_livre_2 = !nextAction.log_livre_2;
				}
			});
		};

		this.reorderCampaignActionResultNextAction = function (actionResult) {
			if (!actionResult) { return; }

			actionResult.ttProximaAcao = actionResult.ttProximaAcao || [];

			actionResult.ttProximaAcao.sort(function (item1, item2) {
				return item1.num_ord_acao - item2.num_ord_acao;
			});
		};

		this.onCampaignActionResultNextActionDropComplete = function (actionResult, $to, $data, $event) {

			var i,
				$from,
				newtAction,
				newOrder = [];

			// $from = $data.num_ord_acao - 1;
			for (i = 0; i < actionResult.ttProximaAcao.length; i++) {

				newtAction = actionResult.ttProximaAcao[i];

				if (newtAction.num_id === $data.num_id) {
					$from = i;
					break;
				}
			}

			actionResult.ttProximaAcao.move($from, $to);

			for (i = 0; i < actionResult.ttProximaAcao.length; i++) {
				newtAction = actionResult.ttProximaAcao[i];
				newtAction.num_ord_acao = i + 1;
				newOrder.push(newtAction.num_id);
			}

			factory.reorderCampaignActionResultAction(newOrder);
		};

		//n colocar o nome como init, pq acaba pegando do controller da campanha
		this.fcInit = function (actionResultAction) {
			CRMControl.reorderCampaignActionResultNextAction(actionResultAction);
		};

	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_campanha.factory', 'crm.campaign-action-result-action.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.campaign-action-result-action.item-content.service', service);

});
