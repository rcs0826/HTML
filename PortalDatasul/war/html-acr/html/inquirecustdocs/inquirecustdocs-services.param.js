/*global $, index, angular, define, TOTVSEvent, ACREvent, ACRUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index'
], function (index) {

	'use strict';

	var serviceInquireCustDocsParam;

	// *************************************************************************************
	// *** SERVICE PARAM
	// *************************************************************************************

	serviceInquireCustDocsParam = function () {
		var self = this;

		this.paramOpp = undefined;

		this.setParamOpp = function (param, callback) {
			self.paramOpp = param;
			if (callback) { callback(); }
		};
	}; // serviceInquireCustDocsParam
	serviceInquireCustDocsParam.$inject = [];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('acr.inquirecustdocs.param-service', serviceInquireCustDocsParam);
});
