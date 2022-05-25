/*globals angular, define, CRMRestService*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryMonitorAccountMoviment;

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************
	factoryMonitorAccountMoviment = function ($totvsresource, factoryGeneric, factoryGenericZoom,
											   factoryGenericTypeahead, factoryGenericDetail, factoryGenericCreateUpdate,
											   factoryGenericDelete) {

		var factory;

		factory = $totvsresource.REST(
			CRMRestService + '1104/:method/:id/:detail',
			undefined,
			factoryGenericCreateUpdate.customActions
		);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAllParameters = function (callback) {
			return this.TOTVSQuery({method: 'all_parameters'}, function (result) {
				if (callback) {
					callback((result && result.length > 0 ? result : []));
				}
			});
		};

		return factory;
	};

	factoryMonitorAccountMoviment.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.detail.factory', 'crm.generic.create.update.factory',
		'crm.generic.delete.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_monitor_account_movement.factory', factoryMonitorAccountMoviment);

});
