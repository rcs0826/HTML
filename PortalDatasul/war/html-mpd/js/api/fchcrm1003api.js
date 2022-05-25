/*globals angular, index, define, TOTVSEvent, CRMURL, CRMEvent, CRMUtil, CRMRestService*/
/*jslint plusplus: true */
define([
	'index',
], function (index) {

	'use strict';

	var factory;

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factory = function ($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchcrm/fchcrm1003/:method/:id', undefined, undefined);

		factory.findLeads = function (parameters, options, callback) {

			var i, properties = [], values = [], parameters;

			parameters.method = 'leads';

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['nom_razao_social']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc = [true]; }

			if (!options.end || options.end <= 0) {
				options.end = 50;
			}

			if (!options.type || options.type <= 0) {
				options.type = 8;
			}

			if (!options.entity) {
				options.entity = 4; // 0. ALL 1. CONTA 2. CONTATO 3. CLIENTE/CONTATO 4.SOMENTE LEAD
			}

			if (options) { angular.extend(parameters, options); }

			return this.TOTVSQuery(parameters, function (result) {
				if (callback) {
					callback((result && result.length > 0 ? result : []));
				}
			}, options.headers, options.cache);

		};

		factory.canOpenSalesOrder = function (accountId, callback) {
			return this.TOTVSGet({method: 'can_open_sales_order', account: accountId}, function (result) {
				if (callback) {
					var value = false;
					if (result && result.isOk) {
						value = (result.isOk === true);
					}
					callback(value);
				}
			});
		};

		factory.canConvertQuotation = function (accountId, callback) {
			return this.TOTVSGet({method: 'is_customer', account: accountId}, function (result) {
				if (callback) {
					var value = false;
					if (result && result.isOk) {
						value = (result.isOk === true);
					}
					callback(value);
				}
			});
		};

		return factory;
	};

	factory.$inject = [
		'$totvsresource'
	];

	index.register.factory('crm.crm_lead.factory', factory);

});
