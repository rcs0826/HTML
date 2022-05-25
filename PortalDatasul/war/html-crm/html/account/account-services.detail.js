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
	'/dts/crm/js/api/fchcrm1096.js',
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
	'/dts/crm/html/script/anwser/anwser-services.list.js',
	'/dts/crm/html/attribute/attribute-services.tab.js',
	'/dts/crm/html/account/salesorder/salesorder-services.tab.js',
	'/dts/crm/html/account/bill/bill-services.tab.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerAccountDetail;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************
	controllerAccountDetail = function ($rootScope, $scope, $stateParams, $filter, TOTVSEvent, appViewService,
									 accountHelper, accountFactory, $timeout, modalAccountEdit,
									 modalContactEdit, helper, prfvSummaryModal, userSummaryModal,
									 preferenceFactory, modalEmailEdit, taskPreferenceFinancialFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountDetail = this;

		this.accessRestriction = undefined;

		this.model = undefined;

		this.isIntegratedWithEMS = undefined;
		this.isIntegratedWithERP = undefined;
		this.isIntegratedWithGP  = undefined;
		this.showSalesOrder      = false;
		this.financialStatusLastExecution = undefined;

		this.isSourceMpd = false;

		this.group = {attribute : {open : true}}; // carrega o painel de campos personalizado aberto.
	
		$rootScope.accountDetailModeLoading = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.getBoolean = function (value){
		   switch(value){
				case true:
				case "true":
				case 1:
				case "1":
				case "yes":
					return true;
				default:
					return false;
			}
		}

		this.load = function (id) {
			var integratedWith = CRMControlAccountDetail.isIntegratedWithGP === true ? 'GP' : 'ERP';

			accountFactory.getRecord(id, function (result) {

				if (result) {
				    CRMControlAccountDetail.showSalesOrder = ((CRMControlAccountDetail.isIntegratedWithGP === false) && (result.nom_abrev && result.nom_abrev.length > 0) && (result.cod_pessoa_erp && result.cod_pessoa_erp.length > 0)) ? true : false;

					accountHelper.parseSex(result);
					accountHelper.parsePersonType(result);
					accountHelper.parseAccountType(result);
					accountHelper.parsePreviousAccountType(result);
					accountHelper.parseAccessLevel(result);
					accountHelper.parseAccountColor(result);
					accountHelper.parseStatus(result, integratedWith);

					CRMControlAccountDetail.model = result;

					$timeout(function () {
						$rootScope.accountDetailModeLoading = false;
						$scope.$broadcast(CRMEvent.scopeLoadAccount, result);
					});
				}
			});
		};

		this.loadPreferences = function (callback) {
			var count = 0,
				total = 2;

			taskPreferenceFinancialFactory.lastExecution(function (result) {
				count++;
				CRMControlAccountDetail.financialStatusLastExecution = result;
				if (count >= total) {
					callback();
				}
			});

			accountFactory.getAccountDetailPreferences(function (data) {
				if (data) {
					for (var i = 0; i < data.length; i++) {
						if (data[i].parameter_name == 'INTEGR_ERP_EMS') {
							CRMControlAccountDetail.isIntegratedWithEMS = data[i].logical_value;
						} else if (data[i].parameter_name == 'INTEGR_GP') {
							CRMControlAccountDetail.isIntegratedWithGP  = data[i].logical_value;
						} else if (data[i].parameter_name == 'INTEGR_ERP') {
							CRMControlAccountDetail.isIntegratedWithERP = data[i].logical_value;
						} else if (data[i].parameter_name == 'validateConvert') {
							CRMControlAccountDetail.isLeadQualify = data[i].logical_value;
						} 
					}
				}
			    count++;
				if (count >= total) {
					if (callback) { callback(); }
				}
			});
	
		};

		this.onEdit = function (isConvert) {
			var account,
				service,
				isAccount;

			if (!CRMControlAccountDetail.model) {
				return;
			}

			account = angular.copy(CRMControlAccountDetail.model);

			if (isConvert === true) {
				if (CRMControlAccountDetail.isLeadQualify === true) {
					// alterando conta para cliente
					account.idi_tip_cta = 2;
				} else {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('l-lead', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-validation-convert', [], 'dts/crm')
					});
					return;
				}
			}

			service = modalAccountEdit;
			isAccount = (account.idi_tip_cta !== 1);

			if (account.idi_tip_cta === 3) {
				service = modalContactEdit;
			}

			service.open({
				account   : account,
				isAccount : isAccount,
				isConvert : isConvert
			}).then(function (result) {
				if (result) {
					CRMControlAccountDetail.model = result;
				}
			});

		};

		this.openUserSummary = function () {
			var account = this.model;
			if (account && account.ttResponsavel && account.ttResponsavel.num_id) {
				userSummaryModal.open({
					model: account.ttResponsavel
				});
			}
		};

		this.openPrfvSummary = function (account) {
			if (account && account.val_recenc_freq_val) {
				prfvSummaryModal.open({
					model: account.num_id
				});
			}
		};

		this.sendEmail = function (account) {
			modalEmailEdit.open({ model: { ttContaOrigem: account } });
		};

		this.isPortalAccessContext = function () {
			return helper.isPortalAccessContext($rootScope.appRootContext);
		};

		this.printContactRelationship = accountFactory.printContactRelationship;

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			helper.loadCRMContext(function () {
				accessRestrictionFactory.getUserRestrictions('account.detail', $rootScope.currentuser.login, function (result) {
					CRMControlAccountDetail.accessRestriction = result || {};

					appViewService.startView($rootScope.i18n('nav-account', [], 'dts/crm'), 'crm.account.detail.control', CRMControlAccountDetail);

					CRMControlAccountDetail.model = undefined;

					CRMControlAccountDetail.isSourceMpd = CRMControlAccountDetail.getBoolean($stateParams.isSourceMpd);

					if ($stateParams && $stateParams.id) {
						CRMControlAccountDetail.loadPreferences(function () {
							CRMControlAccountDetail.load($stateParams.id);
						});
					}

				});

			});

		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountDetail = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlAccountDetail.init();
		});
	};

	controllerAccountDetail.$inject = [
		'$rootScope', '$scope', '$stateParams', '$filter', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.account.helper', 'crm.crm_pessoa.conta.factory', '$timeout', 'crm.account.modal.edit',
		'crm.account-contact.modal.edit', 'crm.helper', 'crm.prfv.modal.summary', 'crm.user.modal.summary',
		'crm.crm_param.factory', 'crm.send-email.modal', 'crm.crm_param_sit_financ.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.account.detail.control',	controllerAccountDetail);
});
