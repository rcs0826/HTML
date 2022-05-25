/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1044.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerOpportunityContactTab;

	controllerOpportunityContactTab = function ($rootScope, $scope, TOTVSEvent, helper, opportunityFactory, contactFactory, decisionLevelFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityContactTab = this;

		this.accessRestriction = undefined;

		this.listOfContact = [];
		this.listOfContactCount = 0;

		this.opportunity = undefined;

		this.contacts = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			opportunityFactory.getContacts(this.opportunity.num_id, function (result) {

				if (!result) { return; }

				CRMControlOpportunityContactTab.listOfContact = result;
				CRMControlOpportunityContactTab.listOfContactCount = result.length;
			});
		};

		this.openForm = function (isToOpen) {

			this.contacts = [];

			this.model = {};
			this.isEdit = (isToOpen === true);
			CRMControlOpportunityContactTab.model = {};

			this.getContacts(this.opportunity.num_id_pessoa);
			this.getDecisionLevels();
		};

		this.getContacts = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
			contactFactory.typeahead(filter, undefined, function (result) {
				CRMControlOpportunityContactTab.contacts = result;
			});
		};

		this.getDecisionLevels = function () {
			decisionLevelFactory.getAll(function (result) {
				CRMControlOpportunityContactTab.decisioLevels = result || [];
			});
		};

		this.save = function () {

			var vo = {};

			if (this.model.ttContato) {
				vo.num_id_pessoa = this.model.ttContato.num_id;
			} else {
				helper.showInvalidFormMessage('nav-contact', 'l-contact');
				return;
			}

			if (this.model.ttNivelDecisao) {
				vo.num_id_niv_decis = this.model.ttNivelDecisao.num_id;
			} else {
				helper.showInvalidFormMessage('nav-contact', 'l-decision-level');
				return;
			}

			opportunityFactory.addContact(this.opportunity.num_id, vo, function (result) {

				if (!result) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('nav-contact', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n('l-contact', [], 'dts/crm'),
						CRMControlOpportunityContactTab.model.ttContato.nom_razao_social,
						CRMControlOpportunityContactTab.opportunity.des_oportun_vda
					], 'dts/crm')
				});

				CRMControlOpportunityContactTab.listOfContact.unshift(result);
				CRMControlOpportunityContactTab.listOfContactCount++;
				CRMControlOpportunityContactTab.openForm(false);
			});
		};

		this.remove = function (contact) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-contact', [], 'dts/crm').toLowerCase(),
					contact.nom_razao_social
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						opportunityFactory.deleteContact(contact.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-contact', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlOpportunityContactTab.listOfContact.indexOf(contact);

							if (index !== -1) {
								CRMControlOpportunityContactTab.listOfContact.splice(index, 1);
								CRMControlOpportunityContactTab.listOfContactCount--;
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
			accessRestrictionFactory.getUserRestrictions('opportunity.contact.tab', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunityContactTab.accessRestriction = result || {};
			});

			this.opportunity = opportunity;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunityContactTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opportunity) {
			CRMControlOpportunityContactTab.init(opportunity, opportunity.log_acesso);
		});

		$scope.$on(CRMEvent.scopeSaveOpportunityContact, function (event, opportunityId) {
			CRMControlOpportunityContactTab.load();
		});

	}; // controllerContactTab

	controllerOpportunityContactTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_oportun_vda.factory', 'crm.crm_pessoa.contato.factory', 'crm.crm_niv_decis.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.opportunity-contact.tab.control', controllerOpportunityContactTab);

});
