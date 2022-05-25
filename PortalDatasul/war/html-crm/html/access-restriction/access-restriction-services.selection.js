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

	var modalAccessRestrictionFormSelection,
		controllerAccessRestrictionFormSelection;


		// *************************************************************************************
	// *** MODAL SELECT FORM TO ACCESS RESTRICTION
	// *************************************************************************************

	modalAccessRestrictionFormSelection = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/access-restriction/access-restriction.form.select.html',
				controller: 'crm.access-restriction.selection.control as controller',
				backdrop: 'static',
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalAccessRestrictionFormSelection.$inject = ['$modal'];
	// *************************************************************************************
	// *** CONTROLLER SELECT FORM TO ACCESS RESTRICTION
	// *************************************************************************************
	controllerAccessRestrictionFormSelection = function ($rootScope, $scope, $modalInstance, $filter, parameters, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccessRestrictionFormSelection = this;

		this.idRestriction = undefined;

		this.listOfForms = [];
		this.listOfAccessRestrictionForms = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.select = function () {

			var i,
				form,
				selecteds = [];

			for (i = 0; i < this.listOfForms.length; i++) {

				form = this.listOfForms[i];

				if (form.$selected === true) {
					selecteds.push({
						num_id_acess_form_portal: form.num_id,
						log_livre_1 : form.log_livre_1
					});
				}
			}

			if (selecteds.length > 0) {

				accessRestrictionFactory.addForms(this.idRestriction, selecteds, function (result) {
					if (!result || result.length === 0) { return; }
					$modalInstance.close(result);
				});

			} else {
				this.cancel();
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.loadForms = function () {

			accessRestrictionFactory.getForms(false, function (result) {

				if (!result) { return; }

				var i,
					j,
					form,
					restrictionForm,
					alreadySelected,
					restrictionForms = CRMControlAccessRestrictionFormSelection.listOfAccessRestrictionForms;

				if (restrictionForms) {

					for (i = 0; i < result.length; i++) {

						form = result[i];

						form.$selected = false;

						alreadySelected = false;

						for (j = 0; j < restrictionForms.length; j++) {

							restrictionForm = restrictionForms[j];

							if (form.num_id === restrictionForm.num_id_acess_form_portal) {
								alreadySelected = true;
								break;
							}
						}

						if (!alreadySelected) {
							CRMControlAccessRestrictionFormSelection.listOfForms.push(form);
						}
					}

				} else {
					CRMControlAccessRestrictionFormSelection.listOfForms = result;
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.idRestriction = parameters.idRestriction ? angular.copy(parameters.idRestriction) : undefined;
		this.listOfAccessRestrictionForms = parameters.listOfAccessRestrictionForms
			? angular.copy(parameters.listOfAccessRestrictionForms) : [];

		this.loadForms();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccessRestrictionFormSelection = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerAccessRestrictionFormSelection.$inject = ['$rootScope', '$scope', '$modalInstance', '$filter', 'parameters',
		'crm.crm_acess_portal.factory'];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.access-restriction.modal.selection', modalAccessRestrictionFormSelection);
	index.register.controller('crm.access-restriction.selection.control', controllerAccessRestrictionFormSelection);
});
