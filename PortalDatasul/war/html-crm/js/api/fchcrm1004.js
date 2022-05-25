/*global $, index, angular, define, TOTVSEvent, CRMURL*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryPreference;

	factoryPreference = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericCreateUpdate) {

		var factory,
			cache = $cacheFactory('crm.preference.Cache');

		factory = $totvsresource.REST(CRMURL.preferenceService + ':method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericCreateUpdate);

		factory.getPreference = function (code, callback, noCache) {

			var result = cache.get(code);

			if (result && noCache !== true) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSGet({method: 'value', code: code}, function (data) {
					cache.put(code, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var result,
				idCache = 'allRatings';

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

		factory.getPreferenceAsBoolean = function (code, callback, noCache) {
			return this.getPreference(code, function (result) {
				if (callback) {
					var value = false;
					if (result && result.dsl_param_crm) {
						value = (result.dsl_param_crm.trim().toLowerCase() === 'true');
					}
					callback(value);
				}
			}, noCache);
		};

		factory.getPreferenceAsInteger = function (code, callback, noCache) {
			var value;
			return this.getPreference(code, function (result) {
				if (callback) {
					value = undefined;
					if (result && result.dsl_param_crm) {
						try {
							value = parseInt(result.dsl_param_crm.trim(), 10);
						} catch (e) {}
					}
					callback(value);
				}
			}, noCache);
		};

		factory.getPreferenceAsDecimal = function (code, callback, noCache) {
			var value;
			return this.getPreference(code, function (result) {
				if (callback) {
					value = undefined;
					if (result && result.dsl_param_crm) {
						try {
							value = parseFloat(result.dsl_param_crm.trim());
						} catch (e) {}
					}
					callback(value);
				}
			}, noCache);
		};

		factory.isIntegratedWithEMS = function (callback, noCache) {
			return this.getPreferenceAsBoolean('INTEGR_ERP_EMS', callback, noCache);
		};

		factory.isIntegratedWithGP = function (callback, noCache) {
			return this.getPreferenceAsBoolean('INTEGR_GP', callback, noCache);
		};

		factory.isIntegratedWithLOGIX = function (callback, noCache) {
			return this.getPreferenceAsBoolean('INTEGR_ERP_LOGIX', callback, noCache);
		};

		factory.isIntegratedWithERP = function (callback, noCache) {
			return this.getPreferenceAsBoolean('INTEGR_ERP', callback, noCache);
		};

		factory.isIntegratedWithECM = function (callback, noCache) {
			return this.getPreferenceAsBoolean('INTEGR_ECM', callback, noCache);
		};

		factory.restorePreference = function (code, callback) {
			return this.DTSPost({method: 'restore_preference', code: code}, {}, function (data) {
				if (callback) { callback((data && data.length > 0 ? data[0] : undefined)); }
			});
		};

		factory.setConfigUserGroupTask = function (config, callback) {
			return this.DTSPost({method: 'setconfigusergrouptask'}, config, callback);
		};

		return factory;
	};

	factoryPreference.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.create.update.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_param.factory', factoryPreference);

});
