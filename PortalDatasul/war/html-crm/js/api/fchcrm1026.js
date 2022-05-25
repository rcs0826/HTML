/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {
	'use strict';
	var factoryPotentialSubgroup;

	factoryPotentialSubgroup = function ($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('crm.potential-subgroup.Cache'),
			factory = $totvsresource.REST(CRMURL.potentialSubgroupService + ':method/:id');

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (onlyValid, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'subgroups-' + (onlyValid === true),
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
	}; // factoryPotentialSubgroup
	factoryPotentialSubgroup.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_subgrp_potencd.factory', factoryPotentialSubgroup);

});
