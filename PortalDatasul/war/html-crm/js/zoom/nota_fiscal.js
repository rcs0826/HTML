/*globals index, define, angular, console, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1088.js'
], function (index) {

	'use strict';

	var serviceInvoiceZoom;

	serviceInvoiceZoom = function (invoiceFactory, $rootScope) {

		return {
			zoomName : $rootScope.i18n('l-invoice-number', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-establishment', [], 'dts/crm'),  property: 'cod_estab'},
				{label: $rootScope.i18n('l-invoice-number', [], 'dts/crm'), property: 'cod_nota_fis', 'default': true},
				{label: $rootScope.i18n('l-order-client', [], 'dts/crm'),   property: 'cod_ped_cli'}

			],
			tableHeader	: [
				{label: $rootScope.i18n('l-client', [], 'dts/crm'), property: 'nome-ab-cli'},
				{label: $rootScope.i18n('l-establishment', [], 'dts/crm'),  property: 'cod-estabel'},
				{label: $rootScope.i18n('l-invoice-number', [], 'dts/crm'), property: 'nr-nota-fis'},
				{label: $rootScope.i18n('l-invoice-series', [], 'dts/crm'), property: 'serie'},
				{label: $rootScope.i18n('l-order-client', [], 'dts/crm'),   property: 'nr-pedcli'}
			],
			applyFilter : function (parameters) {

				var CRMControlInvoiceZoom = this,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					property = parameters.selectedFilter.property,
					value = parameters.selectedFilterValue,
					filters = [],
					i;

				if (angular.isFunction(parameters.init)) {
					parameters.init = parameters.init();
				}

				if (parameters.init && parameters.init.cod_pessoa_erp && parameters.init.cod_pessoa_erp.trim().length > 0) {
					filters.push({ property: 'cod_pessoa_erp', value: parameters.init.cod_pessoa_erp});
				}

				if (value && CRMUtil.isDefined(value)) {
					filters.push({property: property, value: value});
				}
				if (filters && (filters.length === 0 || (filters.length === 1 && filters[0].property === 'cod_pessoa_erp'))) {
					CRMControlInvoiceZoom.resultTotal = 0;
					CRMControlInvoiceZoom.zoomResultList = [];
					return;
				}

				invoiceFactory.zoom(filters, options, function (result) {

					CRMControlInvoiceZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlInvoiceZoom.zoomResultList = [];
					}


					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlInvoiceZoom.resultTotal = result[i].$length;
						}
						CRMControlInvoiceZoom.zoomResultList.push(result[i]);
					}
				});
			}

		};

	};

	serviceInvoiceZoom.$inject = ['crm.nota_fiscal.factory', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.nota_fiscal.zoom', serviceInvoiceZoom);

});
