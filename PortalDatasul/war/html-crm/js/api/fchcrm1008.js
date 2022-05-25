/*globals index, angular, define, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryPostalCode;

	factoryPostalCode = function ($totvsresource, factoryGeneric, factoryGenericZoom,
								  factoryGenericTypeahead, factoryGenericDetail) {

		var factory = $totvsresource.REST(CRMURL.postalcodeService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc     = [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.validatePostalCode = function (cep, callback) {
			return this.TOTVSQuery({method: 'validate_postal_code', code: cep}, function (result) {
				if (callback) {
					callback(result);
				}
			});
		};

		return factory;
	};

	factoryPostalCode.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.detail.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_cep.factory', factoryPostalCode);

});
