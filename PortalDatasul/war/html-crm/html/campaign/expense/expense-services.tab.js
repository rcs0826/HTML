/*globals index, define, TOTVSEvent, CRMControl, console, angular */
define([
    'index',
    '/dts/crm/html/campaign/expense/expense-services.edit.js'
], function (index) {
    'use strict';
    
    var service;
    
    service = function ($rootScope, TOTVSEvent, factory, modalExpenseEdit) {
        
        this.addEditCampaingExpense = function (model, expense) {
            var i, isEditMode;
            
            isEditMode = expense ? true : false;
            
            modalExpenseEdit.open({
                expense: expense ? angular.copy(expense) : {},
                campaignId: model.num_id
            }).then(function (result) {
                if (result) {
                    if (!model.ttDespesa) {
                        model.ttDespesa = [];
                    }
                    
                    if (isEditMode) {
                        for (i = 0; i < model.ttDespesa.length; i = i + 1) {
                            if (result[0].num_id === model.ttDespesa[i].num_id) {
                                model.ttDespesa[i] = result[0];
                                break;
                            }
                        }
                    } else {
                        for (i = 0; i < result.length; i = i + 1) {
                            model.ttDespesa.push(result[i]);
                        }
                    }
                    
                    model.ttDespesa.sort(function (a, b) {
                        if (a.nom_tip_despes < b.nom_tip_despes) {
                            return -1;
                        }
                        if (a.nom_tip_despes > b.nom_tip_despes) {
                            return 1;
                        }
                        
                        return 0;
                    });
                }
            });
        };
        
        this.removeCampaingExpense = function (list, item, index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-expense', [], 'dts/crm').toLowerCase(), item.nom_tip_despes
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    factory.deleteCampaignExpense(item.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-expense', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                        
                        list.splice(index, 1);
                    });
                }
            });
        };
    };
    
    service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_campanha.factory', 'crm.crm_campanha_despes.modal.edit'
	];
    
    // ########################################################
	// ### Register
	// ########################################################
	index.register.service('crm.campaign-expense.service', service);

});