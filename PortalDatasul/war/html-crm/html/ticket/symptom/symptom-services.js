/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1022.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';
	var controllerTicketSymptomTab,
		modalTicketSymptomSelection,
		controllerTicketSymptomSelection;


	controllerTicketSymptomTab = function ($rootScope, $scope, helper, TOTVSEvent, ticketFactory,
									   modalTicketSymptomSelection, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketSymptomTab = this;

		this.listOfSymptom = [];
		this.listOfSymptomCount = 0;

		this.ticket = undefined;

		this.isEnabled = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.openSelection = function () {
			modalTicketSymptomSelection.open({
				idTicket: this.ticket.num_id,
				listOfTicketSymptoms: this.listOfSymptom
			}).then(function (result) {

				if (!result) { return; }

				var i,
					symptoms = '';

				for (i = 0; i < result.length; i++) {

					if (i === 0) {
						symptoms = result[i].nom_sintom_ocor;
					} else {
						symptoms += ', ' + result[i].nom_sintom_ocor;
					}

					CRMControlTicketSymptomTab.listOfSymptomCount++;
					CRMControlTicketSymptomTab.listOfSymptom.unshift(result[i]);
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-symptom', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n((result.length > 1 ? 'nav-symptom' : 'l-symptom'), [], 'dts/crm'),
						symptoms,
						CRMControlTicketSymptomTab.ticket.nom_ocor
					], 'dts/crm')
				});
			});
		};

		this.load = function () {

			ticketFactory.getSymptoms(this.ticket.num_id, function (result) {

				if (!result) { return; }

				CRMControlTicketSymptomTab.listOfSymptom = result;
				CRMControlTicketSymptomTab.listOfSymptomCount = result.length;
			});
		};

		this.remove = function (symptom) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-symptom', [], 'dts/crm').toLowerCase(),
					symptom.nom_sintom_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						ticketFactory.removeSymptom(symptom.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-symptom', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlTicketSymptomTab.listOfSymptom.indexOf(symptom);

							if (index !== -1) {
								CRMControlTicketSymptomTab.listOfSymptom.splice(index, 1);
								CRMControlTicketSymptomTab.listOfSymptomCount--;
							}
						});
					}
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (ticket, isEnabled) {
			accessRestrictionFactory.getUserRestrictions('ticket.symptom.tab', $rootScope.currentuser.login, function (result) {
				CRMControlTicketSymptomTab.accessRestriction = result || {};
			});

			this.ticket = ticket;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketSymptomTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadTicket, function (event, ticket) {
			CRMControlTicketSymptomTab.init(ticket, ticket.log_acesso);
		});

	}; // controllerAttachmentTab
	controllerTicketSymptomTab.$inject = [
		'$rootScope', '$scope', 'crm.helper', 'TOTVSEvent', 'crm.crm_ocor.factory',
		'crm.ticket-symptom.modal.selection', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** MODAL SELECT STYLE TO ACCOUNT
	// *************************************************************************************
	modalTicketSymptomSelection = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket/symptom/symptom.select.html',
				controller: 'crm.ticket-symptom.selection.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalTicketSymptomSelection.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER SELECT STYLE TO ACCOUNT
	// *************************************************************************************
	controllerTicketSymptomSelection = function ($rootScope, $scope, $modalInstance, $filter, parameters,
									  symptomFactory, ticketFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlSymptomSelection = this;

		this.idTicket = undefined;

		this.listOfSymptoms = [];
		this.listOfTicketSymptoms = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.select = function () {

			var i,
				symptom,
				selecteds = [];

			for (i = 0; i < this.listOfSymptoms.length; i++) {

				symptom = this.listOfSymptoms[i];

				if (symptom.$selected === true) {
					selecteds.push({num_id_sintom: symptom.num_id});
				}
			}

			if (selecteds.length > 0) {

				ticketFactory.addSymptoms(this.idTicket, selecteds, function (result) {
					if (!result) { return; }
					$modalInstance.close(result);
				});

			} else {
				this.cancel();
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.loadSymptoms = function () {

			var i, j,
				symptom,
				alreadySelected;

			symptomFactory.getAll(function (result) {

				if (!result) { return; }

				if (CRMControlSymptomSelection.listOfTicketSymptoms) {

					for (i = 0; i < result.length; i++) {

						symptom = result[i];

						symptom.$selected = false;

						alreadySelected = false;

						for (j = 0; j < CRMControlSymptomSelection.listOfTicketSymptoms.length; j++) {

							var ticketSymptom = CRMControlSymptomSelection.listOfTicketSymptoms[j];

							if (symptom.num_id === ticketSymptom.num_id_sintom) {
								alreadySelected = true;
								break;
							}
						}

						if (!alreadySelected) {
							CRMControlSymptomSelection.listOfSymptoms.push(symptom);
						}
					}

				} else {
					CRMControlSymptomSelection.listOfSymptoms = result;
				}
			}, true);
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('ticket.symptom.select', $rootScope.currentuser.login, function (result) {
				CRMControlSymptomSelection.accessRestriction = result || {};
			});

			this.loadSymptoms();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.idTicket = parameters.idTicket ? angular.copy(parameters.idTicket) : undefined;
		this.listOfTicketSymptoms = parameters.listOfTicketSymptoms ? angular.copy(parameters.listOfTicketSymptoms) : [];

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlSymptomSelection = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerTicketSymptomSelection.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters', 'crm.crm_sintom.factory',
		'crm.crm_ocor.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.ticket-symptom.modal.selection', modalTicketSymptomSelection);

	index.register.controller('crm.ticket-symptom.tab.control', controllerTicketSymptomTab);
	index.register.controller('crm.ticket-symptom.selection.control', controllerTicketSymptomSelection);

});
