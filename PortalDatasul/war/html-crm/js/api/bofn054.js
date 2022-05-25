/*globals index, define, angular, CRMURL, CRMUtil, CRMRestService, callback*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryReason;

	// *************************************************************************************
	// *** FACTORY REASON (sales order/ quotation)
	// *************************************************************************************

	factoryReason = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom) {

		var factory;

		factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/fnbo/bofn054');

		angular.extend(factory, factoryGenericZoom);

		factory.findRecords = function (filters, options, callback) {

			var queryproperties = {};

			queryproperties.fields = 'cod_servid_exec,des_servid_exec';

			if (filters && filters.length > 0) {
				queryproperties.property = filters[0].property;
				queryproperties.value = filters[0].value;
			}

			return this.TOTVSQuery(queryproperties, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			}, { noErrorMessage: true });
		};

		return factory;
	};

	factoryReason.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################
	index.register.factory('crm.fn_servidor_rpw.factory', factoryReason);

});
