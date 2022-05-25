/*globals index, define, angular, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factory;

	factory = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericCreateUpdate,
						 factoryGenericDetail, factoryGenericDelete) {

		var cache = $cacheFactory('crm.ticket-flow-status-restrict.Cache'),
			factory = $totvsresource.REST(CRMRestService + '1106/:method/:id/:resource', undefined,
										  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getRestrictionsByFlowStatus = function (statusId, callback, isAllowedCache, notTakeTheCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'restrictionsbyflowstatus' + statusId.toString(),
				result = (isAllowedCache && !notTakeTheCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({ method: 'restrictionsbyflowstatus', statusid: statusId }, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.setResourceAsDefault = function (flowStatusResourceId, callback) {
			return this.TOTVSUpdate({ method: 'defaultresource', resource: flowStatusResourceId }, undefined, callback);
		};

		return factory;
	};

	factory.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_ocor_fluxo_restric.factory', factory);

});
