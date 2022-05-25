/*globals angular, define, CRMURL, CRMUtil*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryLoadData;

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************
	factoryLoadData = function ($totvsresource, factoryGenericCreateUpdate) {

		var actions = angular.copy(factoryGenericCreateUpdate.customActions),
			factory;

		actions.DTSPostNoCountRequest = {
			method: 'POST',
			isArray: false,
			headers: {noCountRequest: true}
		};

		factory = $totvsresource.REST(
			CRMURL.loadDataService + ':method/:id',
			undefined,
			actions
		);

		angular.extend(factory, factoryGenericCreateUpdate);

		factory.executeLoadDataCRM = function (ttProcess, callback) {
			return this.DTSPostNoCountRequest({method: 'crmloaddata'}, ttProcess, function (result) {
				if (callback) { callback(result) }
			});
		};

		factory.createScheduler = function (ttProcess, ttRPWSchedule, callback) {
			return this.DTSPostNoCountRequest({method: 'erploaddata'}, {ttProcess: ttProcess, ttRPWSchedule: ttRPWSchedule}, function (result) {
				if (callback) { callback(result) }
			});
		};

		return factory;
	}; // factoryLoadData

	factoryLoadData.$inject = [
		'$totvsresource', 'crm.generic.create.update.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_loaddata.factory', factoryLoadData);

});
