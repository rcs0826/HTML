/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1017.js'
], function (index) {

	'use strict';

	var serviceRegionZoom;


	serviceRegionZoom = function (regionFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-region', [], 'dts/crm'),
			propertyFields : [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_regiao_atendim', 'default': true }
			],
			tableHeader	: [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_regiao_atendim' }
			],
			applyFilter : function (parameters) {

				var CRMControlRegionZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = { start: (parameters.more ? this.zoomResultList.length : 0) },
					filters = [{ property: property, value: helper.parseStrictValue(value) }],
					i;

				regionFactory.zoom(filters, options, function (result) {

					CRMControlRegionZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlRegionZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlRegionZoom.resultTotal = result[i].$length;
						}
						CRMControlRegionZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceRegionZoom.$inject = ['crm.crm_regiao.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_regiao.zoom', serviceRegionZoom);

});
