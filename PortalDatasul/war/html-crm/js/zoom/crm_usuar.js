/*globals angular, index, define,*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js'
], function (index) {

	'use strict';

	var serviceUserZoom;

	serviceUserZoom = function ($rootScope, userFactory, helper) {

		return {
			zoomName : $rootScope.i18n('l-user', [], 'dts/crm'),

			propertyFields : [
				{label: $rootScope.i18n('l-user-login', [], 'dts/crm'), property: 'cod_usuario', 'default': true},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),       property: 'nom_usuar'},
				{label: $rootScope.i18n('l-email', [], 'dts/crm'),      property: 'nom_email'}
			],

			tableHeader	: [
				{label: $rootScope.i18n('l-user-login', [], 'dts/crm'), property: 'cod_usuario'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),       property: 'nom_usuar'}
			],

			applyFilter : function (parameters) {

				var CRMControlUserZoom = this,
					options,
					property,
					value,
					filters = [],
					i;

				options = {start: (parameters.more ? this.zoomResultList.length : 0)};

				property = parameters.selectedFilter.property;
				value = parameters.selectedFilterValue;

				filters.push({property: property, value: helper.parseStrictValue(value)});

				if (angular.isFunction(parameters.init)) {
					parameters.init = parameters.init();
				}

				if (parameters.init && parameters.init.subordinate === true) {
					filters.push({ property: 'custom.subordinate', value: true });
				}

				if (parameters.init && parameters.init.num_id_grp_usuar && parameters.init.num_id_grp_usuar > 0) {
					filters.push({ property: 'crm_grp_usuar_usuar.num_id_grp_usuar', value: parameters.init.num_id_grp_usuar });
				}

				userFactory.zoom(filters, options, function (result) {

					CRMControlUserZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlUserZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {

						if (result[i].$length) {
							CRMControlUserZoom.resultTotal = result[i].$length;
						}

						CRMControlUserZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceUserZoom.$inject = [
		'$rootScope', 'crm.crm_usuar.factory', 'crm.helper'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_usuar.zoom', serviceUserZoom);

});
