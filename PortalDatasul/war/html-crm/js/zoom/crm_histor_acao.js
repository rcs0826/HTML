/*globals angular, index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1005.js'
], function (index) {

	'use strict';

	var serviceHistoryZoom;

	serviceHistoryZoom = function (historyFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('nav-history', [], 'dts/crm'),
			propertyFields : [
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id', 'default': true, type: 'integer' },
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'crm_acao.nom_acao' }
			],
			tableHeader	: [
				{ label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id' },
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_acao' }
			],
			applyFilter : function (parameters) {

				var CRMControlHistoryZoom = this,
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					filters = [],
					i;

				if (property === 'num_id') {
					value = value.toString().replace(/\D+/g, '');
					filters.push({property: property, value: value});
				} else {
					filters.push({property: property, value: helper.parseStrictValue(value) });
				}

				historyFactory.zoom(filters, options, function (result) {

					CRMControlHistoryZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlHistoryZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {

						if (result[i].ttAcao) {
							result[i].nom_acao = result[i].ttAcao.nom_acao;
						}

						if (result[i].$length) {
							CRMControlHistoryZoom.resultTotal = result[i].$length;
						}

						CRMControlHistoryZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceHistoryZoom.$inject = ['crm.crm_histor_acao.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_histor_acao.zoom', serviceHistoryZoom);

});
