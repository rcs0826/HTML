/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index'
], function (index) {
	'use strict';


	var modalExpenseAdvancedSearch,
		controllerExpenseAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalExpenseAdvancedSearch = function ($modal) {

		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/expense/expense.advanced.search.html',
				controller: 'crm.expense.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});

			return instance.result;
		};
	};

	modalExpenseAdvancedSearch.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerExpenseAdvancedSearch = function ($rootScope, $scope, $modalInstance, campaignFactory, expensesFactory, parameters, helper) {

		var CRMControlExpenseAdvancedSearch = this;

		this.model = {};
		this.disclaimers = parameters.disclaimers || [];
		this.fixedDisclaimers = parameters.fixedDisclaimers || [];
		this.actions = undefined;
		this.types = [];

		this.historyId = parameters.historyId || 0;
		this.ticketId = parameters.ticketId || 0;

		// *************************************************************************************
		// *** INITIALIZE
		// *************************************************************************************

		this.init = function () {
			this.getActions();

			this.getAvailbleExpenses();

			this.parseDisclaimersToModel(this.disclaimers);
		};

		this.apply = function () {

			var closeObj = {};

			this.parseModelToDisclaimers();

			closeObj.disclaimers = CRMControlExpenseAdvancedSearch.disclaimers;

			$modalInstance.close(closeObj);

		};

		this.parseDisclaimersToModel = function (disclaimers) {
			var i;

			disclaimers = disclaimers || parameters.disclaimers;

			helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {
				CRMControlExpenseAdvancedSearch.model = model;
			});

			for (i = 0; i < disclaimers.length; i++) {
				if (disclaimers[i].property === "num_id_tipo") {
					CRMControlExpenseAdvancedSearch.model.ttTipo = disclaimers[i].model;
				}

				if (disclaimers[i].property === "num_id_acao") {
					CRMControlExpenseAdvancedSearch.model.ttAcao = disclaimers[i].model;
				}

			}
		};

		this.parseModelToDisclaimers = function () {
			CRMControlExpenseAdvancedSearch.disclaimers = [];

			if (CRMUtil.isUndefined(CRMControlExpenseAdvancedSearch.model)) {
				return;
			}

			if (CRMUtil.isDefined(CRMControlExpenseAdvancedSearch.model.ttAcao)) {
				CRMControlExpenseAdvancedSearch.disclaimers.push({
					property: 'num_id_acao',
					model: CRMControlExpenseAdvancedSearch.model.ttAcao,
					value: CRMControlExpenseAdvancedSearch.model.ttAcao.num_id,
					title: $rootScope.i18n('l-action', [], 'dts/crm') + ': ' + CRMControlExpenseAdvancedSearch.model.ttAcao.nom_acao
				});
			}

			if (CRMUtil.isDefined(CRMControlExpenseAdvancedSearch.model.ttTipo)) {
				CRMControlExpenseAdvancedSearch.disclaimers.push({
					property: 'num_id_tipo',
					model: CRMControlExpenseAdvancedSearch.model.ttTipo,
					value: CRMControlExpenseAdvancedSearch.model.ttTipo.num_id,
					title: $rootScope.i18n('l-type', [], 'dts/crm') + ': ' + CRMControlExpenseAdvancedSearch.model.ttTipo.nom_tip_despes
				});
			}

			if (CRMControlExpenseAdvancedSearch.model.data_despesa && (CRMUtil.isDefined(CRMControlExpenseAdvancedSearch.model.data_despesa.start) || CRMUtil.isDefined(CRMControlExpenseAdvancedSearch.model.data_despesa.end))) {
				this.disclaimers.push(helper.parseDateRangeToDisclaimer(CRMControlExpenseAdvancedSearch.model.data_despesa, 'data_despesa', 'l-expense-date'));
			}

		};

		this.cleanFilters = function () {
			CRMControlExpenseAdvancedSearch.model = {};
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.getActions = function () {
			if (CRMControlExpenseAdvancedSearch.ticketId > 0) {
				expensesFactory.getAvailableActionsByTicket(CRMControlExpenseAdvancedSearch.ticketId, function (result) {
					if (!result) { return; }
					CRMControlExpenseAdvancedSearch.actions = result;
				});
			}
		};

		this.getAvailbleExpenses = function () {

			CRMControlExpenseAdvancedSearch.types = [];

			if (CRMControlExpenseAdvancedSearch.historyId > 0) {
				expensesFactory.getAvailbleExpensesByHistory(CRMControlExpenseAdvancedSearch.historyId, function (results) {
					if (results === undefined) { return; }

					CRMControlExpenseAdvancedSearch.types = results;
				});
			}

			if (CRMControlExpenseAdvancedSearch.ticketId > 0) {
				expensesFactory.getAvailbleExpensesByTicket(CRMControlExpenseAdvancedSearch.ticketId, function (results) {
					if (results === undefined) { return; }

					CRMControlExpenseAdvancedSearch.types = results;
				});

			}
		};

		this.init();

	};

	controllerExpenseAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'crm.crm_campanha.factory', 'crm.crm_acao_tip_despes.factory', 'parameters', 'crm.helper'
	];


	index.register.service('crm.expense.modal.advanced.search', modalExpenseAdvancedSearch);
	index.register.controller('crm.expense.advanced.search.control', controllerExpenseAdvancedSearch);


});

