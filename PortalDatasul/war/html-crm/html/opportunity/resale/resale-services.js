/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerOpportunityResaleTab;

	controllerOpportunityResaleTab = function ($rootScope, $scope, TOTVSEvent, helper, opportunityFactory, accountFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityResaleTab = this;

		this.accessRestriction = undefined;

		this.listOfResale = [];
		this.listOfResaleCount = 0;

		this.opportunity = undefined;

		this.isEnabled = true;

		this.resales = undefined;
		this.contacts = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			opportunityFactory.getResales(this.opportunity.num_id, function (result) {

				if (!result) { return; }

				CRMControlOpportunityResaleTab.listOfResale = result;
				CRMControlOpportunityResaleTab.listOfResaleCount = result.length;
			});
		};

		this.openForm = function (isToOpen) {

			this.resales = [];

			this.model = {};
			this.isEdit = (isToOpen === true);
		};

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }

			var filters = [{ property: 'nom_razao_social', value: helper.parseStrictValue(value) },
						  { property: 'log_reven', value: true }];
			accountFactory.typeahead(filters, undefined, function (result) {
				if (!result) { return; }
				CRMControlOpportunityResaleTab.resales = result;
			});
		};

		this.onChangeResale = function (revendaConta) {
			CRMControlOpportunityResaleTab.contacts = [];
			this.model.ttRevendaContato = undefined;
			if (CRMUtil.isDefined(revendaConta)) {
				this.getContacts(revendaConta.num_id);
			}
		};

		this.getContacts = function (idAccount) {

			accountFactory.getContacts(idAccount, function (result) {
				if (!result) { return; }
				CRMControlOpportunityResaleTab.contacts = result;
			});

		};

		this.save = function (saveNew) {

			var vo = {};

			if (this.model.ttRevendaConta) {
				vo.num_id_pessoa = this.model.ttRevendaConta.num_id;
			} else {
				helper.showInvalidFormMessage('nav-resale', 'l-resale');
				return;
			}

			if (this.model.ttRevendaContato) {
				vo.num_id_contat = this.model.ttRevendaContato.num_id;
			} else {
				helper.showInvalidFormMessage('nav-resale', 'l-contact');
				return;
			}

			opportunityFactory.addResale(this.opportunity.num_id, vo, function (result) {

				if (!result) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('nav-resale', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n('l-resale', [], 'dts/crm'),
						CRMControlOpportunityResaleTab.model.ttRevendaConta.nom_razao_social,
						CRMControlOpportunityResaleTab.opportunity.des_oportun_vda
					], 'dts/crm')
				});

				CRMControlOpportunityResaleTab.listOfResale.unshift(result);
				CRMControlOpportunityResaleTab.listOfResaleCount++;
				CRMControlOpportunityResaleTab.openForm(saveNew);
			});
		};

		this.remove = function (resale) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-resale', [], 'dts/crm').toLowerCase(),
					resale.nom_pessoa
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						opportunityFactory.deleteResale(resale.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-resale', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlOpportunityResaleTab.listOfResale.indexOf(resale);

							if (index !== -1) {
								CRMControlOpportunityResaleTab.listOfResale.splice(index, 1);
								CRMControlOpportunityResaleTab.listOfResaleCount--;
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
			accessRestrictionFactory.getUserRestrictions('opportunity.resale.tab', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunityResaleTab.accessRestriction = result || {};
			});

			this.opportunity = opportunity;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunityResaleTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opportunity) {
			CRMControlOpportunityResaleTab.init(opportunity, opportunity.log_acesso);
		});

	}; // controllerResaleTab

	controllerOpportunityResaleTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_oportun_vda.factory', 'crm.crm_pessoa.conta.factory', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.opportunity-resale.tab.control', controllerOpportunityResaleTab);

});

