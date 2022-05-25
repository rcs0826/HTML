/*globals angular, index, define */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1068.js'
], function (index) {

	'use strict';

	var zoom;

	zoom = function ($rootScope, factory, helper, serviceLegend, $filter) {
		return {

			zoomName : $rootScope.i18n('l-script', [], 'dts/crm'),

			propertyFields : [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),  property: 'nom_script', 'default': true },
				{ label: $rootScope.i18n('l-type', [], 'dts/crm'),  property: 'idi_tip_script', propertyList: [
					{ id: 1, name: serviceLegend.scriptTypes.NAME(1) },
					{ id: 2, name: serviceLegend.scriptTypes.NAME(2) },
					{ id: 3, name: serviceLegend.scriptTypes.NAME(3) },
					{ id: 4, name: serviceLegend.scriptTypes.NAME(4) },
					{ id: 5, name: serviceLegend.scriptTypes.NAME(5) },
					{ id: 6, name: serviceLegend.scriptTypes.NAME(6) },
					{ id: 7, name: serviceLegend.scriptTypes.NAME(7) }
				]}],

			columnDefs : [{
				headerName: $rootScope.i18n('l-name', [], 'dts/crm'),
				field: 'nom_script'
			}, {
				headerName: $rootScope.i18n('l-type', [], 'dts/crm'),
				field: 'idi_tip_script',
				valueGetter: function (params) {
					return serviceLegend.scriptTypes.NAME(params.data.idi_tip_script);
				}
			}, {
				headerName: $rootScope.i18n('l-expiration-date', [], 'dts/crm'),
				field: 'val_inic_valid',
				valueGetter: function (params) {
					return $filter('date')(params.data.val_inic_valid, $rootScope.i18n('l-date-format', [], 'dts/crm')).toString() + " - " +
						$filter('date')(params.data.val_fim_valid, $rootScope.i18n('l-date-format', [], 'dts/crm')).toString();
				}
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

				if (property === 'nom_script') {
					value = helper.parseStrictValue(value);
				} else if (property === 'idi_tip_script') {
					value = value.id;
				} else {
					value = value.toString().replace(/\D+/g, '');
				}

				filters = [{ property: property, value: value }];

				if (angular.isArray(parameters.init)) {
					filters = filters.concat(parameters.init);
				}

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

	zoom.$inject = ['$rootScope', 'crm.crm_script.factory', 'crm.helper', 'crm.legend', '$filter'];

	// ########################################################
	// ### Register
	// ########################################################


	index.register.factory('crm.crm_script.zoom', zoom);

});
