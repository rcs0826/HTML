/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1030.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerOpportunityStrongWeakTab;

	controllerOpportunityStrongWeakTab = function ($rootScope, $scope, TOTVSEvent, helper, opportunityFactory, strongWeakFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityStrongWeakTab = this;

		this.accessRestriction = undefined;

		this.listOfStrongWeak = [];
		this.listOfStrongWeakCount = 0;

		this.opportunity = undefined;

		this.isEnabled = true;

		this.strongWeaks = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			opportunityFactory.getStrongWeaks(this.opportunity.num_id, function (result) {

				if (!result) { return; }

				CRMControlOpportunityStrongWeakTab.listOfStrongWeak = result;
				CRMControlOpportunityStrongWeakTab.listOfStrongWeakCount = result.length;
			});
		};

		this.openForm = function (isToOpen) {

			this.strongWeaks = [];

			strongWeakFactory.getAll(function (result) {
				CRMControlOpportunityStrongWeakTab.strongWeaks = result || [];
			});

			this.model = {};
			this.isEdit = (isToOpen === true);
		};

		this.save = function (saveNew) {

			var vo = {};

			if (this.model.ttPontoForte) {
				vo.num_id = this.model.ttPontoForte.num_id;
			} else {
				helper.showInvalidFormMessage('nav-strong-weak', 'l-strong-weak-point');
				return;
			}

			if (this.model.val_peso) {
				vo.val_peso = this.model.val_peso;
			} else {
				helper.showInvalidFormMessage('nav-strong-weak', 'l-weight');
				return;
			}

			opportunityFactory.addStrongWeak(this.opportunity.num_id, vo, function (result) {

				if (!result) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('nav-strong-weak', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n('l-strong-weak-point', [], 'dts/crm'),
						CRMControlOpportunityStrongWeakTab.model.ttPontoForte.des_pto,
						CRMControlOpportunityStrongWeakTab.opportunity.des_oportun_vda
					], 'dts/crm')
				});

				CRMControlOpportunityStrongWeakTab.listOfStrongWeak.unshift(result);
				CRMControlOpportunityStrongWeakTab.listOfStrongWeakCount++;
				CRMControlOpportunityStrongWeakTab.openForm(saveNew);
			});
		};

		this.remove = function (strongWeak) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-strong-weak-point', [], 'dts/crm').toLowerCase(),
					strongWeak.des_pto
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						opportunityFactory.deleteStrongWeak(strongWeak.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-strong-weak', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlOpportunityStrongWeakTab.listOfStrongWeak.indexOf(strongWeak);

							if (index !== -1) {
								CRMControlOpportunityStrongWeakTab.listOfStrongWeak.splice(index, 1);
								CRMControlOpportunityStrongWeakTab.listOfStrongWeakCount--;
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
			accessRestrictionFactory.getUserRestrictions('opportunity.strong.weak.tab', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunityStrongWeakTab.accessRestriction = result || {};
			});

			this.opportunity = opportunity;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunityStrongWeakTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opportunity) {
			CRMControlOpportunityStrongWeakTab.init(opportunity, opportunity.log_acesso);
		});

	}; // controllerStrongWeakTab
	controllerOpportunityStrongWeakTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_oportun_vda.factory', 'crm.crm_pto_fort_fraco_oportun.factory', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.opportunity-strong-weak.tab.control', controllerOpportunityStrongWeakTab);

});

