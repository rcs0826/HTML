/*global $, index, angular, define, TOTVSEvent, apbEvent, apbUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index'
], function (index) {

	'use strict';

	var serviceInquireVendorDocsParam;

	// *************************************************************************************
	// *** SERVICE PARAM
	// *************************************************************************************

	serviceInquireVendorDocsParam = function () {
		var self = this;

		this.paramOpp = undefined;

		this.setParamOpp = function (param, callback) {

			self.paramOpp = param;
			if (callback) { callback(); }
		};
	}; // serviceInquireVendorDocsParam
	serviceInquireVendorDocsParam.$inject = [];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('apb.inquirevendordocs.param-service', serviceInquireVendorDocsParam);
});
