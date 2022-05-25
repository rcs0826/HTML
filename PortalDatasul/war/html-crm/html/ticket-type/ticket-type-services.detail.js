/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1032.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/ticket-type/ticket-subject/ticket-subject-services.selection.js',
	'/dts/crm/html/ticket-type/ticket-subject/ticket-subject-services.tab.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTicketTypeDetail;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controllerTicketTypeDetail = function ($rootScope, $scope, $stateParams, TOTVSEvent, appViewService, ticketTypeFactory, modalEdit, $location, helper, $timeout, preferenceFactory, accessRestrictionFactory) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketTypeDetail = this;

		this.model = undefined;

		this.isActiveRestrictSubject = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.loadPreferences = function (callback) {
			var total = 2;

            preferenceFactory.isIntegratedWithGP(function (result) {
                total--;
                CRMControlTicketTypeDetail.isIntegratedWithGP = result;
                if (total <= 0 && callback) {
                    callback();
                }
            });
            
			preferenceFactory.getPreferenceAsBoolean('LOG_RESTR_ASSUNTO', function (result) {
                total--;
				CRMControlTicketTypeDetail.isActiveRestrictSubject = result || false;
                if (total <= 0 && callback) {
                    callback();
                }
			});
		};

		this.load = function (id) {
			this.loadPreferences(function (isOK) {

				ticketTypeFactory.getRecord(id, function (result) {
					if (result) {
						CRMControlTicketTypeDetail.model = result;

						$timeout(function () {
							$rootScope.$broadcast(CRMEvent.scopeLoadTicketType, result);
						});
					}
				});

			});
		};

		this.onReactivate = function (ticketType, reactivate) {

			if (!ticketType || !ticketType.num_id) { return; }

			var vo = {
					num_id : ticketType.num_id,
					log_suspenso : !reactivate
				},
				persist;

			persist = function (callback) {
				ticketTypeFactory.updateRecord(vo.num_id, vo, function (result) {

					if (!result || !result.num_id) { return; }

					$rootScope.$broadcast(
						TOTVSEvent.showNotification,
						{
							type: 'success',
							title: $rootScope.i18n('l-ticket-type', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-update-generic', [$rootScope.i18n('l-ticket-type', [], 'dts/crm'), ticketType.nom_tip_ocor], 'dts/crm')
						}
					);

					result.nom_cor = (result.log_suspenso ? "crm-default-suspended-dark" : "crm-default-suspended-blue");

					CRMControlTicketTypeDetail.model = result;

					if (callback) { callback(result); }
				});
			};

			if (!reactivate) { //suspender

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-suspend',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text:  $rootScope.i18n('msg-confirm-suspend-ticket-type', [ticketType.nom_tip_ocor], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							persist();
						}
					}
				});

			} else { //reativar

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-reactivate',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text:  $rootScope.i18n('msg-confirm-reactivate-ticket-type',
											   [ticketType.nom_tip_ocor], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							persist();
						}
					}
				});
			}

		};

		this.onEdit = function () {
			modalEdit.open({
				ticketType: CRMControlTicketTypeDetail.model
			}).then(function (result) {
				if (result !== undefined) {
					CRMControlTicketTypeDetail.model = result;
				}
			});
		};

		this.onRemove = function () {

			var type = CRMControlTicketTypeDetail.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-ticket-type', [], 'dts/crm').toLowerCase(), type.nom_tip_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					ticketTypeFactory.deleteRecord(type.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-ticket-type', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/ticket-type/');
					});
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			helper.loadCRMContext(function () {

				accessRestrictionFactory.getUserRestrictions('ticket-type.detail', $rootScope.currentuser.login, function (result) {
					CRMControlTicketTypeDetail.accessRestriction = result || {};
				});

				appViewService.startView($rootScope.i18n('nav-ticket-type', [], 'dts/crm'), 'crm.ticket-type.detail.control', CRMControlTicketTypeDetail);
				CRMControlTicketTypeDetail.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControlTicketTypeDetail.load($stateParams.id);
				}

			});

		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketTypeDetail = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlTicketTypeDetail.init();
		});
	}; // controllerTicketTypeDetail
	controllerTicketTypeDetail.$inject = [
		'$rootScope', '$scope', '$stateParams', 'TOTVSEvent', 'totvs.app-main-view.Service', 'crm.crm_tip_ocor.factory',
		'crm.ticket-type.modal.edit', '$location', 'crm.helper', '$timeout', 'crm.crm_param.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.ticket-type.detail.control', controllerTicketTypeDetail);
});
