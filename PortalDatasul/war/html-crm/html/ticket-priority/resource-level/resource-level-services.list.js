/*globals index, define, angular, TOTVSEvent, console, $, CRMEvent */
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/crm-components.js',
    '/dts/crm/js/api/fchcrm1034.js',
    '/dts/crm/html/ticket-priority/resource-level/resource-level-services.edit.js'
], function (index) {
    'use strict';
    
    var controller;
    
    controller = function ($scope, $rootScope, TOTVSEvent, helper, factory, modalResourceLevel) {
        var CRMControl = this, i;
        
        this.ttNivelRecurso = undefined;
        
        this.search = function () {
            var filter;
            
            if (CRMControl.quickSearchText) {
                filter = helper.parseStrictValue(CRMControl.quickSearchText);
            }
            
            factory.findResourceLevel(CRMControl.num_id_prioridad_ocor, filter, function (result) {
                if (result) {
                    CRMControl.ttNivelRecurso = result;
                }
            });
        };
        
        this.removeResourceLevel = function (item, index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-resource-level', [], 'dts/crm').toLowerCase(), item.nom_niv_recur
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    factory.deleteResourceLevel(item.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        CRMControl.ttNivelRecurso.splice(index, 1);
                        
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-resource-level', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                    });
                }
            });
        };
        
        this.addEditLevelResource = function (model) {
            modalResourceLevel.open({
                num_id_prioridad_ocor: CRMControl.num_id_prioridad_ocor,
                model: angular.copy(model)
            }).then(function (result) {
                CRMControl.search();
            });
        };
            
        $scope.$on(CRMEvent.scopeLoadTicketPriority, function (event, id) {
			CRMControl.num_id_prioridad_ocor = id;
            CRMControl.search();
		});
    };
    
    controller.$inject = [
        '$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_priorid_ocor.factory', 'crm.crm_priorid_ocor_niv_recur.modal.edit'
    ];
    
    // ########################################################
	// ### Register
	// ########################################################
	index.register.controller('crm.crm_priorid_ocor_niv_recur.list.control', controller);
    
});