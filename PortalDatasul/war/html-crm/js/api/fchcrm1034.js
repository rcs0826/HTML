/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryTicketPriority;
    
	factoryTicketPriority = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericCreateUpdate, factoryGenericDetail, factoryGenericDelete, factoryGenericZoom) {

		var factory = $totvsresource.REST(CRMURL.ticketPriorityService + ':method/:id', undefined, factoryGenericCreateUpdate.customActions),
			cache = $cacheFactory('crm.ticket-priority.Cache');

		angular.extend(factory, factoryGeneric);
		angular.extend(factory, factoryGenericCreateUpdate);
        angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericZoom);


		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'ticket-priority',
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
        
        factory.findResourceLevel = function (id, quickSearch, callback) {
            return this.TOTVSQuery({method: 'resourceLevel', id: id, quickSearch: quickSearch}, function (result) {
                if (callback) { callback(result); }
            });
        };
        
        factory.deleteResourceLevel = function (id, callback) {
            return this.TOTVSRemove({method: 'resourceLevel', id: id}, callback);
        };
        
        factory.saveResourceLevel = function (model, callback) {
            return this.DTSPost({method: 'resourceLevel'}, model, function (result) {
				if (callback) { callback(result); }
			});
        };
        
        factory.updateResourceLevel = function (id, model, callback) {
            return this.DTSPut({method: 'resourceLevel', id: id}, model, function (result) {
				if (callback) { callback(result); }
			});
        };

		return factory;
	};
	// factoryTicketPriority
	factoryTicketPriority.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory', 'crm.generic.zoom.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_priorid_ocor.factory', factoryTicketPriority);

});
