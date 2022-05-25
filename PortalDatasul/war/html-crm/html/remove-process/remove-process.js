/*globals define*/

define([
	'index',
	'/dts/crm/html/remove-process/remove-process-services.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/remove-process', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/crm/remove-process.start', {
			url: '/dts/crm/remove-process/',
			controller: 'crm.remove-process.control',
			controllerAs: 'controllerRemoveProcess',
			templateUrl: '/dts/crm/html/remove-process/remove-process.list.html'
		})
		.state('dts/crm/remove-process.task', {
			url: '/dts/crm/remove-process/task',
			controller: 'crm.remove-process.control',
			controllerAs: 'controllerRemoveProcess',
			templateUrl: '/dts/crm/html/remove-process/remove-process.list.html'
		});
});
