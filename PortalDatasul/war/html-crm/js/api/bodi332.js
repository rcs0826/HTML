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

		//factory = $totvsresource.REST(CRMRestService + '1095/:method/:codMotivo/:indTpTrans');
		factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi332/:codMotivo/:indTpTrans');

		angular.extend(factory, factoryGenericZoom);


		factory.findRecords = function (queryproperties, options, callback) {
			return this.TOTVSQuery(queryproperties, function (result) { callback(result); }, { noErrorMessage: true }, true);
		};

		factory.getCancellationReason = function (value, callback) {

			var queryproperties = {};

			queryproperties.property = [];
			queryproperties.value = [];

			if (CRMUtil.isUndefined(value)) {
				value = "";
			}

			queryproperties.id = value;
			queryproperties.method = 'search';
			queryproperties.searchfields = 'cod-motivo, descricao';

			//Define apenas motivo de cancelamento
			queryproperties.property.push('ind-tp-trans');
			queryproperties.value.push('1');

			return this.TOTVSQuery(queryproperties, callback);
		};

		return factory;
	};

	factoryReason.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################
	index.register.factory('crm.mpd_motivo.factory', factoryReason);

});
