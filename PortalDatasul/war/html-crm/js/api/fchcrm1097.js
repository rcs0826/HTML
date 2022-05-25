/*globals index, define, angular, CRMURL, CRMRestService*/
define([
    'index',
    '/dts/crm/js/crm-factories.js'
], function (index) {

    'use strict';

    var factory;

    factory = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericCreateUpdate,
                         factoryGenericDetail, factoryGenericDelete) {

        var cache = $cacheFactory('crm.status.Cache'),
            factory = $totvsresource.REST(CRMRestService + '1097/:method/:id', undefined,
                                          factoryGenericCreateUpdate.customActions);

        angular.extend(factory, factoryGenericDetail);
        angular.extend(factory, factoryGenericDelete);
        angular.extend(factory, factoryGenericCreateUpdate);

        factory.findRecords = function (parameters, options, callback) {

            options = options || {};

            options.orderBy	= ['nom_status_ocor'];
            options.asc		= [true];

            return factoryGeneric.findRecords(parameters, options, callback, this);
        };

        factory.getAll = function (callback, isAllowedCache) {

            isAllowedCache = isAllowedCache !== false;

            var idCache = 'all',
                result = (isAllowedCache ? cache.get(idCache) : undefined);

            if (result) {
                if (callback) { callback(result); }
            } else {
                return this.TOTVSQuery({ method: 'all' }, function (data) {
                    cache.put(idCache, data);
                    if (callback) { callback(data); }
                });
            }
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

    index.register.factory('crm.crm_status_ocor.factory', factory);

});
