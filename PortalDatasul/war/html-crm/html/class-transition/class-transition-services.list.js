/*globals index, define, angular */
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1115.js',
    '/dts/crm/html/class-transition/class-transition-services.edit.js'
], function (index) {
   
    'use strict';
    
    var controller;
    
    // *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
	controller = function ($scope, $rootScope, TOTVSEvent, helper, userPreferenceModal, factory, modalClassTransition) {

		var CRMControl = this;
        
        this.list = [];
		this.quickSearchText = "";
        this.listCount = 0;
        
        this.search = function (isMore) {
            var options = [],
                filters = {},
                i;

            CRMControl.listCount = 0;
            
            if (!isMore) {
                CRMControl.list = [];
            }
            
            if (CRMUtil.isDefined(CRMControl.quickSearchText) && CRMControl.quickSearchText.trim().length > 0) {
                filters = {
                    property: 'custom.quickSearch',
                    value: helper.parseStrictValue(CRMControl.quickSearchText)
                };
            } else {
                filters = {};
            }
            
            options = {
				start: CRMControl.list.length,
				end: 50
			};
            
            factory.findRecords(filters, options, function (result) {
                
                for (i = 0; i < result.length; i = i + 1) {
                    CRMControl.list.push(result[i]);
                    
                    if (result[i].$length) {
                        CRMControl.listCount = result[i].$length;
                    }
                }
            });
        };
        
        this.remove = function (item, index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-campaign-action-trans-class', [], 'dts/crm').toLowerCase(), item.ttClasse.nom_clas_clien + ' - ' + item.ttProximaClasse.nom_clas_clien
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    factory.deleteRecord(item.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        CRMControl.list.splice(index, 1);
                        CRMControl.listCount = CRMControl.listCount - 1;
                        
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign-action-trans-class', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                    });
                }
            });
        };
        
        this.addEdit = function (item) {
            modalClassTransition.open({
                model: angular.copy(item)
            }).then(function (result) {
                if (result) {
                    CRMControl.search();
                }
            });
        };
        
        this.init = function () {
			var viewName = $rootScope.i18n('l-campaign-action-trans-class', [], 'dts/crm'),
				viewController = 'crm.class-transition.list.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);
				CRMControl.search();
			});
		};
        
        if ($rootScope.currentuserLoaded) { CRMControl.init(); }
        
        this.userSettings = function () {
			userPreferenceModal.open({ context: 'class-transition.list' });
		};
        
        // *********************************************************************************
		// *** Listners
		// *********************************************************************************
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
    };
    
    controller.$inject = [
        '$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.user.modal.preference', 'crm.crm_transf_class.factory', 'crm.class-transition.modal.edit'
    ];
    
    // ########################################################
	// ### Register
	// ########################################################
	index.register.controller('crm.class-transition.list.control', controller);
    
});
