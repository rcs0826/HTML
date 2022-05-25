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

	var modalTicketTypeAdvancedSearch,
		controllerTicketTypeAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalTicketTypeAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-type/ticket-type.advanced.search.html',
				controller: 'crm.ticket-type.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalTicketTypeAdvancedSearch.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerTicketTypeAdvancedSearch = function ($rootScope, $scope, $modalInstance, parameters, helper, ticketTypeFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketTypeAdvancedSearch = this;

		this.disclaimers = undefined;
		this.model = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.apply = function () {
			this.parseModelToDisclaimers();

			$modalInstance.close({
				disclaimers: this.disclaimers
			});
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.parseValue = function (value) {
			if (!value) { return undefined; }

			var count = value.length - 1;

			if (value.indexOf("*") === 0 && value.lastIndexOf("*") === count) {
				return value.substr(1, (count - 1));
			} else {
				return value;
			}
		};

		this.parseDisclaimersToModel = function () {
			helper.parseDisclaimersToModel(parameters.disclaimers, function (model, disclaimers) {
				if (model.nom_tip_ocor) {
					model.nom_tip_ocor = CRMControlTicketTypeAdvancedSearch.parseValue(model.nom_tip_ocor);
				}

				CRMControlTicketTypeAdvancedSearch.model = model;
				CRMControlTicketTypeAdvancedSearch.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {
			this.disclaimers = [];
			var key,
				model;

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (model === undefined) {

						break;

					} else if (key === 'nom_tip_ocor') {

						this.disclaimers.push({
							property: 'nom_tip_ocor',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-description') + ': ' + model
						});

					} else if (key === 'log_suspenso') {

						this.disclaimers.push({
							property: 'log_suspenso',
							value: model,
							title: $rootScope.i18n('l-suspended') + ': ' + model
						});

					} else if (key === 'log_reg_acao') {

						this.disclaimers.push({
							property: 'log_reg_acao',
							value: model,
							title: $rootScope.i18n('l-register-action') + ': ' + model
						});

					}
				}
			}
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('ticket-type.advanced.search', $rootScope.currentuser.login, function (result) {
				CRMControlTicketTypeAdvancedSearch.accessRestriction = result || {};
			});

			this.parseDisclaimersToModel();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketTypeAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerTicketTypeAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'crm.helper', 'crm.crm_tip_ocor.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.ticket-type.modal.advanced.search', modalTicketTypeAdvancedSearch);
	index.register.controller('crm.ticket-type.advanced.search.control', controllerTicketTypeAdvancedSearch);
});
