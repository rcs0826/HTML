/*globals index, define, TOTVSEvent, CRMControl, console, CRMUtil */
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1082.js',
    '/dts/crm/js/api/fchcrm1114.js',
    '/dts/crm/js/api/fchcrm1001.js'
], function (index) {
    'use strict';
    
    var controller, modal;
    
    // *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
    modal = function ($modal) {
        this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/campaign/expense/expense.edit.html',
				controller: 'crm.crm_campanha_despes.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
    };
    
    modal.$inject = ['$modal'];
    
    controller = function ($rootScope, $scope, $location, $modalInstance, parameters, fchcrm1082, fchcrm1114, helper, fchcrm1001) {
    
        var CRMControl = this, i;
        
        this.units = [];
        
        this.expenseType = [];
        
        this.resultList = [];
        
        this.init = function () {
            this.getUnitOfMeasurement();
            this.getExpenseType();
        };
        
        this.save = function (isSaveAndNew) {
            var vo;
            
            if (this.isInvalidForm()) { return; }
            
            vo = this.convertToSave();
            
            if (CRMControl.editMode === true) {
				fchcrm1001.updateCampaignExpense(CRMControl.campaignId, vo.num_id, vo, function (result) {
                    if (result && result.length > 0) {
                        CRMControl.resultList.push(result[0]);
                        $modalInstance.close(CRMControl.resultList);
                    }
                });
			} else {
				fchcrm1001.saveCampaignExpense(CRMControl.campaignId, vo, function (result) {
                    if (result && result.length > 0) {
                        CRMControl.resultList.push(result[0]);
                        
                        if (!isSaveAndNew) {
                            $modalInstance.close(CRMControl.resultList);
                        } else {
                            CRMControl.clear();
                        }
                    }
                    
                });
            }
        };
        
        this.clear = function () {
            CRMControl.model = undefined;
        };
        
        this.convertToSave = function () {
            var vo;
                
            vo = {
                num_id: CRMControl.model.num_id || 0,
                num_id_tip_despes: CRMControl.model.num_id_tip_despes.num_id,
                num_id_umd: CRMControl.model.num_id_umd.num_id,
                qtd_itens_despes: CRMControl.model.qtd_itens_despes,
                val_despes_previs: CRMControl.model.val_despes_previs,
                num_id_campanha: CRMControl.campaignId,
                dsl_tip_despes: CRMControl.model.dsl_tip_despes
            };
            
            return vo;
        };
        
        this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (CRMUtil.isUndefined(model) || !model.num_id_tip_despes) {
				isInvalidForm = true;
				messages.push('l-expense-type');
			}
			
            if (CRMUtil.isUndefined(model) || !model.num_id_umd) {
				isInvalidForm = true;
				messages.push('l-unit-of-measurement');
			}
            
            if (CRMUtil.isUndefined(model) || CRMUtil.isUndefined(model.qtd_itens_despes)) {
				isInvalidForm = true;
				messages.push('l-quantity');
			}
            
            if (CRMUtil.isUndefined(model) || CRMUtil.isUndefined(model.val_despes_previs)) {
				isInvalidForm = true;
				messages.push('l-total-value');
			}
            
            if (isInvalidForm) {
                helper.showInvalidFormMessage('l-expense', messages);
			}

			return isInvalidForm;
		};
        
        this.getUnitOfMeasurement = function () {
            fchcrm1082.getAll(function (result) {
                if (result) {
                    for (i = 0; i < result.length; i = i + 1) {
                        CRMControl.units.push(result[i]);
                        if (CRMControl.model.num_id_umd === result[i].num_id) {
                            CRMControl.model.num_id_umd = result[i];
                        }
                    }
                }
            }, true);
        };
        
        this.getExpenseType = function () {
            fchcrm1114.getAll(function (result) {
                if (result) {
                    for (i = 0; i < result.length; i = i + 1) {
                        CRMControl.expenseType.push(result[i]);
                        if (CRMControl.model.num_id_tip_despes === result[i].num_id) {
                            CRMControl.model.num_id_tip_despes = result[i];
                        }
                    }
                }
            }, true);
        };
        
        this.cancel = function () {
            $modalInstance.close(CRMControl.resultList);
        };
        
        this.model = parameters.expense || {};
        this.campaignId = parameters.campaignId;
        this.editMode = parameters.expense && parameters.expense.num_id && parameters.expense.num_id > 0 ? true : false;
        
        this.init();
    };
    
    controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'crm.crm_unid_medid.factory', 'crm.crm_tip_despes.factory', 'crm.helper', 'crm.crm_campanha.factory'
    ];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.crm_campanha_despes.modal.edit', modal);
	index.register.controller('crm.crm_campanha_despes.edit.control', controller);
});
