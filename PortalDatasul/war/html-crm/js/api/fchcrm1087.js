/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryMasterUser;

	factoryMasterUser = function ($totvsresource, factoryGeneric, factoryGenericZoom,
								   factoryGenericTypeahead, factoryGenericCreateUpdate) {

		var factory = $totvsresource.REST(CRMRestService + '1087/:method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['cod_usuario'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		return factory;
	}; // factoryMasterUser

	factoryMasterUser.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.usuar_mestre.factory', factoryMasterUser);

});
