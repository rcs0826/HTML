/*global $, index, angular, define, TOTVSEvent, ACREvent, ACRUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index'
], function (index) {

	'use strict';

	var serviceInquireRepDocsParam;

	// *************************************************************************************
	// *** SERVICE PARAM
	// *************************************************************************************

	serviceInquireRepDocsParam = function () {
		var self = this;

		this.paramOpp = undefined;

		this.setParamOpp = function (param, callback) {
			self.paramOpp = param;
			if (callback) { callback(); }
		};
	}; // serviceInquireRepDocsParam
	serviceInquireRepDocsParam.$inject = [];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('acr.inquirerepdocs.param-service', serviceInquireRepDocsParam);
});
