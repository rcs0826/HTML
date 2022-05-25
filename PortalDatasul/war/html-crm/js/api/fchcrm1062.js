/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryDataSegmentation;

	factoryDataSegmentation = function ($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('crm.data_segmentation.Cache'),
			factory = $totvsresource.REST(CRMURL.dataSegmentationService + ':method/:id');

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'groups',
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

		factory.getDataSegmentation = function (id, callback) {

			return this.TOTVSQuery({method: 'data_segmentation', group: id}, function (data) {
				if (callback) { callback(data); }
			});
		};

		return factory;
	};
	// factoryDataSegmentation
	factoryDataSegmentation.$inject = ['$totvsresource', '$cacheFactory', 'crm.generic.factory'];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_segmtcao_dados.factory', factoryDataSegmentation);
});
