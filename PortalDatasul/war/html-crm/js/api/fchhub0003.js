/*globals index, define, angular, CRMURL, CRMRestService, HIERRestService*/
define([
    'index',
    '/dts/crm/js/crm-factories.js'
], function (index) {
    
    'use strict';
    
    var factory;
    
    factory = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericCreateUpdate, factoryGenericDetail, factoryGenericDelete) {

		var cache = $cacheFactory('tip.hier.cache'),
			factory,
            actions = angular.copy(factoryGenericCreateUpdate.customActions);
        
        actions.DTSGetLongChar = {
			method: 'GET',
			isArray: false,
			headers: {}
		};
        
        factory = $totvsresource.REST(HIERRestService + '0003/:method/:id', undefined, actions);

		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['nom_tip_hier'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

        factory.getHierarchyLevels = function (id, callback) {
            return this.DTSGetLongChar({method: 'hierarchyLevels', id: id}, function (result) {
				if (callback) { callback(result); }
            });
        };
        
//        factory.getHierarchyNoReport = function (id, callback) {
//            return this.DTSGetLongChar({method: 'hierarchyNoReport', id: id}, function (result) {
//				if (callback) { callback(result); }
//            });
//        };
        
        factory.getHierarchies = function (id, callback) {
            return this.TOTVSQuery({method: 'hierarchies', id: id}, function (result) {
                if (callback) { callback(result); }
            });
        };
        
        factory.saveHierarchy = function (model, callback) {
            return this.DTSPost({method: 'hierarchy'}, model, function (result) {
				if (callback) { callback(result); }
			});
        };
        
        factory.updateHierarchy = function (id, model, callback) {
            return this.DTSPut({method: 'hierarchy', id: id}, model, function (result) {
				if (callback) { callback(result); }
			});
        };
        
        factory.findHierarchy = function (id, callback) {
            return this.TOTVSQuery({method: 'hierarchy', id: id}, function (result) {
                if (callback) { callback(result); }
            });
        };
        
        factory.deleteHierarchy = function (id, callback) {
            return this.TOTVSRemove({method: 'hierarchy', id: id}, callback);
        };
        
        factory.findUsers = function (id, quickSearch, callback) {
            return this.TOTVSQuery({method: 'users', id: id, quickSearch: quickSearch}, function (result) {
                if (callback) { callback(result); }
            });
        };
        
        factory.saveUsers = function (model, callback) {
            return this.DTSPost({method: 'users'}, model, function (result) {
				if (callback) { callback(result); }
			});
        };

        factory.removeUser = function (id, callback) {
            return this.TOTVSRemove({method: 'user', id: id}, callback);
        };
        
		return factory;
	};

	factory.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('hier.tip_hier.factory', factory);

});