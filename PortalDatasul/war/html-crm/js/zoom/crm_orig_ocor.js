/*globals index, define*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1035.js'
], function (index) {

	'use strict';

	var serviceTicketOriginsZoom;

	serviceTicketOriginsZoom = function (ticketOriginsFactory, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-origin', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id', isDefault: true},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_orig_ocor'}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_orig_ocor'}
			],
			applyFilter : function (parameters) {

				var CRMControlTicketOriginsZoom = this,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					property = parameters.selectedFilter.property,
					value = parameters.selectedFilterValue,
					filters = [],
					i;

				if (property === 'num_id') {
					value = value.toString().replace(/d+/, '');
					filters.push({property: property, value: value});
				} else {
					filters.push({property: property, value: '*' + value + '*'});
				}

				ticketOriginsFactory.zoom(filters, options, function (result) {

					CRMControlTicketOriginsZoom.resultTotal = 0;

					if (parameters.more !== true) { CRMControlTicketOriginsZoom.zoomResultList = []; }

					for (i = 0; i < result.length; i++) {

						if (result[i].$length) { CRMControlTicketOriginsZoom.resultTotal = result[i].$length; }

						CRMControlTicketOriginsZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	}; // serviceTicketOriginsZoom

	serviceTicketOriginsZoom.$inject = ['crm.crm_orig_ocor.factory', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_orig_ocor.zoom', serviceTicketOriginsZoom);

});
