/*globals index, define, angular, CRMURL, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var prfvHelper,
		factoryPrfv;

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	prfvHelper = function (legend) {

		this.parseCalculationFrequency = function (prfv) {
			if (prfv && prfv.idi_calc_freq) {
				prfv.nom_calc_freq = legend.calculationFrequency.NAME(prfv.idi_calc_freq);
				prfv.ttFreqCalc = {
					num_id: prfv.idi_calc_freq,
					nom_freq: prfv.nom_calc_freq
				};
			}
		};
	};
	prfvHelper.$inject = ['crm.legend'];

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************


	factoryPrfv = function ($totvsresource, factoryGeneric, factoryGenericZoom,
						 factoryGenericTypeahead, factoryGenericDetail, $cacheFactory) {

		var factory = $totvsresource.REST(CRMURL.rangePrfvService + ':method/:id'),
			cache = $cacheFactory('crm.prfv.Cache');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);


		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['val_recenc_freq_val']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getSummary = function (idAccount, callback, isAllowedCache) {

			if (idAccount) {
				isAllowedCache = isAllowedCache !== false;

				var idCache = 'summaryPrfv-' + idAccount,
					result = (isAllowedCache ? cache.get(idCache) : undefined);

				if (result) {
					if (callback) { callback(result); }
				} else {
					return this.TOTVSQuery({method: 'summary_prfv', account: idAccount}, function (result) {
						if (result) { result.reverse(); }
						cache.put(idCache, result);
						if (callback) { callback(result); }
					});
				}
			}
		};

		factory.getAllPrfvs = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'prfvs',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'param_prfv'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	}; // factoryPrfv
	factoryPrfv.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.detail.factory', '$cacheFactory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.prfv.helper', prfvHelper);

	index.register.factory('crm.crm_prfv_faixa.factory', factoryPrfv);

});
