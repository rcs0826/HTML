/*globals angular, index, define*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1020.js'
], function (index) {

	'use strict';

	var servicePriceTableZoom;

	servicePriceTableZoom = function (priceTableFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-price-table', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_tab_preco', 'default': true},
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_preco_erp'}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_tab_preco'},
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_preco_erp'}
			],
			applyFilter : function (parameters) {

				var CRMControlPriceTableZoom = this,
					filters = [],
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = { start: (parameters.more ? this.zoomResultList.length : 0) },
					i;

				if (angular.isFunction(parameters.init)) {
					parameters.init = parameters.init();
				}

				if (parameters.init && parameters.init.isValid === true) {
					filters.push({ property: 'dat_fim',  value: new Date().getTime() + ';' });
					filters.push({ property: 'dat_inic', value: ';' + new Date().getTime() });
				}

				filters.push({property: property, value: helper.parseStrictValue(value)});

				priceTableFactory.zoom(filters, options, function (result) {

					CRMControlPriceTableZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlPriceTableZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlPriceTableZoom.resultTotal = result[i].$length;
						}
						CRMControlPriceTableZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	servicePriceTableZoom.$inject = ['crm.crm_tab_preco.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_tab_preco.zoom', servicePriceTableZoom);

});
