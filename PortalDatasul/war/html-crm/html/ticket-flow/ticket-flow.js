/*globals index, define */
define([
	'index',
	'/dts/crm/js/api/fchcrm1036.js',
	'/dts/crm/html/ticket-flow/ticket-flow-services.list.js',
	'/dts/crm/html/ticket-flow/ticket-flow-services.edit.js',
	'/dts/crm/html/ticket-flow/ticket-flow-services.detail.js',
	'/dts/crm/html/ticket-flow/ticket-flow-services.advanced-search.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/ticket-flow', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/ticket-flow.start', {
			url: '/dts/crm/ticket-flow/',
			controller: 'crm.ticket-flow.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/ticket-flow/ticket-flow.list.html'
		})
		.state('dts/crm/ticket-flow.detail', {
			url: '/dts/crm/ticket-flow/detail/:id',
			controller: 'crm.ticket-flow.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/ticket-flow/ticket-flow.detail.html'
		});
});
