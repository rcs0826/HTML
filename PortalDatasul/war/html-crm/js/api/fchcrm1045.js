/*global $, index, angular, define, TOTVSEvent, CRMURL*/

define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryAccessRestriction;

	factoryAccessRestriction = function ($totvsresource, $cacheFactory, factoryGeneric,
									  factoryGenericCreateUpdate, factoryGenericDetail, factoryGenericDelete) {

		var cache = $cacheFactory('crm.access-restriction.Cache'),
			actions = angular.copy(factoryGenericCreateUpdate.customActions),
			factory,
			helper = {};

		actions.DTSPostNoCountRequest = {
			method: 'POST',
			isArray: true,
			headers: {noCountRequest: true}
		};

		factory = $totvsresource.REST(CRMURL.accessRestrictionService + ':method/:id/:restriction/:form',
			undefined, actions);

		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getForms = function (includeGenerals, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'forms' + (includeGenerals ? '-with-general' : ''),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'form', general: includeGenerals}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.addForms = function (idRestriction, models, callback) {
			return this.DTSPost({method: 'form', restriction: idRestriction}, models, callback);
		};

		factory.addForm = function (idRestriction, model, callback) {
			return this.DTSPost({method: 'form', restriction: idRestriction}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteForm = function (idForm, callback) {
			return this.TOTVSRemove({method: 'form', id: idForm}, callback);
		};

		factory.getFormComponents = function (idRestriction, idForm, callback) {
			return this.TOTVSQuery({
				method: 'form_component',
				restriction: idRestriction,
				form: idForm
			}, callback);
		};

		factory.setFormComponentRestriction = function (component, callback) {
			return this.DTSPostNoCountRequest({method: 'form_component_restriction'}, component, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.addUserGroups = function (idRestriction, userGroups, callback) {
			return this.DTSPost({
				method: 'restriction_user_group',
				restriction: idRestriction
			}, userGroups, callback);
		};

		factory.addUserGroup = function (idRestriction, userGroup, callback) {
			return this.DTSPost({
				method: 'restriction_user_group',
				restriction: idRestriction
			}, userGroup, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteUserGroup = function (idUserGroup, callback) {
			return this.TOTVSRemove({method: 'restriction_user_group', id: idUserGroup}, callback);
		};

		helper.toObject = function (arr) {
			var i, rv = {};

			for (i = 0; i < arr.length; ++i) {
				rv[arr[i].cod_compon] = arr[i];
			}

			return rv;
		};

		factory.getUserRestrictions = function (form, user, callback) {

			var idCache = 'forms-' + (form || '') + 'user-' + (user || ''),
				result = cache.get(idCache);

			if (!result) {
				return this.TOTVSQuery({
					method: 'user_restriction',
					user: user,
					formName: form
				}, function (result) {
					result = helper.toObject(result);
					cache.put(idCache, result);

					if (callback) {
						return callback(result);
					} else {
						return result;
					}
				});
			} else {
				if (callback) {
					return callback(result);
				} else {
					return result;
				}

			}
		};



		return factory;
	}; //  factoryAccessRestriction
	factoryAccessRestriction.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_acess_portal.factory', factoryAccessRestriction);

});
