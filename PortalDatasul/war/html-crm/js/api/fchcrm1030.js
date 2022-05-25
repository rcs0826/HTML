/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryStrongWeak;

	factoryStrongWeak = function ($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('crm.strong-weak.Cache'),
			factory = $totvsresource.REST(CRMURL.strongWeakService + ':method/:id');

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['des_pto'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'strongWeaks',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'all'
				}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	}; // factoryStrongWeak

	factoryStrongWeak.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_pto_fort_fraco_oportun.factory', factoryStrongWeak);

});
