/*globals angular, index, define, CRMUtil, CRMURL */
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryInfo;

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryInfo = function ($totvsresource, factoryGeneric, factoryGenericZoom,
							 factoryGenericCreateUpdate, $cacheFactory) {

		var cache   = $cacheFactory('crm.info.Cache'),
			factory = $totvsresource.REST(CRMURL.infoService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['num_id']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getBasicInfo = function (callback) {
			return this.TOTVSQuery(undefined, function (result) {
				if (callback) {
					callback((result && result.length > 0 ? result[0] : undefined));
				}
			});
		};

		factory.getPropath = function (callback) {
			return this.TOTVSQuery({ method: 'propath' }, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.getProgramPath = function (program, callback) {
			return this.TOTVSGet({ method: 'program_path', name: program }, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.getFileInfo = function (file, callback) {
			return this.TOTVSQuery({ method: 'file_info', name: file }, function (result) {
				if (callback) {
					callback((result && result.length > 0 ? result[0] : undefined));
				}
			});
		};

		factory.getDatabases = function (callback) {
			return this.TOTVSGet({ method: 'databases' }, callback);
		};

		factory.getUserRPWServerName = function (callback) {
			return this.TOTVSGet({ method: 'user_rpw_server_name'}, function (result) {
				if (callback) { callback(result); }
			});
		};

		return factory;
	};

	factoryInfo.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.create.update.factory', '$cacheFactory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_info.factory', factoryInfo);
});
