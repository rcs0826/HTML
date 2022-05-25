/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil,APP_BASE_URL */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/api/fchcrm1020.js',
	'/dts/crm/js/api/fchcrm1029.js',
	'/dts/crm/js/api/fchcrm1030.js',
	'/dts/crm/js/api/fchcrm1044.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1047.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_produt.js',
	'/dts/crm/js/zoom/crm_tab_preco.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/task/task-services.advanced-search.js',
	'/dts/crm/html/task/task-services.calendar.js',
	'/dts/crm/html/task/task-services.detail.js',
	'/dts/crm/html/task/task-services.edit.js',
	'/dts/crm/html/task/task-services.list.js',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/attachment/attachment-services.js',
	'/dts/crm/html/opportunity/product/product-services.js',
	'/dts/crm/html/opportunity/gain-loss/gain-loss-services.js',
	'/dts/crm/html/opportunity/sales-order/sales-order-services.js',
	'/dts/crm/html/opportunity/strong-weak/strong-weak-services.js',
	'/dts/crm/html/opportunity/resale/resale-services.js',
	'/dts/crm/html/opportunity/competitor/competitor-services.js',
	'/dts/crm/html/opportunity/contact/contact-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/js/api/fchdis0051.js',
	'/dts/crm/html/opportunity/sales-order/sales-order.cancel.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var serviceOpportunityParam,
		controllerOpportunityList;


	serviceOpportunityParam = function () {
		var self = this;

		this.paramOpp = undefined;

		this.setParamOpp = function (param, callback) {
			self.paramOpp = param;
			if (callback) { callback(); }
		};
	}; // serviceOpportunityParam
	serviceOpportunityParam.$inject = [];
	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
	controllerOpportunityList = function ($rootScope, $scope, TOTVSEvent, opportunityFactory,
		modalOpportunityAdvancedSearch, helper, opportunityHelper, modalTaskEdit,
		modalHistoryEdit, modalOpportunityEdit, filterHelper, $location, serviceOpportunityParam,
		userSummaryModal, preferenceFactory, modalEmailEdit, modalReportAvailable, userPreferenceModal,
		fchdis0051Factory, modalCancelSalesOrder, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityList = this;

		this.accessRestriction = undefined;

		this.listOfOpportunity = [];
		this.listOfOpportunityCount = 0;
		this.isUserPortfolio = false;

		this.disclaimers		= [];
		this.fixedDisclaimers	= [];

		this.selectedOrderBy = undefined;
		this.listOfOrderBy = undefined;

		this.isIntegratedWithEMS = false;
		this.isIntegratedWithGP = false;

		/*
		this.listOfOrderBy = [
			{title:$rootScope.i18n('l-date-create', [], 'dts/crm'),property:'dat_cadastro'},
			{title:$rootScope.i18n('l-account', [], 'dts/crm'),property:'num_id_pessoa'},
			{title:$rootScope.i18n('l-phase', [], 'dts/crm'),property:'num_id_fase'},
			{title:$rootScope.i18n('l-user-responsible', [], 'dts/crm'),property:'num_id_usuar_respons'}
		];*/

		this.listOfCustomFilters = [];

		this.quickFilters = [];

		this.isPortal = typeof (APP_BASE_URL) !== "undefined" ? (APP_BASE_URL.indexOf('/portal/') >= 0) : false;

		this.params = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.removeCustomFilter = function (filter) {
			filterHelper.remove('nav-opportunity', opportunityHelper.filtersGroup, filter, function () {
				filterHelper.get(opportunityHelper.filtersGroup, undefined, function (result) {
					CRMControlOpportunityList.listOfCustomFilters = result || [];
				});
			});
		};

		this.saveCustomFilter = function (filter) {
			filterHelper.save('nav-opportunity', opportunityHelper.filtersGroup, filter, function () {
				filterHelper.get(opportunityHelper.filtersGroup, undefined, function (result) {
					CRMControlOpportunityList.listOfCustomFilters = result || [];
				});
			});
		};

		this.addEditCustomFilters = function (filter) {

			modalOpportunityAdvancedSearch.open({
				fixedDisclaimers: CRMControlOpportunityList.fixedDisclaimers,
				customFilter: filter,
				isAddEditMode: true,
				customFilterList: CRMControlOpportunityList.listOfCustomFilters
			}).then(function (result) {

				if (!result) { return; }

				CRMControlOpportunityList.saveCustomFilter(result.customFilter);

				if (result.apply === true) {

					CRMControlOpportunityList.quickSearchText = undefined;

					CRMControlOpportunityList.disclaimers = result.disclaimers;
					CRMControlOpportunityList.fixedDisclaimers = result.fixedDisclaimers;

					CRMControlOpportunityList.search(false);
				}
			});
		};

		this.selectOrderBy = function (order) {

			if (!order) { return; }

			CRMControlOpportunityList.selectedOrderBy = order;

			CRMControlOpportunityList.search(false);
		};

		this.selectQuickFilter = function (filters) {
			filterHelper.selectQuickFilter(
				filters,
				CRMControlOpportunityList.disclaimers,
				CRMControlOpportunityList.fixedDisclaimers,
				function (newDisclaimers) {
					CRMControlOpportunityList.disclaimers = newDisclaimers.disclaimers;
					CRMControlOpportunityList.fixedDisclaimers = newDisclaimers.fixedDisclaimers;
					CRMControlOpportunityList.quickSearchText = undefined;
					CRMControlOpportunityList.search(false);
				}
			);
		};

		this.loadDefaults = function (disclaimers) {

			var i;

			if (disclaimers) {
				if (!angular.isArray(disclaimers)) {
					disclaimers = [disclaimers];
				}

				this.disclaimers = [];

				for (i = 0; i < disclaimers.length; i++) {
					if (disclaimers[i].fixed === true) {
						this.fixedDisclaimers.push(disclaimers[i]);
					} else {
						this.disclaimers.push(disclaimers[i]);
					}
				}
			}


			this.disclaimers = this.fixedDisclaimers.concat(this.disclaimers);
		};

		this.loadPreferences = function (callback) {
			preferenceFactory.getPreferenceAsBoolean('LOG_CARTEIRA_USU', function (result) {
				CRMControlOpportunityList.isUserPortfolio = result || false;
				callback();
			});

			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControlOpportunityList.isIntegratedWithGP = result;
			});

			preferenceFactory.isIntegratedWithEMS(function (result) {
				CRMControlOpportunityList.isIntegratedWithEMS = result;
			});
		};

		this.openAdvancedSearch = function () {
			modalOpportunityAdvancedSearch.open({
				disclaimers: CRMControlOpportunityList.disclaimers,
				fixedDisclaimers: CRMControlOpportunityList.fixedDisclaimers,
				isChild: CRMControlOpportunityList.parent ? true : false,
				isUserPortfolio: CRMControlOpportunityList.isUserPortfolio
			}).then(function (result) {
				CRMControlOpportunityList.quickSearchText = undefined;
				CRMControlOpportunityList.disclaimers = result.disclaimers;
				CRMControlOpportunityList.fixedDisclaimers = result.fixedDisclaimers;
				CRMControlOpportunityList.search(false);
			});
		};

		this.removeDisclaimer = function (disclaimer) {
			var i,
				index = CRMControlOpportunityList.disclaimers.indexOf(disclaimer);
			if (index !== -1) {
				CRMControlOpportunityList.disclaimers.splice(index, 1);
				for (i = 0; i < CRMControlOpportunityList.fixedDisclaimers.length; i++) {
					if (CRMControlOpportunityList.fixedDisclaimers[i].property === disclaimer.property) {
						CRMControlOpportunityList.disclaimers.push(CRMControlOpportunityList.fixedDisclaimers[i]);
						break;
					}
				}

				CRMControlOpportunityList.search(false);
			}
		};

		this.search = function (isMore) {

			var i,
				options,
				filters = [];

			if (CRMControlOpportunityList.isPendingListSearch === true) {
				return;
			}

			CRMControlOpportunityList.listOfOpportunityCount = 0;

			if (!isMore) {
				CRMControlOpportunityList.listOfOpportunity = [];
			}

			options = {
				start: CRMControlOpportunityList.listOfOpportunity.length,
				end: (CRMControlOpportunityList.isChild === true ? 10 : 50)
			};

			if (CRMControlOpportunityList.selectedOrderBy) {
				options.orderBy = CRMControlOpportunityList.selectedOrderBy.property;
				options.asc = CRMControlOpportunityList.selectedOrderBy.asc;
			}

			CRMControlOpportunityList.parseQuickFilter(filters);

			filters = filters.concat(CRMControlOpportunityList.disclaimers);

			CRMControlOpportunityList.isPendingListSearch = true;

			opportunityFactory.findRecords(filters, options, function (result) {

				for (i = 0; i < result.length; i++) {

					var opportunity = result[i];

					if (opportunity && opportunity.$length) {
						CRMControlOpportunityList.listOfOpportunityCount = opportunity.$length;
					}

					opportunityHelper.parseOpportunityColor(opportunity);
					CRMControlOpportunityList.listOfOpportunity.push(opportunity);
				}
				CRMControlOpportunityList.isPendingListSearch = false;
			});
		};

		this.parseQuickFilter = function (filters) {

			if (CRMControlOpportunityList.quickSearchText
					&& CRMControlOpportunityList.quickSearchText.trim().length > 0) {

				CRMControlOpportunityList.disclaimers = [];
				CRMControlOpportunityList.loadDefaults();

				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControlOpportunityList.quickSearchText)
				});
			}

		};

		this.exportSearch = function () {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-attention', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('l-no', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('l-yes', [], 'dts/crm'),
				text: $rootScope.i18n('msg-export-report', [], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					var filters = [];

					CRMControlOpportunityList.parseQuickFilter(filters);
					filters = filters.concat(CRMControlOpportunityList.disclaimers);
					opportunityFactory.exportSearch(filters, isPositiveResult);
				}
			});
		};

		this.registerTask = function (opportunity) {
			modalTaskEdit.open({
				task: {
					ttOportunidadeOrigem: opportunity
				}
			}).then(function (task) {
				// TODO: ?
			});
		};

		this.registerHistory = function (opportunity) {
			modalHistoryEdit.open({
				history: {
					ttOportunidadeOrigem: opportunity
				}
			}).then(function (history) {
				// TODO: ?
			});
		};

		this.addEdit = function (opportunity) {

			if ((opportunity) && (opportunity.ttFaseDesenvolvimento)
					&& (opportunity.ttFaseDesenvolvimento.log_permite_alter === false)) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-phase-not-allow-change', [], 'dts/crm')
				});
				return;
			}

			var service = modalOpportunityEdit;

			service.open({
				opportunity	: ((this.isChild === true && CRMUtil.isUndefined(opportunity)) ? this.parent : opportunity)
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					if (CRMUtil.isDefined(opportunity)) {
						CRMControlOpportunityList.updateOpportunityInList(result, opportunity);
					} else {
						CRMControlOpportunityList.addOpportunityInList(result, opportunity);
					}
				}
			});
		};

		this.onRemove = function (opportunity) {

			if ((opportunity) && (opportunity.ttFaseDesenvolvimento)
					&& (opportunity.ttFaseDesenvolvimento.log_permite_exc === false)) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-phase-not-allow-delete', [], 'dts/crm')
				});
				return;
			}

			if ((opportunity) && (opportunity.num_id_usuar_respons !== $rootScope.currentuser.idCRM)) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-only-responsible-can-delete', [], 'dts/crm')
				});
				return;
			}

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-opportunity', [], 'dts/crm').toLowerCase(), opportunity.des_oportun_vda
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					opportunityFactory.deleteRecord(opportunity.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						CRMControlOpportunityList.deleteOpportunityInList(opportunity);

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

					});
				}
			});
		};

		this.reopen = function (opp) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-reopen', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-reopen', [
					$rootScope.i18n('l-opportunity', [], 'dts/crm').toLowerCase(), opp.des_oportun_vda
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					var strategyId = opp.num_id_estrateg_vda;

					opportunityFactory.getAllPhases(strategyId, function (result) {

						if (!result) { return; }

						var i,
							vo,
							phases = result,
							devId = 0,
							isEditAvailable = false;

						for (i = 0; i < phases.length; i++) {
							if (phases[i].num_id === opp.num_id_fase) {
								isEditAvailable = phases[i].log_permite_alter;
							}

							if ((devId === 0) && (phases[i].log_fechto_fase === false)) {
								devId = phases[i].num_id;
							}
						}

						if (isEditAvailable === true) {
							if (devId !== 0) {
								vo = opp;
								vo.num_id_fase = devId;
								vo.dat_fechto_oportun = "";
								CRMControlOpportunityList.updateOpportunity(vo, opp);
							} else {
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'error',
									title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
									detail: $rootScope.i18n('msg-phase-not-found-to-reopening', [], 'dts/crm')
								});
							}
						} else {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'error',
								title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-phase-not-allow-change', [], 'dts/crm')
							});
						}

					},   true);
				}
			});

		};

		this.toogleSuspend = function (opportunity) {

			if (!opportunity) { return; }

			var title,
				msg;

			title = ((opportunity.log_suspenso !== true) ? 'l-confirm-suspend' : 'l-confirm-reactivate');

			msg = ((opportunity.log_suspenso !== true) ? 'msg-confirm-suspend' : 'msg-confirm-reactivate');

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: title,
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n(msg, [
					$rootScope.i18n('l-opportunity', [], 'dts/crm').toLowerCase(), opportunity.des_oportun_vda
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					opportunityFactory.toogleSuspendOpportunity(opportunity.num_id, function (result) {
						if (CRMUtil.isUndefined(result)) {
							return;
						}

						CRMControlOpportunityList.updateOpportunityInList(result, opportunity);

					});

				}
			});

		};

		this.lost = function (opp) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-set-lost-phase-to-opportunity', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-lost-opportunity', [
					opp.des_oportun_vda
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					opportunityFactory.lostOpportunity(opp.num_id, function (result) {
						if (!result) { return; }

						CRMControlOpportunityList.updateOpportunityInList(result, opp);

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-sucess-lost-opportunity', [
								opp.des_oportun_vda
							], 'dts/crm')
						});

						CRMControlOpportunityList.cancelQuotationAndSalesOrder(opp);
					});
				}
			});

		};

		this.cancelQuotationAndSalesOrder = function (opp) {
			if (CRMUtil.isUndefined(opp)) { return; }

			if (CRMControlOpportunityList.isIntegratedWithEMS !== true) { return; }

			var fnConfirmCancel;

			fnConfirmCancel = function (result) {
				// se tiver cotações ou pedidos abertos então questiona se deseja cancelar
				if (result && result.isOK === true) {

					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: $rootScope.i18n('l-confirm-cancellation', [], 'dts/crm'),
						cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
						confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
						text: $rootScope.i18n('msg-confirm-cancellation-quotation-and-orders', [], 'dts/crm'),
						callback: function (isPositiveResult) {

							if (!isPositiveResult) { return; }

							CRMControlOpportunityList.openCancelQuotationAndSalesOrder(opp);
						}
					});

				}
			};

			fchdis0051Factory.hasOpenQuotationOrOrderForOpportunity(opp.num_id, fnConfirmCancel);
		};

		this.openCancelQuotationAndSalesOrder = function (opp, callback) {
			modalCancelSalesOrder.open({
				opportunity: opp,
				allOpenQuotationAndOrderForOpportunity: true
			}).then(function (result) {
				if (callback) { callback(result); }
			});
		};

		this.updateOpportunity = function (vo, opportunity) {
			opportunityFactory.updateRecord(vo.num_id, vo, function (result) {

				if (!result) { return; }

				CRMControlOpportunityList.afterSave(result, opportunity);

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-update-opportunity', [
						opportunity.des_oportun_vda
					], 'dts/crm')
				});
			});
		};

		this.afterSave = function (opportunity, oldOpportunity) {

			var filter;

			opportunityHelper.parseOpportunityColor(opportunity);

			if (opportunity.ttEstrategia) {
				if (opportunity.ttEstrategia.log_inclui_acao === true) {
					CRMControlOpportunityList.registerHistory(opportunity, true);
				}
			} else {
				filter = { property: 'num_id',  value: opportunity.num_id };
				opportunityFactory.findRecords(filter, undefined, function (result) {
					if (!result) { return; }
					var opp = result[0];
					if (opp.ttEstrategia.log_inclui_acao === true) {
						CRMControlOpportunityList.registerHistory(opp, false);
					}
				});
			}

		};

		this.updateOpportunityInList = function (opportunity, oldOpportunity) {

			opportunityHelper.parseOpportunityColor(opportunity);

			var i,
				index = this.listOfOpportunity.indexOf(oldOpportunity),
				current;

			if (index === -1) {
				for (i = 0; i < CRMControlOpportunityList.listOfOpportunity.length; i++) {
					current = CRMControlOpportunityList.listOfOpportunity[i];

					if (current.num_id === oldOpportunity.num_id) {
						index = i;
						break;
					}
				}
			}

			this.listOfOpportunity[index] = opportunity;
		};

		this.addOpportunityInList = function (opportunitys) {
			var i,
				opportunity;

			if (!opportunitys) { return; }

			if (!angular.isArray(opportunitys)) {
				opportunitys = [opportunitys];
				CRMControlOpportunityList.listOfOpportunityCount++;
			}

			for (i = 0; i < opportunitys.length; i++) {

				opportunity = opportunitys[i];

				if (opportunity && opportunity.$length) {
					CRMControlOpportunityList.listOfOpportunityCount = opportunity.$length;
				}

				CRMControlOpportunityList.listOfOpportunity.unshift(opportunity);
			}
		};

		this.deleteOpportunityInList = function (opportunity) {
			var index = CRMControlOpportunityList.listOfOpportunity.indexOf(opportunity);
			CRMControlOpportunityList.listOfOpportunity.splice(index, 1);
			CRMControlOpportunityList.listOfOpportunityCount--;
		};

		this.loadCustomFilters = function () {
			filterHelper.get(opportunityHelper.filtersGroup, undefined, function (result) {
				CRMControlOpportunityList.listOfCustomFilters = result || [];
			});
		};

		this.openUserSummary = function (opportunity) {
			if (opportunity && opportunity.ttResponsavel && opportunity.ttResponsavel.num_id) {
				userSummaryModal.open({
					model: opportunity.ttResponsavel
				});
			}
		};

		this.sendEmail = function (opportunity) {
			modalEmailEdit.open({
				model: {
					ttOportunidadeOrigem: opportunity
				}
			}).then(function (email) {
				// TODO: ?
			});
		};

		this.showReports = function () {
			modalReportAvailable.open({ num_id: 4, nom_modul_crm: 'l-module-opportunity' });
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'opportunity.list' });
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (disclaimers, parent, isEnabled) {

			helper.loadCRMContext(function () {
				var paramRestrictions = 'opportunity.list';

				/*
				if (CRMControlOpportunityList.isChild === true) {
					paramRestrictions = 'opportunity.tab';
				}
				*/

				accessRestrictionFactory.getUserRestrictions(paramRestrictions, $rootScope.currentuser.login, function (result) {
					CRMControlOpportunityList.accessRestriction = result || {};
				});

				CRMControlOpportunityList.loadPreferences(function () {

					CRMControlOpportunityList.quickFilters = [{
						property: 'num_id_usuar_respons',
						value: $rootScope.currentuser.idCRM,
						title: $rootScope.i18n('l-opportunity-filter-mine', [], 'dts/crm'),
						fixed: CRMControlOpportunityList.isUserPortfolio,
						model: {
							value : {
								num_id: $rootScope.currentuser.idCRM,
								nom_usuar: $rootScope.currentuser['user-desc']
							}
						}
					}, {
						property: 'custom.myopportunities',
						value: '',
						title: $rootScope.i18n('l-opportunity-filter-open', [], 'dts/crm'),
						fixed: false
					}];

					if (CRMControlOpportunityList.isChild !== true) {
						var i,
							viewName = $rootScope.i18n('nav-opportunity', [], 'dts/crm'),
							viewController = 'crm.opportunity.list.control',
							startView = helper.startView(viewName, viewController, CRMControlOpportunityList),
							params = CRMControlOpportunityList.params,
							oppParam;

						/* parametros */
						if (CRMUtil.isDefined(serviceOpportunityParam.paramOpp)) {
							params = angular.copy(serviceOpportunityParam.paramOpp);
							serviceOpportunityParam.paramOpp = undefined;
						}

						if (params && params.length > 0) {
							oppParam = [];

							if (params[0].source === 'l-widget-opportunity-ranking') {

								if (params.length > 1) {
									oppParam.push({
										property: 'num_id',
										value: params[1].num_id.toString(),
										title: $rootScope.i18n('l-widget-opportunity-ranking', [], 'dts/crm'),
										fixed: false,
										model: {value: params[1].num_id.toString()}
									});

									for (i = 2; i < params.length; i++) {
										oppParam[0].value = oppParam[0].value + '|' + params[i].num_id;
										oppParam[0].model.value = oppParam[0].model.value + '|' + params[i].num_id;
									}

								}

							} else if (params[0].source === 'l-widget-opportunity-funnel') {
								oppParam.push({
									property: 'custom.funnel',
									value: JSON.stringify(params[0].value),
									title: $rootScope.i18n('l-widget-opportunity-funnel', [], 'dts/crm'),
									fixed: false,
									model: { value: JSON.stringify(params[0].value), property: 'custom.funnel' }
								});
							} else {
								oppParam.push({
									property: 'num_id_usuar_respons',
									value: params[0].num_id,
									title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + params[0].nom_usuar,
									fixed: CRMControlOpportunityList.isUserPortfolio,
									model: { value: params[0] }
								});
							}

							if ((params[0].source === 'l-widget-opportunity-funnel' || params[0].source === 'l-widget-opportunity-ranking') && CRMControlOpportunityList.isUserPortfolio) {
								oppParam.push({
									property: 'num_id_usuar_respons',
									value: $rootScope.currentuser.idCRM,
									title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + $rootScope.currentuser['user-desc'],
									fixed: CRMControlOpportunityList.isUserPortfolio,
									model: {
										value : {
											num_id: $rootScope.currentuser.idCRM,
											nom_usuar: $rootScope.currentuser['user-desc']
										}
									}
								});
							}
						}

						/* parametros */
						if (startView.isNewTab === true && oppParam === undefined) {
							CRMControlOpportunityList.loadDefaults([{
								property: 'num_id_usuar_respons',
								value: $rootScope.currentuser.idCRM,
								title: $rootScope.i18n('l-user-responsible', [], 'dts/crm') + ': ' + $rootScope.currentuser['user-desc'],
								fixed: CRMControlOpportunityList.isUserPortfolio,
								model: {
									value : {
										num_id: $rootScope.currentuser.idCRM,
										nom_usuar: $rootScope.currentuser['user-desc']
									}
								}
							}]);
						} else if (oppParam !== undefined && oppParam.length > 0) {
							CRMControlOpportunityList.loadDefaults(oppParam);
						}

						if (startView.isNewContext) {
							CRMControlOpportunityList.loadCustomFilters();
							CRMControlOpportunityList.search(false);
						}

					} else if (disclaimers) { //isChild === true
						CRMControlOpportunityList.parent = parent;
						CRMControlOpportunityList.loadDefaults(disclaimers);
						CRMControlOpportunityList.search(false);
					}

				});

			});

		};

		if ($rootScope.currentuserLoaded && !$rootScope.accountDetailModeLoading) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunityList = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlOpportunityList.init();
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlOpportunityList.init([{
				property: 'num_id_pessoa',
				value: account.num_id,
				title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + account.num_id + ' - ' + account.nom_razao_social +
					(account.cod_pessoa_erp ? ' (' + account.cod_pessoa_erp + ')' : ''),
				fixed: true
			}], {ttConta: account});
		});

		$scope.$on(CRMEvent.scopeDeleteOpportunityRemoveProcess, function (event, listProcess) {
			if (!listProcess || !angular.isArray(listProcess)) { return; }

			var i;
			for (i = 0; i < listProcess.length; i++) {
				if (listProcess[i].processo === 'opportunity') {
					CRMControlOpportunityList.deleteOpportunityInList(listProcess[i]);
				}
			}
		});
	};

	controllerOpportunityList.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.crm_oportun_vda.factory',
		'crm.opportunity.modal.advanced.search', 'crm.helper', 'crm.opportunity.helper',
		'crm.task.modal.edit', 'crm.history.modal.edit', 'crm.opportunity.modal.edit',
		'crm.filter.helper', '$location', 'crm.opportunity.param-service',
		'crm.user.modal.summary', 'crm.crm_param.factory', 'crm.send-email.modal',
		'crm.report.modal.available', 'crm.user.modal.preference', 'crm.mpd_fchdis0051.factory', 'crm.sales-order-cancel.modal', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.opportunity.param-service', serviceOpportunityParam);

	index.register.controller('crm.opportunity.list.control', controllerOpportunityList);
});
