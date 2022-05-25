/*globals index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1039.js'
], function (index) {

	'use strict';

	var serviceCarrierZoom;

	serviceCarrierZoom = function (carrierFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-carrier', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_transpdor', 'default': true },
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_transp_erp'},
				{label: $rootScope.i18n('l-code', [], 'dts/crm'),     property: 'num_id', type: 'integer'}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'),     property: 'num_id'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_transpdor'},
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_transp_erp'}
			],
			applyFilter : function (parameters) {

				var CRMControlCarrierZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					filters = [{property: property, value: helper.parseStrictValue(value)}],
					i;

				carrierFactory.zoom(filters, options, function (result) {

					CRMControlCarrierZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlCarrierZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlCarrierZoom.resultTotal = result[i].$length;
						}
						CRMControlCarrierZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceCarrierZoom.$inject = [
		'crm.crm_transpdor.factory', 'crm.helper', '$rootScope'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_transpdor.zoom', serviceCarrierZoom);

});
