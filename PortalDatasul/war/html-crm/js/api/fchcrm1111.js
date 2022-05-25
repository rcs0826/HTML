/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';
	var factoryTicketClassification;

	factoryTicketClassification = function ($totvsresource, factoryGeneric, factoryGenericZoom, $cacheFactory, factoryGenericCreateUpdate, factoryGenericDetail, factoryGenericDelete) {

		var factory = $totvsresource.REST(CRMRestService + '1111/:method/:id', undefined,
										  factoryGenericCreateUpdate.customActions),
			cache = $cacheFactory('crm.ticket-classification.Cache');

		angular.extend(factory, factoryGeneric);
		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.getTicketClassification = function (ticketClassificationId, callback, isAllowedCache) {
			isAllowedCache = isAllowedCache !== false;

			var idCache = 'ticket-classification-' + ticketClassificationId,
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'detail', id: ticketClassificationId}, function (data) {
					cache.put(idCache, data[0]);
					if (callback) { callback(data[0]); }
				});
			}
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'all-ticket-classification',
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

		factory.getAllProducts = function (properties, values, options, callback) {
			return this.TOTVSQuery({method: 'products',
									properties: properties,
									values: values,
									start: options.start,
									end: options.end}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.removeProduct = function (id, callback) {
			return this.TOTVSRemove({method: 'products', id: id}, callback);
		};

		factory.saveProduct = function (model, callback) {
			return this.DTSPost({ method: 'product'}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.removeResource = function (id, callback) {
			return this.TOTVSRemove({method: 'product_resource', id: id}, callback);
		};

		factory.addResource = function (model, callback) {
			return this.DTSPost({method: 'product_resources'}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.getProductResources = function (productId, callback) {
			return this.TOTVSQuery({method: 'product_resources', productId: productId}, function (result) {
				if (callback) { callback(result); }
			});
		};

		return factory;
	}; // factoryTicketClassification
	factoryTicketClassification.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory', '$cacheFactory', 'crm.generic.create.update.factory', 'crm.generic.detail.factory', 'crm.generic.delete.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_classif_ocor.factory', factoryTicketClassification);
});
