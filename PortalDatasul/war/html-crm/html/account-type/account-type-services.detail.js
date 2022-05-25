/*globals index, define, angular, TOTVSEvent, console, $, CRMEvent */
define([
    'index',
    '/dts/crm/js/api/fchcrm1018.js',
    '/dts/crm/html/account-type/account-type-services.edit.js',
    '/dts/crm/html/account-type/types/types-services.edit.js'
], function (index) {
    
    'use strict';
    
    var controller;
    
    controller = function ($scope, $rootScope, TOTVSEvent, helper, $stateParams, $location, factory, modalAccountTypeEdit, modalTypeEdit) {
        
        var CRMControl = this;
        this.accountTypeList = [];
        
        // *********************************************************************************
		// *** Initialize
		// *********************************************************************************
        
        this.load = function (id) {
            factory.getRecord(id, function (result) {
                if (result) {
                    CRMControl.model = result;
                }
            });
            
            CRMControl.getAccountTypeList();
            
        };
        
        this.getAccountTypeList = function () {
            factory.getAccountTypeList(CRMControl.id, function (result) {
                if (result) {
                    CRMControl.accountTypeList = result;
                }
            });
        };
        
        this.init = function () {

			var viewName = $rootScope.i18n('l-type-client', [], 'dts/crm'),
				viewController = 'crm.account-type.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

				if ($stateParams && $stateParams.id) {
                    CRMControl.id = parseInt($stateParams.id, 0);
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
					$rootScope.i18n('l-type-client', [], 'dts/crm').toLowerCase(), CRMControl.model.nom_tip_clien
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    factory.deleteRecord(CRMControl.model.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-type-client', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                        
                        $location.path('/dts/crm/account-type/');
                    });
                }
            });
        };

        this.onEdit = function () {
            modalAccountTypeEdit.open({
                model: angular.copy(CRMControl.model)
            }).then(function (result) {
                if (result) {
                    CRMControl.load(result.num_id);
                }
            });
        };
        
        this.removeType = function (type) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-type-account', [], 'dts/crm').toLowerCase(), type.nom_tip_cta
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    factory.deleteType(type.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        CRMControl.accountTypeList.splice(index, 1);
                        
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-type-account', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                    });
                }
            });
        };
        
        this.addEditType = function (type) {
            modalTypeEdit.open({
                model: angular.copy(type),
                accountTypeId: CRMControl.model.num_id
            }).then(function (result) {
                CRMControl.getAccountTypeList();
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
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', '$stateParams', '$location', 'crm.crm_tip_clien.factory', 'crm.crm_tip_clien.modal.edit', 'crm.crm_tip_clien_cta.modal.edit'
    ];
    
    // ########################################################
	// ### Register
	// ########################################################
    
	index.register.controller('crm.account-type.detail.control', controller);
});