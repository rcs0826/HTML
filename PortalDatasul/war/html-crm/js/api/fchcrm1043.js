/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {
	'use strict';
	var factoryDepartment;

	factoryDepartment = function ($totvsresource, $cacheFactory, factoryGeneric,
							   factoryGenericZoom, factoryGenericTypeahead) {

		var cache = $cacheFactory('crm.department.Cache'),
			factory = $totvsresource.REST(CRMURL.departmentService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (onlyValid, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allDepartaments' + (onlyValid ? 'Valids' : ''),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'all',
					valid: onlyValid
				}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	}; // factoryDepartment
	factoryDepartment.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_depto.factory',	factoryDepartment);

});
