/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {
	'use strict';

	var factoryReference;

	factoryReference = function ($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('crm.reference.Cache'),
			factory = $totvsresource.REST(CRMURL.referenceService + ':method/:id');

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (idProduct, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'references-' + (idProduct || 'none'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({
					method: 'all',
					product: idProduct
				}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getByTableItem = function (idPriceTableItem, callback) {
			return this.TOTVSQuery({
				method: 'by_table_item',
				price_table_item: idPriceTableItem
			}, function (data) {
				if (callback) { callback(data); }
			});
		};

		return factory;
	}; // factoryReference

	factoryReference.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_refer.factory', factoryReference);

});
