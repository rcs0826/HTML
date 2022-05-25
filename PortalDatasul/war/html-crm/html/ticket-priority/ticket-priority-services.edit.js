/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/

define([
    'index',
    '/dts/crm/js/api/fchcrm1034.js',
    '/dts/crm/js/crm-services.js'
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
				templateUrl: '/dts/crm/html/ticket-priority/ticket-priority.edit.html',
				controller: 'crm.crm_priorid_ocor.edit.control as controller',
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
        
        this.model = undefined;
        
        this.editMode = false;
        
        this.cancel = function () {
            $modalInstance.close();
        };
        
        this.save = function () {
            if (CRMControl.isInvalidForm()) { return; }
            
            var vo = CRMControl.convertToSave();
        };
        
        this.convertToSave = function () {
            var vo;
                
            CRMControl.editMode = (CRMControl.model.num_id > 0);
            
            vo = {
                "num_id": CRMControl.model.num_id || 0,
                "log_suspenso": CRMControl.model.log_suspenso ? true : false,
                "nom_priorid_ocor": CRMControl.model.nom_priorid_ocor
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
				title: $rootScope.i18n('nav-ticket-priority', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-ticket-priority', [], 'dts/crm'),
					item.nom_priorid_ocor
				], 'dts/crm')
			});

			$modalInstance.close(item);
			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/ticket-priority/detail/' + item.num_id);
			}
		};
        
        this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (CRMUtil.isUndefined(model) || !model.nom_priorid_ocor || model.nom_priorid_ocor.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}
			
			if (isInvalidForm) {
                helper.showInvalidFormMessage('nav-ticket-priority', messages);
			}

			return isInvalidForm;
		};
        
        this.model = parameters.priority || {};
    };
    
    controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',  'crm.crm_priorid_ocor.factory'
    ];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.crm_priorid_ocor.modal.edit', modal);
	index.register.controller('crm.crm_priorid_ocor.edit.control', controller);

});
