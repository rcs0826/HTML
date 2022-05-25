/*globals angular, define, CRMURL, CRMUtil*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factorySegmentation;

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************
	factorySegmentation = function ($totvsresource, factoryGeneric, $cacheFactory, factoryGenericTypeahead) {

		var cache = $cacheFactory('crm.segmtcao.Cache'),
			factory = $totvsresource.REST(CRMURL.segmentationService + ':method/:id');

		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['num_id']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAllSegmentations = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allSegmentation',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'segmentation'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	}; // factorySegmentation

	factorySegmentation.$inject = [
		'$totvsresource', 'crm.generic.factory', '$cacheFactory', 'crm.generic.typeahead.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_segmtcao.factory', factorySegmentation);

});
