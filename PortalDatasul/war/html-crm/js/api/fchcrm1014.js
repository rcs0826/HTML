/*global $, index, angular, define, TOTVSEvent, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryRepresentative;

	factoryRepresentative = function ($totvsresource, factoryGeneric, factoryGenericZoom,
								   factoryGenericTypeahead) {

		var factory = $totvsresource.REST(CRMURL.representativeService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getRepresentativeByUserProfile = function (callback) {
			return this.TOTVSQuery({method: 'repres_by_user_profile'}, function (result) {
				if (callback) {
					callback((result && result.length > 0 ? result : []));
				}
			});
		};

		return factory;
	}; // factoryRepresentative

	factoryRepresentative.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_repres.factory', factoryRepresentative);

});
