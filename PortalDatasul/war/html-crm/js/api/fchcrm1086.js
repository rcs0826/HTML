/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryEstablishment;

	factoryEstablishment = function ($totvsresource, factoryGeneric, factoryGenericZoom,
								   factoryGenericTypeahead, factoryGenericCreateUpdate) {

		var factory = $totvsresource.REST(CRMRestService + '1086/:method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		return factory;
	}; // factoryEstablishment

	factoryEstablishment.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_estab.factory', factoryEstablishment);

});
