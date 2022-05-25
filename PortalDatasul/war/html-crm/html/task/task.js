/*globals index, define, */

define([
	'index',
	'/dts/crm/html/task/task-services.advanced-search.js',
	'/dts/crm/html/task/task-services.calendar.js',
	'/dts/crm/html/task/task-services.detail.js',
	'/dts/crm/html/task/task-services.edit.js',
	'/dts/crm/html/task/task-services.list.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/task', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/task.start', {
			url: '/dts/crm/task/',
			controller: 'crm.task.list.control',
			controllerAs: 'controllerTaskList',
			templateUrl: '/dts/crm/html/task/task.list.html'
		})
		.state('dts/crm/task.detail', {
			url: '/dts/crm/task/detail/:id',
			controller: 'crm.task.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/task/task.detail.html'
		})
		.state('dts/crm/task.calendar', {
			url: '/dts/crm/task/calendar',
			controller: 'crm.task.list.control',
			controllerAs: 'controllerTaskList',
			templateUrl: '/dts/crm/html/task/task.calendar.html'
		})
		.state('dts/crm/task.new', {
			url: '/dts/crm/task/new',
			controller: 'crm.task.edit.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/task/task.edit.menu.html'
		});
});
