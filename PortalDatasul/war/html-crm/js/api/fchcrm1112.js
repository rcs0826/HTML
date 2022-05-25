/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/

define([
    'index',
    '/dts/crm/js/crm-factories.js'
], function (index) {
   
    'use strict';
    
    var factory;
    
    factory = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom) {
    
        var factory = $totvsresource.REST(CRMRestService + '1112/:id', undefined);

		angular.extend(factory, factoryGenericZoom);
        
        factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};
        
        
        return factory;

    };
    
    factory.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.factory', 'crm.generic.zoom.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_produt_suport.factory', factory);

});