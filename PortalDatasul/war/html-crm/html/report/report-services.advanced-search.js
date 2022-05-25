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

	var modalReportAdvancedSearch,
		controllerReportAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalReportAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/report/report.advanced.search.html',
				controller: 'crm.report.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalReportAdvancedSearch.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerReportAdvancedSearch = function ($rootScope, $scope, $modalInstance, parameters,
											   helper, userFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlReportAdvancedSearch = this;

		this.disclaimers   = undefined;
		this.model         = undefined;

		this.modules = helper.getCRMModules();

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

		this.parseDisclaimersToModel = function (disclaimers) {

			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {
				CRMControlReportAdvancedSearch.model = model;
				CRMControlReportAdvancedSearch.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {

			var key,
				model,
				control = CRMControlReportAdvancedSearch;

			control.disclaimers = [];

			Object.keys(control.model).forEach(function (key, index) {

				var model;

				if (!control.model.hasOwnProperty(key)) { return; }

				model = control.model[key];

				if (CRMUtil.isUndefined(model)) { return; }

				if (key === 'idi_modul_crm') {

					control.disclaimers.push({
						property: 'idi_modul_crm',
						value: model.num_id,
						title: $rootScope.i18n('l-module', [], 'dts/crm') + ': ' + model.nom_modul_crm,
						model: { value: model }
					});

				} else if (key === 'nom_relat') {

					control.disclaimers.push({
						property: 'nom_relat',
						value: model,
						title: $rootScope.i18n('l-name', [], 'dts/crm') + ': ' + model
					});

				} else if (key === 'nom_arq_relat') {

					control.disclaimers.push({
						property: 'nom_arq_relat',
						value: model,
						title: $rootScope.i18n('l-file', [], 'dts/crm') + ': ' + model
					});

				} else if (key === 'log_hier_time') {

					control.disclaimers.push({
						property: 'log_hier_time',
						value: model,
						title: $rootScope.i18n('l-hierarchy', [], 'dts/crm') + ': '
								+ $rootScope.i18n((model === true ? 'l-yes' : 'l-no'), [], 'dts/crm')
					});

				} else if (key === 'num_id_usuar') {

					control.disclaimers.push({
						property: 'crm_usuar_relat_web.num_id_usuar',
						value: model.num_id,
						title: $rootScope.i18n('l-user', [], 'dts/crm') + ': ' + model.nom_usuar,
						model: {
							property: 'num_id_usuar',
							value: model
						}
					});

				}

			});
		};

		this.getUsers = function (value) {

			if (!value || value === '') { return []; }

			var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };

			userFactory.typeahead(filter, undefined, function (result) {
				CRMControlReportAdvancedSearch.users = result;
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.parseDisclaimersToModel();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlReportAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerReportAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'crm.helper', 'crm.crm_usuar.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.report.modal.advanced.search', modalReportAdvancedSearch);
	index.register.controller('crm.report.advanced.search.control', controllerReportAdvancedSearch);
});
