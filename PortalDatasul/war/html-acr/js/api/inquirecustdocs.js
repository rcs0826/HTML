/*global angular */
define([
	'index',
	'totvs-html-framework',
	'/dts/acr/js/acr-utils.js'
], function (index) {

	'use strict';
	var factoryInquireCustDocs;

	factoryInquireCustDocs.$inject = ['$totvsresource', '$cacheFactory'];
	function factoryInquireCustDocs($totvsresource, $cacheFactory) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchacr/inquirecustdocs/:method/:id/', {}, {
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

		cache = $cacheFactory('acr.inquirecustdocs.Cache');

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

		factory.getDocumentList = function (parameters, callback, headers) {
			return this.TOTVSPost({ method: 'getDocumentList'}, parameters, callback, headers);
		}

		factory.getTotalInquireCustDocs = function (dataemis, datavenc, callback) {
			return this.TOTVSQuery({ method: 'getTotalInquireCustDocs', dataemis: dataemis, datavenc: datavenc }, callback);
		};

		factory.getRangeInquireCustDocs = function (dataemis, datavenc, callback) {
			return this.TOTVSQuery({ method: 'getRangeInquireCustDocs', dataemis: dataemis, datavenc: datavenc }, callback);
		};

		return factory;

	} // function factoryInquireCustDocs(genericFactory)

	index.register.factory('acr.inquirecustdocs.Factory', factoryInquireCustDocs);

});
