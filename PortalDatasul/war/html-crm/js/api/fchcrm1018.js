/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryClientType;

	factoryClientType = function ($totvsresource, $cacheFactory, factoryGeneric,
							   factoryGenericZoom, factoryGenericTypeahead, factoryGenericDelete, factoryGenericCreateUpdate, factoryGenericDetail) {

		var cache = $cacheFactory('crm.client-type.Cache'),
			factory = $totvsresource.REST(CRMURL.clientTypeService + ':method/:id', undefined,
										  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);
        angular.extend(factory, factoryGenericDelete);
        angular.extend(factory, factoryGenericCreateUpdate);
        angular.extend(factory, factoryGenericDetail);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (idAccountType, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'clientTypes-' + (idAccountType || 'none'),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all', type: idAccountType}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};
        
        factory.getAccountTypeList = function (id, callback) {
            return this.TOTVSQuery({method: 'accountTypeList', id: id}, function (result) {
                if (callback) { callback(result); }
            });
        };

        factory.deleteType = function (id, callback) {
            return this.TOTVSRemove({method: 'accountTypeList', id: id}, callback);
        };
        
        factory.saveType = function (model, callback) {
            return this.DTSPost({method: 'accountTypeList'}, model, function (result) {
				if (callback) { callback(result); }
			});
        };
        
        factory.updateType = function (id, model, callback) {
            return this.DTSPut({method: 'accountTypeList', id: id}, model, function (result) {
				if (callback) { callback(result); }
			});
        };
        
		return factory;
	};
	// factoryClientType
	factoryClientType.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory', 'crm.generic.delete.factory', 'crm.generic.create.update.factory', 'crm.generic.detail.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_tip_clien.factory', factoryClientType);

});
