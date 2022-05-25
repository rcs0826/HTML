/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/api/fchcrm1021.js',
	'/dts/crm/js/api/fchcrm1022.js',
	'/dts/crm/js/api/fchcrm1028.js',
	'/dts/crm/js/api/fchcrm1031.js',
	'/dts/crm/js/api/fchcrm1032.js',
	'/dts/crm/js/api/fchcrm1033.js',
	'/dts/crm/js/api/fchcrm1034.js',
	'/dts/crm/js/api/fchcrm1035.js',
	'/dts/crm/js/api/fchcrm1036.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/attachment/attachment-services.js',
	'/dts/crm/html/ticket/tag/tag-services.js',
	'/dts/crm/html/ticket/symptom/symptom-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTicketList,
		serviceTicketParam;

	serviceTicketParam = function () {

		var self = this;

		this.paramTicket = undefined;

		this.setParamTicket = function (param, callback) {
			self.paramTicket = param;
			if (callback) { callback(); }
		};
	};

	serviceTicketParam.$inject = [];

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
	controllerTicketList = function ($rootScope, $scope, ticketFactory, TOTVSEvent, helper, serviceTicketParam,
								   modalUserSummary, ticketHelper, accountSummaryModal, modalTicketAdvancedSearch,
								   modalTaskEdit, modalTicketEdit, $location, modalHistoryEdit, filterHelper,
								   modalEmailEdit, modalReportAvailable, userPreferenceModal, accessRestrictionFactory,
								   appViewService, preferenceFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketList = this;

		this.listOfTickets = [];
		this.listOfTicketCount = 0;

		this.disclaimers = [];
		this.fixedDisclaimers = [];

		this.parent    = undefined;
		this.isEnabled = true;

		this.isDeleteAvailable = false;

		this.selectedOrderBy = undefined;
		this.listOfOrderBy = undefined;
		/*
		this.listOfOrderBy = [
			{title:$rootScope.i18n('l-date-create', [], 'dts/crm'),property:'dat_abert'},
			{title:$rootScope.i18n('l-code', [], 'dts/crm'),property:'cod_livre_1'},
			{title:$rootScope.i18n('l-status', [], 'dts/crm'),property:'dat_abert'},
			{title:$rootScope.i18n('l-user-responsible', [], 'dts/crm'),property:'num_id_recur'},
			{title:$rootScope.i18n('l-account', [], 'dts/crm'),property:'num_id_pessoa'},
			{title:$rootScope.i18n('l-priority', [], 'dts/crm'),property:'num_id_priorid_ocor'},
			{title:$rootScope.i18n('l-type', [], 'dts/crm'),property:'num_id_tip_ocor'},
		];*/

		this.listOfCustomFilters = [];

		this.quickFilters = [];

		this.isPortal = typeof (APP_BASE_URL) !== "undefined" ? (APP_BASE_URL.indexOf('/portal/') >= 0) : false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.removeCustomFilter = function (filter) {
			filterHelper.remove('nav-ticket', ticketHelper.filtersGroup, filter, function () {
				filterHelper.get(ticketHelper.filtersGroup, undefined, function (result) {
					CRMControlTicketList.listOfCustomFilters = result || [];
				});
			});
		};

		this.saveCustomFilter = function (filter) {
			filterHelper.save('nav-ticket', ticketHelper.filtersGroup, filter, function () {
				filterHelper.get(ticketHelper.filtersGroup, undefined, function (result) {
					CRMControlTicketList.listOfCustomFilters = result || [];
				});
			});
		};

		this.addEditCustomFilters = function (filter) {

			modalTicketAdvancedSearch.open({
				fixedDisclaimers: CRMControlTicketList.fixedDisclaimers,
				customFilter: filter,
				isAddEditMode: true,
				customFilterList: CRMControlTicketList.listOfCustomFilters
			}).then(function (result) {

				if (!result) { return; }

				CRMControlTicketList.saveCustomFilter(result.customFilter);

				if (result.apply === true) {

					CRMControlTicketList.quickSearchText = undefined;

					CRMControlTicketList.disclaimers = result.disclaimers;
					CRMControlTicketList.fixedDisclaimers = result.fixedDisclaimers;

					CRMControlTicketList.search(false);
				}
			});
		};

		this.selectOrderBy = function (order) {

			if (!order) { return; }

			CRMControlTicketList.selectedOrderBy = order;
			CRMControlTicketList.search(false);
		};

		this.selectQuickFilter = function (filters) {
			filterHelper.selectQuickFilter(
				filters,
				CRMControlTicketList.disclaimers,
				CRMControlTicketList.fixedDisclaimers,
				function (newDisclaimers) {
					CRMControlTicketList.disclaimers = newDisclaimers.disclaimers;
					CRMControlTicketList.fixedDisclaimers = newDisclaimers.fixedDisclaimers;
					CRMControlTicketList.quickSearchText = undefined;
					CRMControlTicketList.search(false);
				}
			);
		};

		this.loadPreferences = function (callback) {
			var control = CRMControlTicketList,
				icount  = 0,
				itotal  = 2;

			ticketFactory.isDeleteAvailable(function (result) {
				icount++;
				if (!result) { return; }
				control.isDeleteAvailable = result.l_ok;
				if (icount >= itotal) {
					if (callback) { callback() };
				}
			});

			preferenceFactory.isIntegratedWithGP(function (result) {
				icount++;
				if (result) { control.isIntegratedWithGP = result;}
				if (icount >= itotal) {
					if (callback) { callback() };
				}
			});			
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

		this.loadItemDetail = function (ticket) {
			if (ticket.log_sit !== true) {
				ticket.log_sit = true;
				ticketFactory.getSituation(ticket.num_id, function (result) {
					if (result) { ticket.dsl_sit = result.dsl_sit; }
				});
			}
		};

		this.removeDisclaimer = function (disclaimer) {

			var i,
				index = CRMControlTicketList.disclaimers.indexOf(disclaimer);
			if (index !== -1) {
				CRMControlTicketList.disclaimers.splice(index, 1);
				for (i = 0; i < CRMControlTicketList.fixedDisclaimers.length; i++) {
					if (CRMControlTicketList.fixedDisclaimers[i].property === disclaimer.property) {
						CRMControlTicketList.disclaimers.push(CRMControlTicketList.fixedDisclaimers[i]);
						break;
					}
				}
				CRMControlTicketList.search(false);
			}
		};

		this.parseQuickFilter = function (filters) {

			if (CRMUtil.isDefined(CRMControlTicketList.quickSearchText) && CRMControlTicketList.quickSearchText.toString().trim().length > 0) {

				CRMControlTicketList.disclaimers = [];
				CRMControlTicketList.loadDefaults();

				filters.push({
					property: "custom.quick_search",
					value:  helper.parseStrictValue(CRMControlTicketList.quickSearchText)
				});

			}
		};

		this.search = function (isMore) {

			if (CRMControlTicketList.isPendingListSearch === true) {
				return;
			}

			CRMControlTicketList.listOfTicketCount = 0;

			if (!isMore) {
				CRMControlTicketList.listOfTickets = [];
			}

			var filters = [],
				options = {
					start: CRMControlTicketList.listOfTickets.length,
					end: (CRMControlTicketList.isChild === true ? 10 : 50)
				};

			if (CRMControlTicketList.selectedOrderBy) {
				options.orderBy = CRMControlTicketList.selectedOrderBy.property;
				options.asc = CRMControlTicketList.selectedOrderBy.asc;
			}

			CRMControlTicketList.parseQuickFilter(filters);

			filters = filters.concat(this.disclaimers);

			CRMControlTicketList.isPendingListSearch = true;

			ticketFactory.findRecords(filters, options, function (result) {
				CRMControlTicketList.addTicketInList(result);
				CRMControlTicketList.isPendingListSearch = false;
			});
		};

		this.openUserSummary = function (user) {
			if (user && user.num_id) {
				modalUserSummary.open({
					model: user,
					isResource: (user.num_id_usuar > 0) ? true : false
				});
			}
		};

		this.openAccountSummary = function (ticket) {
			if (ticket && ticket.ttConta && ticket.ttConta.num_id) {
				accountSummaryModal.open({
					model: ticket.ttConta,
					isAccount: true
				});
			}
		};

		this.openAdvancedSearch = function () {
			modalTicketAdvancedSearch.open({
				disclaimers: CRMControlTicketList.disclaimers,
				fixedDisclaimers: CRMControlTicketList.fixedDisclaimers,
				isChild: CRMControlTicketList.parent ? true : false
			}).then(function (result) {
				CRMControlTicketList.quickSearchText = undefined;
				CRMControlTicketList.disclaimers = result.disclaimers;
				CRMControlTicketList.fixedDisclaimers = result.fixedDisclaimers;
				CRMControlTicketList.search(false);
			});
		};

		this.registerAction = function (ticket) {
			modalHistoryEdit.open({
				history: {
					ttOcorrenciaOrigem: ticket
				}
			});
		};

		this.registerTask = function (ticket) {
			modalTaskEdit.open({
				task: {
					ttConta: ticket.ttConta,
					ttOcorrenciaOrigem: ticket
				},
				defaults: {
					num_id_contat: ticket.ttConta.num_id_pto_focal
				},
				canOverrideAccount: false
			});
		};

		this.edit = function (ticket) {
			var param = (ticket ? {ticket: ticket, editMode: true} : {});
			modalTicketEdit.open(param).then(function (result) {
				if (!result) { return; }
				CRMControlTicketList.updateTicketInList(result, ticket);
			});
		};

		this.removeTicketInList = function (ticket) {
			var index = this.listOfTickets.indexOf(ticket);
			this.listOfTickets.splice(index, 1);
			this.listOfTicketCount--;
		};

		this.updateTicketInList = function (ticket, oldTicket) {
			ticketHelper.parseTicketStatus(ticket);
			var index = this.listOfTickets.indexOf(oldTicket);
			this.listOfTickets[index] = ticket;
		};

		this.addTicketInList = function (tickets, isNew) {

			var i,
				ticket;

			if (!tickets) { return; }

			if (!angular.isArray(tickets)) {
				tickets = [tickets];
				CRMControlTicketList.listOfTicketCount++;
			}

			for (i = 0; i < tickets.length; i++) {

				ticket = tickets[i];

				if (ticket && ticket.$length) {
					CRMControlTicketList.listOfTicketCount = ticket.$length;
				}

				ticketHelper.parseTicketStatus(ticket);

				if (isNew === true) {
					CRMControlTicketList.listOfTickets.unshift(ticket);
				} else {
					CRMControlTicketList.listOfTickets.push(ticket);
				}
			}
		};

		this.add = function (ticket) {

			var param = {
				ticket: (this.isChild === true ? this.parent : {}),
				canOverrideAccount: false
			};

			modalTicketEdit.open(param).then(function (result) {
				if (!result) { return; }
				CRMControlTicketList.addTicketInList(result, true);
			});
		};

		this.remove = function (ticket) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete-ticket', [
					ticket.num_id
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }

					ticketFactory.deleteRecord(ticket.num_id, function (result) {

						if (result.$hasError === true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-ticket', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						CRMControlTicketList.removeTicketInList(ticket);
					});
				}
			});
		};

		this.reopen = function (ticket) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-reopen', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-reopen', [
					ticket.num_id, ticket.nom_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					ticketFactory.reopenTicket(ticket.num_id, ticket.num_id_recur, function (result) {

						if (!result) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-success-ticket-reopen', [], 'dts/crm')
						});

						$location.path('/dts/crm/ticket/detail/' + result.num_id);
					});
				}
			});
		};

		this.duplicate = function (ticket) {

			var param = (ticket ? {ticket: ticket, duplicateMode: true} : undefined);

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('btn-duplicate', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-duplicate', [
					ticket.num_id
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }
					modalTicketEdit.open(param);
				}
			});
		};

		this.loadCustomFilters = function () {
			filterHelper.get(ticketHelper.filtersGroup, undefined, function (result) {
				CRMControlTicketList.listOfCustomFilters = result || [];
			});
		};

		this.sendEmail = function (ticket) {
			modalEmailEdit.open({ model: { ttOcorrenciaOrigem: ticket } });
		};

		this.showReports = function () {
			modalReportAvailable.open({ num_id: 7, nom_modul_crm: 'l-module-support' });
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'ticket.list' });
		};

		this.print = ticketFactory.print;

		this.exportSearch = function () {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-attention', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('l-no', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('l-yes', [], 'dts/crm'),
				text: $rootScope.i18n('msg-export-report', [], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					var filters = [], entity;

					CRMControlTicketList.parseQuickFilter(filters);
					filters = filters.concat(CRMControlTicketList.disclaimers);

					ticketFactory.exportSearch(filters, isPositiveResult);
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (disclaimers, parent, isEnabled) {
			var params, filter, pageActive;

			helper.loadCRMContext(function () {

				accessRestrictionFactory.getUserRestrictions('ticket.list', $rootScope.currentuser.login, function (result) {
					CRMControlTicketList.accessRestriction = result || {};
				});

				CRMControlTicketList.quickFilters = [{
					property: 'num_id_recur',
					value: $rootScope.currentuser.idResource,
					title: $rootScope.i18n('l-ticket-filter-mine', [], 'dts/crm'),
					fixed: false,
					model: {
						value : {
							num_id: $rootScope.currentuser.idCRM,
							nom_usuar: $rootScope.currentuser['user-desc'],
							num_id_recur: $rootScope.currentuser.idResource
						}
					}
				}, {
					property: 'num_id_usuar_abert',
					value: $rootScope.currentuser.idCRM,
					title: $rootScope.i18n('l-ticket-filter-open-by-myself', [], 'dts/crm'),
					fixed: false
				}, {
					property: 'dat_fechto',
					value: '',
					title: $rootScope.i18n('l-ticket-filter-open', [], 'dts/crm'),
					fixed: false
				}];

				if (CRMControlTicketList.isChild !== true) {

					var viewName = $rootScope.i18n('nav-ticket', [], 'dts/crm'),
						startView,
						viewController = 'crm.ticket.list.control',
						i;

					startView = helper.startView(viewName, viewController, CRMControlTicketList);

					if (CRMUtil.isDefined(serviceTicketParam.paramTicket)) {

						params = angular.copy(serviceTicketParam.paramTicket);
						serviceTicketParam.paramTicket = undefined;
						filter = [];

						if (params && angular.isArray(params) && params.length > 0) {

							if (params[0].source === 'l-widget-ticket-open-closed') {
								filter.push({
									property: 'custom.dashboard',
									title: $rootScope.i18n('l-widget-ticket-open-closed', [], 'dts/crm'),
									fixed: false,
									model: { property: 'custom.dashboard' }
								});

								if (CRMUtil.isDefined(params[0].lineId)) {
									filter[0].value = {
										dsDashboardData: {
											ttDashboardData: [{
												id: params[0].value,
												startDate: params[0].startDate.toString(),
												endDate: params[0].endDate.toString(),
												lineId: params[0].lineId,
												num_id_pessoa: params[0].num_id_pessoa
											}]
										}
									};
								} else {
									filter[0].value = params[0].value;

									if (CRMUtil.isDefined(params[0].num_id_pessoa)) {
										filter[0].value = filter[0].value + '|' + params[0].num_id_pessoa;
									}
								}

								filter[0].model.value = filter[0].value;

							} else if (params[0].source === 'l-widget-ticket-summary') {
								filter.push({
									property: 'custom.dashboard-ticket-summary',
									title: $rootScope.i18n('l-widget-ticket-summary', [], 'dts/crm'),
									fixed: false
								});

								if (params[0].model !== 0) {
									filter[0].value = params[0].model;
								} else {
									filter[0].value = params[0].value;
								}

							}
						}
					}

					if (startView.isNewTab === true && filter === undefined) {
						CRMControlTicketList.loadDefaults([{
							property: 'num_id_recur',
							value: $rootScope.currentuser.idResource,
							title: $rootScope.i18n('l-ticket-filter-mine', [], 'dts/crm'),
							fixed: false,
							model: {
								value : {
									num_id: $rootScope.currentuser.idCRM,
									nom_usuar: $rootScope.currentuser['user-desc'],
									num_id_recur: $rootScope.currentuser.idResource
								}
							}
						}]);
					} else if (filter !== undefined) {
						CRMControlTicketList.loadDefaults(filter);
					}

					if (startView.isNewContext) {

						CRMControlTicketList.loadCustomFilters();

						CRMControlTicketList.loadPreferences(function() {
							if (CRMControlTicketList.isIntegratedWithGP === true) {
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'warning',
									title: $rootScope.i18n('l-ticket'),
									detail: $rootScope.i18n('msg-warning-use-ticket-gp', [], 'dts/crm/')
								});

								//Se GPS estiver ativo n deve usar essa tela e sim a ocorrencia gp
								pageActive = appViewService.getPageActive();
								appViewService.releaseConsume(pageActive);
								appViewService.removeView(pageActive);
								//----
							}
						});

						CRMControlTicketList.search(false);
					}

				} else if (disclaimers) {

					CRMControlTicketList.parent = parent;
					CRMControlTicketList.isEnabled = (isEnabled !== false);

					CRMControlTicketList.loadCustomFilters();
					CRMControlTicketList.loadPreferences();

					CRMControlTicketList.loadDefaults(disclaimers);
					CRMControlTicketList.search(false);
				}
			});

		};

		if ($rootScope.currentuserLoaded && !$rootScope.accountDetailModeLoading) {
			this.init();
			ticketFactory.verifyTicketProduct();
		}

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketList = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlTicketList.init([{
				property: 'num_id_pessoa',
				value: account.num_id,
				title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + account.num_id + ' - ' + account.nom_razao_social +
					(account.cod_pessoa_erp ? ' (' + account.cod_pessoa_erp + ')' : ''),
				fixed: true
			}], {ttConta: account});
		});

		$scope.$on(CRMEvent.scopeSaveHistoryOnChangeTicketStatus, function (event, ticket) {
			if (ticket) {
				ticketFactory.getRecord(ticket.num_id, function (newTicket) {
					ticketHelper.parseTicketStatus(newTicket);
					CRMControlTicketList.updateTicketInList(newTicket, ticket);
				});
			}
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlTicketList.init();
		});

		$scope.$on(CRMEvent.scopeDeleteTicketRemoveProcess, function (event, listProcess) {
			if (!listProcess || !angular.isArray(listProcess)) { return; }

			var i;
			for (i = 0; i < listProcess.length; i++) {
				if (listProcess[i].processo === 'ticket') {
					CRMControlTicketList.removeTicketInList(listProcess[i]);
				}
			}
		});
	};


	controllerTicketList.$inject = [
		'$rootScope', '$scope', 'crm.crm_ocor.factory', 'TOTVSEvent', 'crm.helper', 'crm.ticket.param-service',
		'crm.user.modal.summary', 'crm.ticket.helper', 'crm.account.modal.summary', 'crm.ticket.modal.advanced.search',
		'crm.task.modal.edit', 'crm.ticket.modal.edit', '$location', 'crm.history.modal.edit', 'crm.filter.helper',
		'crm.send-email.modal', 'crm.report.modal.available', 'crm.user.modal.preference', 'crm.crm_acess_portal.factory',
		'totvs.app-main-view.Service', 'crm.crm_param.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.ticket.param-service', serviceTicketParam);

	index.register.controller('crm.ticket.list.control', controllerTicketList);
});
