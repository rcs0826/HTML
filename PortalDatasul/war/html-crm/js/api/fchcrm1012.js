/*global $, index, angular, define, TOTVSEvent, CRMURL*/

define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryCity;


	factoryCity = function ($totvsresource, factoryGeneric, factoryGenericZoom,
							 factoryGenericTypeahead, factoryGenericDetail) {

		var factory = $totvsresource.REST(CRMURL.cityService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		return factory;
	}; // factoryCity
	factoryCity.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.detail.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_cidad.factory', factoryCity);

});
