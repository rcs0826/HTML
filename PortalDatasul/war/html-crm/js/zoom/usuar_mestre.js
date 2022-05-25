/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1087.js'
], function (index) {

	'use strict';

	var serviceMasterUserZoom;


	serviceMasterUserZoom = function (masterUserFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-user', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),  property: 'nom_usuario', 'default': true},
				{label: $rootScope.i18n('l-code', [], 'dts/crm'),  property: 'cod_usuario'}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'),  property: 'cod_usuario'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),  property: 'nom_usuario'}
			],
			applyFilter : function (parameters) {

				var CRMControlRepresentativeZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					filters = [],
					options = { start: (parameters.more ? this.zoomResultList.length : 0) },
					i;

				filters.push({property: property, value: helper.parseStrictValue(value) });

				masterUserFactory.zoom(filters, options, function (result) {

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

	serviceMasterUserZoom.$inject = ['crm.usuar_mestre.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.usuar_mestre.zoom', serviceMasterUserZoom);

});
