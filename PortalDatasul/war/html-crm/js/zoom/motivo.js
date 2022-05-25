/*globals index, define, angular, console, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/bodi332.js'
], function (index) {

	'use strict';

	var serviceReasonZoom;

	serviceReasonZoom = function (reasonFactory, helper, $rootScope) {

		return {
			zoomName : $rootScope.i18n('l-sales-order-reason', [], 'dts/crm'),
			propertyFields: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'cod-motivo', 'default': true},
				{label: $rootScope.i18n('l-description', [], 'dts/crm'), property: 'descricao'},
				{label: $rootScope.i18n('l-narrative', [], 'dts/crm'), property: 'narrativa'}
			],
			tableHeader: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'cod-motivo'},
				{label: $rootScope.i18n('l-description', [], 'dts/crm'), property: 'descricao'},
				{label: $rootScope.i18n('l-narrative', [], 'dts/crm'), property: 'narrativa'}
			],
			applyFilter : function (parameters) {

				var CRMControlSalesOrderZoom = this,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					property = parameters.selectedFilter.property,
					value = parameters.selectedFilterValue,
					queryproperties = {},
					i;

				queryproperties.property = [];
				queryproperties.value = [];

				if (CRMUtil.isUndefined(value)) {
					value = "";
				}

				if (angular.isFunction(parameters.init)) {
					parameters.init = parameters.init();
				}

				/* if (parameters.init && parameters.init.nome_abrev && parameters.init.nome_abrev.trim().length > 0) {
					filters.push({ property: 'nome_abrev', value: parameters.init.nome_abrev});
				} */

				/*
				if (parameters.isSelectValue) {
					queryproperties.id = value;
					queryproperties.method = 'search';
					queryproperties.searchfields = 'cod-motivo, descricao';
				} else {
				*/
				if (value) {
					queryproperties.property.push(property);

					if (property === 'cod-motivo') {
						queryproperties.value.push(value);
					} else {
						queryproperties.value.push(helper.parseStrictValue(value));
					}
				}
				/* } */

				//Define apenas motivo de cancelamento
				queryproperties.property.push('ind-tp-trans');
				queryproperties.value.push('1');

				reasonFactory.zoom(queryproperties, options, function (result) {

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

	serviceReasonZoom.$inject = ['crm.mpd_motivo.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################
	index.register.factory('crm.mpd_motivo.zoom', serviceReasonZoom);

});
