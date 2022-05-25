/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index'
], function (index) {

	'use strict';

	var serviceTaskParam;

	// *************************************************************************************
	// *** SERVICE PARAM
	// *************************************************************************************

	serviceTaskParam = function () {
		var self = this;

		this.paramOpp = undefined;

		this.setParamOpp = function (param, callback) {
			self.paramOpp = param;
			if (callback) { callback(); }
		};
	}; // serviceTaskParam
	serviceTaskParam.$inject = [];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.task.param-service', serviceTaskParam);
});
