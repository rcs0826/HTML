/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1080.js',
	'/dts/crm/html/expense/expense-services.edit.js',
	'/dts/crm/html/expense/expense-services.summary.js',
	'/dts/crm/html/expense/expense-services.advanced.search.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerExpenseTab;

	controllerExpenseTab = function ($rootScope, $scope, TOTVSEvent, helper, factory,
									  modalExpenseEdit, modalExpenseSummary, modalAdvancedSearch, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlExpenseTab = this;

		this.listOfExpense = [];
		this.listOfExpenseCount = 0;
		this.history = undefined;
		this.ticket = undefined;
		this.disclaimers = [];
		this.fixedDisclaimers = [];

		this.types = {
			ticket: 1,
			history: 2
		};

		this.summary = {
			totalItems: 0,
			totalValue: 0
		};

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.remove = function (expense) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete-expense', [expense.nom_tip_despes], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						factory.deleteRecord(expense.num_id, function (result) {

							if (result.$hasError === true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-expense', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlExpenseTab.listOfExpense.indexOf(expense);

							if (index !== -1) {
								CRMControlExpenseTab.listOfExpense.splice(index, 1);
								CRMControlExpenseTab.listOfExpenseCount--;
							}
							CRMControlExpenseTab.calculateSummary(expense, true);
						});

					}
				}
			});
		};

		this.addEdit = function () {
			if (CRMUtil.isUndefined(this.history) || CRMUtil.isUndefined(this.history.num_id)) { return; }

			var history = this.history,
				period = {
					startDate: history.dat_inic,
					endDate: history.dat_fim
				};

			modalExpenseEdit.open({
				campaignId: history.num_id_campanha || 0,
				actionId: history.num_id_acao || 0,
				period: period,
				expense: {num_id_histor_acao: history.num_id, idi_status_despes: 2} // 1 previsto, 2 realizado
			}).then(function (results) {
				results = results || [];

				if (CRMUtil.isDefined(results)) {
					CRMControlExpenseTab.addExpenseInList(results, true);
				}
			});
		};

		this.addExpenseInList = function (expenses, isNew) {
			var i,
				expense;

			if (!expenses) { return; }

			if (!angular.isArray(expenses)) {
				expenses = [expenses];
			}

			for (i = 0; i < expenses.length; i++) {
				expense = expenses[i];

				if (expense && expense.$length) {
					CRMControlExpenseTab.listOfExpenseCount = expense.$length;
				}

				if (isNew === true) {
					CRMControlExpenseTab.listOfExpense.unshift(expense);
					CRMControlExpenseTab.listOfExpenseCount++;
					CRMControlExpenseTab.calculateSummary(expense, false);
				} else {
					CRMControlExpenseTab.listOfExpense.push(expense);
				}

			}
		};

		this.loadByHistory = function (expenseType, expenseDate, callback) {
			CRMControlExpenseTab.summary.totalValue = 0;
			CRMControlExpenseTab.summary.totalItems = 0;
			factory.getExpensesByHistory(this.history.num_id, expenseType, expenseDate, function (result) {
				if (!result) { return; }
				CRMControlExpenseTab.listOfExpense = [];
				CRMControlExpenseTab.listOfExpenseCount = 0;

				CRMControlExpenseTab.addExpenseInList(result, true);
			});

		};

		this.loadByTicket = function (expenseType, expenseDate, action, callback) {
			CRMControlExpenseTab.summary.totalValue = 0;
			CRMControlExpenseTab.summary.totalItems = 0;
			factory.getExpensesByTicket(this.ticket.num_id, expenseType, expenseDate, action, function (result) {
				if (!result) { return; }
				CRMControlExpenseTab.listOfExpense = [];
				CRMControlExpenseTab.listOfExpenseCount = 0;

				CRMControlExpenseTab.addExpenseInList(result, true);
			});
		};

		this.calculateSummary = function (item, isRemove) {
			if (CRMUtil.isUndefined(item)) { return; }

			if (isRemove !== true) {
				CRMControlExpenseTab.summary.totalValue += item.val_despes_realzdo;
				CRMControlExpenseTab.summary.totalItems += item.qtd_itens_despes_realzdo;
			} else {
				CRMControlExpenseTab.summary.totalValue -= item.val_despes_realzdo;
				CRMControlExpenseTab.summary.totalItems -= item.qtd_itens_despes_realzdo;
			}
		};

		this.openSummary = function (expanse) {
			modalExpenseSummary.open({
				model: expanse
			});
		};

		this.openAdvancedSearch = function () {
			modalAdvancedSearch.open({
				disclaimers: CRMControlExpenseTab.disclaimers,
				fixedDisclaimers: CRMControlExpenseTab.fixedDisclaimers,
				historyId: CRMControlExpenseTab.history ? CRMControlExpenseTab.history.num_id : 0,
				ticketId: CRMControlExpenseTab.ticket ? CRMControlExpenseTab.ticket.num_id : 0
			}).then(function (result) {
				CRMControlExpenseTab.disclaimers = result.disclaimers;
				CRMControlExpenseTab.load();
			});
		};

		this.removeDisclaimer = function (disclaimer) {
			var index = CRMControlExpenseTab.disclaimers.indexOf(disclaimer);

			if (index !== -1) {
				CRMControlExpenseTab.disclaimers.splice(index, 1);
				CRMControlExpenseTab.load();
			}
		};
		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (modelHistory, modelTicket, type) {
			accessRestrictionFactory.getUserRestrictions('expense.tab', $rootScope.currentuser.login, function (result) {
				CRMControlExpenseTab.accessRestriction = result || {};
			});

			CRMControlExpenseTab.history = modelHistory;
			CRMControlExpenseTab.ticket = modelTicket;
			CRMControlExpenseTab.type = type;
            CRMControlExpenseTab.canOverride = CRMControlExpenseTab.canOverrideTicket || true; //tratamento p permissao de lancamento na ocorrrencia
            
			CRMControlExpenseTab.load();
		};

		this.load = function () {
			var expenseType = 0,
				i,
				expenseDate,
				action = 0;

			CRMControlExpenseTab.clearData();

			for (i = 0; i < CRMControlExpenseTab.disclaimers.length; i++) {
				if (CRMControlExpenseTab.disclaimers[i].property === "num_id_tipo") {
					expenseType = CRMControlExpenseTab.disclaimers[i].value;
				}
				if (CRMControlExpenseTab.disclaimers[i].property === "data_despesa") {
					expenseDate = CRMControlExpenseTab.disclaimers[i].value;
				}
				if (CRMControlExpenseTab.disclaimers[i].property === "num_id_acao") {
					action = CRMControlExpenseTab.disclaimers[i].value;
				}
			}

			if (CRMControlExpenseTab.type === CRMControlExpenseTab.types.ticket) {
				CRMControlExpenseTab.loadByTicket(expenseType, expenseDate, action, CRMControlExpenseTab.calculateSummary);
			} else if (CRMControlExpenseTab.type === CRMControlExpenseTab.types.history) {
				CRMControlExpenseTab.loadByHistory(expenseType, expenseDate, CRMControlExpenseTab.calculateSummary);
			}
		};

		this.clearData = function () {
			CRMControlExpenseTab.listOfExpenseCount = 0;
			CRMControlExpenseTab.listOfExpense = [];
			CRMControlExpenseTab.summary.totalItems = 0;
			CRMControlExpenseTab.summary.totalValue = 0;
		};


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlExpenseTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadHistory, function (event, history) {
			if (history && CRMUtil.isDefined(history.num_id) && history.num_id > 0) {
				CRMControlExpenseTab.init(history, undefined, CRMControlExpenseTab.types.history);
			}
		});

		$scope.$on(CRMEvent.scopeLoadTicket, function (event, ticket) {
			if (ticket && CRMUtil.isDefined(ticket.num_id) && ticket.num_id > 0) {
				CRMControlExpenseTab.init(undefined, ticket, CRMControlExpenseTab.types.ticket);
			}
		});

		$scope.$on(CRMEvent.scopeChangeHistory, function () {
			CRMControlExpenseTab.load();
		});

		$scope.$on(CRMEvent.scopeSaveHistory, function () {
			CRMControlExpenseTab.load();
		});


	}; // controllerResaleTab
	controllerExpenseTab.$inject = ['$rootScope', '$scope', 'TOTVSEvent', 'crm.helper',
									'crm.crm_acao_tip_despes.factory', 'crm.expense.modal.edit',
									'crm.expense.modal.summary', 'crm.expense.modal.advanced.search', 'crm.crm_acess_portal.factory'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.expense.tab.control', controllerExpenseTab);

});

