/*globals index, define*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1032.js'
], function (index) {

	'use strict';

	var serviceTicketTypeZoom;

	serviceTicketTypeZoom = function (ticketTypeFactory, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-type', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id', isDefault: true},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_tip_ocor'}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_tip_ocor'}
			],
			applyFilter : function (parameters) {

				var CRMControlTicketTypeZoom = this,
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

				ticketTypeFactory.zoom(filters, options, function (result) {

					CRMControlTicketTypeZoom.resultTotal = 0;

					if (parameters.more !== true) { CRMControlTicketTypeZoom.zoomResultList = []; }
					for (i = 0; i < result.length; i++) {

						if (result[i].$length) { CRMControlTicketTypeZoom.resultTotal = result[i].$length; }

						CRMControlTicketTypeZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	}; // serviceTicketTypeZoom

	serviceTicketTypeZoom.$inject = ['crm.crm_tip_ocor.factory', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_tip_ocor.zoom', serviceTicketTypeZoom);

});
