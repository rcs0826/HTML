/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1007.js'
], function (index) {

	'use strict';

	var serviceOpportunityZoom;

	serviceOpportunityZoom = function (opportunityFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-opportunity', [], 'dts/crm'),
			propertyFields : [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'des_oportun_vda', 'default': true }
			],
			tableHeader	: [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'des_oportun_vda' }
			],
			applyFilter : function (parameters) {

				var CRMControlOpportunityZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = { start: (parameters.more ? this.zoomResultList.length : 0) },
					filters = [{ property: property, value: helper.parseStrictValue(value) }],
					i;

				opportunityFactory.zoom(filters, options, function (result) {

					CRMControlOpportunityZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlOpportunityZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlOpportunityZoom.resultTotal = result[i].$length;
						}
						CRMControlOpportunityZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceOpportunityZoom.$inject = ['crm.crm_oportun_vda.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_oportun_vda.zoom', serviceOpportunityZoom);

});
