/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {
	'use strict';

	var factoryPotential;

	factoryPotential = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericTypeahead) {

		var cache = $cacheFactory('crm.potential.Cache'),
			factory = $totvsresource.REST(CRMURL.potentialService + ':method/:id');

		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (onlyValid, idGroup, idSubgroup, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'potentials-' + (onlyValid === true) + (idGroup || 'none') + '-' + (idSubgroup || 'none'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'all',
					valid: onlyValid,
					group: idGroup,
					subgroup: idSubgroup
				}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	}; // factoryPotential
	factoryPotential.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.typeahead.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_potencd.factory', factoryPotential);

});
