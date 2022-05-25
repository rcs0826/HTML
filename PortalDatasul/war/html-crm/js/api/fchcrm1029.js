/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryGainLoss;

	factoryGainLoss = function ($totvsresource, $cacheFactory, factoryGeneric) {

		var cache = $cacheFactory('crm.gain-loss.Cache'),
			factory = $totvsresource.REST(CRMURL.gainLossService + ':method/:id');

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['des_motivo'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'gainLosses',
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
	}; // factoryGainLoss

	factoryGainLoss.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_oportun_ganho_perda.factory', factoryGainLoss);

});
