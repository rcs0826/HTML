/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1068.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/html/script/script-services.edit.js',
	'/dts/crm/html/script/script-services.detail.js'
], function (index) {

	'use strict';

	var modalScriptAdvancedSearch,
		controllerScriptAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalScriptAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/script/script.advanced-search.html',
				controller: 'crm.script.advanced-search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalScriptAdvancedSearch.$inject = ['$modal'];
	// *************************************************************************************
	// *** ADVANCED SERACH
	// *************************************************************************************

	controllerScriptAdvancedSearch = function ($rootScope, $scope, TOTVSEvent, helper, $modalInstance, parameters,
												scriptFactory, scriptHelper, filterHelper, userFactory, $filter) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlScriptAdvancedSearch = this;

		this.disclaimers = [];
		this.model = undefined;

		this.types = scriptHelper.types;
		this.listOfStatus = scriptHelper.status;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.getUsers = function (value) {
			if (!value || value === '') {
				return [];
			}
			var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };
			userFactory.findRecords(filter, undefined, function (result) {
				CRMControlScriptAdvancedSearch.users = result;
			});
		};

		this.apply = function (doApply) {

			var closeObj = {},
				disclaimers;

			this.parseModelToDisclaimers();

			parameters.fixedDisclaimers = parameters.fixedDisclaimers || [];

			disclaimers = parameters.fixedDisclaimers.concat(this.disclaimers);

			disclaimers = filterHelper.clearDisclaimersModel(disclaimers);

			closeObj.disclaimers = disclaimers;

			closeObj.fixedDisclaimers = parameters.fixedDisclaimers;

			$modalInstance.close(closeObj);
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.parseDisclaimersToModel = function (disclaimers) {
			var i;

			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {
				for (i = 0; i < disclaimers.length; i++) {
					if (disclaimers[i].property === "custom.status") {
						if (CRMUtil.isUndefined(model.num_livre_1)) {
							model.num_livre_1 = [];
						}
						model.num_livre_1.push(CRMControlScriptAdvancedSearch.listOfStatus[(parseInt(disclaimers[i].value, 10) - 1)]);
					}
				}

				CRMControlScriptAdvancedSearch.model = model;
				CRMControlScriptAdvancedSearch.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {

			var i,
				item,
				key,
				model,
				fixed,
				disclaimerTitle,
				dayHour = 86399000;

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (model === undefined) { continue; }

					if (key === 'idi_tip_script') {
						this.disclaimers.push({
							property: 'idi_tip_script',
							value: model.num_id,
							title: $rootScope.i18n('l-type', [], 'dts/crm') + ': ' + model.nom_tip_script,
							model: { value: model }
						});

					} else if (key === 'num_id_usuar') {
						this.disclaimers.push({
							property: 'num_id_usuar',
							value: model.num_id,
							title: $rootScope.i18n('l-user-create', [], 'dts/crm') + ': ' + model.nom_usuar,
							model: { value: model }
						});

					} else if ((key === 'val_valid') && (CRMUtil.isDefined(model.start))) {
						model.end += dayHour;

						disclaimerTitle = $rootScope.i18n('l-expiration-date', [], 'dts/crm') + ': ' + $filter('date')(model.start, $rootScope.i18n('l-date-format', [], 'dts/crm')).toString();

						if (CRMUtil.isDefined(model.end)) {
							disclaimerTitle = disclaimerTitle + " " + $rootScope.i18n("l-to", [], "dts/crm") + " " + $filter('date')(model.end, $rootScope.i18n('l-date-format', [], 'dts/crm')).toString();
						}

						this.disclaimers.push({
							property: 'custom.val_valid',
							value: model.start + (CRMUtil.isDefined(model.end) ? ";" + model.end : ''),
							title: disclaimerTitle,
							model: {
								property: 'val_valid',
								value: model
							}
						});

					} else if ((key === 'val_dat_cadastro') && (CRMUtil.isDefined(model.start))) {
						model.end += dayHour;

						disclaimerTitle = $rootScope.i18n('l-expiration-date', [], 'dts/crm') + ': ' + $filter('date')(model.start, $rootScope.i18n('l-date-format', [], 'dts/crm')).toString();

						if (CRMUtil.isDefined(model.end)) {
							disclaimerTitle = disclaimerTitle + " " + $rootScope.i18n("l-to", [], "dts/crm") + " " + $filter('date')(model.end, $rootScope.i18n('l-date-format', [], 'dts/crm')).toString();
						}

						this.disclaimers.push({
							property: 'custom.val_dat_cadastro',
							value: model.start + (CRMUtil.isDefined(model.end) ? ";" + model.end : ''),
							title: disclaimerTitle,
							model: {
								property: 'val_dat_cadastro',
								value: model
							}
						});
					} else if (key === 'num_livre_1') {
						if (angular.isArray(model)) {
							for (i = 0; i < model.length; i++) {
								item = model[i];

								this.disclaimers.push({
									property: 'custom.status',
									value: item.num_id,
									title: $rootScope.i18n('l-status', [], 'dts/crm') + ': ' + item.nom_status
								});
							}
						}
					}
				}
			}
		};
		// *************************************************************************************
		// *** INITIALIZE
		// *************************************************************************************
		this.parseDisclaimersToModel();
	};

	controllerScriptAdvancedSearch.$inject = ['$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', '$modalInstance', 'parameters', 'crm.crm_script.factory', 'crm.script.helper',
											 'crm.filter.helper', 'crm.crm_usuar.factory', '$filter'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.script.modal.advanced.search', modalScriptAdvancedSearch);
	index.register.controller('crm.script.advanced-search.control', controllerScriptAdvancedSearch);
});
