/*global $, index, define, angular, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/html/background-routines/supplementary-account-data/supplementary-account-data-services.js',
	'/dts/crm/html/background-routines/birthday-person-crm/birthday-person-crm-services.js',
	'/dts/crm/html/background-routines/account-status/account-status-services.js',
	'/dts/crm/html/background-routines/monitor-account-movement/monitor-account-movement-services.js',
    '/dts/crm/html/background-routines/class-transition/class-transition-services.js'
], function (index) {

	'use strict';

	var controllerBackgroundRoutines;

	// *************************************************************************************
	// *** Controller Parametros Situação Financeira
	// *************************************************************************************

	controllerBackgroundRoutines = function ($scope, $filter, $rootScope, TOTVSEvent, helper) {

		var CRMBackgroundRoutines = this;

		this.model = { };

		this.load = function () {
		};

		this.init = function () {
			var viewName = $rootScope.i18n('nav-background-routines', [], 'dts/crm'),
				viewController = 'crm.background-routines.list.control';

			helper.startView(viewName, viewController, CRMBackgroundRoutines);

			helper.loadCRMContext(function () {
				CRMBackgroundRoutines.load();
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		if ($rootScope.currentuserLoaded) {	this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMBackgroundRoutines = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMBackgroundRoutines.init();
		});

	};

	controllerBackgroundRoutines.$inject = ['$scope', '$filter', '$rootScope', 'TOTVSEvent', 'crm.helper'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.background-routines.list.control', controllerBackgroundRoutines);
});
