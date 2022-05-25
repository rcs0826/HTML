/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/opportunity/competitor/competitor-services.edit.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerOpportunityCompetitorTab;

	controllerOpportunityCompetitorTab = function ($rootScope, $scope, TOTVSEvent, helper, opportunityFactory, accountFactory, modalOpportunityCompetitorEdit, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityCompetitorTab = this;

		this.accessRestriction = undefined;

		this.listOfCompetitor = [];
		this.listOfCompetitorCount = 0;

		this.opportunity = undefined;

		this.isEnabled = true;
		this.isChange = false;

		this.competitors = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			opportunityFactory.getCompetitors(this.opportunity.num_id, function (result) {

				if (!result) { return; }

				CRMControlOpportunityCompetitorTab.listOfCompetitor = result;
				CRMControlOpportunityCompetitorTab.listOfCompetitorCount = result.length;
			});
		};

		this.openForm = function (isEdit, competitor) {
			modalOpportunityCompetitorEdit.open({
				opportunity: this.opportunity,
				competitor: competitor,
				isEdit: isEdit
			}).then(function (result) {
				CRMControlOpportunityCompetitorTab.load();
			});
		};

		this.edit = function (competitor) {

			opportunityFactory.getOpportunityCompetitor(competitor.num_id, function (result) {
				if (!result) { return; }
				CRMControlOpportunityCompetitorTab.model = result[0] || [];
				CRMControlOpportunityCompetitorTab.model.ttConcorrenteConta = {num_id: result[0].num_id_pessoa, nom_razao_social: result[0].nom_pessoa};

				if (result[0].num_id_contat && result[0].num_id_contat > 0) {
					CRMControlOpportunityCompetitorTab.model.ttConcorrenteContato = {num_id: result[0].num_id_contat, nom_razao_social: result[0].nom_contat};
				}

				CRMControlOpportunityCompetitorTab.openForm(true, result[0]);

			});
		};

		this.remove = function (competitor) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-competitor', [], 'dts/crm').toLowerCase(),
					competitor.nom_pessoa
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						opportunityFactory.deleteCompetitor(competitor.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-competitor', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlOpportunityCompetitorTab.listOfCompetitor.indexOf(competitor);

							if (index !== -1) {
								CRMControlOpportunityCompetitorTab.listOfCompetitor.splice(index, 1);
								CRMControlOpportunityCompetitorTab.listOfCompetitorCount--;
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
			accessRestrictionFactory.getUserRestrictions('opportunity.competitor.tab', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunityCompetitorTab.accessRestriction = result || {};
			});

			this.opportunity = opportunity;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunityCompetitorTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opportunity) {
			CRMControlOpportunityCompetitorTab.init(opportunity, opportunity.log_acesso);
		});

	};

	controllerOpportunityCompetitorTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_oportun_vda.factory', 'crm.crm_pessoa.conta.factory', 'crm.opportunity.competitor.modal.edit', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.opportunity-competitor.tab.control', controllerOpportunityCompetitorTab);

});

