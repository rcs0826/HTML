/*globals index, define, angular, TOTVSEvent, console, $, CRMEvent */
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/crm-components.js',
    '/dts/crm/html/hierarchy-type/hierarchy/hierarchy-services.edit.js',
    'css!/dts/crm/js/libs/3rdparty/angular-ui-tree/angular-ui-tree.min.css',
    'ng-load!/dts/crm/js/libs/3rdparty/angular-ui-tree/angular-ui-tree.js'
], function (index) {
    'use strict';
    
    var controller;
    
    controller = function ($scope, $rootScope, TOTVSEvent, helper, fchhub0003, $stateParams, modalHierarchyTypeEdit, $location,  modalHierarchyEdit) {
        
        var CRMControl = this;
        
        this.model = undefined;
        
        this.levels = undefined;
        
        this.levelsNoReport = undefined;
        
        // *********************************************************************************
		// *** Initialize
		// *********************************************************************************
        
        this.load = function (id) {
            fchhub0003.getRecord(id, function (result) {
                if (result) {
                    CRMControl.model = result;
                    CRMControl.getLevels();
                }
            });
        };
        
        this.getLevels = function () {
            fchhub0003.getHierarchyLevels(CRMControl.model.num_id, function (result) {
                if (result && result.lc_levels) {
                    CRMControl.levels = JSON.parse(result.lc_levels);
                    
                    if (CRMControl.levels.length > 0) {
                        CRMControl.showUsers(CRMControl.levels[0]);
                    }
                }
            });
//            fchhub0003.getHierarchyNoReport(CRMControl.model.num_id, function (result) {
//                if (result && result.lc_levels) {
//                    CRMControl.levelsNoReport = JSON.parse(result.lc_levels);
//                }
//            });
        };
        
        this.remove = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-hierarchy', [], 'dts/crm').toLowerCase(), CRMControl.selectedNode.nom_hier_time
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
                    
                    fchhub0003.deleteHierarchy(CRMControl.selectedNode.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-hierarchy', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                        
                        CRMControl.getLevels();
                    });
                }
            });
        };
        
        this.addEditHierarchy = function (isEdit) {
            
            modalHierarchyEdit.open({
                type: $stateParams.id,
                selected: isEdit ? angular.copy(CRMControl.selectedNode) : {}
            }).then(function (result) {
                CRMControl.getLevels();
            });
        };
        
        this.showUsers = function (node) {
            var nodeEl,
                nodes;

            nodes = $('.tree-node').css('background-color', '#f8faff');
            
            fchhub0003.findHierarchy(node.id, function (result) {
                CRMControl.selectedNode = angular.copy(result[0]);
                
                nodeEl = $('#node' + CRMControl.selectedNode.num_id).css('background-color', 'antiquewhite');
                $rootScope.$broadcast(CRMEvent.scopeLoadHierarchy, result[0].num_id);
            });
        };
        
        this.removeNode = function (node) {
            console.log(node);
        };
        
        this.onEdit = function () {
            modalHierarchyTypeEdit.open({
                type: CRMControl.model
            }).then(function (result) {
                if (result) {
                    CRMControl.load(result.num_id);
                }
            });
        };
        
        this.onRemove = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-hierarchy-type', [], 'dts/crm').toLowerCase(), CRMControl.model.nom_tip_hier
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    fchhub0003.deleteRecord(CRMControl.model.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-hierarchy-type', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                        
                        $location.path('/dts/crm/hierarchy-type/');
                    });
                }
            });
        };

		this.init = function () {

			var viewName = $rootScope.i18n('nav-hierarchy-type', [], 'dts/crm'),
				viewController = 'crm.hierarchy-type.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
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
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'hier.tip_hier.factory', '$stateParams', 'hier.tip_hier.modal.edit', '$location', 'hier.hier_time.modal.edit'
    ];
    
    // ########################################################
	// ### Register
	// ########################################################
    
	index.register.controller('crm.hierarchy-type.detail.control', controller);
});