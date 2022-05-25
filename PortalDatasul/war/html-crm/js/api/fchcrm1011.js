/*global $, index, angular, define, TOTVSEvent, CRMURL*/

define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryFederation;

	factoryFederation = function ($totvsresource, $cacheFactory, factoryGeneric,
							   factoryGenericZoom, factoryGenericTypeahead,
							   factoryGenericDetail) {

		var cache = $cacheFactory('crm.federation.Cache'),
			factory = $totvsresource.REST(CRMURL.federationService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (idCountry, callback) {

			var idCache = (idCountry ? 'federation-for-' + idCountry : 'federations'),
				result = cache.get(idCache);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all', country: idCountry}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	}; // factoryFederation
	factoryFederation.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory',
		'crm.generic.detail.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_unid_federac.factory', factoryFederation);

});
