/*global angular, define, CRMUtil, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryClientGroup;

	factoryClientGroup = function ($totvsresource, $cacheFactory, factoryGeneric,
									factoryGenericZoom, factoryGenericTypeahead,
									factoryGenericDetail, factoryGenericCreateUpdate, factoryGenericDelete) {

		var cache = $cacheFactory('crm.client-group.Cache'),
			factory;

		factory = $totvsresource.REST(
			CRMRestService + '1037/:method/:id/:detail',
			undefined,
			factoryGenericCreateUpdate.customActions
		);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['nom_grp_clien'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allClientGroups',
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

		factory.getByFinantialParam = function (callback) {
			return this.TOTVSQuery({method: 'finantialParam'}, function (data) {
				if (callback) { callback(data); }
			});
		};

		return factory;
	}; // factoryClientGroup

	factoryClientGroup.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory',
		'crm.generic.detail.factory', 'crm.generic.create.update.factory', 'crm.generic.delete.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_grp_clien.factory', factoryClientGroup);

});
