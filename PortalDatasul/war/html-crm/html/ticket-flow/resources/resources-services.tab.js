/*globals index, define, TOTVSEvent, CRMControl, CRMEvent, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
    '/dts/crm/js/api/fchcrm1098.js',
    '/dts/crm/js/zoom/crm_recur.js',
    '/dts/crm/html/ticket-flow/resources/resource-services.edit.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** TICKETFLOW > RESOURCE TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, modalResourceEdit) {

        this.addEdit = function (item) {
            var CRMControl = this;
			modalResourceEdit.open({
                flowId: CRMControl.model.num_id,
				model: item
			}).then(function (result) {
				if (result !== undefined) {
					CRMControl.getResources(CRMControl.model.num_id);
				}
			});
		};
        
        this.getResources = function (flowId) {
            var CRMControl = this;

            factory.getResourcesByFlow(flowId, function (result) {
				if (result) {
                    CRMControl.model.ttFluxoRecursos = result;
                }
			});
        };
        
        this.convertToSave = function (resources) {
            var CRMControl = this,
                vo;
            
            vo = {
                num_id_ocor_fluxo: CRMControl.model.num_id,
                num_id_recur: resources.num_id_recur,
                log_padr: false
            };
            
            return vo;
        };

        this.addResource = function () {
            var CRMControl = this,
                i,
                vo;
            
            if (CRMControl.selectedResources.objSelected) {
                vo = [];
                
                for (i = 0; i < CRMControl.selectedResources.objSelected.length; i++) {
                    vo.push(this.convertToSave(CRMControl.selectedResources.objSelected[i]));
                }
                
            } else {
                vo = this.convertToSave(CRMControl.selectedResources);
            }
            
            factory.addResource(vo, function (result) {
                if (result) {
                    CRMControl.getResources(CRMControl.model.num_id);
                }
            });
            
            CRMControl.selectedResources = undefined;

        };
        
        this.removeResource = function (id, index) {
            var CRMControl = this;
            
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-confirm-delete',
                cancelLabel: 'btn-cancel',
                confirmLabel: 'btn-confirm',
                text: $rootScope.i18n('msg-confirm-delete', [
                    $rootScope.i18n('nav-resource', [], 'dts/crm').toLowerCase(), CRMControl.model.ttFluxoRecursos[index].nom_usuar
                ], 'dts/crm'),
                callback: function (isPositiveResult) {
                    
                    if (!isPositiveResult) { return; }
                    
                    factory.removeResource(id, function (result) {
                        if (result.l_ok) {
                            CRMControl.model.ttFluxoRecursos.splice(index, 1);
                        
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success',
                                title: $rootScope.i18n('nav-resource', [], 'dts/crm'),
                                detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
                            });
                        }
                    });

                }
            });
            
        };
        
        this.saveFavorite = function (id) {
            var CRMControl = this;
            
            factory.saveFavorite(id, function (result) {
                if (result) {
                    CRMControl.getResources(CRMControl.model.num_id);
                }
            });
        };

	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_ocor_fluxo_recur.factory', 'crm.ticket-flow-resource.modal.selection'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.ticket-flow-resources.tab.service', service);

});
