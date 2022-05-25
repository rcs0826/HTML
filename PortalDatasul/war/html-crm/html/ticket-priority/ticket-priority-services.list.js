/*globals index, define, CRMUtil, angular*/
define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1034.js'
], function (index) {
    'use strict';
    
    var controller;
    
    // *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
    
    controller = function ($rootScope, $scope, TOTVSEvent, helper, factory, userPreferenceModal, modalTicketPriority) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************
		var CRMControl = this;
        
        this.listOfTicketPriority = [];
        // *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
        
        this.search = function (isMore) {
            var filters, options, i;
            
            if (!isMore) {
                CRMControl.listOfTicketPriority = [];
            }
            
            if (CRMUtil.isDefined(CRMControl.quickSearchText) && CRMControl.quickSearchText.trim().length > 0) {
                filters = {
                    property: 'nom_priorid_ocor',
                    value: helper.parseStrictValue(CRMControl.quickSearchText)
                };
            } else {
                filters = {};
            }
            
            options = {
				start: CRMControl.listOfTicketPriority.length,
				end: 50
			};
            
            factory.findRecords(filters, options, function (result) {
                
                if (result) {
                    for (i = 0; i < result.length; i = i + 1) {
                        CRMControl.listOfTicketPriority.push(result[i]);

                        if (result[i].$length) {
                            CRMControl.listOfTicketPriorityCount = result[i].$length;
                        }
                    }
                }
            });
        };

        this.addEdit = function (priority) {
            modalTicketPriority.open({
                priority: angular.copy(priority)
            }).then(function (result) {
                if (result) {
                    CRMControl.search();
                }
            });
        };
        
		this.init = function () {

			helper.loadCRMContext(function () {

				var viewName = $rootScope.i18n('nav-ticket-priority', [], 'dts/crm'),
					startView,
					viewController = 'crm.ticket-type.list.control';

				startView = helper.startView(viewName, viewController, CRMControl);

				if (startView.isNewContext) {
					CRMControl.search(false);
				}
			});
		};
        
        this.remove = function (item, index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-ticket-priority', [], 'dts/crm').toLowerCase(), item.nom_priorid_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }
            
                    factory.deleteRecord(item.num_id, function (result) {
                        if (!result || result.l_ok !== true) { return; }

                        CRMControl.listOfTicketPriority.splice(index, 1);
                        CRMControl.listOfTicketPriorityCount = CRMControl.listOfTicketPriorityCount - 1;
                        
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-ticket-priority', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
                    });
                }
            });
            
        };

        
        this.userSettings = function () {
            userPreferenceModal.open({ context: 'ticket-priority.list' });
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

        
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
    
    controller.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_priorid_ocor.factory', 'crm.user.modal.preference', 'crm.crm_priorid_ocor.modal.edit'
    ];
    
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.ticket-priority.list.control', controller);
});
