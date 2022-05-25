/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1025.js',
	'/dts/crm/js/api/fchcrm1026.js',
	'/dts/crm/js/api/fchcrm1027.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerAccountPotentialTab;

	controllerAccountPotentialTab = function ($rootScope, $scope, TOTVSEvent, helper, accountFactory,
										   potentialFactory, potentialGroupFactory,
										   potentialSubroupFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountPotentialTab = this;

		this.accessRestriction = undefined;

		this.listOfPotential = [];
		this.listOfPotentialCount = 0;

		this.account = undefined;

		this.isEnabled = true;

		this.groups     = undefined;
		this.subgroups  = undefined;
		this.potentials = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			accountFactory.getPotentials(this.account.num_id, function (result) {

				if (!result) { return; }

				CRMControlAccountPotentialTab.listOfPotential = result;
				CRMControlAccountPotentialTab.listOfPotentialCount = result.length;
			});
		};

		this.reloadPotentials = function () {

			this.potentials = [];

			if (!this.model || !this.model.ttGrupo || !this.model.ttSubgrupo) { return; }

			potentialFactory.getAll(true, this.model.ttGrupo.num_id, this.model.ttSubgrupo.num_id, function (result) {

				CRMControlAccountPotentialTab.potentials = result || [];

				if (CRMControlAccountPotentialTab.potentials.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'info',
						title: $rootScope.i18n('nav-potential', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-potential', [], 'dts/crm')
					});
				}
			});
		};

		this.openForm = function (isToOpen) {

			this.potentials = [];

			potentialGroupFactory.getAll(true, function (result) {
				CRMControlAccountPotentialTab.groups = result || [];
			});

			potentialSubroupFactory.getAll(true, function (result) {
				CRMControlAccountPotentialTab.subgroups = result || [];
			});

			this.model = {};
			this.isEdit = (isToOpen === true);
		};

		this.save = function () {

			var vo = {};

			if (this.model.ttPotencialidade) {
				vo.num_id_potencd = this.model.ttPotencialidade.num_id;
			} else {
				helper.showInvalidFormMessage('nav-potential', 'l-potential');
				return;
			}

			if (this.model.qti_potencd) {
				vo.qti_potencd = this.model.qti_potencd;
			} else {
				helper.showInvalidFormMessage('nav-potential', 'l-quantity');
				return;
			}

			accountFactory.addPotential(this.account.num_id, vo, function (result) {

				if (!result) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('nav-potential', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n('l-potential', [], 'dts/crm'),
						CRMControlAccountPotentialTab.model.nom_potencd,
						CRMControlAccountPotentialTab.account.nom_razao_social
					], 'dts/crm')
				});

				CRMControlAccountPotentialTab.listOfPotential.unshift(result);
				CRMControlAccountPotentialTab.listOfPotentialCount++;
				CRMControlAccountPotentialTab.openForm(false);
			});
		};

		this.remove = function (potential) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-potential', [], 'dts/crm').toLowerCase(),
					potential.nom_potencd
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						accountFactory.deletePotential(potential.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-potential', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlAccountPotentialTab.listOfPotential.indexOf(potential);

							if (index !== -1) {
								CRMControlAccountPotentialTab.listOfPotential.splice(index, 1);
								CRMControlAccountPotentialTab.listOfPotentialCount--;
							}
						});

					}
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (account, isEnabled) {
			accessRestrictionFactory.getUserRestrictions('account.potential.tab', $rootScope.currentuser.login, function (result) {
				CRMControlAccountPotentialTab.accessRestriction = result || {};
			});

			this.account = account;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountPotentialTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlAccountPotentialTab.init(account, account.log_acesso);
		});

	}; // controllerAttachmentTab
	controllerAccountPotentialTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_pessoa.conta.factory', 'crm.crm_potencd.factory',
		'crm.crm_grp_potenc.factory', 'crm.crm_subgrp_potencd.factory', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.account-potential.tab.control', controllerAccountPotentialTab);

});
