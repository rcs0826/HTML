/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/


define([
	'index',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1029.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerOpportunityGainLossTab;


	controllerOpportunityGainLossTab = function ($rootScope, $scope, TOTVSEvent, helper, opportunityFactory, gainLossFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityGainLossTab = this;

		this.accessRestriction = undefined;

		this.listOfGainLoss = [];
		this.listOfGainLossCount = 0;

		this.opportunity = undefined;

		this.isEnabled = true;

		this.gainLosses = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			opportunityFactory.getGainLosses(this.opportunity.num_id, function (result) {

				if (!result) { return; }

				CRMControlOpportunityGainLossTab.listOfGainLoss = result;
				CRMControlOpportunityGainLossTab.listOfGainLossCount = result.length;
			});
		};

		this.openForm = function (isToOpen) {

			this.gainLosses = [];

			gainLossFactory.getAll(function (result) {
				CRMControlOpportunityGainLossTab.gainLosses = result || [];
			});

			this.model = {};
			this.isEdit = (isToOpen === true);
		};

		this.save = function (saveNew) {

			var vo = {};

			if (this.model.ttMotivoGanhoPerda) {
				vo.num_id = this.model.ttMotivoGanhoPerda.num_id;
			} else {
				helper.showInvalidFormMessage('nav-gain-loss', 'l-gain-loss-reason');
				return;
			}

			opportunityFactory.addGainLoss(this.opportunity.num_id, vo, function (result) {

				if (!result) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('nav-gain-loss', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n('l-gain-loss-reason', [], 'dts/crm'),
						CRMControlOpportunityGainLossTab.model.ttMotivoGanhoPerda.des_motivo,
						CRMControlOpportunityGainLossTab.opportunity.des_oportun_vda
					], 'dts/crm')
				});

				CRMControlOpportunityGainLossTab.listOfGainLoss.unshift(result);
				CRMControlOpportunityGainLossTab.listOfGainLossCount++;
				CRMControlOpportunityGainLossTab.openForm(saveNew);
			});
		};

		this.remove = function (gainLoss) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-gain-loss-reason', [], 'dts/crm').toLowerCase(),
					gainLoss.des_motivo
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						opportunityFactory.deleteGainLoss(gainLoss.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-gain-loss', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlOpportunityGainLossTab.listOfGainLoss.indexOf(gainLoss);

							if (index !== -1) {
								CRMControlOpportunityGainLossTab.listOfGainLoss.splice(index, 1);
								CRMControlOpportunityGainLossTab.listOfGainLossCount--;
							}
						});

					}
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (opportunity, isEnabled) {
			accessRestrictionFactory.getUserRestrictions('opportunity.gain.loss.tab', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunityGainLossTab.accessRestriction = result || {};
			});

			this.opportunity = opportunity;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunityGainLossTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opportunity) {
			CRMControlOpportunityGainLossTab.init(opportunity, opportunity.log_acesso);
		});

		$scope.$on(CRMEvent.scopeSaveOpportunityGainLoss, function (event) {
			CRMControlOpportunityGainLossTab.load();
		});

	}; // controllerGainLossTab

	controllerOpportunityGainLossTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_oportun_vda.factory', 'crm.crm_oportun_ganho_perda.factory', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.opportunity-gain-loss.tab.control', controllerOpportunityGainLossTab);

});

