/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1041.js'
], function (index) {

	'use strict';

	var servicePaymentConditionZoom;

	servicePaymentConditionZoom = function (paymentConditionFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-payment-condition', [], 'dts/crm'),
			propertyFields : [
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_cond_pagto', 'default': true },
				{ label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_cond_pagto_erp' },
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'),     property: 'num_id', type: 'integer'}
			],
			tableHeader	: [
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'),     property: 'num_id' },
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),     property: 'nom_cond_pagto' },
				{ label: $rootScope.i18n('l-code-erp', [], 'dts/crm'), property: 'cod_cond_pagto_erp' }
			],
			applyFilter : function (parameters) {

				var CRMControlPaymentConditionZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					filters = [],	
					i;

				if(property !== 'num_id') {
					filters = [{property: property, value: helper.parseStrictValue(value) }];
				} else  {
					filters = [{property: property, value: value }];
				}

				paymentConditionFactory.zoom(filters, options, function (result) {

					CRMControlPaymentConditionZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlPaymentConditionZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlPaymentConditionZoom.resultTotal = result[i].$length;
						}
						CRMControlPaymentConditionZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	servicePaymentConditionZoom.$inject = ['crm.crm_erp_cond_pagto.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_erp_cond_pagto.zoom', servicePaymentConditionZoom);

});
