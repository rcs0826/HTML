/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1046.js'
], function (index) {

	'use strict';

	var serviceUserGroupZoom;


	serviceUserGroupZoom = function (userGroupFactory, helper, $rootScope) {

		return {
			zoomName : $rootScope.i18n('l-group', [], 'dts/crm'),
			propertyFields : [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),  property: 'nom_grp_usuar', 'default': true }
			],
			tableHeader	: [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),  property: 'nom_grp_usuar' }
			],
			applyFilter : function (parameters) {

				var CRMControlUserGroupZoom = this,
					property = parameters.selectedFilter.property,
					value = parameters.selectedFilterValue,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					filters = [{ property: property, value: helper.parseStrictValue(value) } ],
					i;

				userGroupFactory.zoom(filters, options, function (result) {

					CRMControlUserGroupZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlUserGroupZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlUserGroupZoom.resultTotal = result[i].$length;
						}
						CRMControlUserGroupZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceUserGroupZoom.$inject = ['crm.crm_grp_usuar.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_grp_usuar.zoom', serviceUserGroupZoom);

});
