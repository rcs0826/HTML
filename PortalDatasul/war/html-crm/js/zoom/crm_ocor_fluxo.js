/*globals index, define*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1036.js'
], function (index) {

	'use strict';

	var serviceTicketFlowZoom;

	serviceTicketFlowZoom = function (ticketFlowFactory, $rootScope) {

		return {
			zoomName : $rootScope.i18n('l-flow', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id', isDefault: true},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_ocor_fluxo'}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_ocor_fluxo'}
			],
			applyFilter : function (parameters) {

				var CRMControlTicketFlowZoom = this,
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

				ticketFlowFactory.zoom(filters, options, function (result) {

					CRMControlTicketFlowZoom.resultTotal = 0;

					if (parameters.more !== true) { CRMControlTicketFlowZoom.zoomResultList = []; }

					for (i = 0; i < result.length; i++) {

						if (result[i].$length) { CRMControlTicketFlowZoom.resultTotal = result[i].$length; }

						CRMControlTicketFlowZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};

	}; // serviceTicketFlowZoom

	serviceTicketFlowZoom.$inject = ['crm.crm_ocor_fluxo.factory', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_ocor_fluxo.zoom', serviceTicketFlowZoom);

});
