/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {
	'use strict';

	var controllerAccountObservationTab;

	controllerAccountObservationTab = function ($rootScope, $scope, TOTVSEvent, helper, legend, accountFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountObservationTab = this;

		this.accessRestriction = undefined;

		this.listOfObservation = [];
		this.listOfObservationCount = 0;

		this.account = undefined;

		this.isEnabled = true;

		this.ttTipo = [
			{num_id: 1,   nom_tipo: legend.accountText.NAME(1)},
			{num_id: 2,   nom_tipo: legend.accountText.NAME(2)},
			{num_id: 3,   nom_tipo: legend.accountText.NAME(3)},
			{num_id: 4,   nom_tipo: legend.accountText.NAME(4)},
			{num_id: 999, nom_tipo: legend.accountText.NAME(999)}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.parseType = function (observation) {
			var i;
			for (i = 0; i < this.ttTipo.length; i++) {
				if (this.ttTipo[i].num_id === observation.idi_tip_text) {
					observation.ttTipo = this.ttTipo[i];
					break;
				}
			}
		};

		this.load = function () {

			accountFactory.getObservations(this.account.num_id, function (result) {
				var i;

				if (!result) { return; }

				CRMControlAccountObservationTab.listOfObservation = [];

				for (i = 0; i < result.length; i++) {
					CRMControlAccountObservationTab.parseType(result[i]);
					CRMControlAccountObservationTab.listOfObservation.push(result[i]);
				}

				CRMControlAccountObservationTab.listOfObservationCount = result.length;
			});
		};

		this.openForm = function (isToOpen) {
			this.isEdit = (isToOpen === true);
			CRMControlAccountObservationTab.model = {};
		};

		this.save = function () {

			var vo = {};

			if (this.model.ttTipo) {
				vo.idi_tip_text = this.model.ttTipo.num_id;
			} else {
				helper.showInvalidFormMessage('nav-observation', 'l-type');
				return;
			}

			if (this.model.text && this.model.text.trim().length > 0) {
				vo.dsl_text_livre = this.model.text;
			} else {
				helper.showInvalidFormMessage('nav-observation', 'l-text');
				return;
			}

			accountFactory.addObservation(this.account.num_id, vo, function (result) {

				if (!result) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('nav-observation', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic',
											[$rootScope.i18n('l-observation', [], 'dts/crm'),
												CRMControlAccountObservationTab.model.ttTipo.nom_tipo,
												CRMControlAccountObservationTab.account.nom_razao_social
											], 'dts/crm')
				});

				CRMControlAccountObservationTab.parseType(result);
				CRMControlAccountObservationTab.listOfObservation.unshift(result);
				CRMControlAccountObservationTab.listOfObservationCount++;
				CRMControlAccountObservationTab.openForm(false);
			});
		};

		this.remove = function (observation) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-observation', [], 'dts/crm').toLowerCase(),
					observation.ttTipo.nom_tipo
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						accountFactory.deleteObservation(observation.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-observation', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlAccountObservationTab.listOfObservation.indexOf(observation);

							if (index !== -1) {
								CRMControlAccountObservationTab.listOfObservation.splice(index, 1);
								CRMControlAccountObservationTab.listOfObservationCount--;
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
			accessRestrictionFactory.getUserRestrictions('account.observation.tab', $rootScope.currentuser.login, function (result) {
				CRMControlAccountObservationTab.accessRestriction = result || {};
			});

			this.account = account;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountObservationTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlAccountObservationTab.init(account, account.log_acesso);
		});

		$scope.$on(CRMEvent.scopeSaveAccount, function (event, account) {
			CRMControlAccountObservationTab.init(account, account.log_acesso);
		});

	}; // controllerAttachmentTab
	controllerAccountObservationTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.legend', 'crm.crm_pessoa.conta.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.account-observation.tab.control', controllerAccountObservationTab);

});
