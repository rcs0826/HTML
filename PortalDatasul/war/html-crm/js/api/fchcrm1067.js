/* global angular, define, CRMURL */
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryMaritalStatus;

	factoryMaritalStatus = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom, factoryGenericTypeahead) {

		var cache = $cacheFactory('crm.maritalStatus.Cache'),
			factory = $totvsresource.REST(CRMURL.maritalStatusService + ':method/:id');

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

			var idCache = 'allMaritalStatus',
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
	}; //factoryMaritalStatus

	factoryMaritalStatus.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_estado_civil.factory',	factoryMaritalStatus);

});
