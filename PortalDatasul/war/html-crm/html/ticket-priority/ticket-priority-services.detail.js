/*globals index, define, angular, TOTVSEvent, console, CRMEvent */

define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1034.js',
    '/dts/crm/html/ticket-priority/resource-level/resource-level-services.list.js'
], function (index) {
    'use strict';
    
    var controller;
    
    controller = function ($scope, $rootScope, TOTVSEvent, helper, factory, $stateParams, modalTicketPriority, $location) {
        var CRMControl = this;
        
        this.model = undefined;
        
        // *********************************************************************************
		// *** Initialize
		// *********************************************************************************
        
        this.load = function (id) {
            factory.getRecord(id, function (result) {
                if (result) {
                    CRMControl.model = result;
                    $rootScope.$broadcast(CRMEvent.scopeLoadTicketPriority, CRMControl.model.num_id);
                }
            });
        };
        
        this.init = function () {

			var viewName = $rootScope.i18n('nav-ticket-priority', [], 'dts/crm'),
				viewController = 'crm.ticket-priority.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
				}
			});
		};
        
        this.onEdit = function () {
            modalTicketPriority.open({
                priority: angular.copy(CRMControl.model)
            }).then(function (result) {
                if (result) {
                    CRMControl.load($stateParams.id);
                }
            });
            
        };
        
        this.onRemove = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-ticket-priority', [], 'dts/crm').toLowerCase(), CRMControl.model.nom_priorid_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    factory.deleteRecord(CRMControl.model.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-ticket-priority', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                        
                        $location.path('/dts/crm/ticket-priority/');
                    });
                }
            });
        };
        
        if ($rootScope.currentuserLoaded) { CRMControl.init(); }
        // *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
    };
    
    controller.$inject = [
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_priorid_ocor.factory', '$stateParams', 'crm.crm_priorid_ocor.modal.edit', '$location'
    ];
    
    // ########################################################
	// ### Register
	// ########################################################
    index.register.controller('crm.ticket-priority.detail.control', controller);
});
