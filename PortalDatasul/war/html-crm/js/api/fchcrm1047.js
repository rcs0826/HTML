/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {
	'use strict';

	var factoryCurrency;

	factoryCurrency = function ($totvsresource, $cacheFactory, factoryGeneric,
								  factoryGenericZoom, factoryGenericTypeahead) {

		var cache = $cacheFactory('crm.currency.Cache'),
			factory = $totvsresource.REST(CRMURL.currencyService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['nom_moeda'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allCurrencys',
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
         
		factory.getCurrency = function (idCurrency, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'currency',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'detail', id: idCurrency}, function (data) {
					if (data) {
						cache.put(idCache, data[0]);
						if (callback) { callback(data[0]); }
					} else {
						if (callback) { callback(); }
					}
				});
			}
		};

		return factory;
	}; // factoryCurrency
	factoryCurrency.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_erp_moed.factory', factoryCurrency);

});
