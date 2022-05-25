/*globals index, define, angular, TOTVSEvent, console, $, CRMEvent, CRMUtil */
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1018.js'
], function (index) {
    'use strict';
    
    var controller,
        modal;
    
    // *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
    modal = function ($modal) {
        this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/account-type/types/types.edit.html',
				controller: 'crm.crm_tip_clien_cta.edit.control as controller',
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

    controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent, helper, legend, factory) {
        var CRMControl = this;
        
        this.model = {};
        
        this.accountTypes = [
			{num_id: 1, nom_tipo: legend.accountType.NAME(1)},
			{num_id: 2, nom_tipo: legend.accountType.NAME(2)},
			{num_id: 3, nom_tipo: legend.accountType.NAME(3)},
			{num_id: 4, nom_tipo: legend.accountType.NAME(4)},
			{num_id: 5, nom_tipo: legend.accountType.NAME(5)},
			{num_id: 6, nom_tipo: legend.accountType.NAME(6)},
			{num_id: 7, nom_tipo: legend.accountType.NAME(7)},
			{num_id: 8, nom_tipo: legend.accountType.NAME(8)}
		];
        
        this.init = function () {
            if (CRMControl.model && CRMControl.model.idi_tip_cta) {
                CRMControl.convertType();
            }
        };
        
        this.convertType = function () {
            CRMControl.model.idi_tip_cta = {
                num_id: CRMControl.model.idi_tip_cta,
                nom_tipo: legend.accountType.NAME(CRMControl.model.idi_tip_cta)
            };
        };
        
        this.cancel = function () {
            $modalInstance.close();
        };
        
        this.save = function (isSaveAndNew) {
            var vo;
            
            if (CRMControl.isInvalidForm()) { return; }
            
            vo = CRMControl.convertToSave();
            
            if (CRMControl.editMode === true) {
				factory.updateType(vo.num_id, vo, function (result) {
                    CRMControl.afterSave(result, false);
                });
			} else {
				factory.saveType(vo, function (result) {
                    CRMControl.afterSave(result, isSaveAndNew);
                });
			}
        };
        
        this.afterSave = function (item, isSaveAndNew) {

			if (!item || item.length === 0) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-type-account', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('l-type-account', [], 'dts/crm'),
					item[0].nom_tip_cta
				], 'dts/crm')
			});

            if (!isSaveAndNew) {
                $modalInstance.close(item);
            } else {
                CRMControl.clear();
            }
		};
        
        this.clear = function () {
            CRMControl.model.num_id = 0;
            CRMControl.model.idi_tip_cta = undefined;
            CRMControl.model.log_livre_1 = false;
        };
        
        this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (CRMUtil.isUndefined(model) || CRMUtil.isUndefined(model.idi_tip_cta)) {
				isInvalidForm = true;
				messages.push('l-type-account');
			}
			
			if (isInvalidForm) {
                helper.showInvalidFormMessage('l-type-account', messages);
			}

			return isInvalidForm;
		};
        
        this.convertToSave = function () {
            var vo;
            
            vo = {
                "num_id_tip_clien": CRMControl.model.num_id_tip_clien,
                "num_id": CRMControl.model.num_id || 0,
                "idi_tip_cta": CRMControl.model.idi_tip_cta.num_id,
                "log_livre_1": CRMControl.model.log_livre_1 ? true : false
            };
            
            return vo;
        };
        
        this.model = parameters.model || {};
        this.model.num_id_tip_clien = parameters.accountTypeId;
        this.editMode = parameters.model && parameters.model.num_id > 0 ? true : false;
        
        this.init();
        
    };
    
    controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper', 'crm.legend', 'crm.crm_tip_clien.factory'
    ];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.crm_tip_clien_cta.modal.edit', modal);
	index.register.controller('crm.crm_tip_clien_cta.edit.control', controller);
});
