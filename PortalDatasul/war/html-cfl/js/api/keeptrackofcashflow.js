/*global angular */
define([
	'index', 
	'totvs-html-framework', 
	'/dts/cfl/js/cfl-utils.js'
], function (index) {

	'use strict';
	var factoryKeepTrackOfCashFlow;
	
	factoryKeepTrackOfCashFlow.$inject = ['$totvsresource'];
	function factoryKeepTrackOfCashFlow($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchcfl/keeptrackofcashflow/:method/:id/', {}, {
			postArray: {
				method: 'POST',
				isArray: true
			},
			getArray: {
				method: 'GET',
				isArray: true
			}
		});

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

		factory.getCashFlow = function (standardViewCode, ucfCode, callback) {
			return this.TOTVSQuery({ method: 'getCashFlow', standardViewCode: standardViewCode, ucfCode: ucfCode}, callback);
		};

		factory.getCashFlowForecast = function (standardViewCode, ucfCode, callback) {
			return this.TOTVSQuery({ method: 'getCashFlowForecast', standardViewCode: standardViewCode, ucfCode: ucfCode}, callback);
		};

		return factory;

	} // function factoryKeepTrackOfCashFlow(genericFactory)
	
	index.register.factory('cfl.keeptrackofcashflow.Factory', factoryKeepTrackOfCashFlow);

});