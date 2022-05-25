/*globals angular, index, define,*/
/*jslint plusplus: true, regexp: true*/
define([
	'index',
	'/dts/crm/js/api/fchcrm1024.js'
], function (index) {

	'use strict';
	var servicePhoneTypeZoom;

	servicePhoneTypeZoom = function (phoneTypeFactory, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-phone-type', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id', type: 'integer'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_tip_telef', 'default': true}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_tip_telef'}
			],
			applyFilter : function (parameters) {

				var CRMControlPhoneTypeZoom = this,
					property = parameters.selectedFilter.property,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					filters = [],
					value = parameters.selectedFilterValue,
					i;

				if (property === 'num_id') {
					value = value.toString().replace(/[^0-9]/g, '');
					filters.push({property: property, value: value});
				} else {
					filters.push({property: property, value: '*' + value + '*'});
				}

				phoneTypeFactory.zoom(filters, options, function (result) {

					CRMControlPhoneTypeZoom.resultTotal = 0;

					if (parameters.more !== true) { CRMControlPhoneTypeZoom.zoomResultList = []; }

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) { CRMControlPhoneTypeZoom.resultTotal = result[i].$length; }
						CRMControlPhoneTypeZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	}; // servicePhoneTypeZoom

	servicePhoneTypeZoom.$inject = ['crm.crm_tip_telef.factory', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_tip_telef.zoom', servicePhoneTypeZoom);

});
