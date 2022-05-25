/*global $, index, angular, define, Boolean*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1080.js'
], function (index) {

	'use strict';

	var modalExpenseSummary,
		controllerExpenseSummary;

		// *************************************************************************************
	// *** MODAL SUMMARY
	// *************************************************************************************
	modalExpenseSummary = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/expense/expense.summary.html',
				controller: 'crm.expense.summary.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalExpenseSummary.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER MODAL SUMMARY
	// *************************************************************************************

	controllerExpenseSummary = function ($rootScope, $scope, $modalInstance, parameters) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlExpenseSummary = this;

		this.model      = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.close = function () {
			$modalInstance.dismiss('cancel');
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.model;

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlExpenseSummary = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerExpenseSummary.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.expense.modal.summary', modalExpenseSummary);
	index.register.controller('crm.expense.summary.control', controllerExpenseSummary);
});
