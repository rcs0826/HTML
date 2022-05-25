/*globals index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1100.js'
], function (index) {

	'use strict';

	var service;

	service = function (factory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-resource-level', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_niv_recur', 'default': true }
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_niv_recur'}
			],
			applyFilter : function (parameters) {

				var CRMControl = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					filters = [{property: property, value: helper.parseStrictValue(value)}],
					i;

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

	service.$inject = [
		'crm.crm_niv_recur.factory', 'crm.helper', '$rootScope'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_niv_recur.zoom', service);

});
