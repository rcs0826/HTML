/*globals index, define*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1084.js'
], function (index) {

	'use strict';

	var serviceCauseZoom;

	serviceCauseZoom = function (causeFactory, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-cause-ticket', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_causa', 'default': true}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_causa'}
			],
			applyFilter : function (parameters) {

				var CRMControlCauseZoom = this,
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

				causeFactory.zoom(filters, options, function (result) {

					CRMControlCauseZoom.resultTotal = 0;

					if (parameters.more !== true) { CRMControlCauseZoom.zoomResultList = []; }
					for (i = 0; i < result.length; i++) {

						if (result[i].$length) { CRMControlCauseZoom.resultTotal = result[i].$length; }

						CRMControlCauseZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	}; // serviceCauseZoom

	serviceCauseZoom.$inject = ['crm.crm_causa_ocor.factory', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_causa_ocor.zoom', serviceCauseZoom);

});
