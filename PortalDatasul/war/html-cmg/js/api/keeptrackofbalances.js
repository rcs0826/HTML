/*global angular */
define([
	'index', 
	'totvs-html-framework', 
	'/dts/cmg/js/cmg-utils.js'
], function (index) {

	'use strict';
	var factoryKeepTrackOfBalances;
	
	factoryKeepTrackOfBalances.$inject = ['$totvsresource'];
	function factoryKeepTrackOfBalances($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchcmg/keeptrackofbalances/:method/:id/', {}, {
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

		factory.getBalancesByCompany = function (callback) {
			return this.TOTVSQuery({ method: 'getBalancesByCompany' }, callback);
		};

		factory.getBalancesByBank = function (callback) {
			return this.TOTVSQuery({ method: 'getBalancesByBank' }, callback);
		};

		factory.getBalancesByUFC = function (callback) {
			return this.TOTVSQuery({ method: 'getBalancesByUFC' }, callback);
		};

		factory.getBalancesByCheckingAccount = function (callback) {
			return this.TOTVSQuery({ method: 'getBalancesByChkAccount' }, callback);
		};

		return factory;

	} // function factoryKeepTrackOfBalances(genericFactory)
	
	index.register.factory('cmg.keeptrackofbalances.Factory', factoryKeepTrackOfBalances);

});