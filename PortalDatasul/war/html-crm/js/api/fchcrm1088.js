/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var invoiceFactory;

	invoiceFactory = function ($totvsresource, factoryGeneric, factoryGenericZoom,
								   factoryGenericTypeahead, factoryGenericCreateUpdate) {

		var factory = $totvsresource.REST(CRMRestService + '1088/:method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};


			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		return factory;
	}; //invoiceFactory

	invoiceFactory.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.nota_fiscal.factory', invoiceFactory);

});
