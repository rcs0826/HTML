/*global angular */
define([
	'index', 
	'totvs-html-framework', 
	'/dts/acr/js/acr-utils.js'
], function (index) {

	'use strict';
	var factoryInquireRepDocs;
	
	factoryInquireRepDocs.$inject = ['$totvsresource', 'acr.generic.Controller'];
	function factoryInquireRepDocs($totvsresource, genericController) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchacr/inquirerepdocs/:method/:id/', {}, {
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

		factory.getTotalInquireRepDocs = function (cdncliente, dataemis, datavenc, callback) {
			return this.TOTVSQuery({ method: 'getTotalInquireRepDocs', cdncliente: cdncliente, dataemis: dataemis, datavenc: datavenc }, callback);
		};

		factory.getRangeInquireRepDocs = function (cdncliente, dataemis, datavenc, callback) {
			return this.TOTVSQuery({ method: 'getRangeInquireRepDocs', cdncliente: cdncliente, dataemis: dataemis, datavenc: datavenc }, callback);
		};

		factory.getCustomersOfRepresentative = function (dataemis, datavenc, callback) {
			return this.TOTVSQuery({ method: 'getCustomersOfRepresentative', dataemis: dataemis, datavenc: datavenc }, callback);
		};

		factory.getNomAbrevCustomer = function (cdncliente, callback) {
			return this.TOTVSQuery({ method: 'getNomAbrevCustomer', cdncliente: cdncliente }, callback);
		};

		return factory;

	} // function factoryInquireRepDocs(genericFactory)
	
	index.register.factory('acr.inquirerepdocs.Factory', factoryInquireRepDocs);

});