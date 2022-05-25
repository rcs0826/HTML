/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1051.js',
	'/dts/crm/js/api/fchcrm1052.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_propried.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerReportList;


	// *************************************************************************************
	// *** CONTROLLER LIST
	// *************************************************************************************

	controllerReportList = function controllerReportList($rootScope, $scope, $location, TOTVSEvent,
		reportFactory, helper, modalReportAdvancedSearch, modalReportEdit, userPreferenceModal, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlReportList = this;

		this.accessRestriction = undefined;
		this.listOfReport = [];
		this.listOfReportCount = 0;

		this.disclaimers		= [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.openAdvancedSearch = function () {
			modalReportAdvancedSearch.open({
				disclaimers: CRMControlReportList.disclaimers
			}).then(function (result) {

				CRMControlReportList.quickSearchText = undefined;
				CRMControlReportList.disclaimers = result.disclaimers;

				CRMControlReportList.search(false);
			});
		};

		this.removeDisclaimer = function (disclaimer) {

			var index = CRMControlReportList.disclaimers.indexOf(disclaimer);

			if (index !== -1) {
				CRMControlReportList.disclaimers.splice(index, 1);
				CRMControlReportList.search(false);
			}
		};

		this.search = function (isMore) {

			var options, filters = [];

			if (CRMControlReportList.isPendingListSearch === true) {
				return;
			}

			CRMControlReportList.listOfReportCount = 0;

			if (!isMore) {
				CRMControlReportList.listOfReport = [];
			}

			options = { start: CRMControlReportList.listOfReport.length, end: 50};

			if (CRMControlReportList.quickSearchText && CRMControlReportList.quickSearchText.trim().length > 0) {
				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControlReportList.quickSearchText)
				});
			}

			filters = filters.concat(CRMControlReportList.disclaimers);

			CRMControlReportList.isPendingListSearch = true;

			reportFactory.findRecords(filters, options, function (result) {
				CRMControlReportList.addReportInList(result, false);
				CRMControlReportList.isPendingListSearch = false;
			});
		};

		this.addEdit = function (report) {

			modalReportEdit.open({
				report: report
			}).then(function (result) {

				if (CRMUtil.isDefined(result)) {
					if (CRMUtil.isDefined(report)) {
						CRMControlReportList.updateReportInList(result, report);
					} else {
						CRMControlReportList.addReportInList(result, true);
						$location.path('/dts/crm/report/detail/' + result.num_id);
					}
				}
			});
		};

		this.remove = function (report) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-report', [], 'dts/crm').toLowerCase(), report.nom_relat
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					reportFactory.deleteRecord(report.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-report', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						var index = CRMControlReportList.listOfReport.indexOf(report);

						if (index > -1) {
							CRMControlReportList.listOfReport.splice(index, 1);
							CRMControlReportList.listOfReportCount--;
						}
					});
				}
			});
		};

		this.addReportInList = function (reports, isNew) {

			if (!reports) { return; }

			if (!angular.isArray(reports)) {
				reports = [reports];
				CRMControlReportList.listOfReportCount++;
			}

			var i, report;

			for (i = 0; i < reports.length; i++) {

				report = reports[i];

				if (report && report.$length) {
					CRMControlReportList.listOfReportCount = report.$length;
				}

				report.ttCRMModule = helper.parseCRMModuleByID(report.idi_modul_crm);

				if (isNew === true) {
					CRMControlReportList.listOfReport.unshift(report);
				} else {
					CRMControlReportList.listOfReport.push(report);
				}
			}
		};

		this.updateReportInList = function (report, oldReport) {

			oldReport = oldReport || report;

			report.ttCRMModule = helper.parseCRMModuleByID(report.idi_modul_crm);

			var index = CRMControlReportList.listOfReport.indexOf(oldReport);
			CRMControlReportList.listOfReport[index] = report;
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'report.list' });
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			helper.loadCRMContext(function () {

				accessRestrictionFactory.getUserRestrictions('report.list', $rootScope.currentuser.login, function (result) {
					CRMControlReportList.accessRestriction = result || {};

					var startView,
						viewName = $rootScope.i18n('nav-report', [], 'dts/crm'),
						viewController = 'crm.report.list.control';

					startView = helper.startView(viewName, viewController, CRMControlReportList);

					if (startView.isNewContext) { CRMControlReportList.search(false); }
				});

			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlReportList = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControlReportList.init();
		});
	};

	controllerReportList.$inject = [
		'$rootScope', '$scope', '$location', 'TOTVSEvent', 'crm.crm_relat_web.factory', 'crm.helper',
		'crm.report.modal.advanced.search', 'crm.report.modal.edit', 'crm.user.modal.preference',
		'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.report.list.control',            controllerReportList);
});
