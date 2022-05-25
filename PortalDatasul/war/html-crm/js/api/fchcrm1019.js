/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factoryProduct,
		helperProduct;

	helperProduct = function ($rootScope) {

		this.status = [
			{id: 1, name: $rootScope.i18n('l-active', [], 'dts/crm')},
			{id: 2, name: $rootScope.i18n('l-suspended', [], 'dts/crm')},
			{id: 3, name: $rootScope.i18n('l-obsolete', [], 'dts/crm')},
			{id: 4, name: $rootScope.i18n('l-discontinued', [], 'dts/crm')}
		];

		this.composition = [
			{id: 1, name: $rootScope.i18n('l-normal', [], 'dts/crm')},
			{id: 2, name: $rootScope.i18n('l-product-father', [], 'dts/crm')},
			{id: 3, name: $rootScope.i18n('l-product-son', [], 'dts/crm')},
			{id: 4, name: $rootScope.i18n('l-kit', [], 'dts/crm')},
			{id: 5, name: $rootScope.i18n('l-bundle', [], 'dts/crm')}
		];
	};

	helperProduct.$inject = ['$rootScope'];

	factoryProduct = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
						 factoryGenericTypeahead, factoryGenericDetail, factoryGenericCreateUpdate, factoryGenericDelete) {

		var factory = $totvsresource.REST(CRMRestService + '1019/:method/:id', undefined,
										  factoryGenericCreateUpdate.customActions),
			cache = $cacheFactory('crm.group-user.Cache');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericDelete);
		angular.extend(factory, factoryGenericCreateUpdate);

		// Utilizado para tabela de preco
		factory.findRecords = function (parameters, options, callback) {
			options = options || {};
			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		// original manutencao de produtos
		factory.findProducts = function (parameters, options, callback) {
			options = options || {};
			options.method  = 'find_products';
			options.orderBy	= ['nom_produt'];
			options.asc		= [true];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getAllProducts = function (idPriceTable, callback) {

			return this.TOTVSQuery({
				method: 'all',
				priceTable: idPriceTable
			}, function (data) {
				if (callback) { callback(data); }
			});

		};

		factory.getProductSettingsForPriceTable = function (productId, priceTableId, callback) {

			return this.TOTVSQuery({
				method: 'productSettingsForPriceTable',
				product: productId,
				pricetable: priceTableId
			}, function (data) {
				if (angular.isArray(data) && data.length > 0) {
					data = data[0];
				} else {
					data = undefined;
				}
				if (callback) { callback(data); }
			});

		};

		factory.getVersions = function (idClassif, callback, isAllowedCache) {
			isAllowedCache = isAllowedCache !== false;

			var idCache = 'product-versions-' + idClassif,
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'version', classif: idClassif}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getReferences = function (idClassif, callback, isAllowedCache) {
			isAllowedCache = isAllowedCache !== false;

			var idCache = 'product-references-' + idClassif,
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'reference', classif: idClassif}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getComponents = function (idClassif, callback, isAllowedCache) {
			isAllowedCache = isAllowedCache !== false;

			var idCache = 'product-components-' + idClassif,
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'component', classif: idClassif}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllMaterialFamily = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allMaterialFamily',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all_material_family'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllBusinessFamily = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allBusinessFamily',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all_business_family'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllStockGroup = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allStockGroup',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all_stock_group'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllProductType = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allProductType',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all_product_type'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.getAllTaxClassification = function (callback, isAllowedCache) {

			isAllowedCache = isAllowedCache !== false;

			var idCache = 'allTaxClassification',
				result = (isAllowedCache ? cache.get(idCache) : undefined);

			if (result) {
				if (callback) { callback(result); }
			} else {
				return this.TOTVSQuery({method: 'all_tax_classification'}, function (data) {
					cache.put(idCache, data);
					if (callback) { callback(data); }
				});
			}
		};

		factory.isCifFobParamValid = function (idOpportunity, callback) {
			return this.TOTVSGet({method: 'ciffobparamvalid', idOpportunity: idOpportunity}, function (data) {
				if (callback) { callback(data); }
			});
		};

		factory.setTechnicalAssistence = function (productId, isTechnicalAssistence, callback) {
			return this.TOTVSUpdate({ method: 'set_technical_assistence', productId: productId, isTechnicalAssistence: isTechnicalAssistence }, { method: 'set_technical_assistence' }, callback);
		};

		factory.addVersion = function (model, callback) {
			return this.DTSPost({method: 'version'}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.removeVersion = function (id, callback) {
			return this.TOTVSRemove({method: 'version', id: id}, callback);
		};

		factory.addComponent = function (model, callback) {
			return this.DTSPost({method: 'component'}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.removeComponent = function (id, callback) {
			return this.TOTVSRemove({method: 'component', id: id}, callback);
		};

		return factory;
	}; // factoryProduct

	factoryProduct.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.detail.factory', 'crm.generic.create.update.factory', 'crm.generic.delete.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.product.helper', helperProduct);
	index.register.factory('crm.crm_produt.factory', factoryProduct);

});
