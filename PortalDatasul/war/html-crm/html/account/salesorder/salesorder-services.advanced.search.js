/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1086.js',
	'/dts/crm/js/api/fchcrm1087.js',
	'/dts/crm/js/zoom/crm_repres.js',
	'/dts/crm/js/zoom/usuar_mestre.js',
	'/dts/crm/js/zoom/crm_estab.js'
], function (index) {

	'use strict';

	var modalAccountSalesOrderAdvancedSearch,
		controllerAccountSalesOrderAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalAccountSalesOrderAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/account/salesorder/salesorder.advanced.search.html',
				controller: 'crm.account-salesorder.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalAccountSalesOrderAdvancedSearch.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerAccountSalesOrderAdvancedSearch = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters,
														   filterHelper, helper, representativeFactory, establishmentFactory,
														   masterUserFactory, salesOrderHelper) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlSalesOrderAdvancedSearch = this;

		this.model = undefined;

		this.disclaimers = undefined;
		this.fixedDisclaimers = undefined;

		this.representatives = [];
		this.establishments = [];
		this.masterUsers = [];

		this.representative = parameters.representative || false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.apply = function () {
			var closeObj = {},
				processName = '',
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

		this.validateAsterisk = function (value) {
			var count;

			if (!value) {
				return undefined;
			}

			count = value.length - 1;

			if (value.indexOf("*") === 0 && value.lastIndexOf("*") === count) {
				return value.substr(1, (count - 1));
			} else {
				return value;
			}
		};

		this.parseDisclaimersToModel = function (disclaimers) {

			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {
				CRMControlSalesOrderAdvancedSearch.model = model;
				CRMControlSalesOrderAdvancedSearch.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				model,
				fixed,
				propertyName = '',
				propertyValue,
				param1,
				item;

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (CRMUtil.isUndefined(model)) { continue; }

					if (key === 'nr_ped_cli' && model && model.length > 0) {

						this.disclaimers.push({
							property: 'nr_ped_cli',
							value: model,
							title: $rootScope.i18n('l-order-client', [], 'dts/crm') + ': ' + model,
							model: {property: 'nr_ped_cli', value: model}
						});

					} else if (key === 'nr_pedido' && model && model.length > 0) {

						this.disclaimers.push({
							property: 'nr_pedido',
							value: model,
							title: $rootScope.i18n('l-order-number', [], 'dts/crm') + ': ' + model,
							model: {property: 'nr_pedido', value: model}
						});

					} else if (key === 'cod_estab_erp') {

						this.disclaimers.push({
							property: 'cod_estab_erp',
							value: model.cod_estab_erp,
							title: $rootScope.i18n('l-establishment', [], 'dts/crm') + ': ' + model.nom_estab,
							model: {property: 'cod_estab_erp', value: model}
						});

					} else if (key === 'num_id_repres' && !CRMControlSalesOrderAdvancedSearch.representative) {

						this.disclaimers.push({
							property: 'num_id_repres',
							value: model.num_id,
							title: $rootScope.i18n('l-principal-representative', [], 'dts/crm') + ': ' + model.nom_abrev_repres_erp,
							model: {property: 'num_id_repres', value: model}
						});

					} else if (key === 'cod_usuar_impl') {

						this.disclaimers.push({
							property: 'cod_usuar_impl',
							value: model.cod_usuario,
							title: $rootScope.i18n('l-user-deployment', [], 'dts/crm') + ': ' + model.nom_usuario,
							model: {property: 'cod_usuar_impl', value: model}
						});

					} else if (key === 'idi_status') {

						this.disclaimers.push({
							property: 'custom.status',
							value: model.num_id,
							title: $rootScope.i18n('l-status', [], 'dts/crm') + ': ' + model.nom_status,
							model: {property: 'idi_status', value: model}
						});

					} else if (key === 'dt_emissao' && model.start) {

						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dt_emissao', 'l-date-emission'));

					} else if (key === 'log_portal' && model) {

						this.disclaimers.push({
							property: 'log_portal',
							value: model,
							title: $rootScope.i18n('l-only-portal', [], 'dts/crm'),
							model: {property: 'log_portal', value: model}
						});

					}
				}
			}

		};

		this.getRepresentatives = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_abrev_repres_erp', value: helper.parseStrictValue(value)};

			representativeFactory.typeahead(filter, undefined, function (result) {
				CRMControlSalesOrderAdvancedSearch.representatives = result;
			});

		};

		this.getEstablishments = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'type_ahead', value: helper.parseStrictValue(value) };

			establishmentFactory.typeahead(filter, undefined, function (result) {
				CRMControlSalesOrderAdvancedSearch.establishments = result;
			});

		};

		this.getMasterUsers = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_usuario', value: helper.parseStrictValue(value) };

			masterUserFactory.typeahead(filter, undefined, function (result) {
				CRMControlSalesOrderAdvancedSearch.masterUsers = result;
			});

		};

		this.cleanFilters = function () {
			CRMControlSalesOrderAdvancedSearch.model = {};
		};

		// *************************************************************************************
		// *** INITIALIZE
		// *************************************************************************************

		this.init = function () {
			CRMControlSalesOrderAdvancedSearch.parseDisclaimersToModel();
		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlSalesOrderAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerAccountSalesOrderAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters',
		'crm.filter.helper', 'crm.helper', 'crm.crm_repres.factory',
		'crm.crm_estab.factory', 'crm.usuar_mestre.factory', 'crm.salesorder.helper'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.account-salesorder.modal.advanced.search', modalAccountSalesOrderAdvancedSearch);

	index.register.controller('crm.account-salesorder.advanced.search.control', controllerAccountSalesOrderAdvancedSearch);
});
