/*globals index, define*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1034.js'
], function (index) {

	'use strict';

	var serviceTicketPriorityZoom;

	serviceTicketPriorityZoom = function (ticketPriorityFactory, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-priority', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id', isDefault: true},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_priorid_ocor'}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_priorid_ocor'}
			],
			applyFilter : function (parameters) {

				var CRMControlTicketPriorityZoom = this,
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

				ticketPriorityFactory.zoom(filters, options, function (result) {

					CRMControlTicketPriorityZoom.resultTotal = 0;

					if (parameters.more !== true) { CRMControlTicketPriorityZoom.zoomResultList = []; }
					for (i = 0; i < result.length; i++) {

						if (result[i].$length) { CRMControlTicketPriorityZoom.resultTotal = result[i].$length; }

						CRMControlTicketPriorityZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	}; // serviceTicketPriorityZoom

	serviceTicketPriorityZoom.$inject = ['crm.crm_priorid_ocor.factory', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_priorid_ocor.zoom', serviceTicketPriorityZoom);

});
