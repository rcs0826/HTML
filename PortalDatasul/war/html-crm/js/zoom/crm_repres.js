/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1014.js'
], function (index) {

	'use strict';

	var serviceRepresentativeZoom;


	serviceRepresentativeZoom = function (representativeFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-seller', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),  property: 'nom_repres', 'default': true},
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'),  property: 'cod_repres_erp'},
				{label: $rootScope.i18n('l-nick-name', [], 'dts/crm'),  property: 'nom_abrev_repres_erp'}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'),  property: 'cod_repres_erp'},
				{label: $rootScope.i18n('l-nick-name', [], 'dts/crm'),  property: 'nom_abrev_repres_erp'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),  property: 'nom_repres'}
			],
			applyFilter : function (parameters) {

				var CRMControlRepresentativeZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					filters = [],
					options = { start: (parameters.more ? this.zoomResultList.length : 0) },
					i;

				filters.push({property: property, value: helper.parseStrictValue(value) });

				representativeFactory.zoom(filters, options, function (result) {

					CRMControlRepresentativeZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlRepresentativeZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlRepresentativeZoom.resultTotal = result[i].$length;
						}
						CRMControlRepresentativeZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceRepresentativeZoom.$inject = ['crm.crm_repres.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_repres.zoom', serviceRepresentativeZoom);

});
