/*globals index, define, angular, CRMURL, CRMUtil, CRMRestService, callback*/

define([
	'index'
], function (index) {

	'use strict';

	var factorySalesOrder;

	// *************************************************************************************
	// *** FACTORIES MPD SALES ORDER
	// *************************************************************************************

    factorySalesOrder = function ($totvsresource) {

		var specificResources, factory;

		specificResources = {
			'getParameters': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/parameters'
			},
			'getOrder':	{
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/order/:nrPedido'
			},
			'calculateOrder':	{
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/calculate/:nrPedido'
			},
			'deleteOrder': {
				method: 'DELETE',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/order/:nrPedido'
			},
			'dtsCancelOrder': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/cancelorder/:nrPedido'
			},
			'dtsCancelQuotation': {
				method: 'PUT',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/cancelquotation/:nrPedido'
			},
			'dtsHasOpenQuotationOrOrderForOpportunity': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/hasOpenQuotationOrOrderForOpportunity'
			},
			'dtsCancelOpenQuotationAndOrderForOpportunity': {
				method: 'POST',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/cancelOpenQuotationAndOrderForOpportunity'
			},
			'dtsApplyPriceWithShipping': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051/applypricewithshipping'
			}
		};

		factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0051', {}, specificResources);

		factory.cancelSalesOrder = function (nrPedido, vo, callback) {
			return this.dtsCancelOrder({nrPedido: nrPedido}, vo, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.cancelQuotation = function (nrPedido, vo, callback) {
			return this.dtsCancelQuotation({nrPedido: nrPedido}, vo, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.cancelOpenQuotationAndOrderForOpportunity = function (opportunityId, vo, callback) {
			return this.dtsCancelOpenQuotationAndOrderForOpportunity({opportunityId: opportunityId}, vo, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.hasOpenQuotationOrOrderForOpportunity = function (opportunityId, callback) {
			return this.dtsHasOpenQuotationOrOrderForOpportunity({opportunityId: opportunityId}, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.applyPriceWithShipping = function (establishmentCode, callback) {
			return this.dtsApplyPriceWithShipping({establishmentId: establishmentCode}, function (result) {
				if (result) {

					if (callback) {

						var value = false;

						if (result && result.isCIF) {
							value = (result.isCIF === true);
						}

						callback(value);
					}
				}
			});
		};

        return factory;
    };

	factorySalesOrder.$inject = ['$totvsresource'];

	// ########################################################
	// ### Register
	// ########################################################
	index.register.factory('crm.mpd_fchdis0051.factory', factorySalesOrder);
});
