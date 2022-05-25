/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1005.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/task/task-services.advanced-search.js',
	'/dts/crm/html/task/task-services.calendar.js',
	'/dts/crm/html/task/task-services.detail.js',
	'/dts/crm/html/task/task-services.edit.js',
	'/dts/crm/html/task/task-services.list.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/attachment/attachment-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/html/expense/expense-services.edit.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerHistoryList;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controllerHistoryList = function ($rootScope, $scope, TOTVSEvent, historyFactory, historyHelper,
								   modalHistoryAdvancedSearch, modalHistoryEdit,
								   helper, filterHelper, modalUserSummary, modalEmailEdit,
								   modalReportAvailable, userPreferenceModal, modalExpenseEdit, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlHistoryList = this;

		this.listOfHistory = [];
		this.listOfHistoryCount = 0;

		this.accessRestriction = undefined;

		this.disclaimers = [];
		this.fixedDisclaimers = [];

		this.parent    = undefined;
		this.isEnabled = true;

		this.selectedOrderBy = undefined;
		this.listOfOrderBy = undefined;
		/*
		this.listOfOrderBy = [
			{title:$rootScope.i18n('l-campaign', [], 'dts/crm'),property:'num_id_campanha'},
			{title:$rootScope.i18n('l-result', [], 'dts/crm'),property:'num_id_restdo'},
			{title:$rootScope.i18n('l-account', [], 'dts/crm'),property:'num_id_pessoa'},
			{title:$rootScope.i18n('l-date-create', [], 'dts/crm'),property:'dat_inic'}
		];*/

		this.listOfCustomFilters = [];

		this.quickFilters = [];

		this.isPortal =  typeof (APP_BASE_URL) !== "undefined" ? (APP_BASE_URL.indexOf('/portal/') >= 0) : false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.removeCustomFilter = function (filter) {
			filterHelper.remove('nav-history', historyHelper.filtersGroup, filter, function () {
				filterHelper.get(historyHelper.filtersGroup, undefined, function (result) {
					CRMControlHistoryList.listOfCustomFilters = result || [];
				});
			});
		};

		this.saveCustomFilter = function (filter) {
			filterHelper.save('nav-history', historyHelper.filtersGroup, filter, function () {
				filterHelper.get(historyHelper.filtersGroup, undefined, function (result) {
					CRMControlHistoryList.listOfCustomFilters = result || [];
				});
			});
		};

		this.addEditCustomFilters = function (filter) {

			modalHistoryAdvancedSearch.open({
				fixedDisclaimers: CRMControlHistoryList.fixedDisclaimers,
				customFilter: filter,
				isAddEditMode: true,
				customFilterList: CRMControlHistoryList.listOfCustomFilters
			}).then(function (result) {

				if (!result) { return; }

				CRMControlHistoryList.saveCustomFilter(result.customFilter);

				if (result.apply === true) {

					CRMControlHistoryList.quickSearchText = undefined;

					CRMControlHistoryList.disclaimers = result.disclaimers;
					CRMControlHistoryList.fixedDisclaimers = result.fixedDisclaimers;

					CRMControlHistoryList.search(false);
				}
			});
		};

		this.selectOrderBy = function (order) {

			if (!order) { return; }

			CRMControlHistoryList.selectedOrderBy = order;

			CRMControlHistoryList.search(false);
		};

		this.selectQuickFilter = function (filters) {
			filterHelper.selectQuickFilter(
				filters,
				CRMControlHistoryList.disclaimers,
				CRMControlHistoryList.fixedDisclaimers,
				function (newDisclaimers) {
					CRMControlHistoryList.disclaimers = newDisclaimers.disclaimers;
					CRMControlHistoryList.fixedDisclaimers = newDisclaimers.fixedDisclaimers;
					CRMControlHistoryList.quickSearchText = undefined;
					CRMControlHistoryList.search(false);
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

		this.openAdvancedSearch = function () {
			modalHistoryAdvancedSearch.open({
				disclaimers: CRMControlHistoryList.disclaimers,
				fixedDisclaimers: CRMControlHistoryList.fixedDisclaimers,
				isChild: CRMControlHistoryList.parent ? true : false
			}).then(function (result) {
				CRMControlHistoryList.quickSearchText = undefined;
				CRMControlHistoryList.disclaimers = result.disclaimers;
				CRMControlHistoryList.fixedDisclaimers = result.fixedDisclaimers;
				CRMControlHistoryList.search(false);
			});
		};

		this.removeDisclaimer = function (disclaimer) {
			var i,
				index = CRMControlHistoryList.disclaimers.indexOf(disclaimer);

			if (index !== -1) {
				CRMControlHistoryList.disclaimers.splice(index, 1);
				for (i = 0; i < CRMControlHistoryList.fixedDisclaimers.length; i++) {
					if (CRMControlHistoryList.fixedDisclaimers[i].property === disclaimer.property) {
						CRMControlHistoryList.disclaimers.push(CRMControlHistoryList.fixedDisclaimers[i]);
						break;
					}
				}
				CRMControlHistoryList.search(false);
			}
		};

		this.loadItemDetail = function (history) {
			historyFactory.getDescription(history.num_id, function (result) {
				history.dsl_histor_acao = result.dsl_histor_acao;
			});
		};

		this.search = function (isMore) {

			var filters = [],
				options;

			if (CRMControlHistoryList.isPendingListSearch === true) {
				return;
			}

			CRMControlHistoryList.listOfHistoryCount = 0;

			if (!isMore) {
				CRMControlHistoryList.listOfHistory = [];
			}

			options = {
				start: CRMControlHistoryList.listOfHistory.length,
				end: (CRMControlHistoryList.isChild === true ? 10 : 50)
			};

			if (CRMControlHistoryList.selectedOrderBy) {
				options.orderBy = CRMControlHistoryList.selectedOrderBy.property;
				options.asc = CRMControlHistoryList.selectedOrderBy.asc;
			}

			CRMControlHistoryList.parseQuickFilter(filters);

			filters = filters.concat(CRMControlHistoryList.disclaimers);

			CRMControlHistoryList.isPendingListSearch = true;

			historyFactory.findRecords(filters, options, function (result) {
				CRMControlHistoryList.addHistoryInList(result, false);
				CRMControlHistoryList.isPendingListSearch = false;
			});
		};

		this.parseQuickFilter = function (filters) {

			if (CRMUtil.isDefined(CRMControlHistoryList.quickSearchText) && CRMControlHistoryList.quickSearchText.toString().trim().length > 0) {

				CRMControlHistoryList.disclaimers = [];
				CRMControlHistoryList.loadDefaults();

				filters.push({
					property: "custom.quick_search",
					value:  helper.parseStrictValue(CRMControlHistoryList.quickSearchText)
				});

			}

		};

		this.addEdit = function (history) {
			if (!history || !history.num_id || history.num_id < 1) {
				history = this.isChild === true ? this.parent : {};
			} else {
				if (history.log_acumul_restdo && history.log_acumul_restdo === true) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-history', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-change-histories-accumulate', [
							history.num_id, history.ttAcao.nom_acao
						], 'dts/crm')
					});

					return;
				}
			}

			modalHistoryEdit.open({
				history: history,
                canOverrideTicket: CRMControlHistoryList.canOverrideTicket || true
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					if (!history || !history.num_id) {
						CRMControlHistoryList.addHistoryInList(result, true);
					} else {
						history.dsl_histor_acao = result.dsl_histor_acao;
						history.num_id_detmnto  = result.num_id_detmnto;
						history.num_id_mid      = result.num_id_mid;
						history.num_id_contat   = result.num_id_contat;
						history.hra_inic        = result.hra_inic;
						history.hra_fim         = result.hra_fim;
						history.dat_inic        = result.dat_inic;
						history.dat_fim         = result.dat_fim;
						history.ttContato       = result.ttContato;
					}

				}
			});
		};

		this.onRemove = function (history) {
			var msg = '';

			if (history.log_acumul_restdo === true) {
				msg = $rootScope.i18n('msg-confirm-delete-accumulated-history', [], 'dts/crm');
				msg = '<div class="alert alert-warning crm-alert" role="alert"><span aria-hidden="true">' + msg + '</span></div>';
			}

			msg = msg + $rootScope.i18n('msg-confirm-delete', [$rootScope.i18n('l-action', [], 'dts/crm').toLowerCase(), (history.num_id + " - " + history.ttAcao.nom_acao)], 'dts/crm');

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: msg,
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					historyFactory.deleteRecord(history.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						var index = CRMControlHistoryList.listOfHistory.indexOf(history);

						if (index !== -1) {
							CRMControlHistoryList.listOfHistory.splice(index, 1);
							CRMControlHistoryList.listOfHistoryCount -= 1;
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-history', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.addHistoryInList = function (histories, isNew) {

			var i,
				history;

			if (!histories) { return; }

			if (!angular.isArray(histories)) {
				histories = [histories];
			}

			for (i = 0; i < histories.length; i++) {

				history = histories[i];

				if (isNew === true && CRMControlHistoryList.isAccumulation(history)) {
					return;
				}

				if (history && history.$length) {
					CRMControlHistoryList.listOfHistoryCount = history.$length;
				}

				historyHelper.parseRelatedTo(history);

				if (isNew === true) {
					CRMControlHistoryList.listOfHistory.unshift(history);
					CRMControlHistoryList.listOfHistoryCount++;
				} else {
					CRMControlHistoryList.listOfHistory.push(history);
				}

			}
		};

		this.deleteHistoryInList = function (history) {
			var index = CRMControlHistoryList.listOfHistory.indexOf(history);
			CRMControlHistoryList.listOfHistory.splice(index, 1);
			CRMControlHistoryList.listOfHistoryCount--;
		};

		this.isAccumulation = function (history) {

			if (history.ttResultado.log_acumul_restdo === true) {

				var i, item;

				for (i = 0; i < CRMControlHistoryList.listOfHistory.length; i += 1) {
					if (CRMControlHistoryList.listOfHistory[i].num_id === history.num_id) {
						item = CRMControlHistoryList.listOfHistory[i];
					}
				}

				if (item) {

					if (item.dsl_histor_acao) {
						item.dsl_histor_acao += history.dsl_histor_acao;
					}

					return true;
				}
			}

			return false;
		};

		this.loadCustomFilters = function () {
			filterHelper.get(historyHelper.filtersGroup, undefined, function (result) {
				CRMControlHistoryList.listOfCustomFilters = result || [];
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

		this.sendEmail = function (history) {
			modalEmailEdit.open({
				model: {
					ttAcaoOrigem: history
				}
			}).then(function (email) {
				// TODO: ?
			});
		};

		this.addExpense = function (history) {
			var period = {
				startDate: history.dat_inic,
				endDate: history.dat_fim
			};

			if (CRMUtil.isUndefined(history.num_id)) { return; }

			modalExpenseEdit.open({
				campaignId: history.num_id_campanha,
				actionId: history.num_id_acao,
				period: period,
				expense: {num_id_histor_acao: history.num_id, idi_status_despes: 2} // 1 previsto, 2 realizado
			}).then(function (results) {
				results = results || [];
			});
		};

		this.showReports = function () {
			modalReportAvailable.open({ num_id: 6, nom_modul_crm: 'l-module-relationship' });
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'history.list' });
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

					CRMControlHistoryList.parseQuickFilter(filters);
					filters = filters.concat(CRMControlHistoryList.disclaimers);

					historyFactory.exportSearch(filters, isPositiveResult);
				}
			});
		};

		this.loadPreferences = function (callback) {
			var count = 0,
				total = 2;

			historyFactory.canEditHistory(function (result) { //LOG_EDIT_HIST
				CRMControlHistoryList.canEditHistory = result;
				if (++count === total && callback) { callback(); }
			});

			historyFactory.canRemoveHistory(function (result) { //LOG_DEL_HIST
				CRMControlHistoryList.canRemoveHistory = result;
				if (++count === total && callback) { callback(); }
			});

		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (disclaimers, parent, isEnabled) {


			helper.loadCRMContext(function () {

				accessRestrictionFactory.getUserRestrictions('history.list', $rootScope.currentuser.login, function (result) {
					CRMControlHistoryList.accessRestriction = result || {};
				});

				CRMControlHistoryList.loadPreferences();

				CRMControlHistoryList.quickFilters = [{
					property: 'num_id_usuar',
					value: $rootScope.currentuser.idCRM,
					title: $rootScope.i18n('l-history-filter-by-myself', [], 'dts/crm'),
					fixed: false,
					model: {
						value : {
							num_id: $rootScope.currentuser.idCRM,
							nom_usuar: $rootScope.currentuser['user-desc']
						}
					}
				}];

				if (CRMControlHistoryList.isChild !== true) {

					var viewName = $rootScope.i18n('nav-history', [], 'dts/crm'),
						startView,
						viewController = 'crm.history.list.control';


					startView = helper.startView(viewName, viewController, CRMControlHistoryList);

					if (startView.isNewTab === true) {

						CRMControlHistoryList.loadDefaults([{
							property: 'num_id_usuar',
							value: $rootScope.currentuser.idCRM,
							title: $rootScope.i18n('l-user-open', [], 'dts/crm') + ': ' + $rootScope.currentuser['user-desc'],
							fixed: false,
							model: {
								value : {
									num_id: $rootScope.currentuser.idCRM,
									nom_usuar: $rootScope.currentuser['user-desc']
								}
							}
						}]);
					}

					if (startView.isNewContext) {

						CRMControlHistoryList.loadCustomFilters();

						CRMControlHistoryList.search(false);
					}

				} else if (disclaimers) {

					CRMControlHistoryList.loadCustomFilters();

					CRMControlHistoryList.loadDefaults(disclaimers);
					CRMControlHistoryList.search(false);

					if (isEnabled === false) {
						CRMControlHistoryList.isEnabled = false;
					} else {
						CRMControlHistoryList.isEnabled = true;
					}

					CRMControlHistoryList.parent = parent;
				}
			});

		};

		if ($rootScope.currentuserLoaded && !$rootScope.accountDetailModeLoading) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlHistoryList = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlHistoryList.init();
		});

		$scope.$on(CRMEvent.scopeLoadTask, function (event, task) {
			CRMControlHistoryList.init([{
				property: 'num_id_tar',
				value: task.num_id,
				title: $rootScope.i18n('l-task', [], 'dts/crm') + ': ' + task.num_id + ' - ' + task.ttAcao.nom_acao,
				fixed: true
			}], {ttTarefaOrigem: task}, (task.idi_status_tar === 1));
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opportunity) {
			CRMControlHistoryList.init([{
				property: 'num_id_oportun',
				value: opportunity.num_id,
				title: $rootScope.i18n('l-opportunity', [], 'dts/crm') + ': ' + opportunity.num_id + ' - ' + opportunity.des_oportun_vda,
				fixed: true
			}, {
				property: 'num_id_pessoa',
				value: opportunity.num_id_pessoa,
				title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + opportunity.num_id_pessoa + ' - ' + opportunity.ttConta.nom_razao_social,
				fixed: true
			}], {ttOportunidadeOrigem: opportunity});
		});

		$scope.$on(CRMEvent.scopeLoadTicket, function (event, ticket) {
			CRMControlHistoryList.init([{
				property: 'num_id_ocor',
				value: ticket.num_id,
				title: $rootScope.i18n('l-ticket', [], 'dts/crm') + ': ' + ticket.num_id + ' - ' + ticket.nom_ocor,
				fixed: true
			}], {ttOcorrenciaOrigem: ticket});
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlHistoryList.init([{
				property: 'num_id_pessoa',
				value: account.num_id,
				title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + account.num_id + ' - ' + account.nom_razao_social +
					(account.cod_pessoa_erp ? ' (' + account.cod_pessoa_erp + ')' : ''),
				fixed: true
			}], {ttConta: account});
		});

		/* comentando pq n ha mais a necessidade do registro de acao automatico na conta
		$scope.$on(CRMEvent.scopeSaveAccount, function (event, account) {

			if (account.isToLoadHistory && account.isToLoadHistory === true) {

				CRMControlHistoryList.init([{
					property: 'num_id_pessoa',
					value: account.num_id,
					title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + account.num_id + ' - ' + account.nom_razao_social +
						(account.cod_pessoa_erp ? ' (' + account.cod_pessoa_erp + ')' : ''),
					fixed: true
				}], {ttConta: account});

			}
		});
		*/

		$scope.$on(CRMEvent.scopeSaveHistoryOnEditTask, function (event, history) {

			if (history) {

				if (CRMControlHistoryList.isChild === true) {

					var equals = false,
						parent = CRMControlHistoryList.parent;

					if (parent.ttOcorrenciaOrigem) {
						if (history.ttOcorrenciaOrigem && history.ttOcorrenciaOrigem.num_id) {
							equals = (parent.ttOcorrenciaOrigem.num_id === history.ttOcorrenciaOrigem.num_id);
						}
					} else if (parent.ttOportunidadeOrigem) {
						if (history.ttOportunidadeOrigem && history.ttOportunidadeOrigem.num_id) {
							equals = (parent.ttOportunidadeOrigem.num_id === history.ttOportunidadeOrigem.num_id);
						}
					} else if (parent.ttTarefaOrigem) {
						if (history.ttTarefaOrigem && history.ttTarefaOrigem.num_id) {
							equals = (parent.ttTarefaOrigem.num_id === history.ttTarefaOrigem.num_id);
						}
					} else if (parent.ttConta) {
						if (history.ttConta && history.ttConta.num_id) {
							equals = (parent.ttConta.num_id === history.ttConta.num_id);
						}
					}

					if (equals) { CRMControlHistoryList.addHistoryInList(history, true); }

				} else {
					CRMControlHistoryList.addHistoryInList(history, true);
				}

			}

		});

		$scope.$on(CRMEvent.scopeSaveHistoryOnExecuteTask, function (event, history) {

			if (history) {

				if (CRMControlHistoryList.isChild === true) {

					var equals = false,
						parent = CRMControlHistoryList.parent;

					if (parent.ttOcorrenciaOrigem) {
						if (history.ttOcorrenciaOrigem && history.ttOcorrenciaOrigem.num_id) {
							equals = (parent.ttOcorrenciaOrigem.num_id === history.ttOcorrenciaOrigem.num_id);
						}
					} else if (parent.ttOportunidadeOrigem) {
						if (history.ttOportunidadeOrigem && history.ttOportunidadeOrigem.num_id) {
							equals = (parent.ttOportunidadeOrigem.num_id === history.ttOportunidadeOrigem.num_id);
						}
					} else if (parent.ttTarefaOrigem) {
						if (history.ttTarefaOrigem && history.ttTarefaOrigem.num_id) {
							equals = (parent.ttTarefaOrigem.num_id === history.ttTarefaOrigem.num_id);
						}
					} else if (parent.ttConta) {
						if (history.ttConta && history.ttConta.num_id) {
							equals = (parent.ttConta.num_id === history.ttConta.num_id);
						}
					}

					if (equals) { CRMControlHistoryList.addHistoryInList(history, true); }

				} else {
					CRMControlHistoryList.addHistoryInList(history, true);
				}
			}
		});

		$scope.$on(CRMEvent.scopeSaveHistoryOnPersistTicket, function (event, history) {
			if (history) {

				if (CRMControlHistoryList.isChild === true) {

					var parent = CRMControlHistoryList.parent;

					if (parent.ttOcorrenciaOrigem) {

						if (history.ttOcorrenciaOrigem && history.ttOcorrenciaOrigem.num_id) {

							if (parent.ttOcorrenciaOrigem.num_id === history.ttOcorrenciaOrigem.num_id) {
								CRMControlHistoryList.addHistoryInList(history, true);
							}

						}

					}

				}

			}
		});

		$scope.$on(CRMEvent.scopeSaveHistory, function (event, history) {
			if (history) {
				if (CRMControlHistoryList.isChild === false) {
					CRMControlHistoryList.addHistoryInList(history, true);
				}
			}
		});

		$scope.$on(CRMEvent.scopeChangeHistory, function (event, history) {
			//if (history) {}
		});

		$scope.$on(CRMEvent.scopeChangeTask, function (event, task) {

			if (task && CRMControlHistoryList.isChild === true) {

				var parent = CRMControlHistoryList.parent;

				if (CRMControlHistoryList.parent.ttTarefaOrigem) {

					if (CRMControlHistoryList.parent.ttTarefaOrigem.num_id === task.num_id) {
						CRMControlHistoryList.isEnabled = (task.idi_status_tar === 1);
					}
				}
			}
		});

		$scope.$on(CRMEvent.scopeDeleteHistoryRemoveProcess, function (event, listProcess) {
			if (!listProcess || !angular.isArray(listProcess)) { return; }

			var i;
			for (i = 0; i < listProcess.length; i++) {
				if (listProcess[i].processo === 'history') {
					CRMControlHistoryList.deleteHistoryInList(listProcess[i]);
				}
			}
		});

	};
	controllerHistoryList.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.crm_histor_acao.factory',
		'crm.history.helper', 'crm.history.modal.advanced.search', 'crm.history.modal.edit',
		'crm.helper', 'crm.filter.helper', 'crm.user.modal.summary', 'crm.send-email.modal',
		'crm.report.modal.available', 'crm.user.modal.preference', 'crm.expense.modal.edit',
		'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.history.list.control', controllerHistoryList);
});
