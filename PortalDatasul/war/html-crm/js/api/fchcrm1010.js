/*global $, index, angular, define, TOTVSEvent, CRMURL*/

define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryCountry;

	factoryCountry = function ($totvsresource, $cacheFactory, factoryGeneric,
								factoryGenericZoom, factoryGenericTypeahead,
								factoryGenericDetail) {

		var cache = $cacheFactory('crm.country.Cache'),
			factory = $totvsresource.REST(CRMURL.countryService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= options.orderBy || ['nom_pais'];
			options.asc		= options.asc || [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getDefaultCountry = function (callback) {

			var result = cache.get('default');

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'default'}, function (data) {
					data = (data && data.length > 0 ? data[0] : undefined);
					cache.put('default', data);
					if (callback) { callback(data); }
				});
			}
		};
        
        factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'countries',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.findRecords({}, {}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};


		return factory;
	}; // factoryCountry


	factoryCountry.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory',
		'crm.generic.detail.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_pais.factory', factoryCountry);

});
