/*global angular */
define([
	'index',
	'totvs-html-framework',
	'/dts/apb/js/apb-utils.js'
], function (index) {

	'use strict';
	var factoryInquireVendorDocDetail;

	factoryInquireVendorDocDetail.$inject = ['$totvsresource', '$cacheFactory'];
	function factoryInquireVendorDocDetail($totvsresource, $cacheFactory) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchapb/inquirevendordocdetail/:method/:id/', {}, {
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

		cache = $cacheFactory('apb.inquirevendordocdetail.Cache');

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

		factory.getDocDetail = function (parameters, callback) {
			return this.TOTVSPostArray({ method: 'getDocDetail'}, parameters, callback);
		};

		return factory;

	} // function factoryInquireVendorDocs(genericFactory)

index.register.factory('apb.inquirevendordocdetail.Factory', factoryInquireVendorDocDetail);

});