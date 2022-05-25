/*globals angular, define, CRMURL, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryTarget;

	// *************************************************************************************
	// *** FACTORY PUBLICO ALVO
	// *************************************************************************************
	factoryTarget = function ($totvsresource, factoryGeneric, factoryGenericCreateUpdate, factoryGenericTypeahead) {

		var actions = angular.copy(factoryGenericCreateUpdate.customActions),
			factory;

		actions.DTSPostNoCountRequest = {
			method: 'POST',
			isArray: true,
			headers: { noCountRequest: true }
		};

		factory = $totvsresource.REST(CRMURL.targetService + ':method/:id', undefined, actions);

		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['num_id']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.persistTarget = function (model, parameters, callback) {

			var i, properties = [], values = [];

			if (parameters) {
				if (parameters instanceof Array) {
					for (i = 0; i < parameters.length; i++) {
						properties.push(parameters[i].property);
						values.push(parameters[i].value);
					}
				} else if (parameters.property) {
					properties.push(parameters.property);
					values.push(parameters.value);
				}
			}

			parameters = { method: 'generateTarget', properties: properties, values: values };

			return this.DTSPostNoCountRequest(parameters, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		return factory;
	}; // factoryTarget

	factoryTarget.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.create.update.factory', 'crm.generic.typeahead.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_public.factory', factoryTarget);

});
