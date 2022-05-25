/*globals index, define, TOTVSEvent, CRMControl, CRMEvent, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
    'index',
    '/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
    '/dts/crm/js/api/fchcrm1107.js',
    '/dts/crm/html/ticket-flow/status/rules/rules-services.edit.js'
], function (index) {
    
    'use strict';
    
    var controller;

	// *************************************************************************************
	// *** TICKETFLOW > STATUS > RULES TAB SERVICE|CONTROLLER
	// *************************************************************************************
    controller = function ($rootScope, $scope, TOTVSEvent, factory, modal) {
        
        var CRMControl = this;
            
        this.model = undefined;
        
        this.init = function (status, statusFlow) {
            CRMControl.status = status;
            CRMControl.statusFlow = statusFlow;
            this.load(status);
        };
        
        this.addEditRule = function (rule) {

			modal.open({
				rule: rule,
                status: CRMControl.status,
                statusFlow: CRMControl.statusFlow
			}).then(function (result) {
                CRMControl.load(CRMControl.status);
			});
		};
        
        this.load = function (status) {
            var filters = [],
                options = {};
            
            filters.push({
                property: "num_id_ocor_fluxo_status",
                value:  status.num_id
            });
            
            factory.findRecords(filters, options, function (result) {
                CRMControl.model = {
                    ttRegras: result
                };
			});
        };
        
        this.removeRule = function (id, index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-confirm-delete',
                cancelLabel: 'btn-cancel',
                confirmLabel: 'btn-confirm',
                text: $rootScope.i18n('msg-confirm-delete-rule', [], 'dts/crm'),
                callback: function (isPositiveResult) {
                    
                    if (!isPositiveResult) { return; }
                    
                    factory.removeRule(id, function (result) {
                        if (result) {
                            CRMControl.model.ttRegras.splice(index, 1);
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success',
                                title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
                                detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
                            });
                        }
                    });
                }
            });
        };
        
        $scope.$on(CRMEvent.scopeLoadTicketFlowStatus, function (event, status) {
            CRMControl.status = status;
			CRMControl.load(status);
		});
    };
    
    controller.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.ticket-flow-status-rules.factory', 'crm.ticket-flow-status-rules.modal.selection'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.ticket-flow-status-rules.tab.control', controller);

});