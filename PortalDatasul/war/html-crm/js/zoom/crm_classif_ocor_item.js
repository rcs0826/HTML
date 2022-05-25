/*globals angular, index, define, CRMUtil, $*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1075.js'
], function (index) {

	'use strict';

	var serviceClassificationItemZoom;

	serviceClassificationItemZoom = function ($rootScope, $filter, classificationItemFactory) {
		return {
			zoomName : $rootScope.i18n('l-product', [], 'dts/crm'),
			advancedSearch: true,
			propertyFields : [
				{label: $rootScope.i18n('l-name', [], 'dts/crm'),            property: 'nom_produt', 'default': true },
				{label: $rootScope.i18n('l-code-erp', [], 'dts/crm'),        property: 'cod_item_erp'},
				{label: $rootScope.i18n('l-material-family', [], 'dts/crm'), property: 'num_id_familia'},
				{label: $rootScope.i18n('l-business-family', [], 'dts/crm'), property: 'num_id_fc'},
				{label: $rootScope.i18n('l-stock-group', [], 'dts/crm'),     property: 'num_id_grp_estoq'},
				{label: $rootScope.i18n('l-auxiliary-code', [], 'dts/crm'),  property: 'cod_aux_produt'}
			],
			columnDefs: [
				{headerName: $rootScope.i18n('l-code-erp', [], 'dts/crm'),			field: 'cod_item_erp',			width: 100},
				{headerName: $rootScope.i18n('l-name', [], 'dts/crm'),				field: 'nom_produt',			width: 250},
				{headerName: $rootScope.i18n('l-material-family', [], 'dts/crm'),	field: 'nom_familia',			width: 170},
				{headerName: $rootScope.i18n('l-business-family', [], 'dts/crm'),	field: 'nom_familia_comerc',	width: 170},
				{headerName: $rootScope.i18n('l-stock-group', [], 'dts/crm'),		field: 'nom_grp_estoq',			width: 170},
				{headerName: $rootScope.i18n('l-auxiliary-code', [], 'dts/crm'),	field: 'cod_aux_produt',		width: 170}
			],
			applyFilter : function (parameters) {
				var CRMControlClassificationZoom = this,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					property = parameters.isAdvanced ? undefined : parameters.selectedFilter.property,
					value    = parameters.isAdvanced ? undefined : parameters.selectedFilterValue,
					filters = [],
					j,
					i;

				if (angular.isFunction(parameters.init)) {
					parameters.init = parameters.init();
				}

				if (parameters.init && parameters.init.num_id_classif_ocor && parameters.init.num_id_classif_ocor > 0) {
					filters.push({ property: 'crm_classif_ocor_item.num_id_classif_ocor', value: parameters.init.num_id_classif_ocor});
				}

				if (parameters.isAdvanced) {
					for (j = 0; j < parameters.disclaimers.length; j++) {
						if (CRMUtil.isDefined(parameters.disclaimers[j].value)) {
							if (parameters.disclaimers[j].property === 'cod_aux_produt') {
								filters.push({ property: 'custom.cod_aux_produt', value: "*" + parameters.disclaimers[j].value + "*"});
							} else if (parameters.disclaimers[j].property === 'num_id_familia') {
								filters.push({ property: 'custom.num_id_familia', value: "*" + parameters.disclaimers[j].value + "*"});
							} else if (parameters.disclaimers[j].property === 'num_id_fc') {
								filters.push({ property: 'custom.num_id_fc', value: "*" + parameters.disclaimers[j].value + "*"});
							} else if (parameters.disclaimers[j].property === 'num_id_grp_estoq') {
								filters.push({ property: 'custom.num_id_grp_estoq', value: "*" + parameters.disclaimers[j].value + "*"});
							} else {
								filters.push({ property: parameters.disclaimers[j].property, value: "*" + parameters.disclaimers[j].value + "*"});
							}
						}
					}
				} else {
					if (property === 'cod_aux_produt') {
						filters.push({ property: 'custom.cod_aux_produt', value: value});
					} else if (property === 'num_id_familia') {
						filters.push({ property: 'custom.num_id_familia', value: value});
					} else if (property === 'num_id_fc') {
						filters.push({ property: 'custom.num_id_fc', value: value});
					} else if (property === 'num_id_grp_estoq') {
						filters.push({ property: 'custom.num_id_grp_estoq', value: value});
					} else {
						filters.push({property: property, value: "*" + value + "*"});
					}
				}

				classificationItemFactory.zoom(filters, options, function (result) {
					var el = $('.modal-body-zoom').prev().find('.modal-title span');
					el.html('&nbsp;(0)');

					CRMControlClassificationZoom.resultTotal = 0;

					if (parameters.more !== true) { CRMControlClassificationZoom.zoomResultList = []; }

					for (i = 0; i < result.length; i++) {
						if (result[i].$length) {
							CRMControlClassificationZoom.resultTotal = result[i].$length;
							el.html('&nbsp;(' + $filter('countPerPage')(result[i].$length, 25, result.length) + ')');
						}

						CRMControlClassificationZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	}; // serviceClassificationItemZoom

	serviceClassificationItemZoom.$inject = ['$rootScope', '$filter', 'crm.crm_classif_ocor_item.factory'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_classif_ocor_item.zoom', serviceClassificationItemZoom);

});

