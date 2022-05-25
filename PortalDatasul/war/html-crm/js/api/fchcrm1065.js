/* global angular, define, CRMURL */
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryTreatment;

	factoryTreatment = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom, factoryGenericTypeahead) {

		var cache = $cacheFactory('crm.treatment.Cache'),
			factory = $totvsresource.REST(CRMURL.treatmentService + ':method/:id');

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

			var idCache = 'allTreatments',
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
	}; //factoryTreatment

	factoryTreatment.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_tratam.factory',	factoryTreatment);

});
