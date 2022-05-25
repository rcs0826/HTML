/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1006.js'
], function (index) {

	'use strict';

	var serviceTicketZoom;

	serviceTicketZoom = function (ticketFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('tab-support', [], 'dts/crm'),
			propertyFields : [
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'cod_livre_1', 'default': true },
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_ocor' }
			],
			tableHeader	: [
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'cod_livre_1' },
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_ocor' }
			],
			applyFilter : function (parameters) {

				var CRMControlTicketZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					filters = [],
					i;

				if (property === 'num_id' || property === 'cod_livre_1') {
					value = value.toString().replace(/\D+/g, '');
					filters.push({property: property, value: value});
				} else {
					filters.push({property: property, value: helper.parseStrictValue(value) });
				}

				ticketFactory.zoom(filters, options, function (result) {

					CRMControlTicketZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlTicketZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlTicketZoom.resultTotal = result[i].$length;
						}
						CRMControlTicketZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceTicketZoom.$inject = ['crm.crm_ocor.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_ocor.zoom', serviceTicketZoom);

});
