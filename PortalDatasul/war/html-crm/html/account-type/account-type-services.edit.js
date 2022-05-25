/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1018.js'
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
				templateUrl: '/dts/crm/html/account-type/account-type.edit.html',
				controller: 'crm.crm_tip_clien.edit.control as controller',
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
    controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent, helper, factory) {
        var CRMControl = this;
        
        this.save = function () {
            if (CRMControl.isInvalidForm()) { return; }
            
            var vo = CRMControl.convertToSave();
        };
        
        this.convertToSave = function () {
            var vo;
                
            CRMControl.editMode = (CRMControl.model.num_id > 0);
            
            vo = {
                "num_id": CRMControl.model.num_id || 0,
                "nom_tip_clien": CRMControl.model.nom_tip_clien,
                "log_validac_cnpj_cpf": CRMControl.model.log_validac_cnpj_cpf ? true : false
            };
            
            if (CRMControl.editMode === true) {
				factory.updateRecord(vo.num_id, vo, CRMControl.afterSave);
			} else {
				factory.saveRecord(vo, CRMControl.afterSave);
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
				title: $rootScope.i18n('l-type-client', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('l-type-client', [], 'dts/crm'),
					item.nom_tip_clien
				], 'dts/crm')
			});

			$modalInstance.close(item);
			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/account-type/detail/' + item.num_id);
			}
		};
        
        this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (CRMUtil.isUndefined(model) || !model.nom_tip_clien || model.nom_tip_clien.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}
			
			if (isInvalidForm) {
                helper.showInvalidFormMessage('l-type-client', messages);
			}

			return isInvalidForm;
		};
        
        this.cancel = function () {
            $modalInstance.close();
        };
        
        this.model = parameters.model || {};
    };
    
    controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper', 'crm.crm_tip_clien.factory'
    ];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.crm_tip_clien.modal.edit', modal);
	index.register.controller('crm.crm_tip_clien.edit.control', controller);

});