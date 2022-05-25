/*globals angular, define, CRMRestService*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryBackgroundRuntimes;

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************
	factoryBackgroundRuntimes = function ($totvsresource, factoryGenericCreateUpdate) {

		var actions = angular.copy(factoryGenericCreateUpdate.customActions), factory;

		actions.DTSPostNoCountRequest = {
			method: 'POST',
			isArray: false,
			headers: {noCountRequest: true}
		};

		factory = $totvsresource.REST(
			CRMRestService + '1101/:method/:id',
			undefined,
			actions
		);

//        var factory = $totvsresource.REST(CRMRestService + '1101/:method/:id', undefined,
//                                          factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericCreateUpdate);

		factory.createBackgroundRoutinesBirthdayPerson = function (params,  callback) {
			return this.DTSPostNoCountRequest({method: 'birthdayperson'}, params, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.createSupplementaryAccountData = function (params,  callback) {
			return this.DTSPostNoCountRequest({method: 'create_supplementary_account_data'}, params, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.updateAccountStatus = function (params,  callback) {
			return this.DTSPostNoCountRequest({method: 'update_account_status'}, params, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.executeMonitorAccountMovement = function (params,  callback) {
			return this.DTSPostNoCountRequest({method: 'monitor_account_moviment'}, params, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.getCanEditAutomaticCalendar = function (programName, callback) {
			return this.TOTVSGet({ method: 'can_add_new_schedule_to_program', program: programName}, function (result) {
				if (result) {
					if (callback) { callback(result.lOk || false); }
				} else {
					if (callback) { callback(false); }
				}
			});
		};

		factory.hasScheduleCreated = function (programName, callback) {
			return this.TOTVSGet({ method: 'has_schedule_created', program: programName}, function (result) {
				if (result) {
					if (callback) { callback(result.lOk || false); }
				} else {
					if (callback) { callback(false); }
				}
			});
		};

		factory.getInfoSchedule = function (programName, callback) {
			return this.TOTVSQuery({method: 'get_info_schedule', program: programName}, function (result) {
				if (callback) {
					callback(result);
					//callback((result && result.length > 0 ? result[0] : undefined));
				}
			});
		};

		factory.createClassTransition = function (params,  callback) {
			return this.DTSPostNoCountRequest({method: 'classTransition'}, params, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.createPRFVEvaluate = function (params,  callback) {
			return this.DTSPostNoCountRequest({method: 'prfvevaluate'}, params, function (result) {
				if (callback) { callback(result); }
			});
		};

		return factory;
	}; // factoryLoadData

	factoryBackgroundRuntimes.$inject = [
		'$totvsresource', 'crm.generic.create.update.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_backgroundruntimes.factory', factoryBackgroundRuntimes);

});
