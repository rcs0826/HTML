/*globals index, define, TOTVSEvent */
define([
	'index',
	'/dts/crm/js/api/fchcrm1053.js'
], function (index) {

	'use strict';

	var controllerInfoDetail;

	// *************************************************************************************
	// ***  Controller Informações CRM
	// *************************************************************************************

	controllerInfoDetail = function ($scope, $rootScope, TOTVSEvent, infoFactory, helper) {

		var CRMControlInfo = this;

		this.file = undefined;
		this.basicInfo = {};
		this.databases = [];
		this.dataservers = undefined;
		this.programPath = undefined;
		this.appServerPropath = [];

		this.options = [
			{ id: 1, label: $rootScope.i18n('l-app-server-propath', [], 'dts/crm') },
			{ id: 2, label: $rootScope.i18n('l-get', [], 'dts/crm') },
			{ id: 3, label: $rootScope.i18n('l-get-file-info', [], 'dts/crm') },
			{ id: 4, label: $rootScope.i18n('l-database', [], 'dts/crm') }
		];

		this.selectedOption = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.getExtraInfo = function () {

			CRMControlInfo.databases   = [];
			CRMControlInfo.dataservers = undefined;
			CRMControlInfo.programPath = undefined;
			CRMControlInfo.appServerPropath = [];

			switch (this.selectedOption.id) {
			case 1:
				this.getPropath();
				break;
			case 2:
				this.getProgramPath();
				break;
			case 3:
				this.getFileInfo();
				break;
			case 4:
				this.getDatabases();
				break;
			}
		};

		this.getBasicInfo = function () {
			infoFactory.getBasicInfo(function (result) {
				CRMControlInfo.basicInfo = result;
			});
		};

		this.getPropath = function () {
			infoFactory.getPropath(function (result) {
				CRMControlInfo.appServerPropath = result || [];
			});
		};

		this.getProgramPath = function () {

			if (!CRMControlInfo.searchText) { return; }

			infoFactory.getProgramPath(CRMControlInfo.searchText, function (result) {
				CRMControlInfo.programPath = result.path;
			});
		};

		this.getFileInfo = function () {

			if (!CRMControlInfo.searchText) { return; }

			infoFactory.getFileInfo(CRMControlInfo.searchText, function (result) {
				CRMControlInfo.file = result;
			});
		};

		this.getDatabases = function () {
			infoFactory.getDatabases(function (result) {
				if (result) {
					CRMControlInfo.databases   = result.ttDatabases || [];
					CRMControlInfo.dataservers = result.dataserver  || undefined;
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function init() {

			var viewName = $rootScope.i18n('nav-config-info', [], 'dts/crm'),
				viewController = 'crm.info.detail.control';

			helper.startView(viewName, viewController, CRMControlInfo);

			CRMControlInfo.getBasicInfo();
		};

		if ($rootScope.currentuserLoaded) { CRMControlInfo.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControlInfo.init();
		});

		$scope.$on('$destroy', function () {
			CRMControlInfo = undefined;
		});
	};

	controllerInfoDetail.$inject = ['$scope', '$rootScope', 'TOTVSEvent', 'crm.crm_info.factory', 'crm.helper'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.info.detail.control', controllerInfoDetail);

});
