/*globals angular, define, CRMURL, CRMUtil*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryFacilit;

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************
	factoryFacilit = function ($totvsresource, factoryGeneric) {

		var factory = $totvsresource.REST(CRMURL.facilitService + ':method/:id');

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['num_id']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		return factory;
	}; // factoryFacilit

	factoryFacilit.$inject = [
		'$totvsresource', 'crm.generic.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_pessoa_facil.factory', factoryFacilit);

});
