/*globals angular, define, CRMURL, CRMUtil, CRMRestService*/

define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryClassificationItem;

	factoryClassificationItem = function ($totvsresource, factoryGeneric, factoryGenericZoom, factoryGenericTypeahead, factoryGenericDetail) {
		var factory = $totvsresource.REST(CRMRestService + '1075/:method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);


		factory.findRecords = function (parameters, options, callback) {
			options = options || {};

			options.orderBy = ['num_id'];
			options.asc     = [false];


			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		return factory;
	}; // factoryClassificationItem

	factoryClassificationItem.$inject = ['$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory', 'crm.generic.typeahead.factory', 'crm.generic.detail.factory'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_classif_ocor_item.factory', factoryClassificationItem);

});
