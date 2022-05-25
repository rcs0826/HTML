/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1049.js'
], function (index) {

	'use strict';

	var serviceCfopZoom;

	serviceCfopZoom = function (cfopFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-cfop', [], 'dts/crm'),
			propertyFields : [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_natur_operac', 'default': true },
				{ label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_cfop_erp' },
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'),     property: 'num_id', type: 'integer'}
			],
			tableHeader	: [
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'),     property: 'num_id' },
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_natur_operac' },
				{ label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_cfop_erp' }
			],
			applyFilter : function (parameters) {

				var CRMControlCfopZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = { start: (parameters.more ? this.zoomResultList.length : 0) },
					filters = [{ property: property, value: helper.parseStrictValue(value) }],
					i;

				cfopFactory.zoom(filters, options, function (result) {

					CRMControlCfopZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlCfopZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlCfopZoom.resultTotal = result[i].$length;
						}
						CRMControlCfopZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceCfopZoom.$inject = ['crm.crm_erp_natur_operac.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_erp_natur_operac.zoom', serviceCfopZoom);

});
