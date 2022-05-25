/*globals index, define, angular, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factory;
    
    factory = function ($totvsresource, factoryGeneric, factoryGenericZoom, factoryGenericCreateUpdate, factoryGenericTypeahead) {
        var factory = $totvsresource.REST(CRMRestService + '1108/:method/:id', undefined, factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericCreateUpdate);
        angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};
        
        return factory;

    };
    
    factory.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory', 'crm.generic.create.update.factory', 'crm.generic.typeahead.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_recur.factory', factory);

});