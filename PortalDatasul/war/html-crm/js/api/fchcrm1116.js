/*global angular, define, CRMUtil, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryParameter;

	factoryParameter = function ($totvsresource, $cacheFactory, factoryGeneric,
									factoryGenericZoom, factoryGenericTypeahead,
									factoryGenericDetail, factoryGenericCreateUpdate, factoryGenericDelete) {

		var cache = $cacheFactory('crm.prfv-parameter.Cache'),
			factory;

		factory = $totvsresource.REST(
			CRMRestService + '1116/:method/:id/:detail/:parameterId',
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

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allParameters',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.saveForm = function (parameterId, model, callback) {
			return this.DTSPost({method: 'form', parameterId: parameterId}, model, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.deleteForm = function (id, callback) {
			return this.TOTVSRemove({ method: 'form', id: id }, callback);
		};

		factory.saveSource = function (parameterId, model, callback) {
			return this.DTSPost({method: 'source', parameterId: parameterId}, model, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.deleteSource = function (id, callback) {
			return this.TOTVSRemove({ method: 'source', id: id }, callback);
		};

		return factory;
	}; // factoryParameter

	factoryParameter.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory',
		'crm.generic.zoom.factory', 'crm.generic.typeahead.factory',
		'crm.generic.detail.factory', 'crm.generic.create.update.factory', 'crm.generic.delete.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_param_prfv.factory', factoryParameter);

});
