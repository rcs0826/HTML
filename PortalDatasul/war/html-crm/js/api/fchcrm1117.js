/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService */
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {
	'use strict';

	var factoryPRFVBand;

	factoryPRFVBand = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericDetail,
								 factoryGenericCreateUpdate, factoryGenericTypeahead, factoryGenericDelete) {

		var cache = $cacheFactory('crm.prfvband.Cache'),
			factory;

		factory = $totvsresource.REST(
			CRMRestService + '1117/:method/:id/:detail/:prfvrange',
			undefined,
			factoryGenericCreateUpdate.customActions
		);

		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.saveRange = function (prfvrange, model, callback) {
			return this.DTSPost({method: 'range', prfvrange: prfvrange}, model, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.updateRange = function (prfvrange, id, model, callback) {
			return this.DTSPut({method: 'range', prfvrange: prfvrange, id: id}, model, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.deleteRange = function (id, callback) {
			return this.TOTVSRemove({ method: 'range', id: id }, callback);
		};

		return factory;
	}; // factoryPRFVBand
	factoryPRFVBand.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.detail.factory',
		'crm.generic.create.update.factory', 'crm.generic.typeahead.factory', 'crm.generic.delete.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_prfv_faixa_cabec.factory', factoryPRFVBand);

});
