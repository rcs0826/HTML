/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1069.js',
	'/dts/crm/html/campaign-type/campaign-type-services.edit.js',
	'/dts/crm/html/campaign-type/campaign-type-services.list.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/campaign-type', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/campaign-type.start', {
			url: '/dts/crm/campaign-type/',
			controller: 'crm.campaign-type.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/campaign-type/campaign-type.list.html'
		});
});
