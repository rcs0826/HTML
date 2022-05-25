/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1004.js'
], function (index) {

	'use strict';

	var controllerAccessMobileDetail;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controllerAccessMobileDetail = function ($rootScope, $scope, $stateParams, helper, appViewService, TOTVSEvent, preferenceFactory, $window) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccessMobileDetail = this;

		this.env = {};
		this.qrcode = '';

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			helper.loadCRMContext(function () {
				appViewService.startView($rootScope.i18n('nav-access-mobile', [], 'dts/crm'), 'crm.access-mobile.detail.control', CRMControlAccessMobileDetail);
				preferenceFactory.getPreference('MOBILE_ALIAS', function (alias) {
					CRMControlAccessMobileDetail.env = {
						username: $rootScope.currentuser.login,
						alias: alias.dsl_param_crm
					};

				});
			});
		};

		this.openHelp = function () {
			$window.open('http://tdn.totvs.com.br/display/LDT/Acesso+ao+Meu+CRM+-+html-crm.access-mobile');
		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$watch('controller.env', function (value, oldValue) {
			CRMControlAccessMobileDetail.qrcode = JSON.stringify(CRMControlAccessMobileDetail.env);
		}, true);

		$scope.$on('$destroy', function () {
			CRMControlAccessMobileDetail = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlAccessMobileDetail.init();
		});
	}; // controllerAccessMobileDetail

	controllerAccessMobileDetail.$inject = [
		'$rootScope',
		'$scope',
		'$stateParams',
		'crm.helper',
		'totvs.app-main-view.Service',
		'TOTVSEvent',
		'crm.crm_param.factory',
		'$window'
	];
	// ***************************************************
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.access-mobile.detail.control', controllerAccessMobileDetail);
});
