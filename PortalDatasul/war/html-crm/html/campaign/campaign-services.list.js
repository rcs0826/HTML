/*globals index, define, angular, TOTVSEvent, console */
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1001.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controller = function ($scope, $rootScope, TOTVSEvent, helper, campaignFactory,
							 modalAdvancedSearch, userPreferenceModal, modalCampaignEdit, preferenceFactory) {

		var CRMControlCampaign = this;

		this.listOfCampaign = [];
		this.listOfCampaignCount = 0;

		this.disclaimers = [];

		this.isPendingListSearch = false;
		this.isIntegratedWithGpls = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.openAdvancedSearch = function () {
			modalAdvancedSearch.open({
				disclaimers: CRMControlCampaign.disclaimers
			}).then(function (result) {

				CRMControlCampaign.quickSearchText = undefined;
				CRMControlCampaign.disclaimers = result.disclaimers;

				CRMControlCampaign.search(false);
			});
		};

		this.removeDisclaimer = function (disclaimer) {

			var i, index;

			index = CRMControlCampaign.disclaimers.indexOf(disclaimer);

			if (index !== -1) {
				CRMControlCampaign.disclaimers.splice(index, 1);
				CRMControlCampaign.search(false);
			}
		};

		this.search = function (isMore) {

			var options, filters = [];

			if (CRMControlCampaign.isPendingListSearch === true) {
				return;
			}

			CRMControlCampaign.listOfCampaignCount = 0;

			if (!isMore) {
				CRMControlCampaign.listOfCampaign = [];
			}

			options = {
				start: CRMControlCampaign.listOfCampaign.length,
				end: 50,
				orderBy: ['log_padr_gpls', 'nom_campanha'],
				asc: [false, true]
			};

			CRMControlCampaign.parseQuickFilters(filters);

			filters = filters.concat(CRMControlCampaign.disclaimers);

			CRMControlCampaign.isPendingListSearch = true;

			campaignFactory.findRecords(filters, options, function (result) {
				CRMControlCampaign.addCampaignInList(result);
				CRMControlCampaign.isPendingListSearch = false;
			});
		};

		this.updateCampaignInList = function (campaign, oldCampaign) {

			oldCampaign = oldCampaign || campaign;

			var index = this.listOfCampaign.indexOf(oldCampaign);

			this.listOfCampaign[index] = campaign;
		};

		this.addCampaignInList = function (campaigns, isNew) {

			var i, campaign;

			if (!campaigns) { return; }

			if (!angular.isArray(campaigns)) {
				campaigns = [campaigns];
				CRMControlCampaign.listOfCampaignCount += 1;
			}

			for (i = 0; i < campaigns.length; i += 1) {

				campaign = campaigns[i];

				if (campaign && campaign.$length) {
					CRMControlCampaign.listOfCampaignCount = campaign.$length;
				}

				if (isNew !== true) {
					CRMControlCampaign.listOfCampaign.push(campaign);
				} else {
					CRMControlCampaign.listOfCampaign.unshift(campaign);
				}
			}
		};

		this.exportSearch = function () {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-attention',
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				text: $rootScope.i18n('msg-export-report', [], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }
					var filters = [];
					CRMControlCampaign.parseQuickFilters(filters);
					filters = filters.concat(CRMControlCampaign.disclaimers);
					campaignFactory.exportSearch(filters, isPositiveResult);
				}
			});
		};

		this.parseQuickFilters = function (filters) {
			if (CRMControlCampaign.quickSearchText && CRMControlCampaign.quickSearchText.trim().length > 0) {
				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControlCampaign.quickSearchText)
				});
			}
		};

		this.addEdit = function (campaign) {
			modalCampaignEdit.open({
				campaign: campaign
			}).then(function (result) {
				if (result !== undefined) {
					if (campaign !== undefined) {
						CRMControlCampaign.updateCampaignInList(result, campaign);
					} else {
						CRMControlCampaign.addCampaignInList(result, true);
					}
				}
			});
		};

		this.remove = function (campaign) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-campaign', [], 'dts/crm').toLowerCase(), campaign.nom_campanha
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					campaignFactory.deleteRecord(campaign.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						var index = CRMControlCampaign.listOfCampaign.indexOf(campaign);

						if (index !== -1) {
							CRMControlCampaign.listOfCampaign.splice(index, 1);
							CRMControlCampaign.listOfCampaignCount -= 1;
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-campaign', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'campaign.list' });
		};

		this.loadPreferences = function () {
			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControlCampaign.isIntegratedWithGpls = result;
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function init() {

			var viewName = $rootScope.i18n('nav-campaign', [], 'dts/crm'),
				viewController = 'crm.campaign.list.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControlCampaign);
				CRMControlCampaign.search();
				CRMControlCampaign.loadPreferences();
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControlCampaign.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControlCampaign.init();
		});

		$scope.$on('$destroy', function () {
			CRMControlCampaign = undefined;
		});
	};

	controller.$inject = [
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_campanha.factory',
		'crm.campaign.modal.advanced.search', 'crm.user.modal.preference', 'crm.campaign.modal.edit',
		'crm.crm_param.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.campaign.list.control', controller);
});
