/*globals index, define, angular, CRMURL, CRMUtil, CRMRestService*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	var helperExpense,
		factoryExpense;

	helperExpense = function (helper, legend, $rootScope) {

		var CRMExpenseHelper = this;

		this.status = [
			{num_id: 1, nom_status: $rootScope.i18n('l-estimated', [], 'dts/crm')},
			{num_id: 2, nom_status: $rootScope.i18n('l-realized', [], 'dts/crm')}
		];

		this.parseExpenseStatus = function (expense) {
			var status = expense.idi_status_despes || 1;

			if (status === 1) {
				expense.nom_status = $rootScope.i18n('l-estimated', [], 'dts/crm');
			} else {
				expense.nom_status = $rootScope.i18n('l-realized', [], 'dts/crm');
			}
		};
	};

	helperExpense.$inject = ['crm.helper', 'crm.legend', '$rootScope'];


	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryExpense = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
						 factoryGenericTypeahead, factoryGenericCreateUpdate, factoryGenericDelete) {

		var factory,
			cache = $cacheFactory('crm.expense.Cache');

		factory = $totvsresource.REST(CRMRestService + '1080/:method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericDelete);

		factory.findRecords = function (parameters, options, callback) {
			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['dsl_tip_despes']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [true]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.saveExpense = function (model, callback) {
			return this.DTSPost({method: 'expense'}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateExpense = function (id, model, callback) {
			return this.DTSPut({method: 'expense', id: id}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.removeExpense = function (id, callback) {
			return this.TOTVSRemove({id: id}, callback);
		};

		factory.getAvailbleExpenses = function (campaignId, actionId, callback) {
			return this.TOTVSQuery({method: 'available_expenses', campaignId: campaignId, actionId: actionId}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getAvailbleExpensesByHistory = function (historyId, callback) {
			return this.TOTVSQuery({method: 'available_expenses_by_history', historyId: historyId}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getAvailbleExpensesByTicket = function (ticketId, callback) {
			return this.TOTVSQuery({method: 'available_expenses_by_ticket', ticketId: ticketId}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getAvailableActionsByTicket = function (ticketId, callback) {
			return this.TOTVSQuery({method: 'available_actions_by_ticket', ticketId: ticketId}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getExpensesByHistory = function (historyId, expenseType, expenseDate, callback) {
			return this.TOTVSQuery({method: 'expense_by_history', historyId: historyId, expenseType: expenseType, expenseDate: expenseDate}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.getExpensesByTicket = function (ticketId, expenseType, expenseDate, action, callback) {
			return this.TOTVSQuery({method: 'expense_by_ticket', ticketId: ticketId,  expenseType: expenseType, expenseDate: expenseDate, action: action }, function (data) {
				if (callback) { callback(data); }
			});
		};

		return factory;
	};

	factoryExpense.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory', 'crm.generic.delete.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.expense.helper', helperExpense);

	index.register.factory('crm.crm_acao_tip_despes.factory', factoryExpense);

});
