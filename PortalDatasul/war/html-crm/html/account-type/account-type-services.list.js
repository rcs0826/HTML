/*globals index, define, angular, TOTVSEvent, console */
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1018.js',
    '/dts/crm/html/account-type/account-type-services.edit.js'
], function (index) {
    
    'use strict';
    
    var controller;
   
    // *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
    
	controller = function ($scope, $rootScope, TOTVSEvent, helper, userPreferenceModal, factory, modalAccountTypeEdit) {
        
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

            if (CRMControl.quickSearchText && CRMControl.quickSearchText !== "") {
                
                filters = {
                    property: "nom_tip_clien",
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
        
        this.init = function init() {
			var viewName = $rootScope.i18n('l-type-client', [], 'dts/crm'),
				viewController = 'crm.account-type.list.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);
				CRMControl.search();
			});
		};
        
        this.userSettings = function () {
			userPreferenceModal.open({ context: 'account-type.list' });
		};
        
        this.addEdit = function (item) {
            modalAccountTypeEdit.open({
                model: angular.copy(item)
            }).then(function (result) {
                if (result) {
                    CRMControl.search();
                }
            });
        };
        
        this.remove = function (item, index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-type-client', [], 'dts/crm').toLowerCase(), item.nom_tip_clien
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    factory.deleteRecord(item.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        CRMControl.list.splice(index, 1);
                        CRMControl.listCount = CRMControl.listCount - 1;
                        
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-type-client', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                    });
                }
            });
            
        };
        
        if ($rootScope.currentuserLoaded) { CRMControl.init(); }
        
        // *********************************************************************************
		// *** Listners
		// *********************************************************************************
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
    };

    controller.$inject = [
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.user.modal.preference', 'crm.crm_tip_clien.factory', 'crm.crm_tip_clien.modal.edit'
    ];
    
    // ########################################################
	// ### Register
	// ########################################################
    
	index.register.controller('crm.account-type.list.control', controller);
});