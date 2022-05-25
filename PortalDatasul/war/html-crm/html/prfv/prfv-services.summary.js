/*global $, index, angular, define, TOTVSEvent, CRMUtil, CRMEvent*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1048.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalPrfvSummary,
		controllerPrfvSummary;

	// *************************************************************************************
	// *** MODAL SUMMARY
	// *************************************************************************************

	modalPrfvSummary = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/prfv/prfv.summary.html',
				controller: 'crm.prfv.summary.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalPrfvSummary.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER MODAL SUMMARY
	// *************************************************************************************

	controllerPrfvSummary = function ($rootScope, $scope, $modalInstance, $filter, parameters,
									  prfvFactory, legend, prfvHelper, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlPrfvSummary = this;

		this.model = undefined;
		this.listOfPrfv = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			prfvFactory.getSummary(CRMControlPrfvSummary.accountId, function (result) {

				if (result) {
					prfvHelper.parseCalculationFrequency(result[0]);
					CRMControlPrfvSummary.model = result[0];
					CRMControlPrfvSummary.listOfPrfv = result;
				}
			});
		};

		this.close = function () {
			$modalInstance.dismiss('cancel');
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('prfv.summary', $rootScope.currentuser.login, function (result) {
				CRMControlPrfvSummary.accessRestriction = result || {};
			});

			this.load();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.accountId = parameters.model;

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlPrfvSummary = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerPrfvSummary.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters',
		'crm.crm_prfv_faixa.factory', 'crm.legend', 'crm.prfv.helper', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.prfv.modal.summary', modalPrfvSummary);
	index.register.controller('crm.prfv.summary.control', controllerPrfvSummary);
});
