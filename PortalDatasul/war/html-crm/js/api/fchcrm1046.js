/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryUserGroup;

	factoryUserGroup = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericDetail,
								  factoryGenericZoom, factoryGenericCreateUpdate, factoryGenericDelete,
								  factoryGenericTypeahead) {

		var factory = $totvsresource.REST(CRMRestService + '1046/:method/:id', undefined,
										  factoryGenericCreateUpdate.customActions),
			cache = $cacheFactory('crm.group-user.Cache');

		angular.extend(factory, factoryGenericZoom);
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

		factory.getAllGroups = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'groups',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return factory.findRecords(undefined, { end: 0 }, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllUsers = function (idGroup, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'users' + (idGroup ? '-' + idGroup : ''),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'users', id: idGroup}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getGroupsByUser = function (idUser, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'groupsByUser' + (idUser ? '-' + idUser : ''),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({ method: 'groups_by_user', user: idUser }, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.removeUser = function (id, callback) {
			return this.TOTVSRemove({method: 'user', id: id}, callback);
		};

		factory.addUsers = function (model, callback) {
			return this.DTSPost({method: 'users'}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.setAsResponsible = function (idUserGroupUser, callback) {
			return this.TOTVSUpdate({ method: 'set_as_responsible', idUserGroupUser: idUserGroupUser }, undefined, callback);
		};

		return factory;
	}; //  factoryUserGroup
	factoryUserGroup.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.detail.factory',
		'crm.generic.zoom.factory', 'crm.generic.create.update.factory', 'crm.generic.delete.factory',
		'crm.generic.typeahead.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_grp_usuar.factory',	factoryUserGroup);

});
