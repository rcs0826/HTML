/*globals index, define, angular, TOTVSEvent, console */
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchhub0003.js'
    
], function (index) {
    
    'use strict';

    var controller;
    
    // *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
    
	controller = function ($scope, $rootScope, TOTVSEvent, helper, fchhub0003, modalHierarchyTypeEdit, userPreferenceModal) {

		var CRMControl = this,
            i;
          
        this.list = [];
		this.quickSearchText = "";
        this.listCount = 0;
        
        // *********************************************************************************
		// *** Functions
		// *********************************************************************************
        this.search = function (isMore) {
            
            var options = [],
                filters = {};

            CRMControl.listCount = 0;
            
            if (!isMore) {
                CRMControl.list = [];
            }

            if (CRMControl.quickSearchText && CRMControl.quickSearchText !== "") {
                
                filters = {
                    property: "nom_tip_hier",
                    value: helper.parseStrictValue(CRMControl.quickSearchText)
                };
                
            } else {
                filters = {};
            }
            
            options = {
				start: CRMControl.list.length,
				end: 50
			};
            
            fchhub0003.findRecords(filters, options, function (types) {
                
                for (i = 0; i < types.length; i = i + 1) {
                    CRMControl.list.push(types[i]);
                    
                    if (types[i].$length) {
                        CRMControl.listCount = types[i].$length;
                    }
                }
            });
        };
        
        this.init = function init() {
			var viewName = $rootScope.i18n('nav-hierarchy-type', [], 'dts/crm'),
				viewController = 'crm.hierarchy-type.list.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);
				CRMControl.search();
			});
		};
        
        this.addEdit = function (type) {
            modalHierarchyTypeEdit.open({
                type: type
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
					$rootScope.i18n('nav-hierarchy-type', [], 'dts/crm').toLowerCase(), item.nom_tip_hier
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    fchhub0003.deleteRecord(item.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        CRMControl.list.splice(index, 1);
                        CRMControl.listCount = CRMControl.listCount - 1;
                        
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-hierarchy-type', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                    });
                }
            });
            
        };
        
        this.userSettings = function () {
			userPreferenceModal.open({ context: 'hierarchy-type.list' });
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
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'hier.tip_hier.factory', 'hier.tip_hier.modal.edit', 'crm.user.modal.preference'
    ];
    
    // ########################################################
	// ### Register
	// ########################################################
    
	index.register.controller('crm.hierarchy-type.list.control', controller);
});
