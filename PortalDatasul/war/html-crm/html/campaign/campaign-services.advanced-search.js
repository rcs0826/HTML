/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1069.js'
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
				templateUrl: '/dts/crm/html/campaign/campaign.advanced.search.html',
				controller: 'crm.campaign.advanced.search.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters,
							campaignFactory, campaignTypeFactory, helper) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlCampaignAdvancedSearch = this;

		this.model = undefined;
		this.disclaimers = undefined;

		this.types = undefined;

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
				CRMControlCampaignAdvancedSearch.model = model;
				CRMControlCampaignAdvancedSearch.disclaimers = disclaimers;
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

					} else if (key === 'num_id_tip_campanha') {

						this.disclaimers.push({
							property: 'num_id_tip_campanha',
							value: model.num_id,
							title: $rootScope.i18n('l-type-campaign', [], 'dts/crm') + ': ' + model.nom_tip_campanha,
							model: { value: model }
						});

					} else if (key === 'dat_inic' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_inic', 'l-date-start'));

					} else if (key === 'dat_term' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_term', 'l-date-close'));

					}
				}
			}
		};

		this.getCampaignsTypes = function () {
			campaignTypeFactory.getAll(function (result) {
				CRMControlCampaignAdvancedSearch.types = result || [];
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			this.getCampaignsTypes();
			this.parseDisclaimersToModel();
		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlCampaignAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters',
		'crm.crm_campanha.factory', 'crm.crm_tip_campanha.factory', 'crm.helper'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.campaign.modal.advanced.search', modal);
	index.register.controller('crm.campaign.advanced.search.control', controller);
});
