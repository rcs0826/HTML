/*global $, index, angular, define, TOTVSEvent, ACREvent, ACRUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index'
], function (index) {

	'use strict';

	var serviceInquireVendorDocDetailParam;

	// *************************************************************************************
	// *** SERVICE PARAM
	// *************************************************************************************

	serviceInquireVendorDocDetailParam = function () {
		var self = this;

		this.paramOpp = undefined;

		this.setParamOpp = function (param, callback) {

			self.paramOpp = param;
			if (callback) { callback(); }
		};
	}; // serviceInquireVendorDocsParam
	serviceInquireVendorDocDetailParam.$inject = [];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('apb.inquirevendordocdetail.param-service', serviceInquireVendorDocDetailParam);
});
