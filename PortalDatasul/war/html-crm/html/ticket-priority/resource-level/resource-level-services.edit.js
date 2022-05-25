/*globals index, define, angular, TOTVSEvent, console, $, CRMEvent, CRMUtil */
define([
    'index',
    '/dts/crm/js/api/fchcrm1034.js',
    '/dts/crm/js/api/fchcrm1100.js',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/zoom/crm_niv_recur.js'
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
				templateUrl: '/dts/crm/html/ticket-priority/resource-level/resource-level.edit.html',
				controller: 'crm.crm_priorid_ocor_niv_recur.edit.control as controller',
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
    
    controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent, helper, factory, resourceFactory) {
        
        var CRMControl = this;
        
        this.init = function () {
            if (CRMControl.editMode) {
                CRMControl.model.ttNivRecur = {
                    "num_id": CRMControl.model.num_id_niv_recur,
                    "nom_niv_recur": CRMControl.model.nom_niv_recur
                };
            }
        };
        
        this.save = function (isSaveAndNew) {
            var vo;
            
            if (this.isInvalidForm()) { return; }
            
            vo = this.convertToSave();
            
            if (CRMControl.editMode === true) {
				factory.updateResourceLevel(vo.num_id, vo, CRMControl.afterSave);
			} else {
				factory.saveResourceLevel(vo, function (result) {
                    
                    if (isSaveAndNew) {
                        if (result && result.length > 0) {
                            CRMControl.clear();
                        }
                    } else {
                        if (result && result.length > 0) {
                            $modalInstance.close();
                        }
                    }
                    
                    if (result[0]) {
                        CRMControl.showMessage(result[0]);
                    }
                });
			}

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
                title: $rootScope.i18n('l-resource-level', [], 'dts/crm'),
                detail: $rootScope.i18n(message, [
                    $rootScope.i18n('l-resource-level', [], 'dts/crm'),
                    item.nom_niv_recur
                ], 'dts/crm')
            });
        };
        
        this.clear = function () {
            CRMControl.model = undefined;
        };
        
        this.convertToSave = function () {
            var vo;
            
            vo = {
                num_id: CRMControl.model.num_id || 0,
                num_id_priorid_ocor: CRMControl.num_id_priorid_ocor,
                num_id_niv_recur: CRMControl.model.ttNivRecur.num_id,
                val_respos: CRMControl.model.val_respos
            };
            
            return vo;
        };
        
        this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (CRMUtil.isUndefined(model) || !model.ttNivRecur) {
				isInvalidForm = true;
				messages.push('l-resource-level');
			}
            
            if (CRMUtil.isUndefined(model) || CRMUtil.isUndefined(model.val_respos)) {
                isInvalidForm = true;
				messages.push('l-total-response');
			}

			if (isInvalidForm) {
                helper.showInvalidFormMessage('l-total-response', messages);
			}

			return isInvalidForm;
		};
        
        this.getResources = function (value) {
            if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_niv_recur', value: helper.parseStrictValue(value) };

			resourceFactory.typeahead(filter, undefined, function (result) {
				CRMControl.listOfResources = result;
			});
        };
        
        this.cancel = function () {
            $modalInstance.close();
        };
        
        this.model = parameters.model || {};
        this.num_id_priorid_ocor = parameters.num_id_prioridad_ocor;
        this.editMode = parameters.model && parameters.model.num_id && parameters.model.num_id > 0 ? true : false;
        
        this.init();
    };
    
    controller.$inject = [
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',  'crm.crm_priorid_ocor.factory', 'crm.crm_niv_recur.factory'
    ];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.crm_priorid_ocor_niv_recur.modal.edit', modal);
	index.register.controller('crm.crm_priorid_ocor_niv_recur.edit.control', controller);

});
