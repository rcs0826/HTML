/*globals angular, index, define, CRMUtil, $*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1108.js'
], function (index) {

	'use strict';

	var resourceZoom;

	resourceZoom = function ($rootScope, $filter, factory, helper) {
		return {
			zoomName : $rootScope.i18n('nav-resource', [], 'dts/crm'),
			propertyFields : [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_usuar', 'default': true },
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'),     property: 'cod_usuario' }

			],
			tableHeader	: [
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'),     property: 'cod_usuario' },
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_usuar' }
			],
			applyFilter : function (parameters) {

				var CRMControlResourceZoom = this,
					options,
					property,
					value,
					filters = [],
					i;

				options = { start: (parameters.more ? this.zoomResultList.length : 0)};
				property = parameters.selectedFilter.property;
				value = parameters.selectedFilterValue;

				if (!property || !value) {
					return;
				}

				filters.push({property: property, value: helper.parseStrictValue(value)});

				factory.zoom(filters, options, function (result) {
					CRMControlResourceZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlResourceZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {

						if (result[i].$length) {
							CRMControlResourceZoom.resultTotal = result[i].$length;
						}

						CRMControlResourceZoom.zoomResultList.push(result[i]);

					}
				});
			}
		};

	};

	resourceZoom.$inject = [
		'$rootScope', '$filter', 'crm.crm_recur.factory', 'crm.helper'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_recur.zoom', resourceZoom);
});
