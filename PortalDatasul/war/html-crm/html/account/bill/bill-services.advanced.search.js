/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1089.js'
], function (index) {

	'use strict';

	var modalAccountBillAdvancedSearch, controllerAccountBillAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalAccountBillAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/account/bill/bill.advanced.search.html',
				controller: 'crm.account-bill.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalAccountBillAdvancedSearch.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerAccountBillAdvancedSearch = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters,
														   filterHelper, helper, billHelper, $filter) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlBillAdvancedSearch = this;

		this.model = undefined;

		this.disclaimers = undefined;
		this.fixedDisclaimers = undefined;

		this.statusList = [{
			property: 'log_vencid',
			value: true,
			description: $rootScope.i18n('l-sit-expired', [], 'dts/crm')
		}, {
			property: 'log_avencer',
			value: true,
			description: $rootScope.i18n('l-sit-to-win', [], 'dts/crm')
		}, {
			property: 'log_antecip',
			value: true,
			description: $rootScope.i18n('l-sit-anticipation', [], 'dts/crm')
		}];

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

		this.parseDisclaimersToModel = function (disclaimers) {
			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {
				CRMControlBillAdvancedSearch.model = model;
				CRMControlBillAdvancedSearch.disclaimers = disclaimers;
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
				item,
				dateFormat = $rootScope.i18n('l-date-format', [], 'dts/crm');

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (CRMUtil.isUndefined(model)) { continue; }

					if (key === 'tta_cod_tit_acr' && model && model.length > 0) {

						this.disclaimers.push({
							property: 'tta_cod_tit_acr',
							value: model,
							title: $rootScope.i18n('l-bill-title', [], 'dts/crm') + ': ' + model,
							model: {property: 'tta_cod_tit_acr', value: model}
						});

					} else if (key === 'dat_emis_docto' && model) {

						this.disclaimers.push({
							property: 'dat_emis_docto',
							value: model,
							title: $rootScope.i18n('l-date-emission', [], 'dts/crm') + ': ' + $filter('date')(model, dateFormat).toString(),
							model: {property: 'dat_emis_docto', value: model}
						});

					} else if (key === 'dat_vencto_tit_acr'  && model) {

						this.disclaimers.push({
							property: 'dat_vencto_tit_acr',
							value: model,
							title: $rootScope.i18n('l-date-vencto', [], 'dts/crm') + ': ' + $filter('date')(model, dateFormat).toString(),
							model: {property: 'dat_vencto_tit_acr', value: model}
						});

					}
				}
			}

		};

		// *************************************************************************************
		// *** INITIALIZE
		// *************************************************************************************

		this.init = function () {
			CRMControlBillAdvancedSearch.parseDisclaimersToModel();
		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlBillAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerAccountBillAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters',
		'crm.filter.helper', 'crm.helper', 'crm.bill.helper', '$filter'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.account-bill.modal.advanced.search', modalAccountBillAdvancedSearch);

	index.register.controller('crm.account-bill.advanced.search.control', controllerAccountBillAdvancedSearch);
});
