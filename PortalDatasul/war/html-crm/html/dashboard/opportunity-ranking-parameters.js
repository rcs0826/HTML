/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1001.js'
], function (index) {

	'use strict';

	var modalParametersEdit,
		controllerOpportunityRankingModal;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modalParametersEdit = function ($modal) {
		this.open = function (params) {

			var template,
				instance;

			template = '/dts/crm/html/dashboard/opportunity-ranking-parameters.html';
			instance = $modal.open({
				templateUrl: template,
				controller: 'crm.dashboard.opportunity-ranking.controller.modal as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});

			return instance.result;
		};
	};

	modalParametersEdit.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER MODAL
	// *************************************************************************************

	controllerOpportunityRankingModal = function ($rootScope, $scope, $modalInstance, $filter, $location,
												  $totvsprofile, parameters, TOTVSEvent, helper, modalParametersEdit,
												  helperOpportunity, opportunityFactory, userFactory, campaignFactory,
												  preferenceFactory) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerConfig = this;
		this.strategies = undefined;
		this.phases = undefined;
		this.users = undefined;
		this.campaigns = undefined;
		this.config = {};
        this.isUserPortfolio = parameters.isUserPortfolio || false;
        this.tooltipMessage = $rootScope.i18n('msg-responsible-disabled', [], 'dts/crm');
        

		this.listOfTypes = [
			{id: 1, name: $rootScope.i18n('l-opportunity-value', [], 'dts/crm')}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.onChangeStrategy = function () {
			CRMControllerConfig.config.ttFaseDesenvolvimento = undefined;
			CRMControllerConfig.getPhases();
		};

		this.getStrategies = function () {

			CRMControllerConfig.strategies = [];

			opportunityFactory.getAllStrategies(function (result) {
				if (!result) { return; }
				CRMControllerConfig.strategies = result || [];
			}, true);
		};

		this.getPhases = function () {

			CRMControllerConfig.phases = [];

			if (!CRMControllerConfig.config || !CRMControllerConfig.config.ttEstrategia) { return; }

			opportunityFactory.getAllPhases(CRMControllerConfig.config.ttEstrategia.num_id, function (result) {
				if (!result) { return; }
				CRMControllerConfig.phases = result || [];
			}, true);
		};

		this.getUsers = function (value) {

			if (!value || value === '') { return []; }

			var filters = [{
				property: 'nom_usuar',
				value: helper.parseStrictValue(value)
			}, {
				property: 'custom.subordinate',
				value: true
			}];

			userFactory.typeahead(filters, undefined, function (result) {
				CRMControllerConfig.users = result || [];
			});
		};

		this.getCampaigns = function () {

			CRMControllerConfig.campaigns = [];

			campaignFactory.getAllCampaigns(true, $rootScope.currentuser.idCRM, function (result) {

				CRMControllerConfig.campaigns = result || [];

				if (!result || result.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-campaign-user', [], 'dts/crm')
					});
				}
			});
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.apply = function (doApply) {

			if (CRMControllerConfig.isInvalidForm() || !CRMControllerConfig.config) { return; }

			var closeObj = {};

			closeObj.apply = doApply;
			closeObj.customFilter = {};
			closeObj.customFilter = CRMControllerConfig.config;

			$modalInstance.close(closeObj);
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				fields = '',
				message = '',
				isPlural,
				i;

			if (!CRMControllerConfig.config.dat_cadastro || !CRMControllerConfig.config.dat_cadastro.start) {
				isInvalidForm = true;
				messages.push('l-date-create');
			}

			if (!CRMControllerConfig.config.num_max || CRMControllerConfig.config.num_max < 1) {
				isInvalidForm = true;
				messages.push('l-quantity');
			}

			if (isInvalidForm) {

				isPlural = messages.length > 1;

				message	 = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i += 1) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-opportunity-ranking', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			if (CRMControllerConfig.config.num_max && CRMControllerConfig.config.num_max > 10) {
				isInvalidForm = true;
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-opportunity-ranking', [], 'dts/crm'),
					detail: $rootScope.i18n('l-quantity-max-value', [], 'dts/crm')
				});
			}
			
			return isInvalidForm;
		};

		this.loadPreferences = function (callback) {
			preferenceFactory.isIntegratedWithGP(function (result) {
				if (result) {
					CRMControllerConfig.isIntegratedWithGP = result;
				}

				if (callback) { callback(); }
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		CRMControllerConfig.config = parameters.config;

		this.init = function () {
			var defaultRankingType = {id: 1, name: $rootScope.i18n('l-opportunity-value', [], 'dts/crm')};

			CRMControllerConfig.getStrategies();
			CRMControllerConfig.getCampaigns();

			CRMControllerConfig.loadPreferences(function () {
				if (CRMControllerConfig.isIntegratedWithGP === true) {
					CRMControllerConfig.listOfTypes.push(
						{id: 2, name: $rootScope.i18n('l-value-simulation', [], 'dts/crm')}
					);

					CRMControllerConfig.listOfTypes.push(
						{id: 3, name: $rootScope.i18n('l-number-of-lifes-accomplished', [], 'dts/crm')}
					);
				} else {
					CRMControllerConfig.config.rankingType = defaultRankingType;
				}

				if (CRMControllerConfig.config.ttEstrategia || CRMControllerConfig.config.ttFaseDesenvolvimento) {
					CRMControllerConfig.getPhases();
				}

				if (CRMUtil.isUndefined(CRMControllerConfig.config.rankingType)) {
					CRMControllerConfig.config.rankingType = defaultRankingType;
				}
			});
		};

		CRMControllerConfig.init();

	};

	controllerOpportunityRankingModal.$inject = ['$rootScope', '$scope', '$modalInstance', '$filter',
		'$location', '$totvsprofile', 'parameters', 'TOTVSEvent', 'crm.helper', 'crm.dashboard.opportunity-ranking.modal.parameter', 'crm.opportunity.helper', 'crm.crm_oportun_vda.factory', 'crm.crm_usuar.factory', 'crm.crm_campanha.factory', 'crm.crm_param.factory'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.dashboard.opportunity-ranking.modal.parameter', modalParametersEdit);
	index.register.controller('crm.dashboard.opportunity-ranking.controller.modal', controllerOpportunityRankingModal);
});
