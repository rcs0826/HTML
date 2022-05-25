/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryLayout;

	factoryLayout = function ($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('crm.layout.public.Cache'),
			factory = $totvsresource.REST(CRMURL.layoutService + ':method/:id');

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'layoutsPublic',
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

		factory.getLayout = function (idLayout, callback) {

			return this.TOTVSQuery({method: 'layout', layout: idLayout}, function (data) {
				if (callback) { callback(data); }
			});
		};

		return factory;
	}; // factoryLayout

	factoryLayout.$inject = ['$totvsresource', '$cacheFactory', 'crm.generic.factory'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_public_layout.factory', factoryLayout);
});
