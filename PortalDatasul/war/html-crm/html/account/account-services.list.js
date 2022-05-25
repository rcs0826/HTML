/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
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
	'/dts/crm/html/account/target/target-services.edit.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerAccountList;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
	controllerAccountList = function ($rootScope, $scope, $filter, TOTVSEvent, accountFactory, helper,
								   accountHelper, modalAccountAdvancedSearch, userSummaryModal,
								   modalTaskEdit, modalHistoryEdit, modalTicketEdit,
								   modalOpportunityEdit, modalAccountEdit, modalContactEdit,
								   filterHelper, prfvSummaryModal, modalEmailEdit,
								   modalReportAvailable, preferenceFactory, userPreferenceModal,
								   $totvsprofile, modalTagetEdit, taskPreferenceFinancialFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountList = this;

		this.accessRestriction = undefined;

		this.infoSearchTooltip = $rootScope.i18n('msg-account-search-info', [], 'dts/crm');

		this.listOfAccounts = [];
		this.listOfAccountsCount = 0;

		this.disclaimers = [];
		this.fixedDisclaimers = [];

		this.isHistoryActionRequiredAfterExecution = undefined;

		this.selectedOrderBy = undefined;
		this.listOfOrderBy = undefined;
		this.isHideContact = false;

		this.listOfCustomFilters = [];
		this.quickFilters = [];

		this.isPortal = typeof (APP_BASE_URL) !== "undefined" ? (APP_BASE_URL.indexOf('/portal/') >= 0) : false;

		this.lastAccountsLength = 0;

		this.isLeadQualify = undefined;
		this.isIntegratedWithGP = undefined;
		this.financialStatusLastExecution = undefined;

		this.documentIdentificationType = undefined;

		this.searchablesProperties = [{
			property: 'num_id',
			name: $rootScope.i18n('l-code', [], 'dts/crm')
		}, {
			property: 'nom_razao_social',
			name: $rootScope.i18n('l-name', [], 'dts/crm')
		}, {
			property: 'nom_abrev',
			name: $rootScope.i18n('l-short-name', [], 'dts/crm')
		}, {
			property: 'nom_infml',
			name: $rootScope.i18n('l-informal-name', [], 'dts/crm')
		}, {
			property: 'nom_cpf',
			name: $rootScope.i18n('l-cpf', [], 'dts/crm')
		}, {
			property: 'nom_cnpj',
			name: $rootScope.i18n('l-cnpj', [], 'dts/crm')
		}, {
			property: 'cod_pessoa_erp',
			name: $rootScope.i18n('l-code-erp', [], 'dts/crm')
		}, {
			property: 'custom.nom_telef',
			name: $rootScope.i18n('l-phone', [], 'dts/crm')
		}, {
			property: 'custom.quick_search',
			name: $rootScope.i18n('l-all', [], 'dts/crm'),
			placeholder: $rootScope.i18n('l-search-account', [], 'dts/crm'),
			'default': true
		}];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.removeCustomFilter = function (filter) {
			filterHelper.remove('nav-account', accountHelper.filtersGroup, filter, function () {
				filterHelper.get(accountHelper.filtersGroup, undefined, function (result) {
					CRMControlAccountList.listOfCustomFilters = result || [];
				});
			});

		};

		this.saveCustomFilter = function (filter) {
			filterHelper.save('nav-account', accountHelper.filtersGroup, filter, function () {
				filterHelper.get(accountHelper.filtersGroup, undefined, function (result) {
					CRMControlAccountList.listOfCustomFilters = result || [];
				});
			});
		};

		this.addEditCustomFilters = function (filter) {

			modalAccountAdvancedSearch.open({
				fixedDisclaimers: CRMControlAccountList.fixedDisclaimers,
				customFilter: filter,
				isAddEditMode: true,
				customFilterList: CRMControlAccountList.listOfCustomFilters,
				isHideContact: CRMControlAccountList.isHideContact
			}).then(function (result) {

				if (!result) {
					return;
				}

				CRMControlAccountList.saveCustomFilter(result.customFilter);

				if (result.apply === true) {
					CRMControlAccountList.quickSearch.value = undefined;
					CRMControlAccountList.disclaimers = result.disclaimers;
					CRMControlAccountList.fixedDisclaimers = result.fixedDisclaimers;

					CRMControlAccountList.search(false);
				}
			});
		};

		this.selectOrderBy = function (order) {

			if (!order) {
				return;
			}

			CRMControlAccountList.selectedOrderBy = order;

			CRMControlAccountList.search(false);
		};

		this.selectQuickFilter = function (filters) {
			filterHelper.selectQuickFilter(filters, CRMControlAccountList.disclaimers, CRMControlAccountList.fixedDisclaimers, function (newDisclaimers) { CRMControlAccountList.disclaimers = newDisclaimers.disclaimers;
					CRMControlAccountList.fixedDisclaimers = newDisclaimers.fixedDisclaimers;
					CRMControlAccountList.quickSearch.value = undefined;
					CRMControlAccountList.search(false);
					});
		};

		this.loadDefaults = function (disclaimers) {
			var i;

			CRMControlAccountList.disclaimers = [];

			if (disclaimers) {
				if (!angular.isArray(disclaimers)) {
					disclaimers = [disclaimers];
				}

				for (i = 0; i < disclaimers.length; i++) {

					if (disclaimers[i].fixed === true) {
						CRMControlAccountList.fixedDisclaimers.push(disclaimers[i]);
					} else {
						CRMControlAccountList.disclaimers.push(disclaimers[i]);
					}
				}
			}

			CRMControlAccountList.disclaimers = CRMControlAccountList.fixedDisclaimers.concat(CRMControlAccountList.disclaimers);
		};

		this.removeDisclaimer = function (disclaimer) {
			var i,
				index = CRMControlAccountList.disclaimers.indexOf(disclaimer);

			if (index !== -1) {
				CRMControlAccountList.disclaimers.splice(index, 1);
				for (i = 0; i < CRMControlAccountList.fixedDisclaimers.length; i++) {
					if (CRMControlAccountList.fixedDisclaimers[i].property === disclaimer.property) {
						CRMControlAccountList.disclaimers.push(CRMControlAccountList.fixedDisclaimers[i]);
						break;
					}
				}
				CRMControlAccountList.search(false);
			}
		};

		this.search = function (isMore, init) {

			var i            = 0,
				options      = { type: 0, end: 50 },
				filters      = [],
				quickProperty,
				quickValue;

			if (CRMControlAccountList.isPendingListSearch === true) {
				return;
			}

			CRMControlAccountList.listOfAccountsCount = 0;

			if (!isMore) {
				CRMControlAccountList.listOfAccounts = [];
			}

			options.start = CRMControlAccountList.listOfAccounts.length;

			if (CRMControlAccountList.selectedOrderBy) {
				options.orderBy = CRMControlAccountList.selectedOrderBy.property;
				options.asc = CRMControlAccountList.selectedOrderBy.asc;
			}

			CRMControlAccountList.parseQuickFilter(filters);
			options.entity = CRMControlAccountList.getSearchEntityType();

			filters = filters.concat(CRMControlAccountList.disclaimers);

			CRMControlAccountList.isPendingListSearch = true;

			accountFactory.findRecords(filters, options, function (result) {
				CRMControlAccountList.addAccountInList(result);
				CRMControlAccountList.isPendingListSearch = false;
				CRMControlAccountList.lastAccountsLength = result.length;
			});
		};

		this.openAdvancedSearch = function () {
			modalAccountAdvancedSearch.open({
				disclaimers: CRMControlAccountList.disclaimers,
				fixedDisclaimers: CRMControlAccountList.fixedDisclaimers,
				isHideContact: CRMControlAccountList.isHideContact
			}).then(function (result) {
				CRMControlAccountList.quickSearch.value = undefined;
				CRMControlAccountList.disclaimers = result.disclaimers || [];
				CRMControlAccountList.fixedDisclaimers = result.fixedDisclaimers || [];
				CRMControlAccountList.search(false);
			});
		};

		this.openUserSummary = function (account) {
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

		this.registerHistory = function (account) {
			modalHistoryEdit.open({
				history: {
					ttConta: account
				},
				defaults: {
					num_id_contat: account.num_id_pto_focal
				},
				canOverrideAccount: false
			});
		};

		this.registerTask = function (account) {
			modalTaskEdit.open({
				task: {
					ttConta: account
				},
				defaults: {
					num_id_contat: account.num_id_pto_focal
				},
				canOverrideAccount: false
			});
		};

		this.registerTicket = function (account) {
			modalTicketEdit.open({
				ticket: {
					ttConta: account
				},
				defaults: {
					num_id_contat: account.num_id_pto_focal
				},
				canOverrideAccount: false
			});
		};

		this.registerOpportunity = function (account) {
			modalOpportunityEdit.open({
				opportunity: {
					ttConta: account
				},
				defaults: {
					num_id_contat: account.num_id_pto_focal
				},
				canOverrideAccount: false
			});
		};

		this.convertAccount = function (account) {
			var act  = angular.copy(account),
				control = CRMControlAccountList;

			if (control.isLeadQualify === true) {
				act.idi_tip_cta = 2; // alterando conta para cliente
				CRMControlAccountList.addEdit(act, true, true);
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-lead', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-validation-convert', [], 'dts/crm')
				});
			}
		};

		this.addEdit = function (account, isAccount, isConvert) {

			var service = modalAccountEdit;

			if (account) {
				if (account.idi_tip_cta === 3) {
					service = modalContactEdit;
				} else {
					isAccount = (account.idi_tip_cta !== 1);
				}
			}

			service.open({
				account		: account,
				isAccount	: isAccount,
				isConvert	: isConvert,
				isToLoad	: CRMUtil.isDefined(account)
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					if (CRMUtil.isDefined(account)) {
						CRMControlAccountList.updateAccountInList(result, account);
					} else {
						CRMControlAccountList.addAccountInList(result, true);
					}
				}
			});
		};

		this.formatAccountToDisplay = function (account) {

			if (CRMUtil.isUndefined(account)) {
				return;
			}

			accountHelper.parseSex(account);
			accountHelper.parsePersonType(account);
			accountHelper.parseAccountType(account);
			accountHelper.parseAccessLevel(account);

			return account;
		};

		this.getAddresDescription = function (address) {
			var city = '',
				state = '';

			if (address.nom_cidade) {
				city = address.nom_cidade + ', ';
			}
			if (address.nom_unid_federac) {
				state = address.nom_unid_federac + ' - ';
			}

			return city + state + address.nom_pais;
		};

		this.updateAccountInList = function (account, oldAccount) {

			this.formatAccountToDisplay(account);

			var index = this.listOfAccounts.indexOf(oldAccount);
			this.listOfAccounts[index] = account;
		};

		this.addAccountInList = function (accounts, isNew) {
			var i,
				account;

			if (!accounts) {
				return;
			}

			if (!angular.isArray(accounts)) {
				accounts = [accounts];
				CRMControlAccountList.listOfAccountsCount++;
			}

			for (i = 0; i < accounts.length; i++) {

				account = accounts[i];

				if (account && account.$length) {
					CRMControlAccountList.listOfAccountsCount = account.$length;
				}

				accountHelper.parseAccountColor(account);

				CRMControlAccountList.formatAccountToDisplay(account);

				if (isNew === true) {
					CRMControlAccountList.listOfAccounts.unshift(account);
				} else {
					CRMControlAccountList.listOfAccounts.push(account);
				}

			}

		};

		this.deleteAccountInList = function (account) {
			var index = CRMControlAccountList.listOfAccounts.indexOf(account);
			CRMControlAccountList.listOfAccounts.splice(index, 1);
			CRMControlAccountList.listOfAccountsCount--;
		};

		this.loadCustomFilters = function () {
			filterHelper.get(accountHelper.filtersGroup, undefined, function (result) {
				CRMControlAccountList.listOfCustomFilters = result || [];
			});
		};

		this.sendEmail = function (account) {
			modalEmailEdit.open({ model: { ttContaOrigem: account } });
		};

		this.showReports = function () {
			modalReportAvailable.open({ num_id: 3, nom_modul_crm: 'l-module-account' });
		};

		this.loadPreferences = function (callback) {

			var control = CRMControlAccountList,
				icount  = 0,
				itotal  = 5;

			taskPreferenceFinancialFactory.lastExecution(function (result) {
				icount++;

				control.financialStatusLastExecution = result;
				if (icount >= itotal) {
					callback();
				}
			});

			accountFactory.validateConvert(function (result) {
				icount++;

				if (result) {
					control.isLeadQualify = result;
				}

				if (icount >= itotal) {
					callback();
				}
			});

			accountFactory.isHideContact(function (result) {
				icount++;

				if (result) {
					CRMControlAccountList.isHideContact = result;
				}

				if (icount >= itotal) {
					callback();
				}
			});

			preferenceFactory.isIntegratedWithGP(function (result) {
				icount++;

				if (result) {
					control.isIntegratedWithGP = result;
				}

				if (icount >= itotal) {
					callback();
				}
			});

			$totvsprofile.remote.get('crm.user.preference.account', 'filter', function (result) {

				icount++;

				control.filterAccountProperties = (result && result.length > 0 ? result[0].dataValue : undefined);

				if (icount >= itotal) {
					callback();
				}
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({
				context: 'account.list',
				account: { filters: angular.copy(this.searchablesProperties) }
			}).then(function (result) {
				CRMControlAccountList.searchablesProperties = result.account.filter.options;
			});
		};

		this.printContactRelationship = accountFactory.printContactRelationship;

		this.parseQuickFilter = function (filters) {

			var quickProperty, quickValue,
				replaceAll = function replaceAll(str, de, para) {
					var pos = str.indexOf(de);
					while (pos > -1) {
						str = str.replace(de, para);
						pos = str.indexOf(de);
					}
					return (str);
				};

			if (CRMUtil.isDefined(CRMControlAccountList.quickSearch)) {

				quickProperty = CRMControlAccountList.quickSearch.property;
				quickValue = CRMControlAccountList.quickSearch.value;

				if (CRMUtil.isDefined(quickValue) && quickValue.toString().trim().length > 0) {

					CRMControlAccountList.loadDefaults();

					if (quickProperty !== 'num_id') {
						quickValue = helper.parseStrictValue(quickValue);
					}

					if (quickProperty === 'nom_cpf' || quickProperty === 'nom_cnpj') {
						quickValue = replaceAll(quickValue, ".", "");
						quickValue = quickValue.replace("-", "");
						quickValue = quickValue.replace("/", "");
					}

					filters.push({
						property: quickProperty,
						value: quickValue
					});
				}
			}
		};

		this.getSearchEntityType = function () {

			var i = 0, entity = 0;

			for (i; i < CRMControlAccountList.disclaimers.length; i++) {
				if (CRMControlAccountList.disclaimers[i].property === 'custom.log_hide_contact') {
					entity = 1;
					break;
				}
			}

			return entity;
		};

		this.exportSearch = function () {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-attention', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('l-no', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('l-yes', [], 'dts/crm'),
				text: $rootScope.i18n('msg-export-report', [], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					var filters = [], entity;

					entity = CRMControlAccountList.getSearchEntityType();

					CRMControlAccountList.parseQuickFilter(filters);
					filters = filters.concat(CRMControlAccountList.disclaimers);

					accountFactory.exportSearch(filters, entity, isPositiveResult);
				}
			});
		};

		this.newTarget = function () {
			var onNewTarget = function () {
				modalTagetEdit.open({
					disclaimers: angular.copy(CRMControlAccountList.disclaimers)
				});
			};

			if (CRMControlAccountList.quickSearch && CRMControlAccountList.quickSearch.value) {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: $rootScope.i18n('l-attention', [], 'dts/crm'),
					cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
					confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
					text: $rootScope.i18n('msg-confirm-new-target', [], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (!isPositiveResult) { return; }
						onNewTarget();
					}
				});
			} else {
				onNewTarget();
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-account', [], 'dts/crm'),
				paramRestrictions = 'account.list',
				startSearch,
				viewController = 'crm.account.list.control',
				startView = helper.startView(viewName, viewController, CRMControlAccountList),
				disclaimers = [],
				tempArr = [],
				i;

			startSearch = function () {
				if (startView.isNewContext) {
					CRMControlAccountList.loadCustomFilters();
					CRMControlAccountList.search(false, true);
				}
			};

			helper.loadCRMContext(function () {

				if (CRMControlAccountList.isChild === true) {
					paramRestrictions = 'account.tab';
				}

				accessRestrictionFactory.getUserRestrictions('account.list', $rootScope.currentuser.login, function (result) {
					CRMControlAccountList.accessRestriction = result || {};
				});

				CRMControlAccountList.quickFilters = [{
					property: 'num_id_usuar_respons',
					value: $rootScope.currentuser.idCRM,
					title: $rootScope.i18n('l-account-filter-mine', [], 'dts/crm'),
					fixed: false,
					model: {
						value : {
							num_id: $rootScope.currentuser.idCRM,
							nom_usuar: $rootScope.currentuser['user-desc']
						}
					}
				}];

				if (startView.isNewTab === true) {

					disclaimers.push({
						property: 'num_id_usuar_respons',
						value: $rootScope.currentuser.idCRM,
						title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + $rootScope.currentuser['user-desc'],
						fixed: false,
						model: {
							value : {
								num_id: $rootScope.currentuser.idCRM,
								nom_usuar: $rootScope.currentuser['user-desc']
							}
						}
					});

					CRMControlAccountList.loadPreferences(function () {

						if (CRMControlAccountList.isHideContact) {

							disclaimers.push({
								property: 'custom.log_hide_contact',
								value: CRMControlAccountList.isHideContact,
								title: $rootScope.i18n('l-hide-contact', [], 'dts/crm') + ': ' + $rootScope.i18n('l-yes', [], 'dts/crm'),
								fixed: true,
								model: { property: 'custom.log_hide_contact', value : true }
							});

						}

						if (CRMControlAccountList.isIntegratedWithGP === true) {

							tempArr = CRMControlAccountList.searchablesProperties.slice(CRMControlAccountList.searchablesProperties.length - 1);
							CRMControlAccountList.searchablesProperties.splice(CRMControlAccountList.searchablesProperties.length - 1, 1);

							tempArr.unshift({
								property: 'document.cod_docto_ident',
								name: $rootScope.i18n('l-identification-document', [], 'dts/crm')
							});

							CRMControlAccountList.searchablesProperties = CRMControlAccountList.searchablesProperties.concat(tempArr);

						}

						if (CRMUtil.isDefined(CRMControlAccountList.filterAccountProperties)) {
							var hasFound = false,
								isEquals;

							for (i = 0; i < CRMControlAccountList.searchablesProperties.length; i++) {

								isEquals = (CRMControlAccountList.searchablesProperties[i].name === CRMControlAccountList.filterAccountProperties.name);
								CRMControlAccountList.searchablesProperties[i]['default'] = isEquals;

								if (isEquals === true) {
									hasFound = isEquals;
								}
							}

							if (hasFound === false) {
								CRMControlAccountList.searchablesProperties[CRMControlAccountList.searchablesProperties.length - 1]['default'] = true;
							}

							CRMControlAccountList.searchablesProperties = angular.copy(CRMControlAccountList.searchablesProperties);
						}

						CRMControlAccountList.loadDefaults(disclaimers);

						startSearch();
					});

				} else {
					startSearch();
				}

			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountList = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlAccountList.init();
		});

		$scope.$on(CRMEvent.scopeDeleteAccountRemoveProcess, function (event, listProcess) {
			if (!listProcess || !angular.isArray(listProcess)) { return; }

			var i;
			for (i = 0; i < listProcess.length; i++) {
				if (listProcess[i].processo === 'account') {
					CRMControlAccountList.deleteAccountInList(listProcess[i]);
				}
			}
		});

	};

	controllerAccountList.$inject = [
		'$rootScope', '$scope', '$filter', 'TOTVSEvent', 'crm.crm_pessoa.conta.factory', 'crm.helper',
		'crm.account.helper', 'crm.account.modal.advanced.search', 'crm.user.modal.summary',
		'crm.task.modal.edit', 'crm.history.modal.edit', 'crm.ticket.modal.edit',
		'crm.opportunity.modal.edit', 'crm.account.modal.edit', 'crm.account-contact.modal.edit',
		'crm.filter.helper', 'crm.prfv.modal.summary', 'crm.send-email.modal',
		'crm.report.modal.available', 'crm.crm_param.factory', 'crm.user.modal.preference',
		'$totvsprofile', 'crm.account.target.modal.edit', 'crm.crm_param_sit_financ.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.account.list.control', controllerAccountList);
});
