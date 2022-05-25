/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryStyle;

	factoryStyle = function ($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('crm.style.Cache'),
			factory = $totvsresource.REST(CRMURL.styleService + ':method/:id');

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (onlyValid, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'styles-' + (onlyValid === true),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all', valid: onlyValid}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	}; // factoryStyle

	factoryStyle.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_estil.factory', factoryStyle);

});
