/*global define, angular*/

define([
    'index',
	'/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1118.js'
], function (index) {
    
    'use strict';
    
    var controler;
    
    // *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
	controler = function ($rootScope, $scope, TOTVSEvent, helper, factory, $window) {

        // *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;
        
        this.file = undefined;
        this.leads = [];
        
        // *********************************************************************************
		// *** Functions
		// *********************************************************************************

        this.load = function () {
        };
        
        this.download = function () {
            $window.open('/dts/datasul-rest/resources/api/fch/fchcrm/fchcrm1118/download');            
        };
        
        this.onSelectFile = function ($file) {
            if ($file && $file.length > 0) {
                this.file = $file[0];
                
                if (this.file.name && this.file.name.indexOf('.csv') > -1) {
                    factory.upload(this.file, function (data) {
                        CRMControl.leads = data;
                    });
                } else {
                    this.file = undefined;
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'error',
                        title:  $rootScope.i18n('nav-lead-import', [], 'dts/crm'),
                        detail: $rootScope.i18n('msg-lead-import-error', [], 'dts/crm'),
                        timeout: 1000
                    });
                }
            }
        };
        
        this.createLeads = function () {
            if (this.isInvalidForm()) {
                return;
            }
            CRMControl.leads = [];
            
            factory.create(this.file, function (data) {
                CRMControl.file = undefined;

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'warning',
                    title:  $rootScope.i18n('nav-lead-import', [], 'dts/crm'),
                    detail: $rootScope.i18n('msg-lead-import-finish', [], 'dts/crm'),
                    timeout: 1000
                });
            });
            
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type:   'info',
                title:  $rootScope.i18n('nav-lead-import', [], 'dts/crm'),
                detail: $rootScope.i18n('msg-lead-import', [], 'dts/crm'),
                timeout: 1000
            });
            
        };
        
        this.isInvalidForm = function () {
            var isInvalidForm = false,
				messages = [];

			if (!CRMControl.file) {
				isInvalidForm = true;
			}
            
            if (isInvalidForm) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'error',
                    title:  $rootScope.i18n('nav-lead-import', [], 'dts/crm'),
                    detail: $rootScope.i18n('msg-lead-import-file', [], 'dts/crm'),
                    timeout: 1000
                });
			}
            
			return isInvalidForm;
        };
        
        // *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
            var viewName = $rootScope.i18n('nav-lead-import', [], 'dts/crm'),
				viewController = 'crm.lead-import.list.control';

			helper.startView(viewName, viewController, CRMControl);

			helper.loadCRMContext(function () {
				CRMControl.load(false);
			});
        };
        
        if ($rootScope.currentuserLoaded) {	this.init(); }
        
		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControl.init();
		});

    };
    
    controler.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_importa_lead.factory', '$window'
	];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.lead-import.list.control', controler);
});

