/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1023.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'

], function (index) {

	'use strict';

	var controllerAccountStyleTab;


	controllerAccountStyleTab = function ($rootScope, $scope, TOTVSEvent, helper, accountFactory,
									   modalAccountStyleSelection, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountStyleTab = this;

		this.accessRestriction = undefined;

		this.listOfStyle = [];
		this.listOfStyleCount = 0;

		this.account = undefined;

		this.isEnabled = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.openSelection = function () {
			modalAccountStyleSelection.open({
				idAccount: this.account.num_id,
				listOfAccountStyles: this.listOfStyle
			}).then(function (result) {

				if (!result) { return; }

				var i,
					styles = '';

				for (i = 0; i < result.length; i++) {

					if (i === 0) {
						styles = result[i].nom_estilo;
					} else {
						styles += ', ' + result[i].nom_estilo;
					}

					CRMControlAccountStyleTab.listOfStyleCount++;
					CRMControlAccountStyleTab.listOfStyle.unshift(result[i]);
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-style', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n((result.length > 0 ? 'nav-style' : 'l-style'), [], 'dts/crm'),
						styles,
						CRMControlAccountStyleTab.account.nom_razao_social
					], 'dts/crm')
				});
			});
		};

		this.load = function () {

			accountFactory.getStyles(this.account.num_id, function (result) {

				if (!result) { return; }

				CRMControlAccountStyleTab.listOfStyle = result;
				CRMControlAccountStyleTab.listOfStyleCount = result.length;
			});
		};

		this.remove = function (style) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-style', [], 'dts/crm').toLowerCase(),
					style.nom_estilo
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						accountFactory.deleteStyle(style.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-style', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlAccountStyleTab.listOfStyle.indexOf(style);

							if (index !== -1) {
								CRMControlAccountStyleTab.listOfStyle.splice(index, 1);
								CRMControlAccountStyleTab.listOfStyleCount--;
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
			accessRestrictionFactory.getUserRestrictions('account.style.tab', $rootScope.currentuser.login, function (result) {
				CRMControlAccountStyleTab.accessRestriction = result || {};
			});

			this.account = account;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountStyleTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlAccountStyleTab.init(account, account.log_acesso);
		});

	}; // controllerAttachmentTab
	controllerAccountStyleTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_pessoa.conta.factory',
		'crm.account-style.modal.selection', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.account-style.tab.control', controllerAccountStyleTab);

});
