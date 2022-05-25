/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, console*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchhub0003.js',
    '/dts/crm/js/zoom/usuar_mestre.js',
    '/dts/crm/js/zoom/usuar_mestre.js'
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
				templateUrl: '/dts/crm/html/hierarchy-type/hierarchy/hierarchy.edit.html',
				controller: 'hier.hier_time.edit.control as controller',
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

    controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent, helper, fchhub0003, masterUserFactory) {
        var CRMControl = this,
            i;
        
        this.hierarchyType = 0;
        this.hierarchies = [];
        this.editMode = false;
        this.masterUsers = [];
        
        this.init = function () {
            CRMControl.getHierarchies();
            CRMControl.convertModel();
        };
        
        this.convertModel = function () {
            if (CRMControl.model.cod_usuario) {
                CRMControl.getUserMaster();
            }
        };
        
        this.getHierarchies = function () {
            CRMControl.hierarchies = [];
            
            fchhub0003.getHierarchies(CRMControl.hierarchyType, function (result) {
                if (result) {
                    for (i = 0; i < result.length; i = i + 1) {
                        CRMControl.hierarchies.push({
                            value: result[i].num_id,
                            label: result[i].nom_hier_time
                        });
                    }
                }
            });
        };
        
        this.cancel = function () {
            $modalInstance.close();
        };
        
        this.save = function (isSaveAndNew) {
            var vo;
            
            if (this.isInvalidForm()) { return; }
            
            vo = this.convertToSave();
            
            if (CRMControl.editMode === true) {
				fchhub0003.updateHierarchy(vo.num_id, vo, CRMControl.afterSave);
			} else {
				fchhub0003.saveHierarchy(vo, function (result) {
                    
                    if (isSaveAndNew) {
                        if (result && result.length > 0) {
                            CRMControl.getHierarchies();
                            CRMControl.clear();
                        }
                    } else {
                        if (result && result.length > 0) {
                            $modalInstance.close();
                        }
                    }
                    
                    CRMControl.showMessage(result[0]);
                });
			}
        };
        
        this.getUserMaster = function (value) {
            var filter = { property: 'cod_usuario', value: CRMControl.model.cod_usuario };

            masterUserFactory.typeahead(filter, undefined, function (result) {
                CRMControl.model.cod_usuario = result[0];
            });
        };
        
        this.getMasterUsers = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_usuario', value: helper.parseStrictValue(value) };

			masterUserFactory.typeahead(filter, undefined, function (result) {
				CRMControl.masterUsers = result;
			});
		};

        
        this.clear = function () {
            CRMControl.model = undefined;
        };
        
        this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (CRMUtil.isUndefined(model) || !model.nom_hier_time || model.nom_hier_time.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}
			
			if (isInvalidForm) {
                helper.showInvalidFormMessage('nav-hierarchies', messages);
			}

			return isInvalidForm;
		};
        
        this.convertToSave = function () {
            var vo;
                
            vo = {
                "num_id": CRMControl.model.num_id || 0,
                "nom_hier_time": CRMControl.model.nom_hier_time,
                "num_id_hier_reporta_a": CRMControl.model.num_id_hier_reporta_a,
                "cod_usuario": CRMControl.model.cod_usuario ? CRMControl.model.cod_usuario.cod_usuario : '',
                "num_id_tip_hier": Number(CRMControl.hierarchyType)
                
            };
            
            return vo;
        };
        
        this.afterSave = function (result) {
            if (result && result.length > 0) {
                $modalInstance.close(result);
                
                CRMControl.showMessage(result[0]);
            }
        };
        
        this.showMessage = function (item) {
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
                    item.nom_hier_time
                ], 'dts/crm')
            });
        };
        
        this.hierarchyType = parameters.type || 0;
        this.model = parameters.selected || {};
        this.editMode = parameters.selected && parameters.selected.num_id && parameters.selected.num_id > 0 ? true : false;
        
        this.init();
        
    };
    
    controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper', 'hier.tip_hier.factory', 'crm.usuar_mestre.factory'
    ];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('hier.hier_time.modal.edit', modal);
	index.register.controller('hier.hier_time.edit.control', controller);
});