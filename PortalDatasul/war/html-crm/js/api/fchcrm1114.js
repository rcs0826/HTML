/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryUnitMeasurement;

	factoryUnitMeasurement = function ($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('crm.expense-type.Cache'),
			factory = $totvsresource.REST(CRMRestService + '1114/:method/:id');

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'expenseType',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	}; // factoryUnitMeasurement

	factoryUnitMeasurement.$inject = ['$totvsresource', '$cacheFactory', 'crm.generic.factory'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_tip_despes.factory', factoryUnitMeasurement);
});
