/*globals index, define*/
define([
	'index',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js'
], function (index) {
	'use strict';

	index.stateProvider
		.state('dts/crm/history', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/history.start', {
			url: '/dts/crm/history/',
			controller: 'crm.history.list.control',
			controllerAs: 'controllerHistroyList',
			templateUrl: '/dts/crm/html/history/history.list.html'
		})
		.state('dts/crm/history.detail', {
			url: '/dts/crm/history/detail/:id',
			controller: 'crm.history.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/history/history.detail.html'
		})
		.state('dts/crm/history.new', {
			url: '/dts/crm/history/new',
			controller: 'crm.history.edit.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/history/history.edit.menu.html'
		});
});
