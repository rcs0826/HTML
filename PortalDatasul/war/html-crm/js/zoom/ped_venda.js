/*globals index, define, angular, console, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1085.js'
], function (index) {

	'use strict';

	var serviceSalesOrderZoom;

	serviceSalesOrderZoom = function (salesOrderFactory, helper, $rootScope) {

		return {
			zoomName : $rootScope.i18n('l-sales-order', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-establishment', [], 'dts/crm'), property: 'num_id_estab'},
				{label: $rootScope.i18n('l-order-number', [], 'dts/crm'),  property: 'nr_pedido'},
				{label: $rootScope.i18n('l-order-client', [], 'dts/crm'),  property: 'nr_ped_cli', 'default': true}

			],
			tableHeader	: [
				{label: $rootScope.i18n('l-establishment', [], 'dts/crm'), property: 'siteId'},
				{label: $rootScope.i18n('l-order-client', [], 'dts/crm'),  property: 'nr-pedcli'},
				{label: $rootScope.i18n('l-order-number', [], 'dts/crm'),  property: 'nr-pedido'}
			],
			applyFilter : function (parameters) {

				var CRMControlSalesOrderZoom = this,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					property = parameters.selectedFilter.property,
					value = parameters.selectedFilterValue,
					filters = [],
					i,
					countFiltersDefault = 0;

				if (angular.isFunction(parameters.init)) {
					parameters.init = parameters.init();
				}

				for (i = 0; i < parameters.init.length; i++) {
					if (parameters.init[i].nome_abrev && parameters.init[i].nome_abrev.trim().length > 0) {
						filters.push({ property: 'nome_abrev', value: parameters.init[i].nome_abrev});
						countFiltersDefault++;
					}

					if (parameters.init[i].num_id_repres && parameters.init[i].num_id_repres > 0) {
						filters.push({ property: 'num_id_repres', value: parameters.init[i].num_id_repres});
						countFiltersDefault++;
					}
				}

				if (value && CRMUtil.isDefined(value)) {
					filters.push({property: property, value: value});
				}

				if (filters && filters.length === countFiltersDefault) {
					return;
				}

				salesOrderFactory.zoom(filters, options, function (result) {

					CRMControlSalesOrderZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlSalesOrderZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {

						if (result[i].$length) {
							CRMControlSalesOrderZoom.resultTotal = result[i].$length;
						}

						CRMControlSalesOrderZoom.zoomResultList.push(result[i]);
					}
				});

			}

		};

	};

	serviceSalesOrderZoom.$inject = ['crm.mpd_pedvenda.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################
	index.register.factory('crm.ped_venda.zoom', serviceSalesOrderZoom);

});
