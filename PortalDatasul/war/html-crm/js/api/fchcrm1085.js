/*globals index, define, angular, CRMURL, CRMUtil, CRMRestService, callback*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var factorySalesOrder,
		helperSalesOrder,
		salesOrderZoom,
		factorySalesOrderItems,
		helperSalesOrderItem;

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	helperSalesOrder = function () {
		this.parseSalesOrderStatus = function (order) {
			order.nom_cor = "tag-" + order['cod-sit-ped'];
		};
	};

	helperSalesOrder.$inject = [];

	// *************************************************************************************
	// *** FACTORY SALES ORDER
	// *************************************************************************************

	factorySalesOrder = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
						 factoryGenericTypeahead, factoryGenericCreateUpdate,
						 factoryGenericDetail, factoryGenericDelete) {

		var factory;

		factory = $totvsresource.REST(CRMRestService + '1085/:method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericDelete);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['nr-pedido']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

        factory.getRepresentativeCode = function (callback) {
            return this.TOTVSQuery({method: 'representative'}, callback);
        };
		return factory;
	};
	// factorySalesOrder
	factorySalesOrder.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory'
	];

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************
	helperSalesOrderItem = function () {
		this.parseSalesOrderItemStatus = function (item) {
			item.nom_cor = "tag-" + item['cod-sit-item'];
		};
	};
	helperSalesOrderItem.$inject = [];
	// *************************************************************************************
	// *** FACTORY SALES ORDER ITEMS
	// *************************************************************************************
	factorySalesOrderItems = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
						 factoryGenericTypeahead, factoryGenericCreateUpdate,
						 factoryGenericDetail, factoryGenericDelete) {
		var factory;
		factory = $totvsresource.REST(CRMRestService + '1085/:method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);
		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericDelete);
		factory.getItems = function (nomeAbrev, nrPedCli, callback) {
			return this.TOTVSQuery({method: 'items', short_name: nomeAbrev, customer_order: nrPedCli}, callback);
		};
		return factory;
	};
	// factorySalesOrderItems
	factorySalesOrderItems.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory'
	];
	// ########################################################
	// ### Register
	// ########################################################
	index.register.service('crm.salesorderitem.helper', helperSalesOrderItem);
	index.register.service('crm.salesorder.helper', helperSalesOrder);
	index.register.factory('crm.mpd_pedvenda.factory', factorySalesOrder);
	index.register.factory('crm.mpd_peditem.factory', factorySalesOrderItems);

});
