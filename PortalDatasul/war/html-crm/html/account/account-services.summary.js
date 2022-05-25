/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1008.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1010.js',
	'/dts/crm/js/api/fchcrm1011.js',
	'/dts/crm/js/api/fchcrm1012.js',
	'/dts/crm/js/api/fchcrm1013.js',
	'/dts/crm/js/api/fchcrm1014.js',
	'/dts/crm/js/api/fchcrm1015.js',
	'/dts/crm/js/api/fchcrm1016.js',
	'/dts/crm/js/api/fchcrm1017.js',
	'/dts/crm/js/api/fchcrm1018.js',
	'/dts/crm/js/api/fchcrm1023.js',
	'/dts/crm/js/api/fchcrm1024.js',
	'/dts/crm/js/api/fchcrm1025.js',
	'/dts/crm/js/api/fchcrm1026.js',
	'/dts/crm/js/api/fchcrm1027.js',
	'/dts/crm/js/api/fchcrm1037.js',
	'/dts/crm/js/api/fchcrm1038.js',
	'/dts/crm/js/api/fchcrm1039.js',
	'/dts/crm/js/api/fchcrm1040.js',
	'/dts/crm/js/api/fchcrm1041.js',
	'/dts/crm/js/api/fchcrm1042.js',
	'/dts/crm/js/api/fchcrm1043.js',
	'/dts/crm/js/api/fchcrm1044.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1049.js',
	'/dts/crm/js/api/fchcrm1059.js',
	'/dts/crm/js/api/fchcrm1063.js',
	'/dts/crm/js/api/fchcrm1064.js',
	'/dts/crm/js/api/fchcrm1065.js',
	'/dts/crm/js/api/fchcrm1066.js',
	'/dts/crm/js/api/fchcrm1067.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_repres.js',
	'/dts/crm/js/zoom/crm_regiao.js',
	'/dts/crm/js/zoom/crm_erp_portad.js',
	'/dts/crm/js/zoom/crm_transpdor.js',
	'/dts/crm/js/zoom/crm_erp_cond_pagto.js',
	'/dts/crm/js/zoom/crm_erp_natur_operac.js',
	'/dts/crm/html/prfv/prfv-services.list.js',
	'/dts/crm/html/prfv/prfv-services.summary.js',
	'/dts/crm/html/prfv/prfv-services.advanced-search.js',
	'/dts/crm/html/task/task-services.advanced-search.js',
	'/dts/crm/html/task/task-services.calendar.js',
	'/dts/crm/html/task/task-services.detail.js',
	'/dts/crm/html/task/task-services.edit.js',
	'/dts/crm/html/task/task-services.list.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/html/ticket/ticket-services.list.js',
	'/dts/crm/html/ticket/ticket-services.detail.js',
	'/dts/crm/html/ticket/ticket-services.edit.js',
	'/dts/crm/html/ticket/ticket-services.advanced-search.js',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js',
	'/dts/crm/html/opportunity/opportunity-services.list.js',
	'/dts/crm/html/opportunity/opportunity-services.edit.js',
	'/dts/crm/html/opportunity/opportunity-services.detail.js',
	'/dts/crm/html/opportunity/opportunity-services.advanced-search.js',
	'/dts/crm/html/account/phone/phone-services.js',
	'/dts/crm/html/account/style/style-services.tab.js',
	'/dts/crm/html/account/style/style-services.selection.js',
	'/dts/crm/html/account/address/address-services.js',
	'/dts/crm/html/account/contact/contact-services.tab.js',
	'/dts/crm/html/account/contact/contact-services.edit.js',
	'/dts/crm/html/account/potential/potential-services.js',
	'/dts/crm/html/account/observation/observation-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/html/account/document/document-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalAccountSummary,
		controllerAccountSummary;

	// *************************************************************************************
	// *** MODAL SUMMARY
	// *************************************************************************************
	modalAccountSummary = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/account/account.summary.html',
				controller: 'crm.account.summary.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalAccountSummary.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER MODAL SUMMARY
	// *************************************************************************************
	controllerAccountSummary = function ($rootScope, $scope, $modalInstance, $filter, parameters,
									  accountFactory, contactFactory, accountHelper, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountSummary = this;

		this.accessRestriction = undefined;

		this.model = undefined;
		this.isAccount = undefined;
		this.idAccount = undefined;

		this.isContactChange = undefined;
		this.canChangeContact = undefined;

		this.contacts = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.close = function () {
			$modalInstance.dismiss('cancel');
		};

		this.load = function () {

			if (this.model.log_resumo_carregado !== true) {

				var service = this.isAccount ? accountFactory : contactFactory;

				service.getSummary(this.model.num_id, function (result) {

					if (result) {

						if (result.ttTelefone) {
							result.ttTelefone = accountHelper.configurePhoneList(result.ttTelefone);
						}

						angular.extend(CRMControlAccountSummary.model, result);
					}

					CRMControlAccountSummary.model.log_resumo_carregado = true;
				}, true);

				if (this.isAccount !== true) {
					contactFactory.getBond(this.idAccount, this.model.num_id, function (result) {
						if (result) {
							CRMControlAccountSummary.model.ttBond = result.ttBond;
						}
					});
				}
			}
		};

		this.validateParameters = function () {

			this.isContactChange = false;

			if (parameters.isAccount) {
				this.isAccount = (parameters.isAccount === true);
			} else {
				this.isAccount = false;
			}

			if (parameters.idAccount) {
				this.idAccount = parameters.idAccount;
			} else {
				this.idAccount = this.model.num_id;
			}

			if (parameters.isAccount) {
				this.isAccount = (parameters.isAccount === true);
			} else {
				this.isAccount = false;
			}

			if (parameters.canChangeContact) {
				this.canChangeContact = (parameters.canChangeContact === true);
			} else {
				this.canChangeContact = false;
			}
		};

		this.openChangeContact = function () {

			this.newContact = this.model;

			this.isContactChange = !this.isContactChange;

			if (!this.contacts) {
				accountFactory.getContacts(this.idAccount, function (result) {
					CRMControlAccountSummary.contacts = result || [];
				});
			}
		};

		this.applyChangeContact = function () {
			if (this.newContact) {
				if (this.newContact.num_id !== this.model.num_id) {
					$modalInstance.close({contact: this.newContact});
				} else {
					$modalInstance.close({contact: this.model});
				}
			} else {
				$modalInstance.close({});
			}
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('account.summary', $rootScope.currentuser.login, function (result) {
				CRMControlAccountSummary.accessRestriction = result || {};
			});

			this.validateParameters();
			this.load();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.model;

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountSummary = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerAccountSummary.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters',
		'crm.crm_pessoa.conta.factory', 'crm.crm_pessoa.contato.factory', 'crm.account.helper', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.account.modal.summary', modalAccountSummary);
	index.register.controller('crm.account.summary.control', controllerAccountSummary);
});
