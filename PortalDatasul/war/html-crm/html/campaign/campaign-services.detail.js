/*globals index, define, angular, TOTVSEvent, console */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js',
	// '/dts/crm/html/campaign/price-table/price-table-services.tab.js',
	'/dts/crm/html/campaign/action/action-services.tab.js',
	'/dts/crm/html/campaign/action/group/group-services.tab.js',
	'/dts/crm/html/campaign/action/media/media-services.tab.js',
	'/dts/crm/html/campaign/action/objective/objective-services.tab.js',
	'/dts/crm/html/campaign/action/result/result-services.tab.js',
	'/dts/crm/html/campaign/action/result/action/action-services.item.content.js',
	'/dts/crm/html/campaign/action/user/user-services.tab.js',
	'/dts/crm/html/campaign/expense/expense-services.tab.js',
	'/dts/crm/html/campaign/action/expense/expense-services.tab.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	// serviceCampaignPriceTableTab
	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, modalEdit, serviceCampaignActionTab, serviceCampaignActionGroupTab,
							serviceCampaignActionMediaTab, serviceCampaignActionObjectiveTab,
							serviceCampaignActionResultTab, serviceCampaignActionUserTab,
							serviceCampaignActionResultActionItemContent, serviceCampaignExpense, serviceActionExpense, preferenceFactory) {

		var CRMControl = this;

		this.model = undefined;

		this.selectedAction = undefined;
		this.isIntegratedWithGpls = false;

		angular.extend(this, serviceCampaignActionTab);
		angular.extend(this, serviceCampaignActionGroupTab);
		angular.extend(this, serviceCampaignActionMediaTab);
		angular.extend(this, serviceCampaignActionObjectiveTab);
		angular.extend(this, serviceCampaignActionResultTab);
		angular.extend(this, serviceCampaignActionUserTab);
		// angular.extend(this, serviceCampaignPriceTableTab);
		angular.extend(this, serviceCampaignActionResultActionItemContent);
		angular.extend(this, serviceCampaignExpense);
		angular.extend(this, serviceActionExpense);

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function (id) {
			factory.getRecord(id, function (result) {
				if (result) {

					CRMControl.model = result;

					if (CRMControl.model.ttAcao && CRMControl.model.ttAcao.length > 0) {

						CRMControl.model.ttAcao.sort(function (item1, item2) {
							return item1.num_ord_acao - item2.num_ord_acao;
						});

						CRMControl.selectedAction = CRMControl.model.ttAcao[0];
						CRMControl.selectedAction.$selected = true;
					}
				}
			});
		};

		this.onEdit = function () {
			var isDefaultGPLS = CRMControl.model.log_padr_gpls;

			modalEdit.open({
				campaign: CRMControl.model
			}).then(function (result) {
				if (result) {

					CRMControl.model = result;

					if (isDefaultGPLS === false && CRMControl.model.log_padr_gpls !== isDefaultGPLS) {
						CRMControl.load(CRMControl.model.num_id);
					}

				}
			});
		};

		this.onRemove = function () {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-campaign', [], 'dts/crm').toLowerCase(), CRMControl.model.nom_campanha
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-campaign', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/campaign/');
					});
				}
			});
		};

		this.loadPreferences = function () {
			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControl.isIntegratedWithGpls = result;
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-campaign', [], 'dts/crm'),
				viewController = 'crm.campaign.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
					CRMControl.loadPreferences();
				}
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
	};

	// 'crm.campaign-price-table.tab.service'
	controller.$inject = [
		'$rootScope', '$scope', '$stateParams', '$location', 'TOTVSEvent', 'crm.helper',
		'crm.crm_campanha.factory', 'crm.campaign.modal.edit', 'crm.campaign-action.tab.service',
		'crm.campaign-action-group.tab.service', 'crm.campaign-action-media.tab.service',
		'crm.campaign-action-objective.tab.service', 'crm.campaign-action-result.tab.service',
		'crm.campaign-action-user.tab.service', 'crm.campaign-action-result-action.item-content.service', 'crm.campaign-expense.service', 'crm.action-expense.service', 'crm.crm_param.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.campaign.detail.control', controller);

});
