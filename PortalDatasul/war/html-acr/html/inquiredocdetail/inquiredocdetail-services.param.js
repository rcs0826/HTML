/*global $, index, angular, define, TOTVSEvent, ACREvent, ACRUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index'
], function (index) {

	'use strict';

	var serviceInquireDocDetailParam;

	// *************************************************************************************
	// *** SERVICE PARAM
	// *************************************************************************************

	serviceInquireDocDetailParam = function () {
		var self = this;

		this.paramOpp = undefined;

		this.setParamOpp = function (param, callback) {

			self.paramOpp = param;
			if (callback) { callback(); }
		};
	}; // serviceInquireCustDocsParam
	serviceInquireDocDetailParam.$inject = [];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('acr.inquiredocdetail.param-service', serviceInquireDocDetailParam);
});
