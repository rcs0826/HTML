/*globals index, define, angular, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factory;

	factory = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom, factoryGenericTypeahead) {

		var cache = $cacheFactory('crm.resource-level.Cache'),
			factory = $totvsresource.REST(CRMRestService + '1100/:method/:id', undefined, undefined);

		angular.extend(factory, factoryGenericZoom);
        angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allresourcelevels',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({ method: 'allresourcelevels' }, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}

		};

		return factory;
	};

	factory.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory', 'crm.generic.typeahead.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_niv_recur.factory', factory);

});
