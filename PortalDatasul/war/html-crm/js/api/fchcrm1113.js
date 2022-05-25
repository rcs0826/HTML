/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';
	var helperGenericActionSetting,
		factoryGenericActionSetting;

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	helperGenericActionSetting = function ($rootScope) {

		this.parseOperationType = function (item) {
			switch (item.idi_operac) {
			case 1:
				item.nom_operac = $rootScope.i18n('l-inclusion', [], 'dts/crm');
				break;
			case 2:
				item.nom_operac = $rootScope.i18n('l-change', [], 'dts/crm');
				break;
			case 3:
				item.nom_operac = $rootScope.i18n('l-all', [], 'dts/crm');
				break;
			}
		};

		this.parseMode = function (item) {
			switch (item.idi_modo_reg_acao) {
			case 1:
				item.nom_modo_reg_acao = $rootScope.i18n('l-default', [], 'dts/crm');
				break;
			case 2:
				item.nom_modo_reg_acao = $rootScope.i18n('l-automatic', [], 'dts/crm');
				break;
			case 3:
				item.nom_modo_reg_acao = $rootScope.i18n('l-predefined', [], 'dts/crm');
				break;
			}
		};

	};

	helperGenericActionSetting.$inject = ['$rootScope'];

	factoryGenericActionSetting = function ($totvsresource, factoryGeneric, $cacheFactory, factoryGenericCreateUpdate, factoryGenericDetail, factoryGenericDelete) {

		var factory = $totvsresource.REST(CRMRestService + '1113/:method/:id', undefined,
										  factoryGenericCreateUpdate.customActions),
			cache = $cacheFactory('crm.generic-action-setting.Cache');

		angular.extend(factory, factoryGeneric);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.getGenericActionSetting = function (id, callback, isAllowedCache) {
			isAllowedCache = isAllowedCache !== false;

			var idCache = 'generic-action-setting-' + id,
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'detail', id: id}, function (data) {
					cache.put(idCache, data[0]);
					if (callback) { callback(data[0]); }
				});
			}
		};

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getRules = function (genericActionSettingId, callback) {
			return this.TOTVSQuery({method: 'rules', genericActionSettingId: genericActionSettingId}, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.removeRules = function (id, callback) {
			return this.TOTVSRemove({method: 'rules', id: id}, callback);
		};

		factory.addRules = function (model, callback) {
			return this.DTSPost({method: 'rules'}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		return factory;
	}; // factoryGenericActionSetting

	factoryGenericActionSetting.$inject = [
		'$totvsresource', 'crm.generic.factory', '$cacheFactory', 'crm.generic.create.update.factory', 'crm.generic.detail.factory', 'crm.generic.delete.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.generic_action_setting.helper', helperGenericActionSetting);
	index.register.factory('crm.crm_configur_acao_ocor.factory', factoryGenericActionSetting);
});
