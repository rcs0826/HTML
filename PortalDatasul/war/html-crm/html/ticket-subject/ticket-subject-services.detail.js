/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
    '/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1031.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTicketSubjectDetail;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controllerTicketSubjectDetail = function ($rootScope, $scope, $stateParams, TOTVSEvent, appViewService, ticketSubjectFactory, modalEdit, $location, helper, $timeout, preferenceFactory, legend, accessRestrictionFactory) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketSubjectDetail = this;

		this.model = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.loadPreferences = function () {
            preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControlTicketSubjectDetail.isIntegratedWithGP = result;
			});
		};

		this.load = function (id) {
			this.loadPreferences();

			ticketSubjectFactory.getRecord(id, function (result) {
				if (result) {
					CRMControlTicketSubjectDetail.model = result;

					$timeout(function () {
						$rootScope.$broadcast(CRMEvent.scopeLoadSubject, result);
					});
				}
			});
		};

		this.onReactivate = function (subject, reactivate) {

			if (!subject || !subject.num_id) { return; }

			var vo = {
					num_id : subject.num_id,
					nom_assunto_ocor : subject.nom_assunto_ocor,
					idi_tip_assunto_ocor : subject.idi_tip_assunto_ocor,
					log_suspenso : !reactivate
				},
				persist;

			persist = function (callback) {
				ticketSubjectFactory.updateRecord(vo.num_id, vo, function (result) {

					if (!result || !result.num_id) { return; }

					$rootScope.$broadcast(
						TOTVSEvent.showNotification,
						{
							type: 'success',
							title: $rootScope.i18n('l-subject', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-update-generic', [$rootScope.i18n('l-subject'), subject.nom_assunto_ocor], 'dts/crm')
						}
					);

					CRMControlTicketSubjectDetail.model.nom_cor = (result.log_suspenso ? "crm-default-suspended-dark" : "crm-default-suspended-blue");

					CRMControlTicketSubjectDetail.model.log_suspenso = result.log_suspenso;


					if (callback) { callback(result); }
				});
			};

			if (!reactivate) { //suspender

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-suspend',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text:  $rootScope.i18n('msg-confirm-suspend-subject', [subject.nom_assunto_ocor], 'dts/crm'),
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
					text:  $rootScope.i18n('msg-confirm-reactivate-subject', [subject.nom_assunto_ocor], 'dts/crm'),
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
				subject: CRMControlTicketSubjectDetail.model
			}).then(function (result) {
				if (result !== undefined) {
					CRMControlTicketSubjectDetail.model = result;
				}
			});
		};

		this.onRemove = function () {

			var vo = CRMControlTicketSubjectDetail.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-subject', [], 'dts/crm').toLowerCase(), vo.nom_assunto_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					ticketSubjectFactory.deleteRecord(vo.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-subject', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/ticket-subject/');
					});
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('ticket-subject.detail', $rootScope.currentuser.login, function (result) {
				CRMControlTicketSubjectDetail.accessRestriction = result || {};
			});

			helper.loadCRMContext(function () {
				appViewService.startView($rootScope.i18n('nav-ticket-subject', [], 'dts/crm'), 'crm.ticket-subject.detail.control', CRMControlTicketSubjectDetail);
				CRMControlTicketSubjectDetail.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControlTicketSubjectDetail.load($stateParams.id);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketSubjectDetail = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlTicketSubjectDetail.init();
		});
	}; // controllerTicketSubjectDetail

	controllerTicketSubjectDetail.$inject = [
		'$rootScope', '$scope', '$stateParams', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.crm_assunto_ocor.factory', 'crm.ticket-subject.modal.edit', '$location', 'crm.helper',
		'$timeout', 'crm.crm_param.factory', 'crm.legend', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.ticket-subject.detail.control', controllerTicketSubjectDetail);
});
