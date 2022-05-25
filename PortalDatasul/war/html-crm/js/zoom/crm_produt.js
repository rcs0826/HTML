/*global $, index, angular, define, CRMEvent*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1019.js'
], function (index) {

	'use strict';

	var serviceProductZoom;

	// ########################################################
	// ### PRODUCT
	// ########################################################
	serviceProductZoom = function ($rootScope, $injector, $filter, productFactory, helper) {

		return {

			zoomName : $rootScope.i18n('l-product', [], 'dts/crm'),

			propertyFields : [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),           property: 'nom_produt', 'default': true },
				{ label: $rootScope.i18n('l-code-erp', [], 'dts/crm'),       property: 'cod_item_erp' },
				{ label: $rootScope.i18n('l-code-crm', [], 'dts/crm'),       property: 'num_id', type: 'integer'},
				{ label: $rootScope.i18n('l-integrates-erp', [], 'dts/crm'), property: 'log_integrad_erp', propertyList: [
					{ id: 1, name: $rootScope.i18n('l-yes', [], 'dts/crm'), value: true },
					{ id: 0, name: $rootScope.i18n('l-no', [], 'dts/crm'),  value: false }
				]}
				
			],

			columnDefs : [
				{
					headerName: $rootScope.i18n('l-name', [], 'dts/crm'),
					width: 450,
					field: 'nom_produt'
				}, {
					headerName: $rootScope.i18n('l-code-erp', [], 'dts/crm'),
					field: 'cod_item_erp',
					width: 120
				}, {
					headerName: $rootScope.i18n('l-unit-of-measurement', [], 'dts/crm'),
					width: 150,
					field: 'nom_umd_vda'
				}, {
					headerName: $rootScope.i18n('l-minimum-quantity', [], 'dts/crm'),
					width: 150,
					field: 'qtd_min_item'
				}, {
					headerName: $rootScope.i18n('l-integrates-erp', [], 'dts/crm'),
					width: 120,
					field: 'log_integrad_erp'
				}
			],

			applyFilter : function (parameters) {

				var i,
					value = parameters.selectedFilterValue,
					filters = [],
					options = { start: (parameters.more ? this.zoomResultList.length : 0) },
					property = parameters.selectedFilter.property,
					CRMControlProductZoom = this;

				if (angular.isFunction(parameters.init)) {
					parameters.init = parameters.init();
				}

				if (parameters.init && parameters.init.num_id_tab_preco && parameters.init.num_id_tab_preco > 0) {
					filters.push({ property: 'crm_tab_preco_item.num_id_tab_preco', value: parameters.init.num_id_tab_preco });
				}

				if (parameters.init && parameters.init.findCustom) {
					options.method = parameters.init.findCustom;
				}

				if (property === 'num_id') {
					value = value.toString().replace(/\D+/g, '');
					filters.push({property: property, value: value});
				} else if (property === 'log_integrad_erp') {
					filters.push({property: property, value: value.value});
				} else {
					filters.push({property: property, value: helper.parseStrictValue(value)});
				}

				productFactory.zoom(filters, options, function (result) {

					CRMControlProductZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlProductZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {

						if (result[i].log_integrad_erp === true) {
							result[i].log_integrad_erp = $rootScope.i18n('l-yes', [], 'dts/crm');
						} else {
							result[i].log_integrad_erp = $rootScope.i18n('l-no', [], 'dts/crm');
						}

						if (result[i].$length) {
							CRMControlProductZoom.resultTotal = result[i].$length;
						}

						CRMControlProductZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceProductZoom.$inject = [
		'$rootScope', '$injector', '$filter', 'crm.crm_produt.factory', 'crm.helper'
	];


	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_produt.zoom',         serviceProductZoom);

});

