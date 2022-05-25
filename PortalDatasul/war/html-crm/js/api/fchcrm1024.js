/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryPhoneType;

	factoryPhoneType = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom) {

		var cache = $cacheFactory('crm.phone.Cache'),
			factory = $totvsresource.REST(CRMURL.phoneTypeService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (onlyValid, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'phones-' + (onlyValid === true),
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
	}; // factoryPhoneType
	factoryPhoneType.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_tip_telef.factory', factoryPhoneType);

});
