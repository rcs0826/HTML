/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {
	'use strict';
	var factoryBondType;

	factoryBondType = function ($totvsresource, $cacheFactory, factoryGeneric,
							 factoryGenericZoom, factoryGenericTypeahead) {

		var cache = $cacheFactory('crm.bond-type.Cache'),
			factory = $totvsresource.REST(CRMURL.bondTypeService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allBonds',
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

		factory.getBondTypes = function (active, callback) {

			var result;

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'bondTypes', active: active}, function (data) {
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	}; // factoryBondType
	factoryBondType.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_tip_vinc.factory', factoryBondType);

});
