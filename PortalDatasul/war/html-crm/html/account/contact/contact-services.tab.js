/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerAccountContactTab;

	controllerAccountContactTab = function ($rootScope, $scope, TOTVSEvent, helper, accountFactory,
										 modalContactEdit, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountContactTab = this;

		this.accessRestriction = undefined;
		this.accessRestrictionContactEdit = undefined;

		this.listOfContact = [];
		this.listOfContactCount = 0;

		this.account = undefined;

		this.isEnabled = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			accountFactory.getContacts(this.account.num_id, function (result) {

				if (!result) { return; }

				CRMControlAccountContactTab.listOfContact = result;
				CRMControlAccountContactTab.listOfContactCount = result.length;
			});
		};

		this.addEdit = function (contact) {

			modalContactEdit.open({
				account		: contact,
				related		: this.account,
				isToLoad	: CRMUtil.isDefined(contact)
			}).then(function (result) {
				if (result) {
					CRMControlAccountContactTab.parseVinc(result);

					if (CRMUtil.isDefined(contact)) {
						var index = CRMControlAccountContactTab.listOfContact.indexOf(contact);
						CRMControlAccountContactTab.listOfContact[index] = result;
					} else {
						CRMControlAccountContactTab.listOfContactCount++;
						CRMControlAccountContactTab.listOfContact.push(result);
					}
				}
			});
		};

		this.parseVinc = function (contact) {

			var prop;

			if (contact && contact.ttVinculo) { delete contact.ttVinculo.num_id; }

			for (prop in contact.ttVinculo) {
				if (contact.ttVinculo.hasOwnProperty(prop)) {
					contact[prop] = contact.ttVinculo[prop];
				}
			}
		};

		this.remove = function (contact) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-contact', [], 'dts/crm').toLowerCase(),
					contact.nom_razao_social
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {

						accountFactory.deleteContact(CRMControlAccountContactTab.account.num_id, contact.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-contact', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlAccountContactTab.listOfContact.indexOf(contact);

							if (index !== -1) {
								CRMControlAccountContactTab.listOfContact.splice(index, 1);
								CRMControlAccountContactTab.listOfContactCount--;
							}
						});

					}
				}
			});
		};

		this.setAsDefaultContact = function (contact, isDefault) {
			if (!CRMControlAccountContactTab.account || !CRMControlAccountContactTab.account.num_id) {
				return;
			}

			var i, msg, title, afterSave, contactId = 0, accountId = CRMControlAccountContactTab.account.num_id;

			if (isDefault === true) {
				contactId = contact.num_id;
			}

			afterSave = function () {
				for (i = 0; i < CRMControlAccountContactTab.listOfContact.length; i++) {
					CRMControlAccountContactTab.listOfContact[i].log_default = false;

					if (CRMControlAccountContactTab.listOfContact[i].num_id === contact.num_id) {
						contact.log_default = isDefault;
					}
				}

				msg = $rootScope.i18n('msg-record-success-generic', [$rootScope.i18n('l-focal-contact', [], 'dts/crm')], 'dts/crm');
				title = $rootScope.i18n('l-contact', [], 'dts/crm');

				$rootScope.$broadcast(TOTVSEvent.showNotification, {type : 'success', title : title, detail : msg });
			};

			accountFactory.setDefaultContact(accountId, contactId, function (result) {
				if (!result || !result.l_ok) {
					return;
				}

				afterSave();
			});

		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (account, isEnabled) {
			accessRestrictionFactory.getUserRestrictions('account.contact.tab', $rootScope.currentuser.login, function (result) {
				CRMControlAccountContactTab.accessRestriction = result || {};
			});

			accessRestrictionFactory.getUserRestrictions('account.contact.edit', $rootScope.currentuser.login, function (result) {
				CRMControlAccountContactTab.accessRestrictionContactEdit = result || {};
			});

			this.account = account;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountContactTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlAccountContactTab.init(account, account.log_acesso);
		});

	}; // controllerAttachmentTab
	controllerAccountContactTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_pessoa.conta.factory', 'crm.account-contact.modal.edit', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.account-contact.tab.control', controllerAccountContactTab);
});
