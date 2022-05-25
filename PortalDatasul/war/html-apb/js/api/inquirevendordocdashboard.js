/*global angular */
define([
	'index',
	'totvs-html-framework',
	'/dts/apb/js/apb-utils.js'
], function (index) {

	'use strict';
	var factoryInquireVendorDocDashboard;

	factoryInquireVendorDocDashboard.$inject = ['$totvsresource', '$cacheFactory', 'apb.generic.Controller'];
	function factoryInquireVendorDocDashboard($totvsresource, $cacheFactory, genericController) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchapb/inquirevendordocdashboard/:method/:id/', {}, {
			postArray: {
				method: 'POST',
				isArray: true
			},
			getArray: {
				method: 'GET',
				isArray: true
			}
		}),
			cache;

		cache = $cacheFactory('apb.inquirevendordocdashboard.Cache');

		factory.TOTVSPostArray = function (parameters, model, callback, headers) {
			this.parseHeaders(headers);
			var call = this.postArray(parameters, model);
			return this.processPromise(call, callback);
		};

		factory.TOTVSGetArray = function (parameters, model, callback, headers) {
			this.parseHeaders(headers);
			var call = this.getArray(parameters, model);
			return this.processPromise(call, callback);
		};

		factory.getDocumentList = function (parameters, options, callback) {
			return genericController.findRecord(parameters, options, callback, this);
		};

		factory.getTotalInquireVendorDoc = function (dataemis, datavenc, callback) {
			return this.TOTVSQuery({ method: 'getTotalInquireVendorDoc', dataemis: dataemis, datavenc: datavenc }, callback);
		};

		factory.getRangeInquireVendorDoc = function (dataemis, datavenc, callback) {
			return this.TOTVSQuery({ method: 'getRangeInquireVendorDoc', dataemis: dataemis, datavenc: datavenc }, callback);
		};

		return factory;

	} // function factoryInquireVendorDocDashboard(genericFactory)

index.register.factory('apb.inquirevendordocdashboard.Factory', factoryInquireVendorDocDashboard);

});