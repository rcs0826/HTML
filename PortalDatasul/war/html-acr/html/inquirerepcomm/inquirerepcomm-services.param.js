/*global $, index, angular, define, TOTVSEvent, ACREvent, ACRUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index'
], function (index) {

	'use strict';

	var serviceInquireRepCommParam;

	// *************************************************************************************
	// *** SERVICE PARAM
	// *************************************************************************************

	serviceInquireRepCommParam = function () {
		var self = this;

		this.paramOpp = undefined;

		this.setParamOpp = function (param, callback) {
			self.paramOpp = param;
			if (callback) { callback(); }
		};
	}; // serviceInquireRepCommParam
	serviceInquireRepCommParam.$inject = [];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('acr.inquirerepcomm.param-service', serviceInquireRepCommParam);
});
