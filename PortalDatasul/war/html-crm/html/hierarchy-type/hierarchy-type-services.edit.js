/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchhub0003.js',
    '/dts/crm/html/hierarchy-type/hierarchy/users/users-services.tab.js'
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
				templateUrl: '/dts/crm/html/hierarchy-type/hierarchy-type.edit.html',
				controller: 'hier.tip_hier.edit.control as controller',
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

    controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent, helper, fchhub0003) {
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
                "log_ativ": CRMControl.model.log_ativ ? true : false,
                "nom_tip_hier": CRMControl.model.nom_tip_hier
            };
            
            if (CRMControl.editMode === true) {
				fchhub0003.updateRecord(vo.num_id, vo, CRMControl.afterSave);
			} else {
				fchhub0003.saveRecord(vo, CRMControl.afterSave);
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
				title: $rootScope.i18n('nav-hierarchy-type', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-hierarchy-type', [], 'dts/crm'),
					item.nom_tip_hier
				], 'dts/crm')
			});

			$modalInstance.close(item);
			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/hierarchy-type/detail/' + item.num_id);
			}
		};
        
        this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (CRMUtil.isUndefined(model) || !model.nom_tip_hier || model.nom_tip_hier.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}
			
			if (isInvalidForm) {
                helper.showInvalidFormMessage('nav-hierarchy-type', messages);
			}

			return isInvalidForm;
		};
        
        this.model = parameters.type || {};
    };
    
    controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper', 'hier.tip_hier.factory'
    ];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('hier.tip_hier.modal.edit', modal);
	index.register.controller('hier.tip_hier.edit.control', controller);
});