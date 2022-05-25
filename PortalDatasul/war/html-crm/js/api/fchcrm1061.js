/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryTemplate;

	factoryTemplate = function ($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('crm.template.Cache'),
			factory = $totvsresource.REST(CRMURL.templateService + ':method/:id');

		factory.getAll = function (idi_table, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'templates-' + idi_table,
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({'method': 'all', 'idi_table': idi_table}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getTemplate = function (idTemplate, callback) {

			return this.TOTVSQuery({method: 'template', template: idTemplate}, function (data) {
				if (callback) { callback(data); }
			});
		};

		return factory;
	}; // factoryTemplate
	factoryTemplate.$inject = ['$totvsresource', '$cacheFactory', 'crm.generic.factory'];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_template.factory', factoryTemplate);
});
