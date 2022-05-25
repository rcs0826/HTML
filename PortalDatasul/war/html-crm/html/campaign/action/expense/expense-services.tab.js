/*globals index, define, TOTVSEvent, CRMControl, console, angular */
define([
    'index',
    '/dts/crm/html/campaign/action/expense/expense-services.edit.js'
], function (index) {
    'use strict';
    
    var service;
    
    service = function ($rootScope, TOTVSEvent, factory, modalActionExpense) {
        
        this.addEditActionExpense = function (model, expense) {
            var i, isEditMode;
            
            isEditMode = expense ? true : false;
            
            modalActionExpense.open({
                expense: expense ? angular.copy(expense) : {},
                campaignActionId: model.num_id
            }).then(function (result) {
                if (result && result.length > 0) {
                    if (!model.ttAcaoDespesa) {
                        model.ttAcaoDespesa = [];
                    }
                    
                    if (isEditMode) {
                        for (i = 0; i < model.ttAcaoDespesa.length; i = i + 1) {
                            if (result[0].num_id === model.ttAcaoDespesa[i].num_id) {
                                model.ttAcaoDespesa[i] = result[0];
                                break;
                            }
                        }
                    } else {
                        for (i = 0; i < result.length; i = i + 1) {
                            model.ttAcaoDespesa.push(result[i]);
                        }
                    }
                    
                    model.ttAcaoDespesa.sort(function (a, b) {
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
        
        this.removeActionExpense = function (list, item, index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-expense', [], 'dts/crm').toLowerCase(), item.nom_tip_despes
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    factory.deleteActionExpense(item.num_id, function (result) {
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
		'$rootScope', 'TOTVSEvent', 'crm.crm_campanha.factory', 'crm.crm_acao_tip_despes.modal.edit'
	];
    
    // ########################################################
	// ### Register
	// ########################################################
	index.register.service('crm.action-expense.service', service);

});