/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_grp_usuar.js',
	'/dts/crm/html/user/user-services.js'
], function (index) {

	'use strict';

	var modalAccessRestrictionAdvancedSearch,
		controllerAccessRestrictionAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalAccessRestrictionAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/access-restriction/access-restriction.advanced.search.html',
				controller: 'crm.access-restriction.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalAccessRestrictionAdvancedSearch.$inject = ['$modal'];
	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerAccessRestrictionAdvancedSearch = function ($rootScope, $scope, $modalInstance, parameters, helper, userFactory,
		accessRestrictionFactory, userGroupFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccessRestrictionAdvancedSearch = this;

		this.disclaimers = undefined;
		this.model = undefined;

		this.forms  = [];
		this.users  = [];
		this.groups = [];

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

		this.parseDisclaimersToModel = function () {
			helper.parseDisclaimersToModel(parameters.disclaimers, function (model, disclaimers) {
				CRMControlAccessRestrictionAdvancedSearch.model = model;
				CRMControlAccessRestrictionAdvancedSearch.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {

			var key,
				model;

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (key === 'num_id_usuar') {

						this.disclaimers.push({
							property: 'custom.num_id_usuar',
							value: model.num_id,
							title: $rootScope.i18n('l-user', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: {
								property: 'num_id_usuar',
								value: model
							}
						});

					} else if (key === 'num_id_grp_usuar') {

						this.disclaimers.push({
							property: 'custom.num_id_grp_usuar',
							value: model.num_id,
							title: $rootScope.i18n('l-group', [], 'dts/crm') + ': ' + model.nom_grp_usuar,
							model: {
								property: 'num_id_grp_usuar',
								value: model
							}
						});

					} else if (key === 'num_id_acess_form_portal') {

						this.disclaimers.push({
							property: 'custom.num_id_acess_form_portal',
							value: model.num_id,
							title: $rootScope.i18n('l-form', [], 'dts/crm') + ': ' + model.nom_form,
							model: {
								property: 'num_id_acess_form_portal',
								value: model
							}
						});

					}
				}
			}
		};

		this.getUsers = function (value) {

			if (this.model.num_id_grp_usuar && this.model.num_id_grp_usuar.num_id > 0) {

				if (value && value.length > 0) { return CRMControlAccessRestrictionAdvancedSearch.users; }

				userGroupFactory.getAllUsers(this.model.num_id_grp_usuar.num_id, function (result) {
					CRMControlAccessRestrictionAdvancedSearch.users = result;
				});

			} else {

				if (!value || value === '') { return []; }

				var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };

				userFactory.typeahead(filter, undefined, function (result) {
					CRMControlAccessRestrictionAdvancedSearch.users = result;
				});
			}
		};

		this.getForms = function () {
			accessRestrictionFactory.getForms(false, function (result) {
				CRMControlAccessRestrictionAdvancedSearch.forms = result;
			});
		};

		this.getGroups = function () {
			userGroupFactory.getAllGroups(function (result) {
				CRMControlAccessRestrictionAdvancedSearch.groups = result;
			});
		};

		this.onChangeGroup = function () {
			this.users = undefined;
			this.getUsers();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.getForms();
		this.getGroups();

		this.parseDisclaimersToModel();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccessRestrictionAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerAccessRestrictionAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'crm.helper',
		'crm.crm_usuar.factory', 'crm.crm_acess_portal.factory', 'crm.crm_grp_usuar.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.access-restriction.modal.advanced.search', modalAccessRestrictionAdvancedSearch);
	index.register.controller('crm.access-restriction.advanced.search.control', controllerAccessRestrictionAdvancedSearch);

});
