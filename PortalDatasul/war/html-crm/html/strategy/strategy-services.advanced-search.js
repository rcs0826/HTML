/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1076.js'
], function (index) {

	'use strict';

	var modal,
		controller;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/strategy/strategy.advanced.search.html',
				controller: 'crm.strategy.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controller = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters, helper) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.disclaimers = undefined;

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
				CRMControl.model = model;
				CRMControl.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {

			var i,
				key,
				model;

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (CRMUtil.isUndefined(model)) { continue; }

					if (key === 'num_id') {

						this.disclaimers.push({
							property: 'num_id',
							value: model,
							title: $rootScope.i18n('l-code', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'des_estrateg_vda') {

						this.disclaimers.push({
							property: 'des_estrateg_vda',
							value: helper.parseStrictValue(model),
							title: $rootScope.i18n('l-name', [], 'dts/crm') + ': ' + model,
							model: { value: model }
						});

					} else if (key === 'dat_inic' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_inic', 'l-date-start'));

					} else if (key === 'dat_fim' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_fim', 'l-date-close'));

					}
				}
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			this.parseDisclaimersToModel();
		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters', 'crm.helper'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.strategy.modal.advanced.search', modal);
	index.register.controller('crm.strategy.advanced.search.control', controller);
});
