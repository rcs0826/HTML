/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1019.js'
], function (index) {

	'use strict';

	var serviceProductZoom;

	serviceProductZoom = function ($rootScope, productFactory, helper) {
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
			tableHeader	: [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),                property: 'nom_produt' },
				{ label: $rootScope.i18n('l-code-erp', [], 'dts/crm'),            property: 'cod_item_erp' },
				{ label: $rootScope.i18n('l-unit-of-measurement', [], 'dts/crm'), property: 'nom_umd_vda' },
				{ label: $rootScope.i18n('l-integrates-erp', [], 'dts/crm'),      property: 'log_integrad_erp' }
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

				options.method = 'find_products';
				/*
				if (parameters.init && parameters.init.findCustom) {
					options.method = parameters.init.findCustom;
				}
				*/
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

	serviceProductZoom.$inject = ['$rootScope', 'crm.crm_produt.factory', 'crm.helper'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_produt.padrao.zoom', serviceProductZoom);

});
