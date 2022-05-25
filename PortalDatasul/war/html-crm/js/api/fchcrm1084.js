/*globals index, define, angular, CRMURL, CRMUtil, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	var factoryCause;

	factoryCause = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
						 factoryGenericTypeahead, factoryGenericCreateUpdate,
						 factoryGenericDetail, factoryGenericDelete) {

		var factory;

		factory = $totvsresource.REST(CRMRestService + '1084/:method/:id/:cause',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericDelete);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['nom_causa']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		return factory;
	};
	// factoryCause
	factoryCause.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_causa_ocor.factory', factoryCause);

});
