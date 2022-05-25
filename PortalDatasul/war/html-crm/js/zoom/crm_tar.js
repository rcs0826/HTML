/*globals index, define*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1000.js'
], function (index) {

	'use strict';

	var serviceTaskZoom;

	serviceTaskZoom = function (taskFactory, helper, $rootScope) {
		return {
			zoomName : $rootScope.i18n('l-task', [], 'dts/crm'),
			propertyFields : [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id', 'default': true, type: 'integer'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'crm_acao.nom_acao'}
			],
			tableHeader	: [
				{label: $rootScope.i18n('l-code', [], 'dts/crm'), property: 'num_id'},
				{label: $rootScope.i18n('l-name', [], 'dts/crm'), property: 'nom_acao'}
			],
			applyFilter : function (parameters) {

				var CRMControlTaskZoom = this,
					filters = [],
					value = parameters.selectedFilterValue,
					property = parameters.selectedFilter.property,
					options = {start: (parameters.more ? this.zoomResultList.length : 0)},
					i;

				if (property === 'num_id') {
					value = value.toString().replace(/\D+/g, '');
					filters.push({property: property, value: value});
				} else {
					filters.push({property: property, value: helper.parseStrictValue(value)});
				}

				taskFactory.zoom(filters, options, function (result) {

					CRMControlTaskZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlTaskZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {

						if (result[i].ttAcao) {
							result[i].nom_acao = result[i].ttAcao.nom_acao;
						}

						if (result[i].$length) {
							CRMControlTaskZoom.resultTotal = result[i].$length;
						}

						CRMControlTaskZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceTaskZoom.$inject = ['crm.crm_tar.factory', 'crm.helper', '$rootScope'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_tar.zoom', serviceTaskZoom);

});
