/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryTicketOrigin;

	factoryTicketOrigin = function ($totvsresource, factoryGeneric, factoryGenericZoom, $cacheFactory) {

		var factory = $totvsresource.REST(CRMURL.ticketOriginService + ':method/:id'),
			cache = $cacheFactory('crm.ticket-origin.Cache');

		angular.extend(factory, factoryGeneric);
		angular.extend(factory, factoryGenericZoom);

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'ticket-origin',
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
	}; // factoryTicketOrigin
	factoryTicketOrigin.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory', '$cacheFactory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_orig_ocor.factory', factoryTicketOrigin);

});
