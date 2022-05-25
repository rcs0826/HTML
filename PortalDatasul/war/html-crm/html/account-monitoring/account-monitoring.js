/*globals define */
define([
	'index',
	'/dts/crm/html/account-monitoring/account-monitoring-services.edit.js',
	'/dts/crm/html/account-monitoring/account-monitoring-services.list.js',
	'/dts/crm/html/account-monitoring/account-monitoring-services.detail.js'
], function (index) {

	'use strict';

	index.stateProvider
		.state('dts/crm/account-monitoring', {
			'abstract': true,
			template: '<ui-view/>'
		})
		.state('dts/crm/account-monitoring.start', {
			url: '/dts/crm/account-monitoring/',
			controller: 'crm.account-monitoring.list.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/account-monitoring/account-monitoring.list.html'
		})
		.state('dts/crm/account-monitoring.detail', {
			url: '/dts/crm/account-monitoring/detail/:id',
			controller: 'crm.account-monitoring.detail.control',
			controllerAs: 'controller',
			templateUrl: '/dts/crm/html/account-monitoring/account-monitoring.detail.html'
		});
});
