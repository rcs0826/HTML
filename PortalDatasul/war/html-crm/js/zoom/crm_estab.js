/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1086.js'
], function (index) {

	'use strict';

	var serviceEstablishmentZoom;


	serviceEstablishmentZoom = function (establishmentFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-establishment', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),  property: 'nom_estab'},
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'),  property: 'cod_estab_erp', 'default': true}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'),  property: 'cod_estab_erp'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),  property: 'nom_estab'}
			],
			applyFilter : function (parameters) {

				var CRMControlEstablishmentZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					filters = [],
					options = { start: (parameters.more ? this.zoomResultList.length : 0) },
					i;

					filters.push({property: property, value: helper.parseStrictValue(value) });

				establishmentFactory.zoom(filters, options, function (result) {

					CRMControlEstablishmentZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlEstablishmentZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlEstablishmentZoom.resultTotal = result[i].$length;
						}
						CRMControlEstablishmentZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceEstablishmentZoom.$inject = ['crm.crm_estab.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_estab.zoom', serviceEstablishmentZoom);

});
