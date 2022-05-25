/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
    'index',
    '/dts/crm/js/crm-factories.js'
], function (index) {
    
    'use strict';
    
    var transferenceFactory;
    
    // *************************************************************************************
    // *** TRANSFERENCE PROCESS FACTORY
    // *************************************************************************************
    transferenceFactory = function ($totvsresource, factoryGeneric, factoryGenericCreateUpdate) {
    
        var actions = angular.copy(factoryGenericCreateUpdate.customActions),
            factory;

        actions.DTSPostNoCountRequest = {
			method: 'POST',
            isArray: false,
			headers: { noCountRequest: true }
		};

        factory = $totvsresource.REST(CRMRestService + '1091/:method/:id', undefined,  actions);
        
        angular.extend(factory, factoryGenericCreateUpdate);
        
        factory.transfer = function (model, callback) {
            return this.DTSPostNoCountRequest({method: 'transfer'}, model, function (result) {
                if (callback) { callback(result); }
            });
        };

        return factory;
    };
                                     
    transferenceFactory.$inject = [
        '$totvsresource', 'crm.generic.factory', 'crm.generic.create.update.factory', 'Upload'
    ];

    // *************************************************************************************
    // *** REGISTER
    // *************************************************************************************
    index.register.factory('crm.crm_log_transf.factory', transferenceFactory);
});