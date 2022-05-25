/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1040.js'
], function (index) {

	'use strict';

	var serviceBearerZoom;

	serviceBearerZoom = function (bearerFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-bearer', [], 'dts/crm'),
			propertyFields : [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_portador', 'default': true},
				{ label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_portad_erp'},
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'),     property: 'num_id', type: 'integer'}
			],
			tableHeader	: [
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'),     property: 'num_id'},
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_portador'},
				{ label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_portad_erp'}
			],
			applyFilter : function (parameters) {

				var CRMControlBearerZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					filters = [{property: property, value: helper.parseStrictValue(value) }],
					i;

				bearerFactory.zoom(filters, options, function (result) {

					CRMControlBearerZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlBearerZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlBearerZoom.resultTotal = result[i].$length;
						}
						CRMControlBearerZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceBearerZoom.$inject = ['crm.crm_erp_portad.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_erp_portad.zoom', serviceBearerZoom);

});
