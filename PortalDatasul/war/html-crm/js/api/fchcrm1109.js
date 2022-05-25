/*globals index, define, angular, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factory;

	factory = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericCreateUpdate,
						 factoryGenericDetail, factoryGenericDelete, factoryGenericZoom) {

		var cache = $cacheFactory('crm.ticket-flow-rules.Cache'),
			factory = $totvsresource.REST(CRMRestService + '1109/:method/:id', undefined,
										  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getRulesByFlow = function (flowId, callback) {
			return this.TOTVSQuery({ method: 'flow_rules', flowid: flowId }, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.reorderFlowRules = function (order, callback) {
			return this.TOTVSUpdate({ method: 'set_order', order: order }, { method: 'set_order' }, callback);
		};
		/*
		factory.reorderFlowRules = function (orderList, callback) {
			return this.DTSPut({method: 'set_order', order: orderList}, {}, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};
		*/
		return factory;
	};

	factory.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory', 'crm.generic.zoom.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_ocor_fluxo_regra.factory', factory);

});
