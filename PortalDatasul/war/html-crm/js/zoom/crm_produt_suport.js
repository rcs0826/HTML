/*globals angular, index, define*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1112.js'
], function (index) {

	'use strict';

	var zoom;

	zoom = function (factory, helper, $filter, $rootScope) {

		return {
			zoomName : $rootScope.i18n('l-product-support', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_item_erp'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_produt', 'default': true}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_item_erp'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_produt'}
			],
			applyFilter : function (parameters) {

				var CRMControl = this,
					filters = [],
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = { start: (parameters.more ? this.zoomResultList.length : 0) },
					i;


				if (!property || !value) {
					return;
				}

				filters.push({property: 'custom.' + property, value: helper.parseStrictValue(value)});

				factory.zoom(filters, options, function (result) {
					var el = $('.modal-body-zoom').prev().find('.modal-title span');
					el.html('&nbsp;(0)');

					CRMControl.resultTotal = 0;
					el.html('&nbsp;(' + $filter('countPerPage')(0, 25, result.length) + ')');

					if (parameters.more !== true) {
						CRMControl.zoomResultList = [];
					}

					if (result) {
						for (i = 0; i < result.length; i++) {
							if (result[i].$length) {
								CRMControl.resultTotal = result[i].$length;
								el.html('&nbsp;(' + $filter('countPerPage')(result[i].$length, 25, result.length) + ')');
							}
							CRMControl.zoomResultList.push(result[i]);
						}
					}
				});
			}
		};

	};

	zoom.$inject = ['crm.crm_produt_suport.factory', 'crm.helper', '$filter', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_produt_suport.zoom', zoom);


});
