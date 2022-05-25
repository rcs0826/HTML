/*globals angular, define, CRMURL, CRMUtil*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryRemoveProcess;

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************
	factoryRemoveProcess = function ($totvsresource, factoryGenericCreateUpdate) {

		var actions = angular.copy(factoryGenericCreateUpdate.customActions),
			factory;

		actions.DTSPostNoCountRequest = {
			method: 'POST',
			isArray: true,
			headers: {noCountRequest: true}
		};

		factory = $totvsresource.REST(
			CRMURL.removeProcessService + ':method/:id',
			undefined,
			factoryGenericCreateUpdate.customActions
		);

		angular.extend(factory, factoryGenericCreateUpdate);

		/* utilizado post para passar como parametro uma tt */
		factory.removeListOfProcess = function (ttProcess, callback) {
			return this.TOTVSPost({method: 'removeprocess'}, ttProcess, callback);
		};

		return factory;
	}; // factoryRemoveProcess

	factoryRemoveProcess.$inject = [
		'$totvsresource', 'crm.generic.create.update.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_removeprocess.factory', factoryRemoveProcess);

});
