/*globals index, define, angular, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factory;
    
    factory = function ($totvsresource, factoryGeneric, factoryGenericZoom, factoryGenericTypeahead,
                        factoryGenericDetail, factoryGenericCreateUpdate) {
        var factory = $totvsresource.REST(CRMRestService + '1107/:method/:id', undefined,
										  factoryGenericCreateUpdate.customActions);

        angular.extend(factory, factoryGenericZoom);
        angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericCreateUpdate);


		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};
        
        factory.removeRule = function (id, callback) {
			return this.TOTVSRemove({id: id}, callback);
		};

        
        return factory;

    };
    
    factory.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory', 'crm.generic.typeahead.factory', 'crm.generic.detail.factory',
		'crm.generic.create.update.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.ticket-flow-status-rules.factory', factory);

});