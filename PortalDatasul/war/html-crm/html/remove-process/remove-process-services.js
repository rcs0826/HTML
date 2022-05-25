/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1005.js',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1054.js',
	'/dts/crm/js/api/fchcrm1056.js',
	'/dts/crm/js/api/fchcrm1058.js',
	'/dts/crm/html/remove-process/remove-process.advanced-search.js'
], function (index) {

	'use strict';

	var controllerRemoveProcess,
		serviceParamRemoveProcess;

	// *************************************************************************************
	// *** CONTROLLER REMOVE PROCESS
	// *************************************************************************************
	controllerRemoveProcess = function ($rootScope, $scope, removeprocessFactory, modalRemoveProcessAdvancedSearch,
										 helper, ticketFactory, accountFactory, historyFactory, opportunityFactory,
										 taskFactory, campaignFactory, segmentationFactory, attachmentFactory,
										 accountHelper, ticketHelper, taskHelper, opportunityHelper, attachmentHelper,
										 paramRemoveProcess, TOTVSEvent, targetFactory, $state) {
		var CRMControlRemoveProcess = this;

		this.isTask = false;

		this.disclaimers = [];
		this.listOfDisclaimers = {};

		this.listOfAccounts = [];
		this.listOfAttachments = [];
		this.listOfCampaigns = [];
		this.listOfHistories = [];
		this.listOfTickets = [];
		this.listOfOpportunities = [];
		this.listOfSegmentations = [];
		this.listOfTasks = [];
		this.listOfTargets = [];

		this.listOfAccountsCount = 0;
		this.lastAccountsLength = 0;
		this.listOfAttachmentsCount = 0;
		this.listOfCampaignsCount = 0;
		this.listOfHistoriesCount = 0;
		this.listOfTicketsCount = 0;
		this.listOfOpportunitiesCount = 0;
		this.listOfSegmentationsCount = 0;
		this.listOfTasksCount = 0;
		this.listOfTargetsCount = 0;

		this.basicFilter = {};
		this.listValues =  [];

		this.changeCombo = function () {
			var i, obj, disclaimers, getValues, processName;

			if (CRMUtil.isDefined(CRMControlRemoveProcess.comboSelected)) {
				processName = CRMControlRemoveProcess.comboSelected.name;
			}

			getValues = function (filters) {
				if (!filters) { return {}; }

				obj = {};

				for (i = 0; i < filters.length; i++) {
					switch (filters[i].property) {
					case 'num_id':
						obj.num_id = filters[i].value;
						break;
					case 'cod_livre_1':
						obj.cod_livre_1 = filters[i].value;
						break;
					case 'dat_cadastro':
						obj.dat_cadastro = filters[i].model.value;
						break;
					case 'dat_inic':
						obj.dat_inic = filters[i].model.value;
						break;
					case 'dat_abert':
						obj.dat_abert = filters[i].model.value;
						break;
					case 'dat_atualiz':
						obj.dat_atualiz = filters[i].model.value;
						break;
					}
				}

				return obj;
			};

			switch (processName) {
			case 'account':
				disclaimers = CRMControlRemoveProcess.listOfDisclaimers.account;
				CRMControlRemoveProcess.basicFilter.account = getValues(disclaimers);
				break;
			case 'attachment':
				disclaimers = CRMControlRemoveProcess.listOfDisclaimers.attachment;
				CRMControlRemoveProcess.basicFilter.attachment = getValues(disclaimers);
				break;
			case 'campaign':
				disclaimers = CRMControlRemoveProcess.listOfDisclaimers.campaign;
				CRMControlRemoveProcess.basicFilter.campaign = getValues(disclaimers);
				break;
			case 'history':
				disclaimers = CRMControlRemoveProcess.listOfDisclaimers.history;
				CRMControlRemoveProcess.basicFilter.history = getValues(disclaimers);
				break;
			case 'ticket':
				disclaimers = CRMControlRemoveProcess.listOfDisclaimers.ticket;
				CRMControlRemoveProcess.basicFilter.ticket = getValues(disclaimers);
				break;
			case 'opportunity':
				disclaimers = CRMControlRemoveProcess.listOfDisclaimers.opportunity;
				CRMControlRemoveProcess.basicFilter.opportunity = getValues(disclaimers);
				break;
			case 'segmentation':
				disclaimers = CRMControlRemoveProcess.listOfDisclaimers.segmentation;
				CRMControlRemoveProcess.basicFilter.segmentation = getValues(disclaimers);
				break;
			case 'task':
				disclaimers = CRMControlRemoveProcess.listOfDisclaimers.task;
				CRMControlRemoveProcess.basicFilter.task = getValues(disclaimers);
				break;
			case 'target':
				disclaimers = CRMControlRemoveProcess.listOfDisclaimers.target;
				CRMControlRemoveProcess.basicFilter.target = getValues(disclaimers);
				break;
			}

			this.disclaimers = disclaimers || [];

			if (CRMControlRemoveProcess.disclaimers && CRMControlRemoveProcess.disclaimers.length > 0) {
				CRMControlRemoveProcess.search(false);
			}
		};

		this.showMessageSuccess = function (processName) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-' + processName, [], 'dts/crm'),
				detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
			});
		};

		this.remove = function () {
			var i, processEvent, processName, addList, listProcess = [];

			if (CRMUtil.isDefined(CRMControlRemoveProcess.comboSelected)) {
				processName = CRMControlRemoveProcess.comboSelected.name;
			}

			addList = function (list, process) {
				for (i = 0; i < list.length; i++) {
					if (list[i].$selected === true) {
						listProcess.push({num_id: list[i].num_id, processo: process});
					}
				}
			};

			switch (processName) {
			case 'account':
				addList(CRMControlRemoveProcess.listOfAccounts, processName);
				processEvent = CRMEvent.scopeDeleteAccountRemoveProcess;

				break;
			case 'attachment':
				addList(CRMControlRemoveProcess.listOfAttachments, processName);
				processEvent = CRMEvent.scopeDeleteAttachmentRemoveProcess;
				break;
			case 'campaign':
				addList(CRMControlRemoveProcess.listOfCampaigns, processName);
				processEvent = CRMEvent.scopeDeleteCampaignRemoveProcess;
				break;
			case 'history':
				addList(CRMControlRemoveProcess.listOfHistories, processName);
				processEvent = CRMEvent.scopeDeleteHistoryRemoveProcess;
				break;
			case 'ticket':
				addList(CRMControlRemoveProcess.listOfTickets, processName);
				processEvent = CRMEvent.scopeDeleteTicketRemoveProcess;
				break;
			case 'opportunity':
				addList(CRMControlRemoveProcess.listOfOpportunities, processName);
				processEvent = CRMEvent.scopeDeleteOpportunityRemoveProcess;
				break;
			case 'segmentation':
				addList(CRMControlRemoveProcess.listOfSegmentations, processName);
				processEvent = CRMEvent.scopeDeleteSegmentationRemoveProcess;
				break;
			case 'task':
				addList(CRMControlRemoveProcess.listOfTasks, processName);
				processEvent = CRMEvent.scopeDeleteTaskRemoveProcess;
				break;
			case 'target':
				addList(CRMControlRemoveProcess.listOfTargets, processName);
				processEvent = CRMEvent.scopeDeleteTargetRemoveProcess;
				break;
			}

			if (listProcess.length < 1) { return; }

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete-process', [], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {

						removeprocessFactory.removeListOfProcess(listProcess, function (result) {
							if (result.$hasError) { return; }

							/*for (i = 0; i < listProcess.length; i++) {
								CRMControlRemoveProcess.deleteProcessInList(processName, listProcess[i]);
							}*/

							CRMControlRemoveProcess.search(false);
							$rootScope.$broadcast(processEvent, listProcess);
							CRMControlRemoveProcess.showMessageSuccess(processName);
						});
					}
				}
			});
		};

		this.deleteProcessInList = function (processName, process) {
			var index;

			switch (processName) {
			case 'account':
				index = CRMControlRemoveProcess.listOfAccounts.indexOf(process);
				if (index > -1) {
					CRMControlRemoveProcess.listOfAccounts.splice(index, 1);
					CRMControlRemoveProcess.listOfAccountsCount--;
				}
				break;
			case 'attachment':
				index = CRMControlRemoveProcess.listOfAccounts.indexOf(process);
				if (index > -1) {
					CRMControlRemoveProcess.listOfAccounts.splice(index, 1);
					CRMControlRemoveProcess.listOfAccountsCount--;
				}
				break;
			case 'campaign':
				index = CRMControlRemoveProcess.listOfAccounts.indexOf(process);
				if (index > -1) {
					CRMControlRemoveProcess.listOfAccounts.splice(index, 1);
					CRMControlRemoveProcess.listOfAccountsCount--;
				}
				break;
			case 'history':
				index = CRMControlRemoveProcess.listOfAccounts.indexOf(process);
				if (index > -1) {
					CRMControlRemoveProcess.listOfAccounts.splice(index, 1);
					CRMControlRemoveProcess.listOfAccountsCount--;
				}
				break;
			case 'ticket':
				index = CRMControlRemoveProcess.listOfAccounts.indexOf(process);
				if (index > -1) {
					CRMControlRemoveProcess.listOfAccounts.splice(index, 1);
					CRMControlRemoveProcess.listOfAccountsCount--;
				}
				break;
			case 'opportunity':
				index = CRMControlRemoveProcess.listOfAccounts.indexOf(process);
				if (index > -1) {
					CRMControlRemoveProcess.listOfAccounts.splice(index, 1);
					CRMControlRemoveProcess.listOfAccountsCount--;
				}
				break;
			case 'segmentation':
				index = CRMControlRemoveProcess.listOfAccounts.indexOf(process);
				if (index > -1) {
					CRMControlRemoveProcess.listOfAccounts.splice(index, 1);
					CRMControlRemoveProcess.listOfAccountsCount--;
				}
				break;
			case 'task':
				index = CRMControlRemoveProcess.listOfAccounts.indexOf(process);
				if (index > -1) {
					CRMControlRemoveProcess.listOfAccounts.splice(index, 1);
					CRMControlRemoveProcess.listOfAccountsCount--;
				}
				break;
			case 'target':
				index = CRMControlRemoveProcess.listOfTargets.indexOf(process);
				if (index > -1) {
					CRMControlRemoveProcess.listOfTargets.splice(index, 1);
					CRMControlRemoveProcess.listOfTargetsCount--;
				}
				break;
			}
		};

		this.parseModelToDisclaimers = function (basicFilters) {

			if (!basicFilters || CRMUtil.isUndefined(CRMControlRemoveProcess.comboSelected)) {
				return;
			}

			var i,
				index,
				key,
				model,
				fixed,
				processName = CRMControlRemoveProcess.comboSelected.name;

			this.disclaimers = [];

			for (key in basicFilters) {

				if (basicFilters.hasOwnProperty(key)) {

					model = basicFilters[key];

					if (CRMUtil.isUndefined(model)) { continue; }

					if (key === 'num_id') {

						index = this.disclaimers.push({
							property: 'num_id',
							value: model,
							title: $rootScope.i18n('l-code', [], 'dts/crm') + ': ' + model,
							model: {property: 'num_id', value: model}
						});

					} else if (key === 'cod_livre_1') {

						index = this.disclaimers.push({
							property: 'cod_livre_1',
							value: model,
							title: $rootScope.i18n('l-code', [], 'dts/crm') + ': ' + model,
							model: {property: 'cod_livre_1', value: model}
						});

					} else if (key === 'dat_cadastro' && CRMUtil.isDefined(model.start)) {
						index = this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_cadastro', 'l-date-create'));
					} else if (key === 'dat_inic' && CRMUtil.isDefined(model.start)) {
						index = this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_inic', 'l-date-start'));
					} else if (key === 'dat_abert' && CRMUtil.isDefined(model.start)) {
						index = this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_abert', 'l-date-opening'));
					} else if (key === 'dat_atualiz' && CRMUtil.isDefined(model.start)) {
						index = this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_atualiz', 'l-date-update'));
					}

					if (index !== undefined) {
						this.disclaimers[index - 1].basicSearch = true;
					}
				}
			}
		};

		this.search = function (isMore, isParseModelToDisclaimers) {

			if (CRMControlRemoveProcess.isPendingListSearch === true ||
					CRMUtil.isUndefined(CRMControlRemoveProcess.comboSelected)) {
				return;
			}

			var i,
				process,
				applyConfig,
				start = 0,
				count = 0,
				listOfSelectProcess = [],
				processName = CRMControlRemoveProcess.comboSelected.name,
				processFactory,
				options = {end: 50},
				filters = [];

			applyConfig = function (list, factory, basicFiltersApplied, callback) {
				start = list.length;
				listOfSelectProcess = list;
				processFactory = factory;

				if (isParseModelToDisclaimers === true) {
					CRMControlRemoveProcess.parseModelToDisclaimers(basicFiltersApplied);
				}

				if (callback) { callback(CRMControlRemoveProcess.disclaimers); }
			};

			switch (processName) {
			case 'account':
				applyConfig(CRMControlRemoveProcess.listOfAccounts, accountFactory, CRMControlRemoveProcess.basicFilter.account, function (result) {
					CRMControlRemoveProcess.listOfDisclaimers.account = result;
				});

				break;
			case 'attachment':
				applyConfig(CRMControlRemoveProcess.listOfAttachments, attachmentFactory, CRMControlRemoveProcess.basicFilter.attachment, function (result) {
					CRMControlRemoveProcess.listOfDisclaimers.attachment = result;
				});

				break;
			case 'campaign':
				applyConfig(CRMControlRemoveProcess.listOfCampaigns, campaignFactory, CRMControlRemoveProcess.basicFilter.campaign, function (result) {
					CRMControlRemoveProcess.listOfDisclaimers.campaign = result;
				});

				break;
			case 'history':
				applyConfig(CRMControlRemoveProcess.listOfHistories, historyFactory, CRMControlRemoveProcess.basicFilter.history, function (result) {
					CRMControlRemoveProcess.listOfDisclaimers.history = result;
				});

				break;
			case 'ticket':
				applyConfig(CRMControlRemoveProcess.listOfTickets, ticketFactory, CRMControlRemoveProcess.basicFilter.ticket, function (result) {
					CRMControlRemoveProcess.listOfDisclaimers.ticket = result;
				});

				break;
			case 'opportunity':
				applyConfig(CRMControlRemoveProcess.listOfOpportunities, opportunityFactory, CRMControlRemoveProcess.basicFilter.opportunity, function (result) {
					CRMControlRemoveProcess.listOfDisclaimers.opportunity = result;
				});

				break;
			case 'segmentation':
				applyConfig(CRMControlRemoveProcess.listOfSegmentations, segmentationFactory, CRMControlRemoveProcess.basicFilter.segmentation, function (result) {
					CRMControlRemoveProcess.listOfDisclaimers.segmentation = result;
				});

				break;
			case 'task':
				applyConfig(CRMControlRemoveProcess.listOfTasks, taskFactory, CRMControlRemoveProcess.basicFilter.task, function (result) {
					CRMControlRemoveProcess.listOfDisclaimers.task = result;
				});

				break;
			case 'target':
				applyConfig(CRMControlRemoveProcess.listOfTargets, targetFactory, CRMControlRemoveProcess.basicFilter.target, function (result) {
					CRMControlRemoveProcess.listOfDisclaimers.target = result;
				});

				break;
			}

			if (!isMore) {
				options.start = 0;
				listOfSelectProcess = [];
				CRMControlRemoveProcess.listOfAccounts = [];
				CRMControlRemoveProcess.listOfAttachments = [];
				CRMControlRemoveProcess.listOfCampaigns = [];
				CRMControlRemoveProcess.listOfHistories = [];
				CRMControlRemoveProcess.listOfTickets = [];
				CRMControlRemoveProcess.listOfOpportunities = [];
				CRMControlRemoveProcess.listOfSegmentations = [];
				CRMControlRemoveProcess.listOfTasks = [];
				CRMControlRemoveProcess.listOfTargets = [];
				CRMControlRemoveProcess.listOfAccountsCount = 0;
				CRMControlRemoveProcess.listOfAttachmentsCount = 0;
				CRMControlRemoveProcess.listOfCampaignsCount = 0;
				CRMControlRemoveProcess.listOfHistoriesCount = 0;
				CRMControlRemoveProcess.listOfTicketsCount = 0;
				CRMControlRemoveProcess.listOfOpportunitiesCount = 0;
				CRMControlRemoveProcess.listOfSegmentationsCount = 0;
				CRMControlRemoveProcess.listOfTasksCount = 0;
				CRMControlRemoveProcess.listOfTargetsCount = 0;
			} else {
				options.start = start;
			}

			options.type = 2; //lista

			filters = filters.concat(CRMControlRemoveProcess.disclaimers);

			if (filters === undefined || filters.length < 1) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: $rootScope.i18n('nav-' + processName, [], 'dts/crm'),
					detail: $rootScope.i18n('msg-form-validation-disclaimers', [], 'dts/crm')
				});
				return;
			}

			CRMControlRemoveProcess.isPendingListSearch = true;

			if (CRMUtil.isDefined(processFactory)) {
				processFactory.findRecords(filters, options, function (result) {

					for (i = 0; i < result.length; i++) {

						process = result[i];

						if (processName === 'account') {
							accountHelper.parsePersonType(process);
							accountHelper.parseAccountType(process);
							accountHelper.parseAccountColor(process);
							CRMControlRemoveProcess.lastAccountsLength = result.length;
						} else if (processName === 'ticket') {
							ticketHelper.parseTicketStatus(process);
						} else if (processName === 'task') {
							taskHelper.parseTaskColor(process);
						} else if (processName === 'opportunity') {
							opportunityHelper.parseOpportunityColor(process);
						} else if (processName === 'attachment') {
							attachmentHelper.parseAttachmentType(process);
						}

						if (process && process.$length) {
							count = process.$length;
						}

						listOfSelectProcess.push(process);
					}

					CRMControlRemoveProcess.isPendingListSearch = false;
					CRMControlRemoveProcess.parseListOfResultToSelectProcess(processName, listOfSelectProcess, count);

				});
			}
		};

		this.parseListOfResultToSelectProcess = function (processName, listOfSelectProcess, count) {

			switch (processName) {
			case 'account':
				CRMControlRemoveProcess.listOfAccounts = angular.copy(listOfSelectProcess);
				CRMControlRemoveProcess.listOfAccountsCount = count;
				break;
			case 'attachment':
				CRMControlRemoveProcess.listOfAttachments = angular.copy(listOfSelectProcess);
				CRMControlRemoveProcess.listOfAttachmentsCount = count;
				break;
			case 'campaign':
				CRMControlRemoveProcess.listOfCampaigns = angular.copy(listOfSelectProcess);
				CRMControlRemoveProcess.listOfCampaignsCount = count;
				break;
			case 'history':
				CRMControlRemoveProcess.listOfHistories = angular.copy(listOfSelectProcess);
				CRMControlRemoveProcess.listOfHistoriesCount = count;
				break;
			case 'ticket':
				CRMControlRemoveProcess.listOfTickets = angular.copy(listOfSelectProcess);
				CRMControlRemoveProcess.listOfTicketsCount = count;
				break;
			case 'opportunity':
				CRMControlRemoveProcess.listOfOpportunities = angular.copy(listOfSelectProcess);
				CRMControlRemoveProcess.listOfOpportunitiesCount = count;
				break;
			case 'segmentation':
				CRMControlRemoveProcess.listOfSegmentations = angular.copy(listOfSelectProcess);
				CRMControlRemoveProcess.listOfSegmentationsCount = count;
				break;
			case 'task':
				CRMControlRemoveProcess.listOfTasks = angular.copy(listOfSelectProcess);
				CRMControlRemoveProcess.listOfTasksCount = count;
				break;
			case 'target':
				CRMControlRemoveProcess.listOfTargets = angular.copy(listOfSelectProcess);
				CRMControlRemoveProcess.listOfTargetsCount = count;
				break;
			}

		};

		this.removeDisclaimer = function (disclaimer) {

			if (CRMControlRemoveProcess.isPendingListSearch === true ||
					CRMUtil.isUndefined(CRMControlRemoveProcess.comboSelected)) {
				return;
			}

			var index, removeFilter, processName = CRMControlRemoveProcess.comboSelected.name;

			removeFilter = function (filters) {
				index = filters.indexOf(disclaimer);

				if (index !== -1) {
					filters.splice(index, 1);
				}
			};

			switch (processName) {
			case 'account':
				removeFilter(CRMControlRemoveProcess.listOfDisclaimers.account);
				break;
			case 'attachment':
				removeFilter(CRMControlRemoveProcess.listOfDisclaimers.attachment);
				break;
			case 'campaign':
				removeFilter(CRMControlRemoveProcess.listOfDisclaimers.campaign);
				break;
			case 'history':
				removeFilter(CRMControlRemoveProcess.listOfDisclaimers.history);
				break;
			case 'ticket':
				removeFilter(CRMControlRemoveProcess.listOfDisclaimers.ticket);
				break;
			case 'opportunity':
				removeFilter(CRMControlRemoveProcess.listOfDisclaimers.opportunity);
				break;
			case 'segmentation':
				removeFilter(CRMControlRemoveProcess.listOfDisclaimers.segmentation);
				break;
			case 'task':
				removeFilter(CRMControlRemoveProcess.listOfDisclaimers.task);
				break;
			case 'target':
				removeFilter(CRMControlRemoveProcess.listOfDisclaimers.target);
				break;
			}

			index = CRMControlRemoveProcess.disclaimers.indexOf(disclaimer);
			if (index !== -1) {
				CRMControlRemoveProcess.disclaimers.splice(index, 1);
			}

			CRMControlRemoveProcess.search(false);
		};

		this.clearBasicFilters = function (processName) {

			switch (processName) {
			case 'account':
				CRMControlRemoveProcess.basicFilter.account.num_id = undefined;
				CRMControlRemoveProcess.basicFilter.account.dat_cadastro = {};
				break;
			case 'attachment':
				CRMControlRemoveProcess.basicFilter.attachment.num_id = undefined;
				CRMControlRemoveProcess.basicFilter.attachment.dat_atualiz = {};
				break;
			case 'campaign':
				CRMControlRemoveProcess.basicFilter.campaign.num_id = undefined;
				CRMControlRemoveProcess.basicFilter.campaign.dat_inic = {};
				break;
			case 'history':
				CRMControlRemoveProcess.basicFilter.history.num_id = undefined;
				CRMControlRemoveProcess.basicFilter.history.dat_inic = {};
				break;
			case 'ticket':
				CRMControlRemoveProcess.basicFilter.ticket.cod_livre_1 = undefined;
				CRMControlRemoveProcess.basicFilter.ticket.dat_abert = {};
				break;
			case 'opportunity':
				CRMControlRemoveProcess.basicFilter.opportunity.num_id = undefined;
				CRMControlRemoveProcess.basicFilter.opportunity.dat_cadastro = {};
				break;
			case 'segmentation':
				CRMControlRemoveProcess.basicFilter.segmentation.num_id = undefined;
				CRMControlRemoveProcess.basicFilter.segmentation.dat_cadastro = {};
				break;
			case 'task':
				CRMControlRemoveProcess.basicFilter.task.num_id = undefined;
				CRMControlRemoveProcess.basicFilter.task.dat_inic = {};
				break;
			case 'target':
				CRMControlRemoveProcess.basicFilter.target.num_id = undefined;
				CRMControlRemoveProcess.basicFilter.target.dat_cadastro = {};
				break;
			}

		};

		this.openAdvancedSearch = function () {
			var i, disclaimers = [], detail;

			if (CRMUtil.isUndefined(CRMControlRemoveProcess.comboSelected) ||
					CRMUtil.isUndefined(CRMControlRemoveProcess.comboSelected.name) ||
					CRMControlRemoveProcess.comboSelected.name === 'campaign') {

				if (CRMUtil.isDefined(CRMControlRemoveProcess.comboSelected) &&
						CRMControlRemoveProcess.comboSelected.name === 'campaign') {
					detail = $rootScope.i18n('l-campaign-advanced-search', [], 'dts/crm');
				} else {
					detail = $rootScope.i18n('l-select-process', [], 'dts/crm');
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'info',
					title:  $rootScope.i18n('nav-remove-process', [], 'dts/crm'),
					detail: detail
				});

				return;
			}


			for (i = 0; i < CRMControlRemoveProcess.disclaimers.length; i++) {
				if (CRMControlRemoveProcess.disclaimers[i].basicSearch !== true) {
					disclaimers.push(CRMControlRemoveProcess.disclaimers[i]);
				}
			}

			modalRemoveProcessAdvancedSearch.open({
				disclaimers: disclaimers,
				processName: CRMControlRemoveProcess.comboSelected.name
			}).then(function (result) {
				CRMControlRemoveProcess.clearBasicFilters(CRMControlRemoveProcess.comboSelected.name);
				CRMControlRemoveProcess.disclaimers = result.disclaimers || [];
				CRMControlRemoveProcess.search(false);
			});
		};

		this.loadItemDetail = function (process) {
			if (CRMUtil.isUndefined(CRMControlRemoveProcess.comboSelected) ||
					CRMUtil.isUndefined(CRMControlRemoveProcess.comboSelected.name)) {
				return;
			}

			var processName = CRMControlRemoveProcess.comboSelected.name;

			switch (processName) {
			case 'campaign':
				campaignFactory.getDescription(process.num_id, function (result) {
					process.dsl_campanha = result.dsl_campanha;
				});
				break;
			case 'history':
				historyFactory.getDescription(process.num_id, function (result) {
					process.dsl_histor_acao = result.dsl_histor_acao;
				});
				break;
			case 'ticket':
				ticketFactory.getSituation(process.num_id, function (result) {
					process.dsl_sit = result.dsl_sit;
				});
				break;
			case 'task':
				taskFactory.getDescription(process.num_id, function (result) {
					process.dsl_motivo = result.dsl_motivo;
				});
				break;
			}
		};

		this.init = function () {
			var viewName = $rootScope.i18n('nav-remove-process', [], 'dts/crm'),
				startView,
				viewController = 'crm.remove-process.control';

			/* somente opcao remover tarefa */
			CRMControlRemoveProcess.isTask = $state.is('dts/crm/remove-process.task');
			if (CRMControlRemoveProcess.isTask === true) {
				viewName = $rootScope.i18n('nav-remove-task', [], 'dts/crm');
				CRMControlRemoveProcess.listValues = [{ index: 0, name: 'task', description: 'nav-task' }];
				CRMControlRemoveProcess.comboSelected = CRMControlRemoveProcess.listValues[0];
				CRMControlRemoveProcess.changeCombo();
			} else {
				CRMControlRemoveProcess.listValues =  [
					{ index: 0, name: 'attachment', description: 'nav-attachment' },
					{ index: 1, name: 'campaign', description: 'nav-campaign' },
					{ index: 2, name: 'account', description: 'nav-account' },
					{ index: 3, name: 'history', description: 'nav-history' },
					{ index: 4, name: 'ticket', description: 'nav-ticket' },
					{ index: 5, name: 'opportunity', description: 'nav-opportunity' },
					{ index: 6, name: 'target', description: 'nav-target' },
					{ index: 7, name: 'segmentation', description: 'nav-segmentation' },
					{ index: 8, name: 'task', description: 'nav-task' }
				];
			}

			helper.loadCRMContext(function () {

				startView = helper.startView(viewName, viewController, CRMControlRemoveProcess);

				if (startView.isNewContext !== true) {
					if (CRMControlRemoveProcess.disclaimers && CRMControlRemoveProcess.disclaimers.length > 0) {
						CRMControlRemoveProcess.search(false);
					}
				} else {
					controllerRemoveProcess.basicFilter = {
						account: {},
						ticket: {},
						opportunity: {},
						task: {},
						history: {},
						segmentation: {},
						attachment: {},
						target: {}
					};
				}

			});

		};

		this.init();
	};

	controllerRemoveProcess.$inject = [
		'$rootScope', '$scope', 'crm.crm_removeprocess.factory', 'crm.remove-process.modal.advanced.search',
		'crm.helper', 'crm.crm_ocor.factory', 'crm.crm_pessoa.conta.factory', 'crm.crm_histor_acao.factory',
		'crm.crm_oportun_vda.factory', 'crm.crm_tar.factory', 'crm.crm_campanha.factory', 'crm.crm_segmtcao.factory',
		'crm.crm_anexo.factory', 'crm.account.helper', 'crm.ticket.helper', 'crm.task.helper', 'crm.opportunity.helper',
		'crm.attachment.helper', 'crm.remove-process.param-service', 'TOTVSEvent', 'crm.crm_public.factory', '$state'
	];

	// *************************************************************************************
	// *** SERVICE PARAMETERS REMOVE PROCESS
	// *************************************************************************************
	serviceParamRemoveProcess = function () {
		var controllerTicketParam = this;

		this.parameters = {};

		this.setParam = function (param, callback) {
			controllerTicketParam.parameters = param;
			if (callback) { callback(); }
		};
	}; // serviceParamRemoveProcess

	serviceParamRemoveProcess.$inject = [];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.remove-process.param-service', serviceParamRemoveProcess);

	index.register.controller('crm.remove-process.control', controllerRemoveProcess);
});
