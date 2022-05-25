/*global angular */
define([
	'index',
	'totvs-html-framework',
	'/dts/acr/js/acr-utils.js'
], function (index) {

	'use strict';
	var factoryKeeptrackofstatementimportations;

	factoryKeeptrackofstatementimportations.$inject = ['$totvsresource', '$cacheFactory'];
	function factoryKeeptrackofstatementimportations($totvsresource, $cacheFactory) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchcmg/keeptrackofstatementimportations/:method/:id/', {}, {
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

		cache = $cacheFactory('cmg.dashboard.keeptrackofstatementimportations.Cache');

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

		factory.getStatementImportations = function (callback) {
			return this.TOTVSQuery({ method: 'getStatementImportations'}, callback);
		}

		return factory;

	} // function factoryInquireCustDocs(genericFactory)

	index.register.factory('cmg.dashboard.keeptrackofstatementimportations.Factory', factoryKeeptrackofstatementimportations);

});