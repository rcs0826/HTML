/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1023.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalAccountStyleSelection,
		controllerAccountStyleSelection;

	// *************************************************************************************
	// *** MODAL SELECT STYLE TO ACCOUNT
	// *************************************************************************************

	modalAccountStyleSelection = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/account/style/style.select.html',
				controller: 'crm.account-style.selection.control as controller',
				backdrop: 'static',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalAccountStyleSelection.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER SELECT STYLE TO ACCOUNT
	// *************************************************************************************

	controllerAccountStyleSelection = function ($rootScope, $scope, $modalInstance, $filter, parameters,
									  styleFactory, accountFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlStyleSelection = this;

		this.accessRestriction = undefined;

		this.idAccount = undefined;

		this.listOfStyles = [];
		this.listOfAccountStyles = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.select = function () {

			var i,
				style,
				selecteds = [];

			for (i = 0; i < this.listOfStyles.length; i++) {

				style = this.listOfStyles[i];

				if (style.$selected === true) {
					selecteds.push({num_id_estil: style.num_id});
				}
			}

			if (selecteds.length > 0) {

				accountFactory.addStyles(this.idAccount, selecteds, function (result) {
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

		this.loadStyles = function () {

			styleFactory.getAll(true, function (result) {

				if (!result) { return; }

				if (CRMControlStyleSelection.listOfAccountStyles) {
					var i,
						j,
						style,
						accountStyle,
						alreadySelected;


					for (i = 0; i < result.length; i++) {

						style = result[i];

						style.$selected = false;

						alreadySelected = false;

						for (j = 0; j < CRMControlStyleSelection.listOfAccountStyles.length; j++) {

							accountStyle = CRMControlStyleSelection.listOfAccountStyles[j];

							if (style.num_id === accountStyle.num_id_estil) {
								alreadySelected = true;
								break;
							}
						}

						if (!alreadySelected) {
							CRMControlStyleSelection.listOfStyles.push(style);
						}
					}

				} else {
					CRMControlStyleSelection.listOfStyles = result;
				}
			});
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('account.style.select', $rootScope.currentuser.login, function (result) {
				CRMControlStyleSelection.accessRestriction = result || {};
			});

			this.loadStyles();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.idAccount = parameters.idAccount ? angular.copy(parameters.idAccount) : undefined;
		this.listOfAccountStyles = parameters.listOfAccountStyles ? angular.copy(parameters.listOfAccountStyles) : [];

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlStyleSelection = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerAccountStyleSelection.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters', 'crm.crm_estil.factory',
		'crm.crm_pessoa.conta.factory', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.account-style.modal.selection', modalAccountStyleSelection);
	index.register.controller('crm.account-style.selection.control', controllerAccountStyleSelection);
});
