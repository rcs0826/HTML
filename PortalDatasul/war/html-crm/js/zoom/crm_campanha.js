/*globals index, define*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1001.js'
], function (index) {

	'use strict';

	var serviceCampaignZoom;

	serviceCampaignZoom = function (campaignFactory, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-campaign', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id', isDefault: true},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_campanha'}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_campanha'}
			],
			applyFilter : function (parameters) {

				var CRMControlCampaignZoom = this,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					property = parameters.selectedFilter.property,
					value = parameters.selectedFilterValue,
					filters = [],
					i;

				if (property === 'num_id') {
					//value = value.toString().replace(/[^0-9]/g, '');
					value = value.toString().replace(/d+/, '');
					filters.push({property: property, value: value});
				} else {
					filters.push({property: property, value: '*' + value + '*'});
				}

				campaignFactory.zoom(filters, options, function (result) {

					CRMControlCampaignZoom.resultTotal = 0;

					if (parameters.more !== true) { CRMControlCampaignZoom.zoomResultList = []; }
					for (i = 0; i < result.length; i++) {

						if (result[i].$length) { CRMControlCampaignZoom.resultTotal = result[i].$length; }

						CRMControlCampaignZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	}; // serviceCampaignZoom

	serviceCampaignZoom.$inject = ['crm.crm_campanha.factory', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_campanha.zoom', serviceCampaignZoom);

});
