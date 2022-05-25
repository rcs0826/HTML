/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/api/fchcrm1032.js',
	'/dts/crm/js/api/fchcrm1031.js',
	'/dts/crm/html/ticket-type/ticket-type-services.list.js',
	'/dts/crm/html/ticket-type/ticket-type-services.edit.js',
	'/dts/crm/html/ticket-type/ticket-type-services.detail.js',
	'/dts/crm/html/ticket-type/ticket-type-services.advanced-search.js'
], function (index) {
	'use strict';

	var modalTicketSubjectSelection,
		controllerTicketSubjectSelection;

	// *************************************************************************************
	// *** CONTROLLER SELECT
	// *************************************************************************************

	controllerTicketSubjectSelection = function ($rootScope, $scope, $modalInstance, $filter, parameters, ticketTypeSubjectFactory,
		ticketTypeFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketSubjectSelection = this;

		this.idTicketType   = undefined;
		this.listOfTicketSubject  = [];
		this.ticketSubjects = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.select = function () {

			var i,
				selecteds = [],
				ticketTypeSubject;

			for (i = 0; i < this.listOfTicketSubject.length; i++) {

				ticketTypeSubject = this.listOfTicketSubject[i];

				if (ticketTypeSubject.$selected === true) {
					selecteds.push({num_id_assunto_ocor: ticketTypeSubject.num_id});
				}
			}

			if (selecteds.length > 0) {
				ticketTypeFactory.addSubjectsByTicketType(this.idTicketType, selecteds, function (result) {
					if (!result) { return; }

					for (i = 0; i < result.length; i++) {

						if (result[i].log_suspenso === true) {
							result[i].nom_cor = "crm-default-suspended-dark";
						} else {
							result[i].nom_cor = "crm-default-suspended-blue";
						}
					}

					$modalInstance.close(result);
				});

			} else {
				this.cancel();
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.load = function () {
			var i,
				j;

			ticketTypeSubjectFactory.getAll(function (result) {
				if (!result) { return; }

				if (CRMControlTicketSubjectSelection.ticketSubjects) {

					for (i = 0; i < result.length; i++) {

						var vo,
							alreadySelected = false,
							ticketTypeSubject = result[i];

						ticketTypeSubject.$selected = false;

						for (j = 0; j < CRMControlTicketSubjectSelection.ticketSubjects.length; j++) {

							vo = CRMControlTicketSubjectSelection.ticketSubjects[j];

							if (ticketTypeSubject.num_id === vo.num_id_assunto_ocor) {
								alreadySelected = true;
								break;
							}
						}

						if (!alreadySelected) {
							CRMControlTicketSubjectSelection.listOfTicketSubject.push(ticketTypeSubject);
						}
					}

				} else {
					CRMControlTicketSubjectSelection.listOfTicketSubject = result;
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.idTicketType = parameters.idTicketType ? angular.copy(parameters.idTicketType) : undefined;
		this.ticketSubjects = parameters.ticketSubjects ? angular.copy(parameters.ticketSubjects) : [];

		this.load();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketSubjectSelection = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerTicketSubjectSelection.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters', 'crm.crm_assunto_ocor.factory',
		'crm.crm_tip_ocor.factory'
	];

	// *************************************************************************************
	// *** MODAL SELECT
	// *************************************************************************************

	modalTicketSubjectSelection = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-type/ticket-subject/ticket-subject.select.html',
				controller: 'crm.ticket-subject.selection.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});

			return instance.result;
		};
	};
	modalTicketSubjectSelection.$inject = ['$modal'];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.ticket-subject.modal.selection', modalTicketSubjectSelection);
	index.register.controller('crm.ticket-subject.selection.control', controllerTicketSubjectSelection);
});
