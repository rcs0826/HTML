/*globals angular, index, define, CRMURL*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var helperUser,
		factoryUser;

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	helperUser = function (legend) {
		this.parseAcessLevel = function (user) {
			if (user && user.idi_niv_aces && user.idi_niv_aces > 0) {
				user.nom_niv_aces = legend.userAccessLevel.NAME(user.idi_niv_aces);
			}
		};
	};

	helperUser.$inject = ['crm.legend'];

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryUser = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom, factoryGenericTypeahead, factoryGenericDetail) {

		var factory,
			cache;

		factory = $totvsresource.REST(CRMURL.userService + ':method/:id');

		cache = $cacheFactory('crm.user.Cache');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);


		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['nom_usuar'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getSummary = function (idUser, callback, isAllowedCache) {

			var idCache,
				options,
				parameters,
				result;

			if (idUser) {

				isAllowedCache = isAllowedCache !== false;

				idCache = 'summaryUser-' + idUser;

				result = (isAllowedCache ? cache.get(idCache) : undefined);

				options = {
					type  : 4,
					count : false,
					end   : 1
				};

				parameters = {
					property: 'num_id',
					value:	  idUser
				};

				if (result) {
					if (callback) { callback(result); }
				} else {
					return factory.findRecords(parameters, options, function (data) {
						data = (data && data.length > 0 ? data[0] : undefined);
						cache.put(idCache, data);
						if (callback) { callback(data); }
					}, this);
				}
			}
		};

		factory.getContext = function (callback) {

			var idCache,
				result;

			idCache = 'getContext';

			result = cache.get(idCache);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'context'}, function (result) {
					var data = (result && result.length > 0 ? result[0] : undefined);
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAll = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'userCRM',
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

		factory.getAllWithAccess = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'userCRM',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'allwithaccess'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getUsersWithoutGroupDefault = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'getUsersWithoutGroupDefault',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'getuserswithoutgroupdefault'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getOnlyResources = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'getOnlyResources',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'getonlyresources'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		return factory;
	};

	factoryUser.$inject = [
		'$totvsresource',
		'$cacheFactory',
		'crm.generic.factory',
		'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory',
		'crm.generic.detail.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.user.helper', helperUser);

	index.register.factory('crm.crm_usuar.factory', factoryUser);

});
