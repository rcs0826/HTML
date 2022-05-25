/*globals index, define*/
define([
    'index',
    '/dts/crm/html/ticket-priority/ticket-priority-services.list.js',
    '/dts/crm/html/ticket-priority/ticket-priority-services.edit.js',
    '/dts/crm/html/ticket-priority/ticket-priority-services.detail.js'
], function (index) {
    'use strict';
    
    index.stateProvider
		.state('dts/crm/ticket-priority', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/ticket-priority.start', {
			url: '/dts/crm/ticket-priority/',
			controller: 'crm.ticket-priority.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/ticket-priority/ticket-priority.list.html'
		})
		.state('dts/crm/ticket-priority.detail', {
			url: '/dts/crm/ticket-priority/detail/:id',
			controller: 'crm.ticket-priority.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/ticket-priority/ticket-priority.detail.html'
		});
});

