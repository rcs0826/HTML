/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1051.js',
	'/dts/crm/js/api/fchcrm1052.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_propried.js',
	'/dts/crm/html/user/user-services.js'
], function (index) {

	'use strict';

	var modalReportAvailable,
		controllerReportAvailable;

	// *************************************************************************************
	// *** MODAL REPORT AVAILABLE
	// *************************************************************************************

	modalReportAvailable = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/report/report.available.html',
				controller: 'crm.report.available.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalReportAvailable.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER REPORT PARAMETER
	// *************************************************************************************

	controllerReportAvailable = function ($rootScope, $scope, TOTVSEvent, appViewService, helper,
		reportFactory, reportHelper) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var parameters = $scope.parameters || {},
			$modalInstance = $scope.$modalInstance || undefined,
			CRMControlReportAvailable = this;

		this.listOfModuleReport = helper.getCRMModules();
		this.listOfModuleReportCount = 0;

		this.filterModule = '';
		this.filterReport = '';

		this.isPortal = typeof (APP_BASE_URL) !== "undefined" ? (APP_BASE_URL.indexOf('/portal/') >= 0) : false;

		this.databaseType = undefined;
		this.databaseDateFormat = undefined;

		this.isModal = $scope.isModal === true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {

			var i, j, k, l, report, module, idFilterModule, options = [];

			if (parameters && parameters.num_id > 0) {
				idFilterModule = parameters.num_id;
			}

			reportFactory.getAvailableReports(idFilterModule, function (result) {

				for (i = 0; i < result.length; i++) {

					report = result[i];

					if (CRMUtil.isDefined(report.ttParametro)) {
						for (k = 0; k < report.ttParametro.length; k++) {
							if (report.ttParametro[k].idi_tip_campo === 6) {
								options = [];
								if (CRMUtil.isDefined(report.ttParametro[k].ttParametroAtributo)) {
									for (l = 0; l < report.ttParametro[k].ttParametroAtributo.length; l++) {
										options.push({value: report.ttParametro[k].ttParametroAtributo[l].cod_atrib,
												  label: report.ttParametro[k].ttParametroAtributo[l].nom_atrib});
									}
								}
								report.ttParametro[k].options = options;
							}
						}
					}

					for (j = 0; j < CRMControlReportAvailable.listOfModuleReport.length; j++) {

						module = CRMControlReportAvailable.listOfModuleReport[j];

						module.ttRelatorio = module.ttRelatorio || [];

						if (module.num_id === report.idi_modul_crm) {

							if (module.num_id === idFilterModule) {
								module.isOpen = true;
							} else {
								module.isOpen = false;
							}

							module.ttRelatorio.push(report);
							CRMControlReportAvailable.listOfModuleReportCount += 1;

							break;
						}

						if (j === CRMControlReportAvailable.listOfModuleReport.length) {
							// O último módulo deve ser o de número 7 - Geral.
							// Caso não encontre o módulo informado, considera como sendo geral.
							module.ttRelatorio.push(report);
						}
					}

				}
			});
		};

		this.loadPreferences = function () {

			if (this.isPortal !== true) {

				reportFactory.getBirtExternalURL(function (result) {
					if (!result) { return; }
					CRMControlReportAvailable.customBirtURL = result.dsl_param_crm;
				});

				reportFactory.getBirtURLPath(function (result) {
					if (!result) { return; }
					CRMControlReportAvailable.birtPath = result.dsl_param_crm;
				});

				reportFactory.getBirtDatabaseType(function (result) {
					if (!result) { return; }
					CRMControlReportAvailable.databaseType = result.dsl_param_crm;
				});

				reportFactory.getBirtDatabaseDateFromat(function (result) {
					if (!result) { return; }
					CRMControlReportAvailable.databaseDateFormat = result.dsl_param_crm;
				});
			}
		};

		this.getZoomData = function (value, parameter) {

			if (!value || value === '') { return []; }

			return reportFactory.findZoomData(parameter.num_id, value);
		};

		this.isInvalidForm = function (report) {

			var i,
				parameter,
				messages = [],
				isInvalidForm = false;

			if (report.hasOwnProperty("ttParametro")) {

				for (i = 0; i < report.ttParametro.length; i++) {

					parameter = report.ttParametro[i];

					if (parameter.log_livre_1 === true && CRMUtil.isUndefined(parameter.value)) {
						isInvalidForm = true;
						messages.push(parameter.nom_apel_campo);
					}
				}
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-report', messages);
			}

			return isInvalidForm;
		};

		this.execute = function (report) {


			if (!this.customBirtURL || this.customBirtURL === "") {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-report', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-birt-external-url-param', [], 'dts/crm')
				});

			} else {

				if (this.isInvalidForm(report)) { return; }

				var url, basePath;

				
                basePath = this.birtPath;

                if (basePath.indexOf(basePath.length) !== '/') {
                    basePath = basePath + '/';
                }

                /*if (this.birtPath === undefined || this.birtPath.length === 0) {
                    basePath = "report/crm/";
                }*/

                url = '/birt/frameset?__report=' + basePath + report.nom_arq_relat;

                if (report.log_hier_time === true) {
                    url += '&time=1&usuario=' + $rootScope.currentuser.idCRM;
                }

                if (CRMUtil.isDefined(this.databaseType)) {
                    url += '&banco=' + this.databaseType;
                }

                if (CRMUtil.isDefined(this.databaseDateFormat)) {
                    url += '&data=' + this.databaseDateFormat;
                }


                if (this.customBirtURL) {
                    url = this.customBirtURL + url;
                }

				if (report.hasOwnProperty("ttParametro")) {
					Object.keys(report.ttParametro).forEach(function (key, index) {

						var parameter;

						if (!report.ttParametro.hasOwnProperty(key)) { return; }

						parameter = report.ttParametro[key];

						if (CRMUtil.isUndefined(parameter) || CRMUtil.isUndefined(parameter.value)) {
							return;
						}

						url += '&' + parameter.nom_param + '=';

						if (angular.isObject(parameter.value)) {
							url += parameter.value.num_id;
						} else {
							url += parameter.value;
						}
					});
				}

				window.open(url, '_blank');
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			if (CRMControlReportAvailable.isModal !== true) {

				var startView,
					viewName = $rootScope.i18n('nav-report-available', [], 'dts/crm'),
					viewController = 'crm.report.available.control';

				startView = helper.startView(viewName, viewController, CRMControlReportAvailable);

				this.listOfModuleReport = helper.getCRMModules();
				this.listOfModuleReportCount = 0;
			}

			helper.loadCRMContext();

			this.load();
			this.loadPreferences();
		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlReportAvailable = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerReportAvailable.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'totvs.app-main-view.Service', 'crm.helper',
		'crm.crm_relat_web.factory', 'crm.report.helper'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.report.modal.available', modalReportAvailable);
	index.register.controller('crm.report.available.control', controllerReportAvailable);
});
