/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryTicketRating;

	factoryTicketRating = function ($totvsresource, factoryGeneric, $cacheFactory) {

		var factory = $totvsresource.REST(CRMURL.ticketRatingService + ':method/:id'),
			cache = $cacheFactory('crm.ticket-rating.Cache');

		angular.extend(factory, factoryGeneric);

		factory.getProduct = function(idRating, productName, callback, isAllowedCache){

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'ticket-rating-products-' + idRating,
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
                  return this.TOTVSQuery({method: 'product', rating: idRating, product: productName}, function(data){
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'ticket-rating',
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
	}; // factoryTicketRating
	factoryTicketRating.$inject = [
		'$totvsresource', 'crm.generic.factory', '$cacheFactory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_classificacao_ocor.factory', factoryTicketRating);

});
