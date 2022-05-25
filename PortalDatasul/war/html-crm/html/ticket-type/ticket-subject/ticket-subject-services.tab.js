/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
    //'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1032.js',
	'/dts/crm/js/api/fchcrm1031.js',
	'/dts/crm/js/api/fchcrm1045.js',
    '/dts/crm/html/ticket-type/ticket-subject/ticket-subject-services.edit.js',
	'/dts/crm/html/ticket-type/ticket-type-services.list.js',
	'/dts/crm/html/ticket-type/ticket-type-services.edit.js',
	'/dts/crm/html/ticket-type/ticket-type-services.detail.js',
	'/dts/crm/html/ticket-type/ticket-type-services.advanced-search.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {
	'use strict';

	var controllerTicketSubjectTab;

	controllerTicketSubjectTab = function ($rootScope, $scope, TOTVSEvent, helper, ticketTypeFactory, modalTicketSubjectSelection, preferenceFactory, accessRestrictionFactory, modalTicketSubjecEdit) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketSubjecTab = this;

		this.listOfTicketSubject = [];
		this.listOfTicketSubjectCount = 0;

		this.ticketType = undefined;
		this.isEnabled = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			var i;
			ticketTypeFactory.getSubjectsByTicketType(this.ticketType.num_id, function (result) {
				if (!result) { return; }

				for (i = 0; i < result.length; i++) {

					if (result[i].log_suspenso === true) {
						result[i].nom_cor = "crm-default-suspended-dark";
					} else {
						result[i].nom_cor = "crm-default-suspended-blue";
					}
				}

				CRMControlTicketSubjecTab.listOfTicketSubject = result;
				CRMControlTicketSubjecTab.listOfTicketSubjectCount = result.length;
			}, 0);

		};

		this.remove = function (ticketSubject) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text:  $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-subject', [], 'dts/crm').toLowerCase(), ticketSubject.nom_assunto_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						ticketTypeFactory.removeSubjectByTicketType(ticketSubject.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-subject', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlTicketSubjecTab.listOfTicketSubject.indexOf(ticketSubject);

							if (index !== -1) {
								CRMControlTicketSubjecTab.listOfTicketSubject.splice(index, 1);
								CRMControlTicketSubjecTab.listOfTicketSubjectCount--;
							}
						});
					}
				}
			});
		};
        
        this.openAddubject = function () {
           if (CRMControlTicketSubjecTab.isIntegratedWithGP === true) {
               CRMControlTicketSubjecTab.addEdit();
           } else {
               CRMControlTicketSubjecTab.openSelection();
           }
        };
        
        this.addEdit = function (item) {
			modalTicketSubjecEdit.open({
                idTicketType: CRMControlTicketSubjecTab.ticketType.num_id,
				model: item
			}).then(function (result) {
				//if (result !== undefined && result.num_id && result.num_id > 0) {
                CRMControlTicketSubjecTab.load();
				//}
			});
            
		};
        
		this.openSelection = function () {

			modalTicketSubjectSelection.open({
				idTicketType: CRMControlTicketSubjecTab.ticketType.num_id,
				ticketSubjects: this.listOfTicketSubject
			}).then(function (result) {

				if (!result) { return; }

				var i,
					selecti18n,
					ticketSubjects = '';

				for (i = 0; i < result.length; i++) {

					if (i === 0) {
						ticketSubjects = result[i].nom_assunto_ocor;
					} else {
						ticketSubjects = ', ' + result[i].nom_assunto_ocor;
					}

					CRMControlTicketSubjecTab.listOfTicketSubjectCount++;
					CRMControlTicketSubjecTab.listOfTicketSubject.unshift(result[i]);
				}

				if (result.length > 0) {
					selecti18n = $rootScope.i18n('nav-subject', [], 'dts/crm');
				} else {
					selecti18n = $rootScope.i18n('l-subject', [], 'dts/crm');
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-subject', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic',
											[selecti18n, ticketSubjects, CRMControlTicketSubjecTab.ticketType.nom_tip_ocor],
											'dts/crm'
										   )
				});
			});
		};        
        
		this.loadPreferences = function (callback) {
			var total = 1;

            preferenceFactory.isIntegratedWithGP(function (result) {
                total--;
                CRMControlTicketSubjecTab.isIntegratedWithGP = result;
                if (total <= 0 && callback) {
                    callback();
                }
            });

		};          

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (ticketType, isEnabled) { //ticket-type-subject.list
        
            CRMControlTicketSubjecTab.loadPreferences(function (param) {
                accessRestrictionFactory.getUserRestrictions('ticket-type-subject.tab', $rootScope.currentuser.login, function (result) {
                    CRMControlTicketSubjecTab.accessRestriction = result || {};
                });

                CRMControlTicketSubjecTab.ticketType = ticketType;
                CRMControlTicketSubjecTab.isEnabled = (isEnabled !== false);                
                
                CRMControlTicketSubjecTab.load();	                
            });            
			
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketSubjecTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadTicketType, function (event, ticketType) {
			CRMControlTicketSubjecTab.init(ticketType, true);
		});

	};
	controllerTicketSubjectTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_tip_ocor.factory', 'crm.ticket-subject.modal.selection', 'crm.crm_param.factory', 'crm.crm_acess_portal.factory', 'crm.ticket-subject.modal'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.ticket-subject.tab.control', controllerTicketSubjectTab);
});
