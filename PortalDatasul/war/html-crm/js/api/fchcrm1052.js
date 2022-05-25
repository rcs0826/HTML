/*globals angular, index, define, CRMUtil, CRMURL */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryProperties;

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryProperties = function ($totvsresource, factoryGeneric, factoryGenericZoom, factoryGenericTypeahead) {

		var factory = $totvsresource.REST(CRMURL.propertiesService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['num_id']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		return factory;
	};

	factoryProperties.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory', 'crm.generic.typeahead.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_propried.factory', factoryProperties);

});
