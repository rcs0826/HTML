/*globals angular, index, define */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1052.js'
], function (index) {

	'use strict';

	var servicePropertiesZoom;

	servicePropertiesZoom = function ($rootScope, propertyFactory, helper) {
		return {

			zoomName : $rootScope.i18n('l-properties', [], 'dts/crm'),

			propertyFields : [
				{label: $rootScope.i18n('l-table', [], 'dts/crm'),  property: 'nom_tab_crm', 'default': true},
				{label: $rootScope.i18n('l-field', [], 'dts/crm'),  property: 'nom_field_label'}
			],

			columnDefs : [
				{
					headerName: $rootScope.i18n('l-table', [], 'dts/crm'),
					field: 'nom_tab_crm'
				}, {
					headerName: $rootScope.i18n('l-field', [], 'dts/crm'),
					field: 'nom_field_label'
				}
			],

			applyFilter : function (parameters) {

				var CRMControlPropertiesZoom = this,
					options,
					property,
					value,
					filters,
					i;

				options = {start: (parameters.more ? this.zoomResultList.length : 0)};

				property = parameters.selectedFilter.property;
				value = parameters.selectedFilterValue;

				filters = [{property: property, value: helper.parseStrictValue(value)}];

				propertyFactory.zoom(filters, options, function (result) {

					CRMControlPropertiesZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlPropertiesZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlPropertiesZoom.resultTotal = result[i].$length;
						}
						CRMControlPropertiesZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	servicePropertiesZoom.$inject = ['$rootScope', 'crm.crm_propried.factory', 'crm.helper'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_propried.zoom', servicePropertiesZoom);

});
