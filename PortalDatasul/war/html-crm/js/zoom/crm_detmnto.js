/*globals angular, index, define */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1074.js'
], function (index) {

	'use strict';

	var zoom;

	zoom = function ($rootScope, factory, helper) {
		return {

			zoomName : $rootScope.i18n('l-detail', [], 'dts/crm'),

			propertyFields : [{
				label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_detmnto_restdo', 'default': true
			}],

			columnDefs : [{
				headerName: $rootScope.i18n('l-name', [], 'dts/crm'),
				field: 'nom_detmnto_restdo'
			}],

			applyFilter : function (parameters) {

				var CRMControl = this,
					options,
					property,
					value,
					filters,
					i;

				options = { start: (parameters.more ? CRMControl.zoomResultList.length : 0) };

				property = parameters.selectedFilter.property;
				value = parameters.selectedFilterValue || '*';

				if (property === 'num_id') {
					value = value.toString().replace(/\D+/g, '');
				} else {
					value = helper.parseStrictValue(value);
				}

				filters = [{ property: property, value: value }];

				factory.zoom(filters, options, function (result) {

					CRMControl.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControl.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {

						if (result[i].$length) {
							CRMControl.resultTotal = result[i].$length;
						}

						CRMControl.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	zoom.$inject = ['$rootScope', 'crm.crm_detmnto.factory', 'crm.helper'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_detmnto.zoom', zoom);

});
