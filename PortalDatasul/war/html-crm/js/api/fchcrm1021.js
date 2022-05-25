/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryTag;

	factoryTag = function ($totvsresource, factoryGeneric, $cacheFactory) {

		var factory = $totvsresource.REST(CRMURL.tagService + ':method/:id'),
			cache = $cacheFactory('crm.ticket-tag.Cache');

		angular.extend(factory, factoryGeneric);

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'tag',
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

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		return factory;
	}; // factoryTag
	factoryTag.$inject = [
		'$totvsresource', 'crm.generic.factory', '$cacheFactory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_palavra_chave.factory', factoryTag);

});
