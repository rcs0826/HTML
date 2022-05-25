/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1024.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/account/account-services.summary.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';
	var controllerAccountPhoneTab;


	controllerAccountPhoneTab = function ($rootScope, $scope, TOTVSEvent, helper, helperAccount,
									   accountFactory, phoneTypeFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountPhoneTab = this;

		this.accessRestriction = undefined;

		this.listOfPhone = undefined;
		this.listOfPhoneCount = 0;

		this.types = undefined;

		this.account = undefined;

		this.isEnabled = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {

			if (!this.types) {
				phoneTypeFactory.getAll(true, function (result) {
					CRMControlAccountPhoneTab.types = result || [];
				});
			}

			if (this.account.ttTelefone) {
				this.listOfPhone = helperAccount.configurePhoneList(angular.copy(this.account.ttTelefone));
				this.listOfPhoneCount = this.listOfPhone.length;
			} else {
				this.listOfPhone = [];
				this.listOfPhoneCount = 0;
			}
		};

		this.openForm = function (isToOpen) {
			this.isEdit = (isToOpen === true);
			this.model = {};
		};

		this.addEdit = function (phone) {
			var i,
				type;

			if (!phone.ttTipo) {
				for (i = 0; i < this.types.length; i++) {
					type = this.types[i];
					if (type.num_id === phone.num_tip_telef) {
						phone.ttTipo = type;
						break;
					}
				}
			}

			this.openForm(true);
			this.model = angular.copy(phone);
			this.model.$listindex = this.listOfPhone.indexOf(phone);
		};

		this.save = function () {

			var i,
				vo,
				isUpdate = this.model && this.model.num_id > 0,
				isDuplicate,
				postPersist;

			vo = isUpdate ? this.model : {};

			if (this.model.ttTipo) {
				vo.num_tip_telef = this.model.ttTipo.num_id;
			} else {
				helper.showInvalidFormMessage('l-phones', 'l-type');
				return;
			}

			if (this.model.nom_telefone && this.model.nom_telefone.trim().length > 0) {
				vo.nom_telefone = this.model.nom_telefone;
			} else {
				helper.showInvalidFormMessage('l-phones', 'l-phone');
				return;
			}

			isDuplicate = false;

			for (i = 0; i < this.listOfPhone.length; i++) {
				if (this.listOfPhone[i].nom_telefone === this.model.nom_telefone
						&& this.listOfPhone[i].num_tip_telef === this.model.ttTipo.num_id) {
					isDuplicate = true;
					break;
				}
			}

			if (isDuplicate === true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-phones', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-duplicate-phone', [
						this.model.nom_telefone + ' (' + this.model.ttTipo.nom_tip_telef + ')'
					], 'dts/crm')
				});
				return;
			}

			postPersist = function (result) {

				if (!result) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-phones', [], 'dts/crm'),
					detail: $rootScope.i18n(isUpdate ? 'msg-update-related-generic' : 'msg-save-related-generic', [
						$rootScope.i18n('l-phone', [], 'dts/crm'),
						result.nom_tip_telef + ' (' + result.nom_telefone + ')',
						CRMControlAccountPhoneTab.account.nom_razao_social
					], 'dts/crm')
				});

				helperAccount.parsePhoneIcon(result);

				if (isUpdate) {
					CRMControlAccountPhoneTab.listOfPhone[CRMControlAccountPhoneTab.model.$listindex] = result;
				} else {
					CRMControlAccountPhoneTab.listOfPhone.unshift(result);
					CRMControlAccountPhoneTab.listOfPhoneCount++;
				}

				CRMControlAccountPhoneTab.openForm(false);
			};

			if (isUpdate) {
				accountFactory.updatePhone(this.model.num_id, this.account.num_id, vo, postPersist);
			} else {
				accountFactory.addPhone(this.account.num_id, vo, postPersist);
			}
		};

		this.remove = function (phone) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-phone', [], 'dts/crm').toLowerCase(),
					phone.nom_telefone + ' (' + phone.nom_tip_telef + ')'
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						accountFactory.deletePhone(phone.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-phone', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlAccountPhoneTab.listOfPhone.indexOf(phone);

							if (index !== -1) {
								CRMControlAccountPhoneTab.listOfPhone.splice(index, 1);
								CRMControlAccountPhoneTab.listOfPhoneCount--;
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
			accessRestrictionFactory.getUserRestrictions('account.phone.tab', $rootScope.currentuser.login, function (result) {
				CRMControlAccountPhoneTab.accessRestriction = result || {};
			});

			this.account = account;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountPhoneTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlAccountPhoneTab.init(account, account.log_acesso);
		});

		$scope.$on(CRMEvent.scopeSaveAccount, function (event, account) {
			CRMControlAccountPhoneTab.init(account, account.log_acesso);
		});

	}; // controllerAccountPhoneTab
	controllerAccountPhoneTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.account.helper', 'crm.crm_pessoa.conta.factory',
		'crm.crm_tip_telef.factory', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.account-phone.tab.control', controllerAccountPhoneTab);

});
