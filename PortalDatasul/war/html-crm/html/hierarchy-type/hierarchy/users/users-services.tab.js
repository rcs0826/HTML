/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, console*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
    'index',
    '/dts/crm/js/api/fchhub0003.js',
    '/dts/crm/js/zoom/usuar_mestre.js',
    '/dts/crm/js/crm-services.js'
], function (index) {
    'use strict';
    
    var controller;
    
    // *************************************************************************************
	// *** CONTROLLER TAN
	// *************************************************************************************
    controller = function ($rootScope, $scope, fchhub0003, helper, TOTVSEvent) {
        var CRMControl = this;
        
        this.ttUsuarios = undefined;
        
        this.search = function (id) {
            var filter;
            
            CRMControl.ttUsuarios = [];
            
            if (id) {
                CRMControl.num_id = id;
            }
            
            if (CRMControl.quickSearchText) {
                filter = helper.parseStrictValue(CRMControl.quickSearchText);
            }
            
            fchhub0003.findUsers(CRMControl.num_id, filter, function (result) {
                CRMControl.ttUsuarios = result;
            });
        };
        
        this.addUsers = function () {
            var vo = this.convertToSave();
            
            CRMControl.selectedUsers = undefined;
            
            fchhub0003.saveUsers(vo, function (result) {
                if (result) {
                    CRMControl.search();
                }
            });
        };
        
        this.convertToSave = function () {
            var vo = [],
                i,
                model;
            
            model = CRMControl.selectedUsers;
            
            if (model.objSelected) {
                model = model.objSelected;
                
                for (i = 0; i < model.length; i = i + 1) {
                    vo.push({
                        cod_usuario: model[i].cod_usuario,
                        num_id_hier: CRMControl.num_id
                    });
                }
            } else {
                vo.push({
                    cod_usuario: model.cod_usuario,
                    num_id_hier: CRMControl.num_id
                });
            }
            
            return vo;
        };
        
        this.removeUser = function (user, index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-user', [], 'dts/crm').toLowerCase(), user.nom_usuario
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
                    
                    fchhub0003.removeUser(user.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }
                        
                        CRMControl.ttUsuarios.splice(index, 1);
                        
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-user', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                    });
                }
            });
        };
        
        $scope.$on(CRMEvent.scopeLoadHierarchy, function (event, id) {
			CRMControl.num_id = id;
            CRMControl.search();
		});
    };
    
    controller.$inject = [
        '$rootScope', '$scope', 'hier.tip_hier.factory', 'crm.helper', 'TOTVSEvent'
    ];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('hier.hier_usuar.tab.control', controller);
});