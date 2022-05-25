/*global angular */
define([
	'index',
	'totvs-html-framework',
	'/dts/apb/js/apb-utils.js'
], function (index) {

	'use strict';
	var factoryinquireVendorSettlementsDocs;

	factoryinquireVendorSettlementsDocs.$inject = ['$totvsresource', 
										'$cacheFactory', 
										'apb.generic.Controller'];
										
	function factoryinquireVendorSettlementsDocs($totvsresource, $cacheFactory, genericController) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchapb/inquirevendorsettlementsdocs/:method/:id/', {}, {
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

		cache = $cacheFactory('apb.inquirevendorsettlementsdocs.Cache');

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

		factory.getUnitMatrix = function (callback) {
			return this.TOTVSQuery({ method: 'getUnitMatrix' }, callback);
		};

		factory.getDocumentList = function (parameters, callback, headers) {
			return this.TOTVSPost({method: 'getDocumentList' }, parameters, callback, headers);
		};

		return factory;

	} // function factoryInquireVendorDocs(genericFactory)

index.register.factory('apb.inquirevendorsettlementsdocs.Factory', factoryinquireVendorSettlementsDocs);

});