/*global angular */
define([
	'index',
	'totvs-html-framework',
	'/dts/acr/js/acr-utils.js'
], function (index) {

	'use strict';
	var factoryInquireDocDetail;

	factoryInquireDocDetail.$inject = ['$totvsresource', '$cacheFactory'];
	function factoryInquireDocDetail($totvsresource, $cacheFactory) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchacr/inquiredocdetail/:method/:id/', {}, {
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

		cache = $cacheFactory('apb.inquiredocdetail.Cache');

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
			return this.TOTVSPost({ method: 'getDocDetail'}, parameters, callback);
		};

		return factory;

	} // function factoryInquireCustDocs(genericFactory)

	index.register.factory('acr.inquiredocdetail.Factory', factoryInquireDocDetail);

});