/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryDocumentType;

	factoryDocumentType = function ($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('crm.documentType.Cache'),
			factory = $totvsresource.REST(CRMURL.documentTypeService + ':method/:id');

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'documentType',
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

		return factory;
	}; // factoryDocumentType

	factoryDocumentType.$inject = ['$totvsresource', '$cacheFactory', 'crm.generic.factory'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_tip_docto.factory', factoryDocumentType);
});
