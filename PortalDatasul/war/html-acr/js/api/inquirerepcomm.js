/*global angular */
define([
	'index', 
	'totvs-html-framework', 
	'/dts/acr/js/acr-utils.js'
], function (index) {

	'use strict';
	var factoryInquireRepComm;
	
	factoryInquireRepComm.$inject = ['$totvsresource', 'acr.generic.Controller'];
	function factoryInquireRepComm($totvsresource, genericController) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchacr/inquirerepcomm/:method/:id/', {}, {
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

		factory.findRecords = function (parameters, options, callback) {
			return genericController.findRecord(parameters, options, callback, this);
		};

		factory.getRangeInquireRepComm = function (cdncliente, datainic, datafim, callback) {
			return this.TOTVSQuery({ method: 'getRangeInquireRepComm', cdncliente: cdncliente, datainic: datainic, datafim: datafim }, callback);
		};

		factory.getCustomersOfRepresentative = function (datainic, datafim, callback) {
			return this.TOTVSQuery({ method: 'getCustomersOfRepresentative', datainic: datainic, datafim: datafim }, callback);
		};

		factory.getNomAbrevCustomer = function (cdncliente, callback) {
			return this.TOTVSQuery({ method: 'getNomAbrevCustomer', cdncliente: cdncliente }, callback);
		};

		return factory;

	} // function factoryInquireRepComm(genericFactory)
	
	index.register.factory('acr.inquirerepcomm.Factory', factoryInquireRepComm);

});