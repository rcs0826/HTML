
/* global angular, index, define, CRMURL */
/* jslint plusplus: true */
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryDocument;

	factoryDocument = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericDelete, factoryGenericCreateUpdate) {

		var cache = $cacheFactory('crm.document.Cache'),
			factory = $totvsresource.REST(CRMURL.documentService + ':method/:id', undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {
			options = options || {};

			options.orderBy	= ['cod_docto_ident'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getDocumentsByAccount = function (idAccount, callback) {
			return this.TOTVSQuery({method: 'documents', account: idAccount}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});

		};

		factory.getAll = function (onlyValid, callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'documents-' + (onlyValid === true),
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) {
					callback(result);
				}
			} else {
				return this.TOTVSQuery({method: 'all', valid: onlyValid}, function (data) {
					cache.put(idCache, data);
					if (callback) {
						callback(data);
					}
				});
			}
		};

		return factory;
	}; // factoryDocument

	factoryDocument.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.delete.factory', 'crm.generic.create.update.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_docto_ident.factory', factoryDocument);

});
