/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
    'index',
    '/dts/crm/js/crm-factories.js'
], function (index) {
    'use strict';
    
    var factory;
    
    factory = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericCreateUpdate, factoryGenericDetail, factoryGenericDelete) {
        
		var cache = $cacheFactory('crm.class-transition.Cache'),
			factory = $totvsresource.REST(CRMRestService + '1115/:method/:id', undefined,
										  factoryGenericCreateUpdate.customActions);
        
        angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

        factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'classTranstion',
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

		return factory;
	};
    
    factory.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.create.update.factory', 'crm.generic.detail.factory', 'crm.generic.delete.factory'
	];


    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.factory('crm.crm_transf_class.factory', factory);
});