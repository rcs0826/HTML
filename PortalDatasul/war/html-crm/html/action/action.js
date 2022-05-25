/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1070.js',
	'/dts/crm/html/action/action-services.edit.js',
	'/dts/crm/html/action/action-services.list.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/action', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/action.start', {
			url: '/dts/crm/action/',
			controller: 'crm.action.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/action/action.list.html'
		});
});
