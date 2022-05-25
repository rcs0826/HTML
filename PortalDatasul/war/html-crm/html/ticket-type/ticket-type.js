/*globals index, define*/
define([
	'index',
	'/dts/crm/html/ticket-type/ticket-type-services.list.js',
	'/dts/crm/html/ticket-type/ticket-type-services.edit.js',
	'/dts/crm/html/ticket-type/ticket-type-services.detail.js',
	'/dts/crm/html/ticket-type/ticket-type-services.advanced-search.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/ticket-type', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/ticket-type.start', {
			url: '/dts/crm/ticket-type/',
			controller: 'crm.ticket-type.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/ticket-type/ticket-type.list.html'
		})
		.state('dts/crm/ticket-type.detail', {
			url: '/dts/crm/ticket-type/detail/:id',
			controller: 'crm.ticket-type.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/ticket-type/ticket-type.detail.html'
		});
});
